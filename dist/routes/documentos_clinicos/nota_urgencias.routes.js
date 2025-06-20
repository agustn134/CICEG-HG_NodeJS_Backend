"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_urgencias.routes.ts
const express_1 = require("express");
const nota_urgencias_controller_1 = require("../../controllers/documentos_clinicos/nota_urgencias.controller");
const router = (0, express_1.Router)();
router.get("/", nota_urgencias_controller_1.getNotasUrgencias);
router.get("/:id", nota_urgencias_controller_1.getNotaUrgenciasById);
router.post("/", nota_urgencias_controller_1.createNotaUrgencias);
router.put("/:id", nota_urgencias_controller_1.updateNotaUrgencias);
router.delete("/:id", nota_urgencias_controller_1.deleteNotaUrgencias);
exports.default = router;
