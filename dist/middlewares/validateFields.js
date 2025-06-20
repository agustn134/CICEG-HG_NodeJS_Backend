"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateFields = (rules) => {
    return (req, res, next) => {
        const errors = [];
        rules.forEach(rule => {
            const { field, required = true, type, message } = rule;
            const value = req.body[field];
            if (required && (value === undefined || value === null || value === '')) {
                errors.push(`El campo ${field} es requerido.`);
            }
            if (type && value !== undefined && value !== null) {
                switch (type) {
                    case 'string':
                        if (typeof value !== 'string') {
                            errors.push(`El campo ${field} debe ser una cadena de texto.`);
                        }
                        break;
                    case 'number':
                        if (typeof value !== 'number') {
                            errors.push(`El campo ${field} debe ser un número.`);
                        }
                        break;
                    case 'boolean':
                        if (typeof value !== 'boolean') {
                            errors.push(`El campo ${field} debe ser un booleano.`);
                        }
                        break;
                    case 'date':
                        if (isNaN(Date.parse(value))) {
                            errors.push(`El campo ${field} debe ser una fecha válida.`);
                        }
                        break;
                    case 'array':
                        if (!Array.isArray(value)) {
                            errors.push(`El campo ${field} debe ser un array.`);
                        }
                        break;
                    default:
                        errors.push(`El campo ${field} tiene un tipo de validación no reconocido.`);
                }
            }
            if (message) {
                errors.push(message);
            }
        });
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        next();
    };
};
exports.default = validateFields;
