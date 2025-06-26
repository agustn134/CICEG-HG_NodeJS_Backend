"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gestion_expedientes/signos_vitales.routes.ts
const express_1 = require("express");
const signos_vitales_controller_1 = require("../../controllers/gestion_expedientes/signos_vitales.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================
// Obtener todos los signos vitales con filtros y paginación
// GET /api/signos-vitales?id_expediente=1&fecha_inicio=2024-01-01&limit=50&offset=0
router.get("/", signos_vitales_controller_1.getSignosVitales);
// Obtener signos vitales por ID específico
// GET /api/signos-vitales/123
router.get("/:id", signos_vitales_controller_1.getSignosVitalesById);
// Crear nuevos signos vitales
// POST /api/signos-vitales
router.post("/", signos_vitales_controller_1.createSignosVitales);
// Actualizar signos vitales existentes
// PUT /api/signos-vitales/123
router.put("/:id", signos_vitales_controller_1.updateSignosVitales);
// Eliminar (anular) signos vitales
// DELETE /api/signos-vitales/123
router.delete("/:id", signos_vitales_controller_1.deleteSignosVitales);
// ==========================================
// RUTAS ESPECIALIZADAS
// ==========================================
// Obtener últimos signos vitales de un expediente
// GET /api/signos-vitales/expediente/123/ultimos?limite=1
router.get("/expediente/:id_expediente/ultimos", signos_vitales_controller_1.getUltimosSignosVitalesPaciente);
// Obtener historial completo de signos vitales de un expediente
// GET /api/signos-vitales/expediente/123/historial?fecha_inicio=2024-01-01&tipo_signo=temperatura
router.get("/expediente/:id_expediente/historial", signos_vitales_controller_1.getHistorialSignosVitales);
// Obtener datos para gráfica de signos vitales
// GET /api/signos-vitales/expediente/123/grafica?tipo_signo=todos&dias=7
router.get("/expediente/:id_expediente/grafica", signos_vitales_controller_1.getGraficaSignosVitales);
exports.default = router;
