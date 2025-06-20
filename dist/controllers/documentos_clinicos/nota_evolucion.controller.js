"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotaEvolucion = exports.updateNotaEvolucion = exports.createNotaEvolucion = exports.getNotaEvolucionById = exports.getNotasEvolucion = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getNotasEvolucion = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM nota_evolucion");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener notas de evolución");
    }
};
exports.getNotasEvolucion = getNotasEvolucion;
const getNotaEvolucionById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM nota_evolucion WHERE id_nota_evolucion = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota de evolución no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener nota de evolución por ID");
    }
};
exports.getNotaEvolucionById = getNotaEvolucionById;
const createNotaEvolucion = async (req, res) => {
    try {
        const { id_documento, subjetivo, objetivo, analisis, plan } = req.body;
        const response = await database_1.default.query("INSERT INTO nota_evolucion (id_documento, subjetivo, objetivo, analisis, plan) VALUES ($1, $2, $3, $4, $5) RETURNING *", [id_documento, subjetivo, objetivo, analisis, plan]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear nota de evolución");
    }
};
exports.createNotaEvolucion = createNotaEvolucion;
const updateNotaEvolucion = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, subjetivo, objetivo, analisis, plan } = req.body;
        const response = await database_1.default.query("UPDATE nota_evolucion SET id_documento = $1, subjetivo = $2, objetivo = $3, analisis = $4, plan = $5 WHERE id_nota_evolucion = $6 RETURNING *", [id_documento, subjetivo, objetivo, analisis, plan, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota de evolución no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar nota de evolución");
    }
};
exports.updateNotaEvolucion = updateNotaEvolucion;
const deleteNotaEvolucion = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM nota_evolucion WHERE id_nota_evolucion = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Nota de evolución no encontrada");
        }
        return res.status(200).send("Nota de evolución eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar nota de evolución");
    }
};
exports.deleteNotaEvolucion = deleteNotaEvolucion;
