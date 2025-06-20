// src/routes/personas/personal_medico.routes.ts
import { Router } from "express";
import {
  getPersonalMedico,
  getPersonalMedicoById,
  createPersonalMedico,
  updatePersonalMedico,
  deletePersonalMedico
} from "../../controllers/personas/personal_medico.controller";

const router = Router();

// Ruta para obtener todos los personal médico
router.get("/", getPersonalMedico);

// Ruta para obtener un personal médico por ID
router.get("/:id", getPersonalMedicoById);

// Ruta para crear un personal médico
router.post("/", createPersonalMedico);

// Ruta para actualizar un personal médico por ID
router.put("/:id", updatePersonalMedico);

// Ruta para eliminar un personal médico por ID
router.delete("/:id", deletePersonalMedico);

export default router;
