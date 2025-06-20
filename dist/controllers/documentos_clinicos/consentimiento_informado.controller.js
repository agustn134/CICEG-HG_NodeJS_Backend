"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConsentimientoInformado = exports.updateConsentimientoInformado = exports.createConsentimientoInformado = exports.getConsentimientoInformadoById = exports.getConsentimientosInformados = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getConsentimientosInformados = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM consentimiento_informado");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener consentimientos informados");
    }
};
exports.getConsentimientosInformados = getConsentimientosInformados;
const getConsentimientoInformadoById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM consentimiento_informado WHERE id_consentimiento = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Consentimiento informado no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener consentimiento informado por ID");
    }
};
exports.getConsentimientoInformadoById = getConsentimientoInformadoById;
const createConsentimientoInformado = async (req, res) => {
    try {
        const { id_documento, tipo_consentimiento, informacion_proporcionada, riesgos_informados, alternativas_informadas, nombre_testigo1, nombre_testigo2, id_medico_informa, firma_paciente, firma_medico, firma_representante_legal, nombre_representante_legal, parentesco_representante } = req.body;
        const response = await database_1.default.query("INSERT INTO consentimiento_informado (id_documento, tipo_consentimiento, informacion_proporcionada, riesgos_informados, alternativas_informadas, nombre_testigo1, nombre_testigo2, id_medico_informa, firma_paciente, firma_medico, firma_representante_legal, nombre_representante_legal, parentesco_representante) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", [
            id_documento,
            tipo_consentimiento,
            informacion_proporcionada,
            riesgos_informados,
            alternativas_informadas,
            nombre_testigo1,
            nombre_testigo2,
            id_medico_informa,
            firma_paciente,
            firma_medico,
            firma_representante_legal,
            nombre_representante_legal,
            parentesco_representante
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear consentimiento informado");
    }
};
exports.createConsentimientoInformado = createConsentimientoInformado;
const updateConsentimientoInformado = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, tipo_consentimiento, informacion_proporcionada, riesgos_informados, alternativas_informadas, nombre_testigo1, nombre_testigo2, id_medico_informa, firma_paciente, firma_medico, firma_representante_legal, nombre_representante_legal, parentesco_representante } = req.body;
        const response = await database_1.default.query("UPDATE consentimiento_informado SET id_documento = $1, tipo_consentimiento = $2, informacion_proporcionada = $3, riesgos_informados = $4, alternativas_informadas = $5, nombre_testigo1 = $6, nombre_testigo2 = $7, id_medico_informa = $8, firma_paciente = $9, firma_medico = $10, firma_representante_legal = $11, nombre_representante_legal = $12, parentesco_representante = $13 WHERE id_consentimiento = $14 RETURNING *", [
            id_documento,
            tipo_consentimiento,
            informacion_proporcionada,
            riesgos_informados,
            alternativas_informadas,
            nombre_testigo1,
            nombre_testigo2,
            id_medico_informa,
            firma_paciente,
            firma_medico,
            firma_representante_legal,
            nombre_representante_legal,
            parentesco_representante,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Consentimiento informado no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar consentimiento informado");
    }
};
exports.updateConsentimientoInformado = updateConsentimientoInformado;
const deleteConsentimientoInformado = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM consentimiento_informado WHERE id_consentimiento = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Consentimiento informado no encontrado");
        }
        return res.status(200).send("Consentimiento informado eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar consentimiento informado");
    }
};
exports.deleteConsentimientoInformado = deleteConsentimientoInformado;
