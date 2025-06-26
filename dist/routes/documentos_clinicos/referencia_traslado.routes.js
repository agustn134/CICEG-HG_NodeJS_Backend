"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/referencia_traslado.routes.ts
const express_1 = require("express");
const referencia_traslado_controller_1 = require("../../controllers/documentos_clinicos/referencia_traslado.controller");
const router = (0, express_1.Router)();
// Obtener todas las referencias de traslado (con paginación y filtros)
router.get("/", referencia_traslado_controller_1.getReferenciasTraslado);
// Obtener una referencia de traslado por ID
router.get("/:id", referencia_traslado_controller_1.getReferenciaTrasladoById);
// Crear una nueva referencia de traslado
router.post("/", referencia_traslado_controller_1.createReferenciaTraslado);
// Actualizar una referencia de traslado por ID
router.put("/:id", referencia_traslado_controller_1.updateReferenciaTraslado);
// Eliminar una referencia de traslado por ID
router.delete("/:id", referencia_traslado_controller_1.deleteReferenciaTraslado);
// Actualizar el estado de una referencia de traslado
router.patch("/:id/estado", referencia_traslado_controller_1.updateEstadoTraslado);
exports.default = router;
