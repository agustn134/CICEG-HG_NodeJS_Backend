"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntecedentesPerinatalesController = void 0;
const database_1 = __importDefault(require("../../config/database"));
const responses_1 = require("../../utils/responses");
class AntecedentesPerinatalesController {
    // Crear antecedentes perinatales
    static async crear(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id_historia_clinica, embarazo_planeado, numero_embarazo, control_prenatal, numero_consultas_prenatales, complicaciones_embarazo, tipo_parto, semanas_gestacion, peso_nacimiento, talla_nacimiento, apgar_1_min, apgar_5_min, llanto_inmediato, hospitalizacion_neonatal, dias_hospitalizacion_neonatal, problemas_neonatales, alimentacion_neonatal, peso_2_meses, peso_4_meses, peso_6_meses } = req.body;
            const query = `
        INSERT INTO antecedentes_perinatales (
          id_historia_clinica, embarazo_planeado, numero_embarazo, control_prenatal,
          numero_consultas_prenatales, complicaciones_embarazo, tipo_parto,
          semanas_gestacion, peso_nacimiento, talla_nacimiento, apgar_1_min,
          apgar_5_min, llanto_inmediato, hospitalizacion_neonatal,
          dias_hospitalizacion_neonatal, problemas_neonatales, alimentacion_neonatal,
          peso_2_meses, peso_4_meses, peso_6_meses
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;
            const values = [
                id_historia_clinica, embarazo_planeado, numero_embarazo, control_prenatal,
                numero_consultas_prenatales, complicaciones_embarazo, tipo_parto,
                semanas_gestacion, peso_nacimiento, talla_nacimiento, apgar_1_min,
                apgar_5_min, llanto_inmediato, hospitalizacion_neonatal,
                dias_hospitalizacion_neonatal, problemas_neonatales, alimentacion_neonatal,
                peso_2_meses, peso_4_meses, peso_6_meses
            ];
            const result = await client.query(query, values);
            responses_1.ResponseHelper.created(res, 'Antecedentes perinatales creados exitosamente', result.rows[0]);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al crear antecedentes perinatales', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Obtener por ID de historia clínica
    static async obtenerPorHistoriaClinica(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id_historia_clinica } = req.params;
            const query = `
        SELECT * FROM antecedentes_perinatales 
        WHERE id_historia_clinica = $1
      `;
            const result = await client.query(query, [id_historia_clinica]);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Antecedentes perinatales');
                return;
            }
            responses_1.ResponseHelper.success(res, 'Antecedentes perinatales obtenidos exitosamente', result.rows[0]);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al obtener antecedentes perinatales', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Actualizar antecedentes perinatales
    static async actualizar(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id } = req.params;
            const { embarazo_planeado, numero_embarazo, control_prenatal, numero_consultas_prenatales, complicaciones_embarazo, tipo_parto, semanas_gestacion, peso_nacimiento, talla_nacimiento, apgar_1_min, apgar_5_min, llanto_inmediato, hospitalizacion_neonatal, dias_hospitalizacion_neonatal, problemas_neonatales, alimentacion_neonatal, peso_2_meses, peso_4_meses, peso_6_meses } = req.body;
            const query = `
        UPDATE antecedentes_perinatales SET
          embarazo_planeado = $2, numero_embarazo = $3, control_prenatal = $4,
          numero_consultas_prenatales = $5, complicaciones_embarazo = $6, tipo_parto = $7,
          semanas_gestacion = $8, peso_nacimiento = $9, talla_nacimiento = $10, 
          apgar_1_min = $11, apgar_5_min = $12, llanto_inmediato = $13,
          hospitalizacion_neonatal = $14, dias_hospitalizacion_neonatal = $15,
          problemas_neonatales = $16, alimentacion_neonatal = $17,
          peso_2_meses = $18, peso_4_meses = $19, peso_6_meses = $20
        WHERE id_perinatales = $1
        RETURNING *
      `;
            const values = [
                id, embarazo_planeado, numero_embarazo, control_prenatal,
                numero_consultas_prenatales, complicaciones_embarazo, tipo_parto,
                semanas_gestacion, peso_nacimiento, talla_nacimiento, apgar_1_min,
                apgar_5_min, llanto_inmediato, hospitalizacion_neonatal,
                dias_hospitalizacion_neonatal, problemas_neonatales, alimentacion_neonatal,
                peso_2_meses, peso_4_meses, peso_6_meses
            ];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Antecedentes perinatales');
                return;
            }
            responses_1.ResponseHelper.updated(res, 'Antecedentes perinatales actualizados exitosamente', result.rows[0]);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al actualizar antecedentes perinatales', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Eliminar antecedentes perinatales
    static async eliminar(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id } = req.params;
            const query = `
        DELETE FROM antecedentes_perinatales 
        WHERE id_perinatales = $1
        RETURNING *
      `;
            const result = await client.query(query, [id]);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Antecedentes perinatales');
                return;
            }
            responses_1.ResponseHelper.deleted(res, 'Antecedentes perinatales');
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al eliminar antecedentes perinatales', 500, error);
        }
        finally {
            client.release();
        }
    }
}
exports.AntecedentesPerinatalesController = AntecedentesPerinatalesController;
