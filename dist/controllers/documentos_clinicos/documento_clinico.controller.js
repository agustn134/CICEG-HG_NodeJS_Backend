"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstadisticasDocumentos = exports.getDocumentosByExpediente = exports.deleteDocumentoClinico = exports.updateDocumentoClinico = exports.createDocumentoClinico = exports.getDocumentoClinicoById = exports.getDocumentosClinicos = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODOS LOS DOCUMENTOS CLÍNICOS CON FILTROS
// ==========================================
const getDocumentosClinicos = async (req, res) => {
    try {
        const { page = 1, limit = 10, id_expediente, id_internamiento, id_tipo_documento, estado, fecha_inicio, fecha_fin, buscar } = req.query;
        // Validar parámetros de paginación
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;
        // Construir query base con JOINs para información completa
        let baseQuery = `
      SELECT 
        dc.*,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        td.nombre as tipo_documento_nombre,
        pm.nombres || ' ' || pm.apellido_paterno as personal_creador_nombre,
        pm.especialidad,
        i.fecha_ingreso,
        i.motivo_ingreso,
        s.nombre as servicio_nombre
      FROM documento_clinico dc
      LEFT JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
    `;
        let countQuery = `
      SELECT COUNT(*) as total
      FROM documento_clinico dc
      LEFT JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
    `;
        const conditions = [];
        const values = [];
        // Aplicar filtros
        if (id_expediente) {
            conditions.push(`dc.id_expediente = $${values.length + 1}`);
            values.push(id_expediente);
        }
        if (id_internamiento) {
            conditions.push(`dc.id_internamiento = $${values.length + 1}`);
            values.push(id_internamiento);
        }
        if (id_tipo_documento) {
            conditions.push(`dc.id_tipo_documento = $${values.length + 1}`);
            values.push(id_tipo_documento);
        }
        if (estado) {
            conditions.push(`dc.estado = $${values.length + 1}`);
            values.push(estado);
        }
        if (fecha_inicio) {
            conditions.push(`dc.fecha_elaboracion >= $${values.length + 1}`);
            values.push(fecha_inicio);
        }
        if (fecha_fin) {
            conditions.push(`dc.fecha_elaboracion <= $${values.length + 1}`);
            values.push(fecha_fin);
        }
        if (buscar) {
            conditions.push(`(
        e.numero_expediente ILIKE $${values.length + 1} OR
        (p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
        td.nombre ILIKE $${values.length + 1}
      )`);
            values.push(`%${buscar}%`);
        }
        // Agregar condiciones WHERE si existen
        if (conditions.length > 0) {
            const whereClause = ` WHERE ${conditions.join(' AND ')}`;
            baseQuery += whereClause;
            countQuery += whereClause;
        }
        // Agregar ordenamiento y paginación
        baseQuery += ` ORDER BY dc.fecha_elaboracion DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limitNum, offset);
        // Ejecutar consultas
        const [dataResponse, countResponse] = await Promise.all([
            database_1.default.query(baseQuery, values),
            database_1.default.query(countQuery, values.slice(0, -2)) // Sin los parámetros de paginación
        ]);
        const total = parseInt(countResponse.rows[0].total);
        const totalPages = Math.ceil(total / limitNum);
        return res.status(200).json({
            success: true,
            message: 'Documentos clínicos obtenidos correctamente',
            data: dataResponse.rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    }
    catch (error) {
        console.error('Error al obtener documentos clínicos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener documentos clínicos',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getDocumentosClinicos = getDocumentosClinicos;
// ==========================================
// OBTENER DOCUMENTO CLÍNICO POR ID
// ==========================================
const getDocumentoClinicoById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar que el ID sea un número
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        const query = `
      SELECT 
        dc.*,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        td.nombre as tipo_documento_nombre,
        td.descripcion as tipo_documento_descripcion,
        pm.nombres || ' ' || pm.apellido_paterno as personal_creador_nombre,
        pm.especialidad,
        pm.cedula_profesional,
        i.fecha_ingreso,
        i.fecha_egreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        s.nombre as servicio_nombre
      FROM documento_clinico dc
      LEFT JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE dc.id_documento = $1
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Documento clínico no encontrado'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Documento clínico obtenido correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al obtener documento clínico por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener documento clínico',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getDocumentoClinicoById = getDocumentoClinicoById;
// ==========================================
// CREAR NUEVO DOCUMENTO CLÍNICO
// ==========================================
const createDocumentoClinico = async (req, res) => {
    try {
        const { id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado = 'Activo' } = req.body;
        // Validaciones obligatorias
        if (!id_expediente || !id_tipo_documento || !id_personal_creador) {
            return res.status(400).json({
                success: false,
                message: 'Los campos id_expediente, id_tipo_documento e id_personal_creador son obligatorios'
            });
        }
        // Verificar que el expediente existe
        const expedienteCheck = await database_1.default.query('SELECT id_expediente FROM expediente WHERE id_expediente = $1', [id_expediente]);
        if (expedienteCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'El expediente especificado no existe'
            });
        }
        // Verificar que el tipo de documento existe y está activo
        const tipoDocumentoCheck = await database_1.default.query('SELECT id_tipo_documento FROM tipo_documento WHERE id_tipo_documento = $1 AND activo = true', [id_tipo_documento]);
        if (tipoDocumentoCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'El tipo de documento especificado no existe o no está activo'
            });
        }
        // Verificar que el personal médico existe
        const personalCheck = await database_1.default.query('SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1', [id_personal_creador]);
        if (personalCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'El personal médico especificado no existe'
            });
        }
        // Verificar internamiento si se proporciona
        if (id_internamiento) {
            const internamientoCheck = await database_1.default.query('SELECT id_internamiento FROM internamiento WHERE id_internamiento = $1 AND id_expediente = $2', [id_internamiento, id_expediente]);
            if (internamientoCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'El internamiento especificado no existe o no pertenece al expediente'
                });
            }
        }
        // Crear documento clínico
        const query = `
      INSERT INTO documento_clinico (
        id_expediente, 
        id_internamiento, 
        id_tipo_documento, 
        fecha_elaboracion, 
        id_personal_creador, 
        estado
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
        const values = [
            id_expediente,
            id_internamiento || null,
            id_tipo_documento,
            fecha_elaboracion || new Date(),
            id_personal_creador,
            estado
        ];
        const response = await database_1.default.query(query, values);
        return res.status(201).json({
            success: true,
            message: 'Documento clínico creado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear documento clínico:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear documento clínico',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createDocumentoClinico = createDocumentoClinico;
// ==========================================
// ACTUALIZAR DOCUMENTO CLÍNICO
// ==========================================
const updateDocumentoClinico = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado } = req.body;
        // Validar que el ID sea un número
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar que el documento existe
        const documentoCheck = await database_1.default.query('SELECT id_documento FROM documento_clinico WHERE id_documento = $1', [id]);
        if (documentoCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Documento clínico no encontrado'
            });
        }
        // Realizar las mismas validaciones que en create (si se proporcionan los valores)
        if (id_expediente) {
            const expedienteCheck = await database_1.default.query('SELECT id_expediente FROM expediente WHERE id_expediente = $1', [id_expediente]);
            if (expedienteCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'El expediente especificado no existe'
                });
            }
        }
        if (id_tipo_documento) {
            const tipoDocumentoCheck = await database_1.default.query('SELECT id_tipo_documento FROM tipo_documento WHERE id_tipo_documento = $1 AND activo = true', [id_tipo_documento]);
            if (tipoDocumentoCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'El tipo de documento especificado no existe o no está activo'
                });
            }
        }
        if (id_personal_creador) {
            const personalCheck = await database_1.default.query('SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1', [id_personal_creador]);
            if (personalCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'El personal médico especificado no existe'
                });
            }
        }
        // Actualizar documento
        const query = `
      UPDATE documento_clinico 
      SET 
        id_expediente = COALESCE($1, id_expediente),
        id_internamiento = COALESCE($2, id_internamiento),
        id_tipo_documento = COALESCE($3, id_tipo_documento),
        fecha_elaboracion = COALESCE($4, fecha_elaboracion),
        id_personal_creador = COALESCE($5, id_personal_creador),
        estado = COALESCE($6, estado)
      WHERE id_documento = $7 
      RETURNING *
    `;
        const values = [
            id_expediente,
            id_internamiento,
            id_tipo_documento,
            fecha_elaboracion,
            id_personal_creador,
            estado,
            id
        ];
        const response = await database_1.default.query(query, values);
        return res.status(200).json({
            success: true,
            message: 'Documento clínico actualizado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al actualizar documento clínico:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar documento clínico',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateDocumentoClinico = updateDocumentoClinico;
// ==========================================
// ELIMINAR DOCUMENTO CLÍNICO (CAMBIAR ESTADO)
// ==========================================
const deleteDocumentoClinico = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar que el ID sea un número
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // En lugar de eliminar físicamente, cambiar estado a 'Anulado'
        const response = await database_1.default.query('UPDATE documento_clinico SET estado = $1 WHERE id_documento = $2 RETURNING *', ['Anulado', id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Documento clínico no encontrado'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Documento clínico anulado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al anular documento clínico:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al anular documento clínico',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.deleteDocumentoClinico = deleteDocumentoClinico;
// ==========================================
// OBTENER DOCUMENTOS POR EXPEDIENTE
// ==========================================
const getDocumentosByExpediente = async (req, res) => {
    try {
        const { id_expediente } = req.params;
        // Validar que el ID sea un número
        if (!id_expediente || isNaN(parseInt(id_expediente))) {
            return res.status(400).json({
                success: false,
                message: 'El ID del expediente debe ser un número válido'
            });
        }
        const query = `
      SELECT 
        dc.*,
        td.nombre as tipo_documento_nombre,
        pm.nombres || ' ' || pm.apellido_paterno as personal_creador_nombre,
        pm.especialidad
      FROM documento_clinico dc
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      WHERE dc.id_expediente = $1 AND dc.estado != 'Anulado'
      ORDER BY dc.fecha_elaboracion DESC
    `;
        const response = await database_1.default.query(query, [id_expediente]);
        return res.status(200).json({
            success: true,
            message: 'Documentos del expediente obtenidos correctamente',
            data: response.rows
        });
    }
    catch (error) {
        console.error('Error al obtener documentos del expediente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener documentos del expediente',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getDocumentosByExpediente = getDocumentosByExpediente;
// ==========================================
// OBTENER ESTADÍSTICAS DE DOCUMENTOS CLÍNICOS
// ==========================================
const getEstadisticasDocumentos = async (req, res) => {
    try {
        const queries = {
            totalDocumentos: `
        SELECT COUNT(*) as total 
        FROM documento_clinico 
        WHERE estado != 'Anulado'
      `,
            documentosPorTipo: `
        SELECT 
          td.nombre as tipo_documento,
          COUNT(dc.id_documento) as cantidad
        FROM tipo_documento td
        LEFT JOIN documento_clinico dc ON td.id_tipo_documento = dc.id_tipo_documento 
          AND dc.estado != 'Anulado'
        WHERE td.activo = true
        GROUP BY td.id_tipo_documento, td.nombre
        ORDER BY cantidad DESC
      `,
            documentosPorEstado: `
        SELECT 
          estado,
          COUNT(*) as cantidad
        FROM documento_clinico
        GROUP BY estado
        ORDER BY cantidad DESC
      `,
            documentosRecientes: `
        SELECT 
          DATE(fecha_elaboracion) as fecha,
          COUNT(*) as cantidad
        FROM documento_clinico
        WHERE fecha_elaboracion >= NOW() - INTERVAL '30 days'
          AND estado != 'Anulado'
        GROUP BY DATE(fecha_elaboracion)
        ORDER BY fecha DESC
        LIMIT 30
      `
        };
        const [total, porTipo, porEstado, recientes] = await Promise.all([
            database_1.default.query(queries.totalDocumentos),
            database_1.default.query(queries.documentosPorTipo),
            database_1.default.query(queries.documentosPorEstado),
            database_1.default.query(queries.documentosRecientes)
        ]);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de documentos clínicos obtenidas correctamente',
            data: {
                total: parseInt(total.rows[0].total),
                documentosPorTipo: porTipo.rows,
                documentosPorEstado: porEstado.rows,
                documentosRecientes: recientes.rows
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasDocumentos = getEstadisticasDocumentos;
