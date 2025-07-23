import { Router } from "express";
import { InmunizacionesController } from "../../controllers/pediatria/inmunizaciones.controller";

const router = Router();

router.post('/', InmunizacionesController.crear);
router.get('/esquema-completo/:id_historia_clinica', InmunizacionesController.obtenerEsquemaCompleto);
router.get('/historial/:id_inmunizacion', InmunizacionesController.obtenerHistorialCompleto);
router.get('/verificar-completitud/:id_inmunizacion', InmunizacionesController.verificarCompletitud);
router.get('/proximas-vacunas/:id_inmunizacion', InmunizacionesController.obtenerProximasVacunas);
router.put('/:id', InmunizacionesController.actualizar);
router.delete('/:id', InmunizacionesController.eliminar);

export default router;