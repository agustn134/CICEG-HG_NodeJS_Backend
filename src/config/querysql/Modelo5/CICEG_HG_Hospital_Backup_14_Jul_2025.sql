--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

-- Started on 2025-07-14 23:08:03 CST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16392)
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- TOC entry 4344 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- TOC entry 991 (class 1247 OID 16474)
-- Name: derechohabiente_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.derechohabiente_enum AS ENUM (
    'IMSS',
    'ISSSTE',
    'Ninguno',
    'Otro'
);


--
-- TOC entry 994 (class 1247 OID 16484)
-- Name: estado_cama_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_cama_enum AS ENUM (
    'Disponible',
    'Ocupada',
    'Mantenimiento',
    'Reservada',
    'Contaminada'
);


--
-- TOC entry 997 (class 1247 OID 16496)
-- Name: estado_civil_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_civil_enum AS ENUM (
    'Soltero(a)',
    'Casado(a)',
    'Divorciado(a)',
    'Viudo(a)',
    'Unión libre',
    'Otro'
);


--
-- TOC entry 1000 (class 1247 OID 16510)
-- Name: estado_documento_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_documento_enum AS ENUM (
    'Activo',
    'Cancelado',
    'Anulado',
    'Borrador'
);


--
-- TOC entry 1003 (class 1247 OID 16520)
-- Name: programa_social_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.programa_social_enum AS ENUM (
    'Ninguno',
    'Oportunidades',
    'PROSPERA',
    'Otro'
);


--
-- TOC entry 1006 (class 1247 OID 16530)
-- Name: sexo_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sexo_enum AS ENUM (
    'M',
    'F',
    'O'
);


--
-- TOC entry 1009 (class 1247 OID 16538)
-- Name: tipo_alimentacion_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipo_alimentacion_enum AS ENUM (
    'Seno materno exclusivo',
    'Formula',
    'Mixta',
    'Complementaria'
);


--
-- TOC entry 1012 (class 1247 OID 16548)
-- Name: tipo_egreso_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipo_egreso_enum AS ENUM (
    'Alta voluntaria',
    'Mejoría',
    'Referencia',
    'Defunción',
    'Máximo beneficio'
);


--
-- TOC entry 1015 (class 1247 OID 16560)
-- Name: tipo_parto_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipo_parto_enum AS ENUM (
    'Vaginal',
    'Cesarea'
);


