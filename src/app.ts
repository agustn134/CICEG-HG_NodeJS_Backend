
import express from 'express';
import cors from 'cors';
import { ResponseHelper } from './utils/responses';
import configuracionRoutes from './routes/configuracion.routes';
import path from 'path';
import { InicializadorSistema } from './utils/inicializar-sistema';
import passwordResetRoutes from './routes/auth/password-reset.routes';

const app = express();

(async () => {
  try {
    console.log('Inicializando sistema CICEG-HG...');
    await InicializadorSistema.inicializarLogosDefault();
    console.log('Sistema inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar sistema:', error);
  }
})();

// ========== CONFIGURACIÓN CORS - DEBE IR ANTES DE TODO ==========
app.use(cors({
  origin: [
    'http://localhost:4200',  // Angular dev server
    'http://localhost:5173',  // Vite
    'http://127.0.0.1:4200',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
// Agregar esta línea para servir archivos estáticos
// Configuración de parseo de JSON y URL encoded
app.use(express.json({ 
  limit: '10mb',
  type: ['application/json', 'text/plain']
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// ==========================================
// IMPORTACIÓN DE RUTAS
// ==========================================

// ===== Catálogos =====
import servicioRoutes from './routes/catalogos/servicio.routes';
import areaInterconsultaRoutes from './routes/catalogos/area_interconsulta.routes';
import guiaClinicaRoutes from './routes/catalogos/guia_clinica.routes';
import estudioMedicoRoutes from './routes/catalogos/estudio_medico.routes';
import medicamentoRoutes from './routes/catalogos/medicamento.routes';
import tipoSangreRoutes from './routes/catalogos/tipo_sangre.routes';
import tipoDocumentoRoutes from './routes/catalogos/tipo_documento.routes';

// ===== Personas =====
import personaRoutes from './routes/personas/persona.routes';
import pacienteRoutes from './routes/personas/paciente.routes';
import personalMedicoRoutes from './routes/personas/personal_medico.routes';
import administradorRoutes from './routes/personas/administrador.routes';

// ===== Gestión de Expedientes =====
import expedienteRoutes from './routes/gestion_expedientes/expediente.routes';
import camaRoutes from './routes/gestion_expedientes/cama.routes';
import internamientoRoutes from './routes/gestion_expedientes/internamiento.routes';
import signosVitalesRoutes from './routes/gestion_expedientes/signos_vitales.routes';

// ===== Documentos Clínicos =====
import documentoClinicoRoutes from './routes/documentos_clinicos/documento_clinico.routes';
import historiaClinicaRoutes from './routes/documentos_clinicos/historia_clinica.routes';
import notaUrgenciasRoutes from './routes/documentos_clinicos/nota_urgencias.routes';
import notaEvolucionRoutes from './routes/documentos_clinicos/nota_evolucion.routes';
import notaInterconsultaRoutes from './routes/documentos_clinicos/nota_interconsulta.routes';
import notaPreoperatoriaRoutes from './routes/documentos_clinicos/nota_preoperatoria.routes';
import notaPreanestesicaRoutes from './routes/documentos_clinicos/nota_preanestesica.routes';
import notaPostoperatoriaRoutes from './routes/documentos_clinicos/nota_postoperatoria.routes';
import notaPostanestesicaRoutes from './routes/documentos_clinicos/nota_postanestesica.routes';
import notaEgresoRoutes from './routes/documentos_clinicos/nota_egreso.routes';
import consentimientoInformadoRoutes from './routes/documentos_clinicos/consentimiento_informado.routes';
import solicitudEstudioRoutes from './routes/documentos_clinicos/solicitud_estudio.routes';
import referenciaTrasladoRoutes from './routes/documentos_clinicos/referencia_traslado.routes';
import prescripcionMedicamentoRoutes from './routes/documentos_clinicos/prescripcion_medicamento.routes';
import registroTransfusionRoutes from './routes/documentos_clinicos/registro_transfusion.routes';

// ===== Notas Especializadas =====
import notaPsicologiaRoutes from './routes/notas_especializadas/nota_psicologia.routes';
import notaNutricionRoutes from './routes/notas_especializadas/nota_nutricion.routes';
import authRoutes from './controllers/auth/auth.routes';

// ===== Pediatría =====
import antecedentesHeredoFamiliaresRoutes from './routes/pediatria/antecedentes_heredo_familiares.routes';
import antecedentesPerinatalesRoutes from './routes/pediatria/antecedentes_perinatales.routes';
import desarrolloPsicomotrizRoutes from './routes/pediatria/desarrollo_psicomotriz.routes';
import inmunizacionesRoutes from './routes/pediatria/inmunizaciones.routes';
import vacunasAdicionalesRoutes from './routes/pediatria/vacunas_adicionales.routes';
import estadoNutricionalPediatricoRoutes from './routes/pediatria/estado_nutricional_pediatrico.routes';
import dashboardPediatricoRoutes from './routes/pediatria/dashboard_pediatrico.routes';
// ==========================================
// RUTA PRINCIPAL DE INFORMACIÓN DEL SISTEMA
// ==========================================
app.get('/', (req, res) => {
  return ResponseHelper.success(res, 'Bienvenido a la API del Hospital General San Luis de la Paz', {
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
        notas_especializadas: '/api/notas-especializadas/*',
        pediatria: '/api/pediatria/*'
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
  return ResponseHelper.success(res, 'API funcionando correctamente', {
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
  return ResponseHelper.success(res, 'Información del sistema CICEG-HG', {
    nombre: 'CICEG-HG',
    descripcion: 'Sistema Integral de Control y Expedientes de Gestión Hospitalaria',
    hospital: 'Hospital General San Luis de la Paz',
    version: '1.3.4',
    modulos: {
      catalogos: 'Gestión de catálogos del sistema',
      personas: 'Gestión de pacientes, personal médico y administrativo',
      expedientes: 'Control de expedientes clínicos',
      documentos_clinicos: 'Gestión de documentos médicos',
      notas_especializadas: 'Notas de psicología y nutrición',
      pediatria: 'Gestión de antecedentes, desarrollo, inmunizaciones y estado nutricional pediátrico'
    },
    estadisticas: {
      endpoints_disponibles: 57, 
      modulos_activos: 6,
      ultima_actualizacion: new Date().toISOString()
    },
    legado: {
  casas: {
    nacimiento: 843,
    infancia: 134
  },
  autor: 'agus_tparra'}
  });
});


app.get('/api/134', (req, res) => {
  return ResponseHelper.success(res, ' Firma del desarrollador', {
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
app.use('/api/auth', authRoutes);

app.use('/api/auth/password-reset', passwordResetRoutes);

// ===== CATÁLOGOS =====
app.use('/api/catalogos/servicios', servicioRoutes);
app.use('/api/catalogos/areas-interconsulta', areaInterconsultaRoutes);
app.use('/api/catalogos/guias-clinicas', guiaClinicaRoutes);
app.use('/api/catalogos/estudios-medicos', estudioMedicoRoutes);
app.use('/api/catalogos/medicamentos', medicamentoRoutes);
app.use('/api/catalogos/tipos-sangre', tipoSangreRoutes);
app.use('/api/catalogos/tipos-documento', tipoDocumentoRoutes);

// ===== PERSONAS (ORDEN IMPORTANTE: específicas antes que generales) =====
app.use('/api/personas/pacientes', pacienteRoutes);
app.use('/api/personas/personal-medico', personalMedicoRoutes);
app.use('/api/personas/administradores', administradorRoutes);
app.use('/api/personas', personaRoutes); // Esta debe ir AL FINAL

// ===== GESTIÓN DE EXPEDIENTES =====
app.use('/api/gestion-expedientes/expedientes', expedienteRoutes);
app.use('/api/gestion-expedientes/camas', camaRoutes);
app.use('/api/gestion-expedientes/internamientos', internamientoRoutes);
app.use('/api/gestion-expedientes/signos-vitales', signosVitalesRoutes);

// ===== DOCUMENTOS CLÍNICOS =====
app.use('/api/documentos-clinicos/documentos', documentoClinicoRoutes);
app.use('/api/documentos-clinicos/historias-clinicas', historiaClinicaRoutes);
app.use('/api/documentos-clinicos/notas-urgencias', notaUrgenciasRoutes);
app.use('/api/documentos-clinicos/notas-evolucion', notaEvolucionRoutes);
app.use('/api/documentos-clinicos/notas-interconsulta', notaInterconsultaRoutes);
app.use('/api/documentos-clinicos/notas-preoperatoria', notaPreoperatoriaRoutes);
app.use('/api/documentos-clinicos/notas-preanestesica', notaPreanestesicaRoutes);
app.use('/api/documentos-clinicos/notas-postoperatoria', notaPostoperatoriaRoutes);
app.use('/api/documentos-clinicos/notas-postanestesica', notaPostanestesicaRoutes);
app.use('/api/documentos-clinicos/notas-egreso', notaEgresoRoutes);
app.use('/api/documentos-clinicos/consentimientos-informados', consentimientoInformadoRoutes);
app.use('/api/documentos-clinicos/solicitudes-estudio', solicitudEstudioRoutes);
app.use('/api/documentos-clinicos/referencias-traslado', referenciaTrasladoRoutes);
app.use('/api/documentos-clinicos/prescripciones-medicamento', prescripcionMedicamentoRoutes);
app.use('/api/documentos-clinicos/registros-transfusion', registroTransfusionRoutes);

// ===== NOTAS ESPECIALIZADAS =====
app.use('/api/notas-especializadas/notas-psicologia', notaPsicologiaRoutes);
app.use('/api/notas-especializadas/notas-nutricion', notaNutricionRoutes);

// ===== PEDIATRÍA =====
app.use('/api/pediatria/antecedentes-heredo-familiares', antecedentesHeredoFamiliaresRoutes);
app.use('/api/pediatria/antecedentes-perinatales', antecedentesPerinatalesRoutes);
app.use('/api/pediatria/desarrollo-psicomotriz', desarrolloPsicomotrizRoutes);
app.use('/api/pediatria/inmunizaciones', inmunizacionesRoutes);
app.use('/api/pediatria/vacunas-adicionales', vacunasAdicionalesRoutes);
app.use('/api/pediatria/estado-nutricional', estadoNutricionalPediatricoRoutes);
app.use('/api/pediatria/dashboard', dashboardPediatricoRoutes);

app.use('/api/configuracion', configuracionRoutes);
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
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(' Error global capturado:', error);
  
  // Log adicional para debugging
  console.error('Ruta:', req.method, req.originalUrl);
  console.error('Body:', req.body);
  console.error('Stack:', error.stack);
  
  return ResponseHelper.error(
    res,
    'Error interno del servidor',
    500,
    process.env.NODE_ENV === 'development' ? {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method
    } : undefined
  );
});


export default app;