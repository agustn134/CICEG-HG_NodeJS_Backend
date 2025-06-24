"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/tipo_documento.routes.ts
const express_1 = require("express");
const tipo_documento_controller_1 = require("../../controllers/catalogos/tipo_documento.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA TIPOS DE DOCUMENTO
// ==========================================
// GET /api/catalogos/tipos-documento/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", tipo_documento_controller_1.getEstadisticasTiposDocumento);
// GET /api/catalogos/tipos-documento/activos - Obtener solo tipos activos (para selects)
router.get("/activos", tipo_documento_controller_1.getTiposDocumentoActivos);
// GET /api/catalogos/tipos-documento - Obtener todos los tipos de documento
// Acepta query params: ?activo=true&buscar=historia
router.get("/", tipo_documento_controller_1.getTiposDocumento);
// GET /api/catalogos/tipos-documento/:id - Obtener tipo de documento por ID
router.get("/:id", tipo_documento_controller_1.getTipoDocumentoById);
// POST /api/catalogos/tipos-documento - Crear nuevo tipo de documento
router.post("/", tipo_documento_controller_1.createTipoDocumento);
// PUT /api/catalogos/tipos-documento/:id - Actualizar tipo de documento
router.put("/:id", tipo_documento_controller_1.updateTipoDocumento);
// DELETE /api/catalogos/tipos-documento/:id - Eliminar tipo de documento
router.delete("/:id", tipo_documento_controller_1.deleteTipoDocumento);
exports.default = router;
