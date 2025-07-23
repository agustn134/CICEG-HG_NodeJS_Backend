"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoNutricionalPediatricoController = void 0;
const database_1 = __importDefault(require("../../config/database"));
const responses_1 = require("../../utils/responses");
class EstadoNutricionalPediatricoController {
    // Crear estado nutricional
    static async crear(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id_historia_clinica, peso_kg, talla_cm, perimetro_cefalico_cm, perimetro_brazo_cm, percentil_peso, percentil_talla, percentil_perimetro_cefalico, peso_para_edad, talla_para_edad, peso_para_talla, aspecto_general, estado_hidratacion, palidez_mucosas, edemas, masa_muscular, tejido_adiposo, tipo_alimentacion, edad_ablactacion_meses, numero_comidas_dia, apetito, alimentos_rechazados, diagnostico_nutricional, recomendaciones_nutricionales } = req.body;
            const query = `
        INSERT INTO estado_nutricional_pediatrico (
          id_historia_clinica, peso_kg, talla_cm, perimetro_cefalico_cm,
          perimetro_brazo_cm, percentil_peso, percentil_talla, percentil_perimetro_cefalico,
          peso_para_edad, talla_para_edad, peso_para_talla, aspecto_general,
          estado_hidratacion, palidez_mucosas, edemas, masa_muscular, tejido_adiposo,
          tipo_alimentacion, edad_ablactacion_meses, numero_comidas_dia, apetito,
          alimentos_rechazados, diagnostico_nutricional, recomendaciones_nutricionales
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        RETURNING *
      `;
            const values = [
                id_historia_clinica, peso_kg, talla_cm, perimetro_cefalico_cm,
                perimetro_brazo_cm, percentil_peso, percentil_talla, percentil_perimetro_cefalico,
                peso_para_edad, talla_para_edad, peso_para_talla, aspecto_general,
                estado_hidratacion, palidez_mucosas, edemas, masa_muscular, tejido_adiposo,
                tipo_alimentacion, edad_ablactacion_meses, numero_comidas_dia, apetito,
                alimentos_rechazados, diagnostico_nutricional, recomendaciones_nutricionales
            ];
            const result = await client.query(query, values);
            responses_1.ResponseHelper.created(res, 'Estado nutricional creado exitosamente', result.rows[0]);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al crear estado nutricional', 500, error);
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
        SELECT enp.*,
          ROUND(enp.peso_kg / POWER(enp.talla_cm/100, 2), 2) as imc_calculado,
          CASE 
            WHEN enp.percentil_peso < 3 THEN 'Bajo peso severo'
            WHEN enp.percentil_peso < 10 THEN 'Bajo peso'
            WHEN enp.percentil_peso > 97 THEN 'Obesidad'
            WHEN enp.percentil_peso > 85 THEN 'Sobrepeso'
            ELSE 'Normal'
          END as clasificacion_peso
        FROM estado_nutricional_pediatrico enp
        WHERE id_historia_clinica = $1
        ORDER BY fecha_registro DESC
      `;
            const result = await client.query(query, [id_historia_clinica]);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Estado nutricional');
                return;
            }
            responses_1.ResponseHelper.success(res, 'Estado nutricional obtenido exitosamente', result.rows);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al obtener estado nutricional', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Actualizar estado nutricional
    static async actualizar(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id } = req.params;
            const { peso_kg, talla_cm, perimetro_cefalico_cm, perimetro_brazo_cm, percentil_peso, percentil_talla, percentil_perimetro_cefalico, peso_para_edad, talla_para_edad, peso_para_talla, aspecto_general, estado_hidratacion, palidez_mucosas, edemas, masa_muscular, tejido_adiposo, tipo_alimentacion, edad_ablactacion_meses, numero_comidas_dia, apetito, alimentos_rechazados, diagnostico_nutricional, recomendaciones_nutricionales } = req.body;
            const query = `
        UPDATE estado_nutricional_pediatrico SET
          peso_kg = $2, talla_cm = $3, perimetro_cefalico_cm = $4,
          perimetro_brazo_cm = $5, percentil_peso = $6, percentil_talla = $7,
          percentil_perimetro_cefalico = $8, peso_para_edad = $9, talla_para_edad = $10,
          peso_para_talla = $11, aspecto_general = $12, estado_hidratacion = $13,
          palidez_mucosas = $14, edemas = $15, masa_muscular = $16, tejido_adiposo = $17,
          tipo_alimentacion = $18, edad_ablactacion_meses = $19, numero_comidas_dia = $20,
          apetito = $21, alimentos_rechazados = $22, diagnostico_nutricional = $23,
          recomendaciones_nutricionales = $24
        WHERE id_nutricional = $1
        RETURNING *
      `;
            const values = [
                id, peso_kg, talla_cm, perimetro_cefalico_cm, perimetro_brazo_cm,
                percentil_peso, percentil_talla, percentil_perimetro_cefalico,
                peso_para_edad, talla_para_edad, peso_para_talla, aspecto_general,
                estado_hidratacion, palidez_mucosas, edemas, masa_muscular, tejido_adiposo,
                tipo_alimentacion, edad_ablactacion_meses, numero_comidas_dia, apetito,
                alimentos_rechazados, diagnostico_nutricional, recomendaciones_nutricionales
            ];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Estado nutricional');
                return;
            }
            responses_1.ResponseHelper.updated(res, 'Estado nutricional actualizado exitosamente', result.rows[0]);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al actualizar estado nutricional', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Eliminar estado nutricional
    static async eliminar(req, res) {
        const client = await database_1.default.connect();
        try {
            const { id } = req.params;
            const query = `
        DELETE FROM estado_nutricional_pediatrico 
        WHERE id_nutricional = $1
        RETURNING *
      `;
            const result = await client.query(query, [id]);
            if (result.rows.length === 0) {
                responses_1.ResponseHelper.notFound(res, 'Estado nutricional');
                return;
            }
            responses_1.ResponseHelper.deleted(res, 'Estado nutricional');
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al eliminar estado nutricional', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Obtener alertas nutricionales
    static async obtenerAlertasNutricionales(req, res) {
        const client = await database_1.default.connect();
        try {
            const query = `
        SELECT 
          enp.id_nutricional,
          e.numero_expediente,
          CONCAT(per.nombre, ' ', per.apellido_paterno) as nombre_paciente,
          edad_en_anos(per.fecha_nacimiento) as edad_anos,
          enp.peso_kg,
          enp.talla_cm,
          enp.percentil_peso,
          enp.diagnostico_nutricional,
          enp.fecha_registro,
          CASE 
            WHEN enp.percentil_peso < 3 THEN 'CRÍTICO'
            WHEN enp.percentil_peso < 10 THEN 'ALERTA'
            WHEN enp.percentil_peso > 97 THEN 'OBESIDAD'
            WHEN enp.percentil_peso > 85 THEN 'SOBREPESO'
          END as nivel_alerta
        FROM estado_nutricional_pediatrico enp
        JOIN historia_clinica hc ON enp.id_historia_clinica = hc.id_historia_clinica
        JOIN documento_clinico dc ON hc.id_documento = dc.id_documento
        JOIN expediente e ON dc.id_expediente = e.id_expediente
        JOIN paciente pac ON e.id_paciente = pac.id_paciente
        JOIN persona per ON pac.id_persona = per.id_persona
        WHERE (enp.percentil_peso < 10 OR enp.percentil_peso > 85)
          AND per.es_pediatrico = TRUE
        ORDER BY 
          CASE 
            WHEN enp.percentil_peso < 3 THEN 1
            WHEN enp.percentil_peso < 10 THEN 2
            WHEN enp.percentil_peso > 97 THEN 3
            ELSE 4
          END,
          enp.fecha_registro DESC
      `;
            const result = await client.query(query);
            responses_1.ResponseHelper.success(res, 'Alertas nutricionales obtenidas exitosamente', result.rows);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al obtener alertas nutricionales', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Calcular percentiles automáticamente (función auxiliar)
    static async calcularPercentiles(req, res) {
        const client = await database_1.default.connect();
        try {
            const { peso, talla, edad_meses, sexo } = req.body;
            // Esta sería una función más compleja que calcularía percentiles basados en tablas OMS
            // Por ahora, devolvemos una estructura básica
            const percentiles = {
                percentil_peso: this.calcularPercentilPeso(peso, edad_meses, sexo),
                percentil_talla: this.calcularPercentilTalla(talla, edad_meses, sexo),
                imc: Math.round((peso / Math.pow(talla / 100, 2)) * 100) / 100,
                clasificacion: this.clasificarEstadoNutricional(peso, talla, edad_meses, sexo)
            };
            responses_1.ResponseHelper.success(res, 'Percentiles calculados exitosamente', percentiles);
        }
        catch (error) {
            responses_1.ResponseHelper.error(res, 'Error al calcular percentiles', 500, error);
        }
        finally {
            client.release();
        }
    }
    // Funciones auxiliares para cálculos
    static calcularPercentilPeso(peso, edad_meses, sexo) {
        // Implementación simplificada - en producción usarías tablas OMS
        if (peso < 3)
            return 3;
        if (peso > 20)
            return 97;
        return Math.floor(Math.random() * 94) + 3; // Placeholder
    }
    static calcularPercentilTalla(talla, edad_meses, sexo) {
        // Implementación simplificada
        if (talla < 50)
            return 3;
        if (talla > 120)
            return 97;
        return Math.floor(Math.random() * 94) + 3; // Placeholder
    }
    static clasificarEstadoNutricional(peso, talla, edad_meses, sexo) {
        const imc = peso / Math.pow(talla / 100, 2);
        if (imc < 15)
            return 'Desnutrición severa';
        if (imc < 17)
            return 'Desnutrición moderada';
        if (imc < 18.5)
            return 'Bajo peso';
        if (imc < 25)
            return 'Normal';
        if (imc < 30)
            return 'Sobrepeso';
        return 'Obesidad';
    }
}
exports.EstadoNutricionalPediatricoController = EstadoNutricionalPediatricoController;
