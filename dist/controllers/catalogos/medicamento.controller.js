"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstadisticasMedicamentos = exports.getMedicamentosActivos = exports.deleteMedicamento = exports.updateMedicamento = exports.createMedicamento = exports.getMedicamentoById = exports.getMedicamentos = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODOS LOS MEDICAMENTOS
// ==========================================
const getMedicamentos = async (req, res) => {
    try {
        const { grupo_terapeutico, presentacion, activo, buscar } = req.query;
        let query = `
      SELECT 
        m.id_medicamento,
        m.codigo,
        m.nombre,
        m.presentacion,
        m.concentracion,
        m.grupo_terapeutico,
        m.activo,
        COUNT(pm.id_prescripcion) as total_prescripciones,
        COUNT(CASE WHEN pm.activo = true THEN 1 END) as prescripciones_activas,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as prescripciones_mes_actual
      FROM medicamento m
      LEFT JOIN prescripcion_medicamento pm ON m.id_medicamento = pm.id_medicamento
      LEFT JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      WHERE 1=1
    `;
        const params = [];
        let paramCounter = 1;
        // Filtrar por grupo terapéutico si se especifica
        if (grupo_terapeutico) {
            query += ` AND UPPER(m.grupo_terapeutico) LIKE UPPER($${paramCounter})`;
            params.push(`%${grupo_terapeutico}%`);
            paramCounter++;
        }
        // Filtrar por presentación si se especifica
        if (presentacion) {
            query += ` AND UPPER(m.presentacion) LIKE UPPER($${paramCounter})`;
            params.push(`%${presentacion}%`);
            paramCounter++;
        }
        // Filtrar por estado activo si se especifica
        if (activo !== undefined) {
            query += ` AND m.activo = $${paramCounter}`;
            params.push(activo === 'true');
            paramCounter++;
        }
        // Búsqueda general por nombre o código
        if (buscar) {
            query += ` AND (UPPER(m.nombre) LIKE UPPER($${paramCounter}) OR UPPER(m.codigo) LIKE UPPER($${paramCounter}))`;
            params.push(`%${buscar}%`);
            paramCounter++;
        }
        query += `
      GROUP BY m.id_medicamento, m.codigo, m.nombre, m.presentacion, 
               m.concentracion, m.grupo_terapeutico, m.activo
      ORDER BY m.grupo_terapeutico ASC, m.nombre ASC
    `;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Medicamentos obtenidos correctamente',
            data: response.rows,
            total: response.rowCount,
            filtros_aplicados: {
                grupo_terapeutico: grupo_terapeutico || 'todos',
                presentacion: presentacion || 'todas',
                activo: activo || 'todos',
                buscar: buscar || 'sin filtro'
            }
        });
    }
    catch (error) {
        console.error('Error al obtener medicamentos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener medicamentos',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getMedicamentos = getMedicamentos;
// ==========================================
// OBTENER MEDICAMENTO POR ID
// ==========================================
const getMedicamentoById = async (req, res) => {
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
        m.id_medicamento,
        m.codigo,
        m.nombre,
        m.presentacion,
        m.concentracion,
        m.grupo_terapeutico,
        m.activo,
        COUNT(pm.id_prescripcion) as total_prescripciones,
        COUNT(CASE WHEN pm.activo = true THEN 1 END) as prescripciones_activas,
        COUNT(CASE WHEN pm.activo = false THEN 1 END) as prescripciones_suspendidas,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as prescripciones_semana,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as prescripciones_mes
      FROM medicamento m
      LEFT JOIN prescripcion_medicamento pm ON m.id_medicamento = pm.id_medicamento
      LEFT JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      WHERE m.id_medicamento = $1
      GROUP BY m.id_medicamento, m.codigo, m.nombre, m.presentacion, 
               m.concentracion, m.grupo_terapeutico, m.activo
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Medicamento no encontrado'
            });
        }
        // Obtener las últimas 10 prescripciones de este medicamento
        const prescripcionesQuery = `
      SELECT 
        pm.id_prescripcion,
        pm.dosis,
        pm.via_administracion,
        pm.frecuencia,
        pm.duracion,
        pm.fecha_inicio,
        pm.fecha_fin,
        pm.activo,
        e.numero_expediente,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
        CONCAT(med_p.nombre, ' ', med_p.apellido_paterno) as medico_prescriptor,
        dc.fecha_elaboracion
      FROM prescripcion_medicamento pm
      JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      JOIN expediente e ON dc.id_expediente = e.id_expediente
      JOIN paciente pac ON e.id_paciente = pac.id_paciente
      JOIN persona p ON pac.id_persona = p.id_persona
      LEFT JOIN personal_medico med ON dc.id_personal_creador = med.id_personal_medico
      LEFT JOIN persona med_p ON med.id_persona = med_p.id_persona
      WHERE pm.id_medicamento = $1
      ORDER BY dc.fecha_elaboracion DESC
      LIMIT 10
    `;
        const prescripcionesResponse = await database_1.default.query(prescripcionesQuery, [id]);
        const medicamentoData = response.rows[0];
        medicamentoData.ultimas_prescripciones = prescripcionesResponse.rows;
        return res.status(200).json({
            success: true,
            message: 'Medicamento encontrado correctamente',
            data: medicamentoData
        });
    }
    catch (error) {
        console.error('Error al obtener medicamento por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener medicamento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getMedicamentoById = getMedicamentoById;
// ==========================================
// CREAR NUEVO MEDICAMENTO
// ==========================================
const createMedicamento = async (req, res) => {
    try {
        const { codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo = true } = req.body;
        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre del medicamento es obligatorio'
            });
        }
        // Verificar si ya existe un medicamento con el mismo código (si se proporciona)
        if (codigo && codigo.trim() !== '') {
            const existeCodigoQuery = `
        SELECT id_medicamento 
        FROM medicamento 
        WHERE UPPER(codigo) = UPPER($1)
      `;
            const existeCodigoResponse = await database_1.default.query(existeCodigoQuery, [codigo.trim()]);
            if (existeCodigoResponse.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un medicamento con ese código'
                });
            }
        }
        // Verificar si ya existe un medicamento con el mismo nombre, presentación y concentración
        const existeQuery = `
      SELECT id_medicamento 
      FROM medicamento 
      WHERE UPPER(nombre) = UPPER($1) 
        AND UPPER(COALESCE(presentacion, '')) = UPPER(COALESCE($2, ''))
        AND UPPER(COALESCE(concentracion, '')) = UPPER(COALESCE($3, ''))
    `;
        const existeResponse = await database_1.default.query(existeQuery, [
            nombre.trim(),
            presentacion?.trim() || '',
            concentracion?.trim() || ''
        ]);
        if (existeResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un medicamento con ese nombre, presentación y concentración'
            });
        }
        // Insertar nuevo medicamento
        const insertQuery = `
      INSERT INTO medicamento (codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
        const response = await database_1.default.query(insertQuery, [
            codigo?.trim() || null,
            nombre.trim(),
            presentacion?.trim() || null,
            concentracion?.trim() || null,
            grupo_terapeutico?.trim() || null,
            activo
        ]);
        return res.status(201).json({
            success: true,
            message: 'Medicamento creado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear medicamento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear medicamento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createMedicamento = createMedicamento;
// ==========================================
// ACTUALIZAR MEDICAMENTO
// ==========================================
const updateMedicamento = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo } = req.body;
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
                message: 'El nombre del medicamento es obligatorio'
            });
        }
        // Verificar si el medicamento existe
        const existeQuery = `
      SELECT id_medicamento 
      FROM medicamento 
      WHERE id_medicamento = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Medicamento no encontrado'
            });
        }
        // Verificar si ya existe otro medicamento con el mismo código (si se proporciona)
        if (codigo && codigo.trim() !== '') {
            const duplicadoCodigoQuery = `
        SELECT id_medicamento 
        FROM medicamento 
        WHERE UPPER(codigo) = UPPER($1) AND id_medicamento != $2
      `;
            const duplicadoCodigoResponse = await database_1.default.query(duplicadoCodigoQuery, [codigo.trim(), id]);
            if (duplicadoCodigoResponse.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe otro medicamento con ese código'
                });
            }
        }
        // Verificar si ya existe otro medicamento con la misma combinación
        const duplicadoQuery = `
      SELECT id_medicamento 
      FROM medicamento 
      WHERE UPPER(nombre) = UPPER($1) 
        AND UPPER(COALESCE(presentacion, '')) = UPPER(COALESCE($2, ''))
        AND UPPER(COALESCE(concentracion, '')) = UPPER(COALESCE($3, ''))
        AND id_medicamento != $4
    `;
        const duplicadoResponse = await database_1.default.query(duplicadoQuery, [
            nombre.trim(),
            presentacion?.trim() || '',
            concentracion?.trim() || '',
            id
        ]);
        if (duplicadoResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe otro medicamento con ese nombre, presentación y concentración'
            });
        }
        // Actualizar medicamento
        const updateQuery = `
      UPDATE medicamento 
      SET 
        codigo = $1, 
        nombre = $2, 
        presentacion = $3, 
        concentracion = $4, 
        grupo_terapeutico = $5, 
        activo = $6
      WHERE id_medicamento = $7 
      RETURNING *
    `;
        const response = await database_1.default.query(updateQuery, [
            codigo?.trim() || null,
            nombre.trim(),
            presentacion?.trim() || null,
            concentracion?.trim() || null,
            grupo_terapeutico?.trim() || null,
            activo,
            id
        ]);
        return res.status(200).json({
            success: true,
            message: 'Medicamento actualizado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al actualizar medicamento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar medicamento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateMedicamento = updateMedicamento;
// ==========================================
// ELIMINAR MEDICAMENTO
// ==========================================
const deleteMedicamento = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar que el ID sea un número
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar si el medicamento existe
        const existeQuery = `
      SELECT id_medicamento, nombre 
      FROM medicamento 
      WHERE id_medicamento = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Medicamento no encontrado'
            });
        }
        // Verificar si el medicamento está siendo usado
        const usoQuery = `
      SELECT COUNT(*) as total
      FROM prescripcion_medicamento 
      WHERE id_medicamento = $1
    `;
        const usoResponse = await database_1.default.query(usoQuery, [id]);
        const totalUso = parseInt(usoResponse.rows[0].total);
        if (totalUso > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar el medicamento. Tiene ${totalUso} prescripción(es) asociada(s)`,
                details: {
                    prescripciones_asociadas: totalUso
                }
            });
        }
        // Eliminar medicamento
        const deleteQuery = `
      DELETE FROM medicamento 
      WHERE id_medicamento = $1 
      RETURNING nombre
    `;
        const response = await database_1.default.query(deleteQuery, [id]);
        return res.status(200).json({
            success: true,
            message: `Medicamento "${response.rows[0].nombre}" eliminado correctamente`
        });
    }
    catch (error) {
        console.error('Error al eliminar medicamento:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar medicamento',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.deleteMedicamento = deleteMedicamento;
// ==========================================
// OBTENER MEDICAMENTOS ACTIVOS (PARA SELECTS)
// ==========================================
const getMedicamentosActivos = async (req, res) => {
    try {
        const { grupo_terapeutico, buscar } = req.query;
        let query = `
      SELECT 
        id_medicamento,
        codigo,
        nombre,
        presentacion,
        concentracion,
        grupo_terapeutico
      FROM medicamento 
      WHERE activo = true
    `;
        const params = [];
        let paramCounter = 1;
        // Filtrar por grupo terapéutico si se especifica
        if (grupo_terapeutico) {
            query += ` AND grupo_terapeutico = $${paramCounter}`;
            params.push(grupo_terapeutico);
            paramCounter++;
        }
        // Búsqueda por nombre o código si se especifica
        if (buscar) {
            query += ` AND (UPPER(nombre) LIKE UPPER($${paramCounter}) OR UPPER(codigo) LIKE UPPER($${paramCounter}))`;
            params.push(`%${buscar}%`);
            paramCounter++;
        }
        query += ` ORDER BY grupo_terapeutico ASC, nombre ASC`;
        const response = await database_1.default.query(query, params);
        return res.status(200).json({
            success: true,
            message: 'Medicamentos activos obtenidos correctamente',
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al obtener medicamentos activos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener medicamentos activos',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getMedicamentosActivos = getMedicamentosActivos;
// ==========================================
// OBTENER ESTADÍSTICAS DE MEDICAMENTOS
// ==========================================
const getEstadisticasMedicamentos = async (req, res) => {
    try {
        const query = `
      SELECT 
        COALESCE(m.grupo_terapeutico, 'Sin grupo') as grupo_terapeutico,
        COUNT(m.id_medicamento) as total_medicamentos,
        COUNT(CASE WHEN m.activo = true THEN 1 END) as medicamentos_activos,
        COUNT(pm.id_prescripcion) as total_prescripciones,
        COUNT(CASE WHEN pm.activo = true THEN 1 END) as prescripciones_activas,
        COUNT(CASE WHEN dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as prescripciones_mes_actual
      FROM medicamento m
      LEFT JOIN prescripcion_medicamento pm ON m.id_medicamento = pm.id_medicamento
      LEFT JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
      GROUP BY m.grupo_terapeutico
      ORDER BY total_prescripciones DESC, m.grupo_terapeutico ASC
    `;
        const response = await database_1.default.query(query);
        // Calcular estadísticas generales
        const totalMedicamentos = response.rows.reduce((sum, row) => sum + parseInt(row.total_medicamentos), 0);
        const medicamentosActivos = response.rows.reduce((sum, row) => sum + parseInt(row.medicamentos_activos), 0);
        const totalPrescripciones = response.rows.reduce((sum, row) => sum + parseInt(row.total_prescripciones), 0);
        const prescripcionesActivas = response.rows.reduce((sum, row) => sum + parseInt(row.prescripciones_activas), 0);
        const prescripcionesMes = response.rows.reduce((sum, row) => sum + parseInt(row.prescripciones_mes_actual), 0);
        // Obtener los medicamentos más prescritos
        const masPrescritos = `
      SELECT 
        m.id_medicamento,
        m.codigo,
        m.nombre,
        m.presentacion,
        m.concentracion,
        m.grupo_terapeutico,
        COUNT(pm.id_prescripcion) as total_prescripciones,
        COUNT(CASE WHEN pm.activo = true THEN 1 END) as prescripciones_activas
      FROM medicamento m
      LEFT JOIN prescripcion_medicamento pm ON m.id_medicamento = pm.id_medicamento
      WHERE m.activo = true
      GROUP BY m.id_medicamento, m.codigo, m.nombre, m.presentacion, m.concentracion, m.grupo_terapeutico
      HAVING COUNT(pm.id_prescripcion) > 0
      ORDER BY total_prescripciones DESC
      LIMIT 15
    `;
        const masPrescritosResponse = await database_1.default.query(masPrescritos);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de medicamentos obtenidas correctamente',
            data: {
                por_grupo_terapeutico: response.rows,
                mas_prescritos: masPrescritosResponse.rows,
                resumen: {
                    total_medicamentos: totalMedicamentos,
                    medicamentos_activos: medicamentosActivos,
                    total_prescripciones_historicas: totalPrescripciones,
                    prescripciones_activas: prescripcionesActivas,
                    prescripciones_mes_actual: prescripcionesMes,
                    grupos_terapeuticos: response.rows.length,
                    promedio_prescripciones_por_medicamento: totalMedicamentos > 0 ? Math.round(totalPrescripciones / totalMedicamentos) : 0
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de medicamentos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasMedicamentos = getEstadisticasMedicamentos;
