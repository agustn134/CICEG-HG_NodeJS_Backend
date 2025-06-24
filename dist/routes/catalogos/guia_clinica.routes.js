"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/guia_clinica.routes.ts
const express_1 = require("express");
const guia_clinica_controller_1 = require("../../controllers/catalogos/guia_clinica.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA GUÍAS CLÍNICAS DE DIAGNÓSTICO
// ==========================================
// GET /api/catalogos/guias-clinicas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", guia_clinica_controller_1.getEstadisticasGuiasClinicas);
// GET /api/catalogos/guias-clinicas/activas - Obtener solo guías activas (para selects)
// Acepta query param: ?area=Pediatría
router.get("/activas", guia_clinica_controller_1.getGuiasClinicasActivas);
// GET /api/catalogos/guias-clinicas - Obtener todas las guías clínicas
// Acepta query params: ?area=Urgencias&fuente=IMSS&activo=true
router.get("/", guia_clinica_controller_1.getGuiasClinicas);
// GET /api/catalogos/guias-clinicas/:id - Obtener guía clínica por ID
router.get("/:id", guia_clinica_controller_1.getGuiaClinicaById);
// POST /api/catalogos/guias-clinicas - Crear nueva guía clínica
router.post("/", guia_clinica_controller_1.createGuiaClinica);
// PUT /api/catalogos/guias-clinicas/:id - Actualizar guía clínica
router.put("/:id", guia_clinica_controller_1.updateGuiaClinica);
// DELETE /api/catalogos/guias-clinicas/:id - Eliminar guía clínica
router.delete("/:id", guia_clinica_controller_1.deleteGuiaClinica);
exports.default = router;
