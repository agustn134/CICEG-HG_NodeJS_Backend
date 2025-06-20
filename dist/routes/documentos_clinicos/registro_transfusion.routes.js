"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/registro_transfusion.routes.ts
const express_1 = require("express");
const registro_transfusion_controller_1 = require("../../controllers/documentos_clinicos/registro_transfusion.controller");
const router = (0, express_1.Router)();
router.get("/", registro_transfusion_controller_1.getRegistrosTransfusion);
router.get("/:id", registro_transfusion_controller_1.getRegistroTransfusionById);
router.post("/", registro_transfusion_controller_1.createRegistroTransfusion);
router.put("/:id", registro_transfusion_controller_1.updateRegistroTransfusion);
router.delete("/:id", registro_transfusion_controller_1.deleteRegistroTransfusion);
exports.default = router;
