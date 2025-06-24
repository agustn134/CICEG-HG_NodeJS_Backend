-- ==========================================
-- CONFIRMACIÓN DE DATOS INSERTADOS
-- ==========================================
-- ==========================================
-- TABLA: tipo_sangre (PRIMERO - sin dependencias)		1
-- ==========================================
INSERT INTO tipo_sangre (nombre, descripcion) VALUES
('A+', 'Grupo sanguíneo A positivo'),
('A-', 'Grupo sanguíneo A negativo'),
('B+', 'Grupo sanguíneo B positivo'),
('B-', 'Grupo sanguíneo B negativo'),
('AB+', 'Grupo sanguíneo AB positivo'),
('AB-', 'Grupo sanguíneo AB negativo'),
('O+', 'Grupo sanguíneo O positivo'),
('O-', 'Grupo sanguíneo O negativo');

-- ==========================================
-- TABLA: servicio
-- ==========================================
select * from servicio
INSERT INTO servicio (nombre, descripcion) VALUES
('Urgencias', 'Área de atención médica de emergencia'),
('Traumatología', 'Servicio especializado en lesiones del sistema músculo-esquelético'),
('Medicina Interna', 'Servicio especializado en enfermedades en adultos'),
('Pediatría', 'Servicio especializado en salud infantil'),
('Ortopedia', 'Servicio especializado en trastornos del aparato locomotor'),
('Cirugía General', 'Servicio encargado de intervenciones quirúrgicas generales'),
('Ginecología y Obstetricia', 'Servicio especializado en salud femenina y embarazo'),
('Consulta Externa', 'Servicio de consultas ambulatorias'),
('Hospitalización', 'Servicio de internamiento general'),
('Quirófano', 'Área de cirugías y procedimientos quirúrgicos');

-- ==========================================
-- TABLA: area_interconsulta	3	
-- ==========================================
INSERT INTO area_interconsulta (nombre, descripcion) VALUES
('Cardiología', 'Servicio especializado en el corazón y sistema cardiovascular'),
('Ginecología', 'Servicio especializado en salud femenina'),
('Nutrición', 'Servicio de asesoría nutricional'),
('Neurología', 'Servicio especializado en enfermedades del sistema nervioso'),
('Dermatología', 'Servicio especializado en piel y sus enfermedades'),
('Endocrinología', 'Servicio especializado en trastornos hormonales'),
('Oftalmología', 'Servicio especializado en salud visual'),
('Psiquiatría', 'Servicio especializado en salud mental'),
('Infectología', 'Servicio especializado en enfermedades infecciosas'),
('Nefrología', 'Servicio especializado en riñones y sus enfermedades'),
('Hematología', 'Servicio especializado en enfermedades de la sangre'),
('Reumatología', 'Servicio especializado en enfermedades articulares y autoinmunes'),
('Geriatría', 'Servicio especializado en salud del adulto mayor'),
('Anestesiología', 'Servicio especializado en manejo del dolor y anestesia'),
('Oncología', 'Servicio especializado en diagnóstico y tratamiento del cáncer'),
('Radiología', 'Servicio especializado en imágenes médicas'),
('Laboratorio Clínico', 'Servicio especializado en análisis clínicos'),
('Enfermería', 'Servicio de apoyo en cuidados generales'),
('Farmacia', 'Servicio especializado en dispensación y control de medicamentos'),
('Terapia Física', 'Servicio especializado en rehabilitación física'),
('Urología', 'Servicio especializado en aparato genitourinario'),
('Neumología', 'Servicio especializado en enfermedades respiratorias'),
('Gastroenterología', 'Servicio especializado en aparato digestivo'),
('Otorrinolaringología', 'Servicio especializado en oído, nariz y garganta'),
('Psicología', 'Servicio de apoyo psicológico');

-- ==========================================
-- TABLA: guia_clinica	4
-- ==========================================
INSERT INTO guia_clinica (area, codigo, nombre, fuente, fecha_actualizacion, descripcion) VALUES
-- Urgencias
('Urgencias', 'IMSS-030_08', 'TRIAGE', 'IMSS', '2025-01-15', 'Clasificación de urgencias médicas'),
('Urgencias', 'ISSSTE-663-13', 'ABSCESO ANAL', 'ISSSTE', '2023-05-01', 'Manejo de abscesos anales'),
('Urgencias', 'ISSSTE-680-13', 'ACCESOS VASCULARES', 'ISSSTE', '2023-05-01', 'Protocolo de accesos vasculares'),
('Urgencias', 'SS-027-08', 'INFECCIÓN VÍAS URINARIAS MENORES 18 AÑOS', 'SSA', '2023-05-01', 'ITU en población pediátrica'),
('Urgencias', 'IMSS-142-09', 'CHOQUE HIPOVOLÉMICO', 'IMSS', '2024-03-10', 'Manejo del choque hipovolémico'),

