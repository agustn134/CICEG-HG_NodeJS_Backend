// src/controllers/auth/password-reset.controller.ts
import { Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import pool from '../../config/database';
import emailService from '../../services/email.service';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

/**
 * Solicitar recuperación de contraseña
 */
export const requestPasswordReset = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, tipoUsuario } = req.body;

    console.log('🔍 Solicitud de recuperación:', { email, tipoUsuario });

    // Validar datos de entrada
    if (!email || !tipoUsuario) {
      return res.status(400).json({
        success: false,
        message: 'Email y tipo de usuario son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Buscar usuario según el tipo
    let userQuery: string;
    let userParams: any[];

    switch (tipoUsuario) {
      case 'medico':
        userQuery = `
          SELECT 
            m.id_personal_medico as id_usuario,
            p.correo_electronico as email,
            p.nombre || ' ' || p.apellido_paterno as nombre_completo,
            m.usuario,
            m.password_texto
          FROM personal_medico m
          INNER JOIN persona p ON m.id_persona = p.id_persona
          WHERE p.correo_electronico = $1 AND m.activo = true
        `;
        userParams = [email.toLowerCase().trim()];
        break;

      case 'administrador':
        userQuery = `
          SELECT 
            a.id_administrador as id_usuario,
            p.correo_electronico as email,
            p.nombre || ' ' || p.apellido_paterno as nombre_completo,
            a.usuario,
            a.password_texto
          FROM administrador a
          INNER JOIN persona p ON a.id_persona = p.id_persona
          WHERE p.correo_electronico = $1 AND a.activo = true
        `;
        userParams = [email.toLowerCase().trim()];
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuario no válido'
        });
    }

    const userResult: QueryResult = await pool.query(userQuery, userParams);

    if (userResult.rows.length === 0) {
      // Por seguridad, no revelar si el email existe o no
      return res.status(200).json({
        success: true,
        message: 'Si el correo está registrado, recibirá un enlace de recuperación'
      });
    }

    const user = userResult.rows[0];
    console.log('✅ Usuario encontrado:', user.nombre_completo);

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Primero desactivar tokens anteriores para este email
    const deactivateOldTokensQuery = `
      UPDATE password_reset_tokens 
      SET is_active = false, invalidated_reason = 'Nuevo token solicitado'
      WHERE email = $1 AND is_active = true
    `;
    await pool.query(deactivateOldTokensQuery, [email.toLowerCase().trim()]);

    // Luego insertar el nuevo token (sin ON CONFLICT)
    const saveTokenQuery = `
      INSERT INTO password_reset_tokens 
      (email, token, tipo_usuario, id_usuario_referencia, expires_at, created_at, ip_solicitud, is_active)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, true)
    `;

    await pool.query(saveTokenQuery, [
      email.toLowerCase().trim(),
      resetToken,
      tipoUsuario,
      user.id_usuario,
      resetTokenExpiry,
      req.ip || '0.0.0.0'
    ]);

    console.log('✅ Token guardado en BD');

    // Enviar correo
    const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Error al enviar el correo de recuperación'
      });
    }

    console.log('✅ Correo enviado exitosamente');

    return res.status(200).json({
      success: true,
      message: 'Se ha enviado un enlace de recuperación a su correo electrónico'
    });

  } catch (error) {
    console.error('❌ Error en solicitud de recuperación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Validar token de recuperación
 */
export const validateResetToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token requerido'
      });
    }

    // Verificar token en la base de datos
    const tokenQuery = `
      SELECT email, tipo_usuario, expires_at, id_usuario_referencia
      FROM password_reset_tokens
      WHERE token = $1 AND expires_at > NOW() AND is_active = true
    `;

    const tokenResult: QueryResult = await pool.query(tokenQuery, [token]);

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Token válido',
      data: {
        email: tokenResult.rows[0].email,
        tipoUsuario: tokenResult.rows[0].tipo_usuario
      }
    });

  } catch (error) {
    console.error('❌ Error validando token:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Restablecer contraseña
 */
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, newPassword } = req.body;

    console.log('🔄 Restableciendo contraseña...');

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token y nueva contraseña son requeridos'
      });
    }

    // Validar longitud de contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar token
    const tokenQuery = `
      SELECT email, tipo_usuario, expires_at, id_usuario_referencia
      FROM password_reset_tokens
      WHERE token = $1 AND expires_at > NOW() AND is_active = true
    `;

    const tokenResult: QueryResult = await pool.query(tokenQuery, [token]);

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    const { email, tipo_usuario, id_usuario_referencia } = tokenResult.rows[0];

    // Actualizar contraseña según el tipo de usuario
    let updateQuery: string;
    let updateParams: any[];

    switch (tipo_usuario) {
      case 'medico':
        updateQuery = `
          UPDATE personal_medico 
          SET password_texto = $1, fecha_actualizacion = CURRENT_TIMESTAMP
          WHERE id_personal_medico = $2
        `;
        updateParams = [newPassword, id_usuario_referencia];
        break;

      case 'administrador':
        updateQuery = `
          UPDATE administrador 
          SET password_texto = $1, fecha_actualizacion = CURRENT_TIMESTAMP
          WHERE id_administrador = $2
        `;
        updateParams = [newPassword, id_usuario_referencia];
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuario no válido'
        });
    }

    await pool.query(updateQuery, updateParams);

    // Marcar token como usado
    await pool.query(
      'UPDATE password_reset_tokens SET is_active = false, used_at = NOW(), invalidated_reason = $1 WHERE token = $2', 
      ['Contraseña cambiada exitosamente', token]
    );

    console.log('✅ Contraseña restablecida exitosamente para:', email);

    return res.status(200).json({
      success: true,
      message: 'Contraseña restablecida exitosamente'
    });

  } catch (error) {
    console.error('❌ Error restableciendo contraseña:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};