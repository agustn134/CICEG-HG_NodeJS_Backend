"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const antecedentes_perinatales_controller_1 = require("../../controllers/pediatria/antecedentes_perinatales.controller");
const router = (0, express_1.Router)();
router.post('/', antecedentes_perinatales_controller_1.AntecedentesPerinatalesController.crear);
router.get('/historia-clinica/:id_historia_clinica', antecedentes_perinatales_controller_1.AntecedentesPerinatalesController.obtenerPorHistoriaClinica);
router.put('/:id', antecedentes_perinatales_controller_1.AntecedentesPerinatalesController.actualizar);
router.delete('/:id', antecedentes_perinatales_controller_1.AntecedentesPerinatalesController.eliminar);
exports.default = router;
