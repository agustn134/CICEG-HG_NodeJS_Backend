// src/routes/notas_especializadas/nota_psicologia.routes.ts
import { Router } from "express";
import {
  getNotasPsicologia,
  getNotaPsicologiaById,
  createNotaPsicologia,
  updateNotaPsicologia,
  deleteNotaPsicologia
} from "../../controllers/notas_especializadas/nota_psicologia.controller";

const router = Router();

router.get("/", getNotasPsicologia);
router.get("/:id", getNotaPsicologiaById);
router.post("/", createNotaPsicologia);
router.put("/:id", updateNotaPsicologia);
router.delete("/:id", deleteNotaPsicologia);

export default router;