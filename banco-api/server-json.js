// =====================================================================
// PASO 1: API con datos en memoria (un arreglo JSON)
// Ejecutar:  npm run json      ->  http://localhost:3000/docs
// OJO: si reinicias el servidor, los cambios se pierden.
//      Por eso en el PASO 2 (server.js) usamos una base de datos.
// =====================================================================
const express = require("express");
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json()); // permite leer el body en formato JSON
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Imagen fija que se devuelve cuando no se puede generar una imagen con IA
const IMAGEN_DEFECTO = fs.readFileSync(path.join(__dirname, "assets", "imagen-default.svg"));

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


/**
 * @swagger
 * /:
 *   get:
 *     summary: Endpoint de saludo / healthcheck
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Mensaje de saludo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string, example: "Hola maestro shaolin" }
 */
app.get("/", (req, res) => {
  res.json({ mensaje: "Hola maestro shaolin" });
});

/**
 * @swagger
 * /api/movimientos:
 *   get:
 *     summary: Listar todos los movimientos
 *     tags: [Movimientos]
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movimiento'
 */
app.get("/api/movimientos", (req, res) => {
  res.json(movimientos);
});

/**
 * @swagger
 * /api/movimientos/id/{id}:
 *   get:
 *     summary: Obtener un movimiento por id
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Id del movimiento
 *     responses:
 *       200:
 *         description: Movimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimiento'
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/movimientos/id/:id", (req, res) => {
  const id = Number(req.params.id);
  const movimiento = movimientos.find((m) => m.id === id);
  if (!movimiento) return res.status(404).json({ error: "IDMovimiento no encontrado" });
  res.json(movimiento);
});

/**
 * @swagger
 * /api/movimientos/nombre/{nombre}:
 *   get:
 *     summary: Obtener el primer movimiento que coincida con un nombre
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema: { type: string }
 *         description: Nombre de la persona
 *     responses:
 *       200:
 *         description: Movimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimiento'
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/movimientos/nombre/:nombre", (req, res) => {
  const nombre = (req.params.nombre);
  const movimiento = movimientos.find((m) => m.nombre === nombre);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

/**
 * @swagger
 * /api/movimientos/nombre/{nombre}/foto:
 *   get:
 *     summary: Obtener una foto aleatoria de la persona (buscada por nombre)
 *     description: Busca un movimiento por nombre y, si existe, devuelve una foto aleatoria obtenida de Picsum Photos (https://picsum.photos), un repositorio público de fotos.
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema: { type: string }
 *         description: Nombre de la persona
 *     responses:
 *       200:
 *         description: Foto aleatoria
 *         content:
 *           image/jpeg:
 *             schema: { type: string, format: binary }
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       502:
 *         description: No se pudo obtener la foto del repositorio externo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/movimientos/nombre/:nombre/foto", async (req, res) => {
  const nombre = req.params.nombre;
  const movimiento = movimientos.find((m) => m.nombre === nombre);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });

  try {
    // ?random= evita que Picsum (o caches intermedios) devuelvan siempre la misma imagen
    const respuesta = await fetch(`https://picsum.photos/400/400?random=${Date.now()}`);
    if (!respuesta.ok) throw new Error("Respuesta no exitosa de Picsum");

    const buffer = Buffer.from(await respuesta.arrayBuffer());
    res.set("Content-Type", respuesta.headers.get("content-type") || "image/jpeg");
    res.send(buffer);
  } catch (error) {
    res.status(502).json({ error: "No se pudo obtener una foto aleatoria" });
  }
});

/**
 * @swagger
 * /api/movimientos:
 *   post:
 *     summary: Crear un nuevo movimiento
 *     tags: [Movimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovimientoInput'
 *     responses:
 *       201:
 *         description: Movimiento creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimiento'
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
 *     summary: Actualizar un movimiento existente por id
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Id del movimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovimientoInput'
 *     responses:
 *       200:
 *         description: Movimiento actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimiento'
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * /api/imagenes:
 *   post:
 *     summary: Generar una imagen a partir de una descripción (con imagen fija de respaldo)
 *     description: Recibe la descripción de una persona u objeto y genera una imagen con un servicio público de IA (Pollinations). Si el servicio no responde o falla, se devuelve una imagen fija por defecto en su lugar.
 *     tags: [Imagenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [descripcion]
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Un gato astronauta flotando en el espacio, estilo acuarela"
 *     responses:
 *       200:
 *         description: Imagen generada (o imagen fija de respaldo si falló la generación)
 *         content:
 *           image/*:
 *             schema: { type: string, format: binary }
 *       400:
 *         description: Falta la descripción en el body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/imagenes", async (req, res) => {
  const { descripcion } = req.body || {};

  if (!descripcion || typeof descripcion !== "string" || !descripcion.trim()) {
    return res.status(400).json({ error: "El campo 'descripcion' es requerido" });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // no esperar para siempre

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(descripcion.trim())}?width=512&height=512&nologo=true`;
    const respuesta = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = respuesta.headers.get("content-type") || "";
    if (!respuesta.ok || !contentType.startsWith("image/")) {
      throw new Error("El servicio de generación de imágenes no devolvió una imagen válida");
    }

    const buffer = Buffer.from(await respuesta.arrayBuffer());
    res.set("Content-Type", contentType);
    res.send(buffer);
  } catch (error) {
    // Si falla la generación (sin internet, servicio caído, timeout, etc.) mostramos la imagen fija
    res.set("Content-Type", "image/svg+xml");
    res.send(IMAGEN_DEFECTO);
  }
});

//ULTIMO
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
