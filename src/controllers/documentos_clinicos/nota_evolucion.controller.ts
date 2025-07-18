// //src/controllers/documentos_clinicos/nota_evolucion.controller.ts
// import { Request, Response } from 'express';
// import { QueryResult } from 'pg';
// import pool from '../../config/database';

// // ==========================================
// // INTERFACE CORREGIDA SEGÚN TU BD REAL
// // ==========================================
// interface NotaEvolucionRequest {
//   id_documento: number;
//   id_guia_diagnostico?: number;
//   // Signos vitales
//   dias_hospitalizacion?: number;
//   fecha_ultimo_ingreso?: string;
//   temperatura?: number;
//   frecuencia_cardiaca?: number;
//   frecuencia_respiratoria?: number;
//   presion_arterial_sistolica?: number;
//   presion_arterial_diastolica?: number;
//   saturacion_oxigeno?: number;
//   peso_actual?: number;
//   talla_actual?: number;
  
//   // Exploración física - CAMPOS OBLIGATORIOS
//   sintomas_signos: string;
//   habitus_exterior: string;
//   estado_nutricional: string;
//   estudios_laboratorio_gabinete: string;
//   evolucion_analisis: string;
//   diagnosticos: string;
//   plan_estudios_tratamiento: string;
//   pronostico: string;
  
//   // Exploración física - CAMPOS OPCIONALES
//   exploracion_cabeza?: string;
//   exploracion_cuello?: string;
//   exploracion_torax?: string;
//   exploracion_abdomen?: string;
//   exploracion_extremidades?: string;
//   exploracion_columna?: string;
//   exploracion_genitales?: string;
//   exploracion_neurologico?: string;
//   diagnosticos_guias?: string;
//   interconsultas?: string;
//   indicaciones_medicas?: string;
//   observaciones_adicionales?: string;
// }

// // ==========================================
// // CREAR NUEVA NOTA DE EVOLUCIÓN - CORREGIDO
// // ==========================================
// export const createNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const requestData: NotaEvolucionRequest = req.body;

//     console.log('🔍 REQUEST BODY:', requestData);

//     // Validaciones obligatorias
//     if (!requestData.id_documento) {
//       return res.status(400).json({
//         success: false,
//         message: 'El campo id_documento es obligatorio'
//       });
//     }

//     // Validar campos obligatorios según tu BD
//     const camposObligatorios = [
//       'sintomas_signos',
//       'habitus_exterior', 
//       'estado_nutricional',
//       'estudios_laboratorio_gabinete',
//       'evolucion_analisis',
//       'diagnosticos',
//       'plan_estudios_tratamiento',
//       'pronostico'
//     ];

//     for (const campo of camposObligatorios) {
//       if (!requestData[campo as keyof NotaEvolucionRequest]) {
//         return res.status(400).json({
//           success: false,
//           message: `El campo ${campo} es obligatorio`
//         });
//       }
//     }

//     // Verificar que el documento clínico existe
//     const documentoCheck = await pool.query(
//       'SELECT id_documento, estado FROM documento_clinico WHERE id_documento = $1',
//       [requestData.id_documento]
//     );

//     if (documentoCheck.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'El documento clínico especificado no existe'
//       });
//     }

//     if (documentoCheck.rows[0].estado === 'Anulado') {
//       return res.status(400).json({
//         success: false,
//         message: 'No se puede crear una nota de evolución para un documento anulado'
//       });
//     }

//     // Verificar que no exista ya una nota de evolución para este documento
//     const notaExistente = await pool.query(
//       'SELECT id_nota_evolucion FROM nota_evolucion WHERE id_documento = $1',
//       [requestData.id_documento]
//     );

//     if (notaExistente.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: 'Ya existe una nota de evolución para este documento'
//       });
//     }

