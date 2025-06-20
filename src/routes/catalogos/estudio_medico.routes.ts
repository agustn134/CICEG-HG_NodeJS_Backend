// src/routes/catalogos/estudio_medico.routes.ts
import { Router } from "express";
import {
  getEstudiosMedicos,
  getEstudioMedicoById,
  createEstudioMedico,
  updateEstudioMedico,
  deleteEstudioMedico
} from "../../controllers/catalogos/estudio_medico.controller";

const router = Router();

router.get("/", getEstudiosMedicos);
router.get("/:id", getEstudioMedicoById);
router.post("/", createEstudioMedico);
router.put("/:id", updateEstudioMedico);
router.delete("/:id", deleteEstudioMedico);

export default router;