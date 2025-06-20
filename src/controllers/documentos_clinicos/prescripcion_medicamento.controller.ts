// src/controllers/documentos_clinicos/prescripcion_medicamento.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getPrescripcionesMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM prescripcion_medicamento");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener prescripciones de medicamento");
  }
};

export const getPrescripcionMedicamentoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM prescripcion_medicamento WHERE id_prescripcion = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Prescripción de medicamento no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener prescripción de medicamento por ID");
  }
};

export const createPrescripcionMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      id_medicamento,
      dosis,
      via_administracion,
      frecuencia,
      duracion,
      indicaciones_especiales,
      fecha_inicio,
      fecha_fin,
      activo
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO prescripcion_medicamento (id_documento, id_medicamento, dosis, via_administracion, frecuencia, duracion, indicaciones_especiales, fecha_inicio, fecha_fin, activo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        id_documento,
        id_medicamento,
        dosis,
        via_administracion,
        frecuencia,
        duracion,
        indicaciones_especiales,
        fecha_inicio,
        fecha_fin,
        activo
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear prescripción de medicamento");
  }
};

export const updatePrescripcionMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_documento,
      id_medicamento,
      dosis,
      via_administracion,
      frecuencia,
      duracion,
      indicaciones_especiales,
      fecha_inicio,
      fecha_fin,
      activo
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE prescripcion_medicamento SET id_documento = $1, id_medicamento = $2, dosis = $3, via_administracion = $4, frecuencia = $5, duracion = $6, indicaciones_especiales = $7, fecha_inicio = $8, fecha_fin = $9, activo = $10 WHERE id_prescripcion = $11 RETURNING *",
      [
        id_documento,
        id_medicamento,
        dosis,
        via_administracion,
        frecuencia,
        duracion,
        indicaciones_especiales,
        fecha_inicio,
        fecha_fin,
        activo,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Prescripción de medicamento no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar prescripción de medicamento");
  }
};

export const deletePrescripcionMedicamento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM prescripcion_medicamento WHERE id_prescripcion = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Prescripción de medicamento no encontrada");
    }
    return res.status(200).send("Prescripción de medicamento eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar prescripción de medicamento");
  }
};