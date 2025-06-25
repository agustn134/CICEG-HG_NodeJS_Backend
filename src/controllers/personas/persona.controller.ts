// src/controllers/personas/persona.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const updatePersona = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
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
    const response: QueryResult = await pool.query(
      "UPDATE persona SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, fecha_nacimiento = $4, sexo = $5, curp = $6, tipo_sangre_id = $7, estado_civil = $8, religion = $9, telefono = $10, correo_electronico = $11, domicilio = $12 WHERE id_persona = $13 RETURNING *",
      [
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
        domicilio,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Persona no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar persona");
  }
};

export const deletePersona = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM persona WHERE id_persona = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Persona no encontrada");
    }
    return res.status(200).send("Persona eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar persona");
  }
};



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
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  RETURNING *
`;

const values = [
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
];

const response: QueryResult = await pool.query(insertQuery, values);

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
