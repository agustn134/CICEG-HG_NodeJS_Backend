// src/routes/documentos_clinicos/referencia_traslado.routes.ts
import { Router } from "express";
import {
  getReferenciasTraslado,
  getReferenciaTrasladoById,
  createReferenciaTraslado,
  updateReferenciaTraslado,
  deleteReferenciaTraslado
} from "../../controllers/documentos_clinicos/referencia_traslado.controller";

const router = Router();

router.get("/", getReferenciasTraslado);
router.get("/:id", getReferenciaTrasladoById);
router.post("/", createReferenciaTraslado);
router.put("/:id", updateReferenciaTraslado);
router.delete("/:id", deleteReferenciaTraslado);

export default router;