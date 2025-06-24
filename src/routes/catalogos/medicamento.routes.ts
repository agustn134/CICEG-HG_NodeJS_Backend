// src/routes/catalogos/medicamento.routes.ts
import { Router } from "express";
import {
  getMedicamentos,
  getMedicamentoById,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
  getMedicamentosActivos,
  getEstadisticasMedicamentos
} from "../../controllers/catalogos/medicamento.controller";

const router = Router();

// ==========================================
// RUTAS PARA MEDICAMENTOS
// ==========================================

// GET /api/catalogos/medicamentos/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasMedicamentos);

// GET /api/catalogos/medicamentos/activos - Obtener solo medicamentos activos (para selects)
// Acepta query params: ?grupo_terapeutico=Analgésicos&buscar=paracetamol
router.get("/activos", getMedicamentosActivos);

// GET /api/catalogos/medicamentos - Obtener todos los medicamentos
// Acepta query params: ?grupo_terapeutico=Antibióticos&presentacion=tableta&activo=true&buscar=amoxicilina
router.get("/", getMedicamentos);

// GET /api/catalogos/medicamentos/:id - Obtener medicamento por ID
router.get("/:id", getMedicamentoById);

// POST /api/catalogos/medicamentos - Crear nuevo medicamento
router.post("/", createMedicamento);

// PUT /api/catalogos/medicamentos/:id - Actualizar medicamento
router.put("/:id", updateMedicamento);

// DELETE /api/catalogos/medicamentos/:id - Eliminar medicamento
router.delete("/:id", deleteMedicamento);

export default router;