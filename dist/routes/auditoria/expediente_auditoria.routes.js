"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auditoria/expediente_auditoria.routes.ts
const express_1 = require("express");
const expediente_auditoria_controller_1 = require("../../controllers/auditoria/expediente_auditoria.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA AUDITORÍA DE EXPEDIENTES
// ==========================================
// GET /api/auditoria/expedientes/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", expediente_auditoria_controller_1.getEstadisticasAuditoria);
// GET /api/auditoria/expedientes/sospechosa - Detectar actividad sospechosa
router.get("/sospechosa", expediente_auditoria_controller_1.detectarActividadSospechosa);
// GET /api/auditoria/expedientes/expediente/:id_expediente - Obtener actividad por expediente
router.get("/expediente/:id_expediente", expediente_auditoria_controller_1.getActividadByExpediente);
// GET /api/auditoria/expedientes/medico/:id_medico - Obtener actividad por médico
router.get("/medico/:id_medico", expediente_auditoria_controller_1.getActividadByMedico);
// GET /api/auditoria/expedientes - Obtener todos los registros con filtros
router.get("/", expediente_auditoria_controller_1.getAuditoriaExpedientes);
// GET /api/auditoria/expedientes/:id 
