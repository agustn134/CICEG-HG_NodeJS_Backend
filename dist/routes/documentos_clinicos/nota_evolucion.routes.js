"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/nota_evolucion.routes.ts
const express_1 = require("express");
const nota_evolucion_controller_1 = require("../../controllers/documentos_clinicos/nota_evolucion.controller");
const router = (0, express_1.Router)();
router.get("/", nota_evolucion_controller_1.getNotasEvolucion);
router.get("/:id", nota_evolucion_controller_1.getNotaEvolucionById);
router.post("/", nota_evolucion_controller_1.createNotaEvolucion);
router.put("/:id", nota_evolucion_controller_1.updateNotaEvolucion);
router.delete("/:id", nota_evolucion_controller_1.deleteNotaEvolucion);
exports.default = router;
