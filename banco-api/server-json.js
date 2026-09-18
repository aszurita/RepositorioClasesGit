// =====================================================================
// PASO 1: API con datos en memoria (un arreglo JSON)
// Ejecutar:  npm run json      ->  http://localhost:3000/docs
// OJO: si reinicias el servidor, los cambios se pierden.
//      Por eso en el PASO 2 (server.js) usamos una base de datos.
// =====================================================================
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 3000;

const app = express();


app.use(express.json());
app.use(cors());
 // permite leer el body en formato JSON

// ---------------------------------------------------------------------
// "Base de datos" en memoria
// ---------------------------------------------------------------------
let movimientos = [
  { id: 1, nombre: "Ana", apellido: "Torres", tipo: "DEPOSITO", numero_cuenta: "1001", numero_cuenta_destino: null, cantidad: 500, descripcion: "Depósito inicial", fecha: "2026-09-01 09:00:00" },
  { id: 2, nombre: "Luis", apellido: "Mendoza", tipo: "DEPOSITO", numero_cuenta: "1002", numero_cuenta_destino: null, cantidad: 300, descripcion: "Depósito inicial", fecha: "2026-09-01 10:30:00" },
  { id: 3, nombre: "Ana", apellido: "Torres", tipo: "TRANSFERENCIA", numero_cuenta: "1001", numero_cuenta_destino: "1002", cantidad: 120, descripcion: "Pago de almuerzo", fecha: "2026-09-02 13:15:00" },
  { id: 4, nombre: "Luis", apellido: "Mendoza", tipo: "RETIRO", numero_cuenta: "1002", numero_cuenta_destino: null, cantidad: 50, descripcion: "Cajero automático", fecha: "2026-09-03 18:40:00" },
];
let siguienteId = 5;


const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Banco API (versión JSON)", version: "1.0.0", description: "Paso 1: datos en memoria" },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [__filename],
});

app.get("/", (req, res) => {
  res.json({ mensaje: "Hola mundo desde Express " });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Movimiento:
 *       type: object
 *       properties:
 *         nombre: { type: string, example: "Ana" }
 *         apellido: { type: string, example: "Torres" }
 *         tipo: { type: string, enum: [DEPOSITO, RETIRO, TRANSFERENCIA], example: "DEPOSITO" }
 *         numero_cuenta: { type: string, example: "1001" }
 *         numero_cuenta_destino: { type: string, nullable: true, example: null }
 *         cantidad: { type: number, example: 100 }
 *         descripcion: { type: string, example: "Ahorro" }
 */



/**
 * @swagger
 * /api/movimientos:
 *   get:
 *     summary: Listar todos los movimientos
 *     tags: [Movimientos]
 *     responses:
 *       200: { description: Lista de movimientos }
 *       404: { description: No hay lista de movimientos }
 */
app.get("/api/movimientos", (req, res) => {
  res.json(movimientos);
});

/**
 * @swagger
 * /api/movimientos/id/{id}:
 *   get:
 *     summary: Obtener un movimiento por su id
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200: { description: Movimiento encontrado }
 *       404: { description: Movimiento no encontrado }
 */
app.get("/api/movimientos/id/:id", (req, res) => {
  const id = Number(req.params.id);
  const movimiento = movimientos.find((m) => m.id === id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

/**
 * @swagger
 * /api/movimientos/nombre/{nombre}:
 *   get:
 *     summary: Obtener el primer movimiento de una persona por su nombre
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema: { type: string, example: "Ana" }
 *     responses:
 *       200: { description: Movimiento encontrado }
 *       404: { description: Movimiento no encontrado }
 */
app.get("/api/movimientos/nombre/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const movimiento = movimientos.find((m) => m.nombre == nombre);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

/**
 * @swagger
 * /api/movimientos:
 *   post:
 *     summary: Crear un movimiento
 *     tags: [Movimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Movimiento' }
 *     responses:
 *       201: { description: Movimiento creado }
 */
app.post("/api/movimientos", (req, res) => {
  const nuevo = {
    id: siguienteId++,
    ...req.body,
    fecha: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  movimientos.push(nuevo);
  res.status(201).json(nuevo);
});

/**
 * @swagger
 * /api/movimientos/id/{id}:
 *   put:
 *     summary: Actualizar un movimiento (solo los campos enviados)
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Movimiento' }
 *     responses:
 *       200: { description: Movimiento actualizado }
 *       404: { description: Movimiento no encontrado }
 */
app.put("/api/movimientos/id/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = movimientos.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Movimiento no encontrado" });
  movimientos[index] = { ...movimientos[index], ...req.body, id };
  res.json(movimientos[index]);
});

/**
 * @swagger
 * /api/movimientos/{id}:
 *   delete:
 *     summary: Eliminar un movimiento
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200: { description: Movimiento eliminado }
 *       404: { description: Movimiento no encontrado }
 */
app.delete("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const existe = movimientos.some((m) => m.id === id);
  if (!existe) return res.status(404).json({ error: "Movimiento no encontrado" });
  movimientos = movimientos.filter((m) => m.id !== id);
  res.json({ mensaje: "Movimiento eliminado" });
});


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ULTIMO
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});