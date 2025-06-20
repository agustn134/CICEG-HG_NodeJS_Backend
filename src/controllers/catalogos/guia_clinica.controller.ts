import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getGuiasClinicas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM guia_clinica");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener guías clínicas");
  }
};

export const getGuiaClinicaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM guia_clinica WHERE id_guia_diagnostico = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Guía clínica no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener guía clínica por ID");
  }
};

export const createGuiaClinica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO guia_clinica (area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear guía clínica");
  }
};

export const updateGuiaClinica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const { area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE guia_clinica SET area = $1, codigo = $2, nombre = $3, fuente = $4, fecha_actualizacion = $5, descripcion = $6, activo = $7 WHERE id_guia_diagnostico = $8 RETURNING *",
      [area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo, id]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Guía clínica no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar guía clínica");
  }
};

export const deleteGuiaClinica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM guia_clinica WHERE id_guia_diagnostico = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Guía clínica no encontrada");
    }
    return res.status(200).send("Guía clínica eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar guía clínica");
  }
};