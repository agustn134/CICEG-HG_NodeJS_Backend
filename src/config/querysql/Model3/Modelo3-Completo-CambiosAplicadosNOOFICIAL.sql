-- ==========================================
-- ORDEN DE EJECUCIÓN COMPLETO
-- Hospital General San Luis de la Paz
-- Base de Datos de Expedientes Clínicos
-- ==========================================

-- ==========================================
-- PASO 1: CREAR TIPOS ENUM (PRIMERO)
-- ==========================================

-- Tipo ENUM para Sexo
CREATE TYPE sexo_enum AS ENUM ('M', 'F', 'O');

-- Tipo ENUM para Estado Civil
CREATE TYPE estado_civil_enum AS ENUM (
  'Soltero(a)', 
  'Casado(a)', 
  'Divorciado(a)', 
  'Viudo(a)', 
  'Unión libre', 
  'Otro'
);

-- Tipo ENUM para Estado de Cama
CREATE TYPE estado_cama_enum AS ENUM (
  'Disponible', 
  'Ocupada', 
  'Mantenimiento', 
  'Reservada',
  'Contaminada'
);

-- Tipo ENUM para Tipo de Egreso
CREATE TYPE tipo_egreso_enum AS ENUM (
  'Alta voluntaria', 
  'Mejoría', 
  'Referencia', 
  'Defunción',
  'Máximo beneficio'
);

-- Tipo ENUM para el Estado de Documento Clínico
CREATE TYPE estado_documento_enum AS ENUM (
  'Activo', 
  'Cancelado', 
  'Anulado',
  'Borrador'
);

-- ==========================================
-- PASO 2: CREAR TABLAS DE CATÁLOGOS (SIN DEPENDENCIAS)
-- ==========================================

-- Catálogo de Servicios Hospitalarios
CREATE TABLE servicio (
  id_servicio SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,  -- Ej. 'Urgencias', 'Ginecología', 'Pediatría'
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE
);

-- Catálogo de Áreas de Interconsulta
CREATE TABLE area_interconsulta (
  id_area_interconsulta SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,  -- Ej. 'Cardiología', 'Ginecología', 'Nutrición'
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE
);

-- Catálogo de Guías Clínicas de Diagnóstico
CREATE TABLE guia_clinica (
  id_guia_diagnostico SERIAL PRIMARY KEY,
  area TEXT,                -- Ej. 'Urgencias', 'Pediatría'
  codigo TEXT,              -- Ej. 'IMSS-030_08'
  nombre TEXT NOT NULL,     -- Ej. 'Cáncer pulmonar de células no pequeñas'
  fuente TEXT,              -- Opcional: 'IMSS', 'ISSSTE', 'NOM-046'
  fecha_actualizacion DATE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE
);

-- Catálogo de Estudios Médicos
CREATE TABLE estudio_medico (
  id_estudio SERIAL PRIMARY KEY,
  clave TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,  -- Laboratorio, Imagen, Gabinete, etc.
  descripcion TEXT,
  requiere_ayuno BOOLEAN DEFAULT FALSE,
  tiempo_resultado INT,  -- En horas
  activo BOOLEAN DEFAULT TRUE
);

-- Catálogo de Medicamentos
CREATE TABLE medicamento (
  id_medicamento SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE,
  nombre TEXT NOT NULL,
  presentacion TEXT,
  concentracion TEXT,
  grupo_terapeutico TEXT,
  activo BOOLEAN DEFAULT TRUE
);

-- Catálogo de Tipos de Sangre
CREATE TABLE tipo_sangre (
  id_tipo_sangre SERIAL PRIMARY KEY,
  nombre VARCHAR(10) UNIQUE NOT NULL,  -- A+, O-, etc.
  descripcion TEXT
);

-- Crear catálogo de tipos de documentos
CREATE TABLE tipo_documento (
  id_tipo_documento SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,  -- Ej. 'Historia Clínica', 'Nota de Urgencias', 'Nota de Evolución'
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE
);

-- ==========================================
-- PASO 3: INSERTAR DATOS INICIALES DE CATÁLOGOS
-- ==========================================

-- Insertar tipos de documentos comunes
INSERT INTO tipo_documento (nombre, descripcion) VALUES
  ('Historia Clínica', 'Documento base que contiene antecedentes e información completa del paciente'),
  ('Nota de Urgencias', 'Documento generado durante la atención en el servicio de urgencias'),
  ('Nota de Evolución', 'Documento para seguimiento diario del paciente'),
  ('Nota de Interconsulta', 'Solicitud de valoración por otra especialidad'),
  ('Nota Preoperatoria', 'Evaluación previa a una intervención quirúrgica'),
  ('Nota Preanestésica', 'Evaluación anestésica previa a cirugía'),
  ('Nota Postoperatoria', 'Registro de la intervención quirúrgica realizada'),
  ('Nota Postanestésica', 'Registro del procedimiento anestésico realizado'),
  ('Nota de Egreso', 'Resumen de la atención al momento del alta hospitalaria'),
  ('Nota de Psicología', 'Evaluación y seguimiento psicológico'),
  ('Nota de Nutrición', 'Evaluación y plan de manejo nutricional');

-- ==========================================
-- PASO 4: CREAR TABLAS DE PERSONAS (CON DEPENDENCIAS BÁSICAS)
-- ==========================================

