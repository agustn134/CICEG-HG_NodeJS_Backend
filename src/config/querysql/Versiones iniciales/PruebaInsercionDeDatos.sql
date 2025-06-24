INSERT INTO persona (
  nombre, apellido_paterno, apellido_materno,
  fecha_nacimiento, sexo, curp,
  tipo_sangre_id, estado_civil, religion,
  telefono, correo_electronico, domicilio
) VALUES (
  'Laura', 'Sánchez', 'Gómez',
  '1985-08-12', 'F', 'SAGL850812MDFLNR09',
  1, 'Casado(a)', 'Católica',
  '5551231234', 'laura.sanchez@correo.com', 'Av. Siempre Viva 742, CDMX'
);



-- Consulta para obtener id_persona
SELECT id_persona FROM persona WHERE curp = 'SAGL850812MDFLNR09';


INSERT INTO paciente (
  id_persona, alergias, transfusiones,
  detalles_transfusiones, familiar_responsable,
  parentesco_familiar, telefono_familiar,
  ocupacion, escolaridad, lugar_nacimiento
) VALUES (
  1, 'Ninguna', false,
  NULL, 'José Pérez',
  'Esposo', '5543211234',
  'Contadora', 'Licenciatura', 'CDMX'
);



-- Consulta para obtener id_paciente
SELECT id_paciente FROM paciente WHERE id_persona = 1;

-- Supongamos que devuelve id_paciente = 1
INSERT INTO expediente (
  id_paciente, numero_expediente, notas_administrativas
) VALUES (
  1, 'EXP-2025-001', 'Paciente referida desde consulta externa'
);

SELECT 
  p.id_persona, p.nombre, p.apellido_paterno, p.apellido_materno,
  pa.id_paciente, pa.alergias, pa.familiar_responsable,
  e.id_expediente, e.numero_expediente, e.fecha_apertura
FROM persona p
JOIN paciente pa ON p.id_persona = pa.id_persona
JOIN expediente e ON pa.id_paciente = e.id_paciente
WHERE p.curp = 'SAGL850812MDFLNR09';

Select  id_cama from cama;



