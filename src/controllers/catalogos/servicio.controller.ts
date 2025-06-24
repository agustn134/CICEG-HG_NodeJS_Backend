// src/controllers/catalogos/servicio.controller.ts
import { Request, Response } from "express";
import { QueryResult } from 'pg';
import pool from "../../config/database"; 

// ==========================================
// OBTENER TODOS LOS SERVICIOS
// ==========================================
export const getServicios = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        s.id_servicio,
        s.nombre,
        s.descripcion,
        s.activo,
        COUNT(c.id_cama) as total_camas,
        COUNT(CASE WHEN c.estado = 'Disponible' THEN 1 END) as camas_disponibles,
        COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END) as camas_ocupadas,
        COUNT(i.id_internamiento) as total_internamientos_activos
      FROM servicio s
      LEFT JOIN cama c ON s.id_servicio = c.id_servicio
      LEFT JOIN internamiento i ON s.id_servicio = i.id_servicio AND i.fecha_egreso IS NULL
      GROUP BY s.id_servicio, s.nombre, s.descripcion, s.activo
      ORDER BY s.nombre ASC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    return res.status(200).json({
      success: true,
      message: 'Servicios obtenidos correctamente',
      data: response.rows,
      total: response.rowCount
    });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener servicios',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER SERVICIO POR ID
// ==========================================
export const getServicioById = async (req: Request, res: Response): Promise<Response> => {
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
        s.id_servicio,
        s.nombre,
        s.descripcion,
        s.activo,
        COUNT(c.id_cama) as total_camas,
        COUNT(CASE WHEN c.estado = 'Disponible' THEN 1 END) as camas_disponibles,
        COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END) as camas_ocupadas,
        COUNT(CASE WHEN c.estado = 'Mantenimiento' THEN 1 END) as camas_mantenimiento,
        COUNT(CASE WHEN c.estado = 'Reservada' THEN 1 END) as camas_reservadas,
        COUNT(i.id_internamiento) as total_internamientos_activos
      FROM servicio s
      LEFT JOIN cama c ON s.id_servicio = c.id_servicio
      LEFT JOIN internamiento i ON s.id_servicio = i.id_servicio AND i.fecha_egreso IS NULL
      WHERE s.id_servicio = $1
      GROUP BY s.id_servicio, s.nombre, s.descripcion, s.activo
    `;
    
    const response: QueryResult = await pool.query(query, [id]);
    
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Servicio encontrado correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener servicio por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener servicio',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// CREAR NUEVO SERVICIO
// ==========================================
export const createServicio = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nombre, descripcion, activo = true } = req.body;
    
    // Validaciones básicas
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del servicio es obligatorio'
      });
    }
    
    // Verificar si ya existe un servicio con el mismo nombre
    const existeQuery = `
      SELECT id_servicio 
      FROM servicio 
      WHERE UPPER(nombre) = UPPER($1)
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [nombre.trim()]);
    
    if (existeResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un servicio con ese nombre'
      });
    }
    
    // Insertar nuevo servicio
    const insertQuery = `
      INSERT INTO servicio (nombre, descripcion, activo) 
      VALUES ($1, $2, $3) 
      RETURNING id_servicio, nombre, descripcion, activo
    `;
    
    const response: QueryResult = await pool.query(insertQuery, [
      nombre.trim(),
      descripcion?.trim() || null,
      activo
    ]);
    
    return res.status(201).json({
      success: true,
      message: 'Servicio creado correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear servicio',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ACTUALIZAR SERVICIO
// ==========================================
export const updateServicio = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;
    
    // Validar que el ID sea un número
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
        message: 'El nombre del servicio es obligatorio'
      });
    }
    
    // Verificar si el servicio existe
    const existeQuery = `
      SELECT id_servicio 
      FROM servicio 
      WHERE id_servicio = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }
    
    // Verificar si ya existe otro servicio con el mismo nombre
    const duplicadoQuery = `
      SELECT id_servicio 
      FROM servicio 
      WHERE UPPER(nombre) = UPPER($1) AND id_servicio != $2
    `;
    
    const duplicadoResponse: QueryResult = await pool.query(duplicadoQuery, [nombre.trim(), id]);
    
    if (duplicadoResponse.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe otro servicio con ese nombre'
      });
    }
    
    // Actualizar servicio
    const updateQuery = `
      UPDATE servicio 
      SET nombre = $1, descripcion = $2, activo = $3
      WHERE id_servicio = $4 
      RETURNING id_servicio, nombre, descripcion, activo
    `;
    
    const response: QueryResult = await pool.query(updateQuery, [
      nombre.trim(),
      descripcion?.trim() || null,
      activo,
      id
    ]);
    
    return res.status(200).json({
      success: true,
      message: 'Servicio actualizado correctamente',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar servicio',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// ELIMINAR SERVICIO
// ==========================================
export const deleteServicio = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un número
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'El ID debe ser un número válido'
      });
    }
    
    // Verificar si el servicio existe
    const existeQuery = `
      SELECT id_servicio, nombre 
      FROM servicio 
      WHERE id_servicio = $1
    `;
    
    const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
    
    if (existeResponse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }
    
    // Verificar si el servicio está siendo usado
    const usoQuery = `
      SELECT 
        (SELECT COUNT(*) FROM cama WHERE id_servicio = $1) as total_camas,
        (SELECT COUNT(*) FROM internamiento WHERE id_servicio = $1) as total_internamientos
    `;
    
    const usoResponse: QueryResult = await pool.query(usoQuery, [id]);
    const { total_camas, total_internamientos } = usoResponse.rows[0];
    
    if (parseInt(total_camas) > 0 || parseInt(total_internamientos) > 0) {
      return res.status(409).json({
        success: false,
        message: 'No se puede eliminar el servicio. Está siendo usado en el sistema',
        details: {
          camas_asociadas: parseInt(total_camas),
          internamientos_asociados: parseInt(total_internamientos)
        }
      });
    }
    
    // Eliminar servicio
    const deleteQuery = `
      DELETE FROM servicio 
      WHERE id_servicio = $1 
      RETURNING nombre
    `;
    
    const response: QueryResult = await pool.query(deleteQuery, [id]);
    
    return res.status(200).json({
      success: true,
      message: `Servicio "${response.rows[0].nombre}" eliminado correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar servicio',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER SERVICIOS ACTIVOS (PARA SELECTS)
