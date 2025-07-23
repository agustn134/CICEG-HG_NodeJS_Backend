import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';
import { ResponseHelper } from '../../utils/responses';

export class DashboardPediatricoController {
  
  // Obtener estadísticas generales de pediatría
  static async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          -- Pacientes pediátricos totales
          (SELECT COUNT(*) FROM persona WHERE es_pediatrico = TRUE) as total_pacientes_pediatricos,
          
          -- Pacientes pediátricos activos (con expediente activo)
          (SELECT COUNT(*) 
           FROM expediente e 
           JOIN paciente p ON e.id_paciente = p.id_paciente 
           JOIN persona per ON p.id_persona = per.id_persona 
           WHERE per.es_pediatrico = TRUE AND e.estado = 'Activo') as pacientes_activos,
          
          -- Pacientes hospitalizados
          (SELECT COUNT(*) 
           FROM internamiento i 
           JOIN expediente e ON i.id_expediente = e.id_expediente
           JOIN paciente p ON e.id_paciente = p.id_paciente
           JOIN persona per ON p.id_persona = per.id_persona
           WHERE per.es_pediatrico = TRUE AND i.fecha_egreso IS NULL) as pacientes_hospitalizados,
          
          -- Ingresos hoy
          (SELECT COUNT(*) 
           FROM internamiento i 
           JOIN expediente e ON i.id_expediente = e.id_expediente
           JOIN paciente p ON e.id_paciente = p.id_paciente
           JOIN persona per ON p.id_persona = per.id_persona
           WHERE per.es_pediatrico = TRUE AND DATE(i.fecha_ingreso) = CURRENT_DATE) as ingresos_hoy,
          
          -- Esquemas de vacunación completos
          (SELECT COUNT(*) 
           FROM inmunizaciones 
           WHERE esquema_completo_edad = TRUE) as esquemas_completos,
          
          -- Alertas nutricionales
          (SELECT COUNT(*) 
           FROM estado_nutricional_pediatrico 
           WHERE diagnostico_nutricional ILIKE '%desnutrición%' 
              OR diagnostico_nutricional ILIKE '%bajo peso%') as alertas_nutricionales
      `;

      const result: QueryResult = await client.query(query);
      
      ResponseHelper.statistics(res, 'Estadísticas Pediátricas', result.rows[0]);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener estadísticas pediátricas', 500, error);
    } finally {
      client.release();
    }
  }

  // Obtener pacientes pediátricos activos
  static async obtenerPacientesActivos(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { limit = 10, offset = 0 } = req.query;

      const query = `
        SELECT 
          e.numero_expediente,
          CONCAT(per.nombre, ' ', per.apellido_paterno, ' ', per.apellido_materno) as nombre_completo,
          edad_en_anos(per.fecha_nacimiento) as edad_anos,
          edad_total_meses(per.fecha_nacimiento) as edad_total_meses,
          per.sexo,
          pac.nombre_madre,
          pac.nombre_padre,
          i.fecha_ingreso,
          s.nombre as servicio_actual,
          c.numero as cama_actual,
          CASE WHEN i.id_internamiento IS NOT NULL THEN 'Hospitalizado' ELSE 'Ambulatorio' END as estado
        FROM expediente e
        JOIN paciente pac ON e.id_paciente = pac.id_paciente
        JOIN persona per ON pac.id_persona = per.id_persona
        LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente AND i.fecha_egreso IS NULL
        LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
        LEFT JOIN cama c ON i.id_cama = c.id_cama
        WHERE per.es_pediatrico = TRUE 
          AND e.estado = 'Activo'
        ORDER BY per.fecha_nacimiento DESC, i.fecha_ingreso DESC
        LIMIT $1 OFFSET $2
      `;

      const result: QueryResult = await client.query(query, [limit, offset]);
      
      ResponseHelper.success(res, 'Pacientes pediátricos activos obtenidos exitosamente', result.rows);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener pacientes pediátricos activos', 500, error);
    } finally {
      client.release();
    }
  }

  // Obtener distribución por edades
  static async obtenerDistribucionEdades(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          CASE 
            WHEN edad_total_meses(per.fecha_nacimiento) <= 1 THEN 'Neonatos (0-1 mes)'
            WHEN edad_total_meses(per.fecha_nacimiento) <= 12 THEN 'Lactantes (1-12 meses)'
            WHEN edad_en_anos(per.fecha_nacimiento) <= 2 THEN 'Niños pequeños (1-2 años)'
            WHEN edad_en_anos(per.fecha_nacimiento) <= 5 THEN 'Preescolares (3-5 años)'
            WHEN edad_en_anos(per.fecha_nacimiento) <= 12 THEN 'Escolares (6-12 años)'
            ELSE 'Adolescentes (13-18 años)'
          END as grupo_edad,
          COUNT(*) as cantidad
        FROM expediente e
        JOIN paciente pac ON e.id_paciente = pac.id_paciente
        JOIN persona per ON pac.id_persona = per.id_persona
        WHERE per.es_pediatrico = TRUE AND e.estado = 'Activo'
        GROUP BY grupo_edad
        ORDER BY 
          CASE 
            WHEN grupo_edad = 'Neonatos (0-1 mes)' THEN 1
            WHEN grupo_edad = 'Lactantes (1-12 meses)' THEN 2
            WHEN grupo_edad = 'Niños pequeños (1-2 años)' THEN 3
            WHEN grupo_edad = 'Preescolares (3-5 años)' THEN 4
            WHEN grupo_edad = 'Escolares (6-12 años)' THEN 5
            ELSE 6
          END
      `;

