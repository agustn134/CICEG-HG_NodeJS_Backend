"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_interconsulta.routes.ts
const express_1 = require("express");
const nota_interconsulta_controller_1 = require("../../controllers/documentos_clinicos/nota_interconsulta.controller");
const router = (0, express_1.Router)();
router.get("/", nota_interconsulta_controller_1.getNotasInterconsulta);
router.get("/:id", nota_interconsulta_controller_1.getNotaInterconsultaById);
router.post("/", nota_interconsulta_controller_1.createNotaInterconsulta);
router.put("/:id", nota_interconsulta_controller_1.updateNotaInterconsulta);
router.delete("/:id", nota_interconsulta_controller_1.deleteNotaInterconsulta);
exports.default = router;
