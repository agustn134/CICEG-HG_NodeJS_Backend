// src/controllers/documentos_clinicos/nota_postanestesica.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

interface NotaPostanestesica {
  id_nota_postanestesica?: number;
  id_documento: number;
  tipo_anestesia?: string;
  duracion_anestesia?: number;
  medicamentos_utilizados?: string;
  estado_clinico_egreso?: string;
  incidentes_accidentes?: string;
  balance_hidrico?: string;
  liquidos_administrados?: number;
  sangrado?: number;
  hemoderivados_transfundidos?: string;
  plan_tratamiento?: string;
  pronostico?: string;
  id_anestesiologo?: number;
}

// ==========================================
// FUNCIONES CRUD BÁSICAS
// ==========================================

export const getNotasPostanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        npa.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo
      FROM nota_postanestesica npa
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
    console.error('Error al obtener notas postanestésicas:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas postanestésicas",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotaPostanestesicaById = async (req: Request, res: Response): Promise<Response> => {
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
      FROM nota_postanestesica npa
      JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN personal_medico anest_rel ON npa.id_anestesiologo = anest_rel.id_personal_medico
      LEFT JOIN persona anest ON anest_rel.id_persona = anest.id_persona
      WHERE npa.id_nota_postanestesica = $1
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota postanestésica no encontrada"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener nota postanestésica por ID:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener nota postanestésica",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createNotaPostanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      tipo_anestesia,
      duracion_anestesia,
      medicamentos_utilizados,
      estado_clinico_egreso,
      incidentes_accidentes,
      balance_hidrico,
      liquidos_administrados,
      sangrado,
      hemoderivados_transfundidos,
      plan_tratamiento,
      pronostico,
      id_anestesiologo
    }: NotaPostanestesica = req.body;

    const insertQuery = `
      INSERT INTO nota_postanestesica (
        id_documento, tipo_anestesia, duracion_anestesia, medicamentos_utilizados,
        estado_clinico_egreso, incidentes_accidentes, balance_hidrico, liquidos_administrados,
        sangrado, hemoderivados_transfundidos, plan_tratamiento, pronostico, id_anestesiologo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const response: QueryResult = await pool.query(insertQuery, [
      id_documento, tipo_anestesia, duracion_anestesia, medicamentos_utilizados,
      estado_clinico_egreso, incidentes_accidentes, balance_hidrico, liquidos_administrados,
      sangrado, hemoderivados_transfundidos, plan_tratamiento, pronostico, id_anestesiologo
    ]);

    return res.status(201).json({
      success: true,
      message: "Nota postanestésica creada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear nota postanestésica:', error);
    return res.status(500).json({
      success: false,
      message: "Error al crear nota postanestésica",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateNotaPostanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<NotaPostanestesica> = req.body;

    const fields = Object.keys(updateData).filter(key => updateData[key as keyof NotaPostanestesica] !== undefined);
    const values = fields.map(field => updateData[field as keyof NotaPostanestesica]);
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hay campos para actualizar"
      });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const updateQuery = `
      UPDATE nota_postanestesica 
      SET ${setClause}
      WHERE id_nota_postanestesica = $1
      RETURNING *
    `;

    const response: QueryResult = await pool.query(updateQuery, [id, ...values]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota postanestésica no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota postanestésica actualizada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar nota postanestésica:', error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar nota postanestésica",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const deleteNotaPostanestesica = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const response: QueryResult = await pool.query(
      "DELETE FROM nota_postanestesica WHERE id_nota_postanestesica = $1 RETURNING *",
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota postanestésica no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota postanestésica eliminada exitosamente"
    });
  } catch (error) {
    console.error('Error al eliminar nota postanestésica:', error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar nota postanestésica",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// ==========================================
// FUNCIONES ADICIONALES BÁSICAS
// ==========================================

export const getNotasPostanestesicaByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;
    
    const query = `
      SELECT 
        npa.*,
        dc.fecha_documento,
        anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo
      FROM nota_postanestesica npa
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
    console.error('Error al obtener notas postanestésicas por expediente:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas postanestésicas por expediente",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getTiposAnestesia = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tipos = [
      { valor: 'General', descripcion: 'Anestesia general con intubación' },
      { valor: 'Regional', descripcion: 'Anestesia regional (epidural, raquídea)' },
      { valor: 'Local', descripcion: 'Anestesia local infiltrativa' },
      { valor: 'Sedación', descripcion: 'Sedación consciente' },
      { valor: 'Combinada', descripcion: 'Combinación de técnicas anestésicas' },
      { valor: 'MAC', descripcion: 'Monitoreo Anestésico Controlado' }
    ];

    return res.status(200).json({
      success: true,
      data: tipos
    });
  } catch (error) {
    console.error('Error al obtener tipos de anestesia:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener tipos de anestesia",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};