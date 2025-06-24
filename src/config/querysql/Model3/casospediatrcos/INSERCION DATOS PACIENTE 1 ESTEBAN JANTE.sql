-- ==========================================
-- CASO CLÍNICO: ESTEBAN JANTE COLMENERO
-- Síndrome gripal en adulto de 29 años
-- Hospital General San Luis de la Paz
-- ==========================================

-- ==========================================
-- PASO 1: INSERTAR PERSONA
-- ==========================================
INSERT INTO persona (
  nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, 
  tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, 
  domicilio, es_pediatrico
) VALUES (
  'Esteban', 
  'Jante', 
  'Colmenero', 
  '1995-03-15',  -- 29 años (nacido en 1995)
  'M', 
  'JACE950315HGTNTB01',  -- CURP válido de 18 caracteres
  17,  -- Tipo de sangre A+ (del catálogo insertado)
  'Soltero(a)', 
  'Católica', 
  '4151234590', 
  'esteban.jante@samsung.com', 
  'Fraccionamiento Industrial #456, San Luis de la Paz, Gto.', 
  FALSE  -- No es pediátrico (29 años)
);

select * from persona
select * from paciente
-- ==========================================
-- PASO 2: INSERTAR PACIENTE
-- ==========================================
INSERT INTO paciente (
  id_persona, alergias, transfusiones, detalles_transfusiones,
  familiar_responsable, parentesco_familiar, telefono_familiar,
  ocupacion, escolaridad, lugar_nacimiento
) VALUES (
  (SELECT id_persona FROM persona WHERE curp = 'JACE950315HGTNTB01'),  -- Obtener ID de la persona recién insertada
  'Ninguna conocida',  -- Sin alergias conocidas
  'No',  -- Sin transfusiones previas
  NULL,  -- No hay detalles de transfusiones
  'María Colmenero García',  -- Familiar responsable (madre)
  'Madre',  -- Parentesco
  '4151234591',  -- Teléfono familiar
  'Supervisor de Equipos en Samsung',  -- Ocupación específica
  'Ingeniería Industrial',  -- Escolaridad
  'San Luis de la Paz, Guanajuato'  -- Lugar de nacimiento
);

-- ==========================================
-- PASO 3: CREAR EXPEDIENTE
-- ==========================================
INSERT INTO expediente (
  id_paciente, numero_expediente, fecha_apertura, estado, notas_administrativas
) VALUES (
  (SELECT id_paciente FROM paciente WHERE id_persona = (SELECT id_persona FROM persona WHERE curp = 'JACE950315HGTNTB01')),
  'HG-2025-000001',  -- Primer expediente del año
  CURRENT_TIMESTAMP,
  'Activo',
  'Paciente de primera vez. Ingreso por consulta externa con síndrome gripal.'
);

select * from expediente

