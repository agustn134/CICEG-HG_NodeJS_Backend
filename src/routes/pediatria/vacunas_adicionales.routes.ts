import { Router } from "express";
import { VacunasAdicionalesController } from "../../controllers/pediatria/vacunas_adicionales.controller";

const router = Router();

router.post('/', VacunasAdicionalesController.agregar);
router.get('/inmunizacion/:id_inmunizacion', VacunasAdicionalesController.obtenerPorInmunizacion);
router.get('/catalogo', VacunasAdicionalesController.obtenerCatalogo);
router.get('/buscar', VacunasAdicionalesController.buscarVacunas);
router.get('/reporte', VacunasAdicionalesController.obtenerReporte);
router.post('/catalogo', VacunasAdicionalesController.agregarAlCatalogo);
router.put('/:id', VacunasAdicionalesController.actualizar);
router.delete('/:id', VacunasAdicionalesController.eliminar);

export default router;