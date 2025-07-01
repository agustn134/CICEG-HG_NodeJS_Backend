// src/controllers/documentos_clinicos/historia_clinica.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACES
// ==========================================
interface HistoriaClinicaRequest {
  id_documento: number;
  antecedentes_heredo_familiares?: string;
  habitos_higienicos?: string;
  habitos_alimenticios?: string;
  actividad_fisica?: string;
  ocupacion?: string;
  vivienda?: string;
  toxicomanias?: string;
  menarca?: string;
  ritmo_menstrual?: string;
  inicio_vida_sexual?: string;
  fecha_ultima_regla?: string;
  fecha_ultimo_parto?: string;
  gestas?: number;
  partos?: number;
  cesareas?: number;
  abortos?: number;
  hijos_vivos?: number;
  metodo_planificacion?: string;
  enfermedades_infancia?: string;
  enfermedades_adulto?: string;
  cirugias_previas?: string;
  traumatismos?: string;
  alergias?: string;
  padecimiento_actual?: string;
  sintomas_generales?: string;
  aparatos_sistemas?: string;
  exploracion_general?: string;
  exploracion_cabeza?: string;
  exploracion_cuello?: string;
  exploracion_torax?: string;
  exploracion_abdomen?: string;
  exploracion_columna?: string;
  exploracion_extremidades?: string;
  exploracion_genitales?: string;
  impresion_diagnostica?: string;
  id_guia_diagnostico?: number;
  plan_diagnostico?: string;
  plan_terapeutico?: string;
  pronostico?: string;
}

interface HistoriaClinicoFilter {
  page?: number;
  limit?: number;
  id_documento?: number;
  id_expediente?: number;
  buscar?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

// ==========================================
// OBTENER TODAS LAS HISTORIAS CLÍNICAS CON FILTROS
// ==========================================
export const getHistoriasClinicas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      page = 1,
      limit = 10,
      id_documento,
      id_expediente,
      buscar,
      fecha_inicio,
      fecha_fin
    } = req.query as any;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Query base CORREGIDA - SIN pac.numero_seguro_social
    let baseQuery = `
      SELECT 
        hc.*,
        dc.id_expediente,
        dc.fecha_elaboracion,
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
        END as medico_creador,
        COALESCE(pm_rel.especialidad, 'No especificada') as especialidad,
        pm_rel.numero_cedula as cedula_profesional,
        gc.nombre as guia_clinica_nombre,
        gc.codigo as guia_clinica_codigo
      FROM historia_clinica hc
      INNER JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON hc.id_guia_diagnostico = gc.id_guia_diagnostico
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM historia_clinica hc
      INNER JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Aplicar filtros
    if (id_documento) {
      conditions.push(`hc.id_documento = $${values.length + 1}`);
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
        hc.padecimiento_actual ILIKE $${values.length + 1} OR
        hc.impresion_diagnostica ILIKE $${values.length + 1}
      )`);
      values.push(`%${buscar}%`);
    }

    // Solo mostrar documentos activos por defecto
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
      message: 'Historias clínicas obtenidas correctamente',
      data: {
        data: dataResponse.rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener historias clínicas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener historias clínicas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};


