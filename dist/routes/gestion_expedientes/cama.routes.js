"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gestion_expedientes/cama.routes.ts
const express_1 = require("express");
const cama_controller_1 = require("../../controllers/gestion_expedientes/cama.controller");
const router = (0, express_1.Router)();
router.get("/", cama_controller_1.getCamas);
router.get("/:id", cama_controller_1.getCamaById);
router.post("/", cama_controller_1.createCama);
router.put("/:id", cama_controller_1.updateCama);
router.delete("/:id", cama_controller_1.deleteCama);
exports.default = router;
