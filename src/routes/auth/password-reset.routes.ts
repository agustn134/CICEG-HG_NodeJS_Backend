// src/routes/auth/password-reset.routes.ts
import { Router } from 'express';
import passwordResetController from '../../controllers/auth/password-reset.controller';

const router = Router();

// Solicitar recuperación de contraseña
router.post('/request', passwordResetController.requestPasswordReset);

// Validar token de recuperación
router.get('/validate/:token', passwordResetController.validateResetToken);

// Restablecer contraseña
router.post('/reset', passwordResetController.resetPassword);

export default router;