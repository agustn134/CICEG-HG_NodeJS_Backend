// src/routes/documentos_clinicos/nota_urgencias.routes.ts
import { Router } from "express";
import {
  getNotasUrgencias,
  getNotaUrgenciasById,
  createNotaUrgencias,
  updateNotaUrgencias,
  deleteNotaUrgencias
} from "../../controllers/documentos_clinicos/nota_urgencias.controller";

const router = Router();

router.get("/", getNotasUrgencias);
router.get("/:id", getNotaUrgenciasById);
router.post("/", createNotaUrgencias);
router.put("/:id", updateNotaUrgencias);
router.delete("/:id", deleteNotaUrgencias);

export default router;