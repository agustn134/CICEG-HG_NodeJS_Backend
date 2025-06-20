"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTipoDocumento = exports.updateTipoDocumento = exports.createTipoDocumento = exports.getTipoDocumentoById = exports.getTiposDocumento = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getTiposDocumento = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM tipo_documento");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener tipos de documento");
    }
};
exports.getTiposDocumento = getTiposDocumento;
const getTipoDocumentoById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM tipo_documento WHERE id_tipo_documento = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Tipo de documento no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener tipo de documento por ID");
    }
};
exports.getTipoDocumentoById = getTipoDocumentoById;
const createTipoDocumento = async (req, res) => {
    try {
        const { nombre, descripcion, activo } = req.body;
        const response = await database_1.default.query("INSERT INTO tipo_documento (nombre, descripcion, activo) VALUES ($1, $2, $3) RETURNING *", [nombre, descripcion, activo]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear tipo de documento");
    }
};
exports.createTipoDocumento = createTipoDocumento;
const updateTipoDocumento = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, descripcion, activo } = req.body;
        const response = await database_1.default.query("UPDATE tipo_documento SET nombre = $1, descripcion = $2, activo = $3 WHERE id_tipo_documento = $4 RETURNING *", [nombre, descripcion, activo, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Tipo de documento no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar tipo de documento");
    }
};
exports.updateTipoDocumento = updateTipoDocumento;
const deleteTipoDocumento = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM tipo_documento WHERE id_tipo_documento = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Tipo de documento no encontrado");
        }
        return res.status(200).send("Tipo de documento eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar tipo de documento");
    }
};
exports.deleteTipoDocumento = deleteTipoDocumento;
