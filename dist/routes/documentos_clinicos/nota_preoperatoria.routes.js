"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_preoperatoria.routes.ts
const express_1 = require("express");
const nota_preoperatoria_controller_1 = require("../../controllers/documentos_clinicos/nota_preoperatoria.controller");
const router = (0, express_1.Router)();
router.get("/", nota_preoperatoria_controller_1.getNotasPreoperatoria);
router.get("/:id", nota_preoperatoria_controller_1.getNotaPreoperatoriaById);
router.post("/", nota_preoperatoria_controller_1.createNotaPreoperatoria);
router.put("/:id", nota_preoperatoria_controller_1.updateNotaPreoperatoria);
router.delete("/:id", nota_preoperatoria_controller_1.deleteNotaPreoperatoria);
exports.default = router;
