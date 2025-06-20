"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServicio = exports.updateServicio = exports.createServicio = exports.getServicioById = exports.getServicios = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getServicios = async (req, res) => {
    const result = await database_1.default.query("SELECT * FROM servicio");
    res.json(result.rows);
};
exports.getServicios = getServicios;
const getServicioById = async (req, res) => {
    const { id } = req.params;
    const result = await database_1.default.query("SELECT * FROM servicio WHERE id_servicio = $1", [id]);
    res.json(result.rows[0]);
};
exports.getServicioById = getServicioById;
const createServicio = async (req, res) => {
    const { nombre, descripcion } = req.body;
    await database_1.default.query("INSERT INTO servicio (nombre, descripcion) VALUES ($1, $2)", [nombre, descripcion]);
    res.status(201).json({ message: "Servicio creado" });
};
exports.createServicio = createServicio;
const updateServicio = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    await database_1.default.query("UPDATE servicio SET nombre = $1, descripcion = $2 WHERE id_servicio = $3", [nombre, descripcion, id]);
    res.json({ message: "Servicio actualizado" });
};
exports.updateServicio = updateServicio;
const deleteServicio = async (req, res) => {
    const { id } = req.params;
    await database_1.default.query("DELETE FROM servicio WHERE id_servicio = $1", [id]);
    res.json({ message: "Servicio eliminado" });
};
exports.deleteServicio = deleteServicio;
