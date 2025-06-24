"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API CICEG-HG Node.js PostgreSQL RESTful API',
            version: '1.0.0',
            description: 'Documentación de la API RESTful para el sistema de gestión de expedientes médicos.',
            contact: {
                name: 'Nombre del Desarrollador',
                email: 'desarrollador@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ]
    },
    apis: ['src/routes/**/*.routes.ts'] // Ruta a tus archivos de rutas
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
