// src/routes/documentos_clinicos/nota_interconsulta.routes.ts
import { Router } from "express";
import {
  getNotasInterconsulta,
  getNotaInterconsultaById,
  createNotaInterconsulta,
  updateNotaInterconsulta,
  deleteNotaInterconsulta,
  getNotasInterconsultaByExpediente,
  getNotasInterconsultaByPaciente,
  searchNotasInterconsulta,
  getNotasInterconsultaPendientes,
  asignarMedicoInterconsulta,
  responderInterconsulta,
  estadisticasInterconsultas,
  getAreasInterconsultaDisponibles,
  validarInterconsultaCompleta
} from "../../controllers/documentos_clinicos/nota_interconsulta.controller";

const router = Router();

// CRUD básico
router.get("/", getNotasInterconsulta);
router.get("/:id", getNotaInterconsultaById);
router.post("/", createNotaInterconsulta);
router.put("/:id", updateNotaInterconsulta);
router.delete("/:id", deleteNotaInterconsulta);

// Rutas específicas
router.get("/expediente/:id_expediente", getNotasInterconsultaByExpediente);
router.get("/paciente/:id_paciente", getNotasInterconsultaByPaciente);
router.get("/buscar/:query", searchNotasInterconsulta);
router.get("/estado/pendientes", getNotasInterconsultaPendientes);

// Operaciones de interconsulta
router.post("/:id/asignar-medico", asignarMedicoInterconsulta);
router.post("/:id/responder", responderInterconsulta);

// Estadísticas y utilidades
router.get("/estadisticas/generales", estadisticasInterconsultas);
router.get("/areas/disponibles", getAreasInterconsultaDisponibles);
router.get("/:id/validar-completa", validarInterconsultaCompleta);

export default router;