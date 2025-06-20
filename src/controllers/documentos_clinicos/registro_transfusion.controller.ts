// src/controllers/documentos_clinicos/registro_transfusion.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getRegistrosTransfusion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM registro_transfusion");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener registros de transfusión");
  }
};

export const getRegistroTransfusionById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM registro_transfusion WHERE id_transfusion = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Registro de transfusión no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener registro de transfusión por ID");
  }
};

export const createRegistroTransfusion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      tipo_componente,
      grupo_sanguineo,
      numero_unidad,
      volumen,
      fecha_inicio,
      fecha_fin,
      id_medico_responsable,
      reacciones_adversas,
      observaciones
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO registro_transfusion (id_documento, tipo_componente, grupo_sanguineo, numero_unidad, volumen, fecha_inicio, fecha_fin, id_medico_responsable, reacciones_adversas, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        id_documento,
        tipo_componente,
        grupo_sanguineo,
        numero_unidad,
        volumen,
        fecha_inicio,
        fecha_fin,
        id_medico_responsable,
        reacciones_adversas,
        observaciones
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear registro de transfusión");
  }
};

export const updateRegistroTransfusion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_documento,
      tipo_componente,
      grupo_sanguineo,
      numero_unidad,
      volumen,
      fecha_inicio,
      fecha_fin,
      id_medico_responsable,
      reacciones_adversas,
      observaciones
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE registro_transfusion SET id_documento = $1, tipo_componente = $2, grupo_sanguineo = $3, numero_unidad = $4, volumen = $5, fecha_inicio = $6, fecha_fin = $7, id_medico_responsable = $8, reacciones_adversas = $9, observaciones = $10 WHERE id_transfusion = $11 RETURNING *",
      [
        id_documento,
        tipo_componente,
        grupo_sanguineo,
        numero_unidad,
        volumen,
        fecha_inicio,
        fecha_fin,
        id_medico_responsable,
        reacciones_adversas,
        observaciones,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Registro de transfusión no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar registro de transfusión");
  }
};

export const deleteRegistroTransfusion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM registro_transfusion WHERE id_transfusion = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Registro de transfusión no encontrado");
    }
    return res.status(200).send("Registro de transfusión eliminado correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar registro de transfusión");
  }
};