// src/controllers/gestion_expedientes/cama.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACES
// ==========================================
interface CamaRequest {
  numero: string;
  id_servicio: number;
  estado: 'Disponible' | 'Ocupada' | 'Mantenimiento' | 'Reservada' | 'Contaminada';
  descripcion?: string;
  area: string;
  subarea?: string;
}

interface CamaFilter {
  page?: number;
  limit?: number;
  estado?: string;
  id_servicio?: number;
  area?: string;
  subarea?: string;
  buscar?: string;
  solo_disponibles?: boolean;
}

// ==========================================
// OBTENER TODAS LAS CAMAS CON FILTROS
// ==========================================
export const getCamas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      page = 1,
      limit = 20,
      estado,
      id_servicio,
      area,
      subarea,
      buscar,
      solo_disponibles
    } = req.query as any;

    // Validar parámetros de paginación
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;

    // Query base con información del servicio y paciente actual
    let baseQuery = `
      SELECT 
        c.*,
        s.nombre as servicio_nombre,
        s.descripcion as servicio_descripcion,
        -- Información del paciente actual (si está ocupada)
        CASE 
          WHEN c.estado = 'Ocupada' THEN (
            SELECT p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')
            FROM internamiento i
            INNER JOIN expediente e ON i.id_expediente = e.id_expediente
            INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
            INNER JOIN persona p ON pac.id_persona = p.id_persona
            WHERE i.id_cama = c.id_cama 
              AND i.fecha_egreso IS NULL
            ORDER BY i.fecha_ingreso DESC
            LIMIT 1
          )
          ELSE NULL
        END as paciente_actual,
        -- Fecha de ingreso del paciente actual
        CASE 
          WHEN c.estado = 'Ocupada' THEN (
            SELECT i.fecha_ingreso
            FROM internamiento i
            WHERE i.id_cama = c.id_cama 
              AND i.fecha_egreso IS NULL
            ORDER BY i.fecha_ingreso DESC
            LIMIT 1
          )
          ELSE NULL
        END as fecha_ingreso_actual,
        -- Días de ocupación
        CASE 
          WHEN c.estado = 'Ocupada' THEN (
            SELECT EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - i.fecha_ingreso))/86400
            FROM internamiento i
            WHERE i.id_cama = c.id_cama 
              AND i.fecha_egreso IS NULL
            ORDER BY i.fecha_ingreso DESC
            LIMIT 1
          )
          ELSE NULL
        END as dias_ocupacion,
        -- Última limpieza/mantenimiento
        CASE 
          WHEN c.estado = 'Mantenimiento' THEN 
            EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - COALESCE(
              (SELECT MAX(i.fecha_egreso) FROM internamiento i WHERE i.id_cama = c.id_cama),
              CURRENT_TIMESTAMP - INTERVAL '1 day'
            )))/3600
          ELSE NULL
        END as horas_en_mantenimiento,
        -- Total de usos en el último mes
        (
          SELECT COUNT(*)
          FROM internamiento i
          WHERE i.id_cama = c.id_cama 
            AND i.fecha_ingreso >= NOW() - INTERVAL '30 days'
        ) as usos_ultimo_mes
      FROM cama c
      INNER JOIN servicio s ON c.id_servicio = s.id_servicio
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM cama c
      INNER JOIN servicio s ON c.id_servicio = s.id_servicio
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Aplicar filtros
    if (estado) {
      conditions.push(`c.estado = $${values.length + 1}`);
      values.push(estado);
    }

    if (id_servicio) {
      conditions.push(`c.id_servicio = $${values.length + 1}`);
      values.push(id_servicio);
    }

    if (area) {
      conditions.push(`c.area ILIKE $${values.length + 1}`);
      values.push(`%${area}%`);
    }

    if (subarea) {
      conditions.push(`c.subarea ILIKE $${values.length + 1}`);
      values.push(`%${subarea}%`);
    }

    if (solo_disponibles === 'true') {
      conditions.push(`c.estado = 'Disponible'`);
    }

    if (buscar) {
      conditions.push(`(
        c.numero ILIKE $${values.length + 1} OR
        c.descripcion ILIKE $${values.length + 1} OR
        c.area ILIKE $${values.length + 1} OR
        c.subarea ILIKE $${values.length + 1} OR
        s.nombre ILIKE $${values.length + 1}
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
    baseQuery += ` ORDER BY 
      CASE c.estado 
        WHEN 'Disponible' THEN 1
        WHEN 'Reservada' THEN 2
        WHEN 'Ocupada' THEN 3
        WHEN 'Mantenimiento' THEN 4
        WHEN 'Contaminada' THEN 5
      END,
      c.area, c.subarea, c.numero
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
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
      message: 'Camas obtenidas correctamente',
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
    console.error('Error al obtener camas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener camas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER CAMA POR ID
// ==========================================
// export const getCamaById = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;

//     if (!id || isNaN(parseInt(id))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID debe ser un número válido'
//       });
//     }

//     if (!nuevo_estado) {
//       return res.status(400).json({
//         success: false,
//         message: 'El nuevo estado es obligatorio'
//       });
//     }

//     const estadosPermitidos = ['Disponible', 'Ocupada', 'Mantenimiento', 'Reservada', 'Contaminada'];
//     if (!estadosPermitidos.includes(nuevo_estado)) {
//       return res.status(400).json({
//         success: false,
//         message: `El estado debe ser uno de: ${estadosPermitidos.join(', ')}`
//       });
//     }

//     // Verificar que la cama existe
//     const camaCheck = await pool.query(
//       'SELECT id_cama, numero, estado FROM cama WHERE id_cama = $1',
//       [id]
//     );

//     if (camaCheck.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cama no encontrada'
//       });
//     }

//     const estadoActual = camaCheck.rows[0].estado;

//     // Validaciones especiales para cambios de estado
//     if (estadoActual === 'Ocupada' && nuevo_estado !== 'Ocupada') {
//       const pacienteActual = await pool.query(
//         'SELECT id_internamiento FROM internamiento WHERE id_cama = $1 AND fecha_egreso IS NULL',
//         [id]
//       );
      
//       if (pacienteActual.rows.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'No se puede cambiar el estado de una cama ocupada. Primero debe dar de alta al paciente'
//         });
//       }
//     }

//     // Actualizar estado
//     const descripcionUpdate = motivo ? 
//       `Estado cambiado a ${nuevo_estado}. Motivo: ${motivo}` : 
//       `Estado cambiado a ${nuevo_estado}`;

//     const response: QueryResult = await pool.query(
//       'UPDATE cama SET estado = $1, descripcion = $2 WHERE id_cama = $3 RETURNING *',
//       [nuevo_estado, descripcionUpdate, id]
//     );

//     return res.status(200).json({
//       success: true,
//       message: `Estado de cama ${camaCheck.rows[0].numero} cambiado de ${estadoActual} a ${nuevo_estado}`,
//       data: response.rows[0]
//     });

//   } catch (error) {
//     console.error('Error al cambiar estado de cama:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al cambiar estado de cama',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };


// ==========================================
// OBTENER CAMA POR ID
// ==========================================
export const getCamaById = async (req: Request, res: Response): Promise<Response> => {
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
        c.*,
        s.nombre as servicio_nombre,
        s.descripcion as servicio_descripcion,
        -- Información del paciente actual
        CASE 
          WHEN c.estado = 'Ocupada' THEN (
            SELECT jsonb_build_object(
              'nombre', p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, ''),
              'expediente', e.numero_expediente,
              'fecha_ingreso', i.fecha_ingreso,
              'motivo_ingreso', i.motivo_ingreso,
              'diagnostico', i.diagnostico_ingreso,
              'medico_responsable', pm_p.nombres || ' ' || pm_p.apellido_paterno,
              'dias_hospitalizacion', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - i.fecha_ingreso))/86400
            )
            FROM internamiento i
            INNER JOIN expediente e ON i.id_expediente = e.id_expediente
            INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
            INNER JOIN persona p ON pac.id_persona = p.id_persona
            LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
            LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
            WHERE i.id_cama = c.id_cama 
              AND i.fecha_egreso IS NULL
            ORDER BY i.fecha_ingreso DESC
            LIMIT 1
          )
          ELSE NULL
        END as paciente_actual,
        -- Historial de ocupación (últimos 5)
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'paciente', p.nombres || ' ' || p.apellido_paterno,
              'fecha_ingreso', i.fecha_ingreso,
              'fecha_egreso', i.fecha_egreso,
              'dias_estancia', EXTRACT(EPOCH FROM (COALESCE(i.fecha_egreso, CURRENT_TIMESTAMP) - i.fecha_ingreso))/86400,
              'motivo_ingreso', i.motivo_ingreso
            ) ORDER BY i.fecha_ingreso DESC
          )
          FROM internamiento i
          INNER JOIN expediente e ON i.id_expediente = e.id_expediente
          INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
          INNER JOIN persona p ON pac.id_persona = p.id_persona
          WHERE i.id_cama = c.id_cama
          ORDER BY i.fecha_ingreso DESC
          LIMIT 5
        ) as historial_ocupacion,
        -- Estadísticas de uso
        (
          SELECT jsonb_build_object(
            'total_usos', COUNT(*),
            'promedio_estancia_dias', ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(i.fecha_egreso, CURRENT_TIMESTAMP) - i.fecha_ingreso))/86400), 2),
            'ultimo_uso', MAX(i.fecha_ingreso),
            'tasa_ocupacion_ultimo_mes', 
              ROUND((COUNT(CASE WHEN i.fecha_ingreso >= NOW() - INTERVAL '30 days' THEN 1 END)::decimal / 30) * 100, 2)
          )
          FROM internamiento i
          WHERE i.id_cama = c.id_cama
        ) as estadisticas_uso
      FROM cama c
      INNER JOIN servicio s ON c.id_servicio = s.id_servicio
      WHERE c.id_cama = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cama no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cama obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener cama por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener cama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};


// ==========================================
// OBTENER OCUPACIÓN EN TIEMPO REAL
// ==========================================
export const getOcupacionTiempoReal = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        s.nombre as servicio,
        c.area,
        c.numero as cama,
        c.estado,
        CASE 
          WHEN c.estado = 'Ocupada' THEN 
            p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')
          ELSE NULL
        END as paciente,
        CASE 
          WHEN c.estado = 'Ocupada' THEN i.fecha_ingreso
          ELSE NULL
        END as fecha_ingreso,
        CASE 
          WHEN c.estado = 'Ocupada' THEN 
            EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - i.fecha_ingreso))/86400
          ELSE NULL
        END as dias_hospitalizacion,
        CASE 
          WHEN c.estado = 'Ocupada' THEN i.diagnostico_ingreso
          ELSE NULL
        END as diagnostico,
        CASE 
          WHEN c.estado = 'Ocupada' THEN 
            pm_p.nombres || ' ' || pm_p.apellido_paterno
          ELSE NULL
        END as medico_responsable
      FROM cama c
      INNER JOIN servicio s ON c.id_servicio = s.id_servicio
      LEFT JOIN internamiento i ON c.id_cama = i.id_cama AND i.fecha_egreso IS NULL
      LEFT JOIN expediente e ON i.id_expediente = e.id_expediente
      LEFT JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE s.activo = true
      ORDER BY s.nombre, c.area, c.numero
    `;

    const response: QueryResult = await pool.query(query);

    // Análisis en tiempo real
    const analisis = {
      total_camas: response.rows.length,
      ocupadas: response.rows.filter(r => r.estado === 'Ocupada').length,
      disponibles: response.rows.filter(r => r.estado === 'Disponible').length,
      en_mantenimiento: response.rows.filter(r => r.estado === 'Mantenimiento').length,
      reservadas: response.rows.filter(r => r.estado === 'Reservada').length,
      contaminadas: response.rows.filter(r => r.estado === 'Contaminada').length,
      porcentaje_ocupacion: response.rows.length > 0 ? 
        Math.round((response.rows.filter(r => r.estado === 'Ocupada').length / response.rows.length) * 100) : 0,
      pacientes_larga_estancia: response.rows.filter(r => r.dias_hospitalizacion > 15).length,
      por_servicio: response.rows.reduce((acc: any, row) => {
        if (!acc[row.servicio]) {
          acc[row.servicio] = {
            total: 0,
            ocupadas: 0,
            disponibles: 0,
            otros: 0
          };
        }
        acc[row.servicio].total++;
        if (row.estado === 'Ocupada') acc[row.servicio].ocupadas++;
        else if (row.estado === 'Disponible') acc[row.servicio].disponibles++;
        else acc[row.servicio].otros++;
        return acc;
      }, {})
    };

    return res.status(200).json({
      success: true,
      message: 'Ocupación en tiempo real obtenida correctamente',
      data: response.rows,
      analisis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al obtener ocupación en tiempo real:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener ocupación en tiempo real',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER REPORTE DE ROTACIÓN DE CAMAS
// ==========================================
export const getReporteRotacionCamas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { dias = 30 } = req.query as any;

    const query = `
      SELECT 
        c.numero as cama,
        s.nombre as servicio,
        c.area,
        c.subarea,
        COUNT(i.id_internamiento) as total_usos,
        ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(i.fecha_egreso, CURRENT_TIMESTAMP) - i.fecha_ingreso))/86400), 2) as promedio_estancia_dias,
        MIN(i.fecha_ingreso) as primer_uso,
        MAX(i.fecha_ingreso) as ultimo_uso,
        -- Tasa de rotación (usos por día)
        ROUND(COUNT(i.id_internamiento)::decimal / ${parseInt(dias)}, 2) as rotacion_por_dia,
        -- Tiempo entre altas y nuevos ingresos
        ROUND(AVG(
          CASE 
            WHEN LAG(i.fecha_egreso) OVER (PARTITION BY c.id_cama ORDER BY i.fecha_ingreso) IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (i.fecha_ingreso - LAG(i.fecha_egreso) OVER (PARTITION BY c.id_cama ORDER BY i.fecha_ingreso)))/3600
            ELSE NULL
          END
        ), 2) as promedio_horas_entre_pacientes,
        -- Estado actual
        c.estado as estado_actual
      FROM cama c
      INNER JOIN servicio s ON c.id_servicio = s.id_servicio
      LEFT JOIN internamiento i ON c.id_cama = i.id_cama 
        AND i.fecha_ingreso >= NOW() - INTERVAL '${parseInt(dias)} days'
      WHERE s.activo = true
      GROUP BY c.id_cama, c.numero, s.nombre, c.area, c.subarea, c.estado
      ORDER BY total_usos DESC, rotacion_por_dia DESC
    `;

    const response: QueryResult = await pool.query(query);

    // Análisis del reporte
    const analisis = {
      periodo_dias: parseInt(dias),
      camas_mas_utilizadas: response.rows.slice(0, 5),
      camas_menos_utilizadas: response.rows.slice(-5).reverse(),
      promedio_rotacion_general: response.rows.length > 0 ? 
        response.rows.reduce((sum, r) => sum + parseFloat(r.rotacion_por_dia || 0), 0) / response.rows.length : 0,
      camas_alta_rotacion: response.rows.filter(r => parseFloat(r.rotacion_por_dia || 0) > 0.5).length,
      camas_sin_uso: response.rows.filter(r => r.total_usos === 0).length
    };

    return res.status(200).json({
      success: true,
      message: 'Reporte de rotación de camas obtenido correctamente',
      data: response.rows,
      analisis
    });

  } catch (error) {
    console.error('Error al obtener reporte de rotación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener reporte de rotación',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// // ==========================================
// // LIBERAR CAMA (PARA EGRESO DE PACIENTE)
// // ==========================================
// export const liberarCama = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const { motivo_liberacion = 'Alta del paciente' } = req.body;

//     if (!id || isNaN(parseInt(id))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID debe ser un número válido'
//       });
//     }

//     // Verificar que la cama existe y está ocupada
//     const camaCheck = await pool.query(
//       'SELECT id_cama, numero, estado FROM cama WHERE id_cama = $1',
//       [id]
//     );

//     if (camaCheck.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cama no encontrada'
//       });
//     }

//     if (camaCheck.rows[0].estado !== 'Ocupada') {
//       return res.status(400).json({
//         success: false,
//         message: 'La cama no está ocupada'
//       });
//     }

//     // Verificar que hay un internamiento activo
//     const internamientoActivo = await pool.query(
//       'SELECT id_internamiento FROM internamiento WHERE id_cama = $1 AND fecha_egreso IS NULL',
//       [id]
//     );

//     if (internamientoActivo.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No hay un internamiento activo para esta cama'
//       });
//     }

//     // Liberar cama (cambiar a estado de limpieza/preparación)
//     const response: QueryResult = await pool.query(
//       `UPDATE cama 
//        SET estado = 'Contaminada', 
//            descripcion = $1
//        WHERE id_cama = $2 
//        RETURNING *`,
//       [`Liberada por: ${motivo_liberacion}. Requiere limpieza antes del próximo uso.`, id]
//     );

//     return res.status(200).json({
//       success: true,
//       message: `Cama ${camaCheck.rows[0].numero} liberada correctamente. Estado cambiado a 'Contaminada' para limpieza`,
//       data: response.rows[0],
//       siguiente_paso: 'Realizar limpieza y cambiar estado a Disponible'
//     });

//   } catch (error) {
//     console.error('Error al liberar cama:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al liberar cama',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// }; ser un número válido'
//       });
//     }

//     const query = `
//       SELECT 
//         c.*,
//         s.nombre as servicio_nombre,
//         s.descripcion as servicio_descripcion,
//         -- Información del paciente actual
//         CASE 
//           WHEN c.estado = 'Ocupada' THEN (
//             SELECT jsonb_build_object(
//               'nombre', p.nombres || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, ''),
//               'expediente', e.numero_expediente,
//               'fecha_ingreso', i.fecha_ingreso,
//               'motivo_ingreso', i.motivo_ingreso,
//               'diagnostico', i.diagnostico_ingreso,
//               'medico_responsable', pm_p.nombres || ' ' || pm_p.apellido_paterno,
//               'dias_hospitalizacion', EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - i.fecha_ingreso))/86400
//             )
//             FROM internamiento i
//             INNER JOIN expediente e ON i.id_expediente = e.id_expediente
//             INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
//             INNER JOIN persona p ON pac.id_persona = p.id_persona
//             LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
//             LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
//             WHERE i.id_cama = c.id_cama 
//               AND i.fecha_egreso IS NULL
//             ORDER BY i.fecha_ingreso DESC
//             LIMIT 1
//           )
//           ELSE NULL
//         END as paciente_actual,
//         -- Historial de ocupación (últimos 5)
//         (
//           SELECT jsonb_agg(
//             jsonb_build_object(
//               'paciente', p.nombres || ' ' || p.apellido_paterno,
//               'fecha_ingreso', i.fecha_ingreso,
//               'fecha_egreso', i.fecha_egreso,
//               'dias_estancia', EXTRACT(EPOCH FROM (COALESCE(i.fecha_egreso, CURRENT_TIMESTAMP) - i.fecha_ingreso))/86400,
//               'motivo_ingreso', i.motivo_ingreso
//             ) ORDER BY i.fecha_ingreso DESC
//           )
//           FROM internamiento i
//           INNER JOIN expediente e ON i.id_expediente = e.id_expediente
//           INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
//           INNER JOIN persona p ON pac.id_persona = p.id_persona
//           WHERE i.id_cama = c.id_cama
//           ORDER BY i.fecha_ingreso DESC
//           LIMIT 5
//         ) as historial_ocupacion,
//         -- Estadísticas de uso
//         (
//           SELECT jsonb_build_object(
//             'total_usos', COUNT(*),
//             'promedio_estancia_dias', ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(i.fecha_egreso, CURRENT_TIMESTAMP) - i.fecha_ingreso))/86400), 2),
//             'ultimo_uso', MAX(i.fecha_ingreso),
//             'tasa_ocupacion_ultimo_mes', 
//               ROUND((COUNT(CASE WHEN i.fecha_ingreso >= NOW() - INTERVAL '30 days' THEN 1 END)::decimal / 30) * 100, 2)
//           )
//           FROM internamiento i
//           WHERE i.id_cama = c.id_cama
//         ) as estadisticas_uso
//       FROM cama c
//       INNER JOIN servicio s ON c.id_servicio = s.id_servicio
//       WHERE c.id_cama = $1
//     `;

//     const response: QueryResult = await pool.query(query, [id]);

//     if (response.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cama no encontrada'
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Cama obtenida correctamente',
//       data: response.rows[0]
//     });

//   } catch (error) {
//     console.error('Error al obtener cama por ID:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al obtener cama',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };





// ==========================================
// LIBERAR CAMA (PARA EGRESO DE PACIENTE)
// ==========================================
export const liberarCama = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { motivo_liberacion = 'Alta del paciente' } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que la cama existe y está ocupada
    const camaCheck = await pool.query(
      'SELECT id_cama, numero, estado FROM cama WHERE id_cama = $1',
      [id]
    );

    if (camaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cama no encontrada'
      });
    }

    if (camaCheck.rows[0].estado !== 'Ocupada') {
      return res.status(400).json({
        success: false,
        message: 'La cama no está ocupada'
      });
    }

    // Verificar que hay un internamiento activo
    const internamientoActivo = await pool.query(
      'SELECT id_internamiento FROM internamiento WHERE id_cama = $1 AND fecha_egreso IS NULL',
      [id]
    );

    if (internamientoActivo.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay un internamiento activo para esta cama'
      });
    }

    // Liberar cama (cambiar a estado de limpieza/preparación)
    const response: QueryResult = await pool.query(
      `UPDATE cama 
       SET estado = 'Contaminada', 
           descripcion = $1
       WHERE id_cama = $2 
       RETURNING *`,
      [`Liberada por: ${motivo_liberacion}. Requiere limpieza antes del próximo uso.`, id]
    );

    return res.status(200).json({
      success: true,
      message: `Cama ${camaCheck.rows[0].numero} liberada correctamente. Estado cambiado a 'Contaminada' para limpieza`,
      data: response.rows[0],
      siguiente_paso: 'Realizar limpieza y cambiar estado a Disponible'
    });

  } catch (error) {
    console.error('Error al liberar cama:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al liberar cama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};




// ==========================================
// CREAR NUEVA CAMA
// ==========================================








export const createCama = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      numero,
      id_servicio,
      estado = 'Disponible',
      descripcion,
      area,
      subarea
    }: CamaRequest = req.body;

    // Validaciones obligatorias
    if (!numero || !id_servicio || !area) {
      return res.status(400).json({
        success: false,
        message: 'Los campos numero, id_servicio y area son obligatorios'
      });
    }

    // Validar estados permitidos
    const estadosPermitidos = ['Disponible', 'Ocupada', 'Mantenimiento', 'Reservada', 'Contaminada'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `El estado debe ser uno de: ${estadosPermitidos.join(', ')}`
      });
    }

    // Verificar que el servicio existe
    const servicioCheck = await pool.query(
      'SELECT id_servicio, nombre FROM servicio WHERE id_servicio = $1 AND activo = true',
      [id_servicio]
    );

    if (servicioCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El servicio especificado no existe o no está activo'
      });
    }

    // Verificar que no exista una cama con el mismo número en el mismo servicio
    const camaExistente = await pool.query(
      'SELECT id_cama FROM cama WHERE numero = $1 AND id_servicio = $2',
      [numero.trim(), id_servicio]
    );

    if (camaExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Ya existe una cama con el número ${numero} en el servicio ${servicioCheck.rows[0].nombre}`
      });
    }

    // Crear cama
    const query = `
      INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;

    const values = [
      numero.trim(),
      id_servicio,
      estado,
      descripcion?.trim() || null,
      area.trim(),
      subarea?.trim() || null
    ];

    const response: QueryResult = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Cama creada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al crear cama:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear cama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR CAMA
// ==========================================
export const updateCama = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<CamaRequest> = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que la cama existe
    const camaCheck = await pool.query(
      'SELECT id_cama, estado FROM cama WHERE id_cama = $1',
      [id]
    );

    if (camaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cama no encontrada'
      });
    }

    // Validar estado si se proporciona
    if (updateData.estado) {
      const estadosPermitidos = ['Disponible', 'Ocupada', 'Mantenimiento', 'Reservada', 'Contaminada'];
      if (!estadosPermitidos.includes(updateData.estado)) {
        return res.status(400).json({
          success: false,
          message: `El estado debe ser uno de: ${estadosPermitidos.join(', ')}`
        });
      }

      // Validaciones especiales para cambios de estado
      const estadoActual = camaCheck.rows[0].estado;
      
      // No se puede cambiar a 'Ocupada' si ya hay un paciente
      if (updateData.estado === 'Ocupada' && estadoActual !== 'Ocupada') {
        const pacienteActual = await pool.query(
          'SELECT id_internamiento FROM internamiento WHERE id_cama = $1 AND fecha_egreso IS NULL',
          [id]
        );
        
        if (pacienteActual.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'No se puede marcar como ocupada una cama que ya tiene un paciente asignado'
          });
        }
      }

      // No se puede cambiar de 'Ocupada' a otro estado si hay paciente
      if (estadoActual === 'Ocupada' && updateData.estado !== 'Ocupada') {
        const pacienteActual = await pool.query(
          'SELECT id_internamiento FROM internamiento WHERE id_cama = $1 AND fecha_egreso IS NULL',
          [id]
        );
        
        if (pacienteActual.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'No se puede cambiar el estado de una cama ocupada. Primero debe dar de alta al paciente'
          });
        }
      }
    }

    // Verificar servicio si se proporciona
    if (updateData.id_servicio) {
      const servicioCheck = await pool.query(
        'SELECT id_servicio FROM servicio WHERE id_servicio = $1 AND activo = true',
        [updateData.id_servicio]
      );

      if (servicioCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'El servicio especificado no existe o no está activo'
        });
      }
    }

    // Verificar número único si se proporciona
    if (updateData.numero) {
      const servicioId = updateData.id_servicio || 
        (await pool.query('SELECT id_servicio FROM cama WHERE id_cama = $1', [id])).rows[0].id_servicio;
      
      const camaExistente = await pool.query(
        'SELECT id_cama FROM cama WHERE numero = $1 AND id_servicio = $2 AND id_cama != $3',
        [updateData.numero.trim(), servicioId, id]
      );

      if (camaExistente.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Ya existe otra cama con el número ${updateData.numero} en el mismo servicio`
        });
      }
    }

    // Construir query dinámico
    const fields = Object.keys(updateData);
    const values: any[] = [];
    const setClause = fields.map((field, index) => {
      let value = updateData[field as keyof CamaRequest];
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
      UPDATE cama 
      SET ${setClause}
      WHERE id_cama = $${values.length}
      RETURNING *
    `;

    const response: QueryResult = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: 'Cama actualizada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar cama:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar cama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR CAMA
// ==========================================
export const deleteCama = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que la cama existe
    const camaCheck = await pool.query(
      'SELECT id_cama, numero, estado FROM cama WHERE id_cama = $1',
      [id]
    );

    if (camaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cama no encontrada'
      });
    }

    // Verificar que no esté ocupada
    if (camaCheck.rows[0].estado === 'Ocupada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar una cama que está ocupada'
      });
    }

    // Verificar que no tenga internamientos activos
    const internamientosActivos = await pool.query(
      'SELECT id_internamiento FROM internamiento WHERE id_cama = $1 AND fecha_egreso IS NULL',
      [id]
    );

    if (internamientosActivos.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar una cama con internamientos activos'
      });
    }

    // Verificar si tiene historial de uso
    const tieneHistorial = await pool.query(
      'SELECT COUNT(*) as total FROM internamiento WHERE id_cama = $1',
      [id]
    );

    const totalUsos = parseInt(tieneHistorial.rows[0].total);

    if (totalUsos > 0) {
      // Si tiene historial, mejor cambiar estado a fuera de servicio
      await pool.query(
        "UPDATE cama SET estado = 'Mantenimiento', descripcion = 'Cama dada de baja - No usar' WHERE id_cama = $1",
        [id]
      );

      return res.status(200).json({
        success: true,
        message: `Cama ${camaCheck.rows[0].numero} dada de baja correctamente (conserva historial de ${totalUsos} usos)`,
        data: { 
          accion: 'baja_logica',
          usos_historicos: totalUsos
        }
      });
    } else {
      // Si no tiene historial, eliminar físicamente
      await pool.query('DELETE FROM cama WHERE id_cama = $1', [id]);

      return res.status(200).json({
        success: true,
        message: `Cama ${camaCheck.rows[0].numero} eliminada correctamente`,
        data: { 
          accion: 'eliminacion_fisica'
        }
      });
    }

  } catch (error) {
    console.error('Error al eliminar cama:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar cama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER CAMAS DISPONIBLES POR SERVICIO
// ==========================================
export const getCamasDisponiblesByServicio = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_servicio } = req.params;
    const { area, subarea } = req.query as any;

    if (!id_servicio || isNaN(parseInt(id_servicio))) {
      return res.status(400).json({
        success: false,
        message: 'El ID del servicio debe ser un número válido'
      });
    }

    let query = `
      SELECT 
        c.*,
        s.nombre as servicio_nombre
      FROM cama c
      INNER JOIN servicio s ON c.id_servicio = s.id_servicio
      WHERE c.id_servicio = $1 AND c.estado = 'Disponible'
    `;

    const values = [id_servicio];

    if (area) {
      query += ` AND c.area ILIKE $${values.length + 1}`;
      values.push(`%${area}%`);
    }

    if (subarea) {
      query += ` AND c.subarea ILIKE $${values.length + 1}`;
      values.push(`%${subarea}%`);
    }

    query += ` ORDER BY c.area, c.subarea, c.numero`;

    const response: QueryResult = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: 'Camas disponibles obtenidas correctamente',
      data: response.rows
    });

  } catch (error) {
    console.error('Error al obtener camas disponibles:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener camas disponibles',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE CAMAS
// ==========================================
export const getEstadisticasCamas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const queries = {
      totalCamas: `
        SELECT COUNT(*) as total FROM cama
      `,
      camasPorEstado: `
        SELECT 
          estado,
          COUNT(*) as cantidad,
          ROUND((COUNT(*)::decimal / (SELECT COUNT(*) FROM cama)) * 100, 2) as porcentaje
        FROM cama
        GROUP BY estado
        ORDER BY cantidad DESC
      `,
      camasPorServicio: `
        SELECT 
          s.nombre as servicio,
          COUNT(c.id_cama) as total_camas,
          COUNT(CASE WHEN c.estado = 'Disponible' THEN 1 END) as disponibles,
          COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END) as ocupadas,
          ROUND(
            (COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END)::decimal / COUNT(c.id_cama)) * 100, 2
          ) as porcentaje_ocupacion
        FROM servicio s
        LEFT JOIN cama c ON s.id_servicio = c.id_servicio
        WHERE s.activo = true
        GROUP BY s.id_servicio, s.nombre
        ORDER BY total_camas DESC
      `,
      camasPorArea: `
        SELECT 
          area,
          COUNT(*) as total_camas,
          COUNT(CASE WHEN estado = 'Disponible' THEN 1 END) as disponibles,
          COUNT(CASE WHEN estado = 'Ocupada' THEN 1 END) as ocupadas
        FROM cama
        GROUP BY area
        ORDER BY total_camas DESC
      `,
      promedioOcupacion: `
        SELECT 
          ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(i.fecha_egreso, CURRENT_TIMESTAMP) - i.fecha_ingreso))/86400), 2) as promedio_dias_estancia,
          COUNT(i.id_internamiento) as total_internamientos_historicos
        FROM internamiento i
        WHERE i.fecha_ingreso >= NOW() - INTERVAL '6 months'
      `
    };

    const [total, estados, servicios, areas, ocupacion] = await Promise.all([
      pool.query(queries.totalCamas),
      pool.query(queries.camasPorEstado),
      pool.query(queries.camasPorServicio),
      pool.query(queries.camasPorArea),
      pool.query(queries.promedioOcupacion)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Estadísticas de camas obtenidas correctamente',
      data: {
        total_camas: parseInt(total.rows[0].total),
        distribucion_por_estado: estados.rows,
        camas_por_servicio: servicios.rows,
        camas_por_area: areas.rows,
        estadisticas_ocupacion: ocupacion.rows[0]
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de camas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CAMBIAR ESTADO DE CAMA
// ==========================================
export const cambiarEstadoCama = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { nuevo_estado, motivo } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    if (!nuevo_estado) {
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado es obligatorio'
      });
    }

    const estadosPermitidos = ['Disponible', 'Ocupada', 'Mantenimiento', 'Reservada', 'Contaminada'];
    if (!estadosPermitidos.includes(nuevo_estado)) {
      return res.status(400).json({
        success: false,
        message: `El estado debe ser uno de: ${estadosPermitidos.join(', ')}`
      });
    }

    // Verificar que la cama existe
    const camaCheck = await pool.query(
      'SELECT id_cama, numero, estado FROM cama WHERE id_cama = $1',
      [id]
    );

    if (camaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cama no encontrada'
      });
    }

    const estadoActual = camaCheck.rows[0].estado;

    // Validaciones especiales para cambios de estado
    if (estadoActual === 'Ocupada' && nuevo_estado !== 'Ocupada') {
      const pacienteActual = await pool.query(
        'SELECT id_internamiento FROM internamiento WHERE id_cama = $1 AND fecha_egreso IS NULL',
        [id]
      );
      
      if (pacienteActual.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede cambiar el estado de una cama ocupada. Primero debe dar de alta al paciente'
        });
      }
    }

    // Actualizar estado
    const descripcionUpdate = motivo ? 
      `Estado cambiado a ${nuevo_estado}. Motivo: ${motivo}` : 
      `Estado cambiado a ${nuevo_estado}`;

    const response: QueryResult = await pool.query(
      'UPDATE cama SET estado = $1, descripcion = $2 WHERE id_cama = $3 RETURNING *',
      [nuevo_estado, descripcionUpdate, id]
    );

    return res.status(200).json({
      success: true,
      message: `Estado de cama ${camaCheck.rows[0].numero} cambiado de ${estadoActual} a ${nuevo_estado}`,
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al cambiar estado de cama:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al cambiar estado de cama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};