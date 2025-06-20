// src/routes/documentos_clinicos/documento_clinico.routes.ts
import { Router } from "express";
import {
  getDocumentosClinicos,
  getDocumentoClinicoById,
  createDocumentoClinico,
  updateDocumentoClinico,
  deleteDocumentoClinico
} from "../../controllers/documentos_clinicos/documento_clinico.controller";

const router = Router();

router.get("/", getDocumentosClinicos);
router.get("/:id", getDocumentoClinicoById);
router.post("/", createDocumentoClinico);
router.put("/:id", updateDocumentoClinico);
router.delete("/:id", deleteDocumentoClinico);

export default router;