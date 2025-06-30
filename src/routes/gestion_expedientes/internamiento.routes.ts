// src/routes/gestion_expedientes/internamiento.routes.ts
import { Router } from "express";
import {
  getInternamientos,
  getInternamientoById,
  createInternamiento,
  updateInternamiento,
  egresarPaciente,
  transferirPaciente,
  getInternamientosActivos,
  getDashboardInternamientos,
  getHistorialInternamientosPaciente,
  buscarInternamientos,
  getEstadisticasInternamientos
} from "../../controllers/gestion_expedientes/internamiento.controller";

const router = Router();

// ==========================================
// RUTAS PARA INTERNAMIENTOS
// ==========================================

// GET /api/gestion-expedientes/internamientos/dashboard - Dashboard (debe ir ANTES que /:id)
router.get("/dashboard", getDashboardInternamientos);

// GET /api/gestion-expedientes/internamientos/activos - Internamientos activos
router.get("/activos", getInternamientosActivos);

// GET /api/gestion-expedientes/internamientos/buscar - Búsqueda autocomplete
router.get("/buscar", buscarInternamientos);

// GET /api/gestion-expedientes/internamientos/estadisticas - Estadísticas
router.get("/estadisticas", getEstadisticasInternamientos);

// GET /api/gestion-expedientes/internamientos/historial/paciente/:id_paciente - Historial por paciente
router.get("/historial/paciente/:id_paciente", getHistorialInternamientosPaciente);

// GET /api/gestion-expedientes/internamientos - Obtener todos los internamientos
router.get("/", getInternamientos);

// GET /api/gestion-expedientes/internamientos/:id - Obtener internamiento por ID
router.get("/:id", getInternamientoById);

// POST /api/gestion-expedientes/internamientos - Crear nuevo internamiento
router.post("/", createInternamiento);

// PUT /api/gestion-expedientes/internamientos/:id - Actualizar internamiento
router.put("/:id", updateInternamiento);

// PUT /api/gestion-expedientes/internamientos/:id/egreso - Egresar paciente
router.put("/:id/egreso", egresarPaciente);

// PUT /api/gestion-expedientes/internamientos/:id/transferencia - Transferir paciente
router.put("/:id/transferencia", transferirPaciente);

export default router;