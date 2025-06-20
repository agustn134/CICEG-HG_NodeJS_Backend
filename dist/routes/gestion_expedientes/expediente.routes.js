"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/gestion_expedientes/expediente.routes.ts
const express_1 = require("express");
const expediente_controller_1 = require("../../controllers/gestion_expedientes/expediente.controller");
const router = (0, express_1.Router)();
router.get("/", expediente_controller_1.getExpedientes);
router.get("/:id", expediente_controller_1.getExpedienteById);
router.post("/", expediente_controller_1.createExpediente);
router.put("/:id", expediente_controller_1.updateExpediente);
router.delete("/:id", expediente_controller_1.deleteExpediente);
exports.default = router;
