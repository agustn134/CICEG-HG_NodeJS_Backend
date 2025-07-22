// src/controllers/documentos_clinicos/consentimiento_informado.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACES
// ==========================================
interface ConsentimientoRequest {
  id_expediente: number;
  id_personal_medico: number;
  tipo_procedimiento: string;
  descripcion_procedimiento: string;
  riesgos_beneficios: string;
  alternativas: string;
  consentimiento_otorgado: boolean;
  observaciones?: string;
  testigo_nombre?: string;
  testigo_identificacion?: string;
  familiar_responsable?: string;
  parentesco?: string;
}

// ==========================================
// OBTENER TODOS LOS CONSENTIMIENTOS
// ==========================================
export const getConsentimientos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      id_expediente, 
      tipo_procedimiento, 
      consentimiento_otorgado,
      fecha_desde,
      fecha_hasta,
      buscar 
    } = req.query as any;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT 
        ci.*,
        e.numero_expediente,
        pac.numero_expediente as paciente_expediente,
        CONCAT(p.nombres, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as paciente_nombre,
        CONCAT(pm_p.nombres, ' ', pm_p.apellido_paterno, ' ', COALESCE(pm_p.apellido_materno, '')) as medico_nombre,
        pm.especialidad as medico_especialidad,
        pm.cedula_profesional
      FROM consentimiento_informado ci
      INNER JOIN expediente e ON ci.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN personal_medico pm ON ci.id_personal_medico = pm.id_personal_medico
      INNER JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCounter = 1;

    // Filtros
    if (id_expediente) {
      query += ` AND e.id_expediente = $${paramCounter}`;
      params.push(id_expediente);
      paramCounter++;
    }

    if (tipo_procedimiento) {
      query += ` AND ci.tipo_procedimiento ILIKE $${paramCounter}`;
      params.push(`%${tipo_procedimiento}%`);
      paramCounter++;
    }

    if (consentimiento_otorgado !== undefined) {
      query += ` AND ci.consentimiento_otorgado = $${paramCounter}`;
      params.push(consentimiento_otorgado === 'true');
      paramCounter++;
    }

    if (fecha_desde) {
      query += ` AND ci.fecha_creacion >= $${paramCounter}`;
      params.push(fecha_desde);
      paramCounter++;
    }

    if (fecha_hasta) {
      query += ` AND ci.fecha_creacion <= $${paramCounter}`;
      params.push(fecha_hasta);
      paramCounter++;
    }

    if (buscar) {
      query += ` AND (
        ci.tipo_procedimiento ILIKE $${paramCounter} OR
        ci.descripcion_procedimiento ILIKE $${paramCounter} OR
        CONCAT(p.nombres, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) ILIKE $${paramCounter} OR
        CONCAT(pm_p.nombres, ' ', pm_p.apellido_paterno, ' ', COALESCE(pm_p.apellido_materno, '')) ILIKE $${paramCounter}
      )`;
      params.push(`%${buscar}%`);
      paramCounter++;
    }

    // Contar total
    const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
    const countResponse: QueryResult = await pool.query(countQuery, params);
    const total = parseInt(countResponse.rows[0].total);

    // Agregar ordenamiento y paginación
    query += ` ORDER BY ci.fecha_creacion DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    params.push(limitNum, offset);

    const response: QueryResult = await pool.query(query, params);
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      message: 'Consentimientos informados obtenidos correctamente',
      data: response.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error al obtener consentimientos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener consentimientos',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// ==========================================
// OBTENER CONSENTIMIENTO POR ID
// ==========================================
export const getConsentimientoById = async (req: Request, res: Response): Promise<Response> => {
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
        ci.*,
        e.numero_expediente,
        CONCAT(p.nombres, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as paciente_nombre,
        p.fecha_nacimiento as paciente_fecha_nacimiento,
        p.telefono as paciente_telefono,
        CONCAT(pm_p.nombres, ' ', pm_p.apellido_paterno, ' ', COALESCE(pm_p.apellido_materno, '')) as medico_nombre,
        pm.especialidad as medico_especialidad,
        pm.cedula_profesional,
        pm.telefono as medico_telefono
      FROM consentimiento_informado ci
      INNER JOIN expediente e ON ci.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN personal_medico pm ON ci.id_personal_medico = pm.id_personal_medico
      INNER JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE ci.id_consentimiento = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Consentimiento informado no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Consentimiento informado obtenido correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener consentimiento por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener consentimiento',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// ==========================================
// CREAR CONSENTIMIENTO INFORMADO
// ==========================================
export const createConsentimiento = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      id_expediente,
      id_personal_medico,
      tipo_procedimiento,
      descripcion_procedimiento,
      riesgos_beneficios,
      alternativas,
      consentimiento_otorgado,
      observaciones,
      testigo_nombre,
      testigo_identificacion,
      familiar_responsable,
      parentesco
    }: ConsentimientoRequest = req.body;

    // Validaciones básicas
    if (!id_expediente || !id_personal_medico || !tipo_procedimiento || !descripcion_procedimiento) {
      return res.status(400).json({
        success: false,
        message: 'Los campos id_expediente, id_personal_medico, tipo_procedimiento y descripcion_procedimiento son obligatorios'
      });
    }

    if (consentimiento_otorgado === undefined || consentimiento_otorgado === null) {
      return res.status(400).json({
        success: false,
        message: 'El campo consentimiento_otorgado es obligatorio'
      });
    }

    // Verificar que el expediente existe
    const expedienteCheck = await client.query(
      'SELECT id_expediente FROM expediente WHERE id_expediente = $1 AND activo = true',
      [id_expediente]
    );

    if (expedienteCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'El expediente especificado no existe o no está activo'
      });
    }

    // Verificar que el personal médico existe
    const medicoCheck = await client.query(
      'SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1 AND activo = true',
      [id_personal_medico]
    );

    if (medicoCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'El personal médico especificado no existe o no está activo'
      });
    }

    // Crear consentimiento informado
    const insertQuery = `
      INSERT INTO consentimiento_informado (
        id_expediente, id_personal_medico, tipo_procedimiento, descripcion_procedimiento,
        riesgos_beneficios, alternativas, consentimiento_otorgado, observaciones,
        testigo_nombre, testigo_identificacion, familiar_responsable, parentesco
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      id_expediente,
      id_personal_medico,
      tipo_procedimiento.trim(),
      descripcion_procedimiento.trim(),
      riesgos_beneficios?.trim() || null,
      alternativas?.trim() || null,
      consentimiento_otorgado,
      observaciones?.trim() || null,
      testigo_nombre?.trim() || null,
      testigo_identificacion?.trim() || null,
      familiar_responsable?.trim() || null,
      parentesco?.trim() || null
    ];

    const response: QueryResult = await client.query(insertQuery, values);

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Consentimiento informado creado correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear consentimiento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear consentimiento',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  } finally {
    client.release();
  }
};

