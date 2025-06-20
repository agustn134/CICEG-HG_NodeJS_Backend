// src/controllers/documentos_clinicos/nota_interconsulta.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getNotasInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM nota_interconsulta");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener notas de interconsulta");
  }
};

export const getNotaInterconsultaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM nota_interconsulta WHERE id_nota_interconsulta = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Nota de interconsulta no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener nota de interconsulta por ID");
  }
};

export const createNotaInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      area_interconsulta,
      motivo_interconsulta,
      diagnostico_presuntivo,
      examenes_laboratorio,
      examenes_gabinete,
      hallazgos,
      impresion_diagnostica,
      recomendaciones,
      id_medico_solicitante,
      id_medico_interconsulta
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO nota_interconsulta (id_documento, area_interconsulta, motivo_interconsulta, diagnostico_presuntivo, examenes_laboratorio, examenes_gabinete, hallazgos, impresion_diagnostica, recomendaciones, id_medico_solicitante, id_medico_interconsulta) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        id_documento,
        area_interconsulta,
        motivo_interconsulta,
        diagnostico_presuntivo,
        examenes_laboratorio,
        examenes_gabinete,
        hallazgos,
        impresion_diagnostica,
        recomendaciones,
        id_medico_solicitante,
        id_medico_interconsulta
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear nota de interconsulta");
  }
};

export const updateNotaInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_documento,
      area_interconsulta,
      motivo_interconsulta,
      diagnostico_presuntivo,
      examenes_laboratorio,
      examenes_gabinete,
      hallazgos,
      impresion_diagnostica,
      recomendaciones,
      id_medico_solicitante,
      id_medico_interconsulta
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE nota_interconsulta SET id_documento = $1, area_interconsulta = $2, motivo_interconsulta = $3, diagnostico_presuntivo = $4, examenes_laboratorio = $5, examenes_gabinete = $6, hallazgos = $7, impresion_diagnostica = $8, recomendaciones = $9, id_medico_solicitante = $10, id_medico_interconsulta = $11 WHERE id_nota_interconsulta = $12 RETURNING *",
      [
        id_documento,
        area_interconsulta,
        motivo_interconsulta,
        diagnostico_presuntivo,
        examenes_laboratorio,
        examenes_gabinete,
        hallazgos,
        impresion_diagnostica,
        recomendaciones,
        id_medico_solicitante,
        id_medico_interconsulta,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Nota de interconsulta no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar nota de interconsulta");
  }
};

export const deleteNotaInterconsulta = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM nota_interconsulta WHERE id_nota_interconsulta = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Nota de interconsulta no encontrada");
    }
    return res.status(200).send("Nota de interconsulta eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar nota de interconsulta");
  }
};