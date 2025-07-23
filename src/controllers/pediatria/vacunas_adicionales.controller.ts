import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';
import { ResponseHelper } from '../../utils/responses';

export class VacunasAdicionalesController {
  
  // Agregar vacuna adicional
  static async agregar(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const {
        id_inmunizacion, nombre_vacuna, fecha_aplicacion, dosis_numero = 1,
        lote_vacuna, laboratorio, via_administracion = 'Intramuscular',
        sitio_aplicacion, aplicada_por, institucion_aplicacion = 'Hospital General San Luis de la Paz',
        reacciones_adversas, observaciones, registrado_por
      } = req.body;

      const query = `
        SELECT agregar_vacuna_adicional($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) as id_nueva_vacuna
      `;

      const values = [
        id_inmunizacion, nombre_vacuna, fecha_aplicacion, dosis_numero,
        lote_vacuna, laboratorio, via_administracion, sitio_aplicacion,
        aplicada_por, institucion_aplicacion, reacciones_adversas, observaciones, registrado_por
      ];

      const result: QueryResult = await client.query(query, values);
      
      // Obtener detalles de la vacuna recién creada
      const detalleQuery = `
        SELECT * FROM detalle_vacunas_adicionales 
        WHERE id_vacuna_adicional = $1
      `;
      
      const detalleResult: QueryResult = await client.query(detalleQuery, [result.rows[0].id_nueva_vacuna]);
      
      ResponseHelper.created(res, 'Vacuna adicional agregada exitosamente', detalleResult.rows[0]);

    } catch (error) {
      ResponseHelper.error(res, 'Error al agregar vacuna adicional', 500, error);
    } finally {
      client.release();
    }
  }

  // Obtener vacunas adicionales por esquema de inmunización
  static async obtenerPorInmunizacion(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id_inmunizacion } = req.params;

      const query = `
        SELECT * FROM detalle_vacunas_adicionales 
        WHERE id_inmunizacion = $1
        ORDER BY fecha_aplicacion DESC
      `;

      const result: QueryResult = await client.query(query, [id_inmunizacion]);
      
      ResponseHelper.success(res, 'Vacunas adicionales obtenidas exitosamente', result.rows);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener vacunas adicionales', 500, error);
    } finally {
      client.release();
    }
  }

  // Actualizar vacuna adicional
  static async actualizar(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id } = req.params;
      const {
        nombre_vacuna_libre, fecha_aplicacion, dosis_numero, lote_vacuna,
        laboratorio, via_administracion, sitio_aplicacion, aplicada_por,
        institucion_aplicacion, reacciones_adversas, observaciones
      } = req.body;

      const query = `
        UPDATE vacunas_adicionales SET
          nombre_vacuna_libre = $2, fecha_aplicacion = $3, dosis_numero = $4,
          lote_vacuna = $5, laboratorio = $6, via_administracion = $7,
          sitio_aplicacion = $8, aplicada_por = $9, institucion_aplicacion = $10,
          reacciones_adversas = $11, observaciones = $12
        WHERE id_vacuna_adicional = $1
        RETURNING *
      `;

      const values = [
        id, nombre_vacuna_libre, fecha_aplicacion, dosis_numero, lote_vacuna,
        laboratorio, via_administracion, sitio_aplicacion, aplicada_por,
        institucion_aplicacion, reacciones_adversas, observaciones
      ];

      const result: QueryResult = await client.query(query, values);
      
      if (result.rows.length === 0) {
        ResponseHelper.notFound(res, 'Vacuna adicional');
        return;
      }

      ResponseHelper.updated(res, 'Vacuna adicional actualizada exitosamente', result.rows[0]);

    } catch (error) {
      ResponseHelper.error(res, 'Error al actualizar vacuna adicional', 500, error);
    } finally {
      client.release();
    }
  }

  // Eliminar vacuna adicional
  static async eliminar(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id } = req.params;

      const query = `
        DELETE FROM vacunas_adicionales 
        WHERE id_vacuna_adicional = $1
        RETURNING *
      `;

      const result: QueryResult = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        ResponseHelper.notFound(res, 'Vacuna adicional');
        return;
      }

      ResponseHelper.deleted(res, 'Vacuna adicional');

    } catch (error) {
      ResponseHelper.error(res, 'Error al eliminar vacuna adicional', 500, error);
    } finally {
      client.release();
    }
  }

  // Obtener catálogo de vacunas disponibles
  static async obtenerCatalogo(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { tipo_vacuna, activa = true } = req.query;

      let query = `
        SELECT * FROM catalogo_vacunas 
        WHERE activa = $1
      `;
      const values = [activa];

      if (tipo_vacuna) {
        query += ` AND tipo_vacuna = $2`;
        values.push(tipo_vacuna as string);
      }

      query += ` ORDER BY tipo_vacuna, nombre_vacuna`;

      const result: QueryResult = await client.query(query, values);
      
      ResponseHelper.success(res, 'Catálogo de vacunas obtenido exitosamente', result.rows);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener catálogo de vacunas', 500, error);
    } finally {
      client.release();
    }
  }

  // Agregar nueva vacuna al catálogo
  static async agregarAlCatalogo(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const {
        nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion,
        dosis_requeridas = 1, intervalo_dosis, via_administracion
      } = req.body;

      const query = `
        INSERT INTO catalogo_vacunas (
          nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion,
          dosis_requeridas, intervalo_dosis, via_administracion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const values = [
        nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion,
        dosis_requeridas, intervalo_dosis, via_administracion
      ];

      const result: QueryResult = await client.query(query, values);
      
      ResponseHelper.created(res, 'Vacuna agregada al catálogo exitosamente', result.rows[0]);

    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        ResponseHelper.validationError(res, 'Ya existe una vacuna con ese nombre en el catálogo');
      } else {
        ResponseHelper.error(res, 'Error al agregar vacuna al catálogo', 500, error);
      }
    } finally {
      client.release();
    }
  }

  // Buscar vacunas por nombre
  static async buscarVacunas(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { termino } = req.query;

      if (!termino) {
        ResponseHelper.validationError(res, 'Término de búsqueda requerido');
        return;
      }

      const query = `
        SELECT * FROM catalogo_vacunas 
        WHERE UPPER(nombre_vacuna) LIKE UPPER($1)
          AND activa = TRUE
        ORDER BY nombre_vacuna
        LIMIT 20
      `;

      const result: QueryResult = await client.query(query, [`%${termino}%`]);
      
      ResponseHelper.success(res, `Búsqueda de vacunas completada: ${result.rows.length} resultado(s)`, result.rows);

    } catch (error) {
      ResponseHelper.error(res, 'Error al buscar vacunas', 500, error);
    } finally {
      client.release();
    }
  }

  // Obtener reporte de vacunas adicionales aplicadas
  static async obtenerReporte(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { fecha_inicio, fecha_fin, tipo_vacuna } = req.query;

      let query = `
        SELECT 
          va.nombre_vacuna_libre,
          cv.nombre_vacuna as nombre_catalogo,
          cv.tipo_vacuna,
          COUNT(*) as total_aplicadas,
          COUNT(CASE WHEN va.reacciones_adversas IS NOT NULL AND va.reacciones_adversas != '' THEN 1 END) as con_reacciones,
          va.institucion_aplicacion
        FROM vacunas_adicionales va
        LEFT JOIN catalogo_vacunas cv ON va.id_vacuna = cv.id_vacuna
      `;

      const values = [];
      const conditions = [];

      if (fecha_inicio) {
        conditions.push(`va.fecha_aplicacion >= $${values.length + 1}`);
        values.push(fecha_inicio);
      }

      if (fecha_fin) {
        conditions.push(`va.fecha_aplicacion <= $${values.length + 1}`);
        values.push(fecha_fin);
      }

      if (tipo_vacuna) {
        conditions.push(`cv.tipo_vacuna = $${values.length + 1}`);
        values.push(tipo_vacuna);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += `
        GROUP BY va.nombre_vacuna_libre, cv.nombre_vacuna, cv.tipo_vacuna, va.institucion_aplicacion
        ORDER BY total_aplicadas DESC
      `;

      const result: QueryResult = await client.query(query, values);
      
      ResponseHelper.success(res, 'Reporte de vacunas adicionales generado exitosamente', result.rows);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener reporte de vacunas adicionales', 500, error);
    } finally {
      client.release();
    }
  }
}