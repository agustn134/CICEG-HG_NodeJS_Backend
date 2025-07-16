// src/controllers/configuracion.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../config/database';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// Extender el tipo Request para incluir file
interface MulterFileRequest extends Request {
  file?: Express.Multer.File;
}

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = path.join(__dirname, '../../public/uploads/logos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const tipo = req.body.tipo;
    const extension = path.extname(file.originalname);
    const nombreArchivo = `${tipo}-${Date.now()}${extension}`;
    cb(null, nombreArchivo);
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/x-icon'];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

// Obtener configuración de logos
export const getConfiguracionLogos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT parametro, valor 
      FROM configuracion_sistema 
      WHERE parametro IN (
        'logo_principal', 'logo_sidebar', 'favicon', 'logo_gobierno',
        'nombre_hospital', 'nombre_dependencia', 'color_primario', 'color_secundario'
      )
    `;
    
    const result: QueryResult = await pool.query(query);
    
    // Convertir array a objeto
    const configuracion = result.rows.reduce((acc: any, row: any) => {
      acc[row.parametro] = row.valor;
      return acc;
    }, {});
    
    // Valores por defecto si no existen
    const configDefault = {
      logo_principal: '/uploads/logos/logo-principal.png',
      logo_sidebar: '/uploads/logos/logo-sidebar.png',
      favicon: '/uploads/logos/favicon.ico',
      logo_gobierno: '/uploads/logos/logo-gobierno.png',
      nombre_hospital: 'Hospital General San Luis de la Paz',
      nombre_dependencia: 'Secretaría de Salud de Guanajuato',
      color_primario: '#1e40af',
      color_secundario: '#3b82f6',
      ...configuracion
    };
    
    return res.status(200).json(configDefault);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener configuración'
    });
  }
};

// Actualizar configuración
export const actualizarConfiguracion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nombre_hospital, nombre_dependencia, color_primario, color_secundario } = req.body;
    
    const configuraciones = [
      { parametro: 'nombre_hospital', valor: nombre_hospital },
      { parametro: 'nombre_dependencia', valor: nombre_dependencia },
      { parametro: 'color_primario', valor: color_primario },
      { parametro: 'color_secundario', valor: color_secundario }
    ];
    
    for (const config of configuraciones) {
      if (config.valor) {
        await pool.query(`
          INSERT INTO configuracion_sistema (parametro, valor, descripcion, fecha_modificacion)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          ON CONFLICT (parametro) 
          DO UPDATE SET valor = $2, fecha_modificacion = CURRENT_TIMESTAMP
        `, [config.parametro, config.valor, `Configuración de ${config.parametro}`]);
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Configuración actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar configuración'
    });
  }
};

// Subir logo
export const subirLogo = async (req: MulterFileRequest, res: Response): Promise<Response> => {
  try {
    const { tipo } = req.body;
    const archivo = req.file;
    
    if (!archivo) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo'
      });
    }
    
    const rutaArchivo = `/uploads/logos/${archivo.filename}`;
    const parametro = `logo_${tipo}`;
    
    // Guardar ruta en base de datos
    await pool.query(`
      INSERT INTO configuracion_sistema (parametro, valor, descripcion, fecha_modificacion)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (parametro) 
      DO UPDATE SET valor = $2, fecha_modificacion = CURRENT_TIMESTAMP
    `, [parametro, rutaArchivo, `Logo ${tipo} del sistema`]);
    
    return res.status(200).json({
      success: true,
      message: 'Logo subido correctamente',
      data: {
        parametro,
        ruta: rutaArchivo
      }
    });
  } catch (error) {
    console.error('Error al subir logo:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al subir logo'
    });
  }
};