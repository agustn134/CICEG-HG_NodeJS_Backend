import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getSolicitudesEstudio = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Parámetros de paginación y filtrado
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Filtros opcionales
    const estado = req.query.estado as string;
    const prioridad = req.query.prioridad as string;
    const fechaDesde = req.query.fecha_desde as string;
    const fechaHasta = req.query.fecha_hasta as string;

    // Construir consulta base con JOINs
    let query = `
      SELECT 
        se.*,
        e.nombre as nombre_estudio,
        e.tipo as tipo_estudio,
        td.nombre as tipo_documento,
        CONCAT(p.nombre, ' ', p.apellido_paterno) as medico_solicitante,
        exp.numero_expediente,
        CONCAT(per.nombre, ' ', per.apellido_paterno) as nombre_paciente
      FROM solicitud_estudio se
      LEFT JOIN estudio_medico e ON se.id_estudio = e.id_estudio
      LEFT JOIN documento_clinico dc ON se.id_documento = dc.id_documento
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN expediente exp ON dc.id_expediente = exp.id_expediente
      LEFT JOIN paciente pac ON exp.id_paciente = pac.id_paciente
      LEFT JOIN persona per ON pac.id_persona = per.id_persona
    `;

    // Construir condiciones WHERE dinámicas
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (estado) {
      conditions.push(`se.estado = $${paramIndex}`);
      params.push(estado);
      paramIndex++;
    }

    if (prioridad) {
      conditions.push(`se.prioridad = $${paramIndex}`);
      params.push(prioridad);
      paramIndex++;
    }

    if (fechaDesde) {
      conditions.push(`se.fecha_solicitada >= $${paramIndex}`);
      params.push(fechaDesde);
      paramIndex++;
    }

    if (fechaHasta) {
      conditions.push(`se.fecha_solicitada <= $${paramIndex}`);
      params.push(fechaHasta);
      paramIndex++;
    }

    // Añadir condiciones si existen
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Orden y paginación
    query += ` ORDER BY se.fecha_solicitada DESC, se.id_solicitud DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Consulta principal
    const response: QueryResult = await pool.query(query, params);

    // Consulta para total de registros (para paginación)
    let countQuery = `SELECT COUNT(*) FROM solicitud_estudio se`;
    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
    }
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].count);

    return res.status(200).json({
      data: response.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener solicitudes de estudio");
  }
};

export const getSolicitudEstudioById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const query = `
      SELECT 
        se.*,
        e.nombre as nombre_estudio,
        e.tipo as tipo_estudio,
        e.descripcion as descripcion_estudio,
        e.requiere_ayuno,
        e.tiempo_resultado,
        td.nombre as tipo_documento,
        CONCAT(p.nombre, ' ', p.apellido_paterno) as medico_solicitante,
        exp.numero_expediente,
        CONCAT(per.nombre, ' ', per.apellido_paterno, ' ', per.apellido_materno) as nombre_paciente,
        per.fecha_nacimiento,
        ts.nombre as tipo_sangre
      FROM solicitud_estudio se
      LEFT JOIN estudio_medico e ON se.id_estudio = e.id_estudio
      LEFT JOIN documento_clinico dc ON se.id_documento = dc.id_documento
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN expediente exp ON dc.id_expediente = exp.id_expediente
      LEFT JOIN paciente pac ON exp.id_paciente = pac.id_paciente
      LEFT JOIN persona per ON pac.id_persona = per.id_persona
      LEFT JOIN tipo_sangre ts ON per.tipo_sangre_id = ts.id_tipo_sangre
      WHERE se.id_solicitud = $1
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).send("Solicitud de estudio no encontrada");
    }
    
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener solicitud de estudio por ID");
  }
};

export const createSolicitudEstudio = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      id_documento,
      id_estudio,
      justificacion,
      preparacion_requerida,
      informacion_clinica_relevante,
      fecha_solicitada,
      prioridad = 'Normal',
      fecha_realizacion = null,
      hora_toma_muestra = null,
      resultado = null,
      interpretacion = null,
      estado = 'Solicitado'
    } = req.body;

    // Validaciones básicas
    if (!id_documento || !id_estudio || !justificacion || !fecha_solicitada) {
      await client.query('ROLLBACK');
      return res.status(400).send("Datos incompletos: id_documento, id_estudio, justificacion y fecha_solicitada son requeridos");
    }

    // Verificar que el documento existe
    const docCheck = await client.query('SELECT 1 FROM documento_clinico WHERE id_documento = $1', [id_documento]);
    if (docCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send("Documento clínico no encontrado");
    }

    // Verificar que el estudio existe
    const estudioCheck = await client.query('SELECT 1 FROM estudio_medico WHERE id_estudio = $1 AND activo = true', [id_estudio]);
    if (estudioCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send("Estudio médico no encontrado o inactivo");
    }

    // Insertar la solicitud
    const insertQuery = `
      INSERT INTO solicitud_estudio (
        id_documento, id_estudio, justificacion, preparacion_requerida, 
        informacion_clinica_relevante, fecha_solicitada, prioridad, 
        fecha_realizacion, hora_toma_muestra, resultado, interpretacion, estado
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *
    `;
    
    const response: QueryResult = await client.query(insertQuery, [
      id_documento,
      id_estudio,
      justificacion,
      preparacion_requerida,
      informacion_clinica_relevante,
      fecha_solicitada,
      prioridad,
      fecha_realizacion,
      hora_toma_muestra,
      resultado,
      interpretacion,
      estado
    ]);

    await client.query('COMMIT');
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).send("Error al crear solicitud de estudio");
  } finally {
    client.release();
  }
};

