"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/tipo_sangre.routes.ts
const express_1 = require("express");
const tipo_sangre_controller_1 = require("../../controllers/catalogos/tipo_sangre.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA TIPOS DE SANGRE
// ==========================================
// GET /api/catalogos/tipos-sangre/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", tipo_sangre_controller_1.getEstadisticasTiposSangre);
// GET /api/catalogos/tipos-sangre - Obtener todos los tipos de sangre
router.get("/", tipo_sangre_controller_1.getTiposSangre);
// GET /api/catalogos/tipos-sangre/:id - Obtener tipo de sangre por ID
router.get("/:id", tipo_sangre_controller_1.getTipoSangreById);
// POST /api/catalogos/tipos-sangre - Crear nuevo tipo de sangre
router.post("/", tipo_sangre_controller_1.createTipoSangre);
// PUT /api/catalogos/tipos-sangre/:id - Actualizar tipo de sangre
router.put("/:id", tipo_sangre_controller_1.updateTipoSangre);
// DELETE /api/catalogos/tipos-sangre/:id - Eliminar tipo de sangre
router.delete("/:id", tipo_sangre_controller_1.deleteTipoSangre);
exports.default = router;