-- Pediatría
('Pediatría', 'SS-149_08', 'FIEBRE REUMÁTICA', 'SSA', '2025-01-19', 'Secuela postestreptocócica'),
('Pediatría', 'IMSS-510-11', 'BRONQUIOLITIS AGUDA', 'IMSS', '2024-11-20', 'Manejo de bronquiolitis en lactantes'),
('Pediatría', 'SSA-025-08', 'DIARREA AGUDA EN NIÑOS', 'SSA', '2024-08-15', 'Protocolo de diarrea pediátrica'),
('Pediatría', 'IMSS-031-08', 'NEUMONÍA ADQUIRIDA EN LA COMUNIDAD', 'IMSS', '2024-06-30', 'NAC en población pediátrica'),

-- Gastroenterología
('Gastroenterología', 'SS-150_08', 'ÚLCERA PÉPTICA EN ADULTOS', 'SSA', '2025-01-19', 'Lesión mucosa gastroduodenal'),
('Gastroenterología', 'IMSS-068-08', 'ENFERMEDAD POR REFLUJO GASTROESOFÁGICO', 'IMSS', '2024-04-12', 'ERGE en adultos'),

-- Infectología
('Infectología', 'SS-151_08', 'DENGUE', 'SSA', '2025-01-19', 'Infección viral por mosquito'),
('Infectología', 'IMSS-245-09', 'TUBERCULOSIS PULMONAR', 'IMSS', '2024-09-25', 'Diagnóstico y tratamiento de TB'),

-- Cardiología
('Cardiología', 'IMSS-232-09', 'INFARTO AGUDO AL MIOCARDIO', 'IMSS', '2024-12-01', 'Manejo del IAM'),
('Cardiología', 'SSA-086-08', 'HIPERTENSIÓN ARTERIAL SISTÉMICA', 'SSA', '2024-07-18', 'Control de HAS'),

-- Ginecología
('Ginecología', 'IMSS-028-08', 'CONTROL PRENATAL', 'IMSS', '2024-10-30', 'Seguimiento del embarazo'),
('Ginecología', 'SSA-048-08', 'PREECLAMPSIA', 'SSA', '2024-05-22', 'Hipertensión gestacional'),

-- Cirugía
('Cirugía', 'IMSS-338-10', 'APENDICITIS AGUDA', 'IMSS', '2024-08-08', 'Diagnóstico y tratamiento quirúrgico'),
('Cirugía', 'SSA-195-09', 'COLECISTITIS AGUDA', 'SSA', '2024-03-15', 'Inflamación de vesícula biliar');

-- ==========================================
-- TABLA: estudio_medico (CORREGIDA Y AMPLIADA)	5
-- ==========================================

-- HEMATOLOGÍA
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('20109', 'Biometría Hemática', 'Laboratorio', 'Conteo de glóbulos rojos, blancos y plaquetas', TRUE, 4),
('20108', 'Grupo Sanguíneo y Rh', 'Laboratorio', 'Determinación del grupo sanguíneo ABO y factor Rh', FALSE, 6),
('201031', 'Velocidad de Sedimentación Globular (VSG)', 'Laboratorio', 'Marcador de inflamación sistémica', TRUE, 6),
('20102', 'Recuento de Reticulocitos', 'Laboratorio', 'Evalúa la producción de glóbulos rojos', TRUE, 6),
('20105', 'Frotis de Sangre Periférica', 'Laboratorio', 'Estudio morfológico de células sanguíneas', FALSE, 8),
('193031', 'Hemoglobina Glucosilada (HbA1c)', 'Laboratorio', 'Control glucémico a largo plazo', TRUE, 6),
('20202', 'Paquete Hematológico Completo', 'Laboratorio', 'Biometría + VSG + Reticulocitos', TRUE, 8);

-- COAGULACIÓN
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('20113', 'Tiempo de Protrombina (TP)', 'Laboratorio', 'Evalúa coagulación y función hepática', TRUE, 6),
('20114', 'Tiempo de Tromboplastina Parcial (TTPa)', 'Laboratorio', 'Mide vía intrínseca de coagulación', TRUE, 6),
('20116', 'Fibrinógeno', 'Laboratorio', 'Proteína implicada en coagulación', TRUE, 6),
('20115', 'INR', 'Laboratorio', 'Relación normalizada internacional', TRUE, 6);

-- BIOQUÍMICA CLÍNICA
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('19301', 'Glucosa en Ayunas', 'Laboratorio', 'Diagnóstico de diabetes mellitus', TRUE, 4),
('19302', 'Glucosa Postprandial', 'Laboratorio', 'Nivel de glucosa posterior a alimentos', FALSE, 4),
('193032', 'Tamiz Gestacional 50g / 1 hr', 'Laboratorio', 'Tamizaje de diabetes gestacional', FALSE, 6),
('193033', 'Curva de Tolerancia a la Glucosa 75g', 'Laboratorio', 'Evaluación completa de tolerancia a glucosa', TRUE, 12),
('19304', 'Urea/BUN', 'Laboratorio', 'Evaluación de función renal', FALSE, 4),
('19306', 'Creatinina', 'Laboratorio', 'Indicador principal de función renal', FALSE, 4),
('193071', 'Ácido Úrico', 'Laboratorio', 'Evalúa gota y metabolismo de purinas', TRUE, 4),
('193072', 'Colesterol Total', 'Laboratorio', 'Lípidos séricos totales', TRUE, 6),
('19703', 'HDL Colesterol', 'Laboratorio', 'Colesterol de alta densidad (bueno)', TRUE, 6),
('19704', 'LDL Colesterol', 'Laboratorio', 'Colesterol de baja densidad (malo)', TRUE, 6),
('19702', 'Triglicéridos', 'Laboratorio', 'Lípidos circulantes', TRUE, 6),
('20203', 'Perfil de Lípidos Completo', 'Laboratorio', 'Colesterol total, HDL, LDL, Triglicéridos', TRUE, 8);

