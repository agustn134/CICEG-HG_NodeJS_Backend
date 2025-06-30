// src/controllers/personas/persona.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// OBTENER TODAS LAS PERSONAS
// ==========================================
export const getPersonas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { sexo, edad_min, edad_max, estado_civil, tipo_sangre, buscar } = req.query;
    
    let query = `
      SELECT 
        p.id_persona,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        p.estado_civil,
        p.religion,
        p.telefono,
        p.correo_electronico,
        p.domicilio,
        ts.nombre as tipo_sangre,
        DATE_PART('year', AGE(p.fecha_nacimiento)) as edad,
        CASE 
          WHEN pac.id_paciente IS NOT NULL THEN 'Paciente'
          WHEN pm.id_personal_medico IS NOT NULL THEN 'Personal Médico'
          WHEN adm.id_administrador IS NOT NULL THEN 'Administrador'
          ELSE 'Sin rol asignado'
        END as rol_en_sistema,
        CASE 
          WHEN pac.id_paciente IS NOT NULL THEN pac.id_paciente
          WHEN pm.id_personal_medico IS NOT NULL THEN pm.id_personal_medico
          WHEN adm.id_administrador IS NOT NULL THEN adm.id_administrador
          ELSE NULL
        END as id_rol
      FROM persona p
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN paciente pac ON p.id_persona = pac.id_persona
      LEFT JOIN personal_medico pm ON p.id_persona = pm.id_persona
      LEFT JOIN administrador adm ON p.id_persona = adm.id_persona
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    // Filtros
    if (sexo) {
      query += ` AND p.sexo = $${paramCounter}`;
      params.push(sexo);
      paramCounter++;
    }
    
    if (estado_civil) {
      query += ` AND p.estado_civil = $${paramCounter}`;
      params.push(estado_civil);
      paramCounter++;
    }
    
    if (tipo_sangre) {
      query += ` AND ts.nombre = $${paramCounter}`;
      params.push(tipo_sangre);
      paramCounter++;
    }
    
    if (buscar) {
      query += ` AND (
        UPPER(p.nombre) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_materno) LIKE UPPER($${paramCounter}) OR
        UPPER(p.curp) LIKE UPPER($${paramCounter}) OR
        UPPER(CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno)) LIKE UPPER($${paramCounter})
      )`;
      params.push(`%${buscar}%`);
      paramCounter++;
    }
    
    // Filtros por edad (aplicados después)
    let havingClause = '';
    if (edad_min) {
      havingClause += ` DATE_PART('year', AGE(p.fecha_nacimiento)) >= ${parseInt(edad_min as string)}`;
    }
    
    if (edad_max) {
      const connector = edad_min ? ' AND' : '';
      havingClause += `${connector} DATE_PART('year', AGE(p.fecha_nacimiento)) <= ${parseInt(edad_max as string)}`;
    }
    
    if (havingClause) {
      query += ` HAVING${havingClause}`;
    }
    
    query += ` ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC`;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Personas obtenidas correctamente',
      data: response.rows,
      total: response.rowCount,
      filtros_aplicados: {
        sexo: sexo || 'todos',
        edad_min: edad_min || null,
        edad_max: edad_max || null,
        estado_civil: estado_civil || 'todos',
        tipo_sangre: tipo_sangre || 'todos',
        buscar: buscar || 'sin filtro'
      }
    });
  } catch (error) {
    console.error('Error al obtener personas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener personas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER PERSONA POR ID
// ==========================================
export const getPersonaById = async (req: Request, res: Response): Promise<Response> => {
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
        p.id_persona,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        p.estado_civil,
        p.religion,
        p.telefono,
        p.correo_electronico,
        p.domicilio,
        ts.nombre as tipo_sangre,
        DATE_PART('year', AGE(p.fecha_nacimiento)) as edad,
        CASE 
          WHEN pac.id_paciente IS NOT NULL THEN 'Paciente'
          WHEN pm.id_personal_medico IS NOT NULL THEN 'Personal Médico'
          WHEN adm.id_administrador IS NOT NULL THEN 'Administrador'
          ELSE 'Sin rol asignado'
        END as rol_en_sistema,
        pac.id_paciente,
        pm.id_personal_medico,
        pm.especialidad,
        pm.cargo,
        adm.id_administrador,
        adm.usuario,
        adm.nivel_acceso
      FROM persona p
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN paciente pac ON p.id_persona = pac.id_persona
      LEFT JOIN personal_medico pm ON p.id_persona = pm.id_persona
      LEFT JOIN administrador adm ON p.id_persona = adm.id_persona
      WHERE p.id_persona = $1
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Persona encontrada correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener persona por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener persona',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR NUEVA PERSONA
// ==========================================
export const createPersona = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      tipo_sangre_id,
      estado_civil,
      religion,
      telefono,
      correo_electronico,
      domicilio
    } = req.body;
    
    // Validaciones básicas
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre es obligatorio'
      });
    }
    
    if (!apellido_paterno || apellido_paterno.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El apellido paterno es obligatorio'
      });
    }
    
    if (!fecha_nacimiento) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de nacimiento es obligatoria'
      });
    }
    
    if (!sexo || !['M', 'F'].includes(sexo)) {
      return res.status(400).json({
        success: false,
        message: 'El sexo debe ser M (Masculino) o F (Femenino)'
      });
    }
    
    // Validar CURP si se proporciona
    if (curp && curp.trim() !== '') {
      const curpRegex = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;
      
      if (!curpRegex.test(curp.trim())) {
        return res.status(400).json({
          success: false,
          message: 'El formato de CURP no es válido'
        });
      }
      
      // Verificar que la CURP no esté duplicada
      const curpExisteQuery = `
        SELECT id_persona 
        FROM persona 
        WHERE curp = $1
      `;
      
      const curpExisteResponse: QueryResult = await pool.query(curpExisteQuery, [curp.trim()]);
      
      if (curpExisteResponse.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe una persona con esa CURP'
        });
      }
    }
    
    // Validar correo electrónico si se proporciona
    if (correo_electronico && correo_electronico.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo_electronico.trim())) {
        return res.status(400).json({
          success: false,
          message: 'El formato del correo electrónico no es válido'
        });
      }
    }
    
    // Verificar que el tipo de sangre existe si se proporciona
    if (tipo_sangre_id) {
      const tipoSangreQuery = `
        SELECT id_tipo_sangre 
        FROM tipo_sangre 
        WHERE id_tipo_sangre = $1
      `;
      
      const tipoSangreResponse: QueryResult = await pool.query(tipoSangreQuery, [tipo_sangre_id]);
      
      if (tipoSangreResponse.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'El tipo de sangre especificado no existe'
        });
      }
    }
    
    // Insertar nueva persona
    const insertQuery = `
      INSERT INTO persona (
        nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, 
        curp, tipo_sangre_id, estado_civil, religion, telefono, 
        correo_electronico, domicilio
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(insertQuery, [
      nombre.trim(),
      apellido_paterno.trim(),
      apellido_materno?.trim() || null,
      fecha_nacimiento,
      sexo,
      curp?.trim() || null,
      tipo_sangre_id || null,
      estado_civil?.trim() || null,
      religion?.trim() || null,
      telefono?.trim() || null,
      correo_electronico?.trim() || null,
      domicilio?.trim() || null
    ]);
    
    return res.status(201).json({
      success: true,
      message: 'Persona creada correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear persona:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear persona',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR PERSONA
// ==========================================
export const updatePersona = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      tipo_sangre_id,
      estado_civil,
      religion,
      telefono,
      correo_electronico,
      domicilio
    } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Validaciones básicas
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre es obligatorio'
      });
    }
    
    if (!apellido_paterno || apellido_paterno.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El apellido paterno es obligatorio'
      });
    }
    
    if (!fecha_nacimiento) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de nacimiento es obligatoria'
      });
    }
    
    if (!sexo || !['M', 'F'].includes(sexo)) {
      return res.status(400).json({
        success: false,
        message: 'El sexo debe ser M (Masculino) o F (Femenino)'
      });
    }
    
    // Verificar que la persona existe
    const existeQuery = `
      SELECT id_persona 
      FROM persona 
      WHERE id_persona = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }
    
    // Validar CURP si se proporciona
    if (curp && curp.trim() !== '') {
      const curpRegex = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;
      
      if (!curpRegex.test(curp.trim())) {
        return res.status(400).json({
          success: false,
          message: 'El formato de CURP no es válido'
        });
      }
      
      // Verificar que la CURP no esté duplicada en otra persona
      const curpDuplicadaQuery = `
        SELECT id_persona 
        FROM persona 
        WHERE curp = $1 AND id_persona != $2
      `;
      
      const curpDuplicadaResponse: QueryResult = await pool.query(curpDuplicadaQuery, [curp.trim(), id]);
      
      if (curpDuplicadaResponse.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otra persona con esa CURP'
        });
      }
    }
    
    // Validar correo electrónico si se proporciona
    if (correo_electronico && correo_electronico.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo_electronico.trim())) {
        return res.status(400).json({
          success: false,
          message: 'El formato del correo electrónico no es válido'
        });
      }
    }
    
    // Verificar que el tipo de sangre existe si se proporciona
    if (tipo_sangre_id) {
      const tipoSangreQuery = `
        SELECT id_tipo_sangre 
        FROM tipo_sangre 
        WHERE id_tipo_sangre = $1
      `;
      
      const tipoSangreResponse: QueryResult = await pool.query(tipoSangreQuery, [tipo_sangre_id]);
      
      if (tipoSangreResponse.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'El tipo de sangre especificado no existe'
        });
      }
    }
    
    // Actualizar persona
    const updateQuery = `
      UPDATE persona 
      SET 
        nombre = $1,
        apellido_paterno = $2,
        apellido_materno = $3,
        fecha_nacimiento = $4,
        sexo = $5,
        curp = $6,
        tipo_sangre_id = $7,
        estado_civil = $8,
        religion = $9,
        telefono = $10,
        correo_electronico = $11,
        domicilio = $12
      WHERE id_persona = $13
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(updateQuery, [
      nombre.trim(),
      apellido_paterno.trim(),
      apellido_materno?.trim() || null,
      fecha_nacimiento,
      sexo,
      curp?.trim() || null,
      tipo_sangre_id || null,
      estado_civil?.trim() || null,
      religion?.trim() || null,
      telefono?.trim() || null,
      correo_electronico?.trim() || null,
      domicilio?.trim() || null,
      id
    ]);
    
    return res.status(200).json({
      success: true,
      message: 'Persona actualizada correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar persona:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar persona',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR PERSONA
// ==========================================
export const deletePersona = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar si la persona existe
    const existeQuery = `
      SELECT nombre, apellido_paterno, apellido_materno
      FROM persona 
      WHERE id_persona = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }
    
    // Verificar si la persona está siendo usada
    const usoQuery = `
      SELECT 
        (SELECT COUNT(*) FROM paciente WHERE id_persona = $1) as es_paciente,
        (SELECT COUNT(*) FROM personal_medico WHERE id_persona = $1) as es_personal_medico,
        (SELECT COUNT(*) FROM administrador WHERE id_persona = $1) as es_administrador
    `;
    
    const usoResponse: QueryResult = await pool.query(usoQuery, [id]);
    const uso = usoResponse.rows[0];
    
    const totalUso = parseInt(uso.es_paciente) + 
                     parseInt(uso.es_personal_medico) + 
                     parseInt(uso.es_administrador);
    
    if (totalUso > 0) {
      const roles: string[] = [];
      if (parseInt(uso.es_paciente) > 0) roles.push('Paciente');
      if (parseInt(uso.es_personal_medico) > 0) roles.push('Personal Médico');
      if (parseInt(uso.es_administrador) > 0) roles.push('Administrador');
      
      return res.status(409).json({
        success: false,
        message: `No se puede eliminar la persona. Tiene roles asignados: ${roles.join(', ')}`,
        details: {
          roles_asignados: roles,
          total_roles: totalUso
        }
      });
    }
    
    // Eliminar persona
    const deleteQuery = `
      DELETE FROM persona 
      WHERE id_persona = $1 
      RETURNING id_persona
    `;
    
    const response: QueryResult = await pool.query(deleteQuery, [id]);
    
    const nombreCompleto = `${existeResponse.rows[0].nombre} ${existeResponse.rows[0].apellido_paterno} ${existeResponse.rows[0].apellido_materno}`;
    
    return res.status(200).json({
      success: true,
      message: `Persona "${nombreCompleto}" eliminada correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar persona',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// BUSCAR PERSONAS (PARA AUTOCOMPLETE)
// ==========================================
export const buscarPersonas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { q, sin_rol } = req.query;
    
    if (!q || (q as string).trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La búsqueda debe tener al menos 2 caracteres'
      });
    }
    
    let query = `
      SELECT 
        p.id_persona,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.curp,
        p.fecha_nacimiento,
        p.sexo,
        DATE_PART('year', AGE(p.fecha_nacimiento)) as edad,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        CASE 
          WHEN pac.id_paciente IS NOT NULL THEN 'Paciente'
          WHEN pm.id_personal_medico IS NOT NULL THEN 'Personal Médico'
          WHEN adm.id_administrador IS NOT NULL THEN 'Administrador'
          ELSE 'Sin rol asignado'
        END as rol_en_sistema
      FROM persona p
      LEFT JOIN paciente pac ON p.id_persona = pac.id_persona
      LEFT JOIN personal_medico pm ON p.id_persona = pm.id_persona
      LEFT JOIN administrador adm ON p.id_persona = adm.id_persona
      WHERE (
        UPPER(p.nombre) LIKE UPPER($1) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($1) OR 
        UPPER(p.apellido_materno) LIKE UPPER($1) OR
        UPPER(p.curp) LIKE UPPER($1) OR
        UPPER(CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno)) LIKE UPPER($1)
      )
    `;
    
    const params: any[] = [`%${q}%`];
    
    // Filtrar solo personas sin rol asignado si se solicita
    if (sin_rol === 'true') {
      query += ` AND pac.id_paciente IS NULL AND pm.id_personal_medico IS NULL AND adm.id_administrador IS NULL`;
    }
    
    query += ` ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC LIMIT 20`;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: `${response.rowCount} persona(s) encontrada(s)`,
      data: response.rows,
      total: response.rowCount
    });
  } catch (error) {
    console.error('Error al buscar personas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al buscar personas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE PERSONAS
// ==========================================
export const getEstadisticasPersonas = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Estadísticas generales
    const resumenQuery = `
      SELECT 
        COUNT(*) as total_personas,
        COUNT(CASE WHEN sexo = 'M' THEN 1 END) as personas_masculinas,
        COUNT(CASE WHEN sexo = 'F' THEN 1 END) as personas_femeninas,
        COUNT(CASE WHEN curp IS NOT NULL AND curp != '' THEN 1 END) as con_curp,
        COUNT(CASE WHEN correo_electronico IS NOT NULL AND correo_electronico != '' THEN 1 END) as con_correo,
        ROUND(AVG(DATE_PART('year', AGE(fecha_nacimiento))), 2) as edad_promedio
      FROM persona
    `;
    
    const resumenResponse: QueryResult = await pool.query(resumenQuery);
    
    // Distribución por roles
    const rolesQuery = `
      SELECT 
        COUNT(CASE WHEN pac.id_paciente IS NOT NULL THEN 1 END) as total_pacientes,
        COUNT(CASE WHEN pm.id_personal_medico IS NOT NULL THEN 1 END) as total_personal_medico,
        COUNT(CASE WHEN adm.id_administrador IS NOT NULL THEN 1 END) as total_administradores,
        COUNT(CASE WHEN pac.id_paciente IS NULL AND pm.id_personal_medico IS NULL AND adm.id_administrador IS NULL THEN 1 END) as sin_rol_asignado
      FROM persona p
      LEFT JOIN paciente pac ON p.id_persona = pac.id_persona
      LEFT JOIN personal_medico pm ON p.id_persona = pm.id_persona
      LEFT JOIN administrador adm ON p.id_persona = adm.id_persona
    `;
    
    const rolesResponse: QueryResult = await pool.query(rolesQuery);
    
    // Distribución por grupos de edad
    const edadQuery = `
      SELECT 
        CASE 
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 18 THEN 'Menores (0-17)'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) BETWEEN 18 AND 39 THEN 'Adultos Jóvenes (18-39)'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) BETWEEN 40 AND 59 THEN 'Adultos (40-59)'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) >= 60 THEN 'Adultos Mayores (60+)'
        END as grupo_edad,
        COUNT(*) as total_personas,
        COUNT(CASE WHEN sexo = 'M' THEN 1 END) as masculinos,
        COUNT(CASE WHEN sexo = 'F' THEN 1 END) as femeninos
      FROM persona
      GROUP BY 
        CASE 
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 18 THEN 'Menores (0-17)'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) BETWEEN 18 AND 39 THEN 'Adultos Jóvenes (18-39)'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) BETWEEN 40 AND 59 THEN 'Adultos (40-59)'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) >= 60 THEN 'Adultos Mayores (60+)'
        END
      ORDER BY 
        CASE 
          WHEN grupo_edad = 'Menores (0-17)' THEN 1
          WHEN grupo_edad = 'Adultos Jóvenes (18-39)' THEN 2
          WHEN grupo_edad = 'Adultos (40-59)' THEN 3
          WHEN grupo_edad = 'Adultos Mayores (60+)' THEN 4
        END
    `;
    
    const edadResponse: QueryResult = await pool.query(edadQuery);
    
    // Distribución por tipo de sangre
    const tipoSangreQuery = `
      SELECT 
        COALESCE(ts.nombre, 'Sin especificar') as tipo_sangre,
        COUNT(*) as total_personas,
        COUNT(CASE WHEN p.sexo = 'M' THEN 1 END) as masculinos,
        COUNT(CASE WHEN p.sexo = 'F' THEN 1 END) as femeninos
      FROM persona p
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      GROUP BY ts.nombre
      ORDER BY total_personas DESC
    `;
    
    const tipoSangreResponse: QueryResult = await pool.query(tipoSangreQuery);
    
    return res.status(200).json({
      success: true,
      message: 'Estadísticas de personas obtenidas correctamente',
      data: {
        resumen: resumenResponse.rows[0],
        distribucion_por_roles: rolesResponse.rows[0],
        distribucion_por_edad: edadResponse.rows,
        distribucion_por_tipo_sangre: tipoSangreResponse.rows
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de personas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};
