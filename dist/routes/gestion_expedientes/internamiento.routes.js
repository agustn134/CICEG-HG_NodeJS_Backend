"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gestion_expedientes/internamiento.routes.ts
const express_1 = require("express");
const internamiento_controller_1 = require("../../controllers/gestion_expedientes/internamiento.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA INTERNAMIENTOS
// ==========================================
// GET /api/gestion-expedientes/internamientos/dashboard - Dashboard (debe ir ANTES que /:id)
router.get("/dashboard", internamiento_controller_1.getDashboardInternamientos);
// GET /api/gestion-expedientes/internamientos/activos - Internamientos activos
router.get("/activos", internamiento_controller_1.getInternamientosActivos);
// GET /api/gestion-expedientes/internamientos/buscar - Búsqueda autocomplete
router.get("/buscar", internamiento_controller_1.buscarInternamientos);
// GET /api/gestion-expedientes/internamientos/estadisticas - Estadísticas
router.get("/estadisticas", internamiento_controller_1.getEstadisticasInternamientos);
// GET /api/gestion-expedientes/internamientos/historial/paciente/:id_paciente - Historial por paciente
router.get("/historial/paciente/:id_paciente", internamiento_controller_1.getHistorialInternamientosPaciente);
// GET /api/gestion-expedientes/internamientos - Obtener todos los internamientos
router.get("/", internamiento_controller_1.getInternamientos);
// GET /api/gestion-expedientes/internamientos/:id - Obtener internamiento por ID
router.get("/:id", internamiento_controller_1.getInternamientoById);
// POST /api/gestion-expedientes/internamientos - Crear nuevo internamiento
router.post("/", internamiento_controller_1.createInternamiento);
// PUT /api/gestion-expedientes/internamientos/:id - Actualizar internamiento
router.put("/:id", internamiento_controller_1.updateInternamiento);
// PUT /api/gestion-expedientes/internamientos/:id/egreso - Egresar paciente
router.put("/:id/egreso", internamiento_controller_1.egresarPaciente);
// PUT /api/gestion-expedientes/internamientos/:id/transferencia - Transferir paciente
router.put("/:id/transferencia", internamiento_controller_1.transferirPaciente);
exports.default = router;
