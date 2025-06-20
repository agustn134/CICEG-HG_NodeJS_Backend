// src/controllers/documentos_clinicos/historia_clinica.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getHistoriasClinicas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM historia_clinica");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener historias clínicas");
  }
};

export const getHistoriaClinicaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM historia_clinica WHERE id_historia_clinica = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Historia clínica no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener historia clínica por ID");
  }
};

export const createHistoriaClinica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      antecedentes_heredo_familiares,
      habitos_higienicos,
      habitos_alimenticios,
      actividad_fisica,
      ocupacion,
      vivienda,
      toxicomanias,
      menarca,
      ritmo_menstrual,
      inicio_vida_sexual,
      fecha_ultima_regla,
      fecha_ultimo_parto,
      gestas,
      partos,
      cesareas,
      abortos,
      hijos_vivos,
      metodo_planificacion,
      enfermedades_infancia,
      enfermedades_adulto,
      cirugias_previas,
      traumatismos,
      alergias,
      padecimiento_actual,
      sintomas_generales,
      aparatos_sistemas,
      exploracion_general,
      exploracion_cabeza,
      exploracion_cuello,
      exploracion_torax,
      exploracion_abdomen,
      exploracion_columna,
      exploracion_extremidades,
      exploracion_genitales,
      impresion_diagnostica,
      id_guia_diagnostico,
      plan_diagnostico,
      plan_terapeutico,
      pronostico
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO historia_clinica (id_documento, antecedentes_heredo_familiares, habitos_higienicos, habitos_alimenticios, actividad_fisica, ocupacion, vivienda, toxicomanias, menarca, ritmo_menstrual, inicio_vida_sexual, fecha_ultima_regla, fecha_ultimo_parto, gestas, partos, cesareas, abortos, hijos_vivos, metodo_planificacion, enfermedades_infancia, enfermedades_adulto, cirugias_previas, traumatismos, alergias, padecimiento_actual, sintomas_generales, aparatos_sistemas, exploracion_general, exploracion_cabeza, exploracion_cuello, exploracion_torax, exploracion_abdomen, exploracion_columna, exploracion_extremidades, exploracion_genitales, impresion_diagnostica, id_guia_diagnostico, plan_diagnostico, plan_terapeutico, pronostico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38) RETURNING *",
      [
        id_documento,
        antecedentes_heredo_familiares,
        habitos_higienicos,
        habitos_alimenticios,
        actividad_fisica,
        ocupacion,
        vivienda,
        toxicomanias,
        menarca,
        ritmo_menstrual,
        inicio_vida_sexual,
        fecha_ultima_regla,
        fecha_ultimo_parto,
        gestas,
        partos,
        cesareas,
        abortos,
        hijos_vivos,
        metodo_planificacion,
        enfermedades_infancia,
        enfermedades_adulto,
        cirugias_previas,
        traumatismos,
        alergias,
        padecimiento_actual,
        sintomas_generales,
        aparatos_sistemas,
        exploracion_general,
        exploracion_cabeza,
        exploracion_cuello,
        exploracion_torax,
        exploracion_abdomen,
        exploracion_columna,
        exploracion_extremidades,
        exploracion_genitales,
        impresion_diagnostica,
        id_guia_diagnostico,
        plan_diagnostico,
        plan_terapeutico,
        pronostico
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear historia clínica");
  }
};

export const updateHistoriaClinica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_documento,
      antecedentes_heredo_familiares,
      habitos_higienicos,
      habitos_alimenticios,
      actividad_fisica,
      ocupacion,
      vivienda,
      toxicomanias,
      menarca,
      ritmo_menstrual,
      inicio_vida_sexual,
      fecha_ultima_regla,
      fecha_ultimo_parto,
      gestas,
      partos,
      cesareas,
      abortos,
      hijos_vivos,
      metodo_planificacion,
      enfermedades_infancia,
      enfermedades_adulto,
      cirugias_previas,
      traumatismos,
      alergias,
      padecimiento_actual,
      sintomas_generales,
      aparatos_sistemas,
      exploracion_general,
      exploracion_cabeza,
      exploracion_cuello,
      exploracion_torax,
      exploracion_abdomen,
      exploracion_columna,
      exploracion_extremidades,
      exploracion_genitales,
      impresion_diagnostica,
      id_guia_diagnostico,
      plan_diagnostico,
      plan_terapeutico,
      pronostico
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE historia_clinica SET id_documento = $1, antecedentes_heredo_familiares = $2, habitos_higienicos = $3, habitos_alimenticios = $4, actividad_fisica = $5, ocupacion = $6, vivienda = $7, toxicomanias = $8, menarca = $9, ritmo_menstrual = $10, inicio_vida_sexual = $11, fecha_ultima_regla = $12, fecha_ultimo_parto = $13, gestas = $14, partos = $15, cesareas = $16, abortos = $17, hijos_vivos = $18, metodo_planificacion = $19, enfermedades_infancia = $20, enfermedades_adulto = $21, cirugias_previas = $22, traumatismos = $23, alergias = $24, padecimiento_actual = $25, sintomas_generales = $26, aparatos_sistemas = $27, exploracion_general = $28, exploracion_cabeza = $29, exploracion_cuello = $30, exploracion_torax = $31, exploracion_abdomen = $32, exploracion_columna = $33, exploracion_extremidades = $34, exploracion_genitales = $35, impresion_diagnostica = $36, id_guia_diagnostico = $37, plan_diagnostico = $38, plan_terapeutico = $39, pronostico = $40 WHERE id_historia_clinica = $41 RETURNING *",
      [
        id_documento,
        antecedentes_heredo_familiares,
        habitos_higienicos,
        habitos_alimenticios,
        actividad_fisica,
        ocupacion,
        vivienda,
        toxicomanias,
        menarca,
        ritmo_menstrual,
        inicio_vida_sexual,
        fecha_ultima_regla,
        fecha_ultimo_parto,
        gestas,
        partos,
        cesareas,
        abortos,
        hijos_vivos,
        metodo_planificacion,
        enfermedades_infancia,
        enfermedades_adulto,
        cirugias_previas,
        traumatismos,
        alergias,
        padecimiento_actual,
        sintomas_generales,
        aparatos_sistemas,
        exploracion_general,
        exploracion_cabeza,
        exploracion_cuello,
        exploracion_torax,
        exploracion_abdomen,
        exploracion_columna,
        exploracion_extremidades,
        exploracion_genitales,
        impresion_diagnostica,
        id_guia_diagnostico,
        plan_diagnostico,
        plan_terapeutico,
        pronostico,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Historia clínica no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar historia clínica");
  }
};

export const deleteHistoriaClinica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM historia_clinica WHERE id_historia_clinica = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Historia clínica no encontrada");
    }
    return res.status(200).send("Historia clínica eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar historia clínica");
  }
};