      const result: QueryResult = await client.query(query);
      
      ResponseHelper.success(res, 'Distribución por edades obtenida exitosamente', result.rows);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener distribución de edades', 500, error);
    } finally {
      client.release();
    }
  }

  // Obtener alertas pediátricas
  static async obtenerAlertasPediatricas(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          'nutricional' as tipo_alerta,
          e.numero_expediente,
          CONCAT(per.nombre, ' ', per.apellido_paterno) as nombre_paciente,
          edad_en_anos(per.fecha_nacimiento) as edad_anos,
          enp.diagnostico_nutricional as descripcion,
          enp.fecha_registro
        FROM estado_nutricional_pediatrico enp
        JOIN historia_clinica hc ON enp.id_historia_clinica = hc.id_historia_clinica
        JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
        JOIN expediente e ON dc.id_expediente = e.id_expediente
        JOIN paciente pac ON e.id_paciente = pac.id_paciente
        JOIN persona per ON pac.id_persona = per.id_persona
        WHERE (enp.diagnostico_nutricional ILIKE '%desnutrición%' 
               OR enp.diagnostico_nutricional ILIKE '%bajo peso%'
               OR enp.diagnostico_nutricional ILIKE '%obesidad%')
        
        UNION ALL
        
        SELECT 
          'desarrollo' as tipo_alerta,
          e.numero_expediente,
          CONCAT(per.nombre, ' ', per.apellido_paterno) as nombre_paciente,
          edad_en_anos(per.fecha_nacimiento) as edad_anos,
          dp.observaciones_desarrollo as descripcion,
          dp.fecha_registro
        FROM desarrollo_psicomotriz dp
        JOIN historia_clinica hc ON dp.id_historia_clinica = hc.id_historia_clinica
        JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
        JOIN expediente e ON dc.id_expediente = e.id_expediente
        JOIN paciente pac ON e.id_paciente = pac.id_paciente
        JOIN persona per ON pac.id_persona = per.id_persona
        WHERE dp.desarrollo_normal = FALSE
        
        ORDER BY fecha_registro DESC
        LIMIT 20
      `;

      const result: QueryResult = await client.query(query);
      
      ResponseHelper.success(res, 'Alertas pediátricas obtenidas exitosamente', result.rows);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener alertas pediátricas', 500, error);
    } finally {
      client.release();
    }
  }
}