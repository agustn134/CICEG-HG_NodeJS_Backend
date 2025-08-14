"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gestion_expedientes/expediente.routes.ts
const express_1 = require("express");
const expediente_controller_1 = require("../../controllers/gestion_expedientes/expediente.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS ESPECIALES (DEBEN IR ANTES QUE /:id)
// ==========================================
// GET /api/gestion-expedientes/expedientes/buscar - Buscar expedientes (autocomplete)
router.get("/buscar", expediente_controller_1.buscarExpedientes);
// GET /api/gestion-expedientes/expedientes/dashboard - Obtener dashboard de expedientes
router.get("/dashboard", expediente_controller_1.getDashboardExpedientes);
// ==========================================
// RUTAS POR PACIENTE (DEBEN IR ANTES QUE /:id)
// ==========================================
//    RUTA NUEVA: GET /api/gestion-expedientes/expedientes/paciente/:pacienteId/principal
router.get("/paciente/:pacienteId/principal", expediente_controller_1.getExpedienteByPacienteId);
// GET /api/gestion-expedientes/expedientes/paciente/:id_paciente - Obtener expedientes de un paciente
router.get("/paciente/:id_paciente", expediente_controller_1.getExpedientesByPaciente);
// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================
// GET /api/gestion-expedientes/expedientes - Obtener todos los expedientes con filtros
router.get("/", expediente_controller_1.getExpedientes);
// POST /api/gestion-expedientes/expedientes - Crear nuevo expediente
router.post("/", expediente_controller_1.createExpediente);
// ==========================================
// RUTAS ESPECÍFICAS POR EXPEDIENTE (DEBEN IR ANTES QUE /:id)
// ==========================================
// GET /api/gestion-expedientes/expedientes/:id/auditoria - Obtener historial de auditoría
router.get("/:id/auditoria", expediente_controller_1.getAuditoriaExpediente);
// GET /api/gestion-expedientes/expedientes/:id/alertas - Obtener alertas del expediente
router.get("/:id/alertas", expediente_controller_1.getAlertasExpediente);
// PUT /api/gestion-expedientes/expedientes/:id/alertas/:id_alerta - Actualizar alerta específica
router.put("/:id/alertas/:id_alerta", expediente_controller_1.updateAlertaExpediente);
// POST /api/gestion-expedientes/expedientes/:id/validar-acceso - Validar acceso al expediente (reingreso)
router.post("/:id/validar-acceso", expediente_controller_1.validarAccesoExpediente);
// POST /api/gestion-expedientes/expedientes/:id/validar-reingreso - Completar validación de reingreso
router.post("/:id/validar-reingreso", expediente_controller_1.validarReingresoExpediente);
// GET /api/gestion-expedientes/expedientes/:id/reporte - Generar reporte del expediente
router.get("/:id/reporte", expediente_controller_1.generarReporteExpediente);
// ==========================================
// RUTAS BÁSICAS CRUD POR ID (DEBEN IR AL FINAL)
// ==========================================
// GET /api/gestion-expedientes/expedientes/:id - Obtener expediente por ID
router.get("/:id", expediente_controller_1.getExpedienteById);
// PUT /api/gestion-expedientes/expedientes/:id - Actualizar expediente
router.put("/:id", expediente_controller_1.updateExpediente);
// DELETE /api/gestion-expedientes/expedientes/:id - Eliminar expediente (soft delete)
router.delete("/:id", expediente_controller_1.deleteExpediente);
exports.default = router;
