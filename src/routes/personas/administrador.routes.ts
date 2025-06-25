// src/routes/personas/administrador.routes.ts
import { Router } from "express";
import {
  getAdministradores,
  getAdministradorById,
  createAdministrador,
  updateAdministrador,
  cambiarPassword,
  deleteAdministrador,
  getAdministradoresActivos,
  getEstadisticasAdministradores,
  toggleAdministrador,
  restablecerPassword,
  validarCredenciales,
} from "../../controllers/personas/administrador.controller";

const router = Router();

// ==========================================
// RUTAS PARA ADMINISTRADORES
// ==========================================

// Rutas especiales - DEBEN IR ANTES que las rutas con parámetros /:id
// GET /api/personas/administradores/estadisticas - Obtener estadísticas del sistema
router.get("/estadisticas", getEstadisticasAdministradores);

// GET /api/personas/administradores/activos - Obtener solo administradores activos (para selects)
// Query params: ?nivel_acceso=Administrador|Supervisor|Usuario
router.get("/activos", getAdministradoresActivos);

// POST /api/personas/administradores/login - Validar credenciales para login
// Body: { usuario: string, password: string }
router.post("/login", validarCredenciales);

// Rutas CRUD principales
// GET /api/personas/administradores - Obtener todos los administradores con filtros y paginación
// Query params: ?activo=true&nivel_acceso=Supervisor&buscar=juan&page=1&limit=10
router.get("/", getAdministradores);

// GET /api/personas/administradores/:id - Obtener administrador por ID con detalles completos
router.get("/:id", getAdministradorById);

// POST /api/personas/administradores - Crear nuevo administrador
// Body: { id_persona: number, usuario: string, password: string, nivel_acceso?: string, activo?: boolean }
router.post("/", createAdministrador);

// PUT /api/personas/administradores/:id - Actualizar datos básicos del administrador
// Body: { usuario: string, nivel_acceso?: string, activo?: boolean }
router.put("/:id", updateAdministrador);

// Rutas específicas para acciones especiales
// PUT /api/personas/administradores/:id/password - Cambiar contraseña (usuario autenticado)
// Body: { password_actual: string, password_nuevo: string }
router.put("/:id/password", cambiarPassword);

// PUT /api/personas/administradores/:id/restablecer-password - Restablecer contraseña (admin)
// Body: { nueva_password: string }
router.put("/:id/restablecer-password", restablecerPassword);

// PATCH /api/personas/administradores/:id/toggle - Activar/Desactivar administrador
router.patch("/:id/toggle", toggleAdministrador);

// DELETE /api/personas/administradores/:id - Eliminar administrador (soft delete por defecto)
// Query params: ?force=true (para eliminación física)
router.delete("/:id", deleteAdministrador);

export default router;