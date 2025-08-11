
// src/routes/documentos_clinicos/nota_preanestesica.routes.ts
import { Router } from "express";
import {
  getNotasPreanestesica,
  getNotaPreanestesicaById,
  createNotaPreanestesica,
  updateNotaPreanestesica,
  deleteNotaPreanestesica,
  getNotasPreanestesicaByExpediente,
  getClasificacionesASA
} from "../../controllers/documentos_clinicos/nota_preanestesica.controller";
const router = Router();
router.get("/", getNotasPreanestesica);
router.get("/:id", getNotaPreanestesicaById);
router.post("/", createNotaPreanestesica);
router.put("/:id", updateNotaPreanestesica);
router.delete("/:id", deleteNotaPreanestesica);
router.get("/expediente/:id_expediente", getNotasPreanestesicaByExpediente);
router.get("/catalogos/clasificaciones-asa", getClasificacionesASA);

export default router;

