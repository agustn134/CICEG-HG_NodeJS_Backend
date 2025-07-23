import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';
import { ResponseHelper } from '../../utils/responses';

export class AntecedentesHeredoFamiliaresController {
  
  // Crear antecedentes heredo-familiares
  static async crear(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const {
        id_historia_clinica,
        madre_alergias, madre_tuberculosis, madre_sifilis, madre_discrasias,
        madre_diabetes, madre_cardiopatias, madre_convulsiones, madre_hipotiroidismo,
        madre_hipertension, madre_toxicomanias, madre_otros,
        padre_alergias, padre_tuberculosis, padre_sifilis, padre_discrasias,
        padre_diabetes, padre_cardiopatias, padre_convulsiones, padre_hipotiroidismo,
        padre_hipertension, padre_toxicomanias, padre_otros,
        hermanos_antecedentes, abuelos_paternos_antecedentes, 
        abuelos_maternos_antecedentes, otros_familiares_antecedentes
      } = req.body;

      const query = `
        INSERT INTO antecedentes_heredo_familiares (
          id_historia_clinica, madre_alergias, madre_tuberculosis, madre_sifilis,
          madre_discrasias, madre_diabetes, madre_cardiopatias, madre_convulsiones,
          madre_hipotiroidismo, madre_hipertension, madre_toxicomanias, madre_otros,
          padre_alergias, padre_tuberculosis, padre_sifilis, padre_discrasias,
          padre_diabetes, padre_cardiopatias, padre_convulsiones, padre_hipotiroidismo,
          padre_hipertension, padre_toxicomanias, padre_otros,
          hermanos_antecedentes, abuelos_paternos_antecedentes, 
          abuelos_maternos_antecedentes, otros_familiares_antecedentes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
        RETURNING *
      `;

      const values = [
        id_historia_clinica, madre_alergias, madre_tuberculosis, madre_sifilis,
        madre_discrasias, madre_diabetes, madre_cardiopatias, madre_convulsiones,
        madre_hipotiroidismo, madre_hipertension, madre_toxicomanias, madre_otros,
        padre_alergias, padre_tuberculosis, padre_sifilis, padre_discrasias,
        padre_diabetes, padre_cardiopatias, padre_convulsiones, padre_hipotiroidismo,
        padre_hipertension, padre_toxicomanias, padre_otros,
        hermanos_antecedentes, abuelos_paternos_antecedentes, 
        abuelos_maternos_antecedentes, otros_familiares_antecedentes
      ];

      const result: QueryResult = await client.query(query, values);
      
      ResponseHelper.created(res, 'Antecedentes heredo-familiares creados exitosamente', result.rows[0]);

    } catch (error) {
      ResponseHelper.error(res, 'Error al crear antecedentes heredo-familiares', 500, error);
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
        SELECT * FROM antecedentes_heredo_familiares 
        WHERE id_historia_clinica = $1
      `;

      const result: QueryResult = await client.query(query, [id_historia_clinica]);
      
      if (result.rows.length === 0) {
        ResponseHelper.notFound(res, 'Antecedentes heredo-familiares');
        return;
      }

      ResponseHelper.success(res, 'Antecedentes heredo-familiares obtenidos exitosamente', result.rows[0]);

    } catch (error) {
      ResponseHelper.error(res, 'Error al obtener antecedentes heredo-familiares', 500, error);
    } finally {
      client.release();
    }
  }

  // Actualizar antecedentes heredo-familiares
  static async actualizar(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id } = req.params;
      const {
        madre_alergias, madre_tuberculosis, madre_sifilis, madre_discrasias,
        madre_diabetes, madre_cardiopatias, madre_convulsiones, madre_hipotiroidismo,
        madre_hipertension, madre_toxicomanias, madre_otros,
        padre_alergias, padre_tuberculosis, padre_sifilis, padre_discrasias,
        padre_diabetes, padre_cardiopatias, padre_convulsiones, padre_hipotiroidismo,
        padre_hipertension, padre_toxicomanias, padre_otros,
        hermanos_antecedentes, abuelos_paternos_antecedentes, 
        abuelos_maternos_antecedentes, otros_familiares_antecedentes
      } = req.body;

      const query = `
        UPDATE antecedentes_heredo_familiares SET
          madre_alergias = $2, madre_tuberculosis = $3, madre_sifilis = $4,
          madre_discrasias = $5, madre_diabetes = $6, madre_cardiopatias = $7,
          madre_convulsiones = $8, madre_hipotiroidismo = $9, madre_hipertension = $10,
          madre_toxicomanias = $11, madre_otros = $12,
          padre_alergias = $13, padre_tuberculosis = $14, padre_sifilis = $15,
          padre_discrasias = $16, padre_diabetes = $17, padre_cardiopatias = $18,
          padre_convulsiones = $19, padre_hipotiroidismo = $20, padre_hipertension = $21,
          padre_toxicomanias = $22, padre_otros = $23,
          hermanos_antecedentes = $24, abuelos_paternos_antecedentes = $25,
          abuelos_maternos_antecedentes = $26, otros_familiares_antecedentes = $27
        WHERE id_antecedentes_hf = $1
        RETURNING *
      `;

      const values = [
        id, madre_alergias, madre_tuberculosis, madre_sifilis,
        madre_discrasias, madre_diabetes, madre_cardiopatias, madre_convulsiones,
        madre_hipotiroidismo, madre_hipertension, madre_toxicomanias, madre_otros,
        padre_alergias, padre_tuberculosis, padre_sifilis, padre_discrasias,
        padre_diabetes, padre_cardiopatias, padre_convulsiones, padre_hipotiroidismo,
        padre_hipertension, padre_toxicomanias, padre_otros,
        hermanos_antecedentes, abuelos_paternos_antecedentes, 
        abuelos_maternos_antecedentes, otros_familiares_antecedentes
      ];

      const result: QueryResult = await client.query(query, values);
      
      if (result.rows.length === 0) {
        ResponseHelper.notFound(res, 'Antecedentes heredo-familiares');
        return;
      }

      ResponseHelper.updated(res, 'Antecedentes heredo-familiares actualizados exitosamente', result.rows[0]);

    } catch (error) {
      ResponseHelper.error(res, 'Error al actualizar antecedentes heredo-familiares', 500, error);
    } finally {
      client.release();
    }
  }

  // Eliminar antecedentes heredo-familiares
  static async eliminar(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id } = req.params;

      const query = `
        DELETE FROM antecedentes_heredo_familiares 
        WHERE id_antecedentes_hf = $1
        RETURNING *
      `;

      const result: QueryResult = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        ResponseHelper.notFound(res, 'Antecedentes heredo-familiares');
        return;
      }

      ResponseHelper.deleted(res, 'Antecedentes heredo-familiares');

    } catch (error) {
      ResponseHelper.error(res, 'Error al eliminar antecedentes heredo-familiares', 500, error);
    } finally {
      client.release();
    }
  }
}