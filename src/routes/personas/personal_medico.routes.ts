// src/routes/personas/personal_medico.routes.ts
import { Router } from "express";
import {
  getPersonalMedico,
  getPersonalMedicoById,
  createPersonalMedico,
  updatePersonalMedico,
  deletePersonalMedico,
    updateFotoPersonalMedico, // 🆕 IMPORTAR NUEVA FUNCIÓN
  getPersonalMedicoActivo,
  getEstadisticasPersonalMedico,
  getPerfilMedicoConPacientes
} from "../../controllers/personas/personal_medico.controller";

const router = Router();

// ==========================================
// RUTAS PARA PERSONAL MÉDICO
// ==========================================

// GET /api/personas/personal-medico/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasPersonalMedico);

// GET /api/personas/personal-medico/activos - Obtener solo personal activo (para selects)
// Query params: ?especialidad=Pediatría&cargo=Médico&departamento=Urgencias
router.get("/activos", getPersonalMedicoActivo);

// GET /api/personas/personal-medico - Obtener todo el personal médico
// Query params: ?activo=true&especialidad=Cardiología&cargo=Jefe&departamento=Medicina&buscar=juan
router.get("/", getPersonalMedico);

router.get("/:id/perfil-completo", getPerfilMedicoConPacientes);

// PATCH /api/personas/personal-medico/:id/foto - Actualizar solo la foto 🆕
router.patch("/:id/foto", updateFotoPersonalMedico);

// GET /api/personas/personal-medico/:id - Obtener personal médico por ID
router.get("/:id", getPersonalMedicoById);

// POST /api/personas/personal-medico - Crear nuevo personal médico
router.post("/", createPersonalMedico);

// PUT /api/personas/personal-medico/:id - Actualizar personal médico
router.put("/:id", updatePersonalMedico);

// DELETE /api/personas/personal-medico/:id - Eliminar personal médico
router.delete("/:id", deletePersonalMedico);


export default router;