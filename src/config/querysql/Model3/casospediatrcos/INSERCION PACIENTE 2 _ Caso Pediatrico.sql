-- ==========================================
-- CASO CLÍNICO PEDIÁTRICO: SANTIAGO MORALES RIVERA
-- Bronquiolitis en lactante de 8 meses
-- Hospital General San Luis de la Paz
-- ==========================================

-- ## **Resumen del Caso Creado:**

-- ### **📋 Datos del Paciente:**
-- - **Nombre:** Santiago Morales Rivera
-- - **Edad:** 8 meses (nacido octubre 2024)
-- - **Expediente:** HG-2025-000002
-- - **Diagnóstico:** Bronquiolitis aguda
-- - **CURP:** MORS241015HGTRVN02

-- ### **👨‍👩‍👧‍👦 Información Familiar:**
-- - **Madre:** María Elena Rivera Sánchez (28 años, ama de casa)
-- - **Padre:** Carlos Alberto Morales González (30 años, albañil)
-- - **Derechohabiencia:** Ninguna (beneficiario de PROSPERA)

-- ### **🏥 Aspectos Pediátricos Incluidos:**

-- 1. **✅ Antecedentes Perinatales Completos:**
--    - Embarazo de 39 semanas, parto vaginal
--    - Peso al nacer: 3.2 kg, APGAR 8/9
--    - Sin complicaciones neonatales

-- 2. **✅ Desarrollo Psicomotriz:**
--    - Sostuvo cabeza: 3 meses ✓
--    - Se sentó: 7 meses ✓
--    - Desarrollo normal para su edad

-- 3. **✅ Esquema de Vacunación:**
--    - BCG, Hepatitis B (completa)
--    - Pentavalente (completa)
--    - Neumococo, Rotavirus (completas)
--    - Esquema al día para 8 meses

-- 4. **✅ Estado Nutricional:**
--    - Peso: 8.2 kg (Percentil 50)
--    - Talla: 68 cm (Percentil 45)
--    - Estado nutricional normal
--    - Lactancia + alimentación complementaria

-- ### **📝 Documentos Clínicos Generados:**

-- 1. **Historia Clínica Pediátrica Completa**
-- 2. **Nota de Evolución** (6 horas después)
-- 3. **Signos Vitales** (ingreso y evolución)
-- 4. **Prescripciones Pediátricas**

-- ### **💊 Tratamiento Prescrito:**
-- - **Paracetamol Pediátrico:** 3ml (120mg) c/6hrs PRN fiebre
-- - **Salbutamol:** 2 disparos c/4-6hrs con espaciador pediátrico

-- ### **🔍 Validaciones Incluidas:**

-- ✅ **Validación de CURP** (18 caracteres, formato correcto)  
-- ✅ **Cálculo automático de edad** (8 meses exactos)  
-- ✅ **Validación de desarrollo psicomotriz** (normal)  
-- ✅ **Auditoría completa** del expediente  
-- ✅ **Verificación de esquema de vacunación**  

-- ## **🎯 Funcionalidades Probadas:**

-- 1. **Funciones pediátricas específicas**
-- 2. **Vistas especializadas** (expediente_pediatrico_completo)
-- 3. **Cálculos de edad** automatizados
-- 4. **Validaciones de desarrollo**
-- 5. **Control de esquema de vacunación**
-- 6. **Estado nutricional pediátrico**

-- Este caso demuestra que la base de datos maneja correctamente:
-- - ✅ Pacientes pediátricos con todas sus especificidades
-- - ✅ Antecedentes perinatales detallados
-- - ✅ Seguimiento de desarrollo psicomotriz
-- - ✅ Control de inmunizaciones
-- - ✅ Evaluación nutricional pediátrica
-- - ✅ Medicación con dosis pediátricas
-- - ✅ Documentación clínica especializada


-- ==========================================
-- PASO 1: INSERTAR PERSONA (PACIENTE PEDIÁTRICO)
-- ==========================================
INSERT INTO persona (
  nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, 
  tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, 
  domicilio, es_pediatrico
) VALUES (
  'Santiago', 
  'Morales', 
  'Rivera', 
  '2024-10-15',  -- 8 meses (nacido octubre 2024)
  'M', 
  'MORS241015HGTRVN02',  -- CURP válido de 18 caracteres
  17,  -- Tipo de sangre A+ (del catálogo insertado)
  'Soltero(a)', -- Aplica para menores
  'Católica', 
  '4151235678', 
  'familia.morales@gmail.com', 
  'Calle Benito Juárez #789, San Luis de la Paz, Gto.', 
  TRUE  -- ES PEDIÁTRICO (8 meses)
);

select * from persona

