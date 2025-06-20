// src/controllers/notas_especializadas/nota_nutricion.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getNotasNutricion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM nota_nutricion");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener notas de nutrición");
  }
};

export const getNotaNutricionById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM nota_nutricion WHERE id_nota_nutricion = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Nota de nutrición no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener nota de nutrición por ID");
  }
};

export const createNotaNutricion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      diagnostico_nutricional,
      estado_nutricional,
      requerimientos_caloricos,
      requerimientos_proteicos,
      indicaciones_dieta,
      plan_manejo_nutricional,
      factores_riesgo_nutricional,
      suplementos_recomendados,
      pronostico
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO nota_nutricion (id_documento, diagnostico_nutricional, estado_nutricional, requerimientos_caloricos, requerimientos_proteicos, indicaciones_dieta, plan_manejo_nutricional, factores_riesgo_nutricional, suplementos_recomendados, pronostico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        id_documento,
        diagnostico_nutricional,
        estado_nutricional,
        requerimientos_caloricos,
        requerimientos_proteicos,
        indicaciones_dieta,
        plan_manejo_nutricional,
        factores_riesgo_nutricional,
        suplementos_recomendados,
        pronostico
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear nota de nutrición");
  }
};

export const updateNotaNutricion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_documento,
      diagnostico_nutricional,
      estado_nutricional,
      requerimientos_caloricos,
      requerimientos_proteicos,
      indicaciones_dieta,
      plan_manejo_nutricional,
      factores_riesgo_nutricional,
      suplementos_recomendados,
      pronostico
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE nota_nutricion SET id_documento = $1, diagnostico_nutricional = $2, estado_nutricional = $3, requerimientos_caloricos = $4, requerimientos_proteicos = $5, indicaciones_dieta = $6, plan_manejo_nutricional = $7, factores_riesgo_nutricional = $8, suplementos_recomendados = $9, pronostico = $10 WHERE id_nota_nutricion = $11 RETURNING *",
      [
        id_documento,
        diagnostico_nutricional,
        estado_nutricional,
        requerimientos_caloricos,
        requerimientos_proteicos,
        indicaciones_dieta,
        plan_manejo_nutricional,
        factores_riesgo_nutricional,
        suplementos_recomendados,
        pronostico,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Nota de nutrición no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar nota de nutrición");
  }
};

export const deleteNotaNutricion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM nota_nutricion WHERE id_nota_nutricion = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Nota de nutrición no encontrada");
    }
    return res.status(200).send("Nota de nutrición eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar nota de nutrición");
  }
};