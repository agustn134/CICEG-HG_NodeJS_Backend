// src/controllers/documentos_clinicos/nota_preanestesica.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

interface NotaPreanestesica {
  id_nota_preanestesica?: number;
  id_documento: number;
  fecha_cirugia?: string;
  antecedentes_anestesicos?: string;
  valoracion_via_aerea?: string;
  clasificacion_asa?: string;
  plan_anestesico?: string;
  riesgo_anestesico?: string;
  medicacion_preanestesica?: string;
  id_anestesiologo?: number;
}

// ==========================================
// FUNCIONES CRUD BÁSICAS
// ==========================================

export const getNotasPreanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        npa.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo
      FROM nota_preanestesica npa
      JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN personal_medico anest_rel ON npa.id_anestesiologo = anest_rel.id_personal_medico
      LEFT JOIN persona anest ON anest_rel.id_persona = anest.id_persona
      ORDER BY dc.fecha_documento DESC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas preanestésicas:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas preanestésicas",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotaPreanestesicaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        npa.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo,
        anest_rel.numero_cedula as cedula_anestesiologo,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos
      FROM nota_preanestesica npa
      JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN personal_medico anest_rel ON npa.id_anestesiologo = anest_rel.id_personal_medico
      LEFT JOIN persona anest ON anest_rel.id_persona = anest.id_persona
      WHERE npa.id_nota_preanestesica = $1
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota preanestésica no encontrada"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener nota preanestésica por ID:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener nota preanestésica",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
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
    }: NotaPreanestesica = req.body;

    const insertQuery = `
      INSERT INTO nota_preanestesica (
        id_documento, fecha_cirugia, antecedentes_anestesicos, valoracion_via_aerea,
        clasificacion_asa, plan_anestesico, riesgo_anestesico, medicacion_preanestesica,
        id_anestesiologo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const response: QueryResult = await pool.query(insertQuery, [
      id_documento, fecha_cirugia, antecedentes_anestesicos, valoracion_via_aerea,
      clasificacion_asa, plan_anestesico, riesgo_anestesico, medicacion_preanestesica,
      id_anestesiologo
    ]);

    return res.status(201).json({
      success: true,
      message: "Nota preanestésica creada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear nota preanestésica:', error);
    return res.status(500).json({
      success: false,
      message: "Error al crear nota preanestésica",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateNotaPreanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<NotaPreanestesica> = req.body;

    const fields = Object.keys(updateData).filter(key => updateData[key as keyof NotaPreanestesica] !== undefined);
    const values = fields.map(field => updateData[field as keyof NotaPreanestesica]);
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hay campos para actualizar"
      });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const updateQuery = `
      UPDATE nota_preanestesica 
      SET ${setClause}
      WHERE id_nota_preanestesica = $1
      RETURNING *
    `;

    const response: QueryResult = await pool.query(updateQuery, [id, ...values]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota preanestésica no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota preanestésica actualizada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar nota preanestésica:', error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar nota preanestésica",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const deleteNotaPreanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const response: QueryResult = await pool.query(
      "DELETE FROM nota_preanestesica WHERE id_nota_preanestesica = $1 RETURNING *",
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota preanestésica no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota preanestésica eliminada exitosamente"
    });
  } catch (error) {
    console.error('Error al eliminar nota preanestésica:', error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar nota preanestésica",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// ==========================================
// FUNCIONES ADICIONALES BÁSICAS
// ==========================================

export const getNotasPreanestesicaByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;
    
    const query = `
      SELECT 
        npa.*,
        dc.fecha_documento,
        anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo
      FROM nota_preanestesica npa
      JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
      LEFT JOIN personal_medico anest_rel ON npa.id_anestesiologo = anest_rel.id_personal_medico
      LEFT JOIN persona anest ON anest_rel.id_persona = anest.id_persona
      WHERE dc.id_expediente = $1
      ORDER BY dc.fecha_documento DESC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas preanestésicas por expediente:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas preanestésicas por expediente",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getClasificacionesASA = async (req: Request, res: Response): Promise<Response> => {
  try {
    const clasificaciones = [
      { valor: 'ASA I', descripcion: 'Paciente sano sin enfermedad orgánica' },
      { valor: 'ASA II', descripcion: 'Paciente con enfermedad sistémica leve' },
      { valor: 'ASA III', descripcion: 'Paciente con enfermedad sistémica grave' },
      { valor: 'ASA IV', descripcion: 'Paciente con enfermedad sistémica grave que amenaza la vida' },
      { valor: 'ASA V', descripcion: 'Paciente moribundo que no se espera sobreviva sin la operación' },
      { valor: 'ASA VI', descripcion: 'Paciente con muerte cerebral declarada para donación de órganos' }
    ];

    return res.status(200).json({
      success: true,
      data: clasificaciones
    });
  } catch (error) {
    console.error('Error al obtener clasificaciones ASA:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener clasificaciones ASA",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};