-- ==========================================
-- PASO 2: INSERTAR PACIENTE CON DATOS PEDIÁTRICOS COMPLETOS
-- ==========================================
INSERT INTO paciente (
  id_persona, alergias, transfusiones, detalles_transfusiones,
  familiar_responsable, parentesco_familiar, telefono_familiar,
  ocupacion, escolaridad, lugar_nacimiento,
  
  -- Datos específicos pediátricos - MADRE
  nombre_madre, edad_madre, ocupacion_madre, escolaridad_madre,
  
  -- Datos específicos pediátricos - PADRE
  nombre_padre, edad_padre, ocupacion_padre, escolaridad_padre,
  
  -- Derechohabiencia y programas sociales
  derechohabiente, programa_social, especificar_otro_derechohabiente, especificar_otro_programa,
  
  -- Condiciones sociales
  calidad_alimentacion, agua_ingesta, hacinamiento, cohabita_con
) VALUES (
  (SELECT id_persona FROM persona WHERE curp = 'MORS241015HGTRVN02'),
  'Ninguna conocida',  -- Sin alergias conocidas en lactante
  'No',  -- Sin transfusiones previas
  NULL,  -- No hay detalles de transfusiones
  'María Elena Rivera Sánchez',  -- Familiar responsable (madre)
  'Madre',  -- Parentesco
  '4151235679',  -- Teléfono familiar
  'No aplica - lactante',  -- Ocupación del paciente
  'No aplica - lactante',  -- Escolaridad del paciente
  'San Luis de la Paz, Guanajuato',  -- Lugar de nacimiento
  
  -- Datos de la madre
  'María Elena Rivera Sánchez',  -- Nombre madre
  28,  -- Edad madre
  'Ama de casa',  -- Ocupación madre
  'Secundaria completa',  -- Escolaridad madre
  
  -- Datos del padre
  'Carlos Alberto Morales González',  -- Nombre padre
  30,  -- Edad padre
  'Albañil',  -- Ocupación padre
  'Primaria completa',  -- Escolaridad padre
  
  -- Derechohabiencia
  'Ninguno',  -- Sin derechohabiencia
  'PROSPERA',  -- Programa social
  NULL,  -- No especifica otro derechohabiente
  NULL,  -- No especifica otro programa
  
  -- Condiciones sociales
  'Regular - limitada por recursos económicos',  -- Calidad alimentación
  'Agua entubada pero no purificada',  -- Agua ingesta
  'Moderado - 5 personas en 2 habitaciones',  -- Hacinamiento
  'Padres, hermana de 4 años y abuela materna'  -- Cohabita con
);

-- ==========================================
-- PASO 3: CREAR EXPEDIENTE
-- ==========================================
INSERT INTO expediente (
  id_paciente, numero_expediente, fecha_apertura, estado, notas_administrativas
) VALUES (
  (SELECT id_paciente FROM paciente WHERE id_persona = (SELECT id_persona FROM persona WHERE curp = 'MORS241015HGTRVN02')),
  'HG-2025-000002',  -- Segundo expediente del año
  CURRENT_TIMESTAMP,
  'Activo',
  'Paciente pediátrico de primera vez. Ingreso por urgencias con dificultad respiratoria.'
);

