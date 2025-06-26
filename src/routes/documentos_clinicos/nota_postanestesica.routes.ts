// ==========================================
// RUTAS PARA NOTA POSTANESTESICA
// ==========================================
// src/routes/documentos_clinicos/nota_postanestesica.routes.ts
import { Router } from "express";
import {
  getNotasPostanestesica,
  getNotaPostanestesicaById,
  createNotaPostanestesica,
  updateNotaPostanestesica,
  deleteNotaPostanestesica,
  getNotasPostanestesicaByExpediente,
  getTiposAnestesia
} from "../../controllers/documentos_clinicos/nota_postanestesica.controller";

const router = Router();

// Rutas básicas CRUD
router.get("/", getNotasPostanestesica);
router.get("/:id", getNotaPostanestesicaById);
router.post("/", createNotaPostanestesica);
router.put("/:id", updateNotaPostanestesica);
router.delete("/:id", deleteNotaPostanestesica);

// Rutas adicionales
router.get("/expediente/:id_expediente", getNotasPostanestesicaByExpediente);
router.get("/catalogos/tipos-anestesia", getTiposAnestesia);

export default router;