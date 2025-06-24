// src/routes/catalogos/tipo_sangre.routes.ts
import { Router } from "express";
import {
  getTiposSangre,
  getTipoSangreById,
  createTipoSangre,
  updateTipoSangre,
  deleteTipoSangre,
  getEstadisticasTiposSangre
} from "../../controllers/catalogos/tipo_sangre.controller";

const router = Router();

// ==========================================
// RUTAS PARA TIPOS DE SANGRE
// ==========================================

// GET /api/catalogos/tipos-sangre/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasTiposSangre);

// GET /api/catalogos/tipos-sangre - Obtener todos los tipos de sangre
router.get("/", getTiposSangre);

// GET /api/catalogos/tipos-sangre/:id - Obtener tipo de sangre por ID
router.get("/:id", getTipoSangreById);

// POST /api/catalogos/tipos-sangre - Crear nuevo tipo de sangre
router.post("/", createTipoSangre);

// PUT /api/catalogos/tipos-sangre/:id - Actualizar tipo de sangre
router.put("/:id", updateTipoSangre);

// DELETE /api/catalogos/tipos-sangre/:id - Eliminar tipo de sangre
router.delete("/:id", deleteTipoSangre);

export default router;