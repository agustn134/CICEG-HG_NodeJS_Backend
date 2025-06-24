// src/routes/catalogos/catalogo_vacunas.routes.ts
import { Router } from "express";
import {
  getCatalogoVacunas,
  getVacunaById,
  createVacuna,
  updateVacuna,
  deleteVacuna,
  getVacunasActivas,
  getEstadisticasVacunas
} from "../../controllers/catalogos/catalogo_vacunas.controller";

const router = Router();

// ==========================================
// RUTAS PARA CATÁLOGO DE VACUNAS
// ==========================================

// GET /api/catalogos/catalogo-vacunas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasVacunas);

// GET /api/catalogos/catalogo-vacunas/activas - Obtener solo vacunas activas (para selects)
// Acepta query param: ?tipo_vacuna=Adicional
router.get("/activas", getVacunasActivas);

// GET /api/catalogos/catalogo-vacunas - Obtener todas las vacunas del catálogo
// Acepta query params: ?tipo_vacuna=Especial&activa=true
router.get("/", getCatalogoVacunas);

// GET /api/catalogos/catalogo-vacunas/:id - Obtener vacuna por ID
router.get("/:id", getVacunaById);

// POST /api/catalogos/catalogo-vacunas - Crear nueva vacuna en el catálogo
router.post("/", createVacuna);

// PUT /api/catalogos/catalogo-vacunas/:id - Actualizar vacuna del catálogo
router.put("/:id", updateVacuna);

// DELETE /api/catalogos/catalogo-vacunas/:id - Eliminar vacuna del catálogo
router.delete("/:id", deleteVacuna);

export default router;