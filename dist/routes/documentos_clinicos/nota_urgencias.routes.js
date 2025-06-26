"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_urgencias.routes.ts
const express_1 = require("express");
const nota_urgencias_controller_1 = require("../../controllers/documentos_clinicos/nota_urgencias.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA NOTAS DE URGENCIAS
// ==========================================
// GET /api/documentos-clinicos/notas-urgencias/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", nota_urgencias_controller_1.getEstadisticasUrgencias);
// GET /api/documentos-clinicos/notas-urgencias/panel-tiempo-real - Panel de urgencias en tiempo real
router.get("/panel-tiempo-real", nota_urgencias_controller_1.getPanelUrgenciasTiempoReal);
// GET /api/documentos-clinicos/notas-urgencias/pacientes-frecuentes - Pacientes frecuentes en urgencias
router.get("/pacientes-frecuentes", nota_urgencias_controller_1.getPacientesFrecuentesUrgencias);
// GET /api/documentos-clinicos/notas-urgencias/expediente/:id_expediente - Obtener notas por expediente
router.get("/expediente/:id_expediente", nota_urgencias_controller_1.getNotasUrgenciasByExpediente);
// GET /api/documentos-clinicos/notas-urgencias/documento/:id_documento - Obtener nota por documento
router.get("/documento/:id_documento", nota_urgencias_controller_1.getNotaUrgenciasByDocumento);
// GET /api/documentos-clinicos/notas-urgencias - Obtener todas las notas de urgencias
// Acepta query params: ?page=1&limit=15&buscar=trauma&estado_conciencia=alerta&area_interconsulta=1
router.get("/", nota_urgencias_controller_1.getNotasUrgencias);
// GET /api/documentos-clinicos/notas-urgencias/:id - Obtener nota de urgencias por ID
router.get("/:id", nota_urgencias_controller_1.getNotaUrgenciasById);
// POST /api/documentos-clinicos/notas-urgencias - Crear nueva nota de urgencias
router.post("/", nota_urgencias_controller_1.createNotaUrgencias);
// PUT /api/documentos-clinicos/notas-urgencias/:id - Actualizar nota de urgencias
router.put("/:id", nota_urgencias_controller_1.updateNotaUrgencias);
// DELETE /api/documentos-clinicos/notas-urgencias/:id - Anular nota de urgencias
router.delete("/:id", nota_urgencias_controller_1.deleteNotaUrgencias);
exports.default = router;
