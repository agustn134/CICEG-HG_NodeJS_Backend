"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// ========== CONFIGURACIÓN CORS - DEBE IR ANTES DE TODO ==========
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200', // Puerto de Angular
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
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
// ========== MIDDLEWARES =========
// Catálogos
app.use('/api/catalogos/servicios', servicio_routes_1.default);
app.use('/api/catalogos/areas-interconsulta', area_interconsulta_routes_1.default);
app.use('/api/catalogos/guias-clinicas', guia_clinica_routes_1.default);
app.use('/api/catalogos/estudios-medicos', estudio_medico_routes_1.default);
app.use('/api/catalogos/medicamentos', medicamento_routes_1.default);
app.use('/api/catalogos/tipos-sangre', tipo_sangre_routes_1.default);
app.use('/api/catalogos/tipos-documento', tipo_documento_routes_1.default);
// Gestión de Expedientes
app.use('/api/gestion-expedientes/expedientes', expediente_routes_1.default);
app.use('/api/gestion-expedientes/camas', cama_routes_1.default);
app.use('/api/gestion-expedientes/internamientos', internamiento_routes_1.default);
app.use('/api/gestion-expedientes/signos-vitales', signos_vitales_routes_1.default);
// Documentos Clínicos
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
// Notas Especializadas
app.use('/api/notas-especializadas/notas-psicologia', nota_psicologia_routes_1.default);
app.use('/api/notas-especializadas/notas-nutricion', nota_nutricion_routes_1.default);
// Personas - ORDEN IMPORTANTE: rutas específicas ANTES que las generales
app.use('/api/personas/pacientes', paciente_routes_1.default);
app.use('/api/personas/personal-medico', personal_medico_routes_1.default);
app.use('/api/personas/administradores', administrador_routes_1.default);
app.use('/api/personas', persona_routes_1.default); // Esta debe ir AL FINAL
exports.default = app;
