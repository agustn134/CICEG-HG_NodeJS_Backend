// src/controllers/documentos_clinicos/prescripcion_medicamento.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// Interfaces para TypeScript
interface PrescripcionMedicamento {
  id_prescripcion?: number;
  id_documento: number;
  id_medicamento: number;
  dosis: string;
  via_administracion: string;
  frecuencia: string;
  duracion?: string;
  indicaciones_especiales?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  activo?: boolean;
}

interface PrescripcionMedicamentoRequest {
  id_documento: number;
  id_medicamento: number;
  dosis: string;
  via_administracion: string;
  frecuencia: string;
  duracion?: string;
  indicaciones_especiales?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  activo?: boolean;
}

// ==========================================
// OBTENER TODAS LAS PRESCRIPCIONES DE MEDICAMENTO
// ==========================================
export const getPrescripcionesMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      id_documento, 
      id_expediente, 
      id_medicamento, 
      activo, 
      grupo_terapeutico, 
      fecha_inicio, 
      fecha_fin, 
      buscar 
    } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Query base con JOINs corregidos
    let baseQuery = `
      SELECT 
        pm.id_prescripcion,
        pm.id_documento,
        pm.id_medicamento,
        pm.dosis,
        pm.via_administracion,
        pm.frecuencia,
        pm.duracion,
        pm.indicaciones_especiales,
        pm.fecha_inicio,
        pm.fecha_fin,
        pm.activo,
        -- Información del medicamento
        m.codigo as codigo_medicamento,
        m.nombre as nombre_medicamento,
        m.presentacion as presentacion_medicamento,
        m.concentracion as concentracion_medicamento,
        m.grupo_terapeutico,
        -- Información del documento
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        -- Información del expediente
        e.numero_expediente,
        -- Información del paciente
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        -- Información del médico
        pm_persona.nombre || ' ' || pm_persona.apellido_paterno as nombre_medico
      FROM prescripcion_medicamento pm
      INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm_persona ON pm_rel.id_persona = pm_persona.id_persona
    `;

    // Query para contar registros
    let countQuery = `
      SELECT COUNT(*) as total
      FROM prescripcion_medicamento pm
      INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Aplicar filtros
    if (id_documento) {
      conditions.push(`pm.id_documento = $${values.length + 1}`);
      values.push(id_documento);
    }

    if (id_expediente) {
      conditions.push(`dc.id_expediente = $${values.length + 1}`);
      values.push(id_expediente);
    }

    if (id_medicamento) {
      conditions.push(`pm.id_medicamento = $${values.length + 1}`);
      values.push(id_medicamento);
    }

    if (activo !== undefined) {
      conditions.push(`pm.activo = $${values.length + 1}`);
      values.push(activo === 'true');
    }

    if (grupo_terapeutico) {
      conditions.push(`m.grupo_terapeutico ILIKE $${values.length + 1}`);
      values.push(`%${grupo_terapeutico}%`);
    }

    if (fecha_inicio) {
      conditions.push(`pm.fecha_inicio >= $${values.length + 1}`);
      values.push(fecha_inicio);
    }

    if (fecha_fin) {
      conditions.push(`pm.fecha_inicio <= $${values.length + 1}`);
      values.push(fecha_fin);
    }

    if (buscar) {
      conditions.push(`(
        e.numero_expediente ILIKE $${values.length + 1} OR
        (p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
        m.nombre ILIKE $${values.length + 1} OR
        m.codigo ILIKE $${values.length + 1} OR
        pm.dosis ILIKE $${values.length + 1}
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

    // Agregar ordenamiento y paginación
    baseQuery += ` ORDER BY pm.fecha_inicio DESC, pm.id_prescripcion DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
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
      message: 'Prescripciones de medicamento obtenidas correctamente',
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
    console.error('Error al obtener prescripciones de medicamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener prescripciones de medicamento',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER PRESCRIPCIÓN DE MEDICAMENTO POR ID
// ==========================================
export const getPrescripcionMedicamentoById = async (req: Request, res: Response): Promise<Response> => {
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
        pm.id_prescripcion,
        pm.id_documento,
        pm.id_medicamento,
        pm.dosis,
        pm.via_administracion,
        pm.frecuencia,
        pm.duracion,
        pm.indicaciones_especiales,
        pm.fecha_inicio,
        pm.fecha_fin,
        pm.activo,
        -- Información del medicamento
        m.codigo as codigo_medicamento,
        m.nombre as nombre_medicamento,
        m.presentacion as presentacion_medicamento,
        m.concentracion as concentracion_medicamento,
        m.grupo_terapeutico,
        -- Información del documento
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        -- Información del expediente
        e.numero_expediente,
        -- Información del paciente
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        -- Información del médico
        pm_persona.nombre || ' ' || pm_persona.apellido_paterno as nombre_medico,
        pm_rel.numero_cedula
      FROM prescripcion_medicamento pm
      INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm_persona ON pm_rel.id_persona = pm_persona.id_persona
      WHERE pm.id_prescripcion = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prescripción de medicamento no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Prescripción de medicamento obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener prescripción de medicamento por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener prescripción de medicamento',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR PRESCRIPCIÓN DE MEDICAMENTO
// ==========================================
export const createPrescripcionMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      id_medicamento,
      dosis,
      via_administracion,
      frecuencia,
      duracion,
      indicaciones_especiales,
      fecha_inicio,
      fecha_fin,
      activo = true
    }: PrescripcionMedicamentoRequest = req.body;

    // Validaciones básicas
    if (!id_documento || !id_medicamento || !dosis || !via_administracion || !frecuencia || !fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: 'Los campos id_documento, id_medicamento, dosis, via_administracion, frecuencia y fecha_inicio son obligatorios'
      });
    }

    // Validar que el documento clínico existe
    const documentoCheck = await pool.query(
      'SELECT id_documento FROM documento_clinico WHERE id_documento = $1',
      [id_documento]
    );

    if (documentoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El documento clínico especificado no existe'
      });
    }

    // Validar que el medicamento existe
    const medicamentoCheck = await pool.query(
      'SELECT id_medicamento, nombre FROM medicamento WHERE id_medicamento = $1 AND activo = true',
      [id_medicamento]
    );

    if (medicamentoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El medicamento especificado no existe o no está activo'
      });
    }

    // Verificar si ya existe una prescripción activa de este medicamento para este documento
    const prescripcionExistente = await pool.query(`
      SELECT 
        pm.id_prescripcion,
        m.nombre as medicamento_nombre
      FROM prescripcion_medicamento pm
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      WHERE pm.id_documento = $1 
        AND pm.id_medicamento = $2 
        AND pm.activo = true
        AND (pm.fecha_fin IS NULL OR pm.fecha_fin >= CURRENT_DATE)
    `, [id_documento, id_medicamento]);

    if (prescripcionExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Ya existe una prescripción activa del medicamento ${prescripcionExistente.rows[0].medicamento_nombre} para este documento`,
        data: {
          prescripcion_existente: prescripcionExistente.rows[0].id_prescripcion
        }
      });
    }

    // Crear prescripción de medicamento
    const query = `
      INSERT INTO prescripcion_medicamento (
        id_documento, id_medicamento, dosis, via_administracion, 
        frecuencia, duracion, indicaciones_especiales, fecha_inicio, 
        fecha_fin, activo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *
    `;

    const values = [
      id_documento,
      id_medicamento,
      dosis.trim(),
      via_administracion.trim(),
      frecuencia.trim(),
      duracion?.trim() || null,
      indicaciones_especiales?.trim() || null,
      fecha_inicio,
      fecha_fin || null,
      activo
    ];

    const response: QueryResult = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Prescripción de medicamento creada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al crear prescripción de medicamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear prescripción de medicamento',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR PRESCRIPCIÓN DE MEDICAMENTO
