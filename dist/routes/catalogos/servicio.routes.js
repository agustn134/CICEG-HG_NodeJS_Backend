"use strict";
// src/routes/catalogos/servicio.routes.ts
// import { Router } from "express";
// const router = Router();
Object.defineProperty(exports, "__esModule", { value: true });
// export default router;
// import {
//   getServicios,
//   getServicioById,
//   createServicio,
//   updateServicio,
//   deleteServicio
// } from "../../controllers/catalogos/servicio.controller";
// const router = Router();
// router.get("/", getServicios);
// router.get("/:id", getServicioById);
// router.post("/", createServicio);
// router.put("/:id", updateServicio);
// router.delete("/:id", deleteServicio);
// export default router;
const express_1 = require("express");
const servicio_controller_1 = require("../../controllers/catalogos/servicio.controller"); // <- Importa tus funciones
const router = (0, express_1.Router)();
// Definir rutas
router.get("/", servicio_controller_1.getServicios);
router.get("/:id", servicio_controller_1.getServicioById);
router.post("/", servicio_controller_1.createServicio);
router.put("/:id", servicio_controller_1.updateServicio);
router.delete("/:id", servicio_controller_1.deleteServicio);
exports.default = router;
