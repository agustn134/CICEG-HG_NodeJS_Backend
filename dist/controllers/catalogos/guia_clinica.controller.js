"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGuiaClinica = exports.updateGuiaClinica = exports.createGuiaClinica = exports.getGuiaClinicaById = exports.getGuiasClinicas = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getGuiasClinicas = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM guia_clinica");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener guías clínicas");
    }
};
exports.getGuiasClinicas = getGuiasClinicas;
const getGuiaClinicaById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM guia_clinica WHERE id_guia_diagnostico = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Guía clínica no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener guía clínica por ID");
    }
};
exports.getGuiaClinicaById = getGuiaClinicaById;
const createGuiaClinica = async (req, res) => {
    try {
        const { area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo } = req.body;
        const response = await database_1.default.query("INSERT INTO guia_clinica (area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear guía clínica");
    }
};
exports.createGuiaClinica = createGuiaClinica;
const updateGuiaClinica = async (req, res) => {
    try {
        const id = req.params.id;
        const { area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo } = req.body;
        const response = await database_1.default.query("UPDATE guia_clinica SET area = $1, codigo = $2, nombre = $3, fuente = $4, fecha_actualizacion = $5, descripcion = $6, activo = $7 WHERE id_guia_diagnostico = $8 RETURNING *", [area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Guía clínica no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar guía clínica");
    }
};
exports.updateGuiaClinica = updateGuiaClinica;
const deleteGuiaClinica = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM guia_clinica WHERE id_guia_diagnostico = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Guía clínica no encontrada");
        }
        return res.status(200).send("Guía clínica eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar guía clínica");
    }
};
exports.deleteGuiaClinica = deleteGuiaClinica;
