"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstadisticasInternamientos = exports.transferirPaciente = exports.buscarInternamientos = exports.getHistorialInternamientosPaciente = exports.getDashboardInternamientos = exports.getInternamientosActivos = exports.egresarPaciente = exports.updateInternamiento = exports.createInternamiento = exports.getInternamientoById = exports.getInternamientos = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODOS LOS INTERNAMIENTOS
// ==========================================
const getInternamientos = async (req, res) => {
    try {
        const { activos_solo = false, servicio_id, medico_responsable_id, fecha_inicio, fecha_fin, tipo_egreso, buscar, limit = 50, offset = 0 } = req.query;
        let query = `
      SELECT 
        i.id_internamiento,
        i.fecha_ingreso,
        i.fecha_egreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        i.diagnostico_egreso,
        i.tipo_egreso,
        i.observaciones,
        
        -- Datos del expediente y paciente
        e.id_expediente,
        e.numero_expediente,
        e.estado as estado_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        edad_en_anos(p.fecha_nacimiento) as edad,
        
        -- Datos del servicio y cama
        s.id_servicio,
        s.nombre as servicio,
        c.id_cama,
        c.numero as cama,
        c.area as area_cama,
        c.subarea as subarea_cama,
        c.estado as estado_cama,
        
        -- Médico responsable
        pm.id_personal_medico,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable,
        pm.especialidad,
        pm.cargo,
        
        -- Cálculos de estancia
        CASE 
          WHEN i.fecha_egreso IS NOT NULL THEN 
            EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso))
          ELSE 
            EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - i.fecha_ingreso))
        END as dias_estancia,
        
        -- Estado del internamiento
        CASE 
          WHEN i.fecha_egreso IS NULL THEN 'Activo'
          ELSE 'Egresado'
        END as estado_internamiento,
        
        -- Documentos del internamiento
        COUNT(dc.id_documento) as total_documentos_internamiento
        
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      LEFT JOIN documento_clinico dc ON i.id_internamiento = dc.id_internamiento
      WHERE 1=1
    `;
        const params = [];
        let paramCounter = 1;
        // Filtros
        if (activos_solo === 'true') {
            query += ` AND i.fecha_egreso IS NULL`;
        }
        if (servicio_id) {
            query += ` AND s.id_servicio = $${paramCounter}`;
            params.push(servicio_id);
            paramCounter++;
        }
        if (medico_responsable_id) {
            query += ` AND pm.id_personal_medico = $${paramCounter}`;
            params.push(medico_responsable_id);
            paramCounter++;
        }
        if (fecha_inicio) {
            query += ` AND DATE(i.fecha_ingreso) >= $${paramCounter}`;
            params.push(fecha_inicio);
            paramCounter++;
        }
        if (fecha_fin) {
            query += ` AND DATE(i.fecha_ingreso) <= $${paramCounter}`;
            params.push(fecha_fin);
            paramCounter++;
        }
        if (tipo_egreso) {
            query += ` AND i.tipo_egreso = $${paramCounter}`;
            params.push(tipo_egreso);
            paramCounter++;
        }
        if (buscar) {
            query += ` AND (
        UPPER(e.numero_expediente) LIKE UPPER($${paramCounter}) OR
        UPPER(p.nombre) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($${paramCounter}) OR 
        UPPER(p.apellido_materno) LIKE UPPER($${paramCounter}) OR
        UPPER(p.curp) LIKE UPPER($${paramCounter}) OR
        UPPER(i.motivo_ingreso) LIKE UPPER($${paramCounter}) OR
        UPPER(i.diagnostico_ingreso) LIKE UPPER($${paramCounter})
      )`;
            params.push(`%${buscar}%`);
            paramCounter++;
        }
        query += `
      GROUP BY i.id_internamiento, i.fecha_ingreso, i.fecha_egreso, i.motivo_ingreso, 
               i.diagnostico_ingreso, i.diagnostico_egreso, i.tipo_egreso, i.observaciones,
               e.id_expediente, e.numero_expediente, e.estado, p.nombre, p.apellido_paterno, 
               p.apellido_materno, p.fecha_nacimiento, p.sexo, p.curp, s.id_servicio, s.nombre,
               c.id_cama, c.numero, c.area, c.subarea, c.estado, pm.id_personal_medico,
               pm_p.nombre, pm_p.apellido_paterno, pm.especialidad, pm.cargo
      ORDER BY i.fecha_ingreso DESC
    `;
        // Paginación
        query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
        params.push(parseInt(limit), parseInt(offset));
        const response = await database_1.default.query(query, params);
        // Contar total para paginación
        let countQuery = `
      SELECT COUNT(DISTINCT i.id_internamiento) as total
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      WHERE 1=1
    `;
        const countParams = params.slice(0, -2); // Remover limit y offset
        let countParamCounter = 1;
        if (activos_solo === 'true') {
            countQuery += ` AND i.fecha_egreso IS NULL`;
        }
        if (servicio_id) {
            countQuery += ` AND s.id_servicio = $${countParamCounter}`;
            countParamCounter++;
        }
        if (medico_responsable_id) {
            countQuery += ` AND pm.id_personal_medico = $${countParamCounter}`;
            countParamCounter++;
        }
        if (fecha_inicio) {
            countQuery += ` AND DATE(i.fecha_ingreso) >= $${countParamCounter}`;
            countParamCounter++;
        }
        if (fecha_fin) {
            countQuery += ` AND DATE(i.fecha_ingreso) <= $${countParamCounter}`;
            countParamCounter++;
        }
        if (tipo_egreso) {
            countQuery += ` AND i.tipo_egreso = $${countParamCounter}`;
            countParamCounter++;
        }
        if (buscar) {
            countQuery += ` AND (
        UPPER(e.numero_expediente) LIKE UPPER($${countParamCounter}) OR
        UPPER(p.nombre) LIKE UPPER($${countParamCounter}) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($${countParamCounter}) OR 
        UPPER(p.apellido_materno) LIKE UPPER($${countParamCounter}) OR
        UPPER(p.curp) LIKE UPPER($${countParamCounter}) OR
        UPPER(i.motivo_ingreso) LIKE UPPER($${countParamCounter}) OR
        UPPER(i.diagnostico_ingreso) LIKE UPPER($${countParamCounter})
      )`;
            countParamCounter++;
        }
        const countResponse = await database_1.default.query(countQuery, countParams);
        const totalRecords = parseInt(countResponse.rows[0].total);
        return res.status(200).json({
            success: true,
            message: 'Internamientos obtenidos correctamente',
            data: response.rows,
            pagination: {
                total: totalRecords,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(totalRecords / parseInt(limit))
            },
            filtros_aplicados: {
                activos_solo: activos_solo,
                servicio_id: servicio_id || null,
                medico_responsable_id: medico_responsable_id || null,
                fecha_inicio: fecha_inicio || null,
                fecha_fin: fecha_fin || null,
                tipo_egreso: tipo_egreso || null,
                buscar: buscar || 'sin filtro'
            }
        });
    }
    catch (error) {
        console.error('Error al obtener internamientos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener internamientos',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getInternamientos = getInternamientos;
// ==========================================
// OBTENER INTERNAMIENTO POR ID (VISTA COMPLETA)
// ==========================================
const getInternamientoById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Obtener datos principales del internamiento
        const internamientoQuery = `
      SELECT 
        i.id_internamiento,
        i.fecha_ingreso,
        i.fecha_egreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        i.diagnostico_egreso,
        i.tipo_egreso,
        i.observaciones,
        
        -- Datos del expediente y paciente
        e.id_expediente,
        e.numero_expediente,
        e.estado as estado_expediente,
        pac.id_paciente,
        pac.alergias,
        pac.transfusiones,
        pac.familiar_responsable,
        pac.telefono_familiar,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.fecha_nacimiento,
        p.sexo,
        p.curp,
        p.telefono,
        p.domicilio,
        edad_en_anos(p.fecha_nacimiento) as edad,
        ts.nombre as tipo_sangre,
        
        -- Datos del servicio y cama
        s.id_servicio,
        s.nombre as servicio,
        s.descripcion as descripcion_servicio,
        c.id_cama,
        c.numero as cama,
        c.area as area_cama,
        c.subarea as subarea_cama,
        c.estado as estado_cama,
        
        -- Médico responsable
        pm.id_personal_medico,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable,
        pm.numero_cedula,
        pm.especialidad,
        pm.cargo,
        pm.departamento,
        
        -- Cálculos de estancia
        CASE 
          WHEN i.fecha_egreso IS NOT NULL THEN 
            EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso))
          ELSE 
            EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - i.fecha_ingreso))
        END as dias_estancia,
        
        -- Estado del internamiento
        CASE 
          WHEN i.fecha_egreso IS NULL THEN 'Activo'
          ELSE 'Egresado'
        END as estado_internamiento
        
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN tipo_sangre ts ON p.tipo_sangre_id = ts.id_tipo_sangre
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE i.id_internamiento = $1
    `;
        const internamientoResponse = await database_1.default.query(internamientoQuery, [id]);
        if (internamientoResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Internamiento no encontrado'
            });
        }
        // Obtener documentos clínicos del internamiento
        const documentosQuery = `
      SELECT 
        dc.id_documento,
        dc.fecha_elaboracion,
        dc.estado,
        td.nombre as tipo_documento,
        CONCAT(pm_doc_p.nombre, ' ', pm_doc_p.apellido_paterno) as medico_creador,
        pm_doc.especialidad as especialidad_creador,
        
        -- Identificar tipo específico de documento
        CASE 
          WHEN ne.id_nota_evolucion IS NOT NULL THEN 'Nota de Evolución'
          WHEN nu.id_nota_urgencias IS NOT NULL THEN 'Nota de Urgencias'
          WHEN sv.id_signos_vitales IS NOT NULL THEN 'Signos Vitales'
          WHEN pm_med.id_prescripcion IS NOT NULL THEN 'Prescripción'
          ELSE td.nombre
        END as subtipo_documento
        
      FROM documento_clinico dc
      JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
      LEFT JOIN personal_medico pm_doc ON dc.id_personal_creador = pm_doc.id_personal_medico
      LEFT JOIN persona pm_doc_p ON pm_doc.id_persona = pm_doc_p.id_persona
      LEFT JOIN nota_evolucion ne ON dc.id_documento = ne.id_documento
      LEFT JOIN nota_urgencias nu ON dc.id_documento = nu.id_documento
      LEFT JOIN signos_vitales sv ON dc.id_documento = sv.id_documento
      LEFT JOIN prescripcion_medicamento pm_med ON dc.id_documento = pm_med.id_documento
      WHERE dc.id_internamiento = $1
      ORDER BY dc.fecha_elaboracion DESC
    `;
        const documentosResponse = await database_1.default.query(documentosQuery, [id]);
        // Obtener signos vitales del internamiento
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
      WHERE dc.id_internamiento = $1
      ORDER BY sv.fecha_toma DESC
    `;
        const signosVitalesResponse = await database_1.default.query(signosVitalesQuery, [id]);
        // Obtener prescripciones activas
        const prescripcionesQuery = `
      SELECT 
        pm.id_prescripcion,
        pm.dosis,
        pm.via_administracion,
        pm.frecuencia,
        pm.duracion,
        pm.fecha_inicio,
        pm.fecha_fin,
        pm.indicaciones_especiales,
        pm.activo,
        m.nombre as medicamento,
        m.presentacion,
        m.concentracion,
        m.grupo_terapeutico
      FROM prescripcion_medicamento pm
      JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
      JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      WHERE dc.id_internamiento = $1
      ORDER BY pm.fecha_inicio DESC, pm.activo DESC
    `;
        const prescripcionesResponse = await database_1.default.query(prescripcionesQuery, [id]);
        // Obtener historial de camas si hubo cambios
        const historialCamasQuery = `
      SELECT DISTINCT
        c.numero as cama,
        c.area,
        c.subarea,
        s.nombre as servicio,
        'Histórico' as tipo_registro
      FROM documento_clinico dc
      JOIN internamiento i_hist ON dc.id_internamiento = i_hist.id_internamiento
      JOIN cama c ON i_hist.id_cama = c.id_cama
      JOIN servicio s ON i_hist.id_servicio = s.id_servicio
      WHERE dc.id_internamiento = $1
      AND (c.id_cama != (SELECT id_cama FROM internamiento WHERE id_internamiento = $1)
           OR s.id_servicio != (SELECT id_servicio FROM internamiento WHERE id_internamiento = $1))
      ORDER BY tipo_registro
    `;
        const historialCamasResponse = await database_1.default.query(historialCamasQuery, [id]);
        const internamientoData = internamientoResponse.rows[0];
        internamientoData.documentos_clinicos = documentosResponse.rows;
        internamientoData.signos_vitales = signosVitalesResponse.rows;
        internamientoData.prescripciones = prescripcionesResponse.rows;
        internamientoData.historial_camas = historialCamasResponse.rows;
        return res.status(200).json({
            success: true,
            message: 'Internamiento encontrado correctamente',
            data: internamientoData
        });
    }
    catch (error) {
        console.error('Error al obtener internamiento por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener internamiento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getInternamientoById = getInternamientoById;
// ==========================================
// CREAR NUEVO INTERNAMIENTO (INGRESO)
// ==========================================
const createInternamiento = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id_expediente, id_servicio, id_cama, motivo_ingreso, diagnostico_ingreso, id_medico_responsable, observaciones, fecha_ingreso = new Date(), crear_nota_ingreso = true } = req.body;
        // Validaciones básicas
        if (!id_expediente) {
            return res.status(400).json({
                success: false,
                message: 'El ID del expediente es obligatorio'
            });
        }
        if (!motivo_ingreso || motivo_ingreso.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El motivo de ingreso es obligatorio'
            });
        }
        if (!id_medico_responsable) {
            return res.status(400).json({
                success: false,
                message: 'El médico responsable es obligatorio'
            });
        }
        // Verificar que el expediente existe y está activo
        const expedienteQuery = `
      SELECT 
        e.id_expediente, 
        e.numero_expediente,
        e.estado,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente
      FROM expediente e
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      WHERE e.id_expediente = $1
    `;
        const expedienteResponse = await client.query(expedienteQuery, [id_expediente]);
        if (expedienteResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'El expediente especificado no existe'
            });
        }
        const expediente = expedienteResponse.rows[0];
        if (expediente.estado !== 'Activo') {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: `No se puede crear internamiento. El expediente está en estado: ${expediente.estado}`
            });
        }
        // Verificar que no hay internamientos activos
        const internamientoActivoQuery = `
      SELECT id_internamiento 
      FROM internamiento 
      WHERE id_expediente = $1 AND fecha_egreso IS NULL
    `;
        const internamientoActivoResponse = await client.query(internamientoActivoQuery, [id_expediente]);
        if (internamientoActivoResponse.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'El paciente ya tiene un internamiento activo'
            });
        }
        // Verificar que el médico existe y está activo
        const medicoQuery = `
      SELECT pm.id_personal_medico, pm.especialidad,
             CONCAT(p.nombre, ' ', p.apellido_paterno) as nombre_medico
      FROM personal_medico pm
      JOIN persona p ON pm.id_persona = p.id_persona
      WHERE pm.id_personal_medico = $1 AND pm.activo = true
    `;
        const medicoResponse = await client.query(medicoQuery, [id_medico_responsable]);
        if (medicoResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'El médico responsable especificado no existe o está inactivo'
            });
        }
        // Verificar y asignar cama si se especifica
        if (id_cama) {
            const camaQuery = `
        SELECT c.id_cama, c.numero, c.estado, c.area, s.nombre as servicio
        FROM cama c
        LEFT JOIN servicio s ON c.id_servicio = s.id_servicio
        WHERE c.id_cama = $1
      `;
            const camaResponse = await client.query(camaQuery, [id_cama]);
            if (camaResponse.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'La cama especificada no existe'
                });
            }
            const cama = camaResponse.rows[0];
            if (cama.estado !== 'Disponible') {
                await client.query('ROLLBACK');
                return res.status(409).json({
                    success: false,
                    message: `La cama ${cama.numero} no está disponible. Estado actual: ${cama.estado}`
                });
            }
            // Marcar cama como ocupada
            await client.query(`UPDATE cama SET estado = 'Ocupada' WHERE id_cama = $1`, [id_cama]);
        }
        // Verificar servicio si se especifica
        if (id_servicio) {
            const servicioQuery = `
        SELECT id_servicio, nombre FROM servicio WHERE id_servicio = $1 AND activo = true
      `;
            const servicioResponse = await client.query(servicioQuery, [id_servicio]);
            if (servicioResponse.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'El servicio especificado no existe o está inactivo'
                });
            }
        }
        // Crear internamiento
        const insertInternamientoQuery = `
      INSERT INTO internamiento (
        id_expediente,
        id_cama,
        id_servicio,
        fecha_ingreso,
        motivo_ingreso,
        diagnostico_ingreso,
        id_medico_responsable,
        observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
        const internamientoResponse = await client.query(insertInternamientoQuery, [
            id_expediente,
            id_cama || null,
            id_servicio || null,
            fecha_ingreso,
            motivo_ingreso.trim(),
            diagnostico_ingreso?.trim() || null,
            id_medico_responsable,
            observaciones?.trim() || null
        ]);
        const nuevoInternamiento = internamientoResponse.rows[0];
        // Crear nota de ingreso si se solicita
        if (crear_nota_ingreso) {
            // Obtener ID del tipo de documento "Nota de Urgencias" o crear uno genérico
            const tipoDocumentoQuery = `
        SELECT id_tipo_documento 
        FROM tipo_documento 
        WHERE nombre IN ('Nota de Urgencias', 'Nota de Ingreso', 'Historia Clínica') 
        AND activo = true
        ORDER BY 
          CASE 
            WHEN nombre = 'Nota de Urgencias' THEN 1
            WHEN nombre = 'Nota de Ingreso' THEN 2
            WHEN nombre = 'Historia Clínica' THEN 3
          END
        LIMIT 1
      `;
            const tipoDocumentoResponse = await client.query(tipoDocumentoQuery);
            if (tipoDocumentoResponse.rows.length > 0) {
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
                    nuevoInternamiento.id_internamiento,
                    tipoDocumentoResponse.rows[0].id_tipo_documento,
                    id_medico_responsable,
                    fecha_ingreso
                ]);
                nuevoInternamiento.documento_ingreso_creado = true;
                nuevoInternamiento.id_documento_ingreso = documentoResponse.rows[0].id_documento;
            }
        }
        // Registrar auditoría
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            id_expediente,
            id_medico_responsable,
            'nuevo_internamiento',
            null,
            JSON.stringify({
                id_internamiento: nuevoInternamiento.id_internamiento,
                motivo_ingreso: motivo_ingreso,
                servicio: id_servicio,
                cama: id_cama
            }),
            `Internamiento creado para ${expediente.nombre_paciente}`
        ]);
        // Validar reingreso si es necesario
        const validacionReingreso = await client.query(`SELECT validar_reingreso_paciente($1, $2) as requiere_validacion`, [id_expediente, id_medico_responsable]);
        nuevoInternamiento.requiere_validacion_reingreso = validacionReingreso.rows[0]?.requiere_validacion || false;
        await client.query('COMMIT');
        return res.status(201).json({
            success: true,
            message: 'Internamiento creado correctamente',
            data: nuevoInternamiento
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear internamiento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear internamiento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.createInternamiento = createInternamiento;
// ==========================================
// ACTUALIZAR INTERNAMIENTO
// ==========================================
const updateInternamiento = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { id_servicio, id_cama, motivo_ingreso, diagnostico_ingreso, diagnostico_egreso, id_medico_responsable, observaciones, id_medico_modificador } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Obtener datos actuales del internamiento
        const internamientoActualQuery = `
      SELECT 
        i.*,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        c_actual.numero as cama_actual,
        s_actual.nombre as servicio_actual
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN cama c_actual ON i.id_cama = c_actual.id_cama
      LEFT JOIN servicio s_actual ON i.id_servicio = s_actual.id_servicio
      WHERE i.id_internamiento = $1
    `;
        const internamientoActualResponse = await client.query(internamientoActualQuery, [id]);
        if (internamientoActualResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Internamiento no encontrado'
            });
        }
        const internamientoActual = internamientoActualResponse.rows[0];
        // Verificar que el internamiento esté activo (no egresado)
        if (internamientoActual.fecha_egreso !== null) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'No se puede modificar un internamiento que ya fue egresado'
            });
        }
        // Validar cambio de cama si se especifica
        if (id_cama && id_cama !== internamientoActual.id_cama) {
            const nuevaCamaQuery = `
        SELECT c.id_cama, c.numero, c.estado, c.area, s.nombre as servicio
        FROM cama c
        LEFT JOIN servicio s ON c.id_servicio = s.id_servicio
        WHERE c.id_cama = $1
      `;
            const nuevaCamaResponse = await client.query(nuevaCamaQuery, [id_cama]);
            if (nuevaCamaResponse.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'La nueva cama especificada no existe'
                });
            }
            const nuevaCama = nuevaCamaResponse.rows[0];
            if (nuevaCama.estado !== 'Disponible') {
                await client.query('ROLLBACK');
                return res.status(409).json({
                    success: false,
                    message: `La cama ${nuevaCama.numero} no está disponible. Estado actual: ${nuevaCama.estado}`
                });
            }
            // Liberar cama actual
            if (internamientoActual.id_cama) {
                await client.query(`UPDATE cama SET estado = 'Disponible' WHERE id_cama = $1`, [internamientoActual.id_cama]);
            }
            // Ocupar nueva cama
            await client.query(`UPDATE cama SET estado = 'Ocupada' WHERE id_cama = $1`, [id_cama]);
        }
        // Validar nuevo médico responsable si se especifica
        if (id_medico_responsable && id_medico_responsable !== internamientoActual.id_medico_responsable) {
            const medicoQuery = `
        SELECT pm.id_personal_medico, pm.especialidad,
               CONCAT(p.nombre, ' ', p.apellido_paterno) as nombre_medico
        FROM personal_medico pm
        JOIN persona p ON pm.id_persona = p.id_persona
        WHERE pm.id_personal_medico = $1 AND pm.activo = true
      `;
            const medicoResponse = await client.query(medicoQuery, [id_medico_responsable]);
            if (medicoResponse.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'El nuevo médico responsable especificado no existe o está inactivo'
                });
            }
        }
        // Validar nuevo servicio si se especifica
        if (id_servicio && id_servicio !== internamientoActual.id_servicio) {
            const servicioQuery = `
        SELECT id_servicio, nombre FROM servicio WHERE id_servicio = $1 AND activo = true
      `;
            const servicioResponse = await client.query(servicioQuery, [id_servicio]);
            if (servicioResponse.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'El nuevo servicio especificado no existe o está inactivo'
                });
            }
        }
        // Actualizar internamiento
        const updateQuery = `
      UPDATE internamiento 
      SET 
        id_servicio = COALESCE($1, id_servicio),
        id_cama = COALESCE($2, id_cama),
        motivo_ingreso = COALESCE($3, motivo_ingreso),
        diagnostico_ingreso = COALESCE($4, diagnostico_ingreso),
        diagnostico_egreso = COALESCE($5, diagnostico_egreso),
        id_medico_responsable = COALESCE($6, id_medico_responsable),
        observaciones = COALESCE($7, observaciones)
      WHERE id_internamiento = $8
      RETURNING *
    `;
        const response = await client.query(updateQuery, [
            id_servicio || null,
            id_cama || null,
            motivo_ingreso?.trim() || null,
            diagnostico_ingreso?.trim() || null,
            diagnostico_egreso?.trim() || null,
            id_medico_responsable || null,
            observaciones?.trim() || null,
            id
        ]);
        // Registrar auditoría
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            internamientoActual.id_expediente,
            id_medico_modificador || id_medico_responsable || null,
            'actualizacion_internamiento',
            JSON.stringify({
                servicio_anterior: internamientoActual.servicio_actual,
                cama_anterior: internamientoActual.cama_actual,
                medico_anterior: internamientoActual.id_medico_responsable
            }),
            JSON.stringify({
                servicio_nuevo: id_servicio,
                cama_nueva: id_cama,
                medico_nuevo: id_medico_responsable
            }),
            `Internamiento actualizado para ${internamientoActual.nombre_paciente}`
        ]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: 'Internamiento actualizado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar internamiento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar internamiento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.updateInternamiento = updateInternamiento;
