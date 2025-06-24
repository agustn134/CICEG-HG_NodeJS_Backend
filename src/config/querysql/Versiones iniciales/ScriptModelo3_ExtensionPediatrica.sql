-- ==========================================
-- EXTENSIÓN PEDIÁTRICA
-- Hospital General San Luis de la Paz
-- Modificaciones específicas para pediatría
-- ==========================================

-- ==========================================
-- PASO 1: AGREGAR CAMPOS PEDIÁTRICOS A TABLAS EXISTENTES
-- ==========================================

-- Ampliar tabla PERSONA con datos de padres
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
  
  -- Vacunas adicionales
  varicela_fecha DATE,
  varicela_observaciones TEXT,
  
  hepatitis_a_fecha DATE,
  hepatitis_a_observaciones TEXT,
  
  vph_fecha DATE,
  vph_observaciones TEXT,
  
  -- Control general
  esquema_completo_edad BOOLEAN DEFAULT FALSE,
  esquema_incompleto_razon TEXT,
  reacciones_adversas TEXT,
  
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
CREATE INDEX idx_paciente_pediatrico ON paciente(es_pediatrico) WHERE es_pediatrico = TRUE;
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
  hc.fecha_elaboracion as fecha_ultima_historia
  
FROM expediente e
JOIN paciente pac ON e.id_paciente = pac.id_paciente
JOIN persona per ON pac.id_persona = per.id_persona
LEFT JOIN historia_clinica hc ON hc.id_documento = (
  SELECT dc.id_documento 
  FROM documento_clinico dc 
  WHERE dc.id_expediente = e.id_expediente 
  AND dc.id_tipo_documento = (SELECT id_tipo_documento FROM tipo_documento WHERE nombre = 'Historia Clínica')
  ORDER BY dc.fecha_elaboracion DESC 
  LIMIT 1
)
WHERE per.es_pediatrico = TRUE
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