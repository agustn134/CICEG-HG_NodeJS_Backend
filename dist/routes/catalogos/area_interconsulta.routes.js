"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/area_interconsulta.routes.ts
const express_1 = require("express");
const area_interconsulta_controller_1 = require("../../controllers/catalogos/area_interconsulta.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA ÁREAS DE INTERCONSULTA
// ==========================================
// GET /api/catalogos/areas-interconsulta/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", area_interconsulta_controller_1.getEstadisticasInterconsultas);
// GET /api/catalogos/areas-interconsulta/activas - Obtener solo áreas activas (para selects)
router.get("/activas", area_interconsulta_controller_1.getAreasInterconsultaActivas);
// GET /api/catalogos/areas-interconsulta - Obtener todas las áreas
router.get("/", area_interconsulta_controller_1.getAreasInterconsulta);
// GET /api/catalogos/areas-interconsulta/:id - Obtener área por ID
router.get("/:id", area_interconsulta_controller_1.getAreaInterconsultaById);
// POST /api/catalogos/areas-interconsulta - Crear nueva área
router.post("/", area_interconsulta_controller_1.createAreaInterconsulta);
// PUT /api/catalogos/areas-interconsulta/:id - Actualizar área
router.put("/:id", area_interconsulta_controller_1.updateAreaInterconsulta);
// DELETE /api/catalogos/areas-interconsulta/:id - Eliminar área
router.delete("/:id", area_interconsulta_controller_1.deleteAreaInterconsulta);
exports.default = router;
