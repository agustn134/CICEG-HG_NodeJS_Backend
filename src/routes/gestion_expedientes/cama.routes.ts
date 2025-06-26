// src/routes/gestion_expedientes/cama.routes.ts
import { Router } from "express";
import {
  getCamas,
  getCamaById,
  createCama,
  updateCama,
  deleteCama,
  getCamasDisponiblesByServicio,
  getEstadisticasCamas,
  cambiarEstadoCama,
  getOcupacionTiempoReal,
  getReporteRotacionCamas,
  liberarCama
} from "../../controllers/gestion_expedientes/cama.controller";

const router = Router();

// ==========================================
// RUTAS PARA GESTIÓN DE CAMAS
// ==========================================

// GET /api/gestion-expedientes/camas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasCamas);

// GET /api/gestion-expedientes/camas/ocupacion-tiempo-real - Panel de ocupación en tiempo real
router.get("/ocupacion-tiempo-real", getOcupacionTiempoReal);

// GET /api/gestion-expedientes/camas/reporte-rotacion - Reporte de rotación de camas
router.get("/reporte-rotacion", getReporteRotacionCamas);

// GET /api/gestion-expedientes/camas/servicio/:id_servicio/disponibles - Camas disponibles por servicio
router.get("/servicio/:id_servicio/disponibles", getCamasDisponiblesByServicio);

// PUT /api/gestion-expedientes/camas/:id/cambiar-estado - Cambiar estado de cama
router.put("/:id/cambiar-estado", cambiarEstadoCama);

// PUT /api/gestion-expedientes/camas/:id/liberar - Liberar cama (para egreso)
router.put("/:id/liberar", liberarCama);

// GET /api/gestion-expedientes/camas - Obtener todas las camas
// Acepta query params: ?page=1&limit=20&estado=Disponible&id_servicio=21&area=Urgencias&buscar=U-01&solo_disponibles=true
router.get("/", getCamas);

// GET /api/gestion-expedientes/camas/:id - Obtener cama por ID
router.get("/:id", getCamaById);

// POST /api/gestion-expedientes/camas - Crear nueva cama
router.post("/", createCama);

// PUT /api/gestion-expedientes/camas/:id - Actualizar cama
router.put("/:id", updateCama);

// DELETE /api/gestion-expedientes/camas/:id - Eliminar/dar de baja cama
router.delete("/:id", deleteCama);

export default router;