"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/prescripcion_medicamento.routes.ts
const express_1 = require("express");
const prescripcion_medicamento_controller_1 = require("../../controllers/documentos_clinicos/prescripcion_medicamento.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA PRESCRIPCIONES DE MEDICAMENTO
// ==========================================
// GET /api/documentos-clinicos/prescripciones-medicamento/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", prescripcion_medicamento_controller_1.getEstadisticasPrescripciones);
// GET /api/documentos-clinicos/prescripciones-medicamento/expediente/:id_expediente - Obtener prescripciones por expediente
router.get("/expediente/:id_expediente", prescripcion_medicamento_controller_1.getPrescripcionesByExpediente);
// GET /api/documentos-clinicos/prescripciones-medicamento - Obtener todas las prescripciones con filtros
router.get("/", prescripcion_medicamento_controller_1.getPrescripcionesMedicamento);
// GET /api/documentos-clinicos/prescripciones-medicamento/:id - Obtener una prescripción por ID
router.get("/:id", prescripcion_medicamento_controller_1.getPrescripcionMedicamentoById);
// POST /api/documentos-clinicos/prescripciones-medicamento - Crear nueva prescripción
router.post("/", prescripcion_medicamento_controller_1.createPrescripcionMedicamento);
// PUT /api/documentos-clinicos/prescripciones-medicamento/:id - Actualizar prescripción
router.put("/:id", prescripcion_medicamento_controller_1.updatePrescripcionMedicamento);
// DELETE /api/documentos-clinicos/prescripciones-medicamento/:id - Desactivar prescripción
router.delete("/:id", prescripcion_medicamento_controller_1.deletePrescripcionMedicamento);
exports.default = router;
