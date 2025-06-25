"use strict";
// import { Request, Response } from 'express';
// import { QueryResult } from 'pg';
// import pool from '../../config/database';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstadisticasAlertas = exports.deleteAlertaSistema = exports.resolverAlertaSistema = exports.createAlertaSistema = exports.getAlertaSistemaById = exports.getAlertasSistema = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODAS LAS ALERTAS DEL SISTEMA
// ==========================================
const getAlertasSistema = async (req, res) => {
    try {
        const { tipo, activa, fecha_desde, fecha_hasta, prioridad } = req.query;
        let query = `
      SELECT 
        als.id_alerta,
        als.tipo_alerta,
        als.mensaje,
        als.descripcion,
        als.prioridad,
        als.fecha_generada,
        als.activa,
        als.usuario_responsable,
        als.fecha_resuelta,
        als.observaciones_resolucion,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_responsable
      FROM alertas_sistema als
      LEFT JOIN administrador a ON als.usuario_responsable = a.id_administrador
      LEFT JOIN persona p ON a.id_persona = p.id_persona
      WHERE 1=1
    `;
        const params = [];
        let paramCounter = 1;
        // Filtros
        if (tipo) {
            query += ` AND als.tipo_alerta = $${paramCounter}`;
            params.push(tipo);
            paramCounter++;
        }
        if (activa !== undefined) {
            query += ` AND als.activa = $${paramCounter}`;
            params.push(activa === 'true');
            paramCounter++;
        }
        if (prioridad) {
            query += ` AND als.prioridad = $${paramCounter}`;
            params.push(prioridad);
            paramCounter++;
        }
        if (fecha_desde) {
            query += ` AND als.fecha_generada >= $${paramCounter}`;
            params.push(fecha_desde);
            paramCounter++;
        }
        if (fecha_hasta) {
            query += ` AND als.fecha_generada <= $${paramCounter}`;
            params.push(fecha_hasta);
            paramCounter++;
        }
        query += `
      ORDER BY 
        CASE als.prioridad 
          WHEN 'Crítica' THEN 1 
          WHEN 'Alta' THEN 2 
          WHEN 'Media' THEN 3 
          WHEN 'Baja' THEN 4 
        END ASC,
        als.fecha_generada DESC
    `;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Alertas del sistema obtenidas correctamente',
            data: response.rows,
            total: response.rowCount,
            filtros_aplicados: {
                tipo: tipo || 'todos',
                activa: activa || 'todas',
                prioridad: prioridad || 'todas',
                fecha_desde: fecha_desde || null,
                fecha_hasta: fecha_hasta || null
            }
        });
    }
    catch (error) {
        console.error('Error al obtener alertas del sistema:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener alertas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAlertasSistema = getAlertasSistema;
// ==========================================
// OBTENER ALERTA POR ID
// ==========================================
const getAlertaSistemaById = async (req, res) => {
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
        als.id_alerta,
        als.tipo_alerta,
        als.mensaje,
        als.descripcion,
        als.prioridad,
        als.fecha_generada,
        als.activa,
        als.usuario_responsable,
        als.fecha_resuelta,
        als.observaciones_resolucion,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_responsable,
        a.usuario as usuario_responsable_username
      FROM alertas_sistema als
      LEFT JOIN administrador a ON als.usuario_responsable = a.id_administrador
      LEFT JOIN persona p ON a.id_persona = p.id_persona
      WHERE als.id_alerta = $1
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Alerta del sistema no encontrada'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Alerta del sistema encontrada correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al obtener alerta por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener alerta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAlertaSistemaById = getAlertaSistemaById;
// ==========================================
// CREAR NUEVA ALERTA DEL SISTEMA
// ==========================================
const createAlertaSistema = async (req, res) => {
    try {
        const { tipo_alerta, mensaje, descripcion, prioridad = 'Media', usuario_responsable, activa = true } = req.body;
        // Validaciones
        if (!tipo_alerta || tipo_alerta.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El tipo de alerta es obligatorio'
            });
        }
        if (!mensaje || mensaje.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El mensaje es obligatorio'
            });
        }
        // Validar tipos permitidos
        const tiposPermitidos = ['Seguridad', 'Sistema', 'Base de Datos', 'Expedientes', 'Medicamentos', 'Camas', 'Personal'];
        if (!tiposPermitidos.includes(tipo_alerta)) {
            return res.status(400).json({
                success: false,
                message: `El tipo de alerta debe ser uno de: ${tiposPermitidos.join(', ')}`
            });
        }
        // Validar prioridades permitidas
        const prioridadesPermitidas = ['Crítica', 'Alta', 'Media', 'Baja'];
        if (!prioridadesPermitidas.includes(prioridad)) {
            return res.status(400).json({
                success: false,
                message: `La prioridad debe ser una de: ${prioridadesPermitidas.join(', ')}`
            });
        }
        const insertQuery = `
      INSERT INTO alertas_sistema (tipo_alerta, mensaje, descripcion, prioridad, usuario_responsable, activa)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const response = await database_1.default.query(insertQuery, [
            tipo_alerta,
            mensaje.trim(),
            descripcion?.trim() || null,
            prioridad,
            usuario_responsable || null,
            activa
        ]);
        return res.status(201).json({
            success: true,
            message: 'Alerta del sistema creada correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear alerta del sistema:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear alerta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createAlertaSistema = createAlertaSistema;
// ==========================================
// RESOLVER ALERTA DEL SISTEMA
// ==========================================
const resolverAlertaSistema = async (req, res) => {
    try {
        const { id } = req.params;
        const { observaciones_resolucion, usuario_responsable } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar que la alerta existe y está activa
        const existeQuery = `
      SELECT id_alerta, activa 
      FROM alertas_sistema 
      WHERE id_alerta = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Alerta del sistema no encontrada'
            });
        }
        if (!existeResponse.rows[0].activa) {
            return res.status(400).json({
                success: false,
                message: 'La alerta ya ha sido resuelta'
            });
        }
        const updateQuery = `
      UPDATE alertas_sistema 
      SET 
        activa = false,
        fecha_resuelta = CURRENT_TIMESTAMP,
        observaciones_resolucion = $1,
        usuario_responsable = COALESCE($2, usuario_responsable)
      WHERE id_alerta = $3
      RETURNING *
    `;
        const response = await database_1.default.query(updateQuery, [
            observaciones_resolucion?.trim() || null,
            usuario_responsable || null,
            id
        ]);
        return res.status(200).json({
            success: true,
            message: 'Alerta del sistema resuelta correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al resolver alerta del sistema:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al resolver alerta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.resolverAlertaSistema = resolverAlertaSistema;
// ==========================================
// ELIMINAR ALERTA DEL SISTEMA
// ==========================================
const deleteAlertaSistema = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        const deleteQuery = `
      DELETE FROM alertas_sistema 
      WHERE id_alerta = $1 
      RETURNING tipo_alerta, mensaje
    `;
        const response = await database_1.default.query(deleteQuery, [id]);
        if (response.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Alerta del sistema no encontrada'
            });
        }
        return res.status(200).json({
            success: true,
            message: `Alerta "${response.rows[0].tipo_alerta}" eliminada correctamente`
        });
    }
    catch (error) {
        console.error('Error al eliminar alerta del sistema:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar alerta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.deleteAlertaSistema = deleteAlertaSistema;
// ==========================================
// OBTENER ESTADÍSTICAS DE ALERTAS
// ==========================================
const getEstadisticasAlertas = async (req, res) => {
    try {
        const query = `
      SELECT 
        tipo_alerta,
        prioridad,
        COUNT(*) as total_alertas,
        COUNT(CASE WHEN activa = true THEN 1 END) as alertas_activas,
        COUNT(CASE WHEN activa = false THEN 1 END) as alertas_resueltas,
        COUNT(CASE WHEN fecha_generada >= CURRENT_DATE - INTERVAL '24 hours' THEN 1 END) as alertas_ultimas_24h,
        COUNT(CASE WHEN fecha_generada >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as alertas_ultima_semana
      FROM alertas_sistema
      GROUP BY tipo_alerta, prioridad
      ORDER BY 
        CASE prioridad 
          WHEN 'Crítica' THEN 1 
          WHEN 'Alta' THEN 2 
          WHEN 'Media' THEN 3 
          WHEN 'Baja' THEN 4 
        END ASC,
        tipo_alerta ASC
    `;
        const response = await database_1.default.query(query);
        // Calcular estadísticas generales
        const resumenQuery = `
      SELECT 
        COUNT(*) as total_alertas_sistema,
        COUNT(CASE WHEN activa = true THEN 1 END) as total_activas,
        COUNT(CASE WHEN activa = false THEN 1 END) as total_resueltas,
        COUNT(CASE WHEN prioridad = 'Crítica' AND activa = true THEN 1 END) as criticas_activas,
        COUNT(CASE WHEN fecha_generada >= CURRENT_DATE - INTERVAL '24 hours' THEN 1 END) as nuevas_24h
      FROM alertas_sistema
    `;
        const resumenResponse = await database_1.default.query(resumenQuery);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de alertas del sistema obtenidas correctamente',
            data: {
                alertas_por_tipo_prioridad: response.rows,
                resumen: resumenResponse.rows[0]
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de alertas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasAlertas = getEstadisticasAlertas;
