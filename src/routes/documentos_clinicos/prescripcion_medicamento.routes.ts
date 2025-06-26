// src/routes/documentos_clinicos/prescripcion_medicamento.routes.ts
import { Router } from "express";
import {
  getPrescripcionesMedicamento,
  getPrescripcionMedicamentoById,
  createPrescripcionMedicamento,
  updatePrescripcionMedicamento,
  deletePrescripcionMedicamento,
  getPrescripcionesByExpediente,
  getEstadisticasPrescripciones
} from "../../controllers/documentos_clinicos/prescripcion_medicamento.controller";

const router = Router();

// ==========================================
// RUTAS PARA PRESCRIPCIONES DE MEDICAMENTO
// ==========================================

// GET /api/documentos-clinicos/prescripciones-medicamento/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasPrescripciones);

// GET /api/documentos-clinicos/prescripciones-medicamento/expediente/:id_expediente - Obtener prescripciones por expediente
router.get("/expediente/:id_expediente", getPrescripcionesByExpediente);

// GET /api/documentos-clinicos/prescripciones-medicamento - Obtener todas las prescripciones con filtros
router.get("/", getPrescripcionesMedicamento);

// GET /api/documentos-clinicos/prescripciones-medicamento/:id - Obtener una prescripción por ID
router.get("/:id", getPrescripcionMedicamentoById);

// POST /api/documentos-clinicos/prescripciones-medicamento - Crear nueva prescripción
router.post("/", createPrescripcionMedicamento);

// PUT /api/documentos-clinicos/prescripciones-medicamento/:id - Actualizar prescripción
router.put("/:id", updatePrescripcionMedicamento);

// DELETE /api/documentos-clinicos/prescripciones-medicamento/:id - Desactivar prescripción
router.delete("/:id", deletePrescripcionMedicamento);

export default router;