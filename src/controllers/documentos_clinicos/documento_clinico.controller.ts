// src/controllers/documentos_clinicos/documento_clinico.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getDocumentosClinicos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM documento_clinico");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener documentos clínicos");
  }
};

export const getDocumentoClinicoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM documento_clinico WHERE id_documento = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Documento clínico no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener documento clínico por ID");
  }
};

export const createDocumentoClinico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_expediente,
      id_internamiento,
      id_tipo_documento,
      fecha_elaboracion,
      id_personal_creador,
      estado
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO documento_clinico (id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear documento clínico");
  }
};

export const updateDocumentoClinico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_expediente,
      id_internamiento,
      id_tipo_documento,
      fecha_elaboracion,
      id_personal_creador,
      estado
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE documento_clinico SET id_expediente = $1, id_internamiento = $2, id_tipo_documento = $3, fecha_elaboracion = $4, id_personal_creador = $5, estado = $6 WHERE id_documento = $7 RETURNING *",
      [id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado, id]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Documento clínico no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar documento clínico");
  }
};

export const deleteDocumentoClinico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM documento_clinico WHERE id_documento = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Documento clínico no encontrado");
    }
    return res.status(200).send("Documento clínico eliminado correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar documento clínico");
  }
};