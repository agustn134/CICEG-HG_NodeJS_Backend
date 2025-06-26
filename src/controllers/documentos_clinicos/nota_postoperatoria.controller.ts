// src/controllers/documentos_clinicos/nota_postoperatoria.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

interface NotaPostoperatoria {
  id_nota_postoperatoria?: number;
  id_documento: number;
  fecha_cirugia?: string;
  diagnostico_postoperatorio?: string;
  operacion_realizada?: string;
  descripcion_tecnica?: string;
  hallazgos?: string;
  conteo_gasas_completo?: boolean;
  incidentes_accidentes?: string;
  sangrado?: number;
  estado_postquirurgico?: string;
  piezas_enviadas_patologia?: string;
  plan_postoperatorio?: string;
  pronostico?: string;
  id_cirujano?: number;
  id_ayudante1?: number;
  id_ayudante2?: number;
  id_anestesiologo?: number;
  id_instrumentista?: string;
  id_circulante?: string;
}

// ==========================================
// FUNCIONES CRUD BÁSICAS
// ==========================================

export const getNotasPostoperatoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        npo.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        cir.nombre || ' ' || cir.apellido_paterno as nombre_cirujano,
        anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo
      FROM nota_postoperatoria npo
      JOIN documento_clinico dc ON npo.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN personal_medico cir_rel ON npo.id_cirujano = cir_rel.id_personal_medico
      LEFT JOIN persona cir ON cir_rel.id_persona = cir.id_persona
      LEFT JOIN personal_medico anest_rel ON npo.id_anestesiologo = anest_rel.id_personal_medico
      LEFT JOIN persona anest ON anest_rel.id_persona = anest.id_persona
      ORDER BY dc.fecha_documento DESC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    return res.status(200).json({
      success: true,
      data: response.rows
    });
  } catch (error) {
    console.error('Error al obtener notas postoperatorias:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas postoperatorias",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotaPostoperatoriaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        npo.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        p.fecha_nacimiento,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        cir.nombre || ' ' || cir.apellido_paterno as nombre_cirujano,
        cir_rel.numero_cedula as cedula_cirujano,
        ay1.nombre || ' ' || ay1.apellido_paterno as nombre_ayudante1,
        ay2.nombre || ' ' || ay2.apellido_paterno as nombre_ayudante2,
        anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo,
        anest_rel.numero_cedula as cedula_anestesiologo,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos
      FROM nota_postoperatoria npo
      JOIN documento_clinico dc ON npo.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN personal_medico cir_rel ON npo.id_cirujano = cir_rel.id_personal_medico
      LEFT JOIN persona cir ON cir_rel.id_persona = cir.id_persona
      LEFT JOIN personal_medico ay1_rel ON npo.id_ayudante1 = ay1_rel.id_personal_medico
      LEFT JOIN persona ay1 ON ay1_rel.id_persona = ay1.id_persona
      LEFT JOIN personal_medico ay2_rel ON npo.id_ayudante2 = ay2_rel.id_personal_medico
      LEFT JOIN persona ay2 ON ay2_rel.id_persona = ay2.id_persona
      LEFT JOIN personal_medico anest_rel ON npo.id_anestesiologo = anest_rel.id_personal_medico
      LEFT JOIN persona anest ON anest_rel.id_persona = anest.id_persona
      WHERE npo.id_nota_postoperatoria = $1
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota postoperatoria no encontrada"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener nota postoperatoria por ID:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener nota postoperatoria",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createNotaPostoperatoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_documento,
      fecha_cirugia,
      diagnostico_postoperatorio,
      operacion_realizada,
      descripcion_tecnica,
      hallazgos,
      conteo_gasas_completo,
      incidentes_accidentes,
      sangrado,
      estado_postquirurgico,
      piezas_enviadas_patologia,
      plan_postoperatorio,
      pronostico,
      id_cirujano,
      id_ayudante1,
      id_ayudante2,
      id_anestesiologo,
      id_instrumentista,
      id_circulante
    }: NotaPostoperatoria = req.body;

    const insertQuery = `
      INSERT INTO nota_postoperatoria (
        id_documento, fecha_cirugia, diagnostico_postoperatorio, operacion_realizada,
        descripcion_tecnica, hallazgos, conteo_gasas_completo, incidentes_accidentes,
        sangrado, estado_postquirurgico, piezas_enviadas_patologia, plan_postoperatorio,
        pronostico, id_cirujano, id_ayudante1, id_ayudante2, id_anestesiologo,
        id_instrumentista, id_circulante
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;

    const response: QueryResult = await pool.query(insertQuery, [
      id_documento, fecha_cirugia, diagnostico_postoperatorio, operacion_realizada,
      descripcion_tecnica, hallazgos, conteo_gasas_completo, incidentes_accidentes,
      sangrado, estado_postquirurgico, piezas_enviadas_patologia, plan_postoperatorio,
      pronostico, id_cirujano, id_ayudante1, id_ayudante2, id_anestesiologo,
      id_instrumentista, id_circulante
    ]);

    return res.status(201).json({
      success: true,
      message: "Nota postoperatoria creada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear nota postoperatoria:', error);
    return res.status(500).json({
      success: false,
      message: "Error al crear nota postoperatoria",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateNotaPostoperatoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<NotaPostoperatoria> = req.body;

    const fields = Object.keys(updateData).filter(key => updateData[key as keyof NotaPostoperatoria] !== undefined);
    const values = fields.map(field => updateData[field as keyof NotaPostoperatoria]);
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hay campos para actualizar"
      });
    }

    const setClause = fields.map((field, index) => `${field} = ${index + 2}`).join(', ');
    const updateQuery = `
      UPDATE nota_postoperatoria 
      SET ${setClause}
      WHERE id_nota_postoperatoria = $1
      RETURNING *
    `;

    const response: QueryResult = await pool.query(updateQuery, [id, ...values]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota postoperatoria no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota postoperatoria actualizada exitosamente",
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar nota postoperatoria:', error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar nota postoperatoria",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const deleteNotaPostoperatoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const response: QueryResult = await pool.query(
      "DELETE FROM nota_postoperatoria WHERE id_nota_postoperatoria = $1 RETURNING *",
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nota postoperatoria no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nota postoperatoria eliminada exitosamente"
    });
  } catch (error) {
    console.error('Error al eliminar nota postoperatoria:', error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar nota postoperatoria",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// ==========================================
// FUNCIONES ADICIONALES BÁSICAS
// ==========================================

export const getNotasPostoperatoriaByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;
    
    const query = `
      SELECT 
        npo.*,
        dc.fecha_documento,
        cir.nombre || ' ' || cir.apellido_paterno as nombre_cirujano,
        anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo
      FROM nota_postoperatoria npo
      JOIN documento_clinico dc ON npo.id_documento = dc.id_documento
      LEFT JOIN personal_medico cir_rel ON npo.id_cirujano = cir_rel.id_personal_medico
      LEFT JOIN persona cir ON cir_rel.id_persona = cir.id_persona
      LEFT JOIN personal_medico anest_rel ON npo.id_anestesiologo = anest_rel.id_personal_medico
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
    console.error('Error al obtener notas postoperatorias por expediente:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener notas postoperatorias por expediente",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};