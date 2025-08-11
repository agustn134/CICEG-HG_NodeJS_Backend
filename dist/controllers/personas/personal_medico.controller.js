"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerfilMedicoConPacientes = exports.getEstadisticasPersonalMedico = exports.getPersonalMedicoActivo = exports.deletePersonalMedico = exports.updatePersonalMedico = exports.updateFotoPersonalMedico = exports.createPersonalMedico = exports.getPersonalMedicoById = exports.getPersonalMedico = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODO EL PERSONAL MÉDICO
// ==========================================
const getPersonalMedico = async (req, res) => {
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
        const params = [];
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
        const response = await database_1.default.query(query, params);
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
    }
    catch (error) {
        console.error('Error al obtener personal médico:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener personal médico',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getPersonalMedico = getPersonalMedico;
// ==========================================
// OBTENER PERSONAL MÉDICO POR ID
// ==========================================
const getPersonalMedicoById = async (req, res) => {
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
        const response = await database_1.default.query(query, [id]);
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
        const documentosResponse = await database_1.default.query(documentosQuery, [id]);
        const personalData = response.rows[0];
        personalData.ultimos_documentos = documentosResponse.rows;
        return res.status(200).json({
            success: true,
            message: 'Personal médico encontrado correctamente',
            data: personalData
        });
    }
    catch (error) {
        console.error('Error al obtener personal médico por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener personal médico',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getPersonalMedicoById = getPersonalMedicoById;
// ==========================================
// CREAR NUEVO PERSONAL MÉDICO
// ==========================================
// export const createPersonalMedico = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const {
//       id_persona,
//       numero_cedula,
//       especialidad,
//       cargo,
//       departamento,
//       activo = true,
//       foto
//     } = req.body;
//     // Validaciones básicas
//     if (!id_persona) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID de persona es obligatorio'
//       });
//     }
//     if (!numero_cedula || numero_cedula.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'El número de cédula es obligatorio'
//       });
//     }
//     if (!especialidad || especialidad.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'La especialidad es obligatoria'
//       });
//     }
//     // Verificar que la persona existe
//     const personaExisteQuery = `
//       SELECT id_persona 
//       FROM persona 
//       WHERE id_persona = $1
//     `;
//     const personaExisteResponse: QueryResult = await pool.query(personaExisteQuery, [id_persona]);
//     if (personaExisteResponse.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'La persona especificada no existe'
//       });
//     }
//     // Verificar que la persona no tenga ya un registro de personal médico
//     const yaExisteQuery = `
//       SELECT id_personal_medico 
//       FROM personal_medico 
//       WHERE id_persona = $1
//     `;
//     const yaExisteResponse: QueryResult = await pool.query(yaExisteQuery, [id_persona]);
//     if (yaExisteResponse.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: 'Esta persona ya tiene un registro como personal médico'
//       });
//     }
//     // Verificar que no exista otra persona con la misma cédula
//     const cedulaExisteQuery = `
//       SELECT id_personal_medico 
//       FROM personal_medico 
//       WHERE numero_cedula = $1
//     `;
//     const cedulaExisteResponse: QueryResult = await pool.query(cedulaExisteQuery, [numero_cedula.trim()]);
//     if (cedulaExisteResponse.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: 'Ya existe personal médico con ese número de cédula'
//       });
//     }
//     // Insertar nuevo personal médico
//     const insertQuery = `
//       INSERT INTO personal_medico (id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto)
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//       RETURNING *
//     `;
//     const response: QueryResult = await pool.query(insertQuery, [
//       id_persona,
//       numero_cedula.trim(),
//       especialidad.trim(),
//       cargo?.trim() || null,
//       departamento?.trim() || null,
//       activo,
//       foto || null
//     ]);
//     return res.status(201).json({
//       success: true,
//       message: 'Personal médico creado correctamente',
//       data: response.rows[0]
//     });
//   } catch (error) {
//     console.error('Error al crear personal médico:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al crear personal médico',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };
// ==========================================
// CREAR NUEVO PERSONAL MÉDICO CON CREDENCIALES
// ==========================================
const createPersonalMedico = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { 
        // Datos de persona
        persona, 
        // Datos de personal médico
        numero_cedula, especialidad, cargo, departamento, activo = true, foto, 
        // Credenciales de acceso
        usuario, password_texto } = req.body;
        console.log('🏥 Creando personal médico completo...', { nombre: persona?.nombre, usuario });
        // ==========================================
        // VALIDACIONES BÁSICAS
        // ==========================================
        if (!persona || !persona.nombre || !persona.apellido_paterno) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Los datos básicos de la persona son obligatorios (nombre, apellido paterno)'
            });
        }
        if (!numero_cedula || numero_cedula.trim() === '') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'El número de cédula es obligatorio'
            });
        }
        if (!especialidad || especialidad.trim() === '') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'La especialidad es obligatoria'
            });
        }
        if (!usuario || usuario.trim() === '') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'El usuario es obligatorio'
            });
        }
        if (!password_texto || password_texto.length < 6) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }
        // ==========================================
        // VERIFICAR DUPLICADOS
        // ==========================================
        // Verificar CURP duplicado
        if (persona.curp) {
            const curpExisteQuery = `SELECT id_persona FROM persona WHERE curp = $1`;
            const curpExisteResponse = await client.query(curpExisteQuery, [persona.curp]);
            if (curpExisteResponse.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una persona registrada con este CURP'
                });
            }
        }
        // Verificar cédula duplicada
        const cedulaExisteQuery = `SELECT id_personal_medico FROM personal_medico WHERE numero_cedula = $1`;
        const cedulaExisteResponse = await client.query(cedulaExisteQuery, [numero_cedula.trim()]);
        if (cedulaExisteResponse.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'Ya existe personal médico con ese número de cédula'
            });
        }
        // Verificar usuario duplicado
        const usuarioExisteQuery = `SELECT id_personal_medico FROM personal_medico WHERE usuario = $1`;
        const usuarioExisteResponse = await client.query(usuarioExisteQuery, [usuario.trim()]);
        if (usuarioExisteResponse.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'Ya existe un médico con ese nombre de usuario'
            });
        }
        // Verificar email duplicado si se proporciona
        if (persona.correo_electronico) {
            const emailExisteQuery = `SELECT id_persona FROM persona WHERE correo_electronico = $1`;
            const emailExisteResponse = await client.query(emailExisteQuery, [persona.correo_electronico]);
            if (emailExisteResponse.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una persona registrada con este correo electrónico'
                });
            }
        }
        // ==========================================
        // BUSCAR TIPO DE SANGRE ID
        // ==========================================
        let tipoSangreId = null;
        if (persona.tipo_sangre) {
            const tipoSangreQuery = `SELECT id_tipo_sangre FROM tipo_sangre WHERE nombre = $1`;
            const tipoSangreResponse = await client.query(tipoSangreQuery, [persona.tipo_sangre]);
            if (tipoSangreResponse.rows.length > 0) {
                tipoSangreId = tipoSangreResponse.rows[0].id_tipo_sangre;
            }
        }
        // ==========================================
        // INSERTAR PERSONA
        // ==========================================
        const insertPersonaQuery = `
      INSERT INTO persona (
        nombre, 
        apellido_paterno, 
        apellido_materno, 
        fecha_nacimiento, 
        sexo, 
        curp, 
        telefono, 
        correo_electronico, 
        domicilio, 
        estado_civil, 
        religion,
        tipo_sangre_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id_persona, nombre, apellido_paterno, apellido_materno
    `;
        const insertPersonaValues = [
            persona.nombre.trim(),
            persona.apellido_paterno.trim(),
            persona.apellido_materno?.trim() || null,
            persona.fecha_nacimiento,
            persona.sexo || 'M',
            persona.curp?.trim() || null,
            persona.telefono?.trim() || null,
            persona.correo_electronico?.trim() || null,
            persona.domicilio?.trim() || null,
            persona.estado_civil || null,
            persona.religion?.trim() || null,
            tipoSangreId
        ];
        const personaResponse = await client.query(insertPersonaQuery, insertPersonaValues);
        const nuevaPersona = personaResponse.rows[0];
        console.log('✅ Persona creada:', nuevaPersona);
        // ==========================================
        // INSERTAR PERSONAL MÉDICO CON CREDENCIALES
        // ==========================================
        const insertPersonalMedicoQuery = `
      INSERT INTO personal_medico (
        id_persona, 
        numero_cedula, 
        especialidad, 
        cargo, 
        departamento, 
        activo, 
        foto,
        usuario,
        password_texto,
        fecha_actualizacion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const insertPersonalMedicoValues = [
            nuevaPersona.id_persona,
            numero_cedula.trim(),
            especialidad.trim(),
            cargo?.trim() || null,
            departamento?.trim() || null,
            activo,
            foto || null,
            usuario.trim(),
            password_texto // Almacenamos en texto plano como en administrador
        ];
        const personalMedicoResponse = await client.query(insertPersonalMedicoQuery, insertPersonalMedicoValues);
        const nuevoPersonalMedico = personalMedicoResponse.rows[0];
        console.log('✅ Personal médico creado:', nuevoPersonalMedico);
        // ==========================================
        // COMMIT TRANSACCIÓN
        // ==========================================
        await client.query('COMMIT');
        // Combinar datos para respuesta
        const personalCompletoCreado = {
            ...nuevoPersonalMedico,
            nombre: nuevaPersona.nombre,
            apellido_paterno: nuevaPersona.apellido_paterno,
            apellido_materno: nuevaPersona.apellido_materno,
            nombre_completo: `${nuevaPersona.nombre} ${nuevaPersona.apellido_paterno} ${nuevaPersona.apellido_materno || ''}`.trim()
        };
        return res.status(201).json({
            success: true,
            message: `Personal médico Dr.(a) ${personalCompletoCreado.nombre_completo} creado exitosamente con credenciales de acceso`,
            data: {
                ...personalCompletoCreado,
                // No incluir la contraseña en la respuesta por seguridad
                password_texto: undefined,
                credenciales: {
                    usuario: nuevoPersonalMedico.usuario,
                    mensaje: 'Credenciales creadas correctamente'
                }
            }
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error al crear personal médico:', error);
        // 🔥 TYPE ASSERTION - SOLUCIÓN AL ERROR
        const pgError = error;
        // Manejo específico de errores de PostgreSQL
        if (pgError.code === '23505') { // Violation de unique constraint
            if (pgError.detail?.includes('curp')) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una persona registrada con este CURP'
                });
            }
            if (pgError.detail?.includes('numero_cedula')) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe personal médico con este número de cédula'
                });
            }
            if (pgError.detail?.includes('usuario')) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un médico con este nombre de usuario'
                });
            }
            if (pgError.detail?.includes('correo_electronico')) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una persona registrada con este correo electrónico'
                });
            }
        }
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear personal médico',
            error: process.env.NODE_ENV === 'development' ? {
                message: pgError.message,
                code: pgError.code,
                detail: pgError.detail
            } : undefined
        });
    }
    finally {
        client.release();
    }
};
exports.createPersonalMedico = createPersonalMedico;
// src/controllers/personas/personal_medico.controller.ts
// ==========================================
// ACTUALIZAR SOLO LA FOTO DEL PERSONAL MÉDICO
// ==========================================
const updateFotoPersonalMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const { foto } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar que el personal médico existe
        const existeQuery = `
      SELECT id_personal_medico 
      FROM personal_medico 
      WHERE id_personal_medico = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Personal médico no encontrado'
            });
        }
        // Actualizar solo la foto
        const updateQuery = `
      UPDATE personal_medico 
      SET foto = $1
      WHERE id_personal_medico = $2
      RETURNING foto
    `;
        const response = await database_1.default.query(updateQuery, [foto || null, id]);
        return res.status(200).json({
            success: true,
            message: foto ? 'Foto actualizada correctamente' : 'Foto eliminada correctamente',
            data: { foto: response.rows[0].foto }
        });
    }
    catch (error) {
        console.error('Error al actualizar foto:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar la foto',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateFotoPersonalMedico = updateFotoPersonalMedico;
// ==========================================
// ACTUALIZAR PERSONAL MÉDICO
// ==========================================
// export const updatePersonalMedico = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const {
//       numero_cedula,
//       especialidad,
//       cargo,
//       departamento,
//       activo,
//       foto
//     } = req.body;
//     if (!id || isNaN(parseInt(id))) {
//       return res.status(400).json({
//         success: false,
//         message: 'El ID debe ser un número válido'
//       });
//     }
//     // Validaciones básicas
//     if (!numero_cedula || numero_cedula.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'El número de cédula es obligatorio'
//       });
//     }
//     if (!especialidad || especialidad.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'La especialidad es obligatoria'
//       });
//     }
//     // Verificar que el personal médico existe
//     const existeQuery = `
//       SELECT id_personal_medico 
//       FROM personal_medico 
//       WHERE id_personal_medico = $1
//     `;
//     const existeResponse: QueryResult = await pool.query(existeQuery, [id]);
//     if (existeResponse.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Personal médico no encontrado'
//       });
//     }
//     // Verificar que no exista otro personal médico con la misma cédula
//     const duplicadoQuery = `
//       SELECT id_personal_medico 
//       FROM personal_medico 
//       WHERE numero_cedula = $1 AND id_personal_medico != $2
//     `;
//     const duplicadoResponse: QueryResult = await pool.query(duplicadoQuery, [numero_cedula.trim(), id]);
//     if (duplicadoResponse.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: 'Ya existe otro personal médico con ese número de cédula'
//       });
//     }
//     // Actualizar personal médico
//     const updateQuery = `
//       UPDATE personal_medico 
//       SET 
//         numero_cedula = $1,
//         especialidad = $2,
//         cargo = $3,
//         departamento = $4,
//         activo = $5,
//         foto = $6
//       WHERE id_personal_medico = $7
//       RETURNING *
//     `;
//     const response: QueryResult = await pool.query(updateQuery, [
//       numero_cedula.trim(),
//       especialidad.trim(),
//       cargo?.trim() || null,
//       departamento?.trim() || null,
//       activo,
//       foto || null,
//       id
//     ]);
//     return res.status(200).json({
//       success: true,
//       message: 'Personal médico actualizado correctamente',
//       data: response.rows[0]
//     });
//   } catch (error) {
//     console.error('Error al actualizar personal médico:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al actualizar personal médico',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };
// En personal_medico.controller.ts - REEMPLAZAR el método updatePersonalMedico
const updatePersonalMedico = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { 
        // Datos de personal médico
        numero_cedula, especialidad, cargo, departamento, activo, foto, 
        // Datos de persona
        persona } = req.body;
        if (!id || isNaN(parseInt(id))) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Validaciones básicas
        if (!numero_cedula || numero_cedula.trim() === '') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'El número de cédula es obligatorio'
            });
        }
        if (!especialidad || especialidad.trim() === '') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'La especialidad es obligatoria'
            });
        }
        // Verificar que el personal médico existe y obtener id_persona
        const existeQuery = `
      SELECT pm.id_personal_medico, pm.id_persona 
      FROM personal_medico pm
      WHERE pm.id_personal_medico = $1
    `;
        const existeResponse = await client.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Personal médico no encontrado'
            });
        }
        const { id_persona } = existeResponse.rows[0];
        // Verificar cédula duplicada
        const duplicadoQuery = `
      SELECT id_personal_medico 
      FROM personal_medico 
      WHERE numero_cedula = $1 AND id_personal_medico != $2
    `;
        const duplicadoResponse = await client.query(duplicadoQuery, [numero_cedula.trim(), id]);
        if (duplicadoResponse.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'Ya existe otro personal médico con ese número de cédula'
            });
        }
        // ==========================================
        // ACTUALIZAR DATOS DE PERSONA SI SE PROPORCIONAN
        // ==========================================
        if (persona) {
            // Buscar tipo de sangre ID si se proporciona
            let tipoSangreId = null;
            if (persona.tipo_sangre) {
                const tipoSangreQuery = `SELECT id_tipo_sangre FROM tipo_sangre WHERE nombre = $1`;
                const tipoSangreResponse = await client.query(tipoSangreQuery, [persona.tipo_sangre]);
                if (tipoSangreResponse.rows.length > 0) {
                    tipoSangreId = tipoSangreResponse.rows[0].id_tipo_sangre;
                }
            }
            const updatePersonaQuery = `
        UPDATE persona 
        SET 
          nombre = $1,
          apellido_paterno = $2,
          apellido_materno = $3,
          fecha_nacimiento = $4,
          sexo = $5,
          telefono = $6,
          correo_electronico = $7,
          curp = $8,
          tipo_sangre_id = $9
        WHERE id_persona = $10
      `;
            await client.query(updatePersonaQuery, [
                persona.nombre?.trim(),
                persona.apellido_paterno?.trim(),
                persona.apellido_materno?.trim() || null,
                persona.fecha_nacimiento,
                persona.sexo,
                persona.telefono?.trim() || null,
                persona.correo_electronico?.trim() || null,
                persona.curp?.trim() || null,
                tipoSangreId,
                id_persona
            ]);
        }
        // ==========================================
        // ACTUALIZAR DATOS DE PERSONAL MÉDICO
        // ==========================================
        const updatePersonalMedicoQuery = `
      UPDATE personal_medico 
      SET 
        numero_cedula = $1,
        especialidad = $2,
        cargo = $3,
        departamento = $4,
        activo = $5,
        foto = $6,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_personal_medico = $7
      RETURNING *
    `;
        const personalMedicoResponse = await client.query(updatePersonalMedicoQuery, [
            numero_cedula.trim(),
            especialidad.trim(),
            cargo?.trim() || null,
            departamento?.trim() || null,
            activo,
            foto || null,
            id
        ]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: 'Personal médico actualizado correctamente',
            data: personalMedicoResponse.rows[0]
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar personal médico:', error);
        const pgError = error;
        if (pgError.code === '23505') {
            if (pgError.detail?.includes('curp')) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una persona registrada con este CURP'
                });
            }
            if (pgError.detail?.includes('correo_electronico')) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una persona registrada con este correo electrónico'
                });
            }
        }
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar personal médico',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.updatePersonalMedico = updatePersonalMedico;
// ==========================================
// ELIMINAR PERSONAL MÉDICO
// ==========================================
const deletePersonalMedico = async (req, res) => {
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
        const existeResponse = await database_1.default.query(existeQuery, [id]);
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
        const usoResponse = await database_1.default.query(usoQuery, [id]);
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
        const response = await database_1.default.query(deleteQuery, [id]);
        const nombreCompleto = `${existeResponse.rows[0].nombre} ${existeResponse.rows[0].apellido_paterno} ${existeResponse.rows[0].apellido_materno}`;
        return res.status(200).json({
            success: true,
            message: `Personal médico "${nombreCompleto}" eliminado correctamente`
        });
    }
    catch (error) {
        console.error('Error al eliminar personal médico:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar personal médico',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.deletePersonalMedico = deletePersonalMedico;
// ==========================================
// OBTENER PERSONAL MÉDICO ACTIVO (PARA SELECTS)
// ==========================================
const getPersonalMedicoActivo = async (req, res) => {
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
        const params = [];
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
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Personal médico activo obtenido correctamente',
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al obtener personal médico activo:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener personal activo',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getPersonalMedicoActivo = getPersonalMedicoActivo;
// ==========================================
// OBTENER ESTADÍSTICAS DE PERSONAL MÉDICO
// ==========================================
const getEstadisticasPersonalMedico = async (req, res) => {
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
        const response = await database_1.default.query(query);
        // Estadísticas generales
        const resumenQuery = `
      SELECT 
        COUNT(*) as total_personal_registrado,
        COUNT(CASE WHEN activo = true THEN 1 END) as total_personal_activo,
        COUNT(DISTINCT especialidad) as total_especialidades,
        COUNT(DISTINCT departamento) as total_departamentos
      FROM personal_medico
    `;
        const resumenResponse = await database_1.default.query(resumenQuery);
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
        const productividadResponse = await database_1.default.query(productividadQuery);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de personal médico obtenidas correctamente',
            data: {
                por_especialidad_departamento: response.rows,
                mas_productivos: productividadResponse.rows,
                resumen: resumenResponse.rows[0]
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de personal médico:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasPersonalMedico = getEstadisticasPersonalMedico;
// ==========================================
// OBTENER PERFIL MÉDICO CON PACIENTES
// ==========================================
const getPerfilMedicoConPacientes = async (req, res) => {
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
        pm.foto, 
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_completo,
        COUNT(dc.id_documento) as total_documentos_creados,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as documentos_mes_actual
      FROM personal_medico pm
      JOIN persona p ON pm.id_persona = p.id_persona
      LEFT JOIN documento_clinico dc ON pm.id_personal_medico = dc.id_personal_creador
      WHERE pm.id_personal_medico = $1
      GROUP BY pm.id_personal_medico, pm.numero_cedula, pm.especialidad, pm.cargo, pm.departamento, pm.foto, p.nombre, p.apellido_paterno, p.apellido_materno
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
            database_1.default.query(medicoQuery, [id]),
            database_1.default.query(pacientesQuery, [id])
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
    }
    catch (error) {
        console.error('Error al obtener perfil médico:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getPerfilMedicoConPacientes = getPerfilMedicoConPacientes;
