// import { Pool } from "pg";

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "bd_sicec_prueba7",
//   password: "password",
//   port: 5432,
// });

// export default pool; // exporta el pool



// Añade .env al .gitignore
// Para no subir tus claves al repositorio:

// # .gitignore
// .env

// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: Number(process.env.DB_PORT),
// });

// export default pool;

// import { Pool } from "pg";
// import dotenv from "dotenv";
// dotenv.config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT || "5432"),
// });

// export default pool;







import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432')
});

export default pool;