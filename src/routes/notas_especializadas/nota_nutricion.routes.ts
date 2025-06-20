// src/routes/notas_especializadas/nota_nutricion.routes.ts
import { Router } from "express";
import {
  getNotasNutricion,
  getNotaNutricionById,
  createNotaNutricion,
  updateNotaNutricion,
  deleteNotaNutricion
} from "../../controllers/notas_especializadas/nota_nutricion.controller";

const router = Router();

router.get("/", getNotasNutricion);
router.get("/:id", getNotaNutricionById);
router.post("/", createNotaNutricion);
router.put("/:id", updateNotaNutricion);
router.delete("/:id", deleteNotaNutricion);

export default router;