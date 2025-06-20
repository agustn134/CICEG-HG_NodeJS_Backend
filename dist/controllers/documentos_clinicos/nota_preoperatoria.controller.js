"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotaPreoperatoria = exports.updateNotaPreoperatoria = exports.createNotaPreoperatoria = exports.getNotaPreoperatoriaById = exports.getNotasPreoperatoria = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getNotasPreoperatoria = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM nota_preoperatoria");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener notas preoperatorias");
    }
};
exports.getNotasPreoperatoria = getNotasPreoperatoria;
const getNotaPreoperatoriaById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM nota_preoperatoria WHERE id_nota_preoperatoria = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota preoperatoria no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener nota preoperatoria por ID");
    }
};
exports.getNotaPreoperatoriaById = getNotaPreoperatoriaById;
const createNotaPreoperatoria = async (req, res) => {
    try {
        const { id_documento, fecha_cirugia, resumen_interrogatorio, exploracion_fisica, resultados_estudios, diagnostico_preoperatorio, id_guia_diagnostico, plan_quirurgico, plan_terapeutico_preoperatorio, pronostico, tipo_cirugia, riesgo_quirurgico } = req.body;
        const response = await database_1.default.query("INSERT INTO nota_preoperatoria (id_documento, fecha_cirugia, resumen_interrogatorio, exploracion_fisica, resultados_estudios, diagnostico_preoperatorio, id_guia_diagnostico, plan_quirurgico, plan_terapeutico_preoperatorio, pronostico, tipo_cirugia, riesgo_quirurgico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *", [
            id_documento,
            fecha_cirugia,
            resumen_interrogatorio,
            exploracion_fisica,
            resultados_estudios,
            diagnostico_preoperatorio,
            id_guia_diagnostico,
            plan_quirurgico,
            plan_terapeutico_preoperatorio,
            pronostico,
            tipo_cirugia,
            riesgo_quirurgico
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear nota preoperatoria");
    }
};
exports.createNotaPreoperatoria = createNotaPreoperatoria;
const updateNotaPreoperatoria = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, fecha_cirugia, resumen_interrogatorio, exploracion_fisica, resultados_estudios, diagnostico_preoperatorio, id_guia_diagnostico, plan_quirurgico, plan_terapeutico_preoperatorio, pronostico, tipo_cirugia, riesgo_quirurgico } = req.body;
        const response = await database_1.default.query("UPDATE nota_preoperatoria SET id_documento = $1, fecha_cirugia = $2, resumen_interrogatorio = $3, exploracion_fisica = $4, resultados_estudios = $5, diagnostico_preoperatorio = $6, id_guia_diagnostico = $7, plan_quirurgico = $8, plan_terapeutico_preoperatorio = $9, pronostico = $10, tipo_cirugia = $11, riesgo_quirurgico = $12 WHERE id_nota_preoperatoria = $13 RETURNING *", [
            id_documento,
            fecha_cirugia,
            resumen_interrogatorio,
            exploracion_fisica,
            resultados_estudios,
            diagnostico_preoperatorio,
            id_guia_diagnostico,
            plan_quirurgico,
            plan_terapeutico_preoperatorio,
            pronostico,
            tipo_cirugia,
            riesgo_quirurgico,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota preoperatoria no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar nota preoperatoria");
    }
};
exports.updateNotaPreoperatoria = updateNotaPreoperatoria;
const deleteNotaPreoperatoria = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM nota_preoperatoria WHERE id_nota_preoperatoria = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Nota preoperatoria no encontrada");
        }
        return res.status(200).send("Nota preoperatoria eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar nota preoperatoria");
    }
};
exports.deleteNotaPreoperatoria = deleteNotaPreoperatoria;
