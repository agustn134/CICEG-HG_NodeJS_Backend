-- Inicio Tablas de Catálogos 
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

--2. Tablas de Datos de Personas

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

-- Tabla principal de Personas (generalización)
CREATE TABLE persona (
  id_persona SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido_paterno TEXT NOT NULL,
  apellido_materno TEXT,
  fecha_nacimiento DATE NOT NULL,
  sexo sexo_enum DEFAULT 'O',  -- Usando el tipo ENUM directamente. 'Otro' sera el valor por defecto
  curp VARCHAR(18) UNIQUE,
  tipo_sangre_id INT REFERENCES tipo_sangre(id_tipo_sangre),
  estado_civil TEXT,
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

-- Tablas de Gestión de Expedientes


-- Tabla principal de Expedientes
CREATE TABLE expediente (
  id_expediente SERIAL PRIMARY KEY,
  id_paciente INT NOT NULL REFERENCES paciente(id_paciente),
  numero_expediente TEXT UNIQUE NOT NULL,
  fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado TEXT DEFAULT 'Activo',
  notas_administrativas TEXT
);

-- Tipo ENUM para Estado de Cama
CREATE TYPE estado_cama_enum AS ENUM (
  'Disponible', 
  'Ocupada', 
  'Mantenimiento', 
  'Reservada',
  'Contaminada'
);

-- Tabla de Camas Hospitalarias
CREATE TABLE cama (
  id_cama SERIAL PRIMARY KEY,
  numero TEXT NOT NULL,
  id_servicio INT REFERENCES servicio(id_servicio),
  estado TEXT DEFAULT 'Disponible',  -- Disponible, Ocupada, Mantenimiento
  descripcion TEXT,
  area TEXT,  -- Ej. 'Urgencias', 'Pediatría', 'Consultorios', 'Recupearación'
  subarea TEXT  -- Ej. 'Pediatria 2 meses a 9 meses', 'Canachoque Respiratoria', 'Respiratoria', 'Encamados', 'Consultorio de Nutricion'
);

-- Luego aplica el tipo ENUM
ALTER TABLE cama 
  ALTER COLUMN estado DROP DEFAULT,
  ALTER COLUMN estado TYPE estado_cama_enum USING estado::estado_cama_enum,
  ALTER COLUMN estado SET DEFAULT 'Disponible'::estado_cama_enum;

-- Tipo ENUM para Tipo de Egreso
CREATE TYPE tipo_egreso_enum AS ENUM (
  'Alta voluntaria', 
  'Mejoría', 
  'Referencia', 
  'Defunción',
  'Máximo beneficio'
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
  tipo_egreso TEXT,  -- Alta voluntaria, Mejoría, Referencia, Defunción
  observaciones TEXT
);

--4. Tablas de Documentos Clínicos


-- Tipo ENUM para el Estado de Documento Clínico
CREATE TYPE estado_documento_enum AS ENUM (
  'Activo', 
  'Cancelado', 
  'Anulado',
  'Borrador'
);

-- Crear catálogo de tipos de documentos
CREATE TABLE tipo_documento (
  id_tipo_documento SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,  -- Ej. 'Historia Clínica', 'Nota de Urgencias', 'Nota de Evolución'
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE
);

--Insertar tipos de documentos comunes
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



-- Tabla base para Documentos Clínicos (generalización)
CREATE TABLE documento_clinico (
  id_documento SERIAL PRIMARY KEY,
  id_expediente INT NOT NULL REFERENCES expediente(id_expediente),
  id_internamiento INT REFERENCES internamiento(id_internamiento),
  id_tipo_documento INT NOT NULL REFERENCES tipo_documento(id_tipo_documento),  -- Corrección aquí
  fecha_elaboracion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_personal_creador INT REFERENCES personal_medico(id_personal_medico),
  estado estado_documento_enum DEFAULT 'Activo'::estado_documento_enum  -- Activo, Cancelado, Anulado
);

-- Corregir el tipo de columna
ALTER TABLE documento_clinico 
  ALTER COLUMN id_tipo_documento TYPE INT;

-- Agregar clave foránea
ALTER TABLE documento_clinico 
  ADD CONSTRAINT fk_documento_tipo 
  FOREIGN KEY (id_tipo_documento) 
  REFERENCES tipo_documento(id_tipo_documento);



-- Tabla para Signos Vitales (puede reutilizarse en múltiples documentos)
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

--5. Tablas de Consentimientos y Solicitudes

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


--6. Tablas para Tratamientos y Medicación

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



--7. Notas adicionales especializadas
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
-- ÍNDICES ADICIONALES
-- ==========================================

-- Expediente: búsqueda por número
CREATE INDEX idx_expediente_numero ON expediente(numero_expediente);

-- Internamiento: búsqueda por fecha de ingreso
CREATE INDEX idx_internamiento_fecha_ingreso ON internamiento(fecha_ingreso);

-- Cama: búsqueda por estado
CREATE INDEX idx_cama_estado ON cama(estado);

-- ==========================================
-- TRIGGER: Validar que fecha_egreso > fecha_ingreso
-- ==========================================

CREATE OR REPLACE FUNCTION validar_fechas_egreso()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fecha_egreso IS NOT NULL AND NEW.fecha_egreso <= NEW.fecha_ingreso THEN
    RAISE EXCEPTION 'La fecha de egreso debe ser posterior a la fecha de ingreso';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_fechas_egreso
BEFORE INSERT OR UPDATE ON internamiento
FOR EACH ROW
EXECUTE FUNCTION validar_fechas_egreso();

-- ==========================================
-- FULL-TEXT SEARCH: documento_clinico (diagnostico, motivo)
-- ==========================================

-- Agregar columna tsvector
ALTER TABLE documento_clinico ADD COLUMN texto_busqueda tsvector;

-- Crear índice GIN para búsquedas eficientes
CREATE INDEX idx_documento_texto ON documento_clinico USING GIN(texto_busqueda);

-- (Opcional) Instalar extensión pg_trgm si usarás LIKE con %palabra%
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Activar trigger automático con función interna de PostgreSQL
-- Este trigger actualiza texto_busqueda con base en los campos que especifiques
CREATE TRIGGER trg_actualizar_texto_busqueda
BEFORE INSERT OR UPDATE ON documento_clinico
FOR EACH ROW
EXECUTE FUNCTION tsvector_update_trigger(
  texto_busqueda,
  'pg_catalog.spanish',
  tipo_documento
);


-- 2. Agregar tipos ENUM para valores con conjunto limitado


-- Modificar columna en tabla persona
ALTER TABLE persona ALTER COLUMN estado_civil TYPE estado_civil_enum USING estado_civil::estado_civil_enum;

-- Corrige el typo en el tipo enum
ALTER TABLE documento_clinico 
  ALTER COLUMN estado TYPE estado_documento_enum 
  USING estado::estado_documento_enum;

-- Modificar columna en tabla internamiento
ALTER TABLE internamiento ALTER COLUMN tipo_egreso TYPE tipo_egreso_enum USING tipo_egreso::tipo_egreso_enum;



-- Modificar columna en tabla documento_clinico
--ALTER TABLE documento_clinico ALTER COLUMN estado TYPE estado_documento_enum USING estado::estado_documento_enum;

-- Modificar columna en tabla persona
ALTER TABLE persona ALTER COLUMN sexo TYPE sexo_enum USING sexo::sexo_enum;

-- 3. Restricción para fecha_egreso en internamiento

-- Agregar CHECK constraint para fecha_egreso
ALTER TABLE internamiento ADD CONSTRAINT check_fecha_egreso 
  CHECK (
    (fecha_egreso IS NULL AND tipo_egreso IS NULL) OR 
    (fecha_egreso IS NOT NULL AND tipo_egreso IS NOT NULL)
  );

-- 4. Bonus: Agregar índices adicionales útiles

-- Índice para búsquedas de personas por nombre y apellidos
CREATE INDEX idx_persona_nombres ON persona(apellido_paterno, apellido_materno, nombre);

-- Índice para búsquedas de pacientes activos en un servicio
CREATE INDEX idx_internamiento_servicio_activo ON internamiento(id_servicio) 
  WHERE fecha_egreso IS NULL;

-- Índice para buscar expedientes por paciente
CREATE INDEX idx_expediente_paciente ON expediente(id_paciente);

-- Crear índices adicionales
CREATE INDEX idx_documento_expediente ON documento_clinico(id_expediente);
CREATE INDEX idx_documento_creador ON documento_clinico(id_personal_creador);
CREATE INDEX idx_paciente_id ON paciente(id_persona);

-- Hacer la columna NOT NULL
ALTER TABLE documento_clinico 
  ALTER COLUMN estado SET NOT NULL;


  -- Aplicar el tipo ENUM a la columna
ALTER TABLE cama 
  ALTER COLUMN estado TYPE estado_cama_enum 
  USING estado::estado_cama_enum;

  -- Hacer la columna NOT NULL
ALTER TABLE documento_clinico 
  ALTER COLUMN id_expediente SET NOT NULL;


  COMMENT ON TABLE documento_clinico IS 'Tabla base para almacenar documentos clínicos generales.';
COMMENT ON COLUMN documento_clinico.id_tipo_documento IS 'Clave foránea a tipo_documento.';

