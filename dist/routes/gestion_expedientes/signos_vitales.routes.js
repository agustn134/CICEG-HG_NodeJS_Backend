"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gestion_expedientes/signos_vitales.routes.ts
const express_1 = require("express");
const signos_vitales_controller_1 = require("../../controllers/gestion_expedientes/signos_vitales.controller");
const router = (0, express_1.Router)();
router.get("/", signos_vitales_controller_1.getSignosVitales);
router.get("/:id", signos_vitales_controller_1.getSignosVitalesById);
router.post("/", signos_vitales_controller_1.createSignosVitales);
router.put("/:id", signos_vitales_controller_1.updateSignosVitales);
router.delete("/:id", signos_vitales_controller_1.deleteSignosVitales);
exports.default = router;
