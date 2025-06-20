"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/tipo_documento.routes.ts
const express_1 = require("express");
const tipo_documento_controller_1 = require("../../controllers/catalogos/tipo_documento.controller");
const router = (0, express_1.Router)();
router.get("/", tipo_documento_controller_1.getTiposDocumento);
router.get("/:id", tipo_documento_controller_1.getTipoDocumentoById);
router.post("/", tipo_documento_controller_1.createTipoDocumento);
router.put("/:id", tipo_documento_controller_1.updateTipoDocumento);
router.delete("/:id", tipo_documento_controller_1.deleteTipoDocumento);
exports.default = router;
