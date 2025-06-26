"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/documentos_clinicos/registro_transfusion.routes.ts
const express_1 = require("express");
const registro_transfusion_controller_1 = require("../../controllers/documentos_clinicos/registro_transfusion.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS BÁSICAS CRUD
// ==========================================
// GET /api/documentos-clinicos/registros-transfusion - Obtener todos los registros de transfusión
router.get("/", registro_transfusion_controller_1.getRegistrosTransfusion);
// GET /api/documentos-clinicos/registros-transfusion/:id - Obtener registro de transfusión por ID
router.get("/:id", registro_transfusion_controller_1.getRegistroTransfusionById);
// POST /api/documentos-clinicos/registros-transfusion - Crear nuevo registro de transfusión
router.post("/", registro_transfusion_controller_1.createRegistroTransfusion);
// PUT /api/documentos-clinicos/registros-transfusion/:id - Actualizar registro de transfusión
router.put("/:id", registro_transfusion_controller_1.updateRegistroTransfusion);
// DELETE /api/documentos-clinicos/registros-transfusion/:id - Eliminar registro de transfusión
router.delete("/:id", registro_transfusion_controller_1.deleteRegistroTransfusion);
// ==========================================
// RUTAS ESPECÍFICAS Y CONSULTAS AVANZADAS
// ==========================================
// GET /api/documentos-clinicos/registros-transfusion/expediente/:id_expediente - Obtener registros por expediente
router.get("/expediente/:id_expediente", registro_transfusion_controller_1.getRegistrosTransfusionByExpediente);
// GET /api/documentos-clinicos/registros-transfusion/paciente/:id_paciente - Obtener registros por paciente
router.get("/paciente/:id_paciente", registro_transfusion_controller_1.getRegistrosTransfusionByPaciente);
// GET /api/documentos-clinicos/registros-transfusion/search/:query - Buscar registros de transfusión
router.get("/search/:query", registro_transfusion_controller_1.searchRegistrosTransfusion);
// GET /api/documentos-clinicos/registros-transfusion/reacciones/adversas - Obtener registros con reacciones adversas
router.get("/reacciones/adversas", registro_transfusion_controller_1.getReaccionesAdversas);
// GET /api/documentos-clinicos/registros-transfusion/estadisticas/general - Estadísticas de transfusiones
router.get("/estadisticas/general", registro_transfusion_controller_1.estadisticasTransfusiones);
// GET /api/documentos-clinicos/registros-transfusion/compatibilidad/:grupo_sanguineo_paciente - Compatibilidad sanguínea
router.get("/compatibilidad/:grupo_sanguineo_paciente", registro_transfusion_controller_1.getCompatibilidadSanguinea);
// GET /api/documentos-clinicos/registros-transfusion/tipos/disponibles - Tipos de componentes disponibles
router.get("/tipos/disponibles", registro_transfusion_controller_1.getTiposComponentesDisponibles);
// POST /api/documentos-clinicos/registros-transfusion/:id/finalizar - Finalizar transfusión
router.post("/:id/finalizar", registro_transfusion_controller_1.finalizarTransfusion);
// POST /api/documentos-clinicos/registros-transfusion/:id/validar - Validar registro de transfusión
router.post("/:id/validar", registro_transfusion_controller_1.validarRegistroTransfusion);
exports.default = router;
