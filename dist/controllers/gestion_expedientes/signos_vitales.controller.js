"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignosVitalesByPacienteId = exports.getGraficaSignosVitales = exports.getHistorialSignosVitales = exports.getUltimosSignosVitalesPaciente = exports.deleteSignosVitales = exports.updateSignosVitales = exports.createSignosVitales = exports.getSignosVitalesById = exports.getSignosVitales = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODOS LOS SIGNOS VITALES
// ==========================================
const getSignosVitales = async (req, res) => {
    try {
        const { id_expediente, id_internamiento, id_documento, fecha_inicio, fecha_fin, incluir_anormales = false, limit = 50, offset = 0 } = req.query;
        let query = `
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
        sv.observaciones,
        -- Datos del documento
        dc.id_documento,
        dc.fecha_elaboracion,
        dc.estado as estado_documento,
        -- Datos del expediente y paciente
        e.id_expediente,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        p.fecha_nacimiento,
        edad_en_anos(p.fecha_nacimiento) as edad,
        p.sexo,
        -- Datos del internamiento si existe
        i.id_internamiento,
        i.fecha_ingreso,
        s.nombre as servicio,
        c.numero as cama,
        -- Personal que registró
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as registrado_por,
        pm.especialidad as especialidad_medico,
        -- Indicadores de valores anormales
        CASE 
          WHEN sv.temperatura < 36 OR sv.temperatura > 37.5 THEN true
          ELSE false
        END as temperatura_anormal,
        CASE 
          WHEN sv.presion_arterial_sistolica > 140 OR sv.presion_arterial_diastolica > 90 THEN true
          WHEN sv.presion_arterial_sistolica < 90 OR sv.presion_arterial_diastolica < 60 THEN true
          ELSE false
        END as presion_anormal,
        CASE 
          WHEN sv.frecuencia_cardiaca < 60 OR sv.frecuencia_cardiaca > 100 THEN true
          ELSE false
        END as fc_anormal,
        CASE 
          WHEN sv.saturacion_oxigeno < 95 THEN true
          ELSE false
        END as saturacion_anormal
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE 1=1
    `;
        const params = [];
        let paramCounter = 1;
        // Filtros
        if (id_expediente) {
            query += ` AND e.id_expediente = $${paramCounter}`;
            params.push(id_expediente);
            paramCounter++;
        }
        if (id_internamiento) {
            query += ` AND i.id_internamiento = $${paramCounter}`;
            params.push(id_internamiento);
            paramCounter++;
        }
        if (id_documento) {
            query += ` AND dc.id_documento = $${paramCounter}`;
            params.push(id_documento);
            paramCounter++;
        }
        if (fecha_inicio) {
            query += ` AND sv.fecha_toma >= $${paramCounter}`;
            params.push(fecha_inicio);
            paramCounter++;
        }
        if (fecha_fin) {
            query += ` AND sv.fecha_toma <= $${paramCounter}`;
            params.push(fecha_fin);
            paramCounter++;
        }
        // Filtro para incluir solo valores anormales
        if (incluir_anormales === 'true') {
            query += ` AND (
        sv.temperatura < 36 OR sv.temperatura > 37.5 OR
        sv.presion_arterial_sistolica > 140 OR sv.presion_arterial_diastolica > 90 OR
        sv.presion_arterial_sistolica < 90 OR sv.presion_arterial_diastolica < 60 OR
        sv.frecuencia_cardiaca < 60 OR sv.frecuencia_cardiaca > 100 OR
        sv.saturacion_oxigeno < 95
      )`;
        }
        query += ` ORDER BY sv.fecha_toma DESC`;
        // Paginación
        query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
        params.push(parseInt(limit), parseInt(offset));
        const response = await database_1.default.query(query, params);
        // Contar total para paginación
        let countQuery = `
      SELECT COUNT(*) as total
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      WHERE 1=1
    `;
        const countParams = params.slice(0, -2); // Remover limit y offset
        // Aplicar los mismos filtros para el conteo
        let countParamCounter = 1;
        if (id_expediente) {
            countQuery += ` AND e.id_expediente = $${countParamCounter}`;
            countParamCounter++;
        }
        if (id_internamiento) {
            countQuery += ` AND i.id_internamiento = $${countParamCounter}`;
            countParamCounter++;
        }
        if (id_documento) {
            countQuery += ` AND dc.id_documento = $${countParamCounter}`;
            countParamCounter++;
        }
        if (fecha_inicio) {
            countQuery += ` AND sv.fecha_toma >= $${countParamCounter}`;
            countParamCounter++;
        }
        if (fecha_fin) {
            countQuery += ` AND sv.fecha_toma <= $${countParamCounter}`;
            countParamCounter++;
        }
        if (incluir_anormales === 'true') {
            countQuery += ` AND (
        sv.temperatura < 36 OR sv.temperatura > 37.5 OR
        sv.presion_arterial_sistolica > 140 OR sv.presion_arterial_diastolica > 90 OR
        sv.presion_arterial_sistolica < 90 OR sv.presion_arterial_diastolica < 60 OR
        sv.frecuencia_cardiaca < 60 OR sv.frecuencia_cardiaca > 100 OR
        sv.saturacion_oxigeno < 95
      )`;
        }
        const countResponse = await database_1.default.query(countQuery, countParams);
        const totalRecords = parseInt(countResponse.rows[0].total);
        res.status(200).json({
            success: true,
            message: 'Signos vitales obtenidos correctamente',
            data: response.rows,
            pagination: {
                total: totalRecords,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(totalRecords / parseInt(limit))
            },
            filtros_aplicados: {
                id_expediente: id_expediente || null,
                id_internamiento: id_internamiento || null,
                id_documento: id_documento || null,
                fecha_inicio: fecha_inicio || null,
                fecha_fin: fecha_fin || null,
                incluir_anormales: incluir_anormales
            }
        });
    }
    catch (error) {
        console.error('Error al obtener signos vitales:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener signos vitales',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getSignosVitales = getSignosVitales;
// ==========================================
// OBTENER SIGNOS VITALES POR ID
// ==========================================
const getSignosVitalesById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        const query = `
      SELECT 
        sv.*,
        -- Datos del documento
        dc.id_documento,
        dc.fecha_elaboracion,
        dc.estado as estado_documento,
        -- Datos del expediente y paciente
        e.id_expediente,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        p.fecha_nacimiento,
        edad_en_anos(p.fecha_nacimiento) as edad,
        p.sexo,
        p.curp,
        -- Datos del internamiento si existe
        i.id_internamiento,
        i.fecha_ingreso,
        i.motivo_ingreso,
        s.nombre as servicio,
        c.numero as cama,
        -- Personal que registró
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as registrado_por,
        pm.especialidad as especialidad_medico,
        pm.numero_cedula
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE sv.id_signos_vitales = $1
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Signos vitales no encontrados'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Signos vitales encontrados correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al obtener signos vitales por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener signos vitales',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getSignosVitalesById = getSignosVitalesById;
// ==========================================
// CREAR SIGNOS VITALES
// ==========================================
const createSignosVitales = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id_expediente, id_internamiento, id_medico_registra, fecha_toma = new Date(), temperatura, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, saturacion_oxigeno, glucosa, peso, talla, observaciones } = req.body;
        // Validaciones básicas
        if (!id_expediente) {
            res.status(400).json({
                success: false,
                message: 'El ID del expediente es obligatorio'
            });
        }
        if (!id_medico_registra) {
            res.status(400).json({
                success: false,
                message: 'El ID del médico que registra es obligatorio'
            });
        }
        // Validar que al menos se registre un signo vital
        const signosRegistrados = [
            temperatura,
            presion_arterial_sistolica,
            presion_arterial_diastolica,
            frecuencia_cardiaca,
            frecuencia_respiratoria,
            saturacion_oxigeno,
            glucosa,
            peso,
            talla
        ].filter(valor => valor !== null && valor !== undefined);
        if (signosRegistrados.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Debe registrar al menos un signo vital'
            });
        }
        // Verificar que el expediente existe
        const expedienteQuery = `
      SELECT e.id_expediente, e.numero_expediente, e.estado
      FROM expediente e
      WHERE e.id_expediente = $1
    `;
        const expedienteResponse = await client.query(expedienteQuery, [id_expediente]);
        if (expedienteResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            res.status(404).json({
                success: false,
                message: 'El expediente especificado no existe'
            });
        }
        const expediente = expedienteResponse.rows[0];
        if (expediente.estado !== 'Activo') {
            await client.query('ROLLBACK');
            res.status(409).json({
                success: false,
                message: `No se pueden registrar signos vitales. El expediente está en estado: ${expediente.estado}`
            });
        }
        // Verificar internamiento si se especifica
        if (id_internamiento) {
            const internamientoQuery = `
        SELECT id_internamiento 
        FROM internamiento 
        WHERE id_internamiento = $1 AND id_expediente = $2
      `;
            const internamientoResponse = await client.query(internamientoQuery, [id_internamiento, id_expediente]);
            if (internamientoResponse.rows.length === 0) {
                await client.query('ROLLBACK');
                res.status(404).json({
                    success: false,
                    message: 'El internamiento especificado no existe o no pertenece al expediente'
                });
            }
        }
        // Obtener tipo de documento para signos vitales
        const tipoDocumentoQuery = `
      SELECT id_tipo_documento 
      FROM tipo_documento 
      WHERE nombre IN ('Signos Vitales', 'Nota de Evolución', 'Historia Clínica')
      AND activo = true
      ORDER BY 
        CASE 
          WHEN nombre = 'Signos Vitales' THEN 1
          WHEN nombre = 'Nota de Evolución' THEN 2
          ELSE 3
        END
      LIMIT 1
    `;
        const tipoDocumentoResponse = await client.query(tipoDocumentoQuery);
        if (tipoDocumentoResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            res.status(500).json({
                success: false,
                message: 'No se encontró un tipo de documento válido para signos vitales'
            });
        }
        // Crear documento clínico
        const insertDocumentoQuery = `
      INSERT INTO documento_clinico (
        id_expediente, 
        id_internamiento,
        id_tipo_documento, 
        id_personal_creador,
        fecha_elaboracion,
        estado
      )
      VALUES ($1, $2, $3, $4, $5, 'Activo')
      RETURNING id_documento
    `;
        const documentoResponse = await client.query(insertDocumentoQuery, [
            id_expediente,
            id_internamiento || null,
            tipoDocumentoResponse.rows[0].id_tipo_documento,
            id_medico_registra,
            fecha_toma
        ]);
        const id_documento = documentoResponse.rows[0].id_documento;
        // Calcular IMC si hay peso y talla
        let imc = null;
        if (peso && talla) {
            const tallaMetros = talla / 100;
            imc = parseFloat((peso / (tallaMetros * tallaMetros)).toFixed(2));
        }
        // Insertar signos vitales
        const insertSignosQuery = `
      INSERT INTO signos_vitales (
        id_documento,
        fecha_toma,
        temperatura,
        presion_arterial_sistolica,
        presion_arterial_diastolica,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        saturacion_oxigeno,
        glucosa,
        peso,
        talla,
        imc,
        observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
        const signosResponse = await client.query(insertSignosQuery, [
            id_documento,
            fecha_toma,
            temperatura || null,
            presion_arterial_sistolica || null,
            presion_arterial_diastolica || null,
            frecuencia_cardiaca || null,
            frecuencia_respiratoria || null,
            saturacion_oxigeno || null,
            glucosa || null,
            peso || null,
            talla || null,
            imc,
            observaciones?.trim() || null
        ]);
        if (signosResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            res.status(404).json({
                success: false,
                message: 'Signos vitales no creados'
            });
        }
        const signos = signosResponse.rows[0];
        // Registrar auditoría
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            id_expediente,
            id_medico_registra,
            'nuevo_documento',
            null,
            JSON.stringify({
                tipo_documento: 'Signos Vitales',
                id_documento: id_documento,
                valores_registrados: {
                    temperatura,
                    presion_arterial: `${presion_arterial_sistolica}/${presion_arterial_diastolica}`,
                    frecuencia_cardiaca,
                    frecuencia_respiratoria,
                    saturacion_oxigeno,
                    glucosa,
                    peso,
                    talla,
                    imc
                }
            }),
            'Registro de signos vitales'
        ]);
        await client.query('COMMIT');
        res.status(201).json({
            success: true,
            message: 'Signos vitales registrados correctamente',
            data: signos
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear signos vitales:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear signos vitales',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.createSignosVitales = createSignosVitales;
// ==========================================
// ACTUALIZAR SIGNOS VITALES
// ==========================================
const updateSignosVitales = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { fecha_toma, temperatura, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, saturacion_oxigeno, glucosa, peso, talla, observaciones, id_medico_modifica } = req.body;
        if (!id || isNaN(parseInt(id))) {
            res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar que los signos vitales existen
        const signosActualesQuery = `
      SELECT 
        sv.*,
        dc.id_expediente,
        dc.estado as estado_documento
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      WHERE sv.id_signos_vitales = $1
    `;
        const signosActualesResponse = await client.query(signosActualesQuery, [id]);
        if (signosActualesResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            res.status(404).json({
                success: false,
                message: 'Signos vitales no encontrados'
            });
        }
        const signosActuales = signosActualesResponse.rows[0];
        // Verificar que el documento esté activo
        if (signosActuales.estado_documento !== 'Activo') {
            await client.query('ROLLBACK');
            res.status(409).json({
                success: false,
                message: `No se pueden modificar signos vitales de un documento ${signosActuales.estado_documento}`
            });
        }
        // Calcular IMC si hay peso y talla
        let imc = signosActuales.imc;
        const nuevoPeso = peso || signosActuales.peso;
        const nuevaTalla = talla || signosActuales.talla;
        if (nuevoPeso && nuevaTalla) {
            const tallaMetros = nuevaTalla / 100;
            imc = parseFloat((nuevoPeso / (tallaMetros * tallaMetros)).toFixed(2));
        }
        // Actualizar signos vitales
        const updateQuery = `
      UPDATE signos_vitales 
      SET 
        fecha_toma = COALESCE($1, fecha_toma),
        temperatura = COALESCE($2, temperatura),
        presion_arterial_sistolica = COALESCE($3, presion_arterial_sistolica),
        presion_arterial_diastolica = COALESCE($4, presion_arterial_diastolica),
        frecuencia_cardiaca = COALESCE($5, frecuencia_cardiaca),
        frecuencia_respiratoria = COALESCE($6, frecuencia_respiratoria),
        saturacion_oxigeno = COALESCE($7, saturacion_oxigeno),
        glucosa = COALESCE($8, glucosa),
        peso = COALESCE($9, peso),
        talla = COALESCE($10, talla),
        imc = $11,
        observaciones = COALESCE($12, observaciones)
      WHERE id_signos_vitales = $13
      RETURNING *
    `;
        const response = await client.query(updateQuery, [
            fecha_toma || null,
            temperatura || null,
            presion_arterial_sistolica || null,
            presion_arterial_diastolica || null,
            frecuencia_cardiaca || null,
            frecuencia_respiratoria || null,
            saturacion_oxigeno || null,
            glucosa || null,
            peso || null,
            talla || null,
            imc,
            observaciones?.trim() || null,
            id
        ]);
        // Registrar auditoría
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            signosActuales.id_expediente,
            id_medico_modifica || null,
            'actualizacion',
            JSON.stringify({
                temperatura_anterior: signosActuales.temperatura,
                presion_anterior: `${signosActuales.presion_arterial_sistolica}/${signosActuales.presion_arterial_diastolica}`,
                fc_anterior: signosActuales.frecuencia_cardiaca,
                sat_anterior: signosActuales.saturacion_oxigeno
            }),
            JSON.stringify({
                temperatura_nueva: temperatura || signosActuales.temperatura,
                presion_nueva: `${presion_arterial_sistolica || signosActuales.presion_arterial_sistolica}/${presion_arterial_diastolica || signosActuales.presion_arterial_diastolica}`,
                fc_nueva: frecuencia_cardiaca || signosActuales.frecuencia_cardiaca,
                sat_nueva: saturacion_oxigeno || signosActuales.saturacion_oxigeno
            }),
            'Actualización de signos vitales'
        ]);
        await client.query('COMMIT');
        res.status(200).json({
            success: true,
            message: 'Signos vitales actualizados correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar signos vitales:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar signos vitales',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.updateSignosVitales = updateSignosVitales;
// ==========================================
// ELIMINAR SIGNOS VITALES
// ==========================================
const deleteSignosVitales = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { id_medico_elimina, motivo_eliminacion } = req.body;
        if (!id || isNaN(parseInt(id))) {
            res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar que los signos vitales existen
        const signosQuery = `
      SELECT 
        sv.*,
        dc.id_expediente,
        dc.id_documento,
        dc.estado as estado_documento
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      WHERE sv.id_signos_vitales = $1
    `;
        const signosResponse = await client.query(signosQuery, [id]);
        if (signosResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            res.status(404).json({
                success: false,
                message: 'Signos vitales no encontrados'
            });
        }
        const signos = signosResponse.rows[0];
        // Verificar que el documento esté activo
        if (signos.estado_documento !== 'Activo') {
            await client.query('ROLLBACK');
            res.status(409).json({
                success: false,
                message: `No se pueden eliminar signos vitales de un documento ${signos.estado_documento}`
            });
        }
        // Cambiar estado del documento a 'Anulado' en lugar de eliminar físicamente
        const updateDocumentoQuery = `
      UPDATE documento_clinico 
      SET estado = 'Anulado'
      WHERE id_documento = $1
    `;
        await client.query(updateDocumentoQuery, [signos.id_documento]);
        // Registrar auditoría
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            signos.id_expediente,
            id_medico_elimina || null,
            'eliminacion_logica',
            JSON.stringify({
                id_signos_vitales: id,
                valores_eliminados: {
                    temperatura: signos.temperatura,
                    presion: `${signos.presion_arterial_sistolica}/${signos.presion_arterial_diastolica}`,
                    frecuencia_cardiaca: signos.frecuencia_cardiaca,
                    saturacion_oxigeno: signos.saturacion_oxigeno
                }
            }),
            null,
            `Signos vitales anulados. Motivo: ${motivo_eliminacion || 'No especificado'}`
        ]);
        await client.query('COMMIT');
        res.status(200).json({
            success: true,
            message: 'Signos vitales eliminados correctamente',
            data: {
                id_signos_vitales: id,
                estado_documento: 'Anulado',
                motivo: motivo_eliminacion || 'No especificado'
            }
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar signos vitales:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar signos vitales',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.deleteSignosVitales = deleteSignosVitales;
// ==========================================
// OBTENER ÚLTIMOS SIGNOS VITALES DE UN PACIENTE
// ==========================================
const getUltimosSignosVitalesPaciente = async (req, res) => {
    try {
        const { id_expediente } = req.params;
        const { limite = 1 } = req.query;
        if (!id_expediente || isNaN(parseInt(id_expediente))) {
            res.status(400).json({
                success: false,
                message: 'El ID del expediente debe ser un número válido'
            });
        }
        const query = `
      SELECT 
        sv.*,
        dc.fecha_elaboracion,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as registrado_por,
        pm.especialidad,
        -- Indicadores de valores anormales
        CASE 
          WHEN sv.temperatura < 36 OR sv.temperatura > 37.5 THEN true
          ELSE false
        END as temperatura_anormal,
        CASE 
          WHEN sv.presion_arterial_sistolica > 140 OR sv.presion_arterial_diastolica > 90 THEN true
          WHEN sv.presion_arterial_sistolica < 90 OR sv.presion_arterial_diastolica < 60 THEN true
          ELSE false
        END as presion_anormal,
        CASE 
          WHEN sv.frecuencia_cardiaca < 60 OR sv.frecuencia_cardiaca > 100 THEN true
          ELSE false
        END as fc_anormal,
        CASE 
          WHEN sv.saturacion_oxigeno < 95 THEN true
          ELSE false
        END as saturacion_anormal,
        CASE 
          WHEN sv.glucosa < 70 OR sv.glucosa > 140 THEN true
          ELSE false
        END as glucosa_anormal
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE dc.id_expediente = $1 AND dc.estado = 'Activo'
      ORDER BY sv.fecha_toma DESC
      LIMIT $2
    `;
        const response = await database_1.default.query(query, [id_expediente, parseInt(limite)]);
        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No se encontraron signos vitales para este expediente'
            });
        }
        // Si solo se pide un registro, devolverlo directamente
        const data = parseInt(limite) === 1 ? response.rows[0] : response.rows;
        res.status(200).json({
            success: true,
            message: 'Últimos signos vitales obtenidos correctamente',
            data: data,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al obtener últimos signos vitales:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener últimos signos vitales',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getUltimosSignosVitalesPaciente = getUltimosSignosVitalesPaciente;
// // ==========================================
// // OBTENER HISTORIAL DE SIGNOS VITALES
// // ==========================================
// export const getHistorialSignosVitales = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id_expediente } = req.params;
//     const { 
//       fecha_inicio, 
//       fecha_fin, 
//       tipo_signo,
//       limit = 100,
//       offset = 0 
//     } = req.query;
//     if (!id_expediente || isNaN(parseInt(id_expediente))) {
//        res.status(400).json({
//         success: false,
//         message: 'El ID del expediente debe ser un número válido'
//       });
//     }
//     let query = `
//       SELECT 
//         sv.id_signos_vitales,
//         sv.fecha_toma,
//         sv.temperatura,
//         sv.presion_arterial_sistolica,
//         sv.presion_arterial_diastolica,
//         sv.frecuencia_cardiaca,
//         sv.frecuencia_respiratoria,
//         sv.saturacion_oxigeno,
//         sv.glucosa,
//         sv.peso,
//         sv.talla,
//         sv.imc,
//         sv.observaciones,
//         -- Datos del internamiento si existe
//         i.id_internamiento,
//         i.fecha_ingreso,
//         s.nombre as servicio,
//         c.numero as cama,
//         -- Personal que registró
//         CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as registrado_por,
//         pm.especialidad
//       FROM signos_vitales sv
//       JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
//       LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
//       LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
//       LEFT JOIN cama c ON i.id_cama = c.id_cama
//       LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
//       LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
//       WHERE dc.id_expediente = $1 AND dc.estado = 'Activo'
//     `;
//     const params: any[] = [id_expediente];
//     let paramCounter = 2;
//     if (fecha_inicio) {
//       query += ` AND sv.fecha_toma >= $${paramCounter}`;
//       params.push(fecha_inicio);
//       paramCounter++;
//     }
//     if (fecha_fin) {
//       query += ` AND sv.fecha_toma <= $${paramCounter}`;
//       params.push(fecha_fin);
//       paramCounter++;
//     }
//     // Filtrar por tipo específico de signo vital
//     if (tipo_signo) {
//       switch (tipo_signo) {
//         case 'temperatura':
//           query += ` AND sv.temperatura IS NOT NULL`;
//           break;
//         case 'presion':
//           query += ` AND sv.presion_arterial_sistolica IS NOT NULL`;
//           break;
//         case 'frecuencia_cardiaca':
//           query += ` AND sv.frecuencia_cardiaca IS NOT NULL`;
//           break;
//         case 'saturacion':
//           query += ` AND sv.saturacion_oxigeno IS NOT NULL`;
//           break;
//         case 'glucosa':
//           query += ` AND sv.glucosa IS NOT NULL`;
//           break;
//         case 'peso':
//           query += ` AND sv.peso IS NOT NULL`;
//           break;
//         default:
//           break;
//       }
//     }
//     query += ` ORDER BY sv.fecha_toma DESC`;
//     query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
//     params.push(parseInt(limit as string), parseInt(offset as string));
//     const response: QueryResult = await pool.query(query, params);
//     // Construcción dinámica de la consulta de estadísticas
//     let estadisticasQuery = `
//       SELECT 
//         -- Promedios
//         ROUND(AVG(sv.temperatura), 2) as temp_promedio,
//         ROUND(AVG(sv.presion_arterial_sistolica), 2) as pas_promedio,
//         ROUND(AVG(sv.presion_arterial_diastolica), 2) as pad_promedio,
//         ROUND(AVG(sv.frecuencia_cardiaca), 2) as fc_promedio,
//         ROUND(AVG(sv.saturacion_oxigeno), 2) as sat_promedio,
//         ROUND(AVG(sv.glucosa), 2) as glucosa_promedio,
//         -- Máximos
//         MAX(sv.temperatura) as temp_maxima,
//         MAX(sv.presion_arterial_sistolica) as pas_maxima,
//         MAX(sv.frecuencia_cardiaca) as fc_maxima,
//         MAX(sv.glucosa) as glucosa_maxima,
//         -- Mínimos
//         MIN(sv.temperatura) as temp_minima,
//         MIN(sv.presion_arterial_sistolica) as pas_minima,
//         MIN(sv.frecuencia_cardiaca) as fc_minima,
//         MIN(sv.saturacion_oxigeno) as sat_minima,
//         -- Conteo de anormales
//         COUNT(CASE WHEN sv.temperatura < 36 OR sv.temperatura > 37.5 THEN 1 END) as temp_anormales,
//         COUNT(CASE WHEN sv.presion_arterial_sistolica > 140 OR sv.presion_arterial_diastolica > 90 THEN 1 END) as hipertension_casos,
//         COUNT(CASE WHEN sv.saturacion_oxigeno < 95 THEN 1 END) as sat_baja_casos
//       FROM signos_vitales sv
//       JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
//       WHERE dc.id_expediente = $1 AND dc.estado = 'Activo'
//     `;
//     const estadisticasParams = [id_expediente];
//     if (fecha_inicio) {
//       estadisticasQuery += ` AND sv.fecha_toma >= $2`;
//       estadisticasParams.push(fecha_inicio);
//     }
//     if (fecha_fin) {
//       estadisticasQuery += ` AND sv.fecha_toma <= $3`;
//       estadisticasParams.push(fecha_fin);
//     }
//     const estadisticasResponse: QueryResult = await pool.query(estadisticasQuery, estadisticasParams);
//      res.status(200).json({
//       success: true,
//       message: 'Historial de signos vitales obtenido correctamente',
//       data: response.rows,
//       estadisticas: estadisticasResponse.rows[0],
//       pagination: {
//         total: response.rowCount,
//         limit: parseInt(limit as string),
//         offset: parseInt(offset as string)
//       },
//       filtros_aplicados: {
//         fecha_inicio: fecha_inicio || null,
//         fecha_fin: fecha_fin || null,
//         tipo_signo: tipo_signo || 'todos'
//       }
//     });
//   } catch (error) {
//     console.error('Error al obtener historial de signos vitales:', error);
//      res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al obtener historial',
//       error: process.env.NODE_ENV === 'development' ? error : {}
//     });
//   }
// };
// ==========================================
// OBTENER HISTORIAL DE SIGNOS VITALES
// ==========================================
const getHistorialSignosVitales = async (req, res) => {
    try {
        const { id_expediente } = req.params;
        const { fecha_inicio, fecha_fin, tipo_signo, limit = 100, offset = 0 } = req.query;
        if (!id_expediente || isNaN(parseInt(id_expediente))) {
            return res.status(400).json({
                success: false,
                message: 'El ID del expediente debe ser un número válido'
            });
        }
        let query = `
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
        sv.observaciones,
        
        -- Datos del internamiento si existe
        i.id_internamiento,
        i.fecha_ingreso,
        s.nombre as servicio,
        c.numero as cama,
        
        -- Personal que registró
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as registrado_por,
        pm.especialidad
        
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      LEFT JOIN internamiento i ON dc.id_internamiento = i.id_internamiento
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE dc.id_expediente = $1 AND dc.estado = 'Activo'
    `;
        const params = [id_expediente];
        let paramCounter = 2;
        if (fecha_inicio) {
            query += ` AND sv.fecha_toma >= ${paramCounter}`;
            params.push(fecha_inicio);
            paramCounter++;
        }
        if (fecha_fin) {
            query += ` AND sv.fecha_toma <= ${paramCounter}`;
            params.push(fecha_fin);
            paramCounter++;
        }
        // Filtrar por tipo específico de signo vital
        if (tipo_signo) {
            switch (tipo_signo) {
                case 'temperatura':
                    query += ` AND sv.temperatura IS NOT NULL`;
                    break;
                case 'presion':
                    query += ` AND sv.presion_arterial_sistolica IS NOT NULL`;
                    break;
                case 'frecuencia_cardiaca':
                    query += ` AND sv.frecuencia_cardiaca IS NOT NULL`;
                    break;
                case 'saturacion':
                    query += ` AND sv.saturacion_oxigeno IS NOT NULL`;
                    break;
                case 'glucosa':
                    query += ` AND sv.glucosa IS NOT NULL`;
                    break;
                case 'peso':
                    query += ` AND sv.peso IS NOT NULL`;
                    break;
            }
        }
        query += ` ORDER BY sv.fecha_toma DESC`;
        query += ` LIMIT ${paramCounter} OFFSET ${paramCounter + 1}`;
        params.push(parseInt(limit), parseInt(offset));
        const response = await database_1.default.query(query, params);
        // Obtener estadísticas del período
        const estadisticasQuery = `
      SELECT 
        -- Promedios
        ROUND(AVG(sv.temperatura), 2) as temp_promedio,
        ROUND(AVG(sv.presion_arterial_sistolica), 2) as pas_promedio,
        ROUND(AVG(sv.presion_arterial_diastolica), 2) as pad_promedio,
        ROUND(AVG(sv.frecuencia_cardiaca), 2) as fc_promedio,
        ROUND(AVG(sv.saturacion_oxigeno), 2) as sat_promedio,
        ROUND(AVG(sv.glucosa), 2) as glucosa_promedio,
        
        -- Máximos
        MAX(sv.temperatura) as temp_maxima,
        MAX(sv.presion_arterial_sistolica) as pas_maxima,
        MAX(sv.frecuencia_cardiaca) as fc_maxima,
        MAX(sv.glucosa) as glucosa_maxima,
        
        -- Mínimos
        MIN(sv.temperatura) as temp_minima,
        MIN(sv.presion_arterial_sistolica) as pas_minima,
        MIN(sv.frecuencia_cardiaca) as fc_minima,
        MIN(sv.saturacion_oxigeno) as sat_minima,
        
        -- Conteo de anormales
        COUNT(CASE WHEN sv.temperatura < 36 OR sv.temperatura > 37.5 THEN 1 END) as temp_anormales,
        COUNT(CASE WHEN sv.presion_arterial_sistolica > 140 OR sv.presion_arterial_diastolica > 90 THEN 1 END) as hipertension_casos,
        COUNT(CASE WHEN sv.saturacion_oxigeno < 95 THEN 1 END) as sat_baja_casos
        
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      WHERE dc.id_expediente = $1 AND dc.estado = 'Activo'
    `;
        const estadisticasParams = [id_expediente];
        if (fecha_inicio) {
            estadisticasQuery.replace('WHERE', 'WHERE sv.fecha_toma >= $2 AND');
            // estadisticasParams.push(fecha_inicio);
        }
        if (fecha_fin) {
            const paramNum = estadisticasParams.length + 1;
            estadisticasQuery.replace('WHERE', `WHERE sv.fecha_toma <= ${paramNum} AND`);
            // estadisticasParams.push(fecha_fin);
        }
        const estadisticasResponse = await database_1.default.query(estadisticasQuery, estadisticasParams);
        return res.status(200).json({
            success: true,
            message: 'Historial de signos vitales obtenido correctamente',
            data: response.rows,
            estadisticas: estadisticasResponse.rows[0],
            pagination: {
                total: response.rowCount,
                limit: parseInt(limit),
                offset: parseInt(offset)
            },
            filtros_aplicados: {
                fecha_inicio: fecha_inicio || null,
                fecha_fin: fecha_fin || null,
                tipo_signo: tipo_signo || 'todos'
            }
        });
    }
    catch (error) {
        console.error('Error al obtener historial de signos vitales:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener historial',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getHistorialSignosVitales = getHistorialSignosVitales;
// ==========================================
// OBTENER GRÁFICA DE SIGNOS VITALES
// ==========================================
const getGraficaSignosVitales = async (req, res) => {
    try {
        const { id_expediente } = req.params;
        const { tipo_signo = 'todos', dias = 7, id_internamiento } = req.query;
        if (!id_expediente || isNaN(parseInt(id_expediente))) {
            return res.status(400).json({
                success: false,
                message: 'El ID del expediente debe ser un número válido'
            });
        }
        let query = `
      SELECT 
        sv.fecha_toma,
        sv.temperatura,
        sv.presion_arterial_sistolica,
        sv.presion_arterial_diastolica,
        sv.frecuencia_cardiaca,
        sv.frecuencia_respiratoria,
        sv.saturacion_oxigeno,
        sv.glucosa,
        sv.peso,
        sv.imc
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      WHERE dc.id_expediente = $1 
        AND dc.estado = 'Activo'
        AND sv.fecha_toma >= CURRENT_DATE - INTERVAL '${parseInt(dias)} days'
    `;
        const params = [id_expediente];
        if (id_internamiento) {
            query += ` AND dc.id_internamiento = $2`;
            params.push(id_internamiento);
        }
        query += ` ORDER BY sv.fecha_toma ASC`;
        const response = await database_1.default.query(query, params);
        // Formatear datos para gráfica
        const datosGrafica = {
            labels: response.rows.map(row => row.fecha_toma),
            datasets: []
        };
        if (tipo_signo === 'todos' || tipo_signo === 'temperatura') {
            datosGrafica.datasets.push({
                label: 'Temperatura (°C)',
                data: response.rows.map(row => row.temperatura),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            });
        }
        if (tipo_signo === 'todos' || tipo_signo === 'presion') {
            datosGrafica.datasets.push({
                label: 'Presión Sistólica (mmHg)',
                data: response.rows.map(row => row.presion_arterial_sistolica),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            });
            datosGrafica.datasets.push({
                label: 'Presión Diastólica (mmHg)',
                data: response.rows.map(row => row.presion_arterial_diastolica),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.3)',
                borderDash: [5, 5]
            });
        }
        if (tipo_signo === 'todos' || tipo_signo === 'frecuencia_cardiaca') {
            datosGrafica.datasets.push({
                label: 'Frecuencia Cardíaca (lpm)',
                data: response.rows.map(row => row.frecuencia_cardiaca),
                borderColor: 'rgb(255, 206, 86)',
                backgroundColor: 'rgba(255, 206, 86, 0.5)'
            });
        }
        if (tipo_signo === 'todos' || tipo_signo === 'saturacion') {
            datosGrafica.datasets.push({
                label: 'Saturación O2 (%)',
                data: response.rows.map(row => row.saturacion_oxigeno),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            });
        }
        if (tipo_signo === 'glucosa') {
            datosGrafica.datasets.push({
                label: 'Glucosa (mg/dl)',
                data: response.rows.map(row => row.glucosa),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Datos para gráfica obtenidos correctamente',
            data: datosGrafica,
            registros: response.rowCount,
            periodo: {
                dias: parseInt(dias),
                desde: new Date(Date.now() - parseInt(dias) * 24 * 60 * 60 * 1000),
                hasta: new Date()
            }
        });
    }
    catch (error) {
        console.error('Error al obtener datos para gráfica:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener datos para gráfica',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getGraficaSignosVitales = getGraficaSignosVitales;
const getSignosVitalesByPacienteId = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const { limit = 10, offset = 0 } = req.query;
        //    CONSULTA CORREGIDA: Relación correcta a través de documento_clinico
        const query = `
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
        sv.observaciones,
        
        -- Datos del expediente
        e.numero_expediente,
        
        -- Datos del médico que registró    CORREGIDO: pm_p.nombre en lugar de pm.nombres
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_registra,
        pm.especialidad as especialidad_medico,
        
        -- Datos del documento
        dc.id_documento,
        dc.fecha_elaboracion as fecha_documento,
        
        -- Indicadores de valores anormales
        CASE 
          WHEN sv.temperatura < 36 OR sv.temperatura > 37.5 THEN true
          ELSE false
        END as temperatura_anormal,
        CASE 
          WHEN sv.presion_arterial_sistolica > 140 OR sv.presion_arterial_diastolica > 90 THEN true
          WHEN sv.presion_arterial_sistolica < 90 OR sv.presion_arterial_diastolica < 60 THEN true
          ELSE false
        END as presion_anormal,
        CASE 
          WHEN sv.frecuencia_cardiaca < 60 OR sv.frecuencia_cardiaca > 100 THEN true
          ELSE false
        END as fc_anormal,
        CASE 
          WHEN sv.saturacion_oxigeno < 95 THEN true
          ELSE false
        END as saturacion_anormal
        
      FROM signos_vitales sv
      --    RELACIÓN CORREGIDA: a través de documento_clinico, no directamente
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      LEFT JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE pac.id_paciente = $1
        AND dc.estado = 'Activo'
      ORDER BY sv.fecha_toma DESC
      LIMIT $2 OFFSET $3
    `;
        const result = await database_1.default.query(query, [pacienteId, limit, offset]);
        // Consulta para contar total
        const countQuery = `
      SELECT COUNT(*) as total
      FROM signos_vitales sv
      JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      WHERE pac.id_paciente = $1
        AND dc.estado = 'Activo'
    `;
        const countResult = await database_1.default.query(countQuery, [pacienteId]);
        const total = parseInt(countResult.rows[0].total);
        const response = {
            success: true,
            message: 'Signos vitales obtenidos exitosamente',
            data: result.rows,
            pagination: {
                page: Math.floor(Number(offset) / Number(limit)) + 1,
                limit: Number(limit),
                total: total,
                totalPages: Math.ceil(total / Number(limit)),
                hasNext: Number(offset) + Number(limit) < total,
                hasPrev: Number(offset) > 0
            }
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error al obtener signos vitales por paciente ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener signos vitales',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.getSignosVitalesByPacienteId = getSignosVitalesByPacienteId;
