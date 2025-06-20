"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaciente = exports.updatePaciente = exports.createPaciente = exports.getPacienteById = exports.getPacientes = void 0;
const database_1 = __importDefault(require("../../config/database"));
// export const getPacientes = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const response: QueryResult = await pool.query("SELECT * FROM paciente");
//     return res.status(200).json(response.rows);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al obtener pacientes");
//   }
// };
const getPacientes = async (req, res) => {
    try {
        const response = await database_1.default.query("SELECT p.*, per.nombre, per.apellido_paterno, per.apellido_materno, per.fecha_nacimiento, per.sexo, per.curp FROM paciente p JOIN persona per ON p.id_persona = per.id_persona ORDER BY p.id_paciente ASC");
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener pacientes");
    }
};
exports.getPacientes = getPacientes;
const getPacienteById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("SELECT * FROM paciente WHERE id_paciente = $1", [id]);
        if (response.rows.length === 0) {
            return res.status(404).send("Paciente no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener paciente por ID");
    }
};
exports.getPacienteById = getPacienteById;
const createPaciente = async (req, res) => {
    try {
        const { id_persona, alergias, transfusiones, detalles_transfusiones, familiar_responsable, parentesco_familiar, telefono_familiar, ocupacion, escolaridad, lugar_nacimiento } = req.body;
        const response = await database_1.default.query("INSERT INTO paciente (id_persona, alergias, transfusiones, detalles_transfusiones, familiar_responsable, parentesco_familiar, telefono_familiar, ocupacion, escolaridad, lugar_nacimiento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [
            id_persona,
            alergias,
            transfusiones,
            detalles_transfusiones,
            familiar_responsable,
            parentesco_familiar,
            telefono_familiar,
            ocupacion,
            escolaridad,
            lugar_nacimiento
        ]);
        return res.status(201).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al crear paciente");
    }
};
exports.createPaciente = createPaciente;
const updatePaciente = async (req, res) => {
    try {
        const id = req.params.id;
        const { id_persona, alergias, transfusiones, detalles_transfusiones, familiar_responsable, parentesco_familiar, telefono_familiar, ocupacion, escolaridad, lugar_nacimiento } = req.body;
        const response = await database_1.default.query("UPDATE paciente SET id_persona = $1, alergias = $2, transfusiones = $3, detalles_transfusiones = $4, familiar_responsable = $5, parentesco_familiar = $6, telefono_familiar = $7, ocupacion = $8, escolaridad = $9, lugar_nacimiento = $10 WHERE id_paciente = $11 RETURNING *", [
            id_persona,
            alergias,
            transfusiones,
            detalles_transfusiones,
            familiar_responsable,
            parentesco_familiar,
            telefono_familiar,
            ocupacion,
            escolaridad,
            lugar_nacimiento,
            id
        ]);
        if (response.rows.length === 0) {
            return res.status(404).send("Paciente no encontrado");
        }
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar paciente");
    }
};
exports.updatePaciente = updatePaciente;
const deletePaciente = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await database_1.default.query("DELETE FROM paciente WHERE id_paciente = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).send("Paciente no encontrado");
        }
        return res.status(200).send("Paciente eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error al eliminar paciente");
    }
};
exports.deletePaciente = deletePaciente;
