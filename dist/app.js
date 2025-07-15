"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const responses_1 = require("./utils/responses");
const app = (0, express_1.default)();
// ========== CONFIGURACIÓN CORS - DEBE IR ANTES DE TODO ==========
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:4200', // Angular dev server
        'http://localhost:5173', // Vite
        'http://127.0.0.1:4200',
        'http://127.0.0.1:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Configuración de parseo de JSON y URL encoded
app.use(express_1.default.json({
    limit: '10mb',
    type: ['application/json', 'text/plain']
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '10mb'
}));
// ==========================================
// IMPORTACIÓN DE RUTAS
// ==========================================
// ===== Catálogos =====
const servicio_routes_1 = __importDefault(require("./routes/catalogos/servicio.routes"));
const area_interconsulta_routes_1 = __importDefault(require("./routes/catalogos/area_interconsulta.routes"));
const guia_clinica_routes_1 = __importDefault(require("./routes/catalogos/guia_clinica.routes"));
const estudio_medico_routes_1 = __importDefault(require("./routes/catalogos/estudio_medico.routes"));
const medicamento_routes_1 = __importDefault(require("./routes/catalogos/medicamento.routes"));
const tipo_sangre_routes_1 = __importDefault(require("./routes/catalogos/tipo_sangre.routes"));
const tipo_documento_routes_1 = __importDefault(require("./routes/catalogos/tipo_documento.routes"));
// ===== Personas =====
const persona_routes_1 = __importDefault(require("./routes/personas/persona.routes"));
const paciente_routes_1 = __importDefault(require("./routes/personas/paciente.routes"));
const personal_medico_routes_1 = __importDefault(require("./routes/personas/personal_medico.routes"));
const administrador_routes_1 = __importDefault(require("./routes/personas/administrador.routes"));
// ===== Gestión de Expedientes =====
const expediente_routes_1 = __importDefault(require("./routes/gestion_expedientes/expediente.routes"));
const cama_routes_1 = __importDefault(require("./routes/gestion_expedientes/cama.routes"));
const internamiento_routes_1 = __importDefault(require("./routes/gestion_expedientes/internamiento.routes"));
const signos_vitales_routes_1 = __importDefault(require("./routes/gestion_expedientes/signos_vitales.routes"));
// ===== Documentos Clínicos =====
const documento_clinico_routes_1 = __importDefault(require("./routes/documentos_clinicos/documento_clinico.routes"));
const historia_clinica_routes_1 = __importDefault(require("./routes/documentos_clinicos/historia_clinica.routes"));
const nota_urgencias_routes_1 = __importDefault(require("./routes/documentos_clinicos/nota_urgencias.routes"));
const nota_evolucion_routes_1 = __importDefault(require("./routes/documentos_clinicos/nota_evolucion.routes"));
const nota_interconsulta_routes_1 = __importDefault(require("./routes/documentos_clinicos/nota_interconsulta.routes"));
const nota_preoperatoria_routes_1 = __importDefault(require("./routes/documentos_clinicos/nota_preoperatoria.routes"));
const nota_preanestesica_routes_1 = __importDefault(require("./routes/documentos_clinicos/nota_preanestesica.routes"));
const nota_postoperatoria_routes_1 = __importDefault(require("./routes/documentos_clinicos/nota_postoperatoria.routes"));
const nota_postanestesica_routes_1 = __importDefault(require("./routes/documentos_clinicos/nota_postanestesica.routes"));
const nota_egreso_routes_1 = __importDefault(require("./routes/documentos_clinicos/nota_egreso.routes"));
const consentimiento_informado_routes_1 = __importDefault(require("./routes/documentos_clinicos/consentimiento_informado.routes"));
const solicitud_estudio_routes_1 = __importDefault(require("./routes/documentos_clinicos/solicitud_estudio.routes"));
const referencia_traslado_routes_1 = __importDefault(require("./routes/documentos_clinicos/referencia_traslado.routes"));
const prescripcion_medicamento_routes_1 = __importDefault(require("./routes/documentos_clinicos/prescripcion_medicamento.routes"));
const registro_transfusion_routes_1 = __importDefault(require("./routes/documentos_clinicos/registro_transfusion.routes"));
// ===== Notas Especializadas =====
const nota_psicologia_routes_1 = __importDefault(require("./routes/notas_especializadas/nota_psicologia.routes"));
const nota_nutricion_routes_1 = __importDefault(require("./routes/notas_especializadas/nota_nutricion.routes"));
const auth_routes_1 = __importDefault(require("./controllers/auth/auth.routes"));
// ==========================================
// RUTA PRINCIPAL DE INFORMACIÓN DEL SISTEMA
// ==========================================
app.get('/', (req, res) => {
    return responses_1.ResponseHelper.success(res, 'Bienvenido a la API del Hospital General San Luis de la Paz', {
        hospital: 'Hospital General San Luis de la Paz',
        sistema: 'CICEG-HG - Sistema Integral de Control y Expedientes de Gestión Hospitalaria',
        version: '1.3.4',
        ubicacion: 'San Luis de la Paz, Guanajuato, México',
        estado: 'Activo',
        timestamp: new Date().toISOString(),
        documentacion: {
            health_check: '/api/health',
            info_sistema: '/api/sistema/info',
            endpoints: {
                catalogos: '/api/catalogos/*',
                personas: '/api/personas/*',
                expedientes: '/api/gestion-expedientes/*',
                documentos_clinicos: '/api/documentos-clinicos/*',
                notas_especializadas: '/api/notas-especializadas/*'
            }
        },
        contacto: {
            desarrollo: 'Agustin de Practicas Y Estadias 2025',
            email: 'agustinlopezparra13@gmail.com',
            soporte: 'agustinlopezparra13@gmail.com'
        }
    });
});
// ==========================================
// HEALTH CHECK ENDPOINT
// ==========================================
app.get('/api/health', (req, res) => {
    return responses_1.ResponseHelper.success(res, 'API funcionando correctamente', {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '8.4.3'
    });
});
// ==========================================
// INFORMACIÓN DEL SISTEMA
// ==========================================
app.get('/api/sistema/info', (req, res) => {
    return responses_1.ResponseHelper.success(res, 'Información del sistema CICEG-HG', {
        nombre: 'CICEG-HG',
        descripcion: 'Sistema Integral de Control y Expedientes de Gestión Hospitalaria',
        hospital: 'Hospital General San Luis de la Paz',
        version: '1.3.4',
        modulos: {
            catalogos: 'Gestión de catálogos del sistema',
            personas: 'Gestión de pacientes, personal médico y administrativo',
            expedientes: 'Control de expedientes clínicos',
            documentos_clinicos: 'Gestión de documentos médicos',
            notas_especializadas: 'Notas de psicología y nutrición'
        },
        estadisticas: {
            endpoints_disponibles: 50,
            modulos_activos: 5,
            ultima_actualizacion: new Date().toISOString()
        },
        legado: {
            casas: {
                nacimiento: 843,
                infancia: 134
            },
            autor: 'agus_tparra'
        }
    });
});
app.get('/api/134', (req, res) => {
    return responses_1.ResponseHelper.success(res, ' Firma del desarrollador', {
        ascii_art: `
    
    ░█████╗░░██████╗░██╗░░░██╗░██████╗  ████████╗██████╗░░█████╗░██████╗░██████╗░░█████╗░
    ██╔══██╗██╔════╝░██║░░░██║██╔════╝  ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗
    ███████║██║░░██╗░██║░░░██║╚█████╗░  ░░░██║░░░██████╔╝███████║██████╔╝██████╔╝███████║
    ██╔══██║██║░░╚██╗██║░░░██║░╚═══██╗  ░░░██║░░░██╔═══╝░██╔══██║██╔══██╗██╔══██╗██╔══██║
    ██║░░██║╚██████╔╝╚██████╔╝██████╔╝  ░░░██║░░░██║░░░░░██║░░██║██║░░██║██║░░██║██║░░██║
    ╚═╝░░╚═╝░╚═════╝░░╚═════╝░╚═════╝░  ░░░╚═╝░░░╚═╝░░░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝
    `,
        desarrollador: {
            tag: 'agus_tparra',
            aka: ['8-4-3 Crew'],
            ubicacion: {
                origen: 'Casa 843 - Donde nacieron los sueños',
                crecimiento: 'Barrio 134 - Donde se forjó el carácter',
                destino: 'El futuro que estoy construyendo línea por línea'
            }
        },
        stats: {
            proyectos_terminados: 'Los que han cambiado vidas',
            bugs_resueltos: 'Infinitos y contando',
            cafe_consumido: 'Litros que alimentan el algoritmo',
            beats_producidos: 'Cada commit suena diferente',
        },
        crew: {
            '843': 'Donde aprendí que los sueños no se piden, se construyen',
            '134': 'Donde entendí que el código puede cambiar todo',
            'sin_miedo': 'Al futuro, al cambio, al éxito'
        },
        mensaje_personal: {
            para_quien_lea_esto: 'Este endpoint no es solo código, es mi historia.',
            dedicatoria: 'Para los que vienen del barrio y sueñan con el cielo.'
        },
        easter_eggs: {
            hidden_message: 'Si llegaste hasta aquí, respetas el hustle',
        },
        timestamps: {
            nacimiento: '2004-09-05T01:03:04.000Z',
            proyecto_ciceg: new Date().toISOString(),
        },
        contacto: {
            music: 'soul',
            ubicacion: 'Entre el 843 y el 134, construyendo puente'
        },
    });
});
// ==========================================
// CONFIGURACIÓN DE RUTAS DE LA API
// ==========================================
// ===== AUTENTICACIÓN =====
app.use('/api/auth', auth_routes_1.default);
// ===== CATÁLOGOS =====
app.use('/api/catalogos/servicios', servicio_routes_1.default);
app.use('/api/catalogos/areas-interconsulta', area_interconsulta_routes_1.default);
app.use('/api/catalogos/guias-clinicas', guia_clinica_routes_1.default);
app.use('/api/catalogos/estudios-medicos', estudio_medico_routes_1.default);
app.use('/api/catalogos/medicamentos', medicamento_routes_1.default);
app.use('/api/catalogos/tipos-sangre', tipo_sangre_routes_1.default);
app.use('/api/catalogos/tipos-documento', tipo_documento_routes_1.default);
// ===== PERSONAS (ORDEN IMPORTANTE: específicas antes que generales) =====
app.use('/api/personas/pacientes', paciente_routes_1.default);
app.use('/api/personas/personal-medico', personal_medico_routes_1.default);
app.use('/api/personas/administradores', administrador_routes_1.default);
app.use('/api/personas', persona_routes_1.default); // Esta debe ir AL FINAL
// ===== GESTIÓN DE EXPEDIENTES =====
app.use('/api/gestion-expedientes/expedientes', expediente_routes_1.default);
app.use('/api/gestion-expedientes/camas', cama_routes_1.default);
app.use('/api/gestion-expedientes/internamientos', internamiento_routes_1.default);
app.use('/api/gestion-expedientes/signos-vitales', signos_vitales_routes_1.default);
// ===== DOCUMENTOS CLÍNICOS =====
app.use('/api/documentos-clinicos/documentos', documento_clinico_routes_1.default);
app.use('/api/documentos-clinicos/historias-clinicas', historia_clinica_routes_1.default);
app.use('/api/documentos-clinicos/notas-urgencias', nota_urgencias_routes_1.default);
app.use('/api/documentos-clinicos/notas-evolucion', nota_evolucion_routes_1.default);
app.use('/api/documentos-clinicos/notas-interconsulta', nota_interconsulta_routes_1.default);
app.use('/api/documentos-clinicos/notas-preoperatoria', nota_preoperatoria_routes_1.default);
app.use('/api/documentos-clinicos/notas-preanestesica', nota_preanestesica_routes_1.default);
app.use('/api/documentos-clinicos/notas-postoperatoria', nota_postoperatoria_routes_1.default);
app.use('/api/documentos-clinicos/notas-postanestesica', nota_postanestesica_routes_1.default);
app.use('/api/documentos-clinicos/notas-egreso', nota_egreso_routes_1.default);
app.use('/api/documentos-clinicos/consentimientos-informados', consentimiento_informado_routes_1.default);
app.use('/api/documentos-clinicos/solicitudes-estudio', solicitud_estudio_routes_1.default);
app.use('/api/documentos-clinicos/referencias-traslado', referencia_traslado_routes_1.default);
app.use('/api/documentos-clinicos/prescripciones-medicamento', prescripcion_medicamento_routes_1.default);
app.use('/api/documentos-clinicos/registros-transfusion', registro_transfusion_routes_1.default);
// ===== NOTAS ESPECIALIZADAS =====
app.use('/api/notas-especializadas/notas-psicologia', nota_psicologia_routes_1.default);
app.use('/api/notas-especializadas/notas-nutricion', nota_nutricion_routes_1.default);
// ==========================================
// MIDDLEWARE PARA LOGGING DE REQUESTS (DESARROLLO)
// ==========================================
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
        next();
    });
}
// ==========================================
// MIDDLEWARE PARA MANEJO DE ERRORES GLOBALES
// ==========================================
app.use((error, req, res, next) => {
    console.error(' Error global capturado:', error);
    // Log adicional para debugging
    console.error('Ruta:', req.method, req.originalUrl);
    console.error('Body:', req.body);
    console.error('Stack:', error.stack);
    return responses_1.ResponseHelper.error(res, 'Error interno del servidor', 500, process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method
    } : undefined);
});
exports.default = app;
