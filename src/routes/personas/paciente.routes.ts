// src/routes/personas/paciente.routes.ts
import { Router } from "express";
import {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente,
  buscarPacientes,
  getEstadisticasPacientes,
  getHistorialMedicoResumido
} from "../../controllers/personas/paciente.controller";

const router = Router();

// ==========================================
// RUTAS PARA PACIENTES
// ==========================================

// GET /api/personas/pacientes/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasPacientes);

// GET /api/personas/pacientes/buscar - Buscar pacientes (para autocomplete)
// Query param: ?q=texto_busqueda
router.get("/buscar", buscarPacientes);

// GET /api/personas/pacientes/:id/historial - Obtener historial médico resumido
router.get("/:id/historial", getHistorialMedicoResumido);

// GET /api/personas/pacientes - Obtener todos los pacientes
// Query params: ?sexo=M&edad_min=18&edad_max=65&tiene_alergias=true&buscar=juan
router.get("/", getPacientes);

// GET /api/personas/pacientes/:id - Obtener paciente por ID
router.get("/:id", getPacienteById);

// POST /api/personas/pacientes - Crear nuevo paciente
router.post("/", createPaciente);

// PUT /api/personas/pacientes/:id - Actualizar paciente
router.put("/:id", updatePaciente);

// DELETE /api/personas/pacientes/:id - Eliminar paciente
router.delete("/:id", deletePaciente);

export default router;