// src/routes/gestion_expedientes/signos_vitales.routes.ts
import { Router } from "express";
import {
  getSignosVitales,
  getSignosVitalesById,
  getSignosVitalesByPacienteId,
  createSignosVitales,
  updateSignosVitales,
  deleteSignosVitales,
  getUltimosSignosVitalesPaciente,
  getHistorialSignosVitales,
  getGraficaSignosVitales
} from "../../controllers/gestion_expedientes/signos_vitales.controller";

const router = Router();

// ==========================================
// RUTAS ESPECIALIZADAS (DEBEN IR ANTES QUE /:id)
// ==========================================

// GET /api/gestion-expedientes/signos-vitales/expediente/:id_expediente/ultimos
// Obtener últimos signos vitales de un expediente
router.get("/expediente/:id_expediente/ultimos", getUltimosSignosVitalesPaciente);

// GET /api/gestion-expedientes/signos-vitales/expediente/:id_expediente/historial
// Obtener historial completo de signos vitales de un expediente
router.get("/expediente/:id_expediente/historial", getHistorialSignosVitales);

// GET /api/gestion-expedientes/signos-vitales/expediente/:id_expediente/grafica
// Obtener datos para gráfica de signos vitales
router.get("/expediente/:id_expediente/grafica", getGraficaSignosVitales);

// ==========================================
// RUTAS POR PACIENTE (DEBEN IR ANTES QUE /:id)
// ==========================================

//    RUTA NUEVA: GET /api/gestion-expedientes/signos-vitales/paciente/:pacienteId
router.get("/paciente/:pacienteId", getSignosVitalesByPacienteId);

// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================

// GET /api/gestion-expedientes/signos-vitales
// Obtener todos los signos vitales con filtros y paginación
// Query params: id_expediente, id_internamiento, fecha_inicio, fecha_fin, incluir_anormales, limit, offset
router.get("/", getSignosVitales);

// POST /api/gestion-expedientes/signos-vitales
// Crear nuevos signos vitales
router.post("/", createSignosVitales);

// ==========================================
// RUTAS POR ID (DEBEN IR AL FINAL)
// ==========================================

// GET /api/gestion-expedientes/signos-vitales/:id
// Obtener signos vitales por ID específico
router.get("/:id", getSignosVitalesById);

// PUT /api/gestion-expedientes/signos-vitales/:id
// Actualizar signos vitales existentes
router.put("/:id", updateSignosVitales);

// DELETE /api/gestion-expedientes/signos-vitales/:id
// Eliminar (anular) signos vitales
router.delete("/:id", deleteSignosVitales);

export default router;