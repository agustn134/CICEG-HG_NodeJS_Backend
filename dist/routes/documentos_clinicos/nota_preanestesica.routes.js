"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ==========================================
// RUTAS PARA NOTA PREANESTESICA
// ==========================================
// src/routes/documentos_clinicos/nota_preanestesica.routes.ts
const express_1 = require("express");
const nota_preanestesica_controller_1 = require("../../controllers/documentos_clinicos/nota_preanestesica.controller");
const router = (0, express_1.Router)();
// Rutas básicas CRUD
router.get("/", nota_preanestesica_controller_1.getNotasPreanestesica);
router.get("/:id", nota_preanestesica_controller_1.getNotaPreanestesicaById);
router.post("/", nota_preanestesica_controller_1.createNotaPreanestesica);
router.put("/:id", nota_preanestesica_controller_1.updateNotaPreanestesica);
router.delete("/:id", nota_preanestesica_controller_1.deleteNotaPreanestesica);
// Rutas adicionales
router.get("/expediente/:id_expediente", nota_preanestesica_controller_1.getNotasPreanestesicaByExpediente);
router.get("/catalogos/clasificaciones-asa", nota_preanestesica_controller_1.getClasificacionesASA);
exports.default = router;
