"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstadisticasGuiasClinicas = exports.getGuiasClinicasActivas = exports.deleteGuiaClinica = exports.updateGuiaClinica = exports.createGuiaClinica = exports.getGuiaClinicaById = exports.getGuiasClinicas = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODAS LAS GUÍAS CLÍNICAS
// ==========================================
const getGuiasClinicas = async (req, res) => {
    try {
        const { area, fuente, activo } = req.query;
        let query = `
      SELECT 
        gc.id_guia_diagnostico,
        gc.area,
        gc.codigo,
        gc.nombre,
        gc.fuente,
        gc.fecha_actualizacion,
        gc.descripcion,
        gc.activo,
        COUNT(hc.id_historia_clinica) as total_historias_clinicas,
        COUNT(nu.id_nota_urgencias) as total_notas_urgencias,
        COUNT(np.id_nota_preoperatoria) as total_notas_preoperatorias,
        COUNT(ne.id_nota_egreso) as total_notas_egreso,
        COUNT(rt.id_referencia) as total_referencias
      FROM guia_clinica gc
      LEFT JOIN historia_clinica hc ON gc.id_guia_diagnostico = hc.id_guia_diagnostico
      LEFT JOIN nota_urgencias nu ON gc.id_guia_diagnostico = nu.id_guia_diagnostico
      LEFT JOIN nota_preoperatoria np ON gc.id_guia_diagnostico = np.id_guia_diagnostico
      LEFT JOIN nota_egreso ne ON gc.id_guia_diagnostico = ne.id_guia_diagnostico
      LEFT JOIN referencia_traslado rt ON gc.id_guia_diagnostico = rt.id_guia_diagnostico
      WHERE 1=1
    `;
        const params = [];
        let paramCounter = 1;
        // Filtrar por área si se especifica
        if (area) {
            query += ` AND UPPER(gc.area) LIKE UPPER($${paramCounter})`;
            params.push(`%${area}%`);
            paramCounter++;
        }
        // Filtrar por fuente si se especifica
        if (fuente) {
            query += ` AND UPPER(gc.fuente) LIKE UPPER($${paramCounter})`;
            params.push(`%${fuente}%`);
            paramCounter++;
        }
        // Filtrar por estado activo si se especifica
        if (activo !== undefined) {
            query += ` AND gc.activo = $${paramCounter}`;
            params.push(activo === 'true');
            paramCounter++;
        }
        query += `
      GROUP BY gc.id_guia_diagnostico, gc.area, gc.codigo, gc.nombre, 
               gc.fuente, gc.fecha_actualizacion, gc.descripcion, gc.activo
      ORDER BY gc.area ASC, gc.nombre ASC
    `;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Guías clínicas obtenidas correctamente',
            data: response.rows,
            total: response.rowCount,
            filtros_aplicados: {
                area: area || 'todas',
                fuente: fuente || 'todas',
                activo: activo || 'todas'
            }
        });
    }
    catch (error) {
        console.error('Error al obtener guías clínicas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener guías clínicas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getGuiasClinicas = getGuiasClinicas;
// ==========================================
// OBTENER GUÍA CLÍNICA POR ID
// ==========================================
const getGuiaClinicaById = async (req, res) => {
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
        gc.id_guia_diagnostico,
        gc.area,
        gc.codigo,
        gc.nombre,
        gc.fuente,
        gc.fecha_actualizacion,
        gc.descripcion,
        gc.activo,
        COUNT(hc.id_historia_clinica) as total_historias_clinicas,
        COUNT(nu.id_nota_urgencias) as total_notas_urgencias,
        COUNT(np.id_nota_preoperatoria) as total_notas_preoperatorias,
        COUNT(ne.id_nota_egreso) as total_notas_egreso,
        COUNT(rt.id_referencia) as total_referencias,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as usos_mes_actual
      FROM guia_clinica gc
      LEFT JOIN historia_clinica hc ON gc.id_guia_diagnostico = hc.id_guia_diagnostico
      LEFT JOIN nota_urgencias nu ON gc.id_guia_diagnostico = nu.id_guia_diagnostico
      LEFT JOIN nota_preoperatoria np ON gc.id_guia_diagnostico = np.id_guia_diagnostico
      LEFT JOIN nota_egreso ne ON gc.id_guia_diagnostico = ne.id_guia_diagnostico
      LEFT JOIN referencia_traslado rt ON gc.id_guia_diagnostico = rt.id_guia_diagnostico
      LEFT JOIN documento_clinico dc ON (
        hc.id_documento = dc.id_documento OR 
        nu.id_documento = dc.id_documento OR 
        np.id_documento = dc.id_documento OR 
        ne.id_documento = dc.id_documento OR 
        rt.id_documento = dc.id_documento
      )
      WHERE gc.id_guia_diagnostico = $1
      GROUP BY gc.id_guia_diagnostico, gc.area, gc.codigo, gc.nombre, 
               gc.fuente, gc.fecha_actualizacion, gc.descripcion, gc.activo
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Guía clínica no encontrada'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Guía clínica encontrada correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al obtener guía clínica por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener guía clínica',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getGuiaClinicaById = getGuiaClinicaById;
// ==========================================
// CREAR NUEVA GUÍA CLÍNICA
// ==========================================
const createGuiaClinica = async (req, res) => {
    try {
        const { area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo = true } = req.body;
        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la guía clínica es obligatorio'
            });
        }
        // Verificar si ya existe una guía con el mismo código (si se proporciona)
        if (codigo && codigo.trim() !== '') {
            const existeCodigoQuery = `
        SELECT id_guia_diagnostico 
        FROM guia_clinica 
        WHERE UPPER(codigo) = UPPER($1)
      `;
            const existeCodigoResponse = await database_1.default.query(existeCodigoQuery, [codigo.trim()]);
            if (existeCodigoResponse.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una guía clínica con ese código'
                });
            }
        }
        // Verificar si ya existe una guía con el mismo nombre
        const existeNombreQuery = `
      SELECT id_guia_diagnostico 
      FROM guia_clinica 
      WHERE UPPER(nombre) = UPPER($1)
    `;
        const existeNombreResponse = await database_1.default.query(existeNombreQuery, [nombre.trim()]);
        if (existeNombreResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una guía clínica con ese nombre'
            });
        }
        // Insertar nueva guía clínica
        const insertQuery = `
      INSERT INTO guia_clinica (area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
        const response = await database_1.default.query(insertQuery, [
            area?.trim() || null,
            codigo?.trim() || null,
            nombre.trim(),
            fuente?.trim() || null,
            fecha_actualizacion || null,
            descripcion?.trim() || null,
            activo
        ]);
        return res.status(201).json({
            success: true,
            message: 'Guía clínica creada correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear guía clínica:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear guía clínica',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createGuiaClinica = createGuiaClinica;
// ==========================================
// ACTUALIZAR GUÍA CLÍNICA
// ==========================================
const updateGuiaClinica = async (req, res) => {
    try {
        const { id } = req.params;
        const { area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo } = req.body;
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
                message: 'El nombre de la guía clínica es obligatorio'
            });
        }
        // Verificar si la guía existe
        const existeQuery = `
      SELECT id_guia_diagnostico 
      FROM guia_clinica 
      WHERE id_guia_diagnostico = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Guía clínica no encontrada'
            });
        }
        // Verificar si ya existe otra guía con el mismo código (si se proporciona)
        if (codigo && codigo.trim() !== '') {
            const duplicadoCodigoQuery = `
        SELECT id_guia_diagnostico 
        FROM guia_clinica 
        WHERE UPPER(codigo) = UPPER($1) AND id_guia_diagnostico != $2
      `;
            const duplicadoCodigoResponse = await database_1.default.query(duplicadoCodigoQuery, [codigo.trim(), id]);
            if (duplicadoCodigoResponse.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe otra guía clínica con ese código'
                });
            }
        }
        // Verificar si ya existe otra guía con el mismo nombre
        const duplicadoNombreQuery = `
      SELECT id_guia_diagnostico 
      FROM guia_clinica 
      WHERE UPPER(nombre) = UPPER($1) AND id_guia_diagnostico != $2
    `;
        const duplicadoNombreResponse = await database_1.default.query(duplicadoNombreQuery, [nombre.trim(), id]);
        if (duplicadoNombreResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe otra guía clínica con ese nombre'
            });
        }
        // Actualizar guía clínica
        const updateQuery = `
      UPDATE guia_clinica 
      SET 
        area = $1, 
        codigo = $2, 
        nombre = $3, 
        fuente = $4, 
        fecha_actualizacion = $5, 
        descripcion = $6, 
        activo = $7
      WHERE id_guia_diagnostico = $8 
      RETURNING *
    `;
        const response = await database_1.default.query(updateQuery, [
            area?.trim() || null,
            codigo?.trim() || null,
            nombre.trim(),
            fuente?.trim() || null,
            fecha_actualizacion || null,
            descripcion?.trim() || null,
            activo,
            id
        ]);
        return res.status(200).json({
            success: true,
            message: 'Guía clínica actualizada correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al actualizar guía clínica:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar guía clínica',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateGuiaClinica = updateGuiaClinica;
// ==========================================
// ELIMINAR GUÍA CLÍNICA
// ==========================================
const deleteGuiaClinica = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar que el ID sea un número
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar si la guía existe
        const existeQuery = `
      SELECT id_guia_diagnostico, nombre 
      FROM guia_clinica 
      WHERE id_guia_diagnostico = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Guía clínica no encontrada'
            });
        }
        // Verificar si la guía está siendo usada
        const usoQuery = `
      SELECT 
        (SELECT COUNT(*) FROM historia_clinica WHERE id_guia_diagnostico = $1) as historias_clinicas,
        (SELECT COUNT(*) FROM nota_urgencias WHERE id_guia_diagnostico = $1) as notas_urgencias,
        (SELECT COUNT(*) FROM nota_preoperatoria WHERE id_guia_diagnostico = $1) as notas_preoperatorias,
        (SELECT COUNT(*) FROM nota_egreso WHERE id_guia_diagnostico = $1) as notas_egreso,
        (SELECT COUNT(*) FROM referencia_traslado WHERE id_guia_diagnostico = $1) as referencias
    `;
        const usoResponse = await database_1.default.query(usoQuery, [id]);
        const uso = usoResponse.rows[0];
        const totalUso = parseInt(uso.historias_clinicas) +
            parseInt(uso.notas_urgencias) +
            parseInt(uso.notas_preoperatorias) +
            parseInt(uso.notas_egreso) +
            parseInt(uso.referencias);
        if (totalUso > 0) {
            return res.status(409).json({
                success: false,
                message: 'No se puede eliminar la guía clínica. Está siendo usada en documentos médicos',
                details: {
                    historias_clinicas: parseInt(uso.historias_clinicas),
                    notas_urgencias: parseInt(uso.notas_urgencias),
                    notas_preoperatorias: parseInt(uso.notas_preoperatorias),
                    notas_egreso: parseInt(uso.notas_egreso),
                    referencias: parseInt(uso.referencias),
                    total_documentos: totalUso
                }
            });
        }
        // Eliminar guía clínica
        const deleteQuery = `
      DELETE FROM guia_clinica 
      WHERE id_guia_diagnostico = $1 
      RETURNING nombre
    `;
        const response = await database_1.default.query(deleteQuery, [id]);
        return res.status(200).json({
            success: true,
            message: `Guía clínica "${response.rows[0].nombre}" eliminada correctamente`
        });
    }
    catch (error) {
        console.error('Error al eliminar guía clínica:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar guía clínica',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.deleteGuiaClinica = deleteGuiaClinica;
// ==========================================
// OBTENER GUÍAS ACTIVAS (PARA SELECTS)
// ==========================================
const getGuiasClinicasActivas = async (req, res) => {
    try {
        const { area } = req.query;
        let query = `
      SELECT 
        id_guia_diagnostico,
        area,
        codigo,
        nombre,
        fuente
      FROM guia_clinica 
      WHERE activo = true
    `;
        const params = [];
        // Filtrar por área si se especifica
        if (area) {
            query += ` AND UPPER(area) LIKE UPPER($1)`;
            params.push(`%${area}%`);
        }
        query += ` ORDER BY area ASC, nombre ASC`;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Guías clínicas activas obtenidas correctamente',
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al obtener guías clínicas activas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener guías activas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getGuiasClinicasActivas = getGuiasClinicasActivas;
// ==========================================
// OBTENER ESTADÍSTICAS DE GUÍAS CLÍNICAS
// ==========================================
const getEstadisticasGuiasClinicas = async (req, res) => {
    try {
        const query = `
      SELECT 
        gc.area,
        gc.fuente,
        COUNT(gc.id_guia_diagnostico) as total_guias,
        COUNT(CASE WHEN gc.activo = true THEN 1 END) as guias_activas,
        SUM(COALESCE(uso.total_usos, 0)) as total_usos,
        SUM(COALESCE(uso.usos_mes, 0)) as usos_mes_actual
      FROM guia_clinica gc
      LEFT JOIN (
        SELECT 
          id_guia_diagnostico,
          COUNT(*) as total_usos,
          COUNT(CASE WHEN fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as usos_mes
        FROM (
          SELECT hc.id_guia_diagnostico, dc.fecha_elaboracion
          FROM historia_clinica hc
          JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
          WHERE hc.id_guia_diagnostico IS NOT NULL
          
          UNION ALL
          
          SELECT nu.id_guia_diagnostico, dc.fecha_elaboracion
          FROM nota_urgencias nu
          JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
          WHERE nu.id_guia_diagnostico IS NOT NULL
          
          UNION ALL
          
          SELECT np.id_guia_diagnostico, dc.fecha_elaboracion
          FROM nota_preoperatoria np
          JOIN documento_clinico dc ON np.id_documento = dc.id_documento
          WHERE np.id_guia_diagnostico IS NOT NULL
          
          UNION ALL
          
          SELECT ne.id_guia_diagnostico, dc.fecha_elaboracion
          FROM nota_egreso ne
          JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
          WHERE ne.id_guia_diagnostico IS NOT NULL
          
          UNION ALL
          
          SELECT rt.id_guia_diagnostico, dc.fecha_elaboracion
          FROM referencia_traslado rt
          JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
          WHERE rt.id_guia_diagnostico IS NOT NULL
        ) todos_usos
        GROUP BY id_guia_diagnostico
      ) uso ON gc.id_guia_diagnostico = uso.id_guia_diagnostico
      GROUP BY gc.area, gc.fuente
      ORDER BY total_usos DESC, gc.area ASC
    `;
        const response = await database_1.default.query(query);
        // Calcular estadísticas generales
        const totalGuias = response.rows.reduce((sum, row) => sum + parseInt(row.total_guias), 0);
        const guiasActivas = response.rows.reduce((sum, row) => sum + parseInt(row.guias_activas), 0);
        const totalUsos = response.rows.reduce((sum, row) => sum + parseInt(row.total_usos), 0);
        const usosMes = response.rows.reduce((sum, row) => sum + parseInt(row.usos_mes_actual), 0);
        // Obtener las guías más utilizadas
        const masUtilizadasQuery = `
      SELECT 
        gc.id_guia_diagnostico,
        gc.area,
        gc.codigo,
        gc.nombre,
        gc.fuente,
        COUNT(*) as total_usos
      FROM guia_clinica gc
      JOIN (
        SELECT hc.id_guia_diagnostico FROM historia_clinica hc WHERE hc.id_guia_diagnostico IS NOT NULL
        UNION ALL
        SELECT nu.id_guia_diagnostico FROM nota_urgencias nu WHERE nu.id_guia_diagnostico IS NOT NULL
        UNION ALL
        SELECT np.id_guia_diagnostico FROM nota_preoperatoria np WHERE np.id_guia_diagnostico IS NOT NULL
        UNION ALL
        SELECT ne.id_guia_diagnostico FROM nota_egreso ne WHERE ne.id_guia_diagnostico IS NOT NULL
        UNION ALL
        SELECT rt.id_guia_diagnostico FROM referencia_traslado rt WHERE rt.id_guia_diagnostico IS NOT NULL
      ) usos ON gc.id_guia_diagnostico = usos.id_guia_diagnostico
      GROUP BY gc.id_guia_diagnostico, gc.area, gc.codigo, gc.nombre, gc.fuente
      ORDER BY total_usos DESC
      LIMIT 10
    `;
        const masUtilizadasResponse = await database_1.default.query(masUtilizadasQuery);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de guías clínicas obtenidas correctamente',
            data: {
                por_area_fuente: response.rows,
                mas_utilizadas: masUtilizadasResponse.rows,
                resumen: {
                    total_guias: totalGuias,
                    guias_activas: guiasActivas,
                    total_usos_historicos: totalUsos,
                    usos_mes_actual: usosMes,
                    promedio_usos_por_guia: totalGuias > 0 ? Math.round(totalUsos / totalGuias) : 0
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de guías clínicas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasGuiasClinicas = getEstadisticasGuiasClinicas;
