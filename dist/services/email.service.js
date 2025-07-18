"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
// /home/agustin/CICEG-HG_NodeJS_Backend/src/services/email.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'siceghospital.slp.gto@gmail.com',
                pass: 'mvfe kreq rdsg qcdd' // Tu contraseña de aplicación
            }
        });
    }
    async sendPasswordResetEmail(email, resetToken) {
        try {
            // 🔧 CORREGIDO: Cambiar ruta del enlace
            const resetLink = `http://localhost:4200/cambiar-password?token=${resetToken}`;
            const mailOptions = {
                from: '"Hospital General - SICEG" <siceghospital.slp.gto@gmail.com>',
                to: email,
                subject: 'Recuperación de Contraseña - SICEG',
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de Contraseña</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { color: #2563eb; font-size: 24px; font-weight: bold; margin-bottom: 5px; }
              .subtitle { color: #666; font-size: 14px; }
              .content { line-height: 1.6; color: #333; }
              .btn { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
              .btn:hover { background-color: #1d4ed8; }
              .warning { background-color: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">SICEG - Hospital General</div>
                <div class="subtitle">San Luis de la Paz, Guanajuato</div>
              </div>
              
              <div class="content">
                <h2 style="color: #2563eb;">Recuperación de Contraseña</h2>
                
                <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta en el Sistema Integral de Expedientes Clínicos Electrónicos (SICEG).</p>
                
                <p>Para crear una nueva contraseña, haga clic en el siguiente enlace:</p>
                
                <div style="text-align: center;">
                  <a href="${resetLink}" class="btn">Restablecer Contraseña</a>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Importante:</strong>
                  <ul>
                    <li>Este enlace es válido por 1 hora únicamente</li>
                    <li>Si no solicitó este cambio, ignore este correo</li>
                    <li>No comparta este enlace con nadie</li>
                  </ul>
                </div>
                
                <p>Si el botón no funciona, copie y pegue el siguiente enlace en su navegador:</p>
                <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">${resetLink}</p>
                
                <p>Si tiene alguna duda o no solicitó este cambio, contacte inmediatamente al administrador del sistema.</p>
                
                <p>Saludos cordiales,<br>
                <strong>Equipo SICEG</strong><br>
                Hospital General de San Luis de la Paz</p>
              </div>
              
              <div class="footer">
                Este es un correo automático del sistema SICEG. No responda a este mensaje.<br>
                © ${new Date().getFullYear()} Hospital General - Todos los derechos reservados.
              </div>
            </div>
          </body>
          </html>
        `
            };
            await this.transporter.sendMail(mailOptions);
            console.log('✅ Correo de recuperación enviado a:', email);
            return true;
        }
        catch (error) {
            console.error('❌ Error enviando correo:', error);
            return false;
        }
    }
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Conexión de email establecida correctamente');
            return true;
        }
        catch (error) {
            console.error('❌ Error en conexión de email:', error);
            return false;
        }
    }
}
exports.EmailService = EmailService;
exports.default = new EmailService();
