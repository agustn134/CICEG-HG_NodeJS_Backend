"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth/auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================
// POST /api/auth/login - Iniciar sesión
// Body: { usuario: string, password: string, tipoUsuario: 'medico' | 'administrador' }
router.post("/login", auth_controller_1.login);
// POST /api/auth/verify - Verificar token
// Headers: Authorization: Bearer <token>
router.post("/verify", auth_controller_1.verifyToken);
// POST /api/auth/logout - Cerrar sesión
router.post("/logout", auth_controller_1.logout);
// PUT /api/auth/change-password - Cambiar contraseña
// Headers: Authorization: Bearer <token>
// Body: { passwordActual: string, passwordNuevo: string }
router.put("/change-password", auth_middleware_1.authenticateToken, auth_controller_1.cambiarPassword);
exports.default = router;
