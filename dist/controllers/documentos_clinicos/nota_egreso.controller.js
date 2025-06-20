"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotaEgreso = exports.updateNotaEgreso = exports.createNotaEgreso = exports.getNotaEgresoById = exports.getNotasEgreso = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getNotasEgreso = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM nota_egreso");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener notas de egreso");
    }
};
exports.getNotasEgreso = getNotasEgreso;
const getNotaEgresoById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM nota_egreso WHERE id_nota_egreso = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota de egreso no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener nota de egreso por ID");
    }
};
exports.getNotaEgresoById = getNotaEgresoById;
const createNotaEgreso = async (req, res) => {
    try {
        const { id_documento, diagnostico_ingreso, resumen_evolucion, manejo_hospitalario, diagnostico_egreso, id_guia_diagnostico, procedimientos_realizados, fecha_procedimientos, motivo_egreso, problemas_pendientes, plan_tratamiento, recomendaciones_vigilancia, atencion_factores_riesgo, pronostico, reingreso_por_misma_afeccion } = req.body;
        const response = await database_1.default.query("INSERT INTO nota_egreso (id_documento, diagnostico_ingreso, resumen_evolucion, manejo_hospitalario, diagnostico_egreso, id_guia_diagnostico, procedimientos_realizados, fecha_procedimientos, motivo_egreso, problemas_pendientes, plan_tratamiento, recomendaciones_vigilancia, atencion_factores_riesgo, pronostico, reingreso_por_misma_afeccion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *", [
            id_documento,
            diagnostico_ingreso,
            resumen_evolucion,
            manejo_hospitalario,
            diagnostico_egreso,
            id_guia_diagnostico,
            procedimientos_realizados,
            fecha_procedimientos,
            motivo_egreso,
            problemas_pendientes,
            plan_tratamiento,
            recomendaciones_vigilancia,
            atencion_factores_riesgo,
            pronostico,
            reingreso_por_misma_afeccion
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear nota de egreso");
    }
};
exports.createNotaEgreso = createNotaEgreso;
const updateNotaEgreso = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, diagnostico_ingreso, resumen_evolucion, manejo_hospitalario, diagnostico_egreso, id_guia_diagnostico, procedimientos_realizados, fecha_procedimientos, motivo_egreso, problemas_pendientes, plan_tratamiento, recomendaciones_vigilancia, atencion_factores_riesgo, pronostico, reingreso_por_misma_afeccion } = req.body;
        const response = await database_1.default.query("UPDATE nota_egreso SET id_documento = $1, diagnostico_ingreso = $2, resumen_evolucion = $3, manejo_hospitalario = $4, diagnostico_egreso = $5, id_guia_diagnostico = $6, procedimientos_realizados = $7, fecha_procedimientos = $8, motivo_egreso = $9, problemas_pendientes = $10, plan_tratamiento = $11, recomendaciones_vigilancia = $12, atencion_factores_riesgo = $13, pronostico = $14, reingreso_por_misma_afeccion = $15 WHERE id_nota_egreso = $16 RETURNING *", [
            id_documento,
            diagnostico_ingreso,
            resumen_evolucion,
            manejo_hospitalario,
            diagnostico_egreso,
            id_guia_diagnostico,
            procedimientos_realizados,
            fecha_procedimientos,
            motivo_egreso,
            problemas_pendientes,
            plan_tratamiento,
            recomendaciones_vigilancia,
            atencion_factores_riesgo,
            pronostico,
            reingreso_por_misma_afeccion,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota de egreso no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar nota de egreso");
    }
};
exports.updateNotaEgreso = updateNotaEgreso;
const deleteNotaEgreso = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM nota_egreso WHERE id_nota_egreso = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Nota de egreso no encontrada");
        }
        return res.status(200).send("Nota de egreso eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar nota de egreso");
    }
};
exports.deleteNotaEgreso = deleteNotaEgreso;
