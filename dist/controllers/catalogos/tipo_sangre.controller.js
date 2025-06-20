"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTipoSangre = exports.updateTipoSangre = exports.createTipoSangre = exports.getTipoSangreById = exports.getTiposSangre = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getTiposSangre = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM tipo_sangre");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener tipos de sangre");
    }
};
exports.getTiposSangre = getTiposSangre;
const getTipoSangreById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM tipo_sangre WHERE id_tipo_sangre = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Tipo de sangre no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener tipo de sangre por ID");
    }
};
exports.getTipoSangreById = getTipoSangreById;
const createTipoSangre = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const response = await database_1.default.query("INSERT INTO tipo_sangre (nombre, descripcion) VALUES ($1, $2) RETURNING *", [nombre, descripcion]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear tipo de sangre");
    }
};
exports.createTipoSangre = createTipoSangre;
const updateTipoSangre = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, descripcion } = req.body;
        const response = await database_1.default.query("UPDATE tipo_sangre SET nombre = $1, descripcion = $2 WHERE id_tipo_sangre = $3 RETURNING *", [nombre, descripcion, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Tipo de sangre no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar tipo de sangre");
    }
};
exports.updateTipoSangre = updateTipoSangre;
const deleteTipoSangre = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM tipo_sangre WHERE id_tipo_sangre = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Tipo de sangre no encontrado");
        }
        return res.status(200).send("Tipo de sangre eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar tipo de sangre");
    }
};
exports.deleteTipoSangre = deleteTipoSangre;