-- FUNCIÓN HEPÁTICA
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('19401', 'AST (TGO)', 'Laboratorio', 'Transaminasa - marcador de daño hepático', TRUE, 4),
('19402', 'ALT (TGP)', 'Laboratorio', 'Transaminasa - marcador específico hepático', TRUE, 4),
('19403', 'Fosfatasa Alcalina (ALP)', 'Laboratorio', 'Marcador de hígado y metabolismo óseo', TRUE, 4),
('19308', 'Bilirrubina Directa', 'Laboratorio', 'Bilirrubina conjugada', TRUE, 4),
('22118', 'Bilirrubina Total', 'Laboratorio', 'Bilirrubina directa e indirecta', TRUE, 4),
('19309', 'Proteínas Totales', 'Laboratorio', 'Evalúa estado nutricional y síntesis hepática', FALSE, 4),
('19310', 'Albúmina', 'Laboratorio', 'Evalúa síntesis hepática y estado nutricional', TRUE, 4),
('20208', 'Perfil Hepático Completo', 'Laboratorio', 'AST, ALT, Bilirrubinas, Fosfatasa alcalina, Proteínas', TRUE, 12);

-- FUNCIÓN PANCREÁTICA
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('19407', 'Amilasa', 'Laboratorio', 'Enzima pancreática', TRUE, 6),
('19408', 'Lipasa', 'Laboratorio', 'Marcador específico de pancreatitis aguda', TRUE, 6);

-- ELECTROLITOS
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('196011', 'Sodio', 'Laboratorio', 'Electrolito principal extracelular', FALSE, 4),
('196021', 'Potasio', 'Laboratorio', 'Electrolito principal intracelular', FALSE, 4),
('201032', 'Cloro', 'Laboratorio', 'Electrolito importante para equilibrio ácido-base', FALSE, 4),
('19604', 'Calcio', 'Laboratorio', 'Homeostasis ósea y neuromuscular', FALSE, 4),
('19603', 'Fósforo', 'Laboratorio', 'Balance mineral y metabolismo óseo', FALSE, 4),
('196022', 'Magnesio', 'Laboratorio', 'Cofactor enzimático importante', FALSE, 4);

-- PAQUETES DE LABORATORIO
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('20204', 'Química Sanguínea III', 'Laboratorio', 'Glucosa, Urea, Creatinina', TRUE, 8),
('20207', 'Química Sanguínea IV', 'Laboratorio', 'QS III + Electrolitos + Ácido Úrico', TRUE, 8),
('20209', 'Perfil Prequirúrgico', 'Laboratorio', 'Biometría, QS, Coagulación, Grupo sanguíneo', TRUE, 24),
('20210', 'Perfil Reumático', 'Laboratorio', 'Factor reumatoide, PCR, VSG, Antiestreptolisinas', TRUE, 12),
('20211', 'Perfil de Embarazo', 'Laboratorio', 'Biometría, TP, TTPa, Glucemia, VDRL, EGO', TRUE, 24);

-- INMUNOHEMATOLOGÍA
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('20107', 'Pruebas Cruzadas', 'Laboratorio', 'Compatibilidad sanguínea pretransfusional', FALSE, 4),
('19210', 'Coombs Directo', 'Laboratorio', 'Detecta anticuerpos adheridos a glóbulos rojos', FALSE, 6),
('19211', 'Coombs Indirecto', 'Laboratorio', 'Detecta anticuerpos libres en plasma', FALSE, 6);

-- INMUNOLOGÍA
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('19201', 'Reacciones Febriles', 'Laboratorio', 'Anticuerpos contra Salmonella, Brucella, Rickettsia', FALSE, 24),
('192061', 'Proteína C Reactiva (PCR)', 'Laboratorio', 'Marcador de inflamación aguda', FALSE, 6),
('19207', 'Factor Reumatoide', 'Laboratorio', 'Autoanticuerpo en artritis reumatoide', FALSE, 12),
('19205', 'Antiestreptolisinas O (ASO)', 'Laboratorio', 'Infección estreptocócica reciente', FALSE, 24),
('22131', 'VDRL', 'Laboratorio', 'Detección de sífilis (no treponémico)', FALSE, 8),
('192062', 'RPR', 'Laboratorio', 'Confirmación de sífilis (no treponémico)', FALSE, 8),
('20117', 'VIH 1-2 Prueba Rápida', 'Laboratorio', 'Detección rápida de anticuerpos anti-VIH', FALSE, 2);

-- MARCADORES TUMORALES
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('19212', 'Antígeno Prostático Específico (PSA)', 'Laboratorio', 'Detección de cáncer prostático', TRUE, 8),
('19213', 'Alfafetoproteína (AFP)', 'Laboratorio', 'Marcador de cáncer hepático', TRUE, 8),
('19214', 'Antígeno Carcinoembrionario (CEA)', 'Laboratorio', 'Marcador de cáncer colorrectal', TRUE, 8);

