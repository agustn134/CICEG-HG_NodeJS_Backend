// src/routes/gestion_expedientes/internamiento.routes.ts
import { Router } from "express";
import {
  getInternamientos,
  getInternamientoById,
  createInternamiento,
  updateInternamiento,
} from "../../controllers/gestion_expedientes/internamiento.controller";

const router = Router();

router.get("/", getInternamientos);
router.get("/:id", getInternamientoById);
router.post("/", createInternamiento);
router.put("/:id", updateInternamiento);
// router.delete("/:id", deleteInternamiento);

export default router;