// ==========================================
// ACTUALIZAR CONSENTIMIENTO INFORMADO
// ==========================================
export const updateConsentimiento = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const updateData: Partial<ConsentimientoRequest> = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que el consentimiento existe
    const consentimientoCheck = await client.query(
      'SELECT id_consentimiento FROM consentimiento_informado WHERE id_consentimiento = $1',
      [id]
    );

    if (consentimientoCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Consentimiento informado no encontrado'
      });
    }

    // Validar expediente si se proporciona
    if (updateData.id_expediente) {
      const expedienteCheck = await client.query(
        'SELECT id_expediente FROM expediente WHERE id_expediente = $1 AND activo = true',
        [updateData.id_expediente]
      );

      if (expedienteCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: 'El expediente especificado no existe o no está activo'
        });
      }
    }

    // Validar personal médico si se proporciona
    if (updateData.id_personal_medico) {
      const medicoCheck = await client.query(
        'SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1 AND activo = true',
        [updateData.id_personal_medico]
      );

      if (medicoCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: 'El personal médico especificado no existe o no está activo'
        });
      }
    }

    // Construir query de actualización dinámicamente
    const fields = Object.keys(updateData);
    const values: any[] = [];
    const setClause = fields.map((field, index) => {
      let value = updateData[field as keyof ConsentimientoRequest];
      if (typeof value === 'string') {
        value = value.trim();
      }
      values.push(value);
      return `${field} = $${index + 1}`;
    }).join(', ');

    if (fields.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    values.push(id);

    const updateQuery = `
      UPDATE consentimiento_informado 
      SET ${setClause}
      WHERE id_consentimiento = $${values.length}
      RETURNING *
    `;

    const response: QueryResult = await client.query(updateQuery, values);

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: 'Consentimiento informado actualizado correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar consentimiento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar consentimiento',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  } finally {
    client.release();
  }
};

