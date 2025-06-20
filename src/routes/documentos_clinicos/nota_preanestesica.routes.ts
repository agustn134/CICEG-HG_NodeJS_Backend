// src/routes/documentos_clinicos/nota_preanestesica.routes.ts
import { Router } from "express";
import {
  getNotasPreanestesica,
  getNotaPreanestesicaById,
  createNotaPreanestesica,
  updateNotaPreanestesica,
  deleteNotaPreanestesica
} from "../../controllers/documentos_clinicos/nota_preanestesica.controller";

const router = Router();

router.get("/", getNotasPreanestesica);
router.get("/:id", getNotaPreanestesicaById);
router.post("/", createNotaPreanestesica);
router.put("/:id", updateNotaPreanestesica);
router.delete("/:id", deleteNotaPreanestesica);

export default router;