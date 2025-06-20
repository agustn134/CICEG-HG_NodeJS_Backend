"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSolicitudEstudio = exports.updateSolicitudEstudio = exports.createSolicitudEstudio = exports.getSolicitudEstudioById = exports.getSolicitudesEstudio = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getSolicitudesEstudio = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM solicitud_estudio");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener solicitudes de estudio");
    }
};
exports.getSolicitudesEstudio = getSolicitudesEstudio;
const getSolicitudEstudioById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM solicitud_estudio WHERE id_solicitud = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Solicitud de estudio no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener solicitud de estudio por ID");
    }
};
exports.getSolicitudEstudioById = getSolicitudEstudioById;
const createSolicitudEstudio = async (req, res) => {
    try {
        const { id_documento, id_estudio, justificacion, preparacion_requerida, informacion_clinica_relevante, fecha_solicitada, prioridad, fecha_realizacion, hora_toma_muestra, resultado, interpretacion, estado } = req.body;
        const response = await database_1.default.query("INSERT INTO solicitud_estudio (id_documento, id_estudio, justificacion, preparacion_requerida, informacion_clinica_relevante, fecha_solicitada, prioridad, fecha_realizacion, hora_toma_muestra, resultado, interpretacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *", [
            id_documento,
            id_estudio,
            justificacion,
            preparacion_requerida,
            informacion_clinica_relevante,
            fecha_solicitada,
            prioridad,
            fecha_realizacion,
            hora_toma_muestra,
            resultado,
            interpretacion,
            estado
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear solicitud de estudio");
    }
};
exports.createSolicitudEstudio = createSolicitudEstudio;
const updateSolicitudEstudio = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, id_estudio, justificacion, preparacion_requerida, informacion_clinica_relevante, fecha_solicitada, prioridad, fecha_realizacion, hora_toma_muestra, resultado, interpretacion, estado } = req.body;
        const response = await database_1.default.query("UPDATE solicitud_estudio SET id_documento = $1, id_estudio = $2, justificacion = $3, preparacion_requerida = $4, informacion_clinica_relevante = $5, fecha_solicitada = $6, prioridad = $7, fecha_realizacion = $8, hora_toma_muestra = $9, resultado = $10, interpretacion = $11, estado = $12 WHERE id_solicitud = $13 RETURNING *", [
            id_documento,
            id_estudio,
            justificacion,
            preparacion_requerida,
            informacion_clinica_relevante,
            fecha_solicitada,
            prioridad,
            fecha_realizacion,
            hora_toma_muestra,
            resultado,
            interpretacion,
            estado,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Solicitud de estudio no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar solicitud de estudio");
    }
};
exports.updateSolicitudEstudio = updateSolicitudEstudio;
const deleteSolicitudEstudio = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM solicitud_estudio WHERE id_solicitud = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Solicitud de estudio no encontrada");
        }
        return res.status(200).send("Solicitud de estudio eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar solicitud de estudio");
    }
};
exports.deleteSolicitudEstudio = deleteSolicitudEstudio;
