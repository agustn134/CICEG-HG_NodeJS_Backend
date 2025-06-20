// src/routes/documentos_clinicos/nota_postanestesica.routes.ts
import { Router } from "express";
import {
  getNotasPostanestesica,
  getNotaPostanestesicaById,
  createNotaPostanestesica,
  updateNotaPostanestesica,
  deleteNotaPostanestesica
} from "../../controllers/documentos_clinicos/nota_postanestesica.controller";

const router = Router();

router.get("/", getNotasPostanestesica);
router.get("/:id", getNotaPostanestesicaById);
router.post("/", createNotaPostanestesica);
router.put("/:id", updateNotaPostanestesica);
router.delete("/:id", deleteNotaPostanestesica);

export default router;