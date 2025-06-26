// src/controllers/documentos_clinicos/referencia_traslado.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getReferenciasTraslado = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Parámetros de paginación y filtrado
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Filtros opcionales
    const tipoTraslado = req.query.tipo_traslado as string;
    const fechaDesde = req.query.fecha_desde as string;
    const fechaHasta = req.query.fecha_hasta as string;

    // Construir consulta base con JOINs
    let query = `
      SELECT 
        rt.*,
        td.nombre as tipo_documento,
        gd.nombre as nombre_guia_diagnostico,
        gd.codigo as codigo_guia_diagnostico,
        CONCAT(p.nombre, ' ', p.apellido_paterno) as medico_solicitante,
        exp.numero_expediente,
        CONCAT(per.nombre, ' ', per.apellido_paterno, ' ', per.apellido_materno) as nombre_paciente,
        per.fecha_nacimiento,
        ts.nombre as tipo_sangre
      FROM referencia_traslado rt
      LEFT JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN guia_clinica gd ON rt.id_guia_diagnostico = gd.id_guia_diagnostico
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN expediente exp ON dc.id_expediente = exp.id_expediente
      LEFT JOIN paciente pac ON exp.id_paciente = pac.id_paciente
      LEFT JOIN persona per ON pac.id_persona = per.id_persona
      LEFT JOIN tipo_sangre ts ON per.tipo_sangre_id = ts.id_tipo_sangre
    `;

    // Construir condiciones WHERE dinámicas
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (tipoTraslado) {
      conditions.push(`rt.tipo_traslado = $${paramIndex}`);
      params.push(tipoTraslado);
      paramIndex++;
    }

    if (fechaDesde) {
      conditions.push(`dc.fecha_elaboracion >= $${paramIndex}`);
      params.push(fechaDesde);
      paramIndex++;
    }

    if (fechaHasta) {
      conditions.push(`dc.fecha_elaboracion <= $${paramIndex}`);
      params.push(fechaHasta);
      paramIndex++;
    }

    // Añadir condiciones si existen
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Orden y paginación
    query += ` ORDER BY dc.fecha_elaboracion DESC, rt.id_referencia DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Consulta principal
    const response: QueryResult = await pool.query(query, params);

    // Consulta para total de registros (para paginación)
    let countQuery = `SELECT COUNT(*) FROM referencia_traslado rt`;
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
    return res.status(500).send("Error al obtener referencias de traslado");
  }
};

export const getReferenciaTrasladoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const query = `
      SELECT 
        rt.*,
        td.nombre as tipo_documento,
        gd.nombre as nombre_guia_diagnostico,
        gd.codigo as codigo_guia_diagnostico,
        CONCAT(p.nombre, ' ', p.apellido_paterno) as medico_solicitante,
        exp.numero_expediente,
        CONCAT(per.nombre, ' ', per.apellido_paterno, ' ', per.apellido_materno) as nombre_paciente,
        per.fecha_nacimiento,
        ts.nombre as tipo_sangre,
        i.fecha_ingreso as fecha_ingreso_actual,
        s.nombre as servicio_actual
      FROM referencia_traslado rt
      LEFT JOIN documento_clinico dc ON rt.id_documento = dc.id_documento
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN guia_clinica gd ON rt.id_guia_diagnostico = gd.id_guia_diagnostico
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN expediente exp ON dc.id_expediente = exp.id_expediente
      LEFT JOIN paciente pac ON exp.id_paciente = pac.id_paciente
      LEFT JOIN persona per ON pac.id_persona = per.id_persona
      LEFT JOIN tipo_sangre ts ON per.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN internamiento i ON exp.id_expediente = i.id_expediente AND i.fecha_egreso IS NULL
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE rt.id_referencia = $1
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).send("Referencia de traslado no encontrada");
    }
    
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener referencia de traslado por ID");
  }
};

export const createReferenciaTraslado = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      id_documento,
      establecimiento_origen,
      establecimiento_destino,
      motivo_envio,
      resumen_clinico,
      diagnostico,
      id_guia_diagnostico,
      plan_tratamiento,
      estado_fisico,
      pronostico,
      tipo_traslado,
      medico_receptor,
      observaciones
    } = req.body;

    // Validaciones básicas
    if (!id_documento || !establecimiento_destino || !motivo_envio || !resumen_clinico || !diagnostico) {
      await client.query('ROLLBACK');
      return res.status(400).send("Datos incompletos: id_documento, establecimiento_destino, motivo_envio, resumen_clinico y diagnostico son requeridos");
    }

    // Verificar que el documento existe
    const docCheck = await client.query('SELECT 1 FROM documento_clinico WHERE id_documento = $1', [id_documento]);
    if (docCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send("Documento clínico no encontrado");
    }

    // Verificar que la guía de diagnóstico existe si se proporciona
    if (id_guia_diagnostico) {
      const guiaCheck = await client.query('SELECT 1 FROM guia_clinica WHERE id_guia_diagnostico = $1 AND activo = true', [id_guia_diagnostico]);
      if (guiaCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send("Guía clínica no encontrada o inactiva");
      }
    }

    // Insertar la referencia
    const insertQuery = `
      INSERT INTO referencia_traslado (
        id_documento, establecimiento_origen, establecimiento_destino, 
        motivo_envio, resumen_clinico, diagnostico, id_guia_diagnostico, 
        plan_tratamiento, estado_fisico, pronostico, tipo_traslado, 
        medico_receptor, observaciones
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *
    `;
    
    const response: QueryResult = await client.query(insertQuery, [
      id_documento,
      establecimiento_origen || null,
      establecimiento_destino,
      motivo_envio,
      resumen_clinico,
      diagnostico,
      id_guia_diagnostico || null,
      plan_tratamiento || null,
      estado_fisico || null,
      pronostico || null,
      tipo_traslado || null,
      medico_receptor || null,
      observaciones || null
    ]);

    await client.query('COMMIT');
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).send("Error al crear referencia de traslado");
  } finally {
    client.release();
  }
};

