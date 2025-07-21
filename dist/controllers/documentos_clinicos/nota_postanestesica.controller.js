"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTiposAnestesia = exports.getNotasPostanestesicaByExpediente = exports.deleteNotaPostanestesica = exports.updateNotaPostanestesica = exports.getNotaPostanestesicaById = exports.getAllNotasPostanestesica = exports.createNotaPostanestesica = exports.getNotasPostanestesica = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// FUNCIONES CRUD BÁSICAS
// ==========================================
const getNotasPostanestesica = async (req, res) => {
    try {
        const query = `
      SELECT 
        npa.*,
        dc.fecha_documento,
        p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
        e.numero_expediente,
        pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
        anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo
      FROM nota_postanestesica npa
      JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
      LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
      LEFT JOIN personal_medico anest_rel ON npa.id_anestesiologo = anest_rel.id_personal_medico
      LEFT JOIN persona anest ON anest_rel.id_persona = anest.id_persona
      ORDER BY dc.fecha_documento DESC
    `;
        const response = await database_1.default.query(query);
        return res.status(200).json({
            success: true,
            data: response.rows
        });
    }
    catch (error) {
        console.error('Error al obtener notas postanestésicas:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener notas postanestésicas",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNotasPostanestesica = getNotasPostanestesica;
// export const getNotaPostanestesicaById = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const query = `
//       SELECT 
//         npa.*,
//         dc.fecha_documento,
//         p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as nombre_paciente,
//         p.fecha_nacimiento,
//         e.numero_expediente,
//         pm.nombre || ' ' || pm.apellido_paterno as nombre_medico,
//         anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo,
//         anest_rel.numero_cedula as cedula_anestesiologo,
//         EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) as edad_anos
//       FROM nota_postanestesica npa
//       JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
//       JOIN expediente e ON dc.id_expediente = e.id_expediente
//       JOIN paciente pac ON e.id_paciente = pac.id_paciente
//       JOIN persona p ON pac.id_persona = p.id_persona
//       LEFT JOIN personal_medico pm_rel ON dc.id_medico = pm_rel.id_personal_medico
//       LEFT JOIN persona pm ON pm_rel.id_persona = pm.id_persona
//       LEFT JOIN personal_medico anest_rel ON npa.id_anestesiologo = anest_rel.id_personal_medico
//       LEFT JOIN persona anest ON anest_rel.id_persona = anest.id_persona
//       WHERE npa.id_nota_postanestesica = $1
//     `;
//     const response: QueryResult = await pool.query(query, [id]);
//     if (response.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Nota postanestésica no encontrada"
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       data: response.rows[0]
//     });
//   } catch (error) {
//     console.error('Error al obtener nota postanestésica por ID:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Error al obtener nota postanestésica",
//       error: error instanceof Error ? error.message : 'Error desconocido'
//     });
//   }
// };
// export const createNotaPostanestesica = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const {
//       id_documento,
//       tipo_anestesia,
//       duracion_anestesia,
//       medicamentos_utilizados,
//       estado_clinico_egreso,
//       incidentes_accidentes,
//       balance_hidrico,
//       liquidos_administrados,
//       sangrado,
//       hemoderivados_transfundidos,
//       plan_tratamiento,
//       pronostico,
//       id_anestesiologo,
//       // 🔥 NUEVOS CAMPOS (opcionales - no rompe nada si no vienen)
//       fecha_cirugia,
//       hora_inicio,
//       hora_termino,
//       quirofano,
//       procedimiento_realizado,
//       clasificacion_asa,
//       presion_arterial_egreso,
//       frecuencia_cardiaca_egreso,
//       frecuencia_respiratoria_egreso,
//       saturacion_oxigeno_egreso,
//       temperatura_egreso,
//       aldrete_actividad,
//       aldrete_respiracion,
//       aldrete_circulacion,
//       aldrete_conciencia,
//       aldrete_saturacion
//     }: NotaPostanestesica = req.body;
//     // Construir campos dinámicamente
//     const campos = ['id_documento'];
//     const valores = [id_documento];
//     const placeholders = ['$1'];
//     // Agregar campos si existen
//     if (tipo_anestesia) {
//       campos.push('tipo_anestesia');
//       valores.push(tipo_anestesia);
//       placeholders.push(`$${valores.length}`);
//     }
//     if (duracion_anestesia) {
//       campos.push('duracion_anestesia');
//       valores.push(duracion_anestesia);
//       placeholders.push(`$${valores.length}`);
//     }
//     const insertQuery = `
//       INSERT INTO nota_postanestesica (
//         id_documento, tipo_anestesia, duracion_anestesia, medicamentos_utilizados,
//         estado_clinico_egreso, incidentes_accidentes, balance_hidrico, liquidos_administrados,
//         sangrado, hemoderivados_transfundidos, plan_tratamiento, pronostico, id_anestesiologo
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
//       RETURNING *
//     `;
//     const response: QueryResult = await pool.query(insertQuery, [
//       id_documento, tipo_anestesia, duracion_anestesia, medicamentos_utilizados,
//       estado_clinico_egreso, incidentes_accidentes, balance_hidrico, liquidos_administrados,
//       sangrado, hemoderivados_transfundidos, plan_tratamiento, pronostico, id_anestesiologo
//     ]);
//     return res.status(201).json({
//       success: true,
//       message: "Nota postanestésica creada exitosamente",
//       data: response.rows[0]
//     });
//   } catch (error) {
//     console.error('Error al crear nota postanestésica:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Error al crear nota postanestésica",
//       error: error instanceof Error ? error.message : 'Error desconocido'
//     });
//   }
// };
const createNotaPostanestesica = async (req, res) => {
    try {
        const datos = req.body;
        // Validación básica
        if (!datos.id_documento) {
            return res.status(400).json({
                success: false,
                message: "id_documento es requerido"
            });
        }
        // 🔥 CONSTRUCCIÓN DINÁMICA DE QUERY (solo campos que vienen con datos)
        const campos = ['id_documento'];
        const valores = [datos.id_documento];
        const placeholders = ['$1'];
        // Mapeo de campos del frontend a la BD (si hay diferencias de nombres)
        const mapeosCampos = {
        // Si tienes nombres diferentes entre frontend y BD, agrega aquí
        // 'campo_frontend': 'campo_bd'
        };
        // Agregar campos dinámicamente si tienen valor
        Object.entries(datos).forEach(([key, value]) => {
            if (key !== 'id_documento' &&
                key !== 'id_nota_postanestesica' &&
                value !== undefined &&
                value !== null &&
                value !== '') {
                const nombreCampo = mapeosCampos[key] || key;
                campos.push(nombreCampo);
                valores.push(value);
                placeholders.push(`$${valores.length}`);
            }
        });
        // Query dinámico
        const insertQuery = `
      INSERT INTO nota_postanestesica (${campos.join(', ')}) 
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
        console.log('🔍 Query ejecutado:', insertQuery);
        console.log('🔍 Valores:', valores);
        const response = await database_1.default.query(insertQuery, valores);
        return res.status(201).json({
            success: true,
            message: "Nota postanestésica creada exitosamente",
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear nota postanestésica:', error);
        return res.status(500).json({
            success: false,
            message: "Error al crear nota postanestésica",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.createNotaPostanestesica = createNotaPostanestesica;
// 🔥 MÉTODO PARA OBTENER TODAS LAS NOTAS
const getAllNotasPostanestesica = async (req, res) => {
    try {
        const { page = 1, limit = 10, tipo_anestesia, anestesiologo } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = '';
        const valores = [];
        if (tipo_anestesia) {
            whereClause += ' WHERE npa.tipo_anestesia ILIKE $' + (valores.length + 1);
            valores.push(`%${tipo_anestesia}%`);
        }
        if (anestesiologo) {
            whereClause += (whereClause ? ' AND' : ' WHERE') + ' npa.id_anestesiologo = $' + (valores.length + 1);
            valores.push(anestesiologo);
        }
        const query = `
      SELECT 
        npa.*,
        dc.fecha_documento,
        dc.observaciones as observaciones_documento,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        CONCAT(pm.nombre, ' ', pm.apellido_paterno, ' ', pm.apellido_materno) as anestesiologo_nombre,
        pm.numero_cedula as cedula_anestesiologo
      FROM nota_postanestesica npa
      INNER JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pa ON e.id_paciente = pa.id_paciente
      INNER JOIN persona p ON pa.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON npa.id_anestesiologo = pm.id_personal_medico
      ${whereClause}
      ORDER BY dc.fecha_documento DESC
      LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}
    `;
        valores.push(Number(limit), offset);
        const response = await database_1.default.query(query, valores);
        // Contar total para paginación
        const countQuery = `
      SELECT COUNT(*) as total
      FROM nota_postanestesica npa
      INNER JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
      ${whereClause}
    `;
        const countResponse = await database_1.default.query(countQuery, valores.slice(0, -2) // Remover limit y offset
        );
        const total = parseInt(countResponse.rows[0].total);
        return res.status(200).json({
            success: true,
            data: response.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error al obtener notas postanestésicas:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener notas postanestésicas",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getAllNotasPostanestesica = getAllNotasPostanestesica;
// 🔥 MÉTODO PARA OBTENER POR ID
const getNotaPostanestesicaById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        npa.*,
        dc.fecha_documento,
        dc.observaciones as observaciones_documento,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        CONCAT(pm.nombre, ' ', pm.apellido_paterno, ' ', pm.apellido_materno) as anestesiologo_nombre,
        pm.numero_cedula as cedula_anestesiologo,
        pm.especialidad as especialidad_anestesiologo
      FROM nota_postanestesica npa
      INNER JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
      INNER JOIN expediente e ON dc.id_expediente = e.id_expediente
      INNER JOIN paciente pa ON e.id_paciente = pa.id_paciente
      INNER JOIN persona p ON pa.id_persona = p.id_persona
      LEFT JOIN personal_medico pm ON npa.id_anestesiologo = pm.id_personal_medico
      WHERE npa.id_nota_postanestesica = $1
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Nota postanestésica no encontrada"
            });
        }
        return res.status(200).json({
            success: true,
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al obtener nota postanestésica:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener nota postanestésica",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNotaPostanestesicaById = getNotaPostanestesicaById;
// 🔥 MÉTODO PARA ACTUALIZAR
const updateNotaPostanestesica = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Filtrar campos que no deben actualizarse
        const { id_nota_postanestesica, id_documento, ...datosActualizables } = updateData;
        const fields = Object.keys(datosActualizables).filter(key => datosActualizables[key] !== undefined);
        const values = fields.map(field => datosActualizables[field]);
        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No hay campos para actualizar"
            });
        }
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const updateQuery = `
      UPDATE nota_postanestesica 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id_nota_postanestesica = $1
      RETURNING *
    `;
        const response = await database_1.default.query(updateQuery, [id, ...values]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Nota postanestésica no encontrada"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Nota postanestésica actualizada exitosamente",
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al actualizar nota postanestésica:', error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar nota postanestésica",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.updateNotaPostanestesica = updateNotaPostanestesica;
// 🔥 MÉTODO PARA ELIMINAR (SOFT DELETE)
const deleteNotaPostanestesica = async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar si existe
        const checkQuery = 'SELECT id_nota_postanestesica FROM nota_postanestesica WHERE id_nota_postanestesica = $1';
        const checkResponse = await database_1.default.query(checkQuery, [id]);
        if (checkResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Nota postanestésica no encontrada"
            });
        }
        // Soft delete (marcarlo como eliminado en lugar de borrarlo)
        const deleteQuery = `
      UPDATE nota_postanestesica 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id_nota_postanestesica = $1 
      RETURNING id_nota_postanestesica
    `;
        await database_1.default.query(deleteQuery, [id]);
        return res.status(200).json({
            success: true,
            message: "Nota postanestésica eliminada exitosamente"
        });
    }
    catch (error) {
        console.error('Error al eliminar nota postanestésica:', error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar nota postanestésica",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.deleteNotaPostanestesica = deleteNotaPostanestesica;
// 🔥 MÉTODO ADICIONAL: OBTENER POR EXPEDIENTE
const getNotasPostanestesicaByExpediente = async (req, res) => {
    try {
        const { id_expediente } = req.params;
        const query = `
      SELECT 
        npa.*,
        dc.fecha_documento,
        CONCAT(pm.nombre, ' ', pm.apellido_paterno, ' ', pm.apellido_materno) as anestesiologo_nombre
      FROM nota_postanestesica npa
      INNER JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm ON npa.id_anestesiologo = pm.id_personal_medico
      WHERE dc.id_expediente = $1
      ORDER BY dc.fecha_documento DESC
    `;
        const response = await database_1.default.query(query, [id_expediente]);
        return res.status(200).json({
            success: true,
            data: response.rows
        });
    }
    catch (error) {
        console.error('Error al obtener notas por expediente:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener notas por expediente",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNotasPostanestesicaByExpediente = getNotasPostanestesicaByExpediente;
// export const updateNotaPostanestesica = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const updateData: Partial<NotaPostanestesica> = req.body;
//     const fields = Object.keys(updateData).filter(key => updateData[key as keyof NotaPostanestesica] !== undefined);
//     const values = fields.map(field => updateData[field as keyof NotaPostanestesica]);
//     if (fields.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No hay campos para actualizar"
//       });
//     }
//     const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
//     const updateQuery = `
//       UPDATE nota_postanestesica 
//       SET ${setClause}
//       WHERE id_nota_postanestesica = $1
//       RETURNING *
//     `;
//     const response: QueryResult = await pool.query(updateQuery, [id, ...values]);
//     if (response.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Nota postanestésica no encontrada"
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Nota postanestésica actualizada exitosamente",
//       data: response.rows[0]
//     });
//   } catch (error) {
//     console.error('Error al actualizar nota postanestésica:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Error al actualizar nota postanestésica",
//       error: error instanceof Error ? error.message : 'Error desconocido'
//     });
//   }
// };
// export const deleteNotaPostanestesica = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const response: QueryResult = await pool.query(
//       "DELETE FROM nota_postanestesica WHERE id_nota_postanestesica = $1 RETURNING *",
//       [id]
//     );
//     if (response.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Nota postanestésica no encontrada"
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Nota postanestésica eliminada exitosamente"
//     });
//   } catch (error) {
//     console.error('Error al eliminar nota postanestésica:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Error al eliminar nota postanestésica",
//       error: error instanceof Error ? error.message : 'Error desconocido'
//     });
//   }
// };
// // ==========================================
// // FUNCIONES ADICIONALES BÁSICAS
// // ==========================================
// export const getNotasPostanestesicaByExpediente = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id_expediente } = req.params;
//     const query = `
//       SELECT 
//         npa.*,
//         dc.fecha_documento,
//         anest.nombre || ' ' || anest.apellido_paterno as nombre_anestesiologo
//       FROM nota_postanestesica npa
//       JOIN documento_clinico dc ON npa.id_documento = dc.id_documento
//       LEFT JOIN personal_medico anest_rel ON npa.id_anestesiologo = anest_rel.id_personal_medico
//       LEFT JOIN persona anest ON anest_rel.id_persona = anest.id_persona
//       WHERE dc.id_expediente = $1
//       ORDER BY dc.fecha_documento DESC
//     `;
//     const response: QueryResult = await pool.query(query, [id_expediente]);
//     return res.status(200).json({
//       success: true,
//       data: response.rows
//     });
//   } catch (error) {
//     console.error('Error al obtener notas postanestésicas por expediente:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Error al obtener notas postanestésicas por expediente",
//       error: error instanceof Error ? error.message : 'Error desconocido'
//     });
//   }
// };
const getTiposAnestesia = async (req, res) => {
    try {
        const tipos = [
            { valor: 'General', descripcion: 'Anestesia general con intubación' },
            { valor: 'Regional', descripcion: 'Anestesia regional (epidural, raquídea)' },
            { valor: 'Local', descripcion: 'Anestesia local infiltrativa' },
            { valor: 'Sedación', descripcion: 'Sedación consciente' },
            { valor: 'Combinada', descripcion: 'Combinación de técnicas anestésicas' },
            { valor: 'MAC', descripcion: 'Monitoreo Anestésico Controlado' }
        ];
        return res.status(200).json({
            success: true,
            data: tipos
        });
    }
    catch (error) {
        console.error('Error al obtener tipos de anestesia:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener tipos de anestesia",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getTiposAnestesia = getTiposAnestesia;
