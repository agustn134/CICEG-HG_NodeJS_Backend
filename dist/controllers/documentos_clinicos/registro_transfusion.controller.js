"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarRegistroTransfusion = exports.getTiposComponentesDisponibles = exports.finalizarTransfusion = exports.getCompatibilidadSanguinea = exports.estadisticasTransfusiones = exports.getReaccionesAdversas = exports.searchRegistrosTransfusion = exports.getRegistrosTransfusionByPaciente = exports.getRegistrosTransfusionByExpediente = exports.deleteRegistroTransfusion = exports.updateRegistroTransfusion = exports.createRegistroTransfusion = exports.getRegistroTransfusionById = exports.getRegistrosTransfusion = void 0;
const database_1 = __importDefault(require("../../config/database"));
// Tipos de componentes sanguíneos válidos
const TIPOS_COMPONENTES = [
    'Sangre Total',
    'Concentrado Eritrocitario',
    'Plaquetas',
    'Plasma Fresco Congelado',
    'Crioprecipitado',
    'Albúmina',
    'Inmunoglobulina',
    'Factor VIII',
    'Factor IX',
    'Complejo Protrombínico'
];
// Grupos sanguíneos válidos
const GRUPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
// ==========================================
// FUNCIONES CRUD BÁSICAS
// ==========================================
const getRegistrosTransfusion = async (req, res) => {
    try {
        const { page = 1, limit = 10, tipo_componente, grupo_sanguineo, medico_responsable, fecha_inicio, fecha_fin, con_reacciones_adversas = 'all' // 'si', 'no', 'all'
         } = req.query;
        let query = `
      SELECT 
        rt.*,
        dc.fecha_documento,
        dc.observaciones as observaciones_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as medico_responsable,
        pm_rel.numero_cedula as cedula_medico,
        pm_rel.especialidad,
        s.nombre_servicio,
        ts.nombre as tipo_sangre_paciente,
        c.numero as numero_cama,
        EXTRACT(EPOCH FROM (rt.fecha_fin - rt.fecha_inicio))/3600 as duracion_horas,
        CASE 
          WHEN rt.reacciones_adversas IS NOT NULL AND rt.reacciones_adversas != '' THEN 'Sí'
          ELSE 'No'
        END as tuvo_reacciones,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos
      FROM registro_transfusion rt
      JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON rt.id_medico_responsable = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN servicio s ON dc.id_servicio = s.id_servicio
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN internamiento int ON dc.id_internamiento = int.id_internamiento
      LEFT JOIN cama c ON int.id_cama = c.id_cama
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 0;
        // Filtros dinámicos
        if (tipo_componente) {
            paramCount++;
            query += ` AND rt.tipo_componente ILIKE $${paramCount}`;
            params.push(`%${tipo_componente}%`);
        }
        if (grupo_sanguineo) {
            paramCount++;
            query += ` AND rt.grupo_sanguineo = $${paramCount}`;
            params.push(grupo_sanguineo);
        }
        if (medico_responsable) {
            paramCount++;
            query += ` AND rt.id_medico_responsable = $${paramCount}`;
            params.push(medico_responsable);
        }
        if (fecha_inicio) {
            paramCount++;
            query += ` AND rt.fecha_inicio >= $${paramCount}`;
            params.push(fecha_inicio);
        }
        if (fecha_fin) {
            paramCount++;
            query += ` AND rt.fecha_inicio <= $${paramCount}`;
            params.push(fecha_fin);
        }
        // Filtro por reacciones adversas
        if (con_reacciones_adversas === 'si') {
            query += ` AND rt.reacciones_adversas IS NOT NULL AND rt.reacciones_adversas != ''`;
        }
        else if (con_reacciones_adversas === 'no') {
            query += ` AND (rt.reacciones_adversas IS NULL OR rt.reacciones_adversas = '')`;
        }
        query += ` ORDER BY rt.fecha_inicio DESC`;
        // Paginación
        const offset = (Number(page) - 1) * Number(limit);
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(limit);
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(offset);
        const response = await database_1.default.query(query, params);
        // Contar total de registros para paginación
        let countQuery = `
      SELECT COUNT(*) as total
      FROM registro_transfusion rt
      JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
      WHERE 1=1
    `;
        const countParams = [];
        let countParamCount = 0;
        if (tipo_componente) {
            countParamCount++;
            countQuery += ` AND rt.tipo_componente ILIKE $${countParamCount}`;
            countParams.push(`%${tipo_componente}%`);
        }
        if (grupo_sanguineo) {
            countParamCount++;
            countQuery += ` AND rt.grupo_sanguineo = $${countParamCount}`;
            countParams.push(grupo_sanguineo);
        }
        if (medico_responsable) {
            countParamCount++;
            countQuery += ` AND rt.id_medico_responsable = $${countParamCount}`;
            countParams.push(medico_responsable);
        }
        if (fecha_inicio) {
            countParamCount++;
            countQuery += ` AND rt.fecha_inicio >= $${countParamCount}`;
            countParams.push(fecha_inicio);
        }
        if (fecha_fin) {
            countParamCount++;
            countQuery += ` AND rt.fecha_inicio <= $${countParamCount}`;
            countParams.push(fecha_fin);
        }
        if (con_reacciones_adversas === 'si') {
            countQuery += ` AND rt.reacciones_adversas IS NOT NULL AND rt.reacciones_adversas != ''`;
        }
        else if (con_reacciones_adversas === 'no') {
            countQuery += ` AND (rt.reacciones_adversas IS NULL OR rt.reacciones_adversas = '')`;
        }
        const countResult = await database_1.default.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);
        return res.status(200).json({
            success: true,
            data: response.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error al obtener registros de transfusión:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener registros de transfusión",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getRegistrosTransfusion = getRegistrosTransfusion;
const getRegistroTransfusionById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        rt.*,
        dc.fecha_documento,
        dc.observaciones as observaciones_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as medico_responsable,
        pm_rel.numero_cedula as cedula_medico,
        pm_rel.especialidad,
        s.nombre_servicio,
        ts.nombre as tipo_sangre_paciente,
        c.numero as numero_cama,
        c.area as area_cama,
        EXTRACT(EPOCH FROM (rt.fecha_fin - rt.fecha_inicio))/3600 as duracion_horas,
        CASE 
          WHEN rt.reacciones_adversas IS NOT NULL AND rt.reacciones_adversas != '' THEN 'Sí'
          ELSE 'No'
        END as tuvo_reacciones,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos,
        -- Información del internamiento
        int.fecha_ingreso,
        int.diagnostico_ingreso
      FROM registro_transfusion rt
      JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON rt.id_medico_responsable = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN servicio s ON dc.id_servicio = s.id_servicio
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN internamiento int ON dc.id_internamiento = int.id_internamiento
      LEFT JOIN cama c ON int.id_cama = c.id_cama
      WHERE rt.id_transfusion = $1
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Registro de transfusión no encontrado"
            });
        }
        return res.status(200).json({
            success: true,
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al obtener registro de transfusión por ID:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener registro de transfusión",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getRegistroTransfusionById = getRegistroTransfusionById;
const createRegistroTransfusion = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id_documento, tipo_componente, grupo_sanguineo, numero_unidad, volumen, fecha_inicio, fecha_fin, id_medico_responsable, reacciones_adversas, observaciones } = req.body;
        // Validaciones obligatorias
        if (!tipo_componente || tipo_componente.trim() === '') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "El tipo de componente es obligatorio"
            });
        }
        if (!grupo_sanguineo || !GRUPOS_SANGUINEOS.includes(grupo_sanguineo)) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: `El grupo sanguíneo debe ser uno de: ${GRUPOS_SANGUINEOS.join(', ')}`
            });
        }
        if (!numero_unidad || numero_unidad.trim() === '') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "El número de unidad es obligatorio"
            });
        }
        if (!fecha_inicio) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "La fecha de inicio es obligatoria"
            });
        }
        // Validar que el documento clínico existe
        const docQuery = await client.query('SELECT id_documento FROM documento_clinico WHERE id_documento = $1', [id_documento]);
        if (docQuery.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "El documento clínico especificado no existe"
            });
        }
        // Validar que el médico responsable existe si se especifica
        if (id_medico_responsable) {
            const medicoQuery = await client.query('SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1 AND activo = true', [id_medico_responsable]);
            if (medicoQuery.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: "El médico responsable especificado no existe o no está activo"
                });
            }
        }
        // Validar que la fecha de fin sea posterior a la de inicio si se especifica
        if (fecha_fin && new Date(fecha_fin) <= new Date(fecha_inicio)) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "La fecha de fin debe ser posterior a la fecha de inicio"
            });
        }
        // Verificar que no exista ya un registro con el mismo número de unidad
        const unitQuery = await client.query('SELECT id_transfusion FROM registro_transfusion WHERE numero_unidad = $1', [numero_unidad]);
        if (unitQuery.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "Ya existe un registro de transfusión con este número de unidad"
            });
        }
        // Insertar registro de transfusión
        const insertQuery = `
      INSERT INTO registro_transfusion (
        id_documento, tipo_componente, grupo_sanguineo, numero_unidad,
        volumen, fecha_inicio, fecha_fin, id_medico_responsable,
        reacciones_adversas, observaciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
        const response = await client.query(insertQuery, [
            id_documento, tipo_componente, grupo_sanguineo, numero_unidad,
            volumen, fecha_inicio, fecha_fin, id_medico_responsable,
            reacciones_adversas, observaciones
        ]);
        await client.query('COMMIT');
        return res.status(201).json({
            success: true,
            message: "Registro de transfusión creado exitosamente",
            data: response.rows[0]
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear registro de transfusión:', error);
        return res.status(500).json({
            success: false,
            message: "Error al crear registro de transfusión",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
    finally {
        client.release();
    }
};
exports.createRegistroTransfusion = createRegistroTransfusion;
const updateRegistroTransfusion = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const updateData = req.body;
        // Verificar que el registro existe
        const existsQuery = await client.query('SELECT id_transfusion FROM registro_transfusion WHERE id_transfusion = $1', [id]);
        if (existsQuery.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: "Registro de transfusión no encontrado"
            });
        }
        // Construir query dinámico para actualización
        const fields = Object.keys(updateData).filter(key => updateData[key] !== undefined);
        const values = fields.map(field => updateData[field]);
        if (fields.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "No hay campos para actualizar"
            });
        }
        // Validaciones específicas
        if (updateData.grupo_sanguineo && !GRUPOS_SANGUINEOS.includes(updateData.grupo_sanguineo)) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: `El grupo sanguíneo debe ser uno de: ${GRUPOS_SANGUINEOS.join(', ')}`
            });
        }
        // Validar número de unidad único si se está actualizando
        if (updateData.numero_unidad) {
            const unitQuery = await client.query('SELECT id_transfusion FROM registro_transfusion WHERE numero_unidad = $1 AND id_transfusion != $2', [updateData.numero_unidad, id]);
            if (unitQuery.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: "Ya existe otro registro de transfusión con este número de unidad"
                });
            }
        }
        // Validar médico responsable si se está actualizando
        if (updateData.id_medico_responsable) {
            const medicoQuery = await client.query('SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1 AND activo = true', [updateData.id_medico_responsable]);
            if (medicoQuery.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: "El médico responsable especificado no existe o no está activo"
                });
            }
        }
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const updateQuery = `
      UPDATE registro_transfusion 
      SET ${setClause}
      WHERE id_transfusion = $1
      RETURNING *
    `;
        const response = await client.query(updateQuery, [id, ...values]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: "Registro de transfusión actualizado exitosamente",
            data: response.rows[0]
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar registro de transfusión:', error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar registro de transfusión",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
    finally {
        client.release();
    }
};
exports.updateRegistroTransfusion = updateRegistroTransfusion;
const deleteRegistroTransfusion = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await database_1.default.query("DELETE FROM registro_transfusion WHERE id_transfusion = $1 RETURNING *", [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Registro de transfusión no encontrado"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Registro de transfusión eliminado exitosamente",
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al eliminar registro de transfusión:', error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar registro de transfusión",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.deleteRegistroTransfusion = deleteRegistroTransfusion;
// ==========================================
// FUNCIONES ESPECÍFICAS Y CONSULTAS AVANZADAS
// ==========================================
const getRegistrosTransfusionByExpediente = async (req, res) => {
    try {
        const { id_expediente } = req.params;
        const query = `
      SELECT 
        rt.*,
        dc.fecha_documento,
        pm.nombre || ' ' || pm.apellido_paterno as medico_responsable,
        EXTRACT(EPOCH FROM (rt.fecha_fin - rt.fecha_inicio))/3600 as duracion_horas,
        CASE 
          WHEN rt.reacciones_adversas IS NOT NULL AND rt.reacciones_adversas != '' THEN 'Sí'
          ELSE 'No'
        END as tuvo_reacciones
      FROM registro_transfusion rt
      JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm_rel ON rt.id_medico_responsable = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      WHERE dc.id_expediente = $1
      ORDER BY rt.fecha_inicio DESC
    `;
        const response = await database_1.default.query(query, [id_expediente]);
        return res.status(200).json({
            success: true,
            data: response.rows
        });
    }
    catch (error) {
        console.error('Error al obtener registros de transfusión por expediente:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener registros de transfusión por expediente",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getRegistrosTransfusionByExpediente = getRegistrosTransfusionByExpediente;
const getRegistrosTransfusionByPaciente = async (req, res) => {
    try {
        const { id_paciente } = req.params;
        const query = `
      SELECT 
        rt.*,
        dc.fecha_documento,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as medico_responsable,
        EXTRACT(EPOCH FROM (rt.fecha_fin - rt.fecha_inicio))/3600 as duracion_horas,
        CASE 
          WHEN rt.reacciones_adversas IS NOT NULL AND rt.reacciones_adversas != '' THEN 'Sí'
          ELSE 'No'
        END as tuvo_reacciones
      FROM registro_transfusion rt
      JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN personal_medico pm_rel ON rt.id_medico_responsable = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      WHERE e.id_paciente = $1
      ORDER BY rt.fecha_inicio DESC
    `;
        const response = await database_1.default.query(query, [id_paciente]);
        return res.status(200).json({
            success: true,
            data: response.rows
        });
    }
    catch (error) {
        console.error('Error al obtener registros de transfusión por paciente:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener registros de transfusión por paciente",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getRegistrosTransfusionByPaciente = getRegistrosTransfusionByPaciente;
const searchRegistrosTransfusion = async (req, res) => {
    try {
        const { query: searchQuery } = req.params;
        const query = `
      SELECT 
        rt.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as medico_responsable,
        CASE 
          WHEN rt.reacciones_adversas IS NOT NULL AND rt.reacciones_adversas != '' THEN 'Sí'
          ELSE 'No'
        END as tuvo_reacciones
      FROM registro_transfusion rt
      JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON rt.id_medico_responsable = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      WHERE 
        rt.tipo_componente ILIKE $1 OR
        rt.numero_unidad ILIKE $1 OR
        rt.grupo_sanguineo ILIKE $1 OR
        p.nombre ILIKE $1 OR
        p.apellido_paterno ILIKE $1 OR
        e.numero_expediente ILIKE $1
      ORDER BY rt.fecha_inicio DESC
      LIMIT 20
    `;
        const response = await database_1.default.query(query, [`%${searchQuery}%`]);
        return res.status(200).json({
            success: true,
            data: response.rows
        });
    }
    catch (error) {
        console.error('Error al buscar registros de transfusión:', error);
        return res.status(500).json({
            success: false,
            message: "Error al buscar registros de transfusión",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.searchRegistrosTransfusion = searchRegistrosTransfusion;
const getReaccionesAdversas = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        let query = `
      SELECT 
        rt.id_transfusion,
        rt.tipo_componente,
        rt.grupo_sanguineo,
        rt.numero_unidad,
        rt.fecha_inicio,
        rt.reacciones_adversas,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as medico_responsable,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos
      FROM registro_transfusion rt
      JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON rt.id_medico_responsable = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      WHERE rt.reacciones_adversas IS NOT NULL AND rt.reacciones_adversas != ''
    `;
        const params = [];
        let paramCount = 0;
        if (fecha_inicio) {
            paramCount++;
            query += ` AND rt.fecha_inicio >= $${paramCount}`;
            params.push(fecha_inicio);
        }
        if (fecha_fin) {
            paramCount++;
            query += ` AND rt.fecha_inicio <= $${paramCount}`;
            params.push(fecha_fin);
        }
        query += ` ORDER BY rt.fecha_inicio DESC`;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            data: response.rows,
            total_reacciones: response.rows.length
        });
    }
    catch (error) {
        console.error('Error al obtener reacciones adversas:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener reacciones adversas",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getReaccionesAdversas = getReaccionesAdversas;
const estadisticasTransfusiones = async (req, res) => {
    try {
        // Estadísticas por tipo de componente
        const porComponenteQuery = `
      SELECT 
        tipo_componente,
        COUNT(*) as total_transfusiones,
        COUNT(CASE WHEN reacciones_adversas IS NOT NULL AND reacciones_adversas != '' THEN 1 END) as con_reacciones,
        ROUND(AVG(volumen), 2) as volumen_promedio,
        ROUND(AVG(EXTRACT(EPOCH FROM (fecha_fin - fecha_inicio))/3600), 2) as duracion_promedio_horas
      FROM registro_transfusion
      WHERE fecha_inicio >= CURRENT_DATE - INTERVAL '90 days'
      GROUP BY tipo_componente
      ORDER BY total_transfusiones DESC
    `;
        // Estadísticas por grupo sanguíneo
        const porGrupoQuery = `
      SELECT 
        grupo_sanguineo,
        COUNT(*) as total_transfusiones,
        COUNT(CASE WHEN reacciones_adversas IS NOT NULL AND reacciones_adversas != '' THEN 1 END) as con_reacciones,
        ROUND((COUNT(CASE WHEN reacciones_adversas IS NOT NULL AND reacciones_adversas != '' THEN 1 END) * 100.0 / COUNT(*)), 2) as porcentaje_reacciones
      FROM registro_transfusion
      WHERE fecha_inicio >= CURRENT_DATE - INTERVAL '90 days'
      GROUP BY grupo_sanguineo
      ORDER BY total_transfusiones DESC
    `;
        // Estadísticas por mes
        const porMesQuery = `
      SELECT 
        DATE_TRUNC('month', fecha_inicio) as mes,
        COUNT(*) as total_transfusiones,
        COUNT(CASE WHEN reacciones_adversas IS NOT NULL AND reacciones_adversas != '' THEN 1 END) as con_reacciones,
        COUNT(DISTINCT id_documento) as pacientes_transfundidos
      FROM registro_transfusion
      WHERE fecha_inicio >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', fecha_inicio)
      ORDER BY mes DESC
    `;
        // Médicos que más transfusiones realizan
        const medicosQuery = `
      SELECT 
        p.nombre || ' ' || p.apellido_paterno as medico_responsable,
        pm.especialidad,
        COUNT(rt.id_transfusion) as total_transfusiones,
        COUNT(CASE WHEN rt.reacciones_adversas IS NOT NULL AND rt.reacciones_adversas != '' THEN 1 END) as con_reacciones
      FROM registro_transfusion rt
      JOIN personal_medico pm ON rt.id_medico_responsable = pm.id_personal_medico
      JOIN persona p ON pm.id_persona = p.id_persona
      WHERE rt.fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY pm.id_personal_medico, p.nombre, p.apellido_paterno, pm.especialidad
      ORDER BY total_transfusiones DESC
      LIMIT 10
    `;
        const [porComponenteResult, porGrupoResult, porMesResult, medicosResult] = await Promise.all([
            database_1.default.query(porComponenteQuery),
            database_1.default.query(porGrupoQuery),
            database_1.default.query(porMesQuery),
            database_1.default.query(medicosQuery)
        ]);
        return res.status(200).json({
            success: true,
            data: {
                por_tipo_componente: porComponenteResult.rows,
                por_grupo_sanguineo: porGrupoResult.rows,
                por_mes: porMesResult.rows,
                medicos_mas_activos: medicosResult.rows
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de transfusiones:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener estadísticas",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.estadisticasTransfusiones = estadisticasTransfusiones;
const getCompatibilidadSanguinea = async (req, res) => {
    try {
        const { grupo_sanguineo_paciente } = req.params;
        if (!GRUPOS_SANGUINEOS.includes(grupo_sanguineo_paciente)) {
            return res.status(400).json({
                success: false,
                message: `El grupo sanguíneo debe ser uno de: ${GRUPOS_SANGUINEOS.join(', ')}`
            });
        }
        // Definir compatibilidades según protocolos médicos
        const compatibilidades = {
            'O-': ['O-'],
            'O+': ['O-', 'O+'],
            'A-': ['O-', 'A-'],
            'A+': ['O-', 'O+', 'A-', 'A+'],
            'B-': ['O-', 'B-'],
            'B+': ['O-', 'O+', 'B-', 'B+'],
            'AB-': ['O-', 'A-', 'B-', 'AB-'],
            'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
        };
        const gruposCompatibles = compatibilidades[grupo_sanguineo_paciente] || [];
        // Buscar unidades disponibles (esto sería en un sistema real de banco de sangre)
        const disponibilidadQuery = `
      SELECT 
        rt.grupo_sanguineo,
        rt.tipo_componente,
        COUNT(*) as unidades_utilizadas,
        CASE 
          WHEN rt.grupo_sanguineo = ANY($1) THEN 'Compatible'
          ELSE 'No Compatible'
        END as compatibilidad
      FROM registro_transfusion rt
      WHERE rt.fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY rt.grupo_sanguineo, rt.tipo_componente
      ORDER BY rt.grupo_sanguineo, rt.tipo_componente
    `;
        const response = await database_1.default.query(disponibilidadQuery, [gruposCompatibles]);
        return res.status(200).json({
            success: true,
            data: {
                grupo_sanguineo_paciente,
                grupos_compatibles: gruposCompatibles,
                uso_reciente_por_tipo: response.rows,
                recomendaciones: {
                    ideal: grupo_sanguineo_paciente,
                    alternativas: gruposCompatibles.filter(g => g !== grupo_sanguineo_paciente),
                    donador_universal: 'O-',
                    receptor_universal: 'AB+'
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener compatibilidad sanguínea:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener compatibilidad sanguínea",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getCompatibilidadSanguinea = getCompatibilidadSanguinea;
const finalizarTransfusion = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { fecha_fin, reacciones_adversas, observaciones_finalizacion } = req.body;
        if (!fecha_fin) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "La fecha de finalización es obligatoria"
            });
        }
        // Verificar que la transfusión existe y no está finalizada
        const transfusionQuery = await client.query('SELECT id_transfusion, fecha_inicio, fecha_fin FROM registro_transfusion WHERE id_transfusion = $1', [id]);
        if (transfusionQuery.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: "Registro de transfusión no encontrado"
            });
        }
        const transfusion = transfusionQuery.rows[0];
        if (transfusion.fecha_fin) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "Esta transfusión ya ha sido finalizada"
            });
        }
        // Validar que la fecha de fin sea posterior al inicio
        if (new Date(fecha_fin) <= new Date(transfusion.fecha_inicio)) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: "La fecha de finalización debe ser posterior a la fecha de inicio"
            });
        }
        // Actualizar la transfusión
        const updateQuery = `
      UPDATE registro_transfusion 
      SET 
        fecha_fin = $2,
        reacciones_adversas = COALESCE($3, reacciones_adversas),
        observaciones = CASE 
          WHEN observaciones IS NOT NULL AND observaciones != '' 
          THEN observaciones || ' | FINALIZACIÓN: ' || COALESCE($4, 'Sin observaciones adicionales')
          ELSE 'FINALIZACIÓN: ' || COALESCE($4, 'Sin observaciones adicionales')
        END
      WHERE id_transfusion = $1
      RETURNING *
    `;
        const response = await client.query(updateQuery, [
            id, fecha_fin, reacciones_adversas, observaciones_finalizacion
        ]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: "Transfusión finalizada exitosamente",
            data: response.rows[0]
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al finalizar transfusión:', error);
        return res.status(500).json({
            success: false,
            message: "Error al finalizar transfusión",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
    finally {
        client.release();
    }
};
exports.finalizarTransfusion = finalizarTransfusion;
const getTiposComponentesDisponibles = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: {
                tipos_componentes: TIPOS_COMPONENTES,
                grupos_sanguineos: GRUPOS_SANGUINEOS,
                descripcion_componentes: {
                    'Sangre Total': 'Sangre completa con todos sus componentes',
                    'Concentrado Eritrocitario': 'Glóbulos rojos concentrados',
                    'Plaquetas': 'Concentrado de plaquetas para hemostasia',
                    'Plasma Fresco Congelado': 'Factores de coagulación',
                    'Crioprecipitado': 'Factor VIII, fibrinógeno, factor XIII',
                    'Albúmina': 'Proteína plasmática para expansión de volumen',
                    'Inmunoglobulina': 'Anticuerpos específicos',
                    'Factor VIII': 'Factor específico de coagulación',
                    'Factor IX': 'Factor específico de coagulación',
                    'Complejo Protrombínico': 'Factores II, VII, IX, X'
                },
                indicaciones_generales: {
                    'Sangre Total': 'Pérdida masiva de sangre, cirugía mayor',
                    'Concentrado Eritrocitario': 'Anemia severa, pérdida crónica',
                    'Plaquetas': 'Trombocitopenia, disfunción plaquetaria',
                    'Plasma Fresco Congelado': 'Deficiencia de factores de coagulación',
                    'Crioprecipitado': 'Hemofilia A, deficiencia de fibrinógeno'
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener tipos de componentes:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener tipos de componentes",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getTiposComponentesDisponibles = getTiposComponentesDisponibles;
const validarRegistroTransfusion = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        rt.*,
        CASE 
          WHEN rt.tipo_componente IS NULL OR rt.tipo_componente = '' THEN false
          ELSE true
        END as tiene_tipo_componente,
        CASE 
          WHEN rt.grupo_sanguineo IS NULL OR rt.grupo_sanguineo = '' THEN false
          ELSE true
        END as tiene_grupo_sanguineo,
        CASE 
          WHEN rt.numero_unidad IS NULL OR rt.numero_unidad = '' THEN false
          ELSE true
        END as tiene_numero_unidad,
        CASE 
          WHEN rt.fecha_inicio IS NULL THEN false
          ELSE true
        END as tiene_fecha_inicio,
        CASE 
          WHEN rt.id_medico_responsable IS NULL THEN false
          ELSE true
        END as tiene_medico_responsable,
        CASE 
          WHEN rt.fecha_fin IS NULL THEN false
          ELSE true
        END as esta_finalizada
      FROM registro_transfusion rt
      WHERE rt.id_transfusion = $1
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Registro de transfusión no encontrado"
            });
        }
        const registro = response.rows[0];
        const camposObligatorios = ['tiene_tipo_componente', 'tiene_grupo_sanguineo', 'tiene_numero_unidad', 'tiene_fecha_inicio'];
        const camposFaltantes = camposObligatorios.filter(campo => !registro[campo]);
        const esValido = camposFaltantes.length === 0;
        const estado = registro.esta_finalizada ? 'Finalizada' : 'En Proceso';
        return res.status(200).json({
            success: true,
            data: {
                id_transfusion: registro.id_transfusion,
                es_valido: esValido,
                estado: estado,
                validacion: {
                    tipo_componente: registro.tiene_tipo_componente,
                    grupo_sanguineo: registro.tiene_grupo_sanguineo,
                    numero_unidad: registro.tiene_numero_unidad,
                    fecha_inicio: registro.tiene_fecha_inicio,
                    medico_responsable: registro.tiene_medico_responsable,
                    finalizada: registro.esta_finalizada
                },
                campos_faltantes: camposFaltantes.map(campo => campo.replace('tiene_', '')),
                alertas: {
                    sin_medico: !registro.tiene_medico_responsable ? 'Se recomienda asignar médico responsable' : null,
                    sin_finalizar: !registro.esta_finalizada ? 'Transfusión pendiente de finalizar' : null,
                    reacciones: registro.reacciones_adversas ? 'Presenta reacciones adversas documentadas' : null
                }
            }
        });
    }
    catch (error) {
        console.error('Error al validar registro de transfusión:', error);
        return res.status(500).json({
            success: false,
            message: "Error al validar registro de transfusión",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.validarRegistroTransfusion = validarRegistroTransfusion;
