// src/routes/catalogos/area_interconsulta.routes.ts
import { Router } from "express";
import {
  getAreasInterconsulta,
  getAreaInterconsultaById,
  createAreaInterconsulta,
  updateAreaInterconsulta,
  deleteAreaInterconsulta,
  getAreasInterconsultaActivas,
  getEstadisticasInterconsultas
} from "../../controllers/catalogos/area_interconsulta.controller";

const router = Router();

// ==========================================
// RUTAS PARA ÁREAS DE INTERCONSULTA
// ==========================================

// GET /api/catalogos/areas-interconsulta/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasInterconsultas);

// GET /api/catalogos/areas-interconsulta/activas - Obtener solo áreas activas (para selects)
router.get("/activas", getAreasInterconsultaActivas);

// GET /api/catalogos/areas-interconsulta - Obtener todas las áreas
router.get("/", getAreasInterconsulta);

// GET /api/catalogos/areas-interconsulta/:id - Obtener área por ID
router.get("/:id", getAreaInterconsultaById);

// POST /api/catalogos/areas-interconsulta - Crear nueva área
router.post("/", createAreaInterconsulta);

// PUT /api/catalogos/areas-interconsulta/:id - Actualizar área
router.put("/:id", updateAreaInterconsulta);

// DELETE /api/catalogos/areas-interconsulta/:id - Eliminar área
router.delete("/:id", deleteAreaInterconsulta);

export default router;