//     // Crear nota de evolución con TODOS los campos de tu BD
//     const query = `
//       INSERT INTO nota_evolucion (
//         id_documento,
//         dias_hospitalizacion,
//         fecha_ultimo_ingreso,
//         temperatura,
//         frecuencia_cardiaca,
//         frecuencia_respiratoria,
//         presion_arterial_sistolica,
//         presion_arterial_diastolica,
//         saturacion_oxigeno,
//         peso_actual,
//         talla_actual,
//         sintomas_signos,
//         habitus_exterior,
//         exploracion_cabeza,
//         exploracion_cuello,
//         exploracion_torax,
//         exploracion_abdomen,
//         exploracion_extremidades,
//         exploracion_columna,
//         exploracion_genitales,
//         exploracion_neurologico,
//         estado_nutricional,
//         estudios_laboratorio_gabinete,
//         evolucion_analisis,
//         diagnosticos,
//         diagnosticos_guias,
//         plan_estudios_tratamiento,
//         interconsultas,
//         pronostico,
//         indicaciones_medicas,
//         observaciones_adicionales
//       ) VALUES (
//         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
//         $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
//         $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
//       ) 
//       RETURNING *
//     `;

//     const values = [
//       requestData.id_documento,
//       requestData.dias_hospitalizacion || null,
//       requestData.fecha_ultimo_ingreso || null,
//       requestData.temperatura || null,
//       requestData.frecuencia_cardiaca || null,
//       requestData.frecuencia_respiratoria || null,
//       requestData.presion_arterial_sistolica || null,
//       requestData.presion_arterial_diastolica || null,
//       requestData.saturacion_oxigeno || null,
//       requestData.peso_actual || null,
//       requestData.talla_actual || null,
//       requestData.sintomas_signos?.trim(),
//       requestData.habitus_exterior?.trim(),
//       requestData.exploracion_cabeza?.trim() || null,
//       requestData.exploracion_cuello?.trim() || null,
//       requestData.exploracion_torax?.trim() || null,
//       requestData.exploracion_abdomen?.trim() || null,
//       requestData.exploracion_extremidades?.trim() || null,
//       requestData.exploracion_columna?.trim() || null,
//       requestData.exploracion_genitales?.trim() || null,
//       requestData.exploracion_neurologico?.trim() || null,
//       requestData.estado_nutricional?.trim(),
//       requestData.estudios_laboratorio_gabinete?.trim(),
//       requestData.evolucion_analisis?.trim(),
//       requestData.diagnosticos?.trim(),
//       requestData.diagnosticos_guias?.trim() || null,
//       requestData.plan_estudios_tratamiento?.trim(),
//       requestData.interconsultas?.trim() || 'No se solicitaron interconsultas en esta evolución',
//       requestData.pronostico?.trim(),
//       requestData.indicaciones_medicas?.trim() || null,
//       requestData.observaciones_adicionales?.trim() || null
//     ];

//     console.log('🔍 Ejecutando INSERT con valores:', values);

//     const response: QueryResult = await pool.query(query, values);

//     console.log('✅ INSERT exitoso:', response.rows[0]);

//     return res.status(201).json({
//       success: true,
//       message: 'Nota de evolución creada correctamente',
//       data: response.rows[0]
//     });

//   } catch (error) {
//     console.error('❌ Error completo en createNotaEvolucion:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al crear nota de evolución',
//       // error: process.env.NODE_ENV === 'development' ? {
//       //   message: error.message,
//       //   stack: error.stack
//       // } : {}
//     });
//   }
// };

// // ==========================================
// // OBTENER NOTAS DE EVOLUCIÓN POR EXPEDIENTE
// // ==========================================
// export const getNotasEvolucionByExpediente = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id_expediente } = req.params;

//     if (!id_expediente || isNaN(parseInt(id_expediente))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID del expediente debe ser un número válido'
//       });
//     }

//     const query = `
//       SELECT 
//         ne.*,
//         dc.fecha_elaboracion as fecha_documento,
//         CASE 
//           WHEN pm_rel.id_personal_medico IS NOT NULL 
//           THEN pm.nombre || ' ' || pm.apellido_paterno 
//           ELSE 'Sin asignar' 
//         END as medico_nombre,
//         pm_rel.especialidad,
//         s.nombre as servicio_nombre,
//         ROW_NUMBER() OVER (ORDER BY dc.fecha_elaboracion) as numero_evolucion
//       FROM nota_evolucion ne
//       INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
//       LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
//       LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
//       LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
//       LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
//       WHERE dc.id_expediente = $1 
//         AND dc.estado != 'Anulado'
//       ORDER BY dc.fecha_elaboracion ASC
//     `;