// ==========================================
export const getServiciosActivos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        id_servicio,
        nombre,
        descripcion
      FROM servicio 
      WHERE activo = true
      ORDER BY nombre ASC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    return res.status(200).json({
      success: true,
      message: 'Servicios activos obtenidos correctamente',
      data: response.rows,
      total: response.rowCount
    });
  } catch (error) {
    console.error('Error al obtener servicios activos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener servicios activos',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE SERVICIOS
// ==========================================
export const getEstadisticasServicios = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = `
      SELECT 
        s.id_servicio,
        s.nombre,
        s.descripcion,
        s.activo,
        COUNT(c.id_cama) as total_camas,
        COUNT(CASE WHEN c.estado = 'Disponible' THEN 1 END) as camas_disponibles,
        COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END) as camas_ocupadas,
        COUNT(CASE WHEN c.estado = 'Mantenimiento' THEN 1 END) as camas_mantenimiento,
        COUNT(CASE WHEN c.estado = 'Reservada' THEN 1 END) as camas_reservadas,
        COUNT(CASE WHEN c.estado = 'Contaminada' THEN 1 END) as camas_contaminadas,
        COUNT(i.id_internamiento) as pacientes_actuales,
        COALESCE(
          ROUND(
            (COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END)::DECIMAL / 
             NULLIF(COUNT(CASE WHEN c.estado IN ('Disponible', 'Ocupada') THEN 1 END), 0)) * 100, 2
          ), 0
        ) as porcentaje_ocupacion
      FROM servicio s
      LEFT JOIN cama c ON s.id_servicio = c.id_servicio
      LEFT JOIN internamiento i ON s.id_servicio = i.id_servicio AND i.fecha_egreso IS NULL
      GROUP BY s.id_servicio, s.nombre, s.descripcion, s.activo
      ORDER BY pacientes_actuales DESC, s.nombre ASC
    `;
    
    const response: QueryResult = await pool.query(query);
    
    // Calcular estadísticas generales
    const totalServicios = response.rows.length;
    const serviciosActivos = response.rows.filter(row => row.activo).length;
    const totalCamas = response.rows.reduce((sum, row) => sum + parseInt(row.total_camas), 0);
    const camasOcupadas = response.rows.reduce((sum, row) => sum + parseInt(row.camas_ocupadas), 0);
    const pacientesActuales = response.rows.reduce((sum, row) => sum + parseInt(row.pacientes_actuales), 0);
    
    return res.status(200).json({
      success: true,
      message: 'Estadísticas de servicios obtenidas correctamente',
      data: {
        servicios: response.rows,
        resumen: {
          total_servicios: totalServicios,
          servicios_activos: serviciosActivos,
          total_camas: totalCamas,
          camas_ocupadas: camasOcupadas,
          pacientes_actuales: pacientesActuales,
          ocupacion_general: totalCamas > 0 ? Math.round((camasOcupadas / totalCamas) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de servicios:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};