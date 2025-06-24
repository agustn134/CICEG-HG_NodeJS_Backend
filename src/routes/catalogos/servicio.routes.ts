// src/routes/catalogos/servicio.routes.ts
import { Router } from "express";
import {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
  getServiciosActivos,
  getEstadisticasServicios
} from "../../controllers/catalogos/servicio.controller";

const router = Router();

// ==========================================
// RUTAS PARA SERVICIOS HOSPITALARIOS
// ==========================================

// GET /api/catalogos/servicios/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasServicios);

// GET /api/catalogos/servicios/activos - Obtener solo servicios activos (para selects)
router.get("/activos", getServiciosActivos);

// GET /api/catalogos/servicios - Obtener todos los servicios
router.get("/", getServicios);

// GET /api/catalogos/servicios/:id - Obtener servicio por ID
router.get("/:id", getServicioById);

// POST /api/catalogos/servicios - Crear nuevo servicio
router.post("/", createServicio);

// PUT /api/catalogos/servicios/:id - Actualizar servicio
router.put("/:id", updateServicio);

// DELETE /api/catalogos/servicios/:id - Eliminar servicio
router.delete("/:id", deleteServicio);

export default router;