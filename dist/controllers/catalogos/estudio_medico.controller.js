"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEstudioMedico = exports.updateEstudioMedico = exports.createEstudioMedico = exports.getEstudioMedicoById = exports.getEstudiosMedicos = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getEstudiosMedicos = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM estudio_medico");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener estudios médicos");
    }
};
exports.getEstudiosMedicos = getEstudiosMedicos;
const getEstudioMedicoById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM estudio_medico WHERE id_estudio = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Estudio médico no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener estudio médico por ID");
    }
};
exports.getEstudioMedicoById = getEstudioMedicoById;
const createEstudioMedico = async (req, res) => {
    try {
        const { clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo } = req.body;
        const response = await database_1.default.query("INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear estudio médico");
    }
};
exports.createEstudioMedico = createEstudioMedico;
const updateEstudioMedico = async (req, res) => {
    try {
        const id = req.params.id;
        const { clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo } = req.body;
        const response = await database_1.default.query("UPDATE estudio_medico SET clave = $1, nombre = $2, tipo = $3, descripcion = $4, requiere_ayuno = $5, tiempo_resultado = $6, activo = $7 WHERE id_estudio = $8 RETURNING *", [clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Estudio médico no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar estudio médico");
    }
};
exports.updateEstudioMedico = updateEstudioMedico;
const deleteEstudioMedico = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM estudio_medico WHERE id_estudio = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Estudio médico no encontrado");
        }
        return res.status(200).send("Estudio médico eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar estudio médico");
    }
};
exports.deleteEstudioMedico = deleteEstudioMedico;
