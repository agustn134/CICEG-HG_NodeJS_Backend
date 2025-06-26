// src/controllers/documentos_clinicos/nota_evolucion.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACES
// ==========================================
interface NotaEvolucionRequest {
  id_documento: number;
  // Campos automáticos (se calculan con triggers)
  dias_hospitalizacion?: number;
  fecha_ultimo_ingreso?: string;
  
  // Signos vitales opcionales
  temperatura?: number;
  frecuencia_cardiaca?: number;
  frecuencia_respiratoria?: number;
  presion_arterial_sistolica?: number;
  presion_arterial_diastolica?: number;
  saturacion_oxigeno?: number;
  peso_actual?: number;
  talla_actual?: number;
  
  // Campos obligatorios
  sintomas_signos: string;
  habitus_exterior: string;
  estado_nutricional: string;
  estudios_laboratorio_gabinete: string;
  evolucion_analisis: string;
  diagnosticos: string;
  plan_estudios_tratamiento: string;
  pronostico: string;
  
  // Campos opcionales
  exploracion_cabeza?: string;
  exploracion_cuello?: string;
  exploracion_torax?: string;
  exploracion_abdomen?: string;
  exploracion_extremidades?: string;
  exploracion_columna?: string;
  exploracion_genitales?: string;
  exploracion_neurologico?: string;
  diagnosticos_guias?: string;
  interconsultas?: string;
  indicaciones_medicas?: string;
  observaciones_adicionales?: string;
}

interface NotaEvolucionFilter {
  page?: number;
  limit?: number;
  id_documento?: number;
  id_expediente?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  buscar?: string;
  dias_hospitalizacion_min?: number;
  dias_hospitalizacion_max?: number;
}

