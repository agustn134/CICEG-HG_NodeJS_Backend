// // src/routes/gestion_expedientes/expediente.routes.ts
// import { Router } from "express";
// import {
//   getExpedientes,
//   getExpedienteById,
//   createExpediente,
//   updateExpediente,
//   deleteExpediente
// } from "../../controllers/gestion_expedientes/expediente.controller";

// const router = Router();

// router.get("/", getExpedientes);
// router.get("/:id", getExpedienteById);
// router.post("/", createExpediente);
// router.put("/:id", updateExpediente);
// router.delete("/:id", deleteExpediente);

// export default router;

// src/routes/gestion_expedientes/expediente.routes.ts
import { Router } from "express";
import {
  getExpedientes,
  getExpedienteById,
  createExpediente,
  updateExpediente,
  deleteExpediente,
  getExpedientesByPaciente,
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
// RUTAS BÁSICAS CRUD
// ==========================================

// GET /api/expedientes - Obtener todos los expedientes con filtros
router.get("/", getExpedientes);

// GET /api/expedientes/buscar - Buscar expedientes (autocomplete)
router.get("/buscar", buscarExpedientes);

// GET /api/expedientes/dashboard - Obtener dashboard de expedientes
router.get("/dashboard", getDashboardExpedientes);

// GET /api/expedientes/:id - Obtener expediente por ID
router.get("/:id", getExpedienteById);

// POST /api/expedientes - Crear nuevo expediente
router.post("/", createExpediente);

// PUT /api/expedientes/:id - Actualizar expediente
router.put("/:id", updateExpediente);

// DELETE /api/expedientes/:id - Eliminar expediente (soft delete)
router.delete("/:id", deleteExpediente);

// ==========================================
// RUTAS ESPECÍFICAS POR EXPEDIENTE
// ==========================================

// GET /api/expedientes/:id/auditoria - Obtener historial de auditoría
router.get("/:id/auditoria", getAuditoriaExpediente);

// GET /api/expedientes/:id/alertas - Obtener alertas del expediente
router.get("/:id/alertas", getAlertasExpediente);

// PUT /api/expedientes/:id/alertas/:id_alerta - Actualizar alerta específica
router.put("/:id/alertas/:id_alerta", updateAlertaExpediente);

// POST /api/expedientes/:id/validar-acceso - Validar acceso al expediente (reingreso)
router.post("/:id/validar-acceso", validarAccesoExpediente);

// POST /api/expedientes/:id/validar-reingreso - Completar validación de reingreso
router.post("/:id/validar-reingreso", validarReingresoExpediente);

// GET /api/expedientes/:id/reporte - Generar reporte del expediente
router.get("/:id/reporte", generarReporteExpediente);

// ==========================================
// RUTAS POR PACIENTE
// ==========================================

// GET /api/expedientes/paciente/:id_paciente - Obtener expedientes de un paciente
router.get("/paciente/:id_paciente", getExpedientesByPaciente);

export default router;