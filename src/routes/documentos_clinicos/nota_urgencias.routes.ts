// src/routes/documentos_clinicos/nota_urgencias.routes.ts
import { Router } from "express";
import {
  getNotasUrgencias,
  getNotaUrgenciasById,
  createNotaUrgencias,
  updateNotaUrgencias,
  deleteNotaUrgencias,
  getNotasUrgenciasByExpediente,
  getNotaUrgenciasByDocumento,
  getEstadisticasUrgencias,
  getPanelUrgenciasTiempoReal,
  getPacientesFrecuentesUrgencias
} from "../../controllers/documentos_clinicos/nota_urgencias.controller";

const router = Router();

// ==========================================
// RUTAS PARA NOTAS DE URGENCIAS
// ==========================================

// GET /api/documentos-clinicos/notas-urgencias/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasUrgencias);

// GET /api/documentos-clinicos/notas-urgencias/panel-tiempo-real - Panel de urgencias en tiempo real
router.get("/panel-tiempo-real", getPanelUrgenciasTiempoReal);

// GET /api/documentos-clinicos/notas-urgencias/pacientes-frecuentes - Pacientes frecuentes en urgencias
router.get("/pacientes-frecuentes", getPacientesFrecuentesUrgencias);

// GET /api/documentos-clinicos/notas-urgencias/expediente/:id_expediente - Obtener notas por expediente
router.get("/expediente/:id_expediente", getNotasUrgenciasByExpediente);

// GET /api/documentos-clinicos/notas-urgencias/documento/:id_documento - Obtener nota por documento
router.get("/documento/:id_documento", getNotaUrgenciasByDocumento);

// GET /api/documentos-clinicos/notas-urgencias - Obtener todas las notas de urgencias
// Acepta query params: ?page=1&limit=15&buscar=trauma&estado_conciencia=alerta&area_interconsulta=1
router.get("/", getNotasUrgencias);

// GET /api/documentos-clinicos/notas-urgencias/:id - Obtener nota de urgencias por ID
router.get("/:id", getNotaUrgenciasById);

// POST /api/documentos-clinicos/notas-urgencias - Crear nueva nota de urgencias
router.post("/", createNotaUrgencias);

// PUT /api/documentos-clinicos/notas-urgencias/:id - Actualizar nota de urgencias
router.put("/:id", updateNotaUrgencias);

// DELETE /api/documentos-clinicos/notas-urgencias/:id - Anular nota de urgencias
router.delete("/:id", deleteNotaUrgencias);

export default router;