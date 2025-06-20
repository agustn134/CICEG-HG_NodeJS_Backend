// src/routes/catalogos/medicamento.routes.ts
import { Router } from "express";
import {
  getMedicamentos,
  getMedicamentoById,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento
} from "../../controllers/catalogos/medicamento.controller";

const router = Router();

router.get("/", getMedicamentos);
router.get("/:id", getMedicamentoById);
router.post("/", createMedicamento);
router.put("/:id", updateMedicamento);
router.delete("/:id", deleteMedicamento);

export default router;