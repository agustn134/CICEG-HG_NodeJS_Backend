// src/controllers/documentos_clinicos/nota_urgencias.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACES
// ==========================================
interface NotaUrgenciasRequest {
  id_documento: number;
  motivo_atencion: string;
  estado_conciencia?: string;
  resumen_interrogatorio?: string;
  exploracion_fisica?: string;
  resultados_estudios?: string;
  estado_mental?: string;
  diagnostico?: string;
  id_guia_diagnostico?: number;
  plan_tratamiento?: string;
  pronostico?: string;
  area_interconsulta?: number;
}

interface NotaUrgenciasFilter {
  page?: number;
  limit?: number;
  id_documento?: number;
  id_expediente?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  buscar?: string;
  estado_conciencia?: string;
  area_interconsulta?: number;
  prioridad_triage?: string;
}

// ==========================================
// OBTENER TODAS LAS NOTAS DE URGENCIAS CON FILTROS
// ==========================================
export const getNotasUrgencias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      page = 1,
      limit = 15,
      id_documento,
      id_expediente,
      fecha_inicio,
      fecha_fin,
      buscar,
      estado_conciencia,
      area_interconsulta,
      prioridad_triage
    } = req.query as any;

    // Validar parámetros de paginación
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 15;
    const offset = (pageNum - 1) * limitNum;

    // Query base con JOINs para información completa de urgencias
    let baseQuery = `
      SELECT 
        nu.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        pm.nombres || ' ' || pm.apellido_paterno as medico_urgenciologo,
        pm.especialidad,
        pm.cedula_profesional,
        gc.nombre as guia_clinica_nombre,
        gc.codigo as guia_clinica_codigo,
        ai.nombre as area_interconsulta_nombre,
        s.nombre as servicio_nombre,
        -- Análisis de urgencia
        CASE 
          WHEN nu.estado_conciencia ILIKE '%inconsciente%' OR nu.estado_conciencia ILIKE '%coma%' THEN 'CRÍTICO'
          WHEN nu.estado_conciencia ILIKE '%somnoliento%' OR nu.estado_conciencia ILIKE '%confuso%' THEN 'GRAVE'
          WHEN nu.estado_conciencia ILIKE '%alerta%' OR nu.estado_conciencia ILIKE '%consciente%' THEN 'ESTABLE'
          ELSE 'POR EVALUAR'
        END as nivel_urgencia,
        -- Cálculo de tiempo desde llegada
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - dc.fecha_elaboracion))/3600 as horas_desde_ingreso,
        -- Edad al momento de la atención
        EXTRACT(YEAR FROM AGE(dc.fecha_elaboracion, p.fecha_nacimiento)) as edad_anos,
        -- Indicador de reingreso (si ya tiene notas de urgencias previas)
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM documento_clinico dc2 
            INNER JOIN nota_urgencias nu2 ON dc2.id_documento = nu2.id_documento
            WHERE dc2.id_expediente = dc.id_expediente 
              AND dc2.fecha_elaboracion < dc.fecha_elaboracion
              AND dc2.estado != 'Anulado'
          ) THEN 'REINGRESO'
          ELSE 'PRIMERA VEZ'
        END as tipo_ingreso
      FROM nota_urgencias nu
      INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN guia_clinica gc ON nu.id_guia_diagnostico = gc.id_guia_diagnostico
      LEFT JOIN area_interconsulta ai ON nu.area_interconsulta = ai.id_area_interconsulta
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM nota_urgencias nu
      INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Aplicar filtros
    if (id_documento) {
      conditions.push(`nu.id_documento = $${values.length + 1}`);
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

    if (estado_conciencia) {
      conditions.push(`nu.estado_conciencia ILIKE $${values.length + 1}`);
      values.push(`%${estado_conciencia}%`);
    }

    if (area_interconsulta) {
      conditions.push(`nu.area_interconsulta = $${values.length + 1}`);
      values.push(area_interconsulta);
    }

    if (buscar) {
      conditions.push(`(
        e.numero_expediente ILIKE $${values.length + 1} OR
        (p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
        nu.motivo_atencion ILIKE $${values.length + 1} OR
        nu.diagnostico ILIKE $${values.length + 1} OR
        nu.estado_conciencia ILIKE $${values.length + 1}
      )`);
      values.push(`%${buscar}%`);
    }

    // Solo mostrar documentos no anulados por defecto
    conditions.push(`dc.estado != 'Anulado'`);

    // Agregar condiciones WHERE
    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      baseQuery += whereClause;
      countQuery += whereClause;
    }

    // Agregar ordenamiento y paginación (más recientes primero - urgencias)
    baseQuery += ` ORDER BY dc.fecha_elaboracion DESC, 
                   CASE 
                     WHEN nu.estado_conciencia ILIKE '%inconsciente%' THEN 1
                     WHEN nu.estado_conciencia ILIKE '%grave%' THEN 2
                     ELSE 3
                   END LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
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
      message: 'Notas de urgencias obtenidas correctamente',
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
    console.error('Error al obtener notas de urgencias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener notas de urgencias',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER NOTA DE URGENCIAS POR ID
// ==========================================
export const getNotaUrgenciasById = async (req: Request, res: Response): Promise<Response> => {
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
        nu.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        dc.id_personal_creador,
        e.numero_expediente,
        e.fecha_apertura,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        pac.numero_seguro_social,
        pm.nombres || ' ' || pm.apellido_paterno as medico_urgenciologo,
        pm.especialidad,
        pm.cedula_profesional,
        gc.nombre as guia_clinica_nombre,
        gc.codigo as guia_clinica_codigo,
        gc.descripcion as guia_clinica_descripcion,
        ai.nombre as area_interconsulta_nombre,
        ai.descripcion as area_interconsulta_descripcion,
        s.nombre as servicio_nombre,
        i.fecha_ingreso,
        i.motivo_ingreso,
        -- Signos vitales más recientes
        sv.temperatura,
        sv.presion_arterial_sistolica,
        sv.presion_arterial_diastolica,
        sv.frecuencia_cardiaca,
        sv.frecuencia_respiratoria,
        sv.saturacion_oxigeno,
        sv.fecha_toma as fecha_signos_vitales,
        -- Análisis temporal
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - dc.fecha_elaboracion))/3600 as horas_desde_atencion,
        EXTRACT(YEAR FROM AGE(dc.fecha_elaboracion, p.fecha_nacimiento)) as edad_anos_atencion
      FROM nota_urgencias nu
      INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN guia_clinica gc ON nu.id_guia_diagnostico = gc.id_guia_diagnostico
      LEFT JOIN area_interconsulta ai ON nu.area_interconsulta = ai.id_area_interconsulta
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN signos_vitales sv ON dc.id_documento = sv.id_documento
      WHERE nu.id_nota_urgencias = $1
      ORDER BY sv.fecha_toma DESC
      LIMIT 1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de urgencias no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de urgencias obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener nota de urgencias por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener nota de urgencias',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR NUEVA NOTA DE URGENCIAS
// ==========================================
export const createNotaUrgencias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      motivo_atencion,
      estado_conciencia,
      resumen_interrogatorio,
      exploracion_fisica,
      resultados_estudios,
      estado_mental,
      diagnostico,
      id_guia_diagnostico,
      plan_tratamiento,
      pronostico,
      area_interconsulta
    }: NotaUrgenciasRequest = req.body;

    // Validaciones obligatorias
    if (!id_documento || !motivo_atencion || motivo_atencion.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Los campos id_documento y motivo_atencion son obligatorios'
      });
    }

    // Verificar que el documento clínico existe y no está anulado
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
        message: 'No se puede crear una nota de urgencias para un documento anulado'
      });
    }

    // Verificar que no exista ya una nota de urgencias para este documento
    const notaExistente = await pool.query(
      'SELECT id_nota_urgencias FROM nota_urgencias WHERE id_documento = $1',
      [id_documento]
    );

    if (notaExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una nota de urgencias para este documento'
      });
    }

    // Verificar guía clínica si se proporciona
    if (id_guia_diagnostico) {
      const guiaCheck = await pool.query(
        'SELECT id_guia_diagnostico FROM guia_clinica WHERE id_guia_diagnostico = $1 AND activo = true',
        [id_guia_diagnostico]
      );

      if (guiaCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'La guía clínica especificada no existe o no está activa'
        });
      }
    }

    // Verificar área de interconsulta si se proporciona
    if (area_interconsulta) {
      const areaCheck = await pool.query(
        'SELECT id_area_interconsulta FROM area_interconsulta WHERE id_area_interconsulta = $1 AND activo = true',
        [area_interconsulta]
      );

      if (areaCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'El área de interconsulta especificada no existe o no está activa'
        });
      }
    }

    // Crear nota de urgencias
    const query = `
      INSERT INTO nota_urgencias (
        id_documento, motivo_atencion, estado_conciencia, resumen_interrogatorio,
        exploracion_fisica, resultados_estudios, estado_mental, diagnostico,
        id_guia_diagnostico, plan_tratamiento, pronostico, area_interconsulta
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *
    `;

    const values = [
      id_documento,
      motivo_atencion.trim(),
      estado_conciencia?.trim() || null,
      resumen_interrogatorio?.trim() || null,
      exploracion_fisica?.trim() || null,
      resultados_estudios?.trim() || null,
      estado_mental?.trim() || null,
      diagnostico?.trim() || null,
      id_guia_diagnostico || null,
      plan_tratamiento?.trim() || null,
      pronostico?.trim() || null,
      area_interconsulta || null
    ];

    const response: QueryResult = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Nota de urgencias creada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al crear nota de urgencias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear nota de urgencias',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR NOTA DE URGENCIAS
