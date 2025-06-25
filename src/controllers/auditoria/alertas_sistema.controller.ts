// import { Request, Response } from 'express';
// import { QueryResult } from 'pg';
// import pool from '../../config/database';
















// import { Request, Response } from 'express';
// import { QueryResult } from 'pg';
// import pool from '../../config/database';

// export const get = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const response: QueryResult = await pool.query("");
//     return res.status(200).json(response.rows);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al obtener estudios médicos");
//   }
// };

// export const getEstudioMedicoById = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const id = req.params.id;
//     const response: QueryResult = await pool.query("SELECT * FROM estudio_medico WHERE id_estudio = $1", [id]);
//     if (response.rows.length === 0) {
//       return res.status(404).send("Estudio médico no encontrado");
//     }
//     return res.status(200).json(response.rows[0]);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al obtener estudio médico por ID");
//   }
// };

// export const createEstudioMedico = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo } = req.body;
//     const response: QueryResult = await pool.query(
//       "INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
//       [clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo]
//     );
//     return res.status(201).json(response.rows[0]);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al crear estudio médico");
//   }
// };

// export const updateEstudioMedico = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const id = req.params.id;
//     const { clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo } = req.body;
//     const response: QueryResult = await pool.query(
//       "UPDATE estudio_medico SET clave = $1, nombre = $2, tipo = $3, descripcion = $4, requiere_ayuno = $5, tiempo_resultado = $6, activo = $7 WHERE id_estudio = $8 RETURNING *",
//       [clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo, id]
//     );
//     if (response.rows.length === 0) {
//       return res.status(404).send("Estudio médico no encontrado");
//     }
//     return res.status(200).json(response.rows[0]);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al actualizar estudio médico");
//   }
// };

// export const deleteEstudioMedico = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const id = req.params.id;
//     const response: QueryResult = await pool.query("DELETE FROM estudio_medico WHERE id_estudio = $1", [id]);
//     if (response.rowCount === 0) {
//       return res.status(404).send("Estudio médico no encontrado");
//     }
//     return res.status(200).send("Estudio médico eliminado correctamente");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al eliminar estudio médico");
//   }
// };