--
-- TOC entry 363 (class 1255 OID 16565)
-- Name: agregar_vacuna_adicional(integer, text, date, integer, text, text, text, text, text, text, text, text, integer); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 4345 (class 0 OID 0)
-- Dependencies: 363
-- Name: FUNCTION agregar_vacuna_adicional(p_id_inmunizacion integer, p_nombre_vacuna text, p_fecha_aplicacion date, p_dosis_numero integer, p_lote_vacuna text, p_laboratorio text, p_via_administracion text, p_sitio_aplicacion text, p_aplicada_por text, p_institucion text, p_reacciones text, p_observaciones text, p_registrado_por integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.agregar_vacuna_adicional(p_id_inmunizacion integer, p_nombre_vacuna text, p_fecha_aplicacion date, p_dosis_numero integer, p_lote_vacuna text, p_laboratorio text, p_via_administracion text, p_sitio_aplicacion text, p_aplicada_por text, p_institucion text, p_reacciones text, p_observaciones text, p_registrado_por integer) IS 'Función para agregar cualquier vacuna adicional al esquema básico';


--
-- TOC entry 364 (class 1255 OID 16566)
-- Name: auto_llenar_nota_evolucion(); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 365 (class 1255 OID 16567)
-- Name: buscar_pacientes(text, text, text, text, boolean); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 4346 (class 0 OID 0)
-- Dependencies: 365
-- Name: FUNCTION buscar_pacientes(p_nombre text, p_apellido text, p_curp text, p_numero_expediente text, p_solo_pediatricos boolean); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.buscar_pacientes(p_nombre text, p_apellido text, p_curp text, p_numero_expediente text, p_solo_pediatricos boolean) IS 'Función de búsqueda avanzada de pacientes';


--
-- TOC entry 366 (class 1255 OID 16568)
-- Name: calcular_dias_hospitalizacion(integer); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 346 (class 1255 OID 16569)
-- Name: calcular_edad_actual(date); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 4347 (class 0 OID 0)
-- Dependencies: 346
-- Name: FUNCTION calcular_edad_actual(fecha_nacimiento date); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.calcular_edad_actual(fecha_nacimiento date) IS 'Calcula edad detallada (años, meses, días) a partir de fecha de nacimiento';


--
-- TOC entry 347 (class 1255 OID 16570)
-- Name: calcular_edad_meses(date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calcular_edad_meses(fecha_nacimiento date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) * 12 + 
         EXTRACT(MONTH FROM AGE(fecha_nacimiento));
END;
$$;


--
-- TOC entry 367 (class 1255 OID 16571)
-- Name: crear_nota_evolucion_con_plantilla(integer, integer, text, text, text, text, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 368 (class 1255 OID 16572)
-- Name: detectar_cambios_sospechosos(); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 369 (class 1255 OID 16573)
-- Name: edad_en_anos(date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.edad_en_anos(fecha_nacimiento date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(fecha_nacimiento))::INT;
END;
$$;


--
-- TOC entry 370 (class 1255 OID 16574)
-- Name: edad_total_meses(date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.edad_total_meses(fecha_nacimiento date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN (EXTRACT(YEAR FROM AGE(fecha_nacimiento)) * 12 + 
          EXTRACT(MONTH FROM AGE(fecha_nacimiento)))::INT;
END;
$$;


--
-- TOC entry 371 (class 1255 OID 16575)
-- Name: estadisticas_servicio(integer); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 4348 (class 0 OID 0)
-- Dependencies: 371
-- Name: FUNCTION estadisticas_servicio(p_id_servicio integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.estadisticas_servicio(p_id_servicio integer) IS 'Función para generar reportes estadísticos por servicio';


--
-- TOC entry 372 (class 1255 OID 16576)
-- Name: obtener_historial_vacunas_completo(integer); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 373 (class 1255 OID 16577)
-- Name: obtener_signos_vitales_recientes(integer); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 350 (class 1255 OID 16578)
-- Name: registrar_auditoria(integer, integer, text, jsonb, jsonb, text); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 355 (class 1255 OID 16579)
-- Name: validar_curp(); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 4349 (class 0 OID 0)
-- Dependencies: 355
-- Name: FUNCTION validar_curp(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.validar_curp() IS 'Función trigger para validar formato de CURP mexicano';


--
-- TOC entry 348 (class 1255 OID 16580)
-- Name: validar_desarrollo_psicomotriz(integer, integer, integer, integer); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 349 (class 1255 OID 16581)
-- Name: validar_fechas_egreso(); Type: FUNCTION; Schema: public; Owner: -
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


--
-- TOC entry 374 (class 1255 OID 16582)
-- Name: validar_reingreso_paciente(integer, integer); Type: FUNCTION; Schema: public; Owner: -
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


SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16583)
-- Name: documento_clinico; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4350 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE documento_clinico; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.documento_clinico IS 'Tabla base para almacenar documentos clínicos generales.';


--
-- TOC entry 4351 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN documento_clinico.id_tipo_documento; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.documento_clinico.id_tipo_documento IS 'Clave foránea a tipo_documento.';


--
-- TOC entry 217 (class 1259 OID 16590)
-- Name: persona; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 218 (class 1259 OID 16598)
-- Name: personal_medico; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 219 (class 1259 OID 16604)
-- Name: actividad_medica_reciente; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 220 (class 1259 OID 16609)
-- Name: expediente_auditoria; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4352 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE expediente_auditoria; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.expediente_auditoria IS 'Registro de auditoría para control anti-pereza médica.';


--
-- TOC entry 221 (class 1259 OID 16615)
-- Name: actividad_medicos; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 222 (class 1259 OID 16620)
-- Name: administrador; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 223 (class 1259 OID 16626)
-- Name: administrador_id_administrador_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.administrador_id_administrador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4353 (class 0 OID 0)
-- Dependencies: 223
-- Name: administrador_id_administrador_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.administrador_id_administrador_seq OWNED BY public.administrador.id_administrador;


--
-- TOC entry 224 (class 1259 OID 16627)
-- Name: alertas_sistema; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4354 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE alertas_sistema; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.alertas_sistema IS 'Sistema de alertas para cambios sospechosos.';


--
-- TOC entry 225 (class 1259 OID 16634)
-- Name: alertas_sistema_id_alerta_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alertas_sistema_id_alerta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4355 (class 0 OID 0)
-- Dependencies: 225
-- Name: alertas_sistema_id_alerta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alertas_sistema_id_alerta_seq OWNED BY public.alertas_sistema.id_alerta;


--
-- TOC entry 226 (class 1259 OID 16635)
-- Name: antecedentes_heredo_familiares; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4356 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE antecedentes_heredo_familiares; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.antecedentes_heredo_familiares IS 'Antecedentes familiares detallados específicos para pediatría';


--
-- TOC entry 227 (class 1259 OID 16641)
-- Name: antecedentes_heredo_familiares_id_antecedentes_hf_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.antecedentes_heredo_familiares_id_antecedentes_hf_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4357 (class 0 OID 0)
-- Dependencies: 227
-- Name: antecedentes_heredo_familiares_id_antecedentes_hf_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.antecedentes_heredo_familiares_id_antecedentes_hf_seq OWNED BY public.antecedentes_heredo_familiares.id_antecedentes_hf;


--
-- TOC entry 228 (class 1259 OID 16642)
-- Name: antecedentes_perinatales; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4358 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE antecedentes_perinatales; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.antecedentes_perinatales IS 'Antecedentes del embarazo, parto y periodo neonatal';


--
-- TOC entry 229 (class 1259 OID 16648)
-- Name: antecedentes_perinatales_id_perinatales_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.antecedentes_perinatales_id_perinatales_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4359 (class 0 OID 0)
-- Dependencies: 229
-- Name: antecedentes_perinatales_id_perinatales_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.antecedentes_perinatales_id_perinatales_seq OWNED BY public.antecedentes_perinatales.id_perinatales;


--
-- TOC entry 230 (class 1259 OID 16649)
-- Name: area_interconsulta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.area_interconsulta (
    id_area_interconsulta integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


--
-- TOC entry 231 (class 1259 OID 16655)
-- Name: area_interconsulta_id_area_interconsulta_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.area_interconsulta_id_area_interconsulta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4360 (class 0 OID 0)
-- Dependencies: 231
-- Name: area_interconsulta_id_area_interconsulta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.area_interconsulta_id_area_interconsulta_seq OWNED BY public.area_interconsulta.id_area_interconsulta;


--
-- TOC entry 232 (class 1259 OID 16656)
-- Name: cama; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 233 (class 1259 OID 16662)
-- Name: cama_id_cama_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cama_id_cama_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4361 (class 0 OID 0)
-- Dependencies: 233
-- Name: cama_id_cama_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cama_id_cama_seq OWNED BY public.cama.id_cama;


--
-- TOC entry 234 (class 1259 OID 16663)
-- Name: catalogo_vacunas; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4362 (class 0 OID 0)
-- Dependencies: 234
-- Name: TABLE catalogo_vacunas; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.catalogo_vacunas IS 'Catálogo de vacunas adicionales no contempladas en el esquema básico';


--
-- TOC entry 235 (class 1259 OID 16671)
-- Name: catalogo_vacunas_id_vacuna_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.catalogo_vacunas_id_vacuna_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4363 (class 0 OID 0)
-- Dependencies: 235
-- Name: catalogo_vacunas_id_vacuna_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.catalogo_vacunas_id_vacuna_seq OWNED BY public.catalogo_vacunas.id_vacuna;


--
-- TOC entry 236 (class 1259 OID 16672)
-- Name: configuracion_sistema; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuracion_sistema (
    id_config integer NOT NULL,
    parametro text NOT NULL,
    valor text NOT NULL,
    descripcion text,
    fecha_modificacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_modificador integer
);


--
-- TOC entry 237 (class 1259 OID 16678)
-- Name: configuracion_sistema_id_config_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.configuracion_sistema_id_config_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4364 (class 0 OID 0)
-- Dependencies: 237
-- Name: configuracion_sistema_id_config_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.configuracion_sistema_id_config_seq OWNED BY public.configuracion_sistema.id_config;


--
-- TOC entry 238 (class 1259 OID 16679)
-- Name: consentimiento_informado; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 239 (class 1259 OID 16687)
-- Name: consentimiento_informado_id_consentimiento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.consentimiento_informado_id_consentimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4365 (class 0 OID 0)
-- Dependencies: 239
-- Name: consentimiento_informado_id_consentimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.consentimiento_informado_id_consentimiento_seq OWNED BY public.consentimiento_informado.id_consentimiento;


--
-- TOC entry 240 (class 1259 OID 16688)
-- Name: control_acceso_historico; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 241 (class 1259 OID 16696)
-- Name: control_acceso_historico_id_control_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.control_acceso_historico_id_control_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4366 (class 0 OID 0)
-- Dependencies: 241
-- Name: control_acceso_historico_id_control_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.control_acceso_historico_id_control_seq OWNED BY public.control_acceso_historico.id_control;


--
-- TOC entry 242 (class 1259 OID 16697)
-- Name: expediente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expediente (
    id_expediente integer NOT NULL,
    id_paciente integer NOT NULL,
    numero_expediente text NOT NULL,
    fecha_apertura timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado text DEFAULT 'Activo'::text,
    notas_administrativas text
);


--
-- TOC entry 243 (class 1259 OID 16704)
-- Name: internamiento; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 244 (class 1259 OID 16710)
-- Name: servicio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servicio (
    id_servicio integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


--
-- TOC entry 245 (class 1259 OID 16716)
-- Name: dashboard_general; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 4367 (class 0 OID 0)
-- Dependencies: 245
-- Name: VIEW dashboard_general; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.dashboard_general IS 'Vista principal para dashboard administrativo del hospital';


--
-- TOC entry 246 (class 1259 OID 16721)
-- Name: desarrollo_psicomotriz; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4368 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE desarrollo_psicomotriz; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.desarrollo_psicomotriz IS 'Seguimiento de hitos del desarrollo psicomotriz';


--
-- TOC entry 247 (class 1259 OID 16729)
-- Name: desarrollo_psicomotriz_id_desarrollo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.desarrollo_psicomotriz_id_desarrollo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4369 (class 0 OID 0)
-- Dependencies: 247
-- Name: desarrollo_psicomotriz_id_desarrollo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.desarrollo_psicomotriz_id_desarrollo_seq OWNED BY public.desarrollo_psicomotriz.id_desarrollo;


--
-- TOC entry 248 (class 1259 OID 16730)
-- Name: historia_clinica; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 249 (class 1259 OID 16736)
-- Name: inmunizaciones; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4370 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE inmunizaciones; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.inmunizaciones IS 'Control del esquema de vacunación pediátrico';


--
-- TOC entry 250 (class 1259 OID 16743)
-- Name: paciente; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 251 (class 1259 OID 16749)
-- Name: vacunas_adicionales; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4371 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE vacunas_adicionales; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.vacunas_adicionales IS 'Registro de vacunas aplicadas que no están en el esquema básico de inmunizaciones';


--
-- TOC entry 4372 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN vacunas_adicionales.nombre_vacuna_libre; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.vacunas_adicionales.nombre_vacuna_libre IS 'Para vacunas que no están en el catálogo - escribir libremente';


--
-- TOC entry 252 (class 1259 OID 16756)
-- Name: detalle_vacunas_adicionales; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 253 (class 1259 OID 16761)
-- Name: documento_clinico_id_documento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.documento_clinico_id_documento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4373 (class 0 OID 0)
-- Dependencies: 253
-- Name: documento_clinico_id_documento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.documento_clinico_id_documento_seq OWNED BY public.documento_clinico.id_documento;


--
-- TOC entry 254 (class 1259 OID 16762)
-- Name: tipo_documento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_documento (
    id_tipo_documento integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


--
-- TOC entry 255 (class 1259 OID 16768)
-- Name: expediente_pediatrico_completo; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 256 (class 1259 OID 16773)
-- Name: esquema_vacunacion; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 257 (class 1259 OID 16778)
-- Name: esquema_vacunacion_completo; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 258 (class 1259 OID 16783)
-- Name: estado_nutricional_pediatrico; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4374 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE estado_nutricional_pediatrico; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.estado_nutricional_pediatrico IS 'Evaluación nutricional específica pediátrica';


--
-- TOC entry 259 (class 1259 OID 16791)
-- Name: estado_nutricional_pediatrico_id_nutricional_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estado_nutricional_pediatrico_id_nutricional_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4375 (class 0 OID 0)
-- Dependencies: 259
-- Name: estado_nutricional_pediatrico_id_nutricional_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estado_nutricional_pediatrico_id_nutricional_seq OWNED BY public.estado_nutricional_pediatrico.id_nutricional;


--
-- TOC entry 260 (class 1259 OID 16792)
-- Name: estudio_medico; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 261 (class 1259 OID 16799)
-- Name: estudio_medico_id_estudio_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estudio_medico_id_estudio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4376 (class 0 OID 0)
-- Dependencies: 261
-- Name: estudio_medico_id_estudio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estudio_medico_id_estudio_seq OWNED BY public.estudio_medico.id_estudio;


--
-- TOC entry 262 (class 1259 OID 16800)
-- Name: expediente_auditoria_id_auditoria_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.expediente_auditoria_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4377 (class 0 OID 0)
-- Dependencies: 262
-- Name: expediente_auditoria_id_auditoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.expediente_auditoria_id_auditoria_seq OWNED BY public.expediente_auditoria.id_auditoria;


--
-- TOC entry 263 (class 1259 OID 16801)
-- Name: expediente_id_expediente_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.expediente_id_expediente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4378 (class 0 OID 0)
-- Dependencies: 263
-- Name: expediente_id_expediente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.expediente_id_expediente_seq OWNED BY public.expediente.id_expediente;


--
-- TOC entry 264 (class 1259 OID 16802)
-- Name: expedientes_con_alertas; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 265 (class 1259 OID 16807)
-- Name: guia_clinica; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 266 (class 1259 OID 16813)
-- Name: guia_clinica_id_guia_diagnostico_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guia_clinica_id_guia_diagnostico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4379 (class 0 OID 0)
-- Dependencies: 266
-- Name: guia_clinica_id_guia_diagnostico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guia_clinica_id_guia_diagnostico_seq OWNED BY public.guia_clinica.id_guia_diagnostico;


--
-- TOC entry 267 (class 1259 OID 16814)
-- Name: historia_clinica_id_historia_clinica_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.historia_clinica_id_historia_clinica_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4380 (class 0 OID 0)
-- Dependencies: 267
-- Name: historia_clinica_id_historia_clinica_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.historia_clinica_id_historia_clinica_seq OWNED BY public.historia_clinica.id_historia_clinica;


--
-- TOC entry 268 (class 1259 OID 16815)
-- Name: inmunizaciones_id_inmunizacion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inmunizaciones_id_inmunizacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4381 (class 0 OID 0)
-- Dependencies: 268
-- Name: inmunizaciones_id_inmunizacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inmunizaciones_id_inmunizacion_seq OWNED BY public.inmunizaciones.id_inmunizacion;


--
-- TOC entry 269 (class 1259 OID 16816)
-- Name: internamiento_id_internamiento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.internamiento_id_internamiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4382 (class 0 OID 0)
-- Dependencies: 269
-- Name: internamiento_id_internamiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.internamiento_id_internamiento_seq OWNED BY public.internamiento.id_internamiento;


--
-- TOC entry 270 (class 1259 OID 16817)
-- Name: medicamento; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 271 (class 1259 OID 16823)
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medicamento_id_medicamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4383 (class 0 OID 0)
-- Dependencies: 271
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medicamento_id_medicamento_seq OWNED BY public.medicamento.id_medicamento;


--
-- TOC entry 272 (class 1259 OID 16824)
-- Name: nota_egreso; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 273 (class 1259 OID 16830)
-- Name: nota_egreso_id_nota_egreso_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_egreso_id_nota_egreso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4384 (class 0 OID 0)
-- Dependencies: 273
-- Name: nota_egreso_id_nota_egreso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_egreso_id_nota_egreso_seq OWNED BY public.nota_egreso.id_nota_egreso;


--
-- TOC entry 274 (class 1259 OID 16831)
-- Name: nota_evolucion; Type: TABLE; Schema: public; Owner: -
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
    observaciones_adicionales text
);


--
-- TOC entry 4385 (class 0 OID 0)
-- Dependencies: 274
-- Name: TABLE nota_evolucion; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.nota_evolucion IS 'Tabla de notas de evolución con formato específico del Hospital San Luis de la Paz';


--
-- TOC entry 4386 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.dias_hospitalizacion; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.dias_hospitalizacion IS 'Días de estancia hospitalaria - calculado automáticamente';


--
-- TOC entry 4387 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.sintomas_signos; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.sintomas_signos IS 'Campo obligatorio - SIGNOS Y SINTOMAS';


--
-- TOC entry 4388 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.habitus_exterior; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.habitus_exterior IS 'Campo obligatorio - HABITUS EXTERIOR';


--
-- TOC entry 4389 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.estado_nutricional; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.estado_nutricional IS 'Campo obligatorio - ESTADO NUTRICIONAL';


--
-- TOC entry 4390 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.estudios_laboratorio_gabinete; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.estudios_laboratorio_gabinete IS 'Campo obligatorio - ESTUDIOS DE LABORATORIO Y GABINETE';


--
-- TOC entry 4391 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.evolucion_analisis; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.evolucion_analisis IS 'Campo obligatorio - EVOLUCIÓN Y ACTUALIZACIÓN DE CUADRO CLÍNICO';


--
-- TOC entry 4392 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.diagnosticos; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.diagnosticos IS 'Campo obligatorio - DIAGNÓSTICOS';


--
-- TOC entry 4393 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.plan_estudios_tratamiento; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.plan_estudios_tratamiento IS 'Campo obligatorio - PLAN DE ESTUDIOS Y/O TRATAMIENTO';


--
-- TOC entry 4394 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.interconsultas; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.interconsultas IS 'Campo opcional - por defecto indica que no hubo interconsultas';


--
-- TOC entry 4395 (class 0 OID 0)
-- Dependencies: 274
-- Name: COLUMN nota_evolucion.pronostico; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nota_evolucion.pronostico IS 'Campo obligatorio - PRONÓSTICO';


--
-- TOC entry 275 (class 1259 OID 16838)
-- Name: nota_evolucion_id_nota_evolucion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_evolucion_id_nota_evolucion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4396 (class 0 OID 0)
-- Dependencies: 275
-- Name: nota_evolucion_id_nota_evolucion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_evolucion_id_nota_evolucion_seq OWNED BY public.nota_evolucion.id_nota_evolucion;


--
-- TOC entry 276 (class 1259 OID 16839)
-- Name: nota_interconsulta; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 277 (class 1259 OID 16846)
-- Name: nota_interconsulta_id_nota_interconsulta_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_interconsulta_id_nota_interconsulta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4397 (class 0 OID 0)
-- Dependencies: 277
-- Name: nota_interconsulta_id_nota_interconsulta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_interconsulta_id_nota_interconsulta_seq OWNED BY public.nota_interconsulta.id_nota_interconsulta;


--
-- TOC entry 278 (class 1259 OID 16847)
-- Name: nota_nutricion; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 279 (class 1259 OID 16852)
-- Name: nota_nutricion_id_nota_nutricion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_nutricion_id_nota_nutricion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4398 (class 0 OID 0)
-- Dependencies: 279
-- Name: nota_nutricion_id_nota_nutricion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_nutricion_id_nota_nutricion_seq OWNED BY public.nota_nutricion.id_nota_nutricion;


--
-- TOC entry 280 (class 1259 OID 16853)
-- Name: nota_postanestesica; Type: TABLE; Schema: public; Owner: -
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
    id_anestesiologo integer
);


--
-- TOC entry 281 (class 1259 OID 16858)
-- Name: nota_postanestesica_id_nota_postanestesica_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_postanestesica_id_nota_postanestesica_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4399 (class 0 OID 0)
-- Dependencies: 281
-- Name: nota_postanestesica_id_nota_postanestesica_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_postanestesica_id_nota_postanestesica_seq OWNED BY public.nota_postanestesica.id_nota_postanestesica;


--
-- TOC entry 282 (class 1259 OID 16859)
-- Name: nota_postoperatoria; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 283 (class 1259 OID 16864)
-- Name: nota_postoperatoria_id_nota_postoperatoria_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_postoperatoria_id_nota_postoperatoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4400 (class 0 OID 0)
-- Dependencies: 283
-- Name: nota_postoperatoria_id_nota_postoperatoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_postoperatoria_id_nota_postoperatoria_seq OWNED BY public.nota_postoperatoria.id_nota_postoperatoria;


--
-- TOC entry 284 (class 1259 OID 16865)
-- Name: nota_preanestesica; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 285 (class 1259 OID 16870)
-- Name: nota_preanestesica_id_nota_preanestesica_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_preanestesica_id_nota_preanestesica_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4401 (class 0 OID 0)
-- Dependencies: 285
-- Name: nota_preanestesica_id_nota_preanestesica_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_preanestesica_id_nota_preanestesica_seq OWNED BY public.nota_preanestesica.id_nota_preanestesica;


--
-- TOC entry 286 (class 1259 OID 16871)
-- Name: nota_preoperatoria; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 287 (class 1259 OID 16876)
-- Name: nota_preoperatoria_id_nota_preoperatoria_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_preoperatoria_id_nota_preoperatoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4402 (class 0 OID 0)
-- Dependencies: 287
-- Name: nota_preoperatoria_id_nota_preoperatoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_preoperatoria_id_nota_preoperatoria_seq OWNED BY public.nota_preoperatoria.id_nota_preoperatoria;


--
-- TOC entry 288 (class 1259 OID 16877)
-- Name: nota_psicologia; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 289 (class 1259 OID 16882)
-- Name: nota_psicologia_id_nota_psicologia_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_psicologia_id_nota_psicologia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4403 (class 0 OID 0)
-- Dependencies: 289
-- Name: nota_psicologia_id_nota_psicologia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_psicologia_id_nota_psicologia_seq OWNED BY public.nota_psicologia.id_nota_psicologia;


--
-- TOC entry 290 (class 1259 OID 16883)
-- Name: nota_urgencias; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 291 (class 1259 OID 16888)
-- Name: nota_urgencias_id_nota_urgencias_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nota_urgencias_id_nota_urgencias_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4404 (class 0 OID 0)
-- Dependencies: 291
-- Name: nota_urgencias_id_nota_urgencias_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nota_urgencias_id_nota_urgencias_seq OWNED BY public.nota_urgencias.id_nota_urgencias;


--
-- TOC entry 292 (class 1259 OID 16889)
-- Name: paciente_id_paciente_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.paciente_id_paciente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4405 (class 0 OID 0)
-- Dependencies: 292
-- Name: paciente_id_paciente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.paciente_id_paciente_seq OWNED BY public.paciente.id_paciente;


--
-- TOC entry 293 (class 1259 OID 16890)
-- Name: pacientes_pediatricos_activos; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 4406 (class 0 OID 0)
-- Dependencies: 293
-- Name: VIEW pacientes_pediatricos_activos; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.pacientes_pediatricos_activos IS 'Vista especializada para el área pediátrica';


--
-- TOC entry 294 (class 1259 OID 16895)
-- Name: persona_id_persona_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.persona_id_persona_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4407 (class 0 OID 0)
-- Dependencies: 294
-- Name: persona_id_persona_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.persona_id_persona_seq OWNED BY public.persona.id_persona;


--
-- TOC entry 295 (class 1259 OID 16896)
-- Name: personal_medico_id_personal_medico_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personal_medico_id_personal_medico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4408 (class 0 OID 0)
-- Dependencies: 295
-- Name: personal_medico_id_personal_medico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personal_medico_id_personal_medico_seq OWNED BY public.personal_medico.id_personal_medico;


--
-- TOC entry 296 (class 1259 OID 16897)
-- Name: prescripcion_medicamento; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 297 (class 1259 OID 16903)
-- Name: prescripcion_medicamento_id_prescripcion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.prescripcion_medicamento_id_prescripcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4409 (class 0 OID 0)
-- Dependencies: 297
-- Name: prescripcion_medicamento_id_prescripcion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.prescripcion_medicamento_id_prescripcion_seq OWNED BY public.prescripcion_medicamento.id_prescripcion;


--
-- TOC entry 298 (class 1259 OID 16904)
-- Name: referencia_traslado; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 299 (class 1259 OID 16909)
-- Name: referencia_traslado_id_referencia_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.referencia_traslado_id_referencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4410 (class 0 OID 0)
-- Dependencies: 299
-- Name: referencia_traslado_id_referencia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.referencia_traslado_id_referencia_seq OWNED BY public.referencia_traslado.id_referencia;


--
-- TOC entry 300 (class 1259 OID 16910)
-- Name: registro_transfusion; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 301 (class 1259 OID 16915)
-- Name: registro_transfusion_id_transfusion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.registro_transfusion_id_transfusion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4411 (class 0 OID 0)
-- Dependencies: 301
-- Name: registro_transfusion_id_transfusion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.registro_transfusion_id_transfusion_seq OWNED BY public.registro_transfusion.id_transfusion;


--
-- TOC entry 302 (class 1259 OID 16916)
-- Name: resumen_camas_servicio; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 4412 (class 0 OID 0)
-- Dependencies: 302
-- Name: VIEW resumen_camas_servicio; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.resumen_camas_servicio IS 'Vista para dashboard de ocupación de camas por servicio';


--
-- TOC entry 303 (class 1259 OID 16921)
-- Name: servicio_id_servicio_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servicio_id_servicio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4413 (class 0 OID 0)
-- Dependencies: 303
-- Name: servicio_id_servicio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servicio_id_servicio_seq OWNED BY public.servicio.id_servicio;


--
-- TOC entry 304 (class 1259 OID 16922)
-- Name: signos_vitales; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 305 (class 1259 OID 16928)
-- Name: signos_vitales_id_signos_vitales_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.signos_vitales_id_signos_vitales_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4414 (class 0 OID 0)
-- Dependencies: 305
-- Name: signos_vitales_id_signos_vitales_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.signos_vitales_id_signos_vitales_seq OWNED BY public.signos_vitales.id_signos_vitales;


--
-- TOC entry 306 (class 1259 OID 16929)
-- Name: solicitud_estudio; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 307 (class 1259 OID 16936)
-- Name: solicitud_estudio_id_solicitud_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solicitud_estudio_id_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4415 (class 0 OID 0)
-- Dependencies: 307
-- Name: solicitud_estudio_id_solicitud_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solicitud_estudio_id_solicitud_seq OWNED BY public.solicitud_estudio.id_solicitud;


--
-- TOC entry 308 (class 1259 OID 16937)
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_documento_id_tipo_documento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4416 (class 0 OID 0)
-- Dependencies: 308
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_documento_id_tipo_documento_seq OWNED BY public.tipo_documento.id_tipo_documento;


--
-- TOC entry 309 (class 1259 OID 16938)
-- Name: tipo_sangre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_sangre (
    id_tipo_sangre integer NOT NULL,
    nombre character varying(10) NOT NULL,
    descripcion text
);


--
-- TOC entry 310 (class 1259 OID 16943)
-- Name: tipo_sangre_id_tipo_sangre_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_sangre_id_tipo_sangre_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4417 (class 0 OID 0)
-- Dependencies: 310
-- Name: tipo_sangre_id_tipo_sangre_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_sangre_id_tipo_sangre_seq OWNED BY public.tipo_sangre.id_tipo_sangre;


--
-- TOC entry 311 (class 1259 OID 16944)
-- Name: vacunas_adicionales_id_vacuna_adicional_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vacunas_adicionales_id_vacuna_adicional_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4418 (class 0 OID 0)
-- Dependencies: 311
-- Name: vacunas_adicionales_id_vacuna_adicional_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vacunas_adicionales_id_vacuna_adicional_seq OWNED BY public.vacunas_adicionales.id_vacuna_adicional;


--
-- TOC entry 312 (class 1259 OID 16945)
-- Name: validacion_reingreso; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 4419 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE validacion_reingreso; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.validacion_reingreso IS 'Validaciones obligatorias en reingresos de pacientes.';


--
-- TOC entry 313 (class 1259 OID 16954)
-- Name: validacion_reingreso_id_validacion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.validacion_reingreso_id_validacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4420 (class 0 OID 0)
-- Dependencies: 313
-- Name: validacion_reingreso_id_validacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.validacion_reingreso_id_validacion_seq OWNED BY public.validacion_reingreso.id_validacion;


--
-- TOC entry 314 (class 1259 OID 16955)
-- Name: vista_nota_evolucion_completa; Type: VIEW; Schema: public; Owner: -
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


--
-- TOC entry 3784 (class 2604 OID 16960)
-- Name: administrador id_administrador; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.administrador ALTER COLUMN id_administrador SET DEFAULT nextval('public.administrador_id_administrador_seq'::regclass);


--
-- TOC entry 3787 (class 2604 OID 16961)
-- Name: alertas_sistema id_alerta; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas_sistema ALTER COLUMN id_alerta SET DEFAULT nextval('public.alertas_sistema_id_alerta_seq'::regclass);


--
-- TOC entry 3790 (class 2604 OID 16962)
-- Name: antecedentes_heredo_familiares id_antecedentes_hf; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedentes_heredo_familiares ALTER COLUMN id_antecedentes_hf SET DEFAULT nextval('public.antecedentes_heredo_familiares_id_antecedentes_hf_seq'::regclass);


--
-- TOC entry 3792 (class 2604 OID 16963)
-- Name: antecedentes_perinatales id_perinatales; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedentes_perinatales ALTER COLUMN id_perinatales SET DEFAULT nextval('public.antecedentes_perinatales_id_perinatales_seq'::regclass);


--
-- TOC entry 3794 (class 2604 OID 16964)
-- Name: area_interconsulta id_area_interconsulta; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.area_interconsulta ALTER COLUMN id_area_interconsulta SET DEFAULT nextval('public.area_interconsulta_id_area_interconsulta_seq'::regclass);


--
-- TOC entry 3796 (class 2604 OID 16965)
-- Name: cama id_cama; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cama ALTER COLUMN id_cama SET DEFAULT nextval('public.cama_id_cama_seq'::regclass);


--
-- TOC entry 3798 (class 2604 OID 16966)
-- Name: catalogo_vacunas id_vacuna; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_vacunas ALTER COLUMN id_vacuna SET DEFAULT nextval('public.catalogo_vacunas_id_vacuna_seq'::regclass);


--
-- TOC entry 3802 (class 2604 OID 16967)
-- Name: configuracion_sistema id_config; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion_sistema ALTER COLUMN id_config SET DEFAULT nextval('public.configuracion_sistema_id_config_seq'::regclass);


--
-- TOC entry 3804 (class 2604 OID 16968)
-- Name: consentimiento_informado id_consentimiento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consentimiento_informado ALTER COLUMN id_consentimiento SET DEFAULT nextval('public.consentimiento_informado_id_consentimiento_seq'::regclass);


--
-- TOC entry 3808 (class 2604 OID 16969)
-- Name: control_acceso_historico id_control; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.control_acceso_historico ALTER COLUMN id_control SET DEFAULT nextval('public.control_acceso_historico_id_control_seq'::regclass);


--
-- TOC entry 3818 (class 2604 OID 16970)
-- Name: desarrollo_psicomotriz id_desarrollo; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.desarrollo_psicomotriz ALTER COLUMN id_desarrollo SET DEFAULT nextval('public.desarrollo_psicomotriz_id_desarrollo_seq'::regclass);


--
-- TOC entry 3772 (class 2604 OID 16971)
-- Name: documento_clinico id_documento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_clinico ALTER COLUMN id_documento SET DEFAULT nextval('public.documento_clinico_id_documento_seq'::regclass);


--
-- TOC entry 3834 (class 2604 OID 16972)
-- Name: estado_nutricional_pediatrico id_nutricional; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_nutricional_pediatrico ALTER COLUMN id_nutricional SET DEFAULT nextval('public.estado_nutricional_pediatrico_id_nutricional_seq'::regclass);


--
-- TOC entry 3838 (class 2604 OID 16973)
-- Name: estudio_medico id_estudio; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudio_medico ALTER COLUMN id_estudio SET DEFAULT nextval('public.estudio_medico_id_estudio_seq'::regclass);


--
-- TOC entry 3812 (class 2604 OID 16974)
-- Name: expediente id_expediente; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expediente ALTER COLUMN id_expediente SET DEFAULT nextval('public.expediente_id_expediente_seq'::regclass);


--
-- TOC entry 3782 (class 2604 OID 16975)
-- Name: expediente_auditoria id_auditoria; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expediente_auditoria ALTER COLUMN id_auditoria SET DEFAULT nextval('public.expediente_auditoria_id_auditoria_seq'::regclass);


--
-- TOC entry 3841 (class 2604 OID 16976)
-- Name: guia_clinica id_guia_diagnostico; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guia_clinica ALTER COLUMN id_guia_diagnostico SET DEFAULT nextval('public.guia_clinica_id_guia_diagnostico_seq'::regclass);


--
-- TOC entry 3822 (class 2604 OID 16977)
-- Name: historia_clinica id_historia_clinica; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historia_clinica ALTER COLUMN id_historia_clinica SET DEFAULT nextval('public.historia_clinica_id_historia_clinica_seq'::regclass);


--
-- TOC entry 3824 (class 2604 OID 16978)
-- Name: inmunizaciones id_inmunizacion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inmunizaciones ALTER COLUMN id_inmunizacion SET DEFAULT nextval('public.inmunizaciones_id_inmunizacion_seq'::regclass);


--
-- TOC entry 3815 (class 2604 OID 16979)
-- Name: internamiento id_internamiento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internamiento ALTER COLUMN id_internamiento SET DEFAULT nextval('public.internamiento_id_internamiento_seq'::regclass);


--
-- TOC entry 3843 (class 2604 OID 16980)
-- Name: medicamento id_medicamento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicamento ALTER COLUMN id_medicamento SET DEFAULT nextval('public.medicamento_id_medicamento_seq'::regclass);


--
-- TOC entry 3845 (class 2604 OID 16981)
-- Name: nota_egreso id_nota_egreso; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_egreso ALTER COLUMN id_nota_egreso SET DEFAULT nextval('public.nota_egreso_id_nota_egreso_seq'::regclass);


--
-- TOC entry 3847 (class 2604 OID 16982)
-- Name: nota_evolucion id_nota_evolucion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_evolucion ALTER COLUMN id_nota_evolucion SET DEFAULT nextval('public.nota_evolucion_id_nota_evolucion_seq'::regclass);


--
-- TOC entry 3850 (class 2604 OID 16983)
-- Name: nota_interconsulta id_nota_interconsulta; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_interconsulta ALTER COLUMN id_nota_interconsulta SET DEFAULT nextval('public.nota_interconsulta_id_nota_interconsulta_seq'::regclass);


--
-- TOC entry 3853 (class 2604 OID 16984)
-- Name: nota_nutricion id_nota_nutricion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_nutricion ALTER COLUMN id_nota_nutricion SET DEFAULT nextval('public.nota_nutricion_id_nota_nutricion_seq'::regclass);


--
-- TOC entry 3854 (class 2604 OID 16985)
-- Name: nota_postanestesica id_nota_postanestesica; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postanestesica ALTER COLUMN id_nota_postanestesica SET DEFAULT nextval('public.nota_postanestesica_id_nota_postanestesica_seq'::regclass);


--
-- TOC entry 3855 (class 2604 OID 16986)
-- Name: nota_postoperatoria id_nota_postoperatoria; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postoperatoria ALTER COLUMN id_nota_postoperatoria SET DEFAULT nextval('public.nota_postoperatoria_id_nota_postoperatoria_seq'::regclass);


--
-- TOC entry 3856 (class 2604 OID 16987)
-- Name: nota_preanestesica id_nota_preanestesica; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_preanestesica ALTER COLUMN id_nota_preanestesica SET DEFAULT nextval('public.nota_preanestesica_id_nota_preanestesica_seq'::regclass);


--
-- TOC entry 3857 (class 2604 OID 16988)
-- Name: nota_preoperatoria id_nota_preoperatoria; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_preoperatoria ALTER COLUMN id_nota_preoperatoria SET DEFAULT nextval('public.nota_preoperatoria_id_nota_preoperatoria_seq'::regclass);


--
-- TOC entry 3858 (class 2604 OID 16989)
-- Name: nota_psicologia id_nota_psicologia; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_psicologia ALTER COLUMN id_nota_psicologia SET DEFAULT nextval('public.nota_psicologia_id_nota_psicologia_seq'::regclass);


--
-- TOC entry 3859 (class 2604 OID 16990)
-- Name: nota_urgencias id_nota_urgencias; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_urgencias ALTER COLUMN id_nota_urgencias SET DEFAULT nextval('public.nota_urgencias_id_nota_urgencias_seq'::regclass);


--
-- TOC entry 3827 (class 2604 OID 16991)
-- Name: paciente id_paciente; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente ALTER COLUMN id_paciente SET DEFAULT nextval('public.paciente_id_paciente_seq'::regclass);


--
-- TOC entry 3775 (class 2604 OID 16992)
-- Name: persona id_persona; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.persona ALTER COLUMN id_persona SET DEFAULT nextval('public.persona_id_persona_seq'::regclass);


--
-- TOC entry 3779 (class 2604 OID 16993)
-- Name: personal_medico id_personal_medico; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_medico ALTER COLUMN id_personal_medico SET DEFAULT nextval('public.personal_medico_id_personal_medico_seq'::regclass);


--
-- TOC entry 3860 (class 2604 OID 16994)
-- Name: prescripcion_medicamento id_prescripcion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescripcion_medicamento ALTER COLUMN id_prescripcion SET DEFAULT nextval('public.prescripcion_medicamento_id_prescripcion_seq'::regclass);


--
-- TOC entry 3862 (class 2604 OID 16995)
-- Name: referencia_traslado id_referencia; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referencia_traslado ALTER COLUMN id_referencia SET DEFAULT nextval('public.referencia_traslado_id_referencia_seq'::regclass);


--
-- TOC entry 3863 (class 2604 OID 16996)
-- Name: registro_transfusion id_transfusion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registro_transfusion ALTER COLUMN id_transfusion SET DEFAULT nextval('public.registro_transfusion_id_transfusion_seq'::regclass);


--
-- TOC entry 3816 (class 2604 OID 16997)
-- Name: servicio id_servicio; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio ALTER COLUMN id_servicio SET DEFAULT nextval('public.servicio_id_servicio_seq'::regclass);


--
-- TOC entry 3864 (class 2604 OID 16998)
-- Name: signos_vitales id_signos_vitales; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signos_vitales ALTER COLUMN id_signos_vitales SET DEFAULT nextval('public.signos_vitales_id_signos_vitales_seq'::regclass);


--
-- TOC entry 3866 (class 2604 OID 16999)
-- Name: solicitud_estudio id_solicitud; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitud_estudio ALTER COLUMN id_solicitud SET DEFAULT nextval('public.solicitud_estudio_id_solicitud_seq'::regclass);


--
-- TOC entry 3832 (class 2604 OID 17000)
-- Name: tipo_documento id_tipo_documento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_documento ALTER COLUMN id_tipo_documento SET DEFAULT nextval('public.tipo_documento_id_tipo_documento_seq'::regclass);


--
-- TOC entry 3869 (class 2604 OID 17001)
-- Name: tipo_sangre id_tipo_sangre; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_sangre ALTER COLUMN id_tipo_sangre SET DEFAULT nextval('public.tipo_sangre_id_tipo_sangre_seq'::regclass);


--
-- TOC entry 3829 (class 2604 OID 17002)
-- Name: vacunas_adicionales id_vacuna_adicional; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacunas_adicionales ALTER COLUMN id_vacuna_adicional SET DEFAULT nextval('public.vacunas_adicionales_id_vacuna_adicional_seq'::regclass);


--
-- TOC entry 3870 (class 2604 OID 17003)
-- Name: validacion_reingreso id_validacion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validacion_reingreso ALTER COLUMN id_validacion SET DEFAULT nextval('public.validacion_reingreso_id_validacion_seq'::regclass);


--
-- TOC entry 4255 (class 0 OID 16620)
-- Dependencies: 222
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.administrador (id_administrador, id_persona, usuario, contrasena, nivel_acceso, activo, foto, password_texto, ultimo_login, fecha_actualizacion) VALUES (1, 31, 'admin.direccion', '$2b$10$8K7hFGtxQ2mNvBcWeLzXZuX.Hv3jKpMnY5tGfRsT6wQcPdLmE9rSu', 1, true, NULL, 'admin123', NULL, '2025-07-14 20:10:29.062781');
INSERT INTO public.administrador (id_administrador, id_persona, usuario, contrasena, nivel_acceso, activo, foto, password_texto, ultimo_login, fecha_actualizacion) VALUES (2, 32, 'admin.general', '$2b$10$9L8iFHuxyR3nOwCdXfMyAtY.Iv4kLqNoZ6uHgStU7xRdQeLnF0sTv', 2, true, NULL, 'admin456', NULL, '2025-07-14 20:10:29.062781');
INSERT INTO public.administrador (id_administrador, id_persona, usuario, contrasena, nivel_acceso, activo, foto, password_texto, ultimo_login, fecha_actualizacion) VALUES (3, 33, 'admin.sistemas', '$2b$10$0M9jGIvyzS4oRxDeYgNzBuZ.Jw5lMrOpA7vIhTuV8ySeRfMoG1tTw', 3, true, NULL, 'admin789', NULL, '2025-07-14 20:10:29.062781');


--
-- TOC entry 4257 (class 0 OID 16627)
-- Dependencies: 224
-- Data for Name: alertas_sistema; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4259 (class 0 OID 16635)
-- Dependencies: 226
-- Data for Name: antecedentes_heredo_familiares; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4261 (class 0 OID 16642)
-- Dependencies: 228
-- Data for Name: antecedentes_perinatales; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4263 (class 0 OID 16649)
-- Dependencies: 230
-- Data for Name: area_interconsulta; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (1, 'Cardiología', 'Servicio especializado en el corazón y sistema cardiovascular', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (2, 'Ginecología', 'Servicio especializado en salud femenina', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (3, 'Nutrición', 'Servicio de asesoría nutricional', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (4, 'Neurología', 'Servicio especializado en enfermedades del sistema nervioso', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (5, 'Dermatología', 'Servicio especializado en piel y sus enfermedades', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (6, 'Endocrinología', 'Servicio especializado en trastornos hormonales', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (7, 'Oftalmología', 'Servicio especializado en salud visual', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (8, 'Psiquiatría', 'Servicio especializado en salud mental', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (9, 'Infectología', 'Servicio especializado en enfermedades infecciosas', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (10, 'Nefrología', 'Servicio especializado en riñones y sus enfermedades', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (11, 'Hematología', 'Servicio especializado en enfermedades de la sangre', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (12, 'Reumatología', 'Servicio especializado en enfermedades articulares y autoinmunes', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (13, 'Geriatría', 'Servicio especializado en salud del adulto mayor', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (14, 'Anestesiología', 'Servicio especializado en manejo del dolor y anestesia', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (15, 'Oncología', 'Servicio especializado en diagnóstico y tratamiento del cáncer', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (16, 'Radiología', 'Servicio especializado en imágenes médicas', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (17, 'Laboratorio Clínico', 'Servicio especializado en análisis clínicos', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (18, 'Enfermería', 'Servicio de apoyo en cuidados generales', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (19, 'Farmacia', 'Servicio especializado en dispensación y control de medicamentos', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (20, 'Terapia Física', 'Servicio especializado en rehabilitación física', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (21, 'Urología', 'Servicio especializado en aparato genitourinario', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (22, 'Neumología', 'Servicio especializado en enfermedades respiratorias', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (23, 'Gastroenterología', 'Servicio especializado en aparato digestivo', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (24, 'Otorrinolaringología', 'Servicio especializado en oído, nariz y garganta', true);
INSERT INTO public.area_interconsulta (id_area_interconsulta, nombre, descripcion, activo) VALUES (25, 'Psicología', 'Servicio de apoyo psicológico', true);


--
-- TOC entry 4265 (class 0 OID 16656)
-- Dependencies: 232
-- Data for Name: cama; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (23, 'U-01', 1, 'Disponible', 'Hidratación pediátrica', 'Urgencias', 'Hidratación');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (24, 'U-02', 1, 'Disponible', 'Urgencias niños', 'Urgencias', 'Urgencias Pediátricas');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (25, 'U-03', 1, 'Ocupada', 'Paciente en evaluación crítica', 'Urgencias', 'Choque');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (26, 'U-04', 1, 'Mantenimiento', 'En limpieza post uso', 'Urgencias', 'Hidratación');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (27, 'U-05', 1, 'Disponible', 'Para pacientes leves', 'Urgencias', 'Observación General');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (28, 'U-06', 1, 'Disponible', 'Urgencias adultos', 'Urgencias', 'Urgencias Adultos');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (29, 'U-07', 1, 'Disponible', 'Curaciones', 'Urgencias', 'Procedimientos');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (30, 'MI-01', 3, 'Disponible', 'Medicina Interna Adultos', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (31, 'MI-02', 3, 'Disponible', 'Medicina Interna Adultos', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (32, 'MI-03', 3, 'Ocupada', 'Paciente en observación', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (33, 'MI-04', 3, 'Disponible', 'Medicina Interna Adultos', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (34, 'MI-05', 3, 'Mantenimiento', 'Limpieza programada', 'Hospitalización', 'Medicina Interna');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (35, 'MI-06', 3, 'Disponible', 'Medicina Interna - Cuidados intermedios', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (36, 'MI-07', 3, 'Ocupada', 'Paciente en ventilación mecánica', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (37, 'MI-08', 3, 'Disponible', 'Medicina Interna - Cuidados intermedios', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (38, 'MI-09', 3, 'Mantenimiento', 'Mantenimiento preventivo ventilador', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (39, 'MI-10', 3, 'Disponible', 'Medicina Interna - Cuidados intermedios', 'Hospitalización', 'Medicina Interna 2 (Cuidados Especiales)');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (40, 'C-11', 6, 'Disponible', 'Cirugía general', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (41, 'C-12', 6, 'Disponible', 'Cirugía general', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (42, 'C-13', 6, 'Ocupada', 'Paciente postoperatorio', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (43, 'C-14', 6, 'Mantenimiento', 'Reparación de equipamiento', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (44, 'C-15', 6, 'Disponible', 'Cirugía general', 'Hospitalización', 'Cirugía General');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (45, 'T-16', 2, 'Disponible', 'Traumatología y ortopedia', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (46, 'T-17', 2, 'Disponible', 'Traumatología y ortopedia', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (47, 'T-18', 2, 'Ocupada', 'Fractura en recuperación', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (48, 'T-19', 2, 'Mantenimiento', 'Cama fuera de servicio', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (49, 'T-20', 2, 'Disponible', 'Traumatología y ortopedia', 'Hospitalización', 'Traumatología y Ortopedia');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (50, 'P-21', 4, 'Disponible', 'Pediatría escolares (5-15 años)', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (51, 'P-22', 4, 'Disponible', 'Pediatría escolares (5-15 años)', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (52, 'P-23', 4, 'Ocupada', 'Niño en recuperación', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (53, 'P-24', 4, 'Disponible', 'Pediatría escolares (5-15 años)', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (54, 'P-25', 4, 'Mantenimiento', 'Revisión técnica programada', 'Hospitalización', 'Pediatría Escolares');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (55, 'PL-26', 4, 'Disponible', 'Pediatría lactantes (1 mes - 2 años)', 'Hospitalización', 'Pediatría Lactantes');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (56, 'PL-27', 4, 'Disponible', 'Pediatría lactantes (1 mes - 2 años)', 'Hospitalización', 'Pediatría Lactantes');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (57, 'PL-28', 4, 'Ocupada', 'Lactante con bronquiolitis', 'Hospitalización', 'Pediatría Lactantes');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (58, 'PN-01', 4, 'Ocupada', 'Neonato prematuro', 'Hospitalización', 'Neonatología');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (59, 'PN-02', 4, 'Disponible', 'Neonato a término', 'Hospitalización', 'Neonatología');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (60, 'PN-03', 4, 'Mantenimiento', 'Incubadora en mantenimiento', 'Hospitalización', 'Neonatología');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (61, 'PN-04', 4, 'Disponible', 'Cuidados neonatales', 'Hospitalización', 'Neonatología');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (62, 'GO-31', 7, 'Disponible', 'Ginecología', 'Hospitalización', 'Ginecología');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (63, 'GO-32', 7, 'Disponible', 'Obstetricia', 'Hospitalización', 'Obstetricia');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (64, 'GO-33', 7, 'Ocupada', 'Paciente post-cesárea', 'Hospitalización', 'Obstetricia');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (65, 'GO-34', 7, 'Disponible', 'Labor de parto', 'Hospitalización', 'Sala de Labor');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (66, 'R-01', 10, 'Disponible', 'Recuperación post-anestésica', 'Recuperación', 'Postoperatorio Inmediato');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (67, 'R-02', 10, 'Disponible', 'Recuperación post-anestésica', 'Recuperación', 'Postoperatorio Inmediato');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (68, 'R-03', 10, 'Ocupada', 'Paciente post-cirugía mayor', 'Recuperación', 'Postoperatorio Inmediato');
INSERT INTO public.cama (id_cama, numero, id_servicio, estado, descripcion, area, subarea) VALUES (69, 'R-04', 10, 'Mantenimiento', 'Monitor en reparación', 'Recuperación', 'Postoperatorio Inmediato');


--
-- TOC entry 4267 (class 0 OID 16663)
-- Dependencies: 234
-- Data for Name: catalogo_vacunas; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (1, 'Meningocócica', 'Vacuna contra meningococo', 'Adicional', '2 meses', 2, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (2, 'Fiebre Amarilla', 'Vacuna contra fiebre amarilla', 'Especial', '9 meses', 1, NULL, 'Subcutánea', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (3, 'Tifoidea', 'Vacuna contra fiebre tifoidea', 'Especial', '2 años', 1, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (4, 'Cólera', 'Vacuna contra cólera', 'Emergencia', 'Cualquier edad', 2, NULL, 'Oral', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (5, 'COVID-19 Pfizer', 'Vacuna COVID-19 Pfizer-BioNTech', 'Emergencia', '12 años en adelante', 2, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (6, 'COVID-19 AstraZeneca', 'Vacuna COVID-19 AstraZeneca', 'Emergencia', '18 años en adelante', 2, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (7, 'Rabia', 'Vacuna antirrábica', 'Especial', 'Post-exposición', 4, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (8, 'Encefalitis Japonesa', 'Vacuna contra encefalitis japonesa', 'Especial', '9 meses', 2, NULL, 'Subcutánea', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (9, 'Polio Injectable (IPV)', 'Vacuna polio inactivada', 'Básica', '2 meses', 4, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (10, 'Hepatitis B Recombinante', 'Vacuna hepatitis B para adultos', 'Adicional', 'Adultos', 3, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (11, 'Td (Tétanos-Difteria)', 'Refuerzo tétanos-difteria adultos', 'Básica', 'Cada 10 años', 1, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');
INSERT INTO public.catalogo_vacunas (id_vacuna, nombre_vacuna, descripcion, tipo_vacuna, edad_aplicacion, dosis_requeridas, intervalo_dosis, via_administracion, activa, fecha_registro) VALUES (12, 'Tdap (Tétanos-Difteria-Tos ferina)', 'Vacuna triple acelular adultos', 'Básica', 'Embarazadas', 1, NULL, 'Intramuscular', true, '2025-07-11 23:51:53.689802');


--
-- TOC entry 4269 (class 0 OID 16672)
-- Dependencies: 236
-- Data for Name: configuracion_sistema; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.configuracion_sistema (id_config, parametro, valor, descripcion, fecha_modificacion, id_modificador) VALUES (1, 'dias_reingreso_bloqueo', '180', 'Días desde último ingreso para activar validación obligatoria', '2025-07-11 23:41:36.882097', NULL);
INSERT INTO public.configuracion_sistema (id_config, parametro, valor, descripcion, fecha_modificacion, id_modificador) VALUES (2, 'tiempo_bloqueo_datos_minutos', '30', 'Minutos que permanecen ocultos los datos históricos', '2025-07-11 23:41:36.882097', NULL);
INSERT INTO public.configuracion_sistema (id_config, parametro, valor, descripcion, fecha_modificacion, id_modificador) VALUES (3, 'requiere_supervisor_acceso_critico', 'true', 'Si se requiere supervisor para accesos críticos', '2025-07-11 23:41:36.882097', NULL);
INSERT INTO public.configuracion_sistema (id_config, parametro, valor, descripcion, fecha_modificacion, id_modificador) VALUES (4, 'max_intentos_acceso_bloqueado', '3', 'Máximo intentos de acceso antes de bloquear usuario', '2025-07-11 23:41:36.882097', NULL);


--
-- TOC entry 4271 (class 0 OID 16679)
-- Dependencies: 238
-- Data for Name: consentimiento_informado; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4273 (class 0 OID 16688)
-- Dependencies: 240
-- Data for Name: control_acceso_historico; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4278 (class 0 OID 16721)
-- Dependencies: 246
-- Data for Name: desarrollo_psicomotriz; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4251 (class 0 OID 16583)
-- Dependencies: 216
-- Data for Name: documento_clinico; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.documento_clinico (id_documento, id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado, texto_busqueda) VALUES (3, 3, NULL, 1, '2025-07-14 15:08:18.85055', 9, 'Borrador', NULL);
INSERT INTO public.documento_clinico (id_documento, id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado, texto_busqueda) VALUES (4, 3, NULL, 3, '2025-07-14 21:21:23.047', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico (id_documento, id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado, texto_busqueda) VALUES (5, 3, NULL, 2, '2025-07-14 21:26:33.211', 9, 'Activo', NULL);
INSERT INTO public.documento_clinico (id_documento, id_expediente, id_internamiento, id_tipo_documento, fecha_elaboracion, id_personal_creador, estado, texto_busqueda) VALUES (6, 3, NULL, 3, '2025-07-14 21:29:05.471', 9, 'Activo', NULL);


--
-- TOC entry 4286 (class 0 OID 16783)
-- Dependencies: 258
-- Data for Name: estado_nutricional_pediatrico; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4288 (class 0 OID 16792)
-- Dependencies: 260
-- Data for Name: estudio_medico; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (1, '20109', 'Biometría Hemática', 'Laboratorio', 'Conteo de glóbulos rojos, blancos y plaquetas', true, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (2, '20108', 'Grupo Sanguíneo y Rh', 'Laboratorio', 'Determinación del grupo sanguíneo ABO y factor Rh', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (3, '201031', 'Velocidad de Sedimentación Globular (VSG)', 'Laboratorio', 'Marcador de inflamación sistémica', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (4, '20102', 'Recuento de Reticulocitos', 'Laboratorio', 'Evalúa la producción de glóbulos rojos', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (5, '20105', 'Frotis de Sangre Periférica', 'Laboratorio', 'Estudio morfológico de células sanguíneas', false, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (6, '193031', 'Hemoglobina Glucosilada (HbA1c)', 'Laboratorio', 'Control glucémico a largo plazo', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (7, '20202', 'Paquete Hematológico Completo', 'Laboratorio', 'Biometría + VSG + Reticulocitos', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (8, '20113', 'Tiempo de Protrombina (TP)', 'Laboratorio', 'Evalúa coagulación y función hepática', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (9, '20114', 'Tiempo de Tromboplastina Parcial (TTPa)', 'Laboratorio', 'Mide vía intrínseca de coagulación', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (10, '20116', 'Fibrinógeno', 'Laboratorio', 'Proteína implicada en coagulación', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (11, '20115', 'INR', 'Laboratorio', 'Relación normalizada internacional', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (12, '19301', 'Glucosa en Ayunas', 'Laboratorio', 'Diagnóstico de diabetes mellitus', true, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (13, '19302', 'Glucosa Postprandial', 'Laboratorio', 'Nivel de glucosa posterior a alimentos', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (14, '193032', 'Tamiz Gestacional 50g / 1 hr', 'Laboratorio', 'Tamizaje de diabetes gestacional', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (15, '193033', 'Curva de Tolerancia a la Glucosa 75g', 'Laboratorio', 'Evaluación completa de tolerancia a glucosa', true, 12, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (16, '19304', 'Urea/BUN', 'Laboratorio', 'Evaluación de función renal', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (17, '19306', 'Creatinina', 'Laboratorio', 'Indicador principal de función renal', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (18, '193071', 'Ácido Úrico', 'Laboratorio', 'Evalúa gota y metabolismo de purinas', true, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (19, '193072', 'Colesterol Total', 'Laboratorio', 'Lípidos séricos totales', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (20, '19703', 'HDL Colesterol', 'Laboratorio', 'Colesterol de alta densidad (bueno)', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (21, '19704', 'LDL Colesterol', 'Laboratorio', 'Colesterol de baja densidad (malo)', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (22, '19702', 'Triglicéridos', 'Laboratorio', 'Lípidos circulantes', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (23, '20203', 'Perfil de Lípidos Completo', 'Laboratorio', 'Colesterol total, HDL, LDL, Triglicéridos', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (24, '19401', 'AST (TGO)', 'Laboratorio', 'Transaminasa - marcador de daño hepático', true, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (25, '19402', 'ALT (TGP)', 'Laboratorio', 'Transaminasa - marcador específico hepático', true, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (26, '19403', 'Fosfatasa Alcalina (ALP)', 'Laboratorio', 'Marcador de hígado y metabolismo óseo', true, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (27, '19308', 'Bilirrubina Directa', 'Laboratorio', 'Bilirrubina conjugada', true, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (28, '22118', 'Bilirrubina Total', 'Laboratorio', 'Bilirrubina directa e indirecta', true, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (29, '19309', 'Proteínas Totales', 'Laboratorio', 'Evalúa estado nutricional y síntesis hepática', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (30, '19310', 'Albúmina', 'Laboratorio', 'Evalúa síntesis hepática y estado nutricional', true, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (31, '20208', 'Perfil Hepático Completo', 'Laboratorio', 'AST, ALT, Bilirrubinas, Fosfatasa alcalina, Proteínas', true, 12, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (32, '19407', 'Amilasa', 'Laboratorio', 'Enzima pancreática', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (33, '19408', 'Lipasa', 'Laboratorio', 'Marcador específico de pancreatitis aguda', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (34, '196011', 'Sodio', 'Laboratorio', 'Electrolito principal extracelular', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (35, '196021', 'Potasio', 'Laboratorio', 'Electrolito principal intracelular', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (36, '201032', 'Cloro', 'Laboratorio', 'Electrolito importante para equilibrio ácido-base', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (37, '19604', 'Calcio', 'Laboratorio', 'Homeostasis ósea y neuromuscular', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (38, '19603', 'Fósforo', 'Laboratorio', 'Balance mineral y metabolismo óseo', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (39, '196022', 'Magnesio', 'Laboratorio', 'Cofactor enzimático importante', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (40, '20204', 'Química Sanguínea III', 'Laboratorio', 'Glucosa, Urea, Creatinina', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (41, '20207', 'Química Sanguínea IV', 'Laboratorio', 'QS III + Electrolitos + Ácido Úrico', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (42, '20209', 'Perfil Prequirúrgico', 'Laboratorio', 'Biometría, QS, Coagulación, Grupo sanguíneo', true, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (43, '20210', 'Perfil Reumático', 'Laboratorio', 'Factor reumatoide, PCR, VSG, Antiestreptolisinas', true, 12, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (44, '20211', 'Perfil de Embarazo', 'Laboratorio', 'Biometría, TP, TTPa, Glucemia, VDRL, EGO', true, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (45, '20107', 'Pruebas Cruzadas', 'Laboratorio', 'Compatibilidad sanguínea pretransfusional', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (46, '19210', 'Coombs Directo', 'Laboratorio', 'Detecta anticuerpos adheridos a glóbulos rojos', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (47, '19211', 'Coombs Indirecto', 'Laboratorio', 'Detecta anticuerpos libres en plasma', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (48, '19201', 'Reacciones Febriles', 'Laboratorio', 'Anticuerpos contra Salmonella, Brucella, Rickettsia', false, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (49, '192061', 'Proteína C Reactiva (PCR)', 'Laboratorio', 'Marcador de inflamación aguda', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (50, '19207', 'Factor Reumatoide', 'Laboratorio', 'Autoanticuerpo en artritis reumatoide', false, 12, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (51, '19205', 'Antiestreptolisinas O (ASO)', 'Laboratorio', 'Infección estreptocócica reciente', false, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (52, '22131', 'VDRL', 'Laboratorio', 'Detección de sífilis (no treponémico)', false, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (53, '192062', 'RPR', 'Laboratorio', 'Confirmación de sífilis (no treponémico)', false, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (54, '20117', 'VIH 1-2 Prueba Rápida', 'Laboratorio', 'Detección rápida de anticuerpos anti-VIH', false, 2, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (55, '19212', 'Antígeno Prostático Específico (PSA)', 'Laboratorio', 'Detección de cáncer prostático', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (56, '19213', 'Alfafetoproteína (AFP)', 'Laboratorio', 'Marcador de cáncer hepático', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (57, '19214', 'Antígeno Carcinoembrionario (CEA)', 'Laboratorio', 'Marcador de cáncer colorrectal', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (58, '19720', 'hCG Beta Cuantitativa', 'Laboratorio', 'Seguimiento de embarazo y patología trofoblástica', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (59, '19715', 'Prueba de Embarazo en Orina', 'Laboratorio', 'Detección cualitativa de embarazo', false, 2, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (60, '19721', 'TSH', 'Laboratorio', 'Hormona estimulante de tiroides', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (61, '19722', 'T4 Libre', 'Laboratorio', 'Tiroxina libre', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (62, '19723', 'T3 Total', 'Laboratorio', 'Triyodotironina total', true, 8, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (63, '19406', 'LDH', 'Laboratorio', 'Deshidrogenasa láctica - daño tisular', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (64, '194091', 'CPK Total', 'Laboratorio', 'Creatina fosfoquinasa - enzima muscular', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (65, '194092', 'CK-MB', 'Laboratorio', 'Fracción cardíaca específica de CPK', true, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (66, '194093', 'Troponina I', 'Laboratorio', 'Marcador específico de daño miocárdico', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (67, '20201', 'Examen General de Orina', 'Laboratorio', 'Análisis físico, químico y microscópico', false, 4, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (68, '19501', 'Depuración de Creatinina', 'Laboratorio', 'Evaluación de filtrado glomerular', false, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (69, '22803', 'Microalbuminuria 24 horas', 'Laboratorio', 'Detección precoz de nefropatía diabética', false, 12, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (70, '19502', 'Sangre Oculta en Heces', 'Laboratorio', 'Detecta sangrado digestivo oculto', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (71, '21001', 'Urocultivo', 'Laboratorio', 'Cultivo de orina para identificar bacterias', false, 48, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (72, '21002', 'Coprocultivo', 'Laboratorio', 'Cultivo de heces para patógenos entéricos', false, 72, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (73, '21003', 'Hemocultivo', 'Laboratorio', 'Cultivo de sangre para detectar bacteremia', false, 72, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (74, '21004', 'Cultivo de Exudado Faríngeo', 'Laboratorio', 'Identificación de Streptococcus beta hemolítico', false, 48, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (75, '200011', 'Coproparasitoscópico Seriado (3 muestras)', 'Laboratorio', 'Búsqueda exhaustiva de parásitos intestinales', false, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (76, '200012', 'Coproparasitoscópico Simple', 'Laboratorio', 'Búsqueda básica de parásitos', false, 12, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (77, '200051', 'Coprológico Funcional', 'Laboratorio', 'Análisis de digestión y absorción', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (78, '19215', 'Rotavirus en Heces', 'Laboratorio', 'Antígeno viral en gastroenteritis', false, 6, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (79, '19606', 'Gasometría Arterial', 'Laboratorio', 'pH, pO2, pCO2, HCO3 en sangre arterial', false, 2, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (80, '17301', 'Gasometría Venosa', 'Laboratorio', 'pH, pCO2, HCO3 en sangre venosa', false, 2, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (81, '30001', 'Radiografía de Tórax', 'Imagen', 'Evaluación de pulmones y corazón', false, 2, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (82, '30002', 'Radiografía de Abdomen', 'Imagen', 'Evaluación de vísceras abdominales', false, 2, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (83, '30003', 'Ultrasonido Abdominal', 'Imagen', 'Evaluación de órganos abdominales', true, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (84, '30004', 'Ultrasonido Obstétrico', 'Imagen', 'Evaluación de embarazo', false, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (85, '30005', 'Tomografía de Cráneo Simple', 'Imagen', 'Evaluación de estructuras cerebrales', false, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (86, '30006', 'Tomografía de Abdomen', 'Imagen', 'Evaluación detallada abdominal', false, 24, true);
INSERT INTO public.estudio_medico (id_estudio, clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES (87, '30007', 'Ecocardiograma', 'Imagen', 'Evaluación de función cardíaca', false, 24, true);


--
-- TOC entry 4275 (class 0 OID 16697)
-- Dependencies: 242
-- Data for Name: expediente; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.expediente (id_expediente, id_paciente, numero_expediente, fecha_apertura, estado, notas_administrativas) VALUES (3, 1, 'HG-2025-2977887367', '2025-07-14 15:08:18.85055', 'Activo', 'Paciente1');


--
-- TOC entry 4254 (class 0 OID 16609)
-- Dependencies: 220
-- Data for Name: expediente_auditoria; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.expediente_auditoria (id_auditoria, id_expediente, fecha_acceso, id_medico, accion, datos_anteriores, datos_nuevos, ip_acceso, navegador, tiempo_sesion, observaciones) VALUES (1, 3, '2025-07-14 15:08:18.85055', 9, 'nuevo_expediente', NULL, '{"estado": "Activo", "id_paciente": 1, "numero_expediente": "HG-2025-2977887367"}', '::1', NULL, NULL, 'Expediente creado para Carlos Gonzales');
INSERT INTO public.expediente_auditoria (id_auditoria, id_expediente, fecha_acceso, id_medico, accion, datos_anteriores, datos_nuevos, ip_acceso, navegador, tiempo_sesion, observaciones) VALUES (2, 3, '2025-07-14 15:21:23.162888', 9, 'nuevo_documento', NULL, '{"id_documento": 4, "tipo_documento": "Signos Vitales", "valores_registrados": {"imc": 24.56, "peso": 75.2, "talla": 175, "glucosa": 95, "temperatura": 36.5, "presion_arterial": "120/80", "saturacion_oxigeno": 98, "frecuencia_cardiaca": 72, "frecuencia_respiratoria": 16}}', '::1', NULL, NULL, 'Registro de signos vitales');


--
-- TOC entry 4292 (class 0 OID 16807)
-- Dependencies: 265
-- Data for Name: guia_clinica; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (1, 'Urgencias', 'IMSS-030_08', 'TRIAGE', 'IMSS', '2025-01-15', 'Clasificación de urgencias médicas', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (2, 'Urgencias', 'ISSSTE-663-13', 'ABSCESO ANAL', 'ISSSTE', '2023-05-01', 'Manejo de abscesos anales', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (3, 'Urgencias', 'ISSSTE-680-13', 'ACCESOS VASCULARES', 'ISSSTE', '2023-05-01', 'Protocolo de accesos vasculares', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (4, 'Urgencias', 'SS-027-08', 'INFECCIÓN VÍAS URINARIAS MENORES 18 AÑOS', 'SSA', '2023-05-01', 'ITU en población pediátrica', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (5, 'Urgencias', 'IMSS-142-09', 'CHOQUE HIPOVOLÉMICO', 'IMSS', '2024-03-10', 'Manejo del choque hipovolémico', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (6, 'Pediatría', 'SS-149_08', 'FIEBRE REUMÁTICA', 'SSA', '2025-01-19', 'Secuela postestreptocócica', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (7, 'Pediatría', 'IMSS-510-11', 'BRONQUIOLITIS AGUDA', 'IMSS', '2024-11-20', 'Manejo de bronquiolitis en lactantes', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (8, 'Pediatría', 'SSA-025-08', 'DIARREA AGUDA EN NIÑOS', 'SSA', '2024-08-15', 'Protocolo de diarrea pediátrica', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (9, 'Pediatría', 'IMSS-031-08', 'NEUMONÍA ADQUIRIDA EN LA COMUNIDAD', 'IMSS', '2024-06-30', 'NAC en población pediátrica', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (10, 'Gastroenterología', 'SS-150_08', 'ÚLCERA PÉPTICA EN ADULTOS', 'SSA', '2025-01-19', 'Lesión mucosa gastroduodenal', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (11, 'Gastroenterología', 'IMSS-068-08', 'ENFERMEDAD POR REFLUJO GASTROESOFÁGICO', 'IMSS', '2024-04-12', 'ERGE en adultos', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (12, 'Infectología', 'SS-151_08', 'DENGUE', 'SSA', '2025-01-19', 'Infección viral por mosquito', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (13, 'Infectología', 'IMSS-245-09', 'TUBERCULOSIS PULMONAR', 'IMSS', '2024-09-25', 'Diagnóstico y tratamiento de TB', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (14, 'Cardiología', 'IMSS-232-09', 'INFARTO AGUDO AL MIOCARDIO', 'IMSS', '2024-12-01', 'Manejo del IAM', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (15, 'Cardiología', 'SSA-086-08', 'HIPERTENSIÓN ARTERIAL SISTÉMICA', 'SSA', '2024-07-18', 'Control de HAS', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (16, 'Ginecología', 'IMSS-028-08', 'CONTROL PRENATAL', 'IMSS', '2024-10-30', 'Seguimiento del embarazo', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (17, 'Ginecología', 'SSA-048-08', 'PREECLAMPSIA', 'SSA', '2024-05-22', 'Hipertensión gestacional', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (18, 'Cirugía', 'IMSS-338-10', 'APENDICITIS AGUDA', 'IMSS', '2024-08-08', 'Diagnóstico y tratamiento quirúrgico', true);
INSERT INTO public.guia_clinica (id_guia_diagnostico, area, codigo, nombre, fuente, fecha_actualizacion, descripcion, activo) VALUES (19, 'Cirugía', 'SSA-195-09', 'COLECISTITIS AGUDA', 'SSA', '2024-03-15', 'Inflamación de vesícula biliar', true);


--
-- TOC entry 4280 (class 0 OID 16730)
-- Dependencies: 248
-- Data for Name: historia_clinica; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.historia_clinica (id_historia_clinica, id_documento, antecedentes_heredo_familiares, habitos_higienicos, habitos_alimenticios, actividad_fisica, ocupacion, vivienda, toxicomanias, menarca, ritmo_menstrual, inicio_vida_sexual, fecha_ultima_regla, fecha_ultimo_parto, gestas, partos, cesareas, abortos, hijos_vivos, metodo_planificacion, enfermedades_infancia, enfermedades_adulto, cirugias_previas, traumatismos, alergias, padecimiento_actual, sintomas_generales, aparatos_sistemas, exploracion_general, exploracion_cabeza, exploracion_cuello, exploracion_torax, exploracion_abdomen, exploracion_columna, exploracion_extremidades, exploracion_genitales, impresion_diagnostica, id_guia_diagnostico, plan_diagnostico, plan_terapeutico, pronostico, tipo_historia, religion_familia, higiene_personal_familia) VALUES (1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'general', NULL, NULL);
INSERT INTO public.historia_clinica (id_historia_clinica, id_documento, antecedentes_heredo_familiares, habitos_higienicos, habitos_alimenticios, actividad_fisica, ocupacion, vivienda, toxicomanias, menarca, ritmo_menstrual, inicio_vida_sexual, fecha_ultima_regla, fecha_ultimo_parto, gestas, partos, cesareas, abortos, hijos_vivos, metodo_planificacion, enfermedades_infancia, enfermedades_adulto, cirugias_previas, traumatismos, alergias, padecimiento_actual, sintomas_generales, aparatos_sistemas, exploracion_general, exploracion_cabeza, exploracion_cuello, exploracion_torax, exploracion_abdomen, exploracion_columna, exploracion_extremidades, exploracion_genitales, impresion_diagnostica, id_guia_diagnostico, plan_diagnostico, plan_terapeutico, pronostico, tipo_historia, religion_familia, higiene_personal_familia) VALUES (2, 4, 'Abuelo paterno: hipertensión arterial, falleció a los 78 años por infarto agudo al miocardio. Abuela paterna: diabetes mellitus tipo 2, viva de 82 años. Padre: hipertensión arterial controlada con medicamento. Madre: sana de 52 años. Sin antecedentes de cáncer, epilepsia o enfermedades psiquiátricas en la familia.', 'Baño diario, lavado dental 3 veces al día, cambio de ropa interior diario, lavado de manos frecuente.', 'Tres comidas principales y dos colaciones, dieta variada incluyendo frutas y verduras, consume aproximadamente 2 litros de agua al día, ocasionalmente comida rápida los fines de semana.', 'Ejercicio aeróbico 3 veces por semana (correr 30 minutos), gimnasio 2 veces por semana, actividades recreativas los fines de semana.', 'Estudiante', NULL, 'Niega tabaquismo, alcoholismo social ocasional (1-2 cervezas los fines de semana), niega uso de drogas ilegales.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Paciente masculino de 25 años que acude por primera vez para establecimiento de expediente clínico y revisión médica general. Refiere encontrarse asintomático, sin molestias actuales. Solicita revisión médica preventiva ya que no ha acudido a consulta médica en los últimos 2 años. Niega fiebre, dolor, náuseas, vómito, diarrea o cualquier sintomatología.', 'Nega astenia, adinamia, hiporexia, pérdida de peso, fiebre, diaforesis nocturna o cualquier síntoma constitucional.', 'Cardiovascular: niega dolor precordial, disnea, ortopnea, palpitaciones. Respiratorio: niega tos, expectoración, disnea de esfuerzo. Digestivo: niega náuseas, vómito, diarrea, estreñimiento, dolor abdominal. Genitourinario: niega disuria, hematuria, urgencia urinaria. Neurológico: niega cefalea, mareo, convulsiones, alteraciones visuales.', 'Paciente masculino de edad aparente a la cronológica, consiente, orientado en tiempo, lugar y persona, cooperador al interrogatorio y exploración física. Posición libremente escogida, marcha normal, constitución normolínea. Buen estado general de salud.', 'Normocéfala, sin deformidades, cabello de implantación normal, fácies no característica. Ojos simétricos, pupilas isocóricas normorreflécticas, conjuntivas normocrómicas, escleras anictéricas. Nariz sin secreciones, fosas nasales permeables. Boca con dentadura completa en buen estado, mucosas orales húmedas y normocrómicas.', 'Cilíndrico, simétrico, sin adenopatías palpables, tiroides no palpable, pulsos carotídeos presentes y simétricos, no se auscultan soplos.', 'Simétrico, expansibilidad normal, frecuencia respiratoria 16 rpm, murmullo vesicular presente en ambos campos pulmonares, no se auscultan estertores ni sibilancias. Ruidos cardiacos rítmicos de buen tono e intensidad, no se auscultan soplos.', 'Plano, blando, depresible, no doloroso a la palpación, peristalsis presente, no se palpan visceromegalias ni tumoraciones, no hay datos de irritación peritoneal.', NULL, 'Simétricas, íntegras, sin edema, pulsos presentes y simétricos, llenado capilar menor a 2 segundos, fuerza muscular 5/5 en las cuatro extremidades.', NULL, 'Adulto joven sano en revisión médica preventiva. Sin patología aparente al momento de la consulta.', NULL, 'Laboratorios de rutina: biometría hemática completa, química sanguínea de 27 elementos, perfil de lípidos, examen general de orina. Radiografía de tórax PA. Electrocardiograma de reposo.', 'Continuar con medidas preventivas de salud, mantener actividad física regular, dieta equilibrada, hidratación adecuada. Control médico anual para seguimiento preventivo.', 'Excelente para la vida, función y restitución ad integrum. Paciente joven sin factores de riesgo aparentes.', 'general', NULL, NULL);


--
-- TOC entry 4281 (class 0 OID 16736)
-- Dependencies: 249
-- Data for Name: inmunizaciones; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4276 (class 0 OID 16704)
-- Dependencies: 243
-- Data for Name: internamiento; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4297 (class 0 OID 16817)
-- Dependencies: 270
-- Data for Name: medicamento; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (1, 'MED-001', 'Paracetamol', 'Tableta', '500 mg', 'Analgésicos y Antipiréticos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (2, 'MED-002', 'Ibuprofeno', 'Tableta', '400 mg', 'Antiinflamatorios no esteroideos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (3, 'MED-003', 'Naproxeno', 'Tableta', '250 mg', 'Antiinflamatorios no esteroideos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (4, 'MED-004', 'Diclofenaco', 'Tableta', '50 mg', 'Antiinflamatorios no esteroideos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (5, 'MED-005', 'Metamizol', 'Ampolleta', '500 mg/ml', 'Analgésicos y Antipiréticos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (6, 'MED-011', 'Amoxicilina', 'Cápsula', '500 mg', 'Antibióticos - Penicilinas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (7, 'MED-012', 'Amoxicilina + Ácido Clavulánico', 'Tableta', '875/125 mg', 'Antibióticos - Penicilinas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (8, 'MED-013', 'Cefalexina', 'Cápsula', '500 mg', 'Antibióticos - Cefalosporinas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (9, 'MED-014', 'Azitromicina', 'Tableta', '500 mg', 'Antibióticos - Macrólidos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (10, 'MED-015', 'Ciprofloxacino', 'Tableta', '500 mg', 'Antibióticos - Quinolonas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (11, 'MED-016', 'Clindamicina', 'Cápsula', '300 mg', 'Antibióticos - Lincosamidas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (12, 'MED-017', 'Trimetoprim + Sulfametoxazol', 'Tableta', '160/800 mg', 'Antibióticos - Sulfonamidas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (13, 'MED-021', 'Enalapril', 'Tableta', '10 mg', 'Antihipertensivos - IECA', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (14, 'MED-022', 'Losartán', 'Tableta', '50 mg', 'Antihipertensivos - ARA II', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (15, 'MED-023', 'Amlodipino', 'Tableta', '5 mg', 'Antihipertensivos - Calcioantagonistas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (16, 'MED-024', 'Metoprolol', 'Tableta', '100 mg', 'Antihipertensivos - Beta bloqueadores', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (17, 'MED-025', 'Furosemida', 'Tableta', '40 mg', 'Diuréticos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (18, 'MED-026', 'Hidroclorotiazida', 'Tableta', '25 mg', 'Diuréticos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (19, 'MED-031', 'Metformina', 'Tableta', '850 mg', 'Antidiabéticos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (20, 'MED-032', 'Glibenclamida', 'Tableta', '5 mg', 'Antidiabéticos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (21, 'MED-033', 'Insulina NPH', 'Frasco ampolla', '100 UI/ml', 'Insulinas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (22, 'MED-034', 'Insulina Rápida', 'Frasco ampolla', '100 UI/ml', 'Insulinas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (23, 'MED-041', 'Omeprazol', 'Cápsula', '20 mg', 'Inhibidores de bomba de protones', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (24, 'MED-042', 'Ranitidina', 'Tableta', '150 mg', 'Antihistamínicos H2', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (25, 'MED-043', 'Metoclopramida', 'Tableta', '10 mg', 'Procinéticos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (26, 'MED-044', 'Loperamida', 'Cápsula', '2 mg', 'Antidiarreicos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (27, 'MED-045', 'Sales de Rehidratación Oral', 'Sobre', '20.5 g', 'Rehidratantes', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (28, 'MED-051', 'Salbutamol', 'Inhalador', '100 mcg/dosis', 'Broncodilatadores', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (29, 'MED-052', 'Budesonida', 'Inhalador', '200 mcg/dosis', 'Corticosteroides inhalados', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (30, 'MED-053', 'Dextrometorfano', 'Jarabe', '15 mg/5ml', 'Antitusivos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (31, 'MED-054', 'Loratadina', 'Tableta', '10 mg', 'Antihistamínicos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (32, 'MED-061', 'Fenitoína', 'Tableta', '100 mg', 'Anticonvulsivantes', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (33, 'MED-062', 'Carbamazepina', 'Tableta', '200 mg', 'Anticonvulsivantes', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (34, 'MED-063', 'Diazepam', 'Tableta', '10 mg', 'Ansiolíticos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (35, 'MED-071', 'Paracetamol Pediátrico', 'Suspensión', '160 mg/5ml', 'Analgésicos Pediátricos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (36, 'MED-072', 'Amoxicilina Pediátrica', 'Suspensión', '250 mg/5ml', 'Antibióticos Pediátricos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (37, 'MED-073', 'Ibuprofeno Pediátrico', 'Suspensión', '100 mg/5ml', 'Antiinflamatorios Pediátricos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (38, 'MED-074', 'Cefalexina Pediátrica', 'Suspensión', '250 mg/5ml', 'Antibióticos Pediátricos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (39, 'MED-081', 'Solución Salina 0.9%', 'Bolsa', '1000 ml', 'Soluciones Intravenosas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (40, 'MED-082', 'Solución Glucosada 5%', 'Bolsa', '1000 ml', 'Soluciones Intravenosas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (41, 'MED-083', 'Solución Hartmann', 'Bolsa', '1000 ml', 'Soluciones Intravenosas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (42, 'MED-084', 'Cloruro de Potasio', 'Ampolleta', '2 mEq/ml', 'Electrolitos', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (43, 'MED-091', 'Ácido Fólico', 'Tableta', '5 mg', 'Vitaminas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (44, 'MED-092', 'Complejo B', 'Tableta', 'Multivitamínico', 'Vitaminas', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (45, 'MED-093', 'Sulfato Ferroso', 'Tableta', '300 mg', 'Suplementos de Hierro', true);
INSERT INTO public.medicamento (id_medicamento, codigo, nombre, presentacion, concentracion, grupo_terapeutico, activo) VALUES (46, 'MED-094', 'Calcio + Vitamina D', 'Tableta', '600 mg + 400 UI', 'Suplementos', true);


--
-- TOC entry 4299 (class 0 OID 16824)
-- Dependencies: 272
-- Data for Name: nota_egreso; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4301 (class 0 OID 16831)
-- Dependencies: 274
-- Data for Name: nota_evolucion; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.nota_evolucion (id_nota_evolucion, id_documento, dias_hospitalizacion, fecha_ultimo_ingreso, temperatura, frecuencia_cardiaca, frecuencia_respiratoria, presion_arterial_sistolica, presion_arterial_diastolica, saturacion_oxigeno, peso_actual, talla_actual, sintomas_signos, habitus_exterior, exploracion_cabeza, exploracion_cuello, exploracion_torax, exploracion_abdomen, exploracion_extremidades, exploracion_columna, exploracion_genitales, exploracion_neurologico, estado_nutricional, estudios_laboratorio_gabinete, evolucion_analisis, diagnosticos, diagnosticos_guias, plan_estudios_tratamiento, interconsultas, pronostico, indicaciones_medicas, fecha_elaboracion, observaciones_adicionales) VALUES (1, 6, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Paciente refiere...', 'Paciente en condiciones generales...', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Adecuado para la edad', 'Sin estudios recientes que reportar', 'Evolución clínica estable', 'Por determinar', NULL, 'Continuar manejo actual', 'No se solicitaron interconsultas en esta evolución', 'Favorable para la vida', NULL, '2025-07-14 15:29:06.464407', NULL);


--
-- TOC entry 4303 (class 0 OID 16839)
-- Dependencies: 276
-- Data for Name: nota_interconsulta; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4305 (class 0 OID 16847)
-- Dependencies: 278
-- Data for Name: nota_nutricion; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4307 (class 0 OID 16853)
-- Dependencies: 280
-- Data for Name: nota_postanestesica; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4309 (class 0 OID 16859)
-- Dependencies: 282
-- Data for Name: nota_postoperatoria; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4311 (class 0 OID 16865)
-- Dependencies: 284
-- Data for Name: nota_preanestesica; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4313 (class 0 OID 16871)
-- Dependencies: 286
-- Data for Name: nota_preoperatoria; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4315 (class 0 OID 16877)
-- Dependencies: 288
-- Data for Name: nota_psicologia; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4317 (class 0 OID 16883)
-- Dependencies: 290
-- Data for Name: nota_urgencias; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.nota_urgencias (id_nota_urgencias, id_documento, motivo_atencion, estado_conciencia, resumen_interrogatorio, exploracion_fisica, resultados_estudios, estado_mental, diagnostico, id_guia_diagnostico, plan_tratamiento, pronostico, area_interconsulta) VALUES (1, 5, 'Paciente masculino de 25 años que acude al servicio de urgencias por dolor abdominal de 6 horas de evolución, localizado en epigastrio, de inicio súbito, intensidad 7/10, punzante, que se irradia hacia el hipocondrio derecho. Se acompaña de náuseas y un episodio de vómito de contenido alimentario.', 'Consciente y orientado', 'Paciente masculino de 25 años que acude al servicio de urgencias por dolor abdominal de 6 horas de evolución, localizado en epigastrio, de inicio súbito, intensidad 7/10, punzante, que se irradia hacia el hipocondrio derecho. Se acompaña de náuseas y un episodio de vómito de contenido alimentario.', 'TA: 120/80 mmHg, FC: 88 lpm, FR: 20 rpm, Temp: 37.1°C, SatO2: 98%. Paciente álgico, posición antiálgica (flexión de tronco). Abdomen: distendido, ruidos peristálticos disminuidos, dolor a la palpación superficial y profunda en epigastrio e hipocondrio derecho, Murphy positivo, no hay datos de irritación peritoneal, no se palpan masas ni visceromegalias. Resto de exploración sin alteraciones significativas.', 'Laboratorios: Leucocitos 12,500/mm3 con neutrofilia del 78%, bilirrubinas totales 2.1 mg/dl (directa 1.4 mg/dl), ALT 145 UI/L, AST 132 UI/L, amilasa sérica 180 UI/L. Ultrasonido abdominal: vesícula biliar distendida con múltiples litiasis, paredes engrosadas de 5mm, líquido perivesicular escaso, vía biliar no dilatada.', 'Ansioso debido al dolor, colaborador, comprende instrucciones, no presenta alteraciones cognitivas evidentes. Refiere preocupación por el diagnóstico pero se muestra receptivo a las explicaciones médicas.', 'Colelitiasis complicada con colecistitis aguda. Síndrome doloroso abdominal secundario a proceso inflamatorio de vesícula biliar.', NULL, 'Manejo del dolor: Ketorolaco 30mg IV cada 8 horas
Antiespasmódico: Butilhioscina 20mg IV cada 8 horas
Antiemético: Ondansetrón 4mg IV en caso necesario
Ayuno absoluto hasta nueva indicación
Solución mixta 1000ml IV para 8 horas
Interconsulta a cirugía general para valoración quirúrgica
Hospitalización para manejo intrahospitalario
Vigilancia de signos vitales cada 4 horas
Laboratorios de control en 12 horas', 'Bueno para la vida', NULL);


--
-- TOC entry 4282 (class 0 OID 16743)
-- Dependencies: 250
-- Data for Name: paciente; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.paciente (id_paciente, id_persona, alergias, transfusiones, detalles_transfusiones, familiar_responsable, parentesco_familiar, telefono_familiar, ocupacion, escolaridad, lugar_nacimiento, fecha_registro, nombre_madre, edad_madre, ocupacion_madre, escolaridad_madre, nombre_padre, edad_padre, ocupacion_padre, escolaridad_padre, derechohabiente, programa_social, especificar_otro_derechohabiente, especificar_otro_programa, calidad_alimentacion, agua_ingesta, hacinamiento, cohabita_con) VALUES (1, 46, 'Ninguna conocida', 'false', NULL, 'María González López', 'Madre', '4771234567', 'Estudiante', 'Preparatoria incompleta', 'San Luis de la Paz, Guanajuato', '2025-07-14 14:36:10.78133', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


--
-- TOC entry 4252 (class 0 OID 16590)
-- Dependencies: 217
-- Data for Name: persona; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (31, 'María Elena', 'García', 'López', '1975-03-15', 'F', 'GALM750315MGTPPR01', 7, 'Casado(a)', 'Católica', '4151234567', 'direccion@hospitalsanluis.gob.mx', 'Av. Principal #123, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (32, 'Roberto', 'Hernández', 'Martínez', '1978-11-22', 'M', 'HEMR781122HGTRNB02', 8, 'Casado(a)', 'Católica', '4151234568', 'admin@hospitalsanluis.gob.mx', 'Calle Hidalgo #456, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (33, 'Ana Sofía', 'Ramírez', 'González', '1980-07-08', 'F', 'RAGA800708MGTMNL03', 8, 'Soltero(a)', 'Católica', '4151234569', 'sistemas@hospitalsanluis.gob.mx', 'Colonia Centro #789, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (34, 'Carlos', 'Mendoza', 'Vázquez', '1970-05-12', 'M', 'MEVC700512HGTNDZ04', 1, 'Casado(a)', 'Católica', '4151234570', 'cmendoza@hospitalsanluis.gob.mx', 'Fraccionamiento Los Pinos #234, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (35, 'Patricia', 'Morales', 'Cruz', '1972-09-18', 'F', 'MOCP720918MGTRLZ05', 8, 'Casado(a)', 'Católica', '4151234571', 'pmorales@hospitalsanluis.gob.mx', 'Colonia Jardines #567, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (36, 'Fernando', 'Jiménez', 'Soto', '1968-12-03', 'M', 'JISF681203HGTMNT06', 4, 'Casado(a)', 'Católica', '4151234572', 'fjimenez@hospitalsanluis.gob.mx', 'Av. Independencia #890, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (37, 'Gabriela', 'Torres', 'Medina', '1975-02-25', 'F', 'TOMG750225MGTRRB07', 7, 'Soltero(a)', 'Católica', '4151234573', 'gtorres@hospitalsanluis.gob.mx', 'Calle Morelos #123, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (38, 'Miguel', 'Castillo', 'Flores', '1973-08-14', 'M', 'CAFM730814HGTSLG08', 1, 'Casado(a)', 'Católica', '4151234574', 'mcastillo@hospitalsanluis.gob.mx', 'Colonia San José #456, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (39, 'Laura', 'Sánchez', 'Herrera', '1977-06-30', 'F', 'SAHL770630MGTNRR09', 8, 'Casado(a)', 'Católica', '4151234575', 'lsanchez@hospitalsanluis.gob.mx', 'Fracc. Villa del Sol #789, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (40, 'Antonio', 'Rodríguez', 'Pérez', '1969-04-17', 'M', 'ROPA690417HGTDRT10', 2, 'Casado(a)', 'Católica', '4151234576', 'arodriguez@hospitalsanluis.gob.mx', 'Calle Juárez #234, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (41, 'Jorge', 'López', 'Martínez', '1985-01-20', 'M', 'LOMJ850120HGTPRT11', 3, 'Soltero(a)', 'Católica', '4151234577', 'jlopez@hospitalsanluis.gob.mx', 'Colonia Nueva #567, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (42, 'Carmen', 'González', 'Rivera', '1987-03-11', 'F', 'GORC870311MGTNZV12', 2, 'Soltero(a)', 'Católica', '4151234578', 'cgonzalez@hospitalsanluis.gob.mx', 'Av. Revolución #890, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (43, 'Ricardo', 'Vargas', 'Mendoza', '1986-09-05', 'M', 'VAMR860905HGTRGZ13', 7, 'Soltero(a)', 'Católica', '4151234579', 'rvargas@hospitalsanluis.gob.mx', 'Calle Allende #123, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (44, 'Mónica', 'Herrera', 'Castro', '1988-11-28', 'F', 'HECM881128MGTRST14', 8, 'Soltero(a)', 'Católica', '4151234580', 'mherrera@hospitalsanluis.gob.mx', 'Colonia Esperanza #456, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (45, 'Alejandro', 'Ruiz', 'Gómez', '1984-07-16', 'M', 'RUGA840716HGTZGM15', 2, 'Casado(a)', 'Católica', '4151234581', 'aruiz@hospitalsanluis.gob.mx', 'Fracc. Las Flores #789, San Luis de la Paz, Gto.', '2025-07-12 16:44:04.665363', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (46, 'Carlos', 'Gonzales', 'Martinez', '2000-03-15', 'M', 'GOMC000315HGTRNR03', NULL, 'Soltero(a)', 'Católica', '4773456789', 'carlos.gonzalez@email.com', 'Calle Hidalgo 123', '2025-07-14 14:34:03.852957', false);
INSERT INTO public.persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio, fecha_registro, es_pediatrico) VALUES (47, 'ivan', 'lopez', 'parra', '2002-06-14', 'M', 'LOPI020614HGTRVN09', NULL, 'Soltero(a)', 'Católica', '3323333333', 'ivan@gmail.com', 'Guerrero', '2025-07-14 17:47:09.745064', false);


--
-- TOC entry 4253 (class 0 OID 16598)
-- Dependencies: 218
-- Data for Name: personal_medico; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (2, 35, '23456789', 'Pediatría', 'Jefe de Servicio', 'Pediatría', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (3, 36, '34567890', 'Cirugía General', 'Jefe de Servicio', 'Cirugía', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (4, 37, '45678901', 'Ginecología y Obstetricia', 'Médico Especialista', 'Ginecología', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (5, 38, '56789012', 'Traumatología y Ortopedia', 'Médico Especialista', 'Traumatología', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (6, 39, '67890123', 'Medicina de Urgencias', 'Jefe de Servicio', 'Urgencias', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (7, 40, '78901234', 'Anestesiología', 'Médico Especialista', 'Anestesiología', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (8, 41, '89012345', 'Medicina General', 'Médico General', 'Medicina Interna', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (9, 42, '90123456', 'Medicina General', 'Médico General', 'Urgencias', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (10, 43, '01234567', 'Medicina General', 'Médico General', 'Consulta Externa', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (11, 44, '12345670', 'Pediatría', 'Médico General', 'Pediatría', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (12, 45, '23456781', 'Medicina General', 'Médico General', 'Urgencias', true, NULL, NULL, NULL, NULL, '2025-07-14 19:36:36.130554');
INSERT INTO public.personal_medico (id_personal_medico, id_persona, numero_cedula, especialidad, cargo, departamento, activo, foto, usuario, password_texto, ultimo_login, fecha_actualizacion) VALUES (1, 34, '12345678', 'Medicina Interna', 'Jefe de Servicio', 'Medicina Interna', true, NULL, 'dr.garcia', '123456', NULL, '2025-07-14 19:36:36.130554');


--
-- TOC entry 4322 (class 0 OID 16897)
-- Dependencies: 296
-- Data for Name: prescripcion_medicamento; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4324 (class 0 OID 16904)
-- Dependencies: 298
-- Data for Name: referencia_traslado; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4326 (class 0 OID 16910)
-- Dependencies: 300
-- Data for Name: registro_transfusion; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4277 (class 0 OID 16710)
-- Dependencies: 244
-- Data for Name: servicio; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (1, 'Urgencias', 'Área de atención médica de emergencia', true);
INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (2, 'Traumatología', 'Servicio especializado en lesiones del sistema músculo-esquelético', true);
INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (3, 'Medicina Interna', 'Servicio especializado en enfermedades en adultos', true);
INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (4, 'Pediatría', 'Servicio especializado en salud infantil', true);
INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (5, 'Ortopedia', 'Servicio especializado en trastornos del aparato locomotor', true);
INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (6, 'Cirugía General', 'Servicio encargado de intervenciones quirúrgicas generales', true);
INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (7, 'Ginecología y Obstetricia', 'Servicio especializado en salud femenina y embarazo', true);
INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (8, 'Consulta Externa', 'Servicio de consultas ambulatorias', true);
INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (9, 'Hospitalización', 'Servicio de internamiento general', true);
INSERT INTO public.servicio (id_servicio, nombre, descripcion, activo) VALUES (10, 'Quirófano', 'Área de cirugías y procedimientos quirúrgicos', true);


--
-- TOC entry 4329 (class 0 OID 16922)
-- Dependencies: 304
-- Data for Name: signos_vitales; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.signos_vitales (id_signos_vitales, id_documento, fecha_toma, temperatura, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, saturacion_oxigeno, glucosa, peso, talla, imc, observaciones) VALUES (1, 4, '2025-07-14 21:21:23.047', 36.50, 120, 80, 72, 16, 98, 95, 75.20, 175.00, 24.56, 'Paciente estable, signos vitales dentro de parámetros normales. Sin alteraciones aparentes.');


--
-- TOC entry 4331 (class 0 OID 16929)
-- Dependencies: 306
-- Data for Name: solicitud_estudio; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4285 (class 0 OID 16762)
-- Dependencies: 254
-- Data for Name: tipo_documento; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (1, 'Historia Clínica', 'Documento base que contiene antecedentes e información completa del paciente', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (2, 'Nota de Urgencias', 'Documento generado durante la atención en el servicio de urgencias', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (3, 'Nota de Evolución', 'Documento para seguimiento diario del paciente', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (4, 'Nota de Interconsulta', 'Solicitud de valoración por otra especialidad', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (5, 'Nota Preoperatoria', 'Evaluación previa a una intervención quirúrgica', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (6, 'Nota Preanestésica', 'Evaluación anestésica previa a cirugía', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (7, 'Nota Postoperatoria', 'Registro de la intervención quirúrgica realizada', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (8, 'Nota Postanestésica', 'Registro del procedimiento anestésico realizado', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (9, 'Nota de Egreso', 'Resumen de la atención al momento del alta hospitalaria', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (10, 'Nota de Psicología', 'Evaluación y seguimiento psicológico', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (11, 'Nota de Nutrición', 'Evaluación y plan de manejo nutricional', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (12, 'Historia Clínica Pediátrica', 'Historia clínica específica para pacientes pediátricos', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (13, 'Control de Crecimiento y Desarrollo', 'Seguimiento del crecimiento y desarrollo psicomotriz', true);
INSERT INTO public.tipo_documento (id_tipo_documento, nombre, descripcion, activo) VALUES (14, 'Esquema de Vacunación', 'Control y seguimiento de inmunizaciones', true);


--
-- TOC entry 4334 (class 0 OID 16938)
-- Dependencies: 309
-- Data for Name: tipo_sangre; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tipo_sangre (id_tipo_sangre, nombre, descripcion) VALUES (1, 'A+', 'Grupo sanguíneo A positivo');
INSERT INTO public.tipo_sangre (id_tipo_sangre, nombre, descripcion) VALUES (2, 'A-', 'Grupo sanguíneo A negativo');
INSERT INTO public.tipo_sangre (id_tipo_sangre, nombre, descripcion) VALUES (3, 'B+', 'Grupo sanguíneo B positivo');
INSERT INTO public.tipo_sangre (id_tipo_sangre, nombre, descripcion) VALUES (4, 'B-', 'Grupo sanguíneo B negativo');
INSERT INTO public.tipo_sangre (id_tipo_sangre, nombre, descripcion) VALUES (5, 'AB+', 'Grupo sanguíneo AB positivo');
INSERT INTO public.tipo_sangre (id_tipo_sangre, nombre, descripcion) VALUES (6, 'AB-', 'Grupo sanguíneo AB negativo');
INSERT INTO public.tipo_sangre (id_tipo_sangre, nombre, descripcion) VALUES (7, 'O+', 'Grupo sanguíneo O positivo');
INSERT INTO public.tipo_sangre (id_tipo_sangre, nombre, descripcion) VALUES (8, 'O-', 'Grupo sanguíneo O negativo');


--
-- TOC entry 4283 (class 0 OID 16749)
-- Dependencies: 251
-- Data for Name: vacunas_adicionales; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4337 (class 0 OID 16945)
-- Dependencies: 312
-- Data for Name: validacion_reingreso; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4421 (class 0 OID 0)
-- Dependencies: 223
-- Name: administrador_id_administrador_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.administrador_id_administrador_seq', 3, true);


--
-- TOC entry 4422 (class 0 OID 0)
-- Dependencies: 225
-- Name: alertas_sistema_id_alerta_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.alertas_sistema_id_alerta_seq', 1, false);


--
-- TOC entry 4423 (class 0 OID 0)
-- Dependencies: 227
-- Name: antecedentes_heredo_familiares_id_antecedentes_hf_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.antecedentes_heredo_familiares_id_antecedentes_hf_seq', 1, false);


--
-- TOC entry 4424 (class 0 OID 0)
-- Dependencies: 229
-- Name: antecedentes_perinatales_id_perinatales_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.antecedentes_perinatales_id_perinatales_seq', 1, false);


--
-- TOC entry 4425 (class 0 OID 0)
-- Dependencies: 231
-- Name: area_interconsulta_id_area_interconsulta_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.area_interconsulta_id_area_interconsulta_seq', 25, true);


--
-- TOC entry 4426 (class 0 OID 0)
-- Dependencies: 233
-- Name: cama_id_cama_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cama_id_cama_seq', 69, true);


--
-- TOC entry 4427 (class 0 OID 0)
-- Dependencies: 235
-- Name: catalogo_vacunas_id_vacuna_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.catalogo_vacunas_id_vacuna_seq', 12, true);


--
-- TOC entry 4428 (class 0 OID 0)
-- Dependencies: 237
-- Name: configuracion_sistema_id_config_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.configuracion_sistema_id_config_seq', 4, true);


--
-- TOC entry 4429 (class 0 OID 0)
-- Dependencies: 239
-- Name: consentimiento_informado_id_consentimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.consentimiento_informado_id_consentimiento_seq', 1, false);


--
-- TOC entry 4430 (class 0 OID 0)
-- Dependencies: 241
-- Name: control_acceso_historico_id_control_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.control_acceso_historico_id_control_seq', 1, false);


--
-- TOC entry 4431 (class 0 OID 0)
-- Dependencies: 247
-- Name: desarrollo_psicomotriz_id_desarrollo_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.desarrollo_psicomotriz_id_desarrollo_seq', 1, false);


--
-- TOC entry 4432 (class 0 OID 0)
-- Dependencies: 253
-- Name: documento_clinico_id_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.documento_clinico_id_documento_seq', 6, true);


--
-- TOC entry 4433 (class 0 OID 0)
-- Dependencies: 259
-- Name: estado_nutricional_pediatrico_id_nutricional_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.estado_nutricional_pediatrico_id_nutricional_seq', 1, false);


--
-- TOC entry 4434 (class 0 OID 0)
-- Dependencies: 261
-- Name: estudio_medico_id_estudio_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.estudio_medico_id_estudio_seq', 87, true);


--
-- TOC entry 4435 (class 0 OID 0)
-- Dependencies: 262
-- Name: expediente_auditoria_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.expediente_auditoria_id_auditoria_seq', 2, true);


--
-- TOC entry 4436 (class 0 OID 0)
-- Dependencies: 263
-- Name: expediente_id_expediente_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.expediente_id_expediente_seq', 3, true);


--
-- TOC entry 4437 (class 0 OID 0)
-- Dependencies: 266
-- Name: guia_clinica_id_guia_diagnostico_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.guia_clinica_id_guia_diagnostico_seq', 19, true);


--
-- TOC entry 4438 (class 0 OID 0)
-- Dependencies: 267
-- Name: historia_clinica_id_historia_clinica_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.historia_clinica_id_historia_clinica_seq', 2, true);


--
-- TOC entry 4439 (class 0 OID 0)
-- Dependencies: 268
-- Name: inmunizaciones_id_inmunizacion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inmunizaciones_id_inmunizacion_seq', 1, false);


--
-- TOC entry 4440 (class 0 OID 0)
-- Dependencies: 269
-- Name: internamiento_id_internamiento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.internamiento_id_internamiento_seq', 1, false);


--
-- TOC entry 4441 (class 0 OID 0)
-- Dependencies: 271
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.medicamento_id_medicamento_seq', 46, true);


--
-- TOC entry 4442 (class 0 OID 0)
-- Dependencies: 273
-- Name: nota_egreso_id_nota_egreso_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_egreso_id_nota_egreso_seq', 1, false);


--
-- TOC entry 4443 (class 0 OID 0)
-- Dependencies: 275
-- Name: nota_evolucion_id_nota_evolucion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_evolucion_id_nota_evolucion_seq', 1, true);


--
-- TOC entry 4444 (class 0 OID 0)
-- Dependencies: 277
-- Name: nota_interconsulta_id_nota_interconsulta_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_interconsulta_id_nota_interconsulta_seq', 1, false);


--
-- TOC entry 4445 (class 0 OID 0)
-- Dependencies: 279
-- Name: nota_nutricion_id_nota_nutricion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_nutricion_id_nota_nutricion_seq', 1, false);


--
-- TOC entry 4446 (class 0 OID 0)
-- Dependencies: 281
-- Name: nota_postanestesica_id_nota_postanestesica_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_postanestesica_id_nota_postanestesica_seq', 1, false);


--
-- TOC entry 4447 (class 0 OID 0)
-- Dependencies: 283
-- Name: nota_postoperatoria_id_nota_postoperatoria_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_postoperatoria_id_nota_postoperatoria_seq', 1, false);


--
-- TOC entry 4448 (class 0 OID 0)
-- Dependencies: 285
-- Name: nota_preanestesica_id_nota_preanestesica_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_preanestesica_id_nota_preanestesica_seq', 1, false);


--
-- TOC entry 4449 (class 0 OID 0)
-- Dependencies: 287
-- Name: nota_preoperatoria_id_nota_preoperatoria_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_preoperatoria_id_nota_preoperatoria_seq', 1, false);


--
-- TOC entry 4450 (class 0 OID 0)
-- Dependencies: 289
-- Name: nota_psicologia_id_nota_psicologia_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_psicologia_id_nota_psicologia_seq', 1, false);


--
-- TOC entry 4451 (class 0 OID 0)
-- Dependencies: 291
-- Name: nota_urgencias_id_nota_urgencias_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nota_urgencias_id_nota_urgencias_seq', 1, true);


--
-- TOC entry 4452 (class 0 OID 0)
-- Dependencies: 292
-- Name: paciente_id_paciente_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.paciente_id_paciente_seq', 1, true);


--
-- TOC entry 4453 (class 0 OID 0)
-- Dependencies: 294
-- Name: persona_id_persona_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.persona_id_persona_seq', 47, true);


--
-- TOC entry 4454 (class 0 OID 0)
-- Dependencies: 295
-- Name: personal_medico_id_personal_medico_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.personal_medico_id_personal_medico_seq', 18, true);


--
-- TOC entry 4455 (class 0 OID 0)
-- Dependencies: 297
-- Name: prescripcion_medicamento_id_prescripcion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.prescripcion_medicamento_id_prescripcion_seq', 1, false);


--
-- TOC entry 4456 (class 0 OID 0)
-- Dependencies: 299
-- Name: referencia_traslado_id_referencia_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.referencia_traslado_id_referencia_seq', 1, false);


--
-- TOC entry 4457 (class 0 OID 0)
-- Dependencies: 301
-- Name: registro_transfusion_id_transfusion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.registro_transfusion_id_transfusion_seq', 1, false);


--
-- TOC entry 4458 (class 0 OID 0)
-- Dependencies: 303
-- Name: servicio_id_servicio_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.servicio_id_servicio_seq', 10, true);


--
-- TOC entry 4459 (class 0 OID 0)
-- Dependencies: 305
-- Name: signos_vitales_id_signos_vitales_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.signos_vitales_id_signos_vitales_seq', 1, true);


--
-- TOC entry 4460 (class 0 OID 0)
-- Dependencies: 307
-- Name: solicitud_estudio_id_solicitud_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.solicitud_estudio_id_solicitud_seq', 1, false);


--
-- TOC entry 4461 (class 0 OID 0)
-- Dependencies: 308
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tipo_documento_id_tipo_documento_seq', 14, true);


--
-- TOC entry 4462 (class 0 OID 0)
-- Dependencies: 310
-- Name: tipo_sangre_id_tipo_sangre_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tipo_sangre_id_tipo_sangre_seq', 8, true);


--
-- TOC entry 4463 (class 0 OID 0)
-- Dependencies: 311
-- Name: vacunas_adicionales_id_vacuna_adicional_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vacunas_adicionales_id_vacuna_adicional_seq', 1, false);


--
-- TOC entry 4464 (class 0 OID 0)
-- Dependencies: 313
-- Name: validacion_reingreso_id_validacion_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.validacion_reingreso_id_validacion_seq', 1, false);


--
-- TOC entry 3900 (class 2606 OID 17005)
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (id_administrador);


--
-- TOC entry 3902 (class 2606 OID 17007)
-- Name: administrador administrador_usuario_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_usuario_key UNIQUE (usuario);


--
-- TOC entry 3904 (class 2606 OID 17009)
-- Name: alertas_sistema alertas_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas_sistema
    ADD CONSTRAINT alertas_sistema_pkey PRIMARY KEY (id_alerta);


--
-- TOC entry 3909 (class 2606 OID 17011)
-- Name: antecedentes_heredo_familiares antecedentes_heredo_familiares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedentes_heredo_familiares
    ADD CONSTRAINT antecedentes_heredo_familiares_pkey PRIMARY KEY (id_antecedentes_hf);


--
-- TOC entry 3912 (class 2606 OID 17013)
-- Name: antecedentes_perinatales antecedentes_perinatales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedentes_perinatales
    ADD CONSTRAINT antecedentes_perinatales_pkey PRIMARY KEY (id_perinatales);


--
-- TOC entry 3915 (class 2606 OID 17015)
-- Name: area_interconsulta area_interconsulta_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.area_interconsulta
    ADD CONSTRAINT area_interconsulta_nombre_key UNIQUE (nombre);


--
-- TOC entry 3917 (class 2606 OID 17017)
-- Name: area_interconsulta area_interconsulta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.area_interconsulta
    ADD CONSTRAINT area_interconsulta_pkey PRIMARY KEY (id_area_interconsulta);


--
-- TOC entry 3919 (class 2606 OID 17019)
-- Name: cama cama_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_pkey PRIMARY KEY (id_cama);


--
-- TOC entry 3922 (class 2606 OID 17021)
-- Name: catalogo_vacunas catalogo_vacunas_nombre_vacuna_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_vacunas
    ADD CONSTRAINT catalogo_vacunas_nombre_vacuna_key UNIQUE (nombre_vacuna);


--
-- TOC entry 3924 (class 2606 OID 17023)
-- Name: catalogo_vacunas catalogo_vacunas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_vacunas
    ADD CONSTRAINT catalogo_vacunas_pkey PRIMARY KEY (id_vacuna);


--
-- TOC entry 3928 (class 2606 OID 17025)
-- Name: configuracion_sistema configuracion_sistema_parametro_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_parametro_key UNIQUE (parametro);


--
-- TOC entry 3930 (class 2606 OID 17027)
-- Name: configuracion_sistema configuracion_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_pkey PRIMARY KEY (id_config);


--
-- TOC entry 3932 (class 2606 OID 17029)
-- Name: consentimiento_informado consentimiento_informado_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consentimiento_informado
    ADD CONSTRAINT consentimiento_informado_pkey PRIMARY KEY (id_consentimiento);


--
-- TOC entry 3934 (class 2606 OID 17031)
-- Name: control_acceso_historico control_acceso_historico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.control_acceso_historico
    ADD CONSTRAINT control_acceso_historico_pkey PRIMARY KEY (id_control);


--
-- TOC entry 3952 (class 2606 OID 17033)
-- Name: desarrollo_psicomotriz desarrollo_psicomotriz_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.desarrollo_psicomotriz
    ADD CONSTRAINT desarrollo_psicomotriz_pkey PRIMARY KEY (id_desarrollo);


--
-- TOC entry 3877 (class 2606 OID 17035)
-- Name: documento_clinico documento_clinico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_pkey PRIMARY KEY (id_documento);


--
-- TOC entry 3973 (class 2606 OID 17037)
-- Name: estado_nutricional_pediatrico estado_nutricional_pediatrico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_nutricional_pediatrico
    ADD CONSTRAINT estado_nutricional_pediatrico_pkey PRIMARY KEY (id_nutricional);


--
-- TOC entry 3976 (class 2606 OID 17039)
-- Name: estudio_medico estudio_medico_clave_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudio_medico
    ADD CONSTRAINT estudio_medico_clave_key UNIQUE (clave);


--
-- TOC entry 3978 (class 2606 OID 17041)
-- Name: estudio_medico estudio_medico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudio_medico
    ADD CONSTRAINT estudio_medico_pkey PRIMARY KEY (id_estudio);


--
-- TOC entry 3894 (class 2606 OID 17043)
-- Name: expediente_auditoria expediente_auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expediente_auditoria
    ADD CONSTRAINT expediente_auditoria_pkey PRIMARY KEY (id_auditoria);


--
-- TOC entry 3938 (class 2606 OID 17045)
-- Name: expediente expediente_numero_expediente_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expediente
    ADD CONSTRAINT expediente_numero_expediente_key UNIQUE (numero_expediente);


--
-- TOC entry 3940 (class 2606 OID 17047)
-- Name: expediente expediente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expediente
    ADD CONSTRAINT expediente_pkey PRIMARY KEY (id_expediente);


--
-- TOC entry 3980 (class 2606 OID 17049)
-- Name: guia_clinica guia_clinica_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guia_clinica
    ADD CONSTRAINT guia_clinica_pkey PRIMARY KEY (id_guia_diagnostico);


--
-- TOC entry 3955 (class 2606 OID 17051)
-- Name: historia_clinica historia_clinica_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historia_clinica
    ADD CONSTRAINT historia_clinica_pkey PRIMARY KEY (id_historia_clinica);


--
-- TOC entry 3959 (class 2606 OID 17053)
-- Name: inmunizaciones inmunizaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inmunizaciones
    ADD CONSTRAINT inmunizaciones_pkey PRIMARY KEY (id_inmunizacion);


--
-- TOC entry 3946 (class 2606 OID 17055)
-- Name: internamiento internamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_pkey PRIMARY KEY (id_internamiento);


--
-- TOC entry 3982 (class 2606 OID 17057)
-- Name: medicamento medicamento_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicamento
    ADD CONSTRAINT medicamento_codigo_key UNIQUE (codigo);


--
-- TOC entry 3984 (class 2606 OID 17059)
-- Name: medicamento medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicamento
    ADD CONSTRAINT medicamento_pkey PRIMARY KEY (id_medicamento);


--
-- TOC entry 3986 (class 2606 OID 17061)
-- Name: nota_egreso nota_egreso_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_egreso
    ADD CONSTRAINT nota_egreso_pkey PRIMARY KEY (id_nota_egreso);


--
-- TOC entry 3991 (class 2606 OID 17063)
-- Name: nota_evolucion nota_evolucion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_evolucion
    ADD CONSTRAINT nota_evolucion_pkey PRIMARY KEY (id_nota_evolucion);


--
-- TOC entry 3993 (class 2606 OID 17065)
-- Name: nota_interconsulta nota_interconsulta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_pkey PRIMARY KEY (id_nota_interconsulta);


--
-- TOC entry 3995 (class 2606 OID 17067)
-- Name: nota_nutricion nota_nutricion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_nutricion
    ADD CONSTRAINT nota_nutricion_pkey PRIMARY KEY (id_nota_nutricion);


--
-- TOC entry 3997 (class 2606 OID 17069)
-- Name: nota_postanestesica nota_postanestesica_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postanestesica
    ADD CONSTRAINT nota_postanestesica_pkey PRIMARY KEY (id_nota_postanestesica);


--
-- TOC entry 3999 (class 2606 OID 17071)
-- Name: nota_postoperatoria nota_postoperatoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_pkey PRIMARY KEY (id_nota_postoperatoria);


--
-- TOC entry 4001 (class 2606 OID 17073)
-- Name: nota_preanestesica nota_preanestesica_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_preanestesica
    ADD CONSTRAINT nota_preanestesica_pkey PRIMARY KEY (id_nota_preanestesica);


--
-- TOC entry 4003 (class 2606 OID 17075)
-- Name: nota_preoperatoria nota_preoperatoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_preoperatoria
    ADD CONSTRAINT nota_preoperatoria_pkey PRIMARY KEY (id_nota_preoperatoria);


--
-- TOC entry 4005 (class 2606 OID 17077)
-- Name: nota_psicologia nota_psicologia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_psicologia
    ADD CONSTRAINT nota_psicologia_pkey PRIMARY KEY (id_nota_psicologia);


--
-- TOC entry 4007 (class 2606 OID 17079)
-- Name: nota_urgencias nota_urgencias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_urgencias
    ADD CONSTRAINT nota_urgencias_pkey PRIMARY KEY (id_nota_urgencias);


--
-- TOC entry 3962 (class 2606 OID 17081)
-- Name: paciente paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (id_paciente);


--
-- TOC entry 3884 (class 2606 OID 17083)
-- Name: persona persona_curp_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_curp_key UNIQUE (curp);


--
-- TOC entry 3886 (class 2606 OID 17085)
-- Name: persona persona_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id_persona);


--
-- TOC entry 3888 (class 2606 OID 17087)
-- Name: personal_medico personal_medico_numero_cedula_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_medico
    ADD CONSTRAINT personal_medico_numero_cedula_key UNIQUE (numero_cedula);


--
-- TOC entry 3890 (class 2606 OID 17089)
-- Name: personal_medico personal_medico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_medico
    ADD CONSTRAINT personal_medico_pkey PRIMARY KEY (id_personal_medico);


--
-- TOC entry 3892 (class 2606 OID 17511)
-- Name: personal_medico personal_medico_usuario_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_medico
    ADD CONSTRAINT personal_medico_usuario_key UNIQUE (usuario);


--
-- TOC entry 4009 (class 2606 OID 17091)
-- Name: prescripcion_medicamento prescripcion_medicamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescripcion_medicamento
    ADD CONSTRAINT prescripcion_medicamento_pkey PRIMARY KEY (id_prescripcion);


--
-- TOC entry 4011 (class 2606 OID 17093)
-- Name: referencia_traslado referencia_traslado_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referencia_traslado
    ADD CONSTRAINT referencia_traslado_pkey PRIMARY KEY (id_referencia);


--
-- TOC entry 4013 (class 2606 OID 17095)
-- Name: registro_transfusion registro_transfusion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registro_transfusion
    ADD CONSTRAINT registro_transfusion_pkey PRIMARY KEY (id_transfusion);


--
-- TOC entry 3948 (class 2606 OID 17097)
-- Name: servicio servicio_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_nombre_key UNIQUE (nombre);


--
-- TOC entry 3950 (class 2606 OID 17099)
-- Name: servicio servicio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_pkey PRIMARY KEY (id_servicio);


--
-- TOC entry 4015 (class 2606 OID 17101)
-- Name: signos_vitales signos_vitales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signos_vitales
    ADD CONSTRAINT signos_vitales_pkey PRIMARY KEY (id_signos_vitales);


--
-- TOC entry 4017 (class 2606 OID 17103)
-- Name: solicitud_estudio solicitud_estudio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitud_estudio
    ADD CONSTRAINT solicitud_estudio_pkey PRIMARY KEY (id_solicitud);


--
-- TOC entry 3969 (class 2606 OID 17105)
-- Name: tipo_documento tipo_documento_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_documento
    ADD CONSTRAINT tipo_documento_nombre_key UNIQUE (nombre);


--
-- TOC entry 3971 (class 2606 OID 17107)
-- Name: tipo_documento tipo_documento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_documento
    ADD CONSTRAINT tipo_documento_pkey PRIMARY KEY (id_tipo_documento);


--
-- TOC entry 4019 (class 2606 OID 17109)
-- Name: tipo_sangre tipo_sangre_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_sangre
    ADD CONSTRAINT tipo_sangre_nombre_key UNIQUE (nombre);


--
-- TOC entry 4021 (class 2606 OID 17111)
-- Name: tipo_sangre tipo_sangre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_sangre
    ADD CONSTRAINT tipo_sangre_pkey PRIMARY KEY (id_tipo_sangre);


--
-- TOC entry 3967 (class 2606 OID 17113)
-- Name: vacunas_adicionales vacunas_adicionales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacunas_adicionales
    ADD CONSTRAINT vacunas_adicionales_pkey PRIMARY KEY (id_vacuna_adicional);


--
-- TOC entry 4023 (class 2606 OID 17115)
-- Name: validacion_reingreso validacion_reingreso_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validacion_reingreso
    ADD CONSTRAINT validacion_reingreso_pkey PRIMARY KEY (id_validacion);


--
-- TOC entry 3905 (class 1259 OID 17116)
-- Name: idx_alertas_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alertas_estado ON public.alertas_sistema USING btree (estado);


--
-- TOC entry 3906 (class 1259 OID 17117)
-- Name: idx_alertas_expediente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alertas_expediente ON public.alertas_sistema USING btree (id_expediente);


--
-- TOC entry 3907 (class 1259 OID 17118)
-- Name: idx_alertas_tipo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alertas_tipo ON public.alertas_sistema USING btree (tipo_alerta);


--
-- TOC entry 3910 (class 1259 OID 17119)
-- Name: idx_antecedentes_hf_historia; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_antecedentes_hf_historia ON public.antecedentes_heredo_familiares USING btree (id_historia_clinica);


--
-- TOC entry 3895 (class 1259 OID 17120)
-- Name: idx_auditoria_accion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auditoria_accion ON public.expediente_auditoria USING btree (accion);


--
-- TOC entry 3896 (class 1259 OID 17121)
-- Name: idx_auditoria_expediente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auditoria_expediente ON public.expediente_auditoria USING btree (id_expediente);


--
-- TOC entry 3897 (class 1259 OID 17122)
-- Name: idx_auditoria_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auditoria_fecha ON public.expediente_auditoria USING btree (fecha_acceso);


--
-- TOC entry 3898 (class 1259 OID 17123)
-- Name: idx_auditoria_medico; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auditoria_medico ON public.expediente_auditoria USING btree (id_medico);


--
-- TOC entry 3920 (class 1259 OID 17124)
-- Name: idx_cama_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cama_estado ON public.cama USING btree (estado);


--
-- TOC entry 3925 (class 1259 OID 17125)
-- Name: idx_catalogo_vacunas_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catalogo_vacunas_nombre ON public.catalogo_vacunas USING btree (nombre_vacuna);


--
-- TOC entry 3926 (class 1259 OID 17126)
-- Name: idx_catalogo_vacunas_tipo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catalogo_vacunas_tipo ON public.catalogo_vacunas USING btree (tipo_vacuna);


--
-- TOC entry 3935 (class 1259 OID 17127)
-- Name: idx_control_acceso_expediente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_control_acceso_expediente ON public.control_acceso_historico USING btree (id_expediente);


--
-- TOC entry 3936 (class 1259 OID 17128)
-- Name: idx_control_acceso_medico; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_control_acceso_medico ON public.control_acceso_historico USING btree (id_medico);


--
-- TOC entry 3953 (class 1259 OID 17129)
-- Name: idx_desarrollo_psicomotriz_historia; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_desarrollo_psicomotriz_historia ON public.desarrollo_psicomotriz USING btree (id_historia_clinica);


--
-- TOC entry 3878 (class 1259 OID 17130)
-- Name: idx_documento_creador; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documento_creador ON public.documento_clinico USING btree (id_personal_creador);


--
-- TOC entry 3879 (class 1259 OID 17131)
-- Name: idx_documento_expediente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documento_expediente ON public.documento_clinico USING btree (id_expediente);


--
-- TOC entry 3880 (class 1259 OID 17132)
-- Name: idx_documento_texto; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documento_texto ON public.documento_clinico USING gin (texto_busqueda);


--
-- TOC entry 3941 (class 1259 OID 17133)
-- Name: idx_expediente_numero; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_expediente_numero ON public.expediente USING btree (numero_expediente);


--
-- TOC entry 3942 (class 1259 OID 17134)
-- Name: idx_expediente_paciente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_expediente_paciente ON public.expediente USING btree (id_paciente);


--
-- TOC entry 3956 (class 1259 OID 17135)
-- Name: idx_historia_pediatrica; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_historia_pediatrica ON public.historia_clinica USING btree (tipo_historia) WHERE (tipo_historia = 'pediatrica'::text);


--
-- TOC entry 3957 (class 1259 OID 17136)
-- Name: idx_inmunizaciones_historia; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inmunizaciones_historia ON public.inmunizaciones USING btree (id_historia_clinica);


--
-- TOC entry 3943 (class 1259 OID 17137)
-- Name: idx_internamiento_fecha_ingreso; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_internamiento_fecha_ingreso ON public.internamiento USING btree (fecha_ingreso);


--
-- TOC entry 3944 (class 1259 OID 17138)
-- Name: idx_internamiento_servicio_activo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_internamiento_servicio_activo ON public.internamiento USING btree (id_servicio) WHERE (fecha_egreso IS NULL);


--
-- TOC entry 3987 (class 1259 OID 17139)
-- Name: idx_nota_evolucion_documento; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nota_evolucion_documento ON public.nota_evolucion USING btree (id_documento);


--
-- TOC entry 3988 (class 1259 OID 17140)
-- Name: idx_nota_evolucion_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nota_evolucion_fecha ON public.nota_evolucion USING btree (fecha_elaboracion);


--
-- TOC entry 3974 (class 1259 OID 17141)
-- Name: idx_nutricional_pediatrico_historia; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nutricional_pediatrico_historia ON public.estado_nutricional_pediatrico USING btree (id_historia_clinica);


--
-- TOC entry 3960 (class 1259 OID 17142)
-- Name: idx_paciente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_paciente_id ON public.paciente USING btree (id_persona);


--
-- TOC entry 3913 (class 1259 OID 17143)
-- Name: idx_perinatales_historia; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_perinatales_historia ON public.antecedentes_perinatales USING btree (id_historia_clinica);


--
-- TOC entry 3881 (class 1259 OID 17144)
-- Name: idx_persona_nombres; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_persona_nombres ON public.persona USING btree (apellido_paterno, apellido_materno, nombre);


--
-- TOC entry 3882 (class 1259 OID 17145)
-- Name: idx_persona_pediatrico; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_persona_pediatrico ON public.persona USING btree (es_pediatrico) WHERE (es_pediatrico = true);


--
-- TOC entry 3963 (class 1259 OID 17146)
-- Name: idx_vacunas_adicionales_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacunas_adicionales_fecha ON public.vacunas_adicionales USING btree (fecha_aplicacion);


--
-- TOC entry 3964 (class 1259 OID 17147)
-- Name: idx_vacunas_adicionales_inmunizacion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacunas_adicionales_inmunizacion ON public.vacunas_adicionales USING btree (id_inmunizacion);


--
-- TOC entry 3965 (class 1259 OID 17148)
-- Name: idx_vacunas_adicionales_vacuna; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacunas_adicionales_vacuna ON public.vacunas_adicionales USING btree (id_vacuna);


--
-- TOC entry 3989 (class 1259 OID 17149)
-- Name: idx_vista_evolucion_expediente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vista_evolucion_expediente ON public.nota_evolucion USING btree (id_documento) INCLUDE (dias_hospitalizacion, fecha_ultimo_ingreso);


--
-- TOC entry 4096 (class 2620 OID 17151)
-- Name: nota_evolucion trg_auto_llenar_nota_evolucion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auto_llenar_nota_evolucion BEFORE INSERT OR UPDATE ON public.nota_evolucion FOR EACH ROW EXECUTE FUNCTION public.auto_llenar_nota_evolucion();


--
-- TOC entry 4093 (class 2620 OID 17152)
-- Name: persona trg_detectar_cambios_sospechosos; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_detectar_cambios_sospechosos AFTER UPDATE ON public.persona FOR EACH ROW EXECUTE FUNCTION public.detectar_cambios_sospechosos();


--
-- TOC entry 4094 (class 2620 OID 17153)
-- Name: persona trg_validar_curp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_validar_curp BEFORE INSERT OR UPDATE ON public.persona FOR EACH ROW EXECUTE FUNCTION public.validar_curp();


--
-- TOC entry 4095 (class 2620 OID 17154)
-- Name: internamiento trg_validar_fechas_egreso; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_validar_fechas_egreso BEFORE INSERT OR UPDATE ON public.internamiento FOR EACH ROW EXECUTE FUNCTION public.validar_fechas_egreso();


--
-- TOC entry 4032 (class 2606 OID 17155)
-- Name: administrador administrador_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id_persona);


--
-- TOC entry 4033 (class 2606 OID 17160)
-- Name: alertas_sistema alertas_sistema_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas_sistema
    ADD CONSTRAINT alertas_sistema_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- TOC entry 4034 (class 2606 OID 17165)
-- Name: alertas_sistema alertas_sistema_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas_sistema
    ADD CONSTRAINT alertas_sistema_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4035 (class 2606 OID 17170)
-- Name: alertas_sistema alertas_sistema_id_medico_revisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas_sistema
    ADD CONSTRAINT alertas_sistema_id_medico_revisor_fkey FOREIGN KEY (id_medico_revisor) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4036 (class 2606 OID 17175)
-- Name: antecedentes_heredo_familiares antecedentes_heredo_familiares_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedentes_heredo_familiares
    ADD CONSTRAINT antecedentes_heredo_familiares_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- TOC entry 4037 (class 2606 OID 17180)
-- Name: antecedentes_perinatales antecedentes_perinatales_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.antecedentes_perinatales
    ADD CONSTRAINT antecedentes_perinatales_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- TOC entry 4038 (class 2606 OID 17185)
-- Name: cama cama_id_servicio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_id_servicio_fkey FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio);


--
-- TOC entry 4039 (class 2606 OID 17190)
-- Name: configuracion_sistema configuracion_sistema_id_modificador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_id_modificador_fkey FOREIGN KEY (id_modificador) REFERENCES public.administrador(id_administrador);


--
-- TOC entry 4040 (class 2606 OID 17195)
-- Name: consentimiento_informado consentimiento_informado_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consentimiento_informado
    ADD CONSTRAINT consentimiento_informado_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4041 (class 2606 OID 17200)
-- Name: consentimiento_informado consentimiento_informado_id_medico_informa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consentimiento_informado
    ADD CONSTRAINT consentimiento_informado_id_medico_informa_fkey FOREIGN KEY (id_medico_informa) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4042 (class 2606 OID 17205)
-- Name: control_acceso_historico control_acceso_historico_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.control_acceso_historico
    ADD CONSTRAINT control_acceso_historico_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- TOC entry 4043 (class 2606 OID 17210)
-- Name: control_acceso_historico control_acceso_historico_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.control_acceso_historico
    ADD CONSTRAINT control_acceso_historico_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4049 (class 2606 OID 17215)
-- Name: desarrollo_psicomotriz desarrollo_psicomotriz_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.desarrollo_psicomotriz
    ADD CONSTRAINT desarrollo_psicomotriz_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- TOC entry 4024 (class 2606 OID 17220)
-- Name: documento_clinico documento_clinico_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- TOC entry 4025 (class 2606 OID 17225)
-- Name: documento_clinico documento_clinico_id_internamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_id_internamiento_fkey FOREIGN KEY (id_internamiento) REFERENCES public.internamiento(id_internamiento);


--
-- TOC entry 4026 (class 2606 OID 17230)
-- Name: documento_clinico documento_clinico_id_personal_creador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_id_personal_creador_fkey FOREIGN KEY (id_personal_creador) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4027 (class 2606 OID 17235)
-- Name: documento_clinico documento_clinico_id_tipo_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documento_clinico
    ADD CONSTRAINT documento_clinico_id_tipo_documento_fkey FOREIGN KEY (id_tipo_documento) REFERENCES public.tipo_documento(id_tipo_documento);


--
-- TOC entry 4057 (class 2606 OID 17240)
-- Name: estado_nutricional_pediatrico estado_nutricional_pediatrico_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_nutricional_pediatrico
    ADD CONSTRAINT estado_nutricional_pediatrico_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- TOC entry 4030 (class 2606 OID 17245)
-- Name: expediente_auditoria expediente_auditoria_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expediente_auditoria
    ADD CONSTRAINT expediente_auditoria_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- TOC entry 4031 (class 2606 OID 17250)
-- Name: expediente_auditoria expediente_auditoria_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expediente_auditoria
    ADD CONSTRAINT expediente_auditoria_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4044 (class 2606 OID 17255)
-- Name: expediente expediente_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expediente
    ADD CONSTRAINT expediente_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.paciente(id_paciente);


--
-- TOC entry 4050 (class 2606 OID 17260)
-- Name: historia_clinica historia_clinica_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historia_clinica
    ADD CONSTRAINT historia_clinica_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4051 (class 2606 OID 17265)
-- Name: historia_clinica historia_clinica_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historia_clinica
    ADD CONSTRAINT historia_clinica_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- TOC entry 4052 (class 2606 OID 17270)
-- Name: inmunizaciones inmunizaciones_id_historia_clinica_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inmunizaciones
    ADD CONSTRAINT inmunizaciones_id_historia_clinica_fkey FOREIGN KEY (id_historia_clinica) REFERENCES public.historia_clinica(id_historia_clinica);


--
-- TOC entry 4045 (class 2606 OID 17275)
-- Name: internamiento internamiento_id_cama_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_id_cama_fkey FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama);


--
-- TOC entry 4046 (class 2606 OID 17280)
-- Name: internamiento internamiento_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- TOC entry 4047 (class 2606 OID 17285)
-- Name: internamiento internamiento_id_medico_responsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_id_medico_responsable_fkey FOREIGN KEY (id_medico_responsable) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4048 (class 2606 OID 17290)
-- Name: internamiento internamiento_id_servicio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internamiento
    ADD CONSTRAINT internamiento_id_servicio_fkey FOREIGN KEY (id_servicio) REFERENCES public.servicio(id_servicio);


--
-- TOC entry 4058 (class 2606 OID 17295)
-- Name: nota_egreso nota_egreso_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_egreso
    ADD CONSTRAINT nota_egreso_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4059 (class 2606 OID 17300)
-- Name: nota_egreso nota_egreso_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_egreso
    ADD CONSTRAINT nota_egreso_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- TOC entry 4060 (class 2606 OID 17305)
-- Name: nota_evolucion nota_evolucion_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_evolucion
    ADD CONSTRAINT nota_evolucion_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4061 (class 2606 OID 17310)
-- Name: nota_interconsulta nota_interconsulta_area_interconsulta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_area_interconsulta_fkey FOREIGN KEY (area_interconsulta) REFERENCES public.area_interconsulta(id_area_interconsulta);


--
-- TOC entry 4062 (class 2606 OID 17315)
-- Name: nota_interconsulta nota_interconsulta_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4063 (class 2606 OID 17320)
-- Name: nota_interconsulta nota_interconsulta_id_medico_interconsulta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_id_medico_interconsulta_fkey FOREIGN KEY (id_medico_interconsulta) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4064 (class 2606 OID 17325)
-- Name: nota_interconsulta nota_interconsulta_id_medico_solicitante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_interconsulta
    ADD CONSTRAINT nota_interconsulta_id_medico_solicitante_fkey FOREIGN KEY (id_medico_solicitante) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4065 (class 2606 OID 17330)
-- Name: nota_nutricion nota_nutricion_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_nutricion
    ADD CONSTRAINT nota_nutricion_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4066 (class 2606 OID 17335)
-- Name: nota_postanestesica nota_postanestesica_id_anestesiologo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postanestesica
    ADD CONSTRAINT nota_postanestesica_id_anestesiologo_fkey FOREIGN KEY (id_anestesiologo) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4067 (class 2606 OID 17340)
-- Name: nota_postanestesica nota_postanestesica_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postanestesica
    ADD CONSTRAINT nota_postanestesica_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4068 (class 2606 OID 17345)
-- Name: nota_postoperatoria nota_postoperatoria_id_anestesiologo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_anestesiologo_fkey FOREIGN KEY (id_anestesiologo) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4069 (class 2606 OID 17350)
-- Name: nota_postoperatoria nota_postoperatoria_id_ayudante1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_ayudante1_fkey FOREIGN KEY (id_ayudante1) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4070 (class 2606 OID 17355)
-- Name: nota_postoperatoria nota_postoperatoria_id_ayudante2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_ayudante2_fkey FOREIGN KEY (id_ayudante2) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4071 (class 2606 OID 17360)
-- Name: nota_postoperatoria nota_postoperatoria_id_cirujano_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_cirujano_fkey FOREIGN KEY (id_cirujano) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4072 (class 2606 OID 17365)
-- Name: nota_postoperatoria nota_postoperatoria_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_postoperatoria
    ADD CONSTRAINT nota_postoperatoria_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4073 (class 2606 OID 17370)
-- Name: nota_preanestesica nota_preanestesica_id_anestesiologo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_preanestesica
    ADD CONSTRAINT nota_preanestesica_id_anestesiologo_fkey FOREIGN KEY (id_anestesiologo) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4074 (class 2606 OID 17375)
-- Name: nota_preanestesica nota_preanestesica_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_preanestesica
    ADD CONSTRAINT nota_preanestesica_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4075 (class 2606 OID 17380)
-- Name: nota_preoperatoria nota_preoperatoria_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_preoperatoria
    ADD CONSTRAINT nota_preoperatoria_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4076 (class 2606 OID 17385)
-- Name: nota_preoperatoria nota_preoperatoria_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_preoperatoria
    ADD CONSTRAINT nota_preoperatoria_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- TOC entry 4077 (class 2606 OID 17390)
-- Name: nota_psicologia nota_psicologia_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_psicologia
    ADD CONSTRAINT nota_psicologia_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4078 (class 2606 OID 17395)
-- Name: nota_urgencias nota_urgencias_area_interconsulta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_urgencias
    ADD CONSTRAINT nota_urgencias_area_interconsulta_fkey FOREIGN KEY (area_interconsulta) REFERENCES public.area_interconsulta(id_area_interconsulta);


--
-- TOC entry 4079 (class 2606 OID 17400)
-- Name: nota_urgencias nota_urgencias_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_urgencias
    ADD CONSTRAINT nota_urgencias_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4080 (class 2606 OID 17405)
-- Name: nota_urgencias nota_urgencias_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nota_urgencias
    ADD CONSTRAINT nota_urgencias_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- TOC entry 4053 (class 2606 OID 17410)
-- Name: paciente paciente_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id_persona);


--
-- TOC entry 4028 (class 2606 OID 17415)
-- Name: persona persona_tipo_sangre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_tipo_sangre_id_fkey FOREIGN KEY (tipo_sangre_id) REFERENCES public.tipo_sangre(id_tipo_sangre);


--
-- TOC entry 4029 (class 2606 OID 17420)
-- Name: personal_medico personal_medico_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_medico
    ADD CONSTRAINT personal_medico_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id_persona);


--
-- TOC entry 4081 (class 2606 OID 17425)
-- Name: prescripcion_medicamento prescripcion_medicamento_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescripcion_medicamento
    ADD CONSTRAINT prescripcion_medicamento_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4082 (class 2606 OID 17430)
-- Name: prescripcion_medicamento prescripcion_medicamento_id_medicamento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescripcion_medicamento
    ADD CONSTRAINT prescripcion_medicamento_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES public.medicamento(id_medicamento);


--
-- TOC entry 4083 (class 2606 OID 17435)
-- Name: referencia_traslado referencia_traslado_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referencia_traslado
    ADD CONSTRAINT referencia_traslado_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4084 (class 2606 OID 17440)
-- Name: referencia_traslado referencia_traslado_id_guia_diagnostico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referencia_traslado
    ADD CONSTRAINT referencia_traslado_id_guia_diagnostico_fkey FOREIGN KEY (id_guia_diagnostico) REFERENCES public.guia_clinica(id_guia_diagnostico);


--
-- TOC entry 4085 (class 2606 OID 17445)
-- Name: registro_transfusion registro_transfusion_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registro_transfusion
    ADD CONSTRAINT registro_transfusion_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4086 (class 2606 OID 17450)
-- Name: registro_transfusion registro_transfusion_id_medico_responsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registro_transfusion
    ADD CONSTRAINT registro_transfusion_id_medico_responsable_fkey FOREIGN KEY (id_medico_responsable) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4087 (class 2606 OID 17455)
-- Name: signos_vitales signos_vitales_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signos_vitales
    ADD CONSTRAINT signos_vitales_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4088 (class 2606 OID 17460)
-- Name: solicitud_estudio solicitud_estudio_id_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitud_estudio
    ADD CONSTRAINT solicitud_estudio_id_documento_fkey FOREIGN KEY (id_documento) REFERENCES public.documento_clinico(id_documento);


--
-- TOC entry 4089 (class 2606 OID 17465)
-- Name: solicitud_estudio solicitud_estudio_id_estudio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitud_estudio
    ADD CONSTRAINT solicitud_estudio_id_estudio_fkey FOREIGN KEY (id_estudio) REFERENCES public.estudio_medico(id_estudio);


--
-- TOC entry 4054 (class 2606 OID 17470)
-- Name: vacunas_adicionales vacunas_adicionales_id_inmunizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacunas_adicionales
    ADD CONSTRAINT vacunas_adicionales_id_inmunizacion_fkey FOREIGN KEY (id_inmunizacion) REFERENCES public.inmunizaciones(id_inmunizacion);


--
-- TOC entry 4055 (class 2606 OID 17475)
-- Name: vacunas_adicionales vacunas_adicionales_id_vacuna_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacunas_adicionales
    ADD CONSTRAINT vacunas_adicionales_id_vacuna_fkey FOREIGN KEY (id_vacuna) REFERENCES public.catalogo_vacunas(id_vacuna);


--
-- TOC entry 4056 (class 2606 OID 17480)
-- Name: vacunas_adicionales vacunas_adicionales_registrado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacunas_adicionales
    ADD CONSTRAINT vacunas_adicionales_registrado_por_fkey FOREIGN KEY (registrado_por) REFERENCES public.personal_medico(id_personal_medico);


--
-- TOC entry 4090 (class 2606 OID 17485)
-- Name: validacion_reingreso validacion_reingreso_id_expediente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validacion_reingreso
    ADD CONSTRAINT validacion_reingreso_id_expediente_fkey FOREIGN KEY (id_expediente) REFERENCES public.expediente(id_expediente);


--
-- TOC entry 4091 (class 2606 OID 17490)
-- Name: validacion_reingreso validacion_reingreso_id_internamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validacion_reingreso
    ADD CONSTRAINT validacion_reingreso_id_internamiento_fkey FOREIGN KEY (id_internamiento) REFERENCES public.internamiento(id_internamiento);


--
-- TOC entry 4092 (class 2606 OID 17495)
-- Name: validacion_reingreso validacion_reingreso_id_medico_validador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validacion_reingreso
    ADD CONSTRAINT validacion_reingreso_id_medico_validador_fkey FOREIGN KEY (id_medico_validador) REFERENCES public.personal_medico(id_personal_medico);


-- Completed on 2025-07-14 23:08:04 CST

--
-- PostgreSQL database dump complete
--
