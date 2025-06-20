"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/prescripcion_medicamento.routes.ts
const express_1 = require("express");
const prescripcion_medicamento_controller_1 = require("../../controllers/documentos_clinicos/prescripcion_medicamento.controller");
const router = (0, express_1.Router)();
router.get("/", prescripcion_medicamento_controller_1.getPrescripcionesMedicamento);
router.get("/:id", prescripcion_medicamento_controller_1.getPrescripcionMedicamentoById);
router.post("/", prescripcion_medicamento_controller_1.createPrescripcionMedicamento);
router.put("/:id", prescripcion_medicamento_controller_1.updatePrescripcionMedicamento);
router.delete("/:id", prescripcion_medicamento_controller_1.deletePrescripcionMedicamento);
exports.default = router;
