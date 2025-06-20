"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/tipo_sangre.routes.ts
const express_1 = require("express");
const tipo_sangre_controller_1 = require("../../controllers/catalogos/tipo_sangre.controller");
const router = (0, express_1.Router)();
router.get("/", tipo_sangre_controller_1.getTiposSangre);
router.get("/:id", tipo_sangre_controller_1.getTipoSangreById);
router.post("/", tipo_sangre_controller_1.createTipoSangre);
router.put("/:id", tipo_sangre_controller_1.updateTipoSangre);
router.delete("/:id", tipo_sangre_controller_1.deleteTipoSangre);
exports.default = router;