// ==========================================
// OBTENER HISTORIA CLÍNICA POR ID
// ==========================================
export const getHistoriaClinicaById = async (req: Request, res: Response): Promise<Response> => {
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
        hc.*,
        dc.id_expediente,
        dc.fecha_elaboracion,
        dc.estado as estado_documento,
        dc.id_personal_creador,
        e.numero_expediente,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        CASE 
  WHEN pm_rel.id_personal_medico IS NOT NULL 
  THEN pm.nombre || ' ' || pm.apellido_paterno 
  ELSE 'Sin asignar' 
END as medico_creador,
        COALESCE(pm_rel.especialidad, 'No especificada') as especialidad,
        pm_rel.numero_cedula as cedula_profesional,
        gc.nombre as guia_clinica_nombre,
        gc.codigo as guia_clinica_codigo,
        gc.descripcion as guia_clinica_descripcion
      FROM historia_clinica hc
      INNER JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON hc.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE hc.id_historia_clinica = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Historia clínica no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Historia clínica obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener historia clínica por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener historia clínica',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};
// ==========================================
// CREAR NUEVA HISTORIA CLÍNICA
// ==========================================
export const createHistoriaClinica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      antecedentes_heredo_familiares,
      habitos_higienicos,
      habitos_alimenticios,
      actividad_fisica,
      ocupacion,
      vivienda,
      toxicomanias,
      menarca,
      ritmo_menstrual,
      inicio_vida_sexual,
      fecha_ultima_regla,
      fecha_ultimo_parto,
      gestas,
      partos,
      cesareas,
      abortos,
      hijos_vivos,
      metodo_planificacion,
      enfermedades_infancia,
      enfermedades_adulto,
      cirugias_previas,
      traumatismos,
      alergias,
      padecimiento_actual,
      sintomas_generales,
      aparatos_sistemas,
      exploracion_general,
      exploracion_cabeza,
      exploracion_cuello,
      exploracion_torax,
      exploracion_abdomen,
      exploracion_columna,
      exploracion_extremidades,
      exploracion_genitales,
      impresion_diagnostica,
      id_guia_diagnostico,
      plan_diagnostico,
      plan_terapeutico,
      pronostico
    }: HistoriaClinicaRequest = req.body;

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
        message: 'No se puede crear una historia clínica para un documento anulado'
      });
    }

    // Verificar que no exista ya una historia clínica para este documento
    const historiaExistente = await pool.query(
      'SELECT id_historia_clinica FROM historia_clinica WHERE id_documento = $1',
      [id_documento]
    );

    if (historiaExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una historia clínica para este documento'
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

    // Crear historia clínica
    const query = `
      INSERT INTO historia_clinica (
        id_documento, antecedentes_heredo_familiares, habitos_higienicos, 
        habitos_alimenticios, actividad_fisica, ocupacion, vivienda, 
        toxicomanias, menarca, ritmo_menstrual, inicio_vida_sexual, 
        fecha_ultima_regla, fecha_ultimo_parto, gestas, partos, cesareas, 
        abortos, hijos_vivos, metodo_planificacion, enfermedades_infancia, 
        enfermedades_adulto, cirugias_previas, traumatismos, alergias, 
        padecimiento_actual, sintomas_generales, aparatos_sistemas, 
        exploracion_general, exploracion_cabeza, exploracion_cuello, 
        exploracion_torax, exploracion_abdomen, exploracion_columna, 
        exploracion_extremidades, exploracion_genitales, impresion_diagnostica, 
        id_guia_diagnostico, plan_diagnostico, plan_terapeutico, pronostico
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, 
        $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40
      ) RETURNING *
    `;

    const values = [
      id_documento,
      antecedentes_heredo_familiares || null,
      habitos_higienicos || null,
      habitos_alimenticios || null,
      actividad_fisica || null,
      ocupacion || null,
      vivienda || null,
      toxicomanias || null,
      menarca || null,
      ritmo_menstrual || null,
      inicio_vida_sexual || null,
      fecha_ultima_regla || null,
      fecha_ultimo_parto || null,
      gestas || null,
      partos || null,
      cesareas || null,
      abortos || null,
      hijos_vivos || null,
      metodo_planificacion || null,
      enfermedades_infancia || null,
      enfermedades_adulto || null,
      cirugias_previas || null,
      traumatismos || null,
      alergias || null,
      padecimiento_actual || null,
      sintomas_generales || null,
      aparatos_sistemas || null,
      exploracion_general || null,
      exploracion_cabeza || null,
      exploracion_cuello || null,
      exploracion_torax || null,
      exploracion_abdomen || null,
      exploracion_columna || null,
      exploracion_extremidades || null,
      exploracion_genitales || null,
      impresion_diagnostica || null,
      id_guia_diagnostico || null,
      plan_diagnostico || null,
      plan_terapeutico || null,
      pronostico || null
    ];

    const response: QueryResult = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Historia clínica creada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al crear historia clínica:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear historia clínica',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR HISTORIA CLÍNICA
// ==========================================
export const updateHistoriaClinica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<HistoriaClinicaRequest> = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que la historia clínica existe
    const historiaCheck = await pool.query(
      'SELECT id_historia_clinica FROM historia_clinica WHERE id_historia_clinica = $1',
      [id]
    );

    if (historiaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Historia clínica no encontrada'
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

    // Construir query dinámico solo con campos proporcionados
    const fields = Object.keys(updateData);
    const values: any[] = [];
    const setClause = fields.map((field, index) => {
      values.push(updateData[field as keyof HistoriaClinicaRequest]);
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
      UPDATE historia_clinica 
      SET ${setClause}
      WHERE id_historia_clinica = $${values.length}
      RETURNING *
    `;

    const response: QueryResult = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: 'Historia clínica actualizada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar historia clínica:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar historia clínica',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR HISTORIA CLÍNICA
// ==========================================
export const deleteHistoriaClinica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // En lugar de eliminar físicamente, anular el documento asociado
    const query = `
      UPDATE documento_clinico 
      SET estado = 'Anulado'
      FROM historia_clinica hc
      WHERE documento_clinico.id_documento = hc.id_documento 
        AND hc.id_historia_clinica = $1
      RETURNING documento_clinico.id_documento, hc.id_historia_clinica
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Historia clínica no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Historia clínica anulada correctamente',
      data: { id_historia_clinica: id, estado: 'Anulado' }
    });

  } catch (error) {
    console.error('Error al anular historia clínica:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al anular historia clínica',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER HISTORIA CLÍNICA POR DOCUMENTO
// ==========================================
export const getHistoriaClinicaByDocumento = async (req: Request, res: Response): Promise<Response> => {
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
        hc.*,
        dc.id_expediente,
        dc.fecha_elaboracion,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        gc.nombre as guia_clinica_nombre
      FROM historia_clinica hc
      INNER JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN guia_clinica gc ON hc.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE hc.id_documento = $1
    `;

    const response: QueryResult = await pool.query(query, [id_documento]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Historia clínica no encontrada para el documento especificado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Historia clínica obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener historia clínica por documento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener historia clínica',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE HISTORIAS CLÍNICAS
// ==========================================
export const getEstadisticasHistoriasClinicas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const queries = {
      totalHistorias: `
        SELECT COUNT(*) as total 
        FROM historia_clinica hc
        INNER JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
        WHERE dc.estado != 'Anulado'
      `,
      historiasRecientes: `
        SELECT 
          DATE(dc.fecha_elaboracion) as fecha,
          COUNT(*) as cantidad
        FROM historia_clinica hc
        INNER JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
        WHERE dc.fecha_elaboracion >= NOW() - INTERVAL '30 days'
          AND dc.estado != 'Anulado'
        GROUP BY DATE(dc.fecha_elaboracion)
        ORDER BY fecha DESC
        LIMIT 30
      `,
      guiasClinicasMasUsadas: `
        SELECT 
          gc.nombre as guia_clinica,
          gc.codigo,
          COUNT(hc.id_historia_clinica) as cantidad
        FROM guia_clinica gc
        LEFT JOIN historia_clinica hc ON gc.id_guia_diagnostico = hc.id_guia_diagnostico
        INNER JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
        WHERE dc.estado != 'Anulado'
        GROUP BY gc.id_guia_diagnostico, gc.nombre, gc.codigo
        ORDER BY cantidad DESC
        LIMIT 10
      `
    };

    const [total, recientes, guiasMasUsadas] = await Promise.all([
      pool.query(queries.totalHistorias),
      pool.query(queries.historiasRecientes),
      pool.query(queries.guiasClinicasMasUsadas)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de historias clínicas obtenidas correctamente',
      data: {
        total: parseInt(total.rows[0].total),
        historiasRecientes: recientes.rows,
        guiasClinicasMasUsadas: guiasMasUsadas.rows
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