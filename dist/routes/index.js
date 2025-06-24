"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = require("express");
// ==========================================
// IMPORTAR TODAS LAS RUTAS DE CATÁLOGOS
// ==========================================
const servicio_routes_1 = __importDefault(require("./catalogos/servicio.routes"));
const area_interconsulta_routes_1 = __importDefault(require("./catalogos/area_interconsulta.routes"));
const guia_clinica_routes_1 = __importDefault(require("./catalogos/guia_clinica.routes"));
const estudio_medico_routes_1 = __importDefault(require("./catalogos/estudio_medico.routes"));
const medicamento_routes_1 = __importDefault(require("./catalogos/medicamento.routes"));
const tipo_sangre_routes_1 = __importDefault(require("./catalogos/tipo_sangre.routes"));
const tipo_documento_routes_1 = __importDefault(require("./catalogos/tipo_documento.routes"));
const catalogo_vacunas_routes_1 = __importDefault(require("./catalogos/catalogo_vacunas.routes"));
// ==========================================
// IMPORTAR RUTAS DE PERSONAS
// ==========================================
const persona_routes_1 = __importDefault(require("./personas/persona.routes"));
const paciente_routes_1 = __importDefault(require("./personas/paciente.routes"));
const personal_medico_routes_1 = __importDefault(require("./personas/personal_medico.routes"));
const administrador_routes_1 = __importDefault(require("./personas/administrador.routes"));
// ==========================================
// IMPORTAR RUTAS DE GESTIÓN DE EXPEDIENTES
// ==========================================
const expediente_routes_1 = __importDefault(require("./gestion_expedientes/expediente.routes"));
const cama_routes_1 = __importDefault(require("./gestion_expedientes/cama.routes"));
const internamiento_routes_1 = __importDefault(require("./gestion_expedientes/internamiento.routes"));
const signos_vitales_routes_1 = __importDefault(require("./gestion_expedientes/signos_vitales.routes"));
// ==========================================
// IMPORTAR RUTAS DE DOCUMENTOS CLÍNICOS
// ==========================================
const documento_clinico_routes_1 = __importDefault(require("./documentos_clinicos/documento_clinico.routes"));
const historia_clinica_routes_1 = __importDefault(require("./documentos_clinicos/historia_clinica.routes"));
const nota_urgencias_routes_1 = __importDefault(require("./documentos_clinicos/nota_urgencias.routes"));
const nota_evolucion_routes_1 = __importDefault(require("./documentos_clinicos/nota_evolucion.routes"));
const nota_interconsulta_routes_1 = __importDefault(require("./documentos_clinicos/nota_interconsulta.routes"));
const nota_preoperatoria_routes_1 = __importDefault(require("./documentos_clinicos/nota_preoperatoria.routes"));
const nota_preanestesica_routes_1 = __importDefault(require("./documentos_clinicos/nota_preanestesica.routes"));
const nota_postoperatoria_routes_1 = __importDefault(require("./documentos_clinicos/nota_postoperatoria.routes"));
const nota_postanestesica_routes_1 = __importDefault(require("./documentos_clinicos/nota_postanestesica.routes"));
const nota_egreso_routes_1 = __importDefault(require("./documentos_clinicos/nota_egreso.routes"));
const consentimiento_informado_routes_1 = __importDefault(require("./documentos_clinicos/consentimiento_informado.routes"));
const solicitud_estudio_routes_1 = __importDefault(require("./documentos_clinicos/solicitud_estudio.routes"));
const referencia_traslado_routes_1 = __importDefault(require("./documentos_clinicos/referencia_traslado.routes"));
const prescripcion_medicamento_routes_1 = __importDefault(require("./documentos_clinicos/prescripcion_medicamento.routes"));
const registro_transfusion_routes_1 = __importDefault(require("./documentos_clinicos/registro_transfusion.routes"));
// ==========================================
// IMPORTAR RUTAS DE NOTAS ESPECIALIZADAS
// ==========================================
const nota_psicologia_routes_1 = __importDefault(require("./notas_especializadas/nota_psicologia.routes"));
const nota_nutricion_routes_1 = __importDefault(require("./notas_especializadas/nota_nutricion.routes"));
const router = (0, express_1.Router)();
// ==========================================
// RUTA PRINCIPAL DE SALUD (HEALTH CHECK)
// ==========================================
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API del Hospital General San Luis de la Paz funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        sistema: 'SICEG-HG (Sistema Integral de Control de Expedientes - Hospital General)'
    });
});
// ==========================================
// CONFIGURAR RUTAS DE CATÁLOGOS
// ==========================================
router.use('/catalogos/servicios', servicio_routes_1.default);
router.use('/catalogos/areas-interconsulta', area_interconsulta_routes_1.default);
router.use('/catalogos/guias-clinicas', guia_clinica_routes_1.default);
router.use('/catalogos/estudios-medicos', estudio_medico_routes_1.default);
router.use('/catalogos/medicamentos', medicamento_routes_1.default);
router.use('/catalogos/tipos-sangre', tipo_sangre_routes_1.default);
router.use('/catalogos/tipos-documento', tipo_documento_routes_1.default);
router.use('/catalogos/catalogo-vacunas', catalogo_vacunas_routes_1.default);
// ==========================================
// CONFIGURAR RUTAS DE GESTIÓN DE EXPEDIENTES
// ==========================================
router.use('/gestion-expedientes/expedientes', expediente_routes_1.default);
router.use('/gestion-expedientes/camas', cama_routes_1.default);
router.use('/gestion-expedientes/internamientos', internamiento_routes_1.default);
router.use('/gestion-expedientes/signos-vitales', signos_vitales_routes_1.default);
// ==========================================
// CONFIGURAR RUTAS DE DOCUMENTOS CLÍNICOS
// ==========================================
router.use('/documentos-clinicos/documentos', documento_clinico_routes_1.default);
router.use('/documentos-clinicos/historias-clinicas', historia_clinica_routes_1.default);
router.use('/documentos-clinicos/notas-urgencias', nota_urgencias_routes_1.default);
router.use('/documentos-clinicos/notas-evolucion', nota_evolucion_routes_1.default);
router.use('/documentos-clinicos/notas-interconsulta', nota_interconsulta_routes_1.default);
router.use('/documentos-clinicos/notas-preoperatoria', nota_preoperatoria_routes_1.default);
router.use('/documentos-clinicos/notas-preanestesica', nota_preanestesica_routes_1.default);
router.use('/documentos-clinicos/notas-postoperatoria', nota_postoperatoria_routes_1.default);
router.use('/documentos-clinicos/notas-postanestesica', nota_postanestesica_routes_1.default);
router.use('/documentos-clinicos/notas-egreso', nota_egreso_routes_1.default);
router.use('/documentos-clinicos/consentimientos-informados', consentimiento_informado_routes_1.default);
router.use('/documentos-clinicos/solicitudes-estudio', solicitud_estudio_routes_1.default);
router.use('/documentos-clinicos/referencias-traslado', referencia_traslado_routes_1.default);
router.use('/documentos-clinicos/prescripciones-medicamento', prescripcion_medicamento_routes_1.default);
router.use('/documentos-clinicos/registros-transfusion', registro_transfusion_routes_1.default);
// ==========================================
// CONFIGURAR RUTAS DE NOTAS ESPECIALIZADAS
// ==========================================
router.use('/notas-especializadas/notas-psicologia', nota_psicologia_routes_1.default);
router.use('/notas-especializadas/notas-nutricion', nota_nutricion_routes_1.default);
// ==========================================
// CONFIGURAR RUTAS DE PERSONAS (ORDEN IMPORTANTE)
// Las rutas específicas DEBEN ir ANTES que las generales
// ==========================================
router.use('/personas/pacientes', paciente_routes_1.default);
router.use('/personas/personal-medico', personal_medico_routes_1.default);
router.use('/personas/administradores', administrador_routes_1.default);
router.use('/personas', persona_routes_1.default); // Esta debe ir AL FINAL
// ==========================================
// RUTA PARA OBTENER INFORMACIÓN DEL SISTEMA
// ==========================================
router.get('/sistema/info', (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            hospital: 'Hospital General San Luis de la Paz',
            ubicacion: 'San Luis de la Paz, Guanajuato, México',
            sistema: 'SICEG-HG - Sistema Integral de Control de Expedientes',
            version: '1.0.0',
            modulos_disponibles: {
                catalogos: [
                    'servicios', 'areas-interconsulta', 'guias-clinicas',
                    'estudios-medicos', 'medicamentos', 'tipos-sangre',
                    'tipos-documento', 'catalogo-vacunas'
                ],
                gestion_expedientes: [
                    'expedientes', 'camas', 'internamientos', 'signos-vitales'
                ],
                documentos_clinicos: [
                    'documentos', 'historias-clinicas', 'notas-urgencias',
                    'notas-evolucion', 'notas-interconsulta', 'notas-preoperatoria',
                    'notas-preanestesica', 'notas-postoperatoria', 'notas-postanestesica',
                    'notas-egreso', 'consentimientos-informados', 'solicitudes-estudio',
                    'referencias-traslado', 'prescripciones-medicamento',
                    'registros-transfusion'
                ],
                notas_especializadas: [
                    'notas-psicologia', 'notas-nutricion'
                ],
                personas: [
                    'pacientes', 'personal-medico', 'administradores', 'personas'
                ]
            },
            endpoints_principales: {
                health_check: '/api/health',
                sistema_info: '/api/sistema/info',
                catalogos: '/api/catalogos/*',
                expedientes: '/api/gestion-expedientes/*',
                documentos: '/api/documentos-clinicos/*',
                personas: '/api/personas/*'
            }
        }
    });
});
// ==========================================
// RUTA PARA ESTADÍSTICAS GENERALES DEL SISTEMA
// ==========================================
router.get('/sistema/estadisticas', async (req, res) => {
    try {
        // Esta ruta podría implementarse más adelante con estadísticas reales
        res.status(200).json({
            success: true,
            message: 'Endpoint de estadísticas generales disponible',
            data: {
                nota: 'Las estadísticas específicas se implementarán en cada módulo',
                enlaces_estadisticas: {
                    tipos_sangre: '/api/catalogos/tipos-sangre/estadisticas',
                    servicios: '/api/catalogos/servicios/estadisticas',
                    areas_interconsulta: '/api/catalogos/areas-interconsulta/estadisticas',
                    vacunas: '/api/catalogos/catalogo-vacunas/estadisticas'
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas del sistema',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});
// ==========================================
// MIDDLEWARE PARA RUTAS NO ENCONTRADAS
// ==========================================
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        ruta_solicitada: req.originalUrl,
        metodo: req.method,
        sugerencias: {
            health_check: '/api/health',
            info_sistema: '/api/sistema/info',
            catalogos: '/api/catalogos/servicios',
            documentacion: 'Consulta la documentación de la API'
        }
    });
});
exports.default = router;
