// src/routes/configuracion.routes.ts
import { Router } from 'express';
import { 
  getConfiguracionLogos, 
  actualizarConfiguracion, 
  subirLogo, 
  upload 
} from '../controllers/configuracion.controller';

const router = Router();

// GET /api/configuracion/logos - Obtener configuración de logos
router.get('/logos', getConfiguracionLogos);

// PUT /api/configuracion/logos - Actualizar configuración de textos/colores
router.put('/logos', actualizarConfiguracion);

// POST /api/configuracion/upload-logo - Subir archivo de logo
router.post('/upload-logo', upload.single('archivo'), subirLogo);

export default router;