"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/notas_especializadas/nota_nutricion.routes.ts
const express_1 = require("express");
const nota_nutricion_controller_1 = require("../../controllers/notas_especializadas/nota_nutricion.controller");
const router = (0, express_1.Router)();
router.get("/", nota_nutricion_controller_1.getNotasNutricion);
router.get("/:id", nota_nutricion_controller_1.getNotaNutricionById);
router.post("/", nota_nutricion_controller_1.createNotaNutricion);
router.put("/:id", nota_nutricion_controller_1.updateNotaNutricion);
router.delete("/:id", nota_nutricion_controller_1.deleteNotaNutricion);
exports.default = router;
