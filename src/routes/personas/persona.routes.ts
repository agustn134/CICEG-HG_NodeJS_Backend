// src/routes/personas/persona.routes.ts
import { Router } from "express";
import {
  getPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona
} from "../../controllers/personas/persona.controller";

const router = Router();

router.get("/", getPersonas);
router.get("/:id", getPersonaById);
router.post("/", createPersona);
router.put("/:id", updatePersona);
router.delete("/:id", deletePersona);

export default router;