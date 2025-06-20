// src/controllers/documentos_clinicos/referencia_traslado.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getReferenciasTraslado = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM referencia_traslado");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener referencias de traslado");
  }
};

export const getReferenciaTrasladoById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM referencia_traslado WHERE id_referencia = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Referencia de traslado no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener referencia de traslado por ID");
  }
};

export const createReferenciaTraslado = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      establecimiento_origen,
      establecimiento_destino,
      motivo_envio,
      resumen_clinico,
      diagnostico,
      id_guia_diagnostico,
      plan_tratamiento,
      estado_fisico,
      pronostico,
      tipo_traslado,
      medico_receptor,
      observaciones
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO referencia_traslado (id_documento, establecimiento_origen, establecimiento_destino, motivo_envio, resumen_clinico, diagnostico, id_guia_diagnostico, plan_tratamiento, estado_fisico, pronostico, tipo_traslado, medico_receptor, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [
        id_documento,
        establecimiento_origen,
        establecimiento_destino,
        motivo_envio,
        resumen_clinico,
        diagnostico,
        id_guia_diagnostico,
        plan_tratamiento,
        estado_fisico,
        pronostico,
        tipo_traslado,
        medico_receptor,
        observaciones
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear referencia de traslado");
  }
};

export const updateReferenciaTraslado = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_documento,
      establecimiento_origen,
      establecimiento_destino,
      motivo_envio,
      resumen_clinico,
      diagnostico,
      id_guia_diagnostico,
      plan_tratamiento,
      estado_fisico,
      pronostico,
      tipo_traslado,
      medico_receptor,
      observaciones
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE referencia_traslado SET id_documento = $1, establecimiento_origen = $2, establecimiento_destino = $3, motivo_envio = $4, resumen_clinico = $5, diagnostico = $6, id_guia_diagnostico = $7, plan_tratamiento = $8, estado_fisico = $9, pronostico = $10, tipo_traslado = $11, medico_receptor = $12, observaciones = $13 WHERE id_referencia = $14 RETURNING *",
      [
        id_documento,
        establecimiento_origen,
        establecimiento_destino,
        motivo_envio,
        resumen_clinico,
        diagnostico,
        id_guia_diagnostico,
        plan_tratamiento,
        estado_fisico,
        pronostico,
        tipo_traslado,
        medico_receptor,
        observaciones,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Referencia de traslado no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar referencia de traslado");
  }
};

export const deleteReferenciaTraslado = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM referencia_traslado WHERE id_referencia = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Referencia de traslado no encontrada");
    }
    return res.status(200).send("Referencia de traslado eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar referencia de traslado");
  }
};