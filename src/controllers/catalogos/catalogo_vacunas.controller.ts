// src/controllers/catalogos/catalogo_vacunas.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

// ==========================================
// OBTENER TODAS LAS VACUNAS DEL CATÁLOGO
// ==========================================
export const getCatalogoVacunas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tipo_vacuna, activa } = req.query;
    
    let query = `
      SELECT 
        cv.id_vacuna,
        cv.nombre_vacuna,
        cv.descripcion,
        cv.tipo_vacuna,
        cv.edad_aplicacion,
        cv.dosis_requeridas,
        cv.intervalo_dosis,
        cv.via_administracion,
        cv.activa,
        cv.fecha_registro,
        COUNT(va.id_vacuna_adicional) as total_aplicaciones
      FROM catalogo_vacunas cv
      LEFT JOIN vacunas_adicionales va ON cv.id_vacuna = va.id_vacuna
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCounter = 1;
    
    // Filtrar por tipo de vacuna si se especifica
    if (tipo_vacuna) {
      query += ` AND cv.tipo_vacuna = $${paramCounter}`;
      params.push(tipo_vacuna);
      paramCounter++;
    }
    
    // Filtrar por estado activo si se especifica
    if (activa !== undefined) {
      query += ` AND cv.activa = $${paramCounter}`;
      params.push(activa === 'true');
      paramCounter++;
    }
    
    query += `
      GROUP BY cv.id_vacuna, cv.nombre_vacuna, cv.descripcion, cv.tipo_vacuna, 
               cv.edad_aplicacion, cv.dosis_requeridas, cv.intervalo_dosis, 
               cv.via_administracion, cv.activa, cv.fecha_registro
      ORDER BY cv.tipo_vacuna ASC, cv.nombre_vacuna ASC
    `;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Catálogo de vacunas obtenido correctamente',
      data: response.rows,
      total: response.rowCount,
              filtros_aplicados: {
        tipo_vacuna: tipo_vacuna || 'todos',
        activa: activa || 'todas'
      }
    });
  } catch (error) {
    console.error('Error al obtener catálogo de vacunas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener catálogo de vacunas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER VACUNA POR ID
// ==========================================
export const getVacunaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un número
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    const query = `
      SELECT 
        cv.id_vacuna,
        cv.nombre_vacuna,
        cv.descripcion,
        cv.tipo_vacuna,
        cv.edad_aplicacion,
        cv.dosis_requeridas,
        cv.intervalo_dosis,
        cv.via_administracion,
        cv.activa,
        cv.fecha_registro,
        COUNT(va.id_vacuna_adicional) as total_aplicaciones,
        COUNT(CASE WHEN va.fecha_aplicacion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as aplicaciones_mes_actual
      FROM catalogo_vacunas cv
      LEFT JOIN vacunas_adicionales va ON cv.id_vacuna = va.id_vacuna
      WHERE cv.id_vacuna = $1
      GROUP BY cv.id_vacuna, cv.nombre_vacuna, cv.descripcion, cv.tipo_vacuna, 
               cv.edad_aplicacion, cv.dosis_requeridas, cv.intervalo_dosis, 
               cv.via_administracion, cv.activa, cv.fecha_registro
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vacuna no encontrada en el catálogo'
      });
    }
    
    // Obtener las últimas aplicaciones de esta vacuna
    const aplicacionesQuery = `
      SELECT 
        va.id_vacuna_adicional,
        va.fecha_aplicacion,
        va.dosis_numero,
        va.lote_vacuna,
        va.laboratorio,
        va.aplicada_por,
        va.institucion_aplicacion,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        e.numero_expediente
      FROM vacunas_adicionales va
      JOIN inmunizaciones i ON va.id_inmunizacion = i.id_inmunizacion
      JOIN historia_clinica hc ON i.id_historia_clinica = hc.id_historia_clinica
      JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE va.id_vacuna = $1
      ORDER BY va.fecha_aplicacion DESC
      LIMIT 10
    `;
    
    const aplicacionesResponse: QueryResult = await pool.query(aplicacionesQuery, [id]);
    
    const vacunaData = response.rows[0];
    vacunaData.ultimas_aplicaciones = aplicacionesResponse.rows;
    
    return res.status(200).json({
      success: true,
      message: 'Vacuna encontrada correctamente',
      data: vacunaData
    });
  } catch (error) {
    console.error('Error al obtener vacuna por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener vacuna',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR NUEVA VACUNA EN EL CATÁLOGO
// ==========================================
export const createVacuna = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      nombre_vacuna,
      descripcion,
      tipo_vacuna,
      edad_aplicacion,
      dosis_requeridas = 1,
      intervalo_dosis,
      via_administracion = 'Intramuscular',
      activa = true
    } = req.body;
    
    // Validaciones básicas
    if (!nombre_vacuna || nombre_vacuna.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la vacuna es obligatorio'
      });
    }
    
    if (!tipo_vacuna || tipo_vacuna.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El tipo de vacuna es obligatorio'
      });
    }
    
    // Validar tipos de vacuna permitidos
    const tiposPermitidos = ['Básica', 'Adicional', 'Especial', 'Emergencia'];
    if (!tiposPermitidos.includes(tipo_vacuna)) {
      return res.status(400).json({
        success: false,
        message: `El tipo de vacuna debe ser uno de: ${tiposPermitidos.join(', ')}`
      });
    }
    
    // Verificar si ya existe una vacuna con el mismo nombre
    const existeQuery = `
      SELECT id_vacuna 
      FROM catalogo_vacunas 
      WHERE UPPER(nombre_vacuna) = UPPER($1)
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [nombre_vacuna.trim()]);
    
    if (existeResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una vacuna con ese nombre en el catálogo'
      });
    }
    
    // Insertar nueva vacuna
    const insertQuery = `
      INSERT INTO catalogo_vacunas (
        nombre_vacuna, 
        descripcion, 
        tipo_vacuna, 
        edad_aplicacion, 
        dosis_requeridas, 
        intervalo_dosis, 
        via_administracion, 
        activa
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(insertQuery, [
      nombre_vacuna.trim(),
      descripcion?.trim() || null,
      tipo_vacuna,
      edad_aplicacion?.trim() || null,
      dosis_requeridas,
      intervalo_dosis?.trim() || null,
      via_administracion,
      activa
    ]);
    
    return res.status(201).json({
      success: true,
      message: 'Vacuna agregada al catálogo correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear vacuna:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear vacuna',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR VACUNA DEL CATÁLOGO
// ==========================================
export const updateVacuna = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {
      nombre_vacuna,
      descripcion,
      tipo_vacuna,
      edad_aplicacion,
      dosis_requeridas,
      intervalo_dosis,
      via_administracion,
      activa
    } = req.body;
    
    // Validar que el ID sea un número
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Validaciones básicas
    if (!nombre_vacuna || nombre_vacuna.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la vacuna es obligatorio'
      });
    }
    
    if (!tipo_vacuna || tipo_vacuna.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El tipo de vacuna es obligatorio'
      });
    }
    
    // Validar tipos de vacuna permitidos
    const tiposPermitidos = ['Básica', 'Adicional', 'Especial', 'Emergencia'];
    if (!tiposPermitidos.includes(tipo_vacuna)) {
      return res.status(400).json({
        success: false,
        message: `El tipo de vacuna debe ser uno de: ${tiposPermitidos.join(', ')}`
      });
    }
    
    // Verificar si la vacuna existe
    const existeQuery = `
      SELECT id_vacuna 
      FROM catalogo_vacunas 
      WHERE id_vacuna = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vacuna no encontrada en el catálogo'
      });
    }
    
    // Verificar si ya existe otra vacuna con el mismo nombre
    const duplicadoQuery = `
      SELECT id_vacuna 
      FROM catalogo_vacunas 
      WHERE UPPER(nombre_vacuna) = UPPER($1) AND id_vacuna != $2
    `;
    
    const duplicadoResponse: QueryResult = await pool.query(duplicadoQuery, [nombre_vacuna.trim(), id]);
    
    if (duplicadoResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe otra vacuna con ese nombre en el catálogo'
      });
    }
    
    // Actualizar vacuna
    const updateQuery = `
      UPDATE catalogo_vacunas 
      SET 
        nombre_vacuna = $1, 
        descripcion = $2, 
        tipo_vacuna = $3, 
        edad_aplicacion = $4, 
        dosis_requeridas = $5, 
        intervalo_dosis = $6, 
        via_administracion = $7, 
        activa = $8
      WHERE id_vacuna = $9 
      RETURNING *
    `;
    
    const response: QueryResult = await pool.query(updateQuery, [
      nombre_vacuna.trim(),
      descripcion?.trim() || null,
      tipo_vacuna,
      edad_aplicacion?.trim() || null,
      dosis_requeridas,
      intervalo_dosis?.trim() || null,
      via_administracion,
      activa,
      id
    ]);
    
    return res.status(200).json({
      success: true,
      message: 'Vacuna actualizada correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar vacuna:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar vacuna',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR VACUNA DEL CATÁLOGO
// ==========================================
export const deleteVacuna = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un número
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar si la vacuna existe
    const existeQuery = `
      SELECT id_vacuna, nombre_vacuna 
      FROM catalogo_vacunas 
      WHERE id_vacuna = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vacuna no encontrada en el catálogo'
      });
    }
    
    // Verificar si la vacuna está siendo usada
    const usoQuery = `
      SELECT COUNT(*) as total
      FROM vacunas_adicionales 
      WHERE id_vacuna = $1
    `;
    
    const usoResponse: QueryResult = await pool.query(usoQuery, [id]);
    const totalUso = parseInt(usoResponse.rows[0].total);
    
    if (totalUso > 0) {
      return res.status(409).json({
        success: false,
        message: `No se puede eliminar la vacuna. Ha sido aplicada ${totalUso} vez(ces)`,
        details: {
          aplicaciones_registradas: totalUso
        }
      });
    }
    
    // Eliminar vacuna
    const deleteQuery = `
      DELETE FROM catalogo_vacunas 
      WHERE id_vacuna = $1 
      RETURNING nombre_vacuna
    `;
    
    const response: QueryResult = await pool.query(deleteQuery, [id]);
    
    return res.status(200).json({
      success: true,
      message: `Vacuna "${response.rows[0].nombre_vacuna}" eliminada del catálogo correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar vacuna:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar vacuna',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER VACUNAS ACTIVAS (PARA SELECTS)
// ==========================================
export const getVacunasActivas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tipo_vacuna } = req.query;
    
    let query = `
      SELECT 
        id_vacuna,
        nombre_vacuna,
        tipo_vacuna,
        edad_aplicacion,
        dosis_requeridas,
        via_administracion
      FROM catalogo_vacunas 
      WHERE activa = true
    `;
    
    const params: any[] = [];
    
    // Filtrar por tipo si se especifica
    if (tipo_vacuna) {
      query += ` AND tipo_vacuna = $1`;
      params.push(tipo_vacuna);
    }
    
    query += ` ORDER BY tipo_vacuna ASC, nombre_vacuna ASC`;
    
    const response: QueryResult = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      message: 'Vacunas activas obtenidas correctamente',
      data: response.rows,
      total: response.rowCount
    });
  } catch (error) {
    console.error('Error al obtener vacunas activas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener vacunas activas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DEL CATÁLOGO DE VACUNAS
// ==========================================
export const getEstadisticasVacunas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        cv.tipo_vacuna,
        COUNT(cv.id_vacuna) as total_vacunas,
        COUNT(CASE WHEN cv.activa = true THEN 1 END) as vacunas_activas,
        COUNT(va.id_vacuna_adicional) as total_aplicaciones,
        COUNT(CASE WHEN va.fecha_aplicacion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as aplicaciones_mes_actual
      FROM catalogo_vacunas cv
      LEFT JOIN vacunas_adicionales va ON cv.id_vacuna = va.id_vacuna
      GROUP BY cv.tipo_vacuna
      ORDER BY total_aplicaciones DESC, cv.tipo_vacuna ASC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    // Calcular estadísticas generales
    const totalVacunas = response.rows.reduce((sum, row) => sum + parseInt(row.total_vacunas), 0);
    const vacunasActivas = response.rows.reduce((sum, row) => sum + parseInt(row.vacunas_activas), 0);
    const totalAplicaciones = response.rows.reduce((sum, row) => sum + parseInt(row.total_aplicaciones), 0);
    const aplicacionesMes = response.rows.reduce((sum, row) => sum + parseInt(row.aplicaciones_mes_actual), 0);
    
    return res.status(200).json({
      success: true,
      message: 'Estadísticas del catálogo de vacunas obtenidas correctamente',
      data: {
        por_tipo: response.rows,
        resumen: {
          total_vacunas_catalogo: totalVacunas,
          vacunas_activas: vacunasActivas,
          total_aplicaciones_registradas: totalAplicaciones,
          aplicaciones_mes_actual: aplicacionesMes,
          tipos_disponibles: response.rows.length
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de vacunas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};