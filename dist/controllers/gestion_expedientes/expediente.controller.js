"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpediente = exports.updateExpediente = exports.createExpediente = exports.getExpedienteById = exports.getExpedientes = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getExpedientes = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM expediente");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener expedientes");
    }
};
exports.getExpedientes = getExpedientes;
const getExpedienteById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM expediente WHERE id_expediente = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Expediente no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener expediente por ID");
    }
};
exports.getExpedienteById = getExpedienteById;
const createExpediente = async (req, res) => {
    try {
        const { id_paciente, numero_expediente, estado, notas_administrativas } = req.body;
        const response = await database_1.default.query("INSERT INTO expediente (id_paciente, numero_expediente, estado, notas_administrativas) VALUES ($1, $2, $3, $4) RETURNING *", [id_paciente, numero_expediente, estado, notas_administrativas]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear expediente");
    }
};
exports.createExpediente = createExpediente;
const updateExpediente = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_paciente, numero_expediente, estado, notas_administrativas } = req.body;
        const response = await database_1.default.query("UPDATE expediente SET id_paciente = $1, numero_expediente = $2, estado = $3, notas_administrativas = $4 WHERE id_expediente = $5 RETURNING *", [id_paciente, numero_expediente, estado, notas_administrativas, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Expediente no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar expediente");
    }
};
exports.updateExpediente = updateExpediente;
const deleteExpediente = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM expediente WHERE id_expediente = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Expediente no encontrado");
        }
        return res.status(200).send("Expediente eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar expediente");
    }
};
exports.deleteExpediente = deleteExpediente;
