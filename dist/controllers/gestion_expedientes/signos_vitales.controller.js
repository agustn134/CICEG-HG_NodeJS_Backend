"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSignosVitales = exports.updateSignosVitales = exports.createSignosVitales = exports.getSignosVitalesById = exports.getSignosVitales = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getSignosVitales = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM signos_vitales");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener signos vitales");
    }
};
exports.getSignosVitales = getSignosVitales;
const getSignosVitalesById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM signos_vitales WHERE id_signos_vitales = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Signos vitales no encontrados");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener signos vitales por ID");
    }
};
exports.getSignosVitalesById = getSignosVitalesById;
const createSignosVitales = async (req, res) => {
    try {
        const { id_documento, fecha_toma, temperatura, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, saturacion_oxigeno, glucosa, peso, talla, imc, observaciones } = req.body;
        const response = await database_1.default.query("INSERT INTO signos_vitales (id_documento, fecha_toma, temperatura, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, saturacion_oxigeno, glucosa, peso, talla, imc, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", [id_documento, fecha_toma, temperatura, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, saturacion_oxigeno, glucosa, peso, talla, imc, observaciones]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear signos vitales");
    }
};
exports.createSignosVitales = createSignosVitales;
const updateSignosVitales = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, fecha_toma, temperatura, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, saturacion_oxigeno, glucosa, peso, talla, imc, observaciones } = req.body;
        const response = await database_1.default.query("UPDATE signos_vitales SET id_documento = $1, fecha_toma = $2, temperatura = $3, presion_arterial_sistolica = $4, presion_arterial_diastolica = $5, frecuencia_cardiaca = $6, frecuencia_respiratoria = $7, saturacion_oxigeno = $8, glucosa = $9, peso = $10, talla = $11, imc = $12, observaciones = $13 WHERE id_signos_vitales = $14 RETURNING *", [id_documento, fecha_toma, temperatura, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, saturacion_oxigeno, glucosa, peso, talla, imc, observaciones, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Signos vitales no encontrados");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar signos vitales");
    }
};
exports.updateSignosVitales = updateSignosVitales;
const deleteSignosVitales = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM signos_vitales WHERE id_signos_vitales = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Signos vitales no encontrados");
        }
        return res.status(200).send("Signos vitales eliminados correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar signos vitales");
    }
};
exports.deleteSignosVitales = deleteSignosVitales;
