"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_egreso.routes.ts
const express_1 = require("express");
const nota_egreso_controller_1 = require("../../controllers/documentos_clinicos/nota_egreso.controller");
const router = (0, express_1.Router)();
router.get("/", nota_egreso_controller_1.getNotasEgreso);
router.get("/:id", nota_egreso_controller_1.getNotaEgresoById);
router.post("/", nota_egreso_controller_1.createNotaEgreso);
router.put("/:id", nota_egreso_controller_1.updateNotaEgreso);
router.delete("/:id", nota_egreso_controller_1.deleteNotaEgreso);
exports.default = router;
