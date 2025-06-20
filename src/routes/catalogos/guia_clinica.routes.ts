// src/routes/catalogos/guia_clinica.routes.ts
import { Router } from "express";
import {
  getGuiasClinicas,
  getGuiaClinicaById,
  createGuiaClinica,
  updateGuiaClinica,
  deleteGuiaClinica
} from "../../controllers/catalogos/guia_clinica.controller";

const router = Router();

router.get("/", getGuiasClinicas);
router.get("/:id", getGuiaClinicaById);
router.post("/", createGuiaClinica);
router.put("/:id", updateGuiaClinica);
router.delete("/:id", deleteGuiaClinica);

export default router;