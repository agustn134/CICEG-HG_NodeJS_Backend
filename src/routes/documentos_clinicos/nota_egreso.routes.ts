// src/routes/documentos_clinicos/nota_egreso.routes.ts
import { Router } from "express";
import {
  getNotasEgreso,
  getNotaEgresoById,
  createNotaEgreso,
  updateNotaEgreso,
  deleteNotaEgreso
} from "../../controllers/documentos_clinicos/nota_egreso.controller";

const router = Router();

router.get("/", getNotasEgreso);
router.get("/:id", getNotaEgresoById);
router.post("/", createNotaEgreso);
router.put("/:id", updateNotaEgreso);
router.delete("/:id", deleteNotaEgreso);

export default router;