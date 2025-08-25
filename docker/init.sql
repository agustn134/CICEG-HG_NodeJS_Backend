--
-- PostgreSQL database dump
--
\c ciceg_hospital;
-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.validacion_reingreso DROP CONSTRAINT IF EXISTS validacion_reingreso_id_medico_validador_fkey;
ALTER TABLE IF EXISTS ONLY public.validacion_reingreso DROP CONSTRAINT IF EXISTS validacion_reingreso_id_internamiento_fkey;
ALTER TABLE IF EXISTS ONLY public.validacion_reingreso DROP CONSTRAINT IF EXISTS validacion_reingreso_id_expediente_fkey;
ALTER TABLE IF EXISTS ONLY public.vacunas_adicionales DROP CONSTRAINT IF EXISTS vacunas_adicionales_registrado_por_fkey;
ALTER TABLE IF EXISTS ONLY public.vacunas_adicionales DROP CONSTRAINT IF EXISTS vacunas_adicionales_id_vacuna_fkey;
ALTER TABLE IF EXISTS ONLY public.vacunas_adicionales DROP CONSTRAINT IF EXISTS vacunas_adicionales_id_inmunizacion_fkey;
ALTER TABLE IF EXISTS ONLY public.solicitud_estudio DROP CONSTRAINT IF EXISTS solicitud_estudio_id_estudio_fkey;
ALTER TABLE IF EXISTS ONLY public.solicitud_estudio DROP CONSTRAINT IF EXISTS solicitud_estudio_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.signos_vitales DROP CONSTRAINT IF EXISTS signos_vitales_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.registro_transfusion DROP CONSTRAINT IF EXISTS registro_transfusion_id_medico_responsable_fkey;
ALTER TABLE IF EXISTS ONLY public.registro_transfusion DROP CONSTRAINT IF EXISTS registro_transfusion_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.referencia_traslado DROP CONSTRAINT IF EXISTS referencia_traslado_id_guia_diagnostico_fkey;
ALTER TABLE IF EXISTS ONLY public.referencia_traslado DROP CONSTRAINT IF EXISTS referencia_traslado_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.prescripcion_medicamento DROP CONSTRAINT IF EXISTS prescripcion_medicamento_id_medicamento_fkey;
ALTER TABLE IF EXISTS ONLY public.prescripcion_medicamento DROP CONSTRAINT IF EXISTS prescripcion_medicamento_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.personal_medico DROP CONSTRAINT IF EXISTS personal_medico_id_persona_fkey;
ALTER TABLE IF EXISTS ONLY public.persona DROP CONSTRAINT IF EXISTS persona_tipo_sangre_id_fkey;
ALTER TABLE IF EXISTS ONLY public.paciente DROP CONSTRAINT IF EXISTS paciente_id_persona_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_urgencias DROP CONSTRAINT IF EXISTS nota_urgencias_id_guia_diagnostico_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_urgencias DROP CONSTRAINT IF EXISTS nota_urgencias_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_urgencias DROP CONSTRAINT IF EXISTS nota_urgencias_area_interconsulta_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_psicologia DROP CONSTRAINT IF EXISTS nota_psicologia_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_preoperatoria DROP CONSTRAINT IF EXISTS nota_preoperatoria_id_guia_diagnostico_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_preoperatoria DROP CONSTRAINT IF EXISTS nota_preoperatoria_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_preanestesica DROP CONSTRAINT IF EXISTS nota_preanestesica_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_preanestesica DROP CONSTRAINT IF EXISTS nota_preanestesica_id_anestesiologo_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_postoperatoria DROP CONSTRAINT IF EXISTS nota_postoperatoria_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_postoperatoria DROP CONSTRAINT IF EXISTS nota_postoperatoria_id_cirujano_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_postoperatoria DROP CONSTRAINT IF EXISTS nota_postoperatoria_id_ayudante2_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_postoperatoria DROP CONSTRAINT IF EXISTS nota_postoperatoria_id_ayudante1_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_postoperatoria DROP CONSTRAINT IF EXISTS nota_postoperatoria_id_anestesiologo_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_postanestesica DROP CONSTRAINT IF EXISTS nota_postanestesica_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_postanestesica DROP CONSTRAINT IF EXISTS nota_postanestesica_id_anestesiologo_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_nutricion DROP CONSTRAINT IF EXISTS nota_nutricion_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_interconsulta DROP CONSTRAINT IF EXISTS nota_interconsulta_id_medico_solicitante_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_interconsulta DROP CONSTRAINT IF EXISTS nota_interconsulta_id_medico_interconsulta_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_interconsulta DROP CONSTRAINT IF EXISTS nota_interconsulta_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_interconsulta DROP CONSTRAINT IF EXISTS nota_interconsulta_area_interconsulta_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_evolucion DROP CONSTRAINT IF EXISTS nota_evolucion_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_egreso DROP CONSTRAINT IF EXISTS nota_egreso_id_guia_diagnostico_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_egreso DROP CONSTRAINT IF EXISTS nota_egreso_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.internamiento DROP CONSTRAINT IF EXISTS internamiento_id_servicio_fkey;
ALTER TABLE IF EXISTS ONLY public.internamiento DROP CONSTRAINT IF EXISTS internamiento_id_medico_responsable_fkey;
ALTER TABLE IF EXISTS ONLY public.internamiento DROP CONSTRAINT IF EXISTS internamiento_id_expediente_fkey;
ALTER TABLE IF EXISTS ONLY public.internamiento DROP CONSTRAINT IF EXISTS internamiento_id_cama_fkey;
ALTER TABLE IF EXISTS ONLY public.inmunizaciones DROP CONSTRAINT IF EXISTS inmunizaciones_id_historia_clinica_fkey;
ALTER TABLE IF EXISTS ONLY public.historia_clinica DROP CONSTRAINT IF EXISTS historia_clinica_id_guia_diagnostico_fkey;
ALTER TABLE IF EXISTS ONLY public.historia_clinica DROP CONSTRAINT IF EXISTS historia_clinica_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.nota_evolucion DROP CONSTRAINT IF EXISTS fk_nota_evolucion_guia_clinica;
ALTER TABLE IF EXISTS ONLY public.expediente DROP CONSTRAINT IF EXISTS expediente_id_paciente_fkey;
ALTER TABLE IF EXISTS ONLY public.expediente_auditoria DROP CONSTRAINT IF EXISTS expediente_auditoria_id_medico_fkey;
ALTER TABLE IF EXISTS ONLY public.expediente_auditoria DROP CONSTRAINT IF EXISTS expediente_auditoria_id_expediente_fkey;
ALTER TABLE IF EXISTS ONLY public.estado_nutricional_pediatrico DROP CONSTRAINT IF EXISTS estado_nutricional_pediatrico_id_historia_clinica_fkey;
ALTER TABLE IF EXISTS ONLY public.documento_clinico DROP CONSTRAINT IF EXISTS documento_clinico_id_tipo_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.documento_clinico DROP CONSTRAINT IF EXISTS documento_clinico_id_personal_creador_fkey;
ALTER TABLE IF EXISTS ONLY public.documento_clinico DROP CONSTRAINT IF EXISTS documento_clinico_id_internamiento_fkey;
ALTER TABLE IF EXISTS ONLY public.documento_clinico DROP CONSTRAINT IF EXISTS documento_clinico_id_expediente_fkey;
ALTER TABLE IF EXISTS ONLY public.desarrollo_psicomotriz DROP CONSTRAINT IF EXISTS desarrollo_psicomotriz_id_historia_clinica_fkey;
ALTER TABLE IF EXISTS ONLY public.control_acceso_historico DROP CONSTRAINT IF EXISTS control_acceso_historico_id_medico_fkey;
ALTER TABLE IF EXISTS ONLY public.control_acceso_historico DROP CONSTRAINT IF EXISTS control_acceso_historico_id_expediente_fkey;
ALTER TABLE IF EXISTS ONLY public.consentimiento_informado DROP CONSTRAINT IF EXISTS consentimiento_informado_id_medico_informa_fkey;
ALTER TABLE IF EXISTS ONLY public.consentimiento_informado DROP CONSTRAINT IF EXISTS consentimiento_informado_id_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.configuracion_sistema DROP CONSTRAINT IF EXISTS configuracion_sistema_id_modificador_fkey;
ALTER TABLE IF EXISTS ONLY public.cama DROP CONSTRAINT IF EXISTS cama_id_servicio_fkey;
ALTER TABLE IF EXISTS ONLY public.antecedentes_perinatales DROP CONSTRAINT IF EXISTS antecedentes_perinatales_id_historia_clinica_fkey;
ALTER TABLE IF EXISTS ONLY public.antecedentes_heredo_familiares DROP CONSTRAINT IF EXISTS antecedentes_heredo_familiares_id_historia_clinica_fkey;
ALTER TABLE IF EXISTS ONLY public.alertas_sistema DROP CONSTRAINT IF EXISTS alertas_sistema_id_medico_revisor_fkey;
ALTER TABLE IF EXISTS ONLY public.alertas_sistema DROP CONSTRAINT IF EXISTS alertas_sistema_id_medico_fkey;
ALTER TABLE IF EXISTS ONLY public.alertas_sistema DROP CONSTRAINT IF EXISTS alertas_sistema_id_expediente_fkey;
ALTER TABLE IF EXISTS ONLY public.administrador DROP CONSTRAINT IF EXISTS administrador_id_persona_fkey;
DROP TRIGGER IF EXISTS trg_validar_fechas_egreso ON public.internamiento;
DROP TRIGGER IF EXISTS trg_validar_curp ON public.persona;
DROP TRIGGER IF EXISTS trg_limpiar_tokens_auto ON public.password_reset_tokens;
DROP TRIGGER IF EXISTS trg_detectar_cambios_sospechosos ON public.persona;
DROP TRIGGER IF EXISTS trg_auto_llenar_nota_evolucion ON public.nota_evolucion;
DROP INDEX IF EXISTS public.idx_vista_evolucion_expediente;
DROP INDEX IF EXISTS public.idx_vacunas_adicionales_vacuna;
DROP INDEX IF EXISTS public.idx_vacunas_adicionales_inmunizacion;
DROP INDEX IF EXISTS public.idx_vacunas_adicionales_fecha;
DROP INDEX IF EXISTS public.idx_persona_pediatrico;
DROP INDEX IF EXISTS public.idx_persona_nombres;
DROP INDEX IF EXISTS public.idx_perinatales_historia;
DROP INDEX IF EXISTS public.idx_password_reset_user_type;
DROP INDEX IF EXISTS public.idx_password_reset_token;
DROP INDEX IF EXISTS public.idx_password_reset_expires;
DROP INDEX IF EXISTS public.idx_password_reset_email;
DROP INDEX IF EXISTS public.idx_password_reset_active;
DROP INDEX IF EXISTS public.idx_paciente_id;
DROP INDEX IF EXISTS public.idx_nutricional_pediatrico_historia;
DROP INDEX IF EXISTS public.idx_nota_evolucion_fecha;
DROP INDEX IF EXISTS public.idx_nota_evolucion_documento;
DROP INDEX IF EXISTS public.idx_internamiento_servicio_activo;
DROP INDEX IF EXISTS public.idx_internamiento_fecha_ingreso;
DROP INDEX IF EXISTS public.idx_inmunizaciones_historia;
DROP INDEX IF EXISTS public.idx_historia_pediatrica;
DROP INDEX IF EXISTS public.idx_expediente_paciente;
DROP INDEX IF EXISTS public.idx_expediente_numero;
DROP INDEX IF EXISTS public.idx_expediente_administrativo;
DROP INDEX IF EXISTS public.idx_documento_texto;
DROP INDEX IF EXISTS public.idx_documento_expediente;
DROP INDEX IF EXISTS public.idx_documento_creador;
DROP INDEX IF EXISTS public.idx_desarrollo_psicomotriz_historia;
DROP INDEX IF EXISTS public.idx_control_acceso_medico;
DROP INDEX IF EXISTS public.idx_control_acceso_expediente;
DROP INDEX IF EXISTS public.idx_catalogo_vacunas_tipo;
DROP INDEX IF EXISTS public.idx_catalogo_vacunas_nombre;
DROP INDEX IF EXISTS public.idx_cama_estado;
DROP INDEX IF EXISTS public.idx_auditoria_medico;
DROP INDEX IF EXISTS public.idx_auditoria_fecha;
DROP INDEX IF EXISTS public.idx_auditoria_expediente;
DROP INDEX IF EXISTS public.idx_auditoria_accion;
DROP INDEX IF EXISTS public.idx_antecedentes_hf_historia;
DROP INDEX IF EXISTS public.idx_alertas_tipo;
DROP INDEX IF EXISTS public.idx_alertas_expediente;
DROP INDEX IF EXISTS public.idx_alertas_estado;
ALTER TABLE IF EXISTS ONLY public.validacion_reingreso DROP CONSTRAINT IF EXISTS validacion_reingreso_pkey;
ALTER TABLE IF EXISTS ONLY public.vacunas_adicionales DROP CONSTRAINT IF EXISTS vacunas_adicionales_pkey;
ALTER TABLE IF EXISTS ONLY public.tipo_sangre DROP CONSTRAINT IF EXISTS tipo_sangre_pkey;
ALTER TABLE IF EXISTS ONLY public.tipo_sangre DROP CONSTRAINT IF EXISTS tipo_sangre_nombre_key;
ALTER TABLE IF EXISTS ONLY public.tipo_documento DROP CONSTRAINT IF EXISTS tipo_documento_pkey;
ALTER TABLE IF EXISTS ONLY public.tipo_documento DROP CONSTRAINT IF EXISTS tipo_documento_nombre_key;
ALTER TABLE IF EXISTS ONLY public.solicitud_estudio DROP CONSTRAINT IF EXISTS solicitud_estudio_pkey;
ALTER TABLE IF EXISTS ONLY public.signos_vitales DROP CONSTRAINT IF EXISTS signos_vitales_pkey;
ALTER TABLE IF EXISTS ONLY public.servicio DROP CONSTRAINT IF EXISTS servicio_pkey;
ALTER TABLE IF EXISTS ONLY public.servicio DROP CONSTRAINT IF EXISTS servicio_nombre_key;
ALTER TABLE IF EXISTS ONLY public.registro_transfusion DROP CONSTRAINT IF EXISTS registro_transfusion_pkey;
ALTER TABLE IF EXISTS ONLY public.referencia_traslado DROP CONSTRAINT IF EXISTS referencia_traslado_pkey;
ALTER TABLE IF EXISTS ONLY public.prescripcion_medicamento DROP CONSTRAINT IF EXISTS prescripcion_medicamento_pkey;
ALTER TABLE IF EXISTS ONLY public.personal_medico DROP CONSTRAINT IF EXISTS personal_medico_usuario_key;
ALTER TABLE IF EXISTS ONLY public.personal_medico DROP CONSTRAINT IF EXISTS personal_medico_pkey;
ALTER TABLE IF EXISTS ONLY public.personal_medico DROP CONSTRAINT IF EXISTS personal_medico_numero_cedula_key;
ALTER TABLE IF EXISTS ONLY public.persona DROP CONSTRAINT IF EXISTS persona_pkey;
ALTER TABLE IF EXISTS ONLY public.persona DROP CONSTRAINT IF EXISTS persona_curp_key;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_token_key;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.paciente DROP CONSTRAINT IF EXISTS paciente_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_urgencias DROP CONSTRAINT IF EXISTS nota_urgencias_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_psicologia DROP CONSTRAINT IF EXISTS nota_psicologia_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_preoperatoria DROP CONSTRAINT IF EXISTS nota_preoperatoria_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_preanestesica DROP CONSTRAINT IF EXISTS nota_preanestesica_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_postoperatoria DROP CONSTRAINT IF EXISTS nota_postoperatoria_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_postanestesica DROP CONSTRAINT IF EXISTS nota_postanestesica_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_nutricion DROP CONSTRAINT IF EXISTS nota_nutricion_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_interconsulta DROP CONSTRAINT IF EXISTS nota_interconsulta_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_evolucion DROP CONSTRAINT IF EXISTS nota_evolucion_pkey;
ALTER TABLE IF EXISTS ONLY public.nota_egreso DROP CONSTRAINT IF EXISTS nota_egreso_pkey;
ALTER TABLE IF EXISTS ONLY public.medicamento DROP CONSTRAINT IF EXISTS medicamento_pkey;
ALTER TABLE IF EXISTS ONLY public.medicamento DROP CONSTRAINT IF EXISTS medicamento_codigo_key;
ALTER TABLE IF EXISTS ONLY public.internamiento DROP CONSTRAINT IF EXISTS internamiento_pkey;
ALTER TABLE IF EXISTS ONLY public.inmunizaciones DROP CONSTRAINT IF EXISTS inmunizaciones_pkey;
ALTER TABLE IF EXISTS ONLY public.historia_clinica DROP CONSTRAINT IF EXISTS historia_clinica_pkey;
ALTER TABLE IF EXISTS ONLY public.guia_clinica DROP CONSTRAINT IF EXISTS guia_clinica_pkey;
ALTER TABLE IF EXISTS ONLY public.expediente DROP CONSTRAINT IF EXISTS expediente_pkey;
ALTER TABLE IF EXISTS ONLY public.expediente DROP CONSTRAINT IF EXISTS expediente_numero_expediente_key;
ALTER TABLE IF EXISTS ONLY public.expediente_auditoria DROP CONSTRAINT IF EXISTS expediente_auditoria_pkey;
ALTER TABLE IF EXISTS ONLY public.estudio_medico DROP CONSTRAINT IF EXISTS estudio_medico_pkey;
ALTER TABLE IF EXISTS ONLY public.estudio_medico DROP CONSTRAINT IF EXISTS estudio_medico_clave_key;
ALTER TABLE IF EXISTS ONLY public.estado_nutricional_pediatrico DROP CONSTRAINT IF EXISTS estado_nutricional_pediatrico_pkey;
ALTER TABLE IF EXISTS ONLY public.documento_clinico DROP CONSTRAINT IF EXISTS documento_clinico_pkey;
ALTER TABLE IF EXISTS ONLY public.desarrollo_psicomotriz DROP CONSTRAINT IF EXISTS desarrollo_psicomotriz_pkey;
ALTER TABLE IF EXISTS ONLY public.control_acceso_historico DROP CONSTRAINT IF EXISTS control_acceso_historico_pkey;
ALTER TABLE IF EXISTS ONLY public.consentimiento_informado DROP CONSTRAINT IF EXISTS consentimiento_informado_pkey;
ALTER TABLE IF EXISTS ONLY public.configuracion_sistema DROP CONSTRAINT IF EXISTS configuracion_sistema_pkey;
ALTER TABLE IF EXISTS ONLY public.configuracion_sistema DROP CONSTRAINT IF EXISTS configuracion_sistema_parametro_key;
ALTER TABLE IF EXISTS ONLY public.catalogo_vacunas DROP CONSTRAINT IF EXISTS catalogo_vacunas_pkey;
ALTER TABLE IF EXISTS ONLY public.catalogo_vacunas DROP CONSTRAINT IF EXISTS catalogo_vacunas_nombre_vacuna_key;
ALTER TABLE IF EXISTS ONLY public.cama DROP CONSTRAINT IF EXISTS cama_pkey;
ALTER TABLE IF EXISTS ONLY public.area_interconsulta DROP CONSTRAINT IF EXISTS area_interconsulta_pkey;
ALTER TABLE IF EXISTS ONLY public.area_interconsulta DROP CONSTRAINT IF EXISTS area_interconsulta_nombre_key;
ALTER TABLE IF EXISTS ONLY public.antecedentes_perinatales DROP CONSTRAINT IF EXISTS antecedentes_perinatales_pkey;
ALTER TABLE IF EXISTS ONLY public.antecedentes_heredo_familiares DROP CONSTRAINT IF EXISTS antecedentes_heredo_familiares_pkey;
ALTER TABLE IF EXISTS ONLY public.alertas_sistema DROP CONSTRAINT IF EXISTS alertas_sistema_pkey;
ALTER TABLE IF EXISTS ONLY public.administrador DROP CONSTRAINT IF EXISTS administrador_usuario_key;
ALTER TABLE IF EXISTS ONLY public.administrador DROP CONSTRAINT IF EXISTS administrador_pkey;
ALTER TABLE IF EXISTS public.validacion_reingreso ALTER COLUMN id_validacion DROP DEFAULT;
ALTER TABLE IF EXISTS public.vacunas_adicionales ALTER COLUMN id_vacuna_adicional DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_sangre ALTER COLUMN id_tipo_sangre DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_documento ALTER COLUMN id_tipo_documento DROP DEFAULT;
ALTER TABLE IF EXISTS public.solicitud_estudio ALTER COLUMN id_solicitud DROP DEFAULT;
ALTER TABLE IF EXISTS public.signos_vitales ALTER COLUMN id_signos_vitales DROP DEFAULT;
ALTER TABLE IF EXISTS public.servicio ALTER COLUMN id_servicio DROP DEFAULT;
ALTER TABLE IF EXISTS public.registro_transfusion ALTER COLUMN id_transfusion DROP DEFAULT;
ALTER TABLE IF EXISTS public.referencia_traslado ALTER COLUMN id_referencia DROP DEFAULT;
ALTER TABLE IF EXISTS public.prescripcion_medicamento ALTER COLUMN id_prescripcion DROP DEFAULT;
ALTER TABLE IF EXISTS public.personal_medico ALTER COLUMN id_personal_medico DROP DEFAULT;
ALTER TABLE IF EXISTS public.persona ALTER COLUMN id_persona DROP DEFAULT;
ALTER TABLE IF EXISTS public.password_reset_tokens ALTER COLUMN id_reset_token DROP DEFAULT;
ALTER TABLE IF EXISTS public.paciente ALTER COLUMN id_paciente DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_urgencias ALTER COLUMN id_nota_urgencias DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_psicologia ALTER COLUMN id_nota_psicologia DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_preoperatoria ALTER COLUMN id_nota_preoperatoria DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_preanestesica ALTER COLUMN id_nota_preanestesica DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_postoperatoria ALTER COLUMN id_nota_postoperatoria DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_postanestesica ALTER COLUMN id_nota_postanestesica DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_nutricion ALTER COLUMN id_nota_nutricion DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_interconsulta ALTER COLUMN id_nota_interconsulta DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_evolucion ALTER COLUMN id_nota_evolucion DROP DEFAULT;
ALTER TABLE IF EXISTS public.nota_egreso ALTER COLUMN id_nota_egreso DROP DEFAULT;
ALTER TABLE IF EXISTS public.medicamento ALTER COLUMN id_medicamento DROP DEFAULT;
ALTER TABLE IF EXISTS public.internamiento ALTER COLUMN id_internamiento DROP DEFAULT;
ALTER TABLE IF EXISTS public.inmunizaciones ALTER COLUMN id_inmunizacion DROP DEFAULT;
ALTER TABLE IF EXISTS public.historia_clinica ALTER COLUMN id_historia_clinica DROP DEFAULT;
ALTER TABLE IF EXISTS public.guia_clinica ALTER COLUMN id_guia_diagnostico DROP DEFAULT;
ALTER TABLE IF EXISTS public.expediente_auditoria ALTER COLUMN id_auditoria DROP DEFAULT;
ALTER TABLE IF EXISTS public.expediente ALTER COLUMN id_expediente DROP DEFAULT;
ALTER TABLE IF EXISTS public.estudio_medico ALTER COLUMN id_estudio DROP DEFAULT;
ALTER TABLE IF EXISTS public.estado_nutricional_pediatrico ALTER COLUMN id_nutricional DROP DEFAULT;
ALTER TABLE IF EXISTS public.documento_clinico ALTER COLUMN id_documento DROP DEFAULT;
ALTER TABLE IF EXISTS public.desarrollo_psicomotriz ALTER COLUMN id_desarrollo DROP DEFAULT;
ALTER TABLE IF EXISTS public.control_acceso_historico ALTER COLUMN id_control DROP DEFAULT;
ALTER TABLE IF EXISTS public.consentimiento_informado ALTER COLUMN id_consentimiento DROP DEFAULT;
ALTER TABLE IF EXISTS public.configuracion_sistema ALTER COLUMN id_config DROP DEFAULT;
ALTER TABLE IF EXISTS public.catalogo_vacunas ALTER COLUMN id_vacuna DROP DEFAULT;
ALTER TABLE IF EXISTS public.cama ALTER COLUMN id_cama DROP DEFAULT;
ALTER TABLE IF EXISTS public.area_interconsulta ALTER COLUMN id_area_interconsulta DROP DEFAULT;
ALTER TABLE IF EXISTS public.antecedentes_perinatales ALTER COLUMN id_perinatales DROP DEFAULT;
ALTER TABLE IF EXISTS public.antecedentes_heredo_familiares ALTER COLUMN id_antecedentes_hf DROP DEFAULT;
ALTER TABLE IF EXISTS public.alertas_sistema ALTER COLUMN id_alerta DROP DEFAULT;
ALTER TABLE IF EXISTS public.administrador ALTER COLUMN id_administrador DROP DEFAULT;
DROP VIEW IF EXISTS public.vista_tokens_activos;
DROP VIEW IF EXISTS public.vista_nota_evolucion_completa;
DROP SEQUENCE IF EXISTS public.validacion_reingreso_id_validacion_seq;
DROP TABLE IF EXISTS public.validacion_reingreso;
DROP SEQUENCE IF EXISTS public.vacunas_adicionales_id_vacuna_adicional_seq;
DROP SEQUENCE IF EXISTS public.tipo_sangre_id_tipo_sangre_seq;
DROP TABLE IF EXISTS public.tipo_sangre;
DROP SEQUENCE IF EXISTS public.tipo_documento_id_tipo_documento_seq;
DROP SEQUENCE IF EXISTS public.solicitud_estudio_id_solicitud_seq;
DROP TABLE IF EXISTS public.solicitud_estudio;
DROP SEQUENCE IF EXISTS public.signos_vitales_id_signos_vitales_seq;
DROP TABLE IF EXISTS public.signos_vitales;
DROP SEQUENCE IF EXISTS public.servicio_id_servicio_seq;
DROP VIEW IF EXISTS public.resumen_camas_servicio;
DROP SEQUENCE IF EXISTS public.registro_transfusion_id_transfusion_seq;
DROP TABLE IF EXISTS public.registro_transfusion;
DROP SEQUENCE IF EXISTS public.referencia_traslado_id_referencia_seq;
DROP TABLE IF EXISTS public.referencia_traslado;
DROP SEQUENCE IF EXISTS public.prescripcion_medicamento_id_prescripcion_seq;
DROP TABLE IF EXISTS public.prescripcion_medicamento;
DROP SEQUENCE IF EXISTS public.personal_medico_id_personal_medico_seq;
DROP SEQUENCE IF EXISTS public.persona_id_persona_seq;
DROP SEQUENCE IF EXISTS public.password_reset_tokens_id_reset_token_seq;
DROP TABLE IF EXISTS public.password_reset_tokens;
DROP VIEW IF EXISTS public.pacientes_pediatricos_activos;
DROP SEQUENCE IF EXISTS public.paciente_id_paciente_seq;
DROP SEQUENCE IF EXISTS public.nota_urgencias_id_nota_urgencias_seq;
DROP TABLE IF EXISTS public.nota_urgencias;
DROP SEQUENCE IF EXISTS public.nota_psicologia_id_nota_psicologia_seq;
DROP TABLE IF EXISTS public.nota_psicologia;
DROP SEQUENCE IF EXISTS public.nota_preoperatoria_id_nota_preoperatoria_seq;
DROP TABLE IF EXISTS public.nota_preoperatoria;
DROP SEQUENCE IF EXISTS public.nota_preanestesica_id_nota_preanestesica_seq;
DROP TABLE IF EXISTS public.nota_preanestesica;
DROP SEQUENCE IF EXISTS public.nota_postoperatoria_id_nota_postoperatoria_seq;
DROP TABLE IF EXISTS public.nota_postoperatoria;
DROP SEQUENCE IF EXISTS public.nota_postanestesica_id_nota_postanestesica_seq;
DROP TABLE IF EXISTS public.nota_postanestesica;
DROP SEQUENCE IF EXISTS public.nota_nutricion_id_nota_nutricion_seq;
DROP TABLE IF EXISTS public.nota_nutricion;
DROP SEQUENCE IF EXISTS public.nota_interconsulta_id_nota_interconsulta_seq;
DROP TABLE IF EXISTS public.nota_interconsulta;
DROP SEQUENCE IF EXISTS public.nota_evolucion_id_nota_evolucion_seq;
DROP TABLE IF EXISTS public.nota_evolucion;
DROP SEQUENCE IF EXISTS public.nota_egreso_id_nota_egreso_seq;
DROP TABLE IF EXISTS public.nota_egreso;
DROP SEQUENCE IF EXISTS public.medicamento_id_medicamento_seq;
DROP TABLE IF EXISTS public.medicamento;
DROP SEQUENCE IF EXISTS public.internamiento_id_internamiento_seq;
DROP SEQUENCE IF EXISTS public.inmunizaciones_id_inmunizacion_seq;
DROP SEQUENCE IF EXISTS public.historia_clinica_id_historia_clinica_seq;
DROP SEQUENCE IF EXISTS public.guia_clinica_id_guia_diagnostico_seq;
DROP TABLE IF EXISTS public.guia_clinica;
DROP VIEW IF EXISTS public.expedientes_con_alertas;
DROP SEQUENCE IF EXISTS public.expediente_id_expediente_seq;
DROP SEQUENCE IF EXISTS public.expediente_auditoria_id_auditoria_seq;
DROP SEQUENCE IF EXISTS public.estudio_medico_id_estudio_seq;
DROP TABLE IF EXISTS public.estudio_medico;
DROP SEQUENCE IF EXISTS public.estado_nutricional_pediatrico_id_nutricional_seq;
DROP TABLE IF EXISTS public.estado_nutricional_pediatrico;
DROP VIEW IF EXISTS public.esquema_vacunacion_completo;
DROP VIEW IF EXISTS public.esquema_vacunacion;
DROP VIEW IF EXISTS public.expediente_pediatrico_completo;
DROP TABLE IF EXISTS public.tipo_documento;
DROP SEQUENCE IF EXISTS public.documento_clinico_id_documento_seq;
DROP VIEW IF EXISTS public.detalle_vacunas_adicionales;
DROP TABLE IF EXISTS public.vacunas_adicionales;
DROP TABLE IF EXISTS public.paciente;
DROP TABLE IF EXISTS public.inmunizaciones;
DROP TABLE IF EXISTS public.historia_clinica;
DROP SEQUENCE IF EXISTS public.desarrollo_psicomotriz_id_desarrollo_seq;
DROP TABLE IF EXISTS public.desarrollo_psicomotriz;
DROP VIEW IF EXISTS public.dashboard_general;
DROP TABLE IF EXISTS public.servicio;
DROP TABLE IF EXISTS public.internamiento;
DROP TABLE IF EXISTS public.expediente;
DROP SEQUENCE IF EXISTS public.control_acceso_historico_id_control_seq;
DROP TABLE IF EXISTS public.control_acceso_historico;
DROP SEQUENCE IF EXISTS public.consentimiento_informado_id_consentimiento_seq;
DROP TABLE IF EXISTS public.consentimiento_informado;
DROP SEQUENCE IF EXISTS public.configuracion_sistema_id_config_seq;
DROP TABLE IF EXISTS public.configuracion_sistema;
DROP SEQUENCE IF EXISTS public.catalogo_vacunas_id_vacuna_seq;
DROP TABLE IF EXISTS public.catalogo_vacunas;
DROP SEQUENCE IF EXISTS public.cama_id_cama_seq;
DROP TABLE IF EXISTS public.cama;
DROP SEQUENCE IF EXISTS public.area_interconsulta_id_area_interconsulta_seq;
DROP TABLE IF EXISTS public.area_interconsulta;
DROP SEQUENCE IF EXISTS public.antecedentes_perinatales_id_perinatales_seq;
DROP TABLE IF EXISTS public.antecedentes_perinatales;
DROP SEQUENCE IF EXISTS public.antecedentes_heredo_familiares_id_antecedentes_hf_seq;
DROP TABLE IF EXISTS public.antecedentes_heredo_familiares;
DROP SEQUENCE IF EXISTS public.alertas_sistema_id_alerta_seq;
DROP TABLE IF EXISTS public.alertas_sistema;
DROP SEQUENCE IF EXISTS public.administrador_id_administrador_seq;
DROP TABLE IF EXISTS public.administrador;
DROP VIEW IF EXISTS public.actividad_medicos;
DROP TABLE IF EXISTS public.expediente_auditoria;
DROP VIEW IF EXISTS public.actividad_medica_reciente;
DROP TABLE IF EXISTS public.personal_medico;
DROP TABLE IF EXISTS public.persona;
DROP TABLE IF EXISTS public.documento_clinico;
DROP FUNCTION IF EXISTS public.validar_token_reset(p_token character varying);
DROP FUNCTION IF EXISTS public.validar_reingreso_paciente(p_id_expediente integer, p_id_medico integer);
DROP FUNCTION IF EXISTS public.validar_fechas_egreso();
DROP FUNCTION IF EXISTS public.validar_desarrollo_psicomotriz(p_edad_meses integer, p_sostuvo_cabeza integer, p_se_sento integer, p_camino integer);
DROP FUNCTION IF EXISTS public.validar_curp();
DROP FUNCTION IF EXISTS public.trigger_limpiar_tokens();
DROP FUNCTION IF EXISTS public.registrar_auditoria(p_id_expediente integer, p_id_medico integer, p_accion text, p_datos_anteriores jsonb, p_datos_nuevos jsonb, p_observaciones text);
DROP FUNCTION IF EXISTS public.obtener_signos_vitales_recientes(p_id_expediente integer);
DROP FUNCTION IF EXISTS public.obtener_historial_vacunas_completo(p_id_inmunizacion integer);
DROP FUNCTION IF EXISTS public.limpiar_tokens_expirados();
DROP FUNCTION IF EXISTS public.estadisticas_servicio(p_id_servicio integer);
DROP FUNCTION IF EXISTS public.edad_total_meses(fecha_nacimiento date);
DROP FUNCTION IF EXISTS public.edad_en_anos(fecha_nacimiento date);
DROP FUNCTION IF EXISTS public.detectar_cambios_sospechosos();
DROP FUNCTION IF EXISTS public.crear_nota_evolucion_con_plantilla(p_id_expediente integer, p_id_medico integer, p_sintomas_signos text, p_habitus_exterior text, p_estado_nutricional text, p_estudios_lab text, p_evolucion_analisis text, p_diagnosticos text, p_plan_tratamiento text, p_pronostico text, p_interconsultas text, p_indicaciones text);
DROP FUNCTION IF EXISTS public.calcular_edad_meses(fecha_nacimiento date);
DROP FUNCTION IF EXISTS public.calcular_edad_actual(fecha_nacimiento date);
DROP FUNCTION IF EXISTS public.calcular_dias_hospitalizacion(p_id_expediente integer);
DROP FUNCTION IF EXISTS public.buscar_pacientes(p_nombre text, p_apellido text, p_curp text, p_numero_expediente text, p_solo_pediatricos boolean);
DROP FUNCTION IF EXISTS public.auto_llenar_nota_evolucion();
DROP FUNCTION IF EXISTS public.agregar_vacuna_adicional(p_id_inmunizacion integer, p_nombre_vacuna text, p_fecha_aplicacion date, p_dosis_numero integer, p_lote_vacuna text, p_laboratorio text, p_via_administracion text, p_sitio_aplicacion text, p_aplicada_por text, p_institucion text, p_reacciones text, p_observaciones text, p_registrado_por integer);
DROP TYPE IF EXISTS public.tipo_parto_enum;
DROP TYPE IF EXISTS public.tipo_egreso_enum;
DROP TYPE IF EXISTS public.tipo_alimentacion_enum;
DROP TYPE IF EXISTS public.sexo_enum;
DROP TYPE IF EXISTS public.programa_social_enum;
DROP TYPE IF EXISTS public.estado_documento_enum;
DROP TYPE IF EXISTS public.estado_civil_enum;
DROP TYPE IF EXISTS public.estado_cama_enum;
DROP TYPE IF EXISTS public.derechohabiente_enum;
DROP EXTENSION IF EXISTS pg_trgm;
--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: derechohabiente_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.derechohabiente_enum AS ENUM (
    'IMSS',
    'ISSSTE',
    'Ninguno',
    'Otro'
);


ALTER TYPE public.derechohabiente_enum OWNER TO postgres;

--
-- Name: estado_cama_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_cama_enum AS ENUM (
    'Disponible',
    'Ocupada',
    'Mantenimiento',
    'Reservada',
    'Contaminada'
);


ALTER TYPE public.estado_cama_enum OWNER TO postgres;

--
-- Name: estado_civil_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_civil_enum AS ENUM (
    'Soltero(a)',
    'Casado(a)',
    'Divorciado(a)',
    'Viudo(a)',
    'Unión libre',
    'Otro'
);


ALTER TYPE public.estado_civil_enum OWNER TO postgres;

--
-- Name: estado_documento_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_documento_enum AS ENUM (
    'Activo',
    'Cancelado',
    'Anulado',
    'Borrador'
);


ALTER TYPE public.estado_documento_enum OWNER TO postgres;

--
-- Name: programa_social_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.programa_social_enum AS ENUM (
    'Ninguno',
    'Oportunidades',
    'PROSPERA',
    'Otro'
);


ALTER TYPE public.programa_social_enum OWNER TO postgres;

--
-- Name: sexo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sexo_enum AS ENUM (
    'M',
    'F',
    'O'
);


ALTER TYPE public.sexo_enum OWNER TO postgres;

--
-- Name: tipo_alimentacion_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_alimentacion_enum AS ENUM (
    'Seno materno exclusivo',
    'Formula',
    'Mixta',
    'Complementaria'
);


ALTER TYPE public.tipo_alimentacion_enum OWNER TO postgres;

--
-- Name: tipo_egreso_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_egreso_enum AS ENUM (
    'Alta voluntaria',
    'Mejoría',
    'Referencia',
    'Defunción',
    'Máximo beneficio'
);


ALTER TYPE public.tipo_egreso_enum OWNER TO postgres;

--
-- Name: tipo_parto_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_parto_enum AS ENUM (
    'Vaginal',
    'Cesarea'
);


ALTER TYPE public.tipo_parto_enum OWNER TO postgres;

--
-- Name: agregar_vacuna_adicional(integer, text, date, integer, text, text, text, text, text, text, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.agregar_vacuna_adicional(p_id_inmunizacion integer, p_nombre_vacuna text, p_fecha_aplicacion date, p_dosis_numero integer DEFAULT 1, p_lote_vacuna text DEFAULT NULL::text, p_laboratorio text DEFAULT NULL::text, p_via_administracion text DEFAULT 'Intramuscular'::text, p_sitio_aplicacion text DEFAULT NULL::text, p_aplicada_por text DEFAULT NULL::text, p_institucion text DEFAULT 'Hospital General San Luis de la Paz'::text, p_reacciones text DEFAULT NULL::text, p_observaciones text DEFAULT NULL::text, p_registrado_por integer DEFAULT NULL::integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_vacuna INT;
  v_nueva_vacuna_adicional INT;
BEGIN
  -- Buscar si la vacuna existe en el catálogo
  SELECT id_vacuna INTO v_id_vacuna
  FROM catalogo_vacunas
  WHERE UPPER(nombre_vacuna) = UPPER(p_nombre_vacuna)
    AND activa = TRUE;
  
  -- Insertar la vacuna adicional
  INSERT INTO vacunas_adicionales (
    id_inmunizacion,
    id_vacuna,
    nombre_vacuna_libre,
    fecha_aplicacion,
    dosis_numero,
    lote_vacuna,
    laboratorio,
    via_administracion,
    sitio_aplicacion,
    aplicada_por,
    institucion_aplicacion,
    reacciones_adversas,
    observaciones,
    registrado_por
  ) VALUES (
    p_id_inmunizacion,
    v_id_vacuna, -- NULL si no está en catálogo
    CASE WHEN v_id_vacuna IS NULL THEN p_nombre_vacuna ELSE NULL END,
    p_fecha_aplicacion,
    p_dosis_numero,
    p_lote_vacuna,
    p_laboratorio,
    p_via_administracion,
    p_sitio_aplicacion,
    p_aplicada_por,
    p_institucion,
    p_reacciones,
    p_observaciones,
    p_registrado_por
  ) RETURNING id_vacuna_adicional INTO v_nueva_vacuna_adicional;
  
  RETURN v_nueva_vacuna_adicional;
END;
$$;


ALTER FUNCTION public.agregar_vacuna_adicional(p_id_inmunizacion integer, p_nombre_vacuna text, p_fecha_aplicacion date, p_dosis_numero integer, p_lote_vacuna text, p_laboratorio text, p_via_administracion text, p_sitio_aplicacion text, p_aplicada_por text, p_institucion text, p_reacciones text, p_observaciones text, p_registrado_por integer) OWNER TO postgres;

--
-- Name: FUNCTION agregar_vacuna_adicional(p_id_inmunizacion integer, p_nombre_vacuna text, p_fecha_aplicacion date, p_dosis_numero integer, p_lote_vacuna text, p_laboratorio text, p_via_administracion text, p_sitio_aplicacion text, p_aplicada_por text, p_institucion text, p_reacciones text, p_observaciones text, p_registrado_por integer); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.agregar_vacuna_adicional(p_id_inmunizacion integer, p_nombre_vacuna text, p_fecha_aplicacion date, p_dosis_numero integer, p_lote_vacuna text, p_laboratorio text, p_via_administracion text, p_sitio_aplicacion text, p_aplicada_por text, p_institucion text, p_reacciones text, p_observaciones text, p_registrado_por integer) IS 'Función para agregar cualquier vacuna adicional al esquema básico';


--
-- Name: auto_llenar_nota_evolucion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_llenar_nota_evolucion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_expediente INT;
  v_fecha_ingreso DATE;
BEGIN
  -- Obtener el id_expediente del documento
  SELECT dc.id_expediente INTO v_id_expediente
  FROM documento_clinico dc
  WHERE dc.id_documento = NEW.id_documento;
  
  -- Auto-calcular días de hospitalización
  NEW.dias_hospitalizacion := calcular_dias_hospitalizacion(v_id_expediente);
  
  -- Obtener fecha del último ingreso
  SELECT DATE(i.fecha_ingreso) INTO v_fecha_ingreso
  FROM internamiento i
  WHERE i.id_expediente = v_id_expediente
    AND i.fecha_egreso IS NULL
  ORDER BY i.fecha_ingreso DESC
  LIMIT 1;
  
  -- Si no hay ingreso activo, tomar el más reciente
  IF v_fecha_ingreso IS NULL THEN
    SELECT DATE(i.fecha_ingreso) INTO v_fecha_ingreso
    FROM internamiento i
    WHERE i.id_expediente = v_id_expediente
    ORDER BY i.fecha_ingreso DESC
    LIMIT 1;
  END IF;
  
  NEW.fecha_ultimo_ingreso := v_fecha_ingreso;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_llenar_nota_evolucion() OWNER TO postgres;

--
-- Name: buscar_pacientes(text, text, text, text, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.buscar_pacientes(p_nombre text DEFAULT NULL::text, p_apellido text DEFAULT NULL::text, p_curp text DEFAULT NULL::text, p_numero_expediente text DEFAULT NULL::text, p_solo_pediatricos boolean DEFAULT false) RETURNS TABLE(id_expediente integer, numero_expediente text, nombre_completo text, fecha_nacimiento date, edad_anos integer, sexo public.sexo_enum, curp text, estado_expediente text, es_pediatrico boolean)
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.buscar_pacientes(p_nombre text, p_apellido text, p_curp text, p_numero_expediente text, p_solo_pediatricos boolean) OWNER TO postgres;

--
-- Name: FUNCTION buscar_pacientes(p_nombre text, p_apellido text, p_curp text, p_numero_expediente text, p_solo_pediatricos boolean); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.buscar_pacientes(p_nombre text, p_apellido text, p_curp text, p_numero_expediente text, p_solo_pediatricos boolean) IS 'Función de búsqueda avanzada de pacientes';


--
-- Name: calcular_dias_hospitalizacion(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calcular_dias_hospitalizacion(p_id_expediente integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
  fecha_ingreso_actual DATE;
  dias_calculados INT;
BEGIN
  -- Obtener la fecha de ingreso del internamiento activo (sin fecha de egreso)
  SELECT DATE(i.fecha_ingreso) INTO fecha_ingreso_actual
  FROM internamiento i
  WHERE i.id_expediente = p_id_expediente 
    AND i.fecha_egreso IS NULL
  ORDER BY i.fecha_ingreso DESC
  LIMIT 1;
  
  -- Si no hay internamiento activo, buscar el más reciente
  IF fecha_ingreso_actual IS NULL THEN
    SELECT DATE(i.fecha_ingreso) INTO fecha_ingreso_actual
    FROM internamiento i
    WHERE i.id_expediente = p_id_expediente
    ORDER BY i.fecha_ingreso DESC
    LIMIT 1;
  END IF;
  
  -- Calcular días desde el ingreso hasta hoy
  IF fecha_ingreso_actual IS NOT NULL THEN
    dias_calculados := CURRENT_DATE - fecha_ingreso_actual + 1;
  ELSE
    dias_calculados := 0;
  END IF;
  
  RETURN dias_calculados;
END;
$$;


ALTER FUNCTION public.calcular_dias_hospitalizacion(p_id_expediente integer) OWNER TO postgres;

--
-- Name: calcular_edad_actual(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calcular_edad_actual(fecha_nacimiento date) RETURNS TABLE("años" integer, meses integer, dias integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY SELECT 
    EXTRACT(YEAR FROM AGE(fecha_nacimiento))::INT,
    EXTRACT(MONTH FROM AGE(fecha_nacimiento))::INT,
    EXTRACT(DAY FROM AGE(fecha_nacimiento))::INT;
END;
$$;


ALTER FUNCTION public.calcular_edad_actual(fecha_nacimiento date) OWNER TO postgres;

--
-- Name: FUNCTION calcular_edad_actual(fecha_nacimiento date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.calcular_edad_actual(fecha_nacimiento date) IS 'Calcula edad detallada (años, meses, días) a partir de fecha de nacimiento';


--
-- Name: calcular_edad_meses(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calcular_edad_meses(fecha_nacimiento date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) * 12 + 
         EXTRACT(MONTH FROM AGE(fecha_nacimiento));
END;
$$;


ALTER FUNCTION public.calcular_edad_meses(fecha_nacimiento date) OWNER TO postgres;

--
-- Name: crear_nota_evolucion_con_plantilla(integer, integer, text, text, text, text, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.crear_nota_evolucion_con_plantilla(p_id_expediente integer, p_id_medico integer, p_sintomas_signos text, p_habitus_exterior text, p_estado_nutricional text, p_estudios_lab text, p_evolucion_analisis text, p_diagnosticos text, p_plan_tratamiento text, p_pronostico text, p_interconsultas text DEFAULT NULL::text, p_indicaciones text DEFAULT NULL::text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_documento INT;
  v_id_tipo_documento INT;
  v_id_internamiento INT;
  v_nueva_nota INT;
BEGIN
  -- Obtener ID del tipo de documento "Nota de Evolución"
  SELECT id_tipo_documento INTO v_id_tipo_documento
  FROM tipo_documento 
  WHERE nombre = 'Nota de Evolución';
  
  -- Obtener internamiento activo
  SELECT id_internamiento INTO v_id_internamiento
  FROM internamiento
  WHERE id_expediente = p_id_expediente AND fecha_egreso IS NULL
  ORDER BY fecha_ingreso DESC
  LIMIT 1;
  
  -- Crear documento clínico
  INSERT INTO documento_clinico (
    id_expediente, 
    id_internamiento, 
    id_tipo_documento, 
    id_personal_creador,
    fecha_elaboracion
  ) VALUES (
    p_id_expediente, 
    v_id_internamiento, 
    v_id_tipo_documento, 
    p_id_medico,
    CURRENT_TIMESTAMP
  ) RETURNING id_documento INTO v_id_documento;
  
  -- Crear nota de evolución
  INSERT INTO nota_evolucion (
    id_documento,
    sintomas_signos,
    habitus_exterior,
    estado_nutricional,
    estudios_laboratorio_gabinete,
    evolucion_analisis,
    diagnosticos,
    plan_estudios_tratamiento,
    interconsultas,
    pronostico,
    indicaciones_medicas
  ) VALUES (
    v_id_documento,
    p_sintomas_signos,
    p_habitus_exterior,
    p_estado_nutricional,
    p_estudios_lab,
    p_evolucion_analisis,
    p_diagnosticos,
    p_plan_tratamiento,
    COALESCE(p_interconsultas, 'No se solicitaron interconsultas en esta evolución'),
    p_pronostico,
    p_indicaciones
  ) RETURNING id_nota_evolucion INTO v_nueva_nota;
  
  RETURN v_nueva_nota;
END;
$$;


ALTER FUNCTION public.crear_nota_evolucion_con_plantilla(p_id_expediente integer, p_id_medico integer, p_sintomas_signos text, p_habitus_exterior text, p_estado_nutricional text, p_estudios_lab text, p_evolucion_analisis text, p_diagnosticos text, p_plan_tratamiento text, p_pronostico text, p_interconsultas text, p_indicaciones text) OWNER TO postgres;

--
-- Name: detectar_cambios_sospechosos(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.detectar_cambios_sospechosos() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.detectar_cambios_sospechosos() OWNER TO postgres;

--
-- Name: edad_en_anos(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.edad_en_anos(fecha_nacimiento date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(fecha_nacimiento))::INT;
END;
$$;


ALTER FUNCTION public.edad_en_anos(fecha_nacimiento date) OWNER TO postgres;

--
-- Name: edad_total_meses(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.edad_total_meses(fecha_nacimiento date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN (EXTRACT(YEAR FROM AGE(fecha_nacimiento)) * 12 + 
          EXTRACT(MONTH FROM AGE(fecha_nacimiento)))::INT;
END;
$$;


ALTER FUNCTION public.edad_total_meses(fecha_nacimiento date) OWNER TO postgres;

--
-- Name: estadisticas_servicio(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.estadisticas_servicio(p_id_servicio integer) RETURNS TABLE(nombre_servicio text, total_camas integer, camas_disponibles integer, camas_ocupadas integer, pacientes_actuales integer, ingresos_mes_actual integer, egresos_mes_actual integer, promedio_estancia numeric)
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.estadisticas_servicio(p_id_servicio integer) OWNER TO postgres;

--
-- Name: FUNCTION estadisticas_servicio(p_id_servicio integer); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.estadisticas_servicio(p_id_servicio integer) IS 'Función para generar reportes estadísticos por servicio';


--
-- Name: limpiar_tokens_expirados(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.limpiar_tokens_expirados() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
  tokens_eliminados INT;
BEGIN
  -- Marcar como inactivos los tokens expirados
  UPDATE password_reset_tokens 
  SET 
    is_active = FALSE,
    invalidated_reason = 'Token expirado automáticamente'
  WHERE expires_at < NOW() 
    AND is_active = TRUE;
  
  GET DIAGNOSTICS tokens_eliminados = ROW_COUNT;
  
  -- Eliminar físicamente tokens muy antiguos (más de 7 días)
  DELETE FROM password_reset_tokens 
  WHERE created_at < NOW() - INTERVAL '7 days';
  
  RETURN tokens_eliminados;
END;
$$;


ALTER FUNCTION public.limpiar_tokens_expirados() OWNER TO postgres;

--
-- Name: FUNCTION limpiar_tokens_expirados(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.limpiar_tokens_expirados() IS 'Función para limpiar tokens expirados automáticamente';


--
-- Name: obtener_historial_vacunas_completo(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_historial_vacunas_completo(p_id_inmunizacion integer) RETURNS TABLE(tipo_vacuna text, nombre_vacuna text, fecha_aplicacion date, dosis text, observaciones text, origen text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  
  -- ========== VACUNAS DEL ESQUEMA BÁSICO ==========
  
  -- BCG
  SELECT 
    'Esquema Básico'::TEXT as tipo_vacuna,
    'BCG'::TEXT as nombre_vacuna,
    i.bcg_fecha as fecha_aplicacion,
    'Única'::TEXT as dosis,
    i.bcg_observaciones as observaciones,
    'Esquema Nacional'::TEXT as origen
  FROM inmunizaciones i 
  WHERE i.id_inmunizacion = p_id_inmunizacion AND i.bcg_fecha IS NOT NULL
  
  UNION ALL
  
  -- HEPATITIS B (3 dosis)
  SELECT 'Esquema Básico', 'Hepatitis B - 1era dosis', i.hepatitis_b_1_fecha, '1/3', i.hepatitis_b_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.hepatitis_b_1_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'Hepatitis B - 2da dosis', i.hepatitis_b_2_fecha, '2/3', i.hepatitis_b_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.hepatitis_b_2_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'Hepatitis B - 3era dosis', i.hepatitis_b_3_fecha, '3/3', i.hepatitis_b_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.hepatitis_b_3_fecha IS NOT NULL
  
  UNION ALL
  
  -- PENTAVALENTE (3 dosis)
  SELECT 'Esquema Básico', 'Pentavalente - 1era dosis', i.pentavalente_1_fecha, '1/3', i.pentavalente_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.pentavalente_1_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'Pentavalente - 2da dosis', i.pentavalente_2_fecha, '2/3', i.pentavalente_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.pentavalente_2_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'Pentavalente - 3era dosis', i.pentavalente_3_fecha, '3/3', i.pentavalente_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.pentavalente_3_fecha IS NOT NULL
  
  UNION ALL
  
  -- ROTAVIRUS (3 dosis)
  SELECT 'Esquema Básico', 'Rotavirus - 1era dosis', i.rotavirus_1_fecha, '1/3', i.rotavirus_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.rotavirus_1_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'Rotavirus - 2da dosis', i.rotavirus_2_fecha, '2/3', i.rotavirus_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.rotavirus_2_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'Rotavirus - 3era dosis', i.rotavirus_3_fecha, '3/3', i.rotavirus_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.rotavirus_3_fecha IS NOT NULL
  
  UNION ALL
  
  -- NEUMOCOCO (3 dosis + refuerzo)
  SELECT 'Esquema Básico', 'Neumococo - 1era dosis', i.neumococo_1_fecha, '1/4', i.neumococo_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.neumococo_1_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'Neumococo - 2da dosis', i.neumococo_2_fecha, '2/4', i.neumococo_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.neumococo_2_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'Neumococo - 3era dosis', i.neumococo_3_fecha, '3/4', i.neumococo_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.neumococo_3_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'Neumococo - Refuerzo', i.neumococo_refuerzo_fecha, '4/4', i.neumococo_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.neumococo_refuerzo_fecha IS NOT NULL
  
  UNION ALL
  
  -- INFLUENZA
  SELECT 'Esquema Básico', 'Influenza', i.influenza_fecha, 'Anual', i.influenza_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.influenza_fecha IS NOT NULL
  
  UNION ALL
  
  -- SRP (Sarampión, Rubéola, Parotiditis)
  SELECT 'Esquema Básico', 'SRP - 12 meses', i.srp_12_meses_fecha, '1/2', i.srp_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.srp_12_meses_fecha IS NOT NULL
  
  UNION ALL
  
  SELECT 'Esquema Básico', 'SRP - 6 años', i.srp_6_anos_fecha, '2/2', i.srp_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.srp_6_anos_fecha IS NOT NULL
  
  UNION ALL
  
  -- DPT (Difteria, Tos ferina, Tétanos)
  SELECT 'Esquema Básico', 'DPT - 4 años', i.dpt_4_anos_fecha, 'Refuerzo', i.dpt_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.dpt_4_anos_fecha IS NOT NULL
  
  UNION ALL
  
  -- ========== VACUNAS ADICIONALES DEL ESQUEMA BÁSICO ==========
  
  -- VARICELA
  SELECT 'Esquema Básico', 'Varicela', i.varicela_fecha, 'Única', i.varicela_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.varicela_fecha IS NOT NULL
  
  UNION ALL
  
  -- HEPATITIS A
  SELECT 'Esquema Básico', 'Hepatitis A', i.hepatitis_a_fecha, 'Única', i.hepatitis_a_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.hepatitis_a_fecha IS NOT NULL
  
  UNION ALL
  
  -- VPH (Virus del Papiloma Humano)
  SELECT 'Esquema Básico', 'VPH (Virus Papiloma Humano)', i.vph_fecha, 'Única', i.vph_observaciones, 'Esquema Nacional'
  FROM inmunizaciones i WHERE i.id_inmunizacion = p_id_inmunizacion AND i.vph_fecha IS NOT NULL
  
  UNION ALL
  
  -- ========== VACUNAS ADICIONALES DEL CATÁLOGO ==========
  
  -- Vacunas adicionales que están en el catálogo
  SELECT 
    cv.tipo_vacuna,
    cv.nombre_vacuna,
    va.fecha_aplicacion,
    CONCAT(va.dosis_numero::TEXT, '/', cv.dosis_requeridas::TEXT),
    COALESCE(va.observaciones, va.reacciones_adversas),
    COALESCE(va.institucion_aplicacion, 'No especificado')
  FROM vacunas_adicionales va
  JOIN catalogo_vacunas cv ON va.id_vacuna = cv.id_vacuna
  WHERE va.id_inmunizacion = p_id_inmunizacion
  
  UNION ALL
  
  -- ========== VACUNAS ADICIONALES LIBRES ==========
  
  -- Vacunas adicionales que NO están en el catálogo (escritura libre)
  SELECT 
    'Adicional'::TEXT,
    va.nombre_vacuna_libre,
    va.fecha_aplicacion,
    CONCAT('Dosis ', va.dosis_numero::TEXT),
    COALESCE(va.observaciones, va.reacciones_adversas),
    COALESCE(va.institucion_aplicacion, 'No especificado')
  FROM vacunas_adicionales va
  WHERE va.id_inmunizacion = p_id_inmunizacion 
    AND va.id_vacuna IS NULL
    AND va.nombre_vacuna_libre IS NOT NULL
  
  -- Ordenar todo por fecha de aplicación
  ORDER BY fecha_aplicacion ASC NULLS LAST;
END;
$$;


ALTER FUNCTION public.obtener_historial_vacunas_completo(p_id_inmunizacion integer) OWNER TO postgres;

--
-- Name: obtener_signos_vitales_recientes(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_signos_vitales_recientes(p_id_expediente integer) RETURNS TABLE(temperatura numeric, fc integer, fr integer, pas integer, pad integer, sato2 integer, peso numeric, talla numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sv.temperatura,
    sv.frecuencia_cardiaca,
    sv.frecuencia_respiratoria,
    sv.presion_arterial_sistolica,
    sv.presion_arterial_diastolica,
    sv.saturacion_oxigeno,
    sv.peso,
    sv.talla
  FROM signos_vitales sv
  JOIN documento_clinico dc ON sv.id_documento = dc.id_documento
  WHERE dc.id_expediente = p_id_expediente
  ORDER BY sv.fecha_toma DESC
  LIMIT 1;
END;
$$;


ALTER FUNCTION public.obtener_signos_vitales_recientes(p_id_expediente integer) OWNER TO postgres;

--
-- Name: registrar_auditoria(integer, integer, text, jsonb, jsonb, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.registrar_auditoria(p_id_expediente integer, p_id_medico integer, p_accion text, p_datos_anteriores jsonb DEFAULT NULL::jsonb, p_datos_nuevos jsonb DEFAULT NULL::jsonb, p_observaciones text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO expediente_auditoria (
    id_expediente, id_medico, accion, datos_anteriores, 
    datos_nuevos, ip_acceso, observaciones
  ) VALUES (
    p_id_expediente, p_id_medico, p_accion, p_datos_anteriores,
    p_datos_nuevos, inet_client_addr(), p_observaciones
  );
END;
$$;


ALTER FUNCTION public.registrar_auditoria(p_id_expediente integer, p_id_medico integer, p_accion text, p_datos_anteriores jsonb, p_datos_nuevos jsonb, p_observaciones text) OWNER TO postgres;

--
-- Name: trigger_limpiar_tokens(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_limpiar_tokens() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Cada vez que se inserta un nuevo token, limpiar los expirados
  PERFORM limpiar_tokens_expirados();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_limpiar_tokens() OWNER TO postgres;

--
-- Name: validar_curp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_curp() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
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
$_$;


ALTER FUNCTION public.validar_curp() OWNER TO postgres;

--
-- Name: FUNCTION validar_curp(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.validar_curp() IS 'Función trigger para validar formato de CURP mexicano';


--
-- Name: validar_desarrollo_psicomotriz(integer, integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_desarrollo_psicomotriz(p_edad_meses integer, p_sostuvo_cabeza integer, p_se_sento integer, p_camino integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.validar_desarrollo_psicomotriz(p_edad_meses integer, p_sostuvo_cabeza integer, p_se_sento integer, p_camino integer) OWNER TO postgres;

--
-- Name: validar_fechas_egreso(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_fechas_egreso() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.fecha_egreso IS NOT NULL AND NEW.fecha_egreso <= NEW.fecha_ingreso THEN
    RAISE EXCEPTION 'La fecha de egreso debe ser posterior a la fecha de ingreso';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.validar_fechas_egreso() OWNER TO postgres;

--
-- Name: validar_reingreso_paciente(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_reingreso_paciente(p_id_expediente integer, p_id_medico integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.validar_reingreso_paciente(p_id_expediente integer, p_id_medico integer) OWNER TO postgres;

--
-- Name: validar_token_reset(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_token_reset(p_token character varying) RETURNS TABLE(id_reset_token integer, email character varying, tipo_usuario character varying, id_usuario_referencia integer, is_valid boolean, tiempo_restante_minutos integer, mensaje text)
    LANGUAGE plpgsql
    AS $$
DECLARE
  token_record RECORD;
  minutos_restantes INT;
BEGIN
  -- Buscar el token
  SELECT *
  INTO token_record
  FROM password_reset_tokens
  WHERE token = p_token
    AND is_active = TRUE
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Si no existe el token
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      NULL::INT, 
      NULL::VARCHAR(255), 
      NULL::VARCHAR(50), 
      NULL::INT,
      FALSE, 
      0, 
      'Token no encontrado o inválido'::TEXT;
    RETURN;
  END IF;
  
  -- Calcular tiempo restante
  minutos_restantes := EXTRACT(EPOCH FROM (token_record.expires_at - NOW()))/60;
  
  -- Verificar si está expirado
  IF token_record.expires_at < NOW() THEN
    -- Marcar como inactivo
    UPDATE password_reset_tokens 
    SET is_active = FALSE, invalidated_reason = 'Token expirado'
    WHERE id_reset_token = token_record.id_reset_token;
    
    RETURN QUERY SELECT 
      token_record.id_reset_token, 
      token_record.email, 
      token_record.tipo_usuario, 
      token_record.id_usuario_referencia,
      FALSE, 
      0, 
      'Token expirado'::TEXT;
    RETURN;
  END IF;
  
  -- Token válido
  RETURN QUERY SELECT 
    token_record.id_reset_token, 
    token_record.email, 
    token_record.tipo_usuario, 
    token_record.id_usuario_referencia,
    TRUE, 
    minutos_restantes, 
    'Token válido'::TEXT;
END;
$$;


ALTER FUNCTION public.validar_token_reset(p_token character varying) OWNER TO postgres;

--
-- Name: FUNCTION validar_token_reset(p_token character varying); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.validar_token_reset(p_token character varying) IS 'Función para validar un token de recuperación';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: documento_clinico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documento_clinico (
    id_documento integer NOT NULL,
    id_expediente integer NOT NULL,
    id_internamiento integer,
    id_tipo_documento integer NOT NULL,
    fecha_elaboracion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_personal_creador integer,
    estado public.estado_documento_enum DEFAULT 'Activo'::public.estado_documento_enum NOT NULL,
    texto_busqueda tsvector
);


ALTER TABLE public.documento_clinico OWNER TO postgres;

--
-- Name: TABLE documento_clinico; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.documento_clinico IS 'Tabla base para almacenar documentos clínicos generales.';


--
-- Name: COLUMN documento_clinico.id_tipo_documento; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.documento_clinico.id_tipo_documento IS 'Clave foránea a tipo_documento.';


--
-- Name: persona; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.persona (
    id_persona integer NOT NULL,
    nombre text NOT NULL,
    apellido_paterno text NOT NULL,
    apellido_materno text,
    fecha_nacimiento date NOT NULL,
    sexo public.sexo_enum DEFAULT 'O'::public.sexo_enum,
    curp character varying(18),
    tipo_sangre_id integer,
    estado_civil public.estado_civil_enum,
    religion text,
    telefono text,
    correo_electronico text,
    domicilio text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    es_pediatrico boolean DEFAULT false
);


ALTER TABLE public.persona OWNER TO postgres;

--
-- Name: personal_medico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_medico (
    id_personal_medico integer NOT NULL,
    id_persona integer NOT NULL,
    numero_cedula text,
    especialidad text,
    cargo text,
    departamento text,
    activo boolean DEFAULT true,
    foto text,
    usuario character varying(50),
    password_texto character varying(100),
    ultimo_login timestamp without time zone,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.personal_medico OWNER TO postgres;

--
-- Name: actividad_medica_reciente; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.actividad_medica_reciente AS
 SELECT concat(p.nombre, ' ', p.apellido_paterno) AS medico,
    pm.especialidad,
    count(*) AS documentos_ultimos_7_dias,
    max(dc.fecha_elaboracion) AS ultimo_documento,
    count(DISTINCT dc.id_expediente) AS expedientes_atendidos
   FROM ((public.documento_clinico dc
     JOIN public.personal_medico pm ON ((dc.id_personal_creador = pm.id_personal_medico)))
     JOIN public.persona p ON ((pm.id_persona = p.id_persona)))
  WHERE (dc.fecha_elaboracion >= (CURRENT_DATE - '7 days'::interval))
  GROUP BY pm.id_personal_medico, p.nombre, p.apellido_paterno, pm.especialidad
  ORDER BY (count(*)) DESC;


ALTER VIEW public.actividad_medica_reciente OWNER TO postgres;

--
-- Name: expediente_auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expediente_auditoria (
    id_auditoria integer NOT NULL,
    id_expediente integer NOT NULL,
    fecha_acceso timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_medico integer NOT NULL,
    accion text NOT NULL,
    datos_anteriores jsonb,
    datos_nuevos jsonb,
    ip_acceso inet,
    navegador text,
    tiempo_sesion integer,
    observaciones text
);


ALTER TABLE public.expediente_auditoria OWNER TO postgres;

--
-- Name: TABLE expediente_auditoria; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.expediente_auditoria IS 'Registro de auditoría para control anti-pereza médica.';


--
-- Name: actividad_medicos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.actividad_medicos AS
 SELECT concat(p.nombre, ' ', p.apellido_paterno) AS medico,
    pm.especialidad,
    count(*) AS total_accesos,
    count(
        CASE
            WHEN (ea.accion = 'nuevo_documento'::text) THEN 1
            ELSE NULL::integer
        END) AS documentos_creados,
    count(
        CASE
            WHEN (ea.accion = 'actualizacion'::text) THEN 1
            ELSE NULL::integer
        END) AS actualizaciones,
    max(ea.fecha_acceso) AS ultimo_acceso
   FROM ((public.expediente_auditoria ea
     JOIN public.personal_medico pm ON ((ea.id_medico = pm.id_personal_medico)))
     JOIN public.persona p ON ((pm.id_persona = p.id_persona)))
  WHERE (ea.fecha_acceso >= (CURRENT_DATE - '30 days'::interval))
  GROUP BY pm.id_personal_medico, p.nombre, p.apellido_paterno, pm.especialidad
  ORDER BY (count(*)) DESC;


ALTER VIEW public.actividad_medicos OWNER TO postgres;

--
-- Name: administrador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrador (
    id_administrador integer NOT NULL,
    id_persona integer NOT NULL,
    usuario text NOT NULL,
    contrasena character varying(255) NOT NULL,
    nivel_acceso integer NOT NULL,
    activo boolean DEFAULT true,
    foto text,
    password_texto character varying(100),
    ultimo_login timestamp without time zone,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.administrador OWNER TO postgres;

--
-- Name: administrador_id_administrador_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrador_id_administrador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administrador_id_administrador_seq OWNER TO postgres;

--
-- Name: administrador_id_administrador_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrador_id_administrador_seq OWNED BY public.administrador.id_administrador;


--
-- Name: alertas_sistema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alertas_sistema (
    id_alerta integer NOT NULL,
    tipo_alerta text NOT NULL,
    mensaje text NOT NULL,
    id_expediente integer,
    id_medico integer,
    fecha_alerta timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado text DEFAULT 'ACTIVA'::text,
    fecha_revision timestamp without time zone,
    id_medico_revisor integer,
    acciones_tomadas text
);


ALTER TABLE public.alertas_sistema OWNER TO postgres;

--
-- Name: TABLE alertas_sistema; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.alertas_sistema IS 'Sistema de alertas para cambios sospechosos.';


--
-- Name: alertas_sistema_id_alerta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alertas_sistema_id_alerta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alertas_sistema_id_alerta_seq OWNER TO postgres;

--
-- Name: alertas_sistema_id_alerta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alertas_sistema_id_alerta_seq OWNED BY public.alertas_sistema.id_alerta;


--
-- Name: antecedentes_heredo_familiares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedentes_heredo_familiares (
    id_antecedentes_hf integer NOT NULL,
    id_historia_clinica integer NOT NULL,
    madre_alergias text,
    madre_tuberculosis text,
    madre_sifilis text,
    madre_discrasias text,
    madre_diabetes text,
    madre_cardiopatias text,
    madre_convulsiones text,
    madre_hipotiroidismo text,
    madre_hipertension text,
    madre_toxicomanias text,
    madre_otros text,
    padre_alergias text,
    padre_tuberculosis text,
    padre_sifilis text,
    padre_discrasias text,
    padre_diabetes text,
    padre_cardiopatias text,
    padre_convulsiones text,
    padre_hipotiroidismo text,
    padre_hipertension text,
    padre_toxicomanias text,
    padre_otros text,
    hermanos_antecedentes text,
    abuelos_paternos_antecedentes text,
    abuelos_maternos_antecedentes text,
    otros_familiares_antecedentes text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.antecedentes_heredo_familiares OWNER TO postgres;

--
-- Name: TABLE antecedentes_heredo_familiares; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.antecedentes_heredo_familiares IS 'Antecedentes familiares detallados específicos para pediatría';


--
-- Name: antecedentes_heredo_familiares_id_antecedentes_hf_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedentes_heredo_familiares_id_antecedentes_hf_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedentes_heredo_familiares_id_antecedentes_hf_seq OWNER TO postgres;

--
-- Name: antecedentes_heredo_familiares_id_antecedentes_hf_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedentes_heredo_familiares_id_antecedentes_hf_seq OWNED BY public.antecedentes_heredo_familiares.id_antecedentes_hf;


--
-- Name: antecedentes_perinatales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedentes_perinatales (
    id_perinatales integer NOT NULL,
    id_historia_clinica integer NOT NULL,
    embarazo_planeado boolean,
    numero_embarazo integer,
    control_prenatal boolean,
    numero_consultas_prenatales integer,
    complicaciones_embarazo text,
    tipo_parto public.tipo_parto_enum,
    semanas_gestacion integer,
    peso_nacimiento numeric(5,2),
    talla_nacimiento numeric(5,2),
    apgar_1_min integer,
    apgar_5_min integer,
    llanto_inmediato boolean,
    hospitalizacion_neonatal boolean,
    dias_hospitalizacion_neonatal integer,
    problemas_neonatales text,
    alimentacion_neonatal text,
    peso_2_meses numeric(5,2),
    peso_4_meses numeric(5,2),
    peso_6_meses numeric(5,2),
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.antecedentes_perinatales OWNER TO postgres;

--
-- Name: TABLE antecedentes_perinatales; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.antecedentes_perinatales IS 'Antecedentes del embarazo, parto y periodo neonatal';


--
-- Name: antecedentes_perinatales_id_perinatales_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedentes_perinatales_id_perinatales_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedentes_perinatales_id_perinatales_seq OWNER TO postgres;

--
-- Name: antecedentes_perinatales_id_perinatales_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedentes_perinatales_id_perinatales_seq OWNED BY public.antecedentes_perinatales.id_perinatales;


--
-- Name: area_interconsulta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.area_interconsulta (
    id_area_interconsulta integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


ALTER TABLE public.area_interconsulta OWNER TO postgres;

--
-- Name: area_interconsulta_id_area_interconsulta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.area_interconsulta_id_area_interconsulta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.area_interconsulta_id_area_interconsulta_seq OWNER TO postgres;

--
-- Name: area_interconsulta_id_area_interconsulta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.area_interconsulta_id_area_interconsulta_seq OWNED BY public.area_interconsulta.id_area_interconsulta;


--
-- Name: cama; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cama (
    id_cama integer NOT NULL,
    numero text NOT NULL,
    id_servicio integer,
    estado public.estado_cama_enum DEFAULT 'Disponible'::public.estado_cama_enum,
    descripcion text,
    area text,
    subarea text
);


ALTER TABLE public.cama OWNER TO postgres;

--
-- Name: cama_id_cama_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cama_id_cama_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cama_id_cama_seq OWNER TO postgres;

--
-- Name: cama_id_cama_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cama_id_cama_seq OWNED BY public.cama.id_cama;


--
-- Name: catalogo_vacunas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_vacunas (
    id_vacuna integer NOT NULL,
    nombre_vacuna text NOT NULL,
    descripcion text,
    tipo_vacuna text,
    edad_aplicacion text,
    dosis_requeridas integer DEFAULT 1,
    intervalo_dosis text,
    via_administracion text,
    activa boolean DEFAULT true,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.catalogo_vacunas OWNER TO postgres;

--
-- Name: TABLE catalogo_vacunas; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.catalogo_vacunas IS 'Catálogo de vacunas adicionales no contempladas en el esquema básico';


--
-- Name: catalogo_vacunas_id_vacuna_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_vacunas_id_vacuna_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_vacunas_id_vacuna_seq OWNER TO postgres;

--
-- Name: catalogo_vacunas_id_vacuna_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_vacunas_id_vacuna_seq OWNED BY public.catalogo_vacunas.id_vacuna;


--
-- Name: configuracion_sistema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_sistema (
    id_config integer NOT NULL,
    parametro text NOT NULL,
    valor text NOT NULL,
    descripcion text,
    fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_modificador integer
);


ALTER TABLE public.configuracion_sistema OWNER TO postgres;

--
-- Name: configuracion_sistema_id_config_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_sistema_id_config_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_sistema_id_config_seq OWNER TO postgres;

--
-- Name: configuracion_sistema_id_config_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_sistema_id_config_seq OWNED BY public.configuracion_sistema.id_config;


--
-- Name: consentimiento_informado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consentimiento_informado (
    id_consentimiento integer NOT NULL,
    id_documento integer NOT NULL,
    tipo_consentimiento text NOT NULL,
    informacion_proporcionada text,
    riesgos_informados text,
    alternativas_informadas text,
    nombre_testigo1 text,
    nombre_testigo2 text,
    id_medico_informa integer,
    firma_paciente boolean DEFAULT false,
    firma_medico boolean DEFAULT false,
    firma_representante_legal boolean DEFAULT false,
    nombre_representante_legal text,
    parentesco_representante text
);


ALTER TABLE public.consentimiento_informado OWNER TO postgres;

--
-- Name: consentimiento_informado_id_consentimiento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consentimiento_informado_id_consentimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consentimiento_informado_id_consentimiento_seq OWNER TO postgres;

--
-- Name: consentimiento_informado_id_consentimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consentimiento_informado_id_consentimiento_seq OWNED BY public.consentimiento_informado.id_consentimiento;


--
-- Name: control_acceso_historico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.control_acceso_historico (
    id_control integer NOT NULL,
    id_expediente integer NOT NULL,
    id_medico integer NOT NULL,
    fecha_ultimo_ingreso date NOT NULL,
    dias_desde_ultimo_ingreso integer NOT NULL,
    requiere_validacion boolean DEFAULT true,
    datos_bloqueados boolean DEFAULT true,
    fecha_desbloqueo timestamp without time zone,
    tiempo_bloqueo_minutos integer DEFAULT 30,
    razon_bloqueo text
);


ALTER TABLE public.control_acceso_historico OWNER TO postgres;

--
-- Name: control_acceso_historico_id_control_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.control_acceso_historico_id_control_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.control_acceso_historico_id_control_seq OWNER TO postgres;

--
-- Name: control_acceso_historico_id_control_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.control_acceso_historico_id_control_seq OWNED BY public.control_acceso_historico.id_control;


--
-- Name: expediente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expediente (
    id_expediente integer NOT NULL,
    id_paciente integer NOT NULL,
    numero_expediente text NOT NULL,
    fecha_apertura timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado text DEFAULT 'Activo'::text,
    notas_administrativas text,
    numero_expediente_administrativo text
);


ALTER TABLE public.expediente OWNER TO postgres;

--
-- Name: COLUMN expediente.numero_expediente; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.expediente.numero_expediente IS 'Número de expediente generado automáticamente por el sistema';


--
-- Name: COLUMN expediente.numero_expediente_administrativo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.expediente.numero_expediente_administrativo IS 'Número de expediente asignado manualmente por el área de expedientes clínicos';


--
-- Name: internamiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.internamiento (
    id_internamiento integer NOT NULL,
    id_expediente integer NOT NULL,
    id_cama integer,
    id_servicio integer,
    fecha_ingreso timestamp without time zone NOT NULL,
    fecha_egreso timestamp without time zone,
    motivo_ingreso text NOT NULL,
    diagnostico_ingreso text,
    diagnostico_egreso text,
    id_medico_responsable integer,
    tipo_egreso public.tipo_egreso_enum,
    observaciones text,
    CONSTRAINT check_fecha_egreso CHECK ((((fecha_egreso IS NULL) AND (tipo_egreso IS NULL)) OR ((fecha_egreso IS NOT NULL) AND (tipo_egreso IS NOT NULL))))
);


ALTER TABLE public.internamiento OWNER TO postgres;

--
-- Name: servicio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicio (
    id_servicio integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


ALTER TABLE public.servicio OWNER TO postgres;

--
-- Name: dashboard_general; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.dashboard_general AS
 SELECT ( SELECT count(*) AS count
           FROM public.expediente
          WHERE (expediente.estado = 'Activo'::text)) AS expedientes_activos,
    ( SELECT count(*) AS count
           FROM public.internamiento
          WHERE (internamiento.fecha_egreso IS NULL)) AS pacientes_hospitalizados,
    ( SELECT count(*) AS count
           FROM public.alertas_sistema
          WHERE (alertas_sistema.estado = 'ACTIVA'::text)) AS alertas_pendientes,
    ( SELECT count(*) AS count
           FROM public.cama
          WHERE (cama.estado = 'Disponible'::public.estado_cama_enum)) AS camas_disponibles,
    ( SELECT count(*) AS count
           FROM public.cama
          WHERE (cama.estado = 'Ocupada'::public.estado_cama_enum)) AS camas_ocupadas,
    ( SELECT count(*) AS count
           FROM public.internamiento
          WHERE (date(internamiento.fecha_ingreso) = CURRENT_DATE)) AS ingresos_hoy,
    ( SELECT count(*) AS count
           FROM public.internamiento
          WHERE (date(internamiento.fecha_egreso) = CURRENT_DATE)) AS egresos_hoy,
    ( SELECT count(*) AS count
           FROM public.documento_clinico
          WHERE (date(documento_clinico.fecha_elaboracion) = CURRENT_DATE)) AS documentos_hoy,
    ( SELECT count(*) AS count
           FROM (public.internamiento i
             JOIN public.servicio s ON ((i.id_servicio = s.id_servicio)))
          WHERE ((s.nombre = 'Urgencias'::text) AND (i.fecha_egreso IS NULL))) AS pacientes_urgencias;


ALTER VIEW public.dashboard_general OWNER TO postgres;

--
-- Name: VIEW dashboard_general; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.dashboard_general IS 'Vista principal para dashboard administrativo del hospital';


--
-- Name: desarrollo_psicomotriz; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.desarrollo_psicomotriz (
    id_desarrollo integer NOT NULL,
    id_historia_clinica integer NOT NULL,
    sostuvo_cabeza_meses integer,
    se_sento_meses integer,
    gateo_meses integer,
    camino_meses integer,
    primera_palabra_meses integer,
    primeras_frases_meses integer,
    sonrisa_social_meses integer,
    reconocimiento_padres_meses integer,
    control_diurno_meses integer,
    control_nocturno_meses integer,
    juego_simbolico_meses integer,
    seguimiento_instrucciones_meses integer,
    desarrollo_normal boolean DEFAULT true,
    observaciones_desarrollo text,
    necesita_estimulacion boolean DEFAULT false,
    tipo_estimulacion text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.desarrollo_psicomotriz OWNER TO postgres;

--
-- Name: TABLE desarrollo_psicomotriz; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.desarrollo_psicomotriz IS 'Seguimiento de hitos del desarrollo psicomotriz';


--
-- Name: desarrollo_psicomotriz_id_desarrollo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.desarrollo_psicomotriz_id_desarrollo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.desarrollo_psicomotriz_id_desarrollo_seq OWNER TO postgres;

--
-- Name: desarrollo_psicomotriz_id_desarrollo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.desarrollo_psicomotriz_id_desarrollo_seq OWNED BY public.desarrollo_psicomotriz.id_desarrollo;


--
-- Name: historia_clinica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historia_clinica (
    id_historia_clinica integer NOT NULL,
    id_documento integer NOT NULL,
    antecedentes_heredo_familiares text,
    habitos_higienicos text,
    habitos_alimenticios text,
    actividad_fisica text,
    ocupacion text,
    vivienda text,
    toxicomanias text,
    menarca text,
    ritmo_menstrual text,
    inicio_vida_sexual text,
    fecha_ultima_regla date,
    fecha_ultimo_parto date,
    gestas integer,
    partos integer,
    cesareas integer,
    abortos integer,
    hijos_vivos integer,
    metodo_planificacion text,
    enfermedades_infancia text,
    enfermedades_adulto text,
    cirugias_previas text,
    traumatismos text,
    alergias text,
    padecimiento_actual text,
    sintomas_generales text,
    aparatos_sistemas text,
    exploracion_general text,
    exploracion_cabeza text,
    exploracion_cuello text,
    exploracion_torax text,
    exploracion_abdomen text,
    exploracion_columna text,
    exploracion_extremidades text,
    exploracion_genitales text,
    impresion_diagnostica text,
    id_guia_diagnostico integer,
    plan_diagnostico text,
    plan_terapeutico text,
    pronostico text,
    tipo_historia text DEFAULT 'general'::text,
    religion_familia text,
    higiene_personal_familia text
);


ALTER TABLE public.historia_clinica OWNER TO postgres;

--
-- Name: inmunizaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inmunizaciones (
    id_inmunizacion integer NOT NULL,
    id_historia_clinica integer NOT NULL,
    bcg_fecha date,
    bcg_observaciones text,
    hepatitis_b_1_fecha date,
    hepatitis_b_2_fecha date,
    hepatitis_b_3_fecha date,
    hepatitis_b_observaciones text,
    pentavalente_1_fecha date,
    pentavalente_2_fecha date,
    pentavalente_3_fecha date,
    pentavalente_observaciones text,
    rotavirus_1_fecha date,
    rotavirus_2_fecha date,
    rotavirus_3_fecha date,
    rotavirus_observaciones text,
    neumococo_1_fecha date,
    neumococo_2_fecha date,
    neumococo_3_fecha date,
    neumococo_refuerzo_fecha date,
    neumococo_observaciones text,
    influenza_fecha date,
    influenza_observaciones text,
    srp_12_meses_fecha date,
    srp_6_anos_fecha date,
    srp_observaciones text,
    dpt_4_anos_fecha date,
    dpt_observaciones text,
    varicela_fecha date,
    varicela_observaciones text,
    hepatitis_a_fecha date,
    hepatitis_a_observaciones text,
    vph_fecha date,
    vph_observaciones text,
    esquema_completo_edad boolean DEFAULT false,
    esquema_incompleto_razon text,
    reacciones_adversas text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inmunizaciones OWNER TO postgres;

--
-- Name: TABLE inmunizaciones; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.inmunizaciones IS 'Control del esquema de vacunación pediátrico';


--
-- Name: paciente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paciente (
    id_paciente integer NOT NULL,
    id_persona integer NOT NULL,
    alergias text,
    transfusiones text,
    detalles_transfusiones text,
    familiar_responsable text,
    parentesco_familiar text,
    telefono_familiar text,
    ocupacion text,
    escolaridad text,
    lugar_nacimiento text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    nombre_madre text,
    edad_madre integer,
    ocupacion_madre text,
    escolaridad_madre text,
    nombre_padre text,
    edad_padre integer,
    ocupacion_padre text,
    escolaridad_padre text,
    derechohabiente public.derechohabiente_enum,
    programa_social public.programa_social_enum,
    especificar_otro_derechohabiente text,
    especificar_otro_programa text,
    calidad_alimentacion text,
    agua_ingesta text,
    hacinamiento text,
    cohabita_con text
);


ALTER TABLE public.paciente OWNER TO postgres;

--
-- Name: vacunas_adicionales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vacunas_adicionales (
    id_vacuna_adicional integer NOT NULL,
    id_inmunizacion integer NOT NULL,
    id_vacuna integer,
    nombre_vacuna_libre text,
    fecha_aplicacion date NOT NULL,
    dosis_numero integer DEFAULT 1,
    lote_vacuna text,
    laboratorio text,
    via_administracion text,
    sitio_aplicacion text,
    aplicada_por text,
    institucion_aplicacion text,
    reacciones_adversas text,
    observaciones text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    registrado_por integer
);


ALTER TABLE public.vacunas_adicionales OWNER TO postgres;

--
-- Name: TABLE vacunas_adicionales; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.vacunas_adicionales IS 'Registro de vacunas aplicadas que no están en el esquema básico de inmunizaciones';


--
-- Name: COLUMN vacunas_adicionales.nombre_vacuna_libre; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.vacunas_adicionales.nombre_vacuna_libre IS 'Para vacunas que no están en el catálogo - escribir libremente';


--
-- Name: detalle_vacunas_adicionales; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.detalle_vacunas_adicionales AS
 SELECT va.id_vacuna_adicional,
    i.id_inmunizacion,
    concat(p.nombre, ' ', p.apellido_paterno) AS nombre_paciente,
    COALESCE(cv.nombre_vacuna, va.nombre_vacuna_libre) AS nombre_vacuna,
    cv.tipo_vacuna,
    va.fecha_aplicacion,
    concat(va.dosis_numero, '/', COALESCE((cv.dosis_requeridas)::text, '?'::text)) AS dosis,
    va.lote_vacuna,
    va.laboratorio,
    va.via_administracion,
    va.sitio_aplicacion,
    va.aplicada_por,
    va.institucion_aplicacion,
    va.reacciones_adversas,
    va.observaciones,
    va.fecha_registro,
    concat(pm_p.nombre, ' ', pm_p.apellido_paterno) AS registrado_por_medico
   FROM (((((((((public.vacunas_adicionales va
     JOIN public.inmunizaciones i ON ((va.id_inmunizacion = i.id_inmunizacion)))
     JOIN public.historia_clinica hc ON ((i.id_historia_clinica = hc.id_historia_clinica)))
     JOIN public.documento_clinico dc ON ((hc.id_documento = dc.id_documento)))
     JOIN public.expediente e ON ((dc.id_expediente = e.id_expediente)))
     JOIN public.paciente pac ON ((e.id_paciente = pac.id_paciente)))
     JOIN public.persona p ON ((pac.id_persona = p.id_persona)))
     LEFT JOIN public.catalogo_vacunas cv ON ((va.id_vacuna = cv.id_vacuna)))
     LEFT JOIN public.personal_medico pm ON ((va.registrado_por = pm.id_personal_medico)))
     LEFT JOIN public.persona pm_p ON ((pm.id_persona = pm_p.id_persona)))
  ORDER BY va.fecha_aplicacion DESC;


ALTER VIEW public.detalle_vacunas_adicionales OWNER TO postgres;

--
-- Name: documento_clinico_id_documento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documento_clinico_id_documento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documento_clinico_id_documento_seq OWNER TO postgres;

--
-- Name: documento_clinico_id_documento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documento_clinico_id_documento_seq OWNED BY public.documento_clinico.id_documento;


--
-- Name: tipo_documento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_documento (
    id_tipo_documento integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


ALTER TABLE public.tipo_documento OWNER TO postgres;

--
-- Name: expediente_pediatrico_completo; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.expediente_pediatrico_completo AS
 SELECT e.id_expediente,
    e.numero_expediente,
    concat(per.nombre, ' ', per.apellido_paterno, ' ', per.apellido_materno) AS nombre_paciente,
    EXTRACT(year FROM age((per.fecha_nacimiento)::timestamp with time zone)) AS edad_anos,
    EXTRACT(month FROM age((per.fecha_nacimiento)::timestamp with time zone)) AS edad_meses,
    per.sexo,
    per.fecha_nacimiento,
    pac.nombre_madre,
    pac.edad_madre,
    pac.nombre_padre,
    pac.edad_padre,
    pac.derechohabiente,
    pac.programa_social,
    e.fecha_apertura,
    e.estado,
    hc.id_historia_clinica,
    dc.fecha_elaboracion AS fecha_ultima_historia
   FROM ((((public.expediente e
     JOIN public.paciente pac ON ((e.id_paciente = pac.id_paciente)))
     JOIN public.persona per ON ((pac.id_persona = per.id_persona)))
     LEFT JOIN public.documento_clinico dc ON (((dc.id_expediente = e.id_expediente) AND (dc.id_tipo_documento = ( SELECT tipo_documento.id_tipo_documento
           FROM public.tipo_documento
          WHERE (tipo_documento.nombre = 'Historia Clínica'::text))))))
     LEFT JOIN public.historia_clinica hc ON ((hc.id_documento = dc.id_documento)))
  WHERE ((per.es_pediatrico = true) AND ((dc.id_documento IS NULL) OR (dc.fecha_elaboracion = ( SELECT max(dc2.fecha_elaboracion) AS max
           FROM public.documento_clinico dc2
          WHERE ((dc2.id_expediente = e.id_expediente) AND (dc2.id_tipo_documento = ( SELECT tipo_documento.id_tipo_documento
                   FROM public.tipo_documento
                  WHERE (tipo_documento.nombre = 'Historia Clínica'::text))))))))
  ORDER BY e.fecha_apertura DESC;


ALTER VIEW public.expediente_pediatrico_completo OWNER TO postgres;

--
-- Name: esquema_vacunacion; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.esquema_vacunacion AS
 SELECT i.id_inmunizacion,
    ep.nombre_paciente,
    ep.edad_anos,
    ep.edad_meses,
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
   FROM (((public.inmunizaciones i
     JOIN public.historia_clinica hc ON ((i.id_historia_clinica = hc.id_historia_clinica)))
     JOIN public.documento_clinico dc ON ((hc.id_documento = dc.id_documento)))
     JOIN public.expediente_pediatrico_completo ep ON ((dc.id_expediente = ep.id_expediente)));


ALTER VIEW public.esquema_vacunacion OWNER TO postgres;

--
-- Name: esquema_vacunacion_completo; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.esquema_vacunacion_completo AS
 SELECT i.id_inmunizacion,
    hc.id_historia_clinica,
    dc.id_expediente,
    concat(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_paciente,
    p.fecha_nacimiento,
    public.edad_total_meses(p.fecha_nacimiento) AS edad_meses,
    public.edad_en_anos(p.fecha_nacimiento) AS edad_anos,
    i.bcg_fecha,
    i.hepatitis_b_1_fecha,
    i.hepatitis_b_2_fecha,
    i.hepatitis_b_3_fecha,
    i.pentavalente_1_fecha,
    i.pentavalente_2_fecha,
    i.pentavalente_3_fecha,
    i.rotavirus_1_fecha,
    i.rotavirus_2_fecha,
    i.rotavirus_3_fecha,
    i.neumococo_1_fecha,
    i.neumococo_2_fecha,
    i.neumococo_3_fecha,
    i.neumococo_refuerzo_fecha,
    i.influenza_fecha,
    i.srp_12_meses_fecha,
    i.srp_6_anos_fecha,
    i.dpt_4_anos_fecha,
    i.varicela_fecha,
    i.hepatitis_a_fecha,
    i.vph_fecha,
    ( SELECT count(*) AS count
           FROM public.vacunas_adicionales va
          WHERE (va.id_inmunizacion = i.id_inmunizacion)) AS total_vacunas_adicionales,
    i.esquema_completo_edad,
    i.esquema_incompleto_razon,
    i.reacciones_adversas,
    i.fecha_registro
   FROM (((((public.inmunizaciones i
     JOIN public.historia_clinica hc ON ((i.id_historia_clinica = hc.id_historia_clinica)))
     JOIN public.documento_clinico dc ON ((hc.id_documento = dc.id_documento)))
     JOIN public.expediente e ON ((dc.id_expediente = e.id_expediente)))
     JOIN public.paciente pac ON ((e.id_paciente = pac.id_paciente)))
     JOIN public.persona p ON ((pac.id_persona = p.id_persona)));


ALTER VIEW public.esquema_vacunacion_completo OWNER TO postgres;

--
-- Name: estado_nutricional_pediatrico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_nutricional_pediatrico (
    id_nutricional integer NOT NULL,
    id_historia_clinica integer NOT NULL,
    peso_kg numeric(5,2) NOT NULL,
    talla_cm numeric(5,2) NOT NULL,
    perimetro_cefalico_cm numeric(5,2),
    perimetro_brazo_cm numeric(5,2),
    percentil_peso integer,
    percentil_talla integer,
    percentil_perimetro_cefalico integer,
    peso_para_edad text,
    talla_para_edad text,
    peso_para_talla text,
    aspecto_general text,
    estado_hidratacion text,
    palidez_mucosas boolean DEFAULT false,
    edemas boolean DEFAULT false,
    masa_muscular text,
    tejido_adiposo text,
    tipo_alimentacion public.tipo_alimentacion_enum,
    edad_ablactacion_meses integer,
    numero_comidas_dia integer,
    apetito text,
    alimentos_rechazados text,
    diagnostico_nutricional text,
    recomendaciones_nutricionales text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.estado_nutricional_pediatrico OWNER TO postgres;

--
-- Name: TABLE estado_nutricional_pediatrico; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.estado_nutricional_pediatrico IS 'Evaluación nutricional específica pediátrica';


--
-- Name: estado_nutricional_pediatrico_id_nutricional_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_nutricional_pediatrico_id_nutricional_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_nutricional_pediatrico_id_nutricional_seq OWNER TO postgres;

--
-- Name: estado_nutricional_pediatrico_id_nutricional_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_nutricional_pediatrico_id_nutricional_seq OWNED BY public.estado_nutricional_pediatrico.id_nutricional;


--
-- Name: estudio_medico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estudio_medico (
    id_estudio integer NOT NULL,
    clave text NOT NULL,
    nombre text NOT NULL,
    tipo text NOT NULL,
    descripcion text,
    requiere_ayuno boolean DEFAULT false,
    tiempo_resultado integer,
    activo boolean DEFAULT true
);


ALTER TABLE public.estudio_medico OWNER TO postgres;

--
-- Name: estudio_medico_id_estudio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estudio_medico_id_estudio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estudio_medico_id_estudio_seq OWNER TO postgres;

--
-- Name: estudio_medico_id_estudio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estudio_medico_id_estudio_seq OWNED BY public.estudio_medico.id_estudio;


--
-- Name: expediente_auditoria_id_auditoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expediente_auditoria_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expediente_auditoria_id_auditoria_seq OWNER TO postgres;

--
-- Name: expediente_auditoria_id_auditoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expediente_auditoria_id_auditoria_seq OWNED BY public.expediente_auditoria.id_auditoria;


--
-- Name: expediente_id_expediente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expediente_id_expediente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expediente_id_expediente_seq OWNER TO postgres;

--
-- Name: expediente_id_expediente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expediente_id_expediente_seq OWNED BY public.expediente.id_expediente;


--
-- Name: expedientes_con_alertas; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.expedientes_con_alertas AS
 SELECT e.id_expediente,
    e.numero_expediente,
    concat(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_paciente,
    a.tipo_alerta,
    a.mensaje,
    a.fecha_alerta,
    concat(pm.nombre, ' ', pm.apellido_paterno) AS medico_responsable
   FROM (((((public.expediente e
     JOIN public.paciente pac ON ((e.id_paciente = pac.id_paciente)))
     JOIN public.persona p ON ((pac.id_persona = p.id_persona)))
     JOIN public.alertas_sistema a ON ((e.id_expediente = a.id_expediente)))
     LEFT JOIN public.personal_medico pm_person ON ((a.id_medico = pm_person.id_personal_medico)))
     LEFT JOIN public.persona pm ON ((pm_person.id_persona = pm.id_persona)))
  WHERE (a.estado = 'ACTIVA'::text);


ALTER VIEW public.expedientes_con_alertas OWNER TO postgres;

--
-- Name: guia_clinica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guia_clinica (
    id_guia_diagnostico integer NOT NULL,
    area text,
    codigo text,
    nombre text NOT NULL,
    fuente text,
    fecha_actualizacion date,
    descripcion text,
    activo boolean DEFAULT true
);


ALTER TABLE public.guia_clinica OWNER TO postgres;

--
-- Name: guia_clinica_id_guia_diagnostico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guia_clinica_id_guia_diagnostico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guia_clinica_id_guia_diagnostico_seq OWNER TO postgres;

--
-- Name: guia_clinica_id_guia_diagnostico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guia_clinica_id_guia_diagnostico_seq OWNED BY public.guia_clinica.id_guia_diagnostico;


--
-- Name: historia_clinica_id_historia_clinica_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historia_clinica_id_historia_clinica_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historia_clinica_id_historia_clinica_seq OWNER TO postgres;

--
-- Name: historia_clinica_id_historia_clinica_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historia_clinica_id_historia_clinica_seq OWNED BY public.historia_clinica.id_historia_clinica;


--
-- Name: inmunizaciones_id_inmunizacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inmunizaciones_id_inmunizacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inmunizaciones_id_inmunizacion_seq OWNER TO postgres;

--
-- Name: inmunizaciones_id_inmunizacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inmunizaciones_id_inmunizacion_seq OWNED BY public.inmunizaciones.id_inmunizacion;


--
-- Name: internamiento_id_internamiento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.internamiento_id_internamiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.internamiento_id_internamiento_seq OWNER TO postgres;

--
-- Name: internamiento_id_internamiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.internamiento_id_internamiento_seq OWNED BY public.internamiento.id_internamiento;


--
-- Name: medicamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicamento (
    id_medicamento integer NOT NULL,
    codigo text,
    nombre text NOT NULL,
    presentacion text,
    concentracion text,
    grupo_terapeutico text,
    activo boolean DEFAULT true
);


ALTER TABLE public.medicamento OWNER TO postgres;

--
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medicamento_id_medicamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medicamento_id_medicamento_seq OWNER TO postgres;

--
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medicamento_id_medicamento_seq OWNED BY public.medicamento.id_medicamento;


--
-- Name: nota_egreso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_egreso (
    id_nota_egreso integer NOT NULL,
    id_documento integer NOT NULL,
    diagnostico_ingreso text,
    resumen_evolucion text,
    manejo_hospitalario text,
    diagnostico_egreso text,
    id_guia_diagnostico integer,
    procedimientos_realizados text,
    fecha_procedimientos date,
    motivo_egreso text,
    problemas_pendientes text,
    plan_tratamiento text,
    recomendaciones_vigilancia text,
    atencion_factores_riesgo text,
    pronostico text,
    reingreso_por_misma_afeccion boolean DEFAULT false
);


ALTER TABLE public.nota_egreso OWNER TO postgres;

--
-- Name: nota_egreso_id_nota_egreso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_egreso_id_nota_egreso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_egreso_id_nota_egreso_seq OWNER TO postgres;

--
-- Name: nota_egreso_id_nota_egreso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_egreso_id_nota_egreso_seq OWNED BY public.nota_egreso.id_nota_egreso;


--
-- Name: nota_evolucion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_evolucion (
    id_nota_evolucion integer NOT NULL,
    id_documento integer NOT NULL,
    dias_hospitalizacion integer,
    fecha_ultimo_ingreso date,
    temperatura numeric(4,2),
    frecuencia_cardiaca integer,
    frecuencia_respiratoria integer,
    presion_arterial_sistolica integer,
    presion_arterial_diastolica integer,
    saturacion_oxigeno integer,
    peso_actual numeric(5,2),
    talla_actual numeric(5,2),
    sintomas_signos text NOT NULL,
    habitus_exterior text NOT NULL,
    exploracion_cabeza text,
    exploracion_cuello text,
    exploracion_torax text,
    exploracion_abdomen text,
    exploracion_extremidades text,
    exploracion_columna text,
    exploracion_genitales text,
    exploracion_neurologico text,
    estado_nutricional text NOT NULL,
    estudios_laboratorio_gabinete text NOT NULL,
    evolucion_analisis text NOT NULL,
    diagnosticos text NOT NULL,
    diagnosticos_guias text,
    plan_estudios_tratamiento text NOT NULL,
    interconsultas text DEFAULT 'No se solicitaron interconsultas en esta evolución'::text,
    pronostico text NOT NULL,
    indicaciones_medicas text,
    fecha_elaboracion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    observaciones_adicionales text,
    id_guia_diagnostico integer
);


ALTER TABLE public.nota_evolucion OWNER TO postgres;

--
-- Name: TABLE nota_evolucion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.nota_evolucion IS 'Tabla de notas de evolución con formato específico del Hospital San Luis de la Paz';


--
-- Name: COLUMN nota_evolucion.dias_hospitalizacion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.dias_hospitalizacion IS 'Días de estancia hospitalaria - calculado automáticamente';


--
-- Name: COLUMN nota_evolucion.sintomas_signos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.sintomas_signos IS 'Campo obligatorio - SIGNOS Y SINTOMAS';


--
-- Name: COLUMN nota_evolucion.habitus_exterior; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.habitus_exterior IS 'Campo obligatorio - HABITUS EXTERIOR';


--
-- Name: COLUMN nota_evolucion.estado_nutricional; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.estado_nutricional IS 'Campo obligatorio - ESTADO NUTRICIONAL';


--
-- Name: COLUMN nota_evolucion.estudios_laboratorio_gabinete; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.estudios_laboratorio_gabinete IS 'Campo obligatorio - ESTUDIOS DE LABORATORIO Y GABINETE';


--
-- Name: COLUMN nota_evolucion.evolucion_analisis; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.evolucion_analisis IS 'Campo obligatorio - EVOLUCIÓN Y ACTUALIZACIÓN DE CUADRO CLÍNICO';


--
-- Name: COLUMN nota_evolucion.diagnosticos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.diagnosticos IS 'Campo obligatorio - DIAGNÓSTICOS';


--
-- Name: COLUMN nota_evolucion.plan_estudios_tratamiento; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.plan_estudios_tratamiento IS 'Campo obligatorio - PLAN DE ESTUDIOS Y/O TRATAMIENTO';


--
-- Name: COLUMN nota_evolucion.interconsultas; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.interconsultas IS 'Campo opcional - por defecto indica que no hubo interconsultas';


--
-- Name: COLUMN nota_evolucion.pronostico; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nota_evolucion.pronostico IS 'Campo obligatorio - PRONÓSTICO';


--
-- Name: nota_evolucion_id_nota_evolucion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_evolucion_id_nota_evolucion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_evolucion_id_nota_evolucion_seq OWNER TO postgres;

--
-- Name: nota_evolucion_id_nota_evolucion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_evolucion_id_nota_evolucion_seq OWNED BY public.nota_evolucion.id_nota_evolucion;


--
-- Name: nota_interconsulta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_interconsulta (
    id_nota_interconsulta integer NOT NULL,
    id_documento integer NOT NULL,
    area_interconsulta integer,
    motivo_interconsulta text NOT NULL,
    diagnostico_presuntivo text,
    examenes_laboratorio boolean DEFAULT false,
    examenes_gabinete boolean DEFAULT false,
    hallazgos text,
    impresion_diagnostica text,
    recomendaciones text,
    id_medico_solicitante integer,
    id_medico_interconsulta integer
);


ALTER TABLE public.nota_interconsulta OWNER TO postgres;

--
-- Name: nota_interconsulta_id_nota_interconsulta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_interconsulta_id_nota_interconsulta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_interconsulta_id_nota_interconsulta_seq OWNER TO postgres;

--
-- Name: nota_interconsulta_id_nota_interconsulta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_interconsulta_id_nota_interconsulta_seq OWNED BY public.nota_interconsulta.id_nota_interconsulta;


--
-- Name: nota_nutricion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_nutricion (
    id_nota_nutricion integer NOT NULL,
    id_documento integer NOT NULL,
    diagnostico_nutricional text,
    estado_nutricional text,
    requerimientos_caloricos numeric(10,2),
    requerimientos_proteicos numeric(10,2),
    indicaciones_dieta text,
    plan_manejo_nutricional text,
    factores_riesgo_nutricional text,
    suplementos_recomendados text,
    pronostico text
);


ALTER TABLE public.nota_nutricion OWNER TO postgres;

--
-- Name: nota_nutricion_id_nota_nutricion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_nutricion_id_nota_nutricion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_nutricion_id_nota_nutricion_seq OWNER TO postgres;

--
-- Name: nota_nutricion_id_nota_nutricion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_nutricion_id_nota_nutricion_seq OWNED BY public.nota_nutricion.id_nota_nutricion;


--
-- Name: nota_postanestesica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_postanestesica (
    id_nota_postanestesica integer NOT NULL,
    id_documento integer NOT NULL,
    tipo_anestesia text,
    duracion_anestesia integer,
    medicamentos_utilizados text,
    estado_clinico_egreso text,
    incidentes_accidentes text,
    balance_hidrico text,
    liquidos_administrados numeric(10,2),
    sangrado numeric(10,2),
    hemoderivados_transfundidos text,
    plan_tratamiento text,
    pronostico text,
    id_anestesiologo integer,
    fecha_cirugia date,
    hora_inicio time without time zone,
    hora_termino time without time zone,
    quirofano character varying(20),
    procedimiento_realizado text,
    clasificacion_asa character varying(10),
    presion_arterial_egreso character varying(20),
    frecuencia_cardiaca_egreso integer,
    frecuencia_respiratoria_egreso integer,
    saturacion_oxigeno_egreso integer,
    temperatura_egreso numeric(4,1),
    aldrete_actividad integer DEFAULT 2,
    aldrete_respiracion integer DEFAULT 2,
    aldrete_circulacion integer DEFAULT 2,
    aldrete_conciencia integer DEFAULT 2,
    aldrete_saturacion integer DEFAULT 2
);


ALTER TABLE public.nota_postanestesica OWNER TO postgres;

--
-- Name: nota_postanestesica_id_nota_postanestesica_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_postanestesica_id_nota_postanestesica_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_postanestesica_id_nota_postanestesica_seq OWNER TO postgres;

--
-- Name: nota_postanestesica_id_nota_postanestesica_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_postanestesica_id_nota_postanestesica_seq OWNED BY public.nota_postanestesica.id_nota_postanestesica;


--
-- Name: nota_postoperatoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_postoperatoria (
    id_nota_postoperatoria integer NOT NULL,
    id_documento integer NOT NULL,
    fecha_cirugia date,
    diagnostico_postoperatorio text,
    operacion_realizada text,
    descripcion_tecnica text,
    hallazgos text,
    conteo_gasas_completo boolean,
    incidentes_accidentes text,
    sangrado numeric(10,2),
    estado_postquirurgico text,
    piezas_enviadas_patologia text,
    plan_postoperatorio text,
    pronostico text,
    id_cirujano integer,
    id_ayudante1 integer,
    id_ayudante2 integer,
    id_anestesiologo integer,
    id_instrumentista text,
    id_circulante text
);


ALTER TABLE public.nota_postoperatoria OWNER TO postgres;

--
-- Name: nota_postoperatoria_id_nota_postoperatoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_postoperatoria_id_nota_postoperatoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_postoperatoria_id_nota_postoperatoria_seq OWNER TO postgres;

--
-- Name: nota_postoperatoria_id_nota_postoperatoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_postoperatoria_id_nota_postoperatoria_seq OWNED BY public.nota_postoperatoria.id_nota_postoperatoria;


--
-- Name: nota_preanestesica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_preanestesica (
    id_nota_preanestesica integer NOT NULL,
    id_documento integer NOT NULL,
    fecha_cirugia date,
    antecedentes_anestesicos text,
    valoracion_via_aerea text,
    clasificacion_asa text,
    plan_anestesico text,
    riesgo_anestesico text,
    medicacion_preanestesica text,
    id_anestesiologo integer
);


ALTER TABLE public.nota_preanestesica OWNER TO postgres;

--
-- Name: nota_preanestesica_id_nota_preanestesica_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_preanestesica_id_nota_preanestesica_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_preanestesica_id_nota_preanestesica_seq OWNER TO postgres;

--
-- Name: nota_preanestesica_id_nota_preanestesica_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_preanestesica_id_nota_preanestesica_seq OWNED BY public.nota_preanestesica.id_nota_preanestesica;


--
-- Name: nota_preoperatoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_preoperatoria (
    id_nota_preoperatoria integer NOT NULL,
    id_documento integer NOT NULL,
    fecha_cirugia date,
    resumen_interrogatorio text,
    exploracion_fisica text,
    resultados_estudios text,
    diagnostico_preoperatorio text,
    id_guia_diagnostico integer,
    plan_quirurgico text,
    plan_terapeutico_preoperatorio text,
    pronostico text,
    tipo_cirugia text,
    riesgo_quirurgico text
);


ALTER TABLE public.nota_preoperatoria OWNER TO postgres;

--
-- Name: nota_preoperatoria_id_nota_preoperatoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_preoperatoria_id_nota_preoperatoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_preoperatoria_id_nota_preoperatoria_seq OWNER TO postgres;

--
-- Name: nota_preoperatoria_id_nota_preoperatoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_preoperatoria_id_nota_preoperatoria_seq OWNED BY public.nota_preoperatoria.id_nota_preoperatoria;


--
-- Name: nota_psicologia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_psicologia (
    id_nota_psicologia integer NOT NULL,
    id_documento integer NOT NULL,
    motivo_consulta text,
    impresion_diagnostica text,
    evaluacion_mental_afectiva text,
    evaluacion_cognitiva text,
    plan_terapeutico text,
    pronostico text,
    recomendaciones text
);


ALTER TABLE public.nota_psicologia OWNER TO postgres;

--
-- Name: nota_psicologia_id_nota_psicologia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_psicologia_id_nota_psicologia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_psicologia_id_nota_psicologia_seq OWNER TO postgres;

--
-- Name: nota_psicologia_id_nota_psicologia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_psicologia_id_nota_psicologia_seq OWNED BY public.nota_psicologia.id_nota_psicologia;


--
-- Name: nota_urgencias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_urgencias (
    id_nota_urgencias integer NOT NULL,
    id_documento integer NOT NULL,
    motivo_atencion text NOT NULL,
    estado_conciencia text,
    resumen_interrogatorio text,
    exploracion_fisica text,
    resultados_estudios text,
    estado_mental text,
    diagnostico text,
    id_guia_diagnostico integer,
    plan_tratamiento text,
    pronostico text,
    area_interconsulta integer
);


ALTER TABLE public.nota_urgencias OWNER TO postgres;

--
-- Name: nota_urgencias_id_nota_urgencias_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_urgencias_id_nota_urgencias_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_urgencias_id_nota_urgencias_seq OWNER TO postgres;

--
-- Name: nota_urgencias_id_nota_urgencias_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_urgencias_id_nota_urgencias_seq OWNED BY public.nota_urgencias.id_nota_urgencias;


--
-- Name: paciente_id_paciente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paciente_id_paciente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paciente_id_paciente_seq OWNER TO postgres;

--
-- Name: paciente_id_paciente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paciente_id_paciente_seq OWNED BY public.paciente.id_paciente;


--
-- Name: pacientes_pediatricos_activos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.pacientes_pediatricos_activos AS
 SELECT e.numero_expediente,
    concat(per.nombre, ' ', per.apellido_paterno, ' ', per.apellido_materno) AS nombre_completo,
    public.edad_en_anos(per.fecha_nacimiento) AS edad_anos,
    public.edad_total_meses(per.fecha_nacimiento) AS edad_total_meses,
    per.sexo,
    pac.nombre_madre,
    pac.nombre_padre,
    i.fecha_ingreso,
    s.nombre AS servicio_actual,
    c.numero AS cama_actual
   FROM (((((public.expediente e
     JOIN public.paciente pac ON ((e.id_paciente = pac.id_paciente)))
     JOIN public.persona per ON ((pac.id_persona = per.id_persona)))
     LEFT JOIN public.internamiento i ON (((e.id_expediente = i.id_expediente) AND (i.fecha_egreso IS NULL))))
     LEFT JOIN public.servicio s ON ((i.id_servicio = s.id_servicio)))
     LEFT JOIN public.cama c ON ((i.id_cama = c.id_cama)))
  WHERE ((per.es_pediatrico = true) AND (e.estado = 'Activo'::text))
  ORDER BY per.fecha_nacimiento DESC;


ALTER VIEW public.pacientes_pediatricos_activos OWNER TO postgres;

--
-- Name: VIEW pacientes_pediatricos_activos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.pacientes_pediatricos_activos IS 'Vista especializada para el área pediátrica';


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id_reset_token integer NOT NULL,
    email character varying(255) NOT NULL,
    tipo_usuario character varying(50) NOT NULL,
    id_usuario_referencia integer,
    token character varying(255) NOT NULL,
    token_hash character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    ip_solicitud inet,
    user_agent text,
    attempts_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    invalidated_reason text,
    CONSTRAINT password_reset_tokens_tipo_usuario_check CHECK (((tipo_usuario)::text = ANY (ARRAY[('medico'::character varying)::text, ('administrador'::character varying)::text])))
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: TABLE password_reset_tokens; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.password_reset_tokens IS 'Tabla para gestionar tokens de recuperación de contraseña del sistema SICEG';


--
-- Name: COLUMN password_reset_tokens.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.password_reset_tokens.email IS 'Email del usuario que solicita la recuperación';


--
-- Name: COLUMN password_reset_tokens.tipo_usuario; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.password_reset_tokens.tipo_usuario IS 'Tipo de usuario: medico o administrador';


--
-- Name: COLUMN password_reset_tokens.token; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.password_reset_tokens.token IS 'Token único para la recuperación (URL-safe)';


--
-- Name: COLUMN password_reset_tokens.expires_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.password_reset_tokens.expires_at IS 'Fecha y hora de expiración del token';


--
-- Name: COLUMN password_reset_tokens.attempts_count; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.password_reset_tokens.attempts_count IS 'Número de intentos de uso del token';


--
-- Name: password_reset_tokens_id_reset_token_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_reset_token_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_reset_token_seq OWNER TO postgres;

--
-- Name: password_reset_tokens_id_reset_token_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_reset_token_seq OWNED BY public.password_reset_tokens.id_reset_token;


--
-- Name: persona_id_persona_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.persona_id_persona_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.persona_id_persona_seq OWNER TO postgres;

--
-- Name: persona_id_persona_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.persona_id_persona_seq OWNED BY public.persona.id_persona;


--
-- Name: personal_medico_id_personal_medico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_medico_id_personal_medico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_medico_id_personal_medico_seq OWNER TO postgres;

--
-- Name: personal_medico_id_personal_medico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_medico_id_personal_medico_seq OWNED BY public.personal_medico.id_personal_medico;


--
-- Name: prescripcion_medicamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescripcion_medicamento (
    id_prescripcion integer NOT NULL,
    id_documento integer,
    id_medicamento integer,
    dosis text NOT NULL,
    via_administracion text NOT NULL,
    frecuencia text NOT NULL,
    duracion text,
    indicaciones_especiales text,
    fecha_inicio date NOT NULL,
    fecha_fin date,
    activo boolean DEFAULT true
);


ALTER TABLE public.prescripcion_medicamento OWNER TO postgres;

--
-- Name: prescripcion_medicamento_id_prescripcion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescripcion_medicamento_id_prescripcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescripcion_medicamento_id_prescripcion_seq OWNER TO postgres;

--
-- Name: prescripcion_medicamento_id_prescripcion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescripcion_medicamento_id_prescripcion_seq OWNED BY public.prescripcion_medicamento.id_prescripcion;


--
-- Name: referencia_traslado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referencia_traslado (
    id_referencia integer NOT NULL,
    id_documento integer NOT NULL,
    establecimiento_origen text,
    establecimiento_destino text,
    motivo_envio text,
    resumen_clinico text,
    diagnostico text,
    id_guia_diagnostico integer,
    plan_tratamiento text,
    estado_fisico text,
    pronostico text,
    tipo_traslado text,
    medico_receptor text,
    observaciones text
);


ALTER TABLE public.referencia_traslado OWNER TO postgres;

--
-- Name: referencia_traslado_id_referencia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.referencia_traslado_id_referencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.referencia_traslado_id_referencia_seq OWNER TO postgres;

--
-- Name: referencia_traslado_id_referencia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.referencia_traslado_id_referencia_seq OWNED BY public.referencia_traslado.id_referencia;


--
-- Name: registro_transfusion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registro_transfusion (
    id_transfusion integer NOT NULL,
    id_documento integer,
    tipo_componente text NOT NULL,
    grupo_sanguineo character varying(10) NOT NULL,
    numero_unidad text NOT NULL,
    volumen numeric(10,2),
    fecha_inicio timestamp without time zone NOT NULL,
    fecha_fin timestamp without time zone,
    id_medico_responsable integer,
    reacciones_adversas text,
    observaciones text
);


ALTER TABLE public.registro_transfusion OWNER TO postgres;

--
-- Name: registro_transfusion_id_transfusion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registro_transfusion_id_transfusion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registro_transfusion_id_transfusion_seq OWNER TO postgres;

--
-- Name: registro_transfusion_id_transfusion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registro_transfusion_id_transfusion_seq OWNED BY public.registro_transfusion.id_transfusion;


--
-- Name: resumen_camas_servicio; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.resumen_camas_servicio AS
 SELECT s.nombre AS servicio,
    count(*) AS total_camas,
    count(
        CASE
            WHEN (c.estado = 'Disponible'::public.estado_cama_enum) THEN 1
            ELSE NULL::integer
        END) AS disponibles,
    count(
        CASE
            WHEN (c.estado = 'Ocupada'::public.estado_cama_enum) THEN 1
            ELSE NULL::integer
        END) AS ocupadas,
    count(
        CASE
            WHEN (c.estado = 'Mantenimiento'::public.estado_cama_enum) THEN 1
            ELSE NULL::integer
        END) AS mantenimiento,
    count(
        CASE
            WHEN (c.estado = 'Reservada'::public.estado_cama_enum) THEN 1
            ELSE NULL::integer
        END) AS reservadas,
    round((((count(
        CASE
            WHEN (c.estado = 'Ocupada'::public.estado_cama_enum) THEN 1
            ELSE NULL::integer
        END))::numeric / (NULLIF(count(
        CASE
            WHEN (c.estado = ANY (ARRAY['Disponible'::public.estado_cama_enum, 'Ocupada'::public.estado_cama_enum])) THEN 1
            ELSE NULL::integer
        END), 0))::numeric) * (100)::numeric), 2) AS porcentaje_ocupacion
   FROM (public.servicio s
     LEFT JOIN public.cama c ON ((s.id_servicio = c.id_servicio)))
  GROUP BY s.id_servicio, s.nombre
  ORDER BY s.nombre;


ALTER VIEW public.resumen_camas_servicio OWNER TO postgres;

--
-- Name: VIEW resumen_camas_servicio; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.resumen_camas_servicio IS 'Vista para dashboard de ocupación de camas por servicio';


--
-- Name: servicio_id_servicio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicio_id_servicio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicio_id_servicio_seq OWNER TO postgres;

--
-- Name: servicio_id_servicio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicio_id_servicio_seq OWNED BY public.servicio.id_servicio;


--
-- Name: signos_vitales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signos_vitales (
    id_signos_vitales integer NOT NULL,
    id_documento integer,
    fecha_toma timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    temperatura numeric(5,2),
    presion_arterial_sistolica integer,
    presion_arterial_diastolica integer,
    frecuencia_cardiaca integer,
    frecuencia_respiratoria integer,
    saturacion_oxigeno integer,
    glucosa integer,
    peso numeric(5,2),
    talla numeric(5,2),
    imc numeric(5,2),
    observaciones text
);


ALTER TABLE public.signos_vitales OWNER TO postgres;

--
-- Name: signos_vitales_id_signos_vitales_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.signos_vitales_id_signos_vitales_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.signos_vitales_id_signos_vitales_seq OWNER TO postgres;

--
-- Name: signos_vitales_id_signos_vitales_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.signos_vitales_id_signos_vitales_seq OWNED BY public.signos_vitales.id_signos_vitales;


--
-- Name: solicitud_estudio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitud_estudio (
    id_solicitud integer NOT NULL,
    id_documento integer NOT NULL,
    id_estudio integer,
    justificacion text,
    preparacion_requerida text,
    informacion_clinica_relevante text,
    fecha_solicitada date NOT NULL,
    prioridad text DEFAULT 'Normal'::text,
    fecha_realizacion date,
    hora_toma_muestra time without time zone,
    resultado text,
    interpretacion text,
    estado text DEFAULT 'Solicitado'::text
);


ALTER TABLE public.solicitud_estudio OWNER TO postgres;

--
-- Name: solicitud_estudio_id_solicitud_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitud_estudio_id_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitud_estudio_id_solicitud_seq OWNER TO postgres;

--
-- Name: solicitud_estudio_id_solicitud_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitud_estudio_id_solicitud_seq OWNED BY public.solicitud_estudio.id_solicitud;


--
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_documento_id_tipo_documento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_documento_id_tipo_documento_seq OWNER TO postgres;

--
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_documento_id_tipo_documento_seq OWNED BY public.tipo_documento.id_tipo_documento;


--
-- Name: tipo_sangre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_sangre (
    id_tipo_sangre integer NOT NULL,
    nombre character varying(10) NOT NULL,
    descripcion text
);


ALTER TABLE public.tipo_sangre OWNER TO postgres;

--
-- Name: tipo_sangre_id_tipo_sangre_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_sangre_id_tipo_sangre_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_sangre_id_tipo_sangre_seq OWNER TO postgres;

--
-- Name: tipo_sangre_id_tipo_sangre_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_sangre_id_tipo_sangre_seq OWNED BY public.tipo_sangre.id_tipo_sangre;


--
-- Name: vacunas_adicionales_id_vacuna_adicional_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vacunas_adicionales_id_vacuna_adicional_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vacunas_adicionales_id_vacuna_adicional_seq OWNER TO postgres;

--
-- Name: vacunas_adicionales_id_vacuna_adicional_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vacunas_adicionales_id_vacuna_adicional_seq OWNED BY public.vacunas_adicionales.id_vacuna_adicional;


--
-- Name: validacion_reingreso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.validacion_reingreso (
    id_validacion integer NOT NULL,
    id_expediente integer NOT NULL,
    id_internamiento integer NOT NULL,
    fecha_validacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_medico_validador integer NOT NULL,
    peso_actual numeric(5,2) NOT NULL,
    talla_actual numeric(5,2) NOT NULL,
    presion_arterial_sistolica integer NOT NULL,
    presion_arterial_diastolica integer NOT NULL,
    temperatura numeric(4,2) NOT NULL,
    alergias_confirmadas text NOT NULL,
    medicamentos_actuales text NOT NULL,
    contacto_emergencia_actual text NOT NULL,
    solicita_acceso_historico boolean DEFAULT false,
    justificacion_acceso text,
    acceso_historico_aprobado boolean DEFAULT false,
    fecha_aprobacion_acceso timestamp without time zone,
    validacion_completa boolean DEFAULT false,
    observaciones_validacion text
);


ALTER TABLE public.validacion_reingreso OWNER TO postgres;

--
-- Name: TABLE validacion_reingreso; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.validacion_reingreso IS 'Validaciones obligatorias en reingresos de pacientes.';


--
-- Name: validacion_reingreso_id_validacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.validacion_reingreso_id_validacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.validacion_reingreso_id_validacion_seq OWNER TO postgres;

--
-- Name: validacion_reingreso_id_validacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.validacion_reingreso_id_validacion_seq OWNED BY public.validacion_reingreso.id_validacion;


--
-- Name: vista_nota_evolucion_completa; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_nota_evolucion_completa AS
 SELECT ne.id_nota_evolucion,
    e.numero_expediente,
    concat(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_paciente,
    public.edad_en_anos(p.fecha_nacimiento) AS edad_anos,
    p.sexo,
    ne.dias_hospitalizacion,
    ne.fecha_ultimo_ingreso,
    concat('Temperatura: ', COALESCE((ne.temperatura)::text, 'No registrada'::text), ' °C, ', 'FC: ', COALESCE((ne.frecuencia_cardiaca)::text, 'No registrada'::text), ' lpm, ', 'FR: ', COALESCE((ne.frecuencia_respiratoria)::text, 'No registrada'::text), ' rpm, ', 'TA: ', COALESCE((ne.presion_arterial_sistolica)::text, 'No registrada'::text), '/', COALESCE((ne.presion_arterial_diastolica)::text, 'No registrada'::text), ' mmHg, ', 'SatO2: ', COALESCE((ne.saturacion_oxigeno)::text, 'No registrada'::text), '%, ', 'Peso: ', COALESCE((ne.peso_actual)::text, 'No registrado'::text), ' kg, ', 'Talla: ', COALESCE((ne.talla_actual)::text, 'No registrada'::text), ' cm') AS signos_vitales_formateados,
    ne.sintomas_signos,
    ne.habitus_exterior,
    ne.estado_nutricional,
    ne.estudios_laboratorio_gabinete,
    ne.evolucion_analisis,
    ne.diagnosticos,
    ne.diagnosticos_guias,
    ne.plan_estudios_tratamiento,
    ne.interconsultas,
    ne.pronostico,
    ne.indicaciones_medicas,
    concat(pm_p.nombre, ' ', pm_p.apellido_paterno) AS medico_elabora,
    dc.fecha_elaboracion,
    s.nombre AS servicio_actual,
    c.numero AS cama_actual
   FROM (((((((((public.nota_evolucion ne
     JOIN public.documento_clinico dc ON ((ne.id_documento = dc.id_documento)))
     JOIN public.expediente e ON ((dc.id_expediente = e.id_expediente)))
     JOIN public.paciente pac ON ((e.id_paciente = pac.id_paciente)))
     JOIN public.persona p ON ((pac.id_persona = p.id_persona)))
     LEFT JOIN public.personal_medico pm ON ((dc.id_personal_creador = pm.id_personal_medico)))
     LEFT JOIN public.persona pm_p ON ((pm.id_persona = pm_p.id_persona)))
     LEFT JOIN public.internamiento i ON (((e.id_expediente = i.id_expediente) AND (i.fecha_egreso IS NULL))))
     LEFT JOIN public.servicio s ON ((i.id_servicio = s.id_servicio)))
     LEFT JOIN public.cama c ON ((i.id_cama = c.id_cama)))
  ORDER BY dc.fecha_elaboracion DESC;


ALTER VIEW public.vista_nota_evolucion_completa OWNER TO postgres;

--
-- Name: vista_tokens_activos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_tokens_activos AS
 SELECT id_reset_token,
    email,
    tipo_usuario,
    created_at,
    expires_at,
    (EXTRACT(epoch FROM ((expires_at)::timestamp with time zone - now())) / (60)::numeric) AS minutos_restantes,
    attempts_count,
    ip_solicitud,
        CASE
            WHEN (expires_at < now()) THEN 'Expirado'::text
            WHEN (used_at IS NOT NULL) THEN 'Usado'::text
            WHEN (is_active = false) THEN 'Inactivo'::text
            ELSE 'Activo'::text
        END AS estado,
        CASE
            WHEN ((tipo_usuario)::text = 'medico'::text) THEN ( SELECT concat(p.nombre, ' ', p.apellido_paterno) AS concat
               FROM (public.personal_medico pm
                 JOIN public.persona p ON ((pm.id_persona = p.id_persona)))
              WHERE (pm.id_personal_medico = prt.id_usuario_referencia))
            WHEN ((tipo_usuario)::text = 'administrador'::text) THEN ( SELECT concat(p.nombre, ' ', p.apellido_paterno) AS concat
               FROM (public.administrador a
                 JOIN public.persona p ON ((a.id_persona = p.id_persona)))
              WHERE (a.id_administrador = prt.id_usuario_referencia))
            ELSE NULL::text
        END AS nombre_usuario
   FROM public.password_reset_tokens prt
  WHERE (is_active = true)
  ORDER BY created_at DESC;


ALTER VIEW public.vista_tokens_activos OWNER TO postgres;

--
-- Name: administrador id_administrador; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador ALTER COLUMN id_administrador SET DEFAULT nextval('public.administrador_id_administrador_seq'::regclass);


--
-- Name: alertas_sistema id_alerta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_sistema ALTER COLUMN id_alerta SET DEFAULT nextval('public.alertas_sistema_id_alerta_seq'::regclass);


--
-- Name: antecedentes_heredo_familiares id_antecedentes_hf; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedentes_heredo_familiares ALTER COLUMN id_antecedentes_hf SET DEFAULT nextval('public.antecedentes_heredo_familiares_id_antecedentes_hf_seq'::regclass);


--
-- Name: antecedentes_perinatales id_perinatales; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedentes_perinatales ALTER COLUMN id_perinatales SET DEFAULT nextval('public.antecedentes_perinatales_id_perinatales_seq'::regclass);


--
-- Name: area_interconsulta id_area_interconsulta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.area_interconsulta ALTER COLUMN id_area_interconsulta SET DEFAULT nextval('public.area_interconsulta_id_area_interconsulta_seq'::regclass);


--
-- Name: cama id_cama; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cama ALTER COLUMN id_cama SET DEFAULT nextval('public.cama_id_cama_seq'::regclass);


--
-- Name: catalogo_vacunas id_vacuna; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_vacunas ALTER COLUMN id_vacuna SET DEFAULT nextval('public.catalogo_vacunas_id_vacuna_seq'::regclass);


--
-- Name: configuracion_sistema id_config; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sistema ALTER COLUMN id_config SET DEFAULT nextval('public.configuracion_sistema_id_config_seq'::regclass);


--
-- Name: consentimiento_informado id_consentimiento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consentimiento_informado ALTER COLUMN id_consentimiento SET DEFAULT nextval('public.consentimiento_informado_id_consentimiento_seq'::regclass);


--
-- Name: control_acceso_historico id_control; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_acceso_historico ALTER COLUMN id_control SET DEFAULT nextval('public.control_acceso_historico_id_control_seq'::regclass);


--
-- Name: desarrollo_psicomotriz id_desarrollo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desarrollo_psicomotriz ALTER COLUMN id_desarrollo SET DEFAULT nextval('public.desarrollo_psicomotriz_id_desarrollo_seq'::regclass);


--
-- Name: documento_clinico id_documento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_clinico ALTER COLUMN id_documento SET DEFAULT nextval('public.documento_clinico_id_documento_seq'::regclass);


--
-- Name: estado_nutricional_pediatrico id_nutricional; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_nutricional_pediatrico ALTER COLUMN id_nutricional SET DEFAULT nextval('public.estado_nutricional_pediatrico_id_nutricional_seq'::regclass);


--
-- Name: estudio_medico id_estudio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudio_medico ALTER COLUMN id_estudio SET DEFAULT nextval('public.estudio_medico_id_estudio_seq'::regclass);


--
-- Name: expediente id_expediente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente ALTER COLUMN id_expediente SET DEFAULT nextval('public.expediente_id_expediente_seq'::regclass);


--
-- Name: expediente_auditoria id_auditoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente_auditoria ALTER COLUMN id_auditoria SET DEFAULT nextval('public.expediente_auditoria_id_auditoria_seq'::regclass);


--
-- Name: guia_clinica id_guia_diagnostico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guia_clinica ALTER COLUMN id_guia_diagnostico SET DEFAULT nextval('public.guia_clinica_id_guia_diagnostico_seq'::regclass);


--
-- Name: historia_clinica id_historia_clinica; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historia_clinica ALTER COLUMN id_historia_clinica SET DEFAULT nextval('public.historia_clinica_id_historia_clinica_seq'::regclass);


--
-- Name: inmunizaciones id_inmunizacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inmunizaciones ALTER COLUMN id_inmunizacion SET DEFAULT nextval('public.inmunizaciones_id_inmunizacion_seq'::regclass);


--
-- Name: internamiento id_internamiento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internamiento ALTER COLUMN id_internamiento SET DEFAULT nextval('public.internamiento_id_internamiento_seq'::regclass);


--
-- Name: medicamento id_medicamento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamento ALTER COLUMN id_medicamento SET DEFAULT nextval('public.medicamento_id_medicamento_seq'::regclass);


--
-- Name: nota_egreso id_nota_egreso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_egreso ALTER COLUMN id_nota_egreso SET DEFAULT nextval('public.nota_egreso_id_nota_egreso_seq'::regclass);


--
-- Name: nota_evolucion id_nota_evolucion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_evolucion ALTER COLUMN id_nota_evolucion SET DEFAULT nextval('public.nota_evolucion_id_nota_evolucion_seq'::regclass);


--
-- Name: nota_interconsulta id_nota_interconsulta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_interconsulta ALTER COLUMN id_nota_interconsulta SET DEFAULT nextval('public.nota_interconsulta_id_nota_interconsulta_seq'::regclass);


--
-- Name: nota_nutricion id_nota_nutricion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_nutricion ALTER COLUMN id_nota_nutricion SET DEFAULT nextval('public.nota_nutricion_id_nota_nutricion_seq'::regclass);


--
-- Name: nota_postanestesica id_nota_postanestesica; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postanestesica ALTER COLUMN id_nota_postanestesica SET DEFAULT nextval('public.nota_postanestesica_id_nota_postanestesica_seq'::regclass);


--
-- Name: nota_postoperatoria id_nota_postoperatoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postoperatoria ALTER COLUMN id_nota_postoperatoria SET DEFAULT nextval('public.nota_postoperatoria_id_nota_postoperatoria_seq'::regclass);


--
-- Name: nota_preanestesica id_nota_preanestesica; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_preanestesica ALTER COLUMN id_nota_preanestesica SET DEFAULT nextval('public.nota_preanestesica_id_nota_preanestesica_seq'::regclass);


--
-- Name: nota_preoperatoria id_nota_preoperatoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_preoperatoria ALTER COLUMN id_nota_preoperatoria SET DEFAULT nextval('public.nota_preoperatoria_id_nota_preoperatoria_seq'::regclass);


--
-- Name: nota_psicologia id_nota_psicologia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_psicologia ALTER COLUMN id_nota_psicologia SET DEFAULT nextval('public.nota_psicologia_id_nota_psicologia_seq'::regclass);


--
-- Name: nota_urgencias id_nota_urgencias; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_urgencias ALTER COLUMN id_nota_urgencias SET DEFAULT nextval('public.nota_urgencias_id_nota_urgencias_seq'::regclass);


--
-- Name: paciente id_paciente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente ALTER COLUMN id_paciente SET DEFAULT nextval('public.paciente_id_paciente_seq'::regclass);


--
-- Name: password_reset_tokens id_reset_token; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id_reset_token SET DEFAULT nextval('public.password_reset_tokens_id_reset_token_seq'::regclass);


--
-- Name: persona id_persona; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona ALTER COLUMN id_persona SET DEFAULT nextval('public.persona_id_persona_seq'::regclass);


--
-- Name: personal_medico id_personal_medico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_medico ALTER COLUMN id_personal_medico SET DEFAULT nextval('public.personal_medico_id_personal_medico_seq'::regclass);


--
-- Name: prescripcion_medicamento id_prescripcion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescripcion_medicamento ALTER COLUMN id_prescripcion SET DEFAULT nextval('public.prescripcion_medicamento_id_prescripcion_seq'::regclass);


--
-- Name: referencia_traslado id_referencia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referencia_traslado ALTER COLUMN id_referencia SET DEFAULT nextval('public.referencia_traslado_id_referencia_seq'::regclass);


--
-- Name: registro_transfusion id_transfusion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_transfusion ALTER COLUMN id_transfusion SET DEFAULT nextval('public.registro_transfusion_id_transfusion_seq'::regclass);


--
-- Name: servicio id_servicio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicio ALTER COLUMN id_servicio SET DEFAULT nextval('public.servicio_id_servicio_seq'::regclass);


--
-- Name: signos_vitales id_signos_vitales; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signos_vitales ALTER COLUMN id_signos_vitales SET DEFAULT nextval('public.signos_vitales_id_signos_vitales_seq'::regclass);


--
-- Name: solicitud_estudio id_solicitud; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_estudio ALTER COLUMN id_solicitud SET DEFAULT nextval('public.solicitud_estudio_id_solicitud_seq'::regclass);


--
-- Name: tipo_documento id_tipo_documento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_documento ALTER COLUMN id_tipo_documento SET DEFAULT nextval('public.tipo_documento_id_tipo_documento_seq'::regclass);


--
-- Name: tipo_sangre id_tipo_sangre; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_sangre ALTER COLUMN id_tipo_sangre SET DEFAULT nextval('public.tipo_sangre_id_tipo_sangre_seq'::regclass);


--
-- Name: vacunas_adicionales id_vacuna_adicional; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacunas_adicionales ALTER COLUMN id_vacuna_adicional SET DEFAULT nextval('public.vacunas_adicionales_id_vacuna_adicional_seq'::regclass);


--
-- Name: validacion_reingreso id_validacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validacion_reingreso ALTER COLUMN id_validacion SET DEFAULT nextval('public.validacion_reingreso_id_validacion_seq'::regclass);


--
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.administrador VALUES (5, 55, 'Benito', '$2b$10$79N1skB1i7Ev45G/nNPeJeMUGmRvzGa6HoLdhlJZfRguRMfZ4c/Iu', 1, true, NULL, '123456', NULL, '2025-08-11 08:50:11.399236');
INSERT INTO public.administrador VALUES (1, 31, 'admin.direccion', '$2b$10$8K7hFGtxQ2mNvBcWeLzXZuX.Hv3jKpMnY5tGfRsT6wQcPdLmE9rSu', 2, false, NULL, 'admin123', NULL, '2025-08-11 08:50:19.673521');
INSERT INTO public.administrador VALUES (2, 32, 'admin.general', '$2b$10$9L8iFHuxyR3nOwCdXfMyAtY.Iv4kLqNoZ6uHgStU7xRdQeLnF0sTv', 2, false, NULL, 'admin123', NULL, '2025-08-11 09:12:26.773882');
INSERT INTO public.administrador VALUES (3, 33, 'admin.sistemas', '$2b$10$0M9jGIvyzS4oRxDeYgNzBuZ.Jw5lMrOpA7vIhTuV8ySeRfMoG1tTw', 3, false, NULL, 'admin123', NULL, '2025-08-11 09:12:37.564');
INSERT INTO public.administrador VALUES (4, 48, 'agus_ttn', '$2b$10$LulaYSslBca3MHB/DnKa9.U7PCVRaETHoTJSRRWsx73lXwFfdFQgO', 1, true, NULL, '37900HGSLPZ', '2025-08-14 11:26:16.538182', '2025-08-15 09:11:40.716306');


--
-- Data for Name: alertas_sistema; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: antecedentes_heredo_familiares; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: antecedentes_perinatales; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: area_interconsulta; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.area_interconsulta VALUES (1, 'Cardiología', 'Servicio especializado en el corazón y sistema cardiovascular', true);
INSERT INTO public.area_interconsulta VALUES (2, 'Ginecología', 'Servicio especializado en salud femenina', true);
INSERT INTO public.area_interconsulta VALUES (3, 'Nutrición', 'Servicio de asesoría nutricional', true);
INSERT INTO public.area_interconsulta VALUES (4, 'Neurología', 'Servicio especializado en enfermedades del sistema nervioso', true);
INSERT INTO public.area_interconsulta VALUES (5, 'Dermatología', 'Servicio especializado en piel y sus enfermedades', true);
INSERT INTO public.area_interconsulta VALUES (6, 'Endocrinología', 'Servicio especializado en trastornos hormonales', true);
INSERT INTO public.area_interconsulta VALUES (7, 'Oftalmología', 'Servicio especializado en salud visual', true);
INSERT INTO public.area_interconsulta VALUES (8, 'Psiquiatría', 'Servicio especializado en salud mental', true);
INSERT INTO public.area_interconsulta VALUES (9, 'Infectología', 'Servicio especializado en enfermedades infecciosas', true);
INSERT INTO public.area_interconsulta VALUES (10, 'Nefrología', 'Servicio especializado en riñones y sus enfermedades', true);
INSERT INTO public.area_interconsulta VALUES (11, 'Hematología', 'Servicio especializado en enfermedades de la sangre', true);
INSERT INTO public.area_interconsulta VALUES (12, 'Reumatología', 'Servicio especializado en enfermedades articulares y autoinmunes', true);
INSERT INTO public.area_interconsulta VALUES (13, 'Geriatría', 'Servicio especializado en salud del adulto mayor', true);
INSERT INTO public.area_interconsulta VALUES (14, 'Anestesiología', 'Servicio especializado en manejo del dolor y anestesia', true);
INSERT INTO public.area_interconsulta VALUES (15, 'Oncología', 'Servicio especializado en diagnóstico y tratamiento del cáncer', true);
INSERT INTO public.area_interconsulta VALUES (16, 'Radiología', 'Servicio especializado en imágenes médicas', true);
INSERT INTO public.area_interconsulta VALUES (17, 'Laboratorio Clínico', 'Servicio especializado en análisis clínicos', true);
INSERT INTO public.area_interconsulta VALUES (18, 'Enfermería', 'Servicio de apoyo en cuidados generales', true);
INSERT INTO public.area_interconsulta VALUES (19, 'Farmacia', 'Servicio especializado en dispensación y control de medicamentos', true);
INSERT INTO public.area_interconsulta VALUES (20, 'Terapia Física', 'Servicio especializado en rehabilitación física', true);
INSERT INTO public.area_interconsulta VALUES (21, 'Urología', 'Servicio especializado en aparato genitourinario', true);
INSERT INTO public.area_interconsulta VALUES (22, 'Neumología', 'Servicio especializado en enfermedades respiratorias', true);
INSERT INTO public.area_interconsulta VALUES (23, 'Gastroenterología', 'Servicio especializado en aparato digestivo', true);
INSERT INTO public.area_interconsulta VALUES (24, 'Otorrinolaringología', 'Servicio especializado en oído, nariz y garganta', true);
INSERT INTO public.area_interconsulta VALUES (25, 'Psicología', 'Servicio de apoyo psicológico', true);


--
-- Data for Name: cama; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cama VALUES (23, 'U-01', 1, 'Disponible', 'Hidratación pediátrica', 'Urgencias', 'Hidratación');
INSERT INTO public.cama VALUES (24, 'U-02', 1, 'Disponible', 'Urgencias niños', 'Urgencias', 'Urgencias Pediátricas');
INSERT INTO public.cama VALUES (25, 'U-03', 1, 'Ocupada', 'Paciente en evaluación crítica', 'Urgencias', 'Choque');
INSERT INTO public.cama VALUES (26, 'U-04', 1, 'Mantenimiento', 'En limpieza post uso', 'Urgencias', 'Hidratación');
INSERT INTO public.cama VALUES (27, 'U-05', 1, 'Disponible', 'Para pacientes leves', 'Urgencias', 'Observación General');
INSERT INTO public.cama VALUES (28, 'U-06', 1, 'Disponible', 'Urgencias adultos', 'Urgencias', 'Urgencias Adultos');
INSERT INTO public.cama VALUES (29, 'U-07', 1, 'Disponible', 'Curaciones', 'Urgencias', 'Procedimientos');
INSERT INTO public.cama VALUES (30, 'MI-01', 3, 'Disponible', 'Medicina Interna Adultos', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama VALUES (31, 'MI-02', 3, 'Disponible', 'Medicina Interna Adultos', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama VALUES (32, 'MI-03', 3, 'Ocupada', 'Paciente en observación', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama VALUES (33, 'MI-04', 3, 'Disponible', 'Medicina Interna Adultos', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama VALUES (34, 'MI-05', 3, 'Mantenimiento', 'Limpieza programada', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama VALUES (35, 'MI-06', 3, 'Disponible', 'Medicina Interna - Cuidados intermedios', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama VALUES (36, 'MI-07', 3, 'Ocupada', 'Paciente en ventilación mecánica', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama VALUES (37, 'MI-08', 3, 'Disponible', 'Medicina Interna - Cuidados intermedios', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama VALUES (38, 'MI-09', 3, 'Mantenimiento', 'Mantenimiento preventivo ventilador', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama VALUES (39, 'MI-10', 3, 'Disponible', 'Medicina Interna - Cuidados intermedios', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama VALUES (40, 'C-11', 6, 'Disponible', 'Cirugía general', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama VALUES (41, 'C-12', 6, 'Disponible', 'Cirugía general', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama VALUES (42, 'C-13', 6, 'Ocupada', 'Paciente postoperatorio', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama VALUES (43, 'C-14', 6, 'Mantenimiento', 'Reparación de equipamiento', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama VALUES (44, 'C-15', 6, 'Disponible', 'Cirugía general', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama VALUES (45, 'T-16', 2, 'Disponible', 'Traumatología y ortopedia', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama VALUES (46, 'T-17', 2, 'Disponible', 'Traumatología y ortopedia', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama VALUES (47, 'T-18', 2, 'Ocupada', 'Fractura en recuperación', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama VALUES (48, 'T-19', 2, 'Mantenimiento', 'Cama fuera de servicio', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama VALUES (49, 'T-20', 2, 'Disponible', 'Traumatología y ortopedia', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama VALUES (50, 'P-21', 4, 'Disponible', 'Pediatría escolares (5-15 años)', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama VALUES (51, 'P-22', 4, 'Disponible', 'Pediatría escolares (5-15 años)', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama VALUES (52, 'P-23', 4, 'Ocupada', 'Niño en recuperación', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama VALUES (53, 'P-24', 4, 'Disponible', 'Pediatría escolares (5-15 años)', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama VALUES (54, 'P-25', 4, 'Mantenimiento', 'Revisión técnica programada', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama VALUES (55, 'PL-26', 4, 'Disponible', 'Pediatría lactantes (1 mes - 2 años)', 'Hospitalización', 'Pediatría Lactantes');
INSERT INTO public.cama VALUES (56, 'PL-27', 4, 'Disponible', 'Pediatría lactantes (1 mes - 2 años)', 'Hospitalización', 'Pediatría Lactantes');
INSERT INTO public.cama VALUES (57, 'PL-28', 4, 'Ocupada', 'Lactante con bronquiolitis', 'Hospitalización', 'Pediatría Lactantes');
INSERT INTO public.cama VALUES (58, 'PN-01', 4, 'Ocupada', 'Neonato prematuro', 'Hospitalización', 'Neonatología');
INSERT INTO public.cama VALUES (59, 'PN-02', 4, 'Disponible', 'Neonato a término', 'Hospitalización', 'Neonatología');
INSERT INTO public.cama VALUES (60, 'PN-03', 4, 'Mantenimiento', 'Incubadora en mantenimiento', 'Hospitalización', 'Neonatología');
INSERT INTO public.cama VALUES (61, 'PN-04', 4, 'Disponible', 'Cuidados neonatales', 'Hospitalización', 'Neonatología');
INSERT INTO public.cama VALUES (62, 'GO-31', 7, 'Disponible', 'Ginecología', 'Hospitalización', 'Ginecología');
INSERT INTO public.cama VALUES (63, 'GO-32', 7, 'Disponible', 'Obstetricia', 'Hospitalización', 'Obstetricia');
INSERT INTO public.cama VALUES (64, 'GO-33', 7, 'Ocupada', 'Paciente post-cesárea', 'Hospitalización', 'Obstetricia');
INSERT INTO public.cama VALUES (65, 'GO-34', 7, 'Disponible', 'Labor de parto', 'Hospitalización', 'Sala de Labor');
INSERT INTO public.cama VALUES (66, 'R-01', 10, 'Disponible', 'Recuperación post-anestésica', 'Recuperación', 'Postoperatorio Inmediato');
INSERT INTO public.cama VALUES (67, 'R-02', 10, 'Disponible', 'Recuperación post-anestésica', 'Recuperación', 'Postoperatorio Inmediato');
INSERT INTO public.cama VALUES (68, 'R-03', 10, 'Ocupada', 'Paciente post-cirugía mayor', 'Recuperación', 'Postoperatorio Inmediato');
INSERT INTO public.cama VALUES (69, 'R-04', 10, 'Mantenimiento', 'Monitor en reparación', 'Recuperación', 'Postoperatorio Inmediato');


--
-- Data for Name: catalogo_vacunas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.catalogo_vacunas VALUES (1, 'Meningocócica', 'Vacuna contra meningococo', 'Adicional', '2 meses', 2, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (2, 'Fiebre Amarilla', 'Vacuna contra fiebre amarilla', 'Especial', '9 meses', 1, NULL, 'Subcutánea', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (3, 'Tifoidea', 'Vacuna contra fiebre tifoidea', 'Especial', '2 años', 1, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (4, 'Cólera', 'Vacuna contra cólera', 'Emergencia', 'Cualquier edad', 2, NULL, 'Oral', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (5, 'COVID-19 Pfizer', 'Vacuna COVID-19 Pfizer-BioNTech', 'Emergencia', '12 años en adelante', 2, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (6, 'COVID-19 AstraZeneca', 'Vacuna COVID-19 AstraZeneca', 'Emergencia', '18 años en adelante', 2, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (7, 'Rabia', 'Vacuna antirrábica', 'Especial', 'Post-exposición', 4, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (8, 'Encefalitis Japonesa', 'Vacuna contra encefalitis japonesa', 'Especial', '9 meses', 2, NULL, 'Subcutánea', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (9, 'Polio Injectable (IPV)', 'Vacuna polio inactivada', 'Básica', '2 meses', 4, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (10, 'Hepatitis B Recombinante', 'Vacuna hepatitis B para adultos', 'Adicional', 'Adultos', 3, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (11, 'Td (Tétanos-Difteria)', 'Refuerzo tétanos-difteria adultos', 'Básica', 'Cada 10 años', 1, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas VALUES (12, 'Tdap (Tétanos-Difteria-Tos ferina)', 'Vacuna triple acelular adultos', 'Básica', 'Embarazadas', 1, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');


--
-- Data for Name: configuracion_sistema; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.configuracion_sistema VALUES (1, 'dias_reingreso_bloqueo', '180', 'Días desde último ingreso para activar validación obligatoria', '2025-07-11 23:41:36.882097', NULL);
INSERT INTO public.configuracion_sistema VALUES (2, 'tiempo_bloqueo_datos_minutos', '30', 'Minutos que permanecen ocultos los datos históricos', '2025-07-11 23:41:36.882097', NULL);
INSERT INTO public.configuracion_sistema VALUES (3, 'requiere_supervisor_acceso_critico', 'true', 'Si se requiere supervisor para accesos críticos', '2025-07-11 23:41:36.882097', NULL);
INSERT INTO public.configuracion_sistema VALUES (4, 'max_intentos_acceso_bloqueado', '3', 'Máximo intentos de acceso antes de bloquear usuario', '2025-07-11 23:41:36.882097', NULL);
INSERT INTO public.configuracion_sistema VALUES (7, 'color_primario', '#1e40af', 'Configuración de color_primario', '2025-07-16 18:25:30.522992', NULL);
INSERT INTO public.configuracion_sistema VALUES (8, 'color_secundario', '#3b82f6', 'Configuración de color_secundario', '2025-07-16 18:25:30.526812', NULL);
INSERT INTO public.configuracion_sistema VALUES (15, 'logo_favicon', '/uploads/logos/undefined-1752711967243.ico', 'Logo favicon del sistema', '2025-07-16 18:26:07.291243', NULL);
INSERT INTO public.configuracion_sistema VALUES (86, 'password_reset_token_duracion_minutos', '60', 'Duración en minutos de los tokens de recuperación de contraseña', '2025-07-17 18:11:18.750733', NULL);
INSERT INTO public.configuracion_sistema VALUES (87, 'password_reset_max_intentos_dia', '3', 'Máximo número de solicitudes de recuperación por email por día', '2025-07-17 18:11:18.750733', NULL);
INSERT INTO public.configuracion_sistema VALUES (88, 'password_reset_longitud_token', '64', 'Longitud en caracteres del token de recuperación', '2025-07-17 18:11:18.750733', NULL);
INSERT INTO public.configuracion_sistema VALUES (5, 'nombre_hospital', 'Hospital General San Luis de la Paz', 'Configuración de nombre_hospital', '2025-08-04 19:00:29.911425', NULL);
INSERT INTO public.configuracion_sistema VALUES (6, 'nombre_dependencia', 'Secretaría de Salud de Guanajuato', 'Configuración de nombre_dependencia', '2025-08-04 19:00:29.9145', NULL);
INSERT INTO public.configuracion_sistema VALUES (17, 'logo_gobierno', '/uploads/logos/logo-gobierno-importado.png', 'Logo gobierno del sistema', '2025-08-06 10:25:09.8662', NULL);
INSERT INTO public.configuracion_sistema VALUES (13, 'logo_principal', '/uploads/logos/logo-principal-importado.svg', 'Logo principal del sistema', '2025-08-06 10:33:54.548638', NULL);
INSERT INTO public.configuracion_sistema VALUES (14, 'logo_sidebar', '/uploads/logos/logo-sidebar-importado.png', 'Logo sidebar del sistema', '2025-08-14 11:34:18.556088', NULL);


--
-- Data for Name: consentimiento_informado; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: control_acceso_historico; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: desarrollo_psicomotriz; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: documento_clinico; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.documento_clinico VALUES (3, 3, NULL, 1, '2025-07-14 15:08:18.85055', 9, 'Borrador', NULL);
INSERT INTO public.documento_clinico VALUES (4, 3, NULL, 3, '2025-07-14 21:21:23.047', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (5, 3, NULL, 2, '2025-07-14 21:26:33.211', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (6, 3, NULL, 3, '2025-07-14 21:29:05.471', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (7, 4, NULL, 1, '2025-07-16 23:13:08.520104', 9, 'Borrador', NULL);
INSERT INTO public.documento_clinico VALUES (8, 4, NULL, 3, '2025-07-17 05:15:09.671', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (9, 4, NULL, 3, '2025-07-17 16:04:37.109', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (10, 4, NULL, 3, '2025-07-18 17:13:14.508', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (11, 3, NULL, 3, '2025-07-18 18:16:43.905', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (12, 3, NULL, 3, '2025-07-18 19:00:15.904', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (13, 3, NULL, 3, '2025-07-18 19:00:29.789', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (14, 3, NULL, 3, '2025-07-18 19:01:17.5', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (15, 3, NULL, 3, '2025-07-18 19:08:40.851', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (16, 5, NULL, 1, '2025-07-18 13:22:37.597532', 9, 'Borrador', NULL);
INSERT INTO public.documento_clinico VALUES (17, 5, NULL, 3, '2025-07-18 19:25:29.045', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (18, 5, NULL, 3, '2025-07-18 19:26:47.908', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (19, 6, NULL, 1, '2025-07-19 17:39:10.635581', 9, 'Borrador', NULL);
INSERT INTO public.documento_clinico VALUES (20, 6, NULL, 3, '2025-07-20 00:22:21.076', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (21, 6, NULL, 3, '2025-07-20 00:31:31.423', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (22, 6, NULL, 3, '2025-07-20 01:14:16.005', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (23, 6, NULL, 3, '2025-07-20 02:47:35.605', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (24, 6, NULL, 3, '2025-07-20 03:20:01.786', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (25, 6, NULL, 3, '2025-07-20 04:16:16.899', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (26, 6, NULL, 3, '2025-07-20 06:52:12.84', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (27, 6, NULL, 3, '2025-07-20 08:13:59.639', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (28, 5, NULL, 3, '2025-07-20 15:51:12.75', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (29, 5, NULL, 3, '2025-07-20 16:01:43.844', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (30, 5, NULL, 2, '2025-07-20 16:37:54.281', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (31, 5, NULL, 2, '2025-07-20 16:48:38.266', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (32, 5, NULL, 2, '2025-07-20 16:54:15.194', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (33, 5, NULL, 3, '2025-07-20 17:02:01.452', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (34, 5, NULL, 3, '2025-07-20 17:42:02.966', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (35, 5, NULL, 3, '2025-07-20 17:42:32.991', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (36, 6, NULL, 3, '2025-07-20 19:11:01.391', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (37, 5, NULL, 3, '2025-07-20 21:44:32.427', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (38, 5, NULL, 3, '2025-07-20 22:09:09.861', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (39, 5, NULL, 3, '2025-07-22 08:22:02.856', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (40, 5, NULL, 3, '2025-07-22 20:16:17.575', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (41, 5, NULL, 2, '2025-07-22 20:18:41.755', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (42, 4, NULL, 3, '2025-07-22 21:15:40.131', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (43, 4, NULL, 3, '2025-07-22 21:35:49.939', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (44, 5, NULL, 3, '2025-07-23 04:30:08.732', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (45, 5, NULL, 3, '2025-07-23 04:30:39.532', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (46, 5, NULL, 2, '2025-07-23 04:31:19.917', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (47, 5, NULL, 2, '2025-07-23 04:32:32.839', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (48, 5, NULL, 3, '2025-07-23 05:14:50.588', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (49, 5, NULL, 3, '2025-07-24 03:08:29.7', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (50, 5, NULL, 3, '2025-07-24 19:32:24.623', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (51, 5, NULL, 3, '2025-07-24 19:34:06.583', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (52, 5, NULL, 3, '2025-07-28 14:50:53.863', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (53, 5, NULL, 3, '2025-07-28 15:08:07.577', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (54, 6, NULL, 3, '2025-07-29 00:54:29.073', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (55, 6, NULL, 3, '2025-07-29 03:45:26.428', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (56, 6, NULL, 3, '2025-07-29 04:52:19.772', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (57, 6, NULL, 3, '2025-07-29 09:35:32.882', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (58, 4, NULL, 3, '2025-07-30 01:54:58.39', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (59, 3, NULL, 3, '2025-07-30 08:15:41.877', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (60, 3, NULL, 3, '2025-07-30 21:01:16.002', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (61, 3, NULL, 3, '2025-07-31 04:05:08.036', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (62, 3, NULL, 3, '2025-07-31 04:10:32.4', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (63, 5, NULL, 3, '2025-07-31 15:48:22.612', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (64, 5, NULL, 2, '2025-07-31 18:45:33.24', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (65, 5, NULL, 3, '2025-07-31 18:46:28.732', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (66, 5, NULL, 3, '2025-07-31 18:47:25.623', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (67, 4, NULL, 3, '2025-07-31 18:58:17.885', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (68, 4, NULL, 3, '2025-07-31 19:21:03.548', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (69, 6, NULL, 3, '2025-07-31 20:17:06.457', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (70, 5, NULL, 2, '2025-07-31 23:37:50.421', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (71, 5, NULL, 3, '2025-07-31 23:39:06.669', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (72, 4, NULL, 3, '2025-08-04 18:22:55.907', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (73, 4, NULL, 3, '2025-08-04 18:24:54.808', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (74, 4, NULL, 1, '2025-08-04 18:51:55.522', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (75, 7, NULL, 1, '2025-08-04 14:42:07.859046', 9, 'Borrador', NULL);
INSERT INTO public.documento_clinico VALUES (76, 8, NULL, 1, '2025-08-04 14:51:20.376693', 9, 'Borrador', NULL);
INSERT INTO public.documento_clinico VALUES (77, 8, NULL, 3, '2025-08-04 21:01:52.056', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (78, 5, NULL, 1, '2025-08-04 23:18:14.302', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (79, 5, NULL, 1, '2025-08-04 23:31:03.477', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (80, 5, NULL, 1, '2025-08-04 23:43:56.435', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (81, 5, NULL, 1, '2025-08-04 23:56:52.014', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (82, 5, NULL, 1, '2025-08-05 00:01:58.387', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (83, 5, NULL, 1, '2025-08-05 00:05:29.871', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (84, 5, NULL, 1, '2025-08-05 00:15:28.135', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (85, 5, NULL, 1, '2025-08-05 00:21:21.347', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (86, 5, NULL, 1, '2025-08-05 00:46:52.614', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (87, 5, NULL, 1, '2025-08-05 00:52:49.805', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (88, 8, NULL, 2, '2025-08-05 05:55:13.923', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (89, 8, NULL, 2, '2025-08-05 06:24:56.165', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (90, 8, NULL, 2, '2025-08-05 06:34:42.779', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (91, 8, NULL, 2, '2025-08-05 06:49:40.813', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (92, 8, NULL, 3, '2025-08-05 13:51:57.402', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (93, 8, NULL, 5, '2025-08-05 18:17:05.82', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (94, 8, NULL, 5, '2025-08-05 20:35:34.518', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (95, 8, NULL, 5, '2025-08-05 20:44:07.635', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (96, 8, NULL, 5, '2025-08-05 20:50:43.451', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (97, 8, NULL, 6, '2025-08-05 23:05:29.48', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (98, 8, NULL, 6, '2025-08-05 23:11:19.314', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (99, 8, NULL, 6, '2025-08-05 23:31:37.435', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (100, 8, NULL, 8, '2025-08-06 00:48:41.074', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (101, 8, NULL, 7, '2025-08-06 01:33:04.873', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (102, 8, NULL, 7, '2025-08-06 01:42:19.475', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (103, 8, NULL, 7, '2025-08-06 02:17:16.57', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (104, 8, NULL, 7, '2025-08-06 02:22:37.989', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (105, 8, NULL, 7, '2025-08-06 02:34:38.398', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (106, 8, NULL, 7, '2025-08-06 02:49:38.958', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (107, 8, NULL, 5, '2025-08-06 03:25:05.093', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (108, 8, NULL, 4, '2025-08-06 04:27:11.943', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (109, 5, NULL, 1, '2025-08-06 16:26:44.635', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (110, 8, NULL, 1, '2025-08-06 16:30:36.917', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (111, 8, NULL, 3, '2025-08-06 16:35:27.687', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (112, 8, NULL, 3, '2025-08-07 22:16:06.297', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (113, 8, NULL, 3, '2025-08-07 23:06:13.051', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (114, 8, NULL, 3, '2025-08-11 03:24:38.525', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (115, 8, NULL, 2, '2025-08-11 07:15:40.077', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (116, 8, NULL, 3, '2025-08-11 09:36:19.75', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (117, 8, NULL, 3, '2025-08-11 09:49:23.392', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (118, 8, NULL, 3, '2025-08-11 09:52:59.111', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (119, 5, NULL, 1, '2025-08-11 16:23:18.257', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (120, 8, NULL, 1, '2025-08-11 16:34:35.863', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (121, 8, NULL, 1, '2025-08-11 16:40:49.819', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (122, 8, NULL, 1, '2025-08-11 16:59:08.084', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (123, 8, NULL, 1, '2025-08-11 17:43:51.569', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (124, 8, NULL, 1, '2025-08-11 18:07:55.467', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (125, 8, NULL, 1, '2025-08-12 13:57:12.492', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (126, 8, NULL, 1, '2025-08-12 15:31:44.719', 20, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (127, 8, NULL, 1, '2025-08-12 16:51:24.531', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (128, 8, NULL, 1, '2025-08-12 17:00:56.708', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (129, 8, NULL, 1, '2025-08-12 17:28:42.644', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (130, 8, NULL, 1, '2025-08-12 19:05:13.084', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (131, 8, NULL, 1, '2025-08-13 02:42:41.599', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (132, 8, NULL, 1, '2025-08-14 15:52:37.093', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (133, 8, NULL, 2, '2025-08-14 16:15:04.532', 21, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (134, 9, NULL, 1, '2025-08-15 09:22:32.687765', 9, 'Borrador', NULL);
INSERT INTO public.documento_clinico VALUES (135, 9, NULL, 5, '2025-08-15 16:02:25.956', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (136, 9, NULL, 7, '2025-08-15 16:11:35.642', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (137, 9, NULL, 1, '2025-08-15 16:41:10.808', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (138, 10, NULL, 1, '2025-08-15 15:38:50.705563', 9, 'Borrador', NULL);
INSERT INTO public.documento_clinico VALUES (139, 8, NULL, 2, '2025-08-15 22:44:15.598', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (140, 9, NULL, 1, '2025-08-18 11:15:40.523', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (141, 9, NULL, 1, '2025-08-18 14:52:12.128', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (142, 9, NULL, 1, '2025-08-18 16:46:23.522', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (143, 9, NULL, 5, '2025-08-23 06:35:52.114', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (144, 9, NULL, 5, '2025-08-23 06:49:30.373', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (145, 9, NULL, 5, '2025-08-24 18:11:56.292', 22, 'Activo', NULL);
INSERT INTO public.documento_clinico VALUES (146, 9, NULL, 7, '2025-08-24 18:14:24.722', 22, 'Activo', NULL);


--
-- Data for Name: estado_nutricional_pediatrico; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: estudio_medico; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.estudio_medico VALUES (1, '20109', 'Biometría Hemática', 'Laboratorio', 'Conteo de glóbulos rojos, blancos y plaquetas', true, 4, true);
INSERT INTO public.estudio_medico VALUES (2, '20108', 'Grupo Sanguíneo y Rh', 'Laboratorio', 'Determinación del grupo sanguíneo ABO y factor Rh', false, 6, true);
INSERT INTO public.estudio_medico VALUES (3, '201031', 'Velocidad de Sedimentación Globular (VSG)', 'Laboratorio', 'Marcador de inflamación sistémica', true, 6, true);
INSERT INTO public.estudio_medico VALUES (4, '20102', 'Recuento de Reticulocitos', 'Laboratorio', 'Evalúa la producción de glóbulos rojos', true, 6, true);
INSERT INTO public.estudio_medico VALUES (5, '20105', 'Frotis de Sangre Periférica', 'Laboratorio', 'Estudio morfológico de células sanguíneas', false, 8, true);
INSERT INTO public.estudio_medico VALUES (6, '193031', 'Hemoglobina Glucosilada (HbA1c)', 'Laboratorio', 'Control glucémico a largo plazo', true, 6, true);
INSERT INTO public.estudio_medico VALUES (7, '20202', 'Paquete Hematológico Completo', 'Laboratorio', 'Biometría + VSG + Reticulocitos', true, 8, true);
INSERT INTO public.estudio_medico VALUES (8, '20113', 'Tiempo de Protrombina (TP)', 'Laboratorio', 'Evalúa coagulación y función hepática', true, 6, true);
INSERT INTO public.estudio_medico VALUES (9, '20114', 'Tiempo de Tromboplastina Parcial (TTPa)', 'Laboratorio', 'Mide vía intrínseca de coagulación', true, 6, true);
INSERT INTO public.estudio_medico VALUES (10, '20116', 'Fibrinógeno', 'Laboratorio', 'Proteína implicada en coagulación', true, 6, true);
INSERT INTO public.estudio_medico VALUES (11, '20115', 'INR', 'Laboratorio', 'Relación normalizada internacional', true, 6, true);
INSERT INTO public.estudio_medico VALUES (12, '19301', 'Glucosa en Ayunas', 'Laboratorio', 'Diagnóstico de diabetes mellitus', true, 4, true);
INSERT INTO public.estudio_medico VALUES (13, '19302', 'Glucosa Postprandial', 'Laboratorio', 'Nivel de glucosa posterior a alimentos', false, 4, true);
INSERT INTO public.estudio_medico VALUES (14, '193032', 'Tamiz Gestacional 50g / 1 hr', 'Laboratorio', 'Tamizaje de diabetes gestacional', false, 6, true);
INSERT INTO public.estudio_medico VALUES (15, '193033', 'Curva de Tolerancia a la Glucosa 75g', 'Laboratorio', 'Evaluación completa de tolerancia a glucosa', true, 12, true);
INSERT INTO public.estudio_medico VALUES (16, '19304', 'Urea/BUN', 'Laboratorio', 'Evaluación de función renal', false, 4, true);
INSERT INTO public.estudio_medico VALUES (17, '19306', 'Creatinina', 'Laboratorio', 'Indicador principal de función renal', false, 4, true);
INSERT INTO public.estudio_medico VALUES (18, '193071', 'Ácido Úrico', 'Laboratorio', 'Evalúa gota y metabolismo de purinas', true, 4, true);
INSERT INTO public.estudio_medico VALUES (19, '193072', 'Colesterol Total', 'Laboratorio', 'Lípidos séricos totales', true, 6, true);
INSERT INTO public.estudio_medico VALUES (20, '19703', 'HDL Colesterol', 'Laboratorio', 'Colesterol de alta densidad (bueno)', true, 6, true);
INSERT INTO public.estudio_medico VALUES (21, '19704', 'LDL Colesterol', 'Laboratorio', 'Colesterol de baja densidad (malo)', true, 6, true);
INSERT INTO public.estudio_medico VALUES (22, '19702', 'Triglicéridos', 'Laboratorio', 'Lípidos circulantes', true, 6, true);
INSERT INTO public.estudio_medico VALUES (23, '20203', 'Perfil de Lípidos Completo', 'Laboratorio', 'Colesterol total, HDL, LDL, Triglicéridos', true, 8, true);
INSERT INTO public.estudio_medico VALUES (24, '19401', 'AST (TGO)', 'Laboratorio', 'Transaminasa - marcador de daño hepático', true, 4, true);
INSERT INTO public.estudio_medico VALUES (25, '19402', 'ALT (TGP)', 'Laboratorio', 'Transaminasa - marcador específico hepático', true, 4, true);
INSERT INTO public.estudio_medico VALUES (26, '19403', 'Fosfatasa Alcalina (ALP)', 'Laboratorio', 'Marcador de hígado y metabolismo óseo', true, 4, true);
INSERT INTO public.estudio_medico VALUES (27, '19308', 'Bilirrubina Directa', 'Laboratorio', 'Bilirrubina conjugada', true, 4, true);
INSERT INTO public.estudio_medico VALUES (28, '22118', 'Bilirrubina Total', 'Laboratorio', 'Bilirrubina directa e indirecta', true, 4, true);
INSERT INTO public.estudio_medico VALUES (29, '19309', 'Proteínas Totales', 'Laboratorio', 'Evalúa estado nutricional y síntesis hepática', false, 4, true);
INSERT INTO public.estudio_medico VALUES (30, '19310', 'Albúmina', 'Laboratorio', 'Evalúa síntesis hepática y estado nutricional', true, 4, true);
INSERT INTO public.estudio_medico VALUES (31, '20208', 'Perfil Hepático Completo', 'Laboratorio', 'AST, ALT, Bilirrubinas, Fosfatasa alcalina, Proteínas', true, 12, true);
INSERT INTO public.estudio_medico VALUES (32, '19407', 'Amilasa', 'Laboratorio', 'Enzima pancreática', true, 6, true);
INSERT INTO public.estudio_medico VALUES (33, '19408', 'Lipasa', 'Laboratorio', 'Marcador específico de pancreatitis aguda', true, 6, true);
INSERT INTO public.estudio_medico VALUES (34, '196011', 'Sodio', 'Laboratorio', 'Electrolito principal extracelular', false, 4, true);
INSERT INTO public.estudio_medico VALUES (35, '196021', 'Potasio', 'Laboratorio', 'Electrolito principal intracelular', false, 4, true);
INSERT INTO public.estudio_medico VALUES (36, '201032', 'Cloro', 'Laboratorio', 'Electrolito importante para equilibrio ácido-base', false, 4, true);
INSERT INTO public.estudio_medico VALUES (37, '19604', 'Calcio', 'Laboratorio', 'Homeostasis ósea y neuromuscular', false, 4, true);
INSERT INTO public.estudio_medico VALUES (38, '19603', 'Fósforo', 'Laboratorio', 'Balance mineral y metabolismo óseo', false, 4, true);
INSERT INTO public.estudio_medico VALUES (39, '196022', 'Magnesio', 'Laboratorio', 'Cofactor enzimático importante', false, 4, true);
INSERT INTO public.estudio_medico VALUES (40, '20204', 'Química Sanguínea III', 'Laboratorio', 'Glucosa, Urea, Creatinina', true, 8, true);
INSERT INTO public.estudio_medico VALUES (41, '20207', 'Química Sanguínea IV', 'Laboratorio', 'QS III + Electrolitos + Ácido Úrico', true, 8, true);
INSERT INTO public.estudio_medico VALUES (42, '20209', 'Perfil Prequirúrgico', 'Laboratorio', 'Biometría, QS, Coagulación, Grupo sanguíneo', true, 24, true);
INSERT INTO public.estudio_medico VALUES (43, '20210', 'Perfil Reumático', 'Laboratorio', 'Factor reumatoide, PCR, VSG, Antiestreptolisinas', true, 12, true);
INSERT INTO public.estudio_medico VALUES (44, '20211', 'Perfil de Embarazo', 'Laboratorio', 'Biometría, TP, TTPa, Glucemia, VDRL, EGO', true, 24, true);
INSERT INTO public.estudio_medico VALUES (45, '20107', 'Pruebas Cruzadas', 'Laboratorio', 'Compatibilidad sanguínea pretransfusional', false, 4, true);
INSERT INTO public.estudio_medico VALUES (46, '19210', 'Coombs Directo', 'Laboratorio', 'Detecta anticuerpos adheridos a glóbulos rojos', false, 6, true);
INSERT INTO public.estudio_medico VALUES (47, '19211', 'Coombs Indirecto', 'Laboratorio', 'Detecta anticuerpos libres en plasma', false, 6, true);
INSERT INTO public.estudio_medico VALUES (48, '19201', 'Reacciones Febriles', 'Laboratorio', 'Anticuerpos contra Salmonella, Brucella, Rickettsia', false, 24, true);
INSERT INTO public.estudio_medico VALUES (49, '192061', 'Proteína C Reactiva (PCR)', 'Laboratorio', 'Marcador de inflamación aguda', false, 6, true);
INSERT INTO public.estudio_medico VALUES (50, '19207', 'Factor Reumatoide', 'Laboratorio', 'Autoanticuerpo en artritis reumatoide', false, 12, true);
INSERT INTO public.estudio_medico VALUES (51, '19205', 'Antiestreptolisinas O (ASO)', 'Laboratorio', 'Infección estreptocócica reciente', false, 24, true);
INSERT INTO public.estudio_medico VALUES (52, '22131', 'VDRL', 'Laboratorio', 'Detección de sífilis (no treponémico)', false, 8, true);
INSERT INTO public.estudio_medico VALUES (53, '192062', 'RPR', 'Laboratorio', 'Confirmación de sífilis (no treponémico)', false, 8, true);
INSERT INTO public.estudio_medico VALUES (54, '20117', 'VIH 1-2 Prueba Rápida', 'Laboratorio', 'Detección rápida de anticuerpos anti-VIH', false, 2, true);
INSERT INTO public.estudio_medico VALUES (55, '19212', 'Antígeno Prostático Específico (PSA)', 'Laboratorio', 'Detección de cáncer prostático', true, 8, true);
INSERT INTO public.estudio_medico VALUES (56, '19213', 'Alfafetoproteína (AFP)', 'Laboratorio', 'Marcador de cáncer hepático', true, 8, true);
INSERT INTO public.estudio_medico VALUES (57, '19214', 'Antígeno Carcinoembrionario (CEA)', 'Laboratorio', 'Marcador de cáncer colorrectal', true, 8, true);
INSERT INTO public.estudio_medico VALUES (58, '19720', 'hCG Beta Cuantitativa', 'Laboratorio', 'Seguimiento de embarazo y patología trofoblástica', false, 6, true);
INSERT INTO public.estudio_medico VALUES (59, '19715', 'Prueba de Embarazo en Orina', 'Laboratorio', 'Detección cualitativa de embarazo', false, 2, true);
INSERT INTO public.estudio_medico VALUES (60, '19721', 'TSH', 'Laboratorio', 'Hormona estimulante de tiroides', true, 8, true);
INSERT INTO public.estudio_medico VALUES (61, '19722', 'T4 Libre', 'Laboratorio', 'Tiroxina libre', true, 8, true);
INSERT INTO public.estudio_medico VALUES (62, '19723', 'T3 Total', 'Laboratorio', 'Triyodotironina total', true, 8, true);
INSERT INTO public.estudio_medico VALUES (63, '19406', 'LDH', 'Laboratorio', 'Deshidrogenasa láctica - daño tisular', false, 6, true);
INSERT INTO public.estudio_medico VALUES (64, '194091', 'CPK Total', 'Laboratorio', 'Creatina fosfoquinasa - enzima muscular', true, 6, true);
INSERT INTO public.estudio_medico VALUES (65, '194092', 'CK-MB', 'Laboratorio', 'Fracción cardíaca específica de CPK', true, 6, true);
INSERT INTO public.estudio_medico VALUES (66, '194093', 'Troponina I', 'Laboratorio', 'Marcador específico de daño miocárdico', false, 4, true);
INSERT INTO public.estudio_medico VALUES (67, '20201', 'Examen General de Orina', 'Laboratorio', 'Análisis físico, químico y microscópico', false, 4, true);
INSERT INTO public.estudio_medico VALUES (68, '19501', 'Depuración de Creatinina', 'Laboratorio', 'Evaluación de filtrado glomerular', false, 24, true);
INSERT INTO public.estudio_medico VALUES (69, '22803', 'Microalbuminuria 24 horas', 'Laboratorio', 'Detección precoz de nefropatía diabética', false, 12, true);
INSERT INTO public.estudio_medico VALUES (70, '19502', 'Sangre Oculta en Heces', 'Laboratorio', 'Detecta sangrado digestivo oculto', false, 6, true);
INSERT INTO public.estudio_medico VALUES (71, '21001', 'Urocultivo', 'Laboratorio', 'Cultivo de orina para identificar bacterias', false, 48, true);
INSERT INTO public.estudio_medico VALUES (72, '21002', 'Coprocultivo', 'Laboratorio', 'Cultivo de heces para patógenos entéricos', false, 72, true);
INSERT INTO public.estudio_medico VALUES (73, '21003', 'Hemocultivo', 'Laboratorio', 'Cultivo de sangre para detectar bacteremia', false, 72, true);
INSERT INTO public.estudio_medico VALUES (74, '21004', 'Cultivo de Exudado Faríngeo', 'Laboratorio', 'Identificación de Streptococcus beta hemolítico', false, 48, true);
INSERT INTO public.estudio_medico VALUES (75, '200011', 'Coproparasitoscópico Seriado (3 muestras)', 'Laboratorio', 'Búsqueda exhaustiva de parásitos intestinales', false, 24, true);
INSERT INTO public.estudio_medico VALUES (76, '200012', 'Coproparasitoscópico Simple', 'Laboratorio', 'Búsqueda básica de parásitos', false, 12, true);
INSERT INTO public.estudio_medico VALUES (77, '200051', 'Coprológico Funcional', 'Laboratorio', 'Análisis de digestión y absorción', false, 6, true);
INSERT INTO public.estudio_medico VALUES (78, '19215', 'Rotavirus en Heces', 'Laboratorio', 'Antígeno viral en gastroenteritis', false, 6, true);
INSERT INTO public.estudio_medico VALUES (79, '19606', 'Gasometría Arterial', 'Laboratorio', 'pH, pO2, pCO2, HCO3 en sangre arterial', false, 2, true);
INSERT INTO public.estudio_medico VALUES (80, '17301', 'Gasometría Venosa', 'Laboratorio', 'pH, pCO2, HCO3 en sangre venosa', false, 2, true);
INSERT INTO public.estudio_medico VALUES (81, '30001', 'Radiografía de Tórax', 'Imagen', 'Evaluación de pulmones y corazón', false, 2, true);
INSERT INTO public.estudio_medico VALUES (82, '30002', 'Radiografía de Abdomen', 'Imagen', 'Evaluación de vísceras abdominales', false, 2, true);
INSERT INTO public.estudio_medico VALUES (83, '30003', 'Ultrasonido Abdominal', 'Imagen', 'Evaluación de órganos abdominales', true, 24, true);
INSERT INTO public.estudio_medico VALUES (84, '30004', 'Ultrasonido Obstétrico', 'Imagen', 'Evaluación de embarazo', false, 24, true);
INSERT INTO public.estudio_medico VALUES (85, '30005', 'Tomografía de Cráneo Simple', 'Imagen', 'Evaluación de estructuras cerebrales', false, 24, true);
INSERT INTO public.estudio_medico VALUES (86, '30006', 'Tomografía de Abdomen', 'Imagen', 'Evaluación detallada abdominal', false, 24, true);
INSERT INTO public.estudio_medico VALUES (87, '30007', 'Ecocardiograma', 'Imagen', 'Evaluación de función cardíaca', false, 24, true);


--
-- Data for Name: expediente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.expediente VALUES (6, 4, 'HG-2025-3502891416', '2025-07-19 17:39:10.635581', 'Activo', 'Pasiente prueba', '2025-001356');
INSERT INTO public.expediente VALUES (5, 3, 'HG-2025-5575569048', '2025-07-18 13:22:37.597532', 'Activo', 'Tomo 1', '2025-NOM-9595');
INSERT INTO public.expediente VALUES (3, 1, 'HG-2025-2977887367', '2025-07-14 15:08:18.85055', 'Activo', 'Paciente1', 'NOM-PACIENTE 0');
INSERT INTO public.expediente VALUES (4, 2, 'HG-2025-1884388806', '2025-07-16 23:13:08.520104', 'Activo', 'MALO', 'EXP123123');
INSERT INTO public.expediente VALUES (7, 6, 'HG-2025-1277433615', '2025-08-04 14:42:07.859046', 'Activo', 'Paciente con antecedentes de hipertensión. Vive sola. Seguimiento geriátrico mensual.', 'ADM-MCH-2025/004');
INSERT INTO public.expediente VALUES (8, 7, 'HG-2025-6803578927', '2025-08-04 14:51:20.376693', 'Activo', 'Expediente creado mediante wizard', '2025-JEMD-HGSLP/004');
INSERT INTO public.expediente VALUES (9, 8, 'HG-2025-3525681547', '2025-08-15 09:22:32.687765', 'Activo', 'Expediente creado mediante wizard', '14053');
INSERT INTO public.expediente VALUES (10, 9, 'HG-2025-9304519829', '2025-08-15 15:38:50.705563', 'Activo', 'Niguna', '154256');


--
-- Data for Name: expediente_auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.expediente_auditoria VALUES (1, 3, '2025-07-14 15:08:18.85055', 9, 'nuevo_expediente', NULL, '{"estado": "Activo", "id_paciente": 1, "numero_expediente": "HG-2025-2977887367"}', '::1', NULL, NULL, 'Expediente creado para Carlos Gonzales');
INSERT INTO public.expediente_auditoria VALUES (2, 3, '2025-07-14 15:21:23.162888', 9, 'nuevo_documento', NULL, '{"id_documento": 4, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.56, "peso": 75.2, "talla": 175, "glucosa": 95, "temperatura": 36.5, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 16}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (3, 4, '2025-07-16 23:13:08.520104', 9, 'nuevo_expediente', NULL, '{"estado": "Activo", "id_paciente": 2, "numero_expediente": "HG-2025-1884388806"}', '::1', NULL, NULL, 'Expediente creado para Juan García');
INSERT INTO public.expediente_auditoria VALUES (4, 4, '2025-07-16 23:15:09.720744', 9, 'nuevo_documento', NULL, '{"id_documento": 8, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.93, "peso": 90, "talla": 190, "glucosa": 120, "temperatura": 37, "presion_arterial": "120/58", "saturacion_oxigeno": 100, "frecuencia_cardiaca": 75, "frecuencia_respiratoria": 30}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (5, 4, '2025-07-17 10:04:37.173835', 9, 'nuevo_documento', NULL, '{"id_documento": 9, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.93, "peso": "90.00", "talla": "190.00", "glucosa": 100, "temperatura": 35, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (6, 4, '2025-07-18 11:13:14.913216', 9, 'nuevo_documento', NULL, '{"id_documento": 10, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": 72.5, "talla": 175, "glucosa": 85, "temperatura": 36.7, "presion_arterial": "115/75", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 78, "frecuencia_respiratoria": 16}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (7, 3, '2025-07-18 12:16:44.060788', 9, 'nuevo_documento', NULL, '{"id_documento": 11, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": 72.5, "talla": "175.00", "glucosa": 85, "temperatura": 36.7, "presion_arterial": "115/75", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 78, "frecuencia_respiratoria": 16}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (8, 3, '2025-07-18 13:00:15.945651', 9, 'nuevo_documento', NULL, '{"id_documento": 12, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 85, "temperatura": 36.7, "presion_arterial": "115/75", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 78, "frecuencia_respiratoria": 16}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (9, 3, '2025-07-18 13:00:29.830997', 9, 'nuevo_documento', NULL, '{"id_documento": 13, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 85, "temperatura": 36.7, "presion_arterial": "115/75", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 78, "frecuencia_respiratoria": 16}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (10, 3, '2025-07-18 13:01:17.559045', 9, 'nuevo_documento', NULL, '{"id_documento": 14, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 85, "temperatura": 36.7, "presion_arterial": "115/75", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 78, "frecuencia_respiratoria": 16}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (11, 3, '2025-07-18 13:08:40.937269', 9, 'nuevo_documento', NULL, '{"id_documento": 15, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 85, "temperatura": 36.7, "presion_arterial": "115/75", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 78, "frecuencia_respiratoria": 16}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (12, 5, '2025-07-18 13:22:37.597532', 9, 'nuevo_expediente', NULL, '{"estado": "Activo", "id_paciente": 3, "numero_expediente": "HG-2025-5575569048"}', '::1', NULL, NULL, 'Expediente creado para Juan Garcia');
INSERT INTO public.expediente_auditoria VALUES (13, 5, '2025-07-18 13:25:29.083677', 9, 'nuevo_documento', NULL, '{"id_documento": 17, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": 70, "talla": 170, "glucosa": 100, "temperatura": 36.5, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (14, 5, '2025-07-18 13:26:48.02052', 9, 'nuevo_documento', NULL, '{"id_documento": 18, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 100, "temperatura": 36.5, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (15, 6, '2025-07-19 17:39:10.635581', 9, 'nuevo_expediente', NULL, '{"estado": "Activo", "id_paciente": 4, "numero_expediente": "HG-2025-3502891416"}', '::1', NULL, NULL, 'Expediente creado para Dulce Parra');
INSERT INTO public.expediente_auditoria VALUES (16, 6, '2025-07-19 18:22:21.158429', 9, 'nuevo_documento', NULL, '{"id_documento": 20, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 22.29, "peso": 58.5, "talla": 162, "glucosa": 95, "temperatura": 36.8, "presion_arterial": "110/70", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 75, "frecuencia_respiratoria": 18}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (17, 6, '2025-07-19 18:31:32.304127', 9, 'nuevo_documento', NULL, '{"id_documento": 21, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 22.29, "peso": "58.50", "talla": "162.00", "glucosa": 95, "temperatura": 36.8, "presion_arterial": "110/70", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 75, "frecuencia_respiratoria": 18}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (18, 6, '2025-07-19 19:14:16.066743', 9, 'nuevo_documento', NULL, '{"id_documento": 22, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 22.29, "peso": "58.50", "talla": "162.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 74, "frecuencia_respiratoria": 22}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (19, 6, '2025-07-19 20:47:35.69425', 9, 'nuevo_documento', NULL, '{"id_documento": 23, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 22.29, "peso": "58.50", "talla": "162.00", "glucosa": 100, "temperatura": 35, "presion_arterial": "122/88", "saturacion_oxigeno": 99, "frecuencia_cardiaca": 77, "frecuencia_respiratoria": 22}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (20, 6, '2025-07-19 21:20:01.840884', 9, 'nuevo_documento', NULL, '{"id_documento": 24, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 22.29, "peso": "58.50", "talla": "162.00", "glucosa": 100, "temperatura": 33, "presion_arterial": "122/88", "saturacion_oxigeno": 99, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 22}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (21, 6, '2025-07-19 22:16:17.01807', 9, 'nuevo_documento', NULL, '{"id_documento": 25, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 22.29, "peso": "58.50", "talla": "162.00", "glucosa": 111, "temperatura": 33, "presion_arterial": "111/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (22, 6, '2025-07-20 00:52:12.879868', 9, 'nuevo_documento', NULL, '{"id_documento": 26, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 26, "peso": "58.50", "talla": 150, "glucosa": 100, "temperatura": 33, "presion_arterial": "111/88", "saturacion_oxigeno": 99, "frecuencia_cardiaca": 77, "frecuencia_respiratoria": 22}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (23, 6, '2025-07-20 02:13:59.668011', 9, 'nuevo_documento', NULL, '{"id_documento": 27, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 26, "peso": "58.50", "talla": "150.00", "glucosa": 100, "temperatura": 33, "presion_arterial": "120/88", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (24, 5, '2025-07-20 10:01:43.875507', 9, 'nuevo_documento', NULL, '{"id_documento": 29, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 100, "temperatura": 33, "presion_arterial": "111/88", "saturacion_oxigeno": 99, "frecuencia_cardiaca": 77, "frecuencia_respiratoria": 22}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (25, 5, '2025-07-22 14:16:17.613937', 20, 'nuevo_documento', NULL, '{"id_documento": 40, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 100, "temperatura": 33, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 77, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (26, 4, '2025-07-22 15:35:49.977742', 20, 'nuevo_documento', NULL, '{"id_documento": 43, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 100, "temperatura": 35, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (31, 5, '2025-07-22 21:43:38.644008', 20, 'actualizacion', '{"estado_anterior": "Activo", "notas_anteriores": "Tomo 1"}', '{"estado_nuevo": "Activo", "notas_nuevas": "Tomo 1"}', '::1', NULL, NULL, 'Expediente actualizado para Juan Garcia Lopez');
INSERT INTO public.expediente_auditoria VALUES (32, 5, '2025-07-22 22:30:08.786043', 20, 'nuevo_documento', NULL, '{"id_documento": 44, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 77, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (33, 3, '2025-07-22 22:42:33.608095', 20, 'actualizacion', '{"estado_anterior": "Activo", "notas_anteriores": "Paciente1"}', '{"estado_nuevo": "Activo", "notas_nuevas": "Paciente1"}', '::1', NULL, NULL, 'Expediente actualizado para Carlos Gonzales Martinez');
INSERT INTO public.expediente_auditoria VALUES (34, 3, '2025-07-22 22:42:35.547677', 20, 'actualizacion', '{"estado_anterior": "Activo", "notas_anteriores": "Paciente1"}', '{"estado_nuevo": "Activo", "notas_nuevas": "Paciente1"}', '::1', NULL, NULL, 'Expediente actualizado para Carlos Gonzales Martinez');
INSERT INTO public.expediente_auditoria VALUES (35, 5, '2025-07-22 23:14:50.642697', 20, 'nuevo_documento', NULL, '{"id_documento": 48, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (36, 5, '2025-07-23 21:08:29.763113', 20, 'nuevo_documento', NULL, '{"id_documento": 49, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (37, 5, '2025-07-24 13:32:24.730106', 20, 'nuevo_documento', NULL, '{"id_documento": 50, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 101, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (38, 5, '2025-07-28 08:50:53.941456', 20, 'nuevo_documento', NULL, '{"id_documento": 52, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": 70, "talla": 170, "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (39, 5, '2025-07-28 09:08:07.606869', 20, 'nuevo_documento', NULL, '{"id_documento": 53, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (40, 6, '2025-07-28 18:54:29.376647', 20, 'nuevo_documento', NULL, '{"id_documento": 54, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 26, "peso": "58.50", "talla": "150.00", "glucosa": 100, "temperatura": 36.5, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (41, 6, '2025-07-28 21:45:26.519118', 20, 'nuevo_documento', NULL, '{"id_documento": 55, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 26, "peso": "58.50", "talla": "150.00", "glucosa": 100, "temperatura": 37, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (42, 6, '2025-07-28 22:52:21.055921', 20, 'nuevo_documento', NULL, '{"id_documento": 56, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 26, "peso": "58.50", "talla": "150.00", "glucosa": 100, "temperatura": 35, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (43, 6, '2025-07-29 03:35:32.936786', 20, 'nuevo_documento', NULL, '{"id_documento": 57, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 26, "peso": "58.50", "talla": "150.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (44, 4, '2025-07-29 19:54:58.475444', 20, 'nuevo_documento', NULL, '{"id_documento": 58, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (45, 4, '2025-07-30 01:51:09.293477', 20, 'actualizacion', '{"estado_anterior": "Activo", "notas_anteriores": "MALO"}', '{"estado_nuevo": "Activo", "notas_nuevas": "MALO"}', '::1', NULL, NULL, 'Expediente actualizado para Juan García López');
INSERT INTO public.expediente_auditoria VALUES (46, 3, '2025-07-30 02:15:41.934692', 20, 'nuevo_documento', NULL, '{"id_documento": 59, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (47, 3, '2025-07-30 15:01:16.413394', 20, 'nuevo_documento', NULL, '{"id_documento": 60, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (48, 3, '2025-07-30 22:05:08.55333', 20, 'nuevo_documento', NULL, '{"id_documento": 61, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 111, "temperatura": 36, "presion_arterial": "120/88", "saturacion_oxigeno": 99, "frecuencia_cardiaca": 77, "frecuencia_respiratoria": 22}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (49, 3, '2025-07-30 22:10:32.499015', 20, 'nuevo_documento', NULL, '{"id_documento": 62, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 111, "temperatura": 39, "presion_arterial": "130/90", "saturacion_oxigeno": 99, "frecuencia_cardiaca": 77, "frecuencia_respiratoria": 22}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (50, 5, '2025-07-31 09:48:22.689276', 20, 'nuevo_documento', NULL, '{"id_documento": 63, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 111, "temperatura": 36, "presion_arterial": "111/88", "saturacion_oxigeno": 99, "frecuencia_cardiaca": 77, "frecuencia_respiratoria": 22}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (51, 5, '2025-07-31 12:47:25.655992', 20, 'nuevo_documento', NULL, '{"id_documento": 66, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.22, "peso": "70.00", "talla": "170.00", "glucosa": 100, "temperatura": 33, "presion_arterial": "111/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (52, 4, '2025-07-31 12:58:17.934265', 20, 'nuevo_documento', NULL, '{"id_documento": 67, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 100, "temperatura": 33, "presion_arterial": "120/80", "saturacion_oxigeno": 88, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (53, 4, '2025-07-31 13:21:04.497642', 20, 'nuevo_documento', NULL, '{"id_documento": 68, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 100, "temperatura": 33, "presion_arterial": "111/88", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 77, "frecuencia_respiratoria": 22}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (54, 6, '2025-07-31 14:17:06.487011', 20, 'nuevo_documento', NULL, '{"id_documento": 69, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 26, "peso": "58.50", "talla": "150.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (55, 4, '2025-08-04 12:24:54.956336', 20, 'nuevo_documento', NULL, '{"id_documento": 73, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 23.67, "peso": "72.50", "talla": "175.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (56, 7, '2025-08-04 14:42:07.859046', 9, 'nuevo_expediente', NULL, '{"estado": "Activo", "id_paciente": 6, "numero_expediente": "HG-2025-1277433615"}', '::1', NULL, NULL, 'Expediente creado para María del Carmen Hernández');
INSERT INTO public.expediente_auditoria VALUES (57, 8, '2025-08-04 14:51:20.376693', 9, 'nuevo_expediente', NULL, '{"estado": "Activo", "id_paciente": 7, "numero_expediente": "HG-2025-6803578927"}', '::1', NULL, NULL, 'Expediente creado para José Eduardo Martínez');
INSERT INTO public.expediente_auditoria VALUES (58, 8, '2025-08-04 15:01:52.175648', 20, 'nuevo_documento', NULL, '{"id_documento": 77, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 25.18, "peso": 74.5, "talla": 172, "glucosa": 98, "temperatura": 36.5, "presion_arterial": "125/82", "saturacion_oxigeno": 97, "frecuencia_cardiaca": 76, "frecuencia_respiratoria": 18}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (59, 8, '2025-08-06 10:35:27.70194', 20, 'nuevo_documento', NULL, '{"id_documento": 111, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 25.18, "peso": "74.50", "talla": "172.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (60, 8, '2025-08-07 16:16:06.445174', 20, 'nuevo_documento', NULL, '{"id_documento": 112, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 25.18, "peso": "74.50", "talla": "172.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (61, 8, '2025-08-10 21:24:39.053602', 20, 'nuevo_documento', NULL, '{"id_documento": 114, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 25.18, "peso": "74.50", "talla": "172.00", "glucosa": 100, "temperatura": 36, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 20}}', '::1', NULL, NULL, 'Registro de signos vitales');
INSERT INTO public.expediente_auditoria VALUES (62, 9, '2025-08-15 09:22:32.687765', 9, 'nuevo_expediente', NULL, '{"estado": "Activo", "id_paciente": 8, "numero_expediente": "HG-2025-3525681547"}', '::1', NULL, NULL, 'Expediente creado para Marisol Corona');
INSERT INTO public.expediente_auditoria VALUES (63, 10, '2025-08-15 15:38:50.705563', 9, 'nuevo_expediente', NULL, '{"estado": "Activo", "id_paciente": 9, "numero_expediente": "HG-2025-9304519829"}', '::1', NULL, NULL, 'Expediente creado para Juan Daniel Lopez');


--
-- Data for Name: guia_clinica; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.guia_clinica VALUES (1, 'Urgencias', 'IMSS-030_08', 'TRIAGE', 'IMSS', '2025-01-15', 'Clasificación de urgencias médicas', true);
INSERT INTO public.guia_clinica VALUES (2, 'Urgencias', 'ISSSTE-663-13', 'ABSCESO ANAL', 'ISSSTE', '2023-05-01', 'Manejo de abscesos anales', true);
INSERT INTO public.guia_clinica VALUES (3, 'Urgencias', 'ISSSTE-680-13', 'ACCESOS VASCULARES', 'ISSSTE', '2023-05-01', 'Protocolo de accesos vasculares', true);
INSERT INTO public.guia_clinica VALUES (4, 'Urgencias', 'SS-027-08', 'INFECCIÓN VÍAS URINARIAS MENORES 18 AÑOS', 'SSA', '2023-05-01', 'ITU en población pediátrica', true);
INSERT INTO public.guia_clinica VALUES (5, 'Urgencias', 'IMSS-142-09', 'CHOQUE HIPOVOLÉMICO', 'IMSS', '2024-03-10', 'Manejo del choque hipovolémico', true);
INSERT INTO public.guia_clinica VALUES (6, 'Pediatría', 'SS-149_08', 'FIEBRE REUMÁTICA', 'SSA', '2025-01-19', 'Secuela postestreptocócica', true);
INSERT INTO public.guia_clinica VALUES (7, 'Pediatría', 'IMSS-510-11', 'BRONQUIOLITIS AGUDA', 'IMSS', '2024-11-20', 'Manejo de bronquiolitis en lactantes', true);
INSERT INTO public.guia_clinica VALUES (8, 'Pediatría', 'SSA-025-08', 'DIARREA AGUDA EN NIÑOS', 'SSA', '2024-08-15', 'Protocolo de diarrea pediátrica', true);
INSERT INTO public.guia_clinica VALUES (9, 'Pediatría', 'IMSS-031-08', 'NEUMONÍA ADQUIRIDA EN LA COMUNIDAD', 'IMSS', '2024-06-30', 'NAC en población pediátrica', true);
INSERT INTO public.guia_clinica VALUES (10, 'Gastroenterología', 'SS-150_08', 'ÚLCERA PÉPTICA EN ADULTOS', 'SSA', '2025-01-19', 'Lesión mucosa gastroduodenal', true);
INSERT INTO public.guia_clinica VALUES (11, 'Gastroenterología', 'IMSS-068-08', 'ENFERMEDAD POR REFLUJO GASTROESOFÁGICO', 'IMSS', '2024-04-12', 'ERGE en adultos', true);
INSERT INTO public.guia_clinica VALUES (12, 'Infectología', 'SS-151_08', 'DENGUE', 'SSA', '2025-01-19', 'Infección viral por mosquito', true);
INSERT INTO public.guia_clinica VALUES (13, 'Infectología', 'IMSS-245-09', 'TUBERCULOSIS PULMONAR', 'IMSS', '2024-09-25', 'Diagnóstico y tratamiento de TB', true);
INSERT INTO public.guia_clinica VALUES (14, 'Cardiología', 'IMSS-232-09', 'INFARTO AGUDO AL MIOCARDIO', 'IMSS', '2024-12-01', 'Manejo del IAM', true);
INSERT INTO public.guia_clinica VALUES (15, 'Cardiología', 'SSA-086-08', 'HIPERTENSIÓN ARTERIAL SISTÉMICA', 'SSA', '2024-07-18', 'Control de HAS', true);
INSERT INTO public.guia_clinica VALUES (16, 'Ginecología', 'IMSS-028-08', 'CONTROL PRENATAL', 'IMSS', '2024-10-30', 'Seguimiento del embarazo', true);
INSERT INTO public.guia_clinica VALUES (17, 'Ginecología', 'SSA-048-08', 'PREECLAMPSIA', 'SSA', '2024-05-22', 'Hipertensión gestacional', true);
INSERT INTO public.guia_clinica VALUES (18, 'Cirugía', 'IMSS-338-10', 'APENDICITIS AGUDA', 'IMSS', '2024-08-08', 'Diagnóstico y tratamiento quirúrgico', true);
INSERT INTO public.guia_clinica VALUES (19, 'Cirugía', 'SSA-195-09', 'COLECISTITIS AGUDA', 'SSA', '2024-03-15', 'Inflamación de vesícula biliar', true);
INSERT INTO public.guia_clinica VALUES (20, 'Urgencias', 'IMSS-030_08', 'TRIAGE', 'IMSS', '2025-01-15', 'Clasificación de urgencias médicas', true);
INSERT INTO public.guia_clinica VALUES (21, 'Urgencias', 'ISSSTE-663-13', 'ABSCESO ANAL', 'ISSSTE', '2023-05-01', 'Manejo de abscesos anales', true);
INSERT INTO public.guia_clinica VALUES (22, 'Urgencias', 'ISSSTE-680-13', 'ACCESOS VASCULARES', 'ISSSTE', '2023-05-01', 'Protocolo de accesos vasculares', true);
INSERT INTO public.guia_clinica VALUES (23, 'Urgencias', 'SS-027-08', 'INFECCIÓN VÍAS URINARIAS MENORES 18 AÑOS', 'SSA', '2023-05-01', 'ITU en población pediátrica', true);
INSERT INTO public.guia_clinica VALUES (24, 'Urgencias', 'IMSS-142-09', 'CHOQUE HIPOVOLÉMICO', 'IMSS', '2024-03-10', 'Manejo del choque hipovolémico', true);
INSERT INTO public.guia_clinica VALUES (25, 'Pediatría', 'SS-149_08', 'FIEBRE REUMÁTICA', 'SSA', '2025-01-19', 'Secuela postestreptocócica', true);
INSERT INTO public.guia_clinica VALUES (26, 'Pediatría', 'IMSS-510-11', 'BRONQUIOLITIS AGUDA', 'IMSS', '2024-11-20', 'Manejo de bronquiolitis en lactantes', true);
INSERT INTO public.guia_clinica VALUES (27, 'Pediatría', 'SSA-025-08', 'DIARREA AGUDA EN NIÑOS', 'SSA', '2024-08-15', 'Protocolo de diarrea pediátrica', true);
INSERT INTO public.guia_clinica VALUES (28, 'Pediatría', 'IMSS-031-08', 'NEUMONÍA ADQUIRIDA EN LA COMUNIDAD', 'IMSS', '2024-06-30', 'NAC en población pediátrica', true);
INSERT INTO public.guia_clinica VALUES (29, 'Gastroenterología', 'SS-150_08', 'ÚLCERA PÉPTICA EN ADULTOS', 'SSA', '2025-01-19', 'Lesión mucosa gastroduodenal', true);
INSERT INTO public.guia_clinica VALUES (30, 'Gastroenterología', 'IMSS-068-08', 'ENFERMEDAD POR REFLUJO GASTROESOFÁGICO', 'IMSS', '2024-04-12', 'ERGE en adultos', true);
INSERT INTO public.guia_clinica VALUES (31, 'Infectología', 'SS-151_08', 'DENGUE', 'SSA', '2025-01-19', 'Infección viral por mosquito', true);
INSERT INTO public.guia_clinica VALUES (32, 'Infectología', 'IMSS-245-09', 'TUBERCULOSIS PULMONAR', 'IMSS', '2024-09-25', 'Diagnóstico y tratamiento de TB', true);
INSERT INTO public.guia_clinica VALUES (33, 'Cardiología', 'IMSS-232-09', 'INFARTO AGUDO AL MIOCARDIO', 'IMSS', '2024-12-01', 'Manejo del IAM', true);
INSERT INTO public.guia_clinica VALUES (34, 'Cardiología', 'SSA-086-08', 'HIPERTENSIÓN ARTERIAL SISTÉMICA', 'SSA', '2024-07-18', 'Control de HAS', true);
INSERT INTO public.guia_clinica VALUES (35, 'Ginecología', 'IMSS-028-08', 'CONTROL PRENATAL', 'IMSS', '2024-10-30', 'Seguimiento del embarazo', true);
INSERT INTO public.guia_clinica VALUES (36, 'Ginecología', 'SSA-048-08', 'PREECLAMPSIA', 'SSA', '2024-05-22', 'Hipertensión gestacional', true);
INSERT INTO public.guia_clinica VALUES (37, 'Cirugía', 'IMSS-338-10', 'APENDICITIS AGUDA', 'IMSS', '2024-08-08', 'Diagnóstico y tratamiento quirúrgico', true);
INSERT INTO public.guia_clinica VALUES (38, 'Cirugía', 'SSA-195-09', 'COLECISTITIS AGUDA', 'SSA', '2024-03-15', 'Inflamación de vesícula biliar', true);
INSERT INTO public.guia_clinica VALUES (39, 'Urgencias', 'IMSS-030_08', 'TRIAGE', 'ISSSTE', '2025-05-19', '', true);
INSERT INTO public.guia_clinica VALUES (40, 'Urgencias', 'ISSSTE-663-13', 'ABSCESOANAL', 'ISSSTE', '2023-05-01', '', true);
INSERT INTO public.guia_clinica VALUES (41, 'Urgencias', 'ISSSTE-680-13', 'ACCESOS VASCULARES', 'ISSSTE', '2023-05-01', '', true);
INSERT INTO public.guia_clinica VALUES (42, 'Urgencias', 'S-027-08', 'INFECCION VIAS URINARIAS MENORES 18ANIOS', 'S', '2023-05-01', '', true);
INSERT INTO public.guia_clinica VALUES (43, 'Urgencias', 'SS-148-08', 'INTOXICACION_VENENO_ALACRAN', 'SS', '2023-05-01', '', true);
INSERT INTO public.guia_clinica VALUES (44, 'GINECOLOGIA', 'ISSSTE-339-08', 'TRIAGE', 'ISSSTE', '2025-05-19', 'Guía clínica para triage en urgencias obstétricas.', true);
INSERT INTO public.guia_clinica VALUES (45, 'GINECOLOGIA', 'ISSSTE-663-13', 'ABSCESO ANAL', 'ISSSTE', '2025-05-19', 'Diagnóstico y tratamiento de absceso anal.', true);
INSERT INTO public.guia_clinica VALUES (46, 'GINECOLOGIA', 'ISSSTE-680-13', 'ACCESOS VASCULARES', 'ISSSTE', '2025-05-19', 'Manejo clínico de accesos vasculares.', true);
INSERT INTO public.guia_clinica VALUES (47, 'GINECOLOGIA', 'DIF-565-12', 'LESION OBSTETRICA DEL PLEXO BRAQUIAL', 'DIF', '2025-05-19', 'Tratamiento de lesiones del plexo braquial por parto.', true);
INSERT INTO public.guia_clinica VALUES (48, 'GINECOLOGIA', 'IMSS-028-08', 'CONTROL PRENATAL CON ENFOQUE DE RIESGO', 'IMSS', '2025-05-19', 'Control prenatal basado en evaluación de riesgo.', true);
INSERT INTO public.guia_clinica VALUES (49, 'GINECOLOGIA', 'IMSS-048-08', 'REDUCCION FRECUENCIA DE OPERACION CESAREA', 'IMSS', '2025-05-19', 'Estrategias para reducir cesáreas innecesarias.', true);
INSERT INTO public.guia_clinica VALUES (50, 'GINECOLOGIA', 'IMSS-052-08', 'VIGILANCIA Y MANEJO DEL TRABAJO DE PARTO', 'IMSS', '2025-05-19', 'Manejo clínico durante trabajo de parto.', true);
INSERT INTO public.guia_clinica VALUES (51, 'GINECOLOGIA', 'IMSS-056-08', 'DETECCION, DIAGNOSTICO Y TRATAMIENTO INICIAL DE INCONTINENCIA EN LA MUJER', 'IMSS', '2025-05-19', 'Incontinencia urinaria en mujeres.', true);
INSERT INTO public.guia_clinica VALUES (52, 'GINECOLOGIA', 'IMSS-058-08', 'DETECCION Y DIAGNOSTICO DE ENFERMEDAD HIPERTENSIVA DEL EMBARAZO', 'IMSS', '2025-05-19', 'Hipertensión durante embarazo.', true);
INSERT INTO public.guia_clinica VALUES (53, 'GINECOLOGIA', 'IMSS-063-08', 'DIAGNOSTICO Y MANEJO DEL PARTO PRETERMINO', 'IMSS', '2025-05-19', 'Parto antes de las 37 semanas.', true);
INSERT INTO public.guia_clinica VALUES (54, 'GINECOLOGIA', 'IMSS-072-08', 'DIAGNOSTICO Y TRATAMIENTO DE LA ENFERMEDAD INFLAMATORIA PELVICA', 'IMSS', '2025-05-19', 'Enfermedad inflamatoria pélvica en mujeres sexualmente activas.', true);
INSERT INTO public.guia_clinica VALUES (55, 'GINECOLOGIA', 'IMSS-077-08', 'DIAGNOSTICO Y TRATAMIENTO DE LA INFECCION AGUDA NO COMPLICADA DEL TRACTO URINARIO EN LA MUJER', 'IMSS', '2025-05-19', 'ITU no complicada en mujeres.', true);
INSERT INTO public.guia_clinica VALUES (56, 'GINECOLOGIA', 'IMSS-078-08', 'DIAGNOSTICO Y TRATAMIENTO DE LA INFECCION DEL TRACTO URINARIO BAJO DURANTE EL EMBARAZO', 'IMSS', '2025-05-19', 'ITU bajo en embarazadas.', true);
INSERT INTO public.guia_clinica VALUES (57, 'GINECOLOGIA', 'IMSS-081-08', 'DIAGNOSTICO Y TRATAMIENTO DE LA VAGINITIS INFECCIOSA EN MUJERES EN EDAD REPRODUCTIVA', 'IMSS', '2025-05-19', 'Tratamiento de vaginitis infecciosa.', true);
INSERT INTO public.guia_clinica VALUES (58, 'GINECOLOGIA', 'IMSS-082-08', 'DIAGNOSTICO Y TRATAMIENTO DE MIOMATOSIS UTERINA', 'IMSS', '2025-05-19', 'Fibromas uterinos.', true);
INSERT INTO public.guia_clinica VALUES (59, 'GINECOLOGIA', 'IMSS-088-08', 'DIAGNOSTICO Y TRATAMIENTO DEL ABORTO ESPONTANEO Y MANEJO INICIAL DEL ABORTO RECURRENTE', 'IMSS', '2025-05-19', 'Aborto espontáneo y recurrente.', true);
INSERT INTO public.guia_clinica VALUES (60, 'GINECOLOGIA', 'IMSS-094-08', 'ENFERMEDADES DE TRANSMISION SEXUAL QUE PRODUCEN ULCERAS GENITALES', 'IMSS', '2025-05-19', 'ETS: herpes, sífilis, chancroide, etc.', true);
INSERT INTO public.guia_clinica VALUES (61, 'GINECOLOGIA', 'IMSS-162-09', 'DIAGNOSTICO Y TRATAMIENTO DE LA HEMORRAGIA OBSTETRICA EN LA SEGUNDA MITAD DEL EMBARAZO Y PUERPERIO', 'IMSS', '2025-05-19', 'Hemorragia obstétrica.', true);
INSERT INTO public.guia_clinica VALUES (113, 'GINECOLOGIA', 'SS-207-09', 'ENDOMETRIOSIS', 'ISSSTE', '2025-05-19', 'Endometriosis.', true);
INSERT INTO public.guia_clinica VALUES (62, 'GINECOLOGIA', 'IMSS-182-09', 'DIAGNOSTICO Y TRATAMIENTO DE EMBARAZO TUBARIO', 'IMSS', '2025-05-19', 'Embarazo ectópico.', true);
INSERT INTO public.guia_clinica VALUES (63, 'GINECOLOGIA', 'IMSS-183-09', 'DIAGNOSTICO Y TRATAMIENTO DE DISMENORREA', 'IMSS', '2025-05-19', 'Dolor menstrual.', true);
INSERT INTO public.guia_clinica VALUES (64, 'GINECOLOGIA', 'IMSS-240-09', 'DIAGNOSTICO Y TRATAMIENTO DE LA PATOLOGIA MAMARIA BENIGNA', 'IMSS', '2025-05-19', 'Patología mamaria benigna.', true);
INSERT INTO public.guia_clinica VALUES (65, 'GINECOLOGIA', 'IMSS-263-10', 'DIAGNOSTICO Y TRATAMIENTO DEL PROLAPSO DE LA PARED VAGINAL ANTERIOR (CISTOCELE)', 'IMSS', '2025-05-19', 'Prolapso vaginal e incontinencia urinaria.', true);
INSERT INTO public.guia_clinica VALUES (66, 'GINECOLOGIA', 'IMSS-272-10', 'DIAGNOSTICO Y TRATAMIENTO DE LA SEPSIS PUERPERAL', 'IMSS', '2025-05-19', 'Sepsis postparto.', true);
INSERT INTO public.guia_clinica VALUES (67, 'GINECOLOGIA', 'IMSS-307-10', 'PREVENCION, DIAGNOSTICO Y MANEJO DE LA ALOINMUNIZACION MATERNO-FETAL', 'IMSS', '2025-05-19', 'Inmunización Rh negativo.', true);
INSERT INTO public.guia_clinica VALUES (68, 'GINECOLOGIA', 'IMSS-320-10', 'DIAGNOSTICO Y TRATAMIENTO DE LA DIABETES EN EL EMBARAZO', 'IMSS', '2025-05-19', 'Diabetes gestacional.', true);
INSERT INTO public.guia_clinica VALUES (69, 'GINECOLOGIA', 'IMSS-322-10', 'DIAGNOSTICO Y TRATAMIENTO DE LA HEMORRAGIA UTERINA DISFUNCIONAL', 'IMSS', '2025-05-19', 'Hemorragia uterina anovulatoria.', true);
INSERT INTO public.guia_clinica VALUES (70, 'GINECOLOGIA', 'IMSS-333-09', 'DIAGNOSTICO Y TRATAMIENTO DEL CANCER CERVICOUTERINO', 'IMSS', '2025-05-19', 'Cáncer cervicouterino.', true);
INSERT INTO public.guia_clinica VALUES (71, 'GINECOLOGIA', 'IMSS-383-10', 'PREVENCION, DIAGNOSTICO Y ATENCION DE LA RUBEOLA DURANTE EL EMBARAZO', 'IMSS', '2025-05-19', 'Rubéola en embarazo.', true);
INSERT INTO public.guia_clinica VALUES (72, 'GINECOLOGIA', 'IMSS-402-10', 'DIAGNOSTICO Y TRATAMIENTO DE TRACOMA', 'IMSS', '2025-05-19', 'Tracoma.', true);
INSERT INTO public.guia_clinica VALUES (73, 'GINECOLOGIA', 'IMSS-436-11', 'DETECCION Y TRATAMIENTO INICIAL DE LAS EMERGENCIAS OBSTETRICAS', 'IMSS', '2025-05-19', 'Emergencias obstétricas.', true);
INSERT INTO public.guia_clinica VALUES (74, 'GINECOLOGIA', 'IMSS-455-11', 'VALORACION PERIOPERATORIA EN CIRUGIA NO CARDIACA EN EL ADULTO', 'IMSS', '2025-05-19', 'Evaluación preoperatoria.', true);
INSERT INTO public.guia_clinica VALUES (75, 'GINECOLOGIA', 'IMSS-468-11', 'TRATAMIENTO MEDICO Y QUIRURGICO DEL CANCER EPITELIAL DEL OVARIO', 'IMSS', '2025-05-19', 'Cáncer ovárico.', true);
INSERT INTO public.guia_clinica VALUES (76, 'GINECOLOGIA', 'IMSS-472-11', 'PREVENCION, DIAGNOSTICO Y TRATAMIENTO DE LA INFECCION URINARIA ASOCIADA A SONDA VESICAL EN LA MUJER', 'IMSS', '2025-05-19', 'ITU asociada a sonda vesical.', true);
INSERT INTO public.guia_clinica VALUES (77, 'GINECOLOGIA', 'IMSS-478-11', 'DIAGNOSTICO Y TRATAMIENTO DEL CANCER DE ENDOMETRIO', 'IMSS', '2025-05-19', 'Cáncer endometrial.', true);
INSERT INTO public.guia_clinica VALUES (78, 'GINECOLOGIA', 'IMSS-500-11', 'DIAGNOSTICO Y TRATAMIENTO DE LA RESTRICCION DEL CRECIMIENTO INTRAUTERINO', 'IMSS', '2025-05-19', 'Retardo del crecimiento fetal.', true);
INSERT INTO public.guia_clinica VALUES (79, 'GINECOLOGIA', 'IMSS-509-11', 'LAPAROTOMIA Y LAPAROSCOPIA DIAGNOSTICA EN ABDOMEN AGUDO NO TRAUMATICO EN EL ADULTO', 'IMSS', '2025-05-19', 'Abdomen agudo.', true);
INSERT INTO public.guia_clinica VALUES (80, 'GINECOLOGIA', 'IMSS-530-11', 'PREVENCION, DIAGNOSTICO Y CRITERIOS QUIRURGICOS DE FISTULA VESICOVAGINAL', 'IMSS', '2025-05-19', 'Fístula vesicovaginal.', true);
INSERT INTO public.guia_clinica VALUES (81, 'GINECOLOGIA', 'IMSS-538-11', 'DIAGNOSTICO Y MANEJO DE LA CARDIOPATIA EN EL EMBARAZO', 'IMSS', '2025-05-19', 'Cardiopatía materna.', true);
INSERT INTO public.guia_clinica VALUES (82, 'GINECOLOGIA', 'IMSS-539-12', 'INDICACIONES Y MANEJO DEL CERCLAJE CERVICAL', 'IMSS', '2025-05-19', 'Cerclaje cervical.', true);
INSERT INTO public.guia_clinica VALUES (83, 'GINECOLOGIA', 'IMSS-558-12', 'PRESCRIPCION FARMACOLOGICA RAZONADA PARA EL ADULTO MAYOR', 'IMSS', '2025-05-19', 'Farmacología racional en adulto mayor.', true);
INSERT INTO public.guia_clinica VALUES (84, 'GINECOLOGIA', 'IMSS-568-12', 'ATENCION DE LOS PADECIMIENTOS GINECOLOGICOS MAS FRECUENTES EN LA POSTMENOPAUSIA', 'IMSS', '2025-05-19', 'Problemas ginecológicos en menopausia.', true);
INSERT INTO public.guia_clinica VALUES (85, 'GINECOLOGIA', 'IMSS-569-12', 'DIAGNOSTICO Y TRATAMIENTO DEL SINDROME DEL SENO ENFERMO', 'IMSS', '2025-05-19', 'Síndrome del seno enfermo.', true);
INSERT INTO public.guia_clinica VALUES (86, 'GINECOLOGIA', 'IMSS-580-12', 'VACUNACION EN LA EMBARAZADA', 'IMSS', '2025-05-19', 'Vacunación segura durante embarazo.', true);
INSERT INTO public.guia_clinica VALUES (87, 'GINECOLOGIA', 'IMSS-581-12', 'DIAGNOSTICO Y TRATAMIENTO DE QUISTE Y ABSCESO DE LA GLANDULA DE BARTHOLIN', 'IMSS', '2025-05-19', 'Glándula de Bartholin.', true);
INSERT INTO public.guia_clinica VALUES (88, 'GINECOLOGIA', 'IMSS-586-12', 'INTERVENCIONES DE ENFERMERIA EN LA PACIENTE CON PREECLAMPSIA/ECLAMPSIA', 'IMSS', '2025-05-19', 'Atención de enfermería en preeclampsia.', true);
INSERT INTO public.guia_clinica VALUES (89, 'GINECOLOGIA', 'IMSS-605-13', 'PARTO DESPUES DE UNA CESAREA', 'IMSS', '2025-05-19', 'VBAC.', true);
INSERT INTO public.guia_clinica VALUES (90, 'GINECOLOGIA', 'IMSS-609-13', 'DIAGNOSTICO Y TRATAMIENTO DE CANDIDOSIS VULVOVAGINAL', 'IMSS', '2025-05-19', 'Candidiasis genital.', true);
INSERT INTO public.guia_clinica VALUES (91, 'GINECOLOGIA', 'IMSS-628-13', 'DIAGNOSTICO Y MANEJO DEL EMBARAZO MULTIPLE', 'IMSS', '2025-05-19', 'Gemelar, trillizos.', true);
INSERT INTO public.guia_clinica VALUES (92, 'GINECOLOGIA', 'IMSS-644-13', 'DIAGNOSTICO DE HIPERPROLACTINEMIA', 'IMSS', '2025-05-19', 'Hiperprolactinemia.', true);
INSERT INTO public.guia_clinica VALUES (93, 'GINECOLOGIA', 'IMSS-649-14', 'DIAGNOSTICO Y TRATAMIENTO DE LAS INFECCIONES ASOCIADAS A DISPOSITIVOS ORTOPEDICOS', 'IMSS', '2025-05-19', 'Infecciones postimplante ortopédico.', true);
INSERT INTO public.guia_clinica VALUES (94, 'GINECOLOGIA', 'IMSS-673-13', 'DIAGNOSTICO Y TRATAMIENTO DE OSTEOPOROSIS EN MUJERES POSTMENOPAUSICAS', 'IMSS', '2025-05-19', 'Osteoporosis postmenopáusica.', true);
INSERT INTO public.guia_clinica VALUES (95, 'GINECOLOGIA', 'ISSSTE-124-08', 'DIAGNOSTICO Y TRATAMIENTO OPORTUNO DE LA PLACENTA PREVIA', 'ISSSTE', '2025-05-19', 'Placenta previa.', true);
INSERT INTO public.guia_clinica VALUES (96, 'GINECOLOGIA', 'ISSSTE-250-10', 'DIAGNOSTICO Y TRATAMIENTO DE LAS VERRUGAS VULGARES', 'ISSSTE', '2025-05-19', 'Verrugas comunes.', true);
INSERT INTO public.guia_clinica VALUES (97, 'GINECOLOGIA', 'ISSSTE-527-11', 'PREVENCION, DIAGNOSTICO Y TRATAMIENTO DE LA INFECCION EN HERIDA QUIRURGICA POST CESAREA', 'ISSSTE', '2025-05-19', 'Infección poscesárea.', true);
INSERT INTO public.guia_clinica VALUES (98, 'GINECOLOGIA', 'ISSSTE-658-13', 'TRATAMIENTO DEL CONDILOMA ACUMULADO EN MUJERES EN EDAD REPRODUCTIVA', 'ISSSTE', '2025-05-19', 'Condiloma acumulado.', true);
INSERT INTO public.guia_clinica VALUES (99, 'GINECOLOGIA', 'ISSSTE-681-13', 'DIAGNOSTICO Y TRATAMIENTO DEL EMBARAZO ECTOPICO', 'ISSSTE', '2025-05-19', 'Embarazo tubario.', true);
INSERT INTO public.guia_clinica VALUES (100, 'GINECOLOGIA', 'ISSSTE-700-13', 'RECONSTRUCCION DE MAMA EN PACIENTES ONCOLOGICAS', 'ISSSTE', '2025-05-19', 'Reconstrucción mamaria.', true);
INSERT INTO public.guia_clinica VALUES (101, 'GINECOLOGIA', 'S-001-08', 'PREVENCION, TAMIZAJE Y REFERENCIA OPORTUNA DE CASOS SOSPECHOSOS DE CANCER MAMA', 'NOM', '2025-05-19', 'Tamizaje de cáncer de mama.', true);
INSERT INTO public.guia_clinica VALUES (102, 'GINECOLOGIA', 'S-019-08', 'DIAGNOSTICO Y TRATAMIENTO DE PERIMENOPAUSIA Y POSTMENOPAUSIA', 'NOM', '2025-05-19', 'Perimenopausia.', true);
INSERT INTO public.guia_clinica VALUES (103, 'GINECOLOGIA', 'S-020-08', 'ATENCION INTEGRAL DE PREECLAMPSIA EN EL SEGUNDO Y TERCER NIVEL DE ATENCION', 'NOM', '2025-05-19', 'Preeclampsia severa.', true);
INSERT INTO public.guia_clinica VALUES (104, 'GINECOLOGIA', 'S-027-08', 'PREVENCION, DIAGNOSTICO Y TRATAMIENTO DE LA INFECCION DE VIAS URINARIAS NO COMPLICADA EN MENORES DE 18 AÑOS', 'NOM', '2025-05-19', 'ITU pediátrica.', true);
INSERT INTO public.guia_clinica VALUES (105, 'GINECOLOGIA', 'S-146-08', 'PREVENCION Y DETECCION OPORTUNA DEL CANCER CERVICO UTERINO', 'NOM', '2025-05-19', 'Prevención de cáncer cervicouterino.', true);
INSERT INTO public.guia_clinica VALUES (106, 'GINECOLOGIA', 'S-228-09', 'DIAGNOSTICO Y TRATAMIENTO DE ENFERMEDAD TROFOBLASTICA GESTACIONAL', 'NOM', '2025-05-19', 'Mola hidatiforme.', true);
INSERT INTO public.guia_clinica VALUES (107, 'GINECOLOGIA', 'SEDENA-446-09', 'DIAGNOSTICO Y TRATAMIENTO DE LA RUPTURA PREMATURA DE MEMBRANAS EN PRETERMINO', 'SEDENA', '2025-05-19', 'ROM prematura.', true);
INSERT INTO public.guia_clinica VALUES (108, 'GINECOLOGIA', 'SS-006-08', 'PREVENCION Y DIAGNOSTICO OPORTUNO DE LA INFECCION DEL TRACTO GENITOURINARIO INFERIOR POR CHLAMYDIA TRACHOMATIS', 'ISSSTE', '2025-05-19', 'Clamidia.', true);
INSERT INTO public.guia_clinica VALUES (109, 'GINECOLOGIA', 'SS-026-08', 'PREVENCION, DIAGNOSTICO Y REFERENCIA DE LA AMENAZA DE ABORTO', 'ISSSTE', '2025-05-19', 'Amenaza de aborto.', true);
INSERT INTO public.guia_clinica VALUES (110, 'GINECOLOGIA', 'SS-103-08', 'PREVENCION Y MANEJO DE LA HEMORRAGIA POSTPARTO', 'ISSSTE', '2025-05-19', 'Hemorragia posparto.', true);
INSERT INTO public.guia_clinica VALUES (111, 'GINECOLOGIA', 'SS-118-08', 'PREVENCION PRIMARIA Y TAMIZAJE DEL PARTO PRETERMINO', 'ISSSTE', '2025-05-19', 'Tamizaje de parto pretérmino.', true);
INSERT INTO public.guia_clinica VALUES (112, 'GINECOLOGIA', 'SS-147-08', 'PREVENCION Y DIAGNOSTICO OPORTUNO DEL RIESGO DE ENFERMEDAD CARDIOVASCULAR EN LA MUJER', 'ISSSTE', '2025-05-19', 'Prevención de enfermedad cardiovascular.', true);
INSERT INTO public.guia_clinica VALUES (114, 'GINECOLOGIA', 'SS-221-09', 'ANEMIA FERROPRIVA', 'ISSSTE', '2025-05-19', 'Anemia por déficit de hierro.', true);
INSERT INTO public.guia_clinica VALUES (115, 'GINECOLOGIA', 'SS-293-10', 'OVARIO POLIQUISTICO', 'ISSSTE', '2025-05-19', 'Síndrome de ovario poliquístico.', true);
INSERT INTO public.guia_clinica VALUES (116, 'GINECOLOGIA', 'SS-295-10', 'HISTERECTOMIA', 'ISSSTE', '2025-05-19', 'Histerectomía.', true);
INSERT INTO public.guia_clinica VALUES (117, 'GINECOLOGIA', 'SS-347-09', 'CONSULTA Y ASESORIA MEDICA PARA EL USO DE LA OCLUSION TUBARIA BILATERAL', 'ISSSTE', '2025-05-19', 'Esterilización femenina.', true);
INSERT INTO public.guia_clinica VALUES (118, 'MEDICINA INTERNA', 'DIF-257-09', 'REHABILITACION DEL PACIENTE ADULTO AMPUTADO POR DIABETES MELLITUS', 'DIF', '2025-05-19', 'Rehabilitación funcional de pacientes adultos amputados por complicaciones diabéticas.', true);
INSERT INTO public.guia_clinica VALUES (119, 'MEDICINA INTERNA', 'DIF-331-09', 'REHABILITACION DE ADULTOS CON ENFERMEDAD VASCULAR CEREBRAL (EVC)', 'DIF', '2025-05-19', 'Rehabilitación neurológica post accidente cerebrovascular.', true);
INSERT INTO public.guia_clinica VALUES (120, 'MEDICINA INTERNA', 'DIF-399-10', 'TRATAMIENTO DE LA DISCAPACIDAD FISICA EN EL ADULTO', 'DIF', '2025-05-19', 'Manejo integral de discapacidad física.', true);
INSERT INTO public.guia_clinica VALUES (121, 'MEDICINA INTERNA', 'IMSS-007_08', 'ENFERMEDAD ARTERIAL PERIFERICA', 'IMSS', '2025-05-19', 'Diagnóstico y manejo de enfermedad arterial periférica.', true);
INSERT INTO public.guia_clinica VALUES (122, 'MEDICINA INTERNA', 'IMSS-030_08', 'CANCER PULMONAR DE CELULAS NO PEQUEÑAS', 'IMSS', '2025-05-19', 'Tratamiento oncológico del cáncer pulmonar no microcítico.', true);
INSERT INTO public.guia_clinica VALUES (123, 'MEDICINA INTERNA', 'IMSS-037_08', 'ENFERMEDAD PULMONAR OBSTRUCTIVA CRONICA (EPOC)', 'IMSS', '2025-05-19', 'Manejo clínico de EPOC en adultos.', true);
INSERT INTO public.guia_clinica VALUES (124, 'MEDICINA INTERNA', 'IMSS-038_08', 'INSUFICIENCIA HEPATICA CRONICA', 'IMSS', '2025-05-19', 'Diagnóstico y tratamiento de insuficiencia hepática crónica.', true);
INSERT INTO public.guia_clinica VALUES (125, 'MEDICINA INTERNA', 'IMSS-045_08', 'LUMBALGIA AGUDA Y CRONICA', 'IMSS', '2025-05-19', 'Evaluación y manejo del dolor lumbar.', true);
INSERT INTO public.guia_clinica VALUES (126, 'MEDICINA INTERNA', 'IMSS-046_08', 'SOBREPESO Y OBESIDAD EXOGENA', 'IMSS', '2025-05-19', 'Intervención nutricional y médica para sobrepeso y obesidad.', true);
INSERT INTO public.guia_clinica VALUES (127, 'MEDICINA INTERNA', 'IMSS-050_08', 'OBESIDAD MORBIDA EN EL ADOLESCENTE', 'IMSS', '2025-05-19', 'Tratamiento multidisciplinario de obesidad mórbida en adolescentes.', true);
INSERT INTO public.guia_clinica VALUES (128, 'MEDICINA INTERNA', 'IMSS-051_08', 'OBESIDAD MORBIDA EN EL ADULTO', 'IMSS', '2025-05-19', 'Manejo integral de obesidad mórbida en adultos.', true);
INSERT INTO public.guia_clinica VALUES (129, 'MEDICINA INTERNA', 'IMSS-066_08', 'PARALISIS DE BELL', 'IMSS', '2025-05-19', 'Diagnóstico y tratamiento de parálisis facial periférica.', true);
INSERT INTO public.guia_clinica VALUES (130, 'MEDICINA INTERNA', 'IMSS-084_08', 'SEPSIS GRAVE Y CHOQUE SEPTICO EN EL ADULTO', 'IMSS', '2025-05-19', 'Manejo inicial de sepsis grave y choque séptico.', true);
INSERT INTO public.guia_clinica VALUES (131, 'MEDICINA INTERNA', 'IMSS-085_08', 'SINDROME DE HOMBRO DOLOROSO', 'IMSS', '2025-05-19', 'Evaluación y tratamiento del hombro doloroso.', true);
INSERT INTO public.guia_clinica VALUES (132, 'MEDICINA INTERNA', 'IMSS-089-09', 'SINDROME DE GUILLAIN-BARRE', 'IMSS', '2025-05-19', 'Diagnóstico y manejo del síndrome de Guillain-Barré.', true);
INSERT INTO public.guia_clinica VALUES (133, 'MEDICINA INTERNA', 'IMSS-104_08', 'ULCERAS POR PRESION A NIVEL INTRAHOSPITALARIO', 'IMSS', '2025-05-19', 'Prevención y tratamiento de úlceras por presión.', true);
INSERT INTO public.guia_clinica VALUES (134, 'MEDICINA INTERNA', 'IMSS-112_08', 'TERAPIA INMUNOSUPRESORA EN EL PACIENTE RENAL', 'IMSS', '2025-05-19', 'Uso de inmunosupresores en trasplante renal.', true);
INSERT INTO public.guia_clinica VALUES (135, 'MEDICINA INTERNA', 'IMSS-171_09', 'RETINOPATIA DIABETICA', 'IMSS', '2025-05-19', 'Prevención y tratamiento de retinopatía diabética.', true);
INSERT INTO public.guia_clinica VALUES (136, 'MEDICINA INTERNA', 'IMSS-239_09', 'PANCREATITIS AGUDA EN SEGUNDO NIVEL DE ATENCION', 'IMSS', '2025-05-19', 'Manejo hospitalario de pancreatitis aguda.', true);
INSERT INTO public.guia_clinica VALUES (137, 'MEDICINA INTERNA', 'IMSS-319-10', 'PERITONITIS INFECCIOSA', 'IMSS', '2025-05-19', 'Diagnóstico y tratamiento de peritonitis bacteriana.', true);
INSERT INTO public.guia_clinica VALUES (138, 'MEDICINA INTERNA', 'IMSS-398-10', 'DIAGNOSTICO Y TRATAMIENTO DE SINDROME DE STEVENS-JOHNSON', 'IMSS', '2025-05-19', 'Manejo dermatológico de Stevens-Johnson.', true);
INSERT INTO public.guia_clinica VALUES (139, 'MEDICINA INTERNA', 'IMSS-433-11', 'HIPERTENSION ARTERIAL PULMONAR', 'IMSS', '2025-05-19', 'Evaluación y tratamiento de hipertensión pulmonar.', true);
INSERT INTO public.guia_clinica VALUES (140, 'MEDICINA INTERNA', 'IMSS-457-11', 'HIPERPARATIROIDISMO PRIMARIO', 'IMSS', '2025-05-19', 'Diagnóstico y manejo de hiperparatiroidismo primario.', true);
INSERT INTO public.guia_clinica VALUES (141, 'MEDICINA INTERNA', 'IMSS-466-11', 'ESCARLATINA', 'IMSS', '2025-05-19', 'Infección estreptocócica con exantema.', true);
INSERT INTO public.guia_clinica VALUES (142, 'MEDICINA INTERNA', 'IMSS-535_12', 'TAQUICARDIA SUPRAVENTRICULAR', 'IMSS', '2025-05-19', 'Manejo cardiológico de taquicardia supraventricular.', true);
INSERT INTO public.guia_clinica VALUES (143, 'MEDICINA INTERNA', 'IMSS-648-13', 'DIAGNOSTICO Y TRATAMIENTO DE HIPERNATREMIA', 'IMSS', '2025-05-19', 'Desbalance electrolítico: niveles altos de sodio.', true);
INSERT INTO public.guia_clinica VALUES (144, 'MEDICINA INTERNA', 'IMSS-672-13', 'INTERVENCIONES DE ENFERMERIA EN INFARTO AGUDO DEL MIOCARDIO', 'IMSS', '2025-05-19', 'Atención de enfermería en IAM.', true);
INSERT INTO public.guia_clinica VALUES (145, 'MEDICINA INTERNA', 'S-014-08', 'FIBRILACION AURICULAR', 'NOM', '2025-05-19', 'Arritmia auricular más común.', true);
INSERT INTO public.guia_clinica VALUES (146, 'MEDICINA INTERNA', 'S-102-08', 'ENFERMEDAD VASCULAR CEREBRAL ISQUEMICA', 'NOM', '2025-05-19', 'Accidente cerebrovascular isquémico.', true);
INSERT INTO public.guia_clinica VALUES (147, 'MEDICINA INTERNA', 'SS-292-09', 'HIPERPLASIA ENDOMETRIAL', 'ISSSTE', '2025-05-19', 'Patología benigna del endometrio.', true);
INSERT INTO public.guia_clinica VALUES (148, 'MEDICINA INTERNA', 'SS-292-10', 'HIPERTIROIDISMO EN EL EMBARAZO', 'ISSSTE', '2025-05-19', 'Trastorno tiroideo durante embarazo.', true);
INSERT INTO public.guia_clinica VALUES (149, 'PEDIATRIA', 'DIF-386-12', 'MENINGITIS TUBERCULOSA EN NIÑOS DE 0 A 5 AÑOS', 'DIF', '2025-05-19', 'Diagnóstico y tratamiento de meningitis tuberculosa pediátrica.', true);
INSERT INTO public.guia_clinica VALUES (150, 'PEDIATRIA', 'DIF-707-14', 'NEUROREHABILITACION DEL NIÑO PRETERMINO', 'DIF', '2025-05-19', 'Rehabilitación neurológica en niños prematuros.', true);
INSERT INTO public.guia_clinica VALUES (151, 'PEDIATRIA', 'IMSS-028_08', 'CONTROL PRENATAL CON ENFOQUE DE RIESGO', 'IMSS', '2025-05-19', 'Control prenatal basado en evaluación de riesgo.', true);
INSERT INTO public.guia_clinica VALUES (152, 'PEDIATRIA', 'IMSS-029_08', 'NUTRICION, DESARROLLO Y CRECIMIENTO EN MENORES DE 5 AÑOS', 'IMSS', '2025-05-19', 'Evaluación nutricional y desarrollo infantil.', true);
INSERT INTO public.guia_clinica VALUES (153, 'PEDIATRIA', 'IMSS-044_08', 'TAQUIPNEA TRANSITORIA DEL RECIÉN NACIDO', 'IMSS', '2025-05-19', 'Respiración rápida temporal en recién nacidos.', true);
INSERT INTO public.guia_clinica VALUES (154, 'PEDIATRIA', 'IMSS-054_08', 'CARDIOPATIAS CONGENITAS EN MAYORES DE 5 AÑOS', 'IMSS', '2025-05-19', 'Enfermedades cardíacas congénitas en niños mayores.', true);
INSERT INTO public.guia_clinica VALUES (155, 'PEDIATRIA', 'IMSS-062_08', 'INFECCION DE VIAS RESPIRATORIAS SUPERIORES', 'IMSS', '2025-05-19', 'Infecciones respiratorias altas en edad pediátrica.', true);
INSERT INTO public.guia_clinica VALUES (156, 'PEDIATRIA', 'IMSS-069_08', 'FALLA MEDULAR EN EDAD PEDIATRICA', 'IMSS', '2025-05-19', 'Anemia aplástica u otras causas de falla medular.', true);
INSERT INTO public.guia_clinica VALUES (157, 'PEDIATRIA', 'IMSS-109_08', 'PACIENTE PEDIATRICO CON SARAMPION', 'IMSS', '2025-05-19', 'Manejo clínico del sarampión en niños.', true);
INSERT INTO public.guia_clinica VALUES (158, 'PEDIATRIA', 'IMSS-137_08', 'SINDROME DE DIFICULTAD RESPIRATORIA EN RECIEN NACIDO', 'IMSS', '2025-05-19', 'SDRN por déficit de surfactante.', true);
INSERT INTO public.guia_clinica VALUES (159, 'PEDIATRIA', 'IMSS-141_08', 'HEMOFILIA PEDIATRICA', 'IMSS', '2025-05-19', 'Trastorno hemorrágico hereditario en niños.', true);
INSERT INTO public.guia_clinica VALUES (160, 'PEDIATRIA', 'IMSS-142_08', 'LEUCEMIA LINFOBLASTICA AGUDA', 'IMSS', '2025-05-19', 'Cáncer hematológico más común en la infancia.', true);
INSERT INTO public.guia_clinica VALUES (161, 'PEDIATRIA', 'IMSS-244-09', 'PRIMERA CRISIS CONVULSIVA EN NIÑOS', 'IMSS', '2025-05-19', 'Manejo inicial de crisis convulsivas.', true);
INSERT INTO public.guia_clinica VALUES (162, 'PEDIATRIA', 'IMSS-246-12', 'BINOMA MADRE-HIJO: VIH', 'IMSS', '2025-05-19', 'Prevención y manejo de transmisión vertical del VIH.', true);
INSERT INTO public.guia_clinica VALUES (163, 'PEDIATRIA', 'IMSS-248-09', 'HIDROCEFALIA', 'IMSS', '2025-05-19', 'Acumulación anormal de líquido cefalorraquídeo.', true);
INSERT INTO public.guia_clinica VALUES (164, 'PEDIATRIA', 'IMSS-258_10', 'LARINGOTRAQUEITIS', 'IMSS', '2025-05-19', 'Croup viral en niños pequeños.', true);
INSERT INTO public.guia_clinica VALUES (165, 'PEDIATRIA', 'IMSS-260_10', 'PTERIGION PRIMARIO Y RECURRENTE', 'IMSS', '2025-05-19', 'Degeneración conjuntival con crecimiento corneal.', true);
INSERT INTO public.guia_clinica VALUES (166, 'PEDIATRIA', 'IMSS-262-10', 'HIPERBILIRRUBINEMIA NEONATAL', 'IMSS', '2025-05-19', 'Ictericia en recién nacidos.', true);
INSERT INTO public.guia_clinica VALUES (167, 'PEDIATRIA', 'IMSS-279-10', 'HIDROCELE', 'IMSS', '2025-05-19', 'Acumulación de líquido alrededor del testículo.', true);
INSERT INTO public.guia_clinica VALUES (168, 'PEDIATRIA', 'IMSS-281-10', 'RETINOPATIA DEL PREMATURO', 'IMSS', '2025-05-19', 'Alteración vascular de la retina en prematuros.', true);
INSERT INTO public.guia_clinica VALUES (169, 'PEDIATRIA', 'IMSS-330-10', 'ESTENOSIS HIPERTROFICA DEL PILORO', 'IMSS', '2025-05-19', 'Obstrucción gástrica en lactantes.', true);
INSERT INTO public.guia_clinica VALUES (170, 'PEDIATRIA', 'IMSS-334-09', 'EPIGLOTITIS AGUDA EN PREESCOLARES', 'IMSS', '2025-05-19', 'Inflamación grave de la epiglotis.', true);
INSERT INTO public.guia_clinica VALUES (171, 'PEDIATRIA', 'IMSS-338-10', 'MUCOPOLISACARIDOSIS', 'IMSS', '2025-05-19', 'Enfermedad metabólica rara con acumulación de glucosaminoglucanos.', true);
INSERT INTO public.guia_clinica VALUES (172, 'PEDIATRIA', 'IMSS-395-10', 'FIEBRE MUCOCUTANEA (KAWASAKI)', 'IMSS', '2025-05-19', 'Arteritis sistémica en menores de 5 años.', true);
INSERT INTO public.guia_clinica VALUES (173, 'PEDIATRIA', 'IMSS-396-10', 'HIPOACUSIA NEUROSENSORIAL', 'IMSS', '2025-05-19', 'Pérdida auditiva relacionada con daño coclear.', true);
INSERT INTO public.guia_clinica VALUES (174, 'PEDIATRIA', 'IMSS-418-10', 'ALIMENTACION ENTERAL DEL RECIEN NACIDO', 'IMSS', '2025-05-19', 'Nutrición enteral neonatal.', true);
INSERT INTO public.guia_clinica VALUES (175, 'PEDIATRIA', 'IMSS-420-11', 'PARALISIS CEREBRAL INFANTIL', 'IMSS', '2025-05-19', 'Trastorno del movimiento no progresivo.', true);
INSERT INTO public.guia_clinica VALUES (176, 'PEDIATRIA', 'IMSS-442-11', 'HIPOGLUCEMIA NEONATAL', 'IMSS', '2025-05-19', 'Niveles bajos de glucosa en recién nacidos.', true);
INSERT INTO public.guia_clinica VALUES (177, 'PEDIATRIA', 'IMSS-453-11', 'NIÑO GRAN QUEMADO', 'IMSS', '2025-05-19', 'Manejo integral de quemados graves en pediatría.', true);
INSERT INTO public.guia_clinica VALUES (178, 'PEDIATRIA', 'IMSS-473-11', 'NEUMONITIS POR ASPIRACION', 'IMSS', '2025-05-19', 'Inflamación pulmonar por aspiración de contenido gástrico.', true);
INSERT INTO public.guia_clinica VALUES (179, 'PEDIATRIA', 'IMSS-475-11', 'TOS CRÓNICA EN NIÑOS', 'IMSS', '2025-05-19', 'Tos persistente mayor a 4 semanas.', true);
INSERT INTO public.guia_clinica VALUES (180, 'PEDIATRIA', 'IMSS-476-11', 'MUCOPOLISACARIDOSIS II', 'IMSS', '2025-05-19', 'Síndrome de Hunter.', true);
INSERT INTO public.guia_clinica VALUES (181, 'PEDIATRIA', 'IMSS-494-11', 'SINDROME DE DOWN', 'IMSS', '2025-05-19', 'Trastorno genético por trisomía 21.', true);
INSERT INTO public.guia_clinica VALUES (182, 'PEDIATRIA', 'IMSS-495-11', 'ALERGIA ALIMENTARIA EN NIÑOS', 'IMSS', '2025-05-19', 'Reacciones inmunes frente a alimentos.', true);
INSERT INTO public.guia_clinica VALUES (183, 'PEDIATRIA', 'IMSS-498-11', 'MUCOPOLISACARIDOSIS VI', 'IMSS', '2025-05-19', 'Síndrome de Maroteaux-Lamy.', true);
INSERT INTO public.guia_clinica VALUES (184, 'PEDIATRIA', 'IMSS-502-11', 'ALERGIA A LA PROTEINA DE LA LECHE DE VACA', 'IMSS', '2025-05-19', 'Intolerancia o reacción inmune a proteínas lácteas.', true);
INSERT INTO public.guia_clinica VALUES (185, 'PEDIATRIA', 'IMSS-540_12', 'ANEMIA DEL PREMATURO', 'IMSS', '2025-05-19', 'Deficiencia de glóbulos rojos en prematuros.', true);
INSERT INTO public.guia_clinica VALUES (186, 'PEDIATRIA', 'IMSS-548-12', 'MANEJO DE LIQUIDOS Y ELECTROLITOS EN RN PREMATUROS', 'IMSS', '2025-05-19', 'Terapia hidroelectrolítica en neonatos prematuros.', true);
INSERT INTO public.guia_clinica VALUES (187, 'PEDIATRIA', 'IMSS-567-12', 'MUERTE FETAL CONFIRMADA', 'IMSS', '2025-05-19', 'Manejo ante diagnóstico de muerte fetal.', true);
INSERT INTO public.guia_clinica VALUES (188, 'PEDIATRIA', 'IMSS-632-13', 'ASFIXIA NEONATAL', 'IMSS', '2025-05-19', 'Falta de oxígeno al nacer.', true);
INSERT INTO public.guia_clinica VALUES (189, 'PEDIATRIA', 'IMSS-637-13', 'LACTANCIA MATERNA', 'IMSS', '2025-05-19', 'Promoción y apoyo a la lactancia materna.', true);
INSERT INTO public.guia_clinica VALUES (190, 'PEDIATRIA', 'IMSS-645-13', 'INTERVENCIONES DE ENFERMERIA EN RN PREMATURO', 'IMSS', '2025-05-19', 'Cuidados específicos en enfermería neonatal.', true);
INSERT INTO public.guia_clinica VALUES (191, 'PEDIATRIA', 'IMSS-671-13', 'INTERVENCIONES DE ENFERMERIA EN HEMOFILIA PEDIATRICA', 'IMSS', '2025-05-19', 'Atención de enfermería en pacientes hemofílicos.', true);
INSERT INTO public.guia_clinica VALUES (192, 'PEDIATRIA', 'ISSSTE-129_08', 'VARICELA INFANTIL', 'ISSSTE', '2025-05-19', 'Infección vírica exantemática en niños.', true);
INSERT INTO public.guia_clinica VALUES (193, 'PEDIATRIA', 'ISSSTE-136_08', 'TUMORES CEREBRALES INFANTILES', 'ISSSTE', '2025-05-19', 'Neoplasias del sistema nervioso central en niños.', true);
INSERT INTO public.guia_clinica VALUES (194, 'PEDIATRIA', 'ISSSTE-308-13', 'FACTOR SURFACTANTE EN EL RN', 'ISSSTE', '2025-05-19', 'Prevención y tratamiento del SDRA neonatal.', true);
INSERT INTO public.guia_clinica VALUES (195, 'PEDIATRIA', 'ISSSTE-699-13', 'DIAGNOSTICO, TRATAMIENTO, PROTECCION Y CONTROL DEL RN SANO', 'ISSSTE', '2025-05-19', 'Atención integral del recién nacido sano.', true);
INSERT INTO public.guia_clinica VALUES (196, 'PEDIATRIA', 'S-091-08', 'DISPLASIA DEL DESARROLLO DE LA CADERA', 'NOM', '2025-05-19', 'Displasia coxofemoral en lactantes.', true);
INSERT INTO public.guia_clinica VALUES (197, 'PEDIATRIA', 'S-156-08', 'ENFERMEDAD DIARREICA AGUDA EN NIÑOS', 'NOM', '2025-05-19', 'Manejo de diarrea aguda en pediatría.', true);
INSERT INTO public.guia_clinica VALUES (198, 'PEDIATRIA', 'SS-002-08', 'TRAUMATISMO CRANEOENCEFALICO PEDIATRICO', 'ISSSTE', '2025-05-19', 'Lesiones cerebrales traumáticas en niños.', true);
INSERT INTO public.guia_clinica VALUES (199, 'PEDIATRIA', 'SS-055-08', 'HIPOACUSIA EN RECIEN NACIDOS', 'ISSSTE', '2025-05-19', 'Tamiz auditivo neonatal.', true);
INSERT INTO public.guia_clinica VALUES (200, 'PEDIATRIA', 'SS-061-08', 'LEUCEMIA AGUDA EN LA INFANCIA', 'ISSSTE', '2025-05-19', 'Leucemia linfoblástica aguda en niños.', true);
INSERT INTO public.guia_clinica VALUES (201, 'PEDIATRIA', 'SS-116-08', 'FIEBRE SIN INFECCIÓN EN MENORES DE 3 MESES', 'ISSSTE', '2025-05-19', 'Fiebre sin foco definido en lactantes.', true);
INSERT INTO public.guia_clinica VALUES (202, 'PEDIATRIA', 'SS-121-08', 'NUTRICION PARENTERAL EN PEDIATRIA', 'ISSSTE', '2025-05-19', 'Alimentación intravenosa en niños.', true);
INSERT INTO public.guia_clinica VALUES (203, 'PEDIATRIA', 'SS-122-08', 'ENURESIS NO ORGANICA EN PEDIATRIA', 'ISSSTE', '2025-05-19', 'Micción involuntaria nocturna sin causa orgánica.', true);
INSERT INTO public.guia_clinica VALUES (204, 'ESTOMATOLOGIA', 'IMSS-692-13', 'PULPITIS IRREVERSIBLE', 'IMSS', '2025-05-19', 'Inflamación irreversible del tejido pulpar dental.', true);
INSERT INTO public.guia_clinica VALUES (205, 'ESTOMATOLOGIA', 'ISSSTE-059_08', 'MALOCLUSIONES DENTALES', 'ISSSTE', '2025-05-19', 'Diagnóstico y manejo de maloclusiones dentales.', true);
INSERT INTO public.guia_clinica VALUES (206, 'ESTOMATOLOGIA', 'SS-024-08', 'PREVENCION DE CARIES DENTAL', 'NOM', '2025-05-19', 'Estrategias preventivas para caries dental.', true);
INSERT INTO public.guia_clinica VALUES (207, 'NUTRICION', 'IMSS-694-13', 'SEGURIDAD ALIMENTARIA EN PACIENTE HOSPITALIZADO', 'IMSS', '2025-05-19', 'Prevención de riesgos alimentarios en hospitalizados.', true);
INSERT INTO public.guia_clinica VALUES (208, 'NUTRICION', 'SS-025-08', 'SOBREPESO Y OBESIDAD EN NIÑOS Y ADOLESCENTES', 'ISSSTE', '2025-05-19', 'Prevención y tratamiento del sobrepeso y obesidad pediátrica.', true);
INSERT INTO public.guia_clinica VALUES (209, 'NUTRICION', 'SS-119-08', 'DESNUTRICION EN MENORES DE 5 AÑOS', 'ISSSTE', '2025-05-19', 'Detección y manejo de desnutrición infantil.', true);
INSERT INTO public.guia_clinica VALUES (210, 'PSICOLOGIA', 'SS-294-10', 'DETECCION Y ATENCION DE LA VIOLENCIA DE PAREJA Y SEXUAL', 'ISSSTE', '2025-05-19', 'Intervención psicológica ante violencia de pareja y sexual.', true);
INSERT INTO public.guia_clinica VALUES (211, 'PSICOLOGIA', 'NOM-046-SSA2-2005', 'VIOLENCIA FAMILIAR, SEXUAL Y CONTRA LAS MUJERES', 'NOM', '2025-05-19', 'Criterios nacionales para prevención y atención de violencia.', true);
INSERT INTO public.guia_clinica VALUES (212, 'PSICOLOGIA', 'DIF-400-09', 'ABUSO FISICO DESDE EL NACIMIENTO A LOS 12 AÑOS', 'DIF', '2025-05-19', 'Prevención y manejo del abuso físico infantil.', true);
INSERT INTO public.guia_clinica VALUES (213, 'PSICOLOGIA', 'GPC_292-10', 'VIOLENCIA DE PAREJA Y EVALUACION DE RIESGO', 'IMSS', '2025-05-19', 'Guía para detección y valoración de riesgo por violencia de pareja.', true);
INSERT INTO public.guia_clinica VALUES (214, 'PSICOLOGIA', 'IMSS-161_09', 'TRASTORNO DEPRESIVO', 'IMSS', '2025-05-19', 'Evaluación y manejo del trastorno depresivo.', true);
INSERT INTO public.guia_clinica VALUES (215, 'PSICOLOGIA', 'IMSS-440-11', 'CUIDADOS PALIATIVOS', 'IMSS', '2025-05-19', 'Atención psicosocial en cuidados paliativos.', true);
INSERT INTO public.guia_clinica VALUES (216, 'PSICOLOGIA', 'SS-023-08', 'PREVENCION DE ADICCIONES', 'ISSSTE', '2025-05-19', 'Promoción de estilos de vida saludables.', true);
INSERT INTO public.guia_clinica VALUES (217, 'PSICOLOGIA', 'SS-108-08', 'TABAQUISMO', 'ISSSTE', '2025-05-19', 'Programas de intervención para dejar de fumar.', true);
INSERT INTO public.guia_clinica VALUES (218, 'TRAUMATOLOGIA', 'CP', 'FRACTURA DE CADERA', 'IMSS', '2025-05-19', 'Manejo integral de fracturas de cadera.', true);
INSERT INTO public.guia_clinica VALUES (219, 'TRAUMATOLOGIA', 'IMSS-115_08', 'FRACTURAS INTRACAPSULARES DEL FEMUR PROXIMAL', 'IMSS', '2025-05-19', 'Tratamiento quirúrgico y conservador de fracturas femorales proximales.', true);
INSERT INTO public.guia_clinica VALUES (220, 'REHABILITACION', 'DIF-257-09', 'REHABILITACION DEL PACIENTE ADULTO AMPUTADO POR DIABETES MELLITUS', 'DIF', '2025-05-19', 'Rehabilitación funcional post-amputación.', true);
INSERT INTO public.guia_clinica VALUES (221, 'FISIATRIA', 'DIF-313-10', 'MANEJO FISIATRICO EN LUMBALGIA', 'DIF', '2025-05-19', 'Tratamiento conservador de lumbalgia.', true);
INSERT INTO public.guia_clinica VALUES (222, 'NEUROLOGÍA', 'DIF-331-09', 'REHABILITACIÓN DE ADULTOS CON ENFERMEDAD VASCULAR CEREBRAL (EVC)', 'DIF', '2025-05-19', 'Rehabilitación neurológica post accidente cerebrovascular.', true);
INSERT INTO public.guia_clinica VALUES (223, 'PEDIATRIA', 'DIF-332-09', 'EVALUACIÓN DIAGNÓSTICA EN NIÑOS CON PARÁLISIS CEREBRAL', 'DIF', '2025-05-19', 'Diagnóstico temprano de parálisis cerebral.', true);
INSERT INTO public.guia_clinica VALUES (224, 'PEDIATRIA', 'DIF-386-12', 'MENINGITIS TUBERCULOSA EN MENORES DE 5 AÑOS', 'DIF', '2025-05-19', 'Diagnóstico y tratamiento de meningitis tuberculosa pediátrica.', true);
INSERT INTO public.guia_clinica VALUES (225, 'REHABILITACION', 'DIF-399-10', 'MANEJO REHABILITATORIO EN OSTEOARTROSIS GENERALIZADA', 'DIF', '2025-05-19', 'Tratamiento fisioterapéutico en osteoartritis.', true);
INSERT INTO public.guia_clinica VALUES (226, 'PSICOLOGIA', 'DIF-400-09', 'ABUSO FÍSICO DESDE EL NACIMIENTO HASTA LOS 12 AÑOS', 'DIF', '2025-05-19', 'Prevención y manejo del abuso físico infantil.', true);
INSERT INTO public.guia_clinica VALUES (227, 'GINECOLOGIA', 'DIF-565-12', 'LESIÓN OBSTÉTRICA DEL PLEXO BRAQUIAL', 'DIF', '2025-05-19', 'Lesión durante parto relacionada con plexo braquial.', true);
INSERT INTO public.guia_clinica VALUES (228, 'PEDIATRIA', 'DIF-707-14', 'NEUROREHABILITACIÓN DEL NIÑO PRETÉRMINO', 'DIF', '2025-05-19', 'Desarrollo neurológico en prematuros.', true);
INSERT INTO public.guia_clinica VALUES (229, 'PSICOLOGIA', 'GPC_292-10', 'VIOLENCIA DE PAREJA Y EVALUACIÓN DE RIESGO', 'IMSS', '2025-05-19', 'Guía para detección y valoración de riesgo por violencia de pareja', true);
INSERT INTO public.guia_clinica VALUES (230, 'MEDICINA INTERNA', 'IMSS-007_08', 'ENFERMEDAD ARTERIAL PERIFÉRICA', 'IMSS', '2025-05-19', 'Obstrucción arterial periférica.', true);
INSERT INTO public.guia_clinica VALUES (231, 'PEDIATRIA', 'IMSS-029_08', 'NUTRICIÓN, DESARROLLO Y CRECIMIENTO EN MENORES DE 5 AÑOS', 'IMSS', '2025-05-19', 'Evaluación nutricional y desarrollo infantil.', true);
INSERT INTO public.guia_clinica VALUES (232, 'ONCOLOGIA', 'IMSS-030_08', 'CÁNCER PULMONAR DE CÉLULAS NO PEQUEÑAS', 'IMSS', '2025-05-19', 'Tratamiento oncológico del cáncer pulmonar no microcítico.', true);
INSERT INTO public.guia_clinica VALUES (233, 'CIRUGIA', 'IMSS-031_08', 'APENDICITIS AGUDA', 'IMSS', '2025-05-19', 'Inflamación aguda del apéndice.', true);
INSERT INTO public.guia_clinica VALUES (234, 'PEDIATRIA', 'IMSS-032_08', 'BRONQUIOLITIS EN FASE AGUDA', 'IMSS', '2025-05-19', 'Infección respiratoria viral en lactantes.', true);
INSERT INTO public.guia_clinica VALUES (235, 'DERMATOLOGIA', 'IMSS-033_08', 'DERMATITIS ATÓPICA', 'IMSS', '2025-05-19', 'Enfermedad inflamatoria crónica de la piel.', true);
INSERT INTO public.guia_clinica VALUES (236, 'OFTALMOLOGIA', 'IMSS-035_08', 'CONJUNTIVITIS', 'IMSS', '2025-05-19', 'Inflamación conjuntival.', true);
INSERT INTO public.guia_clinica VALUES (237, 'CARDIOLOGIA', 'IMSS-036_08', 'COR PULMONALE', 'IMSS', '2025-05-19', 'Hipertensión pulmonar secundaria a enfermedades respiratorias.', true);
INSERT INTO public.guia_clinica VALUES (238, 'MEDICINA INTERNA', 'IMSS-037_08', 'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)', 'IMSS', '2025-05-19', 'Manejo clínico de EPOC en adultos.', true);
INSERT INTO public.guia_clinica VALUES (239, 'HEPATOLOGIA', 'IMSS-038_08', 'INSUFICIENCIA HEPÁTICA CRÓNICA', 'IMSS', '2025-05-19', 'Disfunción hepática progresiva.', true);
INSERT INTO public.guia_clinica VALUES (240, 'UROLOGIA', 'IMSS-039_08', 'ORQUITEPIDIDIMITIS / ORQUITIS EPIDIDIMITIS', 'IMSS', '2025-05-19', 'Inflamación infecciosa del testículo y epidídimo.', true);
INSERT INTO public.guia_clinica VALUES (241, 'TRAUMATOLOGIA', 'IMSS-040_08', 'PACIENTE GRAN QUEMADO', 'IMSS', '2025-05-19', 'Manejo integral de quemados graves.', true);
INSERT INTO public.guia_clinica VALUES (242, 'ALERGIA', 'IMSS-041_08', 'RINITIS ALÉRGICA', 'IMSS', '2025-05-19', 'Respuesta alérgica de las vías respiratorias altas.', true);
INSERT INTO public.guia_clinica VALUES (243, 'GASTROENTEROLOGIA', 'IMSS-042_08', 'SÍNDROME DEL COLON IRRITABLE', 'IMSS', '2025-05-19', 'Alteración funcional del intestino.', true);
INSERT INTO public.guia_clinica VALUES (244, 'NEUROLOGIA', 'IMSS-043_08', 'SÍNDROME DEL TÚNEL DEL CARPO', 'IMSS', '2025-05-19', 'Compresión del nervio mediano en muñeca.', true);
INSERT INTO public.guia_clinica VALUES (245, 'PEDIATRIA', 'IMSS-044_08', 'TAQUIPNEA TRANSITORIA DEL RECIÉN NACIDO', 'IMSS', '2025-05-19', 'Respiración rápida temporal en recién nacidos.', true);
INSERT INTO public.guia_clinica VALUES (246, 'MEDICINA INTERNA', 'IMSS-045_08', 'LUMBALGIA AGUDA Y CRÓNICA', 'IMSS', '2025-05-19', 'Dolor lumbar persistente o recurrente.', true);
INSERT INTO public.guia_clinica VALUES (247, 'MEDICINA INTERNA', 'IMSS-046_08', 'SOBREPESO Y OBESIDAD EXÓGENA', 'IMSS', '2025-05-19', 'Exceso de peso por factores ambientales.', true);
INSERT INTO public.guia_clinica VALUES (248, 'MEDICINA INTERNA', 'IMSS-047_08', 'CEFALEA TENSIONAL Y MIGRAÑA EN EL ADULTO', 'IMSS', '2025-05-19', 'Trastorno neurológico recurrente.', true);
INSERT INTO public.guia_clinica VALUES (249, 'GINECOLOGIA', 'IMSS-048-08', 'REDUCCIÓN DE LA FRECUENCIA DE CESÁREAS', 'IMSS', '2025-05-19', 'Promoción del parto vaginal.', true);
INSERT INTO public.guia_clinica VALUES (250, 'CIRUGIA', 'IMSS-049_08', 'TRATAMIENTO DE APENDICITIS AGUDA', 'IMSS', '2025-05-19', 'Manejo quirúrgico de apendicitis.', true);
INSERT INTO public.guia_clinica VALUES (251, 'PEDIATRIA', 'IMSS-050_08', 'OBESIDAD MÓRBIDA EN EL ADOLESCENTE', 'IMSS', '2025-05-19', 'Intervención multidisciplinaria en adolescentes.', true);
INSERT INTO public.guia_clinica VALUES (252, 'MEDICINA INTERNA', 'IMSS-051_08', 'OBESIDAD MÓRBIDA EN EL ADULTO', 'IMSS', '2025-05-19', 'Manejo integral de obesidad mórbida en adultos.', true);
INSERT INTO public.guia_clinica VALUES (253, 'GINECOLOGIA', 'IMSS-052-08', 'VIGILANCIA Y MANEJO DEL TRABAJO DE PARTO', 'IMSS', '2025-05-19', 'Monitoreo del parto normal.', true);
INSERT INTO public.guia_clinica VALUES (254, 'PEDIATRIA', 'IMSS-054_08', 'CARDIOPATÍAS CONGÉNITAS EN MAYORES DE 5 AÑOS', 'IMSS', '2025-05-19', 'Enfermedades cardíacas congénitas.', true);
INSERT INTO public.guia_clinica VALUES (255, 'GINECOLOGIA', 'IMSS-056_08', 'INCONTINENCIA URINARIA EN LA MUJER', 'IMSS', '2025-05-19', 'Tratamiento de pérdida involuntaria de orina.', true);
INSERT INTO public.guia_clinica VALUES (256, 'GERIATRIA', 'IMSS-057-08', 'MALTRATO EN EL ADULTO MAYOR', 'IMSS', '2025-05-19', 'Prevención y atención del maltrato geriátrico.', true);
INSERT INTO public.guia_clinica VALUES (257, 'GINECOLOGIA', 'IMSS-058_08', 'ENFERMEDAD HIPERTENSIVA DEL EMBARAZO', 'IMSS', '2025-05-19', 'Hipertensión durante el embarazo.', true);
INSERT INTO public.guia_clinica VALUES (258, 'PEDIATRIA', 'IMSS-062_08', 'INFECCIÓN DE VIAS RESPIRATORIAS SUPERIORES', 'IMSS', '2025-05-19', 'Infecciones respiratorias altas.', true);
INSERT INTO public.guia_clinica VALUES (259, 'GINECOLOGIA', 'IMSS-063_08', 'PARTO PRETÉRMINO', 'IMSS', '2025-05-19', 'Parto antes de las 37 semanas.', true);
INSERT INTO public.guia_clinica VALUES (260, 'TRAUMATOLOGIA', 'IMSS-065_08', 'LESIONES TRAUMÁTICAS DE LA MANO', 'IMSS', '2025-05-19', 'Fracturas y luxaciones manuales.', true);
INSERT INTO public.guia_clinica VALUES (261, 'NEUROLOGIA', 'IMSS-066_08', 'PARÁLISIS DE BELL', 'IMSS', '2025-05-19', 'Parálisis facial periférica.', true);
INSERT INTO public.guia_clinica VALUES (262, 'CIRUGIA', 'IMSS-068_08', 'HERNIA UMBILICAL', 'IMSS', '2025-05-19', 'Salida de contenido abdominal por ombligo.', true);
INSERT INTO public.guia_clinica VALUES (263, 'PEDIATRIA', 'IMSS-069_08', 'FALLA MEDULAR EN EDAD PEDIÁTRICA', 'IMSS', '2025-05-19', 'Anemia aplástica u otras causas.', true);
INSERT INTO public.guia_clinica VALUES (264, 'MEDICINA INTERNA', 'IMSS-070_08', 'TUBERCULOSIS PULMONAR CASOS NUEVOS', 'IMSS', '2025-05-19', 'Tratamiento inicial de TB pulmonar.', true);
INSERT INTO public.guia_clinica VALUES (265, 'GASTROENTEROLOGIA', 'IMSS-071_08', 'DISPEPSIA FUNCIONAL', 'IMSS', '2025-05-19', 'Dolor epigástrico sin causa orgánica.', true);
INSERT INTO public.guia_clinica VALUES (266, 'GINECOLOGIA', 'IMSS-072_08', 'ENFERMEDAD INFLAMATORIA PÉLVICA', 'IMSS', '2025-05-19', 'Infección ascendente del aparato genital femenino.', true);
INSERT INTO public.guia_clinica VALUES (267, 'OTORRINOLARINGOLOGIA', 'IMSS-073_08', 'FARINGOAMIGDALITIS AGUDA', 'IMSS', '2025-05-19', 'Infección bacteriana de amígdalas y faringe.', true);
INSERT INTO public.guia_clinica VALUES (268, 'CIRUGIA', 'IMSS-074_08', 'FASCITIS NECROSANTE', 'IMSS', '2025-05-19', 'Infección grave de tejidos blandos.', true);
INSERT INTO public.guia_clinica VALUES (269, 'MEDICINA INTERNA', 'IMSS-075_08', 'FIBROMIALGIA EN EL ADULTO', 'IMSS', '2025-05-19', 'Dolor músculo-esquelético crónico.', true);
INSERT INTO public.guia_clinica VALUES (270, 'MEDICINA INTERNA', 'IMSS-077_08', 'INFECCIÓN DE VIAS URINARIAS NO COMPLICADA EN LA MUJER', 'IMSS', '2025-05-19', 'ITU no complicada en mujeres.', true);
INSERT INTO public.guia_clinica VALUES (271, 'GINECOLOGIA', 'IMSS-078_08', 'INFECCIÓN DE VIAS URINARIAS BAJAS DURANTE EL EMBARAZO', 'IMSS', '2025-05-19', 'ITU en gestantes.', true);
INSERT INTO public.guia_clinica VALUES (272, 'ORTOPEDIA', 'IMSS-079_08', 'OSTEOARTROSIS DE RODILLA', 'IMSS', '2025-05-19', 'Degeneración articular en rodilla.', true);
INSERT INTO public.guia_clinica VALUES (273, 'OTORRINOLARINGOLOGIA', 'IMSS-080_08', 'SINUSITIS AGUDA', 'IMSS', '2025-05-19', 'Inflamación de senos paranasales.', true);
INSERT INTO public.guia_clinica VALUES (274, 'GINECOLOGIA', 'IMSS-081_08', 'VAGINITIS INFECCIOSA', 'IMSS', '2025-05-19', 'Tratamiento de vaginitis bacteriana y fúngica.', true);
INSERT INTO public.guia_clinica VALUES (275, 'GINECOLOGIA', 'IMSS-082_08', 'MIOMATOSIS UTERINA', 'IMSS', '2025-05-19', 'Fibromas uterinos.', true);
INSERT INTO public.guia_clinica VALUES (276, 'MEDICINA INTERNA', 'IMSS-083_08', 'OSTEOPOROSIS EN EL ADULTO', 'IMSS', '2025-05-19', 'Reducción de densidad ósea.', true);
INSERT INTO public.guia_clinica VALUES (277, 'MEDICINA INTERNA', 'IMSS-084_08', 'SEPSIS GRAVE Y CHOQUE SÉPTICO EN EL ADULTO', 'IMSS', '2025-05-19', 'Manejo inicial de sepsis grave.', true);
INSERT INTO public.guia_clinica VALUES (278, 'MEDICINA INTERNA', 'IMSS-085_08', 'SÍNDROME DE HOMBRO DOLOROSO', 'IMSS', '2025-05-19', 'Dolor articular de hombro.', true);
INSERT INTO public.guia_clinica VALUES (279, 'DERMATOLOGIA', 'IMSS-086_08', 'TIÑA Y ONICOMICOSIS', 'IMSS', '2025-05-19', 'Infecciones fúngicas de piel y uñas.', true);
INSERT INTO public.guia_clinica VALUES (280, 'GASTROENTEROLOGIA', 'IMSS-087_08', 'VARICES ESOFAGICAS', 'IMSS', '2025-05-19', 'Venas dilatadas en esófago.', true);
INSERT INTO public.guia_clinica VALUES (281, 'GINECOLOGIA', 'IMSS-088_08', 'ABORTO ESPONTÁNEO Y ABORTO RECURRENTE', 'IMSS', '2025-05-19', 'Aborto espontáneo y recurrente.', true);
INSERT INTO public.guia_clinica VALUES (282, 'NEUROLOGIA', 'IMSS-089-09', 'SÍNDROME DE GUILLAIN-BARRÉ', 'IMSS', '2025-05-19', 'Neuropatía autoinmune.', true);
INSERT INTO public.guia_clinica VALUES (283, 'INFECTOLOGIA', 'IMSS-094_08', 'INFECCIONES DE TRANSMISIÓN SEXUAL EN ADOLESCENTES Y ADULTOS', 'IMSS', '2025-05-19', 'ETS: sífilis, gonorrea, etc.', true);
INSERT INTO public.guia_clinica VALUES (284, 'NUTRICION', 'IMSS-095_08', 'EVALUACIÓN Y CONTROL NUTRICIONAL EN EL ADULTO', 'IMSS', '2025-05-19', 'Valoración nutricional.', true);
INSERT INTO public.guia_clinica VALUES (285, 'ONCOLOGIA', 'IMSS-099_08', 'MELANOMA CUTÁNEO EN ADULTOS', 'IMSS', '2025-05-19', 'Cáncer de piel más agresivo.', true);
INSERT INTO public.guia_clinica VALUES (286, 'HEMATOLOGIA', 'IMSS-101_08', 'TRATAMIENTO ANTICOAGULANTE CON WARFARINA EN ADULTOS', 'IMSS', '2025-05-19', 'Uso seguro de anticoagulantes orales.', true);
INSERT INTO public.guia_clinica VALUES (287, 'MEDICINA INTERNA', 'IMSS-104_08', 'ÚLCERAS POR PRESIÓN A NIVEL INTRAHOSPITALARIO', 'IMSS', '2025-05-19', 'Prevención y tratamiento de úlceras por presión.', true);
INSERT INTO public.guia_clinica VALUES (288, 'MEDICINA INTERNA', 'IMSS-105_08', 'ÚLCERAS POR PRESIÓN EN PRIMER NIVEL DE ATENCIÓN', 'IMSS', '2025-05-19', 'Manejo ambulatorio de lesiones por presión.', true);
INSERT INTO public.guia_clinica VALUES (289, 'PEDIATRIA', 'IMSS-109_08', 'PACIENTE PEDIÁTRICO CON SARAMPIÓN', 'IMSS', '2025-05-19', 'Manejo clínico del sarampión.', true);
INSERT INTO public.guia_clinica VALUES (290, 'NEFROLOGIA', 'IMSS-112_08', 'TERAPIA INMUNOSUPRESORA EN EL PACIENTE RENAL', 'IMSS', '2025-05-19', 'Uso de inmunosupresores en trasplante renal.', true);
INSERT INTO public.guia_clinica VALUES (291, 'NEUROLOGIA', 'IMSS-114_08', 'SECUELAS DE ENFERMEDAD VASCULAR CEREBRAL 1ER NIVEL', 'IMSS', '2025-05-19', 'Manejo ambulatorio post accidente cerebrovascular.', true);
INSERT INTO public.guia_clinica VALUES (292, 'TRAUMATOLOGIA', 'IMSS-115_08', 'FRACTURAS INTRACAPSULARES DEL FÉMUR PROXIMAL', 'IMSS', '2025-05-19', 'Fracturas de cadera en adultos mayores.', true);
INSERT INTO public.guia_clinica VALUES (293, 'NEONATOLOGIA', 'IMSS-137_08', 'SÍNDROME DE DIFICULTAD RESPIRATORIA EN RECIÉN NACIDO', 'IMSS', '2025-05-19', 'SDRN por déficit de surfactante.', true);
INSERT INTO public.guia_clinica VALUES (294, 'PEDIATRIA', 'IMSS-138_08', 'RUBEOLA EN PRIMER NIVEL', 'IMSS', '2025-05-19', 'Prevención y manejo de rubeola en menores.', true);
INSERT INTO public.guia_clinica VALUES (295, 'TRAUMATOLOGIA', 'IMSS-139_08', 'FRACTURA DE DIAFISIS DE TIBIA', 'IMSS', '2025-05-19', 'Lesión ósea de la tibia.', true);
INSERT INTO public.guia_clinica VALUES (296, 'UROLOGIA', 'IMSS-140_08', 'CÁNCER DE PRÓSTATA 2DO Y 3ER NIVEL', 'IMSS', '2025-05-19', 'Diagnóstico y tratamiento del cáncer prostático.', true);
INSERT INTO public.guia_clinica VALUES (297, 'HEMATOLOGIA', 'IMSS-141_08', 'HEMOFILIA PEDIÁTRICA', 'IMSS', '2025-05-19', 'Trastorno hemorrágico hereditario en niños.', true);
INSERT INTO public.guia_clinica VALUES (298, 'HEMATOLOGIA', 'IMSS-142_08', 'LEUCEMIA LINFOBLÁSTICA AGUDA', 'IMSS', '2025-05-19', 'Cáncer hematológico más común en la infancia.', true);
INSERT INTO public.guia_clinica VALUES (299, 'HEMATOLOGIA', 'IMSS-143_08', 'PURPURA TROMBOCITOPÉNICA INMUNOLÓGICA', 'IMSS', '2025-05-19', 'Disminución plaquetaria autoinmune.', true);
INSERT INTO public.guia_clinica VALUES (300, 'GERIATRIA', 'IMSS-144_08', 'DETERIORO COGNITIVO EN EL ADULTO MAYOR 1ER NIVEL', 'IMSS', '2025-05-19', 'Detección temprana de demencia.', true);
INSERT INTO public.guia_clinica VALUES (301, 'ONCOLOGIA', 'IMSS-145_08', 'CÁNCER DE COLON Y RECTO NO HEREDITARIO EN ADULTOS', 'IMSS', '2025-05-19', 'Adenocarcinoma colorrectal.', true);
INSERT INTO public.guia_clinica VALUES (302, 'PSIQUIATRIA', 'IMSS-161_09', 'TRASTORNO DEPRESIVO', 'IMSS', '2025-05-19', 'Evaluación y manejo del trastorno depresivo.', true);
INSERT INTO public.guia_clinica VALUES (303, 'GINECOLOGIA', 'IMSS-162_09', 'HEMORRAGIA OBSTÉTRICA EN LA SEGUNDA MITAD DEL EMBARAZO Y PUERPERIO', 'IMSS', '2025-05-19', 'Hemorragia obstétrica.', true);
INSERT INTO public.guia_clinica VALUES (304, 'OFTALMOLOGIA', 'IMSS-163_09', 'GLAUCOMA DE ÁNGULO CERRADO EN ADULTOS', 'IMSS', '2025-05-19', 'Aumento de presión intraocular.', true);
INSERT INTO public.guia_clinica VALUES (305, 'OFTALMOLOGIA', 'IMSS-164_09', 'GLAUCOMA DE ÁNGULO ABIERTO EN ADULTOS', 'IMSS', '2025-05-19', 'Forma más común de glaucoma.', true);
INSERT INTO public.guia_clinica VALUES (306, 'GENETICA', 'IMSS-165_09', 'ENFERMEDAD DE FABRY', 'IMSS', '2025-05-19', 'Enfermedad lisosomal hereditaria.', true);
INSERT INTO public.guia_clinica VALUES (307, 'ONCOLOGIA', 'IMSS-166_09', 'TUMOR MALIGNO DE TIROIDES BIEN DIFERENCIADO', 'IMSS', '2025-05-19', 'Cáncer de tiroides tipo papilar o folicular.', true);
INSERT INTO public.guia_clinica VALUES (308, 'ONCOLOGIA', 'IMSS-167-09', 'ADENOCARCINOMA GÁSTRICO EN ADULTOS', 'IMSS', '2025-05-19', 'Cáncer estomacal.', true);
INSERT INTO public.guia_clinica VALUES (309, 'CARDIOLOGIA', 'IMSS-168_09', 'ACIDO ACETIL SALICÍLICO Y CLOPIDOGREL EN RIESGO CARDIOVASCULAR', 'IMSS', '2025-05-19', 'Prevención secundaria de eventos cardiovasculares.', true);
INSERT INTO public.guia_clinica VALUES (310, 'GASTROENTEROLOGIA', 'IMSS-169_09', 'ÚLCERA PÉPTICA COMPLICADA', 'IMSS', '2025-05-19', 'Hemorragia o perforación gástrica/duodenal.', true);
INSERT INTO public.guia_clinica VALUES (311, 'PSIQUIATRIA', 'IMSS-170_09', 'TRASTORNO BIPOLAR', 'IMSS', '2025-05-19', 'Cambios episódicos de ánimo extremos.', true);
INSERT INTO public.guia_clinica VALUES (312, 'OFTALMOLOGIA', 'IMSS-171_09', 'RETINOPATÍA DIABÉTICA', 'IMSS', '2025-05-19', 'Complicación microvascular de la diabetes.', true);
INSERT INTO public.guia_clinica VALUES (313, 'NEUROLOGIA', 'IMSS-172_09', 'NEURITIS ÓPTICA', 'IMSS', '2025-05-19', 'Inflamación del nervio óptico.', true);
INSERT INTO public.guia_clinica VALUES (314, 'REUMATOLOGIA', 'IMSS-173_09', 'NEFROPATÍA LÚPICA EN ADULTOS', 'IMSS', '2025-05-19', 'Daño renal por lupus eritematoso sistémico.', true);
INSERT INTO public.guia_clinica VALUES (315, 'HEMATOLOGIA', 'IMSS-174_09', 'LINFOMAS NO HODGKIN EN ADULTOS', 'IMSS', '2025-05-19', 'Neoplasias linfoides malignas.', true);
INSERT INTO public.guia_clinica VALUES (316, 'ANGIOLOGIA', 'IMSS-175_09', 'INSUFICIENCIA VENOSA CRÓNICA', 'IMSS', '2025-05-19', 'Reflujo venoso prolongado.', true);
INSERT INTO public.guia_clinica VALUES (317, 'UROLOGIA', 'IMSS-176_09', 'HIPERPLASIA PROSTÁTICA BENIGNA', 'IMSS', '2025-05-19', 'Crecimiento no canceroso de próstata.', true);
INSERT INTO public.guia_clinica VALUES (318, 'OFTALMOLOGIA', 'IMSS-177_09', 'HEMORRAGIA VÍTREA', 'IMSS', '2025-05-19', 'Sangrado dentro del globo ocular.', true);
INSERT INTO public.guia_clinica VALUES (319, 'HEMATOLOGIA', 'IMSS-178_09', 'HEMOFILIA EN ADULTOS', 'IMSS', '2025-05-19', 'Trastorno hemorrágico hereditario.', true);
INSERT INTO public.guia_clinica VALUES (320, 'NEUROLOGIA', 'IMSS-179_09', 'HEMATOMA SUBDURAL', 'IMSS', '2025-05-19', 'Acumulación de sangre entre duramadre y cerebro.', true);
INSERT INTO public.guia_clinica VALUES (321, 'OTORRINOLARINGOLOGIA', 'IMSS-180_09', 'EPISTAXIS', 'IMSS', '2025-05-19', 'Sangrado nasal.', true);
INSERT INTO public.guia_clinica VALUES (322, 'OFTALMOLOGIA', 'IMSS-181_09', 'ENDOFTALMITIS POSTQUIRÚRGICA', 'IMSS', '2025-05-19', 'Infección intraocular posoperatoria.', true);
INSERT INTO public.guia_clinica VALUES (323, 'GINECOLOGIA', 'IMSS-182_09', 'EMBARAZO TUBÁRICO', 'IMSS', '2025-05-19', 'Embarazo ectópico.', true);
INSERT INTO public.guia_clinica VALUES (324, 'GINECOLOGIA', 'IMSS-183_09', 'DISMENORREA', 'IMSS', '2025-05-19', 'Dolor menstrual.', true);
INSERT INTO public.guia_clinica VALUES (325, 'UROLOGIA', 'IMSS-184_09', 'TUMOR MALIGNO DE TESTÍCULO', 'IMSS', '2025-05-19', 'Cáncer testicular.', true);
INSERT INTO public.guia_clinica VALUES (326, 'CARDIOLOGIA', 'IMSS-191-10', 'SÍNDROME CORONARIO', 'IMSS', '2025-05-19', 'Angina inestable e infarto agudo al miocardio.', true);
INSERT INTO public.guia_clinica VALUES (327, 'OFTALMOLOGIA', 'IMSS-192_08', 'CATARATA NO COMPLICADA', 'IMSS', '2025-05-19', 'Opacidad del cristalino.', true);
INSERT INTO public.guia_clinica VALUES (328, 'TRAUMATOLOGIA', 'IMSS-193_08', 'FRACTURA DE ANTEBRAZO', 'IMSS', '2025-05-19', 'Fractura de radio y/o cúbito.', true);
INSERT INTO public.guia_clinica VALUES (329, 'PSIQUIATRIA', 'IMSS-194_08', 'DEPRESIÓN EN EL ADULTO MAYOR', 'IMSS', '2025-05-19', 'Trastorno afectivo en personas mayores.', true);
INSERT INTO public.guia_clinica VALUES (330, 'REUMATOLOGIA', 'IMSS-195-10', 'ARTRITIS REUMATOIDE', 'IMSS', '2025-05-19', 'Artritis inflamatoria crónica autoinmune.', true);
INSERT INTO public.guia_clinica VALUES (331, 'PEDIATRIA', 'IMSS-196-10', 'ANTIRRETROVIRALES EN NIÑOS', 'IMSS', '2025-05-19', 'Tratamiento de VIH/SIDA pediátrico.', true);
INSERT INTO public.guia_clinica VALUES (332, 'PEDIATRIA', 'IMSS-197-13', 'OSTEOSARCOMA EN NIÑOS Y ADOLESCENTES', 'IMSS', '2025-05-19', 'Tumor óseo maligno.', true);
INSERT INTO public.guia_clinica VALUES (333, 'UROLOGIA', 'IMSS-229_10', 'ESCROTO AGUDO', 'IMSS', '2025-05-19', 'Emergencia urológica con dolor escrotal intenso.', true);
INSERT INTO public.guia_clinica VALUES (334, 'ONCOLOGIA', 'IMSS-232-09', 'CÁNCER DE MAMA 2º NIVEL', 'IMSS', '2025-05-19', 'Detección y tratamiento.', true);
INSERT INTO public.guia_clinica VALUES (335, 'REUMATOLOGIA', 'IMSS-233-09', 'DISLIPIDEMIAS', 'IMSS', '2025-05-19', 'Alteraciones en lípidos sanguíneos.', true);
INSERT INTO public.guia_clinica VALUES (336, 'NEUMOLOGIA', 'IMSS-234-09', 'NEUMONÍA ADQUIRIDA EN LA COMUNIDAD EN ADULTOS', 'IMSS', '2025-05-19', 'Infección pulmonar extrahospitalaria.', true);
INSERT INTO public.guia_clinica VALUES (337, 'GASTROENTEROLOGIA', 'IMSS-237-09', 'COLECISTITIS Y COLELITIASIS', 'IMSS', '2025-05-19', 'Inflamación vesicular por cálculos.', true);
INSERT INTO public.guia_clinica VALUES (338, 'MEDICINA INTERNA', 'IMSS-238-09', 'HIPERTENSIÓN ARTERIAL EN EL ADULTO', 'IMSS', '2025-05-19', 'Control y manejo de hipertensión.', true);
INSERT INTO public.guia_clinica VALUES (339, 'GASTROENTEROLOGIA', 'IMSS-239_09', 'PANCREATITIS AGUDA EN SEGUNDO NIVEL DE ATENCIÓN', 'IMSS', '2025-05-19', 'Manejo hospitalario de pancreatitis.', true);
INSERT INTO public.guia_clinica VALUES (340, 'GINECOLOGIA', 'IMSS-240-09', 'DIAGNÓSTICO Y TRATAMIENTO DE PATOLOGÍA MAMARIA BENIGNA', 'IMSS', '2025-05-19', 'Patología mamaria benigna.', true);
INSERT INTO public.guia_clinica VALUES (341, 'SALUD OCUPACIONAL', 'IMSS-241-12', 'EXPOSICIÓN LABORAL', 'IMSS', '2025-05-19', 'Prevención de riesgos ocupacionales.', true);
INSERT INTO public.guia_clinica VALUES (342, 'CARDIOLOGIA', 'IMSS-242_09', 'VALVULOPATÍA TRICÚSPIDEA', 'IMSS', '2025-05-19', 'Disfunción valvular derecha.', true);
INSERT INTO public.guia_clinica VALUES (343, 'PULMONAR', 'IMSS-243_09', 'DERRAME PLEURAL', 'IMSS', '2025-05-19', 'Acumulación anormal de líquido pleural.', true);
INSERT INTO public.guia_clinica VALUES (344, 'PEDIATRIA', 'IMSS-244-09', 'PRIMERA CRISIS CONVULSIVA EN NIÑOS', 'IMSS', '2025-05-19', 'Manejo inicial de crisis convulsivas.', true);
INSERT INTO public.guia_clinica VALUES (345, 'MEDICINA INTERNA', 'IMSS-245-09', 'ANTIRRETROVIRALES EN ADULTOS', 'IMSS', '2025-05-19', 'Tratamiento de VIH/SIDA en adultos.', true);
INSERT INTO public.guia_clinica VALUES (346, 'PEDIATRIA', 'IMSS-246-12', 'BINOMA MADRE-HIJO: VIH', 'IMSS', '2025-05-19', 'Prevención de transmisión vertical del VIH.', true);
INSERT INTO public.guia_clinica VALUES (347, 'PEDIATRIA', 'IMSS-248-09', 'HIDROCEFALIA', 'IMSS', '2025-05-19', 'Acumulación anormal de líquido cefalorraquídeo.', true);
INSERT INTO public.guia_clinica VALUES (348, 'PEDIATRIA', 'IMSS-258_10', 'LARINGOTRAQUEÍTIS', 'IMSS', '2025-05-19', 'Croup viral en niños pequeños.', true);
INSERT INTO public.guia_clinica VALUES (349, 'INFECTOLOGIA', 'IMSS-259_10', 'FIEBRE TIFOIDEA', 'IMSS', '2025-05-19', 'Salmonella typhi.', true);
INSERT INTO public.guia_clinica VALUES (350, 'OFTALMOLOGIA', 'IMSS-260_10', 'PTERIGIÓN PRIMARIO Y RECURRENTE', 'IMSS', '2025-05-19', 'Degeneración conjuntival con crecimiento corneal.', true);
INSERT INTO public.guia_clinica VALUES (351, 'OTORRINOLARINGOLOGIA', 'IMSS-261_10', 'RINOSINUSITIS', 'IMSS', '2025-05-19', 'Inflamación de fosas nasales y senos paranasales.', true);
INSERT INTO public.guia_clinica VALUES (352, 'PEDIATRIA', 'IMSS-262-10', 'HIPERBILIRRUBINEMIA NEONATAL', 'IMSS', '2025-05-19', 'Ictericia en recién nacidos.', true);
INSERT INTO public.guia_clinica VALUES (353, 'GINECOLOGIA', 'IMSS-263_10', 'CISTOCELE', 'IMSS', '2025-05-19', 'Prolapso vaginal anterior.', true);
INSERT INTO public.guia_clinica VALUES (354, 'PEDIATRIA', 'IMSS-264_10', 'ASTROCITOMA Y MEDULOBLASTOMA', 'IMSS', '2025-05-19', 'Tumores cerebrales en niños.', true);
INSERT INTO public.guia_clinica VALUES (355, 'ENDOCRINOLOGIA', 'IMSS-265-10', 'HIPOTIROIDISMO PRIMARIO', 'IMSS', '2025-05-19', 'Reducción de hormonas tiroideas.', true);
INSERT INTO public.guia_clinica VALUES (356, 'TRAUMATOLOGIA', 'IMSS-266_10', 'FRACTURA DIAFISIARIA CERRADA DE CÚBITO', 'IMSS', '2025-05-19', 'Fractura sin exposición cutánea.', true);
INSERT INTO public.guia_clinica VALUES (357, 'TRAUMATOLOGIA', 'IMSS-267-10', 'FRACTURAS TRANSTROCANTÉRICAS', 'IMSS', '2025-05-19', 'Fracturas proximales de fémur.', true);
INSERT INTO public.guia_clinica VALUES (358, 'NEUROLOGIA', 'IMSS-269-13', 'ESPINA BÍFIDA', 'IMSS', '2025-05-19', 'Malformación congénita de la columna vertebral.', true);
INSERT INTO public.guia_clinica VALUES (359, 'OFTALMOLOGIA', 'IMSS-270-13', 'RETINOBLASTOMA', 'IMSS', '2025-05-19', 'Tumor ocular pediátrico.', true);
INSERT INTO public.guia_clinica VALUES (360, 'PEDIATRIA', 'IMSS-271-13', 'SÍNDROME NEFRÓTICO PRIMARIO EN NIÑOS', 'IMSS', '2025-05-19', 'Perdida de proteínas por orina.', true);
INSERT INTO public.guia_clinica VALUES (361, 'GINECOLOGIA', 'IMSS-272-10', 'DIAGNÓSTICO Y TRATAMIENTO DE SEPSIS PUERPERAL', 'IMSS', '2025-05-19', 'Infección postparto.', true);
INSERT INTO public.guia_clinica VALUES (362, 'INFECTOLOGIA', 'IMSS-273-13', 'INFECCIONES DE LAS LÍNEAS VASCULARES', 'IMSS', '2025-05-19', 'Infección asociada a catéteres intravenosos.', true);
INSERT INTO public.guia_clinica VALUES (363, 'PEDIATRIA', 'IMSS-275-10', 'MALFORMACIÓN ANORRECTAL', 'IMSS', '2025-05-19', 'Anomalía congénita del recto y ano.', true);
INSERT INTO public.guia_clinica VALUES (364, 'HEMATOLOGIA', 'IMSS-276-10', 'LEUCEMIA MIELOIDE AGUDA', 'IMSS', '2025-05-19', 'Cáncer de células blancas.', true);
INSERT INTO public.guia_clinica VALUES (365, 'OFTALMOLOGIA', 'IMSS-277-10', 'ESTRABISMO PARALÍTICO', 'IMSS', '2025-05-19', 'Desviación ocular debido a paresia neuromuscular.', true);
INSERT INTO public.guia_clinica VALUES (366, 'PULMONAR', 'IMSS-278-10', 'NEUMOTÓRAX ESPONTÁNEO', 'IMSS', '2025-05-19', 'Colapso pulmonar sin causa traumática.', true);
INSERT INTO public.guia_clinica VALUES (367, 'UROLOGIA', 'IMSS-279-10', 'HIDROCELE', 'IMSS', '2025-05-19', 'Acumulación de líquido alrededor del testículo.', true);
INSERT INTO public.guia_clinica VALUES (368, 'OFTALMOLOGIA', 'IMSS-281-10', 'RETINOPATÍA DEL PREMATURO', 'IMSS', '2025-05-19', 'Alteración vascular de la retina en prematuros.', true);
INSERT INTO public.guia_clinica VALUES (369, 'GASTROENTEROLOGIA', 'IMSS-282-10', 'ABSCESO HEPÁTICO AMEBIANO', 'IMSS', '2025-05-19', 'Colección purulenta en hígado por ameba.', true);
INSERT INTO public.guia_clinica VALUES (370, 'ONCOLOGIA', 'IMSS-286-10', 'SARCOMA DE TEJIDOS BLANDOS', 'IMSS', '2025-05-19', 'Tumor mesenquimal maligno.', true);
INSERT INTO public.guia_clinica VALUES (371, 'HEMATOLOGIA', 'IMSS-307_10', 'ALOINMUNIZACIÓN RH NEGATIVO', 'IMSS', '2025-05-19', 'Inmunización materna frente a factor Rh.', true);
INSERT INTO public.guia_clinica VALUES (372, 'PULMONAR', 'IMSS-315_10', 'HEMOPTISIS', 'IMSS', '2025-05-19', 'Expulsión de sangre por la boca procedente del aparato respiratorio.', true);
INSERT INTO public.guia_clinica VALUES (373, 'OTORRINOLARINGOLOGIA', 'IMSS-316_10', 'ORZUELO Y CHALAZIÓN', 'IMSS', '2025-05-19', 'Inflamación de glándulas palpebrales.', true);
INSERT INTO public.guia_clinica VALUES (374, 'OTORRINOLARINGOLOGIA', 'IMSS-317_10', 'FRACTURA DE HUESOS NASALES', 'IMSS', '2025-05-19', 'Trauma nasal con fractura ósea.', true);
INSERT INTO public.guia_clinica VALUES (375, 'OTORRINOLARINGOLOGIA', 'IMSS-318_10', 'FRACTURA DE HUESOS MANDIBULARES', 'IMSS', '2025-05-19', 'Fracturas de mandíbula y maxilares.', true);
INSERT INTO public.guia_clinica VALUES (376, 'CIRUGIA', 'IMSS-319-10', 'PERITONITIS INFECCIOSA', 'IMSS', '2025-05-19', 'Inflamación peritoneal bacteriana.', true);
INSERT INTO public.guia_clinica VALUES (377, 'GINECOLOGIA', 'IMSS-320-10', 'DIABETES EN EL EMBARAZO', 'IMSS', '2025-05-19', 'Control glucémico durante gestación.', true);
INSERT INTO public.guia_clinica VALUES (378, 'GINECOLOGIA', 'IMSS-322-10', 'HEMORRAGIA UTERINA DISFUNCIONAL', 'IMSS', '2025-05-19', 'Flujo menstrual anormal sin causa orgánica.', true);
INSERT INTO public.guia_clinica VALUES (379, 'ONCOLOGIA', 'IMSS-323-10', 'CÁNCER EPIDERMIOIDE DE CAVIDAD ORAL', 'IMSS', '2025-05-19', 'Tumor maligno de tejidos bucales.', true);
INSERT INTO public.guia_clinica VALUES (380, 'ONCOLOGIA', 'IMSS-324-10', 'ADENOCARCINOMA DE PÁNCREAS', 'IMSS', '2025-05-19', 'Cáncer exocrino del páncreas.', true);
INSERT INTO public.guia_clinica VALUES (381, 'UROLOGIA', 'IMSS-325-10', 'CÁNCER DE VEJIGA', 'IMSS', '2025-05-19', 'Tumor urotelial vesical.', true);
INSERT INTO public.guia_clinica VALUES (382, 'CIRUGIA', 'IMSS-326-10', 'ABSCESO PROFUNDO DE CUELLO', 'IMSS', '2025-05-19', 'Colección purulenta en espacios profundos del cuello.', true);
INSERT INTO public.guia_clinica VALUES (383, 'OFTALMOLOGIA', 'IMSS-327-10', 'DESPRENDIMIENTO SEROSO DE RETINA', 'IMSS', '2025-05-19', 'Separación retina-pigmentaria por líquido.', true);
INSERT INTO public.guia_clinica VALUES (384, 'OTORRINOLARINGOLOGIA', 'IMSS-328-10', 'DESVIACIÓN SEPTAL NASAL', 'IMSS', '2025-05-19', 'Desviación del tabique nasal.', true);
INSERT INTO public.guia_clinica VALUES (385, 'ORTOPEDIA', 'IMSS-329-10', 'OSTEOARTROSIS DE RODILLA GRADO I-II', 'IMSS', '2025-05-19', 'Degeneración articular leve a moderada.', true);
INSERT INTO public.guia_clinica VALUES (386, 'PEDIATRIA', 'IMSS-330-10', 'ESTENOSIS HIPERTROFICA CONGÉNITA DEL PILORO', 'IMSS', '2025-05-19', 'Obstrucción pilórica en lactantes.', true);
INSERT INTO public.guia_clinica VALUES (387, 'GINECOLOGIA', 'IMSS-333-09', 'CÁNCER CERVICOUTERINO', 'IMSS', '2025-05-19', 'Neoplasia cervical por VPH.', true);
INSERT INTO public.guia_clinica VALUES (388, 'PEDIATRIA', 'IMSS-334-09', 'EPIGLOTITIS AGUDA EN PREESCOLARES', 'IMSS', '2025-05-19', 'Inflamación grave de la epiglotis.', true);
INSERT INTO public.guia_clinica VALUES (389, 'NEFROLOGIA', 'IMSS-335-09', 'ENFERMEDAD RENAL CRÓNICA TEMPRANA', 'IMSS', '2025-05-19', 'Disfunción renal progresiva.', true);
INSERT INTO public.guia_clinica VALUES (390, 'HEPATOLOGIA', 'IMSS-336-10', 'HEPATITIS C CRÓNICA', 'IMSS', '2025-05-19', 'Infección vírica crónica del hígado.', true);
INSERT INTO public.guia_clinica VALUES (391, 'REUMATOLOGIA', 'IMSS-337-10', 'ARTRITIS PSORIÁSICA EN ADULTOS', 'IMSS', '2025-05-19', 'Artritis asociada a psoriasis.', true);
INSERT INTO public.guia_clinica VALUES (392, 'GENETICA', 'IMSS-338-10', 'MUCOPOLISACARIDOSIS', 'IMSS', '2025-05-19', 'Enfermedad metabólica rara.', true);
INSERT INTO public.guia_clinica VALUES (393, 'PEDIATRIA', 'IMSS-350-13', 'FIEBRE SIN SIGNOS DE FOCALIZACIÓN', 'IMSS', '2025-05-19', 'Fiebre no localizada en niños.', true);
INSERT INTO public.guia_clinica VALUES (394, 'CARDIOLOGIA', 'IMSS-352_09', 'BLOQUEO AURÍCULO-VENTRICULAR', 'IMSS', '2025-05-19', 'Alteración de conducción cardíaca.', true);
INSERT INTO public.guia_clinica VALUES (395, 'ENDOCRINOLOGIA', 'IMSS-354_09', 'NÓDULO TIROIDEO', 'IMSS', '2025-05-19', 'Lesión tiroidea que requiere estudio.', true);
INSERT INTO public.guia_clinica VALUES (396, 'TRAUMATOLOGIA', 'IMSS-355-09', 'SÍNDROME DE ABDUCCIÓN DOLOROSA DEL HOMBRO', 'IMSS', '2025-05-19', 'Dolor en movimiento de hombro.', true);
INSERT INTO public.guia_clinica VALUES (397, 'REUMATOLOGIA', 'IMSS-356-09', 'ESPONDILITIS ANQUILOSANTE', 'IMSS', '2025-05-19', 'Artritis inflamatoria axial.', true);
INSERT INTO public.guia_clinica VALUES (398, 'CARDIOLOGIA', 'IMSS-357-13', 'INFARTO AGUDO AL MIOCÁRDIO CON ELEVACIÓN DE ST', 'IMSS', '2025-05-19', 'IAM con elevación del segmento ST.', true);
INSERT INTO public.guia_clinica VALUES (399, 'DERMATOLOGIA', 'IMSS-360-13', 'CÁNCER BASOCELULAR', 'IMSS', '2025-05-19', 'Tumor cutáneo más común.', true);
INSERT INTO public.guia_clinica VALUES (400, 'OTORRINOLARINGOLOGIA', 'IMSS-361-12', 'AMIGDALECTOMÍA EN NIÑOS', 'IMSS', '2025-05-19', 'Extracción quirúrgica de amígdalas.', true);
INSERT INTO public.guia_clinica VALUES (401, 'NEONATOLOGIA', 'IMSS-362_10', 'MANEJO DEL RN PREMATURO EN SALA DE PARTOS', 'IMSS', '2025-05-19', 'Atención inmediata al recién nacido prematuro.', true);
INSERT INTO public.guia_clinica VALUES (402, 'OFTALMOLOGIA', 'IMSS-363-13', 'CATARATA CONGÉNITA', 'IMSS', '2025-05-19', 'Opacidad congénita del cristalino.', true);
INSERT INTO public.guia_clinica VALUES (403, 'CARDIOLOGIA', 'IMSS-367-10', 'MIOCARDITIS AGUDA', 'IMSS', '2025-05-19', 'Inflamación del músculo cardíaco.', true);
INSERT INTO public.guia_clinica VALUES (404, 'REUMATOLOGIA', 'IMSS-368-10', 'ARTRITIS SÉPTICA AGUDA', 'IMSS', '2025-05-19', 'Infección bacteriana de articulaciones.', true);
INSERT INTO public.guia_clinica VALUES (405, 'REUMATOLOGIA', 'IMSS-369-10', 'TRATAMIENTO DE ARTRITIS IDIOPÁTICA JUVENIL', 'IMSS', '2025-05-19', 'Artritis crónica en menores de 16 años.', true);
INSERT INTO public.guia_clinica VALUES (406, 'REUMATOLOGIA', 'IMSS-370-12', 'POLIARTERITIS NODOSA', 'IMSS', '2025-05-19', 'Vasculitis sistémica.', true);
INSERT INTO public.guia_clinica VALUES (407, 'NEUROLOGIA', 'IMSS-371-10', 'ENCEFALOPATÍA HIPOXICO-ISQUÉMICA', 'IMSS', '2025-05-19', 'Daño cerebral por falta de oxígeno.', true);
INSERT INTO public.guia_clinica VALUES (408, 'NEONATOLOGIA', 'IMSS-373-12', 'ENFERMEDAD HEMOLÍTICA DEL RN POR RH NEGATIVO', 'IMSS', '2025-05-19', 'Incompatibilidad Rh materno-fetal.', true);
INSERT INTO public.guia_clinica VALUES (409, 'CARDIOLOGIA', 'IMSS-380-10', 'PERSISTENCIA DEL CONDUCTO ARTERIOSO', 'IMSS', '2025-05-19', 'Patología cardíaca congénita.', true);
INSERT INTO public.guia_clinica VALUES (410, 'MEDICINA OCUPACIONAL', 'IMSS-382-10', 'NEUMOCONIOSIS POR SÍLICE', 'IMSS', '2025-05-19', 'Enfermedad pulmonar ocupacional.', true);
INSERT INTO public.guia_clinica VALUES (411, 'GINECOLOGIA', 'IMSS-383-10', 'RUBEOLA DURANTE EL EMBARAZO', 'IMSS', '2025-05-19', 'Prevención y manejo fetal.', true);
INSERT INTO public.guia_clinica VALUES (412, 'PSIQUIATRIA', 'IMSS-385-10', 'TRASTORNO DEL SUEÑO', 'IMSS', '2025-05-19', 'Insomnio, apnea y otros trastornos.', true);
INSERT INTO public.guia_clinica VALUES (413, 'PEDIATRIA', 'IMSS-387-10', 'VIRUS RESPIRATORIO SINCICIAL', 'IMSS', '2025-05-19', 'Infección respiratoria viral en pediatría.', true);
INSERT INTO public.guia_clinica VALUES (414, 'TRAUMATOLOGIA', 'IMSS-388-10', 'LESIONES LIGAMENTARIAS DE RODILLA', 'IMSS', '2025-05-19', 'Roturas de ligamentos cruzados.', true);
INSERT INTO public.guia_clinica VALUES (415, 'HEMATOLOGIA', 'IMSS-389-10', 'DIAGNÓSTICO Y TRATAMIENTO DE ANEMIA HEMOLÍTICA AUTOINMUNE', 'IMSS', '2025-05-19', 'Destrucción acelerada de glóbulos rojos.', true);
INSERT INTO public.guia_clinica VALUES (416, 'REUMATOLOGIA', 'IMSS-390-10', 'BURSOPATÍAS', 'IMSS', '2025-05-19', 'Inflamación de bolsas serosas.', true);
INSERT INTO public.guia_clinica VALUES (417, 'NEUROLOGIA', 'IMSS-391-10', 'MIAS TENIA GRAVIS', 'IMSS', '2025-05-19', 'Trastorno autoinmune neuromuscular.', true);
INSERT INTO public.guia_clinica VALUES (418, 'PSIQUIATRIA', 'IMSS-392-10', 'ANSIEDAD', 'IMSS', '2025-05-19', 'Trastorno emocional con miedo persistente.', true);
INSERT INTO public.guia_clinica VALUES (419, 'GERIATRIA', 'IMSS-393-10', 'DEMENCIA DE ALZHEIMER', 'IMSS', '2025-05-19', 'Degeneración cognitiva progresiva.', true);
INSERT INTO public.guia_clinica VALUES (420, 'HEMATOLOGIA', 'IMSS-394-10', 'SÍNDROME ANTIFOSFOLÍPIDOS', 'IMSS', '2025-05-19', 'Coagulación intravascular patológica.', true);
INSERT INTO public.guia_clinica VALUES (421, 'PEDIATRIA', 'IMSS-395-10', 'FIEBRE MUCOCUTÁNEA (KAWASAKI)', 'IMSS', '2025-05-19', 'Arteritis sistémica en menores de 5 años.', true);
INSERT INTO public.guia_clinica VALUES (422, 'OFTALMOLOGIA', 'IMSS-396-10', 'HIPOACUSIA NEUROSENSORIAL', 'IMSS', '2025-05-19', 'Pérdida auditiva coclear o nerviosa.', true);
INSERT INTO public.guia_clinica VALUES (423, 'CARDIOLOGIA', 'IMSS-397-10', 'TUMORES CARDÍACOS', 'IMSS', '2025-05-19', 'Neoplasias benignas o malignas del corazón.', true);
INSERT INTO public.guia_clinica VALUES (424, 'DERMATOLOGIA', 'IMSS-398-10', 'SÍNDROME DE STEVENS-JOHNSON', 'IMSS', '2025-05-19', 'Reacción dermatológica grave.', true);
INSERT INTO public.guia_clinica VALUES (425, 'OFTALMOLOGIA', 'IMSS-401-10', 'DEGENERACIÓN MACULAR ASOCIADA A LA EDAD', 'IMSS', '2025-05-19', 'Pérdida visual en adultos mayores.', true);
INSERT INTO public.guia_clinica VALUES (426, 'OFTALMOLOGIA', 'IMSS-402-10', 'TRACOMA', 'IMSS', '2025-05-19', 'Infección bacteriana ocular.', true);
INSERT INTO public.guia_clinica VALUES (427, 'HEMATOLOGIA', 'IMSS-403-10', 'ANEMIA EN ENFERMEDAD RENAL', 'IMSS', '2025-05-19', 'Anemia secundaria a insuficiencia renal.', true);
INSERT INTO public.guia_clinica VALUES (428, 'INFECTOLOGIA', 'IMSS-404-10', 'ENDOCARDITIS INFECCIOSA', 'IMSS', '2025-05-19', 'Infección endocárdica bacteriana.', true);
INSERT INTO public.guia_clinica VALUES (429, 'HEMATOLOGIA', 'IMSS-405-10', 'PORFIRIA', 'IMSS', '2025-05-19', 'Trastorno hereditario del metabolismo del hierro.', true);
INSERT INTO public.guia_clinica VALUES (430, 'CARDIOLOGIA', 'IMSS-406-10', 'SÍNDROME DE WOLFF-PARKINSON-WHITE (WPW)', 'IMSS', '2025-05-19', 'Arritmia por vía accesoria.', true);
INSERT INTO public.guia_clinica VALUES (431, 'HEMATOLOGIA', 'IMSS-407-10', 'SÍNDROME MIELDISPLÁSICO', 'IMSS', '2025-05-19', 'Displasia medular y citopenias.', true);
INSERT INTO public.guia_clinica VALUES (432, 'HEMATOLOGIA', 'IMSS-408-10', 'ENFERMEDAD DE VON WILLEBRAND', 'IMSS', '2025-05-19', 'Trastorno hemorrágico hereditario.', true);
INSERT INTO public.guia_clinica VALUES (433, 'HEMATOLOGIA', 'IMSS-409-10', 'MIELOMA MÚLTIPLE', 'IMSS', '2025-05-19', 'Neoplasia plasmática múltiple.', true);
INSERT INTO public.guia_clinica VALUES (434, 'CARDIOLOGIA', 'IMSS-410-10', 'ARRITMIA CARDÍACA NO ESPECIFICADA (VPPB)', 'IMSS', '2025-05-19', 'Latidos ventriculares prematuros. Variante: VPPB', true);
INSERT INTO public.guia_clinica VALUES (435, 'MEDICINA INTERNA', 'IMSS-411-10', 'DESEQUILIBRIO ÁCIDO-BASE', 'IMSS', '2025-05-19', 'Alteraciones en pH sanguíneo.', true);
INSERT INTO public.guia_clinica VALUES (436, 'CARDIOVASCULAR', 'IMSS-412-10', 'ANEURISMA AÓRTICO ABDOMINAL', 'IMSS', '2025-05-19', 'Expansión aneurismática abdominal.', true);
INSERT INTO public.guia_clinica VALUES (437, 'OFTALMOLOGIA', 'IMSS-413-10', 'GLAUCOMA CONGÉNITO', 'IMSS', '2025-05-19', 'Hidroftalmos y aumento de TIO desde el nacimiento.', true);
INSERT INTO public.guia_clinica VALUES (438, 'CARDIOLOGIA', 'IMSS-414-10', 'DESERCIÓN AÓRTICA', 'IMSS', '2025-05-19', 'Ruptura de la pared aórtica.', true);
INSERT INTO public.guia_clinica VALUES (439, 'HEMATOLOGIA', 'IMSS-415-10', 'ANEMIA POR DEFICIENCIA DE HIERRO EN MAYORES DE 2 AÑOS', 'IMSS', '2025-05-19', 'Deficit ferroso en edad pediátrica y adulta.', true);
INSERT INTO public.guia_clinica VALUES (440, 'OFTALMOLOGIA', 'IMSS-416-10', 'HIPOACUSIA SENSORINEURAL IDIOPÁTICA', 'IMSS', '2025-05-19', 'Pérdida auditiva sin causa conocida.', true);
INSERT INTO public.guia_clinica VALUES (441, 'NEONATOLOGIA', 'IMSS-418-10', 'ALIMENTACIÓN ENTERAL DEL RECIÉN NACIDO', 'IMSS', '2025-05-19', 'Nutrición enteral neonatal.', true);
INSERT INTO public.guia_clinica VALUES (442, 'HEPATOLOGIA', 'IMSS-419-10', 'HEPATITIS B CRÓNICA', 'IMSS', '2025-05-19', 'Infección hepática por virus B.', true);
INSERT INTO public.guia_clinica VALUES (443, 'NEUROLOGIA', 'IMSS-420-11', 'PARÁLISIS CEREBRAL INFANTIL', 'IMSS', '2025-05-19', 'Trastorno del movimiento no progresivo.', true);
INSERT INTO public.guia_clinica VALUES (444, 'CARDIOLOGIA', 'IMSS-421-11', 'FACTORES DE RIESGO CARDIOVASCULAR', 'IMSS', '2025-05-19', 'Prevención primaria y secundaria.', true);
INSERT INTO public.guia_clinica VALUES (445, 'REUMATOLOGIA', 'IMSS-422-10', 'SÍNDROME DE SJÖGREN', 'IMSS', '2025-05-19', 'Enfermedad autoinmune sistémica.', true);
INSERT INTO public.guia_clinica VALUES (446, 'REUMATOLOGIA', 'IMSS-423-11', 'ARTERITIS DE TAKAYASU', 'IMSS', '2025-05-19', 'Vasculitis granulomatosa de grandes vasos.', true);
INSERT INTO public.guia_clinica VALUES (447, 'OFTALMOLOGIA', 'IMSS-424-10', 'CONTUSIÓN OCULAR Y ORBITARIA', 'IMSS', '2025-05-19', 'Trauma cerrado del globo ocular.', true);
INSERT INTO public.guia_clinica VALUES (448, 'HEMATOLOGIA', 'IMSS-425-10', 'ENFERMEDAD TROMBOEMBÓLICA VENOSA', 'IMSS', '2025-05-19', 'Trombosis venosa profunda y embolia pulmonar.', true);
INSERT INTO public.guia_clinica VALUES (449, 'ONCOLOGIA', 'IMSS-426-11', 'CÁNCER DE VÍAS BILIARES', 'IMSS', '2025-05-19', 'Colangiocarcinoma.', true);
INSERT INTO public.guia_clinica VALUES (450, 'OFTALMOLOGIA', 'IMSS-427-10', 'DESPRENDIMIENTO DE RETINA REGMATÓGENO', 'IMSS', '2025-05-19', 'Retina desprendida con rotura.', true);
INSERT INTO public.guia_clinica VALUES (451, 'TRAUMATOLOGIA', 'IMSS-428-10', 'PREVENCIÓN, DIAGNÓSTICO Y TRATAMIENTO DE FRACTURAS COSTALES', 'IMSS', '2025-05-19', 'Lesiones torácicas traumáticas.', true);
INSERT INTO public.guia_clinica VALUES (452, 'REHABILITACION', 'IMSS-429-10', 'REHABILITACIÓN CARDÍACA', 'IMSS', '2025-05-19', 'Programa integral post evento cardíaco.', true);
INSERT INTO public.guia_clinica VALUES (453, 'DERMATOLOGIA', 'IMSS-430-10', 'PELAGRA EN NIÑOS', 'IMSS', '2025-05-19', 'Déficit de niacina.', true);
INSERT INTO public.guia_clinica VALUES (454, 'CARDIOLOGIA', 'IMSS-431-11', 'SÍNDROME DE EISENMENGER', 'IMSS', '2025-05-19', 'Hipertensión pulmonar severa secundaria.', true);
INSERT INTO public.guia_clinica VALUES (455, 'NEUROLOGIA', 'IMSS-432-11', 'ANEURISMA CEREBRAL', 'IMSS', '2025-05-19', 'Dilatación patológica de vasos cerebrales.', true);
INSERT INTO public.guia_clinica VALUES (456, 'CARDIOLOGIA', 'IMSS-433-11', 'HIPERTENSIÓN ARTERIAL PULMONAR', 'IMSS', '2025-05-19', 'Aumento de presión arterial pulmonar.', true);
INSERT INTO public.guia_clinica VALUES (457, 'OFTALMOLOGIA', 'IMSS-434-11', 'TOXICIDAD OCULAR', 'IMSS', '2025-05-19', 'Daño ocular por medicamentos o toxinas.', true);
INSERT INTO public.guia_clinica VALUES (458, 'ORTOPEDIA', 'IMSS-435-12', 'ARTROPLASTIA DE RODILLA', 'IMSS', '2025-05-19', 'Reemplazo articular de rodilla.', true);
INSERT INTO public.guia_clinica VALUES (459, 'GINECOLOGIA', 'IMSS-436-11', 'EMERGENCIAS OBSTÉTRICAS', 'IMSS', '2025-05-19', 'Manejo de complicaciones maternas agudas.', true);
INSERT INTO public.guia_clinica VALUES (460, 'TRAUMATOLOGIA', 'IMSS-437-12', 'FRACTURA Y LUXACIÓN DEL CODO', 'IMSS', '2025-05-19', 'Lesiones traumáticas del codo.', true);
INSERT INTO public.guia_clinica VALUES (461, 'OTORRINOLARINGOLOGIA', 'IMSS-438-11', 'OTITIS EXTERNA AGUDA', 'IMSS', '2025-05-19', 'Infección del conducto auditivo externo.', true);
INSERT INTO public.guia_clinica VALUES (462, 'REUMATOLOGIA', 'IMSS-439-11', 'ESCLEROSIS SISTÉMICA', 'IMSS', '2025-05-19', 'Enfermedad autoinmune del tejido conectivo.', true);
INSERT INTO public.guia_clinica VALUES (463, 'PSICOLOGIA', 'IMSS-440-11', 'CUIDADOS PALIATIVOS', 'IMSS', '2025-05-19', 'Atención integral en fase terminal.', true);
INSERT INTO public.guia_clinica VALUES (464, 'MEDICINA INTERNA', 'IMSS-441-11', 'DOLOR NEUROPÁTICO', 'IMSS', '2025-05-19', 'Dolor causado por daño nervioso.', true);
INSERT INTO public.guia_clinica VALUES (465, 'PEDIATRIA', 'IMSS-442-11', 'HIPOGLUCEMIA NEONATAL', 'IMSS', '2025-05-19', 'Niveles bajos de glucosa en recién nacidos.', true);
INSERT INTO public.guia_clinica VALUES (466, 'UROLOGIA', 'IMSS-443-10', 'HIDROCELE EN EL ADULTO', 'IMSS', '2025-05-19', 'Acumulación de líquido alrededor del testículo.', true);
INSERT INTO public.guia_clinica VALUES (467, 'HEMATOLOGIA', 'IMSS-444-10', 'LINFOMA NO HODGKIN', 'IMSS', '2025-05-19', 'Neoplasia linfática maligna.', true);
INSERT INTO public.guia_clinica VALUES (468, 'PEDIATRIA', 'IMSS-453-11', 'NIÑO GRAN QUEMADO', 'IMSS', '2025-05-19', 'Manejo integral de quemados graves.', true);
INSERT INTO public.guia_clinica VALUES (469, 'OFTALMOLOGIA', 'IMSS-454-11', 'QUERATOPATÍA BULLOSA', 'IMSS', '2025-05-19', 'Edema corneal postquirúrgico.', true);
INSERT INTO public.guia_clinica VALUES (470, 'ANESTESIOLOGIA', 'IMSS-455-11', 'VALORACIÓN PERIOPERATORIA EN CIRUGÍA NO CARDIACA EN EL ADULTO', 'IMSS', '2025-05-19', 'Evaluación preoperatoria.', true);
INSERT INTO public.guia_clinica VALUES (471, 'PSIQUIATRIA', 'IMSS-456-1', 'DEMENCIA VASCULAR', 'IMSS', '2025-05-19', 'Disfunción cognitiva por daño vascular cerebral.', true);
INSERT INTO public.guia_clinica VALUES (472, 'ENDOCRINOLOGIA', 'IMSS-457-11', 'HIPERPARATIROIDISMO PRIMARIO', 'IMSS', '2025-05-19', 'Hipersecreción de hormona paratiroidea.', true);
INSERT INTO public.guia_clinica VALUES (473, 'OTORRINOLARINGOLOGIA', 'IMSS-458-11', 'POLIPOS NASALES', 'IMSS', '2025-05-19', 'Formaciones benignas en fosas nasales.', true);
INSERT INTO public.guia_clinica VALUES (474, 'PEDIATRIA', 'IMSS-459-11', 'RAQUITISMO CARENCIAL', 'IMSS', '2025-05-19', 'Deficiencia de vitamina D en niños.', true);
INSERT INTO public.guia_clinica VALUES (475, 'NEUROLOGIA', 'IMSS-460-11', 'ENCEFALOPATÍA DE WERNICKE', 'IMSS', '2025-05-19', 'Trastorno neurológico por déficit de tiamina.', true);
INSERT INTO public.guia_clinica VALUES (476, 'GENETICA', 'IMSS-461-11', 'ENFERMEDAD DE GAUCHER TIPO I', 'IMSS', '2025-05-19', 'Trastorno lisosomal hereditario.', true);
INSERT INTO public.guia_clinica VALUES (477, 'ONCOLOGIA', 'IMSS-462-11', 'SARCOMA DE KAPOSI', 'IMSS', '2025-05-19', 'Tumor asociado a VIH.', true);
INSERT INTO public.guia_clinica VALUES (478, 'CARDIOLOGIA', 'IMSS-463-11', 'PERICARDITIS EN EL ADULTO', 'IMSS', '2025-05-19', 'Inflamación del pericardio.', true);
INSERT INTO public.guia_clinica VALUES (479, 'CARDIOLOGIA', 'IMSS-464-11', 'ANEURISMA VENTRICULAR', 'IMSS', '2025-05-19', 'Dilatación anormal de la pared ventricular.', true);
INSERT INTO public.guia_clinica VALUES (480, 'GERIATRIA', 'IMSS-465-11', 'DELIRIUM EN EL ANCIANO', 'IMSS', '2025-05-19', 'Confusión mental aguda en adultos mayores.', true);
INSERT INTO public.guia_clinica VALUES (481, 'DERMATOLOGIA', 'IMSS-466-11', 'ESCARLATINA', 'IMSS', '2025-05-19', 'Infección estreptocócica con exantema.', true);
INSERT INTO public.guia_clinica VALUES (482, 'UROLOGIA', 'IMSS-467-11', 'HIPOSPADIAS', 'IMSS', '2025-05-19', 'Anomalía congénita uretral.', true);
INSERT INTO public.guia_clinica VALUES (483, 'ONCOLOGIA', 'IMSS-468-11', 'CÁNCER DE OVARIO', 'IMSS', '2025-05-19', 'Tumor epitelial de ovario.', true);
INSERT INTO public.guia_clinica VALUES (484, 'PEDIATRIA', 'IMSS-469-11', 'RUBEOLA CONGÉNITA', 'IMSS', '2025-05-19', 'Secuelas tras infección prenatal.', true);
INSERT INTO public.guia_clinica VALUES (485, 'PEDIATRIA', 'IMSS-470-11', 'TOS CRÓNICA EN NIÑOS', 'IMSS', '2025-05-19', 'Tos persistente mayor a 4 semanas.', true);
INSERT INTO public.guia_clinica VALUES (486, 'OTORRINOLARINGOLOGIA', 'IMSS-471-11', 'CÁNCER DE LARINGE', 'IMSS', '2025-05-19', 'Tumor maligno de laringe.', true);
INSERT INTO public.guia_clinica VALUES (487, 'UROLOGIA', 'IMSS-472-11', 'INFECCIÓN URINARIA ASOCIADA A SONDA VESICAL EN LA MUJER', 'IMSS', '2025-05-19', 'ITU relacionada con cateterismo vesical.', true);
INSERT INTO public.guia_clinica VALUES (488, 'PULMONAR', 'IMSS-473-11', 'NEUMONITIS POR ASPIRACIÓN', 'IMSS', '2025-05-19', 'Inflamación pulmonar por aspiración gástrica.', true);
INSERT INTO public.guia_clinica VALUES (489, 'OFTALMOLOGIA', 'IMSS-474-11', 'SÍNDROME DEL OJO SECO', 'IMSS', '2025-05-19', 'Disminución de lágrimas o calidad deficiente.', true);
INSERT INTO public.guia_clinica VALUES (490, 'PEDIATRIA', 'IMSS-475-11', 'TOS CRÓNICA EN NIÑOS', 'IMSS', '2025-05-19', 'Tos persistente mayor a 4 semanas.', true);
INSERT INTO public.guia_clinica VALUES (491, 'GENETICA', 'IMSS-476-11', 'MUCOPOLISACARIDOSIS II', 'IMSS', '2025-05-19', 'Síndrome de Hunter.', true);
INSERT INTO public.guia_clinica VALUES (492, 'REUMATOLOGIA', 'IMSS-477-11', 'DERMATOMIOSITIS', 'IMSS', '2025-05-19', 'Miopatía inflamatoria idiopática.', true);
INSERT INTO public.guia_clinica VALUES (493, 'GINECOLOGIA', 'IMSS-478-11', 'CÁNCER DE ENDOMETRIO', 'IMSS', '2025-05-19', 'Tumor maligno del revestimiento uterino.', true);
INSERT INTO public.guia_clinica VALUES (494, 'GERIATRIA', 'IMSS-479-11', 'SÍNDROME DE FRAGILIDAD', 'IMSS', '2025-05-19', 'Estado de vulnerabilidad en adultos mayores.', true);
INSERT INTO public.guia_clinica VALUES (495, 'INFECTOLOGIA', 'IMSS-480-11', 'ACTINOMICOSIS', 'IMSS', '2025-05-19', 'Infección bacteriana crónica.', true);
INSERT INTO public.guia_clinica VALUES (496, 'INFECTOLOGIA', 'IMSS-485-11', 'MONONUCLEOSIS INFECCIOSA', 'IMSS', '2025-05-19', 'Virus Epstein-Barr.', true);
INSERT INTO public.guia_clinica VALUES (497, 'GERIATRIA', 'IMSS-491-11', 'VALORACIÓN GERONTOLÓGICA Y GERIÁTRICA', 'IMSS', '2025-05-19', 'Evaluación integral en adultos mayores.', true);
INSERT INTO public.guia_clinica VALUES (498, 'PSIQUIATRIA', 'IMSS-492-11', 'INSOMNIO DEL ANCIANO', 'IMSS', '2025-05-19', 'Trastorno del sueño en adultos mayores.', true);
INSERT INTO public.guia_clinica VALUES (499, 'TRAUMATOLOGIA', 'IMSS-493-11', 'FRACTURA DE TOBILLO', 'IMSS', '2025-05-19', 'Lesión ósea en articulación tibioperonea.', true);
INSERT INTO public.guia_clinica VALUES (500, 'GENETICA', 'IMSS-494-11', 'SÍNDROME DE DOWN', 'IMSS', '2025-05-19', 'Trisomía 21.', true);
INSERT INTO public.guia_clinica VALUES (501, 'ALERGIA', 'IMSS-495-11', 'ALERGIA ALIMENTARIA EN NIÑOS', 'IMSS', '2025-05-19', 'Reacciones inmunes frente a alimentos.', true);
INSERT INTO public.guia_clinica VALUES (502, 'OTORRINOLARINGOLOGIA', 'IMSS-496-11', 'OTITIS MEDIA', 'IMSS', '2025-05-19', 'Inflamación del oído medio.', true);
INSERT INTO public.guia_clinica VALUES (503, 'CARDIOLOGIA', 'IMSS-497-11', 'TETRALOGÍA DE FALLOT', 'IMSS', '2025-05-19', 'Cardiopatía congénita compleja.', true);
INSERT INTO public.guia_clinica VALUES (504, 'GENETICA', 'IMSS-498-11', 'MUCOPOLISACARIDOSIS VI', 'IMSS', '2025-05-19', 'Síndrome de Maroteaux-Lamy.', true);
INSERT INTO public.guia_clinica VALUES (505, 'PSIQUIATRIA', 'IMSS-499-11', 'ANSIEDAD GENERALIZADA', 'IMSS', '2025-05-19', 'Preocupación excesiva e incontrolable.', true);
INSERT INTO public.guia_clinica VALUES (506, 'GINECOLOGIA', 'IMSS-500-11', 'RESTRICCIÓN DEL CRECIMIENTO INTRAUTERINO', 'IMSS', '2025-05-19', 'Desarrollo fetal insuficiente.', true);
INSERT INTO public.guia_clinica VALUES (507, 'TRAUMATOLOGIA', 'IMSS-501-11', 'FRACTURAS DE PIE', 'IMSS', '2025-05-19', 'Fracturas metatarsianas y otras.', true);
INSERT INTO public.guia_clinica VALUES (508, 'ALERGIA', 'IMSS-502-11', 'ALERGIA A LA PROTEÍNA DE LA LECHE DE VACA', 'IMSS', '2025-05-19', 'Reacción inmunitaria a proteínas lácteas.', true);
INSERT INTO public.guia_clinica VALUES (509, 'GENETICA', 'IMSS-506-11', 'ENFERMEDAD DE POMPE', 'IMSS', '2025-05-19', 'Enfermedad lisosomal rara.', true);
INSERT INTO public.guia_clinica VALUES (510, 'REUMATOLOGIA', 'IMSS-507-11', 'ENFERMEDAD POR ADYUVANTES', 'IMSS', '2025-05-19', 'Reacción inmune a vacunas o fármacos.', true);
INSERT INTO public.guia_clinica VALUES (511, 'MEDICINA INTERNA', 'IMSS-508-11', 'ESTOMATITIS AFTOSA', 'IMSS', '2025-05-19', 'Úlceras bucales recurrentes.', true);
INSERT INTO public.guia_clinica VALUES (512, 'CIRUGIA', 'IMSS-509-11', 'LAPAROTOMÍA EN ABDOMEN AGUDO', 'IMSS', '2025-05-19', 'Exploración quirúrgica abdominal.', true);
INSERT INTO public.guia_clinica VALUES (513, 'PEDIATRIA', 'IMSS-510-11', 'TALLA BAJA', 'IMSS', '2025-05-19', 'Estatura por debajo del percentil esperado.', true);
INSERT INTO public.guia_clinica VALUES (514, 'GINECOLOGIA', 'IMSS-511-11', 'TUMOR PÉLVICO', 'IMSS', '2025-05-19', 'Masa en pelvis femenina.', true);
INSERT INTO public.guia_clinica VALUES (515, 'DERMATOLOGIA', 'IMSS-512-11', 'VITÍLIGO', 'IMSS', '2025-05-19', 'Depigmentación cutánea.', true);
INSERT INTO public.guia_clinica VALUES (516, 'REUMATOLOGIA', 'IMSS-514-11', 'ENFERMEDAD DE GRAVES', 'IMSS', '2025-05-19', 'Trastorno tiroideo autoinmune.', true);
INSERT INTO public.guia_clinica VALUES (517, 'PSIQUIATRIA', 'IMSS-515-11', 'TRASTORNO DE ESTRÉS POST TRAUMÁTICO', 'IMSS', '2025-05-19', 'Respuesta emocional a eventos traumáticos.', true);
INSERT INTO public.guia_clinica VALUES (518, 'OFTALMOLOGIA', 'IMSS-520-11', 'TRAUMA CONJUNTIVAL', 'IMSS', '2025-05-19', 'Lesión de conjuntiva por cuerpo extraño o químico.', true);
INSERT INTO public.guia_clinica VALUES (519, 'OTORRINOLARINGOLOGIA', 'IMSS-521-11', 'MASTOIDITIS', 'IMSS', '2025-05-19', 'Inflamación del hueso mastoides.', true);
INSERT INTO public.guia_clinica VALUES (520, 'OFTALMOLOGIA', 'IMSS-522-11', 'QUERATOCONO', 'IMSS', '2025-05-19', 'Deformidad progresiva de córnea.', true);
INSERT INTO public.guia_clinica VALUES (521, 'CARDIOLOGIA', 'IMSS-524_11', 'COARTACIÓN DE LA AORTA', 'IMSS', '2025-05-19', 'Constrictión congénita de la aorta.', true);
INSERT INTO public.guia_clinica VALUES (522, 'DERMATOLOGIA', 'IMSS-525_11', 'QUERATOSIS ACTÍNICA', 'IMSS', '2025-05-19', 'Lesión precancerosa por radiación solar.', true);
INSERT INTO public.guia_clinica VALUES (523, 'PSIQUIATRIA', 'IMSS-528_12', 'TRASTORNO DEL ESPECTRO AUTISTA', 'IMSS', '2025-05-19', 'Trastorno neurodesarrollo.', true);
INSERT INTO public.guia_clinica VALUES (524, 'OFTALMOLOGIA', 'IMSS-529_12', 'BLEFARITIS', 'IMSS', '2025-05-19', 'Inflamación crónica del párpado.', true);
INSERT INTO public.guia_clinica VALUES (525, 'GINECOLOGIA', 'IMSS-530_11', 'FÍSTULA VÉSICO-VAGINAL', 'IMSS', '2025-05-19', 'Comunicación anormal entre vejiga y vagina.', true);
INSERT INTO public.guia_clinica VALUES (526, 'TRAUMATOLOGIA', 'IMSS-531_11', 'INESTABILIDAD DE HOMBRO', 'IMSS', '2025-05-19', 'Luxaciones recurrentes de articulación glenohumeral.', true);
INSERT INTO public.guia_clinica VALUES (527, 'OFTALMOLOGIA', 'IMSS-532_11', 'IRIDOCICLITIS', 'IMSS', '2025-05-19', 'Inflamación del iris y cuerpo ciliar.', true);
INSERT INTO public.guia_clinica VALUES (528, 'REUMATOLOGIA', 'IMSS-533_11', 'LUPUS MUCOCUTÁNEO NO DISSEMINADO', 'IMSS', '2025-05-19', 'Forma limitada del lupus eritematoso sistémico.', true);
INSERT INTO public.guia_clinica VALUES (529, 'TRAUMATOLOGIA', 'IMSS-534_11', 'FRACTURA DE EPÍFISIS DE RADIO', 'IMSS', '2025-05-19', 'Fractura distal de radio.', true);
INSERT INTO public.guia_clinica VALUES (530, 'CARDIOLOGIA', 'IMSS-535_12', 'TAQUICARDIA SUPRAVENTRICULAR', 'IMSS', '2025-05-19', 'Arritmia cardíaca paroxística.', true);
INSERT INTO public.guia_clinica VALUES (531, 'GENETICA', 'IMSS-536_12', 'GALACTOSEMIA', 'IMSS', '2025-05-19', 'Trastorno hereditario del metabolismo de la galactosa.', true);
INSERT INTO public.guia_clinica VALUES (532, 'OFTALMOLOGIA', 'IMSS-537_11', 'OTOSCLEROSIS', 'IMSS', '2025-05-19', 'Osteogénesis anormal del oído medio.', true);
INSERT INTO public.guia_clinica VALUES (533, 'GINECOLOGIA', 'IMSS-538_11', 'CARDIOPATÍA EN EL EMBARAZO', 'IMSS', '2025-05-19', 'Manejo de enfermedades cardíacas durante gestación.', true);
INSERT INTO public.guia_clinica VALUES (534, 'GINECOLOGIA', 'IMSS-539_12', 'CERCLAJE CERVICAL', 'IMSS', '2025-05-19', 'Prevención de parto pretérmino por incompetencia cervical.', true);
INSERT INTO public.guia_clinica VALUES (535, 'PEDIATRIA', 'IMSS-540_12', 'ANEMIA DEL PREMATURO', 'IMSS', '2025-05-19', 'Anemia neonatal en recién nacidos prematuros.', true);
INSERT INTO public.guia_clinica VALUES (536, 'OFTALMOLOGIA', 'IMSS-541_12', 'QUERATOPLASTIA PENETRANTE', 'IMSS', '2025-05-19', 'Trasplante corneal completo.', true);
INSERT INTO public.guia_clinica VALUES (537, 'GENETICA', 'IMSS-542_12', 'ENFERMEDAD DE GAUCHER CON MANIFESTACIONES NEUROLÓGICAS', 'IMSS', '2025-05-19', 'Subtipo neurológico de la enfermedad de Gaucher.', true);
INSERT INTO public.guia_clinica VALUES (538, 'DERMATOLOGIA', 'IMSS-543_12', 'ESCABIASIS', 'IMSS', '2025-05-19', 'Infestación por ácaro Sarcoptes scabiei.', true);
INSERT INTO public.guia_clinica VALUES (539, 'ONCOLOGIA', 'IMSS-547-12', 'MELANOMA MALIGNO', 'IMSS', '2025-05-19', 'Tumor cutáneo más agresivo.', true);
INSERT INTO public.guia_clinica VALUES (540, 'NEONATOLOGIA', 'IMSS-548-12', 'MANEJO DE LÍQUIDOS Y ELECTROLITOS EN RECIÉN NACIDOS PREMATUROS', 'IMSS', '2025-05-19', 'Equilibrio hidroelectrolítico en RN prematuros.', true);
INSERT INTO public.guia_clinica VALUES (541, 'FARMACOLOGIA', 'IMSS-552-12', 'SEGURIDAD CON AGENTES ANTINEOPLÁSICOS', 'IMSS', '2025-05-19', 'Prevención de riesgos ocupacionales.', true);
INSERT INTO public.guia_clinica VALUES (542, 'NUTRICION', 'IMSS-553-12', 'NUTRICIÓN EN EL ADULTO MAYOR', 'IMSS', '2025-05-19', 'Requerimientos nutricionales geriátricos.', true);
INSERT INTO public.guia_clinica VALUES (543, 'GENETICA', 'IMSS-554-12', 'FENILCETONURIA', 'IMSS', '2025-05-19', 'Error innato del metabolismo.', true);
INSERT INTO public.guia_clinica VALUES (544, 'TRAUMATOLOGIA', 'IMSS-555-12', 'FRACTURA DE DIÁFISIS DE HÚMERO', 'IMSS', '2025-05-19', 'Lesión ósea en tercio medio del húmero.', true);
INSERT INTO public.guia_clinica VALUES (545, 'NUTRICION', 'IMSS-556-12', 'NUTRICIÓN PARENTERAL: COMPLICACIONES', 'IMSS', '2025-05-19', 'Monitoreo y manejo de nutrición intravenosa.', true);
INSERT INTO public.guia_clinica VALUES (546, 'OTORRINOLARINGOLOGIA', 'IMSS-557-12', 'PAPILOMATOSIS LARÍNGEA', 'IMSS', '2025-05-19', 'Verrugas laríngeas causadas por VPH.', true);
INSERT INTO public.guia_clinica VALUES (547, 'FARMACOLOGIA', 'IMSS-558-12', 'PRESCRIPCIÓN FARMACOLÓGICA RAZONADA', 'IMSS', '2025-05-19', 'Uso seguro y eficaz de medicamentos.', true);
INSERT INTO public.guia_clinica VALUES (548, 'UROLOGIA', 'IMSS-559-12', 'RETENCIÓN DE ORINA EN URGENCIAS', 'IMSS', '2025-05-19', 'Intervención urgente por obstrucción urinaria.', true);
INSERT INTO public.guia_clinica VALUES (549, 'DERMATOLOGIA', 'IMSS-560-12', 'DERMATITIS DE CONTACTO', 'IMSS', '2025-05-19', 'Reacción inflamatoria por contacto alérgico o irritativo.', true);
INSERT INTO public.guia_clinica VALUES (550, 'UROLOGIA', 'IMSS-561-12', 'ESTRECHEZ DE URETRA', 'IMSS', '2025-05-19', 'Obstrucción uretral por cicatriz o estrechez.', true);
INSERT INTO public.guia_clinica VALUES (551, 'INFECTOLOGIA', 'IMSS-562-12', 'CANDIDIASIS INVASIVA', 'IMSS', '2025-05-19', 'Infección fúngica diseminada.', true);
INSERT INTO public.guia_clinica VALUES (552, 'NUTRICION', 'IMSS-563-12', 'NUTRICIÓN ENTERAL CON FORMULAS ESPECIALES', 'IMSS', '2025-05-19', 'Alimentación digestible para condiciones clínicas.', true);
INSERT INTO public.guia_clinica VALUES (553, 'DERMATOLOGIA', 'IMSS-566-12', 'ALOPECIA ANDROGÉNICA', 'IMSS', '2025-05-19', 'Caída progresiva del cabello por factores hormonales.', true);
INSERT INTO public.guia_clinica VALUES (554, 'GINECOLOGIA', 'IMSS-567-12', 'MUERTE FETAL CONFIRMADA', 'IMSS', '2025-05-19', 'Manejo ante diagnóstico de muerte fetal.', true);
INSERT INTO public.guia_clinica VALUES (555, 'GINECOLOGIA', 'IMSS-568-12', 'PADECIMIENTOS GINECOLÓGICOS POSTMENOPAUSIA', 'IMSS', '2025-05-19', 'Atención ginecológica en la mujer postmenopáusica.', true);
INSERT INTO public.guia_clinica VALUES (556, 'GINECOLOGIA', 'IMSS-569-12', 'SÍNDROME DEL SENO ENFERMO', 'IMSS', '2025-05-19', 'Disfunción del seno endometriótico u otras causas.', true);
INSERT INTO public.guia_clinica VALUES (557, 'GENETICA', 'IMSS-570-12', 'NIÑOS Y MUJERES CON SÍNDROME DE TURNER', 'IMSS', '2025-05-19', 'Alteración cromosómica femenina.', true);
INSERT INTO public.guia_clinica VALUES (558, 'TRAUMATOLOGIA', 'IMSS-573-12', 'FRACTURA DESPLAZADA DE CUELLO FEMORAL', 'IMSS', '2025-05-19', 'Lesión ósea de alto impacto en adultos.', true);
INSERT INTO public.guia_clinica VALUES (559, 'TRAUMATOLOGIA', 'IMSS-574-12', 'COCCIGODINIA EN ADULTOS', 'IMSS', '2025-05-19', 'Dolor crónico en región sacrococcígea.', true);
INSERT INTO public.guia_clinica VALUES (560, 'TRAUMATOLOGIA', 'IMSS-575-12', 'FRACTURA CERRADA DE RÁDULA EN ADULTOS', 'IMSS', '2025-05-19', 'Fractura sin exposición cutánea.', true);
INSERT INTO public.guia_clinica VALUES (561, 'TRAUMATOLOGIA', 'IMSS-576-12', 'FRACTURA DEL HÚMERO PROXIMAL EN ADULTO', 'IMSS', '2025-05-19', 'Fractura de cabeza humeral.', true);
INSERT INTO public.guia_clinica VALUES (562, 'TRAUMATOLOGIA', 'IMSS-577-12', 'LESIONES DE MENISCOS', 'IMSS', '2025-05-19', 'Daño meniscal en rodilla.', true);
INSERT INTO public.guia_clinica VALUES (563, 'TRAUMATOLOGIA', 'IMSS-578-12', 'FRACTURA CERRADA DE METAFISIS TIBIAL', 'IMSS', '2025-05-19', 'Lesión ósea de tibia sin daño tegumentario.', true);
INSERT INTO public.guia_clinica VALUES (564, 'GINECOLOGIA', 'IMSS-579-12', 'RECANALIZACIÓN TUBÁRICA', 'IMSS', '2025-05-19', 'Restablecimiento de permeabilidad tubárica.', true);
INSERT INTO public.guia_clinica VALUES (565, 'GINECOLOGIA', 'IMSS-580-12', 'VACUNACIÓN EN LA EMBARAZADA', 'IMSS', '2025-05-19', 'Protección inmunológica durante embarazo.', true);
INSERT INTO public.guia_clinica VALUES (566, 'GINECOLOGIA', 'IMSS-581-12', 'QUISTE Y ABS CESO DE LA GLÁNDULA DE BARTHOLIN', 'IMSS', '2025-05-19', 'Tratamiento de quistes e infecciones glandulares.', true);
INSERT INTO public.guia_clinica VALUES (567, 'GERIATRIA', 'IMSS-583-12', 'PROBLEMAS BUCODENTALES EN ADULTO MAYOR', 'IMSS', '2025-05-19', 'Patología oral en ancianos.', true);
INSERT INTO public.guia_clinica VALUES (568, 'TRAUMATOLOGIA', 'IMSS-584-12', 'FRACTURA DE CLAVÍCULA EN ADULTO', 'IMSS', '2025-05-19', 'Trauma en hueso clavicular.', true);
INSERT INTO public.guia_clinica VALUES (569, 'GINECOLOGIA', 'IMSS-585-12', 'RECOMENDACIONES EN HISTEROSCOPIA', 'IMSS', '2025-05-19', 'Diagnóstico y tratamiento endoscópico uterino.', true);
INSERT INTO public.guia_clinica VALUES (570, 'ENFERMERIA', 'IMSS-586-12', 'INTERVENCIONES DE ENFERMERÍA EN PREECLAMPSIA/ECLAMPSIA', 'IMSS', '2025-05-19', 'Atención de enfermería en hipertensión materna.', true);
INSERT INTO public.guia_clinica VALUES (571, 'ALERGIA', 'IMSS-587-12', 'RINITIS NO ALÉRGICA', 'IMSS', '2025-05-19', 'Congestión nasal no mediada por IgE.', true);
INSERT INTO public.guia_clinica VALUES (685, 'DERMATOLOGIA', 'ISSSTE-250-10', 'VERRUGAS VULGARES', 'ISSSTE', '2025-05-19', 'Papilomas virales.', true);
INSERT INTO public.guia_clinica VALUES (572, 'PEDIATRIA', 'IMSS-588-12', 'EXÁNTEMAS INFECCIOSOS EN LA INFANCIA', 'IMSS', '2025-05-19', 'Enfermedades eruptivas pediátricas.', true);
INSERT INTO public.guia_clinica VALUES (573, 'OBSTETRICIA', 'IMSS-589-13', 'ANOMALÍAS EN INSERCIÓN PLACENTARIA', 'IMSS', '2025-05-19', 'Placenta previa, inserción velamentosa.', true);
INSERT INTO public.guia_clinica VALUES (574, 'GINECOLOGIA', 'IMSS-590-13', 'CÁNCER DE VAGINA', 'IMSS', '2025-05-19', 'Neoplasia vaginal.', true);
INSERT INTO public.guia_clinica VALUES (575, 'CIRUGIA', 'IMSS-591-13', 'COMPLICACIONES EN CIRUGÍA NO CARDIACA', 'IMSS', '2025-05-19', 'Manejo de complicaciones quirúrgicas.', true);
INSERT INTO public.guia_clinica VALUES (576, 'GASTROENTEROLOGIA', 'IMSS-592-13', 'SÍNDROME DE INTESTINO CORTO', 'IMSS', '2025-05-19', 'Malabsorción tras resección intestinal extensa.', true);
INSERT INTO public.guia_clinica VALUES (577, 'PEDIATRIA', 'IMSS-593-13', 'PNEUMOCISTOSIS (PNFI) COMÚN', 'IMSS', '2025-05-19', 'Infección pulmonar por Pneumocystis jirovecii.', true);
INSERT INTO public.guia_clinica VALUES (578, 'HEPATOLOGIA', 'IMSS-594-13', 'TRATAMIENTO NUTRICIONAL PRETRANSPLANTE HEPÁTICO', 'IMSS', '2025-05-19', 'Soporte nutricional pre-trasplante hepático.', true);
INSERT INTO public.guia_clinica VALUES (579, 'NEUROLOGIA', 'IMSS-600-13', 'ATAXIA CEREBELOSA', 'IMSS', '2025-05-19', 'Trastorno motor por lesión cerebelosa.', true);
INSERT INTO public.guia_clinica VALUES (580, 'PEDIATRIA', 'IMSS-601-13', 'DOLOR LUMBAR EN PEDIATRÍA', 'IMSS', '2025-05-19', 'Evaluación y manejo de dolor lumbar infantil.', true);
INSERT INTO public.guia_clinica VALUES (581, 'DERMATOLOGIA', 'IMSS-602-13', 'PEDICULOSIS CAPITIS', 'IMSS', '2025-05-19', 'Infestación por piojos en cuero cabelludo.', true);
INSERT INTO public.guia_clinica VALUES (582, 'ENFERMERIA', 'IMSS-603-13', 'INTERVENCIONES DE ENFERMERÍA EN FRACTURA DE CADERA EN ADULTOS', 'IMSS', '2025-05-19', 'Cuidados específicos en fracturas femorales.', true);
INSERT INTO public.guia_clinica VALUES (583, 'NEUROLOGIA', 'IMSS-604-13', 'TRAUMATISMO CRANEOENCEFÁLICO', 'IMSS', '2025-05-19', 'Lesiones cerebrales traumáticas.', true);
INSERT INTO public.guia_clinica VALUES (584, 'GINECOLOGIA', 'IMSS-605-13', 'PARTO DESPUÉS DE CESÁREA', 'IMSS', '2025-05-19', 'VBAC: parto vaginal después de cesárea.', true);
INSERT INTO public.guia_clinica VALUES (585, 'OBSTETRICIA', 'IMSS-606-13', 'CORIOAMNIOITIS', 'IMSS', '2025-05-19', 'Infección intraamniótica.', true);
INSERT INTO public.guia_clinica VALUES (586, 'UROLOGIA', 'IMSS-607-13', 'CÁNCER DE RIÑÓN', 'IMSS', '2025-05-19', 'Neoplasia renal.', true);
INSERT INTO public.guia_clinica VALUES (587, 'GINECOLOGIA', 'IMSS-608-13', 'EPISIOTOMÍA COMPLICADA', 'IMSS', '2025-05-19', 'Lesión perineal durante parto.', true);
INSERT INTO public.guia_clinica VALUES (588, 'GINECOLOGIA', 'IMSS-609-13', 'CANDIDOSIS VULVOVAGINAL', 'IMSS', '2025-05-19', 'Infección micótica genital.', true);
INSERT INTO public.guia_clinica VALUES (589, 'INFECTOLOGIA', 'IMSS-610-13', 'INFECCIÓN POR CITOMEGALOVIRUS', 'IMSS', '2025-05-19', 'Infección vírica congénita o adquirida.', true);
INSERT INTO public.guia_clinica VALUES (590, 'PSIQUIATRIA', 'IMSS-611-13', 'SÍNDROME DE PRIVACIÓN SENSORIAL', 'IMSS', '2025-05-19', 'Déficit sensorial prolongado.', true);
INSERT INTO public.guia_clinica VALUES (591, 'GERIATRIA', 'IMSS-612-13', 'SÍNDROMES GERIÁTRICOS Y COMPLICACIONES POSTOPERATORIAS', 'IMSS', '2025-05-19', 'Atención integral en cirugía geriátrica.', true);
INSERT INTO public.guia_clinica VALUES (592, 'OTORRINOLARINGOLOGIA', 'IMSS-613-13', 'CERUMEN IMPACTADO', 'IMSS', '2025-05-19', 'Obstrucción auditiva por cerumen.', true);
INSERT INTO public.guia_clinica VALUES (593, 'OFTALMOLOGIA', 'IMSS-614-13', 'AGUJERO MACULAR IDIOPÁTICO', 'IMSS', '2025-05-19', 'Perforación central de retina.', true);
INSERT INTO public.guia_clinica VALUES (594, 'OFTALMOLOGIA', 'IMSS-615-13', 'HIPERTENSIÓN OCULAR', 'IMSS', '2025-05-19', 'Presión intraocular elevada sin daño visual.', true);
INSERT INTO public.guia_clinica VALUES (595, 'OFTALMOLOGIA', 'IMSS-616-13', 'OCLUSIÓN VENOSA RETINIANA', 'IMSS', '2025-05-19', 'Isquemia retiniana por trombosis venosa.', true);
INSERT INTO public.guia_clinica VALUES (596, 'TRAUMATOLOGIA', 'IMSS-617-13', 'SÍNDROME DEL MANGUITO ROTADOR', 'IMSS', '2025-05-19', 'Lesión músculo-tendinosa de hombro.', true);
INSERT INTO public.guia_clinica VALUES (597, 'TRAUMATOLOGIA', 'IMSS-618-13', 'HALLUX VALGUS', 'IMSS', '2025-05-19', 'Deformidad del primer dedo del pie.', true);
INSERT INTO public.guia_clinica VALUES (598, 'REHABILITACION', 'IMSS-619-13', 'REHABILITACIÓN VISUAL', 'IMSS', '2025-05-19', 'Apoyo visual en pacientes con discapacidad.', true);
INSERT INTO public.guia_clinica VALUES (599, 'OFTALMOLOGIA', 'IMSS-620-13', 'TRATAMIENTO QX DE CATARATA CONGÉNITA', 'IMSS', '2025-05-19', 'Cirugía de opacidad cristalina desde el nacimiento.', true);
INSERT INTO public.guia_clinica VALUES (600, 'GINECOLOGIA', 'IMSS-621-13', 'DIAGNÓSTICO DE PAREJA INFÉRTIL', 'IMSS', '2025-05-19', 'Evaluación de infertilidad de pareja.', true);
INSERT INTO public.guia_clinica VALUES (601, 'GENETICA', 'IMSS-622-13', 'ACIDEMIAS ORGÁNICAS', 'IMSS', '2025-05-19', 'Errores congénitos del metabolismo.', true);
INSERT INTO public.guia_clinica VALUES (602, 'TRAUMATOLOGIA', 'IMSS-623-13', 'OSTEOCONDritis DISSECANTE', 'IMSS', '2025-05-19', 'Desprendimiento de cartílago articular.', true);
INSERT INTO public.guia_clinica VALUES (603, 'PEDIATRIA', 'IMSS-624-13', 'NEUMOPATÍA Y VENTILACIÓN MECÁNICA EN NIÑOS', 'IMSS', '2025-05-19', 'Manejo respiratorio invasivo y no invasivo.', true);
INSERT INTO public.guia_clinica VALUES (604, 'PEDIATRIA', 'IMSS-625-13', 'MALFORMACIONES DEL TRACTO URINARIO EN NIÑOS', 'IMSS', '2025-05-19', 'Defectos congénitos del aparato urinario.', true);
INSERT INTO public.guia_clinica VALUES (605, 'FISIOTERAPIA', 'IMSS-626-13', 'EJERCICIOS CON PLANTILLAS TERAPÉUTICAS', 'IMSS', '2025-05-19', 'Tratamiento biomecánico plantar.', true);
INSERT INTO public.guia_clinica VALUES (606, 'PEDIATRIA', 'IMSS-627-13', 'FIBROSIS QUISTICA PEDIÁTRICA', 'IMSS', '2025-05-19', 'Enfermedad genética multisistémica.', true);
INSERT INTO public.guia_clinica VALUES (607, 'GINECOLOGIA', 'IMSS-628-13', 'EMBARAZO MÚLTIPLE', 'IMSS', '2025-05-19', 'Monitoreo y manejo de embarazo gemelar.', true);
INSERT INTO public.guia_clinica VALUES (608, 'MEDICINA INTERNA', 'IMSS-629-13', 'DOLOR DE CUELLO EN ADULTOS', 'IMSS', '2025-05-19', 'Evaluación y tratamiento del dolor cervical.', true);
INSERT INTO public.guia_clinica VALUES (609, 'GINECOLOGIA', 'IMSS-630-13', 'DESÓRDENES BENIGNOS DE LA VULVA', 'IMSS', '2025-05-19', 'Patología no oncológica vulvar.', true);
INSERT INTO public.guia_clinica VALUES (610, 'CIRUGIA', 'IMSS-631-13', 'CIRUGÍA REFRACTIVA EN ADULTOS', 'IMSS', '2025-05-19', 'Corrección visual mediante láser.', true);
INSERT INTO public.guia_clinica VALUES (611, 'PEDIATRIA', 'IMSS-632-13', 'ASFIXIA NEONATAL', 'IMSS', '2025-05-19', 'Soporte vital neonatal.', true);
INSERT INTO public.guia_clinica VALUES (612, 'PEDIATRIA', 'IMSS-633-13', 'MANEJO DE PARO CARDIORRESPIRATORIO', 'IMSS', '2025-05-19', 'Reanimación cardiopulmonar pediátrica.', true);
INSERT INTO public.guia_clinica VALUES (613, 'ENFERMERIA', 'IMSS-634-13', 'INTERVENCIONES DE ENFERMERÍA EN LNHF', 'IMSS', '2025-05-19', 'Atención específica en insuficiencia cardíaca.', true);
INSERT INTO public.guia_clinica VALUES (614, 'UROLOGIA', 'IMSS-635-13', 'CÁLCULO RENOURETERAL', 'IMSS', '2025-05-19', 'Litiasis urinaria.', true);
INSERT INTO public.guia_clinica VALUES (615, 'TRAUMATOLOGIA', 'IMSS-636-13', 'FRACTURA DISTAL DE RADIO', 'IMSS', '2025-05-19', 'Fractura de muñeca.', true);
INSERT INTO public.guia_clinica VALUES (616, 'NUTRICION', 'IMSS-637-13', 'LACTANCIA MATERNA', 'IMSS', '2025-05-19', 'Promoción y apoyo a la lactancia materna.', true);
INSERT INTO public.guia_clinica VALUES (617, 'INFECTOLOGIA', 'IMSS-640-13', 'ASPERGILLOSIS INVASORA', 'IMSS', '2025-05-19', 'Infección fúngica pulmonar grave.', true);
INSERT INTO public.guia_clinica VALUES (618, 'NUTRICION', 'IMSS-641-13', 'DESNUTRICIÓN INTRAHOSPITALARIA', 'IMSS', '2025-05-19', 'Prevención y manejo en pacientes hospitalizados.', true);
INSERT INTO public.guia_clinica VALUES (619, 'ENFERMERIA', 'IMSS-642-13', 'INTERVENCIONES DE ENFERMERÍA EN DIÁLISIS', 'IMSS', '2025-05-19', 'Cuidados específicos en diálisis.', true);
INSERT INTO public.guia_clinica VALUES (620, 'PEDIATRIA', 'IMSS-643-13', 'ABORDAJE DIAGNÓSTICO EN ESTREÑIMIENTO PEDIÁTRICO', 'IMSS', '2025-05-19', 'Evaluación de constipación infantil.', true);
INSERT INTO public.guia_clinica VALUES (621, 'ENDOCRINOLOGIA', 'IMSS-644-13', 'DIAGNÓSTICO DE HIPERPROLACTINEMIA', 'IMSS', '2025-05-19', 'Trastorno endocrino con aumento de prolactina.', true);
INSERT INTO public.guia_clinica VALUES (622, 'ENFERMERIA', 'IMSS-645-13', 'INTERVENCIONES DE ENFERMERÍA EN RN PREMATURO', 'IMSS', '2025-05-19', 'Cuidado especializado en prematuros.', true);
INSERT INTO public.guia_clinica VALUES (623, 'NUTRICION', 'IMSS-646-13', 'TRATAMIENTO MÉDICO Y NUTRICIONAL DE ESTOMAS DE ELIMINACIÓN', 'IMSS', '2025-05-19', 'Manejo integral de colostomías/ileostomías.', true);
INSERT INTO public.guia_clinica VALUES (624, 'NEUROLOGIA', 'IMSS-647-13', 'ASTROCITOMA O OLIGODENDROGLIOMA', 'IMSS', '2025-05-19', 'Tumores gliales del sistema nervioso.', true);
INSERT INTO public.guia_clinica VALUES (625, 'MEDICINA INTERNA', 'IMSS-648-13', 'DIAGNÓSTICO Y TRATAMIENTO DE HIPERNATREMIA', 'IMSS', '2025-05-19', 'Desequilibrio electrolítico grave.', true);
INSERT INTO public.guia_clinica VALUES (626, 'TRAUMATOLOGIA', 'IMSS-649-14', 'INFECCIONES EN DISPOSITIVOS ORTOPÉDICOS', 'IMSS', '2025-05-19', 'Manejo de infecciones postimplante.', true);
INSERT INTO public.guia_clinica VALUES (627, 'INFECTOLOGIA', 'IMSS-650-14', 'MICOBACTERIOSIS NO TUBERCULOSA', 'IMSS', '2025-05-19', 'Infecciones micobacterianas no tuberculosas.', true);
INSERT INTO public.guia_clinica VALUES (628, 'REHABILITACION', 'IMSS-651-13', 'INTERVENCIONES DE ENFERMERÍA EN REHABILITACIÓN TEMPRANA', 'IMSS', '2025-05-19', 'Apoyo en recuperación funcional.', true);
INSERT INTO public.guia_clinica VALUES (629, 'ENDOCRINOLOGIA', 'IMSS-652-13', 'TRATAMIENTO FARMACOLÓGICO DE HIPERPROLACTINEMIA', 'IMSS', '2025-05-19', 'Uso de dopaminérgicos.', true);
INSERT INTO public.guia_clinica VALUES (630, 'GERIATRIA', 'IMSS-657-13', 'DIAGNÓSTICO Y TRATAMIENTO DE DIABETES EN ADULTO VULNERABLE', 'IMSS', '2025-05-19', 'Manejo glucémico en adultos frágiles.', true);
INSERT INTO public.guia_clinica VALUES (631, 'CIRUGIA', 'IMSS-659-13', 'QUEMADURA POR CORROSIVOS', 'IMSS', '2025-05-19', 'Lesión esofágica o gástrica por sustancias cáusticas.', true);
INSERT INTO public.guia_clinica VALUES (632, 'REHABILITACION', 'IMSS-670-13', 'CUIDADOS RESPIRATORIOS EN ENFERMEDAD MUCOPOLISACARIDOSIS Y POMPE', 'IMSS', '2025-05-19', 'Soporte respiratorio en enfermedades raras.', true);
INSERT INTO public.guia_clinica VALUES (633, 'ENFERMERIA', 'IMSS-671-13', 'INTERVENCIONES DE ENFERMERÍA EN HEMOFILIA PEDIÁTRICA', 'IMSS', '2025-05-19', 'Atención de enfermería en hemofilia.', true);
INSERT INTO public.guia_clinica VALUES (634, 'ENFERMERIA', 'IMSS-672-13', 'INTERVENCIONES DE ENFERMERÍA EN INFARTO AGUDO AL MIOCÁRDIO', 'IMSS', '2025-05-19', 'Cuidado específico post IAM.', true);
INSERT INTO public.guia_clinica VALUES (635, 'GINECOLOGIA', 'IMSS-673-13', 'OSTEOPOROSIS EN MUJERES POSTMENOPÁUSICAS', 'IMSS', '2025-05-19', 'Prevención de fracturas osteoporóticas.', true);
INSERT INTO public.guia_clinica VALUES (636, 'UROLOGIA', 'IMSS-674-13', 'VARICOCELE EN ADOLESCENTES Y ADULTOS', 'IMSS', '2025-05-19', 'Varices testiculares.', true);
INSERT INTO public.guia_clinica VALUES (637, 'TRAUMATOLOGIA', 'IMSS-675-13', 'FRACTURAS DE VERTEBRAS TORACOLUMBARES', 'IMSS', '2025-05-19', 'Trauma vertebral cerrado.', true);
INSERT INTO public.guia_clinica VALUES (638, 'ENFERMERIA', 'IMSS-676-13', 'INTERVENCIONES DE ENFERMERÍA PARA SEGURIDAD DEL PACIENTE QUIRÚRGICO', 'IMSS', '2025-05-19', 'Protocolos preoperatorios seguros.', true);
INSERT INTO public.guia_clinica VALUES (639, 'MEDICINA INTERNA', 'IMSS-677-13', 'OSTEOPOROSIS INDUCIDA POR GLUCOCORTICOIDES', 'IMSS', '2025-05-19', 'Reducción de masa ósea por corticoides.', true);
INSERT INTO public.guia_clinica VALUES (640, 'OFTALMOLOGIA', 'IMSS-682-13', 'ESTENOSIS DE LA VÍA LAGRIMAL', 'IMSS', '2025-05-19', 'Obstrucción lagrimal congénita o adquirida.', true);
INSERT INTO public.guia_clinica VALUES (641, 'NUTRICION', 'IMSS-684-13', 'INTERVENCIÓN DIETÉTICA EN OBESIDAD', 'IMSS', '2025-05-19', 'Modificación del estilo alimentario.', true);
INSERT INTO public.guia_clinica VALUES (642, 'HEPATOLOGIA', 'IMSS-685-13', 'ENCEFALOPATÍA HEPÁTICA', 'IMSS', '2025-05-19', 'Complicación neurológica de cirrosis.', true);
INSERT INTO public.guia_clinica VALUES (643, 'GINECOLOGIA', 'IMSS-686-13', 'INSUFICIENCIA OVÁRICA PRIMARIA', 'IMSS', '2025-05-19', 'Fallo ovárico antes de los 40 años.', true);
INSERT INTO public.guia_clinica VALUES (644, 'MEDICINA INTERNA', 'IMSS-687-13', 'PACIENTE OBESO: DOSIFICACIÓN DE MEDICAMENTOS', 'IMSS', '2025-05-19', 'Ajuste farmacológico en obesidad.', true);
INSERT INTO public.guia_clinica VALUES (645, 'FARMACOLOGIA', 'IMSS-688-13', 'INTERACCIONES FARMACOLÓGICAS EN ADULTO MAYOR', 'IMSS', '2025-05-19', 'Prevención de interacciones medicamentosas.', true);
INSERT INTO public.guia_clinica VALUES (646, 'DERMATOLOGIA', 'IMSS-689-13', 'LUPUS CUTÁNEO DISCOIDE EN ADULTOS', 'IMSS', '2025-05-19', 'Forma cutánea crónica del lupus. ', true);
INSERT INTO public.guia_clinica VALUES (647, 'NUTRICION', 'IMSS-690-13', 'INTERVENCIONES DE ENFERMERÍA EN SOBREPESO Y OBESIDAD', 'IMSS', '2025-05-19', 'Educación nutricional desde enfermería.', true);
INSERT INTO public.guia_clinica VALUES (648, 'GERIATRIA', 'IMSS-691-13', 'OSTEOMALACIA POR DEFICIENCIA DE VITAMINA D EN ADULTO MAYOR', 'IMSS', '2025-05-19', 'Déficit mineral de huesos.', true);
INSERT INTO public.guia_clinica VALUES (649, 'ESTOMATOLOGIA', 'IMSS-692-13', 'PULPITIS IRREVERSIBLE', 'IMSS', '2025-05-19', 'Inflamación irreversible del tejido pulpar.', true);
INSERT INTO public.guia_clinica VALUES (650, 'DERMATOLOGIA', 'IMSS-693-13', 'RADIODERMATITIS', 'IMSS', '2025-05-19', 'Reacción inflamatoria cutánea por radiación.', true);
INSERT INTO public.guia_clinica VALUES (651, 'NUTRICION', 'IMSS-694-13', 'SEGURIDAD ALIMENTARIA EN PACIENTE HOSPITALIZADO', 'IMSS', '2025-05-19', 'Prevención de riesgos alimentarios.', true);
INSERT INTO public.guia_clinica VALUES (652, 'DERMATOLOGIA', 'IMSS-695-13', 'ALOPECIA AREATA', 'IMSS', '2025-05-19', 'Caída focal del cabello.', true);
INSERT INTO public.guia_clinica VALUES (653, 'DERMATOLOGIA', 'IMSS-696-13', 'TRATAMIENTO FARMACOLÓGICO DE PSORIASIS EN PLACAS', 'IMSS', '2025-05-19', 'Manejo dermatológico.', true);
INSERT INTO public.guia_clinica VALUES (654, 'OTORRINOLARINGOLOGIA', 'IMSS-697-13', 'BAROTRAUMA DE OÍDO MEDIO', 'IMSS', '2025-05-19', 'Daño por cambios bruscos de presión.', true);
INSERT INTO public.guia_clinica VALUES (655, 'HEPATOLOGIA', 'IMSS-701-13', 'HEPATITIS AUTOINMUNE', 'IMSS', '2025-05-19', 'Inflamación hepática autoinmune.', true);
INSERT INTO public.guia_clinica VALUES (656, 'NEUROLOGIA', 'IMSS-702-13', 'ANISOCORIA', 'IMSS', '2025-05-19', 'Asimetría pupilar.', true);
INSERT INTO public.guia_clinica VALUES (657, 'ENFERMERIA', 'IMSS-703-14', 'INTERVENCIONES DE ENFERMERÍA EN SÍNDROME DE INMOVILIDAD', 'IMSS', '2025-05-19', 'Prevención de complicaciones por inmovilidad.', true);
INSERT INTO public.guia_clinica VALUES (658, 'PEDIATRIA', 'IMSS-704-14', 'LACTANCIA EN NIÑO CON ENFERMEDAD CRÓNICA', 'IMSS', '2025-05-19', 'Manejo adaptado en patologías.', true);
INSERT INTO public.guia_clinica VALUES (659, 'NEUROLOGIA', 'IMSS-705-14', 'OFTALMOPLEJÍA INTERNUCLEAR', 'IMSS', '2025-05-19', 'Trastorno de movimiento ocular.', true);
INSERT INTO public.guia_clinica VALUES (660, 'DERMATOLOGIA', 'IMSS-706-14', 'TRATAMIENTO DE DERMATITIS ATÓPICA', 'IMSS', '2025-05-19', 'Enfermedad inflamatoria crónica de la piel.', true);
INSERT INTO public.guia_clinica VALUES (661, 'HEMATOLOGIA', 'IMSS-708-14', 'ESFEROCITOSIS HEREDITARIA', 'IMSS', '2025-05-19', 'Anemia hemolítica hereditaria.', true);
INSERT INTO public.guia_clinica VALUES (662, 'NEFROLOGIA', 'IMSS-709-14', 'ENFERMEDAD RENAL Y ACIDO CETOGENOSIS EN VIH', 'IMSS', '2025-05-19', 'Complicaciones renales en pacientes VIH.', true);
INSERT INTO public.guia_clinica VALUES (663, 'ENFERMERIA', 'IMSS-710-14', 'ENFERMERÍA EN CUIDADO DE CATÉTERES LINEALES (CCL)', 'IMSS', '2025-05-19', 'Manejo de catéteres venosos centrales.', true);
INSERT INTO public.guia_clinica VALUES (664, 'REUMATOLOGIA', 'IMSS-711-14', 'GRANULOMATOSIS CON POLIANGEÍTIS (ANTES WEGENER)', 'IMSS', '2025-05-19', 'Vasculitis sistémica.', true);
INSERT INTO public.guia_clinica VALUES (665, 'ENFERMERIA', 'IMSS-712-14', 'ENFERMERÍA EN ADMINISTRACIÓN DE MEDICAMENTOS DE ALTO RIESGO', 'IMSS', '2025-05-19', 'Seguridad en medicación crítica.', true);
INSERT INTO public.guia_clinica VALUES (666, 'NUTRICION', 'IMSS-713-14', 'NUTRICIÓN PARENTERAL Y ENTERAL', 'IMSS', '2025-05-19', 'Alimentación intravenosa y digestiva.', true);
INSERT INTO public.guia_clinica VALUES (667, 'ENDOCRINOLOGIA', 'IMSS-715-14', 'HIPERPLASIA SUPRARRENAL CONGÉNITA', 'IMSS', '2025-05-19', 'Trastorno genético de glándulas suprarrenales.', true);
INSERT INTO public.guia_clinica VALUES (668, 'CIRUGIA', 'IMSS-716-14', 'SAFENECTOMÍA', 'IMSS', '2025-05-19', 'Extracción de vena safena.', true);
INSERT INTO public.guia_clinica VALUES (669, 'ESTOMATOLOGIA', 'ISSSTE-059_08', 'MALOCLUSIONES DENTALES', 'ISSSTE', '2025-05-19', 'Alteraciones en mordida.', true);
INSERT INTO public.guia_clinica VALUES (670, 'GASTROENTEROLOGIA', 'IMSS-042_08', 'SÍNDROME DEL COLON IRRITABLE', 'IMSS', '2025-05-19', 'Disfunción motora intestinal.', true);
INSERT INTO public.guia_clinica VALUES (671, 'GINECOLOGIA', 'ISSSTE-124_08', 'PLACENTA PREVIA', 'ISSSTE', '2025-05-19', 'Implantación anormal de placenta.', true);
INSERT INTO public.guia_clinica VALUES (672, 'OFTALMOLOGIA', 'ISSSTE-125_08', 'CATARATA EN PRIMER NIVEL', 'ISSSTE', '2025-05-19', 'Diagnóstico temprano.', true);
INSERT INTO public.guia_clinica VALUES (673, 'OFTALMOLOGIA', 'ISSSTE-126_08', 'CATARATA EN TERCER NIVEL', 'ISSSTE', '2025-05-19', 'Manejo quirúrgico.', true);
INSERT INTO public.guia_clinica VALUES (674, 'OFTALMOLOGIA', 'ISSSTE-127_08', 'ESTRABISMO CONCOMITANTE', 'ISSSTE', '2025-05-19', 'Desviación ocular sin alteración neuromuscular.', true);
INSERT INTO public.guia_clinica VALUES (675, 'OFTALMOLOGIA', 'ISSSTE-128_08', 'ESTRABISMO EN SEGUNDO NIVEL', 'ISSSTE', '2025-05-19', 'Tratamiento ambulatorio.', true);
INSERT INTO public.guia_clinica VALUES (676, 'PEDIATRIA', 'ISSSTE-129_08', 'VARICELA INFANTIL', 'ISSSTE', '2025-05-19', 'Infección vírica exantemática.', true);
INSERT INTO public.guia_clinica VALUES (677, 'PEDIATRIA', 'ISSSTE-130_08', 'DIABETES TIPO 2 EN EDAD PEDIÁTRICA', 'ISSSTE', '2025-05-19', 'Manejo glucémico en menores.', true);
INSERT INTO public.guia_clinica VALUES (678, 'PSIQUIATRIA', 'ISSSTE-131_08', 'DEPRESIÓN EN EL ADULTO MAYOR', 'ISSSTE', '2025-05-19', 'Trastorno afectivo en ancianos.', true);
INSERT INTO public.guia_clinica VALUES (679, 'NEUROLOGIA', 'ISSSTE-132_08', 'ENFERMEDAD VASCULAR CEREBRAL EN MAYORES DE 45 AÑOS', 'ISSSTE', '2025-05-19', 'Accidente cerebrovascular.', true);
INSERT INTO public.guia_clinica VALUES (680, 'HEPATOLOGIA', 'ISSSTE-133_08', 'HEMORRAGIA DIGESTIVA ALTA NO VARICEAL', 'ISSSTE', '2025-05-19', 'Hemorragia gastrointestinal superior.', true);
INSERT INTO public.guia_clinica VALUES (681, 'GERIATRIA', 'ISSSTE-134-08', 'CAÍDAS EN ADULTO MAYOR', 'ISSSTE', '2025-05-19', 'Prevención y evaluación geriátrica.', true);
INSERT INTO public.guia_clinica VALUES (682, 'PEDIATRIA', 'ISSSTE-135_08', 'HIPOTIROIDISMO CONGÉNITO', 'ISSSTE', '2025-05-19', 'Deficiencia tiroidea desde el nacimiento.', true);
INSERT INTO public.guia_clinica VALUES (683, 'PEDIATRIA', 'ISSSTE-136_08', 'TUMORES CEREBRALES INFANTILES', 'ISSSTE', '2025-05-19', 'Neoplasias del sistema nervioso central.', true);
INSERT INTO public.guia_clinica VALUES (684, 'TRAUMATOLOGIA', 'ISSSTE-249-09', 'PARÁLISIS FACIAL', 'ISSSTE', '2025-05-19', 'Parálisis de Bell.', true);
INSERT INTO public.guia_clinica VALUES (686, 'PEDIATRIA', 'ISSSTE-252-12', 'GIARDIASIS', 'ISSSTE', '2025-05-19', 'Infección parasitaria intestinal.', true);
INSERT INTO public.guia_clinica VALUES (687, 'INFECTOLOGIA', 'ISSSTE-253-12', 'FIEBRE TIFOIDEA Y SALMONELOSIS', 'ISSSTE', '2025-05-19', 'Infección bacteriana sistémica.', true);
INSERT INTO public.guia_clinica VALUES (688, 'GASTROENTEROLOGIA', 'ISSSTE-254-12', 'ESOFAGITIS POR REFLUJO', 'ISSSTE', '2025-05-19', 'Inflamación por reflujo gastroesofágico.', true);
INSERT INTO public.guia_clinica VALUES (689, 'TOXICOLOGIA', 'ISSSTE-256-13', 'INTOXICACIÓN ÉTILICA', 'ISSSTE', '2025-05-19', 'Intoxicación alcohólica aguda.', true);
INSERT INTO public.guia_clinica VALUES (690, 'INFECTOLOGIA', 'ISSSTE-306-10', 'SÍNDROME DIARREICO BACTERIANO AGUDO', 'ISSSTE', '2025-05-19', 'Infección intestinal bacteriana.', true);
INSERT INTO public.guia_clinica VALUES (691, 'NEONATOLOGIA', 'ISSSTE-308-13', 'FACTOR SURFACTANTE EN RECIÉN NACIDOS', 'ISSSTE', '2025-05-19', 'Prevención de SDRA neonatal.', true);
INSERT INTO public.guia_clinica VALUES (692, 'EMERGENCIAS', 'ISSSTE-339-08', 'TRIAGE', 'ISSSTE', '2025-05-19', 'Clasificación de emergencias.', true);
INSERT INTO public.guia_clinica VALUES (693, 'NEUROLOGIA', 'ISSSTE-340-10', 'EPENDIMOMA', 'ISSSTE', '2025-05-19', 'Tumor cerebral o medular.', true);
INSERT INTO public.guia_clinica VALUES (694, 'PEDIATRIA', 'ISSSTE-342-10', 'TUMORES RENALES NO WILMS', 'ISSSTE', '2025-05-19', 'Neoplasias renales pediátricas.', true);
INSERT INTO public.guia_clinica VALUES (695, 'GASTROENTEROLOGIA', 'ISSSTE-358-10', 'ISQUEMIA INTESTINAL', 'ISSSTE', '2025-05-19', 'Reducción de flujo sanguíneo intestinal.', true);
INSERT INTO public.guia_clinica VALUES (696, 'PEDIATRIA', 'ISSSTE-359-12', 'OCLUSIÓN INTESTINAL', 'ISSSTE', '2025-05-19', 'Obstrucción mecánica del intestino.', true);
INSERT INTO public.guia_clinica VALUES (697, 'CIRUGIA', 'ISSSTE-549-12', 'ÚLCERA PÉPTICA PERFORADA', 'ISSSTE', '2025-05-19', 'Perforación de úlcera.', true);
INSERT INTO public.guia_clinica VALUES (698, 'CIRUGIA', 'ISSSTE-550-12', 'TUMORES BENIGNOS', 'ISSSTE', '2025-05-19', 'Neoplasias no malignas.', true);
INSERT INTO public.guia_clinica VALUES (699, 'OFTALMOLOGIA', 'ISSSTE-564-13', 'OJO SECO', 'ISSSTE', '2025-05-19', 'Disminución de lágrimas.', true);
INSERT INTO public.guia_clinica VALUES (700, 'OTORRINOLARINGOLOGIA', 'ISSSTE-638-13', 'OTITIS MEDIA', 'ISSSTE', '2025-05-19', 'Inflamación del oído medio.', true);
INSERT INTO public.guia_clinica VALUES (701, 'GINECOLOGIA', 'ISSSTE-658-13', 'CONDILOMA ACUMINADO EN MUJERES', 'ISSSTE', '2025-05-19', 'Lesiones genitales por VPH.', true);
INSERT INTO public.guia_clinica VALUES (702, 'PROCTOLOGIA', 'ISSSTE-660-13', 'CONDILATOMOSIS ANAL', 'ISSSTE', '2025-05-19', 'Infección por virus del papiloma humano.', true);
INSERT INTO public.guia_clinica VALUES (703, 'DERMATOLOGIA', 'ISSSTE-661-13', 'URTICARIA CRÓNICA', 'ISSSTE', '2025-05-19', 'Erupciones recurrentes por alergia.', true);
INSERT INTO public.guia_clinica VALUES (704, 'CIRUGIA', 'ISSSTE-662-13', 'ENFERMEDAD PILONIDAL', 'ISSSTE', '2025-05-19', 'Quistes y fístulas sacrococcígeas.', true);
INSERT INTO public.guia_clinica VALUES (705, 'PROCTOLOGIA', 'ISSSTE-663-13', 'ABSCESO ANAL', 'ISSSTE', '2025-05-19', 'Colección purulenta perirrectal.', true);
INSERT INTO public.guia_clinica VALUES (706, 'EMERGENCIAS', 'ISSSTE-678-13', 'MANEJO PREHOSPITALARIO EN QUEMADURAS', 'ISSSTE', '2025-05-19', 'Valoración inicial de quemados.', true);
INSERT INTO public.guia_clinica VALUES (707, 'TRAUMATOLOGIA', 'ISSSTE-680-13', 'ACCESOS VASCULARES', 'ISSSTE', '2025-05-19', 'Colocación y cuidado de accesos vasculares.', true);
INSERT INTO public.guia_clinica VALUES (708, 'GINECOLOGIA', 'ISSSTE-681-13', 'EMBARAZO ECTÓPICO', 'ISSSTE', '2025-05-19', 'Embarazo fuera del útero.', true);
INSERT INTO public.guia_clinica VALUES (709, 'OFTALMOLOGIA', 'ISSSTE-698-13', 'ENFERMEDAD DE MENIÈRE', 'ISSSTE', '2025-05-19', 'Trastorno vestibular y auditivo.', true);
INSERT INTO public.guia_clinica VALUES (710, 'NEONATOLOGIA', 'ISSSTE-699-13', 'DIAGNÓSTICO, TRATAMIENTO, PREVENCIÓN Y CONTROL DE RN SANO', 'ISSSTE', '2025-05-19', 'Atención integral del recién nacido.', true);
INSERT INTO public.guia_clinica VALUES (711, 'ONCOLOGIA', 'ISSSTE-700-13', 'RECONSTRUCCIÓN DE MAMA', 'ISSSTE', '2025-05-19', 'Post mastectomía.', true);
INSERT INTO public.guia_clinica VALUES (712, 'GASTROENTEROLOGIA', 'ISSSTE_516_11', 'GASTRITIS AGUDA EROSIVA', 'ISSSTE', '2025-05-19', 'Inflamación estomacal con erosión.', true);
INSERT INTO public.guia_clinica VALUES (713, 'ESTOMATOLOGIA', 'ISSSTE_517_11', 'INFECCIONES ODONTOGÉNICAS', 'ISSSTE', '2025-05-19', 'Infecciones bucales.', true);
INSERT INTO public.guia_clinica VALUES (714, 'GINECOLOGIA', 'ISSSTE_526_11', 'EXTRACCIÓN DE CISTO O EXTRAUTERINA', 'ISSSTE', '2025-05-19', 'Manejo quirúrgico.', true);
INSERT INTO public.guia_clinica VALUES (715, 'INFECTOLOGIA', 'ISSSTE_527_11', 'INFECCIÓN EN HERIDA QUIRÚRGICA POST CESÁREA', 'ISSSTE', '2025-05-19', 'Infección posparto.', true);
INSERT INTO public.guia_clinica VALUES (716, 'ONCOLOGIA', 'S-001-08', 'CÁNCER DE MAMA', 'NOM', '2025-05-19', 'Prevención y diagnóstico temprano.', true);
INSERT INTO public.guia_clinica VALUES (717, 'PEDIATRIA', 'S-009-08', 'ASMA EN MENORES DE 18 AÑOS', 'NOM', '2025-05-19', 'Tratamiento y control.', true);
INSERT INTO public.guia_clinica VALUES (718, 'CARDIOLOGIA', 'S-014-08', 'FIBRILACIÓN AURICULAR', 'NOM', '2025-05-19', 'Arritmia auricular más común.', true);
INSERT INTO public.guia_clinica VALUES (719, 'GINECOLOGIA', 'S-019-08', 'CLIMATERIO Y MENOPAUSIA', 'NOM', '2025-05-19', 'Síntomas y manejo hormonal.', true);
INSERT INTO public.guia_clinica VALUES (720, 'GINECOLOGIA', 'S-020-08', 'PREECLAMPSIA EN 2º Y 3º NIVEL', 'NOM', '2025-05-19', 'Hipertensión gestacional con proteinuria.', true);
INSERT INTO public.guia_clinica VALUES (721, 'PEDIATRIA', 'S-027-08', 'ITU NO COMPLICADA EN MENORES DE 18 AÑOS', 'NOM', '2025-05-19', 'Prevención y tratamiento.', true);
INSERT INTO public.guia_clinica VALUES (722, 'TRAUMATOLOGIA', 'S-091-08', 'DISPLASIA DEL DESARROLLO DE LA CADERA', 'NOM', '2025-05-19', 'Malformación congénita.', true);
INSERT INTO public.guia_clinica VALUES (723, 'NEUROLOGIA', 'S-102-08', 'ENFERMEDAD VASCULAR CEREBRAL ISQUÉMICA', 'NOM', '2025-05-19', 'Infarto cerebral.', true);
INSERT INTO public.guia_clinica VALUES (724, 'NEUMOLOGIA', 'S-120-08', 'NEUMONÍA ADQUIRIDA EN LA COMUNIDAD', 'NOM', '2025-05-19', 'Infección pulmonar extrahospitalaria.', true);
INSERT INTO public.guia_clinica VALUES (725, 'GINECOLOGIA', 'S-146-08', 'CÁNCER CERVICOUTERINO', 'NOM', '2025-05-19', 'Tamizaje y diagnóstico.', true);
INSERT INTO public.guia_clinica VALUES (726, 'PEDIATRIA', 'S-156-08', 'ENFERMEDAD DIARREICA AGUDA EN NIÑOS', 'NOM', '2025-05-19', 'Manejo ambulatorio.', true);
INSERT INTO public.guia_clinica VALUES (727, 'GINECOLOGIA', 'S-228-09', 'ENFERMEDAD TROFOBLÁSTICA GESTACIONAL', 'NOM', '2025-05-19', 'Mola hidatiforme y otros.', true);
INSERT INTO public.guia_clinica VALUES (728, 'MEDICINA INTERNA', 'S-384-09', 'INFLUENZA ESTACIONAL', 'NOM', '2025-05-19', 'Prevención y manejo gripal.', true);
INSERT INTO public.guia_clinica VALUES (729, 'UROLOGIA', 'SEDENA-300-10', 'ESTENOSIS URETEROPIÉLICA', 'SEDENA', '2025-05-19', 'Obstrucción renal congénita.', true);
INSERT INTO public.guia_clinica VALUES (730, 'UROLOGIA', 'SEDENA-309-10', 'EVALUACIÓN DE REFLUJO VESICOURETERAL', 'SEDENA', '2025-05-19', 'Reflujo vesical.', true);
INSERT INTO public.guia_clinica VALUES (731, 'UROLOGIA', 'SEDENA-311-10', 'ABORDAJE QUIRÚRGICO EN HIPOSPADIAS', 'SEDENA', '2025-05-19', 'Corrección quirúrgica.', true);
INSERT INTO public.guia_clinica VALUES (732, 'CIRUGIA', 'SEDENA-445-09', 'CIRUGÍA DE CONTROL DE DAÑO', 'SEDENA', '2025-05-19', 'Emergencias quirúrgicas graves.', true);
INSERT INTO public.guia_clinica VALUES (733, 'GINECOLOGIA', 'SEDENA-446-09', 'RUPTURA PREMATURA DE MEMBRANAS', 'SEDENA', '2025-05-19', 'ROM antes del trabajo de parto.', true);
INSERT INTO public.guia_clinica VALUES (734, 'OFTALMOLOGIA', 'SEDENA-545-13', 'AMETROPIAS', 'SEDENA', '2025-05-19', 'Miopía, hipermetropía y astigmatismo.', true);
INSERT INTO public.guia_clinica VALUES (735, 'PEDIATRIA', 'SEDENA-546-13', 'ATRESIA BILIAR', 'SEDENA', '2025-05-19', 'Obstrucción congénita del flujo biliar.', true);
INSERT INTO public.guia_clinica VALUES (736, 'MEDICINA INTERNA', 'SEMAR-571-12', 'GOLPE DE CALOR', 'SEMAR', '2025-05-19', 'Hipertermia ambiental.', true);
INSERT INTO public.guia_clinica VALUES (737, 'PEDIATRIA', 'SS-002-08', 'TRAUMATISMO CRANEOENCEFÁLICO EN NIÑOS', 'ISSSTE', '2025-05-19', 'Lesión cerebral traumática.', true);
INSERT INTO public.guia_clinica VALUES (738, 'PROCTOLOGIA', 'SS-003-08', 'ENFERMEDAD HEMORROIDAL', 'ISSSTE', '2025-05-19', 'Tratamiento médico y quirúrgico.', true);
INSERT INTO public.guia_clinica VALUES (739, 'UROLOGIA', 'SS-004-08', 'CÁNCER DE TESTÍCULO', 'ISSSTE', '2025-05-19', 'Tumor maligno testicular.', true);
INSERT INTO public.guia_clinica VALUES (740, 'MEDICINA INTERNA', 'SS-005-08', 'DIAGNÓSTICO Y TRATAMIENTO DE PIE DIABÉTICO', 'ISSSTE', '2025-05-19', 'Prevención de amputaciones.', true);
INSERT INTO public.guia_clinica VALUES (741, 'INFECTOLOGIA', 'SS-006-08', 'ITU POR CHLAMYDIA TRACHOMATIS', 'ISSSTE', '2025-05-19', 'Prevención y tratamiento.', true);
INSERT INTO public.guia_clinica VALUES (742, 'TRAUMATOLOGIA', 'SS-008-08', 'ESGUINCE CERVICAL', 'ISSSTE', '2025-05-19', 'Lesión ligamentosa cuello.', true);
INSERT INTO public.guia_clinica VALUES (743, 'NEUROLOGIA', 'SS-010-08', 'DOLOR POR NEUROPATÍA PERIFÉRICA DIABÉTICA', 'ISSSTE', '2025-05-19', 'Neuropatía secundaria a diabetes.', true);
INSERT INTO public.guia_clinica VALUES (744, 'GASTROENTEROLOGIA', 'SS-011-08', 'PANCREATITIS AGUDA', 'ISSSTE', '2025-05-19', 'Inflamación pancreática.', true);
INSERT INTO public.guia_clinica VALUES (745, 'PEDIATRIA', 'SS-013-08', 'REFLUJO GASTROESOFÁGICO PEDIÁTRICO', 'ISSSTE', '2025-05-19', 'Reflujo en niños.', true);
INSERT INTO public.guia_clinica VALUES (746, 'CIRUGIA', 'SS-015-08', 'HERNIAS INGUINALES', 'ISSSTE', '2025-05-19', 'Protrusión abdominal.', true);
INSERT INTO public.guia_clinica VALUES (747, 'NEUROLOGIA', 'SS-016-08', 'LESIÓN CRANEAL', 'ISSSTE', '2025-05-19', 'Conmoción y trauma craneal.', true);
INSERT INTO public.guia_clinica VALUES (748, 'TRAUMATOLOGIA', 'SS-017-08', 'FRACTURA DE CADERA', 'ISSSTE', '2025-05-19', 'Fractura de cadera.', true);
INSERT INTO public.guia_clinica VALUES (749, 'DERMATOLOGIA', 'SS-018-08', 'PITIRIASIS VERSICOLOR', 'ISSSTE', '2025-05-19', 'Micosis superficial.', true);
INSERT INTO public.guia_clinica VALUES (750, 'UROLOGIA', 'SS-021-08', 'CÁNCER DE PRÓSTATA', 'ISSSTE', '2025-05-19', 'Neoplasia prostática.', true);
INSERT INTO public.guia_clinica VALUES (751, 'PULMONAR', 'SS-022-08', 'CÁNCER DE PULMÓN', 'ISSSTE', '2025-05-19', 'Carcinoma pulmonar.', true);
INSERT INTO public.guia_clinica VALUES (752, 'PSICOLOGIA', 'SS-023-08', 'PREVENCIÓN DE ADICCIONES', 'ISSSTE', '2025-05-19', 'Educación sobre consumo de sustancias.', true);
INSERT INTO public.guia_clinica VALUES (753, 'ESTOMATOLOGIA', 'SS-024-08', 'PREVENCION DE CARIES DENTAL', 'ISSSTE', '2025-05-19', 'Estrategias preventivas.', true);
INSERT INTO public.guia_clinica VALUES (754, 'NUTRICION', 'SS-025-08', 'SOBREPESO Y OBESIDAD EN NIÑOS Y ADOLESCENTES', 'ISSSTE', '2025-05-19', 'Prevención y tratamiento.', true);
INSERT INTO public.guia_clinica VALUES (755, 'GINECOLOGIA', 'SS-026-08', 'AMENAZA DE ABORTO', 'ISSSTE', '2025-05-19', 'Trabajo de parto amenazante.', true);
INSERT INTO public.guia_clinica VALUES (756, 'TRAUMATOLOGIA', 'SS-053-08', 'OSTEOARTROSIS DE CADERA Y RODILLA', 'ISSSTE', '2025-05-19', 'Degeneración articular.', true);
INSERT INTO public.guia_clinica VALUES (757, 'OFTALMOLOGIA', 'SS-055-08', 'HIPOACUSIA EN RECÉN NACIDOS', 'ISSSTE', '2025-05-19', 'Detección auditiva.', true);
INSERT INTO public.guia_clinica VALUES (758, 'PEDIATRIA', 'SS-060-08', 'MASAS ABDOMINALES MALIGNAS EN INFANCIA', 'ISSSTE', '2025-05-19', 'Tumores abdominales en niños.', true);
INSERT INTO public.guia_clinica VALUES (759, 'HEMATOLOGIA', 'SS-061-08', 'LEUCEMIA AGUDA EN LA INFANCIA', 'ISSSTE', '2025-05-19', 'Cáncer hematológico en niños.', true);
INSERT INTO public.guia_clinica VALUES (760, 'NEUROLOGIA', 'SS-064-08', 'SÍNDROME DE GUILLAIN-BARRÉ EN PRIMER Y SEGUNDO NIVEL', 'ISSSTE', '2025-05-19', 'Neuropatía ascendente.', true);
INSERT INTO public.guia_clinica VALUES (761, 'VIH/SIDA', 'SS-067-08', 'REFERENCIA OPORTUNA DE VIH', 'ISSSTE', '2025-05-19', 'Detección y derivación.', true);
INSERT INTO public.guia_clinica VALUES (762, 'EMERGENCIAS', 'SS-090-08', 'QUEMADURAS EN MENORES DE 18 AÑOS', 'ISSSTE', '2025-05-19', 'Manejo inicial.', true);
INSERT INTO public.guia_clinica VALUES (763, 'NEUROLOGIA', 'SS-092-08', 'ESTADO EPILÉPTICO EN NIÑOS', 'ISSSTE', '2025-05-19', 'Convulsiones prolongadas.', true);
INSERT INTO public.guia_clinica VALUES (764, 'ENDOCRINOLOGIA', 'SS-093-08', 'METABOLISMO DE LA DIABETES TIPO 2', 'ISSSTE', '2025-05-19', 'Control glucémico.', true);
INSERT INTO public.guia_clinica VALUES (765, 'HEPATOLOGIA', 'SS-096-08', 'ASCITIS POR CIRROSIS', 'ISSSTE', '2025-05-19', 'Acumulación de líquido peritoneal.', true);
INSERT INTO public.guia_clinica VALUES (766, 'TOXICOLOGIA', 'SS-098-08', 'SÍNDROME DE ABSTINENCIA ALCOHÓLICA EN ADULTO', 'ISSSTE', '2025-05-19', 'Tratamiento de síndrome de abstinencia.', true);
INSERT INTO public.guia_clinica VALUES (767, 'PULMONAR', 'SS-099-08', 'NEUMOTÓRAX ESPONTÁNEO', 'ISSSTE', '2025-05-19', 'Colapso pulmonar.', true);
INSERT INTO public.guia_clinica VALUES (768, 'TOXICOLOGIA', 'SS-100-08', 'INTOXICACIÓN AGUDA POR AGROQUÍMICOS', 'ISSSTE', '2025-05-19', 'Manejo de intoxicación.', true);
INSERT INTO public.guia_clinica VALUES (769, 'GINECOLOGIA', 'SS-103-08', 'HEMORRAGIA POSTPARTO', 'ISSSTE', '2025-05-19', 'Sangrado después del parto.', true);
INSERT INTO public.guia_clinica VALUES (770, 'GASTROENTEROLOGIA', 'SS-106-08', 'DIARREA AGUDA EN ADULTOS', 'ISSSTE', '2025-05-19', 'Trastorno digestivo agudo.', true);
INSERT INTO public.guia_clinica VALUES (771, 'INFECTOLOGIA', 'SS-107-08', 'TUBERCULOSIS PULMONAR EN MAYORES DE 18 AÑOS', 'ISSSTE', '2025-05-19', 'Infección pulmonar por Mycobacterium tuberculosis.', true);
INSERT INTO public.guia_clinica VALUES (772, 'PSICOLOGIA', 'SS-108-08', 'TABAQUISMO', 'ISSSTE', '2025-05-19', 'Programa de deshabituación.', true);
INSERT INTO public.guia_clinica VALUES (773, 'TOXICOLOGIA', 'SS-110-08', 'INTOXICACIÓN EN PEDIATRÍA', 'ISSSTE', '2025-05-19', 'Manejo de tóxicos en niños.', true);
INSERT INTO public.guia_clinica VALUES (774, 'INFECTOLOGIA', 'SS-111-08', 'OSTEOMIELITIS HEMATOGENA', 'ISSSTE', '2025-05-19', 'Infección ósea.', true);
INSERT INTO public.guia_clinica VALUES (775, 'PSIQUIATRIA', 'SS-113-08', 'ANOREXIA Y BULIMIA', 'ISSSTE', '2025-05-19', 'Trastornos alimenticios.', true);
INSERT INTO public.guia_clinica VALUES (776, 'PEDIATRIA', 'SS-116-08', 'FIEBRE SIN INFECCIÓN EN MENORES DE 3 MESES', 'ISSSTE', '2025-05-19', 'Fiebre no localizada.', true);
INSERT INTO public.guia_clinica VALUES (777, 'PSIQUIATRIA', 'SS-117-08', 'APNEA OBSTRUCTIVA DEL SUEÑO', 'ISSSTE', '2025-05-19', 'Trastorno respiratorio nocturno.', true);
INSERT INTO public.guia_clinica VALUES (778, 'GINECOLOGIA', 'SS-118-08', 'PARTO PRETÉRMINO', 'ISSSTE', '2025-05-19', 'Parto antes de las 37 semanas.', true);
INSERT INTO public.guia_clinica VALUES (779, 'NUTRICION', 'SS-119-08', 'DESNUTRICIÓN EN MENORES DE 5 AÑOS', 'ISSSTE', '2025-05-19', 'Retraso del crecimiento.', true);
INSERT INTO public.guia_clinica VALUES (780, 'ENFERMERIA', 'SS-121-08', 'NUTRICIÓN PARENTERAL EN PEDIATRÍA', 'ISSSTE', '2025-05-19', 'Nutrición intravenosa en menores.', true);
INSERT INTO public.guia_clinica VALUES (781, 'PSIQUIATRIA', 'SS-122-08', 'ENURESIS NO ORGÁNICA EN PEDIATRÍA', 'ISSSTE', '2025-05-19', 'Micción involuntaria.', true);
INSERT INTO public.guia_clinica VALUES (782, 'CARDIOLOGIA', 'SS-147_08', 'RIESGO DE ENFERMEDAD CARDIOVASCULAR EN LA MUJER', 'ISSSTE', '2025-05-19', 'Prevención cardiovascular.', true);
INSERT INTO public.guia_clinica VALUES (783, 'EMERGENCIAS', 'SS-148_08', 'INTOXICACIÓN POR ESCORPIÓN O ALACRÁN', 'ISSSTE', '2025-05-19', 'Tratamiento sintomático.', true);
INSERT INTO public.guia_clinica VALUES (784, 'PEDIATRIA', 'SS-149_08', 'FIEBRE REUMÁTICA', 'ISSSTE', '2025-05-19', 'Secuela postestreptocócica.', true);
INSERT INTO public.guia_clinica VALUES (785, 'GASTROENTEROLOGIA', 'SS-150_08', 'ÚLCERA PEPTICA EN ADULTOS', 'ISSSTE', '2025-05-19', 'Lesión mucosa gastroduodenal.', true);
INSERT INTO public.guia_clinica VALUES (786, 'INFECTOLOGIA', 'SS-151_08', 'DENGUE', 'ISSSTE', '2025-05-19', 'Infección viral por mosquito.', true);


--
-- Data for Name: historia_clinica; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.historia_clinica VALUES (1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (2, 4, 'Abuelo paterno: hipertensión arterial, falleció a los 78 años por infarto agudo al miocardio. Abuela paterna: diabetes mellitus tipo 2, viva de 82 años. Padre: hipertensión arterial controlada con medicamento. Madre: sana de 52 años. Sin antecedentes de cáncer, epilepsia o enfermedades psiquiátricas en la familia.', 'Baño diario, lavado dental 3 veces al día, cambio de ropa interior diario, lavado de manos frecuente.', 'Tres comidas principales y dos colaciones, dieta variada incluyendo frutas y verduras, consume aproximadamente 2 litros de agua al día, ocasionalmente comida rápida los fines de semana.', 'Ejercicio aeróbico 3 veces por semana (correr 30 minutos), gimnasio 2 veces por semana, actividades recreativas los fines de semana.', 'Estudiante', NULL, 'Niega tabaquismo, alcoholismo social ocasional (1-2 cervezas los fines de semana), niega uso de drogas ilegales.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Paciente masculino de 25 años que acude por primera vez para establecimiento de expediente clínico y revisión médica general. Refiere encontrarse asintomático, sin molestias actuales. Solicita revisión médica preventiva ya que no ha acudido a consulta médica en los últimos 2 años. Niega fiebre, dolor, náuseas, vómito, diarrea o cualquier sintomatología.', 'Nega astenia, adinamia, hiporexia, pérdida de peso, fiebre, diaforesis nocturna o cualquier síntoma constitucional.', 'Cardiovascular: niega dolor precordial, disnea, ortopnea, palpitaciones. Respiratorio: niega tos, expectoración, disnea de esfuerzo. Digestivo: niega náuseas, vómito, diarrea, estreñimiento, dolor abdominal. Genitourinario: niega disuria, hematuria, urgencia urinaria. Neurológico: niega cefalea, mareo, convulsiones, alteraciones visuales.', 'Paciente masculino de edad aparente a la cronológica, consiente, orientado en tiempo, lugar y persona, cooperador al interrogatorio y exploración física. Posición libremente escogida, marcha normal, constitución normolínea. Buen estado general de salud.', 'Normocéfala, sin deformidades, cabello de implantación normal, fácies no característica. Ojos simétricos, pupilas isocóricas normorreflécticas, conjuntivas normocrómicas, escleras anictéricas. Nariz sin secreciones, fosas nasales permeables. Boca con dentadura completa en buen estado, mucosas orales húmedas y normocrómicas.', 'Cilíndrico, simétrico, sin adenopatías palpables, tiroides no palpable, pulsos carotídeos presentes y simétricos, no se auscultan soplos.', 'Simétrico, expansibilidad normal, frecuencia respiratoria 16 rpm, murmullo vesicular presente en ambos campos pulmonares, no se auscultan estertores ni sibilancias. Ruidos cardiacos rítmicos de buen tono e intensidad, no se auscultan soplos.', 'Plano, blando, depresible, no doloroso a la palpación, peristalsis presente, no se palpan visceromegalias ni tumoraciones, no hay datos de irritación peritoneal.', NULL, 'Simétricas, íntegras, sin edema, pulsos presentes y simétricos, llenado capilar menor a 2 segundos, fuerza muscular 5/5 en las cuatro extremidades.', NULL, 'Adulto joven sano en revisión médica preventiva. Sin patología aparente al momento de la consulta.', NULL, 'Laboratorios de rutina: biometría hemática completa, química sanguínea de 27 elementos, perfil de lípidos, examen general de orina. Radiografía de tórax PA. Electrocardiograma de reposo.', 'Continuar con medidas preventivas de salud, mantener actividad física regular, dieta equilibrada, hidratación adecuada. Control médico anual para seguimiento preventivo.', 'Excelente para la vida, función y restitución ad integrum. Paciente joven sin factores de riesgo aparentes.', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (3, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (4, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (5, 19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (6, 22, 'Madre de 45 años con diabetes mellitus tipo 2 e hipertensión arterial, controlada con metformina y enalapril. Padre de 48 años aparentemente sano. Abuela materna finada por infarto agudo al miocardio a los 68 años. Abuelo materno con antecedente de diabetes mellitus tipo 2. No refiere antecedentes de cáncer, tuberculosis o enfermedades mentales en la familia.', 'Baño diario con agua y jabón, cambio de ropa interior diario, cepillado dental 2 veces al día, lavado de manos frecuente. Refiere buena higiene personal en general.', 'Desayuno: cereal con leche o fruta, ocasionalmente pan dulce. Comida: guisados caseros con tortilla, verduras, pollo o res. Cena: quesadillas, sopa o fruta. Consume 2-3 litros de agua al día. Ocasionalmente consume comida rápida los fines de semana.', 'Camina 30 minutos diarios para ir a la universidad. Practica yoga 2 veces por semana en casa. Ocasionalmente baila los fines de semana. No practica deportes de manera regular.', 'Comerciante', NULL, 'Niega tabaquismo. Consumo social de alcohol esporádico (1-2 copas en celebraciones). Niega consumo de drogas ilícitas. Consume 1-2 tazas de café al día.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Paciente femenina de 19 años que acude por cuadro de 3 días de evolución caracterizado por dolor abdominal de inicio gradual, localizado en fosa ilíaca derecha, de intensidad 7/10, tipo punzante, que se exacerba con el movimiento y mejora con el reposo. Se acompaña de náuseas, vómito en 2 ocasiones de contenido alimentario, fiebre no cuantificada y disminución del apetito. Niega alteraciones urinarias o intestinales.', 'Refiere fiebre no cuantificada desde hace 2 días, escalofríos ocasionales, astenia, adinamia y hiporexia. Niega pérdida de peso, sudoración nocturna o cambios en el estado de ánimo.', 'Cardiovascular: sin síntomas. Respiratorio: sin síntomas. Digestivo: náuseas, vómito y dolor abdominal ya descrito. Genitourinario: sin alteraciones. Neurológico: sin síntomas. Tegumentario: sin cambios.', 'Paciente femenina de edad aparente igual a la cronológica, consciente, orientada en tiempo, lugar y persona. Cooperadora para la exploración. Fascie álgida, posición antiálgica en decúbito dorsal con flexión de cadera y rodilla derechas. Marcha claudicante por dolor.', 'Normocéfala, cabello de implantación normal, sin lesiones aparentes. Pupilas isocóricas, normorreflécticas, conjuntivas rosadas, escleras blancas. Narinas permeables, sin secreciones. Mucosa oral hidratada, dentadura completa en buen estado.', 'Cilíndrico, simétrico, sin adenopatías palpables, tiroides no palpable, sin ingurgitación yugular, pulsos carotídeos simétricos y sincrónicos.', 'Simétrico, expansibilidad conservada, sin tirajes. Ruidos respiratorios vesiculares sin agregados. Ruidos cardíacos rítmicos, de buen tono e intensidad, sin soplos audibles.', 'Plano, peristalsis disminuida, dolor a la palpación superficial y profunda en fosa ilíaca derecha, signo de McBurney positivo, signo de Rovsing positivo, signo del psoas positivo. Sin visceromegalias palpables.', NULL, 'Simétricas, sin edema, pulsos distales presentes y simétricos, llenado capilar menor a 2 segundos, fuerza y sensibilidad conservadas.', NULL, 'Apendicitis aguda. Diagnóstico diferencial: quiste ovárico complicado, enfermedad pélvica inflamatoria, gastroenteritis aguda.', 10, 'Biometría hemática completa, química sanguínea básica, examen general de orina, ultrasonido abdominal, tomografía computarizada de abdomen y pelvis con contraste oral e intravenoso.', 'Ayuno, canalización con solución Hartmann 1000 ml IV a pasar en 8 horas, ranitidina 50 mg IV cada 12 horas, metamizol 500 mg IV cada 8 horas por razón necesaria para dolor, interconsulta a cirugía general para valoración quirúrgica.', 'Bueno para la vida y función con manejo quirúrgico oportuno. Reservado en caso de complicaciones como perforación o peritonitis.', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (7, 23, 'Madre de 45 años con diabetes mellitus tipo 2 e hipertensión arterial, controlada con metformina y enalapril. Padre de 48 años aparentemente sano. Abuela materna finada por infarto agudo al miocardio a los 68 años. Abuelo materno con antecedente de diabetes mellitus tipo 2. No refiere antecedentes de cáncer, tuberculosis o enfermedades mentales en la familia.', 'Baño diario con agua y jabón, cambio de ropa interior diario, cepillado dental 2 veces al día, lavado de manos frecuente. Refiere buena higiene personal en general.', 'Desayuno: cereal con leche o fruta, ocasionalmente pan dulce. Comida: guisados caseros con tortilla, verduras, pollo o res. Cena: quesadillas, sopa o fruta. Consume 2-3 litros de agua al día. Ocasionalmente consume comida rápida los fines de semana.', 'Camina 30 minutos diarios para ir a la universidad. Practica yoga 2 veces por semana en casa. Ocasionalmente baila los fines de semana. No practica deportes de manera regular.', 'Comerciante', NULL, 'Niega tabaquismo. Consumo social de alcohol esporádico (1-2 copas en celebraciones). Niega consumo de drogas ilícitas. Consume 1-2 tazas de café al día.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Paciente femenina de 19 años que acude por cuadro de 3 días de evolución caracterizado por dolor abdominal de inicio gradual, localizado en fosa ilíaca derecha, de intensidad 7/10, tipo punzante, que se exacerba con el movimiento y mejora con el reposo. Se acompaña de náuseas, vómito en 2 ocasiones de contenido alimentario, fiebre no cuantificada y disminución del apetito. Niega alteraciones urinarias o intestinales.', 'Refiere fiebre no cuantificada desde hace 2 días, escalofríos ocasionales, astenia, adinamia y hiporexia. Niega pérdida de peso, sudoración nocturna o cambios en el estado de ánimo.', 'Cardiovascular: sin síntomas. Respiratorio: sin síntomas. Digestivo: náuseas, vómito y dolor abdominal ya descrito. Genitourinario: sin alteraciones. Neurológico: sin síntomas. Tegumentario: sin cambios.', 'Paciente femenina de edad aparente igual a la cronológica, consciente, orientada en tiempo, lugar y persona. Cooperadora para la exploración. Fascie álgida, posición antiálgica en decúbito dorsal con flexión de cadera y rodilla derechas. Marcha claudicante por dolor.', 'Normocéfala, cabello de implantación normal, sin lesiones aparentes. Pupilas isocóricas, normorreflécticas, conjuntivas rosadas, escleras blancas. Narinas permeables, sin secreciones. Mucosa oral hidratada, dentadura completa en buen estado.', 'Cilíndrico, simétrico, sin adenopatías palpables, tiroides no palpable, sin ingurgitación yugular, pulsos carotídeos simétricos y sincrónicos.', 'Simétrico, expansibilidad conservada, sin tirajes. Ruidos respiratorios vesiculares sin agregados. Ruidos cardíacos rítmicos, de buen tono e intensidad, sin soplos audibles.', 'Plano, peristalsis disminuida, dolor a la palpación superficial y profunda en fosa ilíaca derecha, signo de McBurney positivo, signo de Rovsing positivo, signo del psoas positivo. Sin visceromegalias palpables.', NULL, 'Simétricas, sin edema, pulsos distales presentes y simétricos, llenado capilar menor a 2 segundos, fuerza y sensibilidad conservadas.', NULL, 'Apendicitis aguda. Diagnóstico diferencial: quiste ovárico complicado, enfermedad pélvica inflamatoria, gastroenteritis aguda.', 14, 'Ayuno, canalización con solución Hartmann 1000 ml IV a pasar en 8 horas, ranitidina 50 mg IV cada 12 horas, metamizol 500 mg IV cada 8 horas por razón necesaria para dolor, interconsulta a cirugía general para valoración quirúrgica.', 'Ayuno, canalización con solución Hartmann 1000 ml IV a pasar en 8 horas, ranitidina 50 mg IV cada 12 horas, metamizol 500 mg IV cada 8 horas por razón necesaria para dolor, interconsulta a cirugía general para valoración quirúrgica.', 'Bueno para la vida y función con manejo quirúrgico oportuno. Reservado en caso de complicaciones como perforación o peritonitis.', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (8, 24, 'hokla', 'hola', 'Hábitos Alimenticios', 'Actividad Física', 'Comerciante', NULL, 'Toxicomanías', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Padecimiento Actual *', 'Síntomas Generales', 'Aparatos y Sistemas', 'Exploración General *', 'Cabeza', 'Cuello', 'Tórax', 'Abdomen', NULL, 'Extremidades', NULL, 'Impresión Diagnóstica *', 15, 'Plan Diagnóstico', 'Plan Terapéutico *', 'Pronóstico', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (16, 50, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Lactante', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 15, 'dfdsfsdytryrty', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (9, 25, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Comerciante', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 18, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (10, 26, 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'Comerciante', NULL, 'AAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAA', 14, 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (11, 27, 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'Comerciante', NULL, 'AAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAA', 15, 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (12, 29, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Lactante', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 15, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (13, 40, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Lactante', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 15, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (14, 44, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Lactante', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 15, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (15, 48, 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'Lactante', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 18, 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (17, 53, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Lactante', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 15, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (18, 54, 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Comerciante', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', NULL, 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', NULL, 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 15, 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'Lorem ipsum dolor sit amet consectetur adipiscing elit ridiculus, purus dictumst sagittis sodales mollis sem facilisis felis lectus, taciti pretium per dictum posuere molestie tempor. Senectus morbi odio nec penatibus rhoncus gravida sed venenatis nascetur, litora viverra fusce condimentum commodo porttitor fringilla fames sodales, non quam lacinia magnis class libero ad cum. Bibendum pellentesque aliquam maecenas enim ultrices feugiat gravida praesent ultricies, habitasse malesuada montes condimentum interdum neque elementum nam vivamus, rhoncus magnis inceptos sagittis pulvinar congue a commodo.

Venenatis aliquet neque est eu commodo placerat inceptos montes, dui nullam turpis nunc ornare egestas torquent. Arcu auctor conubia tortor ligula nullam tempus sem tellus feugiat, ultricies scelerisque litora himenaeos ante congue massa donec, odio lectus primis aliquam vitae vestibulum phasellus rhoncus. Lacinia arcu netus platea elementum ante nulla purus donec maecenas vulputate commodo non, viverra ad nisi inceptos malesuada posuere phasellus porttitor torquent est libero.', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (19, 55, 'AAAAAAAA', 'AAAAA', 'AAAAAAAA', 'AAAAAAA', 'Comerciante', 'AAAAAAA', 'AAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', NULL, 'AAAAAAA', NULL, 'AAAAAAA', 14, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (20, 56, 'AAAAAAAA', 'AAAAAAAA', 'AAAAAAAA', 'AAAAAAAA', 'Comerciante', 'AAAAAAAA', 'AAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAA', 'AAAAAAAA', 'AAAAAAAA', 'AAAAAAAA', 'AAAAAAAA', 'AAAAAAAA', 'AAAAAAAA', 'AAAAAAAA', NULL, 'AAAAAAAA', NULL, 'AAAAAAAA', 15, 'AAAAAAAA', 'AAAAAAAA', 'AAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (21, 57, 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'Comerciante', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAA', 10, 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (22, 58, 'Padre: Diabetes mellitus tipo 2 a los 55 años, hipertensión arterial. Madre: Hipertensión arterial, dislipidemia. Hermano mayor: Sano. Abuelos paternos: Diabetes e infarto al miocardio. Abuelos maternos: Hipertensión y accidente cerebrovascular.', 'Baño diario, aseo dental 2 veces al día, cambio de ropa diario, lavado de manos frecuente.', '3 comidas principales y 2 colaciones. Dieta rica en carbohidratos, consumo moderado de verduras, bajo consumo de frutas. Ingesta de agua 1.5 litros/día. Ocasionalmente comida rápida.', 'Sedentario. Trabajo de oficina 8 horas diarias. Camina ocasionalmente los fines de semana. No realiza ejercicio regular.', 'Comerciante', 'Casa propia de material noble, 3 habitaciones, cuenta con servicios básicos completos (agua, luz, drenaje). Ventilación e iluminación adecuadas.', 'Tabaquismo: 10 cigarrillos/día desde los 20 años. Alcoholismo social: 2-3 cervezas los fines de semana. Niega consumo de drogas.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Paciente masculino de 45 años que inicia hace 3 días con dolor torácico opresivo retroesternal de intensidad 7/10, irradiado a brazo izquierdo, acompañado de disnea de medianos esfuerzos, diaforesis y náuseas. Los síntomas se presentan en reposo y aumentan con el esfuerzo físico mínimo.', 'Diaforesis, náuseas ocasionales, sensación de fatiga, sin fiebre ni pérdida de peso.', 'Cardiovascular: Dolor precordial, disnea. Respiratorio: Sin tos ni expectoración. Digestivo: Náuseas ocasionales. Genitourinario: Sin alteraciones. Neurológico: Sin cefalea ni mareos.', 'Paciente masculino de edad aparente a la cronológica, consciente, orientado, cooperador, con facies de ansiedad, posición semifowler preferida, palidez tegumentaria leve, diaforesis presente.', 'Normocéfalo, pupilas isocóricas reactivas a la luz, conjuntivas pálidas, mucosa oral hidratada.', 'Normocéfalo, pupilas isocóricas reactivas a la luz, conjuntivas pálidas, mucosa oral hidratada.', 'Simétrico, expansibilidad conservada. Campos pulmonares bien ventilados, sin estertores. Ruidos cardíacos rítmicos, sin soplos audibles.', 'Blando, depresible, no doloroso, ruidos intestinales presentes, sin visceromegalias.', NULL, 'Sin deformidades, movilidad conservada, sin dolor a la palpación.', NULL, '1. Síndrome coronario agudo sin elevación del ST
2. Hipertensión arterial sistémica controlada
3. Sobrepeso
4. Tabaquismo crónico', 11, 'Electrocardiograma de 12 derivaciones, enzimas cardíacas (troponinas, CK-MB), biometría hemática completa, química sanguínea, radiografía de tórax PA y lateral.', '1. Reposo absoluto en cama
2. Oxígeno por puntas nasales 2-3 L/min
3. Ácido acetilsalicílico 300mg dosis de carga, luego 100mg/día
4. Clopidogrel 600mg dosis de carga, luego 75mg/día
5. Atorvastatina 80mg/día
6. Monitoreo continuo', 'Reservado a evolución clínica y resultados de estudios complementarios. Favorable con tratamiento oportuno y control de factores de riesgo cardiovascular.', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (23, 59, 'AAAAAAAAAAAAAAAAA Antecedentes Heredo-Familiares *', 'AAAAAAAAAAAAAAAAAHábitos Higiénicos', 'AAAAAAAAAAAAAAAAAHábitos Alimenticios', 'AAAAAAAAAAAAAAAAAActividad Física', 'Estudiante', 'AAAAAAAAAAAAAAAAAVivienda', 'AAAAAAAAAAAAAAAAAToxicomanías', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAPadecimiento Actual *', 'AAAAAAAAAAAAAAAAASíntomas Generales', 'AAAAAAAAAAAAAAAAAAparatos y Sistemas', 'AAAAAAAAAAAAAAAAAExploración General *', 'AAAAAAAAAAAAAAAAACabeza', 'AAAAAAAAAAAAAAAAACuello', 'AAAAAAAAAAAAAAAAATórax', 'AAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (24, 60, 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'Estudiante', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (25, 62, 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', 'Estudiante', 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa1', 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaa', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (26, 63, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'Lactante', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (27, 67, 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'Comerciante', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (28, 68, 'aaaaaaa', 'v', 'a', 'a', 'Comerciante', 'a', 'a', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', NULL, 'a', NULL, 'a', NULL, 'a', 'a', 'a', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (29, 73, 'aMadre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Comerciante', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', NULL, 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', NULL, 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', NULL, 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'Madre con diabetes mellitus tipo 2 e hipertensión arterial. Padre con antecedente de infarto agudo al miocardio a los 60 años. Hermano con obesidad grado II.', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (30, 75, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (31, 76, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (32, 111, 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'Panadero', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'aaAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'aaAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'aaAAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (33, 112, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'Panadero', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (34, 114, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, 'Panadero', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (35, 134, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (36, 138, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (37, 140, 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'Estudiante', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', NULL, 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', NULL, 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', NULL, 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (38, 141, 'abcdabcedabcdabcedabcdabced', 'abcdabcedabcdabcedabcdabced', 'abcdabcedabcdabcedabcdabced', 'abcdabcedabcdabcedabcdabced', 'Estudiante', 'abcdabcedabcdabcedabcdabced', 'abcdabcedabcdabcedabcdabced', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'abcdabcedabcdabcedabcdabced', 'abcdabcedabcdabcedabcdabced', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'abcdabcedabcdabcedabcdabced', 'abcdabcedabcdabcedabcdabced', 'abcdabcedabcdabcedabcdabced', 'abcdabcedabcdabcedabcdabced', 'abcdabcedabcdabcedabcdabcedabcdabcedabcdabcedabcdabced', NULL, 'abcdabcedabcdabcedabcdabced', NULL, 'abcdabcedabcdabcedabcabcdabcedabcdabcedabcdabced', NULL, 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'abcdabcedabcdabcedabcdabced', 'ABCDABCDABCDABCDABCDfdgABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'general', NULL, NULL);
INSERT INTO public.historia_clinica VALUES (39, 142, 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'Estudiante', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', NULL, 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', NULL, 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', NULL, 'ABCDABCDABCDABCDABCDABfdgCDABCDABCDABCD', 'ABCDEABCDEABCDEABCDEABCDEABCDEABCDE', 'ABCDABCDABCDABCDABfgCDfdgABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD', 'general', NULL, NULL);


--
-- Data for Name: inmunizaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: internamiento; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.medicamento VALUES (1, 'MED-001', 'Paracetamol', 'Tableta', '500 mg', 'Analgésicos y Antipiréticos', true);
INSERT INTO public.medicamento VALUES (2, 'MED-002', 'Ibuprofeno', 'Tableta', '400 mg', 'Antiinflamatorios no esteroideos', true);
INSERT INTO public.medicamento VALUES (3, 'MED-003', 'Naproxeno', 'Tableta', '250 mg', 'Antiinflamatorios no esteroideos', true);
INSERT INTO public.medicamento VALUES (4, 'MED-004', 'Diclofenaco', 'Tableta', '50 mg', 'Antiinflamatorios no esteroideos', true);
INSERT INTO public.medicamento VALUES (5, 'MED-005', 'Metamizol', 'Ampolleta', '500 mg/ml', 'Analgésicos y Antipiréticos', true);
INSERT INTO public.medicamento VALUES (6, 'MED-011', 'Amoxicilina', 'Cápsula', '500 mg', 'Antibióticos - Penicilinas', true);
INSERT INTO public.medicamento VALUES (7, 'MED-012', 'Amoxicilina + Ácido Clavulánico', 'Tableta', '875/125 mg', 'Antibióticos - Penicilinas', true);
INSERT INTO public.medicamento VALUES (8, 'MED-013', 'Cefalexina', 'Cápsula', '500 mg', 'Antibióticos - Cefalosporinas', true);
INSERT INTO public.medicamento VALUES (9, 'MED-014', 'Azitromicina', 'Tableta', '500 mg', 'Antibióticos - Macrólidos', true);
INSERT INTO public.medicamento VALUES (10, 'MED-015', 'Ciprofloxacino', 'Tableta', '500 mg', 'Antibióticos - Quinolonas', true);
INSERT INTO public.medicamento VALUES (11, 'MED-016', 'Clindamicina', 'Cápsula', '300 mg', 'Antibióticos - Lincosamidas', true);
INSERT INTO public.medicamento VALUES (12, 'MED-017', 'Trimetoprim + Sulfametoxazol', 'Tableta', '160/800 mg', 'Antibióticos - Sulfonamidas', true);
INSERT INTO public.medicamento VALUES (13, 'MED-021', 'Enalapril', 'Tableta', '10 mg', 'Antihipertensivos - IECA', true);
INSERT INTO public.medicamento VALUES (14, 'MED-022', 'Losartán', 'Tableta', '50 mg', 'Antihipertensivos - ARA II', true);
INSERT INTO public.medicamento VALUES (15, 'MED-023', 'Amlodipino', 'Tableta', '5 mg', 'Antihipertensivos - Calcioantagonistas', true);
INSERT INTO public.medicamento VALUES (16, 'MED-024', 'Metoprolol', 'Tableta', '100 mg', 'Antihipertensivos - Beta bloqueadores', true);
INSERT INTO public.medicamento VALUES (17, 'MED-025', 'Furosemida', 'Tableta', '40 mg', 'Diuréticos', true);
INSERT INTO public.medicamento VALUES (18, 'MED-026', 'Hidroclorotiazida', 'Tableta', '25 mg', 'Diuréticos', true);
INSERT INTO public.medicamento VALUES (19, 'MED-031', 'Metformina', 'Tableta', '850 mg', 'Antidiabéticos', true);
INSERT INTO public.medicamento VALUES (20, 'MED-032', 'Glibenclamida', 'Tableta', '5 mg', 'Antidiabéticos', true);
INSERT INTO public.medicamento VALUES (21, 'MED-033', 'Insulina NPH', 'Frasco ampolla', '100 UI/ml', 'Insulinas', true);
INSERT INTO public.medicamento VALUES (22, 'MED-034', 'Insulina Rápida', 'Frasco ampolla', '100 UI/ml', 'Insulinas', true);
INSERT INTO public.medicamento VALUES (23, 'MED-041', 'Omeprazol', 'Cápsula', '20 mg', 'Inhibidores de bomba de protones', true);
INSERT INTO public.medicamento VALUES (24, 'MED-042', 'Ranitidina', 'Tableta', '150 mg', 'Antihistamínicos H2', true);
INSERT INTO public.medicamento VALUES (25, 'MED-043', 'Metoclopramida', 'Tableta', '10 mg', 'Procinéticos', true);
INSERT INTO public.medicamento VALUES (26, 'MED-044', 'Loperamida', 'Cápsula', '2 mg', 'Antidiarreicos', true);
INSERT INTO public.medicamento VALUES (27, 'MED-045', 'Sales de Rehidratación Oral', 'Sobre', '20.5 g', 'Rehidratantes', true);
INSERT INTO public.medicamento VALUES (28, 'MED-051', 'Salbutamol', 'Inhalador', '100 mcg/dosis', 'Broncodilatadores', true);
INSERT INTO public.medicamento VALUES (29, 'MED-052', 'Budesonida', 'Inhalador', '200 mcg/dosis', 'Corticosteroides inhalados', true);
INSERT INTO public.medicamento VALUES (30, 'MED-053', 'Dextrometorfano', 'Jarabe', '15 mg/5ml', 'Antitusivos', true);
INSERT INTO public.medicamento VALUES (31, 'MED-054', 'Loratadina', 'Tableta', '10 mg', 'Antihistamínicos', true);
INSERT INTO public.medicamento VALUES (32, 'MED-061', 'Fenitoína', 'Tableta', '100 mg', 'Anticonvulsivantes', true);
INSERT INTO public.medicamento VALUES (33, 'MED-062', 'Carbamazepina', 'Tableta', '200 mg', 'Anticonvulsivantes', true);
INSERT INTO public.medicamento VALUES (34, 'MED-063', 'Diazepam', 'Tableta', '10 mg', 'Ansiolíticos', true);
INSERT INTO public.medicamento VALUES (35, 'MED-071', 'Paracetamol Pediátrico', 'Suspensión', '160 mg/5ml', 'Analgésicos Pediátricos', true);
INSERT INTO public.medicamento VALUES (36, 'MED-072', 'Amoxicilina Pediátrica', 'Suspensión', '250 mg/5ml', 'Antibióticos Pediátricos', true);
INSERT INTO public.medicamento VALUES (37, 'MED-073', 'Ibuprofeno Pediátrico', 'Suspensión', '100 mg/5ml', 'Antiinflamatorios Pediátricos', true);
INSERT INTO public.medicamento VALUES (38, 'MED-074', 'Cefalexina Pediátrica', 'Suspensión', '250 mg/5ml', 'Antibióticos Pediátricos', true);
INSERT INTO public.medicamento VALUES (39, 'MED-081', 'Solución Salina 0.9%', 'Bolsa', '1000 ml', 'Soluciones Intravenosas', true);
INSERT INTO public.medicamento VALUES (40, 'MED-082', 'Solución Glucosada 5%', 'Bolsa', '1000 ml', 'Soluciones Intravenosas', true);
INSERT INTO public.medicamento VALUES (41, 'MED-083', 'Solución Hartmann', 'Bolsa', '1000 ml', 'Soluciones Intravenosas', true);
INSERT INTO public.medicamento VALUES (42, 'MED-084', 'Cloruro de Potasio', 'Ampolleta', '2 mEq/ml', 'Electrolitos', true);
INSERT INTO public.medicamento VALUES (43, 'MED-091', 'Ácido Fólico', 'Tableta', '5 mg', 'Vitaminas', true);
INSERT INTO public.medicamento VALUES (44, 'MED-092', 'Complejo B', 'Tableta', 'Multivitamínico', 'Vitaminas', true);
INSERT INTO public.medicamento VALUES (45, 'MED-093', 'Sulfato Ferroso', 'Tableta', '300 mg', 'Suplementos de Hierro', true);
INSERT INTO public.medicamento VALUES (46, 'MED-094', 'Calcio + Vitamina D', 'Tableta', '600 mg + 400 UI', 'Suplementos', true);


--
-- Data for Name: nota_egreso; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nota_evolucion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.nota_evolucion VALUES (1, 6, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Paciente refiere...', 'Paciente en condiciones generales...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Adecuado para la edad', 'Sin estudios recientes que reportar', 'Evolución clínica estable', 'Por determinar', NULL, 'Continuar manejo actual', 'No se solicitaron interconsultas en esta evolución', 'Favorable para la vida', NULL, '2025-07-14 15:29:06.464407', NULL, NULL);
INSERT INTO public.nota_evolucion VALUES (2, 38, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'No se solicitaron interconsultas en esta evolución', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, '2025-07-20 16:09:10.51756', NULL, 15);
INSERT INTO public.nota_evolucion VALUES (3, 39, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'No se solicitaron interconsultas en esta evolución', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, '2025-07-22 02:22:03.007435', NULL, 15);
INSERT INTO public.nota_evolucion VALUES (4, 42, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAA', 'No se solicitaron interconsultas en esta evolución', 'AAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, '2025-07-22 15:15:41.219771', NULL, 15);
INSERT INTO public.nota_evolucion VALUES (5, 45, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'No se solicitaron interconsultas en esta evolución', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, '2025-07-22 22:30:39.714002', NULL, 15);
INSERT INTO public.nota_evolucion VALUES (6, 51, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'No se solicitaron interconsultas en esta evolución', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, '2025-07-24 13:34:06.725812', NULL, 11);
INSERT INTO public.nota_evolucion VALUES (7, 65, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaa', 'No se solicitaron interconsultas en esta evolución', 'aaaaaaaaaaaaaaaa', NULL, '2025-07-31 12:46:28.840091', NULL, NULL);
INSERT INTO public.nota_evolucion VALUES (8, 71, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaa', 'No se solicitaron interconsultas en esta evolución', 'aaaaaaaaaaaaaaaa', NULL, '2025-07-31 17:39:06.784854', NULL, NULL);


--
-- Data for Name: nota_interconsulta; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nota_nutricion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nota_postanestesica; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nota_postoperatoria; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nota_preanestesica; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nota_preoperatoria; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nota_psicologia; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nota_urgencias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.nota_urgencias VALUES (1, 5, 'Paciente masculino de 25 años que acude al servicio de urgencias por dolor abdominal de 6 horas de evolución, localizado en epigastrio, de inicio súbito, intensidad 7/10, punzante, que se irradia hacia el hipocondrio derecho. Se acompaña de náuseas y un episodio de vómito de contenido alimentario.', 'Consciente y orientado', 'Paciente masculino de 25 años que acude al servicio de urgencias por dolor abdominal de 6 horas de evolución, localizado en epigastrio, de inicio súbito, intensidad 7/10, punzante, que se irradia hacia el hipocondrio derecho. Se acompaña de náuseas y un episodio de vómito de contenido alimentario.', 'TA: 120/80 mmHg, FC: 88 lpm, FR: 20 rpm, Temp: 37.1°C, SatO2: 98%. Paciente álgico, posición antiálgica (flexión de tronco). Abdomen: distendido, ruidos peristálticos disminuidos, dolor a la palpación superficial y profunda en epigastrio e hipocondrio derecho, Murphy positivo, no hay datos de irritación peritoneal, no se palpan masas ni visceromegalias. Resto de exploración sin alteraciones significativas.', 'Laboratorios: Leucocitos 12,500/mm3 con neutrofilia del 78%, bilirrubinas totales 2.1 mg/dl (directa 1.4 mg/dl), ALT 145 UI/L, AST 132 UI/L, amilasa sérica 180 UI/L. Ultrasonido abdominal: vesícula biliar distendida con múltiples litiasis, paredes engrosadas de 5mm, líquido perivesicular escaso, vía biliar no dilatada.', 'Ansioso debido al dolor, colaborador, comprende instrucciones, no presenta alteraciones cognitivas evidentes. Refiere preocupación por el diagnóstico pero se muestra receptivo a las explicaciones médicas.', 'Colelitiasis complicada con colecistitis aguda. Síndrome doloroso abdominal secundario a proceso inflamatorio de vesícula biliar.', NULL, 'Manejo del dolor: Ketorolaco 30mg IV cada 8 horas
Antiespasmódico: Butilhioscina 20mg IV cada 8 horas
Antiemético: Ondansetrón 4mg IV en caso necesario
Ayuno absoluto hasta nueva indicación
Solución mixta 1000ml IV para 8 horas
Interconsulta a cirugía general para valoración quirúrgica
Hospitalización para manejo intrahospitalario
Vigilancia de signos vitales cada 4 horas
Laboratorios de control en 12 horas', 'Bueno para la vida', NULL);
INSERT INTO public.nota_urgencias VALUES (2, 30, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Consciente y orientado', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 14, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Bueno para la vida', NULL);
INSERT INTO public.nota_urgencias VALUES (3, 31, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Consciente y orientado', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 15, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAsdasd', 'Bueno para la vida', NULL);
INSERT INTO public.nota_urgencias VALUES (4, 32, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Consciente y orientado', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 15, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAsdasd', 'Bueno para la vida', NULL);
INSERT INTO public.nota_urgencias VALUES (5, 41, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Consciente y orientado', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Malo', NULL);
INSERT INTO public.nota_urgencias VALUES (6, 46, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Consciente y orientado', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Malo', NULL);
INSERT INTO public.nota_urgencias VALUES (17, 139, 'Paciente masculino de 50 años, acude por presentar dolor epigástrico de 3 días de evolución, de tipo ardoroso, asociado a náusea matutina. Refiere que el dolor aumenta tras la ingesta de alimentos irritantes. No presenta fiebre ni vómito.', 'Alerta y orientado', 'Cardiovascular: Refiere episodios de palpitaciones ocasionales sin dolor torácico.. Respiratorio: Niega tos, disnea o expectoración.. Digestivo: Ocasional pirosis (agruras), sin vómito ni diarrea.. Genitourinario: Micciones normales, sin disuria ni hematuria.. Neurológico: Niega cefaleas frecuentes, pérdida de fuerza o alteraciones de la marcha.. Musculoesquelético: Dolor lumbar leve al final del día, sin inflamación articular..', 'Paciente consciente, orientado en tiempo, lugar y persona, en aparente buen estado general.', 'Aceptables', 'Aceptable', 'Gastritis aguda probablemente secundaria a dieta irritante.', 508, 'Dieta blanda, evitar irritantes, café, alcohol y tabaco.

Omeprazol 20 mg VO cada 24 h por 14 días.

Hidratación adecuada.

Cita de control en 7 días o antes si hay empeoramiento.', 'Excelente', NULL);
INSERT INTO public.nota_urgencias VALUES (7, 47, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Consciente y orientado', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', NULL, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'Malo', NULL);
INSERT INTO public.nota_urgencias VALUES (8, 64, 'aaaaaaaaaaa', 'Consciente desorientado', 'aaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaa', 'Bueno para la vida', NULL);
INSERT INTO public.nota_urgencias VALUES (9, 70, 'aaaaaaaaaaa', 'Consciente y orientado', 'aaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa', NULL, 'aaaaaaaaaaaaaaaa', 'Bueno para la vida', NULL);
INSERT INTO public.nota_urgencias VALUES (10, 88, 'Dolor abdominal súbito en cuadrante inferior derecho, acompañado de náuseas y fiebre leve.', 'Alerta y orientado', 'Paciente refiere inicio súbito de dolor abdominal hace 6 horas, con intensidad creciente, tipo punzante. Ha presentado náuseas y un episodio de vómito. Niega antecedentes similares.', 'Dolor a la palpación profunda en fosa iliaca derecha, con signo de rebote positivo. Abdomen ligeramente distendido, ruidos peristálticos disminuidos. No hay ictericia ni signos de irritación meníngea.', 'Ultrasonido abdominal: Imagen sugestiva de apendicitis aguda.
BH completa: Leucocitosis (16,200/mm³), neutrofilia.
EGO: Normal.', 'Coherente, orientado en persona, tiempo y espacio', 'Apendicitis aguda no complicada.', NULL, 'Ingreso a cirugía para apendicectomía laparoscópica. Ayuno absoluto. Hidratación con Hartmann. Analgesia con ketorolaco IV.', 'Bueno', NULL);
INSERT INTO public.nota_urgencias VALUES (11, 89, 'Dolor abdominal súbito en cuadrante inferior derecho, acompañado de náuseas y fiebre leve.', 'Alerta y orientado', 'Paciente refiere inicio súbito de dolor abdominal hace 6 horas, con intensidad creciente, tipo punzante. Ha presentado náuseas y un episodio de vómito. Niega antecedentes similares.', 'Dolor a la palpación profunda en fosa iliaca derecha, con signo de rebote positivo. Abdomen ligeramente distendido, ruidos peristálticos disminuidos. No hay ictericia ni signos de irritación meníngea.', 'Ultrasonido abdominal: Imagen sugestiva de apendicitis aguda.
BH completa: Leucocitosis (16,200/mm³), neutrofilia.
EGO: Normal.', 'Coherente, orientado en persona, tiempo y espacio', 'Apendicitis aguda no complicada.', 242, 'Ingreso a cirugía para apendicectomía laparoscópica. Ayuno absoluto. Hidratación con Hartmann. Analgesia con ketorolaco IV.', 'Bueno', NULL);
INSERT INTO public.nota_urgencias VALUES (12, 90, 'Dolor abdominal súbito en cuadrante inferior derecho, acompañado de náuseas y fiebre leve.', 'Alerta y orientado', 'Paciente refiere inicio súbito de dolor abdominal hace 6 horas, con intensidad creciente, tipo punzante. Ha presentado náuseas y un episodio de vómito. Niega antecedentes similares.', 'Dolor a la palpación profunda en fosa iliaca derecha, con signo de rebote positivo. Abdomen ligeramente distendido, ruidos peristálticos disminuidos. No hay ictericia ni signos de irritación meníngea.', 'Ultrasonido abdominal: Imagen sugestiva de apendicitis aguda.
BH completa: Leucocitosis (16,200/mm³), neutrofilia.
EGO: Normal.', 'Coherente, orientado en persona, tiempo y espacio', 'Apendicitis aguda no complicada.', 508, 'Ingreso a cirugía para apendicectomía laparoscópica. Ayuno absoluto. Hidratación con Hartmann. Analgesia con ketorolaco IV.', 'Reservado', NULL);
INSERT INTO public.nota_urgencias VALUES (13, 91, 'Dolor abdominal súbito en cuadrante inferior derecho, acompañado de náuseas y fiebre leve.', 'Alerta y orientado', 'Paciente refiere inicio súbito de dolor abdominal hace 6 horas, con intensidad creciente, tipo punzante. Ha presentado náuseas y un episodio de vómito. Niega antecedentes similares.', 'Dolor a la palpación profunda en fosa iliaca derecha, con signo de rebote positivo. Abdomen ligeramente distendido, ruidos peristálticos disminuidos. No hay ictericia ni signos de irritación meníngea.', 'Ultrasonido abdominal: Imagen sugestiva de apendicitis aguda.
BH completa: Leucocitosis (16,200/mm³), neutrofilia.
EGO: Normal.', 'Coherente, orientado en persona, tiempo y espacio', 'Apendicitis aguda no complicada.', 508, 'Ingreso a cirugía para apendicectomía laparoscópica. Ayuno absoluto. Hidratación con Hartmann. Analgesia con ketorolaco IV.', 'Reservado', NULL);
INSERT INTO public.nota_urgencias VALUES (14, 113, 'abcdedfdabcdedfdabcdedfdabcdedfdabcdedfd', 'Alerta y orientado', 'abcdedfdabcdedfdabcdedfdabcdedfd', 'abcdedfdabcdedfdabcdedfdabcdedfdabcdedfdabcdedfd', 'abcdedfdabcdedfdabcdedfdabcdedfdabcdedfd', 'abcdedfdabcdedfdabcdedfdabcdedfdabcdedfd', 'abcdedfdabcdedfdabcdedfdabcdedfdabcdedfd', 508, 'abcdedfdabcdedfdabcdedfdabcdedfd', 'Excelente', NULL);
INSERT INTO public.nota_urgencias VALUES (15, 115, 'ABCDEmotivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [', 'Alerta y orientado', 'Cardiovascular: ABCDE. Respiratorio: ABCDE. Digestivo: ABCDE. Genitourinario: ABCDE. Neurológico: ABCDE. Musculoesquelético: ABCDE.', 'ABCDEmotivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [ motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [', 'ABCDEABCDEABCDEmotivo_atencion: [motivo_atencion: [motivo_atencion: [', 'ABCDEABCDEABCDEmotivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [', 'ABCDEmotivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [', 508, 'ABCDEmotivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [motivo_atencion: [', 'Excelente', NULL);
INSERT INTO public.nota_urgencias VALUES (16, 133, 'abcdabcdabcdabcdabcdabcd', 'Alerta y orientado', 'Cardiovascular: abcdabcdabcdabcdabcdabcd. Respiratorio: abcdabcdabcdabcdabcdabcd. Digestivo: abcdabcdabcdabcdabcdabcd. Genitourinario: abcdabcdabcdabcdabcdabcd. Neurológico: abcdabcdabcdabcdabcdabcd. Musculoesquelético: abcdabcdabcdabcdabcdabcd.', 'abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd', 'fsdfsdfsdf', 'sdfsdfsdfsdf', 'abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd', 501, 'abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd', 'Excelente', NULL);


--
-- Data for Name: paciente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.paciente VALUES (1, 46, 'Ninguna conocida', 'false', NULL, 'María González López', 'Madre', '4771234567', 'Estudiante', 'Preparatoria incompleta', 'San Luis de la Paz, Guanajuato', '2025-07-14 14:36:10.78133', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.paciente VALUES (2, 49, 'Penicilina, nueces', 'false', NULL, 'María García López', 'Madre', '4421234567', 'Comerciante', 'Técnico', 'San Luis de la Paz, Guanajuato', '2025-07-16 23:12:06.701531', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.paciente VALUES (3, 58, 'Polen', 'false', NULL, 'Juana Garcia Luna', 'Madre', '4684545452', 'Lactante', 'Sin estudios', 'San Luis de la Paz, Guanajuato', '2025-07-18 13:20:46.466055', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.paciente VALUES (4, 59, 'Ninguna', 'false', NULL, 'Dulce Parra Colmenero', 'Madre', '4771234567', 'Comerciante', 'Licenciatura completa', 'San Luis de la Paz, Guanajuato', '2025-07-19 17:36:52.313858', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.paciente VALUES (5, 60, 'MANGO', 'false', NULL, 'Dulce Parra Colmenero', 'Madre', '4424545455', 'Estudiante', 'Secundaria incompleta', 'San Luis de la Paz, Guanajuato', '2025-07-22 15:48:46.009136', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.paciente VALUES (6, 61, 'Penicilina, mariscos', 'false', NULL, 'Leticia Hernández Robledo', 'Hijo(a)', '4611983342', 'Jubilada (exprofesora de primaria)', 'Licenciatura completa', 'Dolores Hidalgo, Guanajuato', '2025-08-04 14:41:27.473672', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.paciente VALUES (7, 62, 'Ninguna conocida', 'false', NULL, 'Laura del Carmen Martínez Mendoza', 'Hermano(a)', '4423750081', 'Panadero', 'Primaria completa', 'San José Iturbide, Guanajuato', '2025-08-04 14:50:01.110112', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.paciente VALUES (8, 65, 'Ninguna', 'false', NULL, 'Eva Corona Diaz', 'Tío(a)', '4684545595', 'Estudiante', 'Preparatoria incompleta', 'San Luis de la Paz', '2025-08-15 09:21:48.470416', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.paciente VALUES (9, 71, 'Ninguna', 'false', NULL, 'Laura del Carmen Martínez Mendoza', 'Madre', '4681234567', 'Estudiante', 'Preparatoria completa', 'San Luis de la Paz', '2025-08-15 15:38:16.484119', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.password_reset_tokens VALUES (13, 'agustinlopezparra13@gmail.com', 'administrador', 4, '022218fc1a34217d3493cf368a07752dbf5b3a11d11f82b9cd17f2a78debfdf5', NULL, '2025-08-11 08:00:25.550929', '2025-08-11 09:00:25.518', NULL, '::ffff:127.0.0.1', NULL, 0, false, 'Nuevo token solicitado');
INSERT INTO public.password_reset_tokens VALUES (14, 'agustinlopezparra13@gmail.com', 'administrador', 4, 'ef10d042187eaffbeb06b4c2644190735130e1d092ff8517a53be3ed91a86feb', NULL, '2025-08-11 08:08:29.31055', '2025-08-11 09:08:29.286', '2025-08-11 08:10:27.689089', '::ffff:127.0.0.1', NULL, 0, false, 'Contraseña cambiada exitosamente');
INSERT INTO public.password_reset_tokens VALUES (15, 'agustinlopezparra1@gmail.com', 'medico', 21, '0c8a3427bfe4c8a506f93787302af4ff72d6cf873f7349822c41f1e5bcf77c49', NULL, '2025-08-11 08:36:34.032109', '2025-08-11 09:36:34.018', '2025-08-11 08:46:22.457502', '::ffff:127.0.0.1', NULL, 0, false, 'Contraseña cambiada exitosamente');
INSERT INTO public.password_reset_tokens VALUES (16, 'agustinlopezparra13@gmail.com', 'administrador', 4, '0ba64c2ec23b9d8ae8f7b55d97523b62440d166c37c72947aadce4130c5011ca', NULL, '2025-08-15 09:10:46.723063', '2025-08-15 10:10:46.708', '2025-08-15 09:11:40.729293', '::ffff:127.0.0.1', NULL, 0, false, 'Contraseña cambiada exitosamente');


--
-- Data for Name: persona; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.persona VALUES (32, 'Roberto', 'Hernández', 'Martínez', '1978-11-22', 'M', 'HEMR781122HGTRNB02', 8, 'Casado(a)', 'Católica', '4151234568', 'admin@hospitalsanluis.gob.mx', 'Calle Hidalgo #456, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (33, 'Ana Sofía', 'Ramírez', 'González', '1980-07-08', 'F', 'RAGA800708MGTMNL03', 8, 'Soltero(a)', 'Católica', '4151234569', 'sistemas@hospitalsanluis.gob.mx', 'Colonia Centro #789, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (34, 'Carlos', 'Mendoza', 'Vázquez', '1970-05-12', 'M', 'MEVC700512HGTNDZ04', 1, 'Casado(a)', 'Católica', '4151234570', 'cmendoza@hospitalsanluis.gob.mx', 'Fraccionamiento Los Pinos #234, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (35, 'Patricia', 'Morales', 'Cruz', '1972-09-18', 'F', 'MOCP720918MGTRLZ05', 8, 'Casado(a)', 'Católica', '4151234571', 'pmorales@hospitalsanluis.gob.mx', 'Colonia Jardines #567, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (36, 'Fernando', 'Jiménez', 'Soto', '1968-12-03', 'M', 'JISF681203HGTMNT06', 4, 'Casado(a)', 'Católica', '4151234572', 'fjimenez@hospitalsanluis.gob.mx', 'Av. Independencia #890, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (37, 'Gabriela', 'Torres', 'Medina', '1975-02-25', 'F', 'TOMG750225MGTRRB07', 7, 'Soltero(a)', 'Católica', '4151234573', 'gtorres@hospitalsanluis.gob.mx', 'Calle Morelos #123, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (38, 'Miguel', 'Castillo', 'Flores', '1973-08-14', 'M', 'CAFM730814HGTSLG08', 1, 'Casado(a)', 'Católica', '4151234574', 'mcastillo@hospitalsanluis.gob.mx', 'Colonia San José #456, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (39, 'Laura', 'Sánchez', 'Herrera', '1977-06-30', 'F', 'SAHL770630MGTNRR09', 8, 'Casado(a)', 'Católica', '4151234575', 'lsanchez@hospitalsanluis.gob.mx', 'Fracc. Villa del Sol #789, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (40, 'Antonio', 'Rodríguez', 'Pérez', '1969-04-17', 'M', 'ROPA690417HGTDRT10', 2, 'Casado(a)', 'Católica', '4151234576', 'arodriguez@hospitalsanluis.gob.mx', 'Calle Juárez #234, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (41, 'Jorge', 'López', 'Martínez', '1985-01-20', 'M', 'LOMJ850120HGTPRT11', 3, 'Soltero(a)', 'Católica', '4151234577', 'jlopez@hospitalsanluis.gob.mx', 'Colonia Nueva #567, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (42, 'Carmen', 'González', 'Rivera', '1987-03-11', 'F', 'GORC870311MGTNZV12', 2, 'Soltero(a)', 'Católica', '4151234578', 'cgonzalez@hospitalsanluis.gob.mx', 'Av. Revolución #890, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (43, 'Ricardo', 'Vargas', 'Mendoza', '1986-09-05', 'M', 'VAMR860905HGTRGZ13', 7, 'Soltero(a)', 'Católica', '4151234579', 'rvargas@hospitalsanluis.gob.mx', 'Calle Allende #123, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (44, 'Mónica', 'Herrera', 'Castro', '1988-11-28', 'F', 'HECM881128MGTRST14', 8, 'Soltero(a)', 'Católica', '4151234580', 'mherrera@hospitalsanluis.gob.mx', 'Colonia Esperanza #456, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (45, 'Alejandro', 'Ruiz', 'Gómez', '1984-07-16', 'M', 'RUGA840716HGTZGM15', 2, 'Casado(a)', 'Católica', '4151234581', 'aruiz@hospitalsanluis.gob.mx', 'Fracc. Las Flores #789, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (47, 'ivan', 'lopez', 'parra', '2002-06-14', 'M', 'LOPI020614HGTRVN09', NULL, 'Soltero(a)', 'Católica', '3323333333', 'ivan@gmail.com', 'Guerrero', '2025-07-14 17:47:09.745064', false);
INSERT INTO public.persona VALUES (48, 'AGUSTIN', 'LOPEZ', 'PARRA', '2004-09-05', 'M', NULL, NULL, 'Soltero(a)', NULL, '4681134553', 'agustinlopezparra13@gmail.com', NULL, '2025-07-16 12:13:16.417318', false);
INSERT INTO public.persona VALUES (49, 'Juan', 'García', 'López', '1980-03-12', 'M', 'GABC800312HGTLPN01', NULL, 'Soltero(a)', 'Católica', '4421234567', 'carloslope@gmail.com', 'Calle Morelos #15, Colonia Centro, frente al parque', '2025-07-16 23:10:31.593903', false);
INSERT INTO public.persona VALUES (50, 'Benito', 'Garcia', 'Rivera', '1990-12-07', 'M', NULL, NULL, 'Unión libre', NULL, '4681056286', 'benitro777@gmail.com', NULL, '2025-07-17 09:52:57.348356', false);
INSERT INTO public.persona VALUES (51, 'Benito', 'Garcia', 'Rivera', '1990-12-07', 'M', NULL, NULL, 'Unión libre', NULL, '4681056286', 'benitro777@gmail.com', NULL, '2025-07-17 09:53:02.247894', false);
INSERT INTO public.persona VALUES (56, 'Juan Carlos', 'García', 'López', '1985-03-15', 'M', 'GARJ850315HGTLPC05', 1, NULL, NULL, '4622345678', 'agustinparralopez1@gmail.com', NULL, '2025-07-18 02:29:09.969082', false);
INSERT INTO public.persona VALUES (58, 'Juan', 'Garcia', 'Lopez', '2024-01-10', 'M', 'GABC800312HGTLPN05', NULL, 'Soltero(a)', 'Católica', '4681154554', 'agustinlopezparra13parra@gmail.com', 'Guerreo #134', '2025-07-18 13:19:35.816211', false);
INSERT INTO public.persona VALUES (31, 'María Elena', 'García', 'López', '2025-07-18', 'M', NULL, NULL, NULL, NULL, '4151234567', 'direccion@hospitalsanluis.gob.mx', NULL, '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona VALUES (59, 'Dulce', 'Parra', 'Lopez', '2005-11-10', 'F', 'GABC800312HGTLPN19', NULL, NULL, 'Protestante', '4668602222', 'dulcenlopezparra1@gmail.com', 'guerrero 9443', '2025-07-19 17:36:06.117595', false);
INSERT INTO public.persona VALUES (60, 'Ivan', 'Lopez', 'parra', '2000-05-05', 'M', 'GABC800312HGTLPN35', NULL, 'Soltero(a)', 'Católica', '4681112233', 'IVAN@gmail.com', 'CALLE DOCMICION GUERRERO', '2025-07-22 15:46:57.198164', false);
INSERT INTO public.persona VALUES (55, 'Benito', 'Martinez', 'Martinez', '1990-07-22', 'M', NULL, NULL, 'Unión libre', NULL, '4687878845', 'benito777@gmail.com', NULL, '2025-07-17 12:54:05.277916', false);
INSERT INTO public.persona VALUES (46, 'Carlos', 'Gonzales', 'Martinez', '2000-03-15', 'M', 'GOMC000315HGTRNR03', 1, 'Soltero(a)', 'Católica', '4773456789', 'carlos.gonzalez@email.com', 'Calle Hidalgo 123', '2025-07-14 14:34:03.852957', false);
INSERT INTO public.persona VALUES (61, 'María del Carmen', 'Hernández', 'Robledo', '1948-09-12', 'F', 'HERL480912MGTBRM07', NULL, 'Viudo(a)', 'Católica', '4612230987', 'mariac.robledo@example.com', 'Calle Abasolo #23, Col. Centro, Frente a la panadería', '2025-08-04 14:26:40.167', false);
INSERT INTO public.persona VALUES (62, 'José Eduardo', 'Martínez', 'Delgado', '1975-02-18', 'M', 'MADJ750218HGTLLS09', 7, 'Casado(a)', 'Católica', '4421258740', 'jose.martinez75@gmail.com', 'Calle Cedros No. 128, Col. San Rafael, entre calle Pinos y avenida Robles', '2025-08-04 14:49:07.502999', false);
INSERT INTO public.persona VALUES (63, 'Roberto Francisco', 'Vázquez', 'Caballero', '1990-12-15', 'M', 'VACR750315HGTSZB09', 7, NULL, NULL, '4682745500', 'agustinlopezparra1@gmail.com', NULL, '2025-08-11 08:30:21.565427', false);
INSERT INTO public.persona VALUES (57, 'Iván Mauricio', 'López', 'Parra', '1998-07-18', 'M', 'GARJ850315HGTLPC06', 1, NULL, NULL, '4685959522', 'root134phone@gmail.com', NULL, '2025-07-18 08:45:22.985113', false);
INSERT INTO public.persona VALUES (64, 'Eva Magali', 'Castillo', 'Gonzalez', '1978-05-11', 'F', 'CAGE780511MDFSNV02', 7, NULL, NULL, '4686896197', 'magali.152611@gmail.com', NULL, '2025-08-15 09:15:47.335509', false);
INSERT INTO public.persona VALUES (65, 'Marisol', 'Corona', 'Matehuala', '2010-07-21', 'F', 'COMN100721MGTRTR01', 7, 'Soltero(a)', 'Católica', '4684545595', 'marisolcorona@gmail.com', 'XXXXXX', '2025-08-15 09:20:29.72308', false);
INSERT INTO public.persona VALUES (71, 'Juan Daniel', 'Lopez', 'Matehuala', '2006-08-15', 'M', 'LOPA040509HGTPRG07', 7, 'Soltero(a)', 'Católica', '4685912122', 'juandaniel@gmail.com', 'Guerrero 843 Col. Centro', '2025-08-15 15:37:06.605128', false);


--
-- Data for Name: personal_medico; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.personal_medico VALUES (9, 42, '90123456', 'Medicina General', 'Médico General', 'Urgencias', true, NULL, 'dra.gonzalez', 'carmen123', NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico VALUES (20, 57, '20252025', 'Medicina General', 'Médico de Base', 'Urgencias', true, NULL, 'medico2025', '954954', NULL, '2025-08-11 09:07:20.458405');
INSERT INTO public.personal_medico VALUES (21, 63, '1234567', 'Medicina Interna', 'Jefe de Servicio', 'Enseñanza e Investigación', true, 'https://images.unsplash.com/photo-1755038995605-038a7345658f?q=80&w=394&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'dr.vazquez.c', '37900HGSLPZ', NULL, '2025-08-11 08:46:22.434726');
INSERT INTO public.personal_medico VALUES (22, 64, '4535501', 'Nutrición Clínica', NULL, 'Nutrición', true, NULL, 'ecastillo', 'ecastillo', NULL, '2025-08-15 09:15:47.335509');


--
-- Data for Name: prescripcion_medicamento; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: referencia_traslado; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: registro_transfusion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: servicio; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.servicio VALUES (1, 'Urgencias', 'Área de atención médica de emergencia', true);
INSERT INTO public.servicio VALUES (2, 'Traumatología', 'Servicio especializado en lesiones del sistema músculo-esquelético', true);
INSERT INTO public.servicio VALUES (3, 'Medicina Interna', 'Servicio especializado en enfermedades en adultos', true);
INSERT INTO public.servicio VALUES (4, 'Pediatría', 'Servicio especializado en salud infantil', true);
INSERT INTO public.servicio VALUES (5, 'Ortopedia', 'Servicio especializado en trastornos del aparato locomotor', true);
INSERT INTO public.servicio VALUES (6, 'Cirugía General', 'Servicio encargado de intervenciones quirúrgicas generales', true);
INSERT INTO public.servicio VALUES (7, 'Ginecología y Obstetricia', 'Servicio especializado en salud femenina y embarazo', true);
INSERT INTO public.servicio VALUES (8, 'Consulta Externa', 'Servicio de consultas ambulatorias', true);
INSERT INTO public.servicio VALUES (9, 'Hospitalización', 'Servicio de internamiento general', true);
INSERT INTO public.servicio VALUES (10, 'Quirófano', 'Área de cirugías y procedimientos quirúrgicos', true);


--
-- Data for Name: signos_vitales; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.signos_vitales VALUES (1, 4, '2025-07-14 21:21:23.047', 36.50, 120, 80, 72, 16, 98, 95, 75.20, 175.00, 24.56, 'Paciente estable, signos vitales dentro de parámetros normales. Sin alteraciones aparentes.');
INSERT INTO public.signos_vitales VALUES (2, 8, '2025-07-17 05:15:09.671', 37.00, 120, 58, 75, 30, 100, 120, 90.00, 190.00, 24.93, 'Paciente RARO');
INSERT INTO public.signos_vitales VALUES (3, 9, '2025-07-17 16:04:37.109', 35.00, 120, 80, 72, 20, 98, 100, 90.00, 190.00, 24.93, NULL);
INSERT INTO public.signos_vitales VALUES (4, 10, '2025-07-18 17:13:14.508', 36.70, 115, 75, 78, 16, 98, 85, 72.50, 175.00, 23.67, 'Paciente adulto joven en condiciones generales estables. Signos vitales dentro de parámetros normales. Sin datos de alarma al momento de la toma. Paciente cooperador durante la exploración.');
INSERT INTO public.signos_vitales VALUES (5, 11, '2025-07-18 18:16:43.905', 36.70, 115, 75, 78, 16, 98, 85, 72.50, 175.00, 23.67, 'Paciente adulto joven en condiciones generales estables. Signos vitales dentro de parámetros normales.');
INSERT INTO public.signos_vitales VALUES (6, 12, '2025-07-18 19:00:15.904', 36.70, 115, 75, 78, 16, 98, 85, 72.50, 175.00, 23.67, 'Paciente adulto joven en condiciones generales estables. Signos vitales dentro de parámetros normales.');
INSERT INTO public.signos_vitales VALUES (7, 13, '2025-07-18 19:00:29.789', 36.70, 115, 75, 78, 16, 98, 85, 72.50, 175.00, 23.67, 'Paciente adulto joven en condiciones generales estables. Signos vitales dentro de parámetros normales.');
INSERT INTO public.signos_vitales VALUES (8, 14, '2025-07-18 19:01:17.5', 36.70, 115, 75, 78, 16, 98, 85, 72.50, 175.00, 23.67, 'Paciente adulto joven en condiciones generales estables. Signos vitales dentro de parámetros normales.');
INSERT INTO public.signos_vitales VALUES (9, 15, '2025-07-18 19:08:40.851', 36.70, 115, 75, 78, 16, 98, 85, 72.50, 175.00, 23.67, 'Paciente adulto joven en condiciones generales estables. Signos vitales dentro de parámetros normales.');
INSERT INTO public.signos_vitales VALUES (10, 17, '2025-07-18 19:25:29.045', 36.50, 120, 80, 72, 20, 98, 100, 70.00, 170.00, 24.22, 'Paciente que acude para aplicacion de enzima');
INSERT INTO public.signos_vitales VALUES (11, 18, '2025-07-18 19:26:47.908', 36.50, 120, 80, 72, 20, 98, 100, 70.00, 170.00, 24.22, 'Paciente que acude para aplicacion de enzima');
INSERT INTO public.signos_vitales VALUES (12, 20, '2025-07-20 00:22:21.076', 36.80, 110, 70, 75, 18, 98, 95, 58.50, 162.00, 22.29, 'Paciente adulto joven en condiciones generales estables, signos vitales dentro de parámetros normales.');
INSERT INTO public.signos_vitales VALUES (13, 21, '2025-07-20 00:31:31.423', 36.80, 110, 70, 75, 18, 98, 95, 58.50, 162.00, 22.29, 'Paciente adulto joven en condiciones generales estables, signos vitales dentro de parámetros normales.');
INSERT INTO public.signos_vitales VALUES (14, 22, '2025-07-20 01:14:16.005', 36.00, 120, 80, 74, 22, 98, 100, 58.50, 162.00, 22.29, 'TEXTOOOOODGSDOFSD');
INSERT INTO public.signos_vitales VALUES (15, 23, '2025-07-20 02:47:35.605', 35.00, 122, 88, 77, 22, 99, 100, 58.50, 162.00, 22.29, 'Bien');
INSERT INTO public.signos_vitales VALUES (16, 24, '2025-07-20 03:20:01.786', 33.00, 122, 88, 72, 22, 99, 100, 58.50, 162.00, 22.29, NULL);
INSERT INTO public.signos_vitales VALUES (17, 25, '2025-07-20 04:16:16.899', 33.00, 111, 80, 72, 20, 98, 111, 58.50, 162.00, 22.29, NULL);
INSERT INTO public.signos_vitales VALUES (18, 26, '2025-07-20 06:52:12.84', 33.00, 111, 88, 77, 22, 99, 100, 58.50, 150.00, 26.00, 'fg');
INSERT INTO public.signos_vitales VALUES (19, 27, '2025-07-20 08:13:59.639', 33.00, 120, 88, 72, 20, 98, 100, 58.50, 150.00, 26.00, 'bien');
INSERT INTO public.signos_vitales VALUES (20, 29, '2025-07-20 16:01:43.844', 33.00, 111, 88, 77, 22, 99, 100, 70.00, 170.00, 24.22, NULL);
INSERT INTO public.signos_vitales VALUES (21, 40, '2025-07-22 20:16:17.575', 33.00, 120, 80, 77, 20, 98, 100, 70.00, 170.00, 24.22, NULL);
INSERT INTO public.signos_vitales VALUES (22, 43, '2025-07-22 21:35:49.939', 35.00, 120, 80, 72, 20, 98, 100, 72.50, 175.00, 23.67, '555');
INSERT INTO public.signos_vitales VALUES (23, 44, '2025-07-23 04:30:08.732', 36.00, 120, 80, 77, 20, 98, 100, 70.00, 170.00, 24.22, NULL);
INSERT INTO public.signos_vitales VALUES (24, 48, '2025-07-23 05:14:50.588', 36.00, 120, 80, 72, 20, 98, 100, 70.00, 170.00, 24.22, NULL);
INSERT INTO public.signos_vitales VALUES (25, 49, '2025-07-24 03:08:29.7', 36.00, 120, 80, 72, 20, 98, 100, 70.00, 170.00, 24.22, NULL);
INSERT INTO public.signos_vitales VALUES (26, 50, '2025-07-24 19:32:24.623', 36.00, 120, 80, 72, 20, 98, 101, 70.00, 170.00, 24.22, 'Jalando Bien');
INSERT INTO public.signos_vitales VALUES (27, 52, '2025-07-28 14:50:53.863', 36.00, 120, 80, 72, 20, 98, 100, 70.00, 170.00, 24.22, NULL);
INSERT INTO public.signos_vitales VALUES (28, 53, '2025-07-28 15:08:07.577', 36.00, 120, 80, 72, 20, 98, 100, 70.00, 170.00, 24.22, NULL);
INSERT INTO public.signos_vitales VALUES (29, 54, '2025-07-29 00:54:29.073', 36.50, 120, 80, 72, 20, 98, 100, 58.50, 150.00, 26.00, NULL);
INSERT INTO public.signos_vitales VALUES (30, 55, '2025-07-29 03:45:26.428', 37.00, 120, 80, 72, 20, 98, 100, 58.50, 150.00, 26.00, NULL);
INSERT INTO public.signos_vitales VALUES (31, 56, '2025-07-29 04:52:19.772', 35.00, 120, 80, 72, 20, 98, 100, 58.50, 150.00, 26.00, NULL);
INSERT INTO public.signos_vitales VALUES (32, 57, '2025-07-29 09:35:32.882', 36.00, 120, 80, 72, 20, 98, 100, 58.50, 150.00, 26.00, NULL);
INSERT INTO public.signos_vitales VALUES (33, 58, '2025-07-30 01:54:58.39', 36.00, 120, 80, 72, 20, 98, 100, 72.50, 175.00, 23.67, NULL);
INSERT INTO public.signos_vitales VALUES (34, 59, '2025-07-30 08:15:41.877', 36.00, 120, 80, 72, 20, 98, 100, 72.50, 175.00, 23.67, NULL);
INSERT INTO public.signos_vitales VALUES (35, 60, '2025-07-30 21:01:16.002', 36.00, 120, 80, 72, 20, 98, 100, 72.50, 175.00, 23.67, NULL);
INSERT INTO public.signos_vitales VALUES (36, 61, '2025-07-31 04:05:08.036', 36.00, 120, 88, 77, 22, 99, 111, 72.50, 175.00, 23.67, NULL);
INSERT INTO public.signos_vitales VALUES (37, 62, '2025-07-31 04:10:32.4', 39.00, 130, 90, 77, 22, 99, 111, 72.50, 175.00, 23.67, NULL);
INSERT INTO public.signos_vitales VALUES (38, 63, '2025-07-31 15:48:22.612', 36.00, 111, 88, 77, 22, 99, 111, 70.00, 170.00, 24.22, NULL);
INSERT INTO public.signos_vitales VALUES (39, 66, '2025-07-31 18:47:25.623', 33.00, 111, 80, 72, 20, 98, 100, 70.00, 170.00, 24.22, NULL);
INSERT INTO public.signos_vitales VALUES (40, 67, '2025-07-31 18:58:17.885', 33.00, 120, 80, 72, 20, 88, 100, 72.50, 175.00, 23.67, NULL);
INSERT INTO public.signos_vitales VALUES (41, 68, '2025-07-31 19:21:03.548', 33.00, 111, 88, 77, 22, 98, 100, 72.50, 175.00, 23.67, NULL);
INSERT INTO public.signos_vitales VALUES (42, 69, '2025-07-31 20:17:06.457', 36.00, 120, 80, 72, 20, 98, 100, 58.50, 150.00, 26.00, NULL);
INSERT INTO public.signos_vitales VALUES (43, 73, '2025-08-04 18:24:54.808', 36.00, 120, 80, 72, 20, 98, 100, 72.50, 175.00, 23.67, NULL);
INSERT INTO public.signos_vitales VALUES (44, 77, '2025-08-04 21:01:52.056', 36.50, 125, 82, 76, 18, 97, 98, 74.50, 172.00, 25.18, NULL);
INSERT INTO public.signos_vitales VALUES (45, 111, '2025-08-06 16:35:27.687', 36.00, 120, 80, 72, 20, 98, 100, 74.50, 172.00, 25.18, NULL);
INSERT INTO public.signos_vitales VALUES (46, 112, '2025-08-07 22:16:06.297', 36.00, 120, 80, 72, 20, 98, 100, 74.50, 172.00, 25.18, NULL);
INSERT INTO public.signos_vitales VALUES (47, 114, '2025-08-11 03:24:38.525', 36.00, 120, 80, 72, 20, 98, 100, 74.50, 172.00, 25.18, '1000');


--
-- Data for Name: solicitud_estudio; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: tipo_documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tipo_documento VALUES (1, 'Historia Clínica', 'Documento base que contiene antecedentes e información completa del paciente', true);
INSERT INTO public.tipo_documento VALUES (2, 'Nota de Urgencias', 'Documento generado durante la atención en el servicio de urgencias', true);
INSERT INTO public.tipo_documento VALUES (3, 'Nota de Evolución', 'Documento para seguimiento diario del paciente', true);
INSERT INTO public.tipo_documento VALUES (4, 'Nota de Interconsulta', 'Solicitud de valoración por otra especialidad', true);
INSERT INTO public.tipo_documento VALUES (5, 'Nota Preoperatoria', 'Evaluación previa a una intervención quirúrgica', true);
INSERT INTO public.tipo_documento VALUES (6, 'Nota Preanestésica', 'Evaluación anestésica previa a cirugía', true);
INSERT INTO public.tipo_documento VALUES (7, 'Nota Postoperatoria', 'Registro de la intervención quirúrgica realizada', true);
INSERT INTO public.tipo_documento VALUES (8, 'Nota Postanestésica', 'Registro del procedimiento anestésico realizado', true);
INSERT INTO public.tipo_documento VALUES (9, 'Nota de Egreso', 'Resumen de la atención al momento del alta hospitalaria', true);
INSERT INTO public.tipo_documento VALUES (10, 'Nota de Psicología', 'Evaluación y seguimiento psicológico', true);
INSERT INTO public.tipo_documento VALUES (11, 'Nota de Nutrición', 'Evaluación y plan de manejo nutricional', true);
INSERT INTO public.tipo_documento VALUES (12, 'Historia Clínica Pediátrica', 'Historia clínica específica para pacientes pediátricos', true);
INSERT INTO public.tipo_documento VALUES (13, 'Control de Crecimiento y Desarrollo', 'Seguimiento del crecimiento y desarrollo psicomotriz', true);
INSERT INTO public.tipo_documento VALUES (14, 'Esquema de Vacunación', 'Control y seguimiento de inmunizaciones', true);


--
-- Data for Name: tipo_sangre; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tipo_sangre VALUES (1, 'A+', 'Grupo sanguíneo A positivo');
INSERT INTO public.tipo_sangre VALUES (2, 'A-', 'Grupo sanguíneo A negativo');
INSERT INTO public.tipo_sangre VALUES (3, 'B+', 'Grupo sanguíneo B positivo');
INSERT INTO public.tipo_sangre VALUES (4, 'B-', 'Grupo sanguíneo B negativo');
INSERT INTO public.tipo_sangre VALUES (5, 'AB+', 'Grupo sanguíneo AB positivo');
INSERT INTO public.tipo_sangre VALUES (6, 'AB-', 'Grupo sanguíneo AB negativo');
INSERT INTO public.tipo_sangre VALUES (7, 'O+', 'Grupo sanguíneo O positivo');
INSERT INTO public.tipo_sangre VALUES (8, 'O-', 'Grupo sanguíneo O negativo');


--
-- Data for Name: vacunas_adicionales; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: validacion_reingreso; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: administrador_id_administrador_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_id_administrador_seq', 5, true);


--
-- Name: alertas_sistema_id_alerta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alertas_sistema_id_alerta_seq', 1, false);


--
-- Name: antecedentes_heredo_familiares_id_antecedentes_hf_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.antecedentes_heredo_familiares_id_antecedentes_hf_seq', 1, false);


--
-- Name: antecedentes_perinatales_id_perinatales_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.antecedentes_perinatales_id_perinatales_seq', 1, false);


--
-- Name: area_interconsulta_id_area_interconsulta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.area_interconsulta_id_area_interconsulta_seq', 25, true);


--
-- Name: cama_id_cama_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cama_id_cama_seq', 69, true);


--
-- Name: catalogo_vacunas_id_vacuna_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_vacunas_id_vacuna_seq', 12, true);


--
-- Name: configuracion_sistema_id_config_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_sistema_id_config_seq', 133, true);


--
-- Name: consentimiento_informado_id_consentimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consentimiento_informado_id_consentimiento_seq', 1, false);


--
-- Name: control_acceso_historico_id_control_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.control_acceso_historico_id_control_seq', 1, false);


--
-- Name: desarrollo_psicomotriz_id_desarrollo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.desarrollo_psicomotriz_id_desarrollo_seq', 1, false);


--
-- Name: documento_clinico_id_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documento_clinico_id_documento_seq', 146, true);


--
-- Name: estado_nutricional_pediatrico_id_nutricional_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_nutricional_pediatrico_id_nutricional_seq', 1, false);


--
-- Name: estudio_medico_id_estudio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estudio_medico_id_estudio_seq', 88, true);


--
-- Name: expediente_auditoria_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expediente_auditoria_id_auditoria_seq', 63, true);


--
-- Name: expediente_id_expediente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expediente_id_expediente_seq', 10, true);


--
-- Name: guia_clinica_id_guia_diagnostico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.guia_clinica_id_guia_diagnostico_seq', 787, true);


--
-- Name: historia_clinica_id_historia_clinica_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historia_clinica_id_historia_clinica_seq', 39, true);


--
-- Name: inmunizaciones_id_inmunizacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inmunizaciones_id_inmunizacion_seq', 1, false);


--
-- Name: internamiento_id_internamiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.internamiento_id_internamiento_seq', 1, false);


--
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicamento_id_medicamento_seq', 46, true);


--
-- Name: nota_egreso_id_nota_egreso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_egreso_id_nota_egreso_seq', 1, false);


--
-- Name: nota_evolucion_id_nota_evolucion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_evolucion_id_nota_evolucion_seq', 8, true);


--
-- Name: nota_interconsulta_id_nota_interconsulta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_interconsulta_id_nota_interconsulta_seq', 1, false);


--
-- Name: nota_nutricion_id_nota_nutricion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_nutricion_id_nota_nutricion_seq', 1, false);


--
-- Name: nota_postanestesica_id_nota_postanestesica_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_postanestesica_id_nota_postanestesica_seq', 1, false);


--
-- Name: nota_postoperatoria_id_nota_postoperatoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_postoperatoria_id_nota_postoperatoria_seq', 1, false);


--
-- Name: nota_preanestesica_id_nota_preanestesica_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_preanestesica_id_nota_preanestesica_seq', 1, false);


--
-- Name: nota_preoperatoria_id_nota_preoperatoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_preoperatoria_id_nota_preoperatoria_seq', 1, false);


--
-- Name: nota_psicologia_id_nota_psicologia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_psicologia_id_nota_psicologia_seq', 1, false);


--
-- Name: nota_urgencias_id_nota_urgencias_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_urgencias_id_nota_urgencias_seq', 17, true);


--
-- Name: paciente_id_paciente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paciente_id_paciente_seq', 9, true);


--
-- Name: password_reset_tokens_id_reset_token_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_reset_token_seq', 16, true);


--
-- Name: persona_id_persona_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.persona_id_persona_seq', 71, true);


--
-- Name: personal_medico_id_personal_medico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_medico_id_personal_medico_seq', 22, true);


--
-- Name: prescripcion_medicamento_id_prescripcion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescripcion_medicamento_id_prescripcion_seq', 1, false);


--
-- Name: referencia_traslado_id_referencia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.referencia_traslado_id_referencia_seq', 1, false);


--
-- Name: registro_transfusion_id_transfusion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registro_transfusion_id_transfusion_seq', 1, false);


--
-- Name: servicio_id_servicio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicio_id_servicio_seq', 10, true);


--
-- Name: signos_vitales_id_signos_vitales_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.signos_vitales_id_signos_vitales_seq', 47, true);


--
-- Name: solicitud_estudio_id_solicitud_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitud_estudio_id_solicitud_seq', 1, false);


--
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_documento_id_tipo_documento_seq', 14, true);


--
-- Name: tipo_sangre_id_tipo_sangre_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_sangre_id_tipo_sangre_seq', 8, true);


--
-- Name: vacunas_adicionales_id_vacuna_adicional_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vacunas_adicionales_id_vacuna_adicional_seq', 1, false);


--
-- Name: validacion_reingreso_id_validacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.validacion_reingreso_id_validacion_seq', 1, false);


--
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (id_administrador);


--
-- Name: administrador administrador_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_usuario_key UNIQUE (usuario);


--
-- Name: alertas_sistema alertas_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_sistema
    ADD CONSTRAINT alertas_sistema_pkey PRIMARY KEY (id_alerta);


--
-- Name: antecedentes_heredo_familiares antecedentes_heredo_familiares_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedentes_heredo_familiares
    ADD CONSTRAINT antecedentes_heredo_familiares_pkey PRIMARY KEY (id_antecedentes_hf);


--
-- Name: antecedentes_perinatales antecedentes_perinatales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedentes_perinatales
    ADD CONSTRAINT antecedentes_perinatales_pkey PRIMARY KEY (id_perinatales);


--
-- Name: area_interconsulta area_interconsulta_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.area_interconsulta
    ADD CONSTRAINT area_interconsulta_nombre_key UNIQUE (nombre);


--
-- Name: area_interconsulta area_interconsulta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.area_interconsulta
    ADD CONSTRAINT area_interconsulta_pkey PRIMARY KEY (id_area_interconsulta);


--
-- Name: cama cama_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_pkey PRIMARY KEY (id_cama);


--
-- Name: catalogo_vacunas catalogo_vacunas_nombre_vacuna_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_vacunas
    ADD CONSTRAINT catalogo_vacunas_nombre_vacuna_key UNIQUE (nombre_vacuna);


--
-- Name: catalogo_vacunas catalogo_vacunas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_vacunas
    ADD CONSTRAINT catalogo_vacunas_pkey PRIMARY KEY (id_vacuna);


--
-- Name: configuracion_sistema configuracion_sistema_parametro_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_parametro_key UNIQUE (parametro);


--
-- Name: configuracion_sistema configuracion_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_pkey PRIMARY KEY (id_config);


--
-- Name: consentimiento_informado consentimiento_informado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consentimiento_informado
    ADD CONSTRAINT consentimiento_informado_pkey PRIMARY KEY (id_consentimiento);


--
-- Name: control_acceso_historico control_acceso_historico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_acceso_historico
    ADD CONSTRAINT control_acceso_historico_pkey PRIMARY KEY (id_control);


--
-- Name: desarrollo_psicomotriz desarrollo_psicomotriz_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desarrollo_psicomotriz
    ADD CONSTRAINT desarrollo_psicomotriz_pkey PRIMARY KEY (id_desarrollo);


--
-- Name: documento_clinico documento_clinico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_pkey PRIMARY KEY (id_documento);


--
-- Name: estado_nutricional_pediatrico estado_nutricional_pediatrico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_nutricional_pediatrico
    ADD CONSTRAINT estado_nutricional_pediatrico_pkey PRIMARY KEY (id_nutricional);


--
-- Name: estudio_medico estudio_medico_clave_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudio_medico
    ADD CONSTRAINT estudio_medico_clave_key UNIQUE (clave);


--
-- Name: estudio_medico estudio_medico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudio_medico
    ADD CONSTRAINT estudio_medico_pkey PRIMARY KEY (id_estudio);


--
-- Name: expediente_auditoria expediente_auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente_auditoria
    ADD CONSTRAINT expediente_auditoria_pkey PRIMARY KEY (id_auditoria);


--
-- Name: expediente expediente_numero_expediente_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente
    ADD CONSTRAINT expediente_numero_expediente_key UNIQUE (numero_expediente);


--
-- Name: expediente expediente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente
    ADD CONSTRAINT expediente_pkey PRIMARY KEY (id_expediente);


--
-- Name: guia_clinica guia_clinica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guia_clinica
    ADD CONSTRAINT guia_clinica_pkey PRIMARY KEY (id_guia_diagnostico);


--
-- Name: historia_clinica historia_clinica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historia_clinica
    ADD CONSTRAINT historia_clinica_pkey PRIMARY KEY (id_historia_clinica);


--
-- Name: inmunizaciones inmunizaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inmunizaciones
    ADD CONSTRAINT inmunizaciones_pkey PRIMARY KEY (id_inmunizacion);


--
-- Name: internamiento internamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_pkey PRIMARY KEY (id_internamiento);


--
-- Name: medicamento medicamento_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamento
    ADD CONSTRAINT medicamento_codigo_key UNIQUE (codigo);


--
-- Name: medicamento medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicamento
    ADD CONSTRAINT medicamento_pkey PRIMARY KEY (id_medicamento);


--
-- Name: nota_egreso nota_egreso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_egreso
    ADD CONSTRAINT nota_egreso_pkey PRIMARY KEY (id_nota_egreso);


--
-- Name: nota_evolucion nota_evolucion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_evolucion
    ADD CONSTRAINT nota_evolucion_pkey PRIMARY KEY (id_nota_evolucion);


--
-- Name: nota_interconsulta nota_interconsulta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_pkey PRIMARY KEY (id_nota_interconsulta);


--
-- Name: nota_nutricion nota_nutricion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_nutricion
    ADD CONSTRAINT nota_nutricion_pkey PRIMARY KEY (id_nota_nutricion);


--
-- Name: nota_postanestesica nota_postanestesica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postanestesica
    ADD CONSTRAINT nota_postanestesica_pkey PRIMARY KEY (id_nota_postanestesica);


--
-- Name: nota_postoperatoria nota_postoperatoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_pkey PRIMARY KEY (id_nota_postoperatoria);


--
-- Name: nota_preanestesica nota_preanestesica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_preanestesica
    ADD CONSTRAINT nota_preanestesica_pkey PRIMARY KEY (id_nota_preanestesica);


--
-- Name: nota_preoperatoria nota_preoperatoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_preoperatoria
    ADD CONSTRAINT nota_preoperatoria_pkey PRIMARY KEY (id_nota_preoperatoria);


--
-- Name: nota_psicologia nota_psicologia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_psicologia
    ADD CONSTRAINT nota_psicologia_pkey PRIMARY KEY (id_nota_psicologia);


--
-- Name: nota_urgencias nota_urgencias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_urgencias
    ADD CONSTRAINT nota_urgencias_pkey PRIMARY KEY (id_nota_urgencias);


--
-- Name: paciente paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (id_paciente);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id_reset_token);


--
-- Name: password_reset_tokens password_reset_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);


--
-- Name: persona persona_curp_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_curp_key UNIQUE (curp);


--
-- Name: persona persona_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id_persona);


--
-- Name: personal_medico personal_medico_numero_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_medico
    ADD CONSTRAINT personal_medico_numero_cedula_key UNIQUE (numero_cedula);


--
-- Name: personal_medico personal_medico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_medico
    ADD CONSTRAINT personal_medico_pkey PRIMARY KEY (id_personal_medico);


--
-- Name: personal_medico personal_medico_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_medico
    ADD CONSTRAINT personal_medico_usuario_key UNIQUE (usuario);


--
-- Name: prescripcion_medicamento prescripcion_medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescripcion_medicamento
    ADD CONSTRAINT prescripcion_medicamento_pkey PRIMARY KEY (id_prescripcion);


--
-- Name: referencia_traslado referencia_traslado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referencia_traslado
    ADD CONSTRAINT referencia_traslado_pkey PRIMARY KEY (id_referencia);


--
-- Name: registro_transfusion registro_transfusion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_transfusion
    ADD CONSTRAINT registro_transfusion_pkey PRIMARY KEY (id_transfusion);


--
-- Name: servicio servicio_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_nombre_key UNIQUE (nombre);


--
-- Name: servicio servicio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_pkey PRIMARY KEY (id_servicio);


--
-- Name: signos_vitales signos_vitales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signos_vitales
    ADD CONSTRAINT signos_vitales_pkey PRIMARY KEY (id_signos_vitales);


--
-- Name: solicitud_estudio solicitud_estudio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_estudio
    ADD CONSTRAINT solicitud_estudio_pkey PRIMARY KEY (id_solicitud);


--
-- Name: tipo_documento tipo_documento_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_documento
    ADD CONSTRAINT tipo_documento_nombre_key UNIQUE (nombre);


--
-- Name: tipo_documento tipo_documento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_documento
    ADD CONSTRAINT tipo_documento_pkey PRIMARY KEY (id_tipo_documento);


--
-- Name: tipo_sangre tipo_sangre_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_sangre
    ADD CONSTRAINT tipo_sangre_nombre_key UNIQUE (nombre);


--
-- Name: tipo_sangre tipo_sangre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_sangre
    ADD CONSTRAINT tipo_sangre_pkey PRIMARY KEY (id_tipo_sangre);


--
-- Name: vacunas_adicionales vacunas_adicionales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacunas_adicionales
    ADD CONSTRAINT vacunas_adicionales_pkey PRIMARY KEY (id_vacuna_adicional);


--
-- Name: validacion_reingreso validacion_reingreso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validacion_reingreso
    ADD CONSTRAINT validacion_reingreso_pkey PRIMARY KEY (id_validacion);


--
-- Name: idx_alertas_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alertas_estado ON public.alertas_sistema USING btree (estado);


--
-- Name: idx_alertas_expediente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alertas_expediente ON public.alertas_sistema USING btree (id_expediente);


--
-- Name: idx_alertas_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alertas_tipo ON public.alertas_sistema USING btree (tipo_alerta);


--
-- Name: idx_antecedentes_hf_historia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_antecedentes_hf_historia ON public.antecedentes_heredo_familiares USING btree (id_historia_clinica);


--
-- Name: idx_auditoria_accion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_accion ON public.expediente_auditoria USING btree (accion);


--
-- Name: idx_auditoria_expediente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_expediente ON public.expediente_auditoria USING btree (id_expediente);


--
-- Name: idx_auditoria_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_fecha ON public.expediente_auditoria USING btree (fecha_acceso);


--
-- Name: idx_auditoria_medico; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_medico ON public.expediente_auditoria USING btree (id_medico);


--
-- Name: idx_cama_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cama_estado ON public.cama USING btree (estado);


--
-- Name: idx_catalogo_vacunas_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_catalogo_vacunas_nombre ON public.catalogo_vacunas USING btree (nombre_vacuna);


--
-- Name: idx_catalogo_vacunas_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_catalogo_vacunas_tipo ON public.catalogo_vacunas USING btree (tipo_vacuna);


--
-- Name: idx_control_acceso_expediente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_control_acceso_expediente ON public.control_acceso_historico USING btree (id_expediente);


--
-- Name: idx_control_acceso_medico; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_control_acceso_medico ON public.control_acceso_historico USING btree (id_medico);


--
-- Name: idx_desarrollo_psicomotriz_historia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_desarrollo_psicomotriz_historia ON public.desarrollo_psicomotriz USING btree (id_historia_clinica);


--
-- Name: idx_documento_creador; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documento_creador ON public.documento_clinico USING btree (id_personal_creador);


--
-- Name: idx_documento_expediente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documento_expediente ON public.documento_clinico USING btree (id_expediente);


--
-- Name: idx_documento_texto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documento_texto ON public.documento_clinico USING gin (texto_busqueda);


--
-- Name: idx_expediente_administrativo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expediente_administrativo ON public.expediente USING btree (numero_expediente_administrativo);


--
-- Name: idx_expediente_numero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expediente_numero ON public.expediente USING btree (numero_expediente);


--
-- Name: idx_expediente_paciente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expediente_paciente ON public.expediente USING btree (id_paciente);


--
-- Name: idx_historia_pediatrica; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historia_pediatrica ON public.historia_clinica USING btree (tipo_historia) WHERE (tipo_historia = 'pediatrica'::text);


--
-- Name: idx_inmunizaciones_historia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inmunizaciones_historia ON public.inmunizaciones USING btree (id_historia_clinica);


--
-- Name: idx_internamiento_fecha_ingreso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_internamiento_fecha_ingreso ON public.internamiento USING btree (fecha_ingreso);


--
-- Name: idx_internamiento_servicio_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_internamiento_servicio_activo ON public.internamiento USING btree (id_servicio) WHERE (fecha_egreso IS NULL);


--
-- Name: idx_nota_evolucion_documento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nota_evolucion_documento ON public.nota_evolucion USING btree (id_documento);


--
-- Name: idx_nota_evolucion_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nota_evolucion_fecha ON public.nota_evolucion USING btree (fecha_elaboracion);


--
-- Name: idx_nutricional_pediatrico_historia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nutricional_pediatrico_historia ON public.estado_nutricional_pediatrico USING btree (id_historia_clinica);


--
-- Name: idx_paciente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_paciente_id ON public.paciente USING btree (id_persona);


--
-- Name: idx_password_reset_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_active ON public.password_reset_tokens USING btree (is_active, expires_at) WHERE (is_active = true);


--
-- Name: idx_password_reset_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_email ON public.password_reset_tokens USING btree (email);


--
-- Name: idx_password_reset_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_expires ON public.password_reset_tokens USING btree (expires_at);


--
-- Name: idx_password_reset_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_token ON public.password_reset_tokens USING btree (token);


--
-- Name: idx_password_reset_user_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_user_type ON public.password_reset_tokens USING btree (tipo_usuario, id_usuario_referencia);


--
-- Name: idx_perinatales_historia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_perinatales_historia ON public.antecedentes_perinatales USING btree (id_historia_clinica);


--
-- Name: idx_persona_nombres; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_persona_nombres ON public.persona USING btree (apellido_paterno, apellido_materno, nombre);


--
-- Name: idx_persona_pediatrico; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_persona_pediatrico ON public.persona USING btree (es_pediatrico) WHERE (es_pediatrico = true);


--
-- Name: idx_vacunas_adicionales_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vacunas_adicionales_fecha ON public.vacunas_adicionales USING btree (fecha_aplicacion);


--
-- Name: idx_vacunas_adicionales_inmunizacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vacunas_adicionales_inmunizacion ON public.vacunas_adicionales USING btree (id_inmunizacion);


--
-- Name: idx_vacunas_adicionales_vacuna; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vacunas_adicionales_vacuna ON public.vacunas_adicionales USING btree (id_vacuna);


--
-- Name: idx_vista_evolucion_expediente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vista_evolucion_expediente ON public.nota_evolucion USING btree (id_documento) INCLUDE (dias_hospitalizacion, fecha_ultimo_ingreso);


--
-- Name: nota_evolucion trg_auto_llenar_nota_evolucion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auto_llenar_nota_evolucion BEFORE INSERT OR UPDATE ON public.nota_evolucion FOR EACH ROW EXECUTE FUNCTION public.auto_llenar_nota_evolucion();


--
-- Name: persona trg_detectar_cambios_sospechosos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_detectar_cambios_sospechosos AFTER UPDATE ON public.persona FOR EACH ROW EXECUTE FUNCTION public.detectar_cambios_sospechosos();


--
-- Name: password_reset_tokens trg_limpiar_tokens_auto; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_limpiar_tokens_auto AFTER INSERT ON public.password_reset_tokens FOR EACH STATEMENT EXECUTE FUNCTION public.trigger_limpiar_tokens();


--
-- Name: persona trg_validar_curp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_curp BEFORE INSERT OR UPDATE ON public.persona FOR EACH ROW EXECUTE FUNCTION public.validar_curp();


--
-- Name: internamiento trg_validar_fechas_egreso; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_fechas_egreso BEFORE INSERT OR UPDATE ON public.internamiento FOR EACH ROW EXECUTE FUNCTION public.validar_fechas_egreso();


--
-- Name: administrador administrador_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id_persona);


--
-- Name: alertas_sistema alertas_sistema_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_sistema
    ADD CONSTRAINT alertas_sistema_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- Name: alertas_sistema alertas_sistema_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_sistema
    ADD CONSTRAINT alertas_sistema_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: alertas_sistema alertas_sistema_id_medico_revisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_sistema
    ADD CONSTRAINT alertas_sistema_id_medico_revisor_fkey FOREIGN KEY (id_medico_revisor) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: antecedentes_heredo_familiares antecedentes_heredo_familiares_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedentes_heredo_familiares
    ADD CONSTRAINT antecedentes_heredo_familiares_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- Name: antecedentes_perinatales antecedentes_perinatales_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedentes_perinatales
    ADD CONSTRAINT antecedentes_perinatales_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- Name: cama cama_id_servicio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_id_servicio_fkey FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio);


--
-- Name: configuracion_sistema configuracion_sistema_id_modificador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_id_modificador_fkey FOREIGN KEY (id_modificador) REFERENCES public.administrador(id_administrador);


--
-- Name: consentimiento_informado consentimiento_informado_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consentimiento_informado
    ADD CONSTRAINT consentimiento_informado_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: consentimiento_informado consentimiento_informado_id_medico_informa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consentimiento_informado
    ADD CONSTRAINT consentimiento_informado_id_medico_informa_fkey FOREIGN KEY (id_medico_informa) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: control_acceso_historico control_acceso_historico_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_acceso_historico
    ADD CONSTRAINT control_acceso_historico_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- Name: control_acceso_historico control_acceso_historico_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_acceso_historico
    ADD CONSTRAINT control_acceso_historico_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: desarrollo_psicomotriz desarrollo_psicomotriz_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desarrollo_psicomotriz
    ADD CONSTRAINT desarrollo_psicomotriz_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- Name: documento_clinico documento_clinico_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- Name: documento_clinico documento_clinico_id_internamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_id_internamiento_fkey FOREIGN KEY (id_internamiento) REFERENCES public.internamiento(id_internamiento);


--
-- Name: documento_clinico documento_clinico_id_personal_creador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_id_personal_creador_fkey FOREIGN KEY (id_personal_creador) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: documento_clinico documento_clinico_id_tipo_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_id_tipo_documento_fkey FOREIGN KEY (id_tipo_documento) REFERENCES public.tipo_documento(id_tipo_documento);


--
-- Name: estado_nutricional_pediatrico estado_nutricional_pediatrico_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_nutricional_pediatrico
    ADD CONSTRAINT estado_nutricional_pediatrico_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- Name: expediente_auditoria expediente_auditoria_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente_auditoria
    ADD CONSTRAINT expediente_auditoria_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- Name: expediente_auditoria expediente_auditoria_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente_auditoria
    ADD CONSTRAINT expediente_auditoria_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: expediente expediente_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expediente
    ADD CONSTRAINT expediente_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.paciente(id_paciente);


--
-- Name: nota_evolucion fk_nota_evolucion_guia_clinica; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_evolucion
    ADD CONSTRAINT fk_nota_evolucion_guia_clinica FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- Name: historia_clinica historia_clinica_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historia_clinica
    ADD CONSTRAINT historia_clinica_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: historia_clinica historia_clinica_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historia_clinica
    ADD CONSTRAINT historia_clinica_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- Name: inmunizaciones inmunizaciones_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inmunizaciones
    ADD CONSTRAINT inmunizaciones_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- Name: internamiento internamiento_id_cama_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_id_cama_fkey FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama);


--
-- Name: internamiento internamiento_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- Name: internamiento internamiento_id_medico_responsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_id_medico_responsable_fkey FOREIGN KEY (id_medico_responsable) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: internamiento internamiento_id_servicio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_id_servicio_fkey FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio);


--
-- Name: nota_egreso nota_egreso_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_egreso
    ADD CONSTRAINT nota_egreso_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_egreso nota_egreso_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_egreso
    ADD CONSTRAINT nota_egreso_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- Name: nota_evolucion nota_evolucion_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_evolucion
    ADD CONSTRAINT nota_evolucion_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_interconsulta nota_interconsulta_area_interconsulta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_area_interconsulta_fkey FOREIGN KEY (area_interconsulta) REFERENCES public.area_interconsulta(id_area_interconsulta);


--
-- Name: nota_interconsulta nota_interconsulta_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_interconsulta nota_interconsulta_id_medico_interconsulta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_id_medico_interconsulta_fkey FOREIGN KEY (id_medico_interconsulta) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: nota_interconsulta nota_interconsulta_id_medico_solicitante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_id_medico_solicitante_fkey FOREIGN KEY (id_medico_solicitante) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: nota_nutricion nota_nutricion_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_nutricion
    ADD CONSTRAINT nota_nutricion_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_postanestesica nota_postanestesica_id_anestesiologo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postanestesica
    ADD CONSTRAINT nota_postanestesica_id_anestesiologo_fkey FOREIGN KEY (id_anestesiologo) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: nota_postanestesica nota_postanestesica_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postanestesica
    ADD CONSTRAINT nota_postanestesica_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_postoperatoria nota_postoperatoria_id_anestesiologo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_anestesiologo_fkey FOREIGN KEY (id_anestesiologo) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: nota_postoperatoria nota_postoperatoria_id_ayudante1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_ayudante1_fkey FOREIGN KEY (id_ayudante1) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: nota_postoperatoria nota_postoperatoria_id_ayudante2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_ayudante2_fkey FOREIGN KEY (id_ayudante2) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: nota_postoperatoria nota_postoperatoria_id_cirujano_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_cirujano_fkey FOREIGN KEY (id_cirujano) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: nota_postoperatoria nota_postoperatoria_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_preanestesica nota_preanestesica_id_anestesiologo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_preanestesica
    ADD CONSTRAINT nota_preanestesica_id_anestesiologo_fkey FOREIGN KEY (id_anestesiologo) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: nota_preanestesica nota_preanestesica_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_preanestesica
    ADD CONSTRAINT nota_preanestesica_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_preoperatoria nota_preoperatoria_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_preoperatoria
    ADD CONSTRAINT nota_preoperatoria_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_preoperatoria nota_preoperatoria_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_preoperatoria
    ADD CONSTRAINT nota_preoperatoria_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- Name: nota_psicologia nota_psicologia_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_psicologia
    ADD CONSTRAINT nota_psicologia_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_urgencias nota_urgencias_area_interconsulta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_urgencias
    ADD CONSTRAINT nota_urgencias_area_interconsulta_fkey FOREIGN KEY (area_interconsulta) REFERENCES public.area_interconsulta(id_area_interconsulta);


--
-- Name: nota_urgencias nota_urgencias_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_urgencias
    ADD CONSTRAINT nota_urgencias_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: nota_urgencias nota_urgencias_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_urgencias
    ADD CONSTRAINT nota_urgencias_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- Name: paciente paciente_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id_persona);


--
-- Name: persona persona_tipo_sangre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_tipo_sangre_id_fkey FOREIGN KEY (tipo_sangre_id) REFERENCES public.tipo_sangre(id_tipo_sangre);


--
-- Name: personal_medico personal_medico_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_medico
    ADD CONSTRAINT personal_medico_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id_persona);


--
-- Name: prescripcion_medicamento prescripcion_medicamento_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescripcion_medicamento
    ADD CONSTRAINT prescripcion_medicamento_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: prescripcion_medicamento prescripcion_medicamento_id_medicamento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescripcion_medicamento
    ADD CONSTRAINT prescripcion_medicamento_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES public.medicamento(id_medicamento);


--
-- Name: referencia_traslado referencia_traslado_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referencia_traslado
    ADD CONSTRAINT referencia_traslado_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: referencia_traslado referencia_traslado_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referencia_traslado
    ADD CONSTRAINT referencia_traslado_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- Name: registro_transfusion registro_transfusion_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_transfusion
    ADD CONSTRAINT registro_transfusion_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: registro_transfusion registro_transfusion_id_medico_responsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_transfusion
    ADD CONSTRAINT registro_transfusion_id_medico_responsable_fkey FOREIGN KEY (id_medico_responsable) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: signos_vitales signos_vitales_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signos_vitales
    ADD CONSTRAINT signos_vitales_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: solicitud_estudio solicitud_estudio_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_estudio
    ADD CONSTRAINT solicitud_estudio_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- Name: solicitud_estudio solicitud_estudio_id_estudio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_estudio
    ADD CONSTRAINT solicitud_estudio_id_estudio_fkey FOREIGN KEY (id_estudio) REFERENCES public.estudio_medico(id_estudio);


--
-- Name: vacunas_adicionales vacunas_adicionales_id_inmunizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacunas_adicionales
    ADD CONSTRAINT vacunas_adicionales_id_inmunizacion_fkey FOREIGN KEY (id_inmunizacion) REFERENCES public.inmunizaciones(id_inmunizacion);


--
-- Name: vacunas_adicionales vacunas_adicionales_id_vacuna_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacunas_adicionales
    ADD CONSTRAINT vacunas_adicionales_id_vacuna_fkey FOREIGN KEY (id_vacuna) REFERENCES public.catalogo_vacunas(id_vacuna);


--
-- Name: vacunas_adicionales vacunas_adicionales_registrado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacunas_adicionales
    ADD CONSTRAINT vacunas_adicionales_registrado_por_fkey FOREIGN KEY (registrado_por) REFERENCES public.personal_medico(id_personal_medico);


--
-- Name: validacion_reingreso validacion_reingreso_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validacion_reingreso
    ADD CONSTRAINT validacion_reingreso_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- Name: validacion_reingreso validacion_reingreso_id_internamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validacion_reingreso
    ADD CONSTRAINT validacion_reingreso_id_internamiento_fkey FOREIGN KEY (id_internamiento) REFERENCES public.internamiento(id_internamiento);


--
-- Name: validacion_reingreso validacion_reingreso_id_medico_validador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validacion_reingreso
    ADD CONSTRAINT validacion_reingreso_id_medico_validador_fkey FOREIGN KEY (id_medico_validador) REFERENCES public.personal_medico(id_personal_medico);


--
-- PostgreSQL database dump complete
--

