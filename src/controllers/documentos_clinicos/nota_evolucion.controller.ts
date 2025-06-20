// src/controllers/documentos_clinicos/nota_evolucion.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getNotasEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM nota_evolucion");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener notas de evolución");
  }
};

export const getNotaEvolucionById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM nota_evolucion WHERE id_nota_evolucion = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Nota de evolución no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener nota de evolución por ID");
  }
};

export const createNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      subjetivo,
      objetivo,
      analisis,
      plan
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO nota_evolucion (id_documento, subjetivo, objetivo, analisis, plan) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id_documento, subjetivo, objetivo, analisis, plan]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear nota de evolución");
  }
};

export const updateNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_documento,
      subjetivo,
      objetivo,
      analisis,
      plan
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE nota_evolucion SET id_documento = $1, subjetivo = $2, objetivo = $3, analisis = $4, plan = $5 WHERE id_nota_evolucion = $6 RETURNING *",
      [id_documento, subjetivo, objetivo, analisis, plan, id]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Nota de evolución no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar nota de evolución");
  }
};

export const deleteNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM nota_evolucion WHERE id_nota_evolucion = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Nota de evolución no encontrada");
    }
    return res.status(200).send("Nota de evolución eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar nota de evolución");
  }
};