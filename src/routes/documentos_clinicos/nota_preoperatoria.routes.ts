// ==========================================
// RUTAS PARA NOTA PREOPERATORIA
// ==========================================
// src/routes/documentos_clinicos/nota_preoperatoria.routes.ts
import { Router } from "express";
import {
  getNotasPreoperatoria,
  getNotaPreoperatoriaById,
  createNotaPreoperatoria,
  updateNotaPreoperatoria,
  deleteNotaPreoperatoria,
  getNotasPreoperatoriaByExpediente
} from "../../controllers/documentos_clinicos/nota_preoperatoria.controller";

const router = Router();

// Rutas básicas CRUD
router.get("/", getNotasPreoperatoria);
router.get("/:id", getNotaPreoperatoriaById);
router.post("/", createNotaPreoperatoria);
router.put("/:id", updateNotaPreoperatoria);
router.delete("/:id", deleteNotaPreoperatoria);

// Rutas adicionales
router.get("/expediente/:id_expediente", getNotasPreoperatoriaByExpediente);

export default router;

