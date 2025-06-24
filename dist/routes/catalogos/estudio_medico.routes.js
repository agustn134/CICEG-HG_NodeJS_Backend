"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/estudio_medico.routes.ts
const express_1 = require("express");
const estudio_medico_controller_1 = require("../../controllers/catalogos/estudio_medico.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA ESTUDIOS MÉDICOS
// ==========================================
// GET /api/catalogos/estudios-medicos/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", estudio_medico_controller_1.getEstadisticasEstudiosMedicos);
// GET /api/catalogos/estudios-medicos/activos - Obtener solo estudios activos (para selects)
// Acepta query param: ?tipo=Laboratorio
router.get("/activos", estudio_medico_controller_1.getEstudiosMedicosActivos);
// GET /api/catalogos/estudios-medicos - Obtener todos los estudios médicos
// Acepta query params: ?tipo=Imagen&requiere_ayuno=true&activo=true
router.get("/", estudio_medico_controller_1.getEstudiosMedicos);
// GET /api/catalogos/estudios-medicos/:id - Obtener estudio médico por ID
router.get("/:id", estudio_medico_controller_1.getEstudioMedicoById);
// POST /api/catalogos/estudios-medicos - Crear nuevo estudio médico
router.post("/", estudio_medico_controller_1.createEstudioMedico);
// PUT /api/catalogos/estudios-medicos/:id - Actualizar estudio médico
router.put("/:id", estudio_medico_controller_1.updateEstudioMedico);
// DELETE /api/catalogos/estudios-medicos/:id - Eliminar estudio médico
router.delete("/:id", estudio_medico_controller_1.deleteEstudioMedico);
exports.default = router;
