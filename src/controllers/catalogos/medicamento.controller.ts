import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getMedicamentos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM medicamento");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener medicamentos");
  }
};

export const getMedicamentoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM medicamento WHERE id_medicamento = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Medicamento no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener medicamento por ID");
  }
};

export const createMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO medicamento (codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear medicamento");
  }
};

export const updateMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const { codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE medicamento SET codigo = $1, nombre = $2, presentacion = $3, concentracion = $4, grupo_terapeutico = $5, activo = $6 WHERE id_medicamento = $7 RETURNING *",
      [codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo, id]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Medicamento no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar medicamento");
  }
};

export const deleteMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM medicamento WHERE id_medicamento = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Medicamento no encontrado");
    }
    return res.status(200).send("Medicamento eliminado correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar medicamento");
  }
};