-- HORMONAS
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('19720', 'hCG Beta Cuantitativa', 'Laboratorio', 'Seguimiento de embarazo y patología trofoblástica', FALSE, 6),
('19715', 'Prueba de Embarazo en Orina', 'Laboratorio', 'Detección cualitativa de embarazo', FALSE, 2),
('19721', 'TSH', 'Laboratorio', 'Hormona estimulante de tiroides', TRUE, 8),
('19722', 'T4 Libre', 'Laboratorio', 'Tiroxina libre', TRUE, 8),
('19723', 'T3 Total', 'Laboratorio', 'Triyodotironina total', TRUE, 8);

-- PERFIL CARDÍACO
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('19406', 'LDH', 'Laboratorio', 'Deshidrogenasa láctica - daño tisular', FALSE, 6),
('194091', 'CPK Total', 'Laboratorio', 'Creatina fosfoquinasa - enzima muscular', TRUE, 6),
('194092', 'CK-MB', 'Laboratorio', 'Fracción cardíaca específica de CPK', TRUE, 6),
('194093', 'Troponina I', 'Laboratorio', 'Marcador específico de daño miocárdico', FALSE, 4);

-- URINANÁLISIS
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('20201', 'Examen General de Orina', 'Laboratorio', 'Análisis físico, químico y microscópico', FALSE, 4),
('19501', 'Depuración de Creatinina', 'Laboratorio', 'Evaluación de filtrado glomerular', FALSE, 24),
('22803', 'Microalbuminuria 24 horas', 'Laboratorio', 'Detección precoz de nefropatía diabética', FALSE, 12),
('19502', 'Sangre Oculta en Heces', 'Laboratorio', 'Detecta sangrado digestivo oculto', FALSE, 6);

-- MICROBIOLOGÍA
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('21001', 'Urocultivo', 'Laboratorio', 'Cultivo de orina para identificar bacterias', FALSE, 48),
('21002', 'Coprocultivo', 'Laboratorio', 'Cultivo de heces para patógenos entéricos', FALSE, 72),
('21003', 'Hemocultivo', 'Laboratorio', 'Cultivo de sangre para detectar bacteremia', FALSE, 72),
('21004', 'Cultivo de Exudado Faríngeo', 'Laboratorio', 'Identificación de Streptococcus beta hemolítico', FALSE, 48);

-- PARASITOLOGÍA
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('200011', 'Coproparasitoscópico Seriado (3 muestras)', 'Laboratorio', 'Búsqueda exhaustiva de parásitos intestinales', FALSE, 24),
('200012', 'Coproparasitoscópico Simple', 'Laboratorio', 'Búsqueda básica de parásitos', FALSE, 12),
('200051', 'Coprológico Funcional', 'Laboratorio', 'Análisis de digestión y absorción', FALSE, 6),
('19215', 'Rotavirus en Heces', 'Laboratorio', 'Antígeno viral en gastroenteritis', FALSE, 6);

-- GASOMETRÍAS
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('19606', 'Gasometría Arterial', 'Laboratorio', 'pH, pO2, pCO2, HCO3 en sangre arterial', FALSE, 2),
('17301', 'Gasometría Venosa', 'Laboratorio', 'pH, pCO2, HCO3 en sangre venosa', FALSE, 2);

-- ESTUDIOS DE IMAGEN
INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado) VALUES
('30001', 'Radiografía de Tórax', 'Imagen', 'Evaluación de pulmones y corazón', FALSE, 2),
('30002', 'Radiografía de Abdomen', 'Imagen', 'Evaluación de vísceras abdominales', FALSE, 2),
('30003', 'Ultrasonido Abdominal', 'Imagen', 'Evaluación de órganos abdominales', TRUE, 24),
('30004', 'Ultrasonido Obstétrico', 'Imagen', 'Evaluación de embarazo', FALSE, 24),
('30005', 'Tomografía de Cráneo Simple', 'Imagen', 'Evaluación de estructuras cerebrales', FALSE, 24),
('30006', 'Tomografía de Abdomen', 'Imagen', 'Evaluación detallada abdominal', FALSE, 24),
('30007', 'Ecocardiograma', 'Imagen', 'Evaluación de función cardíaca', FALSE, 24);

-- ==========================================
-- TABLA: medicamento (AMPLIADA) 	6
-- ==========================================
INSERT INTO medicamento (codigo, nombre, presentacion, concentracion, grupo_terapeutico) VALUES
-- Analgésicos y Antipiréticos
('MED-001', 'Paracetamol', 'Tableta', '500 mg', 'Analgésicos y Antipiréticos'),
('MED-002', 'Ibuprofeno', 'Tableta', '400 mg', 'Antiinflamatorios no esteroideos'),
('MED-003', 'Naproxeno', 'Tableta', '250 mg', 'Antiinflamatorios no esteroideos'),
('MED-004', 'Diclofenaco', 'Tableta', '50 mg', 'Antiinflamatorios no esteroideos'),
('MED-005', 'Metamizol', 'Ampolleta', '500 mg/ml', 'Analgésicos y Antipiréticos'),

