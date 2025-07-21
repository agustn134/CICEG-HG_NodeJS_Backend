// src/controllers/documentos_clinicos/nota_evolucion.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACE COMPLETA SEGÚN TU TABLA REAL
// ==========================================
interface NotaEvolucionRequest {
  id_documento: number;
  id_guia_diagnostico?: number;
  
  // 🔥 CAMPOS DE SIGNOS VITALES Y HOSPITALIZACIÓN
  dias_hospitalizacion?: number;
  fecha_ultimo_ingreso?: string;
  temperatura?: number;
  frecuencia_cardiaca?: number;
  frecuencia_respiratoria?: number;
  presion_arterial_sistolica?: number;
  presion_arterial_diastolica?: number;
  saturacion_oxigeno?: number;
  peso_actual?: number;
  talla_actual?: number;
  
  // 🔥 CAMPOS OBLIGATORIOS DE TU FRONTEND
  sintomas_signos: string;
  habitus_exterior: string;
  estado_nutricional: string;
  estudios_laboratorio_gabinete: string;
  evolucion_analisis: string;
  diagnosticos: string;
  plan_estudios_tratamiento: string;
  pronostico: string;
  
  // 🔥 CAMPOS OPCIONALES DE EXPLORACIÓN
  exploracion_cabeza?: string;
  exploracion_cuello?: string;
  exploracion_torax?: string;
  exploracion_abdomen?: string;
  exploracion_extremidades?: string;
  exploracion_columna?: string;
  exploracion_genitales?: string;
  exploracion_neurologico?: string;
  
  // 🔥 CAMPOS ADICIONALES
  diagnosticos_guias?: string;
  interconsultas?: string;
  indicaciones_medicas?: string;
  observaciones_adicionales?: string;
}

