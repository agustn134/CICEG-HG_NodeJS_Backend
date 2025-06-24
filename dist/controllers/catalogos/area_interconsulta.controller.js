"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstadisticasInterconsultas = exports.getAreasInterconsultaActivas = exports.deleteAreaInterconsulta = exports.updateAreaInterconsulta = exports.createAreaInterconsulta = exports.getAreaInterconsultaById = exports.getAreasInterconsulta = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODAS LAS ÁREAS DE INTERCONSULTA
// ==========================================
const getAreasInterconsulta = async (req, res) => {
    try {
        const query = `
      SELECT 
        ai.id_area_interconsulta,
        ai.nombre,
        ai.descripcion,
        ai.activo,
        COUNT(ni.id_nota_interconsulta) AS total_interconsultas,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS interconsultas_mes_actual
      FROM area_interconsulta ai
      LEFT JOIN nota_interconsulta ni ON ai.id_area_interconsulta = ni.area_interconsulta
      LEFT JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      GROUP BY ai.id_area_interconsulta, ai.nombre, ai.descripcion, ai.activo
      ORDER BY total_interconsultas DESC, ai.nombre ASC
    `;
        const response = await database_1.default.query(query);
        return res.status(200).json({
            success: true,
            message: 'Áreas de interconsulta obtenidas correctamente',
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al obtener áreas de interconsulta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener áreas de interconsulta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAreasInterconsulta = getAreasInterconsulta;
// ==========================================
// OBTENER ÁREA DE INTERCONSULTA POR ID
// ==========================================
const getAreaInterconsultaById = async (req, res) => {
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
        ai.id_area_interconsulta,
        ai.nombre,
        ai.descripcion,
        ai.activo,
        COUNT(ni.id_nota_interconsulta) AS total_interconsultas,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) AS interconsultas_semana,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS interconsultas_mes
      FROM area_interconsulta ai
      LEFT JOIN nota_interconsulta ni ON ai.id_area_interconsulta = ni.area_interconsulta
      LEFT JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      WHERE ai.id_area_interconsulta = $1
      GROUP BY ai.id_area_interconsulta, ai.nombre, ai.descripcion, ai.activo
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Área de interconsulta no encontrada'
            });
        }
        // Obtener las últimas 10 interconsultas de esta área
        const interconsultasQuery = `
      SELECT 
        ni.id_nota_interconsulta,
        ni.motivo_interconsulta,
        ni.diagnostico_presuntivo,
        ni.impresion_diagnostica,
        dc.fecha_elaboracion,
        CONCAT(p_solicitante.nombre, ' ', p_solicitante.apellido_paterno) as medico_solicitante,
        CONCAT(p_interconsulta.nombre, ' ', p_interconsulta.apellido_paterno) as medico_interconsulta,
        e.numero_expediente
      FROM nota_interconsulta ni
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      LEFT JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN personal_medico pm_sol ON ni.id_medico_solicitante = pm_sol.id_personal_medico
      LEFT JOIN persona p_solicitante ON pm_sol.id_persona = p_solicitante.id_persona
      LEFT JOIN personal_medico pm_int ON ni.id_medico_interconsulta = pm_int.id_personal_medico
      LEFT JOIN persona p_interconsulta ON pm_int.id_persona = p_interconsulta.id_persona
      WHERE ni.area_interconsulta = $1
      ORDER BY dc.fecha_elaboracion DESC
      LIMIT 10
    `;
        const interconsultasResponse = await database_1.default.query(interconsultasQuery, [id]);
        const areaData = response.rows[0];
        areaData.ultimas_interconsultas = interconsultasResponse.rows;
        return res.status(200).json({
            success: true,
            message: 'Área de interconsulta encontrada correctamente',
            data: areaData
        });
    }
    catch (error) {
        console.error('Error al obtener área de interconsulta por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener área de interconsulta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAreaInterconsultaById = getAreaInterconsultaById;
// ==========================================
// CREAR NUEVA ÁREA DE INTERCONSULTA
// ==========================================
const createAreaInterconsulta = async (req, res) => {
    try {
        const { nombre, descripcion, activo = true } = req.body;
        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre del área de interconsulta es obligatorio'
            });
        }
        // Verificar si ya existe un área con el mismo nombre
        const existeQuery = `
      SELECT id_area_interconsulta 
      FROM area_interconsulta 
      WHERE UPPER(nombre) = UPPER($1)
    `;
        const existeResponse = await database_1.default.query(existeQuery, [nombre.trim()]);
        if (existeResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un área de interconsulta con ese nombre'
            });
        }
        // Insertar nueva área
        const insertQuery = `
      INSERT INTO area_interconsulta (nombre, descripcion, activo) 
      VALUES ($1, $2, $3) 
      RETURNING id_area_interconsulta, nombre, descripcion, activo
    `;
        const response = await database_1.default.query(insertQuery, [
            nombre.trim(),
            descripcion?.trim() || null,
            activo
        ]);
        return res.status(201).json({
            success: true,
            message: 'Área de interconsulta creada correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear área de interconsulta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear área de interconsulta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createAreaInterconsulta = createAreaInterconsulta;
// ==========================================
// ACTUALIZAR ÁREA DE INTERCONSULTA
// ==========================================
const updateAreaInterconsulta = async (req, res) => {
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
                message: 'El nombre del área de interconsulta es obligatorio'
            });
        }
        // Verificar si el área existe
        const existeQuery = `
      SELECT id_area_interconsulta 
      FROM area_interconsulta 
      WHERE id_area_interconsulta = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Área de interconsulta no encontrada'
            });
        }
        // Verificar si ya existe otra área con el mismo nombre
        const duplicadoQuery = `
      SELECT id_area_interconsulta 
      FROM area_interconsulta 
      WHERE UPPER(nombre) = UPPER($1) AND id_area_interconsulta != $2
    `;
        const duplicadoResponse = await database_1.default.query(duplicadoQuery, [nombre.trim(), id]);
        if (duplicadoResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe otra área de interconsulta con ese nombre'
            });
        }
        // Actualizar área
        const updateQuery = `
      UPDATE area_interconsulta 
      SET nombre = $1, descripcion = $2, activo = $3
      WHERE id_area_interconsulta = $4 
      RETURNING id_area_interconsulta, nombre, descripcion, activo
    `;
        const response = await database_1.default.query(updateQuery, [
            nombre.trim(),
            descripcion?.trim() || null,
            activo,
            id
        ]);
        return res.status(200).json({
            success: true,
            message: 'Área de interconsulta actualizada correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al actualizar área de interconsulta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar área de interconsulta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateAreaInterconsulta = updateAreaInterconsulta;
// ==========================================
// ELIMINAR ÁREA DE INTERCONSULTA
// ==========================================
const deleteAreaInterconsulta = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar que el ID sea un número
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar si el área existe
        const existeQuery = `
      SELECT id_area_interconsulta, nombre 
      FROM area_interconsulta 
      WHERE id_area_interconsulta = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Área de interconsulta no encontrada'
            });
        }
        // Verificar si el área está siendo usada
        const usoQuery = `
      SELECT COUNT(*) as total
      FROM nota_interconsulta 
      WHERE area_interconsulta = $1
    `;
        const usoResponse = await database_1.default.query(usoQuery, [id]);
        const totalUso = parseInt(usoResponse.rows[0].total);
        if (totalUso > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar el área. Tiene ${totalUso} nota(s) de interconsulta asociada(s)`,
                details: {
                    interconsultas_asociadas: totalUso
                }
            });
        }
        // Eliminar área
        const deleteQuery = `
      DELETE FROM area_interconsulta 
      WHERE id_area_interconsulta = $1 
      RETURNING nombre
    `;
        const response = await database_1.default.query(deleteQuery, [id]);
        return res.status(200).json({
            success: true,
            message: `Área de interconsulta "${response.rows[0].nombre}" eliminada correctamente`
        });
    }
    catch (error) {
        console.error('Error al eliminar área de interconsulta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar área de interconsulta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.deleteAreaInterconsulta = deleteAreaInterconsulta;
// ==========================================
// OBTENER ÁREAS ACTIVAS (PARA SELECTS)
// ==========================================
const getAreasInterconsultaActivas = async (req, res) => {
    try {
        const query = `
      SELECT 
        id_area_interconsulta,
        nombre,
        descripcion
      FROM area_interconsulta 
      WHERE activo = true
      ORDER BY nombre ASC
    `;
        const response = await database_1.default.query(query);
        return res.status(200).json({
            success: true,
            message: 'Áreas de interconsulta activas obtenidas correctamente',
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al obtener áreas de interconsulta activas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener áreas activas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAreasInterconsultaActivas = getAreasInterconsultaActivas;
// ==========================================
// OBTENER ESTADÍSTICAS DE INTERCONSULTAS
// ==========================================
const getEstadisticasInterconsultas = async (req, res) => {
    try {
        const query = `
      SELECT 
        ai.id_area_interconsulta,
        ai.nombre,
        ai.descripcion,
        ai.activo,
        COUNT(ni.id_nota_interconsulta) AS total_interconsultas,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) AS interconsultas_semana,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS interconsultas_mes,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '1 year' THEN 1 END) AS interconsultas_ano
      FROM area_interconsulta ai
      LEFT JOIN nota_interconsulta ni ON ai.id_area_interconsulta = ni.area_interconsulta
      LEFT JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      GROUP BY ai.id_area_interconsulta, ai.nombre, ai.descripcion, ai.activo
      ORDER BY total_interconsultas DESC, ai.nombre ASC
    `;
        const response = await database_1.default.query(query);
        // Calcular estadísticas generales
        const totalAreas = response.rows.length;
        const areasActivas = response.rows.filter(row => row.activo).length;
        const totalInterconsultas = response.rows.reduce((sum, row) => sum + parseInt(row.total_interconsultas), 0);
        const interconsultasMes = response.rows.reduce((sum, row) => sum + parseInt(row.interconsultas_mes), 0);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de interconsultas obtenidas correctamente',
            data: {
                areas: response.rows,
                resumen: {
                    total_areas: totalAreas,
                    areas_activas: areasActivas,
                    total_interconsultas: totalInterconsultas,
                    interconsultas_mes_actual: interconsultasMes,
                    promedio_por_area: totalAreas > 0 ? Math.round(totalInterconsultas / totalAreas) : 0
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de interconsultas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasInterconsultas = getEstadisticasInterconsultas;
