"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotaNutricion = exports.updateNotaNutricion = exports.createNotaNutricion = exports.getNotaNutricionById = exports.getNotasNutricion = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getNotasNutricion = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM nota_nutricion");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener notas de nutrición");
    }
};
exports.getNotasNutricion = getNotasNutricion;
const getNotaNutricionById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM nota_nutricion WHERE id_nota_nutricion = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota de nutrición no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener nota de nutrición por ID");
    }
};
exports.getNotaNutricionById = getNotaNutricionById;
const createNotaNutricion = async (req, res) => {
    try {
        const { id_documento, diagnostico_nutricional, estado_nutricional, requerimientos_caloricos, requerimientos_proteicos, indicaciones_dieta, plan_manejo_nutricional, factores_riesgo_nutricional, suplementos_recomendados, pronostico } = req.body;
        const response = await database_1.default.query("INSERT INTO nota_nutricion (id_documento, diagnostico_nutricional, estado_nutricional, requerimientos_caloricos, requerimientos_proteicos, indicaciones_dieta, plan_manejo_nutricional, factores_riesgo_nutricional, suplementos_recomendados, pronostico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [
            id_documento,
            diagnostico_nutricional,
            estado_nutricional,
            requerimientos_caloricos,
            requerimientos_proteicos,
            indicaciones_dieta,
            plan_manejo_nutricional,
            factores_riesgo_nutricional,
            suplementos_recomendados,
            pronostico
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear nota de nutrición");
    }
};
exports.createNotaNutricion = createNotaNutricion;
const updateNotaNutricion = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, diagnostico_nutricional, estado_nutricional, requerimientos_caloricos, requerimientos_proteicos, indicaciones_dieta, plan_manejo_nutricional, factores_riesgo_nutricional, suplementos_recomendados, pronostico } = req.body;
        const response = await database_1.default.query("UPDATE nota_nutricion SET id_documento = $1, diagnostico_nutricional = $2, estado_nutricional = $3, requerimientos_caloricos = $4, requerimientos_proteicos = $5, indicaciones_dieta = $6, plan_manejo_nutricional = $7, factores_riesgo_nutricional = $8, suplementos_recomendados = $9, pronostico = $10 WHERE id_nota_nutricion = $11 RETURNING *", [
            id_documento,
            diagnostico_nutricional,
            estado_nutricional,
            requerimientos_caloricos,
            requerimientos_proteicos,
            indicaciones_dieta,
            plan_manejo_nutricional,
            factores_riesgo_nutricional,
            suplementos_recomendados,
            pronostico,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota de nutrición no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar nota de nutrición");
    }
};
exports.updateNotaNutricion = updateNotaNutricion;
const deleteNotaNutricion = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM nota_nutricion WHERE id_nota_nutricion = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Nota de nutrición no encontrada");
        }
        return res.status(200).send("Nota de nutrición eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar nota de nutrición");
    }
};
exports.deleteNotaNutricion = deleteNotaNutricion;
