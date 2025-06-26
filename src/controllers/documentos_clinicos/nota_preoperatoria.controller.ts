// src/controllers/documentos_clinicos/nota_preoperatoria.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

interface NotaPreoperatoria {
  id_nota_preoperatoria?: number;
  id_documento: number;
  fecha_cirugia?: string;
  resumen_interrogatorio?: string;
  exploracion_fisica?: string;
  resultados_estudios?: string;
  diagnostico_preoperatorio?: string;
  id_guia_diagnostico?: number;
  plan_quirurgico?: string;
  plan_terapeutico_preoperatorio?: string;
  pronostico?: string;
  tipo_cirugia?: string;
  riesgo_quirurgico?: string;
}

// ==========================================
// FUNCIONES CRUD BÁSICAS
// ==========================================

export const getNotasPreoperatoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        np.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        gc.nombre_guia_diagnostico
      FROM nota_preoperatoria np
      JOIN documento_clinico dc ON np.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON np.id_guia_diagnostico = gc.id_guia_diagnostico
      ORDER BY dc.fecha_documento DESC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas preoperatorias:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas preoperatorias",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotaPreoperatoriaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        np.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        gc.nombre_guia_diagnostico,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos
      FROM nota_preoperatoria np
      JOIN documento_clinico dc ON np.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON np.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE np.id_nota_preoperatoria = $1
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota preoperatoria no encontrada"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener nota preoperatoria por ID:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener nota preoperatoria",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createNotaPreoperatoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      fecha_cirugia,
      resumen_interrogatorio,
      exploracion_fisica,
      resultados_estudios,
      diagnostico_preoperatorio,
      id_guia_diagnostico,
      plan_quirurgico,
      plan_terapeutico_preoperatorio,
      pronostico,
      tipo_cirugia,
      riesgo_quirurgico
    }: NotaPreoperatoria = req.body;

    const insertQuery = `
      INSERT INTO nota_preoperatoria (
        id_documento, fecha_cirugia, resumen_interrogatorio, exploracion_fisica,
        resultados_estudios, diagnostico_preoperatorio, id_guia_diagnostico,
        plan_quirurgico, plan_terapeutico_preoperatorio, pronostico,
        tipo_cirugia, riesgo_quirurgico
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const response: QueryResult = await pool.query(insertQuery, [
      id_documento, fecha_cirugia, resumen_interrogatorio, exploracion_fisica,
      resultados_estudios, diagnostico_preoperatorio, id_guia_diagnostico,
      plan_quirurgico, plan_terapeutico_preoperatorio, pronostico,
      tipo_cirugia, riesgo_quirurgico
    ]);

    return res.status(201).json({
      success: true,
      message: "Nota preoperatoria creada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear nota preoperatoria:', error);
    return res.status(500).json({
      success: false,
      message: "Error al crear nota preoperatoria",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateNotaPreoperatoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<NotaPreoperatoria> = req.body;

    const fields = Object.keys(updateData).filter(key => updateData[key as keyof NotaPreoperatoria] !== undefined);
    const values = fields.map(field => updateData[field as keyof NotaPreoperatoria]);
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hay campos para actualizar"
      });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const updateQuery = `
      UPDATE nota_preoperatoria 
      SET ${setClause}
      WHERE id_nota_preoperatoria = $1
      RETURNING *
    `;

    const response: QueryResult = await pool.query(updateQuery, [id, ...values]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota preoperatoria no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota preoperatoria actualizada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar nota preoperatoria:', error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar nota preoperatoria",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const deleteNotaPreoperatoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const response: QueryResult = await pool.query(
      "DELETE FROM nota_preoperatoria WHERE id_nota_preoperatoria = $1 RETURNING *",
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota preoperatoria no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota preoperatoria eliminada exitosamente"
    });
  } catch (error) {
    console.error('Error al eliminar nota preoperatoria:', error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar nota preoperatoria",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// ==========================================
// FUNCIONES ADICIONALES BÁSICAS
// ==========================================

export const getNotasPreoperatoriaByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;
    
    const query = `
      SELECT 
        np.*,
        dc.fecha_documento,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico
      FROM nota_preoperatoria np
      JOIN documento_clinico dc ON np.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      WHERE dc.id_expediente = $1
      ORDER BY dc.fecha_documento DESC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas preoperatorias por expediente:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas preoperatorias por expediente",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};