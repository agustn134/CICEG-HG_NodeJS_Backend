// src/routes/documentos_clinicos/solicitud_estudio.routes.ts
import { Router } from "express";
import {
  getSolicitudesEstudio,
  getSolicitudEstudioById,
  createSolicitudEstudio,
  updateSolicitudEstudio,
  deleteSolicitudEstudio
} from "../../controllers/documentos_clinicos/solicitud_estudio.controller";

const router = Router();

router.get("/", getSolicitudesEstudio);
router.get("/:id", getSolicitudEstudioById);
router.post("/", createSolicitudEstudio);
router.put("/:id", updateSolicitudEstudio);
router.delete("/:id", deleteSolicitudEstudio);

export default router;