// src/controllers/documentos_clinicos/nota_interconsulta.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// Interfaces para TypeScript
interface NotaInterconsulta {
  id_nota_interconsulta?: number;
  id_documento: number;
  area_interconsulta?: number;
  motivo_interconsulta: string;
  diagnostico_presuntivo?: string;
  examenes_laboratorio?: boolean;
  examenes_gabinete?: boolean;
  hallazgos?: string;
  impresion_diagnostica?: string;
  recomendaciones?: string;
  id_medico_solicitante?: number;
  id_medico_interconsulta?: number;
}

// ==========================================
// FUNCIONES CRUD BÁSICAS
// ==========================================

export const getNotasInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      area_interconsulta,
      medico_solicitante,
      fecha_inicio,
      fecha_fin,
      estado = 'all' // 'pendiente', 'respondida', 'all'
    } = req.query;
    
    let query = `
      SELECT 
        ni.*,
        dc.fecha_documento,
        dc.observaciones as observaciones_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        e.numero_expediente,
        ai.nombre as nombre_area_interconsulta,
        pm_sol.nombre || ' ' || pm_sol.apellido_paterno as medico_solicitante,
        pm_sol.numero_cedula as cedula_solicitante,
        pm_int.nombre || ' ' || pm_int.apellido_paterno as medico_interconsulta,
        pm_int.numero_cedula as cedula_interconsulta,
        s.nombre_servicio,
        CASE 
          WHEN ni.id_medico_interconsulta IS NULL THEN 'Pendiente'
          WHEN ni.impresion_diagnostica IS NULL OR ni.impresion_diagnostica = '' THEN 'En Proceso'
          ELSE 'Respondida'
        END as estado_interconsulta,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos
      FROM nota_interconsulta ni
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN area_interconsulta ai ON ni.area_interconsulta = ai.id_area_interconsulta
      LEFT JOIN personal_medico pm_sol_rel ON ni.id_medico_solicitante = pm_sol_rel.id_personal_medico
      LEFT JOIN persona pm_sol ON pm_sol_rel.id_persona = pm_sol.id_persona
      LEFT JOIN personal_medico pm_int_rel ON ni.id_medico_interconsulta = pm_int_rel.id_personal_medico
      LEFT JOIN persona pm_int ON pm_int_rel.id_persona = pm_int.id_persona
      LEFT JOIN internamiento int_serv ON dc.id_internamiento = int_serv.id_internamiento
      LEFT JOIN servicio s ON int_serv.id_servicio = s.id_servicio
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    // Filtros dinámicos
    if (area_interconsulta) {
      paramCount++;
      query += ` AND ni.area_interconsulta = $${paramCount}`;
      params.push(area_interconsulta);
    }

    if (medico_solicitante) {
      paramCount++;
      query += ` AND ni.id_medico_solicitante = $${paramCount}`;
      params.push(medico_solicitante);
    }

    if (fecha_inicio) {
      paramCount++;
      query += ` AND dc.fecha_documento >= $${paramCount}`;
      params.push(fecha_inicio);
    }

    if (fecha_fin) {
      paramCount++;
      query += ` AND dc.fecha_documento <= $${paramCount}`;
      params.push(fecha_fin);
    }

    // Filtro por estado
    if (estado === 'pendiente') {
      query += ` AND ni.id_medico_interconsulta IS NULL`;
    } else if (estado === 'respondida') {
      query += ` AND ni.id_medico_interconsulta IS NOT NULL AND ni.impresion_diagnostica IS NOT NULL AND ni.impresion_diagnostica != ''`;
    } else if (estado === 'en_proceso') {
      query += ` AND ni.id_medico_interconsulta IS NOT NULL AND (ni.impresion_diagnostica IS NULL OR ni.impresion_diagnostica = '')`;
    }

    query += ` ORDER BY dc.fecha_documento DESC`;

    // Paginación
    const offset = (Number(page) - 1) * Number(limit);
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const response: QueryResult = await pool.query(query, params);

    // Contar total de registros para paginación
    let countQuery = `
      SELECT COUNT(*) as total
      FROM nota_interconsulta ni
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      WHERE 1=1
    `;
    
    const countParams: any[] = [];
    let countParamCount = 0;

    if (area_interconsulta) {
      countParamCount++;
      countQuery += ` AND ni.area_interconsulta = $${countParamCount}`;
      countParams.push(area_interconsulta);
    }

    if (medico_solicitante) {
      countParamCount++;
      countQuery += ` AND ni.id_medico_solicitante = $${countParamCount}`;
      countParams.push(medico_solicitante);
    }

    if (fecha_inicio) {
      countParamCount++;
      countQuery += ` AND dc.fecha_documento >= $${countParamCount}`;
      countParams.push(fecha_inicio);
    }

    if (fecha_fin) {
      countParamCount++;
      countQuery += ` AND dc.fecha_documento <= $${countParamCount}`;
      countParams.push(fecha_fin);
    }

    if (estado === 'pendiente') {
      countQuery += ` AND ni.id_medico_interconsulta IS NULL`;
    } else if (estado === 'respondida') {
      countQuery += ` AND ni.id_medico_interconsulta IS NOT NULL AND ni.impresion_diagnostica IS NOT NULL AND ni.impresion_diagnostica != ''`;
    } else if (estado === 'en_proceso') {
      countQuery += ` AND ni.id_medico_interconsulta IS NOT NULL AND (ni.impresion_diagnostica IS NULL OR ni.impresion_diagnostica = '')`;
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return res.status(200).json({
      success: true,
      data: response.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener notas de interconsulta:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas de interconsulta",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotaInterconsultaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        ni.*,
        dc.fecha_documento,
        dc.observaciones as observaciones_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        e.numero_expediente,
        ai.nombre as nombre_area_interconsulta,
        ai.descripcion as descripcion_area,
        pm_sol.nombre || ' ' || pm_sol.apellido_paterno as medico_solicitante,
        pm_sol_rel.numero_cedula as cedula_solicitante,
        pm_sol_rel.especialidad as especialidad_solicitante,
        pm_int.nombre || ' ' || pm_int.apellido_paterno as medico_interconsulta,
        pm_int_rel.numero_cedula as cedula_interconsulta,
        pm_int_rel.especialidad as especialidad_interconsulta,
        s.nombre_servicio,
        CASE 
          WHEN ni.id_medico_interconsulta IS NULL THEN 'Pendiente'
          WHEN ni.impresion_diagnostica IS NULL OR ni.impresion_diagnostica = '' THEN 'En Proceso'
          ELSE 'Respondida'
        END as estado_interconsulta,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos,
        -- Información del internamiento
        int.fecha_ingreso,
        c.numero as numero_cama,
        c.area as area_cama
      FROM nota_interconsulta ni
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN area_interconsulta ai ON ni.area_interconsulta = ai.id_area_interconsulta
      LEFT JOIN personal_medico pm_sol_rel ON ni.id_medico_solicitante = pm_sol_rel.id_personal_medico
      LEFT JOIN persona pm_sol ON pm_sol_rel.id_persona = pm_sol.id_persona
      LEFT JOIN personal_medico pm_int_rel ON ni.id_medico_interconsulta = pm_int_rel.id_personal_medico
      LEFT JOIN persona pm_int ON pm_int_rel.id_persona = pm_int.id_persona
      LEFT JOIN internamiento int_serv ON dc.id_internamiento = int_serv.id_internamiento
      LEFT JOIN servicio s ON int_serv.id_servicio = s.id_servicio
      LEFT JOIN internamiento int ON dc.id_internamiento = int.id_internamiento
      LEFT JOIN cama c ON int.id_cama = c.id_cama
      WHERE ni.id_nota_interconsulta = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota de interconsulta no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener nota de interconsulta por ID:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener nota de interconsulta",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createNotaInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      id_documento,
      area_interconsulta,
      motivo_interconsulta,
      diagnostico_presuntivo,
      examenes_laboratorio = false,
      examenes_gabinete = false,
      hallazgos,
      impresion_diagnostica,
      recomendaciones,
      id_medico_solicitante,
      id_medico_interconsulta
    }: NotaInterconsulta = req.body;

    // Validaciones
    if (!motivo_interconsulta || motivo_interconsulta.trim() === '') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "El motivo de interconsulta es obligatorio"
      });
    }

    // Validar que el documento clínico existe
    const docQuery = await client.query(
      'SELECT id_documento FROM documento_clinico WHERE id_documento = $1',
      [id_documento]
    );

    if (docQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "El documento clínico especificado no existe"
      });
    }

    // Validar que el área de interconsulta existe si se especifica
    if (area_interconsulta) {
      const areaQuery = await client.query(
        'SELECT id_area_interconsulta FROM area_interconsulta WHERE id_area_interconsulta = $1',
        [area_interconsulta]
      );

      if (areaQuery.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: "El área de interconsulta especificada no existe"
        });
      }
    }

    // Insertar nota de interconsulta
    const insertQuery = `
      INSERT INTO nota_interconsulta (
        id_documento, area_interconsulta, motivo_interconsulta, diagnostico_presuntivo,
        examenes_laboratorio, examenes_gabinete, hallazgos, impresion_diagnostica,
        recomendaciones, id_medico_solicitante, id_medico_interconsulta
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const response: QueryResult = await client.query(insertQuery, [
      id_documento, area_interconsulta, motivo_interconsulta, diagnostico_presuntivo,
      examenes_laboratorio, examenes_gabinete, hallazgos, impresion_diagnostica,
      recomendaciones, id_medico_solicitante, id_medico_interconsulta
    ]);

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: "Nota de interconsulta creada exitosamente",
      data: response.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear nota de interconsulta:', error);
    return res.status(500).json({
      success: false,
      message: "Error al crear nota de interconsulta",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    client.release();
  }
};

export const updateNotaInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const updateData: Partial<NotaInterconsulta> = req.body;

    // Verificar que la nota existe
    const existsQuery = await client.query(
      'SELECT id_nota_interconsulta FROM nota_interconsulta WHERE id_nota_interconsulta = $1',
      [id]
    );

    if (existsQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: "Nota de interconsulta no encontrada"
      });
    }

    // Construir query dinámico para actualización
    const fields = Object.keys(updateData).filter(key => updateData[key as keyof NotaInterconsulta] !== undefined);
    const values = fields.map(field => updateData[field as keyof NotaInterconsulta]);
    
    if (fields.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "No hay campos para actualizar"
      });
    }

    // Validar área de interconsulta si se está actualizando
    if (updateData.area_interconsulta) {
      const areaQuery = await client.query(
        'SELECT id_area_interconsulta FROM area_interconsulta WHERE id_area_interconsulta = $1',
        [updateData.area_interconsulta]
      );

      if (areaQuery.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: "El área de interconsulta especificada no existe"
        });
      }
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const updateQuery = `
      UPDATE nota_interconsulta 
      SET ${setClause}
      WHERE id_nota_interconsulta = $1
      RETURNING *
    `;

    const response: QueryResult = await client.query(updateQuery, [id, ...values]);

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: "Nota de interconsulta actualizada exitosamente",
      data: response.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar nota de interconsulta:', error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar nota de interconsulta",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    client.release();
  }
};

