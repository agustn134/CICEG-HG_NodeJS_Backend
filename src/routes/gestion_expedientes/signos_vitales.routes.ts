// src/routes/gestion_expedientes/signos_vitales.routes.ts
import { Router } from "express";
import {
  getSignosVitales,
  getSignosVitalesById,
  createSignosVitales,
  updateSignosVitales,
  deleteSignosVitales,
  getUltimosSignosVitalesPaciente,
  getHistorialSignosVitales,
  getGraficaSignosVitales
} from "../../controllers/gestion_expedientes/signos_vitales.controller";

const router = Router();

// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================

// Obtener todos los signos vitales con filtros y paginación
// GET /api/signos-vitales?id_expediente=1&fecha_inicio=2024-01-01&limit=50&offset=0
router.get("/", getSignosVitales);

// Obtener signos vitales por ID específico
// GET /api/signos-vitales/123
router.get("/:id", getSignosVitalesById);

// Crear nuevos signos vitales
// POST /api/signos-vitales
router.post("/", createSignosVitales);

// Actualizar signos vitales existentes
// PUT /api/signos-vitales/123
router.put("/:id", updateSignosVitales);

// Eliminar (anular) signos vitales
// DELETE /api/signos-vitales/123
router.delete("/:id", deleteSignosVitales);

// ==========================================
// RUTAS ESPECIALIZADAS
// ==========================================

// Obtener últimos signos vitales de un expediente
// GET /api/signos-vitales/expediente/123/ultimos?limite=1
router.get("/expediente/:id_expediente/ultimos", getUltimosSignosVitalesPaciente);

// Obtener historial completo de signos vitales de un expediente
// GET /api/signos-vitales/expediente/123/historial?fecha_inicio=2024-01-01&tipo_signo=temperatura
router.get("/expediente/:id_expediente/historial", getHistorialSignosVitales);

// Obtener datos para gráfica de signos vitales
// GET /api/signos-vitales/expediente/123/grafica?tipo_signo=todos&dias=7
router.get("/expediente/:id_expediente/grafica", getGraficaSignosVitales);

export default router;