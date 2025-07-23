import { Router } from "express";
import { DesarrolloPsicomotrizController } from "../../controllers/pediatria/desarrollo_psicomotriz.controller";

const router = Router();

router.post('/', DesarrolloPsicomotrizController.crear);
router.get('/historia-clinica/:id_historia_clinica', DesarrolloPsicomotrizController.obtenerPorHistoriaClinica);
router.get('/hitos-edad/:edad_meses', DesarrolloPsicomotrizController.obtenerHitosPorEdad);
router.put('/:id', DesarrolloPsicomotrizController.actualizar);
router.delete('/:id', DesarrolloPsicomotrizController.eliminar);

export default router;