"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedicamento = exports.updateMedicamento = exports.createMedicamento = exports.getMedicamentoById = exports.getMedicamentos = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getMedicamentos = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM medicamento");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener medicamentos");
    }
};
exports.getMedicamentos = getMedicamentos;
const getMedicamentoById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM medicamento WHERE id_medicamento = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Medicamento no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener medicamento por ID");
    }
};
exports.getMedicamentoById = getMedicamentoById;
const createMedicamento = async (req, res) => {
    try {
        const { codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo } = req.body;
        const response = await database_1.default.query("INSERT INTO medicamento (codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear medicamento");
    }
};
exports.createMedicamento = createMedicamento;
const updateMedicamento = async (req, res) => {
    try {
        const id = req.params.id;
        const { codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo } = req.body;
        const response = await database_1.default.query("UPDATE medicamento SET codigo = $1, nombre = $2, presentacion = $3, concentracion = $4, grupo_terapeutico = $5, activo = $6 WHERE id_medicamento = $7 RETURNING *", [codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo, id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Medicamento no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar medicamento");
    }
};
exports.updateMedicamento = updateMedicamento;
const deleteMedicamento = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM medicamento WHERE id_medicamento = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Medicamento no encontrado");
        }
        return res.status(200).send("Medicamento eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar medicamento");
    }
};
exports.deleteMedicamento = deleteMedicamento;
