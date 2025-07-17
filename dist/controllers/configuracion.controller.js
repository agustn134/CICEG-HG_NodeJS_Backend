"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLogos = exports.subirLogo = exports.actualizarConfiguracion = exports.getConfiguracionLogos = exports.upload = void 0;
const database_1 = __importDefault(require("../config/database"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configuración de multer para subir archivos
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../public/uploads/logos');
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const tipo = req.body.tipo;
        const extension = path_1.default.extname(file.originalname);
        const nombreArchivo = `${tipo}-${Date.now()}${extension}`;
        cb(null, nombreArchivo);
    }
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/x-icon', 'image/svg+xml'];
        if (tiposPermitidos.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    }
});
// 🔥 FUNCIÓN AUXILIAR PARA VERIFICAR ARCHIVOS
const verificarArchivo = (ruta, fallback) => {
    if (!ruta)
        return fallback;
    const rutaCompleta = path_1.default.join(__dirname, '../../public', ruta);
    if (fs_1.default.existsSync(rutaCompleta)) {
        return ruta;
    }
    // Intentar versión SVG si no existe PNG
    const rutaSvg = ruta.replace(/\.(png|jpg|jpeg)$/i, '.svg');
    const rutaSvgCompleta = path_1.default.join(__dirname, '../../public', rutaSvg);
    if (fs_1.default.existsSync(rutaSvgCompleta)) {
        return rutaSvg;
    }
    return fallback;
};
// 🔥 OBTENER CONFIGURACIÓN CON VERIFICACIÓN DE ARCHIVOS
const getConfiguracionLogos = async (req, res) => {
    try {
        const query = `
      SELECT parametro, valor 
      FROM configuracion_sistema 
      WHERE parametro IN (
        'logo_principal', 'logo_sidebar', 'favicon', 'logo_gobierno',
        'nombre_hospital', 'nombre_dependencia', 'color_primario', 'color_secundario'
      )
    `;
        const result = await database_1.default.query(query);
        // Convertir array a objeto
        const configuracion = result.rows.reduce((acc, row) => {
            acc[row.parametro] = row.valor;
            return acc;
        }, {});
        // 🔥 VALORES POR DEFECTO QUE SIEMPRE FUNCIONAN
        const configDefault = {
            logo_principal: verificarArchivo(configuracion.logo_principal, '/uploads/logos/logo-principal-default.svg'),
            logo_sidebar: verificarArchivo(configuracion.logo_sidebar, '/uploads/logos/logo-sidebar-default.svg'),
            favicon: verificarArchivo(configuracion.favicon, '/uploads/logos/favicon.ico'),
            logo_gobierno: verificarArchivo(configuracion.logo_gobierno, '/uploads/logos/logo-gobierno-default.svg'),
            nombre_hospital: configuracion.nombre_hospital || 'Hospital General San Luis de la Paz',
            nombre_dependencia: configuracion.nombre_dependencia || 'Secretaría de Salud de Guanajuato',
            color_primario: configuracion.color_primario || '#1e40af',
            color_secundario: configuracion.color_secundario || '#3b82f6'
        };
        return res.status(200).json(configDefault);
    }
    catch (error) {
        console.error('Error al obtener configuración:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener configuración'
        });
    }
};
exports.getConfiguracionLogos = getConfiguracionLogos;
// Actualizar configuración
const actualizarConfiguracion = async (req, res) => {
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
                await database_1.default.query(`
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
    }
    catch (error) {
        console.error('Error al actualizar configuración:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar configuración'
        });
    }
};
exports.actualizarConfiguracion = actualizarConfiguracion;
// Subir logo
const subirLogo = async (req, res) => {
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
        await database_1.default.query(`
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
    }
    catch (error) {
        console.error('Error al subir logo:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al subir logo'
        });
    }
};
exports.subirLogo = subirLogo;
// Agregar al final de configuracion.controller.ts
const debugLogos = async (req, res) => {
    const uploadPath = path_1.default.join(__dirname, '../../public/uploads/logos');
    try {
        const archivos = fs_1.default.readdirSync(uploadPath);
        const estadoArchivos = archivos.map(archivo => {
            const rutaCompleta = path_1.default.join(uploadPath, archivo);
            const stats = fs_1.default.statSync(rutaCompleta);
            return {
                nombre: archivo,
                tamaño: stats.size,
                modificado: stats.mtime,
                existe: fs_1.default.existsSync(rutaCompleta)
            };
        });
        return res.json({
            directorio: uploadPath,
            archivos: estadoArchivos,
            servidor_activo: true
        });
    }
    catch (error) {
        return res.status(500).json({
            directorio: uploadPath
        });
    }
};
exports.debugLogos = debugLogos;
