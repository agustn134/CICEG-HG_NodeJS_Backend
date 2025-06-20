import { Router } from "express";
import { createAreaInterconsulta, deleteAreaInterconsulta, getAreaInterconsultaById, getAreasInterconsulta, updateAreaInterconsulta } from "../../controllers/catalogos/area_interconsulta.controller";

const router = Router();

router.get("/", getAreasInterconsulta);
router.get("/:id", getAreaInterconsultaById);
router.post("/", createAreaInterconsulta);
router.put("/:id", updateAreaInterconsulta);
router.delete("/:id", deleteAreaInterconsulta);

export default router;