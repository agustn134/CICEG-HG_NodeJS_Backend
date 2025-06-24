// src/routes/catalogos/guia_clinica.routes.ts
import { Router } from "express";
import {
  getGuiasClinicas,
  getGuiaClinicaById,
  createGuiaClinica,
  updateGuiaClinica,
  deleteGuiaClinica,
  getGuiasClinicasActivas,
  getEstadisticasGuiasClinicas
} from "../../controllers/catalogos/guia_clinica.controller";

const router = Router();

// ==========================================
// RUTAS PARA GUÍAS CLÍNICAS DE DIAGNÓSTICO
// ==========================================

// GET /api/catalogos/guias-clinicas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasGuiasClinicas);

// GET /api/catalogos/guias-clinicas/activas - Obtener solo guías activas (para selects)
// Acepta query param: ?area=Pediatría
router.get("/activas", getGuiasClinicasActivas);

// GET /api/catalogos/guias-clinicas - Obtener todas las guías clínicas
// Acepta query params: ?area=Urgencias&fuente=IMSS&activo=true
router.get("/", getGuiasClinicas);

// GET /api/catalogos/guias-clinicas/:id - Obtener guía clínica por ID
router.get("/:id", getGuiaClinicaById);

// POST /api/catalogos/guias-clinicas - Crear nueva guía clínica
router.post("/", createGuiaClinica);

// PUT /api/catalogos/guias-clinicas/:id - Actualizar guía clínica
router.put("/:id", updateGuiaClinica);

// DELETE /api/catalogos/guias-clinicas/:id - Eliminar guía clínica
router.delete("/:id", deleteGuiaClinica);

export default router;