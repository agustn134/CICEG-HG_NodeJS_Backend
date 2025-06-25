"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/personas/persona.routes.ts
const express_1 = require("express");
const persona_controller_1 = require("../../controllers/personas/persona.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA PERSONAS
// ==========================================
// GET /api/personas/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", persona_controller_1.getEstadisticasPersonas);
// GET /api/personas/buscar - Buscar personas (para autocomplete)
// Query params: ?q=texto_busqueda&sin_rol=true
router.get("/buscar", persona_controller_1.buscarPersonas);
// GET /api/personas - Obtener todas las personas
// Query params: ?sexo=M&edad_min=18&edad_max=65&estado_civil=Soltero&tipo_sangre=O+&buscar=juan
router.get("/", persona_controller_1.getPersonas);
// GET /api/personas/:id - Obtener persona por ID
router.get("/:id", persona_controller_1.getPersonaById);
// POST /api/personas - Crear nueva persona
router.post("/", persona_controller_1.createPersona);
// PUT /api/personas/:id - Actualizar persona
router.put("/:id", persona_controller_1.updatePersona);
// DELETE /api/personas/:id - Eliminar persona
router.delete("/:id", persona_controller_1.deletePersona);
exports.default = router;