// ==========================================
export const updateNotaUrgencias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<NotaUrgenciasRequest> = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que la nota de urgencias existe
    const notaCheck = await pool.query(
      'SELECT id_nota_urgencias FROM nota_urgencias WHERE id_nota_urgencias = $1',
      [id]
    );

    if (notaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de urgencias no encontrada'
      });
    }

    // Verificar guía clínica si se proporciona
    if (updateData.id_guia_diagnostico) {
      const guiaCheck = await pool.query(
        'SELECT id_guia_diagnostico FROM guia_clinica WHERE id_guia_diagnostico = $1 AND activo = true',
        [updateData.id_guia_diagnostico]
      );

      if (guiaCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'La guía clínica especificada no existe o no está activa'
        });
      }
    }

    // Verificar área de interconsulta si se proporciona
    if (updateData.area_interconsulta) {
      const areaCheck = await pool.query(
        'SELECT id_area_interconsulta FROM area_interconsulta WHERE id_area_interconsulta = $1 AND activo = true',
        [updateData.area_interconsulta]
      );

      if (areaCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'El área de interconsulta especificada no existe o no está activa'
        });
      }
    }

    // Construir query dinámico solo con campos proporcionados
    const fields = Object.keys(updateData);
    const values: any[] = [];
    const setClause = fields.map((field, index) => {
      let value = updateData[field as keyof NotaUrgenciasRequest];
      if (typeof value === 'string') {
        value = value.trim();
      }
      values.push(value);
      return `${field} = $${index + 1}`;
    }).join(', ');

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    values.push(id);

    const query = `
      UPDATE nota_urgencias 
      SET ${setClause}
      WHERE id_nota_urgencias = $${values.length}
      RETURNING *
    `;

    const response: QueryResult = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: 'Nota de urgencias actualizada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar nota de urgencias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar nota de urgencias',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ANULAR NOTA DE URGENCIAS
