// src/routes/documentos_clinicos/nota_evolucion.routes.ts
import { Router } from "express";
import {
  getNotasEvolucion,
  getNotaEvolucionById,
  createNotaEvolucion,
  updateNotaEvolucion,
  deleteNotaEvolucion,
  getNotasEvolucionByExpediente,
  getEstadisticasNotasEvolucion,
  getEvolucionSignosVitales,
  getNotaEvolucionByDocumento,
  createNotaEvolucionRapida,
  getResumenEvolucionClinica
} from "../../controllers/documentos_clinicos/nota_evolucion.controller";

const router = Router();

// ==========================================
// RUTAS PARA NOTAS DE EVOLUCIÓN
// ==========================================

// GET /api/documentos-clinicos/notas-evolucion/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasNotasEvolucion);

// GET /api/documentos-clinicos/notas-evolucion/expediente/:id_expediente/resumen - Resumen de evolución clínica
router.get("/expediente/:id_expediente/resumen", getResumenEvolucionClinica);

// GET /api/documentos-clinicos/notas-evolucion/expediente/:id_expediente/signos-vitales - Evolución de signos vitales
router.get("/expediente/:id_expediente/signos-vitales", getEvolucionSignosVitales);

// GET /api/documentos-clinicos/notas-evolucion/expediente/:id_expediente - Obtener notas por expediente
router.get("/expediente/:id_expediente", getNotasEvolucionByExpediente);

// GET /api/documentos-clinicos/notas-evolucion/documento/:id_documento - Obtener nota por documento
router.get("/documento/:id_documento", getNotaEvolucionByDocumento);

// POST /api/documentos-clinicos/notas-evolucion/rapida - Crear nota de evolución rápida (con función almacenada)
router.post("/rapida", createNotaEvolucionRapida);

// GET /api/documentos-clinicos/notas-evolucion - Obtener todas las notas de evolución
// Acepta query params: ?page=1&limit=10&id_expediente=1&buscar=fiebre&dias_hospitalizacion_min=5
router.get("/", getNotasEvolucion);

// GET /api/documentos-clinicos/notas-evolucion/:id - Obtener nota de evolución por ID
router.get("/:id", getNotaEvolucionById);

// POST /api/documentos-clinicos/notas-evolucion - Crear nueva nota de evolución
router.post("/", createNotaEvolucion);

// PUT /api/documentos-clinicos/notas-evolucion/:id - Actualizar nota de evolución
router.put("/:id", updateNotaEvolucion);

// DELETE /api/documentos-clinicos/notas-evolucion/:id - Anular nota de evolución
router.delete("/:id", deleteNotaEvolucion);

export default router;