export const updateSolicitudEstudio = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const id = req.params.id;
    const {
      id_estudio,
      justificacion,
      preparacion_requerida,
      informacion_clinica_relevante,
      prioridad,
      fecha_realizacion,
      hora_toma_muestra,
      resultado,
      interpretacion,
      estado
    } = req.body;

    // Verificar que la solicitud existe
    const checkQuery = await client.query('SELECT 1 FROM solicitud_estudio WHERE id_solicitud = $1', [id]);
    if (checkQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send("Solicitud de estudio no encontrada");
    }

    // Verificar que el estudio existe si se va a actualizar
    if (id_estudio) {
      const estudioCheck = await client.query('SELECT 1 FROM estudio_medico WHERE id_estudio = $1 AND activo = true', [id_estudio]);
      if (estudioCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send("Estudio médico no encontrado o inactivo");
      }
    }

    // Construir consulta dinámica
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (id_estudio !== undefined) {
      updateFields.push(`id_estudio = $${paramIndex}`);
      params.push(id_estudio);
      paramIndex++;
    }

    if (justificacion !== undefined) {
      updateFields.push(`justificacion = $${paramIndex}`);
      params.push(justificacion);
      paramIndex++;
    }

    if (preparacion_requerida !== undefined) {
      updateFields.push(`preparacion_requerida = $${paramIndex}`);
      params.push(preparacion_requerida);
      paramIndex++;
    }

    if (informacion_clinica_relevante !== undefined) {
      updateFields.push(`informacion_clinica_relevante = $${paramIndex}`);
      params.push(informacion_clinica_relevante);
      paramIndex++;
    }

    if (prioridad !== undefined) {
      updateFields.push(`prioridad = $${paramIndex}`);
      params.push(prioridad);
      paramIndex++;
    }

    if (fecha_realizacion !== undefined) {
      updateFields.push(`fecha_realizacion = $${paramIndex}`);
      params.push(fecha_realizacion);
      paramIndex++;
    }

    if (hora_toma_muestra !== undefined) {
      updateFields.push(`hora_toma_muestra = $${paramIndex}`);
      params.push(hora_toma_muestra);
      paramIndex++;
    }

    if (resultado !== undefined) {
      updateFields.push(`resultado = $${paramIndex}`);
      params.push(resultado);
      paramIndex++;
    }

    if (interpretacion !== undefined) {
      updateFields.push(`interpretacion = $${paramIndex}`);
      params.push(interpretacion);
      paramIndex++;
    }

    if (estado !== undefined) {
      updateFields.push(`estado = $${paramIndex}`);
      params.push(estado);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).send("No se proporcionaron datos para actualizar");
    }

    params.push(id);
    const updateQuery = `
      UPDATE solicitud_estudio 
      SET ${updateFields.join(', ')}
      WHERE id_solicitud = $${paramIndex}
      RETURNING *
    `;

    const response: QueryResult = await client.query(updateQuery, params);

    await client.query('COMMIT');
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).send("Error al actualizar solicitud de estudio");
  } finally {
    client.release();
  }
};

export const deleteSolicitudEstudio = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const id = req.params.id;
    
    // Verificar que la solicitud existe
    const checkQuery = await client.query('SELECT 1 FROM solicitud_estudio WHERE id_solicitud = $1', [id]);
    if (checkQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send("Solicitud de estudio no encontrada");
    }

    // Eliminar la solicitud
    const response = await client.query('DELETE FROM solicitud_estudio WHERE id_solicitud = $1', [id]);
    
    await client.query('COMMIT');
    return res.status(200).send("Solicitud de estudio eliminada correctamente");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).send("Error al eliminar solicitud de estudio");
  } finally {
    client.release();
  }
};

// Función adicional para actualizar resultados de estudios
export const updateResultadoEstudio = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const id = req.params.id;
    const { resultado, interpretacion } = req.body;

    // Validaciones
    if (!resultado) {
      await client.query('ROLLBACK');
      return res.status(400).send("El resultado es requerido");
    }

    // Verificar que la solicitud existe y está en estado adecuado
    const checkQuery = await client.query(
      'SELECT estado FROM solicitud_estudio WHERE id_solicitud = $1',
      [id]
    );
    
    if (checkQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send("Solicitud de estudio no encontrada");
    }

    const estadoActual = checkQuery.rows[0].estado;
    if (estadoActual !== 'Solicitado' && estadoActual !== 'En proceso') {
      await client.query('ROLLBACK');
      return res.status(400).send("No se puede actualizar el resultado de un estudio con estado: " + estadoActual);
    }

    // Actualizar
    const updateQuery = `
      UPDATE solicitud_estudio 
      SET 
        resultado = $1,
        interpretacion = $2,
        estado = 'Completado',
        fecha_realizacion = CURRENT_DATE
      WHERE id_solicitud = $3
      RETURNING *
    `;
    
    const response = await client.query(updateQuery, [
      resultado,
      interpretacion || null,
      id
    ]);

    await client.query('COMMIT');
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).send("Error al actualizar resultado de estudio");
  } finally {
    client.release();
  }
};