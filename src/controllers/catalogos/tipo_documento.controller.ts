import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getTiposDocumento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM tipo_documento");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener tipos de documento");
  }
};

export const getTipoDocumentoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM tipo_documento WHERE id_tipo_documento = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Tipo de documento no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener tipo de documento por ID");
  }
};

export const createTipoDocumento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nombre, descripcion, activo } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO tipo_documento (nombre, descripcion, activo) VALUES ($1, $2, $3) RETURNING *",
      [nombre, descripcion, activo]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear tipo de documento");
  }
};

export const updateTipoDocumento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const { nombre, descripcion, activo } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE tipo_documento SET nombre = $1, descripcion = $2, activo = $3 WHERE id_tipo_documento = $4 RETURNING *",
      [nombre, descripcion, activo, id]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Tipo de documento no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar tipo de documento");
  }
};

export const deleteTipoDocumento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM tipo_documento WHERE id_tipo_documento = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Tipo de documento no encontrado");
    }
    return res.status(200).send("Tipo de documento eliminado correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar tipo de documento");
  }
};