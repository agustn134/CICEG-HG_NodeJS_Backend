"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePersona = exports.updatePersona = exports.createPersona = exports.getPersonaById = exports.getPersonas = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getPersonas = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM persona");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener personas");
    }
};
exports.getPersonas = getPersonas;
const getPersonaById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM persona WHERE id_persona = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Persona no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener persona por ID");
    }
};
exports.getPersonaById = getPersonaById;
const createPersona = async (req, res) => {
    try {
        const { nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio } = req.body;
        const response = await database_1.default.query("INSERT INTO persona (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *", [
            nombre,
            apellido_paterno,
            apellido_materno,
            fecha_nacimiento,
            sexo,
            curp,
            tipo_sangre_id,
            estado_civil,
            religion,
            telefono,
            correo_electronico,
            domicilio
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear persona");
    }
};
exports.createPersona = createPersona;
const updatePersona = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio } = req.body;
        const response = await database_1.default.query("UPDATE persona SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, fecha_nacimiento = $4, sexo = $5, curp = $6, tipo_sangre_id = $7, estado_civil = $8, religion = $9, telefono = $10, correo_electronico = $11, domicilio = $12 WHERE id_persona = $13 RETURNING *", [
            nombre,
            apellido_paterno,
            apellido_materno,
            fecha_nacimiento,
            sexo,
            curp,
            tipo_sangre_id,
            estado_civil,
            religion,
            telefono,
            correo_electronico,
            domicilio,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Persona no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar persona");
    }
};
exports.updatePersona = updatePersona;
const deletePersona = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM persona WHERE id_persona = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Persona no encontrada");
        }
        return res.status(200).send("Persona eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar persona");
    }
};
exports.deletePersona = deletePersona;