// ==========================================
export const deleteNotaUrgencias = async (req: Request, res: Response): Promise<Response> => {
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
      FROM nota_urgencias nu
      WHERE documento_clinico.id_documento = nu.id_documento 
        AND nu.id_nota_urgencias = $1
      RETURNING documento_clinico.id_documento, nu.id_nota_urgencias
    `, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de urgencias no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de urgencias anulada correctamente',
      data: { id_nota_urgencias: id, estado: 'Anulado' }
    });

  } catch (error) {
    console.error('Error al anular nota de urgencias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al anular nota de urgencias',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER NOTAS DE URGENCIAS POR EXPEDIENTE
// ==========================================
export const getNotasUrgenciasByExpediente = async (req: Request, res: Response): Promise<Response> => {
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
        nu.*,
        dc.fecha_elaboracion as fecha_documento,
        pm.nombres || ' ' || pm.apellido_paterno as medico_urgenciologo,
        pm.especialidad,
        ai.nombre as area_interconsulta_nombre,
        gc.nombre as guia_clinica_nombre,
        s.nombre as servicio_nombre,
        -- Número de atención en urgencias
        ROW_NUMBER() OVER (ORDER BY dc.fecha_elaboracion) as numero_atencion,
        -- Tiempo entre atenciones
        EXTRACT(EPOCH FROM (dc.fecha_elaboracion - LAG(dc.fecha_elaboracion) OVER (ORDER BY dc.fecha_elaboracion)))/3600 as horas_desde_atencion_anterior
      FROM nota_urgencias nu
      INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN area_interconsulta ai ON nu.area_interconsulta = ai.id_area_interconsulta
      LEFT JOIN guia_clinica gc ON nu.id_guia_diagnostico = gc.id_guia_diagnostico
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE dc.id_expediente = $1 
        AND dc.estado != 'Anulado'
      ORDER BY dc.fecha_elaboracion DESC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    return res.status(200).json({
      success: true,
      message: 'Notas de urgencias del expediente obtenidas correctamente',
      data: response.rows
    });

  } catch (error) {
    console.error('Error al obtener notas de urgencias del expediente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener notas de urgencias del expediente',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER NOTA DE URGENCIAS POR DOCUMENTO
// ==========================================
export const getNotaUrgenciasByDocumento = async (req: Request, res: Response): Promise<Response> => {
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
        nu.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        pm.nombres || ' ' || pm.apellido_paterno as medico_urgenciologo,
        pm.especialidad,
        ai.nombre as area_interconsulta_nombre,
        gc.nombre as guia_clinica_nombre
      FROM nota_urgencias nu
      INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN area_interconsulta ai ON nu.area_interconsulta = ai.id_area_interconsulta
      LEFT JOIN guia_clinica gc ON nu.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE nu.id_documento = $1
    `;

    const response: QueryResult = await pool.query(query, [id_documento]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de urgencias no encontrada para el documento especificado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de urgencias obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener nota de urgencias por documento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener nota de urgencias',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE URGENCIAS
// ==========================================
export const getEstadisticasUrgencias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { periodo = 30 } = req.query as any;

    const queries = {
      totalAtenciones: `
        SELECT COUNT(*) as total 
        FROM nota_urgencias nu
        INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
        WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '${parseInt(periodo)} days'
          AND dc.estado != 'Anulado'
      `,
      motivosAtencion: `
        SELECT 
          SUBSTRING(nu.motivo_atencion, 1, 50) as motivo_corto,
          COUNT(*) as cantidad
        FROM nota_urgencias nu
        INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
        WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '${parseInt(periodo)} days'
          AND dc.estado != 'Anulado'
        GROUP BY SUBSTRING(nu.motivo_atencion, 1, 50)
        ORDER BY cantidad DESC
        LIMIT 10
      `,
      estadosConciencia: `
        SELECT 
          CASE 
            WHEN nu.estado_conciencia ILIKE '%inconsciente%' OR nu.estado_conciencia ILIKE '%coma%' THEN 'Crítico'
            WHEN nu.estado_conciencia ILIKE '%somnoliento%' OR nu.estado_conciencia ILIKE '%confuso%' THEN 'Grave'
            WHEN nu.estado_conciencia ILIKE '%alerta%' OR nu.estado_conciencia ILIKE '%consciente%' THEN 'Estable'
            WHEN nu.estado_conciencia IS NULL OR nu.estado_conciencia = '' THEN 'No registrado'
            ELSE 'Otros'
          END as categoria_conciencia,
          COUNT(*) as cantidad
        FROM nota_urgencias nu
        INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
        WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '${parseInt(periodo)} days'
          AND dc.estado != 'Anulado'
        GROUP BY categoria_conciencia
        ORDER BY cantidad DESC
      `,
      interconsultasSolicitadas: `
        SELECT 
          ai.nombre as area_interconsulta,
          COUNT(*) as cantidad
        FROM nota_urgencias nu
        INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
        INNER JOIN area_interconsulta ai ON nu.area_interconsulta = ai.id_area_interconsulta
        WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '${parseInt(periodo)} days'
          AND dc.estado != 'Anulado'
          AND nu.area_interconsulta IS NOT NULL
        GROUP BY ai.id_area_interconsulta, ai.nombre
        ORDER BY cantidad DESC
        LIMIT 10
      `,
      atencionePorHora: `
        SELECT 
          EXTRACT(HOUR FROM dc.fecha_elaboracion) as hora,
          COUNT(*) as atenciones
        FROM nota_urgencias nu
        INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
        WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '${parseInt(periodo)} days'
          AND dc.estado != 'Anulado'
        GROUP BY EXTRACT(HOUR FROM dc.fecha_elaboracion)
        ORDER BY hora
      `,
      reingresos: `
        SELECT 
          COUNT(CASE WHEN total_visitas > 1 THEN 1 END) as pacientes_reingreso,
          COUNT(*) as total_pacientes,
          ROUND(
            (COUNT(CASE WHEN total_visitas > 1 THEN 1 END)::decimal / COUNT(*)) * 100, 2
          ) as porcentaje_reingreso
        FROM (
          SELECT 
            e.id_expediente,
            COUNT(nu.id_nota_urgencias) as total_visitas
          FROM expediente e
          INNER JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
          INNER JOIN nota_urgencias nu ON dc.id_documento = nu.id_documento
          WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '${parseInt(periodo)} days'
            AND dc.estado != 'Anulado'
          GROUP BY e.id_expediente
        ) subq
      `,
      promedioTiempoAtencion: `
        SELECT 
          ROUND(AVG(EXTRACT(EPOCH FROM (
            COALESCE(
              (SELECT MIN(dc2.fecha_elaboracion) 
               FROM documento_clinico dc2 
               WHERE dc2.id_expediente = dc.id_expediente 
                 AND dc2.fecha_elaboracion > dc.fecha_elaboracion),
              dc.fecha_elaboracion + INTERVAL '2 hours'
            ) - dc.fecha_elaboracion
          )) / 60), 2) as promedio_minutos_atencion
        FROM nota_urgencias nu
        INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
        WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '${parseInt(periodo)} days'
          AND dc.estado != 'Anulado'
      `
    };

    const [total, motivos, estados, interconsultas, horas, reingresos, tiempoAtencion] = await Promise.all([
      pool.query(queries.totalAtenciones),
      pool.query(queries.motivosAtencion),
      pool.query(queries.estadosConciencia),
      pool.query(queries.interconsultasSolicitadas),
      pool.query(queries.atencionePorHora),
      pool.query(queries.reingresos),
      pool.query(queries.promedioTiempoAtencion)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de urgencias obtenidas correctamente',
      data: {
        periodo_dias: parseInt(periodo),
        total_atenciones: parseInt(total.rows[0].total),
        motivos_mas_frecuentes: motivos.rows,
        distribucion_estados_conciencia: estados.rows,
        interconsultas_solicitadas: interconsultas.rows,
        atenciones_por_hora: horas.rows,
        analisis_reingresos: reingresos.rows[0],
        promedio_tiempo_atencion_minutos: parseFloat(tiempoAtencion.rows[0].promedio_minutos_atencion) || 0
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de urgencias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER PANEL DE URGENCIAS EN TIEMPO REAL
// ==========================================
export const getPanelUrgenciasTiempoReal = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        nu.id_nota_urgencias,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad,
        p.sexo,
        nu.motivo_atencion,
        nu.estado_conciencia,
        nu.diagnostico,
        dc.fecha_elaboracion as hora_llegada,
        pm.nombres || ' ' || pm.apellido_paterno as medico_atencion,
        ai.nombre as interconsulta_solicitada,
        -- Tiempo de espera/atención
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - dc.fecha_elaboracion))/60 as minutos_desde_llegada,
        -- Prioridad calculada
        CASE 
          WHEN nu.estado_conciencia ILIKE '%inconsciente%' OR nu.estado_conciencia ILIKE '%coma%' THEN 1
          WHEN nu.estado_conciencia ILIKE '%grave%' OR nu.estado_conciencia ILIKE '%crítico%' THEN 2
          WHEN nu.estado_conciencia ILIKE '%somnoliento%' OR nu.estado_conciencia ILIKE '%confuso%' THEN 3
          WHEN nu.motivo_atencion ILIKE '%dolor%chest%' OR nu.motivo_atencion ILIKE '%infarto%' THEN 2
          WHEN nu.motivo_atencion ILIKE '%accidente%' OR nu.motivo_atencion ILIKE '%trauma%' THEN 2
          WHEN EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) < 2 OR EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) > 65 THEN 3
          ELSE 4
        END as prioridad_triage,
        -- Estado del paciente
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM documento_clinico dc2 
            WHERE dc2.id_expediente = dc.id_expediente 
              AND dc2.fecha_elaboracion > dc.fecha_elaboracion
              AND dc2.estado != 'Anulado'
          ) THEN 'ATENDIDO'
          WHEN nu.area_interconsulta IS NOT NULL THEN 'EN_INTERCONSULTA'
          WHEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - dc.fecha_elaboracion))/60 > 120 THEN 'ESPERA_PROLONGADA'
          ELSE 'EN_ATENCION'
        END as estado_actual
      FROM nota_urgencias nu
      INNER JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN area_interconsulta ai ON nu.area_interconsulta = ai.id_area_interconsulta
      WHERE dc.fecha_elaboracion >= CURRENT_DATE -- Solo hoy
        AND dc.estado != 'Anulado'
        AND NOT EXISTS (
          SELECT 1 FROM internamiento i 
          WHERE i.id_expediente = dc.id_expediente 
            AND i.fecha_egreso IS NOT NULL
            AND i.fecha_egreso > dc.fecha_elaboracion
        ) -- Excluir pacientes ya dados de alta
      ORDER BY prioridad_triage ASC, dc.fecha_elaboracion ASC
    `;

    const response: QueryResult = await pool.query(query);

    // Análisis del panel
    const analisis = {
      total_pacientes: response.rows.length,
      por_prioridad: {
        criticos: response.rows.filter(r => r.prioridad_triage === 1).length,
        urgentes: response.rows.filter(r => r.prioridad_triage === 2).length,
        menos_urgentes: response.rows.filter(r => r.prioridad_triage === 3).length,
        no_urgentes: response.rows.filter(r => r.prioridad_triage === 4).length
      },
      por_estado: {
        en_atencion: response.rows.filter(r => r.estado_actual === 'EN_ATENCION').length,
        en_interconsulta: response.rows.filter(r => r.estado_actual === 'EN_INTERCONSULTA').length,
        espera_prolongada: response.rows.filter(r => r.estado_actual === 'ESPERA_PROLONGADA').length,
        atendidos: response.rows.filter(r => r.estado_actual === 'ATENDIDO').length
      },
      tiempo_espera_promedio: response.rows.length > 0 ? 
        response.rows.reduce((sum, r) => sum + r.minutos_desde_llegada, 0) / response.rows.length : 0
    };

    return res.status(200).json({
      success: true,
      message: 'Panel de urgencias en tiempo real obtenido correctamente',
      data: response.rows,
      analisis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al obtener panel de urgencias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener panel de urgencias',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// BUSCAR PACIENTES FRECUENTES EN URGENCIAS
// ==========================================
export const getPacientesFrecuentesUrgencias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { meses = 6, minimo_visitas = 3 } = req.query as any;

    const query = `
      SELECT 
        e.id_expediente,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad,
        p.sexo,
        COUNT(nu.id_nota_urgencias) as total_visitas_urgencias,
        MIN(dc.fecha_elaboracion) as primera_visita,
        MAX(dc.fecha_elaboracion) as ultima_visita,
        -- Días entre primera y última visita
        EXTRACT(EPOCH FROM (MAX(dc.fecha_elaboracion) - MIN(dc.fecha_elaboracion)))/86400 as dias_entre_visitas,
        -- Motivos más frecuentes
        STRING_AGG(DISTINCT SUBSTRING(nu.motivo_atencion, 1, 30), ' | ' ORDER BY SUBSTRING(nu.motivo_atencion, 1, 30)) as motivos_frecuentes,
        -- Diagnósticos más frecuentes
        STRING_AGG(DISTINCT SUBSTRING(nu.diagnostico, 1, 30), ' | ' ORDER BY SUBSTRING(nu.diagnostico, 1, 30)) as diagnosticos_frecuentes,
        -- Promedio de días entre visitas
        CASE 
          WHEN COUNT(nu.id_nota_urgencias) > 1 THEN 
            ROUND(EXTRACT(EPOCH FROM (MAX(dc.fecha_elaboracion) - MIN(dc.fecha_elaboracion)))/86400 / (COUNT(nu.id_nota_urgencias) - 1), 1)
          ELSE NULL
        END as promedio_dias_entre_visitas
      FROM expediente e
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      INNER JOIN nota_urgencias nu ON dc.id_documento = nu.id_documento
      WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '${parseInt(meses)} months'
        AND dc.estado != 'Anulado'
      GROUP BY e.id_expediente, e.numero_expediente, p.nombres, p.apellido_paterno, 
               p.apellido_materno, p.fecha_nacimiento, p.sexo
      HAVING COUNT(nu.id_nota_urgencias) >= ${parseInt(minimo_visitas)}
      ORDER BY total_visitas_urgencias DESC, ultima_visita DESC
    `;

    const response: QueryResult = await pool.query(query);

    return res.status(200).json({
      success: true,
      message: 'Pacientes frecuentes en urgencias obtenidos correctamente',
      data: response.rows,
      parametros: {
        periodo_meses: parseInt(meses),
        minimo_visitas: parseInt(minimo_visitas),
        total_pacientes_frecuentes: response.rows.length
      }
    });

  } catch (error) {
    console.error('Error al obtener pacientes frecuentes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener pacientes frecuentes',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};