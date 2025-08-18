"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cambiarPassword = exports.logout = exports.verifyToken = exports.login = void 0;
const database_1 = __importDefault(require("../../config/database"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWT_SECRET = process.env.JWT_SECRET || 'hospital_ciceg_secret_key_2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
// ==========================================
// LOGIN PRINCIPAL - SIN CAMBIOS
// ==========================================
const login = async (req, res) => {
    try {
        const { usuario, password, tipoUsuario } = req.body;
        if (!usuario || !password || !tipoUsuario) {
            return res.status(400).json({
                success: false,
                message: 'Usuario, contraseña y tipo de usuario son obligatorios'
            });
        }
        let userData = null;
        if (tipoUsuario === 'medico') {
            userData = await buscarMedico(usuario, password);
        }
        else if (tipoUsuario === 'administrador') {
            userData = await buscarAdministrador(usuario, password);
        }
        if (!userData) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        if (!userData.activo) {
            return res.status(403).json({
                success: false,
                message: 'Usuario inactivo. Contacte al administrador.'
            });
        }
        // 🔥 GENERAR TOKEN - VERSIÓN SIMPLIFICADA
        const token = jwt.sign({
            userId: userData.id,
            usuario: userData.usuario,
            tipoUsuario: userData.tipo_usuario,
            nombre: userData.nombre_completo
        }, JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: {
                token,
                usuario: {
                    id: userData.id,
                    usuario: userData.usuario,
                    nombre_completo: userData.nombre_completo,
                    tipo_usuario: userData.tipo_usuario,
                    especialidad: userData.especialidad,
                    cargo: userData.cargo,
                    departamento: userData.departamento,
                    nivel_acceso: userData.nivel_acceso
                }
            }
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.login = login;
// ==========================================
// BUSCAR ADMINISTRADOR - AHORA FUNCIONA CON BCRYPT
// ==========================================
async function buscarAdministrador(usuario, password) {
    try {
        const query = `
      SELECT 
        a.id_administrador as id,
        a.usuario,
        a.contrasena,  -- 🔥 Hash bcrypt
        a.nivel_acceso,
        a.activo,
        CASE 
          WHEN a.nivel_acceso = 1 THEN 'Administrador'
          WHEN a.nivel_acceso = 2 THEN 'Supervisor'
          WHEN a.nivel_acceso = 3 THEN 'Usuario'
          ELSE 'Desconocido'
        END as nivel_acceso_texto,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo
      FROM administrador a
      JOIN persona p ON a.id_persona = p.id_persona
      WHERE UPPER(a.usuario) = UPPER($1) AND a.activo = true
    `;
        const result = await database_1.default.query(query, [usuario]);
        if (result.rows.length === 0) {
            return null;
        }
        const admin = result.rows[0];
        // 🔥 AHORA FUNCIONA: Verificar contraseña con hash
        const passwordMatch = await bcrypt_1.default.compare(password, admin.contrasena);
        if (!passwordMatch) {
            return null;
        }
        // 🔥 Actualizar último login
        await database_1.default.query('UPDATE administrador SET ultimo_login = CURRENT_TIMESTAMP WHERE id_administrador = $1', [admin.id]);
        return {
            id: admin.id,
            usuario: admin.usuario,
            nombre_completo: admin.nombre_completo,
            tipo_usuario: 'administrador',
            nivel_acceso: admin.nivel_acceso_texto,
            activo: admin.activo
        };
    }
    catch (error) {
        console.error('Error al buscar administrador:', error);
        return null;
    }
}
// ==========================================
// BUSCAR MÉDICO - SIN CAMBIOS
// ==========================================
async function buscarMedico(usuario, password) {
    const client = await database_1.default.connect();
    try {
        const query = `
      SELECT 
        pm.id_personal_medico as id,
        pm.usuario,
        pm.password_texto,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_completo,
        pm.especialidad,
        pm.cargo,
        pm.departamento,
        pm.activo
      FROM personal_medico pm
      INNER JOIN persona p ON pm.id_persona = p.id_persona
      WHERE pm.usuario = $1 AND pm.activo = true
    `;
        const result = await client.query(query, [usuario]);
        if (result.rows.length === 0) {
            return null;
        }
        const user = result.rows[0];
        // 🔥 VERIFICAR CONTRASEÑA EN TEXTO PLANO (para médicos)
        if (password !== user.password_texto) {
            return null;
        }
        return {
            id: user.id,
            usuario: user.usuario,
            nombre_completo: user.nombre_completo,
            tipo_usuario: 'medico',
            especialidad: user.especialidad,
            cargo: user.cargo,
            departamento: user.departamento,
            activo: user.activo
        };
    }
    finally {
        client.release();
    }
}
// Resto de funciones igual...
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.status(200).json({
            success: true,
            message: 'Token válido',
            data: {
                userId: decoded.userId,
                usuario: decoded.usuario,
                tipoUsuario: decoded.tipoUsuario,
                nombre: decoded.nombre
            }
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};
exports.verifyToken = verifyToken;
const logout = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Logout exitoso'
    });
};
exports.logout = logout;
const cambiarPassword = async (req, res) => {
    try {
        const { userId, tipoUsuario } = req.user;
        const { passwordActual, passwordNuevo } = req.body;
        if (!passwordActual || !passwordNuevo || passwordNuevo.length < 4) {
            return res.status(400).json({
                success: false,
                message: 'Contraseña actual y nueva son obligatorias (mínimo 4 caracteres)'
            });
        }
        const client = await database_1.default.connect();
        try {
            let tabla = tipoUsuario === 'medico' ? 'personal_medico' : 'administrador';
            let idField = tipoUsuario === 'medico' ? 'id_personal_medico' : 'id_administrador';
            const currentPasswordResult = await client.query(`SELECT password_texto FROM ${tabla} WHERE ${idField} = $1`, [userId]);
            if (currentPasswordResult.rows.length === 0 ||
                passwordActual !== currentPasswordResult.rows[0].password_texto) {
                return res.status(400).json({
                    success: false,
                    message: 'Contraseña actual incorrecta'
                });
            }
            await client.query(`UPDATE ${tabla} SET password_texto = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE ${idField} = $2`, [passwordNuevo, userId]);
            return res.status(200).json({
                success: true,
                message: 'Contraseña actualizada exitosamente'
            });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.cambiarPassword = cambiarPassword;
