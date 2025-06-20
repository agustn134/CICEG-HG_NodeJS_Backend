"use strict";
// import express from 'express';
// import dotenv from 'dotenv';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const app = express();
// app.use(express.json());
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
// Añade .env al .gitignore
// Para no subir tus claves al repositorio:
// # .gitignore
// .env
// import dotenv from 'dotenv';
// import app from './app';
// import cors from 'cors'; // 👈 Importa cors
// // Cargar variables de entorno
// dotenv.config();
// const PORT = process.env.PORT || 3000;
// // Iniciar servidor
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
// import express from 'express';
// import cors from 'cors'; 
// import dotenv from 'dotenv';
// dotenv.config();
// const app = express();
// // Configura CORS
// app.use(cors({
//   origin: 'http://localhost:4200', // Permitir solo este origen
//   credentials: true // Opcional, si usas cookies o sesiones
// }));
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();
// const app = express();
// app.use(express.json());
// // Configura CORS
// app.use(cors({
//   origin: 'http://localhost:4200',
//   credentials: true
// }));
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// // Importa tus rutas
// import pacienteRoutes from './routes/personas/paciente.routes';
// import personaRoutes from './routes/personas/persona.routes';
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:4200',
//   credentials: true
// }));
// // Monta todas tus rutas aquí:
// app.use('/api/personas/pacientes', pacienteRoutes); // 👈 Esta es clave
// app.use('/api/personas', personaRoutes);
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
// import dotenv from 'dotenv';
// import cors from 'cors';
// import app from './app';
// // Cargar variables de entorno ANTES de importar la app
// dotenv.config();
// // Configurar CORS para Angular
// app.use(cors({
//   origin: 'http://localhost:4200', // Puerto por defecto de Angular
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// const PORT = process.env.PORT || 3000;
// // Iniciar servidor
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
// Cargar variables de entorno
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// Iniciar servidor
app_1.default.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