//     const response: QueryResult = await pool.query(query, [id_expediente]);

//     return res.status(200).json({
//       success: true,
//       message: 'Notas de evolución del expediente obtenidas correctamente',
//       data: response.rows
//     });

//   } catch (error) {
//     console.error('Error al obtener notas de evolución del expediente:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al obtener notas de evolución del expediente',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };

// // ==========================================
// // OBTENER NOTA DE EVOLUCIÓN POR DOCUMENTO
// // ==========================================
// export const getNotaEvolucionByDocumento = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id_documento } = req.params;

//     if (!id_documento || isNaN(parseInt(id_documento))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID del documento debe ser un número válido'
//       });
//     }

//     const query = `
//       SELECT 
//         ne.*,
//         dc.id_expediente,
//         dc.fecha_elaboracion as fecha_documento,
//         dc.estado as estado_documento,
//         e.numero_expediente,
//         p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
//         CASE 
//           WHEN pm_rel.id_personal_medico IS NOT NULL 
//           THEN pm.nombre || ' ' || pm.apellido_paterno 
//           ELSE 'Sin asignar' 
//         END as medico_nombre,
//         pm_rel.especialidad
//       FROM nota_evolucion ne
//       INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
//       INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
//       INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
//       INNER JOIN persona p ON pac.id_persona = p.id_persona
//       LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
//       LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
//       WHERE ne.id_documento = $1
//     `;

//     const response: QueryResult = await pool.query(query, [id_documento]);

//     if (response.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Nota de evolución no encontrada para el documento especificado'
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Nota de evolución obtenida correctamente',
//       data: response.rows[0]
//     });

//   } catch (error) {
//     console.error('Error al obtener nota de evolución por documento:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al obtener nota de evolución',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };

// // ==========================================
// // OBTENER TODAS LAS NOTAS DE EVOLUCIÓN
// // ==========================================
// export const getNotasEvolucion = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       id_documento,
//       id_expediente,
//       fecha_inicio,
//       fecha_fin,
//       buscar
//     } = req.query as any;

//     const pageNum = parseInt(page as string) || 1;
//     const limitNum = parseInt(limit as string) || 10;
//     const offset = (pageNum - 1) * limitNum;

//     // Query simplificada que coincide con tu tabla real
//     let baseQuery = `
//       SELECT 
//         ne.*,
//         dc.id_expediente,
//         dc.fecha_elaboracion as fecha_documento,
//         dc.estado as estado_documento,
//         e.numero_expediente,
//         p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
//         p.fecha_nacimiento,
//         p.sexo,
//         CASE 
//           WHEN pm_rel.id_personal_medico IS NOT NULL 
//           THEN pm.nombre || ' ' || pm.apellido_paterno 
//           ELSE 'Sin asignar' 
//         END as medico_nombre,
//         pm_rel.especialidad,
//         s.nombre as servicio_nombre
//       FROM nota_evolucion ne
//       INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
//       INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
//       INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
//       INNER JOIN persona p ON pac.id_persona = p.id_persona
//       LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
//       LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
//       LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
//       LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
//     `;

//     let countQuery = `
//       SELECT COUNT(*) as total
//       FROM nota_evolucion ne
//       INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
//       INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
//       INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
//       INNER JOIN persona p ON pac.id_persona = p.id_persona
//     `;

//     const conditions: string[] = [];
//     const values: any[] = [];

//     // Aplicar filtros
//     if (id_documento) {
//       conditions.push(`ne.id_documento = $${values.length + 1}`);
//       values.push(id_documento);
//     }

//     if (id_expediente) {
//       conditions.push(`dc.id_expediente = $${values.length + 1}`);
//       values.push(id_expediente);
//     }

//     if (fecha_inicio) {
//       conditions.push(`dc.fecha_elaboracion >= $${values.length + 1}`);
//       values.push(fecha_inicio);
//     }

//     if (fecha_fin) {
//       conditions.push(`dc.fecha_elaboracion <= $${values.length + 1}`);
//       values.push(fecha_fin);
//     }

