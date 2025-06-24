"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstadisticasTiposSangre = exports.deleteTipoSangre = exports.updateTipoSangre = exports.createTipoSangre = exports.getTipoSangreById = exports.getTiposSangre = void 0;
const database_1 = __importDefault(require("../../config/database"));
// ==========================================
// OBTENER TODOS LOS TIPOS DE SANGRE
// ==========================================
const getTiposSangre = async (req, res) => {
    try {
        const query = `
      SELECT 
        id_tipo_sangre,
        nombre,
        descripcion
      FROM tipo_sangre 
      ORDER BY nombre ASC
    `;
        const response = await database_1.default.query(query);
        return res.status(200).json({
            success: true,
            message: 'Tipos de sangre obtenidos correctamente',
            data: response.rows,
            total: response.rowCount
        });
    }
    catch (error) {
        console.error('Error al obtener tipos de sangre:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener tipos de sangre',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getTiposSangre = getTiposSangre;
// ==========================================
// OBTENER TIPO DE SANGRE POR ID
// ==========================================
const getTipoSangreById = async (req, res) => {
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
        id_tipo_sangre,
        nombre,
        descripcion
      FROM tipo_sangre 
      WHERE id_tipo_sangre = $1
    `;
        const response = await database_1.default.query(query, [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de sangre no encontrado'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Tipo de sangre encontrado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al obtener tipo de sangre por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener tipo de sangre',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getTipoSangreById = getTipoSangreById;
// ==========================================
// CREAR NUEVO TIPO DE SANGRE
// ==========================================
const createTipoSangre = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre del tipo de sangre es obligatorio'
            });
        }
        // Verificar si ya existe un tipo de sangre con el mismo nombre
        const existeQuery = `
      SELECT id_tipo_sangre 
      FROM tipo_sangre 
      WHERE UPPER(nombre) = UPPER($1)
    `;
        const existeResponse = await database_1.default.query(existeQuery, [nombre.trim()]);
        if (existeResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un tipo de sangre con ese nombre'
            });
        }
        // Insertar nuevo tipo de sangre
        const insertQuery = `
      INSERT INTO tipo_sangre (nombre, descripcion) 
      VALUES ($1, $2) 
      RETURNING id_tipo_sangre, nombre, descripcion
    `;
        const response = await database_1.default.query(insertQuery, [
            nombre.trim(),
            descripcion?.trim() || null
        ]);
        return res.status(201).json({
            success: true,
            message: 'Tipo de sangre creado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al crear tipo de sangre:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear tipo de sangre',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.createTipoSangre = createTipoSangre;
// ==========================================
// ACTUALIZAR TIPO DE SANGRE
// ==========================================
const updateTipoSangre = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
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
                message: 'El nombre del tipo de sangre es obligatorio'
            });
        }
        // Verificar si el tipo de sangre existe
        const existeQuery = `
      SELECT id_tipo_sangre 
      FROM tipo_sangre 
      WHERE id_tipo_sangre = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de sangre no encontrado'
            });
        }
        // Verificar si ya existe otro tipo de sangre con el mismo nombre
        const duplicadoQuery = `
      SELECT id_tipo_sangre 
      FROM tipo_sangre 
      WHERE UPPER(nombre) = UPPER($1) AND id_tipo_sangre != $2
    `;
        const duplicadoResponse = await database_1.default.query(duplicadoQuery, [nombre.trim(), id]);
        if (duplicadoResponse.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe otro tipo de sangre con ese nombre'
            });
        }
        // Actualizar tipo de sangre
        const updateQuery = `
      UPDATE tipo_sangre 
      SET nombre = $1, descripcion = $2 
      WHERE id_tipo_sangre = $3 
      RETURNING id_tipo_sangre, nombre, descripcion
    `;
        const response = await database_1.default.query(updateQuery, [
            nombre.trim(),
            descripcion?.trim() || null,
            id
        ]);
        return res.status(200).json({
            success: true,
            message: 'Tipo de sangre actualizado correctamente',
            data: response.rows[0]
        });
    }
    catch (error) {
        console.error('Error al actualizar tipo de sangre:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar tipo de sangre',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.updateTipoSangre = updateTipoSangre;
// ==========================================
// ELIMINAR TIPO DE SANGRE
// ==========================================
const deleteTipoSangre = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar que el ID sea un número
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }
        // Verificar si el tipo de sangre existe
        const existeQuery = `
      SELECT id_tipo_sangre 
      FROM tipo_sangre 
      WHERE id_tipo_sangre = $1
    `;
        const existeResponse = await database_1.default.query(existeQuery, [id]);
        if (existeResponse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de sangre no encontrado'
            });
        }
        // Verificar si el tipo de sangre está siendo usado
        const usoQuery = `
      SELECT COUNT(*) as total
      FROM persona 
      WHERE tipo_sangre_id = $1
    `;
        const usoResponse = await database_1.default.query(usoQuery, [id]);
        const totalUso = parseInt(usoResponse.rows[0].total);
        if (totalUso > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar el tipo de sangre. Está siendo usado por ${totalUso} persona(s)`,
                details: {
                    personas_afectadas: totalUso
                }
            });
        }
        // Eliminar tipo de sangre
        const deleteQuery = `
      DELETE FROM tipo_sangre 
      WHERE id_tipo_sangre = $1 
      RETURNING nombre
    `;
        const response = await database_1.default.query(deleteQuery, [id]);
        return res.status(200).json({
            success: true,
            message: `Tipo de sangre "${response.rows[0].nombre}" eliminado correctamente`
        });
    }
    catch (error) {
        console.error('Error al eliminar tipo de sangre:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar tipo de sangre',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.deleteTipoSangre = deleteTipoSangre;
// ==========================================
// OBTENER ESTADÍSTICAS DE TIPOS DE SANGRE
// ==========================================
const getEstadisticasTiposSangre = async (req, res) => {
    try {
        const query = `
      SELECT 
        ts.id_tipo_sangre,
        ts.nombre,
        ts.descripcion,
        COUNT(p.id_persona) as total_personas,
        COUNT(CASE WHEN p.es_pediatrico = true THEN 1 END) as total_pediatricos,
        COUNT(CASE WHEN p.es_pediatrico = false OR p.es_pediatrico IS NULL THEN 1 END) as total_adultos
      FROM tipo_sangre ts
      LEFT JOIN persona p ON ts.id_tipo_sangre = p.tipo_sangre_id
      GROUP BY ts.id_tipo_sangre, ts.nombre, ts.descripcion
      ORDER BY total_personas DESC, ts.nombre ASC
    `;
        const response = await database_1.default.query(query);
        // Calcular estadísticas generales
        const totalPersonas = response.rows.reduce((sum, row) => sum + parseInt(row.total_personas), 0);
        const totalPediatricos = response.rows.reduce((sum, row) => sum + parseInt(row.total_pediatricos), 0);
        const totalAdultos = response.rows.reduce((sum, row) => sum + parseInt(row.total_adultos), 0);
        return res.status(200).json({
            success: true,
            message: 'Estadísticas de tipos de sangre obtenidas correctamente',
            data: {
                tipos_sangre: response.rows,
                resumen: {
                    total_tipos_registrados: response.rows.length,
                    total_personas: totalPersonas,
                    total_pediatricos: totalPediatricos,
                    total_adultos: totalAdultos
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de tipos de sangre:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};
exports.getEstadisticasTiposSangre = getEstadisticasTiposSangre;
