"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/consentimiento_informado.routes.ts
const express_1 = require("express");
const consentimiento_informado_controller_1 = require("../../controllers/documentos_clinicos/consentimiento_informado.controller");
const router = (0, express_1.Router)();
router.get("/", consentimiento_informado_controller_1.getConsentimientosInformados);
router.get("/:id", consentimiento_informado_controller_1.getConsentimientoInformadoById);
router.post("/", consentimiento_informado_controller_1.createConsentimientoInformado);
router.put("/:id", consentimiento_informado_controller_1.updateConsentimientoInformado);
router.delete("/:id", consentimiento_informado_controller_1.deleteConsentimientoInformado);
exports.default = router;
