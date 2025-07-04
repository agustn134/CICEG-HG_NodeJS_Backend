// src/controllers/documentos_clinicos/documento_clinico.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACES
// ==========================================
interface DocumentoClinicoRequest {
  id_expediente: number;
  id_internamiento?: number;
  id_tipo_documento: number;
  fecha_elaboracion?: string;
  id_personal_creador: number;
  estado?: 'Activo' | 'Cancelado' | 'Anulado' | 'Borrador';
}

interface DocumentoClinicoFilter {
  page?: number;
  limit?: number;
  id_expediente?: number;
  id_internamiento?: number;
  id_tipo_documento?: number;
  estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  buscar?: string;
}

// ==========================================
// OBTENER TODOS LOS DOCUMENTOS CLÍNICOS CON FILTROS
// ==========================================
export const getDocumentosClinicos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      page = 1,
      limit = 10,
      id_expediente,
      id_internamiento,
      id_tipo_documento,
      estado,
      fecha_inicio,
      fecha_fin,
      buscar
    } = req.query as any;

    // Validar parámetros de paginación
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    // ✅ CONSULTA CORREGIDA: estructura correcta de tablas
    let baseQuery = `
      SELECT 
        dc.*,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as paciente_nombre,
        td.nombre as tipo_documento_nombre,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as personal_creador_nombre,
        pm.especialidad,
        i.fecha_ingreso,
        i.motivo_ingreso,
        s.nombre as servicio_nombre
      FROM documento_clinico dc
      LEFT JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM documento_clinico dc
      LEFT JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Aplicar filtros
    if (id_expediente) {
      conditions.push(`dc.id_expediente = $${values.length + 1}`);
      values.push(id_expediente);
    }

    if (id_internamiento) {
      conditions.push(`dc.id_internamiento = $${values.length + 1}`);
      values.push(id_internamiento);
    }

    if (id_tipo_documento) {
      conditions.push(`dc.id_tipo_documento = $${values.length + 1}`);
      values.push(id_tipo_documento);
    }

    if (estado) {
      conditions.push(`dc.estado = $${values.length + 1}`);
      values.push(estado);
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
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
        td.nombre ILIKE $${values.length + 1}
      )`);
      values.push(`%${buscar}%`);
    }

    // Agregar condiciones WHERE si existen
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
      pool.query(countQuery, values.slice(0, -2)) // Sin los parámetros de paginación
    ]);

    const total = parseInt(countResponse.rows[0].total);
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      message: 'Documentos clínicos obtenidos correctamente',
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
    console.error('Error al obtener documentos clínicos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener documentos clínicos',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER DOCUMENTO CLÍNICO POR ID
// ==========================================
export const getDocumentoClinicoById = async (req: Request, res: Response): Promise<Response> => {
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
        dc.*,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as paciente_nombre,
        td.nombre as tipo_documento_nombre,
        td.descripcion as tipo_documento_descripcion,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as personal_creador_nombre,
        pm.especialidad,
        pm.numero_cedula as cedula_profesional,
        i.fecha_ingreso,
        i.fecha_egreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        s.nombre as servicio_nombre
      FROM documento_clinico dc
      LEFT JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE dc.id_documento = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Documento clínico no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Documento clínico obtenido correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener documento clínico por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener documento clínico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER DOCUMENTOS POR EXPEDIENTE
// ==========================================
export const getDocumentosByExpediente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expedienteId } = req.params;
    const { 
      fecha_inicio, 
      fecha_fin, 
      tipo_documento, 
      estado = 'Activo',
      limit = 50,
      offset = 0 
    } = req.query;

    let query = `
      SELECT 
        dc.id_documento,
        dc.fecha_elaboracion,
        dc.estado,
        
        -- Datos del tipo de documento
        td.nombre as tipo_documento,
        td.descripcion as descripcion_tipo_documento,
        
        -- Datos del expediente
        e.numero_expediente,
        e.fecha_apertura,
        
        -- Datos del paciente ✅ CORREGIDO: usar estructura correcta
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad,
        
        -- Datos del médico creador ✅ CORREGIDO: pm_p.nombre en lugar de pm.nombres
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno, ' ', COALESCE(pm_p.apellido_materno, '')) as medico_creador,
        pm.especialidad as especialidad_medico,
        pm.numero_cedula as cedula_medico,
        
        -- Datos del internamiento (si aplica)
        i.id_internamiento,
        i.fecha_ingreso,
        i.fecha_egreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        s.nombre as servicio,
        
        -- Datos de la cama (si aplica) ✅ CORREGIDO: estructura de cama
        c.numero as numero_cama,
        c.area as area_cama,
        c.subarea as subarea_cama
        
      FROM documento_clinico dc
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      WHERE dc.id_expediente = $1
    `;

    const params: any[] = [expedienteId];
    let paramCounter = 2;

    // Aplicar filtros
    if (estado && estado !== 'todos') {
      query += ` AND dc.estado = $${paramCounter}`;
      params.push(estado);
      paramCounter++;
    }

    if (fecha_inicio) {
      query += ` AND DATE(dc.fecha_elaboracion) >= $${paramCounter}`;
      params.push(fecha_inicio);
      paramCounter++;
    }

    if (fecha_fin) {
      query += ` AND DATE(dc.fecha_elaboracion) <= $${paramCounter}`;
      params.push(fecha_fin);
      paramCounter++;
    }

    if (tipo_documento) {
      query += ` AND td.nombre ILIKE $${paramCounter}`;
      params.push(`%${tipo_documento}%`);
      paramCounter++;
    }

    // Ordenar por fecha más reciente
    query += ` ORDER BY dc.fecha_elaboracion DESC`;

    // Paginación
    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Consulta para contar total de documentos
    let countQuery = `
      SELECT COUNT(*) as total
      FROM documento_clinico dc
      JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      WHERE dc.id_expediente = $1
    `;

    const countParams: any[] = [expedienteId];
    let countParamCounter = 2;

    if (estado && estado !== 'todos') {
      countQuery += ` AND dc.estado = $${countParamCounter}`;
      countParams.push(estado);
      countParamCounter++;
    }

    if (fecha_inicio) {
      countQuery += ` AND DATE(dc.fecha_elaboracion) >= $${countParamCounter}`;
      countParams.push(fecha_inicio);
      countParamCounter++;
    }

    if (fecha_fin) {
      countQuery += ` AND DATE(dc.fecha_elaboracion) <= $${countParamCounter}`;
      countParams.push(fecha_fin);
      countParamCounter++;
    }

    if (tipo_documento) {
      countQuery += ` AND td.nombre ILIKE $${countParamCounter}`;
      countParams.push(`%${tipo_documento}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    const response = {
      success: true,
      message: 'Documentos obtenidos exitosamente',
      data: result.rows,
      pagination: {
        page: Math.floor(Number(offset) / Number(limit)) + 1,
        limit: Number(limit),
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
        hasNext: Number(offset) + Number(limit) < total,
        hasPrev: Number(offset) > 0
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error al obtener documentos del expediente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener documentos',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// ==========================================
// CREAR NUEVO DOCUMENTO CLÍNICO
// ==========================================
export const createDocumentoClinico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_expediente,
      id_internamiento,
      id_tipo_documento,
      fecha_elaboracion,
      id_personal_creador,
      estado = 'Activo'
    }: DocumentoClinicoRequest = req.body;

    // Validaciones obligatorias
    if (!id_expediente || !id_tipo_documento || !id_personal_creador) {
      return res.status(400).json({
        success: false,
        message: 'Los campos id_expediente, id_tipo_documento e id_personal_creador son obligatorios'
      });
    }

    // Verificar que el expediente existe
    const expedienteCheck = await pool.query(
      'SELECT id_expediente FROM expediente WHERE id_expediente = $1',
      [id_expediente]
    );

    if (expedienteCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El expediente especificado no existe'
      });
    }

    // Verificar que el tipo de documento existe y está activo
    const tipoDocumentoCheck = await pool.query(
      'SELECT id_tipo_documento FROM tipo_documento WHERE id_tipo_documento = $1 AND activo = true',
      [id_tipo_documento]
    );

    if (tipoDocumentoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El tipo de documento especificado no existe o no está activo'
      });
    }

    // Verificar que el personal médico existe
    const personalCheck = await pool.query(
      'SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1',
      [id_personal_creador]
    );

    if (personalCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El personal médico especificado no existe'
      });
    }

    // Verificar internamiento si se proporciona
    if (id_internamiento) {
      const internamientoCheck = await pool.query(
        'SELECT id_internamiento FROM internamiento WHERE id_internamiento = $1 AND id_expediente = $2',
        [id_internamiento, id_expediente]
      );

      if (internamientoCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'El internamiento especificado no existe o no pertenece al expediente'
        });
      }
    }

    // Crear documento clínico
    const query = `
      INSERT INTO documento_clinico (
        id_expediente, 
        id_internamiento, 
        id_tipo_documento, 
        fecha_elaboracion, 
        id_personal_creador, 
        estado
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;

    const values = [
      id_expediente,
      id_internamiento || null,
      id_tipo_documento,
      fecha_elaboracion || new Date(),
      id_personal_creador,
      estado
    ];

    const response: QueryResult = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Documento clínico creado correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al crear documento clínico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear documento clínico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR DOCUMENTO CLÍNICO
// ==========================================
export const updateDocumentoClinico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {
      id_expediente,
      id_internamiento,
      id_tipo_documento,
      fecha_elaboracion,
      id_personal_creador,
      estado
    }: DocumentoClinicoRequest = req.body;

    // Validar que el ID sea un número
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que el documento existe
    const documentoCheck = await pool.query(
      'SELECT id_documento FROM documento_clinico WHERE id_documento = $1',
      [id]
    );

    if (documentoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Documento clínico no encontrado'
      });
    }

    // Realizar las mismas validaciones que en create (si se proporcionan los valores)
    if (id_expediente) {
      const expedienteCheck = await pool.query(
        'SELECT id_expediente FROM expediente WHERE id_expediente = $1',
        [id_expediente]
      );

      if (expedienteCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'El expediente especificado no existe'
        });
      }
    }

    if (id_tipo_documento) {
      const tipoDocumentoCheck = await pool.query(
        'SELECT id_tipo_documento FROM tipo_documento WHERE id_tipo_documento = $1 AND activo = true',
        [id_tipo_documento]
      );

      if (tipoDocumentoCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'El tipo de documento especificado no existe o no está activo'
        });
      }
    }

    if (id_personal_creador) {
      const personalCheck = await pool.query(
        'SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1',
        [id_personal_creador]
      );

      if (personalCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'El personal médico especificado no existe'
        });
      }
    }

    // Actualizar documento
    const query = `
      UPDATE documento_clinico 
      SET 
        id_expediente = COALESCE($1, id_expediente),
        id_internamiento = COALESCE($2, id_internamiento),
        id_tipo_documento = COALESCE($3, id_tipo_documento),
        fecha_elaboracion = COALESCE($4, fecha_elaboracion),
        id_personal_creador = COALESCE($5, id_personal_creador),
        estado = COALESCE($6, estado)
      WHERE id_documento = $7 
      RETURNING *
    `;

    const values = [
      id_expediente,
      id_internamiento,
      id_tipo_documento,
      fecha_elaboracion,
      id_personal_creador,
      estado,
      id
    ];

    const response: QueryResult = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: 'Documento clínico actualizado correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar documento clínico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar documento clínico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR DOCUMENTO CLÍNICO (CAMBIAR ESTADO)
