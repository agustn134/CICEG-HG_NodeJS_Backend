"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InicializadorSistema = void 0;
// src/utils/inicializar-sistema.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class InicializadorSistema {
    static async inicializarLogosDefault() {
        const uploadPath = path_1.default.join(__dirname, '../../public/uploads/logos');
        // Crear directorio si no existe
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
            console.log('📁 Directorio de logos creado:', uploadPath);
        }
        // Lista de archivos por defecto necesarios
        const archivosDefault = [
            {
                nombre: 'logo-principal-default.png',
                contenido: this.crearLogoSVG('CICEG-HG', '#1e40af', 200, 80)
            },
            {
                nombre: 'logo-sidebar-default.png',
                contenido: this.crearLogoSVG('HG', '#1e40af', 64, 64)
            },
            {
                nombre: 'logo-gobierno-default.png',
                contenido: this.crearLogoSVG('Gobierno\nGuanajuato', '#1e40af', 150, 80)
            }
        ];
        // Crear archivos SVG por defecto si no existen
        for (const archivo of archivosDefault) {
            const rutaArchivo = path_1.default.join(uploadPath, archivo.nombre.replace('.png', '.svg'));
            if (!fs_1.default.existsSync(rutaArchivo)) {
                fs_1.default.writeFileSync(rutaArchivo, archivo.contenido);
                console.log(`   Creado: ${archivo.nombre} como SVG`);
            }
        }
        // Copiar favicon si está disponible
        await this.copiarFavicon(uploadPath);
    }
    static crearLogoSVG(texto, color, width, height) {
        const lineas = texto.split('\n');
        const fontSize = Math.min(width / 8, height / 4);
        let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>`;
        lineas.forEach((linea, index) => {
            const y = height / 2 + (index - (lineas.length - 1) / 2) * fontSize;
            svgContent += `
  <text x="50%" y="${y}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold">${linea}</text>`;
        });
        svgContent += `
</svg>`;
        return svgContent;
    }
    static async copiarFavicon(uploadPath) {
        // Intentar copiar favicon desde diferentes ubicaciones posibles
        const posiblesFavicons = [
            path_1.default.join(__dirname, '../../public/favicon.ico'),
            path_1.default.join(__dirname, '../../../frontend/public/favicon.ico'),
            path_1.default.join(__dirname, '../../favicon.ico')
        ];
        const destinoFavicon = path_1.default.join(uploadPath, 'favicon.ico');
        if (!fs_1.default.existsSync(destinoFavicon)) {
            for (const origen of posiblesFavicons) {
                if (fs_1.default.existsSync(origen)) {
                    fs_1.default.copyFileSync(origen, destinoFavicon);
                    console.log(`   Favicon copiado desde: ${origen}`);
                    return;
                }
            }
            // Si no se encuentra, crear uno SVG simple
            const faviconSVG = this.crearLogoSVG('H', '#1e40af', 32, 32);
            fs_1.default.writeFileSync(path_1.default.join(uploadPath, 'favicon.svg'), faviconSVG);
            console.log('   Favicon SVG creado como fallback');
        }
    }
}
exports.InicializadorSistema = InicializadorSistema;
