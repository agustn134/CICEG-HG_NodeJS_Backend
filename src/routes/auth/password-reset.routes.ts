// src/routes/auth/password-reset.routes.ts
import { Router } from 'express';
import { 
  requestPasswordReset, 
  validateResetToken, 
  resetPassword 
} from '../../controllers/auth/password-reset.controller';

const router = Router();

// Solicitar recuperación de contraseña
router.post('/request', requestPasswordReset);

// Validar token de recuperación
router.get('/validate/:token', validateResetToken);

// Restablecer contraseña
router.post('/reset', resetPassword);

export default router;