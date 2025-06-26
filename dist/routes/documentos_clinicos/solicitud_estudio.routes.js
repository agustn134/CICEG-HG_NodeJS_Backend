"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/solicitud_estudio.routes.ts
const express_1 = require("express");
const solicitud_estudio_controller_1 = require("../../controllers/documentos_clinicos/solicitud_estudio.controller");
const router = (0, express_1.Router)();
// Obtener todas las solicitudes de estudio (con paginación y filtros)
router.get("/", solicitud_estudio_controller_1.getSolicitudesEstudio);
// Obtener una solicitud específica por ID
router.get("/:id", solicitud_estudio_controller_1.getSolicitudEstudioById);
// Crear una nueva solicitud de estudio
router.post("/", solicitud_estudio_controller_1.createSolicitudEstudio);
// Actualizar una solicitud existente
router.put("/:id", solicitud_estudio_controller_1.updateSolicitudEstudio);
// Eliminar una solicitud
router.delete("/:id", solicitud_estudio_controller_1.deleteSolicitudEstudio);
// Endpoint especial para registrar/actualizar resultados de estudios
router.patch("/:id/resultados", solicitud_estudio_controller_1.updateResultadoEstudio);
exports.default = router;
