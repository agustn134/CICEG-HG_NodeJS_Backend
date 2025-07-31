// src/controllers/configuracion.controller.ts (VERSIÓN MEJORADA)
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../config/database';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

interface MulterFileRequest extends Request {
  file?: Express.Multer.File;
}

class LogoManagerService {
  private uploadsDir: string;
  private defaultLogos: { [key: string]: string };
  private importedLogos: { [key: string]: string };

  constructor() {
    this.uploadsDir = path.join(__dirname, '../../public/uploads/logos');
    this.defaultLogos = {
      principal: 'logo-principal-default.svg',
      sidebar: 'logo-sidebar-default.svg', 
      gobierno: 'logo-gobierno-default.svg',
      favicon: 'favicon.ico'
    };
    this.importedLogos = {
      principal: 'logo-principal-importado',
      sidebar: 'logo-sidebar-importado',
      gobierno: 'logo-gobierno-importado', 
      favicon: 'favicon-importado'
    };
  }

  async subirLogoInteligente(archivo: Express.Multer.File, tipo: string): Promise<string> {
    try {
      // 1. Generar nuevo nombre estandarizado
      const extension = path.extname(archivo.originalname);
      const nuevoNombre = `${this.importedLogos[tipo]}${extension}`;
      const rutaCompleta = path.join(this.uploadsDir, nuevoNombre);
      
      // 2. Eliminar logo importado anterior si existe
      await this.eliminarLogoImportadoAnterior(tipo);
      
      // 3. Guardar nuevo archivo con nombre estándar
      fs.writeFileSync(rutaCompleta, archivo.buffer);
      
      console.log(`✅ Logo ${tipo} guardado como: ${nuevoNombre}`);
      
      // 4. Retornar ruta para la BD
      return `/uploads/logos/${nuevoNombre}`;
      
    } catch (error) {
      console.error('Error al subir logo:', error);
      throw error;
    }
  }

  private async eliminarLogoImportadoAnterior(tipo: string): Promise<void> {
    try {
      if (!fs.existsSync(this.uploadsDir)) return;
      
      const archivos = fs.readdirSync(this.uploadsDir);
      const patronAnterior = new RegExp(`^${this.importedLogos[tipo]}\\.(svg|png|jpg|jpeg|ico)$`, 'i');
      
      for (const archivo of archivos) {
        if (patronAnterior.test(archivo)) {
          const rutaArchivo = path.join(this.uploadsDir, archivo);
          fs.unlinkSync(rutaArchivo);
          console.log(`🗑️ Logo anterior eliminado: ${archivo}`);
        }
      }
    } catch (error) {
      console.warn('Advertencia al eliminar logo anterior:', error);
    }
  }

  async restaurarDefault(tipo: string): Promise<string> {
    // Eliminar importado y usar default
    await this.eliminarLogoImportadoAnterior(tipo);
    return `/uploads/logos/${this.defaultLogos[tipo]}`;
  }

  verificarArchivo(ruta: string, fallback: string): string {
    if (!ruta) return fallback;
    
    const rutaCompleta = path.join(__dirname, '../../public', ruta);
    if (fs.existsSync(rutaCompleta)) {
      return ruta;
    }
    
    // Intentar versión SVG si no existe PNG
    const rutaSvg = ruta.replace(/\.(png|jpg|jpeg)$/i, '.svg');
    const rutaSvgCompleta = path.join(__dirname, '../../public', rutaSvg);
    if (fs.existsSync(rutaSvgCompleta)) {
      return rutaSvg;
    }
    
    return fallback;
  }
}

// Instancia del manager
const logoManager = new LogoManagerService();

// 🔥 CONFIGURACIÓN DE MULTER MEJORADA
const storage = multer.memoryStorage(); // Usar memoria para mayor control

export const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB máximo
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // 🔥 ARREGLO: Verificar si tipo existe antes de validar
    const tipo = req.body?.tipo;
    
    if (!tipo) {
      console.warn('Tipo no especificado, permitiendo subida temporal');
      cb(null, true); // Permitir temporalmente
      return;
    }
    
    const tiposPermitidos = {
      principal: ['image/jpeg', 'image/png', 'image/svg+xml'],
      sidebar: ['image/jpeg', 'image/png', 'image/svg+xml'],
      gobierno: ['image/jpeg', 'image/png', 'image/svg+xml'],
      favicon: ['image/x-icon', 'image/png', 'image/svg+xml']
    };
    
    const tiposValidos = tiposPermitidos[tipo as keyof typeof tiposPermitidos] || [];
    
    if (tiposValidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const extensiones = tiposValidos.map(t => t.split('/')[1]).join(', ');
      cb(new Error(`Formato no válido para ${tipo}. Use: ${extensiones}`));
    }
  }
});

// 🔥 OBTENER CONFIGURACIÓN CON VERIFICACIÓN
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
    
    const configuracion = result.rows.reduce((acc: any, row: any) => {
      acc[row.parametro] = row.valor;
      return acc;
    }, {});
    
    // Valores por defecto con verificación
    const configDefault = {
      logo_principal: logoManager.verificarArchivo(
        configuracion.logo_principal, 
        '/uploads/logos/logo-principal-default.svg'
      ),
      logo_sidebar: logoManager.verificarArchivo(
        configuracion.logo_sidebar, 
        '/uploads/logos/logo-sidebar-default.svg'
      ),
      favicon: logoManager.verificarArchivo(
        configuracion.favicon, 
        '/uploads/logos/favicon.ico'
      ),
      logo_gobierno: logoManager.verificarArchivo(
        configuracion.logo_gobierno, 
        '/uploads/logos/logo-gobierno-default.svg'
      ),
      nombre_hospital: configuracion.nombre_hospital || 'Hospital General San Luis de la Paz',
      nombre_dependencia: configuracion.nombre_dependencia || 'Secretaría de Salud de Guanajuato',
      color_primario: configuracion.color_primario || '#1e40af',
      color_secundario: configuracion.color_secundario || '#3b82f6'
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

// 🔥 SUBIR LOGO CON GESTIÓN INTELIGENTE
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

    // Validar tipo
    const tiposValidos = ['principal', 'sidebar', 'gobierno', 'favicon'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de logo no válido'
      });
    }
    
    // Usar el manager para subir inteligentemente
    const rutaArchivo = await logoManager.subirLogoInteligente(archivo, tipo);
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
      message: 'Logo actualizado correctamente',
      data: {
        parametro,
        ruta: rutaArchivo,
        nombre_archivo: path.basename(rutaArchivo)
      }
    });
  } catch (error) {
    console.error('Error al subir logo:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al subir logo'
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

// 🔥 DEBUG MEJORADO
export const debugLogos = async (req: Request, res: Response): Promise<Response> => {
  const uploadPath = path.join(__dirname, '../../public/uploads/logos');
  
  try {
    const archivos = fs.readdirSync(uploadPath);
    const estadoArchivos = archivos.map(archivo => {
      const rutaCompleta = path.join(uploadPath, archivo);
      const stats = fs.statSync(rutaCompleta);
      return {
        nombre: archivo,
        tamaño: `${(stats.size / 1024).toFixed(2)} KB`,
        modificado: stats.mtime,
        tipo: archivo.includes('default') ? 'DEFAULT' : 'IMPORTADO',
        existe: fs.existsSync(rutaCompleta)
      };
    });
    
    return res.json({
      directorio: uploadPath,
      total_archivos: archivos.length,
      archivos: estadoArchivos,
      servidor_activo: true
    });
  } catch (error) {
    return res.status(500).json({
      directorio: uploadPath,
      error: 'No se pudo acceder al directorio'
    });
  }
};