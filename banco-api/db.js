// =====================================================================
// Conexión a SQL Server
// Los datos de conexión se leen del archivo .env (ver .env.example)
// =====================================================================
const sql = require("mssql");
 
const config = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // "Cifrar: Obligatorio"
    trustServerCertificate: true, // "Certificado de servidor de confianza"
  },
};
 
// Nos conectamos una sola vez y reutilizamos la conexión (pool).
// Si falla (ej. sin VPN), se vuelve a intentar en la siguiente consulta.
let conexion = null;
 
function conectar() {
  if (!conexion) {
    conexion = sql
      .connect(config)
      .then((pool) => {
        console.log(`✔ Conectado a SQL Server ${config.server}:${config.port} / ${config.database}`);
        return pool;
      })
      .catch((error) => {
        conexion = null;
        throw new Error(`No se pudo conectar a SQL Server: ${error.message}`);
      });
  }
  return conexion;
}
 
 
// Ejecuta una consulta con parámetros y devuelve las filas.
// Ejemplo: consultar("SELECT * FROM cap_movimientos WHERE id = @id", { id: 5 })
async function consultar(texto, parametros = {}) {
  const pool = await conectar();
  const request = pool.request();
  for (const [nombre, valor] of Object.entries(parametros)) {
    request.input(nombre, valor); // @nombre en el SQL => valor (evita inyección SQL)
  }
  const resultado = await request.query(texto);
  return resultado.recordset;
}
 
module.exports = { sql, conectar, consultar };
 