"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const consentimiento_informado_controller_1 = require("../../controllers/documentos_clinicos/consentimiento_informado.controller");
const router = (0, express_1.Router)();
// ==========================================
// OBTENER TODOS LOS CONSENTIMIENTOS
// ==========================================
router.get('/', consentimiento_informado_controller_1.getConsentimientos);
// ==========================================
// OBTENER CONSENTIMIENTO POR ID
// ==========================================
router.get('/:id', consentimiento_informado_controller_1.getConsentimientoById);
// ==========================================
// CREAR NUEVO CONSENTIMIENTO INFORMADO
// ==========================================
router.post('/', consentimiento_informado_controller_1.createConsentimiento);
// ==========================================
// ACTUALIZAR CONSENTIMIENTO INFORMADO
// ==========================================
router.put('/:id', consentimiento_informado_controller_1.updateConsentimiento);
// ==========================================
// ELIMINAR CONSENTIMIENTO INFORMADO
// ==========================================
router.delete('/:id', consentimiento_informado_controller_1.deleteConsentimiento);
// ==========================================
// OBTENER CONSENTIMIENTOS POR EXPEDIENTE
// ==========================================
router.get('/expediente/:id_expediente', consentimiento_informado_controller_1.getConsentimientosByExpediente);
// ==========================================
// OBTENER ESTADÍSTICAS DE CONSENTIMIENTOS
// ==========================================
router.get('/estadisticas/consentimientos', consentimiento_informado_controller_1.getEstadisticasConsentimientos);
exports.default = router;
