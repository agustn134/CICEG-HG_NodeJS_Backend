"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/servicio.routes.ts
const express_1 = require("express");
const servicio_controller_1 = require("../../controllers/catalogos/servicio.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA SERVICIOS HOSPITALARIOS
// ==========================================
// GET /api/catalogos/servicios/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", servicio_controller_1.getEstadisticasServicios);
// GET /api/catalogos/servicios/activos - Obtener solo servicios activos (para selects)
router.get("/activos", servicio_controller_1.getServiciosActivos);
// GET /api/catalogos/servicios - Obtener todos los servicios
router.get("/", servicio_controller_1.getServicios);
// GET /api/catalogos/servicios/:id - Obtener servicio por ID
router.get("/:id", servicio_controller_1.getServicioById);
// POST /api/catalogos/servicios - Crear nuevo servicio
router.post("/", servicio_controller_1.createServicio);
// PUT /api/catalogos/servicios/:id - Actualizar servicio
router.put("/:id", servicio_controller_1.updateServicio);
// DELETE /api/catalogos/servicios/:id - Eliminar servicio
router.delete("/:id", servicio_controller_1.deleteServicio);
exports.default = router;
