"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/estudio_medico.routes.ts
const express_1 = require("express");
const estudio_medico_controller_1 = require("../../controllers/catalogos/estudio_medico.controller");
const router = (0, express_1.Router)();
router.get("/", estudio_medico_controller_1.getEstudiosMedicos);
router.get("/:id", estudio_medico_controller_1.getEstudioMedicoById);
router.post("/", estudio_medico_controller_1.createEstudioMedico);
router.put("/:id", estudio_medico_controller_1.updateEstudioMedico);
router.delete("/:id", estudio_medico_controller_1.deleteEstudioMedico);
exports.default = router;
