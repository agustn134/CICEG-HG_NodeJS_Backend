import dotenv from 'dotenv';
import app from './app';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});