// src/routes/index.ts
import { Router } from 'express';

// ==========================================
// IMPORTAR TODAS LAS RUTAS DE CATÁLOGOS
// ==========================================
import servicioRoutes from './catalogos/servicio.routes';
import areaInterconsultaRoutes from './catalogos/area_interconsulta.routes';
import guiaClinicaRoutes from './catalogos/guia_clinica.routes';
import estudioMedicoRoutes from './catalogos/estudio_medico.routes';
import medicamentoRoutes from './catalogos/medicamento.routes';
import tipoSangreRoutes from './catalogos/tipo_sangre.routes';
import tipoDocumentoRoutes from './catalogos/tipo_documento.routes';
import catalogoVacunasRoutes from './catalogos/catalogo_vacunas.routes';

// ==========================================
// IMPORTAR RUTAS DE PERSONAS
// ==========================================
import personaRoutes from './personas/persona.routes';
import pacienteRoutes from './personas/paciente.routes';
import personalMedicoRoutes from './personas/personal_medico.routes';
import administradorRoutes from './personas/administrador.routes';

// ==========================================
// IMPORTAR RUTAS DE GESTIÓN DE EXPEDIENTES
// ==========================================
import expedienteRoutes from './gestion_expedientes/expediente.routes';
import camaRoutes from './gestion_expedientes/cama.routes';
import internamientoRoutes from './gestion_expedientes/internamiento.routes';
import signosVitalesRoutes from './gestion_expedientes/signos_vitales.routes';

// ==========================================
// IMPORTAR RUTAS DE DOCUMENTOS CLÍNICOS
// ==========================================
import documentoClinicoRoutes from './documentos_clinicos/documento_clinico.routes';
import historiaClinicaRoutes from './documentos_clinicos/historia_clinica.routes';
import notaUrgenciasRoutes from './documentos_clinicos/nota_urgencias.routes';
import notaEvolucionRoutes from './documentos_clinicos/nota_evolucion.routes';
import notaInterconsultaRoutes from './documentos_clinicos/nota_interconsulta.routes';
import notaPreoperatoriaRoutes from './documentos_clinicos/nota_preoperatoria.routes';
import notaPreanestesicaRoutes from './documentos_clinicos/nota_preanestesica.routes';
import notaPostoperatoriaRoutes from './documentos_clinicos/nota_postoperatoria.routes';
import notaPostanestesicaRoutes from './documentos_clinicos/nota_postanestesica.routes';
import notaEgresoRoutes from './documentos_clinicos/nota_egreso.routes';
import consentimientoInformadoRoutes from './documentos_clinicos/consentimiento_informado.routes';
import solicitudEstudioRoutes from './documentos_clinicos/solicitud_estudio.routes';
import referenciaTrasladoRoutes from './documentos_clinicos/referencia_traslado.routes';
import prescripcionMedicamentoRoutes from './documentos_clinicos/prescripcion_medicamento.routes';
import registroTransfusionRoutes from './documentos_clinicos/registro_transfusion.routes';

// ==========================================
// IMPORTAR RUTAS DE NOTAS ESPECIALIZADAS
// ==========================================
import notaPsicologiaRoutes from './notas_especializadas/nota_psicologia.routes';
import notaNutricionRoutes from './notas_especializadas/nota_nutricion.routes';

const router = Router();

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
router.use('/catalogos/servicios', servicioRoutes);
router.use('/catalogos/areas-interconsulta', areaInterconsultaRoutes);
router.use('/catalogos/guias-clinicas', guiaClinicaRoutes);
router.use('/catalogos/estudios-medicos', estudioMedicoRoutes);
router.use('/catalogos/medicamentos', medicamentoRoutes);
router.use('/catalogos/tipos-sangre', tipoSangreRoutes);
router.use('/catalogos/tipos-documento', tipoDocumentoRoutes);
router.use('/catalogos/catalogo-vacunas', catalogoVacunasRoutes);

// ==========================================
// CONFIGURAR RUTAS DE GESTIÓN DE EXPEDIENTES
// ==========================================
router.use('/gestion-expedientes/expedientes', expedienteRoutes);
router.use('/gestion-expedientes/camas', camaRoutes);
router.use('/gestion-expedientes/internamientos', internamientoRoutes);
router.use('/gestion-expedientes/signos-vitales', signosVitalesRoutes);

// ==========================================
// CONFIGURAR RUTAS DE DOCUMENTOS CLÍNICOS
// ==========================================
router.use('/documentos-clinicos/documentos', documentoClinicoRoutes);
router.use('/documentos-clinicos/historias-clinicas', historiaClinicaRoutes);
router.use('/documentos-clinicos/notas-urgencias', notaUrgenciasRoutes);
router.use('/documentos-clinicos/notas-evolucion', notaEvolucionRoutes);
router.use('/documentos-clinicos/notas-interconsulta', notaInterconsultaRoutes);
router.use('/documentos-clinicos/notas-preoperatoria', notaPreoperatoriaRoutes);
router.use('/documentos-clinicos/notas-preanestesica', notaPreanestesicaRoutes);
router.use('/documentos-clinicos/notas-postoperatoria', notaPostoperatoriaRoutes);
router.use('/documentos-clinicos/notas-postanestesica', notaPostanestesicaRoutes);
router.use('/documentos-clinicos/notas-egreso', notaEgresoRoutes);
router.use('/documentos-clinicos/consentimientos-informados', consentimientoInformadoRoutes);
router.use('/documentos-clinicos/solicitudes-estudio', solicitudEstudioRoutes);
router.use('/documentos-clinicos/referencias-traslado', referenciaTrasladoRoutes);
router.use('/documentos-clinicos/prescripciones-medicamento', prescripcionMedicamentoRoutes);
router.use('/documentos-clinicos/registros-transfusion', registroTransfusionRoutes);

// ==========================================
// CONFIGURAR RUTAS DE NOTAS ESPECIALIZADAS
// ==========================================
router.use('/notas-especializadas/notas-psicologia', notaPsicologiaRoutes);
router.use('/notas-especializadas/notas-nutricion', notaNutricionRoutes);

// ==========================================
// CONFIGURAR RUTAS DE PERSONAS (ORDEN IMPORTANTE)
// Las rutas específicas DEBEN ir ANTES que las generales
// ==========================================
router.use('/personas/pacientes', pacienteRoutes);
router.use('/personas/personal-medico', personalMedicoRoutes);
router.use('/personas/administradores', administradorRoutes);
router.use('/personas', personaRoutes); // Esta debe ir AL FINAL

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
  } catch (error) {
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

export default router;