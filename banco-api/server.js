// =====================================================================
// PASO 2: API conectada a SQL Server
// 1) Copiar .env.example a .env y poner la contraseña
// 2) npm run db:init   (crea la tabla cap_movimientos con datos de ejemplo)
// 3) npm run dev       ->  http://localhost:3000/docs
// =====================================================================
const express = require("express");
const cors = require("cors");
const { consultar } = require("./db");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
app.use((error, req, res, next) => {
  console.error("✘", error.message);
  res.status(500).json({ error: error.message });
});

app.get("/", (req, res) => {
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});

// =====================================================================
// CRUD de movimientos
// =====================================================================
/*
app.get("/api/movimientos", async (req, res) => {
  res.json(await consultar(`SELECT ${COLUMNAS} FROM cap_movimientos`));
});
*/

//FILTROS
// Columnas que devolvemos. La fecha se convierte a texto 'AAAA-MM-DD HH:MM:SS'
const COLUMNAS = `id, nombre, apellido, tipo, numero_cuenta, numero_cuenta_destino, cantidad, descripcion,
                  CONVERT(varchar(19), fecha, 120) AS fecha`;

app.get("/api/movimientos", async (req, res) => {
  const { tipo, cuenta, nombre, desde, hasta } = req.query;
  let sql = `SELECT ${COLUMNAS} FROM cap_movimientos WHERE 1 = 1`;
  const params = {};

  if (tipo) {
    sql += " AND tipo = @tipo";
    params.tipo = tipo;
  }
  sql += " ORDER BY fecha DESC, id DESC";

  res.json(await consultar(sql, params));
});


o+
























//ULTIMO
app.listen(PORT, () => {
  console.log(`API:  http://localhost:${PORT}`);
});




