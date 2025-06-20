"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotaPreanestesica = exports.updateNotaPreanestesica = exports.createNotaPreanestesica = exports.getNotaPreanestesicaById = exports.getNotasPreanestesica = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getNotasPreanestesica = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM nota_preanestesica");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener notas preanestésicas");
    }
};
exports.getNotasPreanestesica = getNotasPreanestesica;
const getNotaPreanestesicaById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM nota_preanestesica WHERE id_nota_preanestesica = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota preanestésica no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener nota preanestésica por ID");
    }
};
exports.getNotaPreanestesicaById = getNotaPreanestesicaById;
const createNotaPreanestesica = async (req, res) => {
    try {
        const { id_documento, fecha_cirugia, antecedentes_anestesicos, valoracion_via_aerea, clasificacion_asa, plan_anestesico, riesgo_anestesico, medicacion_preanestesica, id_anestesiologo } = req.body;
        const response = await database_1.default.query("INSERT INTO nota_preanestesica (id_documento, fecha_cirugia, antecedentes_anestesicos, valoracion_via_aerea, clasificacion_asa, plan_anestesico, riesgo_anestesico, medicacion_preanestesica, id_anestesiologo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [
            id_documento,
            fecha_cirugia,
            antecedentes_anestesicos,
            valoracion_via_aerea,
            clasificacion_asa,
            plan_anestesico,
            riesgo_anestesico,
            medicacion_preanestesica,
            id_anestesiologo
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear nota preanestésica");
    }
};
exports.createNotaPreanestesica = createNotaPreanestesica;
const updateNotaPreanestesica = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, fecha_cirugia, antecedentes_anestesicos, valoracion_via_aerea, clasificacion_asa, plan_anestesico, riesgo_anestesico, medicacion_preanestesica, id_anestesiologo } = req.body;
        const response = await database_1.default.query("UPDATE nota_preanestesica SET id_documento = $1, fecha_cirugia = $2, antecedentes_anestesicos = $3, valoracion_via_aerea = $4, clasificacion_asa = $5, plan_anestesico = $6, riesgo_anestesico = $7, medicacion_preanestesica = $8, id_anestesiologo = $9 WHERE id_nota_preanestesica = $10 RETURNING *", [
            id_documento,
            fecha_cirugia,
            antecedentes_anestesicos,
            valoracion_via_aerea,
            clasificacion_asa,
            plan_anestesico,
            riesgo_anestesico,
            medicacion_preanestesica,
            id_anestesiologo,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota preanestésica no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar nota preanestésica");
    }
};
exports.updateNotaPreanestesica = updateNotaPreanestesica;
const deleteNotaPreanestesica = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM nota_preanestesica WHERE id_nota_preanestesica = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Nota preanestésica no encontrada");
        }
        return res.status(200).send("Nota preanestésica eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar nota preanestésica");
    }
};
exports.deleteNotaPreanestesica = deleteNotaPreanestesica;