//     if (buscar) {
//       conditions.push(`(
//         e.numero_expediente ILIKE $${values.length + 1} OR
//         (p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
//         ne.sintomas_signos ILIKE $${values.length + 1} OR
//         ne.diagnosticos ILIKE $${values.length + 1}
//       )`);
//       values.push(`%${buscar}%`);
//     }

//     // Solo mostrar documentos no anulados
//     conditions.push(`dc.estado != 'Anulado'`);

//     // Agregar condiciones WHERE
//     if (conditions.length > 0) {
//       const whereClause = ` WHERE ${conditions.join(' AND ')}`;
//       baseQuery += whereClause;
//       countQuery += whereClause;
//     }

//     // Agregar ordenamiento y paginación
//     baseQuery += ` ORDER BY dc.fecha_elaboracion DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
//     values.push(limitNum, offset);

//     // Ejecutar consultas
//     const [dataResponse, countResponse]: [QueryResult, QueryResult] = await Promise.all([
//       pool.query(baseQuery, values),
//       pool.query(countQuery, values.slice(0, -2))
//     ]);

//     const total = parseInt(countResponse.rows[0].total);
//     const totalPages = Math.ceil(total / limitNum);

//     return res.status(200).json({
//       success: true,
//       message: 'Notas de evolución obtenidas correctamente',
//       data: dataResponse.rows,
//       pagination: {
//         page: pageNum,
//         limit: limitNum,
//         total,
//         totalPages,
//         hasNext: pageNum < totalPages,
//         hasPrev: pageNum > 1
//       }
//     });

//   } catch (error) {
//     console.error('Error al obtener notas de evolución:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al obtener notas de evolución',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };

// // ==========================================
// // OBTENER NOTA DE EVOLUCIÓN POR ID
// // ==========================================
// export const getNotaEvolucionById = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;

//     if (!id || isNaN(parseInt(id))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID debe ser un número válido'
//       });
//     }

//     const query = `
//       SELECT 
//         ne.*,
//         dc.id_expediente,
//         dc.fecha_elaboracion as fecha_documento,
//         dc.estado as estado_documento,
//         e.numero_expediente,
//         p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
//         p.fecha_nacimiento,
//         p.sexo,
//         p.curp,
//         CASE 
//           WHEN pm_rel.id_personal_medico IS NOT NULL 
//           THEN pm.nombre || ' ' || pm.apellido_paterno 
//           ELSE 'Sin asignar' 
//         END as medico_nombre,
//         pm_rel.especialidad,
//         pm_rel.numero_cedula as cedula_profesional,
//         s.nombre as servicio_nombre
//       FROM nota_evolucion ne
//       INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
//       INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
//       INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
//       INNER JOIN persona p ON pac.id_persona = p.id_persona
//       LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
//       LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
//       LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
//       LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
//       WHERE ne.id_nota_evolucion = $1
//     `;

//     const response: QueryResult = await pool.query(query, [id]);

//     if (response.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Nota de evolución no encontrada'
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Nota de evolución obtenida correctamente',
//       data: response.rows[0]
//     });

//   } catch (error) {
//     console.error('Error al obtener nota de evolución por ID:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al obtener nota de evolución',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };

// // ==========================================
// // ACTUALIZAR NOTA DE EVOLUCIÓN
// // ==========================================
// export const updateNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const updateData: Partial<NotaEvolucionRequest> = req.body;

//     if (!id || isNaN(parseInt(id))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID debe ser un número válido'
//       });
//     }

//     // Verificar que la nota de evolución existe
//     const notaCheck = await pool.query(
//       'SELECT id_nota_evolucion FROM nota_evolucion WHERE id_nota_evolucion = $1',
//       [id]
//     );

//     if (notaCheck.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Nota de evolución no encontrada'
//       });
//     }

//     // Construir query dinámico solo con campos proporcionados
//     const fields = Object.keys(updateData).filter(key => key !== 'id_documento'); // No permitir cambiar el documento
//     const values: any[] = [];
//     const setClause = fields.map((field, index) => {
//       let value = updateData[field as keyof NotaEvolucionRequest];
//       if (typeof value === 'string') {
//         value = value.trim();
//       }
//       values.push(value);
//       return `${field} = $${index + 1}`;
//     }).join(', ');

