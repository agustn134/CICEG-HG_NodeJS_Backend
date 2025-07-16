"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/configuracion.routes.ts
const express_1 = require("express");
const configuracion_controller_1 = require("../controllers/configuracion.controller");
const router = (0, express_1.Router)();
// GET /api/configuracion/logos - Obtener configuración de logos
router.get('/logos', configuracion_controller_1.getConfiguracionLogos);
// PUT /api/configuracion/logos - Actualizar configuración de textos/colores
router.put('/logos', configuracion_controller_1.actualizarConfiguracion);
// POST /api/configuracion/upload-logo - Subir archivo de logo
router.post('/upload-logo', configuracion_controller_1.upload.single('archivo'), configuracion_controller_1.subirLogo);
exports.default = router;