// ==========================================
// CREAR NOTA DE EVOLUCIÓN - COMPLETO Y CORREGIDO
// ==========================================
export const createNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const requestData: NotaEvolucionRequest = req.body;

    console.log('🔥 Datos recibidos en backend:', requestData);

    // Validaciones básicas
    if (!requestData.id_documento) {
      return res.status(400).json({
        success: false,
        message: 'El ID del documento es obligatorio'
      });
    }

    // Validar campos obligatorios según tu tabla
    const camposObligatorios = [
      'sintomas_signos',
      'habitus_exterior', 
      'estado_nutricional',
      'estudios_laboratorio_gabinete',
      'evolucion_analisis',
      'diagnosticos',
      'plan_estudios_tratamiento',
      'pronostico'
    ];

    for (const campo of camposObligatorios) {
      if (!requestData[campo as keyof NotaEvolucionRequest]) {
        return res.status(400).json({
          success: false,
          message: `El campo ${campo} es obligatorio`
        });
      }
    }

    // Verificar que el documento existe
    const documentoCheck = await pool.query(
      'SELECT id_documento, estado FROM documento_clinico WHERE id_documento = $1',
      [requestData.id_documento]
    );

    if (documentoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El documento clínico especificado no existe'
      });
    }

    // Verificar que no exista ya una nota de evolución para este documento
    const notaExistente = await pool.query(
      'SELECT id_nota_evolucion FROM nota_evolucion WHERE id_documento = $1',
      [requestData.id_documento]
    );

    if (notaExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una nota de evolución para este documento'
      });
    }

    // 🔥 VALIDAR GUÍA CLÍNICA SI SE PROPORCIONA
    if (requestData.id_guia_diagnostico) {
      const guiaCheck = await pool.query(
        'SELECT id_guia_diagnostico, activo FROM guia_clinica WHERE id_guia_diagnostico = $1',
        [requestData.id_guia_diagnostico]
      );

      if (guiaCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'La guía clínica especificada no existe'
        });
      }

      if (!guiaCheck.rows[0].activo) {
        return res.status(400).json({
          success: false,
          message: 'La guía clínica especificada no está activa'
        });
      }
    }

    // 🔥 QUERY COMPLETO CON TODOS LOS CAMPOS DE TU TABLA (sin id_nota_evolucion y fecha_elaboracion que son auto)
    const query = `
      INSERT INTO nota_evolucion (
        id_documento,
        id_guia_diagnostico,
        dias_hospitalizacion,
        fecha_ultimo_ingreso,
        temperatura,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        presion_arterial_sistolica,
        presion_arterial_diastolica,
        saturacion_oxigeno,
        peso_actual,
        talla_actual,
        sintomas_signos,
        habitus_exterior,
        exploracion_cabeza,
        exploracion_cuello,
        exploracion_torax,
        exploracion_abdomen,
        exploracion_extremidades,
        exploracion_columna,
        exploracion_genitales,
        exploracion_neurologico,
        estado_nutricional,
        estudios_laboratorio_gabinete,
        evolucion_analisis,
        diagnosticos,
        diagnosticos_guias,
        plan_estudios_tratamiento,
        interconsultas,
        pronostico,
        indicaciones_medicas,
        observaciones_adicionales
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, 
        $31, $32
      ) 
      RETURNING *
    `;

    // 🔥 AGREGAR: Validación específica NOM-004
    const camposObligatoriosNOM004 = [
      'sintomas_signos',         // 6.2.1 - Evolución del cuadro
      'habitus_exterior',        // Exploración física
      'estado_nutricional',      // Estado nutricional
      'estudios_laboratorio_gabinete', // 6.2.3 - Estudios
      'evolucion_analisis',      // 6.2.1 - Evolución
      'diagnosticos',            // 6.2.4 - Diagnósticos
      'plan_estudios_tratamiento', // 6.2.6 - Tratamiento
      'pronostico'               // 6.2.5 - Pronóstico
    ];

    for (const campo of camposObligatoriosNOM004) {
      if (!requestData[campo as keyof NotaEvolucionRequest]) {
        return res.status(400).json({
          success: false,
          message: `Campo obligatorio según NOM-004-SSA3-2012: ${campo}`
        });
      }
    }


    const values = [
      requestData.id_documento,                                                    // $1
      requestData.id_guia_diagnostico || null,                                   // $2
      requestData.dias_hospitalizacion || null,                                  // $3
      requestData.fecha_ultimo_ingreso || null,                                  // $4
      requestData.temperatura || null,                                           // $5
      requestData.frecuencia_cardiaca || null,                                   // $6
      requestData.frecuencia_respiratoria || null,                               // $7
      requestData.presion_arterial_sistolica || null,                            // $8
      requestData.presion_arterial_diastolica || null,                           // $9
      requestData.saturacion_oxigeno || null,                                    // $10
      requestData.peso_actual || null,                                           // $11
      requestData.talla_actual || null,                                          // $12
      requestData.sintomas_signos?.trim() || '',                                 // $13
      requestData.habitus_exterior?.trim() || '',                                // $14
      requestData.exploracion_cabeza?.trim() || null,                            // $15
      requestData.exploracion_cuello?.trim() || null,                            // $16
      requestData.exploracion_torax?.trim() || null,                             // $17
      requestData.exploracion_abdomen?.trim() || null,                           // $18
      requestData.exploracion_extremidades?.trim() || null,                      // $19
      requestData.exploracion_columna?.trim() || null,                           // $20
      requestData.exploracion_genitales?.trim() || null,                         // $21
      requestData.exploracion_neurologico?.trim() || null,                       // $22
      requestData.estado_nutricional?.trim() || '',                              // $23
      requestData.estudios_laboratorio_gabinete?.trim() || '',                   // $24
      requestData.evolucion_analisis?.trim() || '',                              // $25
      requestData.diagnosticos?.trim() || '',                                    // $26
      requestData.diagnosticos_guias?.trim() || null,                            // $27
      requestData.plan_estudios_tratamiento?.trim() || '',                       // $28
      requestData.interconsultas?.trim() || 'No se solicitaron interconsultas',  // $29
      requestData.pronostico?.trim() || '',                                      // $30
      requestData.indicaciones_medicas?.trim() || null,                          // $31
      requestData.observaciones_adicionales?.trim() || null                      // $32
    ];

    console.log('🔍 Ejecutando INSERT con', values.length, 'parámetros (debe ser 32)');
    console.log('🔍 Valores:', values);

    const response: QueryResult = await pool.query(query, values);

    console.log('✅ INSERT exitoso:', response.rows[0]);

    return res.status(201).json({
      success: true,
      message: 'Nota de evolución creada correctamente',
      data: response.rows[0]
    });

  } catch (error: any) {
    console.error('❌ Error completo en createNotaEvolucion:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error detail:', error.detail);
    console.error('❌ Stack trace:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear nota de evolución',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        detail: error.detail || 'Sin detalles adicionales',
        stack: error.stack
      } : {
        message: 'Error interno del servidor'
      }
    });
  }
};