//     if (fields.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No se proporcionaron campos para actualizar'
//       });
//     }

//     values.push(id);

//     const query = `
//       UPDATE nota_evolucion 
//       SET ${setClause}
//       WHERE id_nota_evolucion = $${values.length}
//       RETURNING *
//     `;

//     const response: QueryResult = await pool.query(query, values);

//     return res.status(200).json({
//       success: true,
//       message: 'Nota de evolución actualizada correctamente',
//       data: response.rows[0]
//     });

//   } catch (error) {
//     console.error('Error al actualizar nota de evolución:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al actualizar nota de evolución',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };

// // ==========================================
// // ELIMINAR NOTA DE EVOLUCIÓN
// // ==========================================
// export const deleteNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;

//     if (!id || isNaN(parseInt(id))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID debe ser un número válido'
//       });
//     }

//     // En lugar de eliminar físicamente, anular el documento asociado
//     const response: QueryResult = await pool.query(`
//       UPDATE documento_clinico 
//       SET estado = 'Anulado'
//       FROM nota_evolucion ne
//       WHERE documento_clinico.id_documento = ne.id_documento 
//         AND ne.id_nota_evolucion = $1
//       RETURNING documento_clinico.id_documento, ne.id_nota_evolucion
//     `, [id]);

//     if (response.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Nota de evolución no encontrada'
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Nota de evolución anulada correctamente',
//       data: { id_nota_evolucion: id, estado: 'Anulado' }
//     });

//   } catch (error) {
//     console.error('Error al anular nota de evolución:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al anular nota de evolución',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };



























































































































//src/controllers/documentos_clinicos/nota_evolucion.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// INTERFACE CORREGIDA SEGÚN TU BD REAL
// ==========================================
interface NotaEvolucionRequest {
  id_documento: number;
  
  // 🔥 AGREGAR CAMPO DE GUÍA CLÍNICA
  id_guia_diagnostico?: number;
  
  // Signos vitales
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
  
  // Exploración física - CAMPOS OBLIGATORIOS
  sintomas_signos: string;
  habitus_exterior: string;
  estado_nutricional: string;
  estudios_laboratorio_gabinete: string;
  evolucion_analisis: string;
  diagnosticos: string;
  plan_estudios_tratamiento: string;
  pronostico: string;
  
  // Exploración física - CAMPOS OPCIONALES
  exploracion_cabeza?: string;
  exploracion_cuello?: string;
  exploracion_torax?: string;
  exploracion_abdomen?: string;
  exploracion_extremidades?: string;
  exploracion_columna?: string;
  exploracion_genitales?: string;
  exploracion_neurologico?: string;
  diagnosticos_guias?: string;
  interconsultas?: string;
  indicaciones_medicas?: string;
  observaciones_adicionales?: string;
}

