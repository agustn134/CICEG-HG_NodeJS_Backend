// // /home/agustin/CICEG-HG_NodeJS_Backend/src/services/email.service.ts
// import nodemailer from 'nodemailer';
// import { Pool } from 'pg';
// import pool from '../config/database';
// import { environment } from '../environments/environments';
// export class EmailService {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'siceghospital.slp.gto@gmail.com',
//         pass: 'mvfe kreq rdsg qcdd' // Tu contraseña de aplicación
//       }
//     });
//   }

// async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
//     try {
//       const resetLink = `${environment.urlFront}/cambiar-password?token=${resetToken}`;
//       const logoUrl = `${environment.BASE_URL}/uploads/logos/logo-principal-importado.svg`;
      
//       const mailOptions = {
//         from: `"${environment.hospitalName}" <siceghospital.slp.gto@gmail.com>`,
//         to: email,
//         subject: `Restablecimiento de Contraseña - ${environment.systemName}`,
//         html: `
//           <!DOCTYPE html>
//           <html>
//           <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Restablecer Contraseña</title>
//             <style>
//               body { 
//                 font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
//                 margin: 0; 
//                 padding: 0; 
//                 background-color: #f7fafc; 
//                 color: #4a5568; 
//               }
//               .container { 
//                 max-width: 600px; 
//                 margin: 20px auto; 
//                 background-color: white; 
//                 border-radius: 12px; 
//                 overflow: hidden; 
//                 box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
//               }
//               .header { 
//                 background-color: #2563eb; 
//                 padding: 25px 20px; 
//                 text-align: center; 
//               }
//               .logo-img {
//                 max-height: 80px;
//                 max-width: 100%;
//               }
//               .content { 
//                 padding: 30px; 
//                 line-height: 1.6; 
//               }
//               .btn-container { 
//                 text-align: center; 
//                 margin: 30px 0; 
//               }
//               .btn { 
//                 display: inline-block; 
//                 background: linear-gradient(135deg, #2563eb, #1e40af); 
//                 color: white; 
//                 padding: 14px 32px; 
//                 text-decoration: none; 
//                 border-radius: 8px; 
//                 font-weight: 600; 
//                 font-size: 16px; 
//                 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
//                 transition: all 0.3s ease; 
//               }
//               .btn:hover { 
//                 transform: translateY(-2px); 
//                 box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); 
//               }
//               .alert { 
//                 background-color: #fffbeb; 
//                 border-left: 4px solid #f59e0b; 
//                 padding: 16px; 
//                 border-radius: 4px; 
//                 margin: 25px 0; 
//               }
//               .alert-title { 
//                 color: #92400e; 
//                 font-weight: 600; 
//                 margin-bottom: 8px; 
//                 display: flex; 
//                 align-items: center; 
//               }
//               .alert-icon { 
//                 margin-right: 8px; 
//               }
//               .link-box { 
//                 word-break: break-all; 
//                 background-color: #edf2f7; 
//                 padding: 12px; 
//                 border-radius: 6px; 
//                 font-family: monospace; 
//                 font-size: 14px; 
//                 margin: 15px 0; 
//               }
//               .footer { 
//                 text-align: center; 
//                 padding: 20px; 
//                 background-color: #f8fafc; 
//                 font-size: 12px; 
//                 color: #718096; 
//                 border-top: 1px solid #e2e8f0;
//               }
//               .divider { 
//                 height: 1px; 
//                 background-color: #e2e8f0; 
//                 margin: 25px 0; 
//               }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <div class="header">
//                 <img src="${logoUrl}" alt="${environment.hospitalName}" class="logo-img">
//               </div>
              
//               <div class="content">
//                 <h2 style="color: #2d3748; margin-top: 0;">Restablecer su contraseña</h2>
                
//                 <p>Estimado usuario,</p>
                
//                 <p>Hemos recibido una solicitud para restablecer la contraseña asociada a su cuenta en el <strong>${environment.systemName}</strong> del <strong>${environment.hospitalName}</strong>.</p>
                
//                 <p>Por favor, haga clic en el siguiente botón para continuar con el proceso:</p>
                
//                 <div class="btn-container">
//                   <a href="${resetLink}" class="btn">Restablecer Contraseña</a>
//                 </div>
                