-- ==========================================
-- PASO 4: REGISTRAR INTERNAMIENTO (CONSULTA EXTERNA)
-- ==========================================
INSERT INTO internamiento (
  id_expediente, id_cama, id_servicio, fecha_ingreso, motivo_ingreso,
  diagnostico_ingreso, id_medico_responsable, observaciones
) VALUES (
  (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000001'),
  NULL,  -- Sin cama asignada (consulta externa)
  28,  -- Consulta Externa (del catálogo)
  CURRENT_TIMESTAMP,
  'Tos persistente, fiebre y malestar general de 3 días de evolución',
  'Síndrome gripal',  -- Diagnóstico inicial
  9,  -- Dra. Carmen González (Medicina General en Urgencias) | select * from personal_medico
  'Paciente estable, síntomas de vías respiratorias superiores'
);

select * from internamiento
select * from personal_medico
-- ==========================================
-- PASO 5: CREAR DOCUMENTO CLÍNICO BASE
-- ==========================================

-- el problema persiste, recrear la tabla
DROP TABLE IF EXISTS documento_clinico CASCADE;

CREATE TABLE documento_clinico (
  id_documento SERIAL PRIMARY KEY,
  id_expediente INT NOT NULL REFERENCES expediente(id_expediente),
  id_internamiento INT REFERENCES internamiento(id_internamiento),
  id_tipo_documento INT NOT NULL REFERENCES tipo_documento(id_tipo_documento),
  fecha_elaboracion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_personal_creador INT REFERENCES personal_medico(id_personal_medico),
  estado estado_documento_enum DEFAULT 'Activo'::estado_documento_enum NOT NULL
);

INSERT INTO documento_clinico (
  id_expediente, id_internamiento, id_tipo_documento, 
  fecha_elaboracion, id_personal_creador, estado
) VALUES (
  (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000001'),
  (SELECT id_internamiento FROM internamiento WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000001')),
  1,
  CURRENT_TIMESTAMP,
  9,
  'Activo'::estado_documento_enum
);

select * from documento_clinico
select * from internamiento


-- ==========================================
-- PASO 6: REGISTRAR SIGNOS VITALES
-- ==========================================
INSERT INTO signos_vitales (
  id_documento, fecha_toma, temperatura, presion_arterial_sistolica,
  presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria,
  saturacion_oxigeno, peso, talla, imc, observaciones
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000001')),
  CURRENT_TIMESTAMP,
  38.2,  -- Temperatura elevada (fiebre)
  120,   -- Presión sistólica normal
  80,    -- Presión diastólica normal
  88,    -- Frecuencia cardíaca ligeramente elevada
  20,    -- Frecuencia respiratoria normal
  98,    -- Saturación de oxígeno normal
  75.5,  -- Peso en kg
  175.0, -- Talla en cm
  24.6,  -- IMC calculado (normal)
  'Paciente febril, signos vitales estables excepto temperatura'
);

-- ==========================================
-- PASO 7: CREAR HISTORIA CLÍNICA DETALLADA
-- ==========================================
INSERT INTO historia_clinica (
  id_documento, antecedentes_heredo_familiares, habitos_higienicos,
  habitos_alimenticios, actividad_fisica, ocupacion, vivienda, toxicomanias,
  
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
  plan_terapeutico, pronostico
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000001')),
  
  -- Antecedentes heredo-familiares
  'Padre: Hipertensión arterial sistémica. Madre: Diabetes mellitus tipo 2. Abuelos: Sin datos relevantes.',
  
  -- Hábitos
  'Baño diario, cambio de ropa diaria, cepillado dental 2 veces al día',
  'Dieta variada, 3 comidas principales, consumo ocasional de comida rápida',
  'Ejercicio 2-3 veces por semana (futbol recreativo)',
  'Supervisor de Equipos en Samsung - turno matutino',
  'Casa propia, servicios básicos completos, ventilación adecuada',
  'Tabaquismo: negado. Alcoholismo: social ocasional. Drogas: negadas.',
  
  -- Antecedentes patológicos
  'Varicela a los 6 años, sin otras enfermedades relevantes',
  'Negados',
  'Ninguna',
  'Ninguno',
  'Negadas',
  
  -- Padecimiento actual
  'Inicia hace 3 días con tos seca persistente, posteriormente se agrega fiebre de hasta 38.5°C, cefalea frontal, mialgias generalizadas y rinorrea. No disnea, no dolor torácico. Refiere que varios compañeros de trabajo han presentado síntomas similares.',
  
  'Fiebre, cefalea, mialgias, astenia, adinamia',
  
  'Respiratorio: Tos seca, rinorrea hialina, no disnea. Digestivo: Sin alteraciones. Cardiovascular: Sin palpitaciones. Genitourinario: Sin alteraciones.',
  
  -- Exploración física
  'Paciente masculino de 29 años, consciente, orientado, cooperador, febril, facies de enfermo, hidratado, palidez de tegumentos (+)',
  
  'Normocéfalo, pupilas isocóricas reactivas, conjuntivas pálidas, narinas con secreción hialina, faringe hiperérmica sin exudado',
  
  'Cilíndrico, móvil, sin adenopatías palpables',
  
  'Simétrico, amplexión conservada, murmullo vesicular conservado, estertores finos en bases pulmonares, sin sibilancias',
  
  'Blando, depresible, no doloroso, ruidos peristálticos presentes, no visceromegalias',
  
  'Sin edema, pulsos presentes, llenado capilar < 2 segundos',
  
  -- Diagnóstico
  'Síndrome gripal. Infección de vías respiratorias superiores',
  39,  -- Guía clínica de TRIAGE (como referencia general) select * from guia_clinica
  
  'Biometría hemática, examen general de orina si persisten síntomas',
  
  'Manejo sintomático: Paracetamol 500mg c/8hrs por 5 días, Loratadina 10mg c/24hrs por 7 días, abundantes líquidos, reposo relativo',
  
  'Bueno para la resolución completa en 7-10 días'
);

select * from guia_clinica

-- ==========================================
-- PASO 8: PRESCRIBIR MEDICAMENTOS
-- ==========================================

-- Prescripción de Paracetamol
INSERT INTO prescripcion_medicamento (
  id_documento, id_medicamento, dosis, via_administracion,
  frecuencia, duracion, indicaciones_especiales, fecha_inicio, activo
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000001')),
  (SELECT id_medicamento FROM medicamento WHERE codigo = 'MED-001'),  -- Paracetamol
  '500 mg',
  'Oral',
  'Cada 8 horas',
  '5 días',
  'Tomar con alimentos para evitar molestias gástricas. Suspender si cede la fiebre antes de completar tratamiento.',
  CURRENT_DATE,
  TRUE
);

-- Prescripción de Loratadina
INSERT INTO prescripcion_medicamento (
  id_documento, id_medicamento, dosis, via_administracion,
  frecuencia, duracion, indicaciones_especiales, fecha_inicio, activo
) VALUES (
  (SELECT id_documento FROM documento_clinico WHERE id_expediente = (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000001')),
  (SELECT id_medicamento FROM medicamento WHERE codigo = 'MED-054'),  -- Loratadina
  '10 mg',
  'Oral',
  'Cada 24 horas',
  '7 días',
  'Tomar preferentemente en ayunas. Para control de rinorrea y síntomas alérgicos.',
  CURRENT_DATE,
  TRUE
);

-- ==========================================
-- PASO 9: REGISTRAR AUDITORÍA
-- ==========================================
INSERT INTO expediente_auditoria (
  id_expediente, fecha_acceso, id_medico, accion, 
  datos_nuevos, observaciones
) VALUES (
  (SELECT id_expediente FROM expediente WHERE numero_expediente = 'HG-2025-000001'),
  CURRENT_TIMESTAMP,
  9,  -- Dra. Carmen González | select * from personal_medico
  'nuevo_documento',
  '{"tipo": "Historia Clínica", "diagnostico": "Síndrome gripal", "paciente": "Esteban Jante Colmenero"}'::jsonb,
  'Primer expediente del paciente. Historia clínica completa realizada.'
);

select * from personal_medico
select * from persona

-- ==========================================
-- CONSULTAS DE VERIFICACIÓN
-- ==========================================

-- Verificar expediente completo
SELECT 
  p.nombre || ' ' || p.apellido_paterno || ' ' || p.apellido_materno as paciente,
  e.numero_expediente,
  e.fecha_apertura,
  i.motivo_ingreso,
  i.diagnostico_ingreso,
  sv.temperatura,
  sv.peso,
  sv.talla,
  hc.impresion_diagnostica
FROM persona p
JOIN paciente pac ON p.id_persona = pac.id_persona
JOIN expediente e ON pac.id_paciente = e.id_paciente
JOIN internamiento i ON e.id_expediente = i.id_expediente
JOIN documento_clinico dc ON e.id_expediente = dc.id_expediente
JOIN historia_clinica hc ON dc.id_documento = hc.id_documento
LEFT JOIN signos_vitales sv ON dc.id_documento = sv.id_documento
WHERE e.numero_expediente = 'HG-2025-000001';

-- Verificar medicamentos prescritos
SELECT 
  m.nombre as medicamento,
  pm.dosis,
  pm.via_administracion,
  pm.frecuencia,
  pm.duracion,
  pm.indicaciones_especiales
FROM prescripcion_medicamento pm
JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
WHERE e.numero_expediente = 'HG-2025-000001';

-- ==========================================
-- CASO COMPLETADO
-- ==========================================
-- Esteban Jante Colmenero - Expediente HG-2025-000001
-- Diagnóstico: Síndrome gripal
-- Estado: Tratamiento ambulatorio
-- Pronóstico: Bueno para resolución en 7-10 días
-- ==========================================