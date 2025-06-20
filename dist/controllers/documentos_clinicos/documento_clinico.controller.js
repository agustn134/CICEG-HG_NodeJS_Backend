"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentoClinico = exports.updateDocumentoClinico = exports.createDocumentoClinico = exports.getDocumentoClinicoById = exports.getDocumentosClinicos = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getDocumentosClinicos = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM documento_clinico");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener documentos clínicos");
    }
};
exports.getDocumentosClinicos = getDocumentosClinicos;
const getDocumentoClinicoById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM documento_clinico WHERE id_documento = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Documento clínico no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener documento clínico por ID");
    }
};
exports.getDocumentoClinicoById = getDocumentoClinicoById;
const createDocumentoClinico = async (req, res) => {
    try {
        const { id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado } = req.body;
        const response = await database_1.default.query("INSERT INTO documento_clinico (id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear documento clínico");
    }
};
exports.createDocumentoClinico = createDocumentoClinico;
const updateDocumentoClinico = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado } = req.body;
        const response = await database_1.default.query("UPDATE documento_clinico SET id_expediente = $1, id_internamiento = $2, id_tipo_documento = $3, fecha_elaboracion = $4, id_personal_creador = $5, estado = $6 WHERE id_documento = $7 RETURNING *", [id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Documento clínico no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar documento clínico");
    }
};
exports.updateDocumentoClinico = updateDocumentoClinico;
const deleteDocumentoClinico = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM documento_clinico WHERE id_documento = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Documento clínico no encontrado");
        }
        return res.status(200).send("Documento clínico eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar documento clínico");
    }
};
exports.deleteDocumentoClinico = deleteDocumentoClinico;
