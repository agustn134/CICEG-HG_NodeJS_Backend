// src/controllers/gestion_expedientes/internamiento.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getInternamientos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM internamiento");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener internamientos");
  }
};

export const getInternamientoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM internamiento WHERE id_internamiento = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Internamiento no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener internamiento por ID");
  }
};

export const createInternamiento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_expediente,
      id_cama,
      id_servicio,
      fecha_ingreso,
      fecha_egreso,
      motivo_ingreso,
      diagnostico_ingreso,
      diagnostico_egreso,
      id_medico_responsable,
      tipo_egreso,
      observaciones
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO internamiento (id_expediente, id_cama, id_servicio, fecha_ingreso, fecha_egreso, motivo_ingreso, diagnostico_ingreso, diagnostico_egreso, id_medico_responsable, tipo_egreso, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [id_expediente, id_cama, id_servicio, fecha_ingreso, fecha_egreso, motivo_ingreso, diagnostico_ingreso, diagnostico_egreso, id_medico_responsable, tipo_egreso, observaciones]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear internamiento");
  }
};

export const updateInternamiento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_expediente,
      id_cama,
      id_servicio,
      fecha_ingreso,
      fecha_egreso,
      motivo_ingreso,
      diagnostico_ingreso,
      diagnostico_egreso,
      id_medico_responsable,
      tipo_egreso,
      observaciones
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE internamiento SET id_expediente = $1, id_cama = $2, id_servicio = $3, fecha_ingreso = $4, fecha_egreso = $5, motivo_ingreso = $6, diagnostico_ingreso = $7, diagnostico_egreso = $8, id_medico_responsable = $9, tipo_egreso = $10, observaciones = $11 WHERE id_internamiento = $12 RETURNING *",
      [id_expediente, id_cama, id_servicio, fecha_ingreso, fecha_egreso, motivo_ingreso, diagnostico_ingreso, diagnostico_egreso, id_medico_responsable, tipo_egreso, observaciones, id]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Internamiento no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar internamiento");
  }
};

export const deleteInternamiento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM internamiento WHERE id_internamiento = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Internamiento no encontrado");
    }
    return res.status(200).send("Internamiento eliminado correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar internamiento");
  }
};