-- Antibióticos
('MED-011', 'Amoxicilina', 'Cápsula', '500 mg', 'Antibióticos - Penicilinas'),
('MED-012', 'Amoxicilina + Ácido Clavulánico', 'Tableta', '875/125 mg', 'Antibióticos - Penicilinas'),
('MED-013', 'Cefalexina', 'Cápsula', '500 mg', 'Antibióticos - Cefalosporinas'),
('MED-014', 'Azitromicina', 'Tableta', '500 mg', 'Antibióticos - Macrólidos'),
('MED-015', 'Ciprofloxacino', 'Tableta', '500 mg', 'Antibióticos - Quinolonas'),
('MED-016', 'Clindamicina', 'Cápsula', '300 mg', 'Antibióticos - Lincosamidas'),
('MED-017', 'Trimetoprim + Sulfametoxazol', 'Tableta', '160/800 mg', 'Antibióticos - Sulfonamidas'),

-- Cardiovasculares
('MED-021', 'Enalapril', 'Tableta', '10 mg', 'Antihipertensivos - IECA'),
('MED-022', 'Losartán', 'Tableta', '50 mg', 'Antihipertensivos - ARA II'),
('MED-023', 'Amlodipino', 'Tableta', '5 mg', 'Antihipertensivos - Calcioantagonistas'),
('MED-024', 'Metoprolol', 'Tableta', '100 mg', 'Antihipertensivos - Beta bloqueadores'),
('MED-025', 'Furosemida', 'Tableta', '40 mg', 'Diuréticos'),
('MED-026', 'Hidroclorotiazida', 'Tableta', '25 mg', 'Diuréticos'),

-- Antidiabéticos
('MED-031', 'Metformina', 'Tableta', '850 mg', 'Antidiabéticos'),
('MED-032', 'Glibenclamida', 'Tableta', '5 mg', 'Antidiabéticos'),
('MED-033', 'Insulina NPH', 'Frasco ampolla', '100 UI/ml', 'Insulinas'),
('MED-034', 'Insulina Rápida', 'Frasco ampolla', '100 UI/ml', 'Insulinas'),

-- Gastrointestinales
('MED-041', 'Omeprazol', 'Cápsula', '20 mg', 'Inhibidores de bomba de protones'),
('MED-042', 'Ranitidina', 'Tableta', '150 mg', 'Antihistamínicos H2'),
('MED-043', 'Metoclopramida', 'Tableta', '10 mg', 'Procinéticos'),
('MED-044', 'Loperamida', 'Cápsula', '2 mg', 'Antidiarreicos'),
('MED-045', 'Sales de Rehidratación Oral', 'Sobre', '20.5 g', 'Rehidratantes'),

-- Respiratorios
('MED-051', 'Salbutamol', 'Inhalador', '100 mcg/dosis', 'Broncodilatadores'),
('MED-052', 'Budesonida', 'Inhalador', '200 mcg/dosis', 'Corticosteroides inhalados'),
('MED-053', 'Dextrometorfano', 'Jarabe', '15 mg/5ml', 'Antitusivos'),
('MED-054', 'Loratadina', 'Tableta', '10 mg', 'Antihistamínicos'),

-- Neurológicos
('MED-061', 'Fenitoína', 'Tableta', '100 mg', 'Anticonvulsivantes'),
('MED-062', 'Carbamazepina', 'Tableta', '200 mg', 'Anticonvulsivantes'),
('MED-063', 'Diazepam', 'Tableta', '10 mg', 'Ansiolíticos'),

-- Pediátricos
('MED-071', 'Paracetamol Pediátrico', 'Suspensión', '160 mg/5ml', 'Analgésicos Pediátricos'),
('MED-072', 'Amoxicilina Pediátrica', 'Suspensión', '250 mg/5ml', 'Antibióticos Pediátricos'),
('MED-073', 'Ibuprofeno Pediátrico', 'Suspensión', '100 mg/5ml', 'Antiinflamatorios Pediátricos'),
('MED-074', 'Cefalexina Pediátrica', 'Suspensión', '250 mg/5ml', 'Antibióticos Pediátricos'),

-- Soluciones y Electrolitos
('MED-081', 'Solución Salina 0.9%', 'Bolsa', '1000 ml', 'Soluciones Intravenosas'),
('MED-082', 'Solución Glucosada 5%', 'Bolsa', '1000 ml', 'Soluciones Intravenosas'),
('MED-083', 'Solución Hartmann', 'Bolsa', '1000 ml', 'Soluciones Intravenosas'),
('MED-084', 'Cloruro de Potasio', 'Ampolleta', '2 mEq/ml', 'Electrolitos'),

-- Vitaminas y Suplementos
('MED-091', 'Ácido Fólico', 'Tableta', '5 mg', 'Vitaminas'),
('MED-092', 'Complejo B', 'Tableta', 'Multivitamínico', 'Vitaminas'),
('MED-093', 'Sulfato Ferroso', 'Tableta', '300 mg', 'Suplementos de Hierro'),
('MED-094', 'Calcio + Vitamina D', 'Tableta', '600 mg + 400 UI', 'Suplementos');

-- ==========================================
-- TABLA: cama (CORREGIDA)
-- ==========================================

