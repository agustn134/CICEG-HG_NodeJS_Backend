"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/notas_especializadas/nota_psicologia.routes.ts
const express_1 = require("express");
const nota_psicologia_controller_1 = require("../../controllers/notas_especializadas/nota_psicologia.controller");
const router = (0, express_1.Router)();
router.get("/", nota_psicologia_controller_1.getNotasPsicologia);
router.get("/:id", nota_psicologia_controller_1.getNotaPsicologiaById);
router.post("/", nota_psicologia_controller_1.createNotaPsicologia);
router.put("/:id", nota_psicologia_controller_1.updateNotaPsicologia);
router.delete("/:id", nota_psicologia_controller_1.deleteNotaPsicologia);
exports.default = router;
