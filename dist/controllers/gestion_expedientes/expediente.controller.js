"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarReingresoExpediente = exports.generarReporteExpediente = exports.updateAlertaExpediente = exports.getAlertasExpediente = exports.getAuditoriaExpediente = exports.updateExpediente = exports.createExpediente = exports.getExpedienteById = exports.validarAccesoExpediente = exports.getDashboardExpedientes = exports.buscarExpedientes = exports.getExpedientesByPaciente = exports.deleteExpediente = exports.getExpedientes = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODOS LOS EXPEDIENTES
// ==========================================
// export const getExpedientes = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { 
//       estado, 
//       fecha_inicio, 
//       fecha_fin, 
//       paciente_id, 
//       tiene_internamiento_activo, 
//       buscar,
//       limit = 50,
//       offset = 0 
//     } = req.query;
//     let query = `
//       SELECT 
//         e.id_expediente,
//         e.numero_expediente,
//         e.fecha_apertura,
//         e.estado,
//         e.notas_administrativas,
//         -- Datos del paciente
//         pac.id_paciente,
//         CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
//         p.fecha_nacimiento,
//         p.sexo,
//         p.curp,
//         edad_en_anos(p.fecha_nacimiento) as edad,
//         ts.nombre as tipo_sangre,
//         -- Estadísticas del expediente
//         COUNT(dc.id_documento) as total_documentos,
//         COUNT(CASE WHEN dc.estado = 'Activo' THEN 1 END) as documentos_activos,
//         COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes_actual,
//         -- Internamientos
//         COUNT(i.id_internamiento) as total_internamientos,
//         COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as internamientos_activos,
//         MAX(i.fecha_ingreso) as ultimo_ingreso,
//         -- Servicio actual si hay internamiento activo
//         s.nombre as servicio_actual,
//         c.numero as cama_actual,
//         -- Médico responsable actual
//         CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable_actual
//       FROM expediente e
//       JOIN paciente pac ON e.id_paciente = pac.id_paciente
//       JOIN persona p ON pac.id_persona = p.id_persona
//       LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
//       LEFT JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
//       LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente
//       LEFT JOIN internamiento i_activo ON e.id_expediente = i_activo.id_expediente AND i_activo.fecha_egreso IS NULL
//       LEFT JOIN servicio s ON i_activo.id_servicio = s.id_servicio
//       LEFT JOIN cama c ON i_activo.id_cama = c.id_cama
//       LEFT JOIN personal_medico pm ON i_activo.id_medico_responsable = pm.id_personal_medico
//       LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
//       WHERE 1=1
//     `;
//     const params: any[] = [];
//     let paramCounter = 1;
//     // Filtros
//     if (estado) {
//       query += ` AND e.estado = $${paramCounter}`;
//       params.push(estado);
//       paramCounter++;
//     }
//     if (fecha_inicio) {
//       query += ` AND DATE(e.fecha_apertura) >= $${paramCounter}`;
//       params.push(fecha_inicio);
//       paramCounter++;
//     }
//     if (fecha_fin) {
//       query += ` AND DATE(e.fecha_apertura) <= $${paramCounter}`;
//       params.push(fecha_fin);
//       paramCounter++;
//     }
//     if (paciente_id) {
//       query += ` AND pac.id_paciente = $${paramCounter}`;
//       params.push(paciente_id);
//       paramCounter++;
//     }
//     if (buscar) {
//       query += ` AND (
//         UPPER(e.numero_expediente) LIKE UPPER($${paramCounter}) OR
//         UPPER(p.nombre) LIKE UPPER($${paramCounter}) OR 
//         UPPER(p.apellido_paterno) LIKE UPPER($${paramCounter}) OR 
//         UPPER(p.apellido_materno) LIKE UPPER($${paramCounter}) OR
//         UPPER(p.curp) LIKE UPPER($${paramCounter})
//       )`;
//       params.push(`%${buscar}%`);
//       paramCounter++;
//     }
//     query += `
//       GROUP BY e.id_expediente, e.numero_expediente, e.fecha_apertura, e.estado, 
//                e.notas_administrativas, pac.id_paciente, p.nombre, p.apellido_paterno, 
//                p.apellido_materno, p.fecha_nacimiento, p.sexo, p.curp, ts.nombre,
//                s.nombre, c.numero, pm_p.nombre, pm_p.apellido_paterno
//     `;
//     // Filtro por internamiento activo (aplicado después del GROUP BY)
//     if (tiene_internamiento_activo !== undefined) {
//       if (tiene_internamiento_activo === 'true') {
//         query += ` HAVING COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) > 0`;
//       } else {
//         query += ` HAVING COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) = 0`;
//       }
//     }
//     query += ` ORDER BY e.fecha_apertura DESC`;
//     // Paginación
//     query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
//     params.push(parseInt(limit as string), parseInt(offset as string));
//     const response: QueryResult = await pool.query(query, params);
//     // Contar total para paginación
//     let countQuery = `
//       SELECT COUNT(DISTINCT e.id_expediente) as total
//       FROM expediente e
//       JOIN paciente pac ON e.id_paciente = pac.id_paciente
//       JOIN persona p ON pac.id_persona = p.id_persona
//       WHERE 1=1
//     `;
//     const countParams = params.slice(0, -2); // Remover limit y offset
//     let countParamCounter = 1;
//     if (estado) {
//       countQuery += ` AND e.estado = $${countParamCounter}`;
//       countParamCounter++;
//     }
//     if (fecha_inicio) {
//       countQuery += ` AND DATE(e.fecha_apertura) >= $${countParamCounter}`;
//       countParamCounter++;
//     }
//     if (fecha_fin) {
//       countQuery += ` AND DATE(e.fecha_apertura) <= $${countParamCounter}`;
//       countParamCounter++;
//     }
//     if (paciente_id) {
//       countQuery += ` AND pac.id_paciente = $${countParamCounter}`;
//       countParamCounter++;
//     }
//     if (buscar) {
//       countQuery += ` AND (
//         UPPER(e.numero_expediente) LIKE UPPER($${countParamCounter}) OR
//         UPPER(p.nombre) LIKE UPPER($${countParamCounter}) OR 
//         UPPER(p.apellido_paterno) LIKE UPPER($${countParamCounter}) OR 
//         UPPER(p.apellido_materno) LIKE UPPER($${countParamCounter}) OR
//         UPPER(p.curp) LIKE UPPER($${countParamCounter})
//       )`;
//       countParamCounter++;
//     }
//     const countResponse: QueryResult = await pool.query(countQuery, countParams);
//     const totalRecords = parseInt(countResponse.rows[0].total);
//     return res.status(200).json({
//       success: true,
//       message: 'Expedientes obtenidos correctamente',
//       data: response.rows,
//       pagination: {
//         total: totalRecords,
//         limit: parseInt(limit as string),
//         offset: parseInt(offset as string),
//         pages: Math.ceil(totalRecords / parseInt(limit as string))
//       },
//       filtros_aplicados: {
//         estado: estado || 'todos',
//         fecha_inicio: fecha_inicio || null,
//         fecha_fin: fecha_fin || null,
//         paciente_id: paciente_id || null,
//         tiene_internamiento_activo: tiene_internamiento_activo || 'todos',
//         buscar: buscar || 'sin filtro'
//       }
//     });
//   } catch (error) {
//     console.error('Error al obtener expedientes:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al obtener expedientes',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   } finally {
//     client.release();
//   }
// };
// ==========================================
// OBTENER TODOS LOS EXPEDIENTES
// ==========================================
const getExpedientes = async (req, res) => {
    const client = await database_1.default.connect(); // Agregar esta línea
    try {
        const { estado, fecha_inicio, fecha_fin, paciente_id, tiene_internamiento_activo, buscar, limit = 50, offset = 0 } = req.query;
        let query = `
      SELECT 
        e.id_expediente,
        e.numero_expediente,
        e.fecha_apertura,
        e.estado,
        e.notas_administrativas,
        
        -- Datos del paciente
        pac.id_paciente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        edad_en_anos(p.fecha_nacimiento) as edad,
        ts.nombre as tipo_sangre,
        
        -- Estadísticas del expediente
        COUNT(dc.id_documento) as total_documentos,
        COUNT(CASE WHEN dc.estado = 'Activo' THEN 1 END) as documentos_activos,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes_actual,
        
        -- Internamientos
        COUNT(i.id_internamiento) as total_internamientos,
        COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as internamientos_activos,
        MAX(i.fecha_ingreso) as ultimo_ingreso,
        
        -- Servicio actual si hay internamiento activo
        s.nombre as servicio_actual,
        c.numero as cama_actual,
        
        -- Médico responsable actual
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable_actual
        
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente
      LEFT JOIN internamiento i_activo ON e.id_expediente = i_activo.id_expediente AND i_activo.fecha_egreso IS NULL
      LEFT JOIN servicio s ON i_activo.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i_activo.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON i_activo.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE 1=1
    `;
        const params = [];
        let paramCounter = 1;
        // Filtros
        if (estado) {
            query += ` AND e.estado = $${paramCounter}`;
            params.push(estado);
            paramCounter++;
        }
        if (fecha_inicio) {
            query += ` AND DATE(e.fecha_apertura) >= $${paramCounter}`;
            params.push(fecha_inicio);
            paramCounter++;
        }
        if (fecha_fin) {
            query += ` AND DATE(e.fecha_apertura) <= $${paramCounter}`;
            params.push(fecha_fin);
            paramCounter++;
        }
        if (paciente_id) {
            query += ` AND pac.id_paciente = $${paramCounter}`;
            params.push(paciente_id);
            paramCounter++;
        }
        if (buscar) {
            query += ` AND (
        UPPER(e.numero_expediente) LIKE UPPER($${paramCounter}) OR
        UPPER(p.nombre) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_materno) LIKE UPPER($${paramCounter}) OR
        UPPER(p.curp) LIKE UPPER($${paramCounter})
      )`;
            params.push(`%${buscar}%`);
            paramCounter++;
        }
        query += `
      GROUP BY e.id_expediente, e.numero_expediente, e.fecha_apertura, e.estado, 
               e.notas_administrativas, pac.id_paciente, p.nombre, p.apellido_paterno, 
               p.apellido_materno, p.fecha_nacimiento, p.sexo, p.curp, ts.nombre,
               s.nombre, c.numero, pm_p.nombre, pm_p.apellido_paterno
    `;
        // Filtro por internamiento activo (aplicado después del GROUP BY)
        if (tiene_internamiento_activo !== undefined) {
            if (tiene_internamiento_activo === 'true') {
                query += ` HAVING COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) > 0`;
            }
            else {
                query += ` HAVING COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) = 0`;
            }
        }
        query += ` ORDER BY e.fecha_apertura DESC`;
        // Paginación
        query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
        params.push(parseInt(limit), parseInt(offset));
        const response = await client.query(query, params); // Usar client en lugar de pool
        // Contar total para paginación
        let countQuery = `
      SELECT COUNT(DISTINCT e.id_expediente) as total
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE 1=1
    `;
        const countParams = params.slice(0, -2); // Remover limit y offset
        let countParamCounter = 1;
        if (estado) {
            countQuery += ` AND e.estado = $${countParamCounter}`;
            countParamCounter++;
        }
        if (fecha_inicio) {
            countQuery += ` AND DATE(e.fecha_apertura) >= $${countParamCounter}`;
            countParamCounter++;
        }
        if (fecha_fin) {
            countQuery += ` AND DATE(e.fecha_apertura) <= $${countParamCounter}`;
            countParamCounter++;
        }
        if (paciente_id) {
            countQuery += ` AND pac.id_paciente = $${countParamCounter}`;
            countParamCounter++;
        }
        if (buscar) {
            countQuery += ` AND (
        UPPER(e.numero_expediente) LIKE UPPER($${countParamCounter}) OR
        UPPER(p.nombre) LIKE UPPER($${countParamCounter}) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($${countParamCounter}) OR 
        UPPER(p.apellido_materno) LIKE UPPER($${countParamCounter}) OR
        UPPER(p.curp) LIKE UPPER($${countParamCounter})
      )`;
            countParamCounter++;
        }
        const countResponse = await client.query(countQuery, countParams); // Usar client en lugar de pool
        const totalRecords = parseInt(countResponse.rows[0].total);
        return res.status(200).json({
            success: true,
            message: 'Expedientes obtenidos correctamente',
            data: response.rows,
            pagination: {
                total: totalRecords,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(totalRecords / parseInt(limit))
            },
            filtros_aplicados: {
                estado: estado || 'todos',
                fecha_inicio: fecha_inicio || null,
                fecha_fin: fecha_fin || null,
                paciente_id: paciente_id || null,
                tiene_internamiento_activo: tiene_internamiento_activo || 'todos',
                buscar: buscar || 'sin filtro'
            }
        });
    }
    catch (error) {
        console.error('Error al obtener expedientes:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener expedientes',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.getExpedientes = getExpedientes;
// ==========================================
// ELIMINAR EXPEDIENTE (SOFT DELETE)
// ==========================================
const deleteExpediente = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { force = false, id_medico_eliminador, motivo_eliminacion } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar si el expediente existe
        const existeQuery = `
      SELECT 
        e.*,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE e.id_expediente = $1
    `;
        const existeResponse = await client.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Expediente no encontrado'
            });
        }
        const expediente = existeResponse.rows[0];
        // Verificar si el expediente está siendo usado
        const usoQuery = `
      SELECT 
        COUNT(dc.id_documento) as total_documentos,
        COUNT(i.id_internamiento) as total_internamientos,
        COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as internamientos_activos
      FROM expediente e
      LEFT JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente
      WHERE e.id_expediente = $1
      GROUP BY e.id_expediente
    `;
        const usoResponse = await client.query(usoQuery, [id]);
        const uso = usoResponse.rows[0] || { total_documentos: 0, total_internamientos: 0, internamientos_activos: 0 };
        const totalDocumentos = parseInt(uso.total_documentos);
        const totalInternamientos = parseInt(uso.total_internamientos);
        const internamientosActivos = parseInt(uso.internamientos_activos);
        // No permitir eliminación si hay internamientos activos
        if (internamientosActivos > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'No se puede eliminar el expediente. Tiene internamientos activos',
                details: {
                    internamientos_activos: internamientosActivos
                }
            });
        }
        // Si hay documentos o internamientos y no es forzado, hacer soft delete
        if ((totalDocumentos > 0 || totalInternamientos > 0) && force !== true) {
            const updateQuery = `
        UPDATE expediente 
        SET 
          estado = 'Eliminado',
          notas_administrativas = CONCAT(
            COALESCE(notas_administrativas, ''), 
            E'\n[ELIMINADO] ', 
            CURRENT_TIMESTAMP::TEXT, 
            ' - Motivo: ', 
            COALESCE($2, 'No especificado')
          )
        WHERE id_expediente = $1
        RETURNING *
      `;
            const response = await client.query(updateQuery, [id, motivo_eliminacion]);
            // Registrar auditoría
            await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
                id,
                id_medico_eliminador || null,
                'eliminacion_logica',
                JSON.stringify({ estado_anterior: expediente.estado }),
                JSON.stringify({ estado_nuevo: 'Eliminado', motivo: motivo_eliminacion }),
                `Expediente marcado como eliminado para ${expediente.nombre_paciente}`
            ]);
            await client.query('COMMIT');
            return res.status(200).json({
                success: true,
                message: `Expediente "${expediente.numero_expediente}" marcado como eliminado`,
                data: response.rows[0],
                details: {
                    tipo_eliminacion: 'logica',
                    documentos_preservados: totalDocumentos,
                    internamientos_preservados: totalInternamientos
                }
            });
        }
        // Eliminación física (solo si force = true y no hay datos críticos)
        if (force === true) {
            await client.query('DELETE FROM expediente WHERE id_expediente = $1', [id]);
            await client.query('COMMIT');
            return res.status(200).json({
                success: true,
                message: `Expediente "${expediente.numero_expediente}" eliminado permanentemente`,
                details: {
                    tipo_eliminacion: 'fisica',
                    paciente_afectado: expediente.nombre_paciente
                }
            });
        }
        // Si no hay documentos ni internamientos, eliminación directa
        await client.query('DELETE FROM expediente WHERE id_expediente = $1', [id]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: `Expediente "${expediente.numero_expediente}" eliminado correctamente`
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar expediente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar expediente',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.deleteExpediente = deleteExpediente;
// ==========================================
// OBTENER EXPEDIENTES POR PACIENTE
// ==========================================
const getExpedientesByPaciente = async (req, res) => {
    try {
        const { id_paciente } = req.params;
        const { incluir_eliminados = false } = req.query;
        if (!id_paciente || isNaN(parseInt(id_paciente))) {
            return res.status(400).json({
                success: false,
                message: 'El ID del paciente debe ser un número válido'
            });
        }
        // Verificar que el paciente existe
        const pacienteExisteQuery = `
      SELECT pac.id_paciente, CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE pac.id_paciente = $1
    `;
        const pacienteExisteResponse = await database_1.default.query(pacienteExisteQuery, [id_paciente]);
        if (pacienteExisteResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Paciente no encontrado'
            });
        }
        let query = `
      SELECT 
        e.id_expediente,
        e.numero_expediente,
        e.fecha_apertura,
        e.estado,
        e.notas_administrativas,
        COUNT(dc.id_documento) as total_documentos,
        COUNT(i.id_internamiento) as total_internamientos,
        COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as internamientos_activos,
        MAX(dc.fecha_elaboracion) as ultima_actividad,
        MAX(i.fecha_ingreso) as ultimo_ingreso
      FROM expediente e
      LEFT JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente
      WHERE e.id_paciente = $1
    `;
        if (incluir_eliminados !== 'true') {
            query += ` AND e.estado != 'Eliminado'`;
        }
        query += `
      GROUP BY e.id_expediente, e.numero_expediente, e.fecha_apertura, e.estado, e.notas_administrativas
      ORDER BY e.fecha_apertura DESC
    `;
        const response = await database_1.default.query(query, [id_paciente]);
        return res.status(200).json({
            success: true,
            message: 'Expedientes del paciente obtenidos correctamente',
            data: {
                paciente: pacienteExisteResponse.rows[0],
                expedientes: response.rows,
                total_expedientes: response.rowCount
            }
        });
    }
    catch (error) {
        console.error('Error al obtener expedientes por paciente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener expedientes del paciente',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getExpedientesByPaciente = getExpedientesByPaciente;
// ==========================================
// BUSCAR EXPEDIENTES (PARA AUTOCOMPLETE)
// ==========================================
const buscarExpedientes = async (req, res) => {
    try {
        const { q, activos_solo = true } = req.query;
        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'La búsqueda debe tener al menos 2 caracteres'
            });
        }
        let query = `
      SELECT 
        e.id_expediente,
        e.numero_expediente,
        e.fecha_apertura,
        e.estado,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        p.curp,
        edad_en_anos(p.fecha_nacimiento) as edad,
        p.sexo,
        COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as internamiento_activo
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente
      WHERE (
        UPPER(e.numero_expediente) LIKE UPPER($1) OR
        UPPER(p.nombre) LIKE UPPER($1) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($1) OR 
        UPPER(p.apellido_materno) LIKE UPPER($1) OR
        UPPER(p.curp) LIKE UPPER($1)
      )
    `;
        if (activos_solo === 'true') {
            query += ` AND e.estado = 'Activo'`;
        }
        query += `
      GROUP BY e.id_expediente, e.numero_expediente, e.fecha_apertura, e.estado, 
               p.nombre, p.apellido_paterno, p.apellido_materno, p.curp, p.fecha_nacimiento, p.sexo
      ORDER BY e.fecha_apertura DESC
      LIMIT 20
    `;
        const response = await database_1.default.query(query, [`%${q}%`]);
        return res.status(200).json({
            success: true,
            message: `${response.rowCount} expediente(s) encontrado(s)`,
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al buscar expedientes:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al buscar expedientes',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.buscarExpedientes = buscarExpedientes;
// ==========================================
// OBTENER DASHBOARD DE EXPEDIENTES
// ==========================================
const getDashboardExpedientes = async (req, res) => {
    try {
        // Estadísticas generales
        const estadisticasQuery = `
      SELECT 
        COUNT(*) as total_expedientes,
        COUNT(CASE WHEN estado = 'Activo' THEN 1 END) as expedientes_activos,
        COUNT(CASE WHEN estado = 'Cerrado' THEN 1 END) as expedientes_cerrados,
        COUNT(CASE WHEN estado = 'Archivado' THEN 1 END) as expedientes_archivados,
        COUNT(CASE WHEN fecha_apertura >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as expedientes_mes_actual,
        COUNT(CASE WHEN fecha_apertura >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as expedientes_semana_actual
      FROM expediente
      WHERE estado != 'Eliminado'
    `;
        const estadisticasResponse = await database_1.default.query(estadisticasQuery);
        // Expedientes con internamiento activo
        const internamientosActivosQuery = `
      SELECT 
        e.id_expediente,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        i.fecha_ingreso,
        s.nombre as servicio,
        c.numero as cama,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable,
        EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - i.fecha_ingreso)) as dias_estancia
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      JOIN internamiento i ON e.id_expediente = i.id_expediente
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE i.fecha_egreso IS NULL AND e.estado = 'Activo'
      ORDER BY i.fecha_ingreso ASC
    `;
        const internamientosActivosResponse = await database_1.default.query(internamientosActivosQuery);
        // Expedientes más activos (con más documentos recientes)
        const masActivosQuery = `
      SELECT 
        e.id_expediente,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        COUNT(dc.id_documento) as total_documentos,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as documentos_semana,
        MAX(dc.fecha_elaboracion) as ultima_actividad
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      WHERE e.estado = 'Activo'
      GROUP BY e.id_expediente, e.numero_expediente, p.nombre, p.apellido_paterno, p.apellido_materno
      HAVING COUNT(dc.id_documento) > 0
      ORDER BY documentos_semana DESC, total_documentos DESC
      LIMIT 10
    `;
        const masActivosResponse = await database_1.default.query(masActivosQuery);
        // Alertas del sistema relacionadas con expedientes
        const alertasQuery = `
      SELECT 
        als.tipo_alerta,
        als.mensaje,
        als.fecha_alerta,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente
      FROM alertas_sistema als
      LEFT JOIN expediente e ON als.id_expediente = e.id_expediente
      LEFT JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN persona p ON pac.id_persona = p.id_persona
      WHERE als.estado = 'ACTIVA'
      ORDER BY als.fecha_alerta DESC
      LIMIT 5
    `;
        const alertasResponse = await database_1.default.query(alertasQuery);
        return res.status(200).json({
            success: true,
            message: 'Dashboard de expedientes obtenido correctamente',
            data: {
                estadisticas: estadisticasResponse.rows[0],
                expedientes_con_internamiento_activo: internamientosActivosResponse.rows,
                expedientes_mas_activos: masActivosResponse.rows,
                alertas_activas: alertasResponse.rows
            }
        });
    }
    catch (error) {
        console.error('Error al obtener dashboard de expedientes:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener dashboard',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getDashboardExpedientes = getDashboardExpedientes;
// ==========================================
// VALIDAR ACCESO A EXPEDIENTE (REINGRESO)
// ==========================================
// export const validarAccesoExpediente = async (req: Request, res: Response): Promise<Response> => {
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
//     const { id } = req.params;
//     const { id_medico, justificacion_acceso } = req.body;
//     if (!id || isNaN(parseInt(id))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID del expediente debe ser un número válido'
//       });
//     }
//     if (!id_medico) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID del médico es obligatorio'
//       });
//     }
//     // Verificar si requiere validación
//     const validacionQuery = `
//       SELECT validar_reingreso_paciente($1, $2) as requiere_validacion
//     `;
//     const validacionResponse: QueryResult = await client.query(validacionQuery, [id, id_medico]);
//     const requiereValidacion = validacionResponse.rows[0]?.requiere_validacion || false;
//     if (requiereValidacion) {
//       // Crear registro de validación de reingreso
//       const validacionReingresoQuery = `
//         INSERT INTO validacion_reingreso (
//           id_expediente,
//           id_medico_validador,
//           solicita_acceso_historico,
//           justificacion_acceso,
//           validacion_completa
//         )
//         VALUES ($1, $2, true, $3, false)
//         RETURNING id_validacion
//       `;
//       const validacionReingresoResponse: QueryResult = await client.query(validacionReingresoQuery, [
//         id,
//         id_medico,
//         justificacion_acceso || 'Acceso solicitado para reingreso'
//       ]);
//       // Generar alerta para supervisor
//       const alertaQuery = `
//         INSERT INTO alertas_sistema (
//           tipo_alerta,
//           mensaje,
//           id_expediente,
//           id_medico,
//           estado
//         )
//         VALUES (
//           'ADVERTENCIA',
//           'Solicitud de acceso a datos históricos para reingreso de paciente',
//           $1,
//           $2,
//           'ACTIVA'
//         )
//       `;
//       await client.query(alertaQuery, [id, id_medico]);
//       await client.query('COMMIT');
//       return res.status(200).json({
//         success: true,
//         message: 'Validación de reingreso iniciada. Se requiere aprobación de supervisor',
//         data: {
//           requiere_validacion: true,
//           id_validacion: validacionReingresoResponse.rows[0].id_validacion,
//           acceso_inmediato: false
//         }
//       });
//     }
//     // Registrar acceso normal
//     await client.query(
//       `SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`,
//       [
//         id,
//         id_medico,
//         'consulta',
//         null,
//         null,
//         'Acceso normal al expediente'
//       ]
//     );
//     await client.query('COMMIT');
//     return res.status(200).json({
//       success: true,
//       message: 'Acceso al expediente autorizado',
//       data: {
//         requiere_validacion: false,
//         acceso_inmediato: true
//       }
//     });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error('Error al validar acceso a expediente:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al validar acceso',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   } finally {
//     client.release();
//   }
// };.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };
// ==========================================
// VALIDAR ACCESO A EXPEDIENTE (REINGRESO)
// ==========================================
const validarAccesoExpediente = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { id_medico, justificacion_acceso } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID del expediente debe ser un número válido'
            });
        }
        if (!id_medico) {
            return res.status(400).json({
                success: false,
                message: 'El ID del médico es obligatorio'
            });
        }
        // Verificar si requiere validación
        const validacionQuery = `
      SELECT validar_reingreso_paciente($1, $2) as requiere_validacion
    `;
        const validacionResponse = await client.query(validacionQuery, [id, id_medico]);
        const requiereValidacion = validacionResponse.rows[0]?.requiere_validacion || false;
        if (requiereValidacion) {
            // Crear registro de validación de reingreso
            const validacionReingresoQuery = `
        INSERT INTO validacion_reingreso (
          id_expediente,
          id_medico_validador,
          solicita_acceso_historico,
          justificacion_acceso,
          validacion_completa
        )
        VALUES ($1, $2, true, $3, false)
        RETURNING id_validacion
      `;
            const validacionReingresoResponse = await client.query(validacionReingresoQuery, [
                id,
                id_medico,
                justificacion_acceso || 'Acceso solicitado para reingreso'
            ]);
            // Generar alerta para supervisor
            const alertaQuery = `
        INSERT INTO alertas_sistema (
          tipo_alerta,
          mensaje,
          id_expediente,
          id_medico,
          estado
        )
        VALUES (
          'ADVERTENCIA',
          'Solicitud de acceso a datos históricos para reingreso de paciente',
          $1,
          $2,
          'ACTIVA'
        )
      `;
            await client.query(alertaQuery, [id, id_medico]);
            await client.query('COMMIT');
            return res.status(200).json({
                success: true,
                message: 'Validación de reingreso iniciada. Se requiere aprobación de supervisor',
                data: {
                    requiere_validacion: true,
                    id_validacion: validacionReingresoResponse.rows[0].id_validacion,
                    acceso_inmediato: false
                }
            });
        }
        // Registrar acceso normal
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            id,
            id_medico,
            'consulta',
            null,
            null,
            'Acceso normal al expediente'
        ]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: 'Acceso al expediente autorizado',
            data: {
                requiere_validacion: false,
                acceso_inmediato: true
            }
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al validar acceso a expediente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al validar acceso',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.validarAccesoExpediente = validarAccesoExpediente;
// ==========================================
// OBTENER EXPEDIENTE POR ID (VISTA COMPLETA)
// ==========================================
const getExpedienteById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Obtener datos principales del expediente
        const expedienteQuery = `
      SELECT 
        e.id_expediente,
        e.numero_expediente,
        e.fecha_apertura,
        e.estado,
        e.notas_administrativas,
        
        -- Datos del paciente
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
        
        -- Datos de la persona
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
        edad_en_anos(p.fecha_nacimiento) as edad,
        
        -- Estadísticas del expediente
        COUNT(dc.id_documento) as total_documentos,
        COUNT(CASE WHEN dc.estado = 'Activo' THEN 1 END) as documentos_activos,
        COUNT(i.id_internamiento) as total_internamientos,
        COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as internamientos_activos
        
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
      LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente
      WHERE e.id_expediente = $1
      GROUP BY e.id_expediente, e.numero_expediente, e.fecha_apertura, e.estado, 
               e.notas_administrativas, pac.id_paciente, pac.alergias, pac.transfusiones,
               pac.detalles_transfusiones, pac.familiar_responsable, pac.parentesco_familiar,
               pac.telefono_familiar, pac.ocupacion, pac.escolaridad, pac.lugar_nacimiento,
               p.id_persona, p.nombre, p.apellido_paterno, p.apellido_materno, 
               p.fecha_nacimiento, p.sexo, p.curp, p.telefono, p.correo_electronico, 
               p.domicilio, p.estado_civil, p.religion, ts.nombre
    `;
        const expedienteResponse = await database_1.default.query(expedienteQuery, [id]);
        if (expedienteResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expediente no encontrado'
            });
        }
        // Obtener documentos clínicos del expediente
        const documentosQuery = `
      SELECT 
        dc.id_documento,
        dc.fecha_elaboracion,
        dc.estado,
        td.nombre as tipo_documento,
        td.descripcion as descripcion_tipo_documento,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_creador,
        pm.especialidad as especialidad_medico,
        
        -- Determinar si hay contenido específico
        CASE 
          WHEN hc.id_historia_clinica IS NOT NULL THEN 'Historia Clínica'
          WHEN nu.id_nota_urgencias IS NOT NULL THEN 'Nota de Urgencias'
          WHEN ne.id_nota_evolucion IS NOT NULL THEN 'Nota de Evolución'
          WHEN ni.id_nota_interconsulta IS NOT NULL THEN 'Nota de Interconsulta'
          WHEN sv.id_signos_vitales IS NOT NULL THEN 'Signos Vitales'
          ELSE 'Otro Documento'
        END as subtipo_documento
        
      FROM documento_clinico dc
      JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      LEFT JOIN historia_clinica hc ON dc.id_documento = hc.id_documento
      LEFT JOIN nota_urgencias nu ON dc.id_documento = nu.id_documento
      LEFT JOIN nota_evolucion ne ON dc.id_documento = ne.id_documento
      LEFT JOIN nota_interconsulta ni ON dc.id_documento = ni.id_documento
      LEFT JOIN signos_vitales sv ON dc.id_documento = sv.id_documento
      WHERE dc.id_expediente = $1
      ORDER BY dc.fecha_elaboracion DESC
    `;
        const documentosResponse = await database_1.default.query(documentosQuery, [id]);
        // Obtener internamientos
        const internamientosQuery = `
      SELECT 
        i.id_internamiento,
        i.fecha_ingreso,
        i.fecha_egreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        i.diagnostico_egreso,
        i.tipo_egreso,
        i.observaciones,
        s.nombre as servicio,
        c.numero as cama,
        c.area as area_cama,
        c.subarea as subarea_cama,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable,
        pm.especialidad as especialidad_medico,
        
        -- Calcular días de estancia
        CASE 
          WHEN i.fecha_egreso IS NOT NULL THEN 
            EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso))
          ELSE 
            EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - i.fecha_ingreso))
        END as dias_estancia
        
      FROM internamiento i
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE i.id_expediente = $1
      ORDER BY i.fecha_ingreso DESC
    `;
        const internamientosResponse = await database_1.default.query(internamientosQuery, [id]);
        // Obtener últimos signos vitales
        const signosVitalesQuery = `
      SELECT 
        sv.id_signos_vitales,
        sv.fecha_toma,
        sv.temperatura,
        sv.presion_arterial_sistolica,
        sv.presion_arterial_diastolica,
        sv.frecuencia_cardiaca,
        sv.frecuencia_respiratoria,
        sv.saturacion_oxigeno,
        sv.glucosa,
        sv.peso,
        sv.talla,
        sv.imc,
        sv.observaciones
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      WHERE dc.id_expediente = $1
      ORDER BY sv.fecha_toma DESC
      LIMIT 5
    `;
        const signosVitalesResponse = await database_1.default.query(signosVitalesQuery, [id]);
        // Verificar si necesita validación de reingreso
        const validacionReingresoQuery = `
      SELECT validar_reingreso_paciente($1, $2) as requiere_validacion
    `;
        // Usar un médico ficticio para la validación (el médico real se pasaría desde el frontend)
        const validacionResponse = await database_1.default.query(validacionReingresoQuery, [id, 1]);
        const expedienteData = expedienteResponse.rows[0];
        expedienteData.documentos_clinicos = documentosResponse.rows;
        expedienteData.internamientos = internamientosResponse.rows;
        expedienteData.ultimos_signos_vitales = signosVitalesResponse.rows;
        expedienteData.requiere_validacion_reingreso = validacionResponse.rows[0]?.requiere_validacion || false;
        return res.status(200).json({
            success: true,
            message: 'Expediente encontrado correctamente',
            data: expedienteData
        });
    }
    catch (error) {
        console.error('Error al obtener expediente por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener expediente',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getExpedienteById = getExpedienteById;
// ==========================================
// CREAR NUEVO EXPEDIENTE
// ==========================================
const createExpediente = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id_paciente, numero_expediente, estado = 'Activo', notas_administrativas, crear_historia_clinica = false, id_medico_creador } = req.body;
        // Validaciones básicas
        if (!id_paciente) {
            return res.status(400).json({
                success: false,
                message: 'El ID del paciente es obligatorio'
            });
        }
        // Verificar que el paciente existe
        const pacienteExisteQuery = `
      SELECT pac.id_paciente, p.nombre, p.apellido_paterno, p.apellido_materno
      FROM paciente pac
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE pac.id_paciente = $1
    `;
        const pacienteExisteResponse = await client.query(pacienteExisteQuery, [id_paciente]);
        if (pacienteExisteResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'El paciente especificado no existe'
            });
        }
        // Generar número de expediente si no se proporciona
        let numeroExpedienteFinal = numero_expediente;
        if (!numeroExpedienteFinal) {
            const year = new Date().getFullYear();
            const lastExpedienteQuery = `
        SELECT numero_expediente 
        FROM expediente 
        WHERE numero_expediente LIKE '${year}%'
        ORDER BY numero_expediente DESC 
        LIMIT 1
      `;
            const lastExpedienteResponse = await client.query(lastExpedienteQuery);
            if (lastExpedienteResponse.rows.length > 0) {
                const lastNumber = parseInt(lastExpedienteResponse.rows[0].numero_expediente.substring(4));
                numeroExpedienteFinal = `${year}${String(lastNumber + 1).padStart(6, '0')}`;
            }
            else {
                numeroExpedienteFinal = `${year}000001`;
            }
        }
        // Verificar que el número de expediente no esté duplicado
        const existeExpedienteQuery = `
      SELECT id_expediente 
      FROM expediente 
      WHERE numero_expediente = $1
    `;
        const existeExpedienteResponse = await client.query(existeExpedienteQuery, [numeroExpedienteFinal]);
        if (existeExpedienteResponse.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'Ya existe un expediente con ese número'
            });
        }
        // Insertar nuevo expediente
        const insertExpedienteQuery = `
      INSERT INTO expediente (id_paciente, numero_expediente, estado, notas_administrativas)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const expedienteResponse = await client.query(insertExpedienteQuery, [
            id_paciente,
            numeroExpedienteFinal,
            estado,
            notas_administrativas?.trim() || null
        ]);
        const nuevoExpediente = expedienteResponse.rows[0];
        // Crear historia clínica inicial si se solicita
        if (crear_historia_clinica && id_medico_creador) {
            // Verificar que el médico existe
            const medicoExisteQuery = `
        SELECT id_personal_medico 
        FROM personal_medico 
        WHERE id_personal_medico = $1 AND activo = true
      `;
            const medicoExisteResponse = await client.query(medicoExisteQuery, [id_medico_creador]);
            if (medicoExisteResponse.rows.length > 0) {
                // Obtener ID del tipo de documento "Historia Clínica"
                const tipoDocumentoQuery = `
          SELECT id_tipo_documento 
          FROM tipo_documento 
          WHERE nombre = 'Historia Clínica' AND activo = true
        `;
                const tipoDocumentoResponse = await client.query(tipoDocumentoQuery);
                if (tipoDocumentoResponse.rows.length > 0) {
                    // Crear documento clínico
                    const insertDocumentoQuery = `
            INSERT INTO documento_clinico (
              id_expediente, 
              id_tipo_documento, 
              id_personal_creador,
              fecha_elaboracion,
              estado
            )
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'Borrador')
            RETURNING id_documento
          `;
                    const documentoResponse = await client.query(insertDocumentoQuery, [
                        nuevoExpediente.id_expediente,
                        tipoDocumentoResponse.rows[0].id_tipo_documento,
                        id_medico_creador
                    ]);
                    // Crear historia clínica básica
                    const insertHistoriaQuery = `
            INSERT INTO historia_clinica (id_documento)
            VALUES ($1)
            RETURNING id_historia_clinica
          `;
                    const historiaResponse = await client.query(insertHistoriaQuery, [
                        documentoResponse.rows[0].id_documento
                    ]);
                    nuevoExpediente.historia_clinica_creada = true;
                    nuevoExpediente.id_documento_historia = documentoResponse.rows[0].id_documento;
                    nuevoExpediente.id_historia_clinica = historiaResponse.rows[0].id_historia_clinica;
                }
            }
        }
        // Registrar auditoría
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            nuevoExpediente.id_expediente,
            id_medico_creador || null,
            'nuevo_expediente',
            null,
            JSON.stringify({
                numero_expediente: numeroExpedienteFinal,
                id_paciente: id_paciente,
                estado: estado
            }),
            `Expediente creado para ${pacienteExisteResponse.rows[0].nombre} ${pacienteExisteResponse.rows[0].apellido_paterno}`
        ]);
        await client.query('COMMIT');
        return res.status(201).json({
            success: true,
            message: 'Expediente creado correctamente',
            data: nuevoExpediente
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear expediente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear expediente',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.createExpediente = createExpediente;
// ==========================================
// ACTUALIZAR EXPEDIENTE
// ==========================================
const updateExpediente = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { estado, notas_administrativas, id_medico_modificador } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Obtener datos actuales del expediente
        const expedienteActualQuery = `
      SELECT 
        e.*,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE e.id_expediente = $1
    `;
        const expedienteActualResponse = await client.query(expedienteActualQuery, [id]);
        if (expedienteActualResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Expediente no encontrado'
            });
        }
        const expedienteActual = expedienteActualResponse.rows[0];
        // Validar cambio de estado
        if (estado && estado !== expedienteActual.estado) {
            const estadosPermitidos = ['Activo', 'Cerrado', 'Archivado', 'Suspendido'];
            if (!estadosPermitidos.includes(estado)) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: `El estado debe ser uno de: ${estadosPermitidos.join(', ')}`
                });
            }
            // Verificar si se puede cerrar el expediente
            if (estado === 'Cerrado') {
                const internamientosActivosQuery = `
          SELECT COUNT(*) as activos
          FROM internamiento
          WHERE id_expediente = $1 AND fecha_egreso IS NULL
        `;
                const internamientosActivosResponse = await client.query(internamientosActivosQuery, [id]);
                const internamientosActivos = parseInt(internamientosActivosResponse.rows[0].activos);
                if (internamientosActivos > 0) {
                    await client.query('ROLLBACK');
                    return res.status(409).json({
                        success: false,
                        message: 'No se puede cerrar el expediente. Tiene internamientos activos'
                    });
                }
            }
        }
        // Actualizar expediente
        const updateQuery = `
      UPDATE expediente 
      SET 
        estado = COALESCE($1, estado),
        notas_administrativas = COALESCE($2, notas_administrativas)
      WHERE id_expediente = $3
      RETURNING *
    `;
        const response = await client.query(updateQuery, [
            estado || null,
            notas_administrativas?.trim() || null,
            id
        ]);
        // Registrar auditoría
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            id,
            id_medico_modificador || null,
            'actualizacion',
            JSON.stringify({
                estado_anterior: expedienteActual.estado,
                notas_anteriores: expedienteActual.notas_administrativas
            }),
            JSON.stringify({
                estado_nuevo: estado || expedienteActual.estado,
                notas_nuevas: notas_administrativas || expedienteActual.notas_administrativas
            }),
            `Expediente actualizado para ${expedienteActual.nombre_paciente}`
        ]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: 'Expediente actualizado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar expediente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar expediente',
            // error: process,
            // src/controllers/gestion_expedientes/expediente.controller.ts (continuación)
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.updateExpediente = updateExpediente;
// ==========================================
// OBTENER HISTORIAL DE AUDITORÍA DEL EXPEDIENTE
// ==========================================
const getAuditoriaExpediente = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_fin, tipo_accion, id_medico, limit = 50, offset = 0 } = req.query;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID del expediente debe ser un número válido'
            });
        }
        // Verificar que el expediente existe
        const expedienteExisteQuery = `
      SELECT 
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE e.id_expediente = $1
    `;
        const expedienteExisteResponse = await database_1.default.query(expedienteExisteQuery, [id]);
        if (expedienteExisteResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expediente no encontrado'
            });
        }
        let query = `
      SELECT 
        ea.id_auditoria,
        ea.fecha_acceso,
        ea.accion,
        ea.datos_anteriores,
        ea.datos_nuevos,
        ea.ip_acceso,
        ea.navegador,
        ea.tiempo_sesion,
        ea.observaciones,
        CONCAT(p.nombre, ' ', p.apellido_paterno) as medico_nombre,
        pm.especialidad,
        pm.numero_cedula
      FROM expediente_auditoria ea
      LEFT JOIN personal_medico pm ON ea.id_medico = pm.id_personal_medico
      LEFT JOIN persona p ON pm.id_persona = p.id_persona
      WHERE ea.id_expediente = $1
    `;
        const params = [id];
        let paramCounter = 2;
        // Filtros
        if (fecha_inicio) {
            query += ` AND DATE(ea.fecha_acceso) >= $${paramCounter}`;
            params.push(fecha_inicio);
            paramCounter++;
        }
        if (fecha_fin) {
            query += ` AND DATE(ea.fecha_acceso) <= $${paramCounter}`;
            params.push(fecha_fin);
            paramCounter++;
        }
        if (tipo_accion) {
            query += ` AND ea.accion = $${paramCounter}`;
            params.push(tipo_accion);
            paramCounter++;
        }
        if (id_medico) {
            query += ` AND ea.id_medico = $${paramCounter}`;
            params.push(id_medico);
            paramCounter++;
        }
        query += ` ORDER BY ea.fecha_acceso DESC`;
        // Paginación
        query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
        params.push(parseInt(limit), parseInt(offset));
        const response = await database_1.default.query(query, params);
        // Contar total para paginación
        let countQuery = `
      SELECT COUNT(*) as total
      FROM expediente_auditoria ea
      WHERE ea.id_expediente = $1
    `;
        const countParams = params.slice(0, -2); // Remover limit y offset
        const countResponse = await database_1.default.query(countQuery, countParams);
        const totalRecords = parseInt(countResponse.rows[0].total);
        return res.status(200).json({
            success: true,
            message: 'Historial de auditoría obtenido correctamente',
            data: {
                expediente: expedienteExisteResponse.rows[0],
                auditorias: response.rows,
                pagination: {
                    total: totalRecords,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    pages: Math.ceil(totalRecords / parseInt(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener auditoría del expediente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener auditoría',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAuditoriaExpediente = getAuditoriaExpediente;
// ==========================================
// OBTENER ALERTAS DEL EXPEDIENTE
// ==========================================
const getAlertasExpediente = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_alerta = 'todas', tipo_alerta } = req.query;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID del expediente debe ser un número válido'
            });
        }
        let query = `
      SELECT 
        als.id_alerta,
        als.tipo_alerta,
        als.mensaje,
        als.fecha_alerta,
        als.estado,
        als.fecha_revision,
        als.acciones_tomadas,
        CONCAT(p.nombre, ' ', p.apellido_paterno) as medico_generador,
        CONCAT(pr.nombre, ' ', pr.apellido_paterno) as medico_revisor
      FROM alertas_sistema als
      LEFT JOIN personal_medico pm ON als.id_medico = pm.id_personal_medico
      LEFT JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN personal_medico pmr ON als.id_medico_revisor = pmr.id_personal_medico
      LEFT JOIN persona pr ON pmr.id_persona = pr.id_persona
      WHERE als.id_expediente = $1
    `;
        const params = [id];
        let paramCounter = 2;
        // Filtros
        if (estado_alerta !== 'todas') {
            query += ` AND als.estado = $${paramCounter}`;
            params.push(estado_alerta);
            paramCounter++;
        }
        if (tipo_alerta) {
            query += ` AND als.tipo_alerta = $${paramCounter}`;
            params.push(tipo_alerta);
            paramCounter++;
        }
        query += ` ORDER BY als.fecha_alerta DESC`;
        const response = await database_1.default.query(query, params);
        // Agrupar alertas por tipo
        const alertasPorTipo = {
            CRITICA: response.rows.filter((a) => a.tipo_alerta === 'CRITICA'),
            ADVERTENCIA: response.rows.filter((a) => a.tipo_alerta === 'ADVERTENCIA'),
            INFORMATIVA: response.rows.filter((a) => a.tipo_alerta === 'INFORMATIVA')
        };
        return res.status(200).json({
            success: true,
            message: 'Alertas del expediente obtenidas correctamente',
            data: {
                todas: response.rows,
                por_tipo: alertasPorTipo,
                resumen: {
                    total: response.rowCount,
                    activas: response.rows.filter((a) => a.estado === 'ACTIVA').length,
                    revisadas: response.rows.filter((a) => a.estado === 'REVISADA').length,
                    cerradas: response.rows.filter((a) => a.estado === 'CERRADA').length
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener alertas del expediente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener alertas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getAlertasExpediente = getAlertasExpediente;
// ==========================================
// ACTUALIZAR ALERTA DEL EXPEDIENTE
// ==========================================
const updateAlertaExpediente = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id, id_alerta } = req.params;
        const { estado, acciones_tomadas, id_medico_revisor } = req.body;
        if (!id || isNaN(parseInt(id)) || !id_alerta || isNaN(parseInt(id_alerta))) {
            return res.status(400).json({
                success: false,
                message: 'Los IDs deben ser números válidos'
            });
        }
        // Verificar que la alerta pertenece al expediente
        const alertaExisteQuery = `
      SELECT * FROM alertas_sistema 
      WHERE id_alerta = $1 AND id_expediente = $2
    `;
        const alertaExisteResponse = await client.query(alertaExisteQuery, [id_alerta, id]);
        if (alertaExisteResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Alerta no encontrada para este expediente'
            });
        }
        // Actualizar alerta
        const updateQuery = `
      UPDATE alertas_sistema 
      SET 
        estado = COALESCE($1, estado),
        acciones_tomadas = COALESCE($2, acciones_tomadas),
        id_medico_revisor = COALESCE($3, id_medico_revisor),
        fecha_revision = CASE 
          WHEN $1 IN ('REVISADA', 'CERRADA') THEN CURRENT_TIMESTAMP 
          ELSE fecha_revision 
        END
      WHERE id_alerta = $4
      RETURNING *
    `;
        const response = await client.query(updateQuery, [
            estado,
            acciones_tomadas,
            id_medico_revisor,
            id_alerta
        ]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: 'Alerta actualizada correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar alerta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar alerta',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.updateAlertaExpediente = updateAlertaExpediente;
// ==========================================
// GENERAR REPORTE DEL EXPEDIENTE
// ==========================================
const generarReporteExpediente = async (req, res) => {
    try {
        const { id } = req.params;
        const { incluir_documentos = true, incluir_internamientos = true } = req.query;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID del expediente debe ser un número válido'
            });
        }
        // Obtener datos completos del expediente
        const expedienteQuery = `
      SELECT 
        e.*,
        pac.*,
        p.*,
        ts.nombre as tipo_sangre_nombre,
        
        -- Contadores
        (SELECT COUNT(*) FROM documento_clinico WHERE id_expediente = e.id_expediente) as total_documentos,
        (SELECT COUNT(*) FROM internamiento WHERE id_expediente = e.id_expediente) as total_internamientos,
        (SELECT COUNT(*) FROM solicitud_estudio se 
         JOIN documento_clinico dc ON se.id_documento = dc.id_documento 
         WHERE dc.id_expediente = e.id_expediente) as total_estudios,
        (SELECT COUNT(*) FROM prescripcion_medicamento pm 
         JOIN documento_clinico dc ON pm.id_documento = dc.id_documento 
         WHERE dc.id_expediente = e.id_expediente) as total_prescripciones
         
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      WHERE e.id_expediente = $1
    `;
        const expedienteResponse = await database_1.default.query(expedienteQuery, [id]);
        if (expedienteResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expediente no encontrado'
            });
        }
        const reporte = {
            expediente: expedienteResponse.rows[0],
            generado_en: new Date(),
            incluye: {
                documentos: incluir_documentos === 'true',
                internamientos: incluir_internamientos === 'true'
            }
        };
        // Incluir documentos si se solicita
        if (incluir_documentos === 'true') {
            const documentosQuery = `
        SELECT 
          dc.*,
          td.nombre as tipo_documento_nombre,
          CONCAT(p.nombre, ' ', p.apellido_paterno) as medico_creador
        FROM documento_clinico dc
        JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
        LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
        LEFT JOIN persona p ON pm.id_persona = p.id_persona
        WHERE dc.id_expediente = $1
        ORDER BY dc.fecha_elaboracion DESC
      `;
            const documentosResponse = await database_1.default.query(documentosQuery, [id]);
            reporte.documentos = documentosResponse.rows;
        }
        // Incluir internamientos si se solicita
        if (incluir_internamientos === 'true') {
            const internamientosQuery = `
        SELECT 
          i.*,
          s.nombre as servicio_nombre,
          c.numero as cama_numero,
          CONCAT(p.nombre, ' ', p.apellido_paterno) as medico_responsable_nombre,
          CASE 
            WHEN i.fecha_egreso IS NOT NULL THEN 
              EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso))
            ELSE 
              EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - i.fecha_ingreso))
          END as dias_estancia
        FROM internamiento i
        LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
        LEFT JOIN cama c ON i.id_cama = c.id_cama
        LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
        LEFT JOIN persona p ON pm.id_persona = p.id_persona
        WHERE i.id_expediente = $1
        ORDER BY i.fecha_ingreso DESC
      `;
            const internamientosResponse = await database_1.default.query(internamientosQuery, [id]);
            reporte.internamientos = internamientosResponse.rows;
        }
        return res.status(200).json({
            success: true,
            message: 'Reporte del expediente generado correctamente',
            data: reporte
        });
    }
    catch (error) {
        console.error('Error al generar reporte del expediente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al generar reporte',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.generarReporteExpediente = generarReporteExpediente;
// ==========================================
// VALIDAR REINGRESO DEL EXPEDIENTE
// ==========================================
const validarReingresoExpediente = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { id_medico_validador, peso_actual, talla_actual, presion_arterial_sistolica, presion_arterial_diastolica, temperatura, alergias_confirmadas, medicamentos_actuales, contacto_emergencia_actual, observaciones_validacion } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID del expediente debe ser un número válido'
            });
        }
        // Validar campos obligatorios
        const camposObligatorios = {
            id_medico_validador,
            peso_actual,
            talla_actual,
            presion_arterial_sistolica,
            presion_arterial_diastolica,
            temperatura,
            alergias_confirmadas,
            medicamentos_actuales,
            contacto_emergencia_actual
        };
        const camposFaltantes = Object.entries(camposObligatorios)
            .filter(([_, valor]) => !valor)
            .map(([campo, _]) => campo);
        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios',
                campos_faltantes: camposFaltantes
            });
        }
        // Obtener internamiento activo
        const internamientoQuery = `
      SELECT id_internamiento 
      FROM internamiento 
      WHERE id_expediente = $1 AND fecha_egreso IS NULL
      ORDER BY fecha_ingreso DESC
      LIMIT 1
    `;
        const internamientoResponse = await client.query(internamientoQuery, [id]);
        if (internamientoResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'No hay internamiento activo para este expediente'
            });
        }
        // Crear validación de reingreso
        const insertValidacionQuery = `
      INSERT INTO validacion_reingreso (
        id_expediente,
        id_internamiento,
        id_medico_validador,
        peso_actual,
        talla_actual,
        presion_arterial_sistolica,
        presion_arterial_diastolica,
        temperatura,
        alergias_confirmadas,
        medicamentos_actuales,
        contacto_emergencia_actual,
        observaciones_validacion,
        validacion_completa,
        acceso_historico_aprobado,
        fecha_aprobacion_acceso
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, true, CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const validacionResponse = await client.query(insertValidacionQuery, [
            id,
            internamientoResponse.rows[0].id_internamiento,
            id_medico_validador,
            peso_actual,
            talla_actual,
            presion_arterial_sistolica,
            presion_arterial_diastolica,
            temperatura,
            alergias_confirmadas,
            medicamentos_actuales,
            contacto_emergencia_actual,
            observaciones_validacion || null
        ]);
        // Desbloquear acceso histórico
        const updateControlQuery = `
      UPDATE control_acceso_historico 
      SET 
        datos_bloqueados = false,
        fecha_desbloqueo = CURRENT_TIMESTAMP
      WHERE id_expediente = $1 AND id_medico = $2
    `;
        await client.query(updateControlQuery, [id, id_medico_validador]);
        // Registrar auditoría
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            id,
            id_medico_validador,
            'validacion_reingreso',
            null,
            JSON.stringify({
                validacion_completa: true,
                datos_actualizados: {
                    peso: peso_actual,
                    talla: talla_actual,
                    alergias: alergias_confirmadas,
                    medicamentos: medicamentos_actuales
                }
            }),
            'Validación de reingreso completada exitosamente'
        ]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: 'Validación de reingreso completada exitosamente',
            data: {
                validacion: validacionResponse.rows[0],
                acceso_historico_habilitado: true
            }
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al validar reingreso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al validar reingreso',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.validarReingresoExpediente = validarReingresoExpediente;
// ==========================================
// EXPORTACIONES
// ==========================================
exports.default = {
    getExpedientes: exports.getExpedientes,
    getExpedienteById: exports.getExpedienteById,
    createExpediente: exports.createExpediente,
    updateExpediente: exports.updateExpediente,
    deleteExpediente: exports.deleteExpediente,
    getExpedientesByPaciente: exports.getExpedientesByPaciente,
    buscarExpedientes: exports.buscarExpedientes,
    getDashboardExpedientes: exports.getDashboardExpedientes,
    validarAccesoExpediente: exports.validarAccesoExpediente,
    getAuditoriaExpediente: exports.getAuditoriaExpediente,
    getAlertasExpediente: exports.getAlertasExpediente,
    updateAlertaExpediente: exports.updateAlertaExpediente,
    generarReporteExpediente: exports.generarReporteExpediente,
    validarReingresoExpediente: exports.validarReingresoExpediente
};
