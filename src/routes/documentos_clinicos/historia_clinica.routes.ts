// src/routes/documentos_clinicos/historia_clinica.routes.ts
import { Router } from "express";
import {
  getHistoriasClinicas,
  getHistoriaClinicaById,
  createHistoriaClinica,
  updateHistoriaClinica,
  deleteHistoriaClinica,
  getHistoriaClinicaByDocumento,
  getEstadisticasHistoriasClinicas
} from "../../controllers/documentos_clinicos/historia_clinica.controller";

const router = Router();

// ==========================================
// RUTAS PARA HISTORIAS CLÍNICAS
// ==========================================

// GET /api/documentos-clinicos/historias-clinicas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasHistoriasClinicas);

// GET /api/documentos-clinicos/historias-clinicas/documento/:id_documento - Obtener historia por documento
router.get("/documento/:id_documento", getHistoriaClinicaByDocumento);

// GET /api/documentos-clinicos/historias-clinicas - Obtener todas las historias clínicas
// Acepta query params: ?page=1&limit=10&id_expediente=1&buscar=diabetes
router.get("/", getHistoriasClinicas);

// GET /api/documentos-clinicos/historias-clinicas/:id - Obtener historia clínica por ID
router.get("/:id", getHistoriaClinicaById);

// POST /api/documentos-clinicos/historias-clinicas - Crear nueva historia clínica
router.post("/", createHistoriaClinica);

// PUT /api/documentos-clinicos/historias-clinicas/:id - Actualizar historia clínica
router.put("/:id", updateHistoriaClinica);

// DELETE /api/documentos-clinicos/historias-clinicas/:id - Anular historia clínica
router.delete("/:id", deleteHistoriaClinica);

export default router;