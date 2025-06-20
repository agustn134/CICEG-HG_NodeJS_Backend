// src/middlewares/validateFields.ts
import { Request, Response, NextFunction } from 'express';

interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'array';
  message?: string;
}

const validateFields = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

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

export default validateFields;