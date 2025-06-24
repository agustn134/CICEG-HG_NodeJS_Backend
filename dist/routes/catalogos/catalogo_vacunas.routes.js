"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/catalogo_vacunas.routes.ts
const express_1 = require("express");
const catalogo_vacunas_controller_1 = require("../../controllers/catalogos/catalogo_vacunas.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA CATÁLOGO DE VACUNAS
// ==========================================
// GET /api/catalogos/catalogo-vacunas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", catalogo_vacunas_controller_1.getEstadisticasVacunas);
// GET /api/catalogos/catalogo-vacunas/activas - Obtener solo vacunas activas (para selects)
// Acepta query param: ?tipo_vacuna=Adicional
router.get("/activas", catalogo_vacunas_controller_1.getVacunasActivas);
// GET /api/catalogos/catalogo-vacunas - Obtener todas las vacunas del catálogo
// Acepta query params: ?tipo_vacuna=Especial&activa=true
router.get("/", catalogo_vacunas_controller_1.getCatalogoVacunas);
// GET /api/catalogos/catalogo-vacunas/:id - Obtener vacuna por ID
router.get("/:id", catalogo_vacunas_controller_1.getVacunaById);
// POST /api/catalogos/catalogo-vacunas - Crear nueva vacuna en el catálogo
router.post("/", catalogo_vacunas_controller_1.createVacuna);
// PUT /api/catalogos/catalogo-vacunas/:id - Actualizar vacuna del catálogo
router.put("/:id", catalogo_vacunas_controller_1.updateVacuna);
// DELETE /api/catalogos/catalogo-vacunas/:id - Eliminar vacuna del catálogo
router.delete("/:id", catalogo_vacunas_controller_1.deleteVacuna);
exports.default = router;
