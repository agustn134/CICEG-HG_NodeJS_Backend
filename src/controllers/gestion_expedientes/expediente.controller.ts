// src/controllers/gestion_expedientes/expediente.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getExpedientes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM expediente");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener expedientes");
  }
};

export const getExpedienteById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM expediente WHERE id_expediente = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Expediente no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener expediente por ID");
  }
};

export const createExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_paciente,
      numero_expediente,
      estado,
      notas_administrativas
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO expediente (id_paciente, numero_expediente, estado, notas_administrativas) VALUES ($1, $2, $3, $4) RETURNING *",
      [id_paciente, numero_expediente, estado, notas_administrativas]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear expediente");
  }
};

export const updateExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_paciente,
      numero_expediente,
      estado,
      notas_administrativas
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE expediente SET id_paciente = $1, numero_expediente = $2, estado = $3, notas_administrativas = $4 WHERE id_expediente = $5 RETURNING *",
      [id_paciente, numero_expediente, estado, notas_administrativas, id]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Expediente no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar expediente");
  }
};

export const deleteExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM expediente WHERE id_expediente = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Expediente no encontrado");
    }
    return res.status(200).send("Expediente eliminado correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar expediente");
  }
};