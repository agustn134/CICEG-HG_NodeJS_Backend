// src/utils/inicializar-sistema.ts
import fs from 'fs';
import path from 'path';

export class InicializadorSistema {
  
  static async inicializarLogosDefault(): Promise<void> {
    const uploadPath = path.join(__dirname, '../../public/uploads/logos');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
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
      const rutaArchivo = path.join(uploadPath, archivo.nombre.replace('.png', '.svg'));
      
      if (!fs.existsSync(rutaArchivo)) {
        fs.writeFileSync(rutaArchivo, archivo.contenido);
        console.log(`   Creado: ${archivo.nombre} como SVG`);
      }
    }

    // Copiar favicon si está disponible
    await this.copiarFavicon(uploadPath);
  }

  private static crearLogoSVG(texto: string, color: string, width: number, height: number): string {
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

  private static async copiarFavicon(uploadPath: string): Promise<void> {
    // Intentar copiar favicon desde diferentes ubicaciones posibles
    const posiblesFavicons = [
      path.join(__dirname, '../../public/favicon.ico'),
      path.join(__dirname, '../../../frontend/public/favicon.ico'),
      path.join(__dirname, '../../favicon.ico')
    ];

    const destinoFavicon = path.join(uploadPath, 'favicon.ico');
    
    if (!fs.existsSync(destinoFavicon)) {
      for (const origen of posiblesFavicons) {
        if (fs.existsSync(origen)) {
          fs.copyFileSync(origen, destinoFavicon);
          console.log(`   Favicon copiado desde: ${origen}`);
          return;
        }
      }
      
      // Si no se encuentra, crear uno SVG simple
      const faviconSVG = this.crearLogoSVG('H', '#1e40af', 32, 32);
      fs.writeFileSync(path.join(uploadPath, 'favicon.svg'), faviconSVG);
      console.log('   Favicon SVG creado como fallback');
    }
  }
}