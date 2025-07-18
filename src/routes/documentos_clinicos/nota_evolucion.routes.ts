// src/routes/documentos_clinicos/nota_evolucion.routes.ts
import { Router } from "express";
import {
  getNotasEvolucion,
  getNotaEvolucionById,
  createNotaEvolucion,
  updateNotaEvolucion,
  deleteNotaEvolucion,
  getNotaEvolucionByDocumento,
  getNotasEvolucionByExpediente,
  getEstadisticasNotasEvolucion  // 🔥 AGREGAR ESTA IMPORTACIÓN
} from "../../controllers/documentos_clinicos/nota_evolucion.controller";

const router = Router();

// 🔥 AGREGAR ESTA RUTA (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasNotasEvolucion);

// GET /api/documentos-clinicos/notas-evolucion/documento/:id_documento
router.get("/documento/:id_documento", getNotaEvolucionByDocumento);

// GET /api/documentos-clinicos/notas-evolucion/expediente/:id_expediente  
router.get("/expediente/:id_expediente", getNotasEvolucionByExpediente);

// GET /api/documentos-clinicos/notas-evolucion
router.get("/", getNotasEvolucion);

// GET /api/documentos-clinicos/notas-evolucion/:id
router.get("/:id", getNotaEvolucionById);

// POST /api/documentos-clinicos/notas-evolucion
router.post("/", createNotaEvolucion);

// PUT /api/documentos-clinicos/notas-evolucion/:id
router.put("/:id", updateNotaEvolucion);

// DELETE /api/documentos-clinicos/notas-evolucion/:id
router.delete("/:id", deleteNotaEvolucion);

export default router;