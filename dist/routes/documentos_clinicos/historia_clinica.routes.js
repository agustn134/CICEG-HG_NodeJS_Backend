"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/historia_clinica.routes.ts
const express_1 = require("express");
const historia_clinica_controller_1 = require("../../controllers/documentos_clinicos/historia_clinica.controller");
const router = (0, express_1.Router)();
router.get("/", historia_clinica_controller_1.getHistoriasClinicas);
router.get("/:id", historia_clinica_controller_1.getHistoriaClinicaById);
router.post("/", historia_clinica_controller_1.createHistoriaClinica);
router.put("/:id", historia_clinica_controller_1.updateHistoriaClinica);
router.delete("/:id", historia_clinica_controller_1.deleteHistoriaClinica);
exports.default = router;