select * from servicio
-- Camas en Urgencias
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('U-01', 21, 'Disponible', 'Hidratación pediátrica', 'Urgencias', 'Hidratación'),
('U-02', 21, 'Disponible', 'Urgencias niños', 'Urgencias', 'Urgencias Pediátricas'),
('U-03', 21, 'Ocupada', 'Paciente en evaluación crítica', 'Urgencias', 'Choque'),
('U-04', 21, 'Mantenimiento', 'En limpieza post uso', 'Urgencias', 'Hidratación'),
('U-05', 21, 'Disponible', 'Para pacientes leves', 'Urgencias', 'Observación General'),
('U-06', 21, 'Disponible', 'Urgencias adultos', 'Urgencias', 'Urgencias Adultos'),
('U-07', 21, 'Disponible', 'Curaciones', 'Urgencias', 'Procedimientos');

-- Camas en Medicina Interna (Piso 1)
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('MI-01', 23, 'Disponible', 'Medicina Interna Adultos', 'Hospitalización', 'Medicina Interna'),
('MI-02', 23, 'Disponible', 'Medicina Interna Adultos', 'Hospitalización', 'Medicina Interna'),
('MI-03', 23, 'Ocupada', 'Paciente en observación', 'Hospitalización', 'Medicina Interna'),
('MI-04', 23, 'Disponible', 'Medicina Interna Adultos', 'Hospitalización', 'Medicina Interna'),
('MI-05', 23, 'Mantenimiento', 'Limpieza programada', 'Hospitalización', 'Medicina Interna');

