// src/routes/gestion_expedientes/signos_vitales.routes.ts
import { Router } from "express";
import {
  getSignosVitales,
  getSignosVitalesById,
  createSignosVitales,
  updateSignosVitales,
  deleteSignosVitales
} from "../../controllers/gestion_expedientes/signos_vitales.controller";

const router = Router();

router.get("/", getSignosVitales);
router.get("/:id", getSignosVitalesById);
router.post("/", createSignosVitales);
router.put("/:id", updateSignosVitales);
router.delete("/:id", deleteSignosVitales);

export default router;