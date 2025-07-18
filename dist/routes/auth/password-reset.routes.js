"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/password-reset.routes.ts
const express_1 = require("express");
const password_reset_controller_1 = __importDefault(require("../../controllers/auth/password-reset.controller"));
const router = (0, express_1.Router)();
// Solicitar recuperación de contraseña
router.post('/request', password_reset_controller_1.default.requestPasswordReset);
// Validar token de recuperación
router.get('/validate/:token', password_reset_controller_1.default.validateResetToken);
// Restablecer contraseña
router.post('/reset', password_reset_controller_1.default.resetPassword);
exports.default = router;
