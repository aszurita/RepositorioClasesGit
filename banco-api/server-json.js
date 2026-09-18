// =====================================================================
// PASO 1: API con datos en memoria (un arreglo JSON)
// Ejecutar:  npm run json      ->  http://localhost:3000/docs
// OJO: si reinicias el servidor, los cambios se pierden.
//      Por eso en el PASO 2 (server.js) usamos una base de datos.
// =====================================================================
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.use(cors()); // permite que React (otro puerto) llame a esta API
app.use(express.json()); // permite leer el body en formato JSON

// ---------------------------------------------------------------------
// "Base de datos" en memoria
// ---------------------------------------------------------------------
let movimientos = [
  { id: 1, nombre: "Ana", apellido: "Torres", tipo: "DEPOSITO", numero_cuenta: "1001", numero_cuenta_destino: null, cantidad: 500, descripcion: "Depósito inicial", fecha: "2026-09-01 09:00:00" },
  { id: 2, nombre: "x|", apellido: "Mendoza", tipo: "DEPOSITO", numero_cuenta: "1002", numero_cuenta_destino: null, cantidad: 300, descripcion: "Depósito inicial", fecha: "2026-09-01 10:30:00" },
  { id: 3, nombre: "Ana", apellido: "Torres", tipo: "TRANSFERENCIA", numero_cuenta: "1001", numero_cuenta_destino: "1002", cantidad: 120, descripcion: "Pago de almuerzo", fecha: "2026-09-02 13:15:00" },
  { id: 4, nombre: "Luis", apellido: "Mendoza", tipo: "RETIRO", numero_cuenta: "1002", numero_cuenta_destino: null, cantidad: 50, descripcion: "Cajero automático", fecha: "2026-09-03 18:40:00" },
];
let siguienteId = 5;

// =====================================================================
// SWAGGER - CONFIGURACIÓN
// =====================================================================

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Banco API (versión JSON)", version: "1.0.0", description: "Paso 1: datos en memoria" },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [__filename],
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

// ultimos
app.get("/", (req, res) => {
  res.json({ mensaje: "Hola mundo desde Express Richard" });
});

// =====================================================================
// 1. LISTAR TODOS LOS MOVIMIENTOS
// =====================================================================

/**
 * @swagger
 * /api/movimientos:
 *   get:
 *     summary: Listar todos los movimientos
 *     tags: [Movimientos]
 *     responses:
 *       200: { description: Lista de movimientos }
 */

app.get("/api/movimientos", (req, res) => {
  res.json(movimientos);
});

// =====================================================================
// 2. FILTRAR MOVIMIENTO POR ID
// =====================================================================

/**
 * @swagger
 * /api/movimientos/id/{id}:
 *   get:
 *     summary: Buscar movimiento por ID
 *     tags: [Movimientos]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del movimiento que desea consultar
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *
 *       200:
 *         description: Movimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimiento'
 *
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// filtrar movimientos por id
app.get("/api/movimientos/id/:id", (req, res) => {
  const id = Number(req.params.id);
  const movimiento = movimientos.find((m) => m.id === id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

// =====================================================================
// 3. FILTRAR MOVIMIENTOS POR NOMBRE
// =====================================================================

/**
 * @swagger
 * /api/movimientos/nombre/{nombre}:
 *   get:
 *     summary: Buscar movimiento por nombre
 *     tags: [Movimientos]
 *
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         description: Nombre de la persona
 *         schema:
 *           type: string
 *         example: "Ana"
 *
 *     responses:
 *
 *       200:
 *         description: Movimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimiento'
 *
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// filtrar movimientos por nombre
app.get("/api/movimientos/nombre/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const movimiento = movimientos.find((m) => m.nombre === nombre);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

// =====================================================================
// 4. CREAR MOVIMIENTO
// =====================================================================

/**
 * @swagger
 * /api/movimientos:
 *   post:
 *     summary: Crear un nuevo movimiento
 *     tags: [Movimientos]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoMovimiento'
 *
 *           example:
 *             nombre: "Pedro"
 *             apellido: "Gomez"
 *             tipo: "DEPOSITO"
 *             numero_cuenta: "1005"
 *             numero_cuenta_destino: null
 *             cantidad: 350
 *             descripcion: "Depósito de ahorro"
 *
 *     responses:
 *
 *       201:
 *         description: Movimiento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimiento'
 */

//### Crear un movimiento
app.post("/api/movimientos", (req, res) => {
  const nuevo = {
    id: siguienteId++,
    ...req.body,
    fecha: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  movimientos.push(nuevo);
  res.status(201).json(nuevo);
});

// =====================================================================
// 5. MODIFICAR MOVIMIENTO POR ID
// =====================================================================

/**
 * @swagger
 * /api/movimientos/id/{id}:
 *   put:
 *     summary: Modificar un movimiento
 *     tags: [Movimientos]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del movimiento que se desea modificar
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoMovimiento'
 *
 *           example:
 *             nombre: "Ana"
 *             apellido: "Torres"
 *             tipo: "DEPOSITO"
 *             numero_cuenta: "1001"
 *             numero_cuenta_destino: null
 *             cantidad: 800
 *             descripcion: "Depósito modificado"
 *
 *     responses:
 *
 *       200:
 *         description: Movimiento modificado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimiento'
 *
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

//### modificar un movimiento
app.put("/api/movimientos/id/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = movimientos.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Movimiento no encontrado" });
  movimientos[index] = { ...movimientos[index], ...req.body, id };
  res.json(movimientos[index]);
});

// =====================================================================
// 6. ELIMINAR MOVIMIENTO
// =====================================================================

/**
 * @swagger
 * /api/movimientos/{id}:
 *   delete:
 *     summary: Eliminar un movimiento
 *     tags: [Movimientos]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del movimiento que se desea eliminar
 *         schema:
 *           type: integer
 *         example: 4
 *
 *     responses:
 *
 *       200:
 *         description: Movimiento eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Movimiento eliminado"
 *
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

//### eliminar un movimiento
app.delete("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const existe = movimientos.some((m) => m.id === id);
  if (!existe) return res.status(404).json({ error: "Movimiento no encontrado" });
  movimientos = movimientos.filter((m) => m.id !== id);
  res.json({ mensaje: "Movimiento eliminado" });
});

// =====================================================================
// SWAGGER
// =====================================================================

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =====================================================================
// INICIAR SERVIDOR
// =====================================================================

// ULTIMO
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log(`Docs: http://localhost:${PORT}/docs`);
});