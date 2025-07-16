// src/controllers/personas/administrador.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import bcrypt from 'bcrypt';
import pool from '../../config/database';

// ==========================================
// OBTENER TODOS LOS ADMINISTRADORES
// ==========================================
export const getAdministradores = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { activo, nivel_acceso, buscar } = req.query;
    
    let query = `
      SELECT 
        adm.id_administrador,
        adm.usuario,
        adm.nivel_acceso,
        adm.activo,
        adm.fecha_actualizacion,
        adm.ultimo_login,
        p.id_persona,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.correo_electronico,
        p.telefono,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        CASE 
          WHEN adm.nivel_acceso = 1 THEN 'Administrador'
          WHEN adm.nivel_acceso = 2 THEN 'Supervisor'
          WHEN adm.nivel_acceso = 3 THEN 'Usuario'
          ELSE 'Desconocido'
        END as nivel_acceso_texto
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    // Filtros
    if (activo !== undefined) {
      query += ` AND adm.activo = $${paramCounter}`;
      params.push(activo === 'true');
      paramCounter++;
    }
    
    if (nivel_acceso) {
      // Convertir texto a número
      let nivelNumero;
      switch (nivel_acceso) {
        case 'Administrador': nivelNumero = 1; break;
        case 'Supervisor': nivelNumero = 2; break;
        case 'Usuario': nivelNumero = 3; break;
        default: nivelNumero = null;
      }
      
      if (nivelNumero) {
        query += ` AND adm.nivel_acceso = $${paramCounter}`;
        params.push(nivelNumero);
        paramCounter++;
      }
    }
    
    if (buscar) {
      query += ` AND (
        UPPER(p.nombre) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_materno) LIKE UPPER($${paramCounter}) OR
        UPPER(adm.usuario) LIKE UPPER($${paramCounter})
      )`;
      params.push(`%${buscar}%`);
      paramCounter++;
    }
    
    query += ` ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC`;
    
    const response: QueryResult = await pool.query(query, params);
    
    // Mapear los resultados para el frontend
    const administradores = response.rows.map(row => ({
      id_administrador: row.id_administrador,
      id_persona: row.id_persona,
      usuario: row.usuario,
      nivel_acceso: row.nivel_acceso_texto, // Usar el texto convertido
      activo: row.activo,
      fecha_creacion: row.fecha_actualizacion, // Mapear para compatibilidad
      ultimo_acceso: row.ultimo_login, // Mapear para compatibilidad
      persona: {
        nombre: row.nombre,
        apellido_paterno: row.apellido_paterno,
        apellido_materno: row.apellido_materno,
        email: row.correo_electronico,
        telefono: row.telefono,
        genero: null, // No disponible en la consulta actual
        fecha_nacimiento: null // No disponible en la consulta actual
      }
    }));
    
    return res.status(200).json({
      success: true,
      message: 'Administradores obtenidos correctamente',
      data: administradores,
      total: response.rowCount,
      filtros_aplicados: {
        activo: activo || 'todos',
        nivel_acceso: nivel_acceso || 'todos',
        buscar: buscar || 'sin filtro'
      }
    });
  } catch (error) {
    console.error('Error al obtener administradores:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener administradores',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE ADMINISTRADORES
// ==========================================
export const getEstadisticasAdministradores = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Estadísticas generales
    const resumenQuery = `
      SELECT 
        COUNT(*) as total_administradores,
        COUNT(CASE WHEN activo = true THEN 1 END) as administradores_activos,
        COUNT(CASE WHEN activo = false THEN 1 END) as administradores_inactivos,
        COUNT(CASE WHEN nivel_acceso = 1 THEN 1 END) as nivel_administrador,
        COUNT(CASE WHEN nivel_acceso = 2 THEN 1 END) as nivel_supervisor,
        COUNT(CASE WHEN nivel_acceso = 3 THEN 1 END) as nivel_usuario,
        COUNT(CASE WHEN ultimo_login >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as activos_ultima_semana,
        COUNT(CASE WHEN fecha_actualizacion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as administradores_nuevos_mes
      FROM administrador
    `;
    
    const resumenResponse: QueryResult = await pool.query(resumenQuery);
    
    const resumen = resumenResponse.rows[0];
    
    return res.status(200).json({
      success: true,
      message: 'Estadísticas de administradores obtenidas correctamente',
      data: {
        total_administradores: parseInt(resumen.total_administradores),
        administradores_activos: parseInt(resumen.administradores_activos),
        administradores_inactivos: parseInt(resumen.administradores_inactivos),
        distribucion_nivel_acceso: {
          'Administrador': parseInt(resumen.nivel_administrador),
          'Supervisor': parseInt(resumen.nivel_supervisor),
          'Usuario': parseInt(resumen.nivel_usuario)
        },
        accesos_ultimo_mes: parseInt(resumen.activos_ultima_semana),
        administradores_nuevos_mes: parseInt(resumen.administradores_nuevos_mes),
        promedio_accesos_por_admin: 0,
        administradores_sin_acceso_30_dias: 0
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de administradores:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR NUEVO ADMINISTRADOR
// ==========================================
// export const createAdministrador = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const {
//       id_persona,
//       usuario,
//       password,
//       nivel_acceso = 'Usuario',
//       activo = true
//     } = req.body;

//     // Validaciones básicas
//     if (!id_persona) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID de persona es obligatorio'
//       });
//     }

//     if (!usuario || usuario.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'El nombre de usuario es obligatorio'
//       });
//     }

//     if (!password || password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: 'La contraseña debe tener al menos 6 caracteres'
//       });
//     }

//     // Convertir nivel de acceso a número
//     let nivelNumero;
//     switch (nivel_acceso) {
//       case 'Administrador': nivelNumero = 1; break;
//       case 'Supervisor': nivelNumero = 2; break;
//       case 'Usuario': nivelNumero = 3; break;
//       default: nivelNumero = 3; // Usuario por defecto
//     }

//     // Verificar que la persona existe
//     const personaExisteQuery = `
//       SELECT id_persona 
//       FROM persona 
//       WHERE id_persona = $1
//     `;
//     const personaExisteResponse: QueryResult = await pool.query(personaExisteQuery, [id_persona]);

//     if (personaExisteResponse.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'La persona especificada no existe'
//       });
//     }

//     // Verificar que la persona no tenga ya un registro de administrador
//     const yaExisteQuery = `
//       SELECT id_administrador 
//       FROM administrador 
//       WHERE id_persona = $1
//     `;
//     const yaExisteResponse: QueryResult = await pool.query(yaExisteQuery, [id_persona]);

//     if (yaExisteResponse.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: 'Esta persona ya tiene un registro como administrador'
//       });
//     }

//     // Verificar que no exista otro administrador con el mismo nombre de usuario
//     const usuarioExisteQuery = `
//       SELECT id_administrador 
//       FROM administrador 
//       WHERE usuario = $1
//     `;
//     const usuarioExisteResponse: QueryResult = await pool.query(usuarioExisteQuery, [usuario.trim()]);

//     if (usuarioExisteResponse.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: 'Ya existe un administrador con ese nombre de usuario'
//       });
//     }

//     // Encriptar contraseña
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insertar nuevo administrador
//     const insertQuery = `
//       INSERT INTO administrador (id_persona, usuario, contrasena, nivel_acceso, activo, password_texto, fecha_actualizacion)
//       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
//       RETURNING id_administrador, id_persona, usuario, nivel_acceso, activo, fecha_actualizacion
//     `;
//     const response: QueryResult = await pool.query(insertQuery, [
//       id_persona,
//       usuario.trim(),
//       hashedPassword,
//       nivelNumero,
//       activo,
//       password // Guardar texto plano para referencia (opcional)
//     ]);

//     const result = response.rows[0];
    
//     // Convertir nivel numérico a texto para la respuesta
//     const nivelTexto = result.nivel_acceso === 1 ? 'Administrador' : 
//                       result.nivel_acceso === 2 ? 'Supervisor' : 'Usuario';

//     return res.status(201).json({
//       success: true,
//       message: 'Administrador creado correctamente',
//       data: {
//         id_administrador: result.id_administrador,
//         id_persona: result.id_persona,
//         usuario: result.usuario,
//         nivel_acceso: nivelTexto,
//         activo: result.activo,
//         fecha_creacion: result.fecha_actualizacion
//       }
//     });
//   } catch (error) {
//     console.error('Error al crear administrador:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al crear administrador',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };

// En src/controllers/personas/administrador.controller.ts
// CAMBIAR createAdministrador

export const createAdministrador = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_persona,
      usuario,
      password, // 🔥 CAMBIO: Solo recibir password
      nivel_acceso = 'Usuario',
      activo = true
    } = req.body;

    // Validaciones básicas
    if (!id_persona) {
      return res.status(400).json({
        success: false,
        message: 'El ID de persona es obligatorio'
      });
    }

    if (!usuario || usuario.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario es obligatorio'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Convertir nivel de acceso a número
    let nivelNumero;
    switch (nivel_acceso) {
      case 'Administrador': nivelNumero = 1; break;
      case 'Supervisor': nivelNumero = 2; break;
      case 'Usuario': nivelNumero = 3; break;
      default: nivelNumero = 3;
    }

    // Verificar que la persona existe
    const personaExisteQuery = `
      SELECT id_persona 
      FROM persona 
      WHERE id_persona = $1
    `;
    const personaExisteResponse: QueryResult = await pool.query(personaExisteQuery, [id_persona]);

    if (personaExisteResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'La persona especificada no existe'
      });
    }

    // Verificar que la persona no tenga ya un registro de administrador
    const yaExisteQuery = `
      SELECT id_administrador 
      FROM administrador 
      WHERE id_persona = $1
    `;
    const yaExisteResponse: QueryResult = await pool.query(yaExisteQuery, [id_persona]);

    if (yaExisteResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Esta persona ya tiene un registro como administrador'
      });
    }

    // Verificar que no exista otro administrador con el mismo nombre de usuario
    const usuarioExisteQuery = `
      SELECT id_administrador 
      FROM administrador 
      WHERE usuario = $1
    `;
    const usuarioExisteResponse: QueryResult = await pool.query(usuarioExisteQuery, [usuario.trim()]);

    if (usuarioExisteResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un administrador con ese nombre de usuario'
      });
    }

    // 🔥 CAMBIO: Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 🔥 CAMBIO: Insertar con ambos campos
    const insertQuery = `
      INSERT INTO administrador (id_persona, usuario, contrasena, nivel_acceso, activo, password_texto, fecha_actualizacion)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING id_administrador, id_persona, usuario, nivel_acceso, activo, fecha_actualizacion
    `;
    const response: QueryResult = await pool.query(insertQuery, [
      id_persona,
      usuario.trim(),
      hashedPassword,    // 🔥 Hash para contrasena
      nivelNumero,
      activo,
      password          // 🔥 Texto plano para password_texto
    ]);

    const result = response.rows[0];
    
    // Convertir nivel numérico a texto para la respuesta
    const nivelTexto = result.nivel_acceso === 1 ? 'Administrador' : 
                      result.nivel_acceso === 2 ? 'Supervisor' : 'Usuario';

    return res.status(201).json({
      success: true,
      message: 'Administrador creado correctamente',
      data: {
        id_administrador: result.id_administrador,
        id_persona: result.id_persona,
        usuario: result.usuario,
        nivel_acceso: nivelTexto,
        activo: result.activo,
        fecha_creacion: result.fecha_actualizacion
      }
    });
  } catch (error) {
    console.error('Error al crear administrador:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear administrador',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR ADMINISTRADOR
// ==========================================
export const updateAdministrador = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {
      usuario,
      nivel_acceso,
      activo
    } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Validaciones básicas
    if (!usuario || usuario.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario es obligatorio'
      });
    }
    
    // Convertir nivel de acceso a número
    let nivelNumero;
    switch (nivel_acceso) {
      case 'Administrador': nivelNumero = 1; break;
      case 'Supervisor': nivelNumero = 2; break;
      case 'Usuario': nivelNumero = 3; break;
      default: nivelNumero = 3;
    }
    
    // Verificar que el administrador existe
    const existeQuery = `
      SELECT id_administrador 
      FROM administrador 
      WHERE id_administrador = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }
    
    // Verificar que no exista otro administrador con el mismo nombre de usuario
    const duplicadoQuery = `
      SELECT id_administrador 
      FROM administrador 
      WHERE usuario = $1 AND id_administrador != $2
    `;
    
    const duplicadoResponse: QueryResult = await pool.query(duplicadoQuery, [usuario.trim(), id]);
    
    if (duplicadoResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe otro administrador con ese nombre de usuario'
      });
    }
    
    // Actualizar administrador
    const updateQuery = `
      UPDATE administrador 
      SET 
        usuario = $1,
        nivel_acceso = $2,
        activo = $3,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_administrador = $4
      RETURNING id_administrador, id_persona, usuario, nivel_acceso, activo, fecha_actualizacion
    `;
    
    const response: QueryResult = await pool.query(updateQuery, [
      usuario.trim(),
      nivelNumero,
      activo,
      id
    ]);
    
    const result = response.rows[0];
    const nivelTexto = result.nivel_acceso === 1 ? 'Administrador' : 
                      result.nivel_acceso === 2 ? 'Supervisor' : 'Usuario';
    
    return res.status(200).json({
      success: true,
      message: 'Administrador actualizado correctamente',
      data: {
        id_administrador: result.id_administrador,
        id_persona: result.id_persona,
        usuario: result.usuario,
        nivel_acceso: nivelTexto,
        activo: result.activo,
        fecha_creacion: result.fecha_actualizacion,
        ultimo_acceso: null
      }
    });
  } catch (error) {
    console.error('Error al actualizar administrador:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar administrador',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CAMBIAR CONTRASEÑA
// ==========================================
// export const cambiarPassword = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const { password_actual, password_nuevo } = req.body;
    
//     if (!id || isNaN(parseInt(id))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID debe ser un número válido'
//       });
//     }
    
//     if (!password_actual || !password_nuevo) {
//       return res.status(400).json({
//         success: false,
//         message: 'La contraseña actual y nueva son obligatorias'
//       });
//     }
    
//     if (password_nuevo.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: 'La nueva contraseña debe tener al menos 6 caracteres'
//       });
//     }
    
//     // Obtener la contraseña actual del administrador
//     const adminQuery = `
//       SELECT contrasena 
//       FROM administrador 
//       WHERE id_administrador = $1 AND activo = true
//     `;
    
