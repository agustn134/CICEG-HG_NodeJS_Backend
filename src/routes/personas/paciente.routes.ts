// src/routes/personas/paciente.routes.ts
import { Router } from "express";
import {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente
} from "../../controllers/personas/paciente.controller";

const router = Router();

// Ruta para obtener todos los pacientes
router.get("/", getPacientes);

// Ruta para obtener un paciente por ID
router.get("/:id", getPacienteById);

// Ruta para crear un paciente
router.post("/", createPaciente);

// Ruta para actualizar un paciente por ID
router.put("/:id", updatePaciente);

// Ruta para eliminar un paciente por ID
router.delete("/:id", deletePaciente);

export default router;