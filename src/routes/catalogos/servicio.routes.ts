// src/routes/catalogos/servicio.routes.ts
// import { Router } from "express";
// const router = Router();

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


import { Router } from "express";
import {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio
} from "../../controllers/catalogos/servicio.controller"; // <- Importa tus funciones

const router = Router();

// Definir rutas
router.get("/", getServicios);
router.get("/:id", getServicioById);
router.post("/", createServicio);
router.put("/:id", updateServicio);
router.delete("/:id", deleteServicio);

export default router;
