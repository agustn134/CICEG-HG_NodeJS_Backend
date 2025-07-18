"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_evolucion.routes.ts
const express_1 = require("express");
const nota_evolucion_controller_1 = require("../../controllers/documentos_clinicos/nota_evolucion.controller");
const router = (0, express_1.Router)();
// 🔥 AGREGAR ESTA RUTA (debe ir ANTES que /:id)
router.get("/estadisticas", nota_evolucion_controller_1.getEstadisticasNotasEvolucion);
// GET /api/documentos-clinicos/notas-evolucion/documento/:id_documento
router.get("/documento/:id_documento", nota_evolucion_controller_1.getNotaEvolucionByDocumento);
// GET /api/documentos-clinicos/notas-evolucion/expediente/:id_expediente  
router.get("/expediente/:id_expediente", nota_evolucion_controller_1.getNotasEvolucionByExpediente);
// GET /api/documentos-clinicos/notas-evolucion
router.get("/", nota_evolucion_controller_1.getNotasEvolucion);
// GET /api/documentos-clinicos/notas-evolucion/:id
router.get("/:id", nota_evolucion_controller_1.getNotaEvolucionById);
// POST /api/documentos-clinicos/notas-evolucion
router.post("/", nota_evolucion_controller_1.createNotaEvolucion);
// PUT /api/documentos-clinicos/notas-evolucion/:id
router.put("/:id", nota_evolucion_controller_1.updateNotaEvolucion);
// DELETE /api/documentos-clinicos/notas-evolucion/:id
router.delete("/:id", nota_evolucion_controller_1.deleteNotaEvolucion);
exports.default = router;
