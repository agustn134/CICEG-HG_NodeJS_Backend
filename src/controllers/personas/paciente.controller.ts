// src/controllers/personas/paciente.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// OBTENER TODOS LOS PACIENTES
// ==========================================
export const getPacientes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { sexo, edad_min, edad_max, tiene_alergias, buscar } = req.query;
    
    let query = `
      SELECT 
        pac.id_paciente,
        pac.alergias,
        pac.transfusiones,
        pac.detalles_transfusiones,
        pac.familiar_responsable,
        pac.parentesco_familiar,
        pac.telefono_familiar,
        pac.ocupacion,
        pac.escolaridad,
        pac.lugar_nacimiento,
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
        DATE_PART('year', AGE(p.fecha_nacimiento)) as edad,
        COUNT(e.id_expediente) as total_expedientes,
        COUNT(CASE WHEN e.estado = 'Activo' THEN 1 END) as expedientes_activos
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN expediente e ON pac.id_paciente = e.id_paciente
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
    
    if (tiene_alergias !== undefined) {
      query += ` AND (pac.alergias IS ${tiene_alergias === 'true' ? 'NOT NULL AND pac.alergias != \'\'':'NULL OR pac.alergias = \'\''})`;
    }
    
    if (buscar) {
      query += ` AND (
        UPPER(p.nombre) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_materno) LIKE UPPER($${paramCounter}) OR
        UPPER(p.curp) LIKE UPPER($${paramCounter})
      )`;
      params.push(`%${buscar}%`);
      paramCounter++;
    }
    
    query += `
      GROUP BY pac.id_paciente, pac.alergias, pac.transfusiones, pac.detalles_transfusiones,
               pac.familiar_responsable, pac.parentesco_familiar, pac.telefono_familiar,
               pac.ocupacion, pac.escolaridad, pac.lugar_nacimiento, p.id_persona,
               p.nombre, p.apellido_paterno, p.apellido_materno, p.fecha_nacimiento,
               p.sexo, p.curp, p.telefono, p.correo_electronico, p.domicilio,
               p.estado_civil, p.religion, ts.nombre
    `;
    
    // Filtros por edad (se aplican después del GROUP BY)
    if (edad_min) {
      query += ` HAVING DATE_PART('year', AGE(p.fecha_nacimiento)) >= ${parseInt(edad_min as string)}`;
    }
    
    if (edad_max) {
      const connector = edad_min ? ' AND' : ' HAVING';
      query += `${connector} DATE_PART('year', AGE(p.fecha_nacimiento)) <= ${parseInt(edad_max as string)}`;
    }
    
    query += ` ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC`;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Pacientes obtenidos correctamente',
      data: response.rows,
      total: response.rowCount,
      filtros_aplicados: {
        sexo: sexo || 'todos',
        edad_min: edad_min || null,
        edad_max: edad_max || null,
        tiene_alergias: tiene_alergias || 'todos',
        buscar: buscar || 'sin filtro'
      }
    });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener pacientes',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER PACIENTE POR ID
// ==========================================
export const getPacienteById = async (req: Request, res: Response): Promise<Response> => {
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
        pac.id_paciente,
        pac.alergias,
        pac.transfusiones,
        pac.detalles_transfusiones,
        pac.familiar_responsable,
        pac.parentesco_familiar,
        pac.telefono_familiar,
        pac.ocupacion,
        pac.escolaridad,
        pac.lugar_nacimiento,
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
        DATE_PART('year', AGE(p.fecha_nacimiento)) as edad,
        COUNT(e.id_expediente) as total_expedientes,
        COUNT(CASE WHEN e.estado = 'Activo' THEN 1 END) as expedientes_activos,
        COUNT(i.id_internamiento) as total_internamientos,
        COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as internamientos_activos
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN expediente e ON pac.id_paciente = e.id_paciente
      LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente
      WHERE pac.id_paciente = $1
      GROUP BY pac.id_paciente, pac.alergias, pac.transfusiones, pac.detalles_transfusiones,
               pac.familiar_responsable, pac.parentesco_familiar, pac.telefono_familiar,
               pac.ocupacion, pac.escolaridad, pac.lugar_nacimiento, p.id_persona,
               p.nombre, p.apellido_paterno, p.apellido_materno, p.fecha_nacimiento,
               p.sexo, p.curp, p.telefono, p.correo_electronico, p.domicilio,
               p.estado_civil, p.religion, ts.nombre
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    // Obtener expedientes del paciente
    const expedientesQuery = `
      SELECT 
        e.id_expediente,
        e.numero_expediente,
        e.estado,
        e.fecha_creacion,
        COUNT(dc.id_documento) as total_documentos,
        COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as internamientos_activos
      FROM expediente e
      LEFT JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente
      WHERE e.id_paciente = $1
      GROUP BY e.id_expediente, e.numero_expediente, e.estado, e.fecha_creacion
      ORDER BY e.fecha_creacion DESC
    `;
    
    const expedientesResponse: QueryResult = await pool.query(expedientesQuery, [id]);
    
    const pacienteData = response.rows[0];
    pacienteData.expedientes = expedientesResponse.rows;
    
    return res.status(200).json({
      success: true,
      message: 'Paciente encontrado correctamente',
      data: pacienteData
    });
  } catch (error) {
    console.error('Error al obtener paciente por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener paciente',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR NUEVO PACIENTE
// ==========================================
export const createPaciente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_persona,
      alergias,
      transfusiones = false,
      detalles_transfusiones,
      familiar_responsable,
      parentesco_familiar,
      telefono_familiar,
      ocupacion,
      escolaridad,
      lugar_nacimiento
    } = req.body;
    
    // Validaciones básicas
    if (!id_persona) {
      return res.status(400).json({
        success: false,
        message: 'El ID de persona es obligatorio'
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
    
    // Verificar que la persona no tenga ya un registro de paciente
    const yaExisteQuery = `
      SELECT id_paciente 
      FROM paciente 
      WHERE id_persona = $1
    `;
    
    const yaExisteResponse: QueryResult = await pool.query(yaExisteQuery, [id_persona]);
    
    if (yaExisteResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Esta persona ya tiene un registro como paciente'
      });
    }
    
    // Insertar nuevo paciente
    const insertQuery = `
      INSERT INTO paciente (
        id_persona, alergias, transfusiones, detalles_transfusiones,
        familiar_responsable, parentesco_familiar, telefono_familiar,
        ocupacion, escolaridad, lugar_nacimiento
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(insertQuery, [
      id_persona,
      alergias?.trim() || null,
      transfusiones,
      detalles_transfusiones?.trim() || null,
      familiar_responsable?.trim() || null,
      parentesco_familiar?.trim() || null,
      telefono_familiar?.trim() || null,
      ocupacion?.trim() || null,
      escolaridad?.trim() || null,
      lugar_nacimiento?.trim() || null
    ]);
    
    return res.status(201).json({
      success: true,
      message: 'Paciente creado correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear paciente',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR PACIENTE
// ==========================================
export const updatePaciente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {
      alergias,
      transfusiones,
      detalles_transfusiones,
      familiar_responsable,
      parentesco_familiar,
      telefono_familiar,
      ocupacion,
      escolaridad,
      lugar_nacimiento
    } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar que el paciente existe
    const existeQuery = `
      SELECT id_paciente 
      FROM paciente 
      WHERE id_paciente = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    // Actualizar paciente
    const updateQuery = `
      UPDATE paciente 
      SET 
        alergias = $1,
        transfusiones = $2,
        detalles_transfusiones = $3,
        familiar_responsable = $4,
        parentesco_familiar = $5,
        telefono_familiar = $6,
        ocupacion = $7,
        escolaridad = $8,
        lugar_nacimiento = $9
      WHERE id_paciente = $10
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(updateQuery, [
      alergias?.trim() || null,
      transfusiones,
      detalles_transfusiones?.trim() || null,
      familiar_responsable?.trim() || null,
      parentesco_familiar?.trim() || null,
      telefono_familiar?.trim() || null,
      ocupacion?.trim() || null,
      escolaridad?.trim() || null,
      lugar_nacimiento?.trim() || null,
      id
    ]);
    
    return res.status(200).json({
      success: true,
      message: 'Paciente actualizado correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar paciente',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR PACIENTE
// ==========================================
export const deletePaciente = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar si el paciente existe
    const existeQuery = `
      SELECT pac.id_paciente, p.nombre, p.apellido_paterno, p.apellido_materno
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE pac.id_paciente = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    // Verificar si el paciente está siendo usado
    const usoQuery = `
      SELECT 
        (SELECT COUNT(*) FROM expediente WHERE id_paciente = $1) as expedientes,
        (SELECT COUNT(*) FROM internamiento i JOIN expediente e ON i.id_expediente = e.id_expediente WHERE e.id_paciente = $1) as internamientos
    `;
    
    const usoResponse: QueryResult = await pool.query(usoQuery, [id]);
    const uso = usoResponse.rows[0];
    
    const totalUso = parseInt(uso.expedientes) + parseInt(uso.internamientos);
    
    if (totalUso > 0) {
      return res.status(409).json({
        success: false,
        message: 'No se puede eliminar el paciente. Tiene expedientes e internamientos asociados',
        details: {
          expedientes: parseInt(uso.expedientes),
          internamientos: parseInt(uso.internamientos),
          total_referencias: totalUso
        }
      });
    }
    
    // Eliminar paciente
    const deleteQuery = `
      DELETE FROM paciente 
      WHERE id_paciente = $1 
      RETURNING id_paciente
    `;
    
    const response: QueryResult = await pool.query(deleteQuery, [id]);
    
    const nombreCompleto = `${existeResponse.rows[0].nombre} ${existeResponse.rows[0].apellido_paterno} ${existeResponse.rows[0].apellido_materno}`;
    
    return res.status(200).json({
      success: true,
      message: `Paciente "${nombreCompleto}" eliminado correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar paciente',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// BUSCAR PACIENTES (PARA AUTOCOMPLETE)
// ==========================================
export const buscarPacientes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { q } = req.query;
    
    if (!q || (q as string).trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La búsqueda debe tener al menos 2 caracteres'
      });
    }
    
    const query = `
      SELECT 
        pac.id_paciente,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.curp,
        p.fecha_nacimiento,
        p.sexo,
        DATE_PART('year', AGE(p.fecha_nacimiento)) as edad,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE 
        UPPER(p.nombre) LIKE UPPER($1) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($1) OR 
        UPPER(p.apellido_materno) LIKE UPPER($1) OR
        UPPER(p.curp) LIKE UPPER($1) OR
        UPPER(CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno)) LIKE UPPER($1)
      ORDER BY p.apellido_paterno ASC, p.apellido_materno ASC, p.nombre ASC
      LIMIT 20
    `;
    
    const response: QueryResult = await pool.query(query, [`%${q}%`]);
    
    return res.status(200).json({
      success: true,
      message: `${response.rowCount} paciente(s) encontrado(s)`,
      data: response.rows,
      total: response.rowCount
    });
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al buscar pacientes',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE PACIENTES
// ==========================================
export const getEstadisticasPacientes = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Estadísticas generales
    const resumenQuery = `
      SELECT 
        COUNT(*) as total_pacientes,
        COUNT(CASE WHEN p.sexo = 'M' THEN 1 END) as pacientes_masculinos,
        COUNT(CASE WHEN p.sexo = 'F' THEN 1 END) as pacientes_femeninos,
        COUNT(CASE WHEN pac.transfusiones = true THEN 1 END) as con_transfusiones,
        COUNT(CASE WHEN pac.alergias IS NOT NULL AND pac.alergias != '' THEN 1 END) as con_alergias,
        ROUND(AVG(DATE_PART('year', AGE(p.fecha_nacimiento))), 2) as edad_promedio
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
    `;
    
    const resumenResponse: QueryResult = await pool.query(resumenQuery);
    
    // Distribución por grupos de edad
    const edadQuery = `
      SELECT 
        CASE 
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) < 18 THEN 'Menores (0-17)'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) BETWEEN 18 AND 39 THEN 'Adultos Jóvenes (18-39)'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) BETWEEN 40 AND 59 THEN 'Adultos (40-59)'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) >= 60 THEN 'Adultos Mayores (60+)'
        END as grupo_edad,
        COUNT(*) as total_pacientes,
        COUNT(CASE WHEN p.sexo = 'M' THEN 1 END) as masculinos,
        COUNT(CASE WHEN p.sexo = 'F' THEN 1 END) as femeninos
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      GROUP BY 
        CASE 
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) < 18 THEN 'Menores (0-17)'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) BETWEEN 18 AND 39 THEN 'Adultos Jóvenes (18-39)'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) BETWEEN 40 AND 59 THEN 'Adultos (40-59)'
          WHEN DATE_PART('year', AGE(p.fecha_nacimiento)) >= 60 THEN 'Adultos Mayores (60+)'
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
        COUNT(*) as total_pacientes,
        COUNT(CASE WHEN p.sexo = 'M' THEN 1 END) as masculinos,
        COUNT(CASE WHEN p.sexo = 'F' THEN 1 END) as femeninos
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      GROUP BY ts.nombre
      ORDER BY total_pacientes DESC
    `;
    
    const tipoSangreResponse: QueryResult = await pool.query(tipoSangreQuery);
    
    // Pacientes con más expedientes
    const masExpedientesQuery = `
      SELECT 
        pac.id_paciente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        p.curp,
        DATE_PART('year', AGE(p.fecha_nacimiento)) as edad,
        COUNT(e.id_expediente) as total_expedientes,
        COUNT(CASE WHEN e.estado = 'Activo' THEN 1 END) as expedientes_activos
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN expediente e ON pac.id_paciente = e.id_paciente
      GROUP BY pac.id_paciente, p.nombre, p.apellido_paterno, p.apellido_materno, p.curp, p.fecha_nacimiento
      HAVING COUNT(e.id_expediente) > 0
      ORDER BY total_expedientes DESC
      LIMIT 10
    `;
    
    const masExpedientesResponse: QueryResult = await pool.query(masExpedientesQuery);
    
    return res.status(200).json({
      success: true,
      message: 'Estadísticas de pacientes obtenidas correctamente',
      data: {
        resumen: resumenResponse.rows[0],
        distribucion_por_edad: edadResponse.rows,
        distribucion_por_tipo_sangre: tipoSangreResponse.rows,
        pacientes_con_mas_expedientes: masExpedientesResponse.rows
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de pacientes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER HISTORIAL MÉDICO RESUMIDO
// ==========================================
export const getHistorialMedicoResumido = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar que el paciente existe
    const pacienteQuery = `
      SELECT pac.id_paciente, CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE pac.id_paciente = $1
    `;
    
    const pacienteResponse: QueryResult = await pool.query(pacienteQuery, [id]);
    
    if (pacienteResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    // Obtener expedientes y sus documentos
    const historialQuery = `
      SELECT 
        e.id_expediente,
        e.numero_expediente,
        e.fecha_creacion,
        COUNT(dc.id_documento) as total_documentos,
        COUNT(CASE WHEN td.nombre = 'Historia Clínica' THEN 1 END) as historias_clinicas,
        COUNT(CASE WHEN td.nombre = 'Nota de Urgencias' THEN 1 END) as notas_urgencias,
        COUNT(CASE WHEN td.nombre = 'Nota de Evolución' THEN 1 END) as notas_evolucion,
        MAX(dc.fecha_elaboracion) as ultima_atencion
      FROM expediente e
      LEFT JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      LEFT JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      WHERE e.id_paciente = $1
      GROUP BY e.id_expediente, e.numero_expediente, e.fecha_creacion
      ORDER BY e.fecha_creacion DESC
    `;
    
    const historialResponse: QueryResult = await pool.query(historialQuery, [id]);
    
    // Obtener internamientos
    const internamientosQuery = `
      SELECT 
        i.id_internamiento,
        i.fecha_ingreso,
        i.fecha_egreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        i.diagnostico_egreso,
        s.nombre as servicio,
        c.numero as cama,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE e.id_paciente = $1
      ORDER BY i.fecha_ingreso DESC
      LIMIT 10
    `;
    
    const internamientosResponse: QueryResult = await pool.query(internamientosQuery, [id]);
    
    return res.status(200).json({
      success: true,
      message: 'Historial médico resumido obtenido correctamente',
      data: {
        paciente: pacienteResponse.rows[0],
        expedientes: historialResponse.rows,
        internamientos_recientes: internamientosResponse.rows
      }
    });
  } catch (error) {
    console.error('Error al obtener historial médico resumido:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener historial',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};