"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/historia_clinica.routes.ts
const express_1 = require("express");
const historia_clinica_controller_1 = require("../../controllers/documentos_clinicos/historia_clinica.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA HISTORIAS CLÍNICAS
// ==========================================
// GET /api/documentos-clinicos/historias-clinicas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", historia_clinica_controller_1.getEstadisticasHistoriasClinicas);
// GET /api/documentos-clinicos/historias-clinicas/documento/:id_documento - Obtener historia por documento
router.get("/documento/:id_documento", historia_clinica_controller_1.getHistoriaClinicaByDocumento);
// GET /api/documentos-clinicos/historias-clinicas - Obtener todas las historias clínicas
// Acepta query params: ?page=1&limit=10&id_expediente=1&buscar=diabetes
router.get("/", historia_clinica_controller_1.getHistoriasClinicas);
// GET /api/documentos-clinicos/historias-clinicas/:id - Obtener historia clínica por ID
router.get("/:id", historia_clinica_controller_1.getHistoriaClinicaById);
// POST /api/documentos-clinicos/historias-clinicas - Crear nueva historia clínica
router.post("/", historia_clinica_controller_1.createHistoriaClinica);
// PUT /api/documentos-clinicos/historias-clinicas/:id - Actualizar historia clínica
router.put("/:id", historia_clinica_controller_1.updateHistoriaClinica);
// DELETE /api/documentos-clinicos/historias-clinicas/:id - Anular historia clínica
router.delete("/:id", historia_clinica_controller_1.deleteHistoriaClinica);
exports.default = router;