-- Tabla principal de Personas (generalización)
CREATE TABLE persona (
  id_persona SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido_paterno TEXT NOT NULL,
  apellido_materno TEXT,
  fecha_nacimiento DATE NOT NULL,
  sexo sexo_enum DEFAULT 'O',
  curp VARCHAR(18) UNIQUE,
  tipo_sangre_id INT REFERENCES tipo_sangre(id_tipo_sangre),
  estado_civil estado_civil_enum,
  religion TEXT,
  telefono TEXT,
  correo_electronico TEXT,
  domicilio TEXT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pacientes
CREATE TABLE paciente (
  id_paciente SERIAL PRIMARY KEY,
  id_persona INT NOT NULL REFERENCES persona(id_persona),
  alergias TEXT,
  transfusiones TEXT,
  detalles_transfusiones TEXT,
  familiar_responsable TEXT,
  parentesco_familiar TEXT,
  telefono_familiar TEXT,
  ocupacion TEXT,
  escolaridad TEXT,
  lugar_nacimiento TEXT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Personal Médico
CREATE TABLE personal_medico (
  id_personal_medico SERIAL PRIMARY KEY,
  id_persona INT NOT NULL REFERENCES persona(id_persona),
  numero_cedula TEXT UNIQUE,
  especialidad TEXT,
  cargo TEXT,
  departamento TEXT,
  activo BOOLEAN DEFAULT TRUE,
  foto TEXT  -- URL o ruta de la foto
);

-- Tabla de Administradores del Sistema
CREATE TABLE administrador (
  id_administrador SERIAL PRIMARY KEY,
  id_persona INT NOT NULL REFERENCES persona(id_persona),
  usuario TEXT UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,  -- Almacenar hash, no contraseña en texto plano
  nivel_acceso INT NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  foto TEXT  -- URL o ruta de la foto
);

-- ==========================================
-- PASO 5: CREAR TABLAS DE GESTIÓN DE EXPEDIENTES
-- ==========================================

-- Tabla principal de Expedientes
CREATE TABLE expediente (
  id_expediente SERIAL PRIMARY KEY,
  id_paciente INT NOT NULL REFERENCES paciente(id_paciente),
  numero_expediente TEXT UNIQUE NOT NULL,
  fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado TEXT DEFAULT 'Activo',
  notas_administrativas TEXT
);

-- Tabla de Camas Hospitalarias
CREATE TABLE cama (
  id_cama SERIAL PRIMARY KEY,
  numero TEXT NOT NULL,
  id_servicio INT REFERENCES servicio(id_servicio),
  estado estado_cama_enum DEFAULT 'Disponible',
  descripcion TEXT,
  area TEXT,  -- Ej. 'Urgencias', 'Pediatría', 'Consultorios', 'Recuperación'
  subarea TEXT  -- Ej. 'Pediatría 2 meses a 9 meses', 'Canachoque Respiratoria'
);

-- Tabla de Internamiento/Hospitalización
CREATE TABLE internamiento (
  id_internamiento SERIAL PRIMARY KEY,
  id_expediente INT NOT NULL REFERENCES expediente(id_expediente),
  id_cama INT REFERENCES cama(id_cama),
  id_servicio INT REFERENCES servicio(id_servicio),
  fecha_ingreso TIMESTAMP NOT NULL,
  fecha_egreso TIMESTAMP,
  motivo_ingreso TEXT NOT NULL,
  diagnostico_ingreso TEXT,
  diagnostico_egreso TEXT,
  id_medico_responsable INT REFERENCES personal_medico(id_personal_medico),
  tipo_egreso tipo_egreso_enum,
  observaciones TEXT
);

-- ==========================================
-- PASO 6: CREAR TABLAS DE DOCUMENTOS CLÍNICOS
-- ==========================================

-- Tabla base para Documentos Clínicos (generalización)
CREATE TABLE documento_clinico (
  id_documento SERIAL PRIMARY KEY,
  id_expediente INT NOT NULL REFERENCES expediente(id_expediente),
  id_internamiento INT REFERENCES internamiento(id_internamiento),
  id_tipo_documento INT NOT NULL REFERENCES tipo_documento(id_tipo_documento),
  fecha_elaboracion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_personal_creador INT REFERENCES personal_medico(id_personal_medico),
  estado estado_documento_enum DEFAULT 'Activo'::estado_documento_enum NOT NULL
);

-- -- 2. Si el problema persiste, recrear la tabla
-- DROP TABLE IF EXISTS documento_clinico CASCADE;

-- CREATE TABLE documento_clinico (
--   id_documento SERIAL PRIMARY KEY,
--   id_expediente INT NOT NULL REFERENCES expediente(id_expediente),
--   id_internamiento INT REFERENCES internamiento(id_internamiento),
--   id_tipo_documento INT NOT NULL REFERENCES tipo_documento(id_tipo_documento),
--   fecha_elaboracion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   id_personal_creador INT REFERENCES personal_medico(id_personal_medico),
--   estado estado_documento_enum DEFAULT 'Activo'::estado_documento_enum NOT NULL
-- );


-- Tabla para Signos Vitales
CREATE TABLE signos_vitales (
  id_signos_vitales SERIAL PRIMARY KEY,
  id_documento INT REFERENCES documento_clinico(id_documento),
  fecha_toma TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  temperatura DECIMAL(5,2),  -- °C
  presion_arterial_sistolica INT,
  presion_arterial_diastolica INT,
  frecuencia_cardiaca INT,
  frecuencia_respiratoria INT,
  saturacion_oxigeno INT,
  glucosa INT,
  peso DECIMAL(5,2),  -- kg
  talla DECIMAL(5,2),  -- cm
  imc DECIMAL(5,2),    -- Índice de Masa Corporal
  observaciones TEXT
);

-- ==========================================
-- PASO 7: CREAR TABLAS ESPECÍFICAS DE DOCUMENTOS
-- ==========================================

-- Historia Clínica
CREATE TABLE historia_clinica (
  id_historia_clinica SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  antecedentes_heredo_familiares TEXT,
  habitos_higienicos TEXT,
  habitos_alimenticios TEXT,
  actividad_fisica TEXT,
  ocupacion TEXT,
  vivienda TEXT,
  toxicomanias TEXT,
  -- Antecedentes gineco-obstétricos (si aplica)
  menarca TEXT,
  ritmo_menstrual TEXT,
  inicio_vida_sexual TEXT,
  fecha_ultima_regla DATE,
  fecha_ultimo_parto DATE,
  gestas INT,
  partos INT,
  cesareas INT,
  abortos INT,
  hijos_vivos INT,
  metodo_planificacion TEXT,
  -- Antecedentes personales patológicos
  enfermedades_infancia TEXT,
  enfermedades_adulto TEXT,
  cirugias_previas TEXT,
  traumatismos TEXT,
  alergias TEXT,
  -- Padecimiento actual
  padecimiento_actual TEXT,
  sintomas_generales TEXT,
  aparatos_sistemas TEXT,
  -- Exploración física
  exploracion_general TEXT,
  exploracion_cabeza TEXT,
  exploracion_cuello TEXT,
  exploracion_torax TEXT,
  exploracion_abdomen TEXT,
  exploracion_columna TEXT,
  exploracion_extremidades TEXT,
  exploracion_genitales TEXT,
  -- Impresión diagnóstica
  impresion_diagnostica TEXT,
  id_guia_diagnostico INT REFERENCES guia_clinica(id_guia_diagnostico),
  plan_diagnostico TEXT,
  plan_terapeutico TEXT,
  pronostico TEXT
);

-- Nota de Urgencias
CREATE TABLE nota_urgencias (
  id_nota_urgencias SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  motivo_atencion TEXT NOT NULL,
  estado_conciencia TEXT,
  resumen_interrogatorio TEXT,
  exploracion_fisica TEXT,
  resultados_estudios TEXT,
  estado_mental TEXT,
  diagnostico TEXT,
  id_guia_diagnostico INT REFERENCES guia_clinica(id_guia_diagnostico),
  plan_tratamiento TEXT,
  pronostico TEXT,
  area_interconsulta INT REFERENCES area_interconsulta(id_area_interconsulta)
);

-- -- Nota de Evolución
-- CREATE TABLE nota_evolucion (
--   id_nota_evolucion SERIAL PRIMARY KEY,
--   id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
--   subjetivo TEXT,  -- Lo que reporta el paciente
--   objetivo TEXT,   -- Hallazgos de la exploración física
--   analisis TEXT,   -- Interpretación
--   plan TEXT        -- Plan de tratamiento
-- );

-- Sintomas text, obligatorio
-- dias_hospitalizacion obligatorio
-- Exploracionfisica:
-- habitus_exterior obligatorio
-- cabeza
-- cuello
-- torax
-- abdomen
-- extremidades
-- columna vertebral
-- genitales
-- neurologico
-- Estado Nutricional obligatorio
-- Estudios de Laboratorio y gabinete obligatorio
-- Evolucion y Actualizacion de cuadro clinic_analisis
-- Diagnosticos obligatorio
-- Plan de estudios y_o tratamiento obligatorio
-- Interconsultas obligatorio
-- Pronostico obligatorio

-- fecha_elaboracion y hora 

-- Indicaciones_medicas TEXT obligatorio
CREATE TABLE nota_evolucion (
  id_nota_evolucion SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),

  -- Estructura SOAP clásica
  subjetivo TEXT,
  objetivo TEXT,
  analisis TEXT,
  plan TEXT,

  -- Campos adicionales obligatorios por norma
  sintomas TEXT NOT NULL,
  dias_hospitalizacion INT NOT NULL,

  -- Exploración física detallada
  habitus_exterior TEXT NOT NULL,
  cabeza TEXT,
  cuello TEXT,
  torax TEXT,
  abdomen TEXT,
  extremidades TEXT,
  columna_vertebral TEXT,
  genitales TEXT,
  neurologico TEXT,

  estado_nutricional TEXT NOT NULL,
  estudios_laboratorio_gabinete TEXT NOT NULL,

  evolucion_actualizacion TEXT,
  diagnosticos TEXT NOT NULL,
  plan_estudios_tratamiento TEXT NOT NULL,
  interconsultas TEXT NOT NULL,
  pronostico TEXT NOT NULL,

  indicaciones_medicas TEXT NOT NULL,

  fecha_elaboracion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);







-- Nota de Interconsulta
CREATE TABLE nota_interconsulta (
  id_nota_interconsulta SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  area_interconsulta INT REFERENCES area_interconsulta(id_area_interconsulta),
  motivo_interconsulta TEXT NOT NULL,
  diagnostico_presuntivo TEXT,
  examenes_laboratorio BOOLEAN DEFAULT FALSE,
  examenes_gabinete BOOLEAN DEFAULT FALSE,
  hallazgos TEXT,
  impresion_diagnostica TEXT,
  recomendaciones TEXT,
  id_medico_solicitante INT REFERENCES personal_medico(id_personal_medico),
  id_medico_interconsulta INT REFERENCES personal_medico(id_personal_medico)
);

-- Nota Preoperatoria
CREATE TABLE nota_preoperatoria (
  id_nota_preoperatoria SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  fecha_cirugia DATE,
  resumen_interrogatorio TEXT,
  exploracion_fisica TEXT,
  resultados_estudios TEXT,
  diagnostico_preoperatorio TEXT,
  id_guia_diagnostico INT REFERENCES guia_clinica(id_guia_diagnostico),
  plan_quirurgico TEXT,
  plan_terapeutico_preoperatorio TEXT,
  pronostico TEXT,
  tipo_cirugia TEXT,  -- Electiva, Urgente
  riesgo_quirurgico TEXT  -- ASA I, ASA II, etc.
);

-- Nota Preanestésica
CREATE TABLE nota_preanestesica (
  id_nota_preanestesica SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  fecha_cirugia DATE,
  antecedentes_anestesicos TEXT,
  valoracion_via_aerea TEXT,
  clasificacion_asa TEXT,  -- ASA I, ASA II, etc.
  plan_anestesico TEXT,
  riesgo_anestesico TEXT,
  medicacion_preanestesica TEXT,
  id_anestesiologo INT REFERENCES personal_medico(id_personal_medico)
);

-- Nota Postoperatoria
CREATE TABLE nota_postoperatoria (
  id_nota_postoperatoria SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  fecha_cirugia DATE,
  diagnostico_postoperatorio TEXT,
  operacion_realizada TEXT,
  descripcion_tecnica TEXT,
  hallazgos TEXT,
  conteo_gasas_completo BOOLEAN,
  incidentes_accidentes TEXT,
  sangrado DECIMAL(10,2),  -- ml
  estado_postquirurgico TEXT,
  piezas_enviadas_patologia TEXT,
  plan_postoperatorio TEXT,
  pronostico TEXT,
  id_cirujano INT REFERENCES personal_medico(id_personal_medico),
  id_ayudante1 INT REFERENCES personal_medico(id_personal_medico),
  id_ayudante2 INT REFERENCES personal_medico(id_personal_medico),
  id_anestesiologo INT REFERENCES personal_medico(id_personal_medico),
  id_instrumentista TEXT,
  id_circulante TEXT
);

-- Nota Postanestésica
CREATE TABLE nota_postanestesica (
  id_nota_postanestesica SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  tipo_anestesia TEXT,
  duracion_anestesia INT,  -- minutos
  medicamentos_utilizados TEXT,
  estado_clinico_egreso TEXT,
  incidentes_accidentes TEXT,
  balance_hidrico TEXT,
  liquidos_administrados DECIMAL(10,2),  -- ml
  sangrado DECIMAL(10,2),  -- ml
  hemoderivados_transfundidos TEXT,
  plan_tratamiento TEXT,
  pronostico TEXT,
  id_anestesiologo INT REFERENCES personal_medico(id_personal_medico)
);

-- Nota de Egreso
CREATE TABLE nota_egreso (
  id_nota_egreso SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  diagnostico_ingreso TEXT,
  resumen_evolucion TEXT,
  manejo_hospitalario TEXT,
  diagnostico_egreso TEXT,
  id_guia_diagnostico INT REFERENCES guia_clinica(id_guia_diagnostico),
  procedimientos_realizados TEXT,
  fecha_procedimientos DATE,
  motivo_egreso TEXT,  -- Mejoría, Máximo beneficio, Voluntario, Defunción
  problemas_pendientes TEXT,
  plan_tratamiento TEXT,
  recomendaciones_vigilancia TEXT,
  atencion_factores_riesgo TEXT,
  pronostico TEXT,
  reingreso_por_misma_afeccion BOOLEAN DEFAULT FALSE
);

-- Nota de Psicología
CREATE TABLE nota_psicologia (
  id_nota_psicologia SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  motivo_consulta TEXT,
  impresion_diagnostica TEXT,
  evaluacion_mental_afectiva TEXT,
  evaluacion_cognitiva TEXT,
  plan_terapeutico TEXT,
  pronostico TEXT,
  recomendaciones TEXT
);

-- Nota de Nutrición
CREATE TABLE nota_nutricion (
  id_nota_nutricion SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  diagnostico_nutricional TEXT,
  estado_nutricional TEXT,
  requerimientos_caloricos DECIMAL(10,2),
  requerimientos_proteicos DECIMAL(10,2),
  indicaciones_dieta TEXT,
  plan_manejo_nutricional TEXT,
  factores_riesgo_nutricional TEXT,
  suplementos_recomendados TEXT,
  pronostico TEXT
);

-- ==========================================
-- PASO 8: CREAR TABLAS DE CONSENTIMIENTOS Y SOLICITUDES
-- ==========================================

-- Tabla principal de Consentimientos
CREATE TABLE consentimiento_informado (
  id_consentimiento SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  tipo_consentimiento TEXT NOT NULL,
  informacion_proporcionada TEXT,
  riesgos_informados TEXT,
  alternativas_informadas TEXT,
  nombre_testigo1 TEXT,
  nombre_testigo2 TEXT,
  id_medico_informa INT REFERENCES personal_medico(id_personal_medico),
  firma_paciente BOOLEAN DEFAULT FALSE,
  firma_medico BOOLEAN DEFAULT FALSE,
  firma_representante_legal BOOLEAN DEFAULT FALSE,
  nombre_representante_legal TEXT,
  parentesco_representante TEXT
);

-- Tabla de Solicitudes de Estudios
CREATE TABLE solicitud_estudio (
  id_solicitud SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  id_estudio INT REFERENCES estudio_medico(id_estudio),
  justificacion TEXT,
  preparacion_requerida TEXT,
  informacion_clinica_relevante TEXT,
  fecha_solicitada DATE NOT NULL,
  prioridad TEXT DEFAULT 'Normal',  -- Urgente, Normal
  fecha_realizacion DATE,
  hora_toma_muestra TIME,
  resultado TEXT,
  interpretacion TEXT,
  estado TEXT DEFAULT 'Solicitado'  -- Solicitado, En proceso, Completado, Cancelado
);

-- Tabla de Referencia/Traslado
CREATE TABLE referencia_traslado (
  id_referencia SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  establecimiento_origen TEXT,
  establecimiento_destino TEXT,
  motivo_envio TEXT,
  resumen_clinico TEXT,
  diagnostico TEXT,
  id_guia_diagnostico INT REFERENCES guia_clinica(id_guia_diagnostico),
  plan_tratamiento TEXT,
  estado_fisico TEXT,
  pronostico TEXT,
  tipo_traslado TEXT,  -- Ambulancia, Vehículo propio, etc.
  medico_receptor TEXT,
  observaciones TEXT
);

-- ==========================================
-- PASO 9: CREAR TABLAS DE TRATAMIENTOS Y MEDICACIÓN
-- ==========================================

-- Registro de medicamentos prescritos
CREATE TABLE prescripcion_medicamento (
  id_prescripcion SERIAL PRIMARY KEY,
  id_documento INT REFERENCES documento_clinico(id_documento),
  id_medicamento INT REFERENCES medicamento(id_medicamento),
  dosis TEXT NOT NULL,
  via_administracion TEXT NOT NULL,
  frecuencia TEXT NOT NULL,
  duracion TEXT,
  indicaciones_especiales TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  activo BOOLEAN DEFAULT TRUE
);

-- Registro de transfusiones
CREATE TABLE registro_transfusion (
  id_transfusion SERIAL PRIMARY KEY,
  id_documento INT REFERENCES documento_clinico(id_documento),
  tipo_componente TEXT NOT NULL,  -- Sangre total, Plaquetas, Plasma, etc.
  grupo_sanguineo VARCHAR(10) NOT NULL,
  numero_unidad TEXT NOT NULL,
  volumen DECIMAL(10,2),  -- ml
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP,
  id_medico_responsable INT REFERENCES personal_medico(id_personal_medico),
  reacciones_adversas TEXT,
  observaciones TEXT
);

-- ==========================================
-- PASO 10: CREAR SISTEMA DE AUDITORÍA
-- ==========================================

-- 1. Tabla de Auditoría General de Expedientes
CREATE TABLE expediente_auditoria (
  id_auditoria SERIAL PRIMARY KEY,
  id_expediente INT NOT NULL REFERENCES expediente(id_expediente),
  fecha_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_medico INT NOT NULL REFERENCES personal_medico(id_personal_medico),
  accion TEXT NOT NULL, -- 'consulta', 'actualizacion', 'nuevo_documento', 'acceso_negado'
  datos_anteriores JSONB, -- Respaldo de datos previos (para cambios)
  datos_nuevos JSONB, -- Nuevos datos (para cambios)
  ip_acceso INET,
  navegador TEXT,
  tiempo_sesion INT, -- Segundos en pantalla
  observaciones TEXT
);

-- 2. Tabla de Validación Obligatoria en Reingresos
CREATE TABLE validacion_reingreso (
  id_validacion SERIAL PRIMARY KEY,
  id_expediente INT NOT NULL REFERENCES expediente(id_expediente),
  id_internamiento INT NOT NULL REFERENCES internamiento(id_internamiento),
  fecha_validacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_medico_validador INT NOT NULL REFERENCES personal_medico(id_personal_medico),
  
  -- Datos obligatorios de re-validación
  peso_actual DECIMAL(5,2) NOT NULL,
  talla_actual DECIMAL(5,2) NOT NULL,
  presion_arterial_sistolica INT NOT NULL,
  presion_arterial_diastolica INT NOT NULL,
  temperatura DECIMAL(4,2) NOT NULL,
  
  -- Validaciones clínicas obligatorias
  alergias_confirmadas TEXT NOT NULL,
  medicamentos_actuales TEXT NOT NULL,
  contacto_emergencia_actual TEXT NOT NULL,
  
  -- Control de acceso a datos previos
  solicita_acceso_historico BOOLEAN DEFAULT FALSE,
  justificacion_acceso TEXT,
  acceso_historico_aprobado BOOLEAN DEFAULT FALSE,
  fecha_aprobacion_acceso TIMESTAMP,
  
  -- Estado de validación
  validacion_completa BOOLEAN DEFAULT FALSE,
  observaciones_validacion TEXT
);

-- 3. Tabla de Alertas del Sistema
CREATE TABLE alertas_sistema (
  id_alerta SERIAL PRIMARY KEY,
  tipo_alerta TEXT NOT NULL, -- 'CRITICA', 'ADVERTENCIA', 'INFORMATIVA'
  mensaje TEXT NOT NULL,
  id_expediente INT REFERENCES expediente(id_expediente),
  id_medico INT REFERENCES personal_medico(id_personal_medico),
  fecha_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado TEXT DEFAULT 'ACTIVA', -- 'ACTIVA', 'REVISADA', 'CERRADA'
  fecha_revision TIMESTAMP,
  id_medico_revisor INT REFERENCES personal_medico(id_personal_medico),
  acciones_tomadas TEXT
);

-- 4. Tabla de Control de Acceso a Datos Históricos
CREATE TABLE control_acceso_historico (
  id_control SERIAL PRIMARY KEY,
  id_expediente INT NOT NULL REFERENCES expediente(id_expediente),
  id_medico INT NOT NULL REFERENCES personal_medico(id_personal_medico),
  fecha_ultimo_ingreso DATE NOT NULL,
  dias_desde_ultimo_ingreso INT NOT NULL,
  requiere_validacion BOOLEAN DEFAULT TRUE,
  datos_bloqueados BOOLEAN DEFAULT TRUE, -- True = datos ocultos
  fecha_desbloqueo TIMESTAMP, -- Cuando se pueden ver datos previos
  tiempo_bloqueo_minutos INT DEFAULT 30,
  razon_bloqueo TEXT
);

-- 5. Tabla de Configuración del Sistema
CREATE TABLE configuracion_sistema (
  id_config SERIAL PRIMARY KEY,
  parametro TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descripcion TEXT,
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_modificador INT REFERENCES administrador(id_administrador)
);

-- Insertar configuraciones por defecto
INSERT INTO configuracion_sistema (parametro, valor, descripcion) VALUES
  ('dias_reingreso_bloqueo', '180', 'Días desde último ingreso para activar validación obligatoria'),
  ('tiempo_bloqueo_datos_minutos', '30', 'Minutos que permanecen ocultos los datos históricos'),
  ('requiere_supervisor_acceso_critico', 'true', 'Si se requiere supervisor para accesos críticos'),
  ('max_intentos_acceso_bloqueado', '3', 'Máximo intentos de acceso antes de bloquear usuario');

-- ==========================================
-- PASO 11: CREAR CONSTRAINS ADICIONALES
-- ==========================================

-- Agregar CHECK constraint para fecha_egreso
ALTER TABLE internamiento ADD CONSTRAINT check_fecha_egreso 
  CHECK (
    (fecha_egreso IS NULL AND tipo_egreso IS NULL) OR 
    (fecha_egreso IS NOT NULL AND tipo_egreso IS NOT NULL)
  );

-- ==========================================
-- PASO 12: CREAR FUNCIONES Y TRIGGERS
-- ==========================================

-- Función para detectar cambios sospechosos en datos del paciente
CREATE OR REPLACE FUNCTION detectar_cambios_sospechosos()
RETURNS TRIGGER AS $$
BEGIN
  -- Alerta CRÍTICA: Solo cambió el nombre
  IF OLD.nombre != NEW.nombre AND 
     OLD.apellido_paterno = NEW.apellido_paterno AND
     OLD.apellido_materno = NEW.apellido_materno AND
     OLD.fecha_nacimiento = NEW.fecha_nacimiento AND
     OLD.sexo = NEW.sexo THEN
    
    INSERT INTO alertas_sistema (tipo_alerta, mensaje, id_expediente) 
    VALUES ('CRITICA', 
            CONCAT('POSIBLE COPIA DE EXPEDIENTE: Solo cambió nombre de "', OLD.nombre, '" a "', NEW.nombre, '"'),
            (SELECT id_expediente FROM expediente WHERE id_paciente = 
             (SELECT id_paciente FROM paciente WHERE id_persona = NEW.id_persona)));
  END IF;
  
  -- Alerta ADVERTENCIA: Cambios múltiples sospechosos
  IF OLD.telefono != NEW.telefono AND 
     OLD.domicilio != NEW.domicilio AND
     OLD.correo_electronico != NEW.correo_electronico THEN
    
    INSERT INTO alertas_sistema (tipo_alerta, mensaje, id_expediente) 
    VALUES ('ADVERTENCIA', 
            'Múltiples datos de contacto cambiaron simultáneamente',
            (SELECT id_expediente FROM expediente WHERE id_paciente = 
             (SELECT id_paciente FROM paciente WHERE id_persona = NEW.id_persona)));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para validar fechas de egreso
CREATE OR REPLACE FUNCTION validar_fechas_egreso()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fecha_egreso IS NOT NULL AND NEW.fecha_egreso <= NEW.fecha_ingreso THEN
    RAISE EXCEPTION 'La fecha de egreso debe ser posterior a la fecha de ingreso';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para validar reingreso de paciente
CREATE OR REPLACE FUNCTION validar_reingreso_paciente(p_id_expediente INT, p_id_medico INT)
RETURNS BOOLEAN AS $$
DECLARE
  ultimo_ingreso DATE;
  dias_diferencia INT;
  requiere_validacion BOOLEAN := FALSE;
BEGIN
  -- Obtener fecha del último ingreso
  SELECT MAX(fecha_ingreso::DATE) INTO ultimo_ingreso
  FROM internamiento 
  WHERE id_expediente = p_id_expediente;
  
  -- Calcular días desde último ingreso
  dias_diferencia := EXTRACT(DAYS FROM (CURRENT_DATE - ultimo_ingreso));
  
  -- Si han pasado más de 6 meses (180 días), requiere validación
  IF dias_diferencia > 180 THEN
    requiere_validacion := TRUE;
    
    -- Insertar registro de control
    INSERT INTO control_acceso_historico (
      id_expediente, id_medico, fecha_ultimo_ingreso, 
      dias_desde_ultimo_ingreso, requiere_validacion, datos_bloqueados,
      fecha_desbloqueo, razon_bloqueo
    ) VALUES (
      p_id_expediente, p_id_medico, ultimo_ingreso,
      dias_diferencia, TRUE, TRUE,
      CURRENT_TIMESTAMP + INTERVAL '30 minutes',
      CONCAT('Reingreso después de ', dias_diferencia, ' días')
    );
    
    -- Generar alerta informativa
    INSERT INTO alertas_sistema (tipo_alerta, mensaje, id_expediente, id_medico)
    VALUES ('INFORMATIVA', 
            CONCAT('Paciente con reingreso después de ', dias_diferencia, ' días. Validación requerida.'),
            p_id_expediente, p_id_medico);
  END IF;
  
  RETURN requiere_validacion;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar auditoría
CREATE OR REPLACE FUNCTION registrar_auditoria(
  p_id_expediente INT,
  p_id_medico INT,
  p_accion TEXT,
  p_datos_anteriores JSONB DEFAULT NULL,
  p_datos_nuevos JSONB DEFAULT NULL,
  p_observaciones TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO expediente_auditoria (
    id_expediente, id_medico, accion, datos_anteriores, 
    datos_nuevos, ip_acceso, observaciones
  ) VALUES (
    p_id_expediente, p_id_medico, p_accion, p_datos_anteriores,
    p_datos_nuevos, inet_client_addr(), p_observaciones
  );
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PASO 13: CREAR TRIGGERS
-- ==========================================

-- Trigger para detectar cambios sospechosos
CREATE TRIGGER trg_detectar_cambios_sospechosos
AFTER UPDATE ON persona
FOR EACH ROW
EXECUTE FUNCTION detectar_cambios_sospechosos();

-- Trigger para validar fechas de egreso
CREATE TRIGGER trg_validar_fechas_egreso
BEFORE INSERT OR UPDATE ON internamiento
FOR EACH ROW
EXECUTE FUNCTION validar_fechas_egreso();

-- ==========================================
-- PASO 14: CREAR ÍNDICES PARA OPTIMIZACIÓN
-- ==========================================

-- Índices básicos
CREATE INDEX idx_expediente_numero ON expediente(numero_expediente);
CREATE INDEX idx_expediente_paciente ON expediente(id_paciente);
CREATE INDEX idx_internamiento_fecha_ingreso ON internamiento(fecha_ingreso);
CREATE INDEX idx_internamiento_servicio_activo ON internamiento(id_servicio) WHERE fecha_egreso IS NULL;
CREATE INDEX idx_cama_estado ON cama(estado);
CREATE INDEX idx_documento_expediente ON documento_clinico(id_expediente);
CREATE INDEX idx_documento_creador ON documento_clinico(id_personal_creador);
CREATE INDEX idx_paciente_id ON paciente(id_persona);
CREATE INDEX idx_persona_nombres ON persona(apellido_paterno, apellido_materno, nombre);

-- Índices para auditoría
CREATE INDEX idx_auditoria_expediente ON expediente_auditoria(id_expediente);
CREATE INDEX idx_auditoria_medico ON expediente_auditoria(id_medico);
CREATE INDEX idx_auditoria_fecha ON expediente_auditoria(fecha_acceso);
CREATE INDEX idx_auditoria_accion ON expediente_auditoria(accion);

-- Índices para alertas
CREATE INDEX idx_alertas_tipo ON alertas_sistema(tipo_alerta);
CREATE INDEX idx_alertas_estado ON alertas_sistema(estado);
CREATE INDEX idx_alertas_expediente ON alertas_sistema(id_expediente);

-- Índices para control de acceso
CREATE INDEX idx_control_acceso_expediente ON control_acceso_historico(id_expediente);
CREATE INDEX idx_control_acceso_medico ON control_acceso_historico(id_medico);

-- ==========================================
-- PASO 15: CONFIGURAR BÚSQUEDA DE TEXTO COMPLETO
-- ==========================================

-- Instalar extensión pg_trgm si no existe
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Agregar columna tsvector para búsqueda
ALTER TABLE documento_clinico ADD COLUMN texto_busqueda tsvector;

-- Crear índice GIN para búsquedas eficientes
CREATE INDEX idx_documento_texto ON documento_clinico USING GIN(texto_busqueda);

-- Trigger para actualizar búsqueda de texto
CREATE TRIGGER trg_actualizar_texto_busqueda
BEFORE INSERT OR UPDATE ON documento_clinico
FOR EACH ROW
EXECUTE FUNCTION tsvector_update_trigger(
  texto_busqueda,
  'pg_catalog.spanish',
  id_tipo_documento
);

-- ==========================================
-- PASO 16: CREAR VISTAS ÚTILES PARA REPORTES
-- ==========================================

-- Vista de expedientes con alertas activas
CREATE VIEW expedientes_con_alertas AS
SELECT 
  e.id_expediente,
  e.numero_expediente,
  CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as nombre_paciente,
  a.tipo_alerta,
  a.mensaje,
  a.fecha_alerta,
  CONCAT(pm.nombre, ' ', pm.apellido_paterno) as medico_responsable
FROM expediente e
JOIN paciente pac ON e.id_paciente = pac.id_paciente
JOIN persona p ON pac.id_persona = p.id_persona
JOIN alertas_sistema a ON e.id_expediente = a.id_expediente
LEFT JOIN personal_medico pm_person ON a.id_medico = pm_person.id_personal_medico
LEFT JOIN persona pm ON pm_person.id_persona = pm.id_persona
WHERE a.estado = 'ACTIVA';

-- Vista de actividad de auditoría por médico
CREATE VIEW actividad_medicos AS
SELECT 
  CONCAT(p.nombre, ' ', p.apellido_paterno) as medico,
  pm.especialidad,
  COUNT(*) as total_accesos,
  COUNT(CASE WHEN ea.accion = 'nuevo_documento' THEN 1 END) as documentos_creados,
  COUNT(CASE WHEN ea.accion = 'actualizacion' THEN 1 END) as actualizaciones,
  MAX(ea.fecha_acceso) as ultimo_acceso
FROM expediente_auditoria ea
JOIN personal_medico pm ON ea.id_medico = pm.id_personal_medico
JOIN persona p ON pm.id_persona = p.id_persona
WHERE ea.fecha_acceso >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY pm.id_personal_medico, p.nombre, p.apellido_paterno, pm.especialidad
ORDER BY total_accesos DESC;

-- ==========================================
-- PASO 17: AGREGAR COMENTARIOS FINALES
-- ==========================================

COMMENT ON TABLE documento_clinico IS 'Tabla base para almacenar documentos clínicos generales.';
COMMENT ON COLUMN documento_clinico.id_tipo_documento IS 'Clave foránea a tipo_documento.';
COMMENT ON TABLE expediente_auditoria IS 'Registro de auditoría para control anti-pereza médica.';
COMMENT ON TABLE validacion_reingreso IS 'Validaciones obligatorias en reingresos de pacientes.';
COMMENT ON TABLE alertas_sistema IS 'Sistema de alertas para cambios sospechosos.';

-- ==========================================
-- SCRIPT COMPLETADO EXITOSAMENTE
-- Base de Datos: Hospital General San Luis de la Paz
-- Sistema de Expedientes Clínicos con Auditoría
-- Cumplimiento: NOM-004-SSA3-2012
-- ==========================================






-- ==========================================
-- EXTENSIÓN PEDIÁTRICA
-- Hospital General San Luis de la Paz
-- Modificaciones específicas para pediatría
-- ==========================================

-- ==========================================
-- PASO 1: AGREGAR CAMPOS PEDIÁTRICOS A TABLAS EXISTENTES
-- ==========================================

-- Ampliar tabla PERSONA con indicador pediátrico
ALTER TABLE persona ADD COLUMN IF NOT EXISTS es_pediatrico BOOLEAN DEFAULT FALSE;

-- Ampliar tabla PACIENTE con datos específicos pediátricos
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS nombre_madre TEXT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS edad_madre INT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS ocupacion_madre TEXT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS escolaridad_madre TEXT;

ALTER TABLE paciente ADD COLUMN IF NOT EXISTS nombre_padre TEXT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS edad_padre INT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS ocupacion_padre TEXT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS escolaridad_padre TEXT;

-- Campos de derechohabiencia y programas sociales
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS derechohabiente TEXT; -- 'IMSS', 'ISSSTE', 'Ninguno', 'Otro'
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS programa_social TEXT; -- 'Ninguno', 'Oportunidades', 'Otro'
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS especificar_otro_derechohabiente TEXT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS especificar_otro_programa TEXT;

-- Campos adicionales de condiciones sociales
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS calidad_alimentacion TEXT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS agua_ingesta TEXT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS hacinamiento TEXT;
ALTER TABLE paciente ADD COLUMN IF NOT EXISTS cohabita_con TEXT;

-- ==========================================
-- PASO 2: CREAR TABLAS ESPECÍFICAS PEDIÁTRICAS
-- ==========================================

-- Tabla de Antecedentes Heredo-Familiares Detallados (específico pediatría)
CREATE TABLE antecedentes_heredo_familiares (
  id_antecedentes_hf SERIAL PRIMARY KEY,
  id_historia_clinica INT NOT NULL REFERENCES historia_clinica(id_historia_clinica),
  
  -- Antecedentes por familiar específico
  madre_alergias TEXT,
  madre_tuberculosis TEXT,
  madre_sifilis TEXT,
  madre_discrasias TEXT,
  madre_diabetes TEXT,
  madre_cardiopatias TEXT,
  madre_convulsiones TEXT,
  madre_hipotiroidismo TEXT,
  madre_hipertension TEXT,
  madre_toxicomanias TEXT,
  madre_otros TEXT,
  
  padre_alergias TEXT,
  padre_tuberculosis TEXT,
  padre_sifilis TEXT,
  padre_discrasias TEXT,
  padre_diabetes TEXT,
  padre_cardiopatias TEXT,
  padre_convulsiones TEXT,
  padre_hipotiroidismo TEXT,
  padre_hipertension TEXT,
  padre_toxicomanias TEXT,
  padre_otros TEXT,
  
  hermanos_antecedentes TEXT,
  abuelos_paternos_antecedentes TEXT,
  abuelos_maternos_antecedentes TEXT,
  otros_familiares_antecedentes TEXT,
  
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Antecedentes Perinatales
CREATE TABLE antecedentes_perinatales (
  id_perinatales SERIAL PRIMARY KEY,
  id_historia_clinica INT NOT NULL REFERENCES historia_clinica(id_historia_clinica),
  
  -- Datos del embarazo
  embarazo_planeado BOOLEAN,
  numero_embarazo INT,
  control_prenatal BOOLEAN,
  numero_consultas_prenatales INT,
  complicaciones_embarazo TEXT,
  
  -- Datos del parto
  tipo_parto TEXT, -- 'Vaginal', 'Cesárea'
  semanas_gestacion INT,
  peso_nacimiento DECIMAL(5,2), -- kg
  talla_nacimiento DECIMAL(5,2), -- cm
  apgar_1_min INT,
  apgar_5_min INT,
  llanto_inmediato BOOLEAN,
  
  -- Periodo neonatal
  hospitalizacion_neonatal BOOLEAN,
  dias_hospitalizacion_neonatal INT,
  problemas_neonatales TEXT,
  alimentacion_neonatal TEXT, -- 'Seno materno', 'Fórmula', 'Mixta'
  
  -- Desarrollo temprano
  peso_2_meses DECIMAL(5,2),
  peso_4_meses DECIMAL(5,2),
  peso_6_meses DECIMAL(5,2),
  
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Desarrollo Psicomotriz
CREATE TABLE desarrollo_psicomotriz (
  id_desarrollo SERIAL PRIMARY KEY,
  id_historia_clinica INT NOT NULL REFERENCES historia_clinica(id_historia_clinica),
  
  -- Hitos del desarrollo motor
  sostuvo_cabeza_meses INT,
  se_sento_meses INT,
  gateo_meses INT,
  camino_meses INT,
  
  -- Hitos del desarrollo del lenguaje
  primera_palabra_meses INT,
  primeras_frases_meses INT,
  
  -- Hitos sociales
  sonrisa_social_meses INT,
  reconocimiento_padres_meses INT,
  
  -- Control de esfínteres
  control_diurno_meses INT,
  control_nocturno_meses INT,
  
  -- Desarrollo cognitivo
  juego_simbolico_meses INT,
  seguimiento_instrucciones_meses INT,
  
  -- Observaciones generales
  desarrollo_normal BOOLEAN DEFAULT TRUE,
  observaciones_desarrollo TEXT,
  necesita_estimulacion BOOLEAN DEFAULT FALSE,
  tipo_estimulacion TEXT,
  
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Inmunizaciones
-- CREATE TABLE inmunizaciones (
--   id_inmunizacion SERIAL PRIMARY KEY,
--   id_historia_clinica INT NOT NULL REFERENCES historia_clinica(id_historia_clinica),
  
--   -- Esquema básico
--   bcg_fecha DATE,
--   bcg_observaciones TEXT,
  
--   hepatitis_b_1_fecha DATE,
--   hepatitis_b_2_fecha DATE,
--   hepatitis_b_3_fecha DATE,
--   hepatitis_b_observaciones TEXT,
  
--   pentavalente_1_fecha DATE,
--   pentavalente_2_fecha DATE,
--   pentavalente_3_fecha DATE,
--   pentavalente_observaciones TEXT,
  
--   rotavirus_1_fecha DATE,
--   rotavirus_2_fecha DATE,
--   rotavirus_3_fecha DATE,
--   rotavirus_observaciones TEXT,
  
--   neumococo_1_fecha DATE,
--   neumococo_2_fecha DATE,
--   neumococo_3_fecha DATE,
--   neumococo_refuerzo_fecha DATE,
--   neumococo_observaciones TEXT,
  
--   influenza_fecha DATE,
--   influenza_observaciones TEXT,
  
--   srp_12_meses_fecha DATE,
--   srp_6_anos_fecha DATE,
--   srp_observaciones TEXT,
  
--   dpt_4_anos_fecha DATE,
--   dpt_observaciones TEXT,
  
--   -- Vacunas adicionales
--   varicela_fecha DATE,
--   varicela_observaciones TEXT,
  
--   hepatitis_a_fecha DATE,
--   hepatitis_a_observaciones TEXT,
  
--   vph_fecha DATE,
--   vph_observaciones TEXT,
  
--   -- Control general
--   esquema_completo_edad BOOLEAN DEFAULT FALSE,
--   esquema_incompleto_razon TEXT,
--   reacciones_adversas TEXT,
  
--   fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE inmunizaciones (
  id_inmunizacion SERIAL PRIMARY KEY,
  id_historia_clinica INT NOT NULL REFERENCES historia_clinica(id_historia_clinica),

  -- Esquema básico
  bcg_fecha DATE,
  bcg_observaciones TEXT,

  hepatitis_b_1_fecha DATE,
  hepatitis_b_2_fecha DATE,
  hepatitis_b_3_fecha DATE,
  hepatitis_b_observaciones TEXT,

  pentavalente_1_fecha DATE,
  pentavalente_2_fecha DATE,
  pentavalente_3_fecha DATE,
  pentavalente_observaciones TEXT,

  rotavirus_1_fecha DATE,
  rotavirus_2_fecha DATE,
  rotavirus_3_fecha DATE,
  rotavirus_observaciones TEXT,

  neumococo_1_fecha DATE,
  neumococo_2_fecha DATE,
  neumococo_3_fecha DATE,
  neumococo_refuerzo_fecha DATE,
  neumococo_observaciones TEXT,

  influenza_fecha DATE,
  influenza_observaciones TEXT,

  srp_12_meses_fecha DATE,
  srp_6_anos_fecha DATE,
  srp_observaciones TEXT,

  dpt_4_anos_fecha DATE,
  dpt_observaciones TEXT,

  varicela_fecha DATE,
  varicela_observaciones TEXT,

  hepatitis_a_fecha DATE,
  hepatitis_a_observaciones TEXT,

  vph_fecha DATE,
  vph_observaciones TEXT,

  -- NUEVO CAMPO: Otras vacunas
  otros_nombre TEXT,
  otros_fecha DATE,
  otros_observaciones TEXT,

  -- Control general
  esquema_completo_edad BOOLEAN DEFAULT FALSE,
  esquema_incompleto_razon TEXT,
  reacciones_adversas TEXT,

  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


agregar algo como 'OTROS' , donde pongan otras en caso de que no vengan en la tabla

-- Tabla de Estado Nutricional Pediátrico
CREATE TABLE estado_nutricional_pediatrico (
  id_nutricional SERIAL PRIMARY KEY,
  id_historia_clinica INT NOT NULL REFERENCES historia_clinica(id_historia_clinica),
  
  -- Antropometría
  peso_kg DECIMAL(5,2) NOT NULL,
  talla_cm DECIMAL(5,2) NOT NULL,
  perimetro_cefalico_cm DECIMAL(5,2),
  perimetro_brazo_cm DECIMAL(5,2),
  
  -- Percentiles
  percentil_peso INT,
  percentil_talla INT,
  percentil_perimetro_cefalico INT,
  
  -- Índices nutricionales
  peso_para_edad TEXT, -- 'Normal', 'Bajo peso', 'Sobrepeso', 'Obesidad'
  talla_para_edad TEXT, -- 'Normal', 'Baja talla', 'Talla alta'
  peso_para_talla TEXT, -- 'Normal', 'Desnutrición', 'Sobrepeso', 'Obesidad'
  
  -- Evaluación clínica
  aspecto_general TEXT,
  estado_hidratacion TEXT,
  palidez_mucosas BOOLEAN DEFAULT FALSE,
  edemas BOOLEAN DEFAULT FALSE,
  masa_muscular TEXT, -- 'Adecuada', 'Disminuida', 'Aumentada'
  tejido_adiposo TEXT, -- 'Adecuado', 'Disminuido', 'Aumentado'
  
  -- Alimentación
  tipo_alimentacion TEXT, -- 'Seno materno exclusivo', 'Fórmula', 'Mixta', 'Complementaria'
  edad_ablactacion_meses INT,
  numero_comidas_dia INT,
  apetito TEXT, -- 'Bueno', 'Regular', 'Malo'
  alimentos_rechazados TEXT,
  
  -- Diagnóstico nutricional
  diagnostico_nutricional TEXT,
  recomendaciones_nutricionales TEXT,
  
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- PASO 3: MODIFICAR TABLA HISTORIA_CLINICA PARA PEDIATRÍA
-- ==========================================

-- Agregar campos específicos pediátricos a historia_clinica
ALTER TABLE historia_clinica ADD COLUMN IF NOT EXISTS tipo_historia TEXT DEFAULT 'general'; -- 'general', 'pediatrica'

-- Campos específicos de pediatría que no están en otras tablas
ALTER TABLE historia_clinica ADD COLUMN IF NOT EXISTS religion_familia TEXT;
ALTER TABLE historia_clinica ADD COLUMN IF NOT EXISTS higiene_personal_familia TEXT;

-- ==========================================
-- PASO 4: CREAR TIPOS ENUM ESPECÍFICOS PEDIÁTRICOS
-- ==========================================

-- Tipo ENUM para derechohabiencia
CREATE TYPE derechohabiente_enum AS ENUM (
  'IMSS', 
  'ISSSTE', 
  'Ninguno', 
  'Otro'
);

-- Tipo ENUM para programas sociales
CREATE TYPE programa_social_enum AS ENUM (
  'Ninguno', 
  'Oportunidades', 
  'PROSPERA',
  'Otro'
);

-- Tipo ENUM para tipo de parto
CREATE TYPE tipo_parto_enum AS ENUM (
  'Vaginal', 
  'Cesarea'
);

-- Tipo ENUM para tipo de alimentación
CREATE TYPE tipo_alimentacion_enum AS ENUM (
  'Seno materno exclusivo',
  'Formula',
  'Mixta',
  'Complementaria'
);

-- ==========================================
-- PASO 5: APLICAR TIPOS ENUM A LAS COLUMNAS
-- ==========================================

-- Aplicar ENUM a paciente
ALTER TABLE paciente ALTER COLUMN derechohabiente TYPE derechohabiente_enum USING derechohabiente::derechohabiente_enum;
ALTER TABLE paciente ALTER COLUMN programa_social TYPE programa_social_enum USING programa_social::programa_social_enum;

-- Aplicar ENUM a antecedentes_perinatales
ALTER TABLE antecedentes_perinatales ALTER COLUMN tipo_parto TYPE tipo_parto_enum USING tipo_parto::tipo_parto_enum;

-- Aplicar ENUM a estado_nutricional_pediatrico
ALTER TABLE estado_nutricional_pediatrico ALTER COLUMN tipo_alimentacion TYPE tipo_alimentacion_enum USING tipo_alimentacion::tipo_alimentacion_enum;

-- ==========================================
-- PASO 6: CREAR ÍNDICES PARA OPTIMIZACIÓN PEDIÁTRICA
-- ==========================================

-- Índices para búsquedas pediátricas
CREATE INDEX idx_persona_pediatrico ON persona(es_pediatrico) WHERE es_pediatrico = TRUE;
CREATE INDEX idx_historia_pediatrica ON historia_clinica(tipo_historia) WHERE tipo_historia = 'pediatrica';
CREATE INDEX idx_desarrollo_psicomotriz_historia ON desarrollo_psicomotriz(id_historia_clinica);
CREATE INDEX idx_inmunizaciones_historia ON inmunizaciones(id_historia_clinica);
CREATE INDEX idx_nutricional_pediatrico_historia ON estado_nutricional_pediatrico(id_historia_clinica);
CREATE INDEX idx_perinatales_historia ON antecedentes_perinatales(id_historia_clinica);
CREATE INDEX idx_antecedentes_hf_historia ON antecedentes_heredo_familiares(id_historia_clinica);

-- ==========================================
-- PASO 7: CREAR VISTAS ESPECÍFICAS PEDIÁTRICAS
-- ==========================================

-- Vista completa de expediente pediátrico
CREATE VIEW expediente_pediatrico_completo AS
SELECT 
  e.id_expediente,
  e.numero_expediente,
  CONCAT(per.nombre, ' ', per.apellido_paterno, ' ', per.apellido_materno) as nombre_paciente,
  EXTRACT(YEAR FROM AGE(per.fecha_nacimiento)) as edad_anos,
  EXTRACT(MONTH FROM AGE(per.fecha_nacimiento)) as edad_meses,
  per.sexo,
  per.fecha_nacimiento,
  
  -- Datos de padres
  pac.nombre_madre,
  pac.edad_madre,
  pac.nombre_padre,
  pac.edad_padre,
  pac.derechohabiente,
  pac.programa_social,
  
  -- Estado del expediente
  e.fecha_apertura,
  e.estado,
  
  -- Última historia clínica
  hc.id_historia_clinica,
  dc.fecha_elaboracion as fecha_ultima_historia
  
FROM expediente e
JOIN paciente pac ON e.id_paciente = pac.id_paciente
JOIN persona per ON pac.id_persona = per.id_persona
LEFT JOIN documento_clinico dc ON dc.id_expediente = e.id_expediente 
  AND dc.id_tipo_documento = (SELECT id_tipo_documento FROM tipo_documento WHERE nombre = 'Historia Clínica')
LEFT JOIN historia_clinica hc ON hc.id_documento = dc.id_documento
WHERE per.es_pediatrico = TRUE
  AND (dc.id_documento IS NULL OR dc.fecha_elaboracion = (
    SELECT MAX(dc2.fecha_elaboracion) 
    FROM documento_clinico dc2 
    WHERE dc2.id_expediente = e.id_expediente 
    AND dc2.id_tipo_documento = (SELECT id_tipo_documento FROM tipo_documento WHERE nombre = 'Historia Clínica')
  ))
ORDER BY e.fecha_apertura DESC;

-- Vista de esquema de vacunación
CREATE VIEW esquema_vacunacion AS
SELECT 
  i.id_inmunizacion,
  ep.nombre_paciente,
  ep.edad_anos,
  ep.edad_meses,
  
  -- Vacunas básicas
  i.bcg_fecha,
  i.hepatitis_b_1_fecha,
  i.hepatitis_b_2_fecha,
  i.hepatitis_b_3_fecha,
  i.pentavalente_1_fecha,
  i.pentavalente_2_fecha,
  i.pentavalente_3_fecha,
  i.srp_12_meses_fecha,
  i.esquema_completo_edad,
  i.esquema_incompleto_razon
  
FROM inmunizaciones i
JOIN historia_clinica hc ON i.id_historia_clinica = hc.id_historia_clinica
JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
JOIN expediente_pediatrico_completo ep ON dc.id_expediente = ep.id_expediente;

-- ==========================================
-- PASO 8: CREAR FUNCIONES ESPECÍFICAS PEDIÁTRICAS
-- ==========================================

-- Función para calcular edad en meses
CREATE OR REPLACE FUNCTION calcular_edad_meses(fecha_nacimiento DATE)
RETURNS INT AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) * 12 + 
         EXTRACT(MONTH FROM AGE(fecha_nacimiento));
END;
$$ LANGUAGE plpgsql;

-- Función para validar hitos del desarrollo
CREATE OR REPLACE FUNCTION validar_desarrollo_psicomotriz(
  p_edad_meses INT,
  p_sostuvo_cabeza INT,
  p_se_sento INT,
  p_camino INT
)
RETURNS TEXT AS $$
BEGIN
  -- Validar hitos según edad esperada
  IF p_sostuvo_cabeza > 4 THEN
    RETURN 'ALERTA: Sostuvo cabeza tardío (esperado: 2-4 meses)';
  END IF;
  
  IF p_se_sento > 9 THEN
    RETURN 'ALERTA: Se sentó tardío (esperado: 6-9 meses)';
  END IF;
  
  IF p_camino > 18 THEN
    RETURN 'ALERTA: Caminó tardío (esperado: 12-18 meses)';
  END IF;
  
  RETURN 'Desarrollo normal';
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PASO 9: INSERTAR DATOS INICIALES PEDIÁTRICOS
-- ==========================================

-- Actualizar tipos de documentos para incluir específicos pediátricos
INSERT INTO tipo_documento (nombre, descripcion) VALUES
  ('Historia Clínica Pediátrica', 'Historia clínica específica para pacientes pediátricos'),
  ('Control de Crecimiento y Desarrollo', 'Seguimiento del crecimiento y desarrollo psicomotriz'),
  ('Esquema de Vacunación', 'Control y seguimiento de inmunizaciones')
ON CONFLICT (nombre) DO NOTHING;

-- ==========================================
-- PASO 10: COMENTARIOS FINALES
-- ==========================================

COMMENT ON TABLE antecedentes_heredo_familiares IS 'Antecedentes familiares detallados específicos para pediatría';
COMMENT ON TABLE antecedentes_perinatales IS 'Antecedentes del embarazo, parto y periodo neonatal';
COMMENT ON TABLE desarrollo_psicomotriz IS 'Seguimiento de hitos del desarrollo psicomotriz';
COMMENT ON TABLE inmunizaciones IS 'Control del esquema de vacunación pediátrico';
COMMENT ON TABLE estado_nutricional_pediatrico IS 'Evaluación nutricional específica pediátrica';

-- ==========================================
-- EXTENSIÓN PEDIÁTRICA COMPLETADA
-- Base de Datos: Hospital General San Luis de la Paz
-- Cumplimiento: NOM-004-SSA3-2012 + Especificaciones Pediátricas
-- ==========================================



-- ==========================================
-- MEJORAS MENORES AL MODELO DE BASE DE DATOS
-- Hospital General San Luis de la Paz
-- SEGURO PARA AGREGAR AL FINAL DEL SCRIPT PRINCIPAL
-- ==========================================

-- ==========================================
-- PASO 18: FUNCIONES ADICIONALES DE UTILIDAD
-- ==========================================

-- Función para calcular edad automáticamente (NUEVA - NO ALTERA DATOS EXISTENTES)
CREATE OR REPLACE FUNCTION calcular_edad_actual(fecha_nacimiento DATE)
RETURNS TABLE(años INT, meses INT, dias INT) AS $$
BEGIN
  RETURN QUERY SELECT 
    EXTRACT(YEAR FROM AGE(fecha_nacimiento))::INT,
    EXTRACT(MONTH FROM AGE(fecha_nacimiento))::INT,
    EXTRACT(DAY FROM AGE(fecha_nacimiento))::INT;
END;
$$ LANGUAGE plpgsql;

-- Función auxiliar para obtener solo los años de edad (NUEVA)
CREATE OR REPLACE FUNCTION edad_en_anos(fecha_nacimiento DATE)
RETURNS INT AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(fecha_nacimiento))::INT;
END;
$$ LANGUAGE plpgsql;

-- Función auxiliar para obtener edad total en meses (NUEVA)
CREATE OR REPLACE FUNCTION edad_total_meses(fecha_nacimiento DATE)
RETURNS INT AS $$
BEGIN
  RETURN (EXTRACT(YEAR FROM AGE(fecha_nacimiento)) * 12 + 
          EXTRACT(MONTH FROM AGE(fecha_nacimiento)))::INT;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PASO 19: TRIGGER PARA VALIDACIÓN DE CURP
-- ==========================================

-- Función para validar formato de CURP (NUEVA - SOLO VALIDACIÓN)
CREATE OR REPLACE FUNCTION validar_curp()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar longitud de CURP
  IF NEW.curp IS NOT NULL AND LENGTH(NEW.curp) != 18 THEN
    RAISE EXCEPTION 'CURP debe tener exactamente 18 caracteres. Recibido: % caracteres', LENGTH(NEW.curp);
  END IF;
  
  -- Validar que no esté vacío si se proporciona
  IF NEW.curp IS NOT NULL AND TRIM(NEW.curp) = '' THEN
    RAISE EXCEPTION 'CURP no puede estar vacío';
  END IF;
  
  -- Validar formato básico (4 letras + 6 números + 6 alfanuméricos + 2 números)
  IF NEW.curp IS NOT NULL AND NOT (NEW.curp ~ '^[A-Z]{4}[0-9]{6}[A-Z0-9]{6}[0-9]{2}$') THEN
    RAISE EXCEPTION 'CURP no tiene el formato válido. Formato esperado: 4 letras + 6 números + 6 alfanuméricos + 2 números';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para validación de CURP (NUEVO - NO AFECTA DATOS EXISTENTES)
CREATE TRIGGER trg_validar_curp
BEFORE INSERT OR UPDATE ON persona
FOR EACH ROW EXECUTE FUNCTION validar_curp();

-- ==========================================
-- PASO 20: VISTAS ADICIONALES PARA DASHBOARD
-- ==========================================

-- Vista de resumen de camas por servicio (NUEVA - SOLO LECTURA)
CREATE VIEW resumen_camas_servicio AS
SELECT 
  s.nombre as servicio,
  COUNT(*) as total_camas,
  COUNT(CASE WHEN c.estado = 'Disponible' THEN 1 END) as disponibles,
  COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END) as ocupadas,
  COUNT(CASE WHEN c.estado = 'Mantenimiento' THEN 1 END) as mantenimiento,
  COUNT(CASE WHEN c.estado = 'Reservada' THEN 1 END) as reservadas,
  ROUND(
    (COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END)::DECIMAL / 
     NULLIF(COUNT(CASE WHEN c.estado IN ('Disponible', 'Ocupada') THEN 1 END), 0)) * 100, 2
  ) as porcentaje_ocupacion
FROM servicio s
LEFT JOIN cama c ON s.id_servicio = c.id_servicio
GROUP BY s.id_servicio, s.nombre
ORDER BY s.nombre;

-- Vista de dashboard médico general (NUEVA - SOLO LECTURA)
CREATE VIEW dashboard_general AS
SELECT 
  -- Contadores principales
  (SELECT COUNT(*) FROM expediente WHERE estado = 'Activo') as expedientes_activos,
  (SELECT COUNT(*) FROM internamiento WHERE fecha_egreso IS NULL) as pacientes_hospitalizados,
  (SELECT COUNT(*) FROM alertas_sistema WHERE estado = 'ACTIVA') as alertas_pendientes,
  (SELECT COUNT(*) FROM cama WHERE estado = 'Disponible') as camas_disponibles,
  (SELECT COUNT(*) FROM cama WHERE estado = 'Ocupada') as camas_ocupadas,
  
  -- Estadísticas del día
  (SELECT COUNT(*) FROM internamiento WHERE DATE(fecha_ingreso) = CURRENT_DATE) as ingresos_hoy,
  (SELECT COUNT(*) FROM internamiento WHERE DATE(fecha_egreso) = CURRENT_DATE) as egresos_hoy,
  (SELECT COUNT(*) FROM documento_clinico WHERE DATE(fecha_elaboracion) = CURRENT_DATE) as documentos_hoy,
  
  -- Urgencias
  (SELECT COUNT(*) FROM internamiento i 
   JOIN servicio s ON i.id_servicio = s.id_servicio 
   WHERE s.nombre = 'Urgencias' AND i.fecha_egreso IS NULL) as pacientes_urgencias;

-- Vista de pacientes pediatricos activos (NUEVA - SOLO LECTURA)
CREATE VIEW pacientes_pediatricos_activos AS
SELECT 
  e.numero_expediente,
  CONCAT(per.nombre, ' ', per.apellido_paterno, ' ', per.apellido_materno) as nombre_completo,
  edad_en_anos(per.fecha_nacimiento) as edad_anos,
  edad_total_meses(per.fecha_nacimiento) as edad_total_meses,
  per.sexo,
  pac.nombre_madre,
  pac.nombre_padre,
  i.fecha_ingreso,
  s.nombre as servicio_actual,
  c.numero as cama_actual
FROM expediente e
JOIN paciente pac ON e.id_paciente = pac.id_paciente
JOIN persona per ON pac.id_persona = per.id_persona
LEFT JOIN internamiento i ON e.id_expediente = i.id_expediente AND i.fecha_egreso IS NULL
LEFT JOIN servicio s ON i.id_servicio = s.id_servicio
LEFT JOIN cama c ON i.id_cama = c.id_cama
WHERE per.es_pediatrico = TRUE 
  AND e.estado = 'Activo'
ORDER BY per.fecha_nacimiento DESC;

-- Vista de actividad médica reciente (NUEVA - SOLO LECTURA)
CREATE VIEW actividad_medica_reciente AS
SELECT 
  CONCAT(p.nombre, ' ', p.apellido_paterno) as medico,
  pm.especialidad,
  COUNT(*) as documentos_ultimos_7_dias,
  MAX(dc.fecha_elaboracion) as ultimo_documento,
  COUNT(DISTINCT dc.id_expediente) as expedientes_atendidos
FROM documento_clinico dc
JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
JOIN persona p ON pm.id_persona = p.id_persona
WHERE dc.fecha_elaboracion >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY pm.id_personal_medico, p.nombre, p.apellido_paterno, pm.especialidad
ORDER BY documentos_ultimos_7_dias DESC;

-- ==========================================
-- PASO 21: FUNCIONES DE REPORTES ESPECÍFICOS
-- ==========================================

-- Función para obtener estadísticas de un servicio (NUEVA)
CREATE OR REPLACE FUNCTION estadisticas_servicio(p_id_servicio INT)
RETURNS TABLE(
  nombre_servicio TEXT,
  total_camas INT,
  camas_disponibles INT,
  camas_ocupadas INT,
  pacientes_actuales INT,
  ingresos_mes_actual INT,
  egresos_mes_actual INT,
  promedio_estancia DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.nombre,
    COUNT(c.id_cama)::INT,
    COUNT(CASE WHEN c.estado = 'Disponible' THEN 1 END)::INT,
    COUNT(CASE WHEN c.estado = 'Ocupada' THEN 1 END)::INT,
    COUNT(CASE WHEN i_actual.id_internamiento IS NOT NULL THEN 1 END)::INT,
    COUNT(CASE WHEN DATE_TRUNC('month', i_hist.fecha_ingreso) = DATE_TRUNC('month', CURRENT_DATE) THEN 1 END)::INT,
    COUNT(CASE WHEN DATE_TRUNC('month', i_hist.fecha_egreso) = DATE_TRUNC('month', CURRENT_DATE) THEN 1 END)::INT,
    COALESCE(AVG(CASE WHEN i_hist.fecha_egreso IS NOT NULL 
                      THEN EXTRACT(DAYS FROM (i_hist.fecha_egreso - i_hist.fecha_ingreso)) 
                      END), 0)::DECIMAL
  FROM servicio s
  LEFT JOIN cama c ON s.id_servicio = c.id_servicio
  LEFT JOIN internamiento i_actual ON c.id_cama = i_actual.id_cama AND i_actual.fecha_egreso IS NULL
  LEFT JOIN internamiento i_hist ON s.id_servicio = i_hist.id_servicio
  WHERE s.id_servicio = p_id_servicio
  GROUP BY s.id_servicio, s.nombre;
END;
$$ LANGUAGE plpgsql;

-- Función para buscar pacientes por criterios múltiples (NUEVA)
CREATE OR REPLACE FUNCTION buscar_pacientes(
  p_nombre TEXT DEFAULT NULL,
  p_apellido TEXT DEFAULT NULL,
  p_curp TEXT DEFAULT NULL,
  p_numero_expediente TEXT DEFAULT NULL,
  p_solo_pediatricos BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
  id_expediente INT,
  numero_expediente TEXT,
  nombre_completo TEXT,
  fecha_nacimiento DATE,
  edad_anos INT,
  sexo sexo_enum,
  curp TEXT,
  estado_expediente TEXT,
  es_pediatrico BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id_expediente,
    e.numero_expediente,
    CONCAT(per.nombre, ' ', per.apellido_paterno, ' ', per.apellido_materno),
    per.fecha_nacimiento,
    edad_en_anos(per.fecha_nacimiento),
    per.sexo,
    per.curp,
    e.estado,
    per.es_pediatrico
  FROM expediente e
  JOIN paciente pac ON e.id_paciente = pac.id_paciente
  JOIN persona per ON pac.id_persona = per.id_persona
  WHERE 
    (p_nombre IS NULL OR UPPER(per.nombre) LIKE UPPER('%' || p_nombre || '%'))
    AND (p_apellido IS NULL OR UPPER(per.apellido_paterno) LIKE UPPER('%' || p_apellido || '%') 
         OR UPPER(per.apellido_materno) LIKE UPPER('%' || p_apellido || '%'))
    AND (p_curp IS NULL OR per.curp = p_curp)
    AND (p_numero_expediente IS NULL OR e.numero_expediente = p_numero_expediente)
    AND (p_solo_pediatricos = FALSE OR per.es_pediatrico = TRUE)
  ORDER BY per.apellido_paterno, per.apellido_materno, per.nombre;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PASO 22: COMENTARIOS DE LAS MEJORAS
-- ==========================================

COMMENT ON FUNCTION calcular_edad_actual(DATE) IS 'Calcula edad detallada (años, meses, días) a partir de fecha de nacimiento';
COMMENT ON FUNCTION validar_curp() IS 'Función trigger para validar formato de CURP mexicano';
COMMENT ON VIEW resumen_camas_servicio IS 'Vista para dashboard de ocupación de camas por servicio';
COMMENT ON VIEW dashboard_general IS 'Vista principal para dashboard administrativo del hospital';
COMMENT ON VIEW pacientes_pediatricos_activos IS 'Vista especializada para el área pediátrica';
COMMENT ON FUNCTION estadisticas_servicio(INT) IS 'Función para generar reportes estadísticos por servicio';
COMMENT ON FUNCTION buscar_pacientes(TEXT, TEXT, TEXT, TEXT, BOOLEAN) IS 'Función de búsqueda avanzada de pacientes';

-- ==========================================
-- PASO 23: EJEMPLOS DE USO DE LAS MEJORAS
-- ==========================================

-- Ejemplo 1: Calcular edad de un paciente
-- SELECT * FROM calcular_edad_actual('1995-03-15');

-- Ejemplo 2: Obtener resumen de camas
-- SELECT * FROM resumen_camas_servicio;

-- Ejemplo 3: Dashboard general
-- SELECT * FROM dashboard_general;

-- Ejemplo 4: Buscar pacientes pediátricos
-- SELECT * FROM buscar_pacientes(NULL, NULL, NULL, NULL, TRUE);

-- Ejemplo 5: Estadísticas de urgencias
-- SELECT * FROM estadisticas_servicio(21);

-- ==========================================
-- CONFIRMACIÓN: MEJORAS APLICADAS EXITOSAMENTE
-- ==========================================

-- Verificar que las funciones se crearon correctamente
SELECT 'Mejoras aplicadas correctamente. Total de funciones creadas: ' || COUNT(*) as resultado
FROM pg_proc 
WHERE proname IN ('calcular_edad_actual', 'edad_en_anos', 'edad_total_meses', 'validar_curp', 'estadisticas_servicio', 'buscar_pacientes');

-- ==========================================
-- SCRIPT DE MEJORAS COMPLETADO
-- ==========================================