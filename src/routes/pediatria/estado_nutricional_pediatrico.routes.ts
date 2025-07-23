import { Router } from "express";
import { EstadoNutricionalPediatricoController } from "../../controllers/pediatria/estado_nutricional_pediatrico.controller";

const router = Router();

router.post('/', EstadoNutricionalPediatricoController.crear);
router.get('/historia-clinica/:id_historia_clinica', EstadoNutricionalPediatricoController.obtenerPorHistoriaClinica);
router.get('/alertas', EstadoNutricionalPediatricoController.obtenerAlertasNutricionales);
router.post('/calcular-percentiles', EstadoNutricionalPediatricoController.calcularPercentiles);
router.put('/:id', EstadoNutricionalPediatricoController.actualizar);
router.delete('/:id', EstadoNutricionalPediatricoController.eliminar);

export default router;