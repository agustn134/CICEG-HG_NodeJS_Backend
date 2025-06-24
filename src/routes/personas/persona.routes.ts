import { Router } from 'express';
import { PersonaController } from '../controllers/personaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { personaValidation } from '../validations/personaValidation';

const router = Router();
const personaController = new PersonaController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas CRUD básicas
router.get('/', personaController.obtenerTodas);
router.get('/buscar', personaController.buscarPersonas);
router.get('/:id', personaController.obtenerPorId);
router.post('/', 
    personaValidation.crear, 
    validationMiddleware, 
    personaController.crear
);
router.put('/:id', 
    personaValidation.actualizar, 
    validationMiddleware, 
    personaController.actualizar
);
router.delete('/:id', personaController.eliminar);

// Rutas específicas
router.get('/:id/expedientes', personaController.obtenerExpedientes);
router.get('/:id/historia-completa', personaController.obtenerHistoriaCompleta);
router.post('/validar-curp', personaController.validarCURP);
router.get('/:id/es-paciente', personaController.verificarSiEsPaciente);
router.get('/:id/es-medico', personaController.verificarSiEsMedico);

// Rutas para búsquedas avanzadas
router.post('/busqueda-avanzada', personaController.busquedaAvanzada);
router.get('/duplicados/posibles', personaController.buscarPosiblesDuplicados);

// Ruta para calcular edad
router.get('/:id/edad', personaController.calcularEdad);

export default router;