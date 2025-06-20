// src/routes/gestion_expedientes/expediente.routes.ts
import { Router } from "express";
import {
  getExpedientes,
  getExpedienteById,
  createExpediente,
  updateExpediente,
  deleteExpediente
} from "../../controllers/gestion_expedientes/expediente.controller";

const router = Router();

router.get("/", getExpedientes);
router.get("/:id", getExpedienteById);
router.post("/", createExpediente);
router.put("/:id", updateExpediente);
router.delete("/:id", deleteExpediente);

export default router;