//     const adminResponse: QueryResult = await pool.query(adminQuery, [id]);
    
//     if (adminResponse.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Administrador no encontrado o inactivo'
//       });
//     }
    
//     // Verificar contraseña actual
//     const passwordMatch = await bcrypt.compare(password_actual, adminResponse.rows[0].contrasena);
    
//     if (!passwordMatch) {
//       return res.status(400).json({
//         success: false,
//         message: 'La contraseña actual es incorrecta'
//       });
//     }
    
//     // Encriptar nueva contraseña
//     const saltRounds = 10;
//     const hashedNewPassword = await bcrypt.hash(password_nuevo, saltRounds);
    
//     // Actualizar contraseña
//     const updateQuery = `
//       UPDATE administrador 
//       SET contrasena = $1, password_texto = $2, fecha_actualizacion = CURRENT_TIMESTAMP
//       WHERE id_administrador = $3
//       RETURNING id_administrador, usuario
//     `;
    
//     const response: QueryResult = await pool.query(updateQuery, [hashedNewPassword, password_nuevo, id]);
    
//     return res.status(200).json({
//       success: true,
//       message: 'Contraseña actualizada correctamente',
//       data: { id_administrador: response.rows[0].id_administrador, usuario: response.rows[0].usuario }
//     });
//   } catch (error) {
//     console.error('Error al cambiar contraseña:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al cambiar contraseña',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };
// En src/controllers/personas/administrador.controller.ts
// CAMBIAR cambiarPassword

