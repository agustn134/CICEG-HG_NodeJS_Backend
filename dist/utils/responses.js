"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = exports.ResponseHelper = exports.sendSearchResults = exports.sendStatistics = exports.sendHealthCheck = exports.sendUpdated = exports.sendDeleted = exports.sendCreated = exports.sendForbidden = exports.sendUnauthorized = exports.sendConflict = exports.sendNotFound = exports.sendValidationError = exports.sendError = exports.sendSuccessWithPagination = exports.sendSuccess = void 0;
// ==========================================
// HELPER PARA RESPUESTAS EXITOSAS
// ==========================================
const sendSuccess = (res, message, data, statusCode = 200, total) => {
    const response = {
        success: true,
        message,
        ...(data !== undefined && { data }),
        ...(total !== undefined && { total })
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
// ==========================================
// HELPER PARA RESPUESTAS EXITOSAS CON PAGINACIÓN
// ==========================================
const sendSuccessWithPagination = (res, message, data, pagination, statusCode = 200) => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const paginationData = {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages,
        hasNextPage: pagination.page < totalPages,
        hasPrevPage: pagination.page > 1
    };
    const response = {
        success: true,
        message,
        data,
        total: pagination.total,
        pagination: paginationData
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccessWithPagination = sendSuccessWithPagination;
// ==========================================
// HELPER PARA RESPUESTAS DE ERROR
// ==========================================
const sendError = (res, message, statusCode = 500, error, details) => {
    const response = {
        success: false,
        message,
        ...(error && process.env.NODE_ENV === 'development' && { error }),
        ...(details && { details })
    };
    // Log del error para debugging
    if (error) {
        console.error(`Error ${statusCode}:`, message, error);
    }
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
// ==========================================
// HELPER PARA ERRORES DE VALIDACIÓN
// ==========================================
const sendValidationError = (res, message, validationErrors) => {
    return (0, exports.sendError)(res, message, 400, null, validationErrors);
};
exports.sendValidationError = sendValidationError;
// ==========================================
// HELPER PARA RECURSOS NO ENCONTRADOS
// ==========================================
const sendNotFound = (res, resource = 'Recurso') => {
    return (0, exports.sendError)(res, `${resource} no encontrado`, 404);
};
exports.sendNotFound = sendNotFound;
// ==========================================
// HELPER PARA CONFLICTOS (409)
// ==========================================
const sendConflict = (res, message, details) => {
    return (0, exports.sendError)(res, message, 409, null, details);
};
exports.sendConflict = sendConflict;
// ==========================================
// HELPER PARA ERRORES DE AUTORIZACIÓN
// ==========================================
const sendUnauthorized = (res, message = 'No autorizado') => {
    return (0, exports.sendError)(res, message, 401);
};
exports.sendUnauthorized = sendUnauthorized;
// ==========================================
// HELPER PARA ERRORES FORBIDDEN
// ==========================================
const sendForbidden = (res, message = 'Acceso denegado') => {
    return (0, exports.sendError)(res, message, 403);
};
exports.sendForbidden = sendForbidden;
// ==========================================
// HELPER PARA RESPUESTAS DE CREACIÓN
// ==========================================
const sendCreated = (res, message, data) => {
    return (0, exports.sendSuccess)(res, message, data, 201);
};
exports.sendCreated = sendCreated;
// ==========================================
// HELPER PARA RESPUESTAS DE ELIMINACIÓN
// ==========================================
const sendDeleted = (res, resource = 'Recurso') => {
    return (0, exports.sendSuccess)(res, `${resource} eliminado correctamente`, null, 200);
};
exports.sendDeleted = sendDeleted;
// ==========================================
// HELPER PARA RESPUESTAS DE ACTUALIZACIÓN
// ==========================================
const sendUpdated = (res, message, data) => {
    return (0, exports.sendSuccess)(res, message, data, 200);
};
exports.sendUpdated = sendUpdated;
// ==========================================
// HELPER PARA RESPUESTAS DE HEALTH CHECK
// ==========================================
const sendHealthCheck = (res, serviceName = 'API', additionalInfo) => {
    const healthData = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: serviceName,
        uptime: process.uptime(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        },
        ...(additionalInfo && { info: additionalInfo })
    };
    return (0, exports.sendSuccess)(res, `${serviceName} funcionando correctamente`, healthData);
};
exports.sendHealthCheck = sendHealthCheck;
// ==========================================
// HELPER PARA RESPUESTAS DE ESTADÍSTICAS
// ==========================================
const sendStatistics = (res, title, statistics, summary) => {
    const statsData = {
        titulo: title,
        fecha_consulta: new Date().toISOString(),
        estadisticas: statistics,
        ...(summary && { resumen: summary })
    };
    return (0, exports.sendSuccess)(res, `Estadísticas de ${title.toLowerCase()} obtenidas correctamente`, statsData);
};
exports.sendStatistics = sendStatistics;
// ==========================================
// HELPER PARA RESPUESTAS DE BÚSQUEDA
// ==========================================
const sendSearchResults = (res, query, results, total, searchTime) => {
    const searchData = {
        consulta: query,
        resultados: results,
        total_encontrados: total,
        tiempo_busqueda: searchTime || null,
        fecha_busqueda: new Date().toISOString()
    };
    return (0, exports.sendSuccess)(res, `Búsqueda completada. ${total} resultado(s) encontrado(s)`, searchData, 200, total);
};
exports.sendSearchResults = sendSearchResults;
// ==========================================
// HELPER PARA EXPORTAR MÚLTIPLES RESPUESTAS
// ==========================================
exports.ResponseHelper = {
    success: exports.sendSuccess,
    successWithPagination: exports.sendSuccessWithPagination,
    error: exports.sendError,
    validationError: exports.sendValidationError,
    notFound: exports.sendNotFound,
    conflict: exports.sendConflict,
    unauthorized: exports.sendUnauthorized,
    forbidden: exports.sendForbidden,
    created: exports.sendCreated,
    deleted: exports.sendDeleted,
    updated: exports.sendUpdated,
    healthCheck: exports.sendHealthCheck,
    statistics: exports.sendStatistics,
    searchResults: exports.sendSearchResults
};
// ==========================================
// CONSTANTES PARA MENSAJES COMUNES
// ==========================================
exports.MESSAGES = {
    // Éxito
    SUCCESS: {
        CREATED: 'Recurso creado correctamente',
        UPDATED: 'Recurso actualizado correctamente',
        DELETED: 'Recurso eliminado correctamente',
        FOUND: 'Recurso encontrado correctamente',
        LIST: 'Lista obtenida correctamente'
    },
    // Errores
    ERROR: {
        NOT_FOUND: 'Recurso no encontrado',
        INVALID_ID: 'El ID debe ser un número válido',
        REQUIRED_FIELD: 'Campo obligatorio faltante',
        DUPLICATE: 'El recurso ya existe',
        IN_USE: 'No se puede eliminar, el recurso está en uso',
        INTERNAL: 'Error interno del servidor',
        UNAUTHORIZED: 'No autorizado',
        FORBIDDEN: 'Acceso denegado',
        VALIDATION: 'Error de validación'
    },
    // Específicos del hospital
    HOSPITAL: {
        PATIENT_NOT_FOUND: 'Paciente no encontrado',
        DOCTOR_NOT_FOUND: 'Médico no encontrado',
        EXPEDIENTE_NOT_FOUND: 'Expediente no encontrado',
        BED_OCCUPIED: 'La cama está ocupada',
        INVALID_CURP: 'CURP inválido',
        DUPLICATE_EXPEDIENTE: 'Ya existe un expediente para este paciente'
    }
};
