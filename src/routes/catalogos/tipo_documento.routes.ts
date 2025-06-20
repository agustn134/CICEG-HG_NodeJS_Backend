// src/routes/catalogos/tipo_documento.routes.ts
import { Router } from "express";
import {
  getTiposDocumento,
  getTipoDocumentoById,
  createTipoDocumento,
  updateTipoDocumento,
  deleteTipoDocumento
} from "../../controllers/catalogos/tipo_documento.controller";

const router = Router();

router.get("/", getTiposDocumento);
router.get("/:id", getTipoDocumentoById);
router.post("/", createTipoDocumento);
router.put("/:id", updateTipoDocumento);
router.delete("/:id", deleteTipoDocumento);

export default router;