// src/routes/documentos_clinicos/nota_egreso.routes.ts
import { Router } from "express";
import {
  getNotasEgreso,
  getNotaEgresoById,
  createNotaEgreso,
  updateNotaEgreso,
  deleteNotaEgreso,
  getNotasEgresoByExpediente,
  getNotasEgresoByPaciente,
  searchNotasEgreso,
  getNotasEgresoWithDetails,
  estadisticasNotasEgreso,
  validarNotaEgreso
} from "../../controllers/documentos_clinicos/nota_egreso.controller";

const router = Router();

// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================

// GET /api/documentos-clinicos/notas-egreso - Obtener todas las notas de egreso
router.get("/", getNotasEgreso);

// GET /api/documentos-clinicos/notas-egreso/:id - Obtener nota de egreso por ID
router.get("/:id", getNotaEgresoById);

// POST /api/documentos-clinicos/notas-egreso - Crear nueva nota de egreso
router.post("/", createNotaEgreso);

// PUT /api/documentos-clinicos/notas-egreso/:id - Actualizar nota de egreso
router.put("/:id", updateNotaEgreso);

// DELETE /api/documentos-clinicos/notas-egreso/:id - Eliminar nota de egreso
router.delete("/:id", deleteNotaEgreso);

// ==========================================
// RUTAS ESPECÍFICAS Y CONSULTAS AVANZADAS
// ==========================================

// GET /api/documentos-clinicos/notas-egreso/expediente/:id_expediente - Obtener notas por expediente
router.get("/expediente/:id_expediente", getNotasEgresoByExpediente);

// GET /api/documentos-clinicos/notas-egreso/paciente/:id_paciente - Obtener notas por paciente
router.get("/paciente/:id_paciente", getNotasEgresoByPaciente);

// GET /api/documentos-clinicos/notas-egreso/search/:query - Buscar notas de egreso
router.get("/search/:query", searchNotasEgreso);

// GET /api/documentos-clinicos/notas-egreso/details/all - Obtener notas con información completa
router.get("/details/all", getNotasEgresoWithDetails);

// GET /api/documentos-clinicos/notas-egreso/estadisticas/general - Estadísticas de egresos
router.get("/estadisticas/general", estadisticasNotasEgreso);

// POST /api/documentos-clinicos/notas-egreso/:id/validar - Validar completitud de nota
router.post("/:id/validar", validarNotaEgreso);

export default router;