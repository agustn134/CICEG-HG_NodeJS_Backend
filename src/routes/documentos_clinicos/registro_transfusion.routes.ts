// src/routes/documentos_clinicos/registro_transfusion.routes.ts
import { Router } from "express";
import {
  getRegistrosTransfusion,
  getRegistroTransfusionById,
  createRegistroTransfusion,
  updateRegistroTransfusion,
  deleteRegistroTransfusion,
  getRegistrosTransfusionByExpediente,
  getRegistrosTransfusionByPaciente,
  searchRegistrosTransfusion,
  getReaccionesAdversas,
  estadisticasTransfusiones,
  getCompatibilidadSanguinea,
  finalizarTransfusion,
  getTiposComponentesDisponibles,
  validarRegistroTransfusion
} from "../../controllers/documentos_clinicos/registro_transfusion.controller";

const router = Router();

// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================

// GET /api/documentos-clinicos/registros-transfusion - Obtener todos los registros de transfusión
router.get("/", getRegistrosTransfusion);

// GET /api/documentos-clinicos/registros-transfusion/:id - Obtener registro de transfusión por ID
router.get("/:id", getRegistroTransfusionById);

// POST /api/documentos-clinicos/registros-transfusion - Crear nuevo registro de transfusión
router.post("/", createRegistroTransfusion);

// PUT /api/documentos-clinicos/registros-transfusion/:id - Actualizar registro de transfusión
router.put("/:id", updateRegistroTransfusion);

// DELETE /api/documentos-clinicos/registros-transfusion/:id - Eliminar registro de transfusión
router.delete("/:id", deleteRegistroTransfusion);

// ==========================================
// RUTAS ESPECÍFICAS Y CONSULTAS AVANZADAS
// ==========================================

// GET /api/documentos-clinicos/registros-transfusion/expediente/:id_expediente - Obtener registros por expediente
router.get("/expediente/:id_expediente", getRegistrosTransfusionByExpediente);

// GET /api/documentos-clinicos/registros-transfusion/paciente/:id_paciente - Obtener registros por paciente
router.get("/paciente/:id_paciente", getRegistrosTransfusionByPaciente);

// GET /api/documentos-clinicos/registros-transfusion/search/:query - Buscar registros de transfusión
router.get("/search/:query", searchRegistrosTransfusion);

// GET /api/documentos-clinicos/registros-transfusion/reacciones/adversas - Obtener registros con reacciones adversas
router.get("/reacciones/adversas", getReaccionesAdversas);

// GET /api/documentos-clinicos/registros-transfusion/estadisticas/general - Estadísticas de transfusiones
router.get("/estadisticas/general", estadisticasTransfusiones);

// GET /api/documentos-clinicos/registros-transfusion/compatibilidad/:grupo_sanguineo_paciente - Compatibilidad sanguínea
router.get("/compatibilidad/:grupo_sanguineo_paciente", getCompatibilidadSanguinea);

// GET /api/documentos-clinicos/registros-transfusion/tipos/disponibles - Tipos de componentes disponibles
router.get("/tipos/disponibles", getTiposComponentesDisponibles);

// POST /api/documentos-clinicos/registros-transfusion/:id/finalizar - Finalizar transfusión
router.post("/:id/finalizar", finalizarTransfusion);

// POST /api/documentos-clinicos/registros-transfusion/:id/validar - Validar registro de transfusión
router.post("/:id/validar", validarRegistroTransfusion);

export default router;