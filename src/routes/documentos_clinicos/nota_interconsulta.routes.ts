// src/routes/documentos_clinicos/nota_interconsulta.routes.ts
import { Router } from "express";
import {
  getNotasInterconsulta,
  getNotaInterconsultaById,
  createNotaInterconsulta,
  updateNotaInterconsulta,
  deleteNotaInterconsulta
} from "../../controllers/documentos_clinicos/nota_interconsulta.controller";

const router = Router();

router.get("/", getNotasInterconsulta);
router.get("/:id", getNotaInterconsultaById);
router.post("/", createNotaInterconsulta);
router.put("/:id", updateNotaInterconsulta);
router.delete("/:id", deleteNotaInterconsulta);

export default router;