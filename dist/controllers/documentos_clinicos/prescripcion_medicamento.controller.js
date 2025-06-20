"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescripcionMedicamento = exports.updatePrescripcionMedicamento = exports.createPrescripcionMedicamento = exports.getPrescripcionMedicamentoById = exports.getPrescripcionesMedicamento = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getPrescripcionesMedicamento = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM prescripcion_medicamento");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener prescripciones de medicamento");
    }
};
exports.getPrescripcionesMedicamento = getPrescripcionesMedicamento;
const getPrescripcionMedicamentoById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM prescripcion_medicamento WHERE id_prescripcion = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Prescripción de medicamento no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener prescripción de medicamento por ID");
    }
};
exports.getPrescripcionMedicamentoById = getPrescripcionMedicamentoById;
const createPrescripcionMedicamento = async (req, res) => {
    try {
        const { id_documento, id_medicamento, dosis, via_administracion, frecuencia, duracion, indicaciones_especiales, fecha_inicio, fecha_fin, activo } = req.body;
        const response = await database_1.default.query("INSERT INTO prescripcion_medicamento (id_documento, id_medicamento, dosis, via_administracion, frecuencia, duracion, indicaciones_especiales, fecha_inicio, fecha_fin, activo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [
            id_documento,
            id_medicamento,
            dosis,
            via_administracion,
            frecuencia,
            duracion,
            indicaciones_especiales,
            fecha_inicio,
            fecha_fin,
            activo
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear prescripción de medicamento");
    }
};
exports.createPrescripcionMedicamento = createPrescripcionMedicamento;
const updatePrescripcionMedicamento = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, id_medicamento, dosis, via_administracion, frecuencia, duracion, indicaciones_especiales, fecha_inicio, fecha_fin, activo } = req.body;
        const response = await database_1.default.query("UPDATE prescripcion_medicamento SET id_documento = $1, id_medicamento = $2, dosis = $3, via_administracion = $4, frecuencia = $5, duracion = $6, indicaciones_especiales = $7, fecha_inicio = $8, fecha_fin = $9, activo = $10 WHERE id_prescripcion = $11 RETURNING *", [
            id_documento,
            id_medicamento,
            dosis,
            via_administracion,
            frecuencia,
            duracion,
            indicaciones_especiales,
            fecha_inicio,
            fecha_fin,
            activo,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Prescripción de medicamento no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar prescripción de medicamento");
    }
};
exports.updatePrescripcionMedicamento = updatePrescripcionMedicamento;
const deletePrescripcionMedicamento = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM prescripcion_medicamento WHERE id_prescripcion = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Prescripción de medicamento no encontrada");
        }
        return res.status(200).send("Prescripción de medicamento eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar prescripción de medicamento");
    }
};
exports.deletePrescripcionMedicamento = deletePrescripcionMedicamento;
