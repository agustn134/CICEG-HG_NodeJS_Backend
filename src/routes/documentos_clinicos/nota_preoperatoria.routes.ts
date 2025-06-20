// src/routes/documentos_clinicos/nota_preoperatoria.routes.ts
import { Router } from "express";
import {
  getNotasPreoperatoria,
  getNotaPreoperatoriaById,
  createNotaPreoperatoria,
  updateNotaPreoperatoria,
  deleteNotaPreoperatoria
} from "../../controllers/documentos_clinicos/nota_preoperatoria.controller";

const router = Router();

router.get("/", getNotasPreoperatoria);
router.get("/:id", getNotaPreoperatoriaById);
router.post("/", createNotaPreoperatoria);
router.put("/:id", updateNotaPreoperatoria);
router.delete("/:id", deleteNotaPreoperatoria);

export default router;