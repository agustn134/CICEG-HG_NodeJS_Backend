"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ==========================================
// RUTAS PARA NOTA POSTOPERATORIA
// ==========================================
// src/routes/documentos_clinicos/nota_postoperatoria.routes.ts
const express_1 = require("express");
const nota_postoperatoria_controller_1 = require("../../controllers/documentos_clinicos/nota_postoperatoria.controller");
const router = (0, express_1.Router)();
// Rutas básicas CRUD
router.get("/", nota_postoperatoria_controller_1.getNotasPostoperatoria);
router.get("/:id", nota_postoperatoria_controller_1.getNotaPostoperatoriaById);
router.post("/", nota_postoperatoria_controller_1.createNotaPostoperatoria);
router.put("/:id", nota_postoperatoria_controller_1.updateNotaPostoperatoria);
router.delete("/:id", nota_postoperatoria_controller_1.deleteNotaPostoperatoria);
// Rutas adicionales
router.get("/expediente/:id_expediente", nota_postoperatoria_controller_1.getNotasPostoperatoriaByExpediente);
exports.default = router;
