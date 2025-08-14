// src/routes/gestion_expedientes/expediente.routes.ts
import { Router } from "express";
import {
  getExpedientes,
  getExpedienteById,
  createExpediente,
  updateExpediente,
  deleteExpediente,
  getExpedientesByPaciente,
  getExpedienteByPacienteId,  //    AGREGAR ESTA IMPORTACIÓN
  buscarExpedientes,
  getDashboardExpedientes,
  validarAccesoExpediente,
  getAuditoriaExpediente,
  getAlertasExpediente,
  updateAlertaExpediente,
  generarReporteExpediente,
  validarReingresoExpediente
} from "../../controllers/gestion_expedientes/expediente.controller";

const router = Router();

// ==========================================
// RUTAS ESPECIALES (DEBEN IR ANTES QUE /:id)
// ==========================================

// GET /api/gestion-expedientes/expedientes/buscar - Buscar expedientes (autocomplete)
router.get("/buscar", buscarExpedientes);

// GET /api/gestion-expedientes/expedientes/dashboard - Obtener dashboard de expedientes
router.get("/dashboard", getDashboardExpedientes);

// ==========================================
// RUTAS POR PACIENTE (DEBEN IR ANTES QUE /:id)
// ==========================================

//    RUTA NUEVA: GET /api/gestion-expedientes/expedientes/paciente/:pacienteId/principal
router.get("/paciente/:pacienteId/principal", getExpedienteByPacienteId);

// GET /api/gestion-expedientes/expedientes/paciente/:id_paciente - Obtener expedientes de un paciente
router.get("/paciente/:id_paciente", getExpedientesByPaciente);

// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================

// GET /api/gestion-expedientes/expedientes - Obtener todos los expedientes con filtros
router.get("/", getExpedientes);

// POST /api/gestion-expedientes/expedientes - Crear nuevo expediente
router.post("/", createExpediente);

// ==========================================
// RUTAS ESPECÍFICAS POR EXPEDIENTE (DEBEN IR ANTES QUE /:id)
// ==========================================

// GET /api/gestion-expedientes/expedientes/:id/auditoria - Obtener historial de auditoría
router.get("/:id/auditoria", getAuditoriaExpediente);

// GET /api/gestion-expedientes/expedientes/:id/alertas - Obtener alertas del expediente
router.get("/:id/alertas", getAlertasExpediente);

// PUT /api/gestion-expedientes/expedientes/:id/alertas/:id_alerta - Actualizar alerta específica
router.put("/:id/alertas/:id_alerta", updateAlertaExpediente);

// POST /api/gestion-expedientes/expedientes/:id/validar-acceso - Validar acceso al expediente (reingreso)
router.post("/:id/validar-acceso", validarAccesoExpediente);

// POST /api/gestion-expedientes/expedientes/:id/validar-reingreso - Completar validación de reingreso
router.post("/:id/validar-reingreso", validarReingresoExpediente);

// GET /api/gestion-expedientes/expedientes/:id/reporte - Generar reporte del expediente
router.get("/:id/reporte", generarReporteExpediente);

// ==========================================
// RUTAS BÁSICAS CRUD POR ID (DEBEN IR AL FINAL)
// ==========================================

// GET /api/gestion-expedientes/expedientes/:id - Obtener expediente por ID
router.get("/:id", getExpedienteById);

// PUT /api/gestion-expedientes/expedientes/:id - Actualizar expediente
router.put("/:id", updateExpediente);

// DELETE /api/gestion-expedientes/expedientes/:id - Eliminar expediente (soft delete)
router.delete("/:id", deleteExpediente);

export default router;