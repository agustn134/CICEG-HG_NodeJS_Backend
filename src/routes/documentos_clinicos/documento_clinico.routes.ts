// // src/routes/documentos_clinicos/documento_clinico.routes.ts
// import { Router } from "express";
// import {
//   getDocumentosClinicos,
//   getDocumentoClinicoById,
  
//   createDocumentoClinico,
//   updateDocumentoClinico,
//   deleteDocumentoClinico,
//   getDocumentosByExpediente,
//   getEstadisticasDocumentos
// } from "../../controllers/documentos_clinicos/documento_clinico.controller";

// const router = Router();

// // ==========================================
// // RUTAS PARA DOCUMENTOS CLÍNICOS
// // ==========================================

// // GET /api/documentos-clinicos/documentos/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
// router.get("/estadisticas", getEstadisticasDocumentos);

// // GET /api/documentos-clinicos/documentos/expediente/:id_expediente - Obtener documentos por expediente
//  router.get("/expediente/:id_expediente", getDocumentosByExpediente);
// //router.get('/expediente/:expedienteId', getDocumentosByExpediente);

// // GET /api/documentos-clinicos/documentos - Obtener todos los documentos clínicos
// // Acepta query params: ?page=1&limit=10&id_expediente=1&estado=Activo&buscar=historia
// router.get("/", getDocumentosClinicos);

// // GET /api/documentos-clinicos/documentos/:id - Obtener documento clínico por ID
// router.get("/:id", getDocumentoClinicoById);

// // POST /api/documentos-clinicos/documentos - Crear nuevo documento clínico
// router.post("/", createDocumentoClinico);

// // PUT /api/documentos-clinicos/documentos/:id - Actualizar documento clínico
// router.put("/:id", updateDocumentoClinico);

// // DELETE /api/documentos-clinicos/documentos/:id - Anular documento clínico
// router.delete("/:id", deleteDocumentoClinico);

// export default router;











// src/routes/documentos_clinicos/documento_clinico.routes.ts
import { Router } from "express";
import {
  getDocumentosClinicos,
  getDocumentoClinicoById,
  
  createDocumentoClinico,
  updateDocumentoClinico,
  deleteDocumentoClinico,
  getDocumentosByExpediente,
  getEstadisticasDocumentos
} from "../../controllers/documentos_clinicos/documento_clinico.controller";

const router = Router();

// ==========================================
// RUTAS PARA DOCUMENTOS CLÍNICOS
// ==========================================

// GET /api/documentos-clinicos/documentos/estadisticas - Obtener estadísticas (debe ir ANTES que /:id)
router.get("/estadisticas", getEstadisticasDocumentos);

// GET /api/documentos-clinicos/documentos/expediente/:id_expediente - Obtener documentos por expediente
 router.get("/expediente/:id_expediente", getDocumentosByExpediente);
//router.get('/expediente/:expedienteId', getDocumentosByExpediente);

// GET /api/documentos-clinicos/documentos - Obtener todos los documentos clínicos
// Acepta query params: ?page=1&limit=10&id_expediente=1&estado=Activo&buscar=historia
router.get("/", getDocumentosClinicos);

// GET /api/documentos-clinicos/documentos/:id - Obtener documento clínico por ID
router.get("/:id", getDocumentoClinicoById);

// POST /api/documentos-clinicos/documentos - Crear nuevo documento clínico
router.post("/", createDocumentoClinico);

// PUT /api/documentos-clinicos/documentos/:id - Actualizar documento clínico
router.put("/:id", updateDocumentoClinico);

// DELETE /api/documentos-clinicos/documentos/:id - Anular documento clínico
router.delete("/:id", deleteDocumentoClinico);

export default router;