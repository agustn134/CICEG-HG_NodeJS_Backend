import { Router } from 'express';
import {
  getConsentimientos,
  getConsentimientoById,
  createConsentimiento,
  updateConsentimiento,
  deleteConsentimiento,
  getConsentimientosByExpediente,
  getEstadisticasConsentimientos
} from '../../controllers/documentos_clinicos/consentimiento_informado.controller';

const router = Router();

// ==========================================
// OBTENER TODOS LOS CONSENTIMIENTOS
// ==========================================
router.get('/', getConsentimientos);

// ==========================================
// OBTENER CONSENTIMIENTO POR ID
// ==========================================
router.get('/:id', getConsentimientoById);

// ==========================================
// CREAR NUEVO CONSENTIMIENTO INFORMADO
// ==========================================
router.post('/', createConsentimiento);

// ==========================================
// ACTUALIZAR CONSENTIMIENTO INFORMADO
// ==========================================
router.put('/:id', updateConsentimiento);

// ==========================================
// ELIMINAR CONSENTIMIENTO INFORMADO
// ==========================================
router.delete('/:id', deleteConsentimiento);

// ==========================================
// OBTENER CONSENTIMIENTOS POR EXPEDIENTE
// ==========================================
router.get('/expediente/:id_expediente', getConsentimientosByExpediente);

// ==========================================
// OBTENER ESTADÍSTICAS DE CONSENTIMIENTOS
// ==========================================
router.get('/estadisticas/consentimientos', getEstadisticasConsentimientos);

export default router;