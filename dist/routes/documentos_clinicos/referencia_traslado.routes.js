"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/referencia_traslado.routes.ts
const express_1 = require("express");
const referencia_traslado_controller_1 = require("../../controllers/documentos_clinicos/referencia_traslado.controller");
const router = (0, express_1.Router)();
router.get("/", referencia_traslado_controller_1.getReferenciasTraslado);
router.get("/:id", referencia_traslado_controller_1.getReferenciaTrasladoById);
router.post("/", referencia_traslado_controller_1.createReferenciaTraslado);
router.put("/:id", referencia_traslado_controller_1.updateReferenciaTraslado);
router.delete("/:id", referencia_traslado_controller_1.deleteReferenciaTraslado);
exports.default = router;
