// src/routes/auth/auth.routes.ts
import { Router } from "express";
import {
  login,
  verifyToken,
  logout,
  cambiarPassword
} from "../../controllers/auth/auth.controller";
import { authenticateToken } from "../../middlewares/auth.middleware"

const router = Router();

// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================

// POST /api/auth/login - Iniciar sesión
// Body: { usuario: string, password: string, tipoUsuario: 'medico' | 'administrador' }
router.post("/login", login);

// POST /api/auth/verify - Verificar token
// Headers: Authorization: Bearer <token>
router.post("/verify", verifyToken);

// POST /api/auth/logout - Cerrar sesión
router.post("/logout", logout);

// PUT /api/auth/change-password - Cambiar contraseña
// Headers: Authorization: Bearer <token>
// Body: { passwordActual: string, passwordNuevo: string }
router.put("/change-password", authenticateToken, cambiarPassword);

export default router;