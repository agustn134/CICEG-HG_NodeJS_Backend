"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReferenciaTraslado = exports.updateReferenciaTraslado = exports.createReferenciaTraslado = exports.getReferenciaTrasladoById = exports.getReferenciasTraslado = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getReferenciasTraslado = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM referencia_traslado");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener referencias de traslado");
    }
};
exports.getReferenciasTraslado = getReferenciasTraslado;
const getReferenciaTrasladoById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM referencia_traslado WHERE id_referencia = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Referencia de traslado no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener referencia de traslado por ID");
    }
};
exports.getReferenciaTrasladoById = getReferenciaTrasladoById;
const createReferenciaTraslado = async (req, res) => {
    try {
        const { id_documento, establecimiento_origen, establecimiento_destino, motivo_envio, resumen_clinico, diagnostico, id_guia_diagnostico, plan_tratamiento, estado_fisico, pronostico, tipo_traslado, medico_receptor, observaciones } = req.body;
        const response = await database_1.default.query("INSERT INTO referencia_traslado (id_documento, establecimiento_origen, establecimiento_destino, motivo_envio, resumen_clinico, diagnostico, id_guia_diagnostico, plan_tratamiento, estado_fisico, pronostico, tipo_traslado, medico_receptor, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", [
            id_documento,
            establecimiento_origen,
            establecimiento_destino,
            motivo_envio,
            resumen_clinico,
            diagnostico,
            id_guia_diagnostico,
            plan_tratamiento,
            estado_fisico,
            pronostico,
            tipo_traslado,
            medico_receptor,
            observaciones
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear referencia de traslado");
    }
};
exports.createReferenciaTraslado = createReferenciaTraslado;
const updateReferenciaTraslado = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, establecimiento_origen, establecimiento_destino, motivo_envio, resumen_clinico, diagnostico, id_guia_diagnostico, plan_tratamiento, estado_fisico, pronostico, tipo_traslado, medico_receptor, observaciones } = req.body;
        const response = await database_1.default.query("UPDATE referencia_traslado SET id_documento = $1, establecimiento_origen = $2, establecimiento_destino = $3, motivo_envio = $4, resumen_clinico = $5, diagnostico = $6, id_guia_diagnostico = $7, plan_tratamiento = $8, estado_fisico = $9, pronostico = $10, tipo_traslado = $11, medico_receptor = $12, observaciones = $13 WHERE id_referencia = $14 RETURNING *", [
            id_documento,
            establecimiento_origen,
            establecimiento_destino,
            motivo_envio,
            resumen_clinico,
            diagnostico,
            id_guia_diagnostico,
            plan_tratamiento,
            estado_fisico,
            pronostico,
            tipo_traslado,
            medico_receptor,
            observaciones,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Referencia de traslado no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar referencia de traslado");
    }
};
exports.updateReferenciaTraslado = updateReferenciaTraslado;
const deleteReferenciaTraslado = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM referencia_traslado WHERE id_referencia = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Referencia de traslado no encontrada");
        }
        return res.status(200).send("Referencia de traslado eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar referencia de traslado");
    }
};
exports.deleteReferenciaTraslado = deleteReferenciaTraslado;
