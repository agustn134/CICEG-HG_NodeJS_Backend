// src/routes/personas/persona.routes.ts
import { Router } from "express";
import {
  getPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona,
  buscarPersonas,
  getEstadisticasPersonas
} from "../../controllers/personas/persona.controller";

const router = Router();

// ==========================================
// RUTAS PARA PERSONAS
// ==========================================

// GET /api/personas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasPersonas);

// GET /api/personas/buscar - Buscar personas (para autocomplete)
// Query params: ?q=texto_busqueda&sin_rol=true
router.get("/buscar", buscarPersonas);

// GET /api/personas - Obtener todas las personas
// Query params: ?sexo=M&edad_min=18&edad_max=65&estado_civil=Soltero&tipo_sangre=O+&buscar=juan
router.get("/", getPersonas);

// GET /api/personas/:id - Obtener persona por ID
router.get("/:id", getPersonaById);

// POST /api/personas - Crear nueva persona
router.post("/", createPersona);

// PUT /api/personas/:id - Actualizar persona
router.put("/:id", updatePersona);

// DELETE /api/personas/:id - Eliminar persona
router.delete("/:id", deletePersona);

export default router;