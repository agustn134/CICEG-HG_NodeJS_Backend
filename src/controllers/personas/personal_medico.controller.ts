// src/controllers/personas/personal_medico.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// OBTENER TODO EL PERSONAL MÉDICO
// ==========================================
export const getPersonalMedico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { activo, especialidad, cargo, departamento, buscar } = req.query;
    
    let query = `
      SELECT 
        pm.id_personal_medico,
        pm.numero_cedula,
        pm.especialidad,
        pm.cargo,
        pm.departamento,
        pm.activo,
        pm.foto,
        p.id_persona,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        p.telefono,
        p.correo_electronico,
        ts.nombre as tipo_sangre,
        COUNT(dc.id_documento) as total_documentos_creados,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes_actual
      FROM personal_medico pm
      JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN documento_clinico dc ON pm.id_personal_medico = dc.id_personal_creador
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    // Filtros
    if (activo !== undefined) {
      query += ` AND pm.activo = $${paramCounter}`;
      params.push(activo === 'true');
      paramCounter++;
    }
    
    if (especialidad) {
      query += ` AND UPPER(pm.especialidad) LIKE UPPER($${paramCounter})`;
      params.push(`%${especialidad}%`);
      paramCounter++;
    }
    
    if (cargo) {
      query += ` AND UPPER(pm.cargo) LIKE UPPER($${paramCounter})`;
      params.push(`%${cargo}%`);
      paramCounter++;
    }
    
    if (departamento) {
      query += ` AND UPPER(pm.departamento) LIKE UPPER($${paramCounter})`;
      params.push(`%${departamento}%`);
      paramCounter++;
    }
    
    if (buscar) {
      query += ` AND (
        UPPER(p.nombre) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_materno) LIKE UPPER($${paramCounter}) OR
        UPPER(pm.numero_cedula) LIKE UPPER($${paramCounter}) OR
        UPPER(pm.especialidad) LIKE UPPER($${paramCounter})
      )`;
      params.push(`%${buscar}%`);
      paramCounter++;
    }
    
    query += `
      GROUP BY pm.id_personal_medico, pm.numero_cedula, pm.especialidad, pm.cargo, 
               pm.departamento, pm.activo, pm.foto, p.id_persona, p.nombre, 
               p.apellido_paterno, p.apellido_materno, p.fecha_nacimiento, 
               p.sexo, p.curp, p.telefono, p.correo_electronico, ts.nombre
      ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC
    `;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Personal médico obtenido correctamente',
      data: response.rows,
      total: response.rowCount,
      filtros_aplicados: {
        activo: activo || 'todos',
        especialidad: especialidad || 'todas',
        cargo: cargo || 'todos',
        departamento: departamento || 'todos',
        buscar: buscar || 'sin filtro'
      }
    });
  } catch (error) {
    console.error('Error al obtener personal médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener personal médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER PERSONAL MÉDICO POR ID
// ==========================================
export const getPersonalMedicoById = async (req: Request, res: Response): Promise<Response> => {
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
        pm.id_personal_medico,
        pm.numero_cedula,
        pm.especialidad,
        pm.cargo,
        pm.departamento,
        pm.activo,
        pm.foto,
        p.id_persona,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        p.telefono,
        p.correo_electronico,
        p.domicilio,
        p.estado_civil,
        p.religion,
        ts.nombre as tipo_sangre,
        COUNT(dc.id_documento) as total_documentos_creados,
        COUNT(CASE WHEN dc.estado = 'Activo' THEN 1 END) as documentos_activos,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as documentos_semana,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes
      FROM personal_medico pm
      JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN documento_clinico dc ON pm.id_personal_medico = dc.id_personal_creador
      WHERE pm.id_personal_medico = $1
      GROUP BY pm.id_personal_medico, pm.numero_cedula, pm.especialidad, pm.cargo, 
               pm.departamento, pm.activo, pm.foto, p.id_persona, p.nombre, 
               p.apellido_paterno, p.apellido_materno, p.fecha_nacimiento, 
               p.sexo, p.curp, p.telefono, p.correo_electronico, p.domicilio,
               p.estado_civil, p.religion, ts.nombre
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personal médico no encontrado'
      });
    }
    
    // Obtener los últimos documentos creados por este médico
    const documentosQuery = `
      SELECT 
        dc.id_documento,
        dc.fecha_elaboracion,
        dc.estado,
        td.nombre as tipo_documento,
        e.numero_expediente,
        CONCAT(pac_p.nombre, ' ', pac_p.apellido_paterno, ' ', pac_p.apellido_materno) as nombre_paciente
      FROM documento_clinico dc
      JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN persona pac_p ON pac.id_persona = pac_p.id_persona
      WHERE dc.id_personal_creador = $1
      ORDER BY dc.fecha_elaboracion DESC
      LIMIT 10
    `;
    
    const documentosResponse: QueryResult = await pool.query(documentosQuery, [id]);
    
    const personalData = response.rows[0];
    personalData.ultimos_documentos = documentosResponse.rows;
    
    return res.status(200).json({
      success: true,
      message: 'Personal médico encontrado correctamente',
      data: personalData
    });
  } catch (error) {
    console.error('Error al obtener personal médico por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener personal médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR NUEVO PERSONAL MÉDICO
// ==========================================
export const createPersonalMedico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_persona,
      numero_cedula,
      especialidad,
      cargo,
      departamento,
      activo = true,
      foto
    } = req.body;
    
    // Validaciones básicas
    if (!id_persona) {
      return res.status(400).json({
        success: false,
        message: 'El ID de persona es obligatorio'
      });
    }
    
    if (!numero_cedula || numero_cedula.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El número de cédula es obligatorio'
      });
    }
    
    if (!especialidad || especialidad.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'La especialidad es obligatoria'
      });
    }
    
    // Verificar que la persona existe
    const personaExisteQuery = `
      SELECT id_persona 
      FROM persona 
      WHERE id_persona = $1
    `;
    
    const personaExisteResponse: QueryResult = await pool.query(personaExisteQuery, [id_persona]);
    
    if (personaExisteResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'La persona especificada no existe'
      });
    }
    
    // Verificar que la persona no tenga ya un registro de personal médico
    const yaExisteQuery = `
      SELECT id_personal_medico 
      FROM personal_medico 
      WHERE id_persona = $1
    `;
    
    const yaExisteResponse: QueryResult = await pool.query(yaExisteQuery, [id_persona]);
    
    if (yaExisteResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Esta persona ya tiene un registro como personal médico'
      });
    }
    
    // Verificar que no exista otra persona con la misma cédula
    const cedulaExisteQuery = `
      SELECT id_personal_medico 
      FROM personal_medico 
      WHERE numero_cedula = $1
    `;
    
    const cedulaExisteResponse: QueryResult = await pool.query(cedulaExisteQuery, [numero_cedula.trim()]);
    
    if (cedulaExisteResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe personal médico con ese número de cédula'
      });
    }
    
    // Insertar nuevo personal médico
    const insertQuery = `
      INSERT INTO personal_medico (id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(insertQuery, [
      id_persona,
      numero_cedula.trim(),
      especialidad.trim(),
      cargo?.trim() || null,
      departamento?.trim() || null,
      activo,
      foto || null
    ]);
    
    return res.status(201).json({
      success: true,
      message: 'Personal médico creado correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear personal médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear personal médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR PERSONAL MÉDICO
// ==========================================
export const updatePersonalMedico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {
      numero_cedula,
      especialidad,
      cargo,
      departamento,
      activo,
      foto
    } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Validaciones básicas
    if (!numero_cedula || numero_cedula.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El número de cédula es obligatorio'
      });
    }
    
    if (!especialidad || especialidad.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'La especialidad es obligatoria'
      });
    }
    
    // Verificar que el personal médico existe
    const existeQuery = `
      SELECT id_personal_medico 
      FROM personal_medico 
      WHERE id_personal_medico = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personal médico no encontrado'
      });
    }
    
    // Verificar que no exista otro personal médico con la misma cédula
    const duplicadoQuery = `
      SELECT id_personal_medico 
      FROM personal_medico 
      WHERE numero_cedula = $1 AND id_personal_medico != $2
    `;
    
    const duplicadoResponse: QueryResult = await pool.query(duplicadoQuery, [numero_cedula.trim(), id]);
    
    if (duplicadoResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe otro personal médico con ese número de cédula'
      });
    }
    
    // Actualizar personal médico
    const updateQuery = `
      UPDATE personal_medico 
      SET 
        numero_cedula = $1,
        especialidad = $2,
        cargo = $3,
        departamento = $4,
        activo = $5,
        foto = $6
      WHERE id_personal_medico = $7
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(updateQuery, [
      numero_cedula.trim(),
      especialidad.trim(),
      cargo?.trim() || null,
      departamento?.trim() || null,
      activo,
      foto || null,
      id
    ]);
    
    return res.status(200).json({
      success: true,
      message: 'Personal médico actualizado correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar personal médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar personal médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR PERSONAL MÉDICO
// ==========================================
export const deletePersonalMedico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar si el personal médico existe
    const existeQuery = `
      SELECT pm.id_personal_medico, p.nombre, p.apellido_paterno, p.apellido_materno
      FROM personal_medico pm
      JOIN persona p ON pm.id_persona = p.id_persona
      WHERE pm.id_personal_medico = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personal médico no encontrado'
      });
    }
    
    // Verificar si el personal médico está siendo usado
    const usoQuery = `
      SELECT 
        (SELECT COUNT(*) FROM documento_clinico WHERE id_personal_creador = $1) as documentos_creados,
        (SELECT COUNT(*) FROM nota_interconsulta WHERE id_medico_solicitante = $1 OR id_medico_interconsulta = $1) as interconsultas,
        (SELECT COUNT(*) FROM internamiento WHERE id_medico_responsable = $1) as internamientos
    `;
    
    const usoResponse: QueryResult = await pool.query(usoQuery, [id]);
    const uso = usoResponse.rows[0];
    
    const totalUso = parseInt(uso.documentos_creados) + 
                     parseInt(uso.interconsultas) + 
                     parseInt(uso.internamientos);
    
    if (totalUso > 0) {
      return res.status(409).json({
        success: false,
        message: 'No se puede eliminar el personal médico. Está siendo usado en el sistema',
        details: {
          documentos_creados: parseInt(uso.documentos_creados),
          interconsultas: parseInt(uso.interconsultas),
          internamientos: parseInt(uso.internamientos),
          total_referencias: totalUso
        }
      });
    }
    
    // Eliminar personal médico
    const deleteQuery = `
      DELETE FROM personal_medico 
      WHERE id_personal_medico = $1 
      RETURNING id_personal_medico
    `;
    
    const response: QueryResult = await pool.query(deleteQuery, [id]);
    
    const nombreCompleto = `${existeResponse.rows[0].nombre} ${existeResponse.rows[0].apellido_paterno} ${existeResponse.rows[0].apellido_materno}`;
    
    return res.status(200).json({
      success: true,
      message: `Personal médico "${nombreCompleto}" eliminado correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar personal médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar personal médico',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER PERSONAL MÉDICO ACTIVO (PARA SELECTS)
// ==========================================
export const getPersonalMedicoActivo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { especialidad, cargo, departamento } = req.query;
    
    let query = `
      SELECT 
        pm.id_personal_medico,
        pm.numero_cedula,
        pm.especialidad,
        pm.cargo,
        pm.departamento,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo
      FROM personal_medico pm
      JOIN persona p ON pm.id_persona = p.id_persona
      WHERE pm.activo = true
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    if (especialidad) {
      query += ` AND UPPER(pm.especialidad) LIKE UPPER(${paramCounter})`;
      params.push(`%${especialidad}%`);
      paramCounter++;
    }
    
    if (cargo) {
      query += ` AND UPPER(pm.cargo) LIKE UPPER(${paramCounter})`;
      params.push(`%${cargo}%`);
      paramCounter++;
    }
    
    if (departamento) {
      query += ` AND UPPER(pm.departamento) LIKE UPPER(${paramCounter})`;
      params.push(`%${departamento}%`);
      paramCounter++;
    }
    
    query += ` ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC`;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Personal médico activo obtenido correctamente',
      data: response.rows,
      total: response.rowCount
    });
  } catch (error) {
    console.error('Error al obtener personal médico activo:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener personal activo',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE PERSONAL MÉDICO
// ==========================================
export const getEstadisticasPersonalMedico = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        pm.especialidad,
        pm.departamento,
        COUNT(pm.id_personal_medico) as total_personal,
        COUNT(CASE WHEN pm.activo = true THEN 1 END) as personal_activo,
        COUNT(dc.id_documento) as total_documentos_creados,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes_actual
      FROM personal_medico pm
      LEFT JOIN documento_clinico dc ON pm.id_personal_medico = dc.id_personal_creador
      GROUP BY pm.especialidad, pm.departamento
      ORDER BY total_documentos_creados DESC, pm.especialidad ASC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    // Estadísticas generales
    const resumenQuery = `
      SELECT 
        COUNT(*) as total_personal_registrado,
        COUNT(CASE WHEN activo = true THEN 1 END) as total_personal_activo,
        COUNT(DISTINCT especialidad) as total_especialidades,
        COUNT(DISTINCT departamento) as total_departamentos
      FROM personal_medico
    `;
    
    const resumenResponse: QueryResult = await pool.query(resumenQuery);
    
    // Top 10 médicos más productivos
    const productividadQuery = `
      SELECT 
        pm.id_personal_medico,
        pm.numero_cedula,
        pm.especialidad,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        COUNT(dc.id_documento) as total_documentos,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes
      FROM personal_medico pm
      JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN documento_clinico dc ON pm.id_personal_medico = dc.id_personal_creador
      WHERE pm.activo = true
      GROUP BY pm.id_personal_medico, pm.numero_cedula, pm.especialidad, p.nombre, p.apellido_paterno, p.apellido_materno
      ORDER BY total_documentos DESC
      LIMIT 10
    `;
    
    const productividadResponse: QueryResult = await pool.query(productividadQuery);
    
    return res.status(200).json({
      success: true,
      message: 'Estadísticas de personal médico obtenidas correctamente',
      data: {
        por_especialidad_departamento: response.rows,
        mas_productivos: productividadResponse.rows,
        resumen: resumenResponse.rows[0]
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de personal médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }


  
};


// ==========================================
// OBTENER PERFIL MÉDICO CON PACIENTES
// ==========================================
export const getPerfilMedicoConPacientes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Datos básicos del médico
    const medicoQuery = `
      SELECT 
        pm.id_personal_medico,
        pm.numero_cedula,
        pm.especialidad,
        pm.cargo,
        pm.departamento,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        COUNT(dc.id_documento) as total_documentos_creados,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes_actual
      FROM personal_medico pm
      JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN documento_clinico dc ON pm.id_personal_medico = dc.id_personal_creador
      WHERE pm.id_personal_medico = $1
      GROUP BY pm.id_personal_medico, pm.numero_cedula, pm.especialidad, pm.cargo, pm.departamento, p.nombre, p.apellido_paterno, p.apellido_materno
    `;
    
    // Pacientes atendidos por este médico
    const pacientesQuery = `
      SELECT DISTINCT
        pac.id_paciente,
        CONCAT(pp.nombre, ' ', pp.apellido_paterno, ' ', pp.apellido_materno) as nombre_completo,
        e.numero_expediente,
        EXTRACT(YEAR FROM AGE(pp.fecha_nacimiento)) as edad,
        MAX(dc.fecha_elaboracion) as ultimo_documento,
        COUNT(dc.id_documento) as total_documentos
      FROM paciente pac
      JOIN persona pp ON pac.id_persona = pp.id_persona
      JOIN expediente e ON pac.id_paciente = e.id_paciente
      JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      WHERE dc.id_personal_creador = $1
      GROUP BY pac.id_paciente, pp.nombre, pp.apellido_paterno, pp.apellido_materno, e.numero_expediente, pp.fecha_nacimiento
      ORDER BY ultimo_documento DESC
      LIMIT 20
    `;
    
    const [medicoResult, pacientesResult] = await Promise.all([
      pool.query(medicoQuery, [id]),
      pool.query(pacientesQuery, [id])
    ]);
    
    if (medicoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Médico no encontrado'
      });
    }
    
    const medico = medicoResult.rows[0];
    medico.pacientes_atendidos = pacientesResult.rows;
    
    return res.status(200).json({
      success: true,
      message: 'Perfil médico obtenido correctamente',
      data: medico
    });
  } catch (error) {
    console.error('Error al obtener perfil médico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};