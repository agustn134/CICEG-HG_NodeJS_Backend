// src/utils/responses.ts
import { Response } from 'express';

// ==========================================
// INTERFACES PARA RESPUESTAS ESTÁNDAR
// ==========================================
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  total?: number;
  error?: any;
  details?: any;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponseWithPagination extends ApiResponse {
  pagination?: PaginationData;
}

// ==========================================
// HELPER PARA RESPUESTAS EXITOSAS
// ==========================================
export const sendSuccess = (
  res: Response, 
  message: string, 
  data?: any, 
  statusCode: number = 200,
  total?: number
): Response => {
  const response: ApiResponse = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(total !== undefined && { total })
  };
  
  return res.status(statusCode).json(response);
};

// ==========================================
// HELPER PARA RESPUESTAS EXITOSAS CON PAGINACIÓN
// ==========================================
export const sendSuccessWithPagination = (
  res: Response,
  message: string,
  data: any,
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  statusCode: number = 200
): Response => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  const paginationData: PaginationData = {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPrevPage: pagination.page > 1
  };
  
  const response: ApiResponseWithPagination = {
    success: true,
    message,
    data,
    total: pagination.total,
    pagination: paginationData
  };
  
  return res.status(statusCode).json(response);
};

// ==========================================
// HELPER PARA RESPUESTAS DE ERROR
// ==========================================
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: any,
  details?: any
): Response => {
  const response: ApiResponse = {
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

// ==========================================
// HELPER PARA ERRORES DE VALIDACIÓN
// ==========================================
export const sendValidationError = (
  res: Response,
  message: string,
  validationErrors?: any
): Response => {
  return sendError(res, message, 400, null, validationErrors);
};

// ==========================================
// HELPER PARA RECURSOS NO ENCONTRADOS
// ==========================================
export const sendNotFound = (
  res: Response,
  resource: string = 'Recurso'
): Response => {
  return sendError(res, `${resource} no encontrado`, 404);
};

// ==========================================
// HELPER PARA CONFLICTOS (409)
// ==========================================
export const sendConflict = (
  res: Response,
  message: string,
  details?: any
): Response => {
  return sendError(res, message, 409, null, details);
};

// ==========================================
// HELPER PARA ERRORES DE AUTORIZACIÓN
// ==========================================
export const sendUnauthorized = (
  res: Response,
  message: string = 'No autorizado'
): Response => {
  return sendError(res, message, 401);
};

// ==========================================
// HELPER PARA ERRORES FORBIDDEN
// ==========================================
export const sendForbidden = (
  res: Response,
  message: string = 'Acceso denegado'
): Response => {
  return sendError(res, message, 403);
};

// ==========================================
// HELPER PARA RESPUESTAS DE CREACIÓN
// ==========================================
export const sendCreated = (
  res: Response,
  message: string,
  data?: any
): Response => {
  return sendSuccess(res, message, data, 201);
};

// ==========================================
// HELPER PARA RESPUESTAS DE ELIMINACIÓN
// ==========================================
export const sendDeleted = (
  res: Response,
  resource: string = 'Recurso'
): Response => {
  return sendSuccess(res, `${resource} eliminado correctamente`, null, 200);
};

// ==========================================
// HELPER PARA RESPUESTAS DE ACTUALIZACIÓN
// ==========================================
export const sendUpdated = (
  res: Response,
  message: string,
  data?: any
): Response => {
  return sendSuccess(res, message, data, 200);
};

// ==========================================
// HELPER PARA RESPUESTAS DE HEALTH CHECK
// ==========================================
export const sendHealthCheck = (
  res: Response,
  serviceName: string = 'API',
  additionalInfo?: any
): Response => {
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
  
  return sendSuccess(res, `${serviceName} funcionando correctamente`, healthData);
};

// ==========================================
// HELPER PARA RESPUESTAS DE ESTADÍSTICAS
// ==========================================
export const sendStatistics = (
  res: Response,
  title: string,
  statistics: any,
  summary?: any
): Response => {
  const statsData = {
    titulo: title,
    fecha_consulta: new Date().toISOString(),
    estadisticas: statistics,
    ...(summary && { resumen: summary })
  };
  
  return sendSuccess(res, `Estadísticas de ${title.toLowerCase()} obtenidas correctamente`, statsData);
};

// ==========================================
// HELPER PARA RESPUESTAS DE BÚSQUEDA
// ==========================================
export const sendSearchResults = (
  res: Response,
  query: string,
  results: any[],
  total: number,
  searchTime?: number
): Response => {
  const searchData = {
    consulta: query,
    resultados: results,
    total_encontrados: total,
    tiempo_busqueda: searchTime || null,
    fecha_busqueda: new Date().toISOString()
  };
  
  return sendSuccess(
    res, 
    `Búsqueda completada. ${total} resultado(s) encontrado(s)`, 
    searchData, 
    200, 
    total
  );
};

// ==========================================
// HELPER PARA EXPORTAR MÚLTIPLES RESPUESTAS
// ==========================================
export const ResponseHelper = {
  success: sendSuccess,
  successWithPagination: sendSuccessWithPagination,
  error: sendError,
  validationError: sendValidationError,
  notFound: sendNotFound,
  conflict: sendConflict,
  unauthorized: sendUnauthorized,
  forbidden: sendForbidden,
  created: sendCreated,
  deleted: sendDeleted,
  updated: sendUpdated,
  healthCheck: sendHealthCheck,
  statistics: sendStatistics,
  searchResults: sendSearchResults
};

// ==========================================
// CONSTANTES PARA MENSAJES COMUNES
// ==========================================
export const MESSAGES = {
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