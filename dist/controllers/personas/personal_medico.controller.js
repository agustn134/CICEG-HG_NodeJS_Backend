"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePersonalMedico = exports.updatePersonalMedico = exports.createPersonalMedico = exports.getPersonalMedicoById = exports.getPersonalMedico = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getPersonalMedico = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT * FROM personal_medico");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener personal médico");
    }
};
exports.getPersonalMedico = getPersonalMedico;
const getPersonalMedicoById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!/^\d+$/.test(id)) {
            return res.status(400).send("ID de personal médico debe ser un número entero.");
        }
        const response = await database_1.default.query("SELECT * FROM personal_medico WHERE id_personal_medico = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Personal médico no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener personal médico por ID");
    }
};
exports.getPersonalMedicoById = getPersonalMedicoById;
const createPersonalMedico = async (req, res) => {
    try {
        const { id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto } = req.body;
        const response = await database_1.default.query("INSERT INTO personal_medico (id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [
            id_persona,
            numero_cedula,
            especialidad,
            cargo,
            departamento,
            activo,
            foto
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear personal médico");
    }
};
exports.createPersonalMedico = createPersonalMedico;
const updatePersonalMedico = async (req, res) => {
    try {
        const id = req.params.id;
        if (!/^\d+$/.test(id)) {
            return res.status(400).send("ID de personal médico debe ser un número entero.");
        }
        const { id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto } = req.body;
        const response = await database_1.default.query("UPDATE personal_medico SET id_persona = $1, numero_cedula = $2, especialidad = $3, cargo = $4, departamento = $5, activo = $6, foto = $7 WHERE id_personal_medico = $8 RETURNING *", [
            id_persona,
            numero_cedula,
            especialidad,
            cargo,
            departamento,
            activo,
            foto,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Personal médico no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar personal médico");
    }
};
exports.updatePersonalMedico = updatePersonalMedico;
const deletePersonalMedico = async (req, res) => {
    try {
        const id = req.params.id;
        if (!/^\d+$/.test(id)) {
            return res.status(400).send("ID de personal médico debe ser un número entero.");
        }
        const response = await database_1.default.query("DELETE FROM personal_medico WHERE id_personal_medico = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Personal médico no encontrado");
        }
        return res.status(200).send("Personal médico eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar personal médico");
    }
};
exports.deletePersonalMedico = deletePersonalMedico;
