// src/controllers/documentos_clinicos/nota_evolucion.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACES SEGÚN TU BD REAL (FORMATO SOAP)
// ==========================================
interface NotaEvolucionRequest {
  id_documento: number;
  subjetivo?: string;
  objetivo?: string;
  analisis?: string;
  plan?: string;
}

interface NotaEvolucionFilter {
  page?: number;
  limit?: number;
  id_documento?: number;
  id_expediente?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  buscar?: string;
}

// ==========================================
// CREAR NUEVA NOTA DE EVOLUCIÓN
// ==========================================
export const createNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      subjetivo,
      objetivo,
      analisis,
      plan
    }: NotaEvolucionRequest = req.body;

    // Validaciones obligatorias
    if (!id_documento) {
      return res.status(400).json({
        success: false,
        message: 'El campo id_documento es obligatorio'
      });
    }

    // Verificar que el documento clínico existe
    const documentoCheck = await pool.query(
      'SELECT id_documento, estado FROM documento_clinico WHERE id_documento = $1',
      [id_documento]
    );

    if (documentoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El documento clínico especificado no existe'
      });
    }

    if (documentoCheck.rows[0].estado === 'Anulado') {
      return res.status(400).json({
        success: false,
        message: 'No se puede crear una nota de evolución para un documento anulado'
      });
    }

    // Verificar que no exista ya una nota de evolución para este documento
    const notaExistente = await pool.query(
      'SELECT id_nota_evolucion FROM nota_evolucion WHERE id_documento = $1',
      [id_documento]
    );

    if (notaExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una nota de evolución para este documento'
      });
    }

    // Crear nota de evolución con campos SOAP
    const query = `
      INSERT INTO nota_evolucion (
        id_documento, subjetivo, objetivo, analisis, plan
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;

    const values = [
      id_documento,
      subjetivo?.trim() || null,
      objetivo?.trim() || null,
      analisis?.trim() || null,
      plan?.trim() || null
    ];

    const response: QueryResult = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Nota de evolución creada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al crear nota de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear nota de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER TODAS LAS NOTAS DE EVOLUCIÓN
// ==========================================
export const getNotasEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      page = 1,
      limit = 10,
      id_documento,
      id_expediente,
      fecha_inicio,
      fecha_fin,
      buscar
    } = req.query as any;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Query simplificada que coincide con tu tabla real
    let baseQuery = `
      SELECT 
        ne.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        CASE 
          WHEN pm_rel.id_personal_medico IS NOT NULL 
          THEN pm.nombre || ' ' || pm.apellido_paterno 
          ELSE 'Sin asignar' 
        END as medico_nombre,
        pm_rel.especialidad,
        s.nombre as servicio_nombre
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Aplicar filtros
    if (id_documento) {
      conditions.push(`ne.id_documento = $${values.length + 1}`);
      values.push(id_documento);
    }

    if (id_expediente) {
      conditions.push(`dc.id_expediente = $${values.length + 1}`);
      values.push(id_expediente);
    }

    if (fecha_inicio) {
      conditions.push(`dc.fecha_elaboracion >= $${values.length + 1}`);
      values.push(fecha_inicio);
    }

    if (fecha_fin) {
      conditions.push(`dc.fecha_elaboracion <= $${values.length + 1}`);
      values.push(fecha_fin);
    }

    if (buscar) {
  conditions.push(`(
    e.numero_expediente ILIKE $${values.length + 1} OR
    (p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
    ne.subjetivo ILIKE $${values.length + 1} OR
    ne.objetivo ILIKE $${values.length + 1} OR
    ne.analisis ILIKE $${values.length + 1} OR
    ne.plan ILIKE $${values.length + 1}
  )`);
  // ↑ Agregar $ antes de cada número
  values.push(`%${buscar}%`);
}

    // Solo mostrar documentos no anulados
    conditions.push(`dc.estado != 'Anulado'`);

    // Agregar condiciones WHERE
    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      baseQuery += whereClause;
      countQuery += whereClause;
    }

    // Agregar ordenamiento y paginación
    baseQuery += ` ORDER BY dc.fecha_elaboracion DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limitNum, offset);

    // Ejecutar consultas
    const [dataResponse, countResponse]: [QueryResult, QueryResult] = await Promise.all([
      pool.query(baseQuery, values),
      pool.query(countQuery, values.slice(0, -2))
    ]);

    const total = parseInt(countResponse.rows[0].total);
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      message: 'Notas de evolución obtenidas correctamente',
      data: dataResponse.rows,
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
    console.error('Error al obtener notas de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener notas de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER NOTA DE EVOLUCIÓN POR ID
// ==========================================
export const getNotaEvolucionById = async (req: Request, res: Response): Promise<Response> => {
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
        ne.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        CASE 
          WHEN pm_rel.id_personal_medico IS NOT NULL 
          THEN pm.nombre || ' ' || pm.apellido_paterno 
          ELSE 'Sin asignar' 
        END as medico_nombre,
        pm_rel.especialidad,
        pm_rel.numero_cedula as cedula_profesional,
        s.nombre as servicio_nombre
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE ne.id_nota_evolucion = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de evolución no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener nota de evolución por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener nota de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR NOTA DE EVOLUCIÓN
// ==========================================
export const updateNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<NotaEvolucionRequest> = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que la nota de evolución existe
    const notaCheck = await pool.query(
      'SELECT id_nota_evolucion FROM nota_evolucion WHERE id_nota_evolucion = $1',
      [id]
    );

    if (notaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de evolución no encontrada'
      });
    }

    // Construir query dinámico solo con campos proporcionados
    const fields = Object.keys(updateData).filter(key => key !== 'id_documento'); // No permitir cambiar el documento
    const values: any[] = [];
    const setClause = fields.map((field, index) => {
      let value = updateData[field as keyof NotaEvolucionRequest];
      if (typeof value === 'string') {
        value = value.trim();
      }
      values.push(value);
      return `${field} = ${index + 1}`;
    }).join(', ');

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    values.push(id);

    const query = `
      UPDATE nota_evolucion 
      SET ${setClause}
      WHERE id_nota_evolucion = ${values.length}
      RETURNING *
    `;

    const response: QueryResult = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución actualizada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar nota de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar nota de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR NOTA DE EVOLUCIÓN
// ==========================================
export const deleteNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // En lugar de eliminar físicamente, anular el documento asociado
    const response: QueryResult = await pool.query(`
      UPDATE documento_clinico 
      SET estado = 'Anulado'
      FROM nota_evolucion ne
      WHERE documento_clinico.id_documento = ne.id_documento 
        AND ne.id_nota_evolucion = $1
      RETURNING documento_clinico.id_documento, ne.id_nota_evolucion
    `, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de evolución no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución anulada correctamente',
      data: { id_nota_evolucion: id, estado: 'Anulado' }
    });

  } catch (error) {
    console.error('Error al anular nota de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al anular nota de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER NOTAS DE EVOLUCIÓN POR EXPEDIENTE
// ==========================================
export const getNotasEvolucionByExpediente = async (req: Request, res: Response): Promise<Response> => {
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
        ne.*,
        dc.fecha_elaboracion as fecha_documento,
        CASE 
          WHEN pm_rel.id_personal_medico IS NOT NULL 
          THEN pm.nombre || ' ' || pm.apellido_paterno 
          ELSE 'Sin asignar' 
        END as medico_nombre,
        pm_rel.especialidad,
        s.nombre as servicio_nombre,
        ROW_NUMBER() OVER (ORDER BY dc.fecha_elaboracion) as numero_evolucion
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE dc.id_expediente = $1 
        AND dc.estado != 'Anulado'
      ORDER BY dc.fecha_elaboracion ASC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    return res.status(200).json({
      success: true,
      message: 'Notas de evolución del expediente obtenidas correctamente',
      data: response.rows
    });

  } catch (error) {
    console.error('Error al obtener notas de evolución del expediente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener notas de evolución del expediente',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER NOTA DE EVOLUCIÓN POR DOCUMENTO
// ==========================================
export const getNotaEvolucionByDocumento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_documento } = req.params;

    if (!id_documento || isNaN(parseInt(id_documento))) {
      return res.status(400).json({
        success: false,
        message: 'El ID del documento debe ser un número válido'
      });
    }

    const query = `
      SELECT 
        ne.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        CASE 
          WHEN pm_rel.id_personal_medico IS NOT NULL 
          THEN pm.nombre || ' ' || pm.apellido_paterno 
          ELSE 'Sin asignar' 
        END as medico_nombre,
        pm_rel.especialidad
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      WHERE ne.id_documento = $1
    `;

    const response: QueryResult = await pool.query(query, [id_documento]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de evolución no encontrada para el documento especificado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener nota de evolución por documento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener nota de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS BÁSICAS
// ==========================================
export const getEstadisticasNotasEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const queries = {
      totalNotas: `
        SELECT COUNT(*) as total 
        FROM nota_evolucion ne
        INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
        WHERE dc.estado != 'Anulado'
      `,
      notasRecientes: `
        SELECT 
          DATE(dc.fecha_elaboracion) as fecha,
          COUNT(*) as cantidad
        FROM nota_evolucion ne
        INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
        WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '30 days'
          AND dc.estado != 'Anulado'
        GROUP BY DATE(dc.fecha_elaboracion)
        ORDER BY fecha DESC
        LIMIT 30
      `,
      completitudSOAP: `
        SELECT 
          CASE 
            WHEN ne.subjetivo IS NOT NULL AND ne.subjetivo != '' THEN 1 
            ELSE 0 
          END +
          CASE 
            WHEN ne.objetivo IS NOT NULL AND ne.objetivo != '' THEN 1 
            ELSE 0 
          END +
          CASE 
            WHEN ne.analisis IS NOT NULL AND ne.analisis != '' THEN 1 
            ELSE 0 
          END +
          CASE 
            WHEN ne.plan IS NOT NULL AND ne.plan != '' THEN 1 
            ELSE 0 
          END as campos_completados,
          COUNT(*) as cantidad
        FROM nota_evolucion ne
        INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
        WHERE dc.estado != 'Anulado'
        GROUP BY campos_completados
        ORDER BY campos_completados
      `
    };

    const [total, recientes, completitud] = await Promise.all([
      pool.query(queries.totalNotas),
      pool.query(queries.notasRecientes),
      pool.query(queries.completitudSOAP)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de notas de evolución obtenidas correctamente',
      data: {
        total: parseInt(total.rows[0].total),
        notas_recientes: recientes.rows,
        completitud_soap: completitud.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de notas de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas de notas de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};