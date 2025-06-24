"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/catalogos/medicamento.routes.ts
const express_1 = require("express");
const medicamento_controller_1 = require("../../controllers/catalogos/medicamento.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA MEDICAMENTOS
// ==========================================
// GET /api/catalogos/medicamentos/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", medicamento_controller_1.getEstadisticasMedicamentos);
// GET /api/catalogos/medicamentos/activos - Obtener solo medicamentos activos (para selects)
// Acepta query params: ?grupo_terapeutico=Analgésicos&buscar=paracetamol
router.get("/activos", medicamento_controller_1.getMedicamentosActivos);
// GET /api/catalogos/medicamentos - Obtener todos los medicamentos
// Acepta query params: ?grupo_terapeutico=Antibióticos&presentacion=tableta&activo=true&buscar=amoxicilina
router.get("/", medicamento_controller_1.getMedicamentos);
// GET /api/catalogos/medicamentos/:id - Obtener medicamento por ID
router.get("/:id", medicamento_controller_1.getMedicamentoById);
// POST /api/catalogos/medicamentos - Crear nuevo medicamento
router.post("/", medicamento_controller_1.createMedicamento);
// PUT /api/catalogos/medicamentos/:id - Actualizar medicamento
router.put("/:id", medicamento_controller_1.updateMedicamento);
// DELETE /api/catalogos/medicamentos/:id - Eliminar medicamento
router.delete("/:id", medicamento_controller_1.deleteMedicamento);
exports.default = router;
