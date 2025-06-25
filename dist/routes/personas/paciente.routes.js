"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/personas/paciente.routes.ts
const express_1 = require("express");
const paciente_controller_1 = require("../../controllers/personas/paciente.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA PACIENTES
// ==========================================
// GET /api/personas/pacientes/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", paciente_controller_1.getEstadisticasPacientes);
// GET /api/personas/pacientes/buscar - Buscar pacientes (para autocomplete)
// Query param: ?q=texto_busqueda
router.get("/buscar", paciente_controller_1.buscarPacientes);
// GET /api/personas/pacientes/:id/historial - Obtener historial médico resumido
router.get("/:id/historial", paciente_controller_1.getHistorialMedicoResumido);
// GET /api/personas/pacientes - Obtener todos los pacientes
// Query params: ?sexo=M&edad_min=18&edad_max=65&tiene_alergias=true&buscar=juan
router.get("/", paciente_controller_1.getPacientes);
// GET /api/personas/pacientes/:id - Obtener paciente por ID
router.get("/:id", paciente_controller_1.getPacienteById);
// POST /api/personas/pacientes - Crear nuevo paciente
router.post("/", paciente_controller_1.createPaciente);
// PUT /api/personas/pacientes/:id - Actualizar paciente
router.put("/:id", paciente_controller_1.updatePaciente);
// DELETE /api/personas/pacientes/:id - Eliminar paciente
router.delete("/:id", paciente_controller_1.deletePaciente);
exports.default = router;
