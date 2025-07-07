// src/routes/documentos_clinicos/nota_evolucion.routes.ts
import { Router } from 'express';
import {
  createNotaEvolucion,
  getNotasEvolucion,
  getNotaEvolucionById,
  updateNotaEvolucion,
  deleteNotaEvolucion,
  getNotasEvolucionByExpediente,
  getNotaEvolucionByDocumento
} from '../../controllers/documentos_clinicos/nota_evolucion.controller';

const router = Router();

// ==========================================
// RUTAS PRINCIPALES
// ==========================================

// GET /api/notas-evolucion - Obtener todas las notas con filtros
router.get('/', getNotasEvolucion);

// POST /api/notas-evolucion - Crear nueva nota de evolución
router.post('/', createNotaEvolucion);

// GET /api/notas-evolucion/:id - Obtener nota por ID
router.get('/:id', getNotaEvolucionById);

// PUT /api/notas-evolucion/:id - Actualizar nota por ID
router.put('/:id', updateNotaEvolucion);

// DELETE /api/notas-evolucion/:id - Anular nota por ID
router.delete('/:id', deleteNotaEvolucion);

// ==========================================
// RUTAS ESPECÍFICAS
// ==========================================

// GET /api/notas-evolucion/expediente/:id_expediente - Obtener notas por expediente
router.get('/expediente/:id_expediente', getNotasEvolucionByExpediente);

// GET /api/notas-evolucion/documento/:id_documento - Obtener nota por documento
router.get('/documento/:id_documento', getNotaEvolucionByDocumento);

export default router;