-- 4. Registrar internamiento del paciente
INSERT INTO internamiento (
  id_expediente, id_cama, id_servicio,
  fecha_ingreso, motivo_ingreso, diagnostico_ingreso,
  id_medico_responsable
) VALUES (
  (SELECT e.id_expediente FROM expediente e
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05'), 
  '1',
  3, -- Servicio de Medicina Interna
  CURRENT_TIMESTAMP,
  'Dolor abdominal intenso, vómitos y fiebre',
  'Probable pancreatitis aguda. DM2 de 8 años de evolución',
  NULL -- Posteriormente asignaremos médico
);

-- Verificar internamiento
SELECT i.id_internamiento, i.fecha_ingreso, i.motivo_ingreso, 
       s.nombre AS servicio, c.numero AS cama
FROM internamiento i
JOIN expediente e ON i.id_expediente = e.id_expediente
JOIN paciente pa ON e.id_paciente = pa.id_paciente
JOIN persona p ON pa.id_persona = p.id_persona
JOIN servicio s ON i.id_servicio = s.id_servicio
JOIN cama c ON i.id_cama = c.id_cama
WHERE p.curp = 'JUMR770923HDFRNC05';

-- Actualizar el estado de la cama a ocupada
UPDATE cama SET estado = 'Ocupada'::estado_cama_enum 
WHERE numero = 'R-01';



-- 5. Insertar datos del médico tratante
INSERT INTO persona (
  nombre, apellido_paterno, apellido_materno,
  fecha_nacimiento, sexo, curp,
  tipo_sangre_id, estado_civil, religion,
  telefono, correo_electronico, domicilio
) VALUES (
  'Gabriela', 'Méndez', 'Torres',
  '1982-04-15', 'F', 'METG820415MDFNRB09',
  3, 'Casado(a)', 'Católica',
  '5522334455', 'gabriela.mendez@hospital.com', 'Av. Reforma 234, CDMX'
);

INSERT INTO personal_medico (
  id_persona, numero_cedula, especialidad,
  cargo, departamento, activo
) VALUES (
  (SELECT id_persona FROM persona WHERE curp = 'METG820415MDFNRB09'),
  '12345678', 'Medicina Interna',
  'Médico Adscrito', 'Medicina Interna', true
);

-- Asignar médico al internamiento
UPDATE internamiento 
SET id_medico_responsable = (
  SELECT pm.id_personal_medico 
  FROM personal_medico pm
  JOIN persona p ON pm.id_persona = p.id_persona
  WHERE p.curp = 'METG820415MDFNRB09'
)
WHERE id_internamiento = (
  SELECT i.id_internamiento 
  FROM internamiento i
  JOIN expediente e ON i.id_expediente = e.id_expediente
  JOIN paciente pa ON e.id_paciente = pa.id_paciente
  JOIN persona p ON pa.id_persona = p.id_persona
  WHERE p.curp = 'JUMR770923HDFRNC05'
);

-- Verificar asignación de médico
SELECT p.nombre AS paciente, pm.nombre AS medico, pm.apellido_paterno,
       med.especialidad, i.fecha_ingreso
FROM internamiento i
JOIN expediente e ON i.id_expediente = e.id_expediente
JOIN paciente pa ON e.id_paciente = pa.id_paciente
JOIN persona p ON pa.id_persona = p.id_persona
JOIN personal_medico med ON i.id_medico_responsable = med.id_personal_medico
JOIN persona pm ON med.id_persona = pm.id_persona
WHERE p.curp = 'JUMR770923HDFRNC05';





-- 6. Crear documento clínico base para la nota de urgencias
INSERT INTO documento_clinico (
  id_expediente, id_internamiento, tipo_documento,
  fecha_elaboracion, id_personal_creador, estado
) VALUES (
  (SELECT e.id_expediente FROM expediente e
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05'),
  (SELECT i.id_internamiento 
   FROM internamiento i
   JOIN expediente e ON i.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05'),
  'Nota de Urgencias',
  CURRENT_TIMESTAMP,
  (SELECT pm.id_personal_medico 
   FROM personal_medico pm
   JOIN persona p ON pm.id_persona = p.id_persona
   WHERE p.curp = 'METG820415MDFNRB09'),
  'Activo'::estado_documento_enum
);

-- Verificar documento clínico creado
SELECT dc.id_documento, dc.tipo_documento, dc.fecha_elaboracion,
       p.nombre, p.apellido_paterno
FROM documento_clinico dc
JOIN expediente e ON dc.id_expediente = e.id_expediente
JOIN paciente pa ON e.id_paciente = pa.id_paciente
JOIN persona p ON pa.id_persona = p.id_persona
WHERE p.curp = 'JUMR770923HDFRNC05';

-- Crear nota de urgencias
INSERT INTO nota_urgencias (
  id_documento, motivo_atencion, estado_conciencia, 
  resumen_interrogatorio, exploracion_fisica, 
  resultados_estudios, diagnostico, plan_tratamiento, pronostico
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Nota de Urgencias' ),
   --LIMIT 1 dentro de select para evitar error de subconsulta
  'Dolor abdominal agudo',
  'Alerta, orientado en tiempo, espacio y persona',
  'Paciente masculino de 47 años con diabetes tipo 2 de 8 años de evolución. Refiere inicio de dolor abdominal intenso hace 12 horas, localizado en epigastrio e irradiado en banda hacia la espalda, acompañado de náuseas y vómito de contenido alimentario en 3 ocasiones. Niega fiebre. Último alimento hace 18 horas, de alto contenido graso.',
  'TA: 150/90 mmHg, FC: 98 lpm, FR: 20 rpm, Temp: 37.8°C, SatO2: 96%. Paciente con facies álgica, mucosas orales secas +. Abdomen globoso por panículo adiposo, doloroso a la palpación en epigastrio e hipocondrio izquierdo, resistencia muscular involuntaria, peristalsis disminuida en intensidad y frecuencia. Signo de Murphy negativo, signo de Blumberg positivo, signo de Giordano negativo.',
  'Biometría hemática: Leucocitos 14,500, Neutrófilos 82%, Linfocitos 12%, Hb 14.2 g/dL, Plaquetas 250,000. Química sanguínea: Glucosa 212 mg/dL, Creatinina 0.9 mg/dL, BUN 18 mg/dL, Amilasa 950 U/L, Lipasa 1200 U/L.',
  'Pancreatitis aguda probable origen biliar. Diabetes mellitus tipo 2 descontrolada.',
  'Ayuno, soluciones intravenosas, analgesia con tramadol, control de glucemia con insulina, antibióticos preventivos.',
  'Reservado a evolución'
);

-- Verificar nota de urgencias
SELECT nu.motivo_atencion, nu.diagnostico, nu.plan_tratamiento,
       p.nombre, p.apellido_paterno
FROM nota_urgencias nu
JOIN documento_clinico dc ON nu.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
JOIN paciente pa ON e.id_paciente = pa.id_paciente
JOIN persona p ON pa.id_persona = p.id_persona
WHERE p.curp = 'JUMR770923HDFRNC05';



-- 7. Registrar signos vitales
INSERT INTO signos_vitales (
  id_documento, temperatura, presion_arterial_sistolica,
  presion_arterial_diastolica, frecuencia_cardiaca,
  frecuencia_respiratoria, saturacion_oxigeno,
  glucosa, peso, talla, imc, observaciones
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Nota de Urgencias'),
  37.8, 150, 90, 98, 20, 96, 212, 91.5, 174, 30.2,
  'Signos vitales al ingreso a urgencias. Paciente diaforético.'
);

-- Verificar signos vitales
SELECT sv.temperatura, sv.presion_arterial_sistolica, sv.presion_arterial_diastolica,
       sv.frecuencia_cardiaca, sv.frecuencia_respiratoria, sv.glucosa,
       p.nombre, p.apellido_paterno
FROM signos_vitales sv
JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
JOIN paciente pa ON e.id_paciente = pa.id_paciente
JOIN persona p ON pa.id_persona = p.id_persona
WHERE p.curp = 'JUMR770923HDFRNC05';






-- 8. Crear documento para solicitud de estudios
INSERT INTO documento_clinico (
  id_expediente, id_internamiento, tipo_documento,
  fecha_elaboracion, id_personal_creador, estado
) VALUES (
  (SELECT e.id_expediente FROM expediente e
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05'),
  (SELECT i.id_internamiento 
   FROM internamiento i
   JOIN expediente e ON i.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05'),
  'Solicitud de Estudios',
  CURRENT_TIMESTAMP,
  (SELECT pm.id_personal_medico 
   FROM personal_medico pm
   JOIN persona p ON pm.id_persona = p.id_persona
   WHERE p.curp = 'METG820415MDFNRB09'),
  'Activo'::estado_documento_enum
);

-- Solicitar tomografía abdominal
INSERT INTO solicitud_estudio (
  id_documento, id_estudio, justificacion,
  preparacion_requerida, informacion_clinica_relevante,
  fecha_solicitada, prioridad
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Solicitud de Estudios'),
  (SELECT id_estudio FROM estudio_medico WHERE nombre = 'Química Sanguínea IV'),
  'Evaluación de función renal y metabólica en paciente con pancreatitis aguda',
  'Ayuno de 8 horas',
  'Paciente diabético con pancreatitis aguda en estudio',
  CURRENT_DATE,
  'Urgente'
);

-- Solicitar segundo estudio (Perfil de Lípidos)
INSERT INTO solicitud_estudio (
  id_documento, id_estudio, justificacion,
  preparacion_requerida, informacion_clinica_relevante,
  fecha_solicitada, prioridad
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Solicitud de Estudios'),
  (SELECT id_estudio FROM estudio_medico WHERE nombre = 'Perfil de Lípidos'),
  'Evaluar alteraciones lipídicas como factor desencadenante de pancreatitis',
  'Ayuno de 12 horas',
  'Sospecha de pancreatitis asociada a hipertrigliceridemia',
  CURRENT_DATE,
  'Normal'
);

-- Solicitar tercer estudio (Lipasa)
INSERT INTO solicitud_estudio (
  id_documento, id_estudio, justificacion,
  preparacion_requerida, informacion_clinica_relevante,
  fecha_solicitada, prioridad
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Solicitud de Estudios'),
  (SELECT id_estudio FROM estudio_medico WHERE nombre = 'Lipasa'),
  'Confirmación de pancreatitis aguda',
  'Ayuno',
  'Sospecha de pancreatitis aguda, valor previo elevado',
  CURRENT_DATE,
  'Urgente'
);

-- Verificar estudios solicitados
SELECT se.id_solicitud, em.nombre AS estudio_solicitado, 
       se.justificacion, se.prioridad, se.fecha_solicitada
FROM solicitud_estudio se
JOIN estudio_medico em ON se.id_estudio = em.id_estudio
JOIN documento_clinico dc ON se.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
JOIN paciente pa ON e.id_paciente = pa.id_paciente
JOIN persona p ON pa.id_persona = p.id_persona
WHERE p.curp = 'JUMR770923HDFRNC05'
ORDER BY se.prioridad;




-- 9. Crear documento para prescripción médica
INSERT INTO documento_clinico (
  id_expediente, id_internamiento, tipo_documento,
  fecha_elaboracion, id_personal_creador, estado
) VALUES (
  (SELECT e.id_expediente FROM expediente e
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05'),
  (SELECT i.id_internamiento 
   FROM internamiento i
   JOIN expediente e ON i.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05'),
  'Prescripción Médica',
  CURRENT_TIMESTAMP,
  (SELECT pm.id_personal_medico 
   FROM personal_medico pm
   JOIN persona p ON pm.id_persona = p.id_persona
   WHERE p.curp = 'METG820415MDFNRB09'),
  'Activo'::estado_documento_enum
);

-- Insertar medicamento no existente
INSERT INTO medicamento (codigo, nombre, presentacion, concentracion, grupo_terapeutico)
VALUES ('MED-003', 'Tramadol', 'Ampolleta', '50 mg/ml', 'Analgésicos opioides');

INSERT INTO medicamento (codigo, nombre, presentacion, concentracion, grupo_terapeutico)
VALUES ('MED-004', 'Ciprofloxacino', 'Solución IV', '200 mg/100 ml', 'Antibióticos');

INSERT INTO medicamento (codigo, nombre, presentacion, concentracion, grupo_terapeutico)
VALUES ('MED-005', 'Omeprazol', 'Ampolleta', '40 mg', 'Inhibidores de bomba de protones');

INSERT INTO medicamento (codigo, nombre, presentacion, concentracion, grupo_terapeutico)
VALUES ('MED-006', 'Insulina NPH', 'Vial', '100 UI/ml', 'Hipoglucemiantes');

-- Prescribir medicamentos
INSERT INTO prescripcion_medicamento (
  id_documento, id_medicamento, dosis, via_administracion,
  frecuencia, duracion, indicaciones_especiales, fecha_inicio
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Prescripción Médica'),
  (SELECT id_medicamento FROM medicamento WHERE nombre = 'Tramadol'),
  '50 mg diluido en 100ml de solución fisiológica', 'Intravenosa',
  'Cada 8 horas', '3 días',
  'Administrar en 30 minutos, vigilar efectos adversos',
  CURRENT_DATE
);

INSERT INTO prescripcion_medicamento (
  id_documento, id_medicamento, dosis, via_administracion,
  frecuencia, duracion, indicaciones_especiales, fecha_inicio
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Prescripción Médica'),
  (SELECT id_medicamento FROM medicamento WHERE nombre = 'Ciprofloxacino'),
  '200 mg', 'Intravenosa',
  'Cada 12 horas', '7 días',
  'Pasar en 60 minutos',
  CURRENT_DATE
);

INSERT INTO prescripcion_medicamento (
  id_documento, id_medicamento, dosis, via_administracion,
  frecuencia, duracion, indicaciones_especiales, fecha_inicio
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Prescripción Médica'),
  (SELECT id_medicamento FROM medicamento WHERE nombre = 'Omeprazol'),
  '40 mg', 'Intravenosa',
  'Cada 24 horas', '7 días',
  'Diluir en 100 ml de solución fisiológica y pasar en 30 minutos',
  CURRENT_DATE
);


---ERROR:  el valor es demasiado largo para el tipo character varying(50) 
--SQL state: 22001
INSERT INTO prescripcion_medicamento (
  id_documento, id_medicamento, dosis, via_administracion,
  frecuencia, duracion, indicaciones_especiales, fecha_inicio
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Prescripción Médica'),
  (SELECT id_medicamento FROM medicamento WHERE nombre = 'Insulina NPH'),
  'Según esquema: Si glucosa < 200 = 0 UI, 200-300 = 4 UI, 301-400 = 6 UI, >400 = 8 UI', 'Subcutánea',
  'Cada 6 horas', 'Hasta normalización',
  'Tomar glucometría capilar antes de cada aplicación',
  CURRENT_DATE
);

-- Verificar medicamentos prescritos
SELECT m.nombre AS medicamento, pm.dosis, pm.via_administracion, 
       pm.frecuencia, pm.fecha_inicio, pm.indicaciones_especiales
FROM prescripcion_medicamento pm
JOIN medicamento m ON pm.id_medicamento = m.id_medicamento
JOIN documento_clinico dc ON pm.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
JOIN paciente pa ON e.id_paciente = pa.id_paciente
JOIN persona p ON pa.id_persona = p.id_persona
WHERE p.curp = 'JUMR770923HDFRNC05';







-- 10. Crear documento para nota de evolución (día siguiente)
INSERT INTO documento_clinico (
  id_expediente, id_internamiento, tipo_documento,
  fecha_elaboracion, id_personal_creador, estado
) VALUES (
  (SELECT e.id_expediente FROM expediente e
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05'),
  (SELECT i.id_internamiento 
   FROM internamiento i
   JOIN expediente e ON i.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05'),
  'Nota de Evolución',
  CURRENT_TIMESTAMP + INTERVAL '1 day',
  (SELECT pm.id_personal_medico 
   FROM personal_medico pm
   JOIN persona p ON pm.id_persona = p.id_persona
   WHERE p.curp = 'METG820415MDFNRB09'),
  'Activo'::estado_documento_enum
);

-- Insertar nota de evolución
INSERT INTO nota_evolucion (
  id_documento, subjetivo, objetivo, analisis, plan
) VALUES (
  (SELECT dc.id_documento
   FROM documento_clinico dc
   JOIN expediente e ON dc.id_expediente = e.id_expediente
   JOIN paciente pa ON e.id_paciente = pa.id_paciente
   JOIN persona p ON pa.id_persona = p.id_persona
   WHERE p.curp = 'JUMR770923HDFRNC05' AND dc.tipo_documento = 'Nota de Evolución'),
  'El paciente refiere disminución del dolor abdominal (EVA 5/10), ausencia de náuseas y vómito. Se queja de sed y niega fiebre. Toleró la dieta líquida clara indicada.',
  'TA: 130/80 mmHg, FC: 82 lpm, FR: 18 rpm, Temp: 36.8°C, SatO2: 97%, Glucemia: 145 mg/dL. Paciente en mejor estado general, hidratado, alerta. Abdomen con dolor a la palpación en epigastrio e hipocondrio izquierdo, menos intenso que al ingreso. Peristalsis presente en los 4 cuadrantes. Resultados de laboratorio: Lipasa 850 U/L (disminuyendo), Triglicéridos 580 mg/dL.',
  'Evolución favorable de pancreatitis aguda de probable origen biliar vs hipertrigliceridemia. Mejoría clínica evidente con disminución del dolor y normalización de signos vitales. Disminución de valores de lipasa aunque aún elevados. Diabetes mellitus con mejor control.',
  'Continuar ayuno por 24 horas más, iniciar dieta líquida clara si tolera. Mantener hidratación intravenosa. Continuar analgesia e inhibidor de bomba. Realizar ultrasonido de hígado y vías biliares. Valorar inicio de fibratos para manejo de hipertrigliceridemia. Control de glucemia.'
);

-- Verificar nota de evolución
SELECT ne.subjetivo, ne.objetivo, ne.analisis, ne.plan,
       p.nombre, p.apellido_paterno
FROM nota_evolucion ne
JOIN documento_clinico dc ON ne.id_documento = dc.id_documento
JOIN expediente e ON dc.id_expediente = e.id_expediente
JOIN paciente pa ON e.id_paciente = pa.id_paciente
JOIN persona p ON pa.id_persona = p.id_persona
WHERE p.curp = 'JUMR770923HDFRNC05';



