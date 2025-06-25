"use strict";
// // src/routes/gestion_expedientes/expediente.routes.ts
// import { Router } from "express";
// import {
//   getExpedientes,
//   getExpedienteById,
//   createExpediente,
//   updateExpediente,
//   deleteExpediente
// } from "../../controllers/gestion_expedientes/expediente.controller";
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.get("/", getExpedientes);
// router.get("/:id", getExpedienteById);
// router.post("/", createExpediente);
// router.put("/:id", updateExpediente);
// router.delete("/:id", deleteExpediente);
// export default router;
// src/routes/gestion_expedientes/expediente.routes.ts
const express_1 = require("express");
const expediente_controller_1 = require("../../controllers/gestion_expedientes/expediente.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================
// GET /api/expedientes - Obtener todos los expedientes con filtros
router.get("/", expediente_controller_1.getExpedientes);
// GET /api/expedientes/buscar - Buscar expedientes (autocomplete)
router.get("/buscar", expediente_controller_1.buscarExpedientes);
// GET /api/expedientes/dashboard - Obtener dashboard de expedientes
router.get("/dashboard", expediente_controller_1.getDashboardExpedientes);
// GET /api/expedientes/:id - Obtener expediente por ID
router.get("/:id", expediente_controller_1.getExpedienteById);
// POST /api/expedientes - Crear nuevo expediente
router.post("/", expediente_controller_1.createExpediente);
// PUT /api/expedientes/:id - Actualizar expediente
router.put("/:id", expediente_controller_1.updateExpediente);
// DELETE /api/expedientes/:id - Eliminar expediente (soft delete)
router.delete("/:id", expediente_controller_1.deleteExpediente);
// ==========================================
// RUTAS ESPECÍFICAS POR EXPEDIENTE
// ==========================================
// GET /api/expedientes/:id/auditoria - Obtener historial de auditoría
router.get("/:id/auditoria", expediente_controller_1.getAuditoriaExpediente);
// GET /api/expedientes/:id/alertas - Obtener alertas del expediente
router.get("/:id/alertas", expediente_controller_1.getAlertasExpediente);
// PUT /api/expedientes/:id/alertas/:id_alerta - Actualizar alerta específica
router.put("/:id/alertas/:id_alerta", expediente_controller_1.updateAlertaExpediente);
// POST /api/expedientes/:id/validar-acceso - Validar acceso al expediente (reingreso)
router.post("/:id/validar-acceso", expediente_controller_1.validarAccesoExpediente);
// POST /api/expedientes/:id/validar-reingreso - Completar validación de reingreso
router.post("/:id/validar-reingreso", expediente_controller_1.validarReingresoExpediente);
// GET /api/expedientes/:id/reporte - Generar reporte del expediente
router.get("/:id/reporte", expediente_controller_1.generarReporteExpediente);
// ==========================================
// RUTAS POR PACIENTE
// ==========================================
// GET /api/expedientes/paciente/:id_paciente - Obtener expedientes de un paciente
router.get("/paciente/:id_paciente", expediente_controller_1.getExpedientesByPaciente);
exports.default = router;
