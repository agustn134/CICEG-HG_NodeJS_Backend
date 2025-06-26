"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_egreso.routes.ts
const express_1 = require("express");
const nota_egreso_controller_1 = require("../../controllers/documentos_clinicos/nota_egreso.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================
// GET /api/documentos-clinicos/notas-egreso - Obtener todas las notas de egreso
router.get("/", nota_egreso_controller_1.getNotasEgreso);
// GET /api/documentos-clinicos/notas-egreso/:id - Obtener nota de egreso por ID
router.get("/:id", nota_egreso_controller_1.getNotaEgresoById);
// POST /api/documentos-clinicos/notas-egreso - Crear nueva nota de egreso
router.post("/", nota_egreso_controller_1.createNotaEgreso);
// PUT /api/documentos-clinicos/notas-egreso/:id - Actualizar nota de egreso
router.put("/:id", nota_egreso_controller_1.updateNotaEgreso);
// DELETE /api/documentos-clinicos/notas-egreso/:id - Eliminar nota de egreso
router.delete("/:id", nota_egreso_controller_1.deleteNotaEgreso);
// ==========================================
// RUTAS ESPECÍFICAS Y CONSULTAS AVANZADAS
// ==========================================
// GET /api/documentos-clinicos/notas-egreso/expediente/:id_expediente - Obtener notas por expediente
router.get("/expediente/:id_expediente", nota_egreso_controller_1.getNotasEgresoByExpediente);
// GET /api/documentos-clinicos/notas-egreso/paciente/:id_paciente - Obtener notas por paciente
router.get("/paciente/:id_paciente", nota_egreso_controller_1.getNotasEgresoByPaciente);
// GET /api/documentos-clinicos/notas-egreso/search/:query - Buscar notas de egreso
router.get("/search/:query", nota_egreso_controller_1.searchNotasEgreso);
// GET /api/documentos-clinicos/notas-egreso/details/all - Obtener notas con información completa
router.get("/details/all", nota_egreso_controller_1.getNotasEgresoWithDetails);
// GET /api/documentos-clinicos/notas-egreso/estadisticas/general - Estadísticas de egresos
router.get("/estadisticas/general", nota_egreso_controller_1.estadisticasNotasEgreso);
// POST /api/documentos-clinicos/notas-egreso/:id/validar - Validar completitud de nota
router.post("/:id/validar", nota_egreso_controller_1.validarNotaEgreso);
exports.default = router;
