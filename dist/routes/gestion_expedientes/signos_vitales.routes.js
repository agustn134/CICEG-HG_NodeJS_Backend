"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gestion_expedientes/signos_vitales.routes.ts
const express_1 = require("express");
const signos_vitales_controller_1 = require("../../controllers/gestion_expedientes/signos_vitales.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS ESPECIALIZADAS (DEBEN IR ANTES QUE /:id)
// ==========================================
// GET /api/gestion-expedientes/signos-vitales/expediente/:id_expediente/ultimos
// Obtener últimos signos vitales de un expediente
router.get("/expediente/:id_expediente/ultimos", signos_vitales_controller_1.getUltimosSignosVitalesPaciente);
// GET /api/gestion-expedientes/signos-vitales/expediente/:id_expediente/historial
// Obtener historial completo de signos vitales de un expediente
router.get("/expediente/:id_expediente/historial", signos_vitales_controller_1.getHistorialSignosVitales);
// GET /api/gestion-expedientes/signos-vitales/expediente/:id_expediente/grafica
// Obtener datos para gráfica de signos vitales
router.get("/expediente/:id_expediente/grafica", signos_vitales_controller_1.getGraficaSignosVitales);
// ==========================================
// RUTAS POR PACIENTE (DEBEN IR ANTES QUE /:id)
// ==========================================
//    RUTA NUEVA: GET /api/gestion-expedientes/signos-vitales/paciente/:pacienteId
router.get("/paciente/:pacienteId", signos_vitales_controller_1.getSignosVitalesByPacienteId);
// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================
// GET /api/gestion-expedientes/signos-vitales
// Obtener todos los signos vitales con filtros y paginación
// Query params: id_expediente, id_internamiento, fecha_inicio, fecha_fin, incluir_anormales, limit, offset
router.get("/", signos_vitales_controller_1.getSignosVitales);
// POST /api/gestion-expedientes/signos-vitales
// Crear nuevos signos vitales
router.post("/", signos_vitales_controller_1.createSignosVitales);
// ==========================================
// RUTAS POR ID (DEBEN IR AL FINAL)
// ==========================================
// GET /api/gestion-expedientes/signos-vitales/:id
// Obtener signos vitales por ID específico
router.get("/:id", signos_vitales_controller_1.getSignosVitalesById);
// PUT /api/gestion-expedientes/signos-vitales/:id
// Actualizar signos vitales existentes
router.put("/:id", signos_vitales_controller_1.updateSignosVitales);
// DELETE /api/gestion-expedientes/signos-vitales/:id
// Eliminar (anular) signos vitales
router.delete("/:id", signos_vitales_controller_1.deleteSignosVitales);
exports.default = router;
