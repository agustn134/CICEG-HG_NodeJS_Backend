"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstadisticasTiposDocumento = exports.getTiposDocumentoActivos = exports.deleteTipoDocumento = exports.updateTipoDocumento = exports.createTipoDocumento = exports.getTipoDocumentoById = exports.getTiposDocumento = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODOS LOS TIPOS DE DOCUMENTO
// ==========================================
const getTiposDocumento = async (req, res) => {
    try {
        const { activo, buscar } = req.query;
        let query = `
      SELECT 
        td.id_tipo_documento,
        td.nombre,
        td.descripcion,
        td.activo,
        COUNT(dc.id_documento) as total_documentos,
        COUNT(CASE WHEN dc.estado = 'Activo' THEN 1 END) as documentos_activos,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes_actual,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as documentos_semana_actual
      FROM tipo_documento td
      LEFT JOIN documento_clinico dc ON td.id_tipo_documento = dc.id_tipo_documento
      WHERE 1=1
    `;
        const params = [];
        let paramCounter = 1;
        // Filtrar por estado activo si se especifica
        if (activo !== undefined) {
            query += ` AND td.activo = $${paramCounter}`;
            params.push(activo === 'true');
            paramCounter++;
        }
        // Búsqueda general por nombre
        if (buscar) {
            query += ` AND UPPER(td.nombre) LIKE UPPER($${paramCounter})`;
            params.push(`%${buscar}%`);
            paramCounter++;
        }
        query += `
      GROUP BY td.id_tipo_documento, td.nombre, td.descripcion, td.activo
      ORDER BY total_documentos DESC, td.nombre ASC
    `;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Tipos de documento obtenidos correctamente',
            data: response.rows,
            total: response.rowCount,
            filtros_aplicados: {
                activo: activo || 'todos',
                buscar: buscar || 'sin filtro'
            }
        });
    }
    catch (error) {
        console.error('Error al obtener tipos de documento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener tipos de documento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getTiposDocumento = getTiposDocumento;
// ==========================================
// OBTENER TIPO DE DOCUMENTO POR ID
// ==========================================
const getTipoDocumentoById = async (req, res) => {
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
        td.id_tipo_documento,
        td.nombre,
        td.descripcion,
        td.activo,
        COUNT(dc.id_documento) as total_documentos,
        COUNT(CASE WHEN dc.estado = 'Activo' THEN 1 END) as documentos_activos,
        COUNT(CASE WHEN dc.estado = 'Cancelado' THEN 1 END) as documentos_cancelados,
        COUNT(CASE WHEN dc.estado = 'Anulado' THEN 1 END) as documentos_anulados,
        COUNT(CASE WHEN dc.estado = 'Borrador' THEN 1 END) as documentos_borrador,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as documentos_semana,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes,
        MAX(dc.fecha_elaboracion) as ultimo_documento_fecha
      FROM tipo_documento td
      LEFT JOIN documento_clinico dc ON td.id_tipo_documento = dc.id_tipo_documento
      WHERE td.id_tipo_documento = $1
      GROUP BY td.id_tipo_documento, td.nombre, td.descripcion, td.activo
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de documento no encontrado'
            });
        }
        // Obtener los últimos 10 documentos de este tipo
        const documentosQuery = `
      SELECT 
        dc.id_documento,
        dc.fecha_elaboracion,
        dc.estado,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_creador,
        s.nombre as servicio
      FROM documento_clinico dc
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE dc.id_tipo_documento = $1
      ORDER BY dc.fecha_elaboracion DESC
      LIMIT 10
    `;
        const documentosResponse = await database_1.default.query(documentosQuery, [id]);
        const tipoDocumentoData = response.rows[0];
        tipoDocumentoData.ultimos_documentos = documentosResponse.rows;
        return res.status(200).json({
            success: true,
            message: 'Tipo de documento encontrado correctamente',
            data: tipoDocumentoData
        });
    }
    catch (error) {
        console.error('Error al obtener tipo de documento por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener tipo de documento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getTipoDocumentoById = getTipoDocumentoById;
// ==========================================
// CREAR NUEVO TIPO DE DOCUMENTO
// ==========================================
const createTipoDocumento = async (req, res) => {
    try {
        const { nombre, descripcion, activo = true } = req.body;
        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre del tipo de documento es obligatorio'
            });
        }
        // Verificar si ya existe un tipo de documento con el mismo nombre
        const existeQuery = `
      SELECT id_tipo_documento 
      FROM tipo_documento 
      WHERE UPPER(nombre) = UPPER($1)
    `;
        const existeResponse = await database_1.default.query(existeQuery, [nombre.trim()]);
        if (existeResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un tipo de documento con ese nombre'
            });
        }
        // Insertar nuevo tipo de documento
        const insertQuery = `
      INSERT INTO tipo_documento (nombre, descripcion, activo) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
        const response = await database_1.default.query(insertQuery, [
            nombre.trim(),
            descripcion?.trim() || null,
            activo
        ]);
        return res.status(201).json({
            success: true,
            message: 'Tipo de documento creado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear tipo de documento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear tipo de documento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createTipoDocumento = createTipoDocumento;
// ==========================================
// ACTUALIZAR TIPO DE DOCUMENTO
// ==========================================
const updateTipoDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, activo } = req.body;
        // Validar que el ID sea un número
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre del tipo de documento es obligatorio'
            });
        }
        // Verificar si el tipo de documento existe
        const existeQuery = `
      SELECT id_tipo_documento 
      FROM tipo_documento 
      WHERE id_tipo_documento = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de documento no encontrado'
            });
        }
        // Verificar si ya existe otro tipo de documento con el mismo nombre
        const duplicadoQuery = `
      SELECT id_tipo_documento 
      FROM tipo_documento 
      WHERE UPPER(nombre) = UPPER($1) AND id_tipo_documento != $2
    `;
        const duplicadoResponse = await database_1.default.query(duplicadoQuery, [nombre.trim(), id]);
        if (duplicadoResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe otro tipo de documento con ese nombre'
            });
        }
        // Actualizar tipo de documento
        const updateQuery = `
      UPDATE tipo_documento 
      SET nombre = $1, descripcion = $2, activo = $3
      WHERE id_tipo_documento = $4 
      RETURNING *
    `;
        const response = await database_1.default.query(updateQuery, [
            nombre.trim(),
            descripcion?.trim() || null,
            activo,
            id
        ]);
        return res.status(200).json({
            success: true,
            message: 'Tipo de documento actualizado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al actualizar tipo de documento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar tipo de documento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateTipoDocumento = updateTipoDocumento;
// ==========================================
// ELIMINAR TIPO DE DOCUMENTO
// ==========================================
const deleteTipoDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar que el ID sea un número
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar si el tipo de documento existe
        const existeQuery = `
      SELECT id_tipo_documento, nombre 
      FROM tipo_documento 
      WHERE id_tipo_documento = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de documento no encontrado'
            });
        }
        // Verificar si el tipo de documento está siendo usado
        const usoQuery = `
      SELECT COUNT(*) as total
      FROM documento_clinico 
      WHERE id_tipo_documento = $1
    `;
        const usoResponse = await database_1.default.query(usoQuery, [id]);
        const totalUso = parseInt(usoResponse.rows[0].total);
        if (totalUso > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar el tipo de documento. Tiene ${totalUso} documento(s) asociado(s)`,
                details: {
                    documentos_asociados: totalUso
                }
            });
        }
        // Eliminar tipo de documento
        const deleteQuery = `
      DELETE FROM tipo_documento 
      WHERE id_tipo_documento = $1 
      RETURNING nombre
    `;
        const response = await database_1.default.query(deleteQuery, [id]);
        return res.status(200).json({
            success: true,
            message: `Tipo de documento "${response.rows[0].nombre}" eliminado correctamente`
        });
    }
    catch (error) {
        console.error('Error al eliminar tipo de documento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar tipo de documento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.deleteTipoDocumento = deleteTipoDocumento;
// ==========================================
// OBTENER TIPOS DE DOCUMENTO ACTIVOS (PARA SELECTS)
// ==========================================
const getTiposDocumentoActivos = async (req, res) => {
    try {
        const query = `
      SELECT 
        id_tipo_documento,
        nombre,
        descripcion
      FROM tipo_documento 
      WHERE activo = true
      ORDER BY nombre ASC
    `;
        const response = await database_1.default.query(query);
        return res.status(200).json({
            success: true,
            message: 'Tipos de documento activos obtenidos correctamente',
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al obtener tipos de documento activos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener tipos activos',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getTiposDocumentoActivos = getTiposDocumentoActivos;
// ==========================================
// OBTENER ESTADÍSTICAS DE TIPOS DE DOCUMENTO
// ==========================================
const getEstadisticasTiposDocumento = async (req, res) => {
    try {
        const query = `
      SELECT 
        td.id_tipo_documento,
        td.nombre,
        td.descripcion,
        td.activo,
        COUNT(dc.id_documento) as total_documentos,
        COUNT(CASE WHEN dc.estado = 'Activo' THEN 1 END) as documentos_activos,
        COUNT(CASE WHEN dc.estado = 'Cancelado' THEN 1 END) as documentos_cancelados,
        COUNT(CASE WHEN dc.estado = 'Anulado' THEN 1 END) as documentos_anulados,
        COUNT(CASE WHEN dc.estado = 'Borrador' THEN 1 END) as documentos_borrador,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as documentos_semana,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '1 year' THEN 1 END) as documentos_ano
      FROM tipo_documento td
      LEFT JOIN documento_clinico dc ON td.id_tipo_documento = dc.id_tipo_documento
      GROUP BY td.id_tipo_documento, td.nombre, td.descripcion, td.activo
      ORDER BY total_documentos DESC, td.nombre ASC
    `;
        const response = await database_1.default.query(query);
        // Calcular estadísticas generales
        const totalTipos = response.rows.length;
        const tiposActivos = response.rows.filter(row => row.activo).length;
        const totalDocumentos = response.rows.reduce((sum, row) => sum + parseInt(row.total_documentos), 0);
        const documentosActivos = response.rows.reduce((sum, row) => sum + parseInt(row.documentos_activos), 0);
        const documentosMes = response.rows.reduce((sum, row) => sum + parseInt(row.documentos_mes), 0);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de tipos de documento obtenidas correctamente',
            data: {
                tipos_documento: response.rows,
                resumen: {
                    total_tipos_documento: totalTipos,
                    tipos_activos: tiposActivos,
                    total_documentos_sistema: totalDocumentos,
                    documentos_activos: documentosActivos,
                    documentos_mes_actual: documentosMes,
                    promedio_documentos_por_tipo: totalTipos > 0 ? Math.round(totalDocumentos / totalTipos) : 0,
                    tipos_sin_uso: response.rows.filter(row => parseInt(row.total_documentos) === 0).length
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de tipos de documento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasTiposDocumento = getEstadisticasTiposDocumento;
