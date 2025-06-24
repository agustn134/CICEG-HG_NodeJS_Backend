// src/routes/catalogos/estudio_medico.routes.ts
import { Router } from "express";
import {
  getEstudiosMedicos,
  getEstudioMedicoById,
  createEstudioMedico,
  updateEstudioMedico,
  deleteEstudioMedico,
  getEstudiosMedicosActivos,
  getEstadisticasEstudiosMedicos
} from "../../controllers/catalogos/estudio_medico.controller";

const router = Router();

// ==========================================
// RUTAS PARA ESTUDIOS MÉDICOS
// ==========================================

// GET /api/catalogos/estudios-medicos/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasEstudiosMedicos);

// GET /api/catalogos/estudios-medicos/activos - Obtener solo estudios activos (para selects)
// Acepta query param: ?tipo=Laboratorio
router.get("/activos", getEstudiosMedicosActivos);

// GET /api/catalogos/estudios-medicos - Obtener todos los estudios médicos
// Acepta query params: ?tipo=Imagen&requiere_ayuno=true&activo=true
router.get("/", getEstudiosMedicos);

// GET /api/catalogos/estudios-medicos/:id - Obtener estudio médico por ID
router.get("/:id", getEstudioMedicoById);

// POST /api/catalogos/estudios-medicos - Crear nuevo estudio médico
router.post("/", createEstudioMedico);

// PUT /api/catalogos/estudios-medicos/:id - Actualizar estudio médico
router.put("/:id", updateEstudioMedico);

// DELETE /api/catalogos/estudios-medicos/:id - Eliminar estudio médico
router.delete("/:id", deleteEstudioMedico);

export default router;