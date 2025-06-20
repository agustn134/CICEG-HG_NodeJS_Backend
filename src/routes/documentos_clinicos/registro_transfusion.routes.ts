// src/routes/documentos_clinicos/registro_transfusion.routes.ts
import { Router } from "express";
import {
  getRegistrosTransfusion,
  getRegistroTransfusionById,
  createRegistroTransfusion,
  updateRegistroTransfusion,
  deleteRegistroTransfusion
} from "../../controllers/documentos_clinicos/registro_transfusion.controller";

const router = Router();

router.get("/", getRegistrosTransfusion);
router.get("/:id", getRegistroTransfusionById);
router.post("/", createRegistroTransfusion);
router.put("/:id", updateRegistroTransfusion);
router.delete("/:id", deleteRegistroTransfusion);

export default router;