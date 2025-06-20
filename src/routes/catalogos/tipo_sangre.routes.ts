// src/routes/catalogos/tipo_sangre.routes.ts
import { Router } from "express";
import {
  getTiposSangre,
  getTipoSangreById,
  createTipoSangre,
  updateTipoSangre,
  deleteTipoSangre
} from "../../controllers/catalogos/tipo_sangre.controller";

const router = Router();

router.get("/", getTiposSangre);
router.get("/:id", getTipoSangreById);
router.post("/", createTipoSangre);
router.put("/:id", updateTipoSangre);
router.delete("/:id", deleteTipoSangre);

export default router;