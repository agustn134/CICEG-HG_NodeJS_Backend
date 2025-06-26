"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/documento_clinico.routes.ts
const express_1 = require("express");
const documento_clinico_controller_1 = require("../../controllers/documentos_clinicos/documento_clinico.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA DOCUMENTOS CLÍNICOS
// ==========================================
// GET /api/documentos-clinicos/documentos/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", documento_clinico_controller_1.getEstadisticasDocumentos);
// GET /api/documentos-clinicos/documentos/expediente/:id_expediente - Obtener documentos por expediente
router.get("/expediente/:id_expediente", documento_clinico_controller_1.getDocumentosByExpediente);
// GET /api/documentos-clinicos/documentos - Obtener todos los documentos clínicos
// Acepta query params: ?page=1&limit=10&id_expediente=1&estado=Activo&buscar=historia
router.get("/", documento_clinico_controller_1.getDocumentosClinicos);
// GET /api/documentos-clinicos/documentos/:id - Obtener documento clínico por ID
router.get("/:id", documento_clinico_controller_1.getDocumentoClinicoById);
// POST /api/documentos-clinicos/documentos - Crear nuevo documento clínico
router.post("/", documento_clinico_controller_1.createDocumentoClinico);
// PUT /api/documentos-clinicos/documentos/:id - Actualizar documento clínico
router.put("/:id", documento_clinico_controller_1.updateDocumentoClinico);
// DELETE /api/documentos-clinicos/documentos/:id - Anular documento clínico
router.delete("/:id", documento_clinico_controller_1.deleteDocumentoClinico);
exports.default = router;
