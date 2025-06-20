"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/personas/paciente.routes.ts
const express_1 = require("express");
const paciente_controller_1 = require("../../controllers/personas/paciente.controller");
const router = (0, express_1.Router)();
// Ruta para obtener todos los pacientes
router.get("/", paciente_controller_1.getPacientes);
// Ruta para obtener un paciente por ID
router.get("/:id", paciente_controller_1.getPacienteById);
// Ruta para crear un paciente
router.post("/", paciente_controller_1.createPaciente);
// Ruta para actualizar un paciente por ID
router.put("/:id", paciente_controller_1.updatePaciente);
// Ruta para eliminar un paciente por ID
router.delete("/:id", paciente_controller_1.deletePaciente);
exports.default = router;
