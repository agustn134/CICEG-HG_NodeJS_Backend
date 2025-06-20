// src/routes/documentos_clinicos/nota_evolucion.routes.ts
import { Router } from "express";
import {
  getNotasEvolucion,
  getNotaEvolucionById,
  createNotaEvolucion,
  updateNotaEvolucion,
  deleteNotaEvolucion
} from "../../controllers/documentos_clinicos/nota_evolucion.controller";

const router = Router();

router.get("/", getNotasEvolucion);
router.get("/:id", getNotaEvolucionById);
router.post("/", createNotaEvolucion);
router.put("/:id", updateNotaEvolucion);
router.delete("/:id", deleteNotaEvolucion);

export default router;