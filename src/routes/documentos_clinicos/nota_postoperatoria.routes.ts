// ==========================================
// RUTAS PARA NOTA POSTOPERATORIA
// ==========================================
// src/routes/documentos_clinicos/nota_postoperatoria.routes.ts
import { Router } from "express";
import {
  getNotasPostoperatoria,
  getNotaPostoperatoriaById,
  createNotaPostoperatoria,
  updateNotaPostoperatoria,
  deleteNotaPostoperatoria,
  getNotasPostoperatoriaByExpediente
} from "../../controllers/documentos_clinicos/nota_postoperatoria.controller";

const router = Router();

// Rutas básicas CRUD
router.get("/", getNotasPostoperatoria);
router.get("/:id", getNotaPostoperatoriaById);
router.post("/", createNotaPostoperatoria);
router.put("/:id", updateNotaPostoperatoria);
router.delete("/:id", deleteNotaPostoperatoria);

// Rutas adicionales
router.get("/expediente/:id_expediente", getNotasPostoperatoriaByExpediente);

export default router;

