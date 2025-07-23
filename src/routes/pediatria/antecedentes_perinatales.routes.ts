import { Router } from "express";
import { AntecedentesPerinatalesController } from "../../controllers/pediatria/antecedentes_perinatales.controller";

const router = Router();

router.post('/', AntecedentesPerinatalesController.crear);
router.get('/historia-clinica/:id_historia_clinica', AntecedentesPerinatalesController.obtenerPorHistoriaClinica);
router.put('/:id', AntecedentesPerinatalesController.actualizar);
router.delete('/:id', AntecedentesPerinatalesController.eliminar);

export default router;