"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gestion_expedientes/internamiento.routes.ts
const express_1 = require("express");
const internamiento_controller_1 = require("../../controllers/gestion_expedientes/internamiento.controller");
const router = (0, express_1.Router)();
router.get("/", internamiento_controller_1.getInternamientos);
router.get("/:id", internamiento_controller_1.getInternamientoById);
router.post("/", internamiento_controller_1.createInternamiento);
router.put("/:id", internamiento_controller_1.updateInternamiento);
router.delete("/:id", internamiento_controller_1.deleteInternamiento);
exports.default = router;
