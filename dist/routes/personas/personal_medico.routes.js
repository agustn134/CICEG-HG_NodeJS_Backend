"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/personas/personal_medico.routes.ts
const express_1 = require("express");
const personal_medico_controller_1 = require("../../controllers/personas/personal_medico.controller");
const router = (0, express_1.Router)();
// Ruta para obtener todos los personal médico
router.get("/", personal_medico_controller_1.getPersonalMedico);
// Ruta para obtener un personal médico por ID
router.get("/:id", personal_medico_controller_1.getPersonalMedicoById);
// Ruta para crear un personal médico
router.post("/", personal_medico_controller_1.createPersonalMedico);
// Ruta para actualizar un personal médico por ID
router.put("/:id", personal_medico_controller_1.updatePersonalMedico);
// Ruta para eliminar un personal médico por ID
router.delete("/:id", personal_medico_controller_1.deletePersonalMedico);
exports.default = router;