//                 <div class="alert">
//                   <div class="alert-title">
//                     <span class="alert-icon">X</span>
//                     <span>Información importante</span>
//                   </div>
//                   <ul style="margin: 0; padding-left: 20px;">
//                     <li>Este enlace tiene una validez de <strong>1 hora</strong></li>
//                     <li>Si no reconoce esta solicitud, por favor ignore este mensaje</li>
//                     <li>Por seguridad, no comparta este enlace con otras personas</li>
//                     <li>El enlace solo puede ser usado una vez</li>
//                   </ul>
//                 </div>
                
//                 <p>Si el botón no funciona, copie y pegue la siguiente URL en su navegador:</p>
//                 <div class="link-box">${resetLink}</div>
                
//                 <div class="divider"></div>
                
//                 <p>Si necesita ayuda adicional o tiene alguna duda, no dude en contactar al departamento de sistemas del hospital.</p>
                
//                 <p>Atentamente,</p>
//                 <p><strong>Equipo de Soporte Técnico</strong><br>
//                 ${environment.hospitalName}</p>
//               </div>
              
//               <div class="footer">
//                 <p>Este es un mensaje automático. Por favor no responda a este correo.</p>
//                 <p>© ${new Date().getFullYear()} ${environment.hospitalName} - ${environment.systemName} v${environment.version}</p>
//               </div>
//             </div>
//           </body>
//           </html>
//         `
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log('   Correo de recuperación enviado a:', email);
//       return true;
//     } catch (error) {
//       console.error('❌ Error enviando correo:', error);
//       return false;
//     }
//   }

//   async testConnection(): Promise<boolean> {
//     try {
//       await this.transporter.verify();
//       console.log('   Conexión de email establecida correctamente');
//       return true;
//     } catch (error) {
//       console.error('❌ Error en conexión de email:', error);
//       return false;
//     }
//   }
// }

// export default new EmailService();