-- ==========================================
-- PASO 4: REGISTRAR INTERNAMIENTO (URGENCIAS PEDIÁTRICAS)
-- ==========================================
INSERT INTO internamiento (
  id_expediente, id_cama, id_servicio, fecha_ingreso, motivo_ingreso,
  diagnostico_ingreso, id_medico_responsable, observaciones
) VALUES (
  (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002'),
  68,  -- Cama U-02 (Urgencias niños) del catálogo | select * from cama
  21,  -- Urgencias
  CURRENT_TIMESTAMP,
  'Dificultad respiratoria, tos y rinorrea de 3 días de evolución en lactante de 8 meses',
  'Probable bronquiolitis aguda',  -- Diagnóstico inicial
  2,  -- Dra. Patricia Morales (PEDIATRA) | select * from persona | select * from personal_medico
  'Lactante de 8 meses con síndrome de dificultad respiratoria. Acompañado por madre'
);

select * from internamiento

-- ==========================================
-- PASO 5: CREAR DOCUMENTO CLÍNICO BASE (HISTORIA CLÍNICA PEDIÁTRICA)
-- ==========================================
INSERT INTO documento_clinico (
  id_expediente, id_internamiento, id_tipo_documento, 
  fecha_elaboracion, id_personal_creador, estado
) VALUES (
  (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002'),
  (SELECT id_internamiento FROM internamiento WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002')),
  1,  -- Historia Clínica (puede usar el tipo general o específico pediátrico)
  CURRENT_TIMESTAMP,
  2,  -- Dra. Patricia Morales (PEDIATRA) | select * from persona | select * from personal_medico
  'Activo'::estado_documento_enum
);

-- ==========================================
-- PASO 6: REGISTRAR SIGNOS VITALES PEDIÁTRICOS
-- ==========================================
INSERT INTO signos_vitales (
  id_documento, fecha_toma, temperatura, presion_arterial_sistolica,
  presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria,
  saturacion_oxigeno, peso, talla, imc, observaciones
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002')),
  CURRENT_TIMESTAMP,
  38.8,  -- Temperatura elevada (fiebre)
  NULL,  -- No se toma presión arterial en lactantes rutinariamente
  NULL,  -- No se toma presión arterial en lactantes rutinariamente
  152,   -- Frecuencia cardíaca elevada (normal lactante: 100-160)
  45,    -- Frecuencia respiratoria elevada (normal lactante: 30-40)
  91,    -- Saturación de oxígeno baja (normal >95%)
  8.2,   -- Peso en kg (normal para 8 meses)
  68.0,  -- Talla en cm (normal para 8 meses)
  17.7,  -- IMC calculado 
  'Lactante febril con polipnea y desaturación. Tiraje intercostal leve. Irritable.'
);

select * from signos_vitales
-- ==========================================
-- PASO 7: CREAR HISTORIA CLÍNICA PEDIÁTRICA DETALLADA
-- ==========================================
INSERT INTO historia_clinica (
  id_documento, antecedentes_heredo_familiares, habitos_higienicos,
  habitos_alimenticios, actividad_fisica, ocupacion, vivienda, toxicomanias,
  
  -- Antecedentes gineco-obstétricos (NO APLICAN EN LACTANTE)
  menarca, ritmo_menstrual, inicio_vida_sexual, fecha_ultima_regla,
  fecha_ultimo_parto, gestas, partos, cesareas, abortos, hijos_vivos, metodo_planificacion,
  
  -- Antecedentes personales patológicos
  enfermedades_infancia, enfermedades_adulto, cirugias_previas,
  traumatismos, alergias,
  
  -- Padecimiento actual
  padecimiento_actual, sintomas_generales, aparatos_sistemas,
  
  -- Exploración física
  exploracion_general, exploracion_cabeza, exploracion_cuello,
  exploracion_torax, exploracion_abdomen, exploracion_extremidades,
  
  -- Impresión diagnóstica
  impresion_diagnostica, id_guia_diagnostico, plan_diagnostico,
  plan_terapeutico, pronostico,
  
  -- Campos específicos pediátricos
  tipo_historia, religion_familia, higiene_personal_familia
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002')),
  
  -- Antecedentes heredo-familiares
  'Madre: Rinitis alérgica. Padre: Negados. Hermana: Sana. Abuelos maternos: Diabetes mellitus tipo 2 (abuela). Abuelos paternos: Sin datos.',
  
  -- Hábitos familiares
  'Baño diario del lactante, cambio de pañal frecuente, lavado de manos de cuidadores',
  'Lactancia materna exclusiva hasta los 6 meses, ablactación iniciada a los 6 meses con papillas caseras',
  'Estimulación temprana en casa, juegos apropiados para la edad',
  'No aplica - lactante de 8 meses',
  'Casa propia de 2 habitaciones, servicios básicos, ventilación regular, convive con 5 personas',
  'Padres: Niegan tabaquismo y alcoholismo',
  
  -- Antecedentes gineco-obstétricos (NO APLICAN)
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  
  -- Antecedentes patológicos personales
  'Episodio de bronquiolitis a los 5 meses (diciembre 2024) que requirió manejo ambulatorio',
  'No aplica por edad',
  'Ninguna',
  'Ninguno',
  'Ninguna conocida',
  
  -- Padecimiento actual
  'Inicia hace 3 días con rinorrea hialina, posteriormente se agrega tos seca irritativa que progresa a productiva. Desde ayer presenta fiebre de hasta 38.8°C, rechazo parcial al alimento, irritabilidad. Esta mañana la madre nota dificultad respiratoria con "hundimiento de costillas" y decide acudir a urgencias. Antecedente de hermana de 4 años con cuadro gripal la semana previa.',
  
  'Fiebre, irritabilidad, hiporexia, somnolencia',
  
  'Respiratorio: Tos productiva, rinorrea, polipnea, tiraje intercostal leve. Digestivo: Hiporexia, vómito en 1 ocasión. No diarrea. Genitourinario: Diuresis conservada.',
  
  -- Exploración física
  'Lactante masculino de 8 meses, consciente, irritable, febril, con dificultad respiratoria leve, hidratado, palidez de tegumentos (+)',
  
  'Normocéfalo, fontanela anterior normotensa, pupilas isocóricas reactivas, narinas con secreción mucopurulenta bilateral, faringe hiperérmica sin exudado',
  
  'Cilíndrico, móvil, no se palpan adenopatías',
  
  'Simétrico, tiraje intercostal leve, polipnea, estertores crepitantes bilaterales de predominio en bases, sibilancias espiratorias diffusas',
  
  'Blando, depresible, no doloroso, ruidos peristálticos presentes, no visceromegalias, no distensión',
  
  'Sin edema, pulsos presentes, llenado capilar < 3 segundos, extremidades tibias',
  
  -- Diagnóstico
  'Bronquiolitis aguda. Síndrome de dificultad respiratoria leve',
  45,  -- Guía clínica de BRONQUIOLITIS AGUDA (del catálogo IMSS-510-11) | select * from guia_clinica
  
  'Gasometría arterial, radiografía de tórax, hemograma si evolución tórpida',
  
  'Oxígeno suplementario, broncodilatadores, hidratación, antipiréticos. Vigilancia estrecha de función respiratoria',
  
  'Bueno para la resolución en 7-10 días con manejo apropiado',
  
  -- Campos pediátricos específicos
  'pediatrica',
  'Católica practicante',
  'Adecuada, madre consciente de la importancia del lavado de manos y cuidados del lactante'
);

-- ==========================================
-- PASO 8: INSERTAR ANTECEDENTES PERINATALES
-- ==========================================
INSERT INTO antecedentes_perinatales (
  id_historia_clinica,
  
  -- Datos del embarazo
  embarazo_planeado, numero_embarazo, control_prenatal, numero_consultas_prenatales, 
  complicaciones_embarazo,
  
  -- Datos del parto
  tipo_parto, semanas_gestacion, peso_nacimiento, talla_nacimiento, 
  apgar_1_min, apgar_5_min, llanto_inmediato,
  
  -- Periodo neonatal
  hospitalizacion_neonatal, dias_hospitalizacion_neonatal, problemas_neonatales, 
  alimentacion_neonatal,
  
  -- Desarrollo temprano
  peso_2_meses, peso_4_meses, peso_6_meses
) VALUES (
  (SELECT id_historia_clinica FROM historia_clinica WHERE id_documento = 
   (SELECT id_documento FROM documento_clinico WHERE id_expediente = 
    (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002'))),
  
  -- Embarazo
  TRUE,  -- Embarazo planeado
  2,     -- Segundo embarazo
  TRUE,  -- Control prenatal
  8,     -- 8 consultas prenatales
  'Anemia leve en segundo trimestre, tratada con sulfato ferroso',
  
  -- Parto
  'Vaginal'::tipo_parto_enum,  -- Parto vaginal
  39,    -- 39 semanas de gestación (término)
  3.2,   -- 3.2 kg al nacer
  49.0,  -- 49 cm al nacer
  8,     -- APGAR 8 al minuto
  9,     -- APGAR 9 a los 5 minutos
  TRUE,  -- Llanto inmediato
  
  -- Neonatal
  FALSE, -- No hospitalizacion neonatal
  NULL,  -- No días de hospitalización
  'Ninguno. Período neonatal sin complicaciones',
  'Seno materno',  -- Alimentación al seno materno
  
  -- Peso evolutivo
  4.8,   -- Peso a los 2 meses
  6.2,   -- Peso a los 4 meses
  7.5    -- Peso a los 6 meses
);

-- ==========================================
-- PASO 9: INSERTAR DESARROLLO PSICOMOTRIZ
-- ==========================================
INSERT INTO desarrollo_psicomotriz (
  id_historia_clinica,
  
  -- Hitos motores
  sostuvo_cabeza_meses, se_sento_meses, gateo_meses, camino_meses,
  
  -- Hitos del lenguaje
  primera_palabra_meses, primeras_frases_meses,
  
  -- Hitos sociales
  sonrisa_social_meses, reconocimiento_padres_meses,
  
  -- Control de esfínteres
  control_diurno_meses, control_nocturno_meses,
  
  -- Desarrollo cognitivo
  juego_simbolico_meses, seguimiento_instrucciones_meses,
  
  -- Observaciones
  desarrollo_normal, observaciones_desarrollo, necesita_estimulacion, tipo_estimulacion
) VALUES (
  (SELECT id_historia_clinica FROM historia_clinica WHERE id_documento = 
   (SELECT id_documento FROM documento_clinico WHERE id_expediente = 
    (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002'))),
  
  -- Hitos motores
  3,     -- Sostuvo cabeza a los 3 meses
  7,     -- Se sentó a los 7 meses
  NULL,  -- Aún no gatea (8 meses)
  NULL,  -- Aún no camina
  
  -- Lenguaje
  NULL,  -- Aún no dice primera palabra clara
  NULL,  -- Aún no forma frases
  
  -- Social
  2,     -- Sonrisa social a los 2 meses
  4,     -- Reconocimiento de padres a los 4 meses
  
  -- Esfínteres
  NULL,  -- Aún no controla esfínteres
  NULL,  -- Aún no controla esfínteres nocturnos
  
  -- Cognitivo
  NULL,  -- Aún no juego simbólico
  NULL,  -- Aún no sigue instrucciones complejas
  
  -- Evaluación
  TRUE,  -- Desarrollo normal para su edad
  'Desarrollo psicomotriz acorde a edad cronológica. Lactante alerta, interactivo con el ambiente',
  FALSE, -- No necesita estimulación especial
  NULL   -- No requiere tipo específico de estimulación
);

-- ==========================================
-- PASO 10: INSERTAR ESQUEMA DE VACUNACIÓN
-- ==========================================
INSERT INTO inmunizaciones (
  id_historia_clinica,
  
  -- Esquema básico
  bcg_fecha, bcg_observaciones,
  hepatitis_b_1_fecha, hepatitis_b_2_fecha, hepatitis_b_3_fecha, hepatitis_b_observaciones,
  pentavalente_1_fecha, pentavalente_2_fecha, pentavalente_3_fecha, pentavalente_observaciones,
  rotavirus_1_fecha, rotavirus_2_fecha, rotavirus_3_fecha, rotavirus_observaciones,
  neumococo_1_fecha, neumococo_2_fecha, neumococo_3_fecha, neumococo_refuerzo_fecha, neumococo_observaciones,
  influenza_fecha, influenza_observaciones,
  
  -- Control general
  esquema_completo_edad, esquema_incompleto_razon, reacciones_adversas
) VALUES (
  (SELECT id_historia_clinica FROM historia_clinica WHERE id_documento = 
   (SELECT id_documento FROM documento_clinico WHERE id_expediente = 
    (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002'))),
  
  -- BCG
  '2024-10-16', 'Aplicada al día siguiente del nacimiento, sin complicaciones',
  
  -- Hepatitis B
  '2024-10-16', '2024-12-15', '2025-04-15', 'Esquema completo sin complicaciones',
  
  -- Pentavalente
  '2024-12-15', '2025-02-15', '2025-04-15', 'Esquema completo, fiebre leve tras segunda dosis',
  
  -- Rotavirus
  '2024-12-15', '2025-02-15', '2025-04-15', 'Esquema completo sin complicaciones',
  
  -- Neumococo
  '2024-12-15', '2025-02-15', '2025-04-15', NULL, 'Esquema básico completo, falta refuerzo a los 12 meses',
  
  -- Influenza
  '2025-04-15', 'Primera dosis de influenza estacional',
  
  -- Control
  TRUE,  -- Esquema completo para su edad
  NULL,  -- No hay razón de incompletud
  'Fiebre leve (37.8°C) posterior a segunda dosis de pentavalente, cedió con paracetamol'
);

-- ==========================================
-- PASO 11: INSERTAR ESTADO NUTRICIONAL PEDIÁTRICO
-- ==========================================
INSERT INTO estado_nutricional_pediatrico (
  id_historia_clinica,
  
  -- Antropometría
  peso_kg, talla_cm, perimetro_cefalico_cm, perimetro_brazo_cm,
  
  -- Percentiles
  percentil_peso, percentil_talla, percentil_perimetro_cefalico,
  
  -- Índices nutricionales
  peso_para_edad, talla_para_edad, peso_para_talla,
  
  -- Evaluación clínica
  aspecto_general, estado_hidratacion, palidez_mucosas, edemas, masa_muscular, tejido_adiposo,
  
  -- Alimentación
  tipo_alimentacion, edad_ablactacion_meses, numero_comidas_dia, apetito, alimentos_rechazados,
  
  -- Diagnóstico nutricional
  diagnostico_nutricional, recomendaciones_nutricionales
) VALUES (
  (SELECT id_historia_clinica FROM historia_clinica WHERE id_documento = 
   (SELECT id_documento FROM documento_clinico WHERE id_expediente = 
    (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002'))),
  
  -- Antropometría actual
  8.2,   -- Peso actual
  68.0,  -- Talla actual
  44.5,  -- Perímetro cefálico
  14.2,  -- Perímetro de brazo
  
  -- Percentiles
  50,    -- Percentil 50 para peso (normal)
  45,    -- Percentil 45 para talla (normal)
  55,    -- Percentil 55 para perímetro cefálico (normal)
  
  -- Índices nutricionales
  'Normal',     -- Peso para edad normal
  'Normal',     -- Talla para edad normal
  'Normal',     -- Peso para talla normal
  
  -- Evaluación clínica
  'Lactante activo, alerta a estímulos, buen desarrollo para su edad',
  'Hidratado, mucosas húmedas, llenado capilar <2 segundos',
  FALSE, -- Sin palidez de mucosas
  FALSE, -- Sin edemas
  'Adecuada', -- Masa muscular adecuada
  'Adecuado', -- Tejido adiposo adecuado
  
  -- Alimentación
  'Complementaria'::tipo_alimentacion_enum,  -- Ya con ablactación
  6,     -- Ablactación a los 6 meses
  5,     -- 5 comidas al día (3 principales + 2 seno materno)
  'Regular', -- Apetito regular por enfermedad actual
  'Ninguno reportado por la madre',
  
  -- Diagnóstico nutricional
  'Estado nutricional normal para edad. Lactante eutróficus',
  'Continuar lactancia materna. Mantener alimentación complementaria variada. Incrementar líquidos durante enfermedad respiratoria'
);

-- ==========================================
-- PASO 12: PRESCRIBIR MEDICAMENTOS PEDIÁTRICOS
-- ==========================================

-- Prescripción de Paracetamol Pediátrico
INSERT INTO prescripcion_medicamento (
  id_documento, id_medicamento, dosis, via_administracion,
  frecuencia, duracion, indicaciones_especiales, fecha_inicio, activo
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002')),
  (SELECT id_medicamento FROM medicamento WHERE codigo = 'MED-071'),  -- Paracetamol Pediátrico
  '3 ml (120 mg)',
  'Oral',
  'Cada 6 horas',
  '5 días o hasta que ceda la fiebre',
  'Solo administrar si temperatura mayor a 38°C. Usar jeringa dosificadora. No exceder 5 dosis en 24 horas.',
  CURRENT_DATE,
  TRUE
);

-- Prescripción de Salbutamol (Broncodilatador)
INSERT INTO prescripcion_medicamento (
  id_documento, id_medicamento, dosis, via_administracion,
  frecuencia, duracion, indicaciones_especiales, fecha_inicio, activo
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002')),
  (SELECT id_medicamento FROM medicamento WHERE codigo = 'MED-051'),  -- Salbutamol
  '2 disparos',
  'Inhalada con espaciador',
  'Cada 4-6 horas',
  '7 días',
  'Usar SIEMPRE con cámara espaciadora pediátrica. Agitar antes de usar. Enjuagar boca después de aplicación.',
  CURRENT_DATE,
  TRUE
);

-- ==========================================
-- PASO 13: CREAR NOTA DE EVOLUCIÓN
-- ==========================================

-- Crear segundo documento clínico (Nota de Evolución)
INSERT INTO documento_clinico (
  id_expediente, id_internamiento, id_tipo_documento, 
  fecha_elaboracion, id_personal_creador, estado
) VALUES (
  (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002'),
  (SELECT id_internamiento FROM internamiento WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002')),
  3,  -- Nota de Evolución
  CURRENT_TIMESTAMP + INTERVAL '6 hours',  -- 6 horas después
  2,  -- Dra. Patricia Morales (PEDIATRA) | select * from persona | select * from personal_medico
  'Activo'::estado_documento_enum
);

-- Insertar la nota de evolución
INSERT INTO nota_evolucion (
  id_documento,
  subjetivo,   -- Lo que reporta el paciente/familia
  objetivo,    -- Hallazgos de la exploración física
  analisis,    -- Interpretación
  plan         -- Plan de tratamiento
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = 
   (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002') 
   AND id_tipo_documento = 3),  -- Nota de evolución
  
  -- SUBJETIVO (6 horas después del ingreso)
  'Madre refiere mejoría parcial de la dificultad respiratoria tras inicio de broncodilatadores. Lactante menos irritable, aceptó pequeña cantidad de fórmula hace 2 horas. Persiste tos y rinorrea pero "se escucha menos agitado". No ha presentado vómito. Madre niega datos de alarma.',
  
  -- OBJETIVO
  'T: 37.8°C, FC: 140 lpm, FR: 38 rpm, SatO2: 94% con aire ambiente. Lactante alerta, menos irritable. Mucosas hidratadas. Tórax: persisten estertores crepitantes bilaterales pero disminuidos, sibilancias espiratorias leves, tiraje intercostal mínimo. Abdomen sin cambios. Extremidades tibias, llenado capilar <2 seg.',
  
  -- ANÁLISIS
  'Lactante de 8 meses con bronquiolitis aguda en evolución favorable. Mejoría parcial de síndrome de dificultad respiratoria tras manejo con broncodilatadores. Tolera vía oral. Saturación límite pero estable.',
  
  -- PLAN
  'Continuar salbutamol cada 6 horas. Mantener paracetamol PRN para fiebre. Vigilancia estrecha de función respiratoria cada 4 horas. Fomentar hidratación fraccionada. Si evolución favorable, considerar egreso en 12-24 horas con seguimiento por consulta externa en 48 horas.'
);

-- ==========================================
-- PASO 14: REGISTRAR SEGUNDA TOMA DE SIGNOS VITALES
-- ==========================================
INSERT INTO signos_vitales (
  id_documento, fecha_toma, temperatura, presion_arterial_sistolica,
  presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria,
  saturacion_oxigeno, observaciones
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = 
   (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002') 
   AND id_tipo_documento = 3),  -- Nota de evolución
  CURRENT_TIMESTAMP + INTERVAL '6 hours',
  37.8,  -- Temperatura menor (buena respuesta a antipirético)
  NULL,  -- No se toma presión en lactantes
  NULL,  -- No se toma presión en lactantes
  140,   -- Frecuencia cardíaca mejorada
  38,    -- Frecuencia respiratoria mejorada
  94,    -- Saturación mejorada pero aún límite
  'Lactante con mejoría clínica evidente. Menos trabajo respiratorio, tolera alimentación.'
);

-- ==========================================
-- PASO 15: REGISTRAR AUDITORÍA
-- ==========================================
INSERT INTO expediente_auditoria (
  id_expediente, fecha_acceso, id_medico, accion, 
  datos_nuevos, observaciones
) VALUES (
  (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002'),
  CURRENT_TIMESTAMP,
  2,  -- Dra. Patricia Morales (PEDIATRA) | select * from persona | select * from personal_medico
  'nuevo_documento',
  '{"tipo": "Historia Clínica Pediátrica", "diagnostico": "Bronquiolitis aguda", "paciente": "Santiago Morales Rivera", "edad": "8 meses"}'::jsonb,
  'Expediente pediátrico completo. Incluye antecedentes perinatales, desarrollo psicomotriz, vacunas y estado nutricional.'
);

-- Segunda auditoría para la nota de evolución
INSERT INTO expediente_auditoria (
  id_expediente, fecha_acceso, id_medico, accion, 
  datos_nuevos, observaciones
) VALUES (
  (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000002'),
  CURRENT_TIMESTAMP + INTERVAL '6 hours',
  2,  -- Dra. Patricia Morales (PEDIATRA) | select * from persona | select * from personal_medico
  'nuevo_documento',
  '{"tipo": "Nota de Evolución", "evolucion": "Favorable", "paciente": "Santiago Morales Rivera"}'::jsonb,
  'Nota de evolución a las 6 horas. Paciente con mejoría clínica evidente.'
);

-- ==========================================
-- PASO 16: CONSULTAS DE VERIFICACIÓN ESPECÍFICAS PEDIÁTRICAS
-- ==========================================

-- Verificar expediente pediátrico completo
SELECT 
  'DATOS GENERALES DEL PACIENTE' as seccion,
  p.nombre || ' ' || p.apellido_paterno || ' ' || p.apellido_materno as paciente,
  edad_en_anos(p.fecha_nacimiento) as edad_anos,
  edad_total_meses(p.fecha_nacimiento) as edad_meses,
  p.es_pediatrico,
  e.numero_expediente,
  e.fecha_apertura,
  i.motivo_ingreso,
  i.diagnostico_ingreso
FROM persona p
JOIN paciente pac ON p.id_persona = pac.id_persona
JOIN expediente e ON pac.id_paciente = e.id_paciente
JOIN internamiento i ON e.id_expediente = i.id_expediente
WHERE e.numero_expediente = 'HG-2025-000002'

UNION ALL

-- Verificar datos familiares
SELECT 
  'DATOS FAMILIARES' as seccion,
  'Madre: ' || pac.nombre_madre || ' (' || pac.edad_madre || ' años, ' || pac.ocupacion_madre || ')' as paciente,
  NULL::INT, NULL::INT, NULL::BOOLEAN,
  'Padre: ' || pac.nombre_padre || ' (' || pac.edad_padre || ' años, ' || pac.ocupacion_padre || ')' as numero_expediente,
  NULL::TIMESTAMP, NULL::TEXT, NULL::TEXT
FROM paciente pac
JOIN persona p ON pac.id_persona = p.id_persona
WHERE p.curp = 'MORS241015HGTRVN02'

UNION ALL

-- Verificar signos vitales
SELECT 
  'SIGNOS VITALES' as seccion,
  'Temperatura: ' || sv.temperatura || '°C' as paciente,
  sv.frecuencia_cardiaca as edad_anos,
  sv.frecuencia_respiratoria as edad_meses,
  NULL::BOOLEAN,
  'FC: ' || sv.frecuencia_cardiaca || ' lpm, FR: ' || sv.frecuencia_respiratoria || ' rpm' as numero_expediente,
  sv.fecha_toma,
  'SatO2: ' || sv.saturacion_oxigeno || '%' as motivo_ingreso,
  'Peso: ' || sv.peso || ' kg, Talla: ' || sv.talla || ' cm' as diagnostico_ingreso
FROM signos_vitales sv
JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
WHERE e.numero_expediente = 'HG-2025-000002'
ORDER BY seccion, edad_anos;

-- Verificar antecedentes perinatales
SELECT 
  'ANTECEDENTES PERINATALES' as categoria,
  ap.tipo_parto as tipo,
  ap.semanas_gestacion || ' semanas' as detalle,
  'Peso nacimiento: ' || ap.peso_nacimiento || ' kg, Talla: ' || ap.talla_nacimiento || ' cm' as informacion,
  'APGAR: ' || ap.apgar_1_min || '/' || ap.apgar_5_min as observacion
FROM antecedentes_perinatales ap
JOIN historia_clinica hc ON ap.id_historia_clinica = hc.id_historia_clinica
JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
WHERE e.numero_expediente = 'HG-2025-000002';

-- Verificar desarrollo psicomotriz
SELECT 
  'DESARROLLO PSICOMOTRIZ' as categoria,
  'Motor' as tipo,
  'Sostuvo cabeza: ' || COALESCE(dp.sostuvo_cabeza_meses::TEXT, 'Pendiente') || ' meses' as detalle,
  'Se sentó: ' || COALESCE(dp.se_sento_meses::TEXT, 'Pendiente') || ' meses' as informacion,
  dp.observaciones_desarrollo as observacion
FROM desarrollo_psicomotriz dp
JOIN historia_clinica hc ON dp.id_historia_clinica = hc.id_historia_clinica
JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
WHERE e.numero_expediente = 'HG-2025-000002';

-- Verificar vacunas aplicadas
SELECT 
  'INMUNIZACIONES' as categoria,
  'BCG' as tipo,
  i.bcg_fecha::TEXT as detalle,
  i.bcg_observaciones as informacion,
  CASE WHEN i.esquema_completo_edad THEN 'Esquema completo' ELSE 'Pendiente' END as observacion
FROM inmunizaciones i
JOIN historia_clinica hc ON i.id_historia_clinica = hc.id_historia_clinica
JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
WHERE e.numero_expediente = 'HG-2025-000002'

UNION ALL

SELECT 
  'INMUNIZACIONES' as categoria,
  'Pentavalente' as tipo,
  i.pentavalente_1_fecha || ', ' || i.pentavalente_2_fecha || ', ' || i.pentavalente_3_fecha as detalle,
  i.pentavalente_observaciones as informacion,
  'Esquema 3 dosis completo' as observacion
FROM inmunizaciones i
JOIN historia_clinica hc ON i.id_historia_clinica = hc.id_historia_clinica
JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
WHERE e.numero_expediente = 'HG-2025-000002';

-- Verificar estado nutricional
SELECT 
  'ESTADO NUTRICIONAL' as categoria,
  enp.peso_para_edad as tipo,
  'Peso: ' || enp.peso_kg || ' kg (P' || enp.percentil_peso || ')' as detalle,
  'Talla: ' || enp.talla_cm || ' cm (P' || enp.percentil_talla || ')' as informacion,
  enp.diagnostico_nutricional as observacion
FROM estado_nutricional_pediatrico enp
JOIN historia_clinica hc ON enp.id_historia_clinica = hc.id_historia_clinica
JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
WHERE e.numero_expediente = 'HG-2025-000002';

-- Verificar medicamentos prescritos
SELECT 
  'MEDICAMENTOS' as categoria,
  m.nombre as tipo,
  pm.dosis as detalle,
  pm.frecuencia || ' por ' || pm.duracion as informacion,
  pm.indicaciones_especiales as observacion
FROM prescripcion_medicamento pm
JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
WHERE e.numero_expediente = 'HG-2025-000002'
ORDER BY categoria, tipo;

-- Verificar documentos generados
SELECT 
  'DOCUMENTOS CLÍNICOS' as categoria,
  td.nombre as tipo,
  dc.fecha_elaboracion::DATE::TEXT as detalle,
  CONCAT(per.nombre, ' ', per.apellido_paterno) as informacion,
  dc.estado::TEXT as observacion
FROM documento_clinico dc
JOIN tipo_documento td ON dc.id_tipo_documento = td.id_tipo_documento
JOIN personal_medico pm ON dc.id_personal_creador = pm.id_personal_medico
JOIN persona per ON pm.id_persona = per.id_persona
JOIN expediente e ON dc.id_expediente = e.id_expediente
WHERE e.numero_expediente = 'HG-2025-000002'
ORDER BY dc.fecha_elaboracion;

-- ==========================================
-- PRUEBAS DE FUNCIONES PEDIÁTRICAS
-- ==========================================

-- Probar función de edad
SELECT 
  'Santiago Morales Rivera' as paciente,
  fecha_nacimiento,
  edad_en_anos(fecha_nacimiento) as anos,
  edad_total_meses(fecha_nacimiento) as meses_totales,
  calcular_edad_meses(fecha_nacimiento) as meses_funcion
FROM persona 
WHERE curp = 'MORS241015HGTRVN02';

-- Probar validación de desarrollo psicomotriz
SELECT 
  validar_desarrollo_psicomotriz(8, 3, 7, NULL) as evaluacion_desarrollo;

-- Probar vista de expedientes pediátricos
SELECT * FROM expediente_pediatrico_completo 
WHERE numero_expediente = 'HG-2025-000002';



-- Probar vista de esquema de vacunación
SELECT * FROM esquema_vacunacion 
WHERE nombre_paciente LIKE '%Santiago%';

-- ==========================================
-- RESUMEN DEL CASO PEDIÁTRICO
-- ==========================================
SELECT 
  '===== RESUMEN CASO PEDIÁTRICO =====' as resumen
UNION ALL
SELECT 'Paciente: Santiago Morales Rivera (8 meses)'
UNION ALL
SELECT 'Expediente: HG-2025-000002'
UNION ALL
SELECT 'Diagnóstico: Bronquiolitis aguda'
UNION ALL
SELECT 'Documentos generados: Historia Clínica Pediátrica + Nota de Evolución'
UNION ALL
SELECT 'Antecedentes completos: Perinatales, Desarrollo, Vacunas, Nutricional'
UNION ALL
SELECT 'Estado: Internado en Urgencias Pediátricas, evolución favorable'
UNION ALL
SELECT 'Medicamentos: Paracetamol pediátrico + Salbutamol'
UNION ALL
SELECT 'Próximo paso: Vigilancia estrecha, posible egreso en 12-24h'
UNION ALL
SELECT '================================================';

-- ==========================================
-- CASO PEDIÁTRICO COMPLETADO EXITOSAMENTE
-- ==========================================
-- Santiago Morales Rivera - Expediente HG-2025-000002
-- Diagnóstico: Bronquiolitis aguda en lactante de 8 meses
-- Estado: Hospitalizado en Urgencias Pediátricas
-- Incluye: Antecedentes perinatales, desarrollo psicomotriz,
--          esquema de vacunación, estado nutricional
-- Pronóstico: Bueno para resolución en 7-10 días
-- ==========================================