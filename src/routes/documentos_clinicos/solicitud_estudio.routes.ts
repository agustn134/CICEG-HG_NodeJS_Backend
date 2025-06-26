// src/routes/documentos_clinicos/solicitud_estudio.routes.ts
import { Router } from "express";
import {
  getSolicitudesEstudio,
  getSolicitudEstudioById,
  createSolicitudEstudio,
  updateSolicitudEstudio,
  deleteSolicitudEstudio,
  updateResultadoEstudio
} from "../../controllers/documentos_clinicos/solicitud_estudio.controller";

const router = Router();

// Obtener todas las solicitudes de estudio (con paginación y filtros)
router.get("/", getSolicitudesEstudio);

// Obtener una solicitud específica por ID
router.get("/:id", getSolicitudEstudioById);

// Crear una nueva solicitud de estudio
router.post("/", createSolicitudEstudio);

// Actualizar una solicitud existente
router.put("/:id", updateSolicitudEstudio);

// Eliminar una solicitud
router.delete("/:id", deleteSolicitudEstudio);

// Endpoint especial para registrar/actualizar resultados de estudios
router.patch("/:id/resultados", updateResultadoEstudio);

export default router;