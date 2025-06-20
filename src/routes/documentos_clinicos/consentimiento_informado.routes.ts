// src/routes/documentos_clinicos/consentimiento_informado.routes.ts
import { Router } from "express";
import {
  getConsentimientosInformados,
  getConsentimientoInformadoById,
  createConsentimientoInformado,
  updateConsentimientoInformado,
  deleteConsentimientoInformado
} from "../../controllers/documentos_clinicos/consentimiento_informado.controller";

const router = Router();

router.get("/", getConsentimientosInformados);
router.get("/:id", getConsentimientoInformadoById);
router.post("/", createConsentimientoInformado);
router.put("/:id", updateConsentimientoInformado);
router.delete("/:id", deleteConsentimientoInformado);

export default router;