// src/controllers/auditoria/alertas_sistema.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// OBTENER TODAS LAS ALERTAS DEL SISTEMA
// ==========================================
export const getAlertasSistema = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tipo, activa, fecha_desde, fecha_hasta, prioridad } = req.query;
    
    let query = `
      SELECT 
        als.id_alerta,
        als.tipo_alerta,
        als.mensaje,
        als.descripcion,
        als.prioridad,
        als.fecha_generada,
        als.activa,
        als.usuario_responsable,
        als.fecha_resuelta,
        als.observaciones_resolucion,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_responsable
      FROM alertas_sistema als
      LEFT JOIN administrador a ON als.usuario_responsable = a.id_administrador
      LEFT JOIN persona p ON a.id_persona = p.id_persona
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    // Filtros
    if (tipo) {
      query += ` AND als.tipo_alerta = $${paramCounter}`;
      params.push(tipo);
      paramCounter++;
    }
    
    if (activa !== undefined) {
      query += ` AND als.activa = $${paramCounter}`;
      params.push(activa === 'true');
      paramCounter++;
    }
    
    if (prioridad) {
      query += ` AND als.prioridad = $${paramCounter}`;
      params.push(prioridad);
      paramCounter++;
    }
    
    if (fecha_desde) {
      query += ` AND als.fecha_generada >= $${paramCounter}`;
      params.push(fecha_desde);
      paramCounter++;
    }
    
    if (fecha_hasta) {
      query += ` AND als.fecha_generada <= $${paramCounter}`;
      params.push(fecha_hasta);
      paramCounter++;
    }
    
    query += `
      ORDER BY 
        CASE als.prioridad 
          WHEN 'Crítica' THEN 1 
          WHEN 'Alta' THEN 2 
          WHEN 'Media' THEN 3 
          WHEN 'Baja' THEN 4 
        END ASC,
        als.fecha_generada DESC
    `;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Alertas del sistema obtenidas correctamente',
      data: response.rows,
      total: response.rowCount,
      filtros_aplicados: {
        tipo: tipo || 'todos',
        activa: activa || 'todas',
        prioridad: prioridad || 'todas',
        fecha_desde: fecha_desde || null,
        fecha_hasta: fecha_hasta || null
      }
    });
  } catch (error) {
    console.error('Error al obtener alertas del sistema:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener alertas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ALERTA POR ID
// ==========================================
export const getAlertaSistemaById = async (req: Request, res: Response): Promise<Response> => {
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
        als.id_alerta,
        als.tipo_alerta,
        als.mensaje,
        als.descripcion,
        als.prioridad,
        als.fecha_generada,
        als.activa,
        als.usuario_responsable,
        als.fecha_resuelta,
        als.observaciones_resolucion,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_responsable,
        a.usuario as usuario_responsable_username
      FROM alertas_sistema als
      LEFT JOIN administrador a ON als.usuario_responsable = a.id_administrador
      LEFT JOIN persona p ON a.id_persona = p.id_persona
      WHERE als.id_alerta = $1
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alerta del sistema no encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Alerta del sistema encontrada correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener alerta por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener alerta',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR NUEVA ALERTA DEL SISTEMA
// ==========================================
export const createAlertaSistema = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      tipo_alerta,
      mensaje,
      descripcion,
      prioridad = 'Media',
      usuario_responsable,
      activa = true
    } = req.body;
    
    // Validaciones
    if (!tipo_alerta || tipo_alerta.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El tipo de alerta es obligatorio'
      });
    }
    
    if (!mensaje || mensaje.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El mensaje es obligatorio'
      });
    }
    
    // Validar tipos permitidos
    const tiposPermitidos = ['Seguridad', 'Sistema', 'Base de Datos', 'Expedientes', 'Medicamentos', 'Camas', 'Personal'];
    if (!tiposPermitidos.includes(tipo_alerta)) {
      return res.status(400).json({
        success: false,
        message: `El tipo de alerta debe ser uno de: ${tiposPermitidos.join(', ')}`
      });
    }
    
    // Validar prioridades permitidas
    const prioridadesPermitidas = ['Crítica', 'Alta', 'Media', 'Baja'];
    if (!prioridadesPermitidas.includes(prioridad)) {
      return res.status(400).json({
        success: false,
        message: `La prioridad debe ser una de: ${prioridadesPermitidas.join(', ')}`
      });
    }
    
    const insertQuery = `
      INSERT INTO alertas_sistema (tipo_alerta, mensaje, descripcion, prioridad, usuario_responsable, activa)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(insertQuery, [
      tipo_alerta,
      mensaje.trim(),
      descripcion?.trim() || null,
      prioridad,
      usuario_responsable || null,
      activa
    ]);
    
    return res.status(201).json({
      success: true,
      message: 'Alerta del sistema creada correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear alerta del sistema:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear alerta',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// RESOLVER ALERTA DEL SISTEMA
// ==========================================
export const resolverAlertaSistema = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { observaciones_resolucion, usuario_responsable } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar que la alerta existe y está activa
    const existeQuery = `
      SELECT id_alerta, activa 
      FROM alertas_sistema 
      WHERE id_alerta = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alerta del sistema no encontrada'
      });
    }
    
    if (!existeResponse.rows[0].activa) {
      return res.status(400).json({
        success: false,
        message: 'La alerta ya ha sido resuelta'
      });
    }
    
    const updateQuery = `
      UPDATE alertas_sistema 
      SET 
        activa = false,
        fecha_resuelta = CURRENT_TIMESTAMP,
        observaciones_resolucion = $1,
        usuario_responsable = COALESCE($2, usuario_responsable)
      WHERE id_alerta = $3
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(updateQuery, [
      observaciones_resolucion?.trim() || null,
      usuario_responsable || null,
      id
    ]);
    
    return res.status(200).json({
      success: true,
      message: 'Alerta del sistema resuelta correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al resolver alerta del sistema:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al resolver alerta',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR ALERTA DEL SISTEMA
// ==========================================
export const deleteAlertaSistema = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    const deleteQuery = `
      DELETE FROM alertas_sistema 
      WHERE id_alerta = $1 
      RETURNING tipo_alerta, mensaje
    `;
    
    const response: QueryResult = await pool.query(deleteQuery, [id]);
    
    if (response.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alerta del sistema no encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `Alerta "${response.rows[0].tipo_alerta}" eliminada correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar alerta del sistema:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar alerta',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE ALERTAS
// ==========================================
export const getEstadisticasAlertas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        tipo_alerta,
        prioridad,
        COUNT(*) as total_alertas,
        COUNT(CASE WHEN activa = true THEN 1 END) as alertas_activas,
        COUNT(CASE WHEN activa = false THEN 1 END) as alertas_resueltas,
        COUNT(CASE WHEN fecha_generada >= CURRENT_DATE - INTERVAL '24 hours' THEN 1 END) as alertas_ultimas_24h,
        COUNT(CASE WHEN fecha_generada >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as alertas_ultima_semana
      FROM alertas_sistema
      GROUP BY tipo_alerta, prioridad
      ORDER BY 
        CASE prioridad 
          WHEN 'Crítica' THEN 1 
          WHEN 'Alta' THEN 2 
          WHEN 'Media' THEN 3 
          WHEN 'Baja' THEN 4 
        END ASC,
        tipo_alerta ASC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    // Calcular estadísticas generales
    const resumenQuery = `
      SELECT 
        COUNT(*) as total_alertas_sistema,
        COUNT(CASE WHEN activa = true THEN 1 END) as total_activas,
        COUNT(CASE WHEN activa = false THEN 1 END) as total_resueltas,
        COUNT(CASE WHEN prioridad = 'Crítica' AND activa = true THEN 1 END) as criticas_activas,
        COUNT(CASE WHEN fecha_generada >= CURRENT_DATE - INTERVAL '24 hours' THEN 1 END) as nuevas_24h
      FROM alertas_sistema
    `;
    
    const resumenResponse: QueryResult = await pool.query(resumenQuery);
    
    return res.status(200).json({
      success: true,
      message: 'Estadísticas de alertas del sistema obtenidas correctamente',
      data: {
        alertas_por_tipo_prioridad: response.rows,
        resumen: resumenResponse.rows[0]
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de alertas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};