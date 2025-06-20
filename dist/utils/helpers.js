"use strict";
// src/utils/helpers.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLowerCase = exports.toUpperCase = exports.isValidCURPComplete = exports.isValidCURP = exports.isValidEmail = exports.generateUUID = exports.handleError = exports.comparePassword = exports.hashPassword = exports.formatDate = exports.isValidField = void 0;
/**
 * Valida que un campo no esté vacío
 * @param value - Valor a validar
 * @returns - Booleano indicando si el campo es válido
 */
const isValidField = (value) => {
    return value !== null && value !== undefined && value !== '';
};
exports.isValidField = isValidField;
/**
 * Formatea una fecha en formato YYYY-MM-DD
 * @param date - Fecha a formatear
 * @returns - Fecha formateada en formato YYYY-MM-DD
 */
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
exports.formatDate = formatDate;
/**
 * Genera un hash para una contraseña
 * @param password - Contraseña a hashear
 * @returns - Hash de la contraseña
 */
const hashPassword = async (password) => {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
/**
 * Compara una contraseña con su hash
 * @param password - Contraseña a comparar
 * @param hash - Hash de la contraseña almacenada
 * @returns - Booleano indicando si la contraseña coincide con el hash
 */
const comparePassword = async (password, hash) => {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, hash);
};
exports.comparePassword = comparePassword;
/**
 * Maneja errores y envía una respuesta de error
 * @param res - Objeto de respuesta de Express
 * @param message - Mensaje de error
 * @param statusCode - Código de estado HTTP
 */
const handleError = (res, message, statusCode = 500) => {
    console.error(message);
    res.status(statusCode).send(message);
};
exports.handleError = handleError;
/**
 * Genera un UUID v4
 * @returns - UUID v4
 */
const generateUUID = () => {
    const crypto = require('crypto');
    return crypto.randomUUID();
};
exports.generateUUID = generateUUID;
/**
 * Valida si una cadena es un correo electrónico válido
 * @param email - Cadena a validar
 * @returns - Booleano indicando si la cadena es un correo electrónico válido
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
/**
 * Valida si una cadena es una CURP válida (método simplificado)
 * @param curp - Cadena a validar
 * @returns - Booleano indicando si la cadena es una CURP válida
 */
const isValidCURP = (curp) => {
    const curpRegex = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;
    return curpRegex.test(curp);
};
exports.isValidCURP = isValidCURP;
/**
 * Valida si una cadena es una CURP válida (método completo)
 * @param curp - Cadena a validar
 * @returns - Booleano indicando si la cadena es una CURP válida
 */
const isValidCURPComplete = (curp) => {
    const curpRegex = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;
    if (!curpRegex.test(curp)) {
        return false;
    }
    // Verificar la suma de verificación (método simplificado)
    const suma = curp.split('').reduce((acc, char, index) => {
        const valor = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.indexOf(char);
        return acc + (valor * (18 - index));
    }, 0);
    const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
    const ultimoCaracter = curp.charAt(17);
    return digitoVerificador.toString() === '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.indexOf(ultimoCaracter).toString();
};
exports.isValidCURPComplete = isValidCURPComplete;
/**
 * Convierte una cadena a mayúsculas
 * @param str - Cadena a convertir
 * @returns - Cadena en mayúsculas
 */
const toUpperCase = (str) => {
    return str.toUpperCase();
};
exports.toUpperCase = toUpperCase;
/**
 * Convierte una cadena a minúsculas
 * @param str - Cadena a convertir
 * @returns - Cadena en minúsculas
 */
const toLowerCase = (str) => {
    return str.toLowerCase();
};
exports.toLowerCase = toLowerCase;
