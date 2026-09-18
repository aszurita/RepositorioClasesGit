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

// Columnas que devolvemos. La fecha se convierte a texto 'AAAA-MM-DD HH:MM:SS'
const COLUMNAS = `id, nombre, apellido, tipo, numero_cuenta, numero_cuenta_destino, cantidad, descripcion,
                  CONVERT(varchar(19), fecha, 120) AS fecha`;

app.get("/", (req, res) => {
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});



async function obtenerMovimiento(id) {
  const [fila] = await consultar(`SELECT ${COLUMNAS} FROM cap_movimientos WHERE id = @id`, { id: Number(id) || 0 });
  return fila;
}


// Inserta un movimiento y devuelve la fila creada
async function insertarMovimiento(m) {
  const [{ id }] = await consultar(
    `INSERT INTO cap_movimientos (nombre, apellido, tipo, numero_cuenta, numero_cuenta_destino, cantidad, descripcion)
     OUTPUT INSERTED.id
     VALUES (@nombre, @apellido, @tipo, @numero_cuenta, @numero_cuenta_destino, @cantidad, @descripcion)`,
    {
      nombre: m.nombre,
      apellido: m.apellido,
      tipo: m.tipo,
      numero_cuenta: m.numero_cuenta,
      numero_cuenta_destino: m.numero_cuenta_destino ?? null,
      cantidad: Number(m.cantidad),
      descripcion: m.descripcion ?? null,
    }
  );
  return obtenerMovimiento(id);
}
// =====================================================================
// CRUD de movimientos
// =====================================================================

/*
app.get("/api/movimientos", async (req, res) => {
  res.json(await consultar(`SELECT ${COLUMNAS} FROM cap_movimientos`));
});
*/

app.get("/api/movimientos/id/:id", async (req, res) => {
  const movimiento = await obtenerMovimiento(req.params.id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

// Filtro
app.get("/api/movimientos", async (req, res) => {
  const { tipo, cuenta, nombre, desde, hasta } = req.query;
  let sql = `SELECT ${COLUMNAS} FROM cap_movimientos WHERE 1 = 1`;
  const params = {};

  if (tipo) {
    sql += " AND tipo = @tipo";
    params.tipo = tipo;
  }
    
  if (cuenta) {
    sql += " AND numero_cuenta = @cuenta";
    params.cuenta = cuenta;
  }

  if (nombre) {
    sql += " AND (nombre LIKE @nombre OR apellido LIKE @nombre)";
    params.nombre = `%${nombre}%`;
  }

  if (desde) {
    sql += " AND fecha >= @desde";
    params.desde = `${desde} 00:00:00`;
  }

  if (hasta) {
    sql += " AND fecha <= @hasta";
    params.hasta = `${hasta} 23:59:59`;
  }
  sql += " ORDER BY fecha DESC, id DESC";

  res.json(await consultar(sql, params));
});


app.get("/api/movimientos/ultimos", async (req, res) => {
  const limite = Number(req.query.limite) || 5;
  const { cuenta } = req.query;
  if (cuenta) {
    return res.json(
      await consultar(
        `SELECT TOP (@limite) ${COLUMNAS} FROM cap_movimientos
        WHERE numero_cuenta = @cuenta OR numero_cuenta_destino = @cuenta
        ORDER BY fecha DESC, id DESC`,
        { limite, cuenta }
      )
    );
  }
  res.json(await consultar(`SELECT TOP (@limite) ${COLUMNAS} FROM cap_movimientos ORDER BY fecha DESC, id DESC`, { limite }));
});

app.post("/api/movimientos", async (req, res) => {
  const { nombre, apellido, tipo, numero_cuenta, cantidad } = req.body;
  if (!nombre || !apellido || !tipo || !numero_cuenta || !cantidad) {
    return res.status(400).json({ error: "Faltan datos: nombre, apellido, tipo, numero_cuenta y cantidad son obligatorios" });
  }
  res.status(201).json(await insertarMovimiento(req.body));
});




// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
app.use((error, req, res, next) => {
  console.error("✘", error.message);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`API:  http://localhost:${PORT}/`);
});
