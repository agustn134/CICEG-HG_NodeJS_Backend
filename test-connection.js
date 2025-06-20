// Crear este archivo en la raíz del proyecto: test-connection.js
const { Pool } = require('pg');
require('dotenv').config();

console.log('Variables de entorno:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[CONFIGURADA]' : '[NO CONFIGURADA]');
console.log('DB_PORT:', process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432')
});

async function testConnection() {
  try {
    console.log('\nIntentando conectar a PostgreSQL...');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Consulta exitosa:', result.rows[0]);
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Código de error:', error.code);
  }
}

testConnection();