export const deleteNotaInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const response: QueryResult = await pool.query(
      "DELETE FROM nota_interconsulta WHERE id_nota_interconsulta = $1 RETURNING *",
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota de interconsulta no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota de interconsulta eliminada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar nota de interconsulta:', error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar nota de interconsulta",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// ==========================================
// FUNCIONES ESPECÍFICAS Y CONSULTAS AVANZADAS
// ==========================================

export const getNotasInterconsultaByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;
    
    const query = `
      SELECT 
        ni.*,
        dc.fecha_documento,
        ai.nombre as nombre_area_interconsulta,
        pm_sol.nombre || ' ' || pm_sol.apellido_paterno as medico_solicitante,
        pm_int.nombre || ' ' || pm_int.apellido_paterno as medico_interconsulta,
        CASE 
          WHEN ni.id_medico_interconsulta IS NULL THEN 'Pendiente'
          WHEN ni.impresion_diagnostica IS NULL OR ni.impresion_diagnostica = '' THEN 'En Proceso'
          ELSE 'Respondida'
        END as estado_interconsulta
      FROM nota_interconsulta ni
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      LEFT JOIN area_interconsulta ai ON ni.area_interconsulta = ai.id_area_interconsulta
      LEFT JOIN personal_medico pm_sol_rel ON ni.id_medico_solicitante = pm_sol_rel.id_personal_medico
      LEFT JOIN persona pm_sol ON pm_sol_rel.id_persona = pm_sol.id_persona
      LEFT JOIN personal_medico pm_int_rel ON ni.id_medico_interconsulta = pm_int_rel.id_personal_medico
      LEFT JOIN persona pm_int ON pm_int_rel.id_persona = pm_int.id_persona
      WHERE dc.id_expediente = $1
      ORDER BY dc.fecha_documento DESC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas de interconsulta por expediente:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas de interconsulta por expediente",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotasInterconsultaByPaciente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_paciente } = req.params;
    
    const query = `
      SELECT 
        ni.*,
        dc.fecha_documento,
        e.numero_expediente,
        ai.nombre as nombre_area_interconsulta,
        pm_sol.nombre || ' ' || pm_sol.apellido_paterno as medico_solicitante,
        pm_int.nombre || ' ' || pm_int.apellido_paterno as medico_interconsulta,
        CASE 
          WHEN ni.id_medico_interconsulta IS NULL THEN 'Pendiente'
          WHEN ni.impresion_diagnostica IS NULL OR ni.impresion_diagnostica = '' THEN 'En Proceso'
          ELSE 'Respondida'
        END as estado_interconsulta
      FROM nota_interconsulta ni
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN area_interconsulta ai ON ni.area_interconsulta = ai.id_area_interconsulta
      LEFT JOIN personal_medico pm_sol_rel ON ni.id_medico_solicitante = pm_sol_rel.id_personal_medico
      LEFT JOIN persona pm_sol ON pm_sol_rel.id_persona = pm_sol.id_persona
      LEFT JOIN personal_medico pm_int_rel ON ni.id_medico_interconsulta = pm_int_rel.id_personal_medico
      LEFT JOIN persona pm_int ON pm_int_rel.id_persona = pm_int.id_persona
      WHERE e.id_paciente = $1
      ORDER BY dc.fecha_documento DESC
    `;

    const response: QueryResult = await pool.query(query, [id_paciente]);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas de interconsulta por paciente:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas de interconsulta por paciente",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const searchNotasInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { query: searchQuery } = req.params;
    
    const query = `
      SELECT 
        ni.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        ai.nombre as nombre_area_interconsulta,
        CASE 
          WHEN ni.id_medico_interconsulta IS NULL THEN 'Pendiente'
          WHEN ni.impresion_diagnostica IS NULL OR ni.impresion_diagnostica = '' THEN 'En Proceso'
          ELSE 'Respondida'
        END as estado_interconsulta
      FROM nota_interconsulta ni
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN area_interconsulta ai ON ni.area_interconsulta = ai.id_area_interconsulta
      WHERE 
        ni.motivo_interconsulta ILIKE $1 OR
        ni.diagnostico_presuntivo ILIKE $1 OR
        ni.impresion_diagnostica ILIKE $1 OR
        ai.nombre ILIKE $1 OR
        p.nombre ILIKE $1 OR
        p.apellido_paterno ILIKE $1 OR
        e.numero_expediente ILIKE $1
      ORDER BY dc.fecha_documento DESC
      LIMIT 20
    `;

    const response: QueryResult = await pool.query(query, [`%${searchQuery}%`]);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al buscar notas de interconsulta:', error);
    return res.status(500).json({
      success: false,
      message: "Error al buscar notas de interconsulta",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotasInterconsultaPendientes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { area_interconsulta, medico_interconsulta } = req.query;
    
    let query = `
      SELECT 
        ni.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        ai.nombre as nombre_area_interconsulta,
        pm_sol.nombre || ' ' || pm_sol.apellido_paterno as medico_solicitante,
        s.nombre_servicio,
        c.numero as numero_cama,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - dc.fecha_documento)) as dias_pendiente
      FROM nota_interconsulta ni
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN area_interconsulta ai ON ni.area_interconsulta = ai.id_area_interconsulta
      LEFT JOIN personal_medico pm_sol_rel ON ni.id_medico_solicitante = pm_sol_rel.id_personal_medico
      LEFT JOIN persona pm_sol ON pm_sol_rel.id_persona = pm_sol.id_persona
      LEFT JOIN internamiento int_serv ON dc.id_internamiento = int_serv.id_internamiento
      LEFT JOIN servicio s ON int_serv.id_servicio = s.id_servicio
      LEFT JOIN internamiento int ON dc.id_internamiento = int.id_internamiento
      LEFT JOIN cama c ON int.id_cama = c.id_cama
      WHERE ni.id_medico_interconsulta IS NULL
    `;

    const params: any[] = [];
    let paramCount = 0;

    if (area_interconsulta) {
      paramCount++;
      query += ` AND ni.area_interconsulta = $${paramCount}`;
      params.push(area_interconsulta);
    }

    query += ` ORDER BY dc.fecha_documento ASC`;

    const response: QueryResult = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      data: response.rows,
      total_pendientes: response.rows.length
    });
  } catch (error) {
    console.error('Error al obtener notas de interconsulta pendientes:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas de interconsulta pendientes",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const asignarMedicoInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { id_medico_interconsulta } = req.body;

    if (!id_medico_interconsulta) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "El ID del médico de interconsulta es obligatorio"
      });
    }

    // Verificar que la nota existe y está pendiente
    const notaQuery = await client.query(
      'SELECT id_nota_interconsulta, id_medico_interconsulta FROM nota_interconsulta WHERE id_nota_interconsulta = $1',
      [id]
    );

    if (notaQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: "Nota de interconsulta no encontrada"
      });
    }

    if (notaQuery.rows[0].id_medico_interconsulta) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Esta interconsulta ya tiene un médico asignado"
      });
    }

    // Verificar que el médico existe
    const medicoQuery = await client.query(
      'SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1 AND activo = true',
      [id_medico_interconsulta]
    );

    if (medicoQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "El médico especificado no existe o no está activo"
      });
    }

    // Asignar médico de interconsulta
    const updateQuery = `
      UPDATE nota_interconsulta 
      SET id_medico_interconsulta = $2
      WHERE id_nota_interconsulta = $1
      RETURNING *
    `;

    const response: QueryResult = await client.query(updateQuery, [id, id_medico_interconsulta]);

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: "Médico de interconsulta asignado exitosamente",
      data: response.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al asignar médico de interconsulta:', error);
    return res.status(500).json({
      success: false,
      message: "Error al asignar médico de interconsulta",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    client.release();
  }
};

export const responderInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { 
      hallazgos,
      impresion_diagnostica,
      recomendaciones,
      examenes_laboratorio,
      examenes_gabinete 
    } = req.body;

    if (!impresion_diagnostica || impresion_diagnostica.trim() === '') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "La impresión diagnóstica es obligatoria para responder la interconsulta"
      });
    }

    // Verificar que la nota existe y tiene médico asignado
    const notaQuery = await client.query(
      'SELECT id_nota_interconsulta, id_medico_interconsulta FROM nota_interconsulta WHERE id_nota_interconsulta = $1',
      [id]
    );

    if (notaQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: "Nota de interconsulta no encontrada"
      });
    }

    if (!notaQuery.rows[0].id_medico_interconsulta) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Esta interconsulta debe tener un médico asignado antes de ser respondida"
      });
    }

    // Actualizar la respuesta de interconsulta
    const updateQuery = `
      UPDATE nota_interconsulta 
      SET 
        hallazgos = COALESCE($2, hallazgos),
        impresion_diagnostica = $3,
        recomendaciones = COALESCE($4, recomendaciones),
        examenes_laboratorio = COALESCE($5, examenes_laboratorio),
        examenes_gabinete = COALESCE($6, examenes_gabinete)
      WHERE id_nota_interconsulta = $1
      RETURNING *
    `;

    const response: QueryResult = await client.query(updateQuery, [
      id, hallazgos, impresion_diagnostica, recomendaciones, 
      examenes_laboratorio, examenes_gabinete
    ]);

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: "Interconsulta respondida exitosamente",
      data: response.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al responder interconsulta:', error);
    return res.status(500).json({
      success: false,
      message: "Error al responder interconsulta",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    client.release();
  }
};

export const estadisticasInterconsultas = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Estadísticas por área de interconsulta
    const porAreaQuery = `
      SELECT 
        ai.nombre as area,
        COUNT(ni.id_nota_interconsulta) as total_interconsultas,
        COUNT(CASE WHEN ni.id_medico_interconsulta IS NULL THEN 1 END) as pendientes,
        COUNT(CASE WHEN ni.id_medico_interconsulta IS NOT NULL AND 
                         (ni.impresion_diagnostica IS NULL OR ni.impresion_diagnostica = '') THEN 1 END) as en_proceso,
        COUNT(CASE WHEN ni.impresion_diagnostica IS NOT NULL AND ni.impresion_diagnostica != '' THEN 1 END) as respondidas,
        ROUND(AVG(EXTRACT(DAY FROM (CURRENT_TIMESTAMP - dc.fecha_documento))), 1) as promedio_dias_respuesta
      FROM area_interconsulta ai
      LEFT JOIN nota_interconsulta ni ON ai.id_area_interconsulta = ni.area_interconsulta
      LEFT JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      WHERE dc.fecha_documento >= CURRENT_DATE - INTERVAL '90 days'
      GROUP BY ai.id_area_interconsulta, ai.nombre
      ORDER BY total_interconsultas DESC
    `;

    // Estadísticas por mes
    const porMesQuery = `
      SELECT 
        DATE_TRUNC('month', dc.fecha_documento) as mes,
        COUNT(*) as total_interconsultas,
        COUNT(CASE WHEN ni.id_medico_interconsulta IS NULL THEN 1 END) as pendientes,
        COUNT(CASE WHEN ni.impresion_diagnostica IS NOT NULL AND ni.impresion_diagnostica != '' THEN 1 END) as respondidas
      FROM nota_interconsulta ni
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      WHERE dc.fecha_documento >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', dc.fecha_documento)
      ORDER BY mes DESC
    `;

    // Médicos más solicitados
    const medicosQuery = `
      SELECT 
        p.nombre || ' ' || p.apellido_paterno as medico_solicitante,
        pm.especialidad,
        COUNT(ni.id_nota_interconsulta) as total_solicitudes
      FROM nota_interconsulta ni
      JOIN personal_medico pm ON ni.id_medico_solicitante = pm.id_personal_medico
      JOIN persona p ON pm.id_persona = p.id_persona
      JOIN documento_clinico dc ON ni.id_documento = dc.id_documento
      WHERE dc.fecha_documento >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY pm.id_personal_medico, p.nombre, p.apellido_paterno, pm.especialidad
      ORDER BY total_solicitudes DESC
      LIMIT 10
    `;

    const [porAreaResult, porMesResult, medicosResult] = await Promise.all([
      pool.query(porAreaQuery),
      pool.query(porMesQuery),
      pool.query(medicosQuery)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        por_area: porAreaResult.rows,
        por_mes: porMesResult.rows,
        medicos_mas_solicitantes: medicosResult.rows
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de interconsultas:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getAreasInterconsultaDisponibles = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        ai.id_area_interconsulta,
        ai.nombre,
        ai.descripcion,
        COUNT(pm.id_personal_medico) as medicos_disponibles
      FROM area_interconsulta ai
      LEFT JOIN personal_medico pm ON pm.especialidad ILIKE '%' || ai.nombre || '%' AND pm.activo = true
      WHERE ai.activo = true
      GROUP BY ai.id_area_interconsulta, ai.nombre, ai.descripcion
      ORDER BY ai.nombre
    `;

    const response: QueryResult = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener áreas de interconsulta disponibles:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener áreas de interconsulta disponibles",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const validarInterconsultaCompleta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        ni.*,
        CASE 
          WHEN ni.motivo_interconsulta IS NULL OR ni.motivo_interconsulta = '' THEN false
          ELSE true
        END as tiene_motivo,
        CASE 
          WHEN ni.id_medico_interconsulta IS NULL THEN false
          ELSE true
        END as tiene_medico_asignado,
        CASE 
          WHEN ni.impresion_diagnostica IS NULL OR ni.impresion_diagnostica = '' THEN false
          ELSE true
        END as tiene_impresion_diagnostica,
        CASE 
          WHEN ni.recomendaciones IS NULL OR ni.recomendaciones = '' THEN false
          ELSE true
        END as tiene_recomendaciones
      FROM nota_interconsulta ni
      WHERE ni.id_nota_interconsulta = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota de interconsulta no encontrada"
      });
    }

    const nota = response.rows[0];
    const camposObligatorios = ['tiene_motivo', 'tiene_medico_asignado', 'tiene_impresion_diagnostica'];
    const camposFaltantes = camposObligatorios.filter(campo => !nota[campo]);
    
    const esCompleta = camposFaltantes.length === 0;
    const estado = nota.id_medico_interconsulta ? 
      (nota.tiene_impresion_diagnostica ? 'Respondida' : 'En Proceso') : 'Pendiente';

    return res.status(200).json({
      success: true,
      data: {
        id_nota_interconsulta: nota.id_nota_interconsulta,
        es_completa: esCompleta,
        estado: estado,
        validacion: {
          motivo_interconsulta: nota.tiene_motivo,
          medico_asignado: nota.tiene_medico_asignado,
          impresion_diagnostica: nota.tiene_impresion_diagnostica,
          recomendaciones: nota.tiene_recomendaciones
        },
        campos_faltantes: camposFaltantes.map(campo => campo.replace('tiene_', ''))
      }
    });
  } catch (error) {
    console.error('Error al validar interconsulta:', error);
    return res.status(500).json({
      success: false,
      message: "Error al validar interconsulta",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};