// ==========================================
export const deleteDocumentoClinico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un número
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // En lugar de eliminar físicamente, cambiar estado a 'Anulado'
    const response: QueryResult = await pool.query(
      'UPDATE documento_clinico SET estado = $1 WHERE id_documento = $2 RETURNING *',
      ['Anulado', id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Documento clínico no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Documento clínico anulado correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al anular documento clínico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al anular documento clínico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE DOCUMENTOS CLÍNICOS
// ==========================================
export const getEstadisticasDocumentos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const queries = {
      totalDocumentos: `
        SELECT COUNT(*) as total 
        FROM documento_clinico 
        WHERE estado != 'Anulado'
      `,
      documentosPorTipo: `
        SELECT 
          td.nombre as tipo_documento,
          COUNT(dc.id_documento) as cantidad
        FROM tipo_documento td
        LEFT JOIN documento_clinico dc ON td.id_tipo_documento = dc.id_tipo_documento 
          AND dc.estado != 'Anulado'
        WHERE td.activo = true
        GROUP BY td.id_tipo_documento, td.nombre
        ORDER BY cantidad DESC
      `,
      documentosPorEstado: `
        SELECT 
          estado,
          COUNT(*) as cantidad
        FROM documento_clinico
        GROUP BY estado
        ORDER BY cantidad DESC
      `,
      documentosRecientes: `
        SELECT 
          DATE(fecha_elaboracion) as fecha,
          COUNT(*) as cantidad
        FROM documento_clinico
        WHERE fecha_elaboracion >= NOW() - INTERVAL '30 days'
          AND estado != 'Anulado'
        GROUP BY DATE(fecha_elaboracion)
        ORDER BY fecha DESC
        LIMIT 30
      `
    };

    const [total, porTipo, porEstado, recientes] = await Promise.all([
      pool.query(queries.totalDocumentos),
      pool.query(queries.documentosPorTipo),
      pool.query(queries.documentosPorEstado),
      pool.query(queries.documentosRecientes)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de documentos clínicos obtenidas correctamente',
      data: {
        total: parseInt(total.rows[0].total),
        documentosPorTipo: porTipo.rows,
        documentosPorEstado: porEstado.rows,
        documentosRecientes: recientes.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};