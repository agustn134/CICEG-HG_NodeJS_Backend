"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_evolucion.routes.ts
const express_1 = require("express");
const nota_evolucion_controller_1 = require("../../controllers/documentos_clinicos/nota_evolucion.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PRINCIPALES
// ==========================================
// GET /api/notas-evolucion - Obtener todas las notas con filtros
router.get('/', nota_evolucion_controller_1.getNotasEvolucion);
// POST /api/notas-evolucion - Crear nueva nota de evolución
router.post('/', nota_evolucion_controller_1.createNotaEvolucion);
// GET /api/notas-evolucion/:id - Obtener nota por ID
router.get('/:id', nota_evolucion_controller_1.getNotaEvolucionById);
// PUT /api/notas-evolucion/:id - Actualizar nota por ID
router.put('/:id', nota_evolucion_controller_1.updateNotaEvolucion);
// DELETE /api/notas-evolucion/:id - Anular nota por ID
router.delete('/:id', nota_evolucion_controller_1.deleteNotaEvolucion);
// ==========================================
// RUTAS ESPECÍFICAS
// ==========================================
// GET /api/notas-evolucion/expediente/:id_expediente - Obtener notas por expediente
router.get('/expediente/:id_expediente', nota_evolucion_controller_1.getNotasEvolucionByExpediente);
// GET /api/notas-evolucion/documento/:id_documento - Obtener nota por documento
router.get('/documento/:id_documento', nota_evolucion_controller_1.getNotaEvolucionByDocumento);
exports.default = router;
