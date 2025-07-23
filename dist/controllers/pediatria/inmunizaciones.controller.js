"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InmunizacionesController = void 0;
const database_1 = __importDefault(require("../../config/database"));
const responses_1 = require("../../utils/responses");
class InmunizacionesController {
    // Crear esquema de inmunizaciones
    static async crear(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id_historia_clinica, bcg_fecha, bcg_observaciones, hepatitis_b_1_fecha, hepatitis_b_2_fecha, hepatitis_b_3_fecha, hepatitis_b_observaciones, pentavalente_1_fecha, pentavalente_2_fecha, pentavalente_3_fecha, pentavalente_observaciones, rotavirus_1_fecha, rotavirus_2_fecha, rotavirus_3_fecha, rotavirus_observaciones, neumococo_1_fecha, neumococo_2_fecha, neumococo_3_fecha, neumococo_refuerzo_fecha, neumococo_observaciones, influenza_fecha, influenza_observaciones, srp_12_meses_fecha, srp_6_anos_fecha, srp_observaciones, dpt_4_anos_fecha, dpt_observaciones, varicela_fecha, varicela_observaciones, hepatitis_a_fecha, hepatitis_a_observaciones, vph_fecha, vph_observaciones, esquema_completo_edad, esquema_incompleto_razon, reacciones_adversas } = req.body;
            const query = `
        INSERT INTO inmunizaciones (
          id_historia_clinica, bcg_fecha, bcg_observaciones,
          hepatitis_b_1_fecha, hepatitis_b_2_fecha, hepatitis_b_3_fecha, hepatitis_b_observaciones,
          pentavalente_1_fecha, pentavalente_2_fecha, pentavalente_3_fecha, pentavalente_observaciones,
          rotavirus_1_fecha, rotavirus_2_fecha, rotavirus_3_fecha, rotavirus_observaciones,
          neumococo_1_fecha, neumococo_2_fecha, neumococo_3_fecha, neumococo_refuerzo_fecha, neumococo_observaciones,
          influenza_fecha, influenza_observaciones,
          srp_12_meses_fecha, srp_6_anos_fecha, srp_observaciones,
          dpt_4_anos_fecha, dpt_observaciones,
          varicela_fecha, varicela_observaciones,
          hepatitis_a_fecha, hepatitis_a_observaciones,
          vph_fecha, vph_observaciones,
          esquema_completo_edad, esquema_incompleto_razon, reacciones_adversas
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36)
        RETURNING *
      `;
            const values = [
                id_historia_clinica, bcg_fecha, bcg_observaciones,
                hepatitis_b_1_fecha, hepatitis_b_2_fecha, hepatitis_b_3_fecha, hepatitis_b_observaciones,
                pentavalente_1_fecha, pentavalente_2_fecha, pentavalente_3_fecha, pentavalente_observaciones,
                rotavirus_1_fecha, rotavirus_2_fecha, rotavirus_3_fecha, rotavirus_observaciones,
                neumococo_1_fecha, neumococo_2_fecha, neumococo_3_fecha, neumococo_refuerzo_fecha, neumococo_observaciones,
                influenza_fecha, influenza_observaciones,
                srp_12_meses_fecha, srp_6_anos_fecha, srp_observaciones,
                dpt_4_anos_fecha, dpt_observaciones,
                varicela_fecha, varicela_observaciones,
                hepatitis_a_fecha, hepatitis_a_observaciones,
                vph_fecha, vph_observaciones,
                esquema_completo_edad, esquema_incompleto_razon, reacciones_adversas
            ];
            const result = await client.query(query, values);
            responses_1.ResponseHelper.created(res, 'Esquema de inmunizaciones creado exitosamente', result.rows[0]);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al crear esquema de inmunizaciones', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Obtener esquema completo de vacunación
    static async obtenerEsquemaCompleto(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id_historia_clinica } = req.params;
            const query = `
        SELECT * FROM esquema_vacunacion_completo 
        WHERE id_historia_clinica = $1
      `;
            const result = await client.query(query, [id_historia_clinica]);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Esquema de vacunación');
                return;
            }
            responses_1.ResponseHelper.success(res, 'Esquema de vacunación obtenido exitosamente', result.rows[0]);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al obtener esquema de vacunación', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Obtener historial completo de vacunas
    static async obtenerHistorialCompleto(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id_inmunizacion } = req.params;
            const query = `SELECT * FROM obtener_historial_vacunas_completo($1)`;
            const result = await client.query(query, [id_inmunizacion]);
            responses_1.ResponseHelper.success(res, 'Historial de vacunas obtenido exitosamente', result.rows);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al obtener historial de vacunas', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Actualizar esquema de inmunizaciones
    static async actualizar(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id } = req.params;
            const { bcg_fecha, bcg_observaciones, hepatitis_b_1_fecha, hepatitis_b_2_fecha, hepatitis_b_3_fecha, hepatitis_b_observaciones, pentavalente_1_fecha, pentavalente_2_fecha, pentavalente_3_fecha, pentavalente_observaciones, rotavirus_1_fecha, rotavirus_2_fecha, rotavirus_3_fecha, rotavirus_observaciones, neumococo_1_fecha, neumococo_2_fecha, neumococo_3_fecha, neumococo_refuerzo_fecha, neumococo_observaciones, influenza_fecha, influenza_observaciones, srp_12_meses_fecha, srp_6_anos_fecha, srp_observaciones, dpt_4_anos_fecha, dpt_observaciones, varicela_fecha, varicela_observaciones, hepatitis_a_fecha, hepatitis_a_observaciones, vph_fecha, vph_observaciones, esquema_completo_edad, esquema_incompleto_razon, reacciones_adversas } = req.body;
            const query = `
        UPDATE inmunizaciones SET
          bcg_fecha = $2, bcg_observaciones = $3,
          hepatitis_b_1_fecha = $4, hepatitis_b_2_fecha = $5, hepatitis_b_3_fecha = $6, hepatitis_b_observaciones = $7,
         pentavalente_1_fecha = $8, pentavalente_2_fecha = $9, pentavalente_3_fecha = $10, pentavalente_observaciones = $11,
         rotavirus_1_fecha = $12, rotavirus_2_fecha = $13, rotavirus_3_fecha = $14, rotavirus_observaciones = $15,
         neumococo_1_fecha = $16, neumococo_2_fecha = $17, neumococo_3_fecha = $18, neumococo_refuerzo_fecha = $19, neumococo_observaciones = $20,
         influenza_fecha = $21, influenza_observaciones = $22,
         srp_12_meses_fecha = $23, srp_6_anos_fecha = $24, srp_observaciones = $25,
         dpt_4_anos_fecha = $26, dpt_observaciones = $27,
         varicela_fecha = $28, varicela_observaciones = $29,
         hepatitis_a_fecha = $30, hepatitis_a_observaciones = $31,
         vph_fecha = $32, vph_observaciones = $33,
         esquema_completo_edad = $34, esquema_incompleto_razon = $35, reacciones_adversas = $36
       WHERE id_inmunizacion = $1
       RETURNING *
     `;
            const values = [
                id, bcg_fecha, bcg_observaciones,
                hepatitis_b_1_fecha, hepatitis_b_2_fecha, hepatitis_b_3_fecha, hepatitis_b_observaciones,
                pentavalente_1_fecha, pentavalente_2_fecha, pentavalente_3_fecha, pentavalente_observaciones,
                rotavirus_1_fecha, rotavirus_2_fecha, rotavirus_3_fecha, rotavirus_observaciones,
                neumococo_1_fecha, neumococo_2_fecha, neumococo_3_fecha, neumococo_refuerzo_fecha, neumococo_observaciones,
                influenza_fecha, influenza_observaciones,
                srp_12_meses_fecha, srp_6_anos_fecha, srp_observaciones,
                dpt_4_anos_fecha, dpt_observaciones,
                varicela_fecha, varicela_observaciones,
                hepatitis_a_fecha, hepatitis_a_observaciones,
                vph_fecha, vph_observaciones,
                esquema_completo_edad, esquema_incompleto_razon, reacciones_adversas
            ];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Esquema de inmunizaciones');
                return;
            }
            responses_1.ResponseHelper.updated(res, 'Esquema de inmunizaciones actualizado exitosamente', result.rows[0]);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al actualizar esquema de inmunizaciones', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Eliminar esquema de inmunizaciones
    static async eliminar(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id } = req.params;
            const query = `
       DELETE FROM inmunizaciones 
       WHERE id_inmunizacion = $1
       RETURNING *
     `;
            const result = await client.query(query, [id]);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Esquema de inmunizaciones');
                return;
            }
            responses_1.ResponseHelper.deleted(res, 'Esquema de inmunizaciones');
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al eliminar esquema de inmunizaciones', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Verificar completitud del esquema
    static async verificarCompletitud(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id_inmunizacion } = req.params;
            const query = `
       SELECT 
         i.*,
         -- Contar vacunas aplicadas del esquema básico
         (CASE WHEN bcg_fecha IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN hepatitis_b_3_fecha IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN pentavalente_3_fecha IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN rotavirus_3_fecha IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN neumococo_refuerzo_fecha IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN srp_12_meses_fecha IS NOT NULL THEN 1 ELSE 0 END) as vacunas_basicas_aplicadas,
         
         -- Obtener edad del paciente
         (SELECT edad_total_meses(per.fecha_nacimiento) 
          FROM historia_clinica hc 
          JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
          JOIN expediente e ON dc.id_expediente = e.id_expediente
          JOIN paciente pac ON e.id_paciente = pac.id_paciente
          JOIN persona per ON pac.id_persona = per.id_persona
          WHERE hc.id_historia_clinica = i.id_historia_clinica) as edad_meses,
         
         -- Contar vacunas adicionales
         (SELECT COUNT(*) FROM vacunas_adicionales va WHERE va.id_inmunizacion = i.id_inmunizacion) as vacunas_adicionales
         
       FROM inmunizaciones i
       WHERE id_inmunizacion = $1
     `;
            const result = await client.query(query, [id_inmunizacion]);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Esquema de inmunizaciones');
                return;
            }
            const data = result.rows[0];
            const edadMeses = data.edad_meses;
            // Lógica para determinar completitud según edad
            let esquemaEsperado = 0;
            let recomendaciones = [];
            if (edadMeses >= 2) {
                esquemaEsperado += 1; // BCG
                if (!data.bcg_fecha)
                    recomendaciones.push('BCG pendiente');
            }
            if (edadMeses >= 6) {
                esquemaEsperado += 1; // Hepatitis B completa
                if (!data.hepatitis_b_3_fecha)
                    recomendaciones.push('Hepatitis B incompleta');
            }
            if (edadMeses >= 6) {
                esquemaEsperado += 1; // Pentavalente completa
                if (!data.pentavalente_3_fecha)
                    recomendaciones.push('Pentavalente incompleta');
            }
            if (edadMeses >= 12) {
                esquemaEsperado += 1; // SRP
                if (!data.srp_12_meses_fecha)
                    recomendaciones.push('SRP de 12 meses pendiente');
            }
            const porcentajeCompletitud = esquemaEsperado > 0 ?
                Math.round((data.vacunas_basicas_aplicadas / esquemaEsperado) * 100) : 0;
            responses_1.ResponseHelper.success(res, 'Verificación de completitud realizada exitosamente', {
                ...data,
                esquema_esperado: esquemaEsperado,
                porcentaje_completitud: porcentajeCompletitud,
                recomendaciones: recomendaciones,
                estado_esquema: porcentajeCompletitud >= 80 ? 'Completo' :
                    porcentajeCompletitud >= 50 ? 'Parcial' : 'Incompleto'
            });
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al verificar completitud del esquema', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Obtener próximas vacunas recomendadas
    static async obtenerProximasVacunas(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id_inmunizacion } = req.params;
            const query = `
       SELECT 
         i.*,
         (SELECT edad_total_meses(per.fecha_nacimiento) 
          FROM historia_clinica hc 
          JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
          JOIN expediente e ON dc.id_expediente = e.id_expediente
          JOIN paciente pac ON e.id_paciente = pac.id_paciente
          JOIN persona per ON pac.id_persona = per.id_persona
          WHERE hc.id_historia_clinica = i.id_historia_clinica) as edad_meses
       FROM inmunizaciones i
       WHERE id_inmunizacion = $1
     `;
            const result = await client.query(query, [id_inmunizacion]);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Esquema de inmunizaciones');
                return;
            }
            const data = result.rows[0];
            const edadMeses = data.edad_meses;
            const proximasVacunas = [];
            // Lógica para próximas vacunas según edad y estado actual
            if (edadMeses >= 2 && !data.bcg_fecha) {
                proximasVacunas.push({
                    vacuna: 'BCG',
                    edad_recomendada: 'Recién nacido a 2 meses',
                    urgencia: 'Alta',
                    observaciones: 'Vacuna obligatoria contra tuberculosis'
                });
            }
            if (edadMeses >= 2 && !data.hepatitis_b_1_fecha) {
                proximasVacunas.push({
                    vacuna: 'Hepatitis B - 1era dosis',
                    edad_recomendada: '2 meses',
                    urgencia: 'Alta',
                    observaciones: 'Iniciar esquema de Hepatitis B'
                });
            }
            if (edadMeses >= 4 && data.hepatitis_b_1_fecha && !data.hepatitis_b_2_fecha) {
                proximasVacunas.push({
                    vacuna: 'Hepatitis B - 2da dosis',
                    edad_recomendada: '4 meses',
                    urgencia: 'Media',
                    observaciones: 'Continuar esquema de Hepatitis B'
                });
            }
            if (edadMeses >= 6 && data.hepatitis_b_2_fecha && !data.hepatitis_b_3_fecha) {
                proximasVacunas.push({
                    vacuna: 'Hepatitis B - 3era dosis',
                    edad_recomendada: '6 meses',
                    urgencia: 'Media',
                    observaciones: 'Completar esquema de Hepatitis B'
                });
            }
            if (edadMeses >= 12 && !data.srp_12_meses_fecha) {
                proximasVacunas.push({
                    vacuna: 'SRP (Sarampión, Rubéola, Parotiditis)',
                    edad_recomendada: '12 meses',
                    urgencia: 'Alta',
                    observaciones: 'Vacuna triple viral obligatoria'
                });
            }
            if (edadMeses >= 72 && data.srp_12_meses_fecha && !data.srp_6_anos_fecha) {
                proximasVacunas.push({
                    vacuna: 'SRP - Refuerzo',
                    edad_recomendada: '6 años',
                    urgencia: 'Media',
                    observaciones: 'Refuerzo de triple viral'
                });
            }
            responses_1.ResponseHelper.success(res, 'Próximas vacunas obtenidas exitosamente', {
                edad_actual_meses: edadMeses,
                proximas_vacunas: proximasVacunas,
                total_pendientes: proximasVacunas.length
            });
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al obtener próximas vacunas', 500, error);
        }
        finally {
            client.release();
        }
    }
}
exports.InmunizacionesController = InmunizacionesController;
