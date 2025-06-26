"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_interconsulta.routes.ts
const express_1 = require("express");
const nota_interconsulta_controller_1 = require("../../controllers/documentos_clinicos/nota_interconsulta.controller");
const router = (0, express_1.Router)();
// CRUD básico
router.get("/", nota_interconsulta_controller_1.getNotasInterconsulta);
router.get("/:id", nota_interconsulta_controller_1.getNotaInterconsultaById);
router.post("/", nota_interconsulta_controller_1.createNotaInterconsulta);
router.put("/:id", nota_interconsulta_controller_1.updateNotaInterconsulta);
router.delete("/:id", nota_interconsulta_controller_1.deleteNotaInterconsulta);
// Rutas específicas
router.get("/expediente/:id_expediente", nota_interconsulta_controller_1.getNotasInterconsultaByExpediente);
router.get("/paciente/:id_paciente", nota_interconsulta_controller_1.getNotasInterconsultaByPaciente);
router.get("/buscar/:query", nota_interconsulta_controller_1.searchNotasInterconsulta);
router.get("/estado/pendientes", nota_interconsulta_controller_1.getNotasInterconsultaPendientes);
// Operaciones de interconsulta
router.post("/:id/asignar-medico", nota_interconsulta_controller_1.asignarMedicoInterconsulta);
router.post("/:id/responder", nota_interconsulta_controller_1.responderInterconsulta);
// Estadísticas y utilidades
router.get("/estadisticas/generales", nota_interconsulta_controller_1.estadisticasInterconsultas);
router.get("/areas/disponibles", nota_interconsulta_controller_1.getAreasInterconsultaDisponibles);
router.get("/:id/validar-completa", nota_interconsulta_controller_1.validarInterconsultaCompleta);
exports.default = router;