// ==========================================
// OBTENER TODAS LAS NOTAS DE EVOLUCIÓN CON FILTROS
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
      buscar,
      dias_hospitalizacion_min,
      dias_hospitalizacion_max
    } = req.query as any;

    // Validar parámetros de paginación
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Query base con JOINs para información completa
    let baseQuery = `
      SELECT 
        ne.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        pm.nombres || ' ' || pm.apellido_paterno as medico_nombre,
        pm.especialidad,
        pm.cedula_profesional,
        s.nombre as servicio_nombre,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        -- Cálculo de la edad al momento del documento
        EXTRACT(YEAR FROM AGE(dc.fecha_elaboracion, p.fecha_nacimiento)) as edad_anos,
        -- Indicador de criticidad basado en días de hospitalización
        CASE 
          WHEN ne.dias_hospitalizacion > 30 THEN 'Estancia prolongada'
          WHEN ne.dias_hospitalizacion > 14 THEN 'Estancia larga'
          WHEN ne.dias_hospitalizacion > 7 THEN 'Estancia media'
          ELSE 'Estancia corta'
        END as categoria_estancia
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
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

    if (dias_hospitalizacion_min) {
      conditions.push(`ne.dias_hospitalizacion >= $${values.length + 1}`);
      values.push(parseInt(dias_hospitalizacion_min));
    }

    if (dias_hospitalizacion_max) {
      conditions.push(`ne.dias_hospitalizacion <= $${values.length + 1}`);
      values.push(parseInt(dias_hospitalizacion_max));
    }

    if (buscar) {
      conditions.push(`(
        e.numero_expediente ILIKE $${values.length + 1} OR
        (p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
        ne.sintomas_signos ILIKE $${values.length + 1} OR
        ne.diagnosticos ILIKE $${values.length + 1} OR
        ne.evolucion_analisis ILIKE $${values.length + 1}
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
    baseQuery += ` ORDER BY dc.fecha_elaboracion DESC, ne.dias_hospitalizacion DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
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
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER EVOLUCIÓN DE SIGNOS VITALES POR EXPEDIENTE
// ==========================================
export const getEvolucionSignosVitales = async (req: Request, res: Response): Promise<Response> => {
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
        ne.dias_hospitalizacion,
        ne.temperatura,
        ne.frecuencia_cardiaca,
        ne.frecuencia_respiratoria,
        ne.presion_arterial_sistolica,
        ne.presion_arterial_diastolica,
        ne.saturacion_oxigeno,
        ne.peso_actual,
        ne.talla_actual,
        dc.fecha_elaboracion,
        pm.nombres || ' ' || pm.apellido_paterno as medico_nombre,
        -- Calcular IMC
        CASE 
          WHEN ne.peso_actual IS NOT NULL AND ne.talla_actual IS NOT NULL 
          THEN ROUND((ne.peso_actual / POWER(ne.talla_actual/100, 2))::numeric, 2)
          ELSE NULL
        END as imc,
        -- Detectar tendencias preocupantes
        CASE 
          WHEN ne.temperatura > 38.5 THEN 'ALERTA: Fiebre alta'
          WHEN ne.temperatura < 35.5 THEN 'ALERTA: Hipotermia'
          WHEN ne.presion_arterial_sistolica > 160 THEN 'ALERTA: Hipertensión severa'
          WHEN ne.presion_arterial_sistolica < 90 THEN 'ALERTA: Hipotensión'
          WHEN ne.saturacion_oxigeno < 90 THEN 'ALERTA: Hipoxemia'
          WHEN ne.frecuencia_cardiaca > 120 THEN 'ALERTA: Taquicardia'
          WHEN ne.frecuencia_cardiaca < 50 THEN 'ALERTA: Bradicardia'
          ELSE 'NORMAL'
        END as estado_critico
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      WHERE dc.id_expediente = $1 
        AND dc.estado != 'Anulado'
        AND (ne.temperatura IS NOT NULL OR ne.frecuencia_cardiaca IS NOT NULL 
             OR ne.presion_arterial_sistolica IS NOT NULL OR ne.saturacion_oxigeno IS NOT NULL)
      ORDER BY dc.fecha_elaboracion ASC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    // Análisis de tendencias
    const analisis = {
      total_registros: response.rows.length,
      alertas_criticas: response.rows.filter(r => r.estado_critico !== 'NORMAL').length,
      tendencia_peso: response.rows.length > 1 ? 
        response.rows[response.rows.length - 1]?.peso_actual - response.rows[0]?.peso_actual : null,
      rango_temperatura: {
        min: Math.min(...response.rows.filter(r => r.temperatura).map(r => r.temperatura)),
        max: Math.max(...response.rows.filter(r => r.temperatura).map(r => r.temperatura)),
        promedio: response.rows.filter(r => r.temperatura).reduce((sum, r) => sum + r.temperatura, 0) / 
                  response.rows.filter(r => r.temperatura).length || 0
      }
    };

    return res.status(200).json({
      success: true,
      message: 'Evolución de signos vitales obtenida correctamente',
      data: response.rows,
      analisis
    });

  } catch (error) {
    console.error('Error al obtener evolución de signos vitales:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener evolución de signos vitales',
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
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        pm.nombres || ' ' || pm.apellido_paterno as medico_nombre,
        pm.especialidad
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
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
// CREAR NOTA DE EVOLUCIÓN RÁPIDA (CON FUNCIÓN ALMACENADA)
// ==========================================
export const createNotaEvolucionRapida = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_expediente,
      id_medico,
      sintomas_signos,
      habitus_exterior,
      estado_nutricional,
      estudios_lab,
      evolucion_analisis,
      diagnosticos,
      plan_tratamiento,
      pronostico,
      indicaciones,
      interconsultas
    } = req.body;

    // Validaciones obligatorias
    if (!id_expediente || !id_medico || !sintomas_signos || !habitus_exterior || 
        !estado_nutricional || !estudios_lab || !evolucion_analisis || 
        !diagnosticos || !plan_tratamiento || !pronostico) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios para crear la nota de evolución'
      });
    }

    // Usar función almacenada para crear nota completa
    const query = `
      SELECT crear_nota_evolucion_completa(
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) as id_nota_nueva
    `;

    const values = [
      id_expediente,
      id_medico,
      sintomas_signos,
      habitus_exterior,
      estado_nutricional,
      estudios_lab,
      evolucion_analisis,
      diagnosticos,
      plan_tratamiento,
      pronostico,
      indicaciones || null,
      interconsultas || null
    ];

    const response: QueryResult = await pool.query(query, values);

    if (response.rows[0].id_nota_nueva) {
      return res.status(201).json({
        success: true,
        message: 'Nota de evolución creada correctamente usando función optimizada',
        data: { 
          id_nota_evolucion: response.rows[0].id_nota_nueva,
          metodo: 'funcion_almacenada'
        }
      });
    } else {
      throw new Error('Error en la función almacenada');
    }

  } catch (error) {
    console.error('Error al crear nota de evolución rápida:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear nota de evolución rápida',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER RESUMEN DE EVOLUCIÓN CLÍNICA
// ==========================================
export const getResumenEvolucionClinica = async (req: Request, res: Response): Promise<Response> => {
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
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        i.fecha_ingreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        COUNT(ne.id_nota_evolucion) as total_evoluciones,
        MIN(ne.dias_hospitalizacion) as primer_dia_evolucion,
        MAX(ne.dias_hospitalizacion) as ultimo_dia_evolucion,
        MAX(dc.fecha_elaboracion) as ultima_evolucion_fecha,
        
        -- Evolución de diagnósticos
        STRING_AGG(DISTINCT ne.diagnosticos, ' | ' ORDER BY ne.diagnosticos) as todos_diagnosticos,
        
        -- Evolución del pronóstico
        ARRAY_AGG(ne.pronostico ORDER BY dc.fecha_elaboracion) as evolucion_pronostico,
        
        -- Indicadores de mejoría
        CASE 
          WHEN COUNT(ne.id_nota_evolucion) > 1 THEN
            CASE 
              WHEN ARRAY_AGG(ne.pronostico ORDER BY dc.fecha_elaboracion DESC)[1] 
                   ILIKE '%mejoría%' OR ARRAY_AGG(ne.pronostico ORDER BY dc.fecha_elaboracion DESC)[1] 
                   ILIKE '%estable%' THEN 'Mejorando'
              WHEN ARRAY_AGG(ne.pronostico ORDER BY dc.fecha_elaboracion DESC)[1] 
                   ILIKE '%grave%' OR ARRAY_AGG(ne.pronostico ORDER BY dc.fecha_elaboracion DESC)[1] 
                   ILIKE '%crítico%' THEN 'Empeorando'
              ELSE 'Sin cambios significativos'
            END
          ELSE 'Evaluación única'
        END as tendencia_clinica,
        
        -- Resumen de estudios
        STRING_AGG(DISTINCT ne.estudios_laboratorio_gabinete, ' | ') as resumen_estudios,
        
        -- Promedio de signos vitales
        ROUND(AVG(ne.temperatura), 2) as temperatura_promedio,
        ROUND(AVG(ne.frecuencia_cardiaca), 0) as fc_promedio,
        ROUND(AVG(ne.presion_arterial_sistolica), 0) as pas_promedio
        
      FROM expediente e
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente
      LEFT JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      LEFT JOIN nota_evolucion ne ON dc.id_documento = ne.id_documento
      WHERE e.id_expediente = $1 
        AND (dc.estado != 'Anulado' OR dc.estado IS NULL)
      GROUP BY e.id_expediente, e.numero_expediente, p.nombres, p.apellido_paterno, 
               p.apellido_materno, i.fecha_ingreso, i.motivo_ingreso, i.diagnostico_ingreso
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró información del expediente especificado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resumen de evolución clínica obtenido correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener resumen de evolución clínica:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener resumen de evolución clínica',
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
        dc.id_personal_creador,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        pm.nombres || ' ' || pm.apellido_paterno as medico_nombre,
        pm.especialidad,
        pm.cedula_profesional,
        s.nombre as servicio_nombre,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        i.fecha_ingreso,
        i.fecha_egreso,
        -- Análisis de signos vitales
        CASE 
          WHEN ne.temperatura > 38.0 THEN 'Fiebre'
          WHEN ne.temperatura < 36.0 THEN 'Hipotermia'
          ELSE 'Normal'
        END as estado_temperatura,
        CASE 
          WHEN ne.presion_arterial_sistolica > 140 OR ne.presion_arterial_diastolica > 90 THEN 'Hipertensión'
          WHEN ne.presion_arterial_sistolica < 90 OR ne.presion_arterial_diastolica < 60 THEN 'Hipotensión'
          ELSE 'Normal'
        END as estado_presion,
        -- Cálculo IMC si hay peso y talla
        CASE 
          WHEN ne.peso_actual IS NOT NULL AND ne.talla_actual IS NOT NULL 
          THEN ROUND((ne.peso_actual / POWER(ne.talla_actual/100, 2))::numeric, 2)
          ELSE NULL
        END as imc_calculado
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
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
// CREAR NUEVA NOTA DE EVOLUCIÓN
// ==========================================
export const createNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      temperatura,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      presion_arterial_sistolica,
      presion_arterial_diastolica,
      saturacion_oxigeno,
      peso_actual,
      talla_actual,
      sintomas_signos,
      habitus_exterior,
      exploracion_cabeza,
      exploracion_cuello,
      exploracion_torax,
      exploracion_abdomen,
      exploracion_extremidades,
      exploracion_columna,
      exploracion_genitales,
      exploracion_neurologico,
      estado_nutricional,
      estudios_laboratorio_gabinete,
      evolucion_analisis,
      diagnosticos,
      diagnosticos_guias,
      plan_estudios_tratamiento,
      interconsultas,
      pronostico,
      indicaciones_medicas,
      observaciones_adicionales
    }: NotaEvolucionRequest = req.body;

    // Validaciones obligatorias
    const camposObligatorios = [
      'id_documento', 'sintomas_signos', 'habitus_exterior', 
      'estado_nutricional', 'estudios_laboratorio_gabinete', 
      'evolucion_analisis', 'diagnosticos', 'plan_estudios_tratamiento', 'pronostico'
    ];

    for (const campo of camposObligatorios) {
      if (!req.body[campo] || req.body[campo].trim() === '') {
        return res.status(400).json({
          success: false,
          message: `El campo ${campo.replace(/_/g, ' ')} es obligatorio`
        });
      }
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

    // Validar signos vitales si se proporcionan
    if (temperatura && (temperatura < 32 || temperatura > 45)) {
      return res.status(400).json({
        success: false,
        message: 'La temperatura debe estar entre 32°C y 45°C'
      });
    }

    if (presion_arterial_sistolica && presion_arterial_diastolica) {
      if (presion_arterial_sistolica <= presion_arterial_diastolica) {
        return res.status(400).json({
          success: false,
          message: 'La presión sistólica debe ser mayor que la diastólica'
        });
      }
    }

    if (saturacion_oxigeno && (saturacion_oxigeno < 50 || saturacion_oxigeno > 100)) {
      return res.status(400).json({
        success: false,
        message: 'La saturación de oxígeno debe estar entre 50% y 100%'
      });
    }

    // Crear nota de evolución
    const query = `
      INSERT INTO nota_evolucion (
        id_documento, temperatura, frecuencia_cardiaca, frecuencia_respiratoria,
        presion_arterial_sistolica, presion_arterial_diastolica, saturacion_oxigeno,
        peso_actual, talla_actual, sintomas_signos, habitus_exterior,
        exploracion_cabeza, exploracion_cuello, exploracion_torax, exploracion_abdomen,
        exploracion_extremidades, exploracion_columna, exploracion_genitales,
        exploracion_neurologico, estado_nutricional, estudios_laboratorio_gabinete,
        evolucion_analisis, diagnosticos, diagnosticos_guias, plan_estudios_tratamiento,
        interconsultas, pronostico, indicaciones_medicas, observaciones_adicionales
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
      ) RETURNING *
    `;

    const values = [
      id_documento,
      temperatura || null,
      frecuencia_cardiaca || null,
      frecuencia_respiratoria || null,
      presion_arterial_sistolica || null,
      presion_arterial_diastolica || null,
      saturacion_oxigeno || null,
      peso_actual || null,
      talla_actual || null,
      sintomas_signos.trim(),
      habitus_exterior.trim(),
      exploracion_cabeza?.trim() || null,
      exploracion_cuello?.trim() || null,
      exploracion_torax?.trim() || null,
      exploracion_abdomen?.trim() || null,
      exploracion_extremidades?.trim() || null,
      exploracion_columna?.trim() || null,
      exploracion_genitales?.trim() || null,
      exploracion_neurologico?.trim() || null,
      estado_nutricional.trim(),
      estudios_laboratorio_gabinete.trim(),
      evolucion_analisis.trim(),
      diagnosticos.trim(),
      diagnosticos_guias?.trim() || null,
      plan_estudios_tratamiento.trim(),
      interconsultas?.trim() || 'No se solicitaron interconsultas en esta evolución',
      pronostico.trim(),
      indicaciones_medicas?.trim() || null,
      observaciones_adicionales?.trim() || null
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

    // Validar signos vitales si se proporcionan
    if (updateData.temperatura && (updateData.temperatura < 32 || updateData.temperatura > 45)) {
      return res.status(400).json({
        success: false,
        message: 'La temperatura debe estar entre 32°C y 45°C'
      });
    }

    if (updateData.presion_arterial_sistolica && updateData.presion_arterial_diastolica) {
      if (updateData.presion_arterial_sistolica <= updateData.presion_arterial_diastolica) {
        return res.status(400).json({
          success: false,
          message: 'La presión sistólica debe ser mayor que la diastólica'
        });
      }
    }

    // Construir query dinámico solo con campos proporcionados
    const fields = Object.keys(updateData);
    const values: any[] = [];
    const setClause = fields.map((field, index) => {
      let value = updateData[field as keyof NotaEvolucionRequest];
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
      UPDATE nota_evolucion 
      SET ${setClause}
      WHERE id_nota_evolucion = $${values.length}
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
// ANULAR NOTA DE EVOLUCIÓN
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
        pm.nombres || ' ' || pm.apellido_paterno as medico_nombre,
        pm.especialidad,
        s.nombre as servicio_nombre,
        -- Evolución de los días de hospitalización
        ROW_NUMBER() OVER (ORDER BY dc.fecha_elaboracion) as numero_evolucion
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
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
// OBTENER ESTADÍSTICAS DE NOTAS DE EVOLUCIÓN
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
      promedioEstancia: `
        SELECT 
          ROUND(AVG(ne.dias_hospitalizacion), 2) as promedio_dias,
          MIN(ne.dias_hospitalizacion) as min_dias,
          MAX(ne.dias_hospitalizacion) as max_dias
        FROM nota_evolucion ne
        INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
        WHERE dc.estado != 'Anulado' AND ne.dias_hospitalizacion IS NOT NULL
      `,
      categoriasEstancia: `
        SELECT 
          CASE 
            WHEN ne.dias_hospitalizacion <= 3 THEN 'Corta (1-3 días)'
            WHEN ne.dias_hospitalizacion <= 7 THEN 'Media (4-7 días)'
            WHEN ne.dias_hospitalizacion <= 14 THEN 'Larga (8-14 días)'
            WHEN ne.dias_hospitalizacion <= 30 THEN 'Prolongada (15-30 días)'
            ELSE 'Muy prolongada (>30 días)'
          END as categoria,
          COUNT(*) as cantidad
        FROM nota_evolucion ne
        INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
        WHERE dc.estado != 'Anulado' AND ne.dias_hospitalizacion IS NOT NULL
        GROUP BY categoria
        ORDER BY 
          CASE 
            WHEN categoria = 'Corta (1-3 días)' THEN 1
            WHEN categoria = 'Media (4-7 días)' THEN 2
            WHEN categoria = 'Larga (8-14 días)' THEN 3
            WHEN categoria = 'Prolongada (15-30 días)' THEN 4
            ELSE 5
          END
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
      `
    };

    const [total, estancia, categorias, recientes] = await Promise.all([
      pool.query(queries.totalNotas),
      pool.query(queries.promedioEstancia),
      pool.query(queries.categoriasEstancia),
      pool.query(queries.notasRecientes)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de notas de evolución obtenidas correctamente',
      data: {
        total: parseInt(total.rows[0].total),
        estancia: estancia.rows[0],
        categorias_estancia: categorias.rows,
        notas_recientes: recientes.rows
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

     