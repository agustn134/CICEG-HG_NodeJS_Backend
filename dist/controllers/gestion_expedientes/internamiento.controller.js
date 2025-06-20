"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInternamiento = exports.updateInternamiento = exports.createInternamiento = exports.getInternamientoById = exports.getInternamientos = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getInternamientos = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM internamiento");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener internamientos");
    }
};
exports.getInternamientos = getInternamientos;
const getInternamientoById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM internamiento WHERE id_internamiento = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Internamiento no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener internamiento por ID");
    }
};
exports.getInternamientoById = getInternamientoById;
const createInternamiento = async (req, res) => {
    try {
        const { id_expediente, id_cama, id_servicio, fecha_ingreso, fecha_egreso, motivo_ingreso, diagnostico_ingreso, diagnostico_egreso, id_medico_responsable, tipo_egreso, observaciones } = req.body;
        const response = await database_1.default.query("INSERT INTO internamiento (id_expediente, id_cama, id_servicio, fecha_ingreso, fecha_egreso, motivo_ingreso, diagnostico_ingreso, diagnostico_egreso, id_medico_responsable, tipo_egreso, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [id_expediente, id_cama, id_servicio, fecha_ingreso, fecha_egreso, motivo_ingreso, diagnostico_ingreso, diagnostico_egreso, id_medico_responsable, tipo_egreso, observaciones]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear internamiento");
    }
};
exports.createInternamiento = createInternamiento;
const updateInternamiento = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_expediente, id_cama, id_servicio, fecha_ingreso, fecha_egreso, motivo_ingreso, diagnostico_ingreso, diagnostico_egreso, id_medico_responsable, tipo_egreso, observaciones } = req.body;
        const response = await database_1.default.query("UPDATE internamiento SET id_expediente = $1, id_cama = $2, id_servicio = $3, fecha_ingreso = $4, fecha_egreso = $5, motivo_ingreso = $6, diagnostico_ingreso = $7, diagnostico_egreso = $8, id_medico_responsable = $9, tipo_egreso = $10, observaciones = $11 WHERE id_internamiento = $12 RETURNING *", [id_expediente, id_cama, id_servicio, fecha_ingreso, fecha_egreso, motivo_ingreso, diagnostico_ingreso, diagnostico_egreso, id_medico_responsable, tipo_egreso, observaciones, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Internamiento no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar internamiento");
    }
};
exports.updateInternamiento = updateInternamiento;
const deleteInternamiento = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM internamiento WHERE id_internamiento = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Internamiento no encontrado");
        }
        return res.status(200).send("Internamiento eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar internamiento");
    }
};
exports.deleteInternamiento = deleteInternamiento;
