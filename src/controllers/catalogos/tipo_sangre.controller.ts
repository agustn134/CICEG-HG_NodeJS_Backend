import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getTiposSangre = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM tipo_sangre");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener tipos de sangre");
  }
};

export const getTipoSangreById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM tipo_sangre WHERE id_tipo_sangre = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Tipo de sangre no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener tipo de sangre por ID");
  }
};

export const createTipoSangre = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nombre, descripcion } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO tipo_sangre (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear tipo de sangre");
  }
};

export const updateTipoSangre = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const { nombre, descripcion } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE tipo_sangre SET nombre = $1, descripcion = $2 WHERE id_tipo_sangre = $3 RETURNING *",
      [nombre, descripcion, id]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Tipo de sangre no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar tipo de sangre");
  }
};

export const deleteTipoSangre = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM tipo_sangre WHERE id_tipo_sangre = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Tipo de sangre no encontrado");
    }
    return res.status(200).send("Tipo de sangre eliminado correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar tipo de sangre");
  }
};