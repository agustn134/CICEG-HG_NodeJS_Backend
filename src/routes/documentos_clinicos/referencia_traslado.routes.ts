// src/routes/documentos_clinicos/referencia_traslado.routes.ts
import { Router } from "express";
import {
  getReferenciasTraslado,
  getReferenciaTrasladoById,
  createReferenciaTraslado,
  updateReferenciaTraslado,
  deleteReferenciaTraslado,
  updateEstadoTraslado
} from "../../controllers/documentos_clinicos/referencia_traslado.controller";

const router = Router();

// Obtener todas las referencias de traslado (con paginación y filtros)
router.get("/", getReferenciasTraslado);

// Obtener una referencia de traslado por ID
router.get("/:id", getReferenciaTrasladoById);

// Crear una nueva referencia de traslado
router.post("/", createReferenciaTraslado);

// Actualizar una referencia de traslado por ID
router.put("/:id", updateReferenciaTraslado);

// Eliminar una referencia de traslado por ID
router.delete("/:id", deleteReferenciaTraslado);

// Actualizar el estado de una referencia de traslado
router.patch("/:id/estado", updateEstadoTraslado);

export default router;