-- Camas en Medicina Interna (Piso 2) - Pacientes críticos
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('MI-06', 23, 'Disponible', 'Medicina Interna - Cuidados intermedios', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)'),
('MI-07', 23, 'Ocupada', 'Paciente en ventilación mecánica', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)'),
('MI-08', 23, 'Disponible', 'Medicina Interna - Cuidados intermedios', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)'),
('MI-09', 23, 'Mantenimiento', 'Mantenimiento preventivo ventilador', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)'),
('MI-10', 23, 'Disponible', 'Medicina Interna - Cuidados intermedios', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');

-- Camas en Cirugía General
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('C-11', 26, 'Disponible', 'Cirugía general', 'Hospitalización', 'Cirugía General'),
('C-12', 26, 'Disponible', 'Cirugía general', 'Hospitalización', 'Cirugía General'),
('C-13', 26, 'Ocupada', 'Paciente postoperatorio', 'Hospitalización', 'Cirugía General'),
('C-14', 26, 'Mantenimiento', 'Reparación de equipamiento', 'Hospitalización', 'Cirugía General'),
('C-15', 26, 'Disponible', 'Cirugía general', 'Hospitalización', 'Cirugía General');

-- Camas en Traumatología y Ortopedia
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('T-16', 22, 'Disponible', 'Traumatología y ortopedia', 'Hospitalización', 'Traumatología y Ortopedia'),
('T-17', 22, 'Disponible', 'Traumatología y ortopedia', 'Hospitalización', 'Traumatología y Ortopedia'),
('T-18', 22, 'Ocupada', 'Fractura en recuperación', 'Hospitalización', 'Traumatología y Ortopedia'),
('T-19', 22, 'Mantenimiento', 'Cama fuera de servicio', 'Hospitalización', 'Traumatología y Ortopedia'),
('T-20', 22, 'Disponible', 'Traumatología y ortopedia', 'Hospitalización', 'Traumatología y Ortopedia');

-- Camas en Pediatría Escolares
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('P-21', 24, 'Disponible', 'Pediatría escolares (5-15 años)', 'Hospitalización', 'Pediatría Escolares'),
('P-22', 24, 'Disponible', 'Pediatría escolares (5-15 años)', 'Hospitalización', 'Pediatría Escolares'),
('P-23', 24, 'Ocupada', 'Niño en recuperación', 'Hospitalización', 'Pediatría Escolares'),
('P-24', 24, 'Disponible', 'Pediatría escolares (5-15 años)', 'Hospitalización', 'Pediatría Escolares'),
('P-25', 24, 'Mantenimiento', 'Revisión técnica programada', 'Hospitalización', 'Pediatría Escolares');

-- Camas en Pediatría Lactantes
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('PL-26', 24, 'Disponible', 'Pediatría lactantes (1 mes - 2 años)', 'Hospitalización', 'Pediatría Lactantes'),
('PL-27', 24, 'Disponible', 'Pediatría lactantes (1 mes - 2 años)', 'Hospitalización', 'Pediatría Lactantes'),
('PL-28', 24, 'Ocupada', 'Lactante con bronquiolitis', 'Hospitalización', 'Pediatría Lactantes');

-- Camas en Neonatología
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('PN-01', 24, 'Ocupada', 'Neonato prematuro', 'Hospitalización', 'Neonatología'),
('PN-02', 24, 'Disponible', 'Neonato a término', 'Hospitalización', 'Neonatología'),
('PN-03', 24, 'Mantenimiento', 'Incubadora en mantenimiento', 'Hospitalización', 'Neonatología'),
('PN-04', 24, 'Disponible', 'Cuidados neonatales', 'Hospitalización', 'Neonatología');

-- Camas en Ginecología y Obstetricia
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('GO-31', 27, 'Disponible', 'Ginecología', 'Hospitalización', 'Ginecología'),
('GO-32', 27, 'Disponible', 'Obstetricia', 'Hospitalización', 'Obstetricia'),
('GO-33', 27, 'Ocupada', 'Paciente post-cesárea', 'Hospitalización', 'Obstetricia'),
('GO-34', 27, 'Disponible', 'Labor de parto', 'Hospitalización', 'Sala de Labor');

-- Camas en Recuperación Post-Anestésica
INSERT INTO cama (numero, id_servicio, estado, descripcion, area, subarea) VALUES
('R-01', 30, 'Disponible', 'Recuperación post-anestésica', 'Recuperación', 'Postoperatorio Inmediato'),
('R-02', 30, 'Disponible', 'Recuperación post-anestésica', 'Recuperación', 'Postoperatorio Inmediato'),
('R-03', 30, 'Ocupada', 'Paciente post-cirugía mayor', 'Recuperación', 'Postoperatorio Inmediato'),
('R-04', 30, 'Mantenimiento', 'Monitor en reparación', 'Recuperación', 'Postoperatorio Inmediato');

-- ==========================================
-- PERSONAL DEL HOSPITAL
-- ==========================================

select * from tipo_sangre
-- PERSONAS BASE PARA PERSONAL MÉDICO Y ADMINISTRATIVO
INSERT INTO persona (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, es_pediatrico) VALUES
-- Directivos y Administradores
('María Elena', 'García', 'López', '1975-03-15', 'F', 'GALM750315MGTPPR01', 17, 'Casado(a)', 'Católica', '4151234567', 'direccion@hospitalsanluis.gob.mx', 'Av. Principal #123, San Luis de la Paz, Gto.', FALSE),
('Roberto', 'Hernández', 'Martínez', '1978-11-22', 'M', 'HEMR781122HGTRNB02', 18, 'Casado(a)', 'Católica', '4151234568', 'admin@hospitalsanluis.gob.mx', 'Calle Hidalgo #456, San Luis de la Paz, Gto.', FALSE),
('Ana Sofía', 'Ramírez', 'González', '1980-07-08', 'F', 'RAGA800708MGTMNL03', 19, 'Soltero(a)', 'Católica', '4151234569', 'sistemas@hospitalsanluis.gob.mx', 'Colonia Centro #789, San Luis de la Paz, Gto.', FALSE),

-- Médicos Especialistas
('Carlos', 'Mendoza', 'Vázquez', '1970-05-12', 'M', 'MEVC700512HGTNDZ04', 21, 'Casado(a)', 'Católica', '4151234570', 'cmendoza@hospitalsanluis.gob.mx', 'Fraccionamiento Los Pinos #234, San Luis de la Paz, Gto.', FALSE),
('Patricia', 'Morales', 'Cruz', '1972-09-18', 'F', 'MOCP720918MGTRLZ05', 20, 'Casado(a)', 'Católica', '4151234571', 'pmorales@hospitalsanluis.gob.mx', 'Colonia Jardines #567, San Luis de la Paz, Gto.', FALSE),
('Fernando', 'Jiménez', 'Soto', '1968-12-03', 'M', 'JISF681203HGTMNT06', 24, 'Casado(a)', 'Católica', '4151234572', 'fjimenez@hospitalsanluis.gob.mx', 'Av. Independencia #890, San Luis de la Paz, Gto.', FALSE),
('Gabriela', 'Torres', 'Medina', '1975-02-25', 'F', 'TOMG750225MGTRRB07', 17, 'Soltero(a)', 'Católica', '4151234573', 'gtorres@hospitalsanluis.gob.mx', 'Calle Morelos #123, San Luis de la Paz, Gto.', FALSE),
('Miguel', 'Castillo', 'Flores', '1973-08-14', 'M', 'CAFM730814HGTSLG08', 19, 'Casado(a)', 'Católica', '4151234574', 'mcastillo@hospitalsanluis.gob.mx', 'Colonia San José #456, San Luis de la Paz, Gto.', FALSE),
('Laura', 'Sánchez', 'Herrera', '1977-06-30', 'F', 'SAHL770630MGTNRR09', 18, 'Casado(a)', 'Católica', '4151234575', 'lsanchez@hospitalsanluis.gob.mx', 'Fracc. Villa del Sol #789, San Luis de la Paz, Gto.', FALSE),
('Antonio', 'Rodríguez', 'Pérez', '1969-04-17', 'M', 'ROPA690417HGTDRT10', 22, 'Casado(a)', 'Católica', '4151234576', 'arodriguez@hospitalsanluis.gob.mx', 'Calle Juárez #234, San Luis de la Paz, Gto.', FALSE),

-- Médicos Residentes y Generales
('Jorge', 'López', 'Martínez', '1985-01-20', 'M', 'LOMJ850120HGTPRT11', 23, 'Soltero(a)', 'Católica', '4151234577', 'jlopez@hospitalsanluis.gob.mx', 'Colonia Nueva #567, San Luis de la Paz, Gto.', FALSE),
('Carmen', 'González', 'Rivera', '1987-03-11', 'F', 'GORC870311MGTNZV12', 20, 'Soltero(a)', 'Católica', '4151234578', 'cgonzalez@hospitalsanluis.gob.mx', 'Av. Revolución #890, San Luis de la Paz, Gto.', FALSE),
('Ricardo', 'Vargas', 'Mendoza', '1986-09-05', 'M', 'VAMR860905HGTRGZ13', 17, 'Soltero(a)', 'Católica', '4151234579', 'rvargas@hospitalsanluis.gob.mx', 'Calle Allende #123, San Luis de la Paz, Gto.', FALSE),
('Mónica', 'Herrera', 'Castro', '1988-11-28', 'F', 'HECM881128MGTRST14', 19, 'Soltero(a)', 'Católica', '4151234580', 'mherrera@hospitalsanluis.gob.mx', 'Colonia Esperanza #456, San Luis de la Paz, Gto.', FALSE),
('Alejandro', 'Ruiz', 'Gómez', '1984-07-16', 'M', 'RUGA840716HGTZGM15', 21, 'Casado(a)', 'Católica', '4151234581', 'aruiz@hospitalsanluis.gob.mx', 'Fracc. Las Flores #789, San Luis de la Paz, Gto.', FALSE);

select * from persona

-- INSERTAR ADMINISTRADORES
INSERT INTO administrador (id_persona, usuario, contrasena, nivel_acceso, activo, foto) VALUES
(31, 'admin.direccion', '$2b$10$8K7hFGtxQ2mNvBcWeLzXZuX.Hv3jKpMnY5tGfRsT6wQcPdLmE9rSu', 1, TRUE, NULL), -- Directora
(32, 'admin.general', '$2b$10$9L8iFHuxyR3nOwCdXfMyAtY.Iv4kLqNoZ6uHgStU7xRdQeLnF0sTv', 2, TRUE, NULL), -- Administrador General
(33, 'admin.sistemas', '$2b$10$0M9jGIvyzS4oRxDeYgNzBuZ.Jw5lMrOpA7vIhTuV8ySeRfMoG1tTw', 3, TRUE, NULL); -- Administrador de Sistemas

-- INSERTAR PERSONAL MÉDICO
INSERT INTO personal_medico (id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto) VALUES
-- Médicos Especialistas Senior
(34, '12345678', 'Medicina Interna', 'Jefe de Servicio', 'Medicina Interna', TRUE, NULL), -- Dr. Carlos Mendoza
(35, '23456789', 'Pediatría', 'Jefe de Servicio', 'Pediatría', TRUE, NULL), -- Dra. Patricia Morales (PEDIATRA)
(36, '34567890', 'Cirugía General', 'Jefe de Servicio', 'Cirugía', TRUE, NULL), -- Dr. Fernando Jiménez
(37, '45678901', 'Ginecología y Obstetricia', 'Médico Especialista', 'Ginecología', TRUE, NULL), -- Dra. Gabriela Torres
(38, '56789012', 'Traumatología y Ortopedia', 'Médico Especialista', 'Traumatología', TRUE, NULL), -- Dr. Miguel Castillo
(39, '67890123', 'Medicina de Urgencias', 'Jefe de Servicio', 'Urgencias', TRUE, NULL), -- Dra. Laura Sánchez
(40, '78901234', 'Anestesiología', 'Médico Especialista', 'Anestesiología', TRUE, NULL), -- Dr. Antonio Rodríguez

-- Médicos Generales y Residentes
(41, '89012345', 'Medicina General', 'Médico General', 'Medicina Interna', TRUE, NULL), -- Dr. Jorge López
(42, '90123456', 'Medicina General', 'Médico General', 'Urgencias', TRUE, NULL), -- Dra. Carmen González
(43, '01234567', 'Medicina General', 'Médico General', 'Consulta Externa', TRUE, NULL), -- Dr. Ricardo Vargas
(44, '12345670', 'Pediatría', 'Médico General', 'Pediatría', TRUE, NULL), -- Dra. Mónica Herrera
(45, '23456781', 'Medicina General', 'Médico General', 'Urgencias', TRUE, NULL); -- Dr. Alejandro Ruiz

-- ==========================================
-- CONFIRMACIÓN DE DATOS INSERTADOS
-- ==========================================

-- Verificar conteos
-- SELECT 'Servicios' as tabla, COUNT(*) as registros FROM servicio
-- UNION ALL
-- SELECT 'Areas Interconsulta', COUNT(*) FROM area_interconsulta
-- UNION ALL  
-- SELECT 'Guías Clínicas', COUNT(*) FROM guia_clinica
-- UNION ALL
-- SELECT 'Estudios Médicos', COUNT(*) FROM estudio_medico
-- UNION ALL
-- SELECT 'Medicamentos', COUNT(*) FROM medicamento
-- UNION ALL
-- SELECT 'Tipos de Sangre', COUNT(*) FROM tipo_sangre
-- UNION ALL
-- SELECT 'Camas', COUNT(*) FROM cama
-- UNION ALL
-- SELECT 'Personal Médico', COUNT(*) FROM personal_medico
-- UNION ALL
-- SELECT 'Administradores', COUNT(*) FROM administrador;