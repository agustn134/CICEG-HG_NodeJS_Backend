"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCama = exports.updateCama = exports.createCama = exports.getCamaById = exports.getCamas = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getCamas = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM cama");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener camas");
    }
};
exports.getCamas = getCamas;
const getCamaById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM cama WHERE id_cama = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Cama no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener cama por ID");
    }
};
exports.getCamaById = getCamaById;
const createCama = async (req, res) => {
    try {
        const { numero, id_servicio, estado, descripcion, area, subarea } = req.body;
        const response = await database_1.default.query("INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [numero, id_servicio, estado, descripcion, area, subarea]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear cama");
    }
};
exports.createCama = createCama;
const updateCama = async (req, res) => {
    try {
        const id = req.params.id;
        const { numero, id_servicio, estado, descripcion, area, subarea } = req.body;
        const response = await database_1.default.query("UPDATE cama SET numero = $1, id_servicio = $2, estado = $3, descripcion = $4, area = $5, subarea = $6 WHERE id_cama = $7 RETURNING *", [numero, id_servicio, estado, descripcion, area, subarea, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Cama no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar cama");
    }
};
exports.updateCama = updateCama;
const deleteCama = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM cama WHERE id_cama = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Cama no encontrada");
        }
        return res.status(200).send("Cama eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar cama");
    }
};
exports.deleteCama = deleteCama;
