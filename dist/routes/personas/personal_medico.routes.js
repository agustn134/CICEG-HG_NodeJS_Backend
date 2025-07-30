"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/personas/personal_medico.routes.ts
const express_1 = require("express");
const personal_medico_controller_1 = require("../../controllers/personas/personal_medico.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA PERSONAL MÉDICO
// ==========================================
// GET /api/personas/personal-medico/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", personal_medico_controller_1.getEstadisticasPersonalMedico);
// GET /api/personas/personal-medico/activos - Obtener solo personal activo (para selects)
// Query params: ?especialidad=Pediatría&cargo=Médico&departamento=Urgencias
router.get("/activos", personal_medico_controller_1.getPersonalMedicoActivo);
// GET /api/personas/personal-medico - Obtener todo el personal médico
// Query params: ?activo=true&especialidad=Cardiología&cargo=Jefe&departamento=Medicina&buscar=juan
router.get("/", personal_medico_controller_1.getPersonalMedico);
router.get("/:id/perfil-completo", personal_medico_controller_1.getPerfilMedicoConPacientes);
// PATCH /api/personas/personal-medico/:id/foto - Actualizar solo la foto 🆕
router.patch("/:id/foto", personal_medico_controller_1.updateFotoPersonalMedico);
// GET /api/personas/personal-medico/:id - Obtener personal médico por ID
router.get("/:id", personal_medico_controller_1.getPersonalMedicoById);
// POST /api/personas/personal-medico - Crear nuevo personal médico
router.post("/", personal_medico_controller_1.createPersonalMedico);
// PUT /api/personas/personal-medico/:id - Actualizar personal médico
router.put("/:id", personal_medico_controller_1.updatePersonalMedico);
// DELETE /api/personas/personal-medico/:id - Eliminar personal médico
router.delete("/:id", personal_medico_controller_1.deletePersonalMedico);
exports.default = router;
