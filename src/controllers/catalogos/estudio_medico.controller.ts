// src/controllers/catalogos/estudio_medico.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// OBTENER TODOS LOS ESTUDIOS MÉDICOS
// ==========================================
export const getEstudiosMedicos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tipo, requiere_ayuno, activo } = req.query;
    
    let query = `
      SELECT 
        em.id_estudio,
        em.clave,
        em.nombre,
        em.tipo,
        em.descripcion,
        em.requiere_ayuno,
        em.tiempo_resultado,
        em.activo,
        COUNT(se.id_solicitud) as total_solicitudes,
        COUNT(CASE WHEN se.estado = 'Solicitado' THEN 1 END) as solicitudes_pendientes,
        COUNT(CASE WHEN se.estado = 'Completado' THEN 1 END) as solicitudes_completadas,
        COUNT(CASE WHEN se.fecha_solicitada >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as solicitudes_mes_actual
      FROM estudio_medico em
      LEFT JOIN solicitud_estudio se ON em.id_estudio = se.id_estudio
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    // Filtrar por tipo si se especifica
    if (tipo) {
      query += ` AND UPPER(em.tipo) LIKE UPPER($${paramCounter})`;
      params.push(`%${tipo}%`);
      paramCounter++;
    }
    
    // Filtrar por requerimiento de ayuno si se especifica
    if (requiere_ayuno !== undefined) {
      query += ` AND em.requiere_ayuno = ${paramCounter}`;
      params.push(requiere_ayuno === 'true');
      paramCounter++;
    }
    
    // Filtrar por estado activo si se especifica
    if (activo !== undefined) {
      query += ` AND em.activo = ${paramCounter}`;
      params.push(activo === 'true');
      paramCounter++;
    }
    
    query += `
      GROUP BY em.id_estudio, em.clave, em.nombre, em.tipo, em.descripcion, 
               em.requiere_ayuno, em.tiempo_resultado, em.activo
      ORDER BY em.tipo ASC, em.nombre ASC
    `;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Estudios médicos obtenidos correctamente',
      data: response.rows,
      total: response.rowCount,
      filtros_aplicados: {
        tipo: tipo || 'todos',
        requiere_ayuno: requiere_ayuno || 'todos',
        activo: activo || 'todos'
      }
    });
  } catch (error) {
    console.error('Error al obtener estudios médicos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estudios médicos',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTUDIO MÉDICO POR ID
// ==========================================
export const getEstudioMedicoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un número
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    const query = `
      SELECT 
        em.id_estudio,
        em.clave,
        em.nombre,
        em.tipo,
        em.descripcion,
        em.requiere_ayuno,
        em.tiempo_resultado,
        em.activo,
        COUNT(se.id_solicitud) as total_solicitudes,
        COUNT(CASE WHEN se.estado = 'Solicitado' THEN 1 END) as solicitudes_pendientes,
        COUNT(CASE WHEN se.estado = 'En proceso' THEN 1 END) as solicitudes_en_proceso,
        COUNT(CASE WHEN se.estado = 'Completado' THEN 1 END) as solicitudes_completadas,
        COUNT(CASE WHEN se.estado = 'Cancelado' THEN 1 END) as solicitudes_canceladas,
        COUNT(CASE WHEN se.fecha_solicitada >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as solicitudes_semana,
        COUNT(CASE WHEN se.fecha_solicitada >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as solicitudes_mes
      FROM estudio_medico em
      LEFT JOIN solicitud_estudio se ON em.id_estudio = se.id_estudio
      WHERE em.id_estudio = $1
      GROUP BY em.id_estudio, em.clave, em.nombre, em.tipo, em.descripcion, 
               em.requiere_ayuno, em.tiempo_resultado, em.activo
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Estudio médico no encontrado'
      });
    }
    
    // Obtener las últimas 10 solicitudes de este estudio
    const solicitudesQuery = `
      SELECT 
        se.id_solicitud,
        se.fecha_solicitada,
        se.prioridad,
        se.estado,
        se.fecha_realizacion,
        se.justificacion,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_solicitante
      FROM solicitud_estudio se
      JOIN documento_clinico dc ON se.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE se.id_estudio = $1
      ORDER BY se.fecha_solicitada DESC
      LIMIT 10
    `;
    
    const solicitudesResponse: QueryResult = await pool.query(solicitudesQuery, [id]);
    
    const estudioData = response.rows[0];
    estudioData.ultimas_solicitudes = solicitudesResponse.rows;
    
    return res.status(200).json({
      success: true,
      message: 'Estudio médico encontrado correctamente',
      data: estudioData
    });
  } catch (error) {
    console.error('Error al obtener estudio médico por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estudio médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR NUEVO ESTUDIO MÉDICO
// ==========================================
export const createEstudioMedico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { 
      clave, 
      nombre, 
      tipo, 
      descripcion, 
      requiere_ayuno = false, 
      tiempo_resultado, 
      activo = true 
    } = req.body;
    
    // Validaciones básicas
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del estudio médico es obligatorio'
      });
    }
    
    if (!tipo || tipo.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El tipo de estudio es obligatorio'
      });
    }
    
    // Validar tipos permitidos
    const tiposPermitidos = ['Laboratorio', 'Imagen', 'Gabinete', 'Electrocardiograma', 'Endoscopía', 'Biopsia', 'Otro'];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: `El tipo de estudio debe ser uno de: ${tiposPermitidos.join(', ')}`
      });
    }
    
    // Verificar si ya existe un estudio con la misma clave (si se proporciona)
    if (clave && clave.trim() !== '') {
      const existeClaveQuery = `
        SELECT id_estudio 
        FROM estudio_medico 
        WHERE UPPER(clave) = UPPER($1)
      `;
      
      const existeClaveResponse: QueryResult = await pool.query(existeClaveQuery, [clave.trim()]);
      
      if (existeClaveResponse.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe un estudio médico con esa clave'
        });
      }
    }
    
    // Verificar si ya existe un estudio con el mismo nombre
    const existeNombreQuery = `
      SELECT id_estudio 
      FROM estudio_medico 
      WHERE UPPER(nombre) = UPPER($1)
    `;
    
    const existeNombreResponse: QueryResult = await pool.query(existeNombreQuery, [nombre.trim()]);
    
    if (existeNombreResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un estudio médico con ese nombre'
      });
    }
    
    // Insertar nuevo estudio médico
    const insertQuery = `
      INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(insertQuery, [
      clave?.trim() || null,
      nombre.trim(),
      tipo,
      descripcion?.trim() || null,
      requiere_ayuno,
      tiempo_resultado || null,
      activo
    ]);
    
    return res.status(201).json({
      success: true,
      message: 'Estudio médico creado correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear estudio médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear estudio médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR ESTUDIO MÉDICO
// ==========================================
export const updateEstudioMedico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { 
      clave, 
      nombre, 
      tipo, 
      descripcion, 
      requiere_ayuno, 
      tiempo_resultado, 
      activo 
    } = req.body;
    
    // Validar que el ID sea un número
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Validaciones básicas
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del estudio médico es obligatorio'
      });
    }
    
    if (!tipo || tipo.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El tipo de estudio es obligatorio'
      });
    }
    
    // Validar tipos permitidos
    const tiposPermitidos = ['Laboratorio', 'Imagen', 'Gabinete', 'Electrocardiograma', 'Endoscopía', 'Biopsia', 'Otro'];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: `El tipo de estudio debe ser uno de: ${tiposPermitidos.join(', ')}`
      });
    }
    
    // Verificar si el estudio existe
    const existeQuery = `
      SELECT id_estudio 
      FROM estudio_medico 
      WHERE id_estudio = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Estudio médico no encontrado'
      });
    }
    
    // Verificar si ya existe otro estudio con la misma clave (si se proporciona)
    if (clave && clave.trim() !== '') {
      const duplicadoClaveQuery = `
        SELECT id_estudio 
        FROM estudio_medico 
        WHERE UPPER(clave) = UPPER($1) AND id_estudio != $2
      `;
      
      const duplicadoClaveResponse: QueryResult = await pool.query(duplicadoClaveQuery, [clave.trim(), id]);
      
      if (duplicadoClaveResponse.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otro estudio médico con esa clave'
        });
      }
    }
    
    // Verificar si ya existe otro estudio con el mismo nombre
    const duplicadoNombreQuery = `
      SELECT id_estudio 
      FROM estudio_medico 
      WHERE UPPER(nombre) = UPPER($1) AND id_estudio != $2
    `;
    
    const duplicadoNombreResponse: QueryResult = await pool.query(duplicadoNombreQuery, [nombre.trim(), id]);
    
    if (duplicadoNombreResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe otro estudio médico con ese nombre'
      });
    }
    
    // Actualizar estudio médico
    const updateQuery = `
      UPDATE estudio_medico 
      SET 
        clave = $1, 
        nombre = $2, 
        tipo = $3, 
        descripcion = $4, 
        requiere_ayuno = $5, 
        tiempo_resultado = $6, 
        activo = $7
      WHERE id_estudio = $8 
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(updateQuery, [
      clave?.trim() || null,
      nombre.trim(),
      tipo,
      descripcion?.trim() || null,
      requiere_ayuno,
      tiempo_resultado || null,
      activo,
      id
    ]);
    
    return res.status(200).json({
      success: true,
      message: 'Estudio médico actualizado correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar estudio médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar estudio médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR ESTUDIO MÉDICO
// ==========================================
export const deleteEstudioMedico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un número
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar si el estudio existe
    const existeQuery = `
      SELECT id_estudio, nombre 
      FROM estudio_medico 
      WHERE id_estudio = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Estudio médico no encontrado'
      });
    }
    
    // Verificar si el estudio está siendo usado
    const usoQuery = `
      SELECT COUNT(*) as total
      FROM solicitud_estudio 
      WHERE id_estudio = $1
    `;
    
    const usoResponse: QueryResult = await pool.query(usoQuery, [id]);
    const totalUso = parseInt(usoResponse.rows[0].total);
    
    if (totalUso > 0) {
      return res.status(409).json({
        success: false,
        message: `No se puede eliminar el estudio médico. Tiene ${totalUso} solicitud(es) asociada(s)`,
        details: {
          solicitudes_asociadas: totalUso
        }
      });
    }
    
    // Eliminar estudio médico
    const deleteQuery = `
      DELETE FROM estudio_medico 
      WHERE id_estudio = $1 
      RETURNING nombre
    `;
    
    const response: QueryResult = await pool.query(deleteQuery, [id]);
    
    return res.status(200).json({
      success: true,
      message: `Estudio médico "${response.rows[0].nombre}" eliminado correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar estudio médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar estudio médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTUDIOS ACTIVOS (PARA SELECTS)
// ==========================================
export const getEstudiosMedicosActivos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tipo } = req.query;
    
    let query = `
      SELECT 
        id_estudio,
        clave,
        nombre,
        tipo,
        requiere_ayuno,
        tiempo_resultado
      FROM estudio_medico 
      WHERE activo = true
    `;
    
    const params: any[] = [];
    
    // Filtrar por tipo si se especifica
    if (tipo) {
      query += ` AND tipo = $1`;
      params.push(tipo);
    }
    
    query += ` ORDER BY tipo ASC, nombre ASC`;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Estudios médicos activos obtenidos correctamente',
      data: response.rows,
      total: response.rowCount
    });
  } catch (error) {
    console.error('Error al obtener estudios médicos activos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estudios activos',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE ESTUDIOS MÉDICOS
// ==========================================
export const getEstadisticasEstudiosMedicos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        em.tipo,
        COUNT(em.id_estudio) as total_estudios,
        COUNT(CASE WHEN em.activo = true THEN 1 END) as estudios_activos,
        COUNT(CASE WHEN em.requiere_ayuno = true THEN 1 END) as requieren_ayuno,
        AVG(CASE WHEN em.tiempo_resultado IS NOT NULL THEN em.tiempo_resultado END) as tiempo_promedio_resultado,
        COUNT(se.id_solicitud) as total_solicitudes,
        COUNT(CASE WHEN se.estado = 'Completado' THEN 1 END) as solicitudes_completadas,
        COUNT(CASE WHEN se.fecha_solicitada >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as solicitudes_mes_actual
      FROM estudio_medico em
      LEFT JOIN solicitud_estudio se ON em.id_estudio = se.id_estudio
      GROUP BY em.tipo
      ORDER BY total_solicitudes DESC, em.tipo ASC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    // Calcular estadísticas generales
    const totalEstudios = response.rows.reduce((sum, row) => sum + parseInt(row.total_estudios), 0);
    const estudiosActivos = response.rows.reduce((sum, row) => sum + parseInt(row.estudios_activos), 0);
    const totalSolicitudes = response.rows.reduce((sum, row) => sum + parseInt(row.total_solicitudes), 0);
    const solicitudesCompletadas = response.rows.reduce((sum, row) => sum + parseInt(row.solicitudes_completadas), 0);
    const solicitudesMes = response.rows.reduce((sum, row) => sum + parseInt(row.solicitudes_mes_actual), 0);
    
    // Obtener los estudios más solicitados
    const masSolicitadosQuery = `
      SELECT 
        em.id_estudio,
        em.clave,
        em.nombre,
        em.tipo,
        COUNT(se.id_solicitud) as total_solicitudes,
        COUNT(CASE WHEN se.estado = 'Completado' THEN 1 END) as completadas,
        COUNT(CASE WHEN se.estado = 'Pendiente' OR se.estado = 'En proceso' THEN 1 END) as pendientes
      FROM estudio_medico em
      LEFT JOIN solicitud_estudio se ON em.id_estudio = se.id_estudio
      WHERE em.activo = true
      GROUP BY em.id_estudio, em.clave, em.nombre, em.tipo
      HAVING COUNT(se.id_solicitud) > 0
      ORDER BY total_solicitudes DESC
      LIMIT 10
    `;
    
    const masSolicitadosResponse: QueryResult = await pool.query(masSolicitadosQuery);
    
    return res.status(200).json({
      success: true,
      message: 'Estadísticas de estudios médicos obtenidas correctamente',
      data: {
        por_tipo: response.rows,
        mas_solicitados: masSolicitadosResponse.rows,
        resumen: {
          total_estudios: totalEstudios,
          estudios_activos: estudiosActivos,
          total_solicitudes_historicas: totalSolicitudes,
          solicitudes_completadas: solicitudesCompletadas,
          solicitudes_mes_actual: solicitudesMes,
          porcentaje_completado: totalSolicitudes > 0 ? Math.round((solicitudesCompletadas / totalSolicitudes) * 100) : 0,
          tipos_disponibles: response.rows.length
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de estudios médicos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};