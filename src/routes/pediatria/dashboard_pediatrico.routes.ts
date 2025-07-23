import { Router } from "express";
import { DashboardPediatricoController } from "../../controllers/pediatria/dashboard_pediatrico.controller";

const router = Router();

router.get('/estadisticas', DashboardPediatricoController.obtenerEstadisticas);
router.get('/pacientes-activos', DashboardPediatricoController.obtenerPacientesActivos);
router.get('/distribucion-edades', DashboardPediatricoController.obtenerDistribucionEdades);
router.get('/alertas', DashboardPediatricoController.obtenerAlertasPediatricas);

export default router;