export const updateReferenciaTraslado = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const id = req.params.id;
    const {
      establecimiento_origen,
      establecimiento_destino,
      motivo_envio,
      resumen_clinico,
      diagnostico,
      id_guia_diagnostico,
      plan_tratamiento,
      estado_fisico,
      pronostico,
      tipo_traslado,
      medico_receptor,
      observaciones
    } = req.body;

    // Verificar que la referencia existe
    const checkQuery = await client.query('SELECT 1 FROM referencia_traslado WHERE id_referencia = $1', [id]);
    if (checkQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send("Referencia de traslado no encontrada");
    }

    // Verificar que la guía de diagnóstico existe si se va a actualizar
    if (id_guia_diagnostico) {
      const guiaCheck = await client.query('SELECT 1 FROM guia_clinica WHERE id_guia_diagnostico = $1 AND activo = true', [id_guia_diagnostico]);
      if (guiaCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send("Guía clínica no encontrada o inactiva");
      }
    }

    // Construir consulta dinámica
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (establecimiento_origen !== undefined) {
      updateFields.push(`establecimiento_origen = $${paramIndex}`);
      params.push(establecimiento_origen);
      paramIndex++;
    }

    if (establecimiento_destino !== undefined) {
      updateFields.push(`establecimiento_destino = $${paramIndex}`);
      params.push(establecimiento_destino);
      paramIndex++;
    }

    if (motivo_envio !== undefined) {
      updateFields.push(`motivo_envio = $${paramIndex}`);
      params.push(motivo_envio);
      paramIndex++;
    }

    if (resumen_clinico !== undefined) {
      updateFields.push(`resumen_clinico = $${paramIndex}`);
      params.push(resumen_clinico);
      paramIndex++;
    }

    if (diagnostico !== undefined) {
      updateFields.push(`diagnostico = $${paramIndex}`);
      params.push(diagnostico);
      paramIndex++;
    }

    if (id_guia_diagnostico !== undefined) {
      updateFields.push(`id_guia_diagnostico = $${paramIndex}`);
      params.push(id_guia_diagnostico);
      paramIndex++;
    }

    if (plan_tratamiento !== undefined) {
      updateFields.push(`plan_tratamiento = $${paramIndex}`);
      params.push(plan_tratamiento);
      paramIndex++;
    }

    if (estado_fisico !== undefined) {
      updateFields.push(`estado_fisico = $${paramIndex}`);
      params.push(estado_fisico);
      paramIndex++;
    }

    if (pronostico !== undefined) {
      updateFields.push(`pronostico = $${paramIndex}`);
      params.push(pronostico);
      paramIndex++;
    }

    if (tipo_traslado !== undefined) {
      updateFields.push(`tipo_traslado = $${paramIndex}`);
      params.push(tipo_traslado);
      paramIndex++;
    }

    if (medico_receptor !== undefined) {
      updateFields.push(`medico_receptor = $${paramIndex}`);
      params.push(medico_receptor);
      paramIndex++;
    }

    if (observaciones !== undefined) {
      updateFields.push(`observaciones = $${paramIndex}`);
      params.push(observaciones);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).send("No se proporcionaron datos para actualizar");
    }

    params.push(id);
    const updateQuery = `
      UPDATE referencia_traslado 
      SET ${updateFields.join(', ')}
      WHERE id_referencia = $${paramIndex}
      RETURNING *
    `;

    const response: QueryResult = await client.query(updateQuery, params);

    await client.query('COMMIT');
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).send("Error al actualizar referencia de traslado");
  } finally {
    client.release();
  }
};

export const deleteReferenciaTraslado = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const id = req.params.id;
    
    // Verificar que la referencia existe
    const checkQuery = await client.query('SELECT 1 FROM referencia_traslado WHERE id_referencia = $1', [id]);
    if (checkQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send("Referencia de traslado no encontrada");
    }

    // Eliminar la referencia
    const response = await client.query('DELETE FROM referencia_traslado WHERE id_referencia = $1', [id]);
    
    await client.query('COMMIT');
    return res.status(200).send("Referencia de traslado eliminada correctamente");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).send("Error al eliminar referencia de traslado");
  } finally {
    client.release();
  }
};

// Endpoint adicional para actualizar estado de traslado
export const updateEstadoTraslado = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const id = req.params.id;
    const { estado_traslado, observaciones } = req.body;

    // Validaciones
    if (!estado_traslado) {
      await client.query('ROLLBACK');
      return res.status(400).send("El estado del traslado es requerido");
    }

    // Verificar que la referencia existe
    const checkQuery = await client.query(
      'SELECT id_referencia FROM referencia_traslado WHERE id_referencia = $1',
      [id]
    );
    
    if (checkQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send("Referencia de traslado no encontrada");
    }

    // Actualizar
    const updateQuery = `
      UPDATE referencia_traslado 
      SET 
        estado_traslado = $1,
        observaciones = COALESCE($2, observaciones),
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_referencia = $3
      RETURNING *
    `;
    
    const response = await client.query(updateQuery, [
      estado_traslado,
      observaciones || null,
      id
    ]);

    await client.query('COMMIT');
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).send("Error al actualizar estado de traslado");
  } finally {
    client.release();
  }
};