// ==========================================
// CREAR NUEVA NOTA DE EVOLUCIÓN - CORREGIDO CON GUÍA CLÍNICA
// ==========================================
export const createNotaEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const requestData: NotaEvolucionRequest = req.body;

    console.log('🔍 REQUEST BODY:', requestData);

    // Validaciones obligatorias
    if (!requestData.id_documento) {
      return res.status(400).json({
        success: false,
        message: 'El campo id_documento es obligatorio'
      });
    }

    // Validar campos obligatorios según tu BD
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

    // Verificar que el documento clínico existe
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

    if (documentoCheck.rows[0].estado === 'Anulado') {
      return res.status(400).json({
        success: false,
        message: 'No se puede crear una nota de evolución para un documento anulado'
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

    // 🔥 CREAR NOTA DE EVOLUCIÓN CON GUÍA CLÍNICA
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

    const values = [
      requestData.id_documento,
      requestData.id_guia_diagnostico || null, // 🔥 AGREGAR ESTE VALOR
      requestData.dias_hospitalizacion || null,
      requestData.fecha_ultimo_ingreso || null,
      requestData.temperatura || null,
      requestData.frecuencia_cardiaca || null,
      requestData.frecuencia_respiratoria || null,
      requestData.presion_arterial_sistolica || null,
      requestData.presion_arterial_diastolica || null,
      requestData.saturacion_oxigeno || null,
      requestData.peso_actual || null,
      requestData.talla_actual || null,
      requestData.sintomas_signos?.trim(),
      requestData.habitus_exterior?.trim(),
      requestData.exploracion_cabeza?.trim() || null,
      requestData.exploracion_cuello?.trim() || null,
      requestData.exploracion_torax?.trim() || null,
      requestData.exploracion_abdomen?.trim() || null,
      requestData.exploracion_extremidades?.trim() || null,
      requestData.exploracion_columna?.trim() || null,
      requestData.exploracion_genitales?.trim() || null,
      requestData.exploracion_neurologico?.trim() || null,
      requestData.estado_nutricional?.trim(),
      requestData.estudios_laboratorio_gabinete?.trim(),
      requestData.evolucion_analisis?.trim(),
      requestData.diagnosticos?.trim(),
      requestData.diagnosticos_guias?.trim() || null,
      requestData.plan_estudios_tratamiento?.trim(),
      requestData.interconsultas?.trim() || 'No se solicitaron interconsultas en esta evolución',
      requestData.pronostico?.trim(),
      requestData.indicaciones_medicas?.trim() || null,
      requestData.observaciones_adicionales?.trim() || null
    ];

    console.log('🔍 Ejecutando INSERT con valores:', values);

    const response: QueryResult = await pool.query(query, values);

    console.log('✅ INSERT exitoso:', response.rows[0]);

    return res.status(201).json({
      success: true,
      message: 'Nota de evolución creada correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('❌ Error completo en createNotaEvolucion:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear nota de evolución',
      // error: process.env.NODE_ENV === 'development' ? {
      //   message: error.message,
      //   stack: error.stack
      // } : {}
    });
  }
};

// ==========================================
// OBTENER NOTAS DE EVOLUCIÓN POR EXPEDIENTE - CON GUÍA CLÍNICA
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
        dc.fecha_elaboracion as fecha_documento,
        CASE 
          WHEN pm_rel.id_personal_medico IS NOT NULL 
          THEN pm.nombre || ' ' || pm.apellido_paterno 
          ELSE 'Sin asignar' 
        END as medico_nombre,
        pm_rel.especialidad,
        s.nombre as servicio_nombre,
        gc.nombre as guia_clinica_nombre,
        gc.codigo as guia_clinica_codigo,
        gc.descripcion as guia_clinica_descripcion,
        ROW_NUMBER() OVER (ORDER BY dc.fecha_elaboracion) as numero_evolucion
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE dc.id_expediente = $1 
        AND dc.estado != 'Anulado'
      ORDER BY dc.fecha_elaboracion ASC
    `;

    const response: QueryResult = await pool.query(query, [id_expediente]);

    return res.status(200).json({
      success: true,
      message: 'Notas de evolución del expediente obtenidas correctamente',
      data: response.rows
    });

  } catch (error) {
    console.error('Error al obtener notas de evolución del expediente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener notas de evolución del expediente',
      error: process.env.NODE_ENV === 'development' ? error : {}
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
        CASE 
          WHEN pm_rel.id_personal_medico IS NOT NULL 
          THEN pm.nombre || ' ' || pm.apellido_paterno 
          ELSE 'Sin asignar' 
        END as medico_nombre,
        pm_rel.especialidad,
        gc.nombre as guia_clinica_nombre,
        gc.codigo as guia_clinica_codigo,
        gc.descripcion as guia_clinica_descripcion
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
      WHERE ne.id_documento = $1
    `;

    const response: QueryResult = await pool.query(query, [id_documento]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de evolución no encontrada para el documento especificado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución obtenida correctamente',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener nota de evolución por documento:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener nota de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER TODAS LAS NOTAS DE EVOLUCIÓN - CON GUÍA CLÍNICA
// ==========================================
export const getNotasEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      page = 1,
      limit = 10,
      id_documento,
      id_expediente,
      fecha_inicio,
      fecha_fin,
      buscar
    } = req.query as any;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Query con guía clínica incluida
    let baseQuery = `
      SELECT 
        ne.*,
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        CASE 
          WHEN pm_rel.id_personal_medico IS NOT NULL 
          THEN pm.nombre || ' ' || pm.apellido_paterno 
          ELSE 'Sin asignar' 
        END as medico_nombre,
        pm_rel.especialidad,
        s.nombre as servicio_nombre,
        gc.nombre as guia_clinica_nombre,
        gc.codigo as guia_clinica_codigo,
        gc.descripcion as guia_clinica_descripcion
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
    `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Aplicar filtros
    if (id_documento) {
      conditions.push(`ne.id_documento = $${values.length + 1}`);
      values.push(id_documento);
    }

    if (id_expediente) {
      conditions.push(`dc.id_expediente = $${values.length + 1}`);
      values.push(id_expediente);
    }

    if (fecha_inicio) {
      conditions.push(`dc.fecha_elaboracion >= $${values.length + 1}`);
      values.push(fecha_inicio);
    }

    if (fecha_fin) {
      conditions.push(`dc.fecha_elaboracion <= $${values.length + 1}`);
      values.push(fecha_fin);
    }

    if (buscar) {
      conditions.push(`(
        e.numero_expediente ILIKE $${values.length + 1} OR
        (p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '')) ILIKE $${values.length + 1} OR
        ne.sintomas_signos ILIKE $${values.length + 1} OR
        ne.diagnosticos ILIKE $${values.length + 1} OR
        gc.nombre ILIKE $${values.length + 1} OR
        gc.codigo ILIKE $${values.length + 1}
      )`);
      values.push(`%${buscar}%`);
    }

    // Solo mostrar documentos no anulados
    conditions.push(`dc.estado != 'Anulado'`);

    // Agregar condiciones WHERE
    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      baseQuery += whereClause;
      countQuery += whereClause;
    }

    // Agregar ordenamiento y paginación
    baseQuery += ` ORDER BY dc.fecha_elaboracion DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limitNum, offset);

    // Ejecutar consultas
    const [dataResponse, countResponse]: [QueryResult, QueryResult] = await Promise.all([
      pool.query(baseQuery, values),
      pool.query(countQuery, values.slice(0, -2))
    ]);

    const total = parseInt(countResponse.rows[0].total);
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      message: 'Notas de evolución obtenidas correctamente',
      data: dataResponse.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error al obtener notas de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener notas de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER NOTA DE EVOLUCIÓN POR ID - CON GUÍA CLÍNICA
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
        dc.id_expediente,
        dc.fecha_elaboracion as fecha_documento,
        dc.estado as estado_documento,
        e.numero_expediente,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente_nombre,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        CASE 
          WHEN pm_rel.id_personal_medico IS NOT NULL 
          THEN pm.nombre || ' ' || pm.apellido_paterno 
          ELSE 'Sin asignar' 
        END as medico_nombre,
        pm_rel.especialidad,
        pm_rel.numero_cedula as cedula_profesional,
        s.nombre as servicio_nombre,
        gc.nombre as guia_clinica_nombre,
        gc.codigo as guia_clinica_codigo,
        gc.descripcion as guia_clinica_descripcion,
        gc.area as guia_clinica_area,
        gc.fuente as guia_clinica_fuente
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pac ON e.id_paciente = pac.id_paciente
      INNER JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
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

  } catch (error) {
    console.error('Error al obtener nota de evolución por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener nota de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR NOTA DE EVOLUCIÓN - CON GUÍA CLÍNICA
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

    // Verificar que la nota de evolución existe
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

    // 🔥 VALIDAR GUÍA CLÍNICA SI SE ACTUALIZA
    if (updateData.id_guia_diagnostico !== undefined) {
      if (updateData.id_guia_diagnostico !== null) {
        const guiaCheck = await pool.query(
          'SELECT id_guia_diagnostico, activo FROM guia_clinica WHERE id_guia_diagnostico = $1',
          [updateData.id_guia_diagnostico]
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
    }

    // Construir query dinámico solo con campos proporcionados
    const fields = Object.keys(updateData).filter(key => key !== 'id_documento'); // No permitir cambiar el documento
    const values: any[] = [];
    const setClause = fields.map((field, index) => {
      let value = updateData[field as keyof NotaEvolucionRequest];
      if (typeof value === 'string') {
        value = value.trim();
      }
      values.push(value);
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

  } catch (error) {
    console.error('Error al actualizar nota de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar nota de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
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

    // En lugar de eliminar físicamente, anular el documento asociado
    const response: QueryResult = await pool.query(`
      UPDATE documento_clinico 
      SET estado = 'Anulado'
      FROM nota_evolucion ne
      WHERE documento_clinico.id_documento = ne.id_documento 
        AND ne.id_nota_evolucion = $1
      RETURNING documento_clinico.id_documento, ne.id_nota_evolucion
    `, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nota de evolución no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota de evolución anulada correctamente',
      data: { id_nota_evolucion: id, estado: 'Anulado' }
    });

  } catch (error) {
    console.error('Error al anular nota de evolución:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al anular nota de evolución',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE NOTAS DE EVOLUCIÓN
// ==========================================
export const getEstadisticasNotasEvolucion = async (req: Request, res: Response): Promise<Response> => {
  try {
    const estadisticasQuery = `
      SELECT 
        COUNT(*) as total_notas,
        COUNT(CASE WHEN dc.estado = 'Activo' THEN 1 END) as notas_activas,
        COUNT(CASE WHEN dc.estado = 'Anulado' THEN 1 END) as notas_anuladas,
        COUNT(CASE WHEN ne.id_guia_diagnostico IS NOT NULL THEN 1 END) as notas_con_guia,
        COUNT(CASE WHEN DATE(dc.fecha_elaboracion) = CURRENT_DATE THEN 1 END) as notas_hoy,
        COUNT(CASE WHEN DATE(dc.fecha_elaboracion) >= DATE(NOW() - INTERVAL '7 days') THEN 1 END) as notas_ultima_semana,
        COUNT(CASE WHEN DATE(dc.fecha_elaboracion) >= DATE(NOW() - INTERVAL '30 days') THEN 1 END) as notas_ultimo_mes
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento;
    `;

    const guiasUsadasQuery = `
      SELECT 
        gc.nombre as guia_nombre,
        gc.codigo as guia_codigo,
        COUNT(*) as veces_usada
      FROM nota_evolucion ne
      INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento INNER JOIN guia_clinica gc ON ne.id_guia_diagnostico = gc.id_guia_diagnostico
     WHERE dc.estado = 'Activo'
     GROUP BY gc.id_guia_diagnostico, gc.nombre, gc.codigo
     ORDER BY veces_usada DESC
     LIMIT 10;
   `;

   const medicosMasActivosQuery = `
     SELECT 
       CASE 
         WHEN pm_rel.id_personal_medico IS NOT NULL 
         THEN pm.nombre || ' ' || pm.apellido_paterno 
         ELSE 'Sin asignar' 
       END as medico_nombre,
       pm_rel.especialidad,
       COUNT(*) as notas_creadas,
       COUNT(CASE WHEN DATE(dc.fecha_elaboracion) >= DATE(NOW() - INTERVAL '30 days') THEN 1 END) as notas_mes_actual
     FROM nota_evolucion ne
     INNER JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
     LEFT JOIN personal_medico pm_rel ON dc.id_personal_creador = pm_rel.id_personal_medico
     LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
     WHERE dc.estado = 'Activo'
     GROUP BY pm_rel.id_personal_medico, pm.nombre, pm.apellido_paterno, pm_rel.especialidad
     ORDER BY notas_creadas DESC
     LIMIT 10;
   `;

   const [estadisticas, guiasUsadas, medicosMasActivos] = await Promise.all([
     pool.query(estadisticasQuery),
     pool.query(guiasUsadasQuery),
     pool.query(medicosMasActivosQuery)
   ]);

   return res.status(200).json({
     success: true,
     message: 'Estadísticas de notas de evolución obtenidas correctamente',
     data: {
       resumen: estadisticas.rows[0],
       guias_mas_usadas: guiasUsadas.rows,
       medicos_mas_activos: medicosMasActivos.rows
     }
   });

 } catch (error) {
   console.error('Error al obtener estadísticas de notas de evolución:', error);
   return res.status(500).json({
     success: false,
     message: 'Error interno del servidor al obtener estadísticas.',
     error: process.env.NODE_ENV === 'development' ? error : {}
   });
 }
};