"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/password-reset.routes.ts
const express_1 = require("express");
const password_reset_controller_1 = require("../../controllers/auth/password-reset.controller");
const router = (0, express_1.Router)();
// Solicitar recuperación de contraseña
router.post('/request', password_reset_controller_1.requestPasswordReset);
// Validar token de recuperación
router.get('/validate/:token', password_reset_controller_1.validateResetToken);
// Restablecer contraseña
router.post('/reset', password_reset_controller_1.resetPassword);
exports.default = router;
