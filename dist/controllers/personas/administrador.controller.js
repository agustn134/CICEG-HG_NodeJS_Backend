"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdministrador = exports.updateAdministrador = exports.createAdministrador = exports.getAdministradorById = exports.getAdministradores = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getAdministradores = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM administrador");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener administradores");
    }
};
exports.getAdministradores = getAdministradores;
const getAdministradorById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM administrador WHERE id_administrador = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Administrador no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener administrador por ID");
    }
};
exports.getAdministradorById = getAdministradorById;
const createAdministrador = async (req, res) => {
    try {
        const { id_persona, usuario, contrasena, nivel_acceso, activo, foto } = req.body;
        const response = await database_1.default.query("INSERT INTO administrador (id_persona, usuario, contrasena, nivel_acceso, activo, foto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
            id_persona,
            usuario,
            contrasena,
            nivel_acceso,
            activo,
            foto
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear administrador");
    }
};
exports.createAdministrador = createAdministrador;
const updateAdministrador = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_persona, usuario, contrasena, nivel_acceso, activo, foto } = req.body;
        const response = await database_1.default.query("UPDATE administrador SET id_persona = $1, usuario = $2, contrasena = $3, nivel_acceso = $4, activo = $5, foto = $6 WHERE id_administrador = $7 RETURNING *", [
            id_persona,
            usuario,
            contrasena,
            nivel_acceso,
            activo,
            foto,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Administrador no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar administrador");
    }
};
exports.updateAdministrador = updateAdministrador;
const deleteAdministrador = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM administrador WHERE id_administrador = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Administrador no encontrado");
        }
        return res.status(200).send("Administrador eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar administrador");
    }
};
exports.deleteAdministrador = deleteAdministrador;
