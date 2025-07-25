"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const desarrollo_psicomotriz_controller_1 = require("../../controllers/pediatria/desarrollo_psicomotriz.controller");
const router = (0, express_1.Router)();
router.post('/', desarrollo_psicomotriz_controller_1.DesarrolloPsicomotrizController.crear);
router.get('/historia-clinica/:id_historia_clinica', desarrollo_psicomotriz_controller_1.DesarrolloPsicomotrizController.obtenerPorHistoriaClinica);
router.get('/hitos-edad/:edad_meses', desarrollo_psicomotriz_controller_1.DesarrolloPsicomotrizController.obtenerHitosPorEdad);
router.put('/:id', desarrollo_psicomotriz_controller_1.DesarrolloPsicomotrizController.actualizar);
router.delete('/:id', desarrollo_psicomotriz_controller_1.DesarrolloPsicomotrizController.eliminar);
exports.default = router;