// ==========================================
export const updatePrescripcionMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<PrescripcionMedicamentoRequest> = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que la prescripción existe
    const prescripcionCheck = await pool.query(
      'SELECT id_prescripcion FROM prescripcion_medicamento WHERE id_prescripcion = $1',
      [id]
    );

    if (prescripcionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prescripción de medicamento no encontrada'
      });
    }

    // Validar medicamento si se proporciona
    if (updateData.id_medicamento) {
      const medicamentoCheck = await pool.query(
        'SELECT id_medicamento FROM medicamento WHERE id_medicamento = $1 AND activo = true',
        [updateData.id_medicamento]
      );

      if (medicamentoCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'El medicamento especificado no existe o no está activo'
        });
      }
    }

    // Construir query dinámico para actualización
    const fields = Object.keys(updateData).filter(key => updateData[key as keyof PrescripcionMedicamentoRequest] !== undefined);
    const values = fields.map(field => updateData[field as keyof PrescripcionMedicamentoRequest]);
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const updateQuery = `
      UPDATE prescripcion_medicamento 
      SET ${setClause}
      WHERE id_prescripcion = $1
      RETURNING *
    `;

    const response: QueryResult = await pool.query(updateQuery, [id, ...values]);

    return res.status(200).json({
      success: true,
      message: 'Prescripción de medicamento actualizada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar prescripción de medicamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar prescripción de medicamento',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// DESACTIVAR PRESCRIPCIÓN DE MEDICAMENTO
// ==========================================
export const deletePrescripcionMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Desactivar prescripción (soft delete)
    const response: QueryResult = await pool.query(
      'UPDATE prescripcion_medicamento SET activo = false WHERE id_prescripcion = $1 RETURNING *',
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prescripción de medicamento no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Prescripción de medicamento desactivada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al desactivar prescripción de medicamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al desactivar prescripción de medicamento',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER PRESCRIPCIONES POR EXPEDIENTE
// ==========================================
export const getPrescripcionesByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;
    const { activo = 'true' } = req.query;

    if (!id_expediente || isNaN(parseInt(id_expediente))) {
      return res.status(400).json({
        success: false,
        message: 'El ID del expediente debe ser un número válido'
      });
    }

    const query = `
      SELECT 
        pm.id_prescripcion,
        pm.id_documento,
        pm.id_medicamento,
        pm.dosis,
        pm.via_administracion,
        pm.frecuencia,
        pm.duracion,
        pm.indicaciones_especiales,
        pm.fecha_inicio,
        pm.fecha_fin,
        pm.activo,
        -- Información del medicamento
        m.codigo as codigo_medicamento,
        m.nombre as nombre_medicamento,
        m.presentacion as presentacion_medicamento,
        m.concentracion as concentracion_medicamento,
        m.grupo_terapeutico,
        -- Información del documento
        dc.fecha_elaboracion as fecha_documento,
        -- Información del médico
        pm_persona.nombre || ' ' || pm_persona.apellido_paterno as nombre_medico
      FROM prescripcion_medicamento pm
      INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm_persona ON pm_rel.id_persona = pm_persona.id_persona
      WHERE dc.id_expediente = $1
        AND pm.activo = $2
        AND dc.estado != 'Anulado'
      ORDER BY pm.fecha_inicio DESC, pm.id_prescripcion DESC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente, activo === 'true']);

    return res.status(200).json({
      success: true,
      message: 'Prescripciones del expediente obtenidas correctamente',
      data: response.rows
    });

  } catch (error) {
    console.error('Error al obtener prescripciones por expediente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener prescripciones por expediente',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE PRESCRIPCIONES
// ==========================================
export const getEstadisticasPrescripciones = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Medicamentos más prescritos
    const masPrescritos = await pool.query(`
      SELECT 
        m.id_medicamento,
        m.codigo,
        m.nombre,
        m.presentacion,
        m.grupo_terapeutico,
        COUNT(pm.id_prescripcion) as total_prescripciones,
        COUNT(CASE WHEN pm.activo = true THEN 1 END) as prescripciones_activas
      FROM medicamento m
      LEFT JOIN prescripcion_medicamento pm ON m.id_medicamento = pm.id_medicamento
      GROUP BY m.id_medicamento, m.codigo, m.nombre, m.presentacion, m.grupo_terapeutico
      HAVING COUNT(pm.id_prescripcion) > 0
      ORDER BY total_prescripciones DESC
      LIMIT 10
    `);

    // Prescripciones por grupo terapéutico
    const porGrupo = await pool.query(`
      SELECT 
        COALESCE(m.grupo_terapeutico, 'Sin grupo') as grupo_terapeutico,
        COUNT(pm.id_prescripcion) as total_prescripciones,
        COUNT(CASE WHEN pm.activo = true THEN 1 END) as prescripciones_activas
      FROM prescripcion_medicamento pm
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      GROUP BY m.grupo_terapeutico
      ORDER BY total_prescripciones DESC
    `);

    // Prescripciones por mes
    const porMes = await pool.query(`
      SELECT 
        DATE_TRUNC('month', pm.fecha_inicio) as mes,
        COUNT(*) as total_prescripciones
      FROM prescripcion_medicamento pm
      WHERE pm.fecha_inicio >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', pm.fecha_inicio)
      ORDER BY mes DESC
    `);

    // Estadísticas generales
    const generales = await pool.query(`
      SELECT 
        COUNT(*) as total_prescripciones,
        COUNT(CASE WHEN activo = true THEN 1 END) as prescripciones_activas,
        COUNT(CASE WHEN fecha_inicio >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as prescripciones_mes_actual,
        COUNT(DISTINCT id_medicamento) as medicamentos_prescritos
      FROM prescripcion_medicamento
    `);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de prescripciones obtenidas correctamente',
      data: {
        medicamentos_mas_prescritos: masPrescritos.rows,
        prescripciones_por_grupo: porGrupo.rows,
        prescripciones_por_mes: porMes.rows,
        estadisticas_generales: generales.rows[0]
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de prescripciones:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas de prescripciones',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};