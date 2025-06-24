// src/routes/catalogos/tipo_documento.routes.ts
import { Router } from "express";
import {
  getTiposDocumento,
  getTipoDocumentoById,
  createTipoDocumento,
  updateTipoDocumento,
  deleteTipoDocumento,
  getTiposDocumentoActivos,
  getEstadisticasTiposDocumento
} from "../../controllers/catalogos/tipo_documento.controller";

const router = Router();

// ==========================================
// RUTAS PARA TIPOS DE DOCUMENTO
// ==========================================

// GET /api/catalogos/tipos-documento/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasTiposDocumento);

// GET /api/catalogos/tipos-documento/activos - Obtener solo tipos activos (para selects)
router.get("/activos", getTiposDocumentoActivos);

// GET /api/catalogos/tipos-documento - Obtener todos los tipos de documento
// Acepta query params: ?activo=true&buscar=historia
router.get("/", getTiposDocumento);

// GET /api/catalogos/tipos-documento/:id - Obtener tipo de documento por ID
router.get("/:id", getTipoDocumentoById);

// POST /api/catalogos/tipos-documento - Crear nuevo tipo de documento
router.post("/", createTipoDocumento);

// PUT /api/catalogos/tipos-documento/:id - Actualizar tipo de documento
router.put("/:id", updateTipoDocumento);

// DELETE /api/catalogos/tipos-documento/:id - Eliminar tipo de documento
router.delete("/:id", deleteTipoDocumento);

export default router;