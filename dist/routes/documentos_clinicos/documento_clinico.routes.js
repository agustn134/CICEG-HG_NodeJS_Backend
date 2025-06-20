"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/documento_clinico.routes.ts
const express_1 = require("express");
const documento_clinico_controller_1 = require("../../controllers/documentos_clinicos/documento_clinico.controller");
const router = (0, express_1.Router)();
router.get("/", documento_clinico_controller_1.getDocumentosClinicos);
router.get("/:id", documento_clinico_controller_1.getDocumentoClinicoById);
router.post("/", documento_clinico_controller_1.createDocumentoClinico);
router.put("/:id", documento_clinico_controller_1.updateDocumentoClinico);
router.delete("/:id", documento_clinico_controller_1.deleteDocumentoClinico);
exports.default = router;
