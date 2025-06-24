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
  estado estado_documento_enum DEFAULT 'Activo' NOT NULL
);

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

-- Nota de Evolución
CREATE TABLE nota_evolucion (
  id_nota_evolucion SERIAL PRIMARY KEY,
  id_documento INT NOT NULL REFERENCES documento_clinico(id_documento),
  subjetivo TEXT,  -- Lo que reporta el paciente
  objetivo TEXT,   -- Hallazgos de la exploración física
  analisis TEXT,   -- Interpretación
  plan TEXT        -- Plan de tratamiento
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