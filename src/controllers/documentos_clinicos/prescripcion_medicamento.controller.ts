// src/controllers/documentos_clinicos/prescripcion_medicamento.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACES
// ==========================================
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

interface PrescripcionMedicamentoFilter {
  page?: number;
  limit?: number;
  id_documento?: number;
  id_expediente?: number;
  id_medicamento?: number;
  activo?: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
  buscar?: string;
  grupo_terapeutico?: string;
}

// ==========================================
// OBTENER TODAS LAS PRESCRIPCIONES CON FILTROS
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
      fecha_inicio,
      fecha_fin,
      buscar,
      grupo_terapeutico
    } = req.query as any;

    // Validar parámetros de paginación
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Query base con JOINs para información completa
    let baseQuery = `
      SELECT 
        pm.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        m.codigo as medicamento_codigo,
        m.nombre as medicamento_nombre,
        m.presentacion,
        m.concentracion,
        m.grupo_terapeutico,
        personal.nombres || ' ' || personal.apellido_paterno as medico_prescriptor,
        personal.especialidad,
        personal.cedula_profesional,
        -- Calcular si la prescripción está vigente
        CASE 
          WHEN pm.fecha_fin IS NULL THEN 
            CASE WHEN pm.fecha_inicio + INTERVAL '1 day' * CAST(REGEXP_REPLACE(pm.duracion, '[^0-9]', '', 'g') AS INTEGER) >= CURRENT_DATE 
                 THEN TRUE ELSE FALSE END
          WHEN pm.fecha_fin >= CURRENT_DATE THEN TRUE 
          ELSE FALSE 
        END as vigente
      FROM prescripcion_medicamento pm
      INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      LEFT JOIN personal_medico personal ON dc.id_personal_creador = personal.id_personal_medico
    `;

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
        (p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
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
        pm.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        dc.id_personal_creador,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        m.codigo as medicamento_codigo,
        m.nombre as medicamento_nombre,
        m.presentacion,
        m.concentracion,
        m.grupo_terapeutico,
        personal.nombres || ' ' || personal.apellido_paterno as medico_prescriptor,
        personal.especialidad,
        personal.cedula_profesional,
        -- Calcular si la prescripción está vigente
        CASE 
          WHEN pm.fecha_fin IS NULL THEN 
            CASE WHEN pm.fecha_inicio + INTERVAL '1 day' * CAST(REGEXP_REPLACE(pm.duracion, '[^0-9]', '', 'g') AS INTEGER) >= CURRENT_DATE 
                 THEN TRUE ELSE FALSE END
          WHEN pm.fecha_fin >= CURRENT_DATE THEN TRUE 
          ELSE FALSE 
        END as vigente,
        -- Calcular días restantes
        CASE 
          WHEN pm.fecha_fin IS NULL THEN 
            GREATEST(0, CAST(REGEXP_REPLACE(pm.duracion, '[^0-9]', '', 'g') AS INTEGER) - (CURRENT_DATE - pm.fecha_inicio))
          ELSE GREATEST(0, pm.fecha_fin - CURRENT_DATE)
        END as dias_restantes
      FROM prescripcion_medicamento pm
      INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      LEFT JOIN personal_medico personal ON dc.id_personal_creador = personal.id_personal_medico
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
// CREAR NUEVA PRESCRIPCIÓN DE MEDICAMENTO
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

    // Validaciones obligatorias
    if (!id_documento || !id_medicamento || !dosis || !via_administracion || !frecuencia || !fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: 'Los campos id_documento, id_medicamento, dosis, via_administracion, frecuencia y fecha_inicio son obligatorios'
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
        message: 'No se puede crear una prescripción para un documento anulado'
      });
    }

    // Verificar que el medicamento existe y está activo
    const medicamentoCheck = await pool.query(
      'SELECT id_medicamento, nombre, activo FROM medicamento WHERE id_medicamento = $1',
      [id_medicamento]
    );

    if (medicamentoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El medicamento especificado no existe'
      });
    }

    if (!medicamentoCheck.rows[0].activo) {
      return res.status(400).json({
        success: false,
        message: 'El medicamento especificado no está activo'
      });
    }

    // Validar fechas
    const fechaInicioDate = new Date(fecha_inicio);
    if (isNaN(fechaInicioDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio no es válida'
      });
    }

    if (fecha_fin) {
      const fechaFinDate = new Date(fecha_fin);
      if (isNaN(fechaFinDate.getTime()) || fechaFinDate <= fechaInicioDate) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de fin debe ser válida y posterior a la fecha de inicio'
        });
      }
    }

    // Verificar posibles interacciones o duplicados activos del mismo medicamento
    const prescripcionExistente = await pool.query(`
      SELECT pm.id_prescripcion, m.nombre as medicamento_nombre
      FROM prescripcion_medicamento pm
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      WHERE dc.id_expediente = (
        SELECT id_expediente FROM documento_clinico WHERE id_documento = $1
      )
      AND pm.id_medicamento = $2
      AND pm.activo = true
      AND (
        pm.fecha_fin IS NULL OR pm.fecha_fin >= CURRENT_DATE
      )
    `, [id_documento, id_medicamento]);

    if (prescripcionExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Ya existe una prescripción activa del medicamento ${prescripcionExistente.rows[0].medicamento_nombre} para este paciente`,
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
        'SELECT id_medicamento, activo FROM medicamento WHERE id_medicamento = $1',
        [updateData.id_medicamento]
      );

      if (medicamentoCheck.rows.length === 0 || !medicamentoCheck.rows[0].activo) {
        return res.status(404).json({
          success: false,
          message: 'El medicamento especificado no existe o no está activo'
        });
      }
    }

    // Validar fechas si se proporcionan
    if (updateData.fecha_inicio && updateData.fecha_fin) {
      const fechaInicioDate = new Date(updateData.fecha_inicio);
      const fechaFinDate = new Date(updateData.fecha_fin);
      
      if (fechaFinDate <= fechaInicioDate) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de fin debe ser posterior a la fecha de inicio'
        });
      }
    }

    // Construir query dinámico solo con campos proporcionados
    const fields = Object.keys(updateData);
    const values: any[] = [];
    const setClause = fields.map((field, index) => {
      let value = updateData[field as keyof PrescripcionMedicamentoRequest];
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
      UPDATE prescripcion_medicamento 
      SET ${setClause}
      WHERE id_prescripcion = $${values.length}
      RETURNING *
    `;

    const response: QueryResult = await pool.query(query, values);

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

    // En lugar de eliminar físicamente, desactivar la prescripción
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
    const { activo = 'true' } = req.query as any;

    if (!id_expediente || isNaN(parseInt(id_expediente))) {
      return res.status(400).json({
        success: false,
        message: 'El ID del expediente debe ser un número válido'
      });
    }

    let query = `
      SELECT 
        pm.*,
        m.codigo as medicamento_codigo,
        m.nombre as medicamento_nombre,
        m.presentacion,
        m.concentracion,
        m.grupo_terapeutico,
        personal.nombres || ' ' || personal.apellido_paterno as medico_prescriptor,
        personal.especialidad,
        dc.fecha_elaboracion as fecha_documento,
        -- Calcular si la prescripción está vigente
        CASE 
          WHEN pm.fecha_fin IS NULL THEN 
            CASE WHEN pm.fecha_inicio + INTERVAL '1 day' * CAST(REGEXP_REPLACE(pm.duracion, '[^0-9]', '', 'g') AS INTEGER) >= CURRENT_DATE 
                 THEN TRUE ELSE FALSE END
          WHEN pm.fecha_fin >= CURRENT_DATE THEN TRUE 
          ELSE FALSE 
        END as vigente
      FROM prescripcion_medicamento pm
      INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      INNER JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      LEFT JOIN personal_medico personal ON dc.id_personal_creador = personal.id_personal_medico
      WHERE dc.id_expediente = $1 
        AND dc.estado != 'Anulado'
    `;

    const values = [id_expediente];

    if (activo === 'true') {
      query += ` AND pm.activo = true`;
    }

    query += ` ORDER BY pm.fecha_inicio DESC, pm.id_prescripcion DESC`;

    const response: QueryResult = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: 'Prescripciones del expediente obtenidas correctamente',
      data: response.rows
    });

  } catch (error) {
    console.error('Error al obtener prescripciones del expediente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener prescripciones del expediente',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE PRESCRIPCIONES
// ==========================================
export const getEstadisticasPrescripciones = async (req: Request, res: Response): Promise<Response> => {
  try {
    const queries = {
      totalPrescripciones: `
        SELECT COUNT(*) as total 
        FROM prescripcion_medicamento pm
        INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
        WHERE dc.estado != 'Anulado'
      `,
      prescripcionesActivas: `
        SELECT COUNT(*) as total 
        FROM prescripcion_medicamento pm
        INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
        WHERE pm.activo = true AND dc.estado != 'Anulado'
      `,
      medicamentosMasPrescritos: `
        SELECT 
          m.nombre as medicamento,
          m.grupo_terapeutico,
          COUNT(pm.id_prescripcion) as cantidad
        FROM medicamento m
        LEFT JOIN prescripcion_medicamento pm ON m.id_medicamento = pm.id_medicamento
        INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
        WHERE dc.estado != 'Anulado'
        GROUP BY m.id_medicamento, m.nombre, m.grupo_terapeutico
        ORDER BY cantidad DESC
        LIMIT 10
      `,
      gruposTerapeuticos: `
        SELECT 
          m.grupo_terapeutico,
          COUNT(pm.id_prescripcion) as cantidad
        FROM medicamento m
        LEFT JOIN prescripcion_medicamento pm ON m.id_medicamento = pm.id_medicamento
        INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
        WHERE dc.estado != 'Anulado' AND m.grupo_terapeutico IS NOT NULL
        GROUP BY m.grupo_terapeutico
        ORDER BY cantidad DESC
      `,
      prescripcionesRecientes: `
        SELECT 
          DATE(pm.fecha_inicio) as fecha,
          COUNT(*) as cantidad
        FROM prescripcion_medicamento pm
        INNER JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
        WHERE pm.fecha_inicio >= NOW() - INTERVAL '30 days'
          AND dc.estado != 'Anulado'
        GROUP BY DATE(pm.fecha_inicio)
        ORDER BY fecha DESC
        LIMIT 30
      `
    };

    const [total, activas, medicamentosMasPrescritos, gruposTerapeuticos, recientes] = await Promise.all([
      pool.query(queries.totalPrescripciones),
      pool.query(queries.prescripcionesActivas),
      pool.query(queries.medicamentosMasPrescritos),
      pool.query(queries.gruposTerapeuticos),
      pool.query(queries.prescripcionesRecientes)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de prescripciones obtenidas correctamente',
      data: {
        total: parseInt(total.rows[0].total),
        activas: parseInt(activas.rows[0].total),
        medicamentosMasPrescritos: medicamentosMasPrescritos.rows,
        gruposTerapeuticos: gruposTerapeuticos.rows,
        prescripcionesRecientes: recientes.rows
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