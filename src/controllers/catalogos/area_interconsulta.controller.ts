import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getAreasInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        ai.id_area_interconsulta,
        ai.nombre,
        ai.descripcion,
        ai.activo,
        COUNT(ni.id_nota_interconsulta) AS numero_notas_interconsulta
      FROM 
        area_interconsulta ai
      LEFT JOIN 
        nota_interconsulta ni ON ai.id_area_interconsulta = ni.area_interconsulta
      GROUP BY 
        ai.id_area_interconsulta, ai.nombre, ai.descripcion, ai.activo
      ORDER BY 
        ai.id_area_interconsulta;
    `;
    const response: QueryResult = await pool.query(query);
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener áreas de interconsulta");
  }
};

export const getAreaInterconsultaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const query = `
      SELECT 
        ai.id_area_interconsulta,
        ai.nombre,
        ai.descripcion,
        ai.activo,
        ni.id_nota_interconsulta,
        ni.motivo_interconsulta,
        ni.diagnostico_presuntivo,
        ni.examenes_laboratorio,
        ni.examenes_gabinete,
        ni.hallazgos,
        ni.impresion_diagnostica,
        ni.recomendaciones,
        ni.id_medico_solicitante,
        ni.id_medico_interconsulta
      FROM 
        area_interconsulta ai
      LEFT JOIN 
        nota_interconsulta ni ON ai.id_area_interconsulta = ni.area_interconsulta
      WHERE 
        ai.id_area_interconsulta = $1
      ORDER BY 
        ni.id_nota_interconsulta;
    `;
    const response: QueryResult = await pool.query(query, [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Área de interconsulta no encontrada");
    }

    // Agrupar las notas de interconsulta por área de interconsulta
    const areaInterconsulta = response.rows[0];
    const notasInterconsulta = response.rows.map(row => ({
      id_nota_interconsulta: row.id_nota_interconsulta,
      motivo_interconsulta: row.motivo_interconsulta,
      diagnostico_presuntivo: row.diagnostico_presuntivo,
      examenes_laboratorio: row.examenes_laboratorio,
      examenes_gabinete: row.examenes_gabinete,
      hallazgos: row.hallazgos,
      impresion_diagnostica: row.impresion_diagnostica,
      recomendaciones: row.recomendaciones,
      id_medico_solicitante: row.id_medico_solicitante,
      id_medico_interconsulta: row.id_medico_interconsulta
    })).filter(nota => nota.id_nota_interconsulta !== null);

    areaInterconsulta.notas_interconsulta = notasInterconsulta;

    return res.status(200).json(areaInterconsulta);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener área de interconsulta por ID");
  }
};

export const createAreaInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nombre, descripcion, activo } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO area_interconsulta (nombre, descripcion, activo) VALUES ($1, $2, $3) RETURNING *",
      [nombre, descripcion, activo]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear área de interconsulta");
  }
};

export const updateAreaInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const { nombre, descripcion, activo } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE area_interconsulta SET nombre = $1, descripcion = $2, activo = $3 WHERE id_area_interconsulta = $4 RETURNING *",
      [nombre, descripcion, activo, id]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Área de interconsulta no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar área de interconsulta");
  }
};

export const deleteAreaInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM area_interconsulta WHERE id_area_interconsulta = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Área de interconsulta no encontrada");
    }
    return res.status(200).send("Área de interconsulta eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar área de interconsulta");
  }
};