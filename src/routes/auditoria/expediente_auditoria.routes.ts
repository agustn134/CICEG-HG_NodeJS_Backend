// src/routes/auditoria/expediente_auditoria.routes.ts
import { Router } from "express";
import {
  getAuditoriaExpedientes,
  getAuditoriaById,
  registrarAuditoria,
  getActividadByExpediente,
  getActividadByMedico,
  detectarActividadSospechosa,
  getEstadisticasAuditoria
} from "../../controllers/auditoria/expediente_auditoria.controller";

const router = Router();

// ==========================================
// RUTAS PARA AUDITORÍA DE EXPEDIENTES
// ==========================================

// GET /api/auditoria/expedientes/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasAuditoria);

// GET /api/auditoria/expedientes/sospechosa - Detectar actividad sospechosa
router.get("/sospechosa", detectarActividadSospechosa);

// GET /api/auditoria/expedientes/expediente/:id_expediente - Obtener actividad por expediente
router.get("/expediente/:id_expediente", getActividadByExpediente);

// GET /api/auditoria/expedientes/medico/:id_medico - Obtener actividad por médico
router.get("/medico/:id_medico", getActividadByMedico);

// GET /api/auditoria/expedientes - Obtener todos los registros con filtros
router.get("/", getAuditoriaExpedientes);

// GET /api/auditoria/expedientes/:id 