// ==========================================
// OBTENER NOTA DE EVOLUCIÓN POR DOCUMENTO - CON GUÍA CLÍNICA
// ==========================================
export const getNotaEvolucionByDocumento = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_documento } = req.params;

    if (!id_documento || isNaN(parseInt(id_documento))) {
      return res.status(400).json({
        success: false,
        message: 'El ID del documento debe ser un número válido'
      });
    }

    const query = `
      SELECT 
        ne.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        gc.nombre as guia_clinica_nombre,
        gc.codigo as guia_clinica_codigo,
        gc.descripcion as guia_clinica_descripcion
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE ne.id_documento = $1
    `;

    const response: QueryResult = await pool.query(query, [id_documento]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró nota de evolución para este documento'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error: any) {
    console.error('Error al obtener nota por documento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ==========================================
// OBTENER TODAS LAS NOTAS DE EVOLUCIÓN
// ==========================================
export const getNotasEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        ne.*,
        dc.fecha_elaboracion,
        e.numero_expediente,
        gc.nombre as guia_clinica_nombre
      FROM nota_evolucion ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
      ORDER BY dc.fecha_elaboracion DESC
    `;

    const response: QueryResult = await pool.query(query);

    return res.status(200).json({
      success: true,
      message: 'Notas de evolución obtenidas correctamente',
      data: response.rows
    });

  } catch (error: any) {
    console.error('Error al obtener notas de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ==========================================
// OBTENER NOTA DE EVOLUCIÓN POR ID
// ==========================================
export const getNotaEvolucionById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    const query = `
      SELECT 
        ne.*,
        dc.fecha_elaboracion,
        e.numero_expediente,
        gc.nombre as guia_clinica_nombre
      FROM nota_evolucion ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE ne.id_nota_evolucion = $1
    `;

    const response: QueryResult = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de evolución no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error: any) {
    console.error('Error al obtener nota de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ==========================================
// ACTUALIZAR NOTA DE EVOLUCIÓN
// ==========================================
export const updateNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData: Partial<NotaEvolucionRequest> = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    // Verificar que la nota existe
    const notaCheck = await pool.query(
      'SELECT id_nota_evolucion FROM nota_evolucion WHERE id_nota_evolucion = $1',
      [id]
    );

    if (notaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de evolución no encontrada'
      });
    }

    // Construir query dinámico
    const fields = Object.keys(updateData).filter(key => key !== 'id_documento');
    const values: any[] = [];
    const setClause = fields.map((field, index) => {
      values.push(updateData[field as keyof NotaEvolucionRequest]);
      return `${field} = $${index + 1}`;
    }).join(', ');

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    values.push(id);

    const query = `
      UPDATE nota_evolucion 
      SET ${setClause}
      WHERE id_nota_evolucion = $${values.length}
      RETURNING *
    `;

    const response: QueryResult = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución actualizada correctamente',
      data: response.rows[0]
    });

  } catch (error: any) {
    console.error('Error al actualizar nota de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ==========================================
// ELIMINAR NOTA DE EVOLUCIÓN
// ==========================================
export const deleteNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }

    const response: QueryResult = await pool.query(
      'DELETE FROM nota_evolucion WHERE id_nota_evolucion = $1 RETURNING *',
      [id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de evolución no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución eliminada correctamente',
      data: response.rows[0]
    });

  } catch (error: any) {
    console.error('Error al eliminar nota de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// ==========================================
// OBTENER NOTAS POR EXPEDIENTE
// ==========================================
export const getNotasEvolucionByExpediente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_expediente } = req.params;

    if (!id_expediente || isNaN(parseInt(id_expediente))) {
      return res.status(400).json({
        success: false,
        message: 'El ID del expediente debe ser un número válido'
      });
    }

    const query = `
      SELECT 
        ne.*,
        dc.fecha_elaboracion,
        e.numero_expediente,
        gc.nombre as guia_clinica_nombre
      FROM nota_evolucion ne
      JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE e.id_expediente = $1
      ORDER BY dc.fecha_elaboracion DESC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    return res.status(200).json({
      success: true,
      message: 'Notas de evolución obtenidas correctamente',
      data: response.rows
    });

  } catch (error: any) {
    console.error('Error al obtener notas por expediente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};