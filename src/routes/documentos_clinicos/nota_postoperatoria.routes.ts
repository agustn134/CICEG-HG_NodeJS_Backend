// src/routes/documentos_clinicos/nota_postoperatoria.routes.ts
import { Router } from "express";
import {
  getNotasPostoperatoria,
  getNotaPostoperatoriaById,
  createNotaPostoperatoria,
  updateNotaPostoperatoria,
  deleteNotaPostoperatoria
} from "../../controllers/documentos_clinicos/nota_postoperatoria.controller";

const router = Router();

router.get("/", getNotasPostoperatoria);
router.get("/:id", getNotaPostoperatoriaById);
router.post("/", createNotaPostoperatoria);
router.put("/:id", updateNotaPostoperatoria);
router.delete("/:id", deleteNotaPostoperatoria);

export default router;