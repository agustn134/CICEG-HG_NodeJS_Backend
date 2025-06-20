"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/personas/persona.routes.ts
const express_1 = require("express");
const persona_controller_1 = require("../../controllers/personas/persona.controller");
const router = (0, express_1.Router)();
router.get("/", persona_controller_1.getPersonas);
router.get("/:id", persona_controller_1.getPersonaById);
router.post("/", persona_controller_1.createPersona);
router.put("/:id", persona_controller_1.updatePersona);
router.delete("/:id", persona_controller_1.deletePersona);
exports.default = router;
