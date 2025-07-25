"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_pediatrico_controller_1 = require("../../controllers/pediatria/dashboard_pediatrico.controller");
const router = (0, express_1.Router)();
router.get('/estadisticas', dashboard_pediatrico_controller_1.DashboardPediatricoController.obtenerEstadisticas);
router.get('/pacientes-activos', dashboard_pediatrico_controller_1.DashboardPediatricoController.obtenerPacientesActivos);
router.get('/distribucion-edades', dashboard_pediatrico_controller_1.DashboardPediatricoController.obtenerDistribucionEdades);
router.get('/alertas', dashboard_pediatrico_controller_1.DashboardPediatricoController.obtenerAlertasPediatricas);
exports.default = router;
