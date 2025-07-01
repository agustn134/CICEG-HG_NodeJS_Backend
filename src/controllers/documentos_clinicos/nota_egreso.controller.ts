// src/controllers/documentos_clinicos/nota_egreso.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// Interfaces para TypeScript
interface NotaEgreso {
  id_nota_egreso?: number;
  id_documento: number;
  diagnostico_ingreso?: string;
  resumen_evolucion?: string;
  manejo_hospitalario?: string;
  diagnostico_egreso?: string;
  id_guia_diagnostico?: number;
  procedimientos_realizados?: string;
  fecha_procedimientos?: string;
  motivo_egreso?: string;
  problemas_pendientes?: string;
  plan_tratamiento?: string;
  recomendaciones_vigilancia?: string;
  atencion_factores_riesgo?: string;
  pronostico?: string;
  reingreso_por_misma_afeccion?: boolean;
}

// ==========================================
// FUNCIONES CRUD BÁSICAS - CORREGIDAS
// ==========================================

export const getNotasEgreso = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page = 1, limit = 10, motivo_egreso, fecha_inicio, fecha_fin } = req.query;
    
    let query = `
      SELECT 
        ne.*,
        dc.fecha_elaboracion as fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        gc.nombre as nombre_guia_diagnostico
      FROM nota_egreso ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    // Filtros dinámicos
    if (motivo_egreso) {
      paramCount++;
      query += ` AND ne.motivo_egreso ILIKE $${paramCount}`;
      params.push(`%${motivo_egreso}%`);
    }

    if (fecha_inicio) {
      paramCount++;
      query += ` AND dc.fecha_elaboracion >= $${paramCount}`;
      params.push(fecha_inicio);
    }

    if (fecha_fin) {
      paramCount++;
      query += ` AND dc.fecha_elaboracion <= $${paramCount}`;
      params.push(fecha_fin);
    }

    query += ` ORDER BY dc.fecha_elaboracion DESC`;

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
      FROM nota_egreso ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      WHERE 1=1
    `;
    
    const countParams: any[] = [];
    let countParamCount = 0;

    if (motivo_egreso) {
      countParamCount++;
      countQuery += ` AND ne.motivo_egreso ILIKE $${countParamCount}`;
      countParams.push(`%${motivo_egreso}%`);
    }

    if (fecha_inicio) {
      countParamCount++;
      countQuery += ` AND dc.fecha_elaboracion >= $${countParamCount}`;
      countParams.push(fecha_inicio);
    }

    if (fecha_fin) {
      countParamCount++;
      countQuery += ` AND dc.fecha_elaboracion <= $${countParamCount}`;
      countParams.push(fecha_fin);
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
    console.error('Error al obtener notas de egreso:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas de egreso",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotaEgresoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        ne.*,
        dc.fecha_elaboracion as fecha_documento,
        dc.observaciones as observaciones_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        pm_rel.numero_cedula,
        gc.nombre as nombre_guia_diagnostico,
        e.numero_expediente,
        s.nombre_servicio
      FROM nota_egreso ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
      LEFT JOIN servicio s ON dc.id_servicio = s.id_servicio
      WHERE ne.id_nota_egreso = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota de egreso no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener nota de egreso por ID:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener nota de egreso",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createNotaEgreso = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      id_documento,
      diagnostico_ingreso,
      resumen_evolucion,
      manejo_hospitalario,
      diagnostico_egreso,
      id_guia_diagnostico,
      procedimientos_realizados,
      fecha_procedimientos,
      motivo_egreso,
      problemas_pendientes,
      plan_tratamiento,
      recomendaciones_vigilancia,
      atencion_factores_riesgo,
      pronostico,
      reingreso_por_misma_afeccion = false
    }: NotaEgreso = req.body;

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

    // Validar que no exista ya una nota de egreso para este documento
    const existingNoteQuery = await client.query(
      'SELECT id_nota_egreso FROM nota_egreso WHERE id_documento = $1',
      [id_documento]
    );

    if (existingNoteQuery.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Ya existe una nota de egreso para este documento clínico"
      });
    }

    // Insertar nota de egreso
    const insertQuery = `
      INSERT INTO nota_egreso (
        id_documento, diagnostico_ingreso, resumen_evolucion, manejo_hospitalario,
        diagnostico_egreso, id_guia_diagnostico, procedimientos_realizados,
        fecha_procedimientos, motivo_egreso, problemas_pendientes, plan_tratamiento,
        recomendaciones_vigilancia, atencion_factores_riesgo, pronostico,
        reingreso_por_misma_afeccion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const response: QueryResult = await client.query(insertQuery, [
      id_documento, 
      diagnostico_ingreso || null, 
      resumen_evolucion || null, 
      manejo_hospitalario || null,
      diagnostico_egreso || null, 
      id_guia_diagnostico || null, 
      procedimientos_realizados || null,
      fecha_procedimientos || null, 
      motivo_egreso || null, 
      problemas_pendientes || null, 
      plan_tratamiento || null,
      recomendaciones_vigilancia || null, 
      atencion_factores_riesgo || null, 
      pronostico || null,
      reingreso_por_misma_afeccion
    ]);

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: "Nota de egreso creada exitosamente",
      data: response.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear nota de egreso:', error);
    return res.status(500).json({
      success: false,
      message: "Error al crear nota de egreso",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    client.release();
  }
};

export const updateNotaEgreso = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const updateData: Partial<NotaEgreso> = req.body;

    // Verificar que la nota existe
    const existsQuery = await client.query(
      'SELECT id_nota_egreso FROM nota_egreso WHERE id_nota_egreso = $1',
      [id]
    );

    if (existsQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: "Nota de egreso no encontrada"
      });
    }

    // Construir query dinámico para actualización
    const fields = Object.keys(updateData).filter(key => updateData[key as keyof NotaEgreso] !== undefined);
    const values = fields.map(field => updateData[field as keyof NotaEgreso]);
    
    if (fields.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "No hay campos para actualizar"
      });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const updateQuery = `
      UPDATE nota_egreso 
      SET ${setClause}
      WHERE id_nota_egreso = $1
      RETURNING *
    `;

    const response: QueryResult = await client.query(updateQuery, [id, ...values]);

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: "Nota de egreso actualizada exitosamente",
      data: response.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar nota de egreso:', error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar nota de egreso",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    client.release();
  }
};

export const deleteNotaEgreso = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const response: QueryResult = await pool.query(
      "DELETE FROM nota_egreso WHERE id_nota_egreso = $1 RETURNING *",
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota de egreso no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota de egreso eliminada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar nota de egreso:', error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar nota de egreso",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// ==========================================
// FUNCIONES ESPECÍFICAS Y CONSULTAS AVANZADAS - CORREGIDAS
// ==========================================

export const getNotasEgresoByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;
    
    const query = `
      SELECT 
        ne.*,
        dc.fecha_elaboracion as fecha_documento,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico
      FROM nota_egreso ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      WHERE dc.id_expediente = $1
      ORDER BY dc.fecha_elaboracion DESC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas de egreso por expediente:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas de egreso por expediente",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotasEgresoByPaciente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_paciente } = req.params;
    
    const query = `
      SELECT 
        ne.*,
        dc.fecha_elaboracion as fecha_documento,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico
      FROM nota_egreso ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      WHERE e.id_paciente = $1
      ORDER BY dc.fecha_elaboracion DESC
    `;

    const response: QueryResult = await pool.query(query, [id_paciente]);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas de egreso por paciente:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas de egreso por paciente",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const searchNotasEgreso = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { query: searchQuery } = req.params;
    
    const query = `
      SELECT 
        ne.*,
        dc.fecha_elaboracion,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente
      FROM nota_egreso ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE 
        ne.diagnostico_egreso ILIKE $1 OR
        ne.motivo_egreso ILIKE $1 OR
        ne.problemas_pendientes ILIKE $1 OR
        p.nombre ILIKE $1 OR
        p.apellido_paterno ILIKE $1 OR
        e.numero_expediente ILIKE $1
      ORDER BY dc.fecha_elaboracion DESC
      LIMIT 20
    `;

    const response: QueryResult = await pool.query(query, [`%${searchQuery}%`]);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al buscar notas de egreso:', error);
    return res.status(500).json({
      success: false,
      message: "Error al buscar notas de egreso",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotasEgresoWithDetails = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit = 10 } = req.query;
    
    const query = `
      SELECT 
        ne.*,
        dc.fecha_elaboracion,
        dc.observaciones as observaciones_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        gc.nombre as nombre_guia_diagnostico,
        e.numero_expediente,
        s.nombre_servicio,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos
      FROM nota_egreso ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
      LEFT JOIN servicio s ON dc.id_servicio = s.id_servicio
      ORDER BY dc.fecha_elaboracion DESC
      LIMIT $1
    `;

    const response: QueryResult = await pool.query(query, [limit]);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas de egreso con detalles:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas de egreso con detalles",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const estadisticasNotasEgreso = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Estadísticas por motivo de egreso
    const motivosQuery = `
      SELECT 
        motivo_egreso,
        COUNT(*) as cantidad,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM nota_egreso)), 2) as porcentaje
      FROM nota_egreso
      WHERE motivo_egreso IS NOT NULL
      GROUP BY motivo_egreso
      ORDER BY cantidad DESC
    `;

    // Estadísticas por mes
    const porMesQuery = `
      SELECT 
        DATE_TRUNC('month', dc.fecha_elaboracion) as mes,
        COUNT(*) as cantidad_egresos
      FROM nota_egreso ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      WHERE dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', dc.fecha_elaboracion)
      ORDER BY mes DESC
    `;

    // Reingresos
    const reingresosQuery = `
      SELECT 
        COUNT(*) as total_reingresos,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM nota_egreso)), 2) as porcentaje_reingresos
      FROM nota_egreso
      WHERE reingreso_por_misma_afeccion = true
    `;

    const [motivosResult, porMesResult, reingresosResult] = await Promise.all([
      pool.query(motivosQuery),
      pool.query(porMesQuery),
      pool.query(reingresosQuery)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        motivos_egreso: motivosResult.rows,
        egresos_por_mes: porMesResult.rows,
        reingresos: reingresosResult.rows[0]
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de notas de egreso:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const validarNotaEgreso = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        ne.*,
        CASE 
          WHEN ne.diagnostico_egreso IS NULL OR ne.diagnostico_egreso = '' THEN false
          ELSE true
        END as tiene_diagnostico_egreso,
        CASE 
          WHEN ne.motivo_egreso IS NULL OR ne.motivo_egreso = '' THEN false
          ELSE true
        END as tiene_motivo_egreso,
        CASE 
          WHEN ne.plan_tratamiento IS NULL OR ne.plan_tratamiento = '' THEN false
          ELSE true
        END as tiene_plan_tratamiento
      FROM nota_egreso ne
      WHERE ne.id_nota_egreso = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota de egreso no encontrada"
      });
    }

    const nota = response.rows[0];
    const camposObligatorios = ['tiene_diagnostico_egreso', 'tiene_motivo_egreso', 'tiene_plan_tratamiento'];
    const camposFaltantes = camposObligatorios.filter(campo => !nota[campo]);
    
    const esCompleta = camposFaltantes.length === 0;

    return res.status(200).json({
      success: true,
      data: {
        id_nota_egreso: nota.id_nota_egreso,
        es_completa: esCompleta,
        campos_obligatorios: {
          diagnostico_egreso: nota.tiene_diagnostico_egreso,
          motivo_egreso: nota.tiene_motivo_egreso,
          plan_tratamiento: nota.tiene_plan_tratamiento
        },
        campos_faltantes: camposFaltantes.map(campo => campo.replace('tiene_', ''))
      }
    });
  } catch (error) {
    console.error('Error al validar nota de egreso:', error);
    return res.status(500).json({
      success: false,
      message: "Error al validar nota de egreso",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};