import { Router } from "express";
import { AntecedentesHeredoFamiliaresController } from "../../controllers/pediatria/antecedentes_heredo_familiares.controller";

const router = Router();

router.post('/', AntecedentesHeredoFamiliaresController.crear);
router.get('/historia-clinica/:id_historia_clinica', AntecedentesHeredoFamiliaresController.obtenerPorHistoriaClinica);
router.put('/:id', AntecedentesHeredoFamiliaresController.actualizar);
router.delete('/:id', AntecedentesHeredoFamiliaresController.eliminar);

export default router;