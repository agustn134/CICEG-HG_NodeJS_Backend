"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gestion_expedientes/cama.routes.ts
const express_1 = require("express");
const cama_controller_1 = require("../../controllers/gestion_expedientes/cama.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA GESTIÓN DE CAMAS
// ==========================================
// GET /api/gestion-expedientes/camas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", cama_controller_1.getEstadisticasCamas);
// GET /api/gestion-expedientes/camas/ocupacion-tiempo-real - Panel de ocupación en tiempo real
router.get("/ocupacion-tiempo-real", cama_controller_1.getOcupacionTiempoReal);
// GET /api/gestion-expedientes/camas/reporte-rotacion - Reporte de rotación de camas
router.get("/reporte-rotacion", cama_controller_1.getReporteRotacionCamas);
// GET /api/gestion-expedientes/camas/servicio/:id_servicio/disponibles - Camas disponibles por servicio
router.get("/servicio/:id_servicio/disponibles", cama_controller_1.getCamasDisponiblesByServicio);
// PUT /api/gestion-expedientes/camas/:id/cambiar-estado - Cambiar estado de cama
router.put("/:id/cambiar-estado", cama_controller_1.cambiarEstadoCama);
// PUT /api/gestion-expedientes/camas/:id/liberar - Liberar cama (para egreso)
router.put("/:id/liberar", cama_controller_1.liberarCama);
// GET /api/gestion-expedientes/camas - Obtener todas las camas
// Acepta query params: ?page=1&limit=20&estado=Disponible&id_servicio=21&area=Urgencias&buscar=U-01&solo_disponibles=true
router.get("/", cama_controller_1.getCamas);
// GET /api/gestion-expedientes/camas/:id - Obtener cama por ID
router.get("/:id", cama_controller_1.getCamaById);
// POST /api/gestion-expedientes/camas - Crear nueva cama
router.post("/", cama_controller_1.createCama);
// PUT /api/gestion-expedientes/camas/:id - Actualizar cama
router.put("/:id", cama_controller_1.updateCama);
// DELETE /api/gestion-expedientes/camas/:id - Eliminar/dar de baja cama
router.delete("/:id", cama_controller_1.deleteCama);
exports.default = router;