// ==========================================
// EGRESAR PACIENTE (CREAR EGRESO)
// ==========================================
const egresarPaciente = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { fecha_egreso = new Date(), diagnostico_egreso, tipo_egreso, observaciones, id_medico_egreso, crear_nota_egreso = true } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Validaciones básicas
        if (!diagnostico_egreso || diagnostico_egreso.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El diagnóstico de egreso es obligatorio'
            });
        }
        if (!tipo_egreso) {
            return res.status(400).json({
                success: false,
                message: 'El tipo de egreso es obligatorio'
            });
        }
        // Validar tipos de egreso permitidos
        const tiposPermitidos = ['Alta voluntaria', 'Mejoría', 'Referencia', 'Defunción', 'Máximo beneficio'];
        if (!tiposPermitidos.includes(tipo_egreso)) {
            return res.status(400).json({
                success: false,
                message: `El tipo de egreso debe ser uno de: ${tiposPermitidos.join(', ')}`
            });
        }
        if (!id_medico_egreso) {
            return res.status(400).json({
                success: false,
                message: 'El médico que autoriza el egreso es obligatorio'
            });
        }
        // Obtener datos del internamiento
        const internamientoQuery = `
      SELECT 
        i.*,
        e.id_expediente,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        c.numero as cama_numero,
        s.nombre as servicio_nombre
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE i.id_internamiento = $1
    `;
        const internamientoResponse = await client.query(internamientoQuery, [id]);
        if (internamientoResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Internamiento no encontrado'
            });
        }
        const internamiento = internamientoResponse.rows[0];
        // Verificar que el internamiento esté activo
        if (internamiento.fecha_egreso !== null) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'El internamiento ya fue egresado anteriormente'
            });
        }
        // Verificar que la fecha de egreso sea posterior al ingreso
        const fechaIngreso = new Date(internamiento.fecha_ingreso);
        const fechaEgresoDate = new Date(fecha_egreso);
        if (fechaEgresoDate <= fechaIngreso) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'La fecha de egreso debe ser posterior a la fecha de ingreso'
            });
        }
        // Verificar que el médico existe
        const medicoQuery = `
      SELECT pm.id_personal_medico, pm.especialidad,
             CONCAT(p.nombre, ' ', p.apellido_paterno) as nombre_medico
      FROM personal_medico pm
      JOIN persona p ON pm.id_persona = p.id_persona
      WHERE pm.id_personal_medico = $1 AND pm.activo = true
    `;
        const medicoResponse = await client.query(medicoQuery, [id_medico_egreso]);
        if (medicoResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'El médico que autoriza el egreso no existe o está inactivo'
            });
        }
        // Actualizar internamiento con datos de egreso
        const updateInternamientoQuery = `
      UPDATE internamiento 
      SET 
        fecha_egreso = $1,
        diagnostico_egreso = $2,
        tipo_egreso = $3,
        observaciones = CASE 
          WHEN observaciones IS NULL THEN $4
          ELSE CONCAT(observaciones, E'\n[EGRESO] ', $4)
        END
      WHERE id_internamiento = $5
      RETURNING *
    `;
        const internamientoActualizado = await client.query(updateInternamientoQuery, [
            fecha_egreso,
            diagnostico_egreso.trim(),
            tipo_egreso,
            observaciones?.trim() || `Egreso por ${tipo_egreso}`,
            id
        ]);
        // Liberar cama si estaba asignada
        if (internamiento.id_cama) {
            await client.query(`UPDATE cama SET estado = 'Disponible' WHERE id_cama = $1`, [internamiento.id_cama]);
        }
        // Crear nota de egreso si se solicita
        if (crear_nota_egreso) {
            const tipoDocumentoQuery = `
        SELECT id_tipo_documento 
        FROM tipo_documento 
        WHERE nombre = 'Nota de Egreso' AND activo = true
        LIMIT 1
      `;
            const tipoDocumentoResponse = await client.query(tipoDocumentoQuery);
            if (tipoDocumentoResponse.rows.length > 0) {
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
                    internamiento.id_expediente,
                    id,
                    tipoDocumentoResponse.rows[0].id_tipo_documento,
                    id_medico_egreso,
                    fecha_egreso
                ]);
                // Crear nota de egreso básica
                const insertNotaEgresoQuery = `
          INSERT INTO nota_egreso (
            id_documento,
            diagnostico_ingreso,
            diagnostico_egreso,
            motivo_egreso,
            pronostico
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id_nota_egreso
        `;
                await client.query(insertNotaEgresoQuery, [
                    documentoResponse.rows[0].id_documento,
                    internamiento.diagnostico_ingreso,
                    diagnostico_egreso,
                    tipo_egreso,
                    'Favorable' // Prognóstico por defecto
                ]);
                internamientoActualizado.rows[0].nota_egreso_creada = true;
                internamientoActualizado.rows[0].id_documento_egreso = documentoResponse.rows[0].id_documento;
            }
        }
        // Calcular días de estancia
        const diasEstancia = Math.floor((fechaEgresoDate.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24));
        // Registrar auditoría
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            internamiento.id_expediente,
            id_medico_egreso,
            'egreso_paciente',
            null,
            JSON.stringify({
                tipo_egreso: tipo_egreso,
                diagnostico_egreso: diagnostico_egreso,
                dias_estancia: diasEstancia,
                cama_liberada: internamiento.cama_numero,
                servicio: internamiento.servicio_nombre
            }),
            `Egreso de ${internamiento.nombre_paciente} - ${tipo_egreso}`
        ]);
        await client.query('COMMIT');
        const resultado = internamientoActualizado.rows[0];
        resultado.dias_estancia_total = diasEstancia;
        resultado.medico_egreso = medicoResponse.rows[0].nombre_medico;
        return res.status(200).json({
            success: true,
            message: 'Paciente egresado correctamente',
            data: resultado
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al egresar paciente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al egresar paciente',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.egresarPaciente = egresarPaciente;
// ==========================================
// OBTENER INTERNAMIENTOS ACTIVOS
// ==========================================
const getInternamientosActivos = async (req, res) => {
    try {
        const { servicio_id, medico_responsable_id } = req.query;
        let query = `
      SELECT 
        i.id_internamiento,
        i.fecha_ingreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        i.observaciones,
        
        -- Datos del expediente y paciente
        e.id_expediente,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        p.fecha_nacimiento,
        p.sexo,
        edad_en_anos(p.fecha_nacimiento) as edad,
        
        -- Datos del servicio y cama
        s.id_servicio,
        s.nombre as servicio,
        c.id_cama,
        c.numero as cama,
        c.area as area_cama,
        c.subarea as subarea_cama,
        
        -- Médico responsable
        pm.id_personal_medico,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable,
        pm.especialidad,
        
        -- Días de estancia
        EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - i.fecha_ingreso)) as dias_estancia,
        
        -- Última actividad documentada
        MAX(dc.fecha_elaboracion) as ultima_actividad,
        COUNT(dc.id_documento) as total_documentos
        
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      LEFT JOIN documento_clinico dc ON i.id_internamiento = dc.id_internamiento
      WHERE i.fecha_egreso IS NULL
    `;
        const params = [];
        let paramCounter = 1;
        if (servicio_id) {
            query += ` AND s.id_servicio = ${paramCounter}`;
            params.push(servicio_id);
            paramCounter++;
        }
        if (medico_responsable_id) {
            query += ` AND pm.id_personal_medico = ${paramCounter}`;
            params.push(medico_responsable_id);
            paramCounter++;
        }
        query += `
      GROUP BY i.id_internamiento, i.fecha_ingreso, i.motivo_ingreso, i.diagnostico_ingreso, 
               i.observaciones, e.id_expediente, e.numero_expediente, p.nombre, p.apellido_paterno, 
               p.apellido_materno, p.fecha_nacimiento, p.sexo, s.id_servicio, s.nombre,
               c.id_cama, c.numero, c.area, c.subarea, pm.id_personal_medico, pm_p.nombre, 
               pm_p.apellido_paterno, pm.especialidad
      ORDER BY i.fecha_ingreso DESC
    `;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Internamientos activos obtenidos correctamente',
            data: response.rows,
            total: response.rowCount,
            filtros_aplicados: {
                servicio_id: servicio_id || null,
                medico_responsable_id: medico_responsable_id || null
            }
        });
    }
    catch (error) {
        console.error('Error al obtener internamientos activos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener internamientos activos',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getInternamientosActivos = getInternamientosActivos;
// ==========================================
// OBTENER DASHBOARD DE INTERNAMIENTOS
// ==========================================
const getDashboardInternamientos = async (req, res) => {
    try {
        // Estadísticas generales
        const estadisticasQuery = `
      SELECT 
        COUNT(*) as total_internamientos_historicos,
        COUNT(CASE WHEN fecha_egreso IS NULL THEN 1 END) as internamientos_activos,
        COUNT(CASE WHEN fecha_egreso IS NOT NULL THEN 1 END) as internamientos_egresados,
        COUNT(CASE WHEN fecha_ingreso >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as ingresos_mes_actual,
        COUNT(CASE WHEN fecha_egreso >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as egresos_mes_actual,
        COUNT(CASE WHEN fecha_ingreso >= CURRENT_DATE THEN 1 END) as ingresos_hoy,
        COUNT(CASE WHEN fecha_egreso >= CURRENT_DATE THEN 1 END) as egresos_hoy,
        ROUND(AVG(CASE WHEN fecha_egreso IS NOT NULL THEN EXTRACT(DAYS FROM (fecha_egreso - fecha_ingreso)) END), 2) as promedio_estancia_dias
      FROM internamiento
    `;
        const estadisticasResponse = await database_1.default.query(estadisticasQuery);
        // Ocupación por servicio
        const ocupacionServiciosQuery = `
      SELECT 
        s.id_servicio,
        s.nombre as servicio,
        COUNT(c.id_cama) as total_camas,
        COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END) as camas_ocupadas,
        COUNT(CASE WHEN c.estado = 'Disponible' THEN 1 END) as camas_disponibles,
        COUNT(i.id_internamiento) as pacientes_actuales,
        ROUND(
          (COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END)::DECIMAL / 
           NULLIF(COUNT(c.id_cama), 0)) * 100, 2
        ) as porcentaje_ocupacion
      FROM servicio s
      LEFT JOIN cama c ON s.id_servicio = c.id_servicio
      LEFT JOIN internamiento i ON s.id_servicio = i.id_servicio AND i.fecha_egreso IS NULL
      WHERE s.activo = true
      GROUP BY s.id_servicio, s.nombre
      ORDER BY porcentaje_ocupacion DESC, s.nombre ASC
    `;
        const ocupacionServiciosResponse = await database_1.default.query(ocupacionServiciosQuery);
        // Pacientes con más días de estancia
        const estanciasProlongadasQuery = `
      SELECT 
        i.id_internamiento,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        i.fecha_ingreso,
        i.motivo_ingreso,
        s.nombre as servicio,
        c.numero as cama,
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable,
        EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - i.fecha_ingreso)) as dias_estancia
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      WHERE i.fecha_egreso IS NULL
      ORDER BY dias_estancia DESC
      LIMIT 10
    `;
        const estanciasProlongadasResponse = await database_1.default.query(estanciasProlongadasQuery);
        // Ingresos y egresos recientes
        const actividadRecienteQuery = `
      SELECT 
        'Ingreso' as tipo_actividad,
        i.fecha_ingreso as fecha_actividad,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        i.motivo_ingreso as detalle,
        s.nombre as servicio,
        c.numero as cama
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      WHERE i.fecha_ingreso >= CURRENT_DATE - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT 
        'Egreso' as tipo_actividad,
        i.fecha_egreso as fecha_actividad,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        CONCAT(i.tipo_egreso, ' - ', i.diagnostico_egreso) as detalle,
        s.nombre as servicio,
        c.numero as cama
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      WHERE i.fecha_egreso >= CURRENT_DATE - INTERVAL '7 days'
      
      ORDER BY fecha_actividad DESC
      LIMIT 15
    `;
        const actividadRecienteResponse = await database_1.default.query(actividadRecienteQuery);
        return res.status(200).json({
            success: true,
            message: 'Dashboard de internamientos obtenido correctamente',
            data: {
                estadisticas: estadisticasResponse.rows[0],
                ocupacion_por_servicio: ocupacionServiciosResponse.rows,
                estancias_prolongadas: estanciasProlongadasResponse.rows,
                actividad_reciente: actividadRecienteResponse.rows
            }
        });
    }
    catch (error) {
        console.error('Error al obtener dashboard de internamientos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener dashboard',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getDashboardInternamientos = getDashboardInternamientos;
// ==========================================
// OBTENER HISTORIAL DE INTERNAMIENTOS POR PACIENTE
// ==========================================
const getHistorialInternamientosPaciente = async (req, res) => {
    try {
        const { id_paciente } = req.params;
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
        // Obtener historial de internamientos
        const historialQuery = `
      SELECT 
        i.id_internamiento,
        i.fecha_ingreso,
        i.fecha_egreso,
        i.motivo_ingreso,
        i.diagnostico_ingreso,
        i.diagnostico_egreso,
        i.tipo_egreso,
        i.observaciones,
        
        -- Datos del expediente
        e.id_expediente,
        e.numero_expediente,
        
        -- Datos del servicio y cama
        s.nombre as servicio,
        c.numero as cama,
        c.area as area_cama,
        
        -- Médico responsable
        CONCAT(pm_p.nombre, ' ', pm_p.apellido_paterno) as medico_responsable,
        pm.especialidad,
        
        -- Cálculos
        CASE 
          WHEN i.fecha_egreso IS NOT NULL THEN 
            EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso))
          ELSE 
            EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - i.fecha_ingreso))
        END as dias_estancia,
        
        CASE 
          WHEN i.fecha_egreso IS NULL THEN 'Activo'
          ELSE 'Egresado'
        END as estado_internamiento,
        
        -- Estadísticas del internamiento
        COUNT(dc.id_documento) as total_documentos
        
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      LEFT JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      LEFT JOIN persona pm_p ON pm.id_persona = pm_p.id_persona
      LEFT JOIN documento_clinico dc ON i.id_internamiento = dc.id_internamiento
      WHERE e.id_paciente = $1
      GROUP BY i.id_internamiento, i.fecha_ingreso, i.fecha_egreso, i.motivo_ingreso, 
               i.diagnostico_ingreso, i.diagnostico_egreso, i.tipo_egreso, i.observaciones,
               e.id_expediente, e.numero_expediente, s.nombre, c.numero, c.area,
               pm_p.nombre, pm_p.apellido_paterno, pm.especialidad
      ORDER BY i.fecha_ingreso DESC
    `;
        const historialResponse = await database_1.default.query(historialQuery, [id_paciente]);
        // Estadísticas del paciente
        const estadisticasQuery = `
      SELECT 
        COUNT(*) as total_internamientos,
        COUNT(CASE WHEN fecha_egreso IS NULL THEN 1 END) as internamientos_activos,
        COUNT(CASE WHEN fecha_egreso IS NOT NULL THEN 1 END) as internamientos_completados,
        ROUND(AVG(CASE WHEN fecha_egreso IS NOT NULL THEN EXTRACT(DAYS FROM (fecha_egreso - fecha_ingreso)) END), 2) as promedio_estancia,
        MAX(fecha_ingreso) as ultimo_ingreso,
        MAX(fecha_egreso) as ultimo_egreso
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      WHERE e.id_paciente = $1
    `;
        const estadisticasResponse = await database_1.default.query(estadisticasQuery, [id_paciente]);
        return res.status(200).json({
            success: true,
            message: 'Historial de internamientos obtenido correctamente',
            data: {
                paciente: pacienteExisteResponse.rows[0],
                estadisticas: estadisticasResponse.rows[0],
                internamientos: historialResponse.rows
            }
        });
    }
    catch (error) {
        console.error('Error al obtener historial de internamientos del paciente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener historial',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getHistorialInternamientosPaciente = getHistorialInternamientosPaciente;
// ==========================================
// BUSCAR INTERNAMIENTOS (AUTOCOMPLETE)
// ==========================================
const buscarInternamientos = async (req, res) => {
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
        i.id_internamiento,
        i.fecha_ingreso,
        i.fecha_egreso,
        i.motivo_ingreso,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        p.curp,
        s.nombre as servicio,
        c.numero as cama,
        CASE 
          WHEN i.fecha_egreso IS NULL THEN 'Activo'
          ELSE 'Egresado'
        END as estado_internamiento
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      LEFT JOIN cama c ON i.id_cama = c.id_cama
      WHERE (
        UPPER(e.numero_expediente) LIKE UPPER($1) OR
        UPPER(p.nombre) LIKE UPPER($1) OR 
        UPPER(p.apellido_paterno) LIKE UPPER($1) OR 
        UPPER(p.apellido_materno) LIKE UPPER($1) OR
        UPPER(p.curp) LIKE UPPER($1) OR
        UPPER(i.motivo_ingreso) LIKE UPPER($1)
      )
    `;
        if (activos_solo === 'true') {
            query += ` AND i.fecha_egreso IS NULL`;
        }
        query += `
      ORDER BY i.fecha_ingreso DESC
      LIMIT 20
    `;
        const response = await database_1.default.query(query, [`%${q}%`]);
        return res.status(200).json({
            success: true,
            message: `${response.rowCount} internamiento(s) encontrado(s)`,
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al buscar internamientos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al buscar internamientos',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.buscarInternamientos = buscarInternamientos;
// ==========================================
// TRANSFERIR PACIENTE (CAMBIO DE SERVICIO/CAMA)
// ==========================================
const transferirPaciente = async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { nuevo_servicio_id, nueva_cama_id, motivo_transferencia, nuevo_medico_responsable_id, id_medico_autorizante, observaciones } = req.body;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        if (!motivo_transferencia || motivo_transferencia.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El motivo de transferencia es obligatorio'
            });
        }
        if (!id_medico_autorizante) {
            return res.status(400).json({
                success: false,
                message: 'El médico que autoriza la transferencia es obligatorio'
            });
        }
        // Obtener datos actuales del internamiento
        const internamientoQuery = `
      SELECT 
        i.*,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        s_actual.nombre as servicio_actual,
        c_actual.numero as cama_actual
      FROM internamiento i
      JOIN expediente e ON i.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN servicio s_actual ON i.id_servicio = s_actual.id_servicio
      LEFT JOIN cama c_actual ON i.id_cama = c_actual.id_cama
      WHERE i.id_internamiento = $1
    `;
        const internamientoResponse = await client.query(internamientoQuery, [id]);
        if (internamientoResponse.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Internamiento no encontrado'
            });
        }
        const internamiento = internamientoResponse.rows[0];
        // Verificar que el internamiento esté activo
        if (internamiento.fecha_egreso !== null) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'No se puede transferir un paciente ya egresado'
            });
        }
        // Validar nueva cama si se especifica
        if (nueva_cama_id) {
            const nuevaCamaQuery = `
        SELECT c.id_cama, c.numero, c.estado, c.area, s.nombre as servicio
        FROM cama c
        LEFT JOIN servicio s ON c.id_servicio = s.id_servicio
        WHERE c.id_cama = $1
      `;
            const nuevaCamaResponse = await client.query(nuevaCamaQuery, [nueva_cama_id]);
            if (nuevaCamaResponse.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'La nueva cama especificada no existe'
                });
            }
            const nuevaCama = nuevaCamaResponse.rows[0];
            if (nuevaCama.estado !== 'Disponible') {
                await client.query('ROLLBACK');
                return res.status(409).json({
                    success: false,
                    message: `La cama ${nuevaCama.numero} no está disponible. Estado actual: ${nuevaCama.estado}`
                });
            }
        }
        // Validar nuevo servicio si se especifica
        if (nuevo_servicio_id) {
            const nuevoServicioQuery = `
        SELECT id_servicio, nombre FROM servicio WHERE id_servicio = $1 AND activo = true
      `;
            const nuevoServicioResponse = await client.query(nuevoServicioQuery, [nuevo_servicio_id]);
            if (nuevoServicioResponse.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'El nuevo servicio especificado no existe o está inactivo'
                });
            }
        }
        // Validar nuevo médico responsable si se especifica
        if (nuevo_medico_responsable_id) {
            const nuevoMedicoQuery = `
        SELECT pm.id_personal_medico, pm.especialidad,
               CONCAT(p.nombre, ' ', p.apellido_paterno) as nombre_medico
        FROM personal_medico pm
        JOIN persona p ON pm.id_persona = p.id_persona
        WHERE pm.id_personal_medico = $1 AND pm.activo = true
      `;
            const nuevoMedicoResponse = await client.query(nuevoMedicoQuery, [nuevo_medico_responsable_id]);
            if (nuevoMedicoResponse.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'El nuevo médico responsable especificado no existe o está inactivo'
                });
            }
        }
        // Liberar cama actual si existe
        if (internamiento.id_cama) {
            await client.query(`UPDATE cama SET estado = 'Disponible' WHERE id_cama = $1`, [internamiento.id_cama]);
        }
        // Ocupar nueva cama si se especifica
        if (nueva_cama_id) {
            await client.query(`UPDATE cama SET estado = 'Ocupada' WHERE id_cama = $1`, [nueva_cama_id]);
        }
        // Actualizar internamiento con nuevos datos
        const updateQuery = `
      UPDATE internamiento 
      SET 
        id_servicio = COALESCE($1, id_servicio),
        id_cama = COALESCE($2, id_cama),
        id_medico_responsable = COALESCE($3, id_medico_responsable),
        observaciones = CASE 
          WHEN observaciones IS NULL THEN $4
          ELSE CONCAT(observaciones, E'\n[TRANSFERENCIA] ', CURRENT_TIMESTAMP::TEXT, ' - ', $4)
        END
      WHERE id_internamiento = $5
      RETURNING *
    `;
        const internamientoActualizado = await client.query(updateQuery, [
            nuevo_servicio_id || null,
            nueva_cama_id || null,
            nuevo_medico_responsable_id || null,
            `${motivo_transferencia}. ${observaciones || ''}`.trim(),
            id
        ]);
        // Registrar auditoría de transferencia
        await client.query(`SELECT registrar_auditoria($1, $2, $3, $4, $5, $6)`, [
            internamiento.id_expediente,
            id_medico_autorizante,
            'transferencia_paciente',
            JSON.stringify({
                servicio_anterior: internamiento.servicio_actual,
                cama_anterior: internamiento.cama_actual,
                medico_anterior: internamiento.id_medico_responsable
            }),
            JSON.stringify({
                servicio_nuevo: nuevo_servicio_id,
                cama_nueva: nueva_cama_id,
                medico_nuevo: nuevo_medico_responsable_id,
                motivo: motivo_transferencia
            }),
            `Transferencia de ${internamiento.nombre_paciente} - ${motivo_transferencia}`
        ]);
        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: 'Paciente transferido correctamente',
            data: internamientoActualizado.rows[0]
        });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al transferir paciente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al transferir paciente',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    finally {
        client.release();
    }
};
exports.transferirPaciente = transferirPaciente;
// ==========================================
// OBTENER ESTADÍSTICAS DE INTERNAMIENTOS
// ==========================================
const getEstadisticasInternamientos = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, servicio_id } = req.query;
        // Construir filtros de fecha
        let filtroFecha = '';
        const params = [];
        let paramCounter = 1;
        if (fecha_inicio && fecha_fin) {
            filtroFecha = ` AND i.fecha_ingreso BETWEEN ${paramCounter} AND ${paramCounter + 1}`;
            params.push(fecha_inicio, fecha_fin);
            paramCounter += 2;
        }
        else if (fecha_inicio) {
            filtroFecha = ` AND i.fecha_ingreso >= ${paramCounter}`;
            params.push(fecha_inicio);
            paramCounter++;
        }
        else if (fecha_fin) {
            filtroFecha = ` AND i.fecha_ingreso <= ${paramCounter}`;
            params.push(fecha_fin);
            paramCounter++;
        }
        // Filtro de servicio
        let filtroServicio = '';
        if (servicio_id) {
            filtroServicio = ` AND i.id_servicio = ${paramCounter}`;
            params.push(servicio_id);
            paramCounter++;
        }
        // Estadísticas por tipo de egreso
        const tipoEgresoQuery = `
      SELECT 
        COALESCE(tipo_egreso, 'Sin egreso') as tipo_egreso,
        COUNT(*) as total_casos,
        ROUND(AVG(CASE WHEN fecha_egreso IS NOT NULL THEN EXTRACT(DAYS FROM (fecha_egreso - fecha_ingreso)) END), 2) as promedio_estancia
      FROM internamiento i
      WHERE 1=1 ${filtroFecha} ${filtroServicio}
      GROUP BY tipo_egreso
      ORDER BY total_casos DESC
    `;
        const tipoEgresoResponse = await database_1.default.query(tipoEgresoQuery, params);
        // Estadísticas por servicio
        const servicioQuery = `
      SELECT 
        s.nombre as servicio,
        COUNT(i.id_internamiento) as total_internamientos,
        COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as activos_actuales,
        ROUND(AVG(CASE WHEN i.fecha_egreso IS NOT NULL THEN EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso)) END), 2) as promedio_estancia,
        MIN(CASE WHEN i.fecha_egreso IS NOT NULL THEN EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso)) END) as estancia_minima,
        MAX(CASE WHEN i.fecha_egreso IS NOT NULL THEN EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso)) END) as estancia_maxima
      FROM internamiento i
      LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
      WHERE 1=1 ${filtroFecha} ${filtroServicio}
      GROUP BY s.id_servicio, s.nombre
      ORDER BY total_internamientos DESC
    `;
        const servicioResponse = await database_1.default.query(servicioQuery, params);
        // Estadísticas por mes (últimos 12 meses)
        const mesQuery = `
      SELECT 
        TO_CHAR(i.fecha_ingreso, 'YYYY-MM') as mes,
        COUNT(*) as total_ingresos,
        COUNT(CASE WHEN i.fecha_egreso IS NOT NULL THEN 1 END) as total_egresos,
        ROUND(AVG(CASE WHEN i.fecha_egreso IS NOT NULL THEN EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso)) END), 2) as promedio_estancia_mes
      FROM internamiento i
      WHERE i.fecha_ingreso >= CURRENT_DATE - INTERVAL '12 months'
        ${servicio_id ? ` AND i.id_servicio = ${params.length + 1}` : ''}
      GROUP BY TO_CHAR(i.fecha_ingreso, 'YYYY-MM')
      ORDER BY mes DESC
    `;
        const mesParams = servicio_id ? [...params, servicio_id] : params;
        const mesResponse = await database_1.default.query(mesQuery, mesParams.slice(0, servicio_id ? mesParams.length : params.length));
        // Médicos con más internamientos
        const medicosQuery = `
      SELECT 
        CONCAT(p.nombre, ' ', p.apellido_paterno) as medico,
        pm.especialidad,
        COUNT(i.id_internamiento) as total_internamientos,
        COUNT(CASE WHEN i.fecha_egreso IS NULL THEN 1 END) as pacientes_actuales,
        ROUND(AVG(CASE WHEN i.fecha_egreso IS NOT NULL THEN EXTRACT(DAYS FROM (i.fecha_egreso - i.fecha_ingreso)) END), 2) as promedio_estancia
      FROM internamiento i
      JOIN personal_medico pm ON i.id_medico_responsable = pm.id_personal_medico
      JOIN persona p ON pm.id_persona = p.id_persona
      WHERE 1=1 ${filtroFecha} ${filtroServicio}
      GROUP BY pm.id_personal_medico, p.nombre, p.apellido_paterno, pm.especialidad
      ORDER BY total_internamientos DESC
      LIMIT 10
    `;
        const medicosResponse = await database_1.default.query(medicosQuery, params);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de internamientos obtenidas correctamente',
            data: {
                por_tipo_egreso: tipoEgresoResponse.rows,
                por_servicio: servicioResponse.rows,
                por_mes: mesResponse.rows,
                medicos_mas_activos: medicosResponse.rows
            },
            filtros_aplicados: {
                fecha_inicio: fecha_inicio || null,
                fecha_fin: fecha_fin || null,
                servicio_id: servicio_id || null
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de internamientos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasInternamientos = getEstadisticasInternamientos;
