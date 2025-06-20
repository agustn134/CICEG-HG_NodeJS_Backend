"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/guia_clinica.routes.ts
const express_1 = require("express");
const guia_clinica_controller_1 = require("../../controllers/catalogos/guia_clinica.controller");
const router = (0, express_1.Router)();
router.get("/", guia_clinica_controller_1.getGuiasClinicas);
router.get("/:id", guia_clinica_controller_1.getGuiaClinicaById);
router.post("/", guia_clinica_controller_1.createGuiaClinica);
router.put("/:id", guia_clinica_controller_1.updateGuiaClinica);
router.delete("/:id", guia_clinica_controller_1.deleteGuiaClinica);
exports.default = router;
