"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotaPsicologia = exports.updateNotaPsicologia = exports.createNotaPsicologia = exports.getNotaPsicologiaById = exports.getNotasPsicologia = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getNotasPsicologia = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM nota_psicologia");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener notas de psicología");
    }
};
exports.getNotasPsicologia = getNotasPsicologia;
const getNotaPsicologiaById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM nota_psicologia WHERE id_nota_psicologia = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota de psicología no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener nota de psicología por ID");
    }
};
exports.getNotaPsicologiaById = getNotaPsicologiaById;
const createNotaPsicologia = async (req, res) => {
    try {
        const { id_documento, motivo_consulta, impresion_diagnostica, evaluacion_mental_afectiva, evaluacion_cognitiva, plan_terapeutico, pronostico, recomendaciones } = req.body;
        const response = await database_1.default.query("INSERT INTO nota_psicologia (id_documento, motivo_consulta, impresion_diagnostica, evaluacion_mental_afectiva, evaluacion_cognitiva, plan_terapeutico, pronostico, recomendaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [
            id_documento,
            motivo_consulta,
            impresion_diagnostica,
            evaluacion_mental_afectiva,
            evaluacion_cognitiva,
            plan_terapeutico,
            pronostico,
            recomendaciones
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear nota de psicología");
    }
};
exports.createNotaPsicologia = createNotaPsicologia;
const updateNotaPsicologia = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, motivo_consulta, impresion_diagnostica, evaluacion_mental_afectiva, evaluacion_cognitiva, plan_terapeutico, pronostico, recomendaciones } = req.body;
        const response = await database_1.default.query("UPDATE nota_psicologia SET id_documento = $1, motivo_consulta = $2, impresion_diagnostica = $3, evaluacion_mental_afectiva = $4, evaluacion_cognitiva = $5, plan_terapeutico = $6, pronostico = $7, recomendaciones = $8 WHERE id_nota_psicologia = $9 RETURNING *", [
            id_documento,
            motivo_consulta,
            impresion_diagnostica,
            evaluacion_mental_afectiva,
            evaluacion_cognitiva,
            plan_terapeutico,
            pronostico,
            recomendaciones,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota de psicología no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar nota de psicología");
    }
};
exports.updateNotaPsicologia = updateNotaPsicologia;
const deleteNotaPsicologia = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM nota_psicologia WHERE id_nota_psicologia = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Nota de psicología no encontrada");
        }
        return res.status(200).send("Nota de psicología eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar nota de psicología");
    }
};
exports.deleteNotaPsicologia = deleteNotaPsicologia;
