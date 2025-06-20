"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/solicitud_estudio.routes.ts
const express_1 = require("express");
const solicitud_estudio_controller_1 = require("../../controllers/documentos_clinicos/solicitud_estudio.controller");
const router = (0, express_1.Router)();
router.get("/", solicitud_estudio_controller_1.getSolicitudesEstudio);
router.get("/:id", solicitud_estudio_controller_1.getSolicitudEstudioById);
router.post("/", solicitud_estudio_controller_1.createSolicitudEstudio);
router.put("/:id", solicitud_estudio_controller_1.updateSolicitudEstudio);
router.delete("/:id", solicitud_estudio_controller_1.deleteSolicitudEstudio);
exports.default = router;
