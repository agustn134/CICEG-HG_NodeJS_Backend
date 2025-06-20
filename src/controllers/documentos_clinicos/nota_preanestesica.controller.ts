// src/controllers/documentos_clinicos/nota_preanestesica.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getNotasPreanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM nota_preanestesica");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener notas preanestésicas");
  }
};

export const getNotaPreanestesicaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM nota_preanestesica WHERE id_nota_preanestesica = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Nota preanestésica no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener nota preanestésica por ID");
  }
};

export const createNotaPreanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      fecha_cirugia,
      antecedentes_anestesicos,
      valoracion_via_aerea,
      clasificacion_asa,
      plan_anestesico,
      riesgo_anestesico,
      medicacion_preanestesica,
      id_anestesiologo
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO nota_preanestesica (id_documento, fecha_cirugia, antecedentes_anestesicos, valoracion_via_aerea, clasificacion_asa, plan_anestesico, riesgo_anestesico, medicacion_preanestesica, id_anestesiologo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        id_documento,
        fecha_cirugia,
        antecedentes_anestesicos,
        valoracion_via_aerea,
        clasificacion_asa,
        plan_anestesico,
        riesgo_anestesico,
        medicacion_preanestesica,
        id_anestesiologo
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear nota preanestésica");
  }
};

export const updateNotaPreanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_documento,
      fecha_cirugia,
      antecedentes_anestesicos,
      valoracion_via_aerea,
      clasificacion_asa,
      plan_anestesico,
      riesgo_anestesico,
      medicacion_preanestesica,
      id_anestesiologo
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE nota_preanestesica SET id_documento = $1, fecha_cirugia = $2, antecedentes_anestesicos = $3, valoracion_via_aerea = $4, clasificacion_asa = $5, plan_anestesico = $6, riesgo_anestesico = $7, medicacion_preanestesica = $8, id_anestesiologo = $9 WHERE id_nota_preanestesica = $10 RETURNING *",
      [
        id_documento,
        fecha_cirugia,
        antecedentes_anestesicos,
        valoracion_via_aerea,
        clasificacion_asa,
        plan_anestesico,
        riesgo_anestesico,
        medicacion_preanestesica,
        id_anestesiologo,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Nota preanestésica no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar nota preanestésica");
  }
};

export const deleteNotaPreanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM nota_preanestesica WHERE id_nota_preanestesica = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Nota preanestésica no encontrada");
    }
    return res.status(200).send("Nota preanestésica eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar nota preanestésica");
  }
};