export const cambiarPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { password_actual, password_nuevo } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    if (!password_actual || !password_nuevo) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual y nueva son obligatorias'
      });
    }
    
    if (password_nuevo.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }
    
    // 🔥 CAMBIO: Obtener la contraseña hasheada
    const adminQuery = `
      SELECT contrasena 
      FROM administrador 
      WHERE id_administrador = $1 AND activo = true
    `;
    
    const adminResponse: QueryResult = await pool.query(adminQuery, [id]);
    
    if (adminResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado o inactivo'
      });
    }
    
    // 🔥 CAMBIO: Verificar contraseña actual con hash
    const passwordMatch = await bcrypt.compare(password_actual, adminResponse.rows[0].contrasena);
    
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }
    
    // 🔥 CAMBIO: Encriptar nueva contraseña
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(password_nuevo, saltRounds);
    
    // 🔥 CAMBIO: Actualizar ambos campos
    const updateQuery = `
      UPDATE administrador 
      SET contrasena = $1, password_texto = $2, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_administrador = $3
      RETURNING id_administrador, usuario
    `;
    
    const response: QueryResult = await pool.query(updateQuery, [
      hashedNewPassword,  // 🔥 Hash para contrasena
      password_nuevo,     // 🔥 Texto plano para password_texto
      id
    ]);
    
    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente',
      data: { 
        id_administrador: response.rows[0].id_administrador, 
        usuario: response.rows[0].usuario 
      }
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al cambiar contraseña',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTIVAR/DESACTIVAR ADMINISTRADOR
// ==========================================
export const toggleAdministrador = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Obtener estado actual
    const estadoQuery = `
      SELECT adm.id_administrador, adm.activo, adm.usuario,
             p.nombre, p.apellido_paterno, p.apellido_materno
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE adm.id_administrador = $1
    `;
    const estadoResponse: QueryResult = await pool.query(estadoQuery, [id]);
    
    if (estadoResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }
    
    const admin = estadoResponse.rows[0];
    const nuevoEstado = !admin.activo;
    
    // Actualizar estado
    const updateQuery = `
      UPDATE administrador 
      SET 
        activo = $1,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_administrador = $2
      RETURNING id_administrador, activo
    `;
    const response: QueryResult = await pool.query(updateQuery, [nuevoEstado, id]);
    
    const nombreCompleto = `${admin.nombre} ${admin.apellido_paterno} ${admin.apellido_materno}`;
    const accion = nuevoEstado ? 'activado' : 'desactivado';
    
    return res.status(200).json({
      success: true,
      message: `Administrador "${nombreCompleto}" ${accion} correctamente`,
      data: {
        id_administrador: response.rows[0].id_administrador,
        activo: response.rows[0].activo,
        usuario: admin.usuario,
        nombre_completo: nombreCompleto
      }
    });
  } catch (error) {
    console.error('Error al cambiar estado del administrador:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al cambiar estado del administrador',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// ==========================================
// ELIMINAR ADMINISTRADOR
// ==========================================
export const deleteAdministrador = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar si el administrador existe
    const existeQuery = `
      SELECT adm.id_administrador, adm.activo, p.nombre, p.apellido_paterno, p.apellido_materno
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE adm.id_administrador = $1
    `;
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }
    
    const nombreCompleto = `${existeResponse.rows[0].nombre} ${existeResponse.rows[0].apellido_paterno} ${existeResponse.rows[0].apellido_materno}`;
    
    // Soft delete - marcar como inactivo
    const softDeleteQuery = `
      UPDATE administrador 
      SET 
        activo = false,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_administrador = $1
      RETURNING id_administrador
    `;
    await pool.query(softDeleteQuery, [id]);
    
    return res.status(200).json({
      success: true,
      message: `Administrador "${nombreCompleto}" desactivado correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar administrador:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar administrador',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// ==========================================
// OBTENER ADMINISTRADORES ACTIVOS
// ==========================================
export const getAdministradoresActivos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nivel_acceso } = req.query;
    
    let query = `
      SELECT 
        adm.id_administrador,
        adm.usuario,
        adm.nivel_acceso,
        CASE 
          WHEN adm.nivel_acceso = 1 THEN 'Administrador'
          WHEN adm.nivel_acceso = 2 THEN 'Supervisor'
          WHEN adm.nivel_acceso = 3 THEN 'Usuario'
          ELSE 'Desconocido'
        END as nivel_acceso_texto,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE adm.activo = true
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    if (nivel_acceso) {
      let nivelNumero;
      switch (nivel_acceso) {
        case 'Administrador': nivelNumero = 1; break;
        case 'Supervisor': nivelNumero = 2; break;
        case 'Usuario': nivelNumero = 3; break;
        default: nivelNumero = null;
      }
      
      if (nivelNumero) {
        query += ` AND adm.nivel_acceso = $${paramCounter}`;
        params.push(nivelNumero);
        paramCounter++;
      }
    }
    
    query += ` ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC`;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Administradores activos obtenidos correctamente',
      data: response.rows.map(row => ({
        id_administrador: row.id_administrador,
        usuario: row.usuario,
        nivel_acceso: row.nivel_acceso_texto,
        nombre_completo: row.nombre_completo
      })),
      total: response.rowCount
    });
  } catch (error) {
    console.error('Error al obtener administradores activos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener administradores activos',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ADMINISTRADOR POR ID
// ==========================================
export const getAdministradorById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    const query = `
      SELECT 
        adm.id_administrador,
        adm.usuario,
        adm.nivel_acceso,
        adm.activo,
        adm.fecha_actualizacion,
        adm.ultimo_login,
        p.id_persona,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.correo_electronico,
        p.telefono,
        p.domicilio,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        CASE 
          WHEN adm.nivel_acceso = 1 THEN 'Administrador'
          WHEN adm.nivel_acceso = 2 THEN 'Supervisor'
          WHEN adm.nivel_acceso = 3 THEN 'Usuario'
          ELSE 'Desconocido'
        END as nivel_acceso_texto
      FROM administrador adm
      JOIN persona p ON adm.id_persona = p.id_persona
      WHERE adm.id_administrador = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    const adminData = response.rows[0];
    
    // Mapear datos para compatibilidad con frontend
    const mappedData = {
      id_administrador: adminData.id_administrador,
      id_persona: adminData.id_persona,
      usuario: adminData.usuario,
      nivel_acceso: adminData.nivel_acceso_texto,
      activo: adminData.activo,
      fecha_creacion: adminData.fecha_actualizacion,
      ultimo_acceso: adminData.ultimo_login,
      persona: {
        nombre: adminData.nombre,
        apellido_paterno: adminData.apellido_paterno,
        apellido_materno: adminData.apellido_materno,
        email: adminData.correo_electronico,
        telefono: adminData.telefono,
        genero: null,
        fecha_nacimiento: null
      }
    };

    return res.status(200).json({
      success: true,
      message: 'Administrador encontrado correctamente',
      data: mappedData
    });
  } catch (error) {
    console.error('Error al obtener administrador por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener administrador',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// VALIDAR CREDENCIALES (LOGIN)
// ==========================================
export const validarCredenciales = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { usuario, password } = req.body;
    
    if (!usuario || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son obligatorios'
      });
    }
    
    // Buscar administrador por usuario
    const adminQuery = `
      SELECT 
        adm.id_administrador,
        adm.id_persona,
        adm.usuario,
        adm.contrasena,
        adm.nivel_acceso,
        adm.activo,
        adm.ultimo_login,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.correo_electronico,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
       CASE 
         WHEN adm.nivel_acceso = 1 THEN 'Administrador'
         WHEN adm.nivel_acceso = 2 THEN 'Supervisor'
         WHEN adm.nivel_acceso = 3 THEN 'Usuario'
         ELSE 'Desconocido'
       END as nivel_acceso_texto
     FROM administrador adm
     JOIN persona p ON adm.id_persona = p.id_persona
     WHERE UPPER(adm.usuario) = UPPER($1) AND p.activo = true
   `;
   const adminResponse: QueryResult = await pool.query(adminQuery, [usuario.trim()]);
   
   if (adminResponse.rows.length === 0) {
     return res.status(401).json({
       success: false,
       message: 'Credenciales inválidas'
     });
   }
   
   const admin = adminResponse.rows[0];
   
   // Verificar si el administrador está activo
   if (!admin.activo) {
     return res.status(401).json({
       success: false,
       message: 'Cuenta desactivada. Contacte al administrador del sistema'
     });
   }
   
   // Verificar contraseña
   const passwordMatch = await bcrypt.compare(password, admin.contrasena);
   
   if (!passwordMatch) {
     return res.status(401).json({
       success: false,
       message: 'Credenciales inválidas'
     });
   }
   
   // Actualizar último acceso
   const updateUltimoAccesoQuery = `
     UPDATE administrador 
     SET ultimo_login = CURRENT_TIMESTAMP, fecha_actualizacion = CURRENT_TIMESTAMP
     WHERE id_administrador = $1
   `;
   await pool.query(updateUltimoAccesoQuery, [admin.id_administrador]);
   
   // Respuesta exitosa (sin incluir password)
   const { contrasena: _, ...adminData } = admin;
   
   // Mapear datos para compatibilidad con frontend
   const mappedData = {
     id_administrador: adminData.id_administrador,
     id_persona: adminData.id_persona,
     usuario: adminData.usuario,
     nivel_acceso: adminData.nivel_acceso_texto,
     activo: adminData.activo,
     ultimo_acceso: adminData.ultimo_login,
     nombre: adminData.nombre,
     apellido_paterno: adminData.apellido_paterno,
     apellido_materno: adminData.apellido_materno,
     correo_electronico: adminData.correo_electronico,
     nombre_completo: adminData.nombre_completo
   };
   
   return res.status(200).json({
     success: true,
     message: 'Credenciales válidas',
     data: mappedData
   });
 } catch (error) {
   console.error('Error al validar credenciales:', error);
   return res.status(500).json({
     success: false,
     message: 'Error interno del servidor al validar credenciales',
     error: process.env.NODE_ENV === 'development' ? error : undefined
   });
 }
};

// ==========================================
// RESTABLECER CONTRASEÑA (ADMIN)
// ==========================================
export const restablecerPassword = async (req: Request, res: Response): Promise<Response> => {
 const client = await pool.connect();
 
 try {
   await client.query('BEGIN');
   
   const { id } = req.params;
   const { nueva_password } = req.body;
   
   if (!id || isNaN(parseInt(id))) {
     return res.status(400).json({
       success: false,
       message: 'El ID debe ser un número válido'
     });
   }
   
   if (!nueva_password || nueva_password.length < 8) {
     return res.status(400).json({
       success: false,
       message: 'La nueva contraseña debe tener al menos 8 caracteres'
     });
   }
   
   // Verificar que el administrador existe
   const adminQuery = `
     SELECT adm.id_administrador, adm.usuario, 
            p.nombre, p.apellido_paterno, p.apellido_materno
     FROM administrador adm
     JOIN persona p ON adm.id_persona = p.id_persona
     WHERE adm.id_administrador = $1
   `;
   const adminResponse: QueryResult = await client.query(adminQuery, [id]);
   
   if (adminResponse.rows.length === 0) {
     await client.query('ROLLBACK');
     return res.status(404).json({
       success: false,
       message: 'Administrador no encontrado'
     });
   }
   
   // Encriptar nueva contraseña
   const saltRounds = 12;
   const hashedPassword = await bcrypt.hash(nueva_password, saltRounds);
   
   // Actualizar contraseña
   const updateQuery = `
     UPDATE administrador 
     SET 
       contrasena = $1,
       password_texto = $2,
       fecha_actualizacion = CURRENT_TIMESTAMP
     WHERE id_administrador = $3
     RETURNING id_administrador, usuario
   `;
   const response: QueryResult = await client.query(updateQuery, [hashedPassword, nueva_password, id]);
   
   await client.query('COMMIT');
   
   const admin = adminResponse.rows[0];
   const nombreCompleto = `${admin.nombre} ${admin.apellido_paterno} ${admin.apellido_materno}`;
   
   return res.status(200).json({
     success: true,
     message: `Contraseña restablecida correctamente para "${nombreCompleto}"`,
     data: {
       id_administrador: response.rows[0].id_administrador,
       usuario: response.rows[0].usuario
     }
   });
 } catch (error) {
   await client.query('ROLLBACK');
   console.error('Error al restablecer contraseña:', error);
   return res.status(500).json({
     success: false,
     message: 'Error interno del servidor al restablecer contraseña',
     error: process.env.NODE_ENV === 'development' ? error : undefined
   });
 } finally {
   client.release();
 }
};