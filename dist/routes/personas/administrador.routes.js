"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/personas/administrador.routes.ts
const express_1 = require("express");
const administrador_controller_1 = require("../../controllers/personas/administrador.controller");
const router = (0, express_1.Router)();
// ==========================================
// RUTAS PARA ADMINISTRADORES
// ==========================================
// Rutas especiales - DEBEN IR ANTES que las rutas con parámetros /:id
// GET /api/personas/administradores/estadisticas - Obtener estadísticas del sistema
router.get("/estadisticas", administrador_controller_1.getEstadisticasAdministradores);
// GET /api/personas/administradores/activos - Obtener solo administradores activos (para selects)
// Query params: ?nivel_acceso=Administrador|Supervisor|Usuario
router.get("/activos", administrador_controller_1.getAdministradoresActivos);
// POST /api/personas/administradores/login - Validar credenciales para login
// Body: { usuario: string, password: string }
router.post("/login", administrador_controller_1.validarCredenciales);
// Rutas CRUD principales
// GET /api/personas/administradores - Obtener todos los administradores con filtros y paginación
// Query params: ?activo=true&nivel_acceso=Supervisor&buscar=juan&page=1&limit=10
router.get("/", administrador_controller_1.getAdministradores);
// GET /api/personas/administradores/:id - Obtener administrador por ID con detalles completos
router.get("/:id", administrador_controller_1.getAdministradorById);
// POST /api/personas/administradores - Crear nuevo administrador
// Body: { id_persona: number, usuario: string, password: string, nivel_acceso?: string, activo?: boolean }
router.post("/", administrador_controller_1.createAdministrador);
// PUT /api/personas/administradores/:id - Actualizar datos básicos del administrador
// Body: { usuario: string, nivel_acceso?: string, activo?: boolean }
router.put("/:id", administrador_controller_1.updateAdministrador);
// Rutas específicas para acciones especiales
// PUT /api/personas/administradores/:id/password - Cambiar contraseña (usuario autenticado)
// Body: { password_actual: string, password_nuevo: string }
router.put("/:id/password", administrador_controller_1.cambiarPassword);
// PUT /api/personas/administradores/:id/restablecer-password - Restablecer contraseña (admin)
// Body: { nueva_password: string }
router.put("/:id/restablecer-password", administrador_controller_1.restablecerPassword);
// PATCH /api/personas/administradores/:id/toggle - Activar/Desactivar administrador
router.patch("/:id/toggle", administrador_controller_1.toggleAdministrador);
// DELETE /api/personas/administradores/:id - Eliminar administrador (soft delete por defecto)
// Query params: ?force=true (para eliminación física)
router.delete("/:id", administrador_controller_1.deleteAdministrador);
exports.default = router;
