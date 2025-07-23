import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';
import { ResponseHelper } from '../../utils/responses';

export class DesarrolloPsicomotrizController {
  
  // Crear desarrollo psicomotriz
  static async crear(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const {
        id_historia_clinica, sostuvo_cabeza_meses, se_sento_meses, gateo_meses,
        camino_meses, primera_palabra_meses, primeras_frases_meses,
        sonrisa_social_meses, reconocimiento_padres_meses, control_diurno_meses,
        control_nocturno_meses, juego_simbolico_meses, seguimiento_instrucciones_meses,
        desarrollo_normal, observaciones_desarrollo, necesita_estimulacion, tipo_estimulacion
      } = req.body;

      const query = `
        INSERT INTO desarrollo_psicomotriz (
          id_historia_clinica, sostuvo_cabeza_meses, se_sento_meses, gateo_meses,
          camino_meses, primera_palabra_meses, primeras_frases_meses,
          sonrisa_social_meses, reconocimiento_padres_meses, control_diurno_meses,
          control_nocturno_meses, juego_simbolico_meses, seguimiento_instrucciones_meses,
          desarrollo_normal, observaciones_desarrollo, necesita_estimulacion, tipo_estimulacion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `;

      const values = [
        id_historia_clinica, sostuvo_cabeza_meses, se_sento_meses, gateo_meses,
        camino_meses, primera_palabra_meses, primeras_frases_meses,
        sonrisa_social_meses, reconocimiento_padres_meses, control_diurno_meses,
        control_nocturno_meses, juego_simbolico_meses, seguimiento_instrucciones_meses,
        desarrollo_normal, observaciones_desarrollo, necesita_estimulacion, tipo_estimulacion
      ];

      const result: QueryResult = await client.query(query, values);
      
      ResponseHelper.created(res, 'Desarrollo psicomotriz creado exitosamente', result.rows[0]);

    } catch (error) {
      ResponseHelper.error(res, 'Error al crear desarrollo psicomotriz', 500, error);
    } finally {
      client.release();
    }
  }

  // Obtener por ID de historia clínica
  static async obtenerPorHistoriaClinica(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id_historia_clinica } = req.params;

      const query = `
        SELECT *, 
          validar_desarrollo_psicomotriz(
            (SELECT edad_total_meses(per.fecha_nacimiento) 
             FROM historia_clinica hc 
             JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
             JOIN expediente e ON dc.id_expediente = e.id_expediente
             JOIN paciente pac ON e.id_paciente = pac.id_paciente
             JOIN persona per ON pac.id_persona = per.id_persona
             WHERE hc.id_historia_clinica = $1),
            sostuvo_cabeza_meses, se_sento_meses, camino_meses
          ) as evaluacion_desarrollo
        FROM desarrollo_psicomotriz 
        WHERE id_historia_clinica = $1
      `;

      const result: QueryResult = await client.query(query, [id_historia_clinica]);
      
      if (result.rows.length === 0) {
        ResponseHelper.notFound(res, 'Desarrollo psicomotriz');
        return;
      }

      ResponseHelper.success(res, 'Desarrollo psicomotriz obtenido exitosamente', result.rows[0]);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener desarrollo psicomotriz', 500, error);
    } finally {
      client.release();
    }
  }

  // Actualizar desarrollo psicomotriz
  static async actualizar(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id } = req.params;
      const {
        sostuvo_cabeza_meses, se_sento_meses, gateo_meses, camino_meses,
        primera_palabra_meses, primeras_frases_meses, sonrisa_social_meses,
        reconocimiento_padres_meses, control_diurno_meses, control_nocturno_meses,
        juego_simbolico_meses, seguimiento_instrucciones_meses, desarrollo_normal,
        observaciones_desarrollo, necesita_estimulacion, tipo_estimulacion
      } = req.body;

      const query = `
        UPDATE desarrollo_psicomotriz SET
          sostuvo_cabeza_meses = $2, se_sento_meses = $3, gateo_meses = $4,
          camino_meses = $5, primera_palabra_meses = $6, primeras_frases_meses = $7,
          sonrisa_social_meses = $8, reconocimiento_padres_meses = $9,
          control_diurno_meses = $10, control_nocturno_meses = $11,
          juego_simbolico_meses = $12, seguimiento_instrucciones_meses = $13,
          desarrollo_normal = $14, observaciones_desarrollo = $15,
          necesita_estimulacion = $16, tipo_estimulacion = $17
        WHERE id_desarrollo = $1
        RETURNING *
      `;

      const values = [
        id, sostuvo_cabeza_meses, se_sento_meses, gateo_meses, camino_meses,
        primera_palabra_meses, primeras_frases_meses, sonrisa_social_meses,
        reconocimiento_padres_meses, control_diurno_meses, control_nocturno_meses,
        juego_simbolico_meses, seguimiento_instrucciones_meses, desarrollo_normal,
        observaciones_desarrollo, necesita_estimulacion, tipo_estimulacion
      ];

      const result: QueryResult = await client.query(query, values);
      
      if (result.rows.length === 0) {
        ResponseHelper.notFound(res, 'Desarrollo psicomotriz');
        return;
      }

      ResponseHelper.updated(res, 'Desarrollo psicomotriz actualizado exitosamente', result.rows[0]);

    } catch (error) {
      ResponseHelper.error(res, 'Error al actualizar desarrollo psicomotriz', 500, error);
    } finally {
      client.release();
    }
  }

  // Eliminar desarrollo psicomotriz
  static async eliminar(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id } = req.params;

      const query = `
        DELETE FROM desarrollo_psicomotriz 
        WHERE id_desarrollo = $1
        RETURNING *
      `;

      const result: QueryResult = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        ResponseHelper.notFound(res, 'Desarrollo psicomotriz');
        return;
      }

      ResponseHelper.deleted(res, 'Desarrollo psicomotriz');

    } catch (error) {
      ResponseHelper.error(res, 'Error al eliminar desarrollo psicomotriz', 500, error);
    } finally {
      client.release();
    }
  }

  // Obtener hitos por rango de edad
  static async obtenerHitosPorEdad(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { edad_meses } = req.params;

      const query = `
        SELECT 
          'Sostuvo cabeza' as hito,
          CASE WHEN $1 >= 2 AND $1 <= 4 THEN 'Esperado' 
               WHEN $1 > 4 THEN 'Tardío' 
               ELSE 'Temprano' END as evaluacion,
          '2-4 meses' as rango_normal
        UNION ALL
        SELECT 
          'Se sentó',
          CASE WHEN $1 >= 6 AND $1 <= 9 THEN 'Esperado' 
               WHEN $1 > 9 THEN 'Tardío' 
               ELSE 'Temprano para evaluar' END,
          '6-9 meses'
        UNION ALL
        SELECT 
          'Caminó',
          CASE WHEN $1 >= 12 AND $1 <= 18 THEN 'Esperado' 
               WHEN $1 > 18 THEN 'Tardío' 
               ELSE 'Temprano para evaluar' END,
          '12-18 meses'
        UNION ALL
        SELECT 
          'Primera palabra',
          CASE WHEN $1 >= 10 AND $1 <= 14 THEN 'Esperado' 
               WHEN $1 > 14 THEN 'Tardío' 
               ELSE 'Temprano para evaluar' END,
          '10-14 meses'
      `;

      const result: QueryResult = await client.query(query, [edad_meses]);
      
      ResponseHelper.success(res, 'Hitos del desarrollo obtenidos exitosamente', result.rows);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener hitos por edad', 500, error);
    } finally {
      client.release();
    }
  }
}