// ==========================================
// ELIMINAR CONSENTIMIENTO INFORMADO
// ==========================================
export const deleteConsentimiento = async (req: Request, res: Response): Promise<Response> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que el consentimiento existe
    const consentimientoCheck = await client.query(
      'SELECT id_consentimiento, tipo_procedimiento FROM consentimiento_informado WHERE id_consentimiento = $1',
      [id]
    );

    if (consentimientoCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Consentimiento informado no encontrado'
      });
    }

    // Eliminar consentimiento
    await client.query('DELETE FROM consentimiento_informado WHERE id_consentimiento = $1', [id]);

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: `Consentimiento informado para "${consentimientoCheck.rows[0].tipo_procedimiento}" eliminado correctamente`
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar consentimiento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar consentimiento',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  } finally {
    client.release();
  }
};

// ==========================================
// OBTENER CONSENTIMIENTOS POR EXPEDIENTE
// ==========================================
export const getConsentimientosByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;

    if (!id_expediente || isNaN(parseInt(id_expediente))) {
      return res.status(400).json({
        success: false,
        message: 'El ID del expediente debe ser un número válido'
      });
    }

    const query = `
      SELECT 
        ci.*,
        CONCAT(pm_p.nombres, ' ', pm_p.apellido_paterno, ' ', COALESCE(pm_p.apellido_materno, '')) as medico_nombre,
        pm.especialidad as medico_especialidad,
        pm.cedula_profesional
      FROM consentimiento_informado ci
      INNER JOIN personal_medico pm ON ci.id_personal_medico = pm.id_personal_medico
      INNER JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE ci.id_expediente = $1
      ORDER BY ci.fecha_creacion DESC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    return res.status(200).json({
      success: true,
      message: 'Consentimientos del expediente obtenidos correctamente',
      data: response.rows,
      total: response.rows.length
    });

  } catch (error) {
    console.error('Error al obtener consentimientos por expediente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener consentimientos',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE CONSENTIMIENTOS
// ==========================================
export const getEstadisticasConsentimientos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { fecha_desde, fecha_hasta } = req.query as any;

    let filtroFecha = '';
    const params: any[] = [];

    if (fecha_desde) {
      filtroFecha += ' AND ci.fecha_creacion >= $1';
      params.push(fecha_desde);
    }

    if (fecha_hasta) {
      filtroFecha += ` AND ci.fecha_creacion <= $${params.length + 1}`;
      params.push(fecha_hasta);
    }

    const queries = {
      resumen: `
        SELECT 
          COUNT(*) as total_consentimientos,
          COUNT(CASE WHEN consentimiento_otorgado = true THEN 1 END) as consentimientos_otorgados,
          COUNT(CASE WHEN consentimiento_otorgado = false THEN 1 END) as consentimientos_denegados,
          ROUND(
            (COUNT(CASE WHEN consentimiento_otorgado = true THEN 1 END)::decimal / COUNT(*)) * 100, 2
          ) as porcentaje_otorgados
        FROM consentimiento_informado ci
        WHERE 1=1 ${filtroFecha}
      `,
      porTipoProcedimiento: `
        SELECT 
          tipo_procedimiento,
          COUNT(*) as total,
          COUNT(CASE WHEN consentimiento_otorgado = true THEN 1 END) as otorgados,
          COUNT(CASE WHEN consentimiento_otorgado = false THEN 1 END) as denegados
        FROM consentimiento_informado ci
        WHERE 1=1 ${filtroFecha}
        GROUP BY tipo_procedimiento
        ORDER BY total DESC
        LIMIT 10
      `,
      porMedico: `
        SELECT 
          CONCAT(p.nombres, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as medico_nombre,
          pm.especialidad,
          COUNT(*) as total_consentimientos,
          COUNT(CASE WHEN ci.consentimiento_otorgado = true THEN 1 END) as otorgados
        FROM consentimiento_informado ci
        INNER JOIN personal_medico pm ON ci.id_personal_medico = pm.id_personal_medico
        INNER JOIN persona p ON pm.id_persona = p.id_persona
        WHERE 1=1 ${filtroFecha}
        GROUP BY pm.id_personal_medico, p.nombres, p.apellido_paterno, p.apellido_materno, pm.especialidad
        ORDER BY total_consentimientos DESC
        LIMIT 10
      `
    };

    const [resumen, porTipo, porMedico] = await Promise.all([
      pool.query(queries.resumen, params),
      pool.query(queries.porTipoProcedimiento, params),
      pool.query(queries.porMedico, params)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de consentimientos informados obtenidas correctamente',
      data: {
        resumen: resumen.rows[0],
        por_tipo_procedimiento: porTipo.rows,
        por_medico: porMedico.rows
      },
      periodo: {
        fecha_desde: fecha_desde || 'Sin filtro',
        fecha_hasta: fecha_hasta || 'Sin filtro'
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de consentimientos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};