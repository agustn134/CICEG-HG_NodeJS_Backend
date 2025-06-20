"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/medicamento.routes.ts
const express_1 = require("express");
const medicamento_controller_1 = require("../../controllers/catalogos/medicamento.controller");
const router = (0, express_1.Router)();
router.get("/", medicamento_controller_1.getMedicamentos);
router.get("/:id", medicamento_controller_1.getMedicamentoById);
router.post("/", medicamento_controller_1.createMedicamento);
router.put("/:id", medicamento_controller_1.updateMedicamento);
router.delete("/:id", medicamento_controller_1.deleteMedicamento);
exports.default = router;
