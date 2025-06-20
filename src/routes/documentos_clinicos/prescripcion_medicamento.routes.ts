// src/routes/documentos_clinicos/prescripcion_medicamento.routes.ts
import { Router } from "express";
import {
  getPrescripcionesMedicamento,
  getPrescripcionMedicamentoById,
  createPrescripcionMedicamento,
  updatePrescripcionMedicamento,
  deletePrescripcionMedicamento
} from "../../controllers/documentos_clinicos/prescripcion_medicamento.controller";

const router = Router();

router.get("/", getPrescripcionesMedicamento);
router.get("/:id", getPrescripcionMedicamentoById);
router.post("/", createPrescripcionMedicamento);
router.put("/:id", updatePrescripcionMedicamento);
router.delete("/:id", deletePrescripcionMedicamento);

export default router;