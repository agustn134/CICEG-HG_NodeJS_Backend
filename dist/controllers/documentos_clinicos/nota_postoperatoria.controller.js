"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotaPostoperatoria = exports.updateNotaPostoperatoria = exports.createNotaPostoperatoria = exports.getNotaPostoperatoriaById = exports.getNotasPostoperatoria = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getNotasPostoperatoria = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM nota_postoperatoria");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener notas postoperatorias");
    }
};
exports.getNotasPostoperatoria = getNotasPostoperatoria;
const getNotaPostoperatoriaById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM nota_postoperatoria WHERE id_nota_postoperatoria = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota postoperatoria no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener nota postoperatoria por ID");
    }
};
exports.getNotaPostoperatoriaById = getNotaPostoperatoriaById;
const createNotaPostoperatoria = async (req, res) => {
    try {
        const { id_documento, fecha_cirugia, diagnostico_postoperatorio, operacion_realizada, descripcion_tecnica, hallazgos, conteo_gasas_completo, incidentes_accidentes, sangrado, estado_postquirurgico, piezas_enviadas_patologia, plan_postoperatorio, pronostico, id_cirujano, id_ayudante1, id_ayudante2, id_anestesiologo, id_instrumentista, id_circulante } = req.body;
        const response = await database_1.default.query("INSERT INTO nota_postoperatoria (id_documento, fecha_cirugia, diagnostico_postoperatorio, operacion_realizada, descripcion_tecnica, hallazgos, conteo_gasas_completo, incidentes_accidentes, sangrado, estado_postquirurgico, piezas_enviadas_patologia, plan_postoperatorio, pronostico, id_cirujano, id_ayudante1, id_ayudante2, id_anestesiologo, id_instrumentista, id_circulante) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *", [
            id_documento,
            fecha_cirugia,
            diagnostico_postoperatorio,
            operacion_realizada,
            descripcion_tecnica,
            hallazgos,
            conteo_gasas_completo,
            incidentes_accidentes,
            sangrado,
            estado_postquirurgico,
            piezas_enviadas_patologia,
            plan_postoperatorio,
            pronostico,
            id_cirujano,
            id_ayudante1,
            id_ayudante2,
            id_anestesiologo,
            id_instrumentista,
            id_circulante
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear nota postoperatoria");
    }
};
exports.createNotaPostoperatoria = createNotaPostoperatoria;
const updateNotaPostoperatoria = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_documento, fecha_cirugia, diagnostico_postoperatorio, operacion_realizada, descripcion_tecnica, hallazgos, conteo_gasas_completo, incidentes_accidentes, sangrado, estado_postquirurgico, piezas_enviadas_patologia, plan_postoperatorio, pronostico, id_cirujano, id_ayudante1, id_ayudante2, id_anestesiologo, id_instrumentista, id_circulante } = req.body;
        const response = await database_1.default.query("UPDATE nota_postoperatoria SET id_documento = $1, fecha_cirugia = $2, diagnostico_postoperatorio = $3, operacion_realizada = $4, descripcion_tecnica = $5, hallazgos = $6, conteo_gasas_completo = $7, incidentes_accidentes = $8, sangrado = $9, estado_postquirurgico = $10, piezas_enviadas_patologia = $11, plan_postoperatorio = $12, pronostico = $13, id_cirujano = $14, id_ayudante1 = $15, id_ayudante2 = $16, id_anestesiologo = $17, id_instrumentista = $18, id_circulante = $19 WHERE id_nota_postoperatoria = $20 RETURNING *", [
            id_documento,
            fecha_cirugia,
            diagnostico_postoperatorio,
            operacion_realizada,
            descripcion_tecnica,
            hallazgos,
            conteo_gasas_completo,
            incidentes_accidentes,
            sangrado,
            estado_postquirurgico,
            piezas_enviadas_patologia,
            plan_postoperatorio,
            pronostico,
            id_cirujano,
            id_ayudante1,
            id_ayudante2,
            id_anestesiologo,
            id_instrumentista,
            id_circulante,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Nota postoperatoria no encontrada");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar nota postoperatoria");
    }
};
exports.updateNotaPostoperatoria = updateNotaPostoperatoria;
const deleteNotaPostoperatoria = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM nota_postoperatoria WHERE id_nota_postoperatoria = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Nota postoperatoria no encontrada");
        }
        return res.status(200).send("Nota postoperatoria eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar nota postoperatoria");
    }
};
exports.deleteNotaPostoperatoria = deleteNotaPostoperatoria;
