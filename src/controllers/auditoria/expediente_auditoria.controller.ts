// src/controllers/auditoria/expediente_auditoria.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACES
// ==========================================
interface AuditoriaRequest {
  id_expediente: number;
  id_medico: number;
  accion: 'consulta' | 'actualizacion' | 'nuevo_documento' | 'acceso_negado' | 'eliminacion' | 'exportacion';
  datos_anteriores?: object;
  datos_nuevos?: object;
  ip_acceso?: string;
  navegador?: string;
  tiempo_sesion?: number;
  observaciones?: string;
}

interface AuditoriaFilter {
  page?: number;
  limit?: number;
  id_expediente?: number;
  id_medico?: number;
  accion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  buscar?: string;
}

// ==========================================
// OBTENER REGISTROS DE AUDITORÍA CON FILTROS
// ==========================================
export const getAuditoriaExpedientes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      page = 1,
      limit = 20,
      id_expediente,
      id_medico,
      accion,
      fecha_inicio,
      fecha_fin,
      buscar
    } = req.query as any;

    // Validar parámetros de paginación
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;

    // Query base con JOINs para información completa
    let baseQuery = `
      SELECT 
        ea.*,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.curp as paciente_curp,
        pm.nombres || ' ' || pm.apellido_paterno as medico_nombre,
        pm.especialidad,
        pm.cedula_profesional,
        pm_persona.curp as medico_curp,
        -- Análisis de tiempo de sesión
        CASE 
          WHEN ea.tiempo_sesion IS NULL THEN 'No registrado'
          WHEN ea.tiempo_sesion < 30 THEN 'Muy rápido (<30s)'
          WHEN ea.tiempo_sesion < 120 THEN 'Rápido (30s-2min)'
          WHEN ea.tiempo_sesion < 300 THEN 'Normal (2-5min)'
          WHEN ea.tiempo_sesion < 900 THEN 'Prolongado (5-15min)'
          ELSE 'Muy prolongado (>15min)'
        END as categoria_tiempo,
        -- Análisis de sospechosidad
        CASE 
          WHEN ea.accion = 'acceso_negado' THEN 'ALTA'
          WHEN ea.tiempo_sesion < 10 AND ea.accion = 'consulta' THEN 'MEDIA'
          WHEN DATE_PART('hour', ea.fecha_acceso) BETWEEN 0 AND 6 THEN 'MEDIA'
          WHEN DATE_PART('dow', ea.fecha_acceso) IN (0, 6) THEN 'BAJA'
          ELSE 'NORMAL'
        END as nivel_sospecha
      FROM expediente_auditoria ea
      INNER JOIN expediente e ON ea.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN personal_medico pm ON ea.id_medico = pm.id_personal_medico
      INNER JOIN persona pm_persona ON pm.id_persona = pm_persona.id_persona
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM expediente_auditoria ea
      INNER JOIN expediente e ON ea.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN personal_medico pm ON ea.id_medico = pm.id_personal_medico
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Aplicar filtros
    if (id_expediente) {
      conditions.push(`ea.id_expediente = $${values.length + 1}`);
      values.push(id_expediente);
    }

    if (id_medico) {
      conditions.push(`ea.id_medico = $${values.length + 1}`);
      values.push(id_medico);
    }

    if (accion) {
      conditions.push(`ea.accion = $${values.length + 1}`);
      values.push(accion);
    }

    if (fecha_inicio) {
      conditions.push(`ea.fecha_acceso >= $${values.length + 1}`);
      values.push(fecha_inicio);
    }

    if (fecha_fin) {
      conditions.push(`ea.fecha_acceso <= $${values.length + 1}`);
      values.push(fecha_fin);
    }

    if (buscar) {
      conditions.push(`(
        e.numero_expediente ILIKE $${values.length + 1} OR
        (p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
        (pm.nombres || ' ' || pm.apellido_paterno) ILIKE $${values.length + 1} OR
        ea.observaciones ILIKE $${values.length + 1} OR
        p.curp ILIKE $${values.length + 1}
      )`);
      values.push(`%${buscar}%`);
    }

    // Agregar condiciones WHERE
    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      baseQuery += whereClause;
      countQuery += whereClause;
    }

    // Agregar ordenamiento y paginación
    baseQuery += ` ORDER BY ea.fecha_acceso DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
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
      message: 'Registros de auditoría obtenidos correctamente',
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
    console.error('Error al obtener registros de auditoría:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener registros de auditoría',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER REGISTRO DE AUDITORÍA POR ID
// ==========================================
export const getAuditoriaById = async (req: Request, res: Response): Promise<Response> => {
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
        ea.*,
        e.numero_expediente,
        e.fecha_apertura,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.curp as paciente_curp,
        pm.nombres || ' ' || pm.apellido_paterno as medico_nombre,
        pm.especialidad,
        pm.cedula_profesional,
        pm_persona.curp as medico_curp,
        s.nombre as servicio_nombre,
        -- Análisis detallado
        EXTRACT(EPOCH FROM (ea.fecha_acceso - LAG(ea.fecha_acceso) OVER (
          PARTITION BY ea.id_expediente, ea.id_medico 
          ORDER BY ea.fecha_acceso
        ))) as segundos_desde_ultimo_acceso
      FROM expediente_auditoria ea
      INNER JOIN expediente e ON ea.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN personal_medico pm ON ea.id_medico = pm.id_personal_medico
      INNER JOIN persona pm_persona ON pm.id_persona = pm_persona.id_persona
      LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente AND i.fecha_egreso IS NULL
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE ea.id_auditoria = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registro de auditoría no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro de auditoría obtenido correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener registro de auditoría por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener registro de auditoría',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// REGISTRAR NUEVA AUDITORÍA
// ==========================================
export const registrarAuditoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_expediente,
      id_medico,
      accion,
      datos_anteriores,
      datos_nuevos,
      ip_acceso,
      navegador,
      tiempo_sesion,
      observaciones
    }: AuditoriaRequest = req.body;

    // Validaciones obligatorias
    if (!id_expediente || !id_medico || !accion) {
      return res.status(400).json({
        success: false,
        message: 'Los campos id_expediente, id_medico y accion son obligatorios'
      });
    }

    // Validar acciones permitidas
    const accionesPermitidas = ['consulta', 'actualizacion', 'nuevo_documento', 'acceso_negado', 'eliminacion', 'exportacion'];
    if (!accionesPermitidas.includes(accion)) {
      return res.status(400).json({
        success: false,
        message: `La acción debe ser una de: ${accionesPermitidas.join(', ')}`
      });
    }

    // Verificar que el expediente existe
    const expedienteCheck = await pool.query(
      'SELECT id_expediente, numero_expediente FROM expediente WHERE id_expediente = $1',
      [id_expediente]
    );

    if (expedienteCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El expediente especificado no existe'
      });
    }

    // Verificar que el médico existe
    const medicoCheck = await pool.query(
      'SELECT id_personal_medico FROM personal_medico WHERE id_personal_medico = $1',
      [id_medico]
    );

    if (medicoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El médico especificado no existe'
      });
    }

    // Detectar IP del cliente si no se proporciona
    const ipReal = ip_acceso || req.ip || req.socket?.remoteAddress || 'unknown';

    
    // Detectar navegador si no se proporciona
    const navegadorReal = navegador || req.get('User-Agent') || 'unknown';

    // Registrar auditoría
    const query = `
      INSERT INTO expediente_auditoria (
        id_expediente, id_medico, accion, datos_anteriores, 
        datos_nuevos, ip_acceso, navegador, tiempo_sesion, observaciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `;

    const values = [
      id_expediente,
      id_medico,
      accion,
      datos_anteriores ? JSON.stringify(datos_anteriores) : null,
      datos_nuevos ? JSON.stringify(datos_nuevos) : null,
      ipReal,
      navegadorReal,
      tiempo_sesion || null,
      observaciones || null
    ];

    const response: QueryResult = await pool.query(query, values);

    // Si es un acceso sospechoso, generar alerta
    if (accion === 'acceso_negado' || (tiempo_sesion && tiempo_sesion < 5)) {
      await generarAlertaSospechosa(id_expediente, id_medico, accion, ipReal);
    }

    return res.status(201).json({
      success: true,
      message: 'Registro de auditoría creado correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al registrar auditoría:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al registrar auditoría',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ACTIVIDAD POR EXPEDIENTE
// ==========================================
export const getActividadByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;
    const { dias = 30 } = req.query as any;

    if (!id_expediente || isNaN(parseInt(id_expediente))) {
      return res.status(400).json({
        success: false,
        message: 'El ID del expediente debe ser un número válido'
      });
    }

    const query = `
      SELECT 
        ea.*,
        pm.nombres || ' ' || pm.apellido_paterno as medico_nombre,
        pm.especialidad,
        pm.cedula_profesional,
        -- Análisis de patrones
        CASE 
          WHEN ea.tiempo_sesion < 30 THEN 'Acceso muy rápido'
          WHEN DATE_PART('hour', ea.fecha_acceso) BETWEEN 22 AND 6 THEN 'Acceso nocturno'
          WHEN DATE_PART('dow', ea.fecha_acceso) IN (0, 6) THEN 'Acceso fin de semana'
          ELSE 'Acceso normal'
        END as tipo_acceso
      FROM expediente_auditoria ea
      INNER JOIN personal_medico pm ON ea.id_medico = pm.id_personal_medico
      WHERE ea.id_expediente = $1 
        AND ea.fecha_acceso >= NOW() - INTERVAL '${parseInt(dias)} days'
      ORDER BY ea.fecha_acceso DESC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    // Análisis estadístico
    const analisis = {
      total_accesos: response.rows.length,
      medicos_unicos: new Set(response.rows.map(r => r.id_medico)).size,
      acciones_por_tipo: response.rows.reduce((acc: any, row) => {
        acc[row.accion] = (acc[row.accion] || 0) + 1;
        return acc;
      }, {}),
      accesos_sospechosos: response.rows.filter(r => 
        r.tipo_acceso !== 'Acceso normal' || r.accion === 'acceso_negado'
      ).length
    };

    return res.status(200).json({
      success: true,
      message: 'Actividad del expediente obtenida correctamente',
      data: response.rows,
      analisis
    });

  } catch (error) {
    console.error('Error al obtener actividad del expediente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener actividad del expediente',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ACTIVIDAD POR MÉDICO
// ==========================================
export const getActividadByMedico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_medico } = req.params;
    const { dias = 30 } = req.query as any;

    if (!id_medico || isNaN(parseInt(id_medico))) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico debe ser un número válido'
      });
    }

    const query = `
      SELECT 
        ea.*,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre
      FROM expediente_auditoria ea
      INNER JOIN expediente e ON ea.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      WHERE ea.id_medico = $1 
        AND ea.fecha_acceso >= NOW() - INTERVAL '${parseInt(dias)} days'
      ORDER BY ea.fecha_acceso DESC
    `;

    const response: QueryResult = await pool.query(query, [id_medico]);

    // Análisis de productividad
    const analisis = {
      total_accesos: response.rows.length,
      expedientes_unicos: new Set(response.rows.map(r => r.id_expediente)).size,
      acciones_por_tipo: response.rows.reduce((acc: any, row) => {
        acc[row.accion] = (acc[row.accion] || 0) + 1;
        return acc;
      }, {}),
      promedio_tiempo_sesion: response.rows
        .filter(r => r.tiempo_sesion)
        .reduce((sum, r) => sum + r.tiempo_sesion, 0) / 
        response.rows.filter(r => r.tiempo_sesion).length || 0
    };

    return res.status(200).json({
      success: true,
      message: 'Actividad del médico obtenida correctamente',
      data: response.rows,
      analisis
    });

  } catch (error) {
    console.error('Error al obtener actividad del médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener actividad del médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// DETECTAR ACTIVIDAD SOSPECHOSA
// ==========================================
export const detectarActividadSospechosa = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { horas = 24 } = req.query as any;

    const query = `
      SELECT 
        ea.id_auditoria,
        ea.fecha_acceso,
        ea.accion,
        ea.tiempo_sesion,
        ea.ip_acceso,
        e.numero_expediente,
        p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        pm.nombres || ' ' || pm.apellido_paterno as medico_nombre,
        pm.especialidad,
        CASE 
          WHEN ea.accion = 'acceso_negado' THEN 'Acceso denegado'
          WHEN ea.tiempo_sesion < 10 AND ea.accion = 'consulta' THEN 'Consulta muy rápida'
          WHEN DATE_PART('hour', ea.fecha_acceso) BETWEEN 0 AND 6 THEN 'Acceso madrugada'
          WHEN DATE_PART('dow', ea.fecha_acceso) IN (0, 6) AND DATE_PART('hour', ea.fecha_acceso) NOT BETWEEN 8 AND 18 THEN 'Acceso fin de semana fuera de horario'
          WHEN ea.ip_acceso NOT IN (
            SELECT DISTINCT ip_acceso 
            FROM expediente_auditoria 
            WHERE id_medico = ea.id_medico 
              AND fecha_acceso >= NOW() - INTERVAL '7 days'
              AND ip_acceso IS NOT NULL
            GROUP BY ip_acceso 
            HAVING COUNT(*) > 5
          ) THEN 'IP desconocida'
        END as tipo_sospecha
      FROM expediente_auditoria ea
      INNER JOIN expediente e ON ea.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      INNER JOIN personal_medico pm ON ea.id_medico = pm.id_personal_medico
      WHERE ea.fecha_acceso >= NOW() - INTERVAL '${parseInt(horas)} hours'
        AND (
          ea.accion = 'acceso_negado' OR
          (ea.tiempo_sesion < 10 AND ea.accion = 'consulta') OR
          DATE_PART('hour', ea.fecha_acceso) BETWEEN 0 AND 6 OR
          (DATE_PART('dow', ea.fecha_acceso) IN (0, 6) AND DATE_PART('hour', ea.fecha_acceso) NOT BETWEEN 8 AND 18)
        )
      ORDER BY ea.fecha_acceso DESC
    `;

    const response: QueryResult = await pool.query(query);

    return res.status(200).json({
      success: true,
      message: 'Actividad sospechosa detectada correctamente',
      data: response.rows,
      resumen: {
        total_incidentes: response.rows.length,
        tipos_sospecha: response.rows.reduce((acc: any, row) => {
          acc[row.tipo_sospecha] = (acc[row.tipo_sospecha] || 0) + 1;
          return acc;
        }, {}),
        periodo_analizado: `${horas} horas`
      }
    });

  } catch (error) {
    console.error('Error al detectar actividad sospechosa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al detectar actividad sospechosa',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE AUDITORÍA
// ==========================================
export const getEstadisticasAuditoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { periodo = 30 } = req.query as any;

    const queries = {
      totalRegistros: `
        SELECT COUNT(*) as total 
        FROM expediente_auditoria 
        WHERE fecha_acceso >= NOW() - INTERVAL '${parseInt(periodo)} days'
      `,
      accionesPorTipo: `
        SELECT 
          accion,
          COUNT(*) as cantidad,
          COUNT(DISTINCT id_medico) as medicos_unicos,
          COUNT(DISTINCT id_expediente) as expedientes_unicos
        FROM expediente_auditoria
        WHERE fecha_acceso >= NOW() - INTERVAL '${parseInt(periodo)} days'
        GROUP BY accion
        ORDER BY cantidad DESC
      `,
      actividadPorHora: `
        SELECT 
          EXTRACT(HOUR FROM fecha_acceso) as hora,
          COUNT(*) as accesos
        FROM expediente_auditoria
        WHERE fecha_acceso >= NOW() - INTERVAL '${parseInt(periodo)} days'
        GROUP BY EXTRACT(HOUR FROM fecha_acceso)
        ORDER BY hora
      `,
      medicosActivos: `
        SELECT 
          pm.nombres || ' ' || pm.apellido_paterno as medico,
          pm.especialidad,
          COUNT(*) as total_accesos,
          COUNT(DISTINCT ea.id_expediente) as expedientes_consultados,
          MAX(ea.fecha_acceso) as ultimo_acceso
        FROM expediente_auditoria ea
        INNER JOIN personal_medico pm ON ea.id_medico = pm.id_personal_medico
        WHERE ea.fecha_acceso >= NOW() - INTERVAL '${parseInt(periodo)} days'
        GROUP BY pm.id_personal_medico, pm.nombres, pm.apellido_paterno, pm.especialidad
        ORDER BY total_accesos DESC
        LIMIT 10
      `,
      accesosRapidos: `
        SELECT COUNT(*) as total
        FROM expediente_auditoria
        WHERE tiempo_sesion < 30 
          AND accion = 'consulta'
          AND fecha_acceso >= NOW() - INTERVAL '${parseInt(periodo)} days'
      `
    };

    const [total, acciones, horas, medicos, rapidos] = await Promise.all([
      pool.query(queries.totalRegistros),
      pool.query(queries.accionesPorTipo),
      pool.query(queries.actividadPorHora),
      pool.query(queries.medicosActivos),
      pool.query(queries.accesosRapidos)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de auditoría obtenidas correctamente',
      data: {
        total: parseInt(total.rows[0].total),
        acciones_por_tipo: acciones.rows,
        actividad_por_hora: horas.rows,
        medicos_mas_activos: medicos.rows,
        accesos_rapidos: parseInt(rapidos.rows[0].total),
        periodo_dias: parseInt(periodo)
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de auditoría:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// FUNCIÓN AUXILIAR PARA GENERAR ALERTAS
// ==========================================
export const generarAlertaSospechosa = async (
  id_expediente: number,
  id_medico: number,
  accion: string,
  ip_acceso: string
): Promise<void> => {
  try {
    let tipo_alerta = 'ADVERTENCIA';
    let mensaje = '';

    if (accion === 'acceso_negado') {
      tipo_alerta = 'CRITICA';
      mensaje = `Intento de acceso denegado desde IP: ${ip_acceso}`;
    } else {
      mensaje = `Acceso sospechoso detectado: ${accion} desde IP: ${ip_acceso}`;
    }

    await pool.query(
      `INSERT INTO alertas_sistema (tipo_alerta, mensaje, id_expediente, id_medico) VALUES ($1, $2, $3, $4)`,
      [tipo_alerta, mensaje, id_expediente, id_medico]
    );
  } catch (error) {
    console.error('Error al generar alerta:', error);
  }
};
