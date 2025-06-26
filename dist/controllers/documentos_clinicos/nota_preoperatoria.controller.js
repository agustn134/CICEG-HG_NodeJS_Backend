"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotasPreoperatoriaByExpediente = exports.deleteNotaPreoperatoria = exports.updateNotaPreoperatoria = exports.createNotaPreoperatoria = exports.getNotaPreoperatoriaById = exports.getNotasPreoperatoria = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// FUNCIONES CRUD BÁSICAS
// ==========================================
const getNotasPreoperatoria = async (req, res) => {
    try {
        const query = `
      SELECT 
        np.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        gc.nombre_guia_diagnostico
      FROM nota_preoperatoria np
      JOIN documento_clinico dc ON np.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON np.id_guia_diagnostico = gc.id_guia_diagnostico
      ORDER BY dc.fecha_documento DESC
    `;
        const response = await database_1.default.query(query);
        return res.status(200).json({
            success: true,
            data: response.rows
        });
    }
    catch (error) {
        console.error('Error al obtener notas preoperatorias:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener notas preoperatorias",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNotasPreoperatoria = getNotasPreoperatoria;
const getNotaPreoperatoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        np.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        gc.nombre_guia_diagnostico,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos
      FROM nota_preoperatoria np
      JOIN documento_clinico dc ON np.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON np.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE np.id_nota_preoperatoria = $1
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Nota preoperatoria no encontrada"
            });
        }
        return res.status(200).json({
            success: true,
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al obtener nota preoperatoria por ID:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener nota preoperatoria",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNotaPreoperatoriaById = getNotaPreoperatoriaById;
const createNotaPreoperatoria = async (req, res) => {
    try {
        const { id_documento, fecha_cirugia, resumen_interrogatorio, exploracion_fisica, resultados_estudios, diagnostico_preoperatorio, id_guia_diagnostico, plan_quirurgico, plan_terapeutico_preoperatorio, pronostico, tipo_cirugia, riesgo_quirurgico } = req.body;
        const insertQuery = `
      INSERT INTO nota_preoperatoria (
        id_documento, fecha_cirugia, resumen_interrogatorio, exploracion_fisica,
        resultados_estudios, diagnostico_preoperatorio, id_guia_diagnostico,
        plan_quirurgico, plan_terapeutico_preoperatorio, pronostico,
        tipo_cirugia, riesgo_quirurgico
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
        const response = await database_1.default.query(insertQuery, [
            id_documento, fecha_cirugia, resumen_interrogatorio, exploracion_fisica,
            resultados_estudios, diagnostico_preoperatorio, id_guia_diagnostico,
            plan_quirurgico, plan_terapeutico_preoperatorio, pronostico,
            tipo_cirugia, riesgo_quirurgico
        ]);
        return res.status(201).json({
            success: true,
            message: "Nota preoperatoria creada exitosamente",
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear nota preoperatoria:', error);
        return res.status(500).json({
            success: false,
            message: "Error al crear nota preoperatoria",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.createNotaPreoperatoria = createNotaPreoperatoria;
const updateNotaPreoperatoria = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const fields = Object.keys(updateData).filter(key => updateData[key] !== undefined);
        const values = fields.map(field => updateData[field]);
        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No hay campos para actualizar"
            });
        }
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const updateQuery = `
      UPDATE nota_preoperatoria 
      SET ${setClause}
      WHERE id_nota_preoperatoria = $1
      RETURNING *
    `;
        const response = await database_1.default.query(updateQuery, [id, ...values]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Nota preoperatoria no encontrada"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Nota preoperatoria actualizada exitosamente",
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al actualizar nota preoperatoria:', error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar nota preoperatoria",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.updateNotaPreoperatoria = updateNotaPreoperatoria;
const deleteNotaPreoperatoria = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await database_1.default.query("DELETE FROM nota_preoperatoria WHERE id_nota_preoperatoria = $1 RETURNING *", [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Nota preoperatoria no encontrada"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Nota preoperatoria eliminada exitosamente"
        });
    }
    catch (error) {
        console.error('Error al eliminar nota preoperatoria:', error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar nota preoperatoria",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.deleteNotaPreoperatoria = deleteNotaPreoperatoria;
// ==========================================
// FUNCIONES ADICIONALES BÁSICAS
// ==========================================
const getNotasPreoperatoriaByExpediente = async (req, res) => {
    try {
        const { id_expediente } = req.params;
        const query = `
      SELECT 
        np.*,
        dc.fecha_documento,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico
      FROM nota_preoperatoria np
      JOIN documento_clinico dc ON np.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      WHERE dc.id_expediente = $1
      ORDER BY dc.fecha_documento DESC
    `;
        const response = await database_1.default.query(query, [id_expediente]);
        return res.status(200).json({
            success: true,
            data: response.rows
        });
    }
    catch (error) {
        console.error('Error al obtener notas preoperatorias por expediente:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener notas preoperatorias por expediente",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNotasPreoperatoriaByExpediente = getNotasPreoperatoriaByExpediente;
