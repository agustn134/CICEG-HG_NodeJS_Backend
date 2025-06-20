"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotaPostanestesica = exports.updateNotaPostanestesica = exports.createNotaPostanestesica = exports.getNotaPostanestesicaById = exports.getNotasPostanestesica = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getNotasPostanestesica = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM nota_postanestesica");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener notas postanestésicas");
    }
};
exports.getNotasPostanestesica = getNotasPostanestesica;
const getNotaPostanestesicaById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM nota_postanestesica WHERE id_nota_postanestesica = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota postanestésica no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener nota postanestésica por ID");
    }
};
exports.getNotaPostanestesicaById = getNotaPostanestesicaById;
const createNotaPostanestesica = async (req, res) => {
    try {
        const { id_documento, tipo_anestesia, duracion_anestesia, medicamentos_utilizados, estado_clinico_egreso, incidentes_accidentes, balance_hidrico, liquidos_administrados, sangrado, hemoderivados_transfundidos, plan_tratamiento, pronostico, id_anestesiologo } = req.body;
        const response = await database_1.default.query("INSERT INTO nota_postanestesica (id_documento, tipo_anestesia, duracion_anestesia, medicamentos_utilizados, estado_clinico_egreso, incidentes_accidentes, balance_hidrico, liquidos_administrados, sangrado, hemoderivados_transfundidos, plan_tratamiento, pronostico, id_anestesiologo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", [
            id_documento,
            tipo_anestesia,
            duracion_anestesia,
            medicamentos_utilizados,
            estado_clinico_egreso,
            incidentes_accidentes,
            balance_hidrico,
            liquidos_administrados,
            sangrado,
            hemoderivados_transfundidos,
            plan_tratamiento,
            pronostico,
            id_anestesiologo
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear nota postanestésica");
    }
};
exports.createNotaPostanestesica = createNotaPostanestesica;
const updateNotaPostanestesica = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, tipo_anestesia, duracion_anestesia, medicamentos_utilizados, estado_clinico_egreso, incidentes_accidentes, balance_hidrico, liquidos_administrados, sangrado, hemoderivados_transfundidos, plan_tratamiento, pronostico, id_anestesiologo } = req.body;
        const response = await database_1.default.query("UPDATE nota_postanestesica SET id_documento = $1, tipo_anestesia = $2, duracion_anestesia = $3, medicamentos_utilizados = $4, estado_clinico_egreso = $5, incidentes_accidentes = $6, balance_hidrico = $7, liquidos_administrados = $8, sangrado = $9, hemoderivados_transfundidos = $10, plan_tratamiento = $11, pronostico = $12, id_anestesiologo = $13 WHERE id_nota_postanestesica = $14 RETURNING *", [
            id_documento,
            tipo_anestesia,
            duracion_anestesia,
            medicamentos_utilizados,
            estado_clinico_egreso,
            incidentes_accidentes,
            balance_hidrico,
            liquidos_administrados,
            sangrado,
            hemoderivados_transfundidos,
            plan_tratamiento,
            pronostico,
            id_anestesiologo,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota postanestésica no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar nota postanestésica");
    }
};
exports.updateNotaPostanestesica = updateNotaPostanestesica;
const deleteNotaPostanestesica = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM nota_postanestesica WHERE id_nota_postanestesica = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Nota postanestésica no encontrada");
        }
        return res.status(200).send("Nota postanestésica eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar nota postanestésica");
    }
};
exports.deleteNotaPostanestesica = deleteNotaPostanestesica;
