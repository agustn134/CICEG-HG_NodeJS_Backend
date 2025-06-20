"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_postanestesica.routes.ts
const express_1 = require("express");
const nota_postanestesica_controller_1 = require("../../controllers/documentos_clinicos/nota_postanestesica.controller");
const router = (0, express_1.Router)();
router.get("/", nota_postanestesica_controller_1.getNotasPostanestesica);
router.get("/:id", nota_postanestesica_controller_1.getNotaPostanestesicaById);
router.post("/", nota_postanestesica_controller_1.createNotaPostanestesica);
router.put("/:id", nota_postanestesica_controller_1.updateNotaPostanestesica);
router.delete("/:id", nota_postanestesica_controller_1.deleteNotaPostanestesica);
exports.default = router;
