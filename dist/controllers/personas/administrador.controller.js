"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCredenciales = exports.getEstadisticasAdministradores = exports.toggleAdministrador = exports.getAdministradoresActivos = exports.deleteAdministrador = exports.createAdministrador = exports.restablecerPassword = exports.cambiarPassword = exports.updateAdministrador = exports.getAdministradorById = exports.getAdministradores = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODOS LOS ADMINISTRADORES
// ==========================================
const getAdministradores = async (req, res) => {
    try {
        const { activo, nivel_acceso, buscar } = req.query;
        let query = `
      SELECT 
        adm.id_administrador,
        adm.usuario,
        adm.nivel_acceso,
        adm.activo,
        adm.fecha_creacion,
        adm.ultimo_acceso,
        p.id_persona,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.correo_electronico,
        p.telefono,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        COUNT(als.id_alerta) as alertas_asignadas,
        COUNT(CASE WHEN als.activa = true THEN 1 END) as alertas_pendientes
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      LEFT JOIN alertas_sistema als ON adm.id_administrador = als.usuario_responsable
      WHERE 1=1
    `;
        const params = [];
        let paramCounter = 1;
        // Filtros
        if (activo !== undefined) {
            query += ` AND adm.activo = $${paramCounter}`;
            params.push(activo === 'true');
            paramCounter++;
        }
        if (nivel_acceso) {
            query += ` AND adm.nivel_acceso = $${paramCounter}`;
            params.push(nivel_acceso);
            paramCounter++;
        }
        if (buscar) {
            query += ` AND (
        UPPER(p.nombre) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_materno) LIKE UPPER($${paramCounter}) OR
        UPPER(adm.usuario) LIKE UPPER($${paramCounter})
      )`;
            params.push(`%${buscar}%`);
            paramCounter++;
        }
        query += `
      GROUP BY adm.id_administrador, adm.usuario, adm.nivel_acceso, adm.activo, 
               adm.fecha_creacion, adm.ultimo_acceso, p.id_persona, p.nombre, 
               p.apellido_paterno, p.apellido_materno, p.correo_electronico, p.telefono
      ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC
    `;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Administradores obtenidos correctamente',
            data: response.rows,
            total: response.rowCount,
            filtros_aplicados: {
                activo: activo || 'todos',
                nivel_acceso: nivel_acceso || 'todos',
                buscar: buscar || 'sin filtro'
            }
        });
    }
    catch (error) {
        console.error('Error al obtener administradores:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener administradores',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAdministradores = getAdministradores;
// ==========================================
// OBTENER ADMINISTRADOR POR ID
// ==========================================
const getAdministradorById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        const query = `
      SELECT 
        adm.id_administrador,
        adm.usuario,
        adm.nivel_acceso,
        adm.activo,
        adm.fecha_creacion,
        adm.ultimo_acceso,
        p.id_persona,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.correo_electronico,
        p.telefono,
        p.domicilio,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        COUNT(als.id_alerta) as total_alertas_asignadas,
        COUNT(CASE WHEN als.activa = true THEN 1 END) as alertas_pendientes,
        COUNT(CASE WHEN als.activa = false THEN 1 END) as alertas_resueltas
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      LEFT JOIN alertas_sistema als ON adm.id_administrador = als.usuario_responsable
      WHERE adm.id_administrador = $1
      GROUP BY adm.id_administrador, adm.usuario, adm.nivel_acceso, adm.activo, 
               adm.fecha_creacion, adm.ultimo_acceso, p.id_persona, p.nombre, 
               p.apellido_paterno, p.apellido_materno, p.correo_electronico, 
               p.telefono, p.domicilio
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }
        const alertasQuery = `
      SELECT 
        als.id_alerta,
        als.tipo_alerta,
        als.mensaje,
        als.prioridad,
        als.fecha_generada,
        als.activa,
        als.fecha_resuelta
      FROM alertas_sistema als
      WHERE als.usuario_responsable = $1
      ORDER BY als.fecha_generada DESC
      LIMIT 10
    `;
        const alertasResponse = await database_1.default.query(alertasQuery, [id]);
        const adminData = response.rows[0];
        adminData.ultimas_alertas = alertasResponse.rows;
        return res.status(200).json({
            success: true,
            message: 'Administrador encontrado correctamente',
            data: adminData
        });
    }
    catch (error) {
        console.error('Error al obtener administrador por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener administrador',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAdministradorById = getAdministradorById;
// ==========================================
// ACTUALIZAR ADMINISTRADOR
// ==========================================
const updateAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, nivel_acceso, activo } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Validaciones básicas
        if (!usuario || usuario.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario es obligatorio'
            });
        }
        // Validar niveles de acceso permitidos
        const nivelesPermitidos = ['Administrador', 'Supervisor', 'Usuario'];
        if (nivel_acceso && !nivelesPermitidos.includes(nivel_acceso)) {
            return res.status(400).json({
                success: false,
                message: `El nivel de acceso debe ser uno de: ${nivelesPermitidos.join(', ')}`
            });
        }
        // Verificar que el administrador existe
        const existeQuery = `
      SELECT id_administrador 
      FROM administrador 
      WHERE id_administrador = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }
        // Verificar que no exista otro administrador con el mismo nombre de usuario
        const duplicadoQuery = `
      SELECT id_administrador 
      FROM administrador 
      WHERE usuario = $1 AND id_administrador != $2
    `;
        const duplicadoResponse = await database_1.default.query(duplicadoQuery, [usuario.trim(), id]);
        if (duplicadoResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe otro administrador con ese nombre de usuario'
            });
        }
        // Actualizar administrador
        const updateQuery = `
      UPDATE administrador 
      SET 
        usuario = $1,
        nivel_acceso = $2,
        activo = $3
      WHERE id_administrador = $4
      RETURNING id_administrador, id_persona, usuario, nivel_acceso, activo, fecha_creacion, ultimo_acceso
    `;
        const response = await database_1.default.query(updateQuery, [
            usuario.trim(),
            nivel_acceso,
            activo,
            id
        ]);
        return res.status(200).json({
            success: true,
            message: 'Administrador actualizado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al actualizar administrador:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar administrador',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateAdministrador = updateAdministrador;
// ==========================================
// CAMBIAR CONTRASEÑA
// ==========================================
const cambiarPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password_actual, password_nuevo } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        if (!password_actual || !password_nuevo) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña actual y nueva son obligatorias'
            });
        }
        if (password_nuevo.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }
        // Obtener la contraseña actual del administrador
        const adminQuery = `
      SELECT password 
      FROM administrador 
      WHERE id_administrador = $1 AND activo = true
    `;
        const adminResponse = await database_1.default.query(adminQuery, [id]);
        if (adminResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado o inactivo'
            });
        }
        // Verificar contraseña actual
        const passwordMatch = await bcrypt_1.default.compare(password_actual, adminResponse.rows[0].password);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });
        }
        // Encriptar nueva contraseña
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt_1.default.hash(password_nuevo, saltRounds);
        // Actualizar contraseña
        const updateQuery = `
      UPDATE administrador 
      SET password = $1
      WHERE id_administrador = $2
      RETURNING id_administrador, usuario
    `;
        const response = await database_1.default.query(updateQuery, [hashedNewPassword, id]);
        return res.status(200).json({
            success: true,
            message: 'Contraseña actualizada correctamente',
            data: { id_administrador: response.rows[0].id_administrador, usuario: response.rows[0].usuario }
        });
    }
    catch (error) {
        console.error('Error al cambiar contraseña:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al cambiar contraseña',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.cambiarPassword = cambiarPassword;
// ==========================================
// RESTABLECER CONTRASEÑA (ADMIN)
// ==========================================
const restablecerPassword = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { nueva_password } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        if (!nueva_password || nueva_password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe tener al menos 8 caracteres'
            });
        }
        // Verificar que el administrador existe
        const adminQuery = `
      SELECT adm.id_administrador, adm.usuario, 
             p.nombre, p.apellido_paterno, p.apellido_materno
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE adm.id_administrador = $1
    `;
        const adminResponse = await client.query(adminQuery, [id]);
        if (adminResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }
        // Encriptar nueva contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt_1.default.hash(nueva_password, saltRounds);
        // Actualizar contraseña
        const updateQuery = `
      UPDATE administrador 
      SET 
        password = $1,
        fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_administrador = $2
      RETURNING id_administrador, usuario
    `;
        const response = await client.query(updateQuery, [hashedPassword, id]);
        await client.query('COMMIT');
        const admin = adminResponse.rows[0];
        const nombreCompleto = `${admin.nombre} ${admin.apellido_paterno} ${admin.apellido_materno}`;
        return res.status(200).json({
            success: true,
            message: `Contraseña restablecida correctamente para "${nombreCompleto}"`,
            data: {
                id_administrador: response.rows[0].id_administrador,
                usuario: response.rows[0].usuario
            }
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al restablecer contraseña:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al restablecer contraseña',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
    finally {
        client.release();
    }
};
exports.restablecerPassword = restablecerPassword;
// ==========================================
// CREAR NUEVO ADMINISTRADOR
// ==========================================
const createAdministrador = async (req, res) => {
    try {
        const { id_persona, usuario, password, nivel_acceso = 'Usuario', activo = true } = req.body;
        // Validaciones básicas
        if (!id_persona) {
            return res.status(400).json({
                success: false,
                message: 'El ID de persona es obligatorio'
            });
        }
        if (!usuario || usuario.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario es obligatorio'
            });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }
        // Validar niveles de acceso permitidos
        const nivelesPermitidos = ['Administrador', 'Supervisor', 'Usuario'];
        if (!nivelesPermitidos.includes(nivel_acceso)) {
            return res.status(400).json({
                success: false,
                message: `El nivel de acceso debe ser uno de: ${nivelesPermitidos.join(', ')}`
            });
        }
        // Verificar que la persona existe
        const personaExisteQuery = `
      SELECT id_persona 
      FROM persona 
      WHERE id_persona = $1
    `;
        const personaExisteResponse = await database_1.default.query(personaExisteQuery, [id_persona]);
        if (personaExisteResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'La persona especificada no existe'
            });
        }
        // Verificar que la persona no tenga ya un registro de administrador
        const yaExisteQuery = `
      SELECT id_administrador 
      FROM administrador 
      WHERE id_persona = $1
    `;
        const yaExisteResponse = await database_1.default.query(yaExisteQuery, [id_persona]);
        if (yaExisteResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Esta persona ya tiene un registro como administrador'
            });
        }
        // Verificar que no exista otro administrador con el mismo nombre de usuario
        const usuarioExisteQuery = `
      SELECT id_administrador 
      FROM administrador 
      WHERE usuario = $1
    `;
        const usuarioExisteResponse = await database_1.default.query(usuarioExisteQuery, [usuario.trim()]);
        if (usuarioExisteResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un administrador con ese nombre de usuario'
            });
        }
        // Encriptar contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        // Insertar nuevo administrador
        const insertQuery = `
      INSERT INTO administrador (id_persona, usuario, password, nivel_acceso, activo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_administrador, id_persona, usuario, nivel_acceso, activo, fecha_creacion
    `;
        const response = await database_1.default.query(insertQuery, [
            id_persona,
            usuario.trim(),
            hashedPassword,
            nivel_acceso,
            activo
        ]);
        return res.status(201).json({
            success: true,
            message: 'Administrador creado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear administrador:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear administrador',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createAdministrador = createAdministrador;
// ==========================================
// ELIMINAR ADMINISTRADOR (SOFT DELETE)
// ==========================================
//
const deleteAdministrador = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { force = false } = req.query; // Para eliminación física si es necesario
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar si el administrador existe
        const existeQuery = `
      SELECT adm.id_administrador, adm.activo, p.nombre, p.apellido_paterno, p.apellido_materno
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE adm.id_administrador = $1
    `;
        const existeResponse = await client.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }
        // Verificar si el administrador está siendo usado
        const usoQuery = `
      SELECT 
        COUNT(CASE WHEN als.activa = true THEN 1 END) as alertas_pendientes,
        COUNT(*) as total_alertas
      FROM alertas_sistema als
      WHERE als.usuario_responsable = $1
    `;
        const usoResponse = await client.query(usoQuery, [id]);
        const uso = usoResponse.rows[0];
        const alertasPendientes = parseInt(uso.alertas_pendientes);
        if (alertasPendientes > 0 && force !== 'true') {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'No se puede eliminar el administrador. Tiene alertas pendientes asignadas',
                details: {
                    alertas_pendientes: alertasPendientes,
                    total_alertas: parseInt(uso.total_alertas)
                },
                suggestion: 'Resuelva las alertas pendientes o use force=true para eliminación forzada'
            });
        }
        const nombreCompleto = `${existeResponse.rows[0].nombre} ${existeResponse.rows[0].apellido_paterno} ${existeResponse.rows[0].apellido_materno}`;
        if (force === 'true') {
            // Eliminación física
            const deleteQuery = `
        DELETE FROM administrador 
        WHERE id_administrador = $1 
        RETURNING id_administrador
      `;
            await client.query(deleteQuery, [id]);
            await client.query('COMMIT');
            return res.status(200).json({
                success: true,
                message: `Administrador "${nombreCompleto}" eliminado permanentemente del sistema`
            });
        }
        else {
            // Soft delete - marcar como inactivo
            const softDeleteQuery = `
        UPDATE administrador 
        SET 
          activo = false,
          fecha_modificacion = CURRENT_TIMESTAMP
        WHERE id_administrador = $1
        RETURNING id_administrador
      `;
            await client.query(softDeleteQuery, [id]);
            await client.query('COMMIT');
            return res.status(200).json({
                success: true,
                message: `Administrador "${nombreCompleto}" desactivado correctamente`
            });
        }
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar administrador:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar administrador',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
    finally {
        client.release();
    }
};
exports.deleteAdministrador = deleteAdministrador;
// ==========================================
// OBTENER ADMINISTRADORES ACTIVOS (PARA SELECTS)
// ==========================================
const getAdministradoresActivos = async (req, res) => {
    try {
        const { nivel_acceso } = req.query;
        let query = `
      SELECT 
        adm.id_administrador,
        adm.usuario,
        adm.nivel_acceso,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE adm.activo = true
    `;
        const params = [];
        let paramCounter = 1;
        if (nivel_acceso) {
            query += ` AND adm.nivel_acceso = ${paramCounter}`;
            params.push(nivel_acceso);
            paramCounter++;
        }
        query += ` ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC`;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Administradores activos obtenidos correctamente',
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al obtener administradores activos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener administradores activos',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAdministradoresActivos = getAdministradoresActivos;
// ==========================================
// ACTIVAR/DESACTIVAR ADMINISTRADOR
// ==========================================
const toggleAdministrador = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Obtener estado actual
        const estadoQuery = `
      SELECT adm.id_administrador, adm.activo, adm.usuario,
             p.nombre, p.apellido_paterno, p.apellido_materno
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE adm.id_administrador = $1
    `;
        const estadoResponse = await client.query(estadoQuery, [id]);
        if (estadoResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }
        const admin = estadoResponse.rows[0];
        const nuevoEstado = !admin.activo;
        // Si se está desactivando, verificar alertas pendientes
        if (nuevoEstado === false) {
            const alertasPendientesQuery = `
        SELECT COUNT(*) as pendientes
        FROM alertas_sistema
        WHERE usuario_responsable = $1 AND activa = true
      `;
            const alertasPendientesResponse = await client.query(alertasPendientesQuery, [id]);
            const pendientes = parseInt(alertasPendientesResponse.rows[0].pendientes);
            if (pendientes > 0) {
                await client.query('ROLLBACK');
                return res.status(409).json({
                    success: false,
                    message: `No se puede desactivar el administrador. Tiene ${pendientes} alertas pendientes asignadas`,
                    details: { alertas_pendientes: pendientes }
                });
            }
        }
        // Actualizar estado
        const updateQuery = `
      UPDATE administrador 
      SET 
        activo = $1,
        fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_administrador = $2
      RETURNING id_administrador, activo
    `;
        const response = await client.query(updateQuery, [nuevoEstado, id]);
        await client.query('COMMIT');
        const nombreCompleto = `${admin.nombre} ${admin.apellido_paterno} ${admin.apellido_materno}`;
        const accion = nuevoEstado ? 'activado' : 'desactivado';
        return res.status(200).json({
            success: true,
            message: `Administrador "${nombreCompleto}" ${accion} correctamente`,
            data: {
                id_administrador: response.rows[0].id_administrador,
                activo: response.rows[0].activo,
                usuario: admin.usuario,
                nombre_completo: nombreCompleto
            }
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al cambiar estado del administrador:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al cambiar estado del administrador',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
    finally {
        client.release();
    }
};
exports.toggleAdministrador = toggleAdministrador;
// ==========================================
// OBTENER ESTADÍSTICAS DE ADMINISTRADORES
// ==========================================
const getEstadisticasAdministradores = async (req, res) => {
    try {
        // Estadísticas generales
        const resumenQuery = `
      SELECT 
        COUNT(*) as total_administradores,
        COUNT(CASE WHEN activo = true THEN 1 END) as administradores_activos,
        COUNT(CASE WHEN nivel_acceso = 'Administrador' THEN 1 END) as nivel_administrador,
        COUNT(CASE WHEN nivel_acceso = 'Supervisor' THEN 1 END) as nivel_supervisor,
        COUNT(CASE WHEN nivel_acceso = 'Usuario' THEN 1 END) as nivel_usuario,
        COUNT(CASE WHEN ultimo_acceso >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as activos_ultima_semana
      FROM administrador
    `;
        const resumenResponse = await database_1.default.query(resumenQuery);
        // Administradores más activos (por alertas resueltas)
        const masActivosQuery = `
      SELECT 
        adm.id_administrador,
        adm.usuario,
        adm.nivel_acceso,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        COUNT(als.id_alerta) as total_alertas_asignadas,
        COUNT(CASE WHEN als.activa = false THEN 1 END) as alertas_resueltas,
        adm.ultimo_acceso
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      LEFT JOIN alertas_sistema als ON adm.id_administrador = als.usuario_responsable
      WHERE adm.activo = true
      GROUP BY adm.id_administrador, adm.usuario, adm.nivel_acceso, p.nombre, p.apellido_paterno, p.apellido_materno, adm.ultimo_acceso
      ORDER BY alertas_resueltas DESC, total_alertas_asignadas DESC
      LIMIT 10
    `;
        const masActivosResponse = await database_1.default.query(masActivosQuery);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de administradores obtenidas correctamente',
            data: {
                resumen: resumenResponse.rows[0],
                mas_activos: masActivosResponse.rows
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de administradores:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasAdministradores = getEstadisticasAdministradores;
// ==========================================
// VALIDAR CREDENCIALES (LOGIN)
// ==========================================
const validarCredenciales = async (req, res) => {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son obligatorios'
            });
        }
        // Buscar administrador por usuario
        const adminQuery = `
      SELECT 
        adm.id_administrador,
        adm.id_persona,
        adm.usuario,
        adm.password,
        adm.nivel_acceso,
        adm.activo,
        adm.ultimo_acceso,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.correo_electronico,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE UPPER(adm.usuario) = UPPER($1) AND p.activo = true
    `;
        const adminResponse = await database_1.default.query(adminQuery, [usuario.trim()]);
        if (adminResponse.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        const admin = adminResponse.rows[0];
        // Verificar si el administrador está activo
        if (!admin.activo) {
            return res.status(401).json({
                success: false,
                message: 'Cuenta desactivada. Contacte al administrador del sistema'
            });
        }
        // Verificar contraseña
        const passwordMatch = await bcrypt_1.default.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        // Actualizar último acceso
        const updateUltimoAccesoQuery = `
      UPDATE administrador 
      SET ultimo_acceso = CURRENT_TIMESTAMP
      WHERE id_administrador = $1
    `;
        await database_1.default.query(updateUltimoAccesoQuery, [admin.id_administrador]);
        // Respuesta exitosa (sin incluir password)
        const { password: _, ...adminData } = admin;
        return res.status(200).json({
            success: true,
            message: 'Credenciales válidas',
            data: adminData
        });
    }
    catch (error) {
        console.error('Error al validar credenciales:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al validar credenciales',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.validarCredenciales = validarCredenciales;