// /home/agustin/CICEG-HG_NodeJS_Backend/src/services/email.service.ts
import nodemailer from 'nodemailer';
import { Pool } from 'pg';
import pool from '../config/database';
import { environment } from '../environments/environments';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'siceghospital.slp.gto@gmail.com',
        pass: 'mvfe kreq rdsg qcdd' // Tu contraseña de aplicación
      }
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const resetLink = `${environment.urlFront}/cambiar-password?token=${resetToken}`;
      const logoUrl = `${environment.BASE_URL}/uploads/logos/logo-principal-importado.svg`;
      
      const mailOptions = {
        from: `"${environment.hospitalName}" <siceghospital.slp.gto@gmail.com>`,
        to: email,
        subject: `Restablecimiento de Contraseña - ${environment.systemName}`,
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Restablecer Contraseña</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body { 
                font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
                margin: 0; 
                padding: 20px; 
                background-color: #f7fafc; 
                color: #2d3748;
                line-height: 1.6;
              }
              
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: #ffffff; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border: 1px solid #e2e8f0;
              }
              
              .header { 
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); 
                padding: 30px 20px; 
                text-align: center; 
                position: relative;
              }
              
              .header::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #3b82f6, #1d4ed8, #1e3a8a);
              }
              
              .logo-img {
                max-height: 80px;
                max-width: 100%;
                filter: brightness(0) invert(1);
              }
              
              .hospital-name {
                color: #ffffff;
                font-size: 18px;
                font-weight: 600;
                margin-top: 10px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.1);
              }
              
              .content { 
                padding: 40px 30px; 
                background-color: #ffffff;
              }
              
              .content h2 {
                color: #1a202c;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 20px;
                text-align: center;
              }
              
              .content p {
                color: #4a5568;
                font-size: 16px;
                margin-bottom: 16px;
              }
              
              .btn-container { 
                text-align: center; 
                margin: 35px 0; 
              }
              
              .btn { 
                display: inline-block; 
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); 
                color: #ffffff !important; 
                padding: 16px 40px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: 600; 
                font-size: 16px; 
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                letter-spacing: 0.5px;
              }
              
              .btn:hover { 
                transform: translateY(-2px); 
                box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
                background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
              }
              
              .alert { 
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border: 1px solid #f59e0b; 
                border-left: 5px solid #f59e0b;
                padding: 20px; 
                border-radius: 8px; 
                margin: 30px 0; 
              }
              
              .alert-title { 
                color: #92400e; 
                font-weight: 700; 
                font-size: 16px;
                margin-bottom: 12px; 
                display: flex; 
                align-items: center; 
              }
              
              .alert-icon { 
                background-color: #f59e0b;
                color: #ffffff;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                margin-right: 10px; 
              }
              
              .alert ul {
                margin: 0;
                padding-left: 20px;
                color: #92400e;
              }
              
              .alert li {
                margin-bottom: 8px;
                font-size: 14px;
              }
              
              .link-box { 
                word-break: break-all; 
                background-color: #f7fafc; 
                padding: 16px; 
                border-radius: 8px; 
                font-family: 'Courier New', monospace; 
                font-size: 13px; 
                margin: 20px 0; 
                border: 1px solid #e2e8f0;
                color: #2d3748;
              }
              
              .footer { 
                text-align: center; 
                padding: 25px 20px; 
                background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
                font-size: 13px; 
                color: #718096; 
                border-top: 1px solid #e2e8f0;
              }
              
              .footer p {
                margin: 5px 0;
              }
              
              .divider { 
                height: 2px; 
                background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 50%, #e2e8f0 100%);
                margin: 30px 0; 
                border: none;
                border-radius: 1px;
              }
              
              .signature {
                background-color: #f7fafc;
                padding: 20px;
                border-radius: 8px;
                margin-top: 25px;
                border-left: 4px solid #2563eb;
              }
              
              .signature p {
                margin: 5px 0;
                color: #4a5568;
              }
              
              .signature strong {
                color: #2d3748;
              }
              
              /* Estilos responsive */
              @media (max-width: 600px) {
                .container {
                  margin: 10px;
                  border-radius: 8px;
                }
                
                .content {
                  padding: 25px 20px;
                }
                
                .btn {
                  padding: 14px 30px;
                  font-size: 15px;
                }
                
                .content h2 {
                  font-size: 24px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="${logoUrl}" alt="${environment.hospitalName}" class="logo-img">
                <div class="hospital-name">${environment.hospitalName}</div>
              </div>
              
              <div class="content">
                <h2> Restablecer Contraseña</h2>
                
                <p><strong>Estimado usuario,</strong></p>
                
                <p>Hemos recibido una solicitud para restablecer la contraseña asociada a su cuenta en el <strong>${environment.systemName}</strong> del <strong>${environment.hospitalName}</strong>.</p>
                
                <p>Para continuar con el proceso de restablecimiento, haga clic en el siguiente botón:</p>
                
                <div class="btn-container">
                  <a href="${resetLink}" class="btn" style="color: #ffffff !important;">
                     Restablecer Contraseña
                  </a>
                </div>
                
                <div class="alert">
                  <div class="alert-title">
                    <span class="alert-icon"></span>
                    <span>Información Importante</span>
                  </div>
                  <ul>
                    <li>Este enlace tiene una validez de <strong>1 hora únicamente</strong></li>
                    <li>Si no solicitó este cambio, por favor ignore este mensaje</li>
                    <li>Por seguridad, no comparta este enlace con otras personas</li>
                    <li>El enlace solo puede ser utilizado una sola vez</li>
                  </ul>
                </div>
                
                <p><strong>¿El botón no funciona?</strong> Copie y pegue la siguiente URL en su navegador:</p>
                <div class="link-box">${resetLink}</div>
                
                <div class="divider"></div>
                
                <div class="signature">
                  <p>Si necesita ayuda adicional o tiene alguna duda, no dude en contactar al departamento de sistemas del hospital.</p>
                  
                  <p><strong>Atentamente,</strong><br>
                  <strong>Equipo de Soporte Técnico</strong><br>
                  ${environment.hospitalName}</p>
                </div>
              </div>
              
              <div class="footer">
                <p><strong>Este es un mensaje automático. Por favor no responda a este correo.</strong></p>
                <p>© ${new Date().getFullYear()} ${environment.hospitalName} - ${environment.systemName} v${environment.version}</p>
                <p>Sistema de Gestión Hospitalaria</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('   Correo de recuperación enviado a:', email);
      return true;
    } catch (error) {
      console.error('❌ Error enviando correo:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('   Conexión de email establecida correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en conexión de email:', error);
      return false;
    }
  }
}

export default new EmailService();