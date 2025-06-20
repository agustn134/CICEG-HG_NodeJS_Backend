// src/controllers/documentos_clinicos/nota_urgencias.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getNotasUrgencias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM nota_urgencias");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener notas de urgencias");
  }
};

export const getNotaUrgenciasById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM nota_urgencias WHERE id_nota_urgencias = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Nota de urgencias no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener nota de urgencias por ID");
  }
};

export const createNotaUrgencias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      motivo_atencion,
      estado_conciencia,
      resumen_interrogatorio,
      exploracion_fisica,
      resultados_estudios,
      estado_mental,
      diagnostico,
      id_guia_diagnostico,
      plan_tratamiento,
      pronostico,
      area_interconsulta
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO nota_urgencias (id_documento, motivo_atencion, estado_conciencia, resumen_interrogatorio, exploracion_fisica, resultados_estudios, estado_mental, diagnostico, id_guia_diagnostico, plan_tratamiento, pronostico, area_interconsulta) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [
        id_documento,
        motivo_atencion,
        estado_conciencia,
        resumen_interrogatorio,
        exploracion_fisica,
        resultados_estudios,
        estado_mental,
        diagnostico,
        id_guia_diagnostico,
        plan_tratamiento,
        pronostico,
        area_interconsulta
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear nota de urgencias");
  }
};

export const updateNotaUrgencias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_documento,
      motivo_atencion,
      estado_conciencia,
      resumen_interrogatorio,
      exploracion_fisica,
      resultados_estudios,
      estado_mental,
      diagnostico,
      id_guia_diagnostico,
      plan_tratamiento,
      pronostico,
      area_interconsulta
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE nota_urgencias SET id_documento = $1, motivo_atencion = $2, estado_conciencia = $3, resumen_interrogatorio = $4, exploracion_fisica = $5, resultados_estudios = $6, estado_mental = $7, diagnostico = $8, id_guia_diagnostico = $9, plan_tratamiento = $10, pronostico = $11, area_interconsulta = $12 WHERE id_nota_urgencias = $13 RETURNING *",
      [
        id_documento,
        motivo_atencion,
        estado_conciencia,
        resumen_interrogatorio,
        exploracion_fisica,
        resultados_estudios,
        estado_mental,
        diagnostico,
        id_guia_diagnostico,
        plan_tratamiento,
        pronostico,
        area_interconsulta,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Nota de urgencias no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar nota de urgencias");
  }
};

export const deleteNotaUrgencias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM nota_urgencias WHERE id_nota_urgencias = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Nota de urgencias no encontrada");
    }
    return res.status(200).send("Nota de urgencias eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar nota de urgencias");
  }
};