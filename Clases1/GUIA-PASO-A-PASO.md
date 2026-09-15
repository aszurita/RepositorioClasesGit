# Día 1 — Guía práctica paso a paso: nuestra API bancaria

> **Cómo usar esta guía:** haz UN paso a la vez. Copia el código, guarda (`Ctrl + S`) y comprueba el ✅ antes de seguir.
> Si te pierdes, usa el 🏁 **Punto de control** más cercano: ahí está el archivo completo.

**Antes de empezar, 3 reglas para copiar código:**

1. **📍 Ubicación** te muestra *dónde* va el código: verás 1 o 2 líneas que **ya tienes** en tu archivo y, entre ellas, las marcas `👇 NUEVO` y `👆 FIN NUEVO`. **Esas marcas NO se copian**: solo indican el lugar.
2. **Copia este código** trae **solo lo nuevo**. Eso es lo que pegas en el lugar indicado.
3. Deja **una línea en blanco** entre un bloque de código y el siguiente, para que se lea mejor.

> Esta guía es para **construir**. La teoría (qué es una API, HTTP, SQL, etc.) está en `ESTUDIANTE.md`.

---

## Mapa del día

| Etapa | Pasos | Qué lograremos |
|---|---|---|
| 1. Preparar el proyecto | 1 – 4 | Carpeta `banco-api` con Express instalado |
| 2. Primer servidor con Express | 5 – 8 | `http://localhost:3000` responde y se reinicia solo al guardar |
| 3. Datos en memoria: leer | 9 – 12 | `GET /api/movimientos` y `GET /api/movimientos/:id` (con 404) |
| 4. Crear, modificar y borrar | 13 – 17 | `POST`, `PUT` y `DELETE` probados con REST Client |
| 5. CORS y Swagger | 18 – 23 | Página de documentación en `http://localhost:3000/docs` |
| 6. El problema de la memoria | 24 | Ver que los datos se pierden al reiniciar |
| 7. Preparar la base de datos | 25 – 28 | Scripts SQL leídos, `mssql` instalado y `.env` creado |
| 8. La conexión: `db.js` | 29 – 32 | Nuestra API puede hablar con SQL Server |
| 9. Nuevo `server.js` | 33 – 35 | Esqueleto de la API final corriendo con `npm run dev` |
| 10. Leer desde SQL Server | 36 – 43 | Listar con filtros, últimos movimientos y buscar por id |
| 11. Escribir en SQL Server | 44 – 46 | Crear, modificar y eliminar movimientos en la tabla compartida |
| 12. Saldo y titular | 47 – 48 | Funciones de ayuda para calcular saldos |
| 13. Operaciones bancarias | 49 – 51 | Depósitos, retiros y transferencias |
| 14. Cuentas y resumen | 52 – 53 | Datos para el dashboard |
| 15. Swagger en `server.js` | 54 – 59 | Documentación completa de la API final |
| 16. Cierre | 60 | Probar todo y repasar los endpoints |

---

## Etapa 1 — Preparar el proyecto

### Paso 1 — Verifica que tienes Node.js

**Qué vamos a hacer:** comprobar que Node.js y npm están instalados.

**Dónde:** terminal (PowerShell). Búscalo en el menú Inicio como "PowerShell".

**Copia este código:**

```powershell
node -v
npm -v
```

**✅ Comprueba:** ves dos versiones, por ejemplo `v24.11.0` y `11.6.2`. La de Node debe empezar con **v24** (o v22.13 o superior).

> Si sale `node : El término 'node' no se reconoce...` → Node no está instalado; avisa al instructor.
> Si sale `...la ejecución de scripts está deshabilitada en este sistema` → ejecuta `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` y responde `S`.

**💡 ¿Qué pasó?** Node.js es el programa que ejecuta JavaScript fuera del navegador. npm es su "tienda" para descargar librerías.

---

### Paso 2 — Crea la carpeta del proyecto y ábrela en VS Code

**Qué vamos a hacer:** crear la carpeta `banco-api` y abrirla en VS Code.

**Dónde:** terminal (PowerShell).

**Copia este código:**

```powershell
cd $HOME\Documents
mkdir banco-api
cd banco-api
code .
```

Se abre VS Code. Desde ahora trabajaremos con la terminal **de VS Code**: menú **Terminal → Nuevo terminal**.

**✅ Comprueba:** en la terminal de VS Code, la línea termina en `...\Documents\banco-api>`. En el panel izquierdo (Explorador) aparece `BANCO-API` vacío.

**💡 ¿Qué pasó?** Creaste una carpeta vacía donde vivirá toda la API. `code .` significa "abre VS Code en esta carpeta".

---

### Paso 3 — Crea el `package.json`

**Qué vamos a hacer:** crear la "ficha" del proyecto.

**Dónde:** terminal de VS Code (dentro de `banco-api`).

**Copia este código:**

```powershell
npm init -y
```

**✅ Comprueba:** la terminal muestra `Wrote to ...\banco-api\package.json` y en el Explorador aparece el archivo **`package.json`** con `"name": "banco-api"`.

**💡 ¿Qué pasó?** `package.json` guarda el nombre del proyecto, las librerías que usa y los comandos (scripts) para ejecutarlo.

---

### Paso 4 — Instala las librerías

**Qué vamos a hacer:** descargar Express y las librerías de Swagger y CORS.

**Dónde:** terminal de VS Code.

**Copia este código:**

```powershell
npm install express cors swagger-jsdoc swagger-ui-express
```

**✅ Comprueba:** termina con `added ... packages` (puede tardar 1 minuto). Aparecen la carpeta **`node_modules`** y el archivo **`package-lock.json`**. En `package.json` hay una sección `"dependencies"` con las 4 librerías.

**💡 ¿Qué pasó?** npm descargó el código de esas librerías en `node_modules`. Nunca edites esa carpeta.

---

🏁 **Punto de control 1** — así debe verse tu `package.json` (los números de versión pueden variar un poco).

<details><summary>Ver archivo completo: <code>package.json</code></summary>

```json
{
  "name": "banco-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "swagger-jsdoc": "^6.3.0",
    "swagger-ui-express": "^5.0.1"
  }
}
```

</details>

---

## Etapa 2 — Primer servidor con Express

### Paso 5 — Crea `server-json.js`

**Qué vamos a hacer:** crear el archivo de nuestra primera API y cargar Express.

**Dónde:** en VS Code, clic derecho en el Explorador → **Nuevo archivo** → escribe `server-json.js`.

**Copia este código:**

```js
// =====================================================================
// PASO 1: API con datos en memoria (un arreglo JSON)
// Ejecutar:  npm run json      ->  http://localhost:3000/docs
// OJO: si reinicias el servidor, los cambios se pierden.
//      Por eso en el PASO 2 (server.js) usamos una base de datos.
// =====================================================================
const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();
```

Guarda con `Ctrl + S` y ejecuta en la terminal:

```powershell
node server-json.js
```

**✅ Comprueba:** el comando termina enseguida **sin mostrar nada** y vuelve a aparecer `...\banco-api>`. Si ves `Cannot find module 'express'`, repite el Paso 4 dentro de la carpeta `banco-api`.

**💡 ¿Qué pasó?** `require("express")` carga la librería. `app` es nuestra aplicación. `PORT` dice en qué "puerta" escuchará: 3000, salvo que alguien indique otra. Todavía no escucha, por eso el programa termina.

---

### Paso 6 — Enciende el servidor

**Qué vamos a hacer:** hacer que la aplicación se quede escuchando en el puerto 3000.

**Dónde:** archivo `server-json.js`, **al final**, debajo de `const app = express();`.

**📍 Ubicación:**

```js
const app = express();
// 👇 NUEVO
// 👆 FIN NUEVO
```

**Copia este código:**

```js

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
```

Guarda y ejecuta:

```powershell
node server-json.js
```

**✅ Comprueba:**
- La terminal muestra `Servidor en http://localhost:3000` y **no** vuelve el cursor (el servidor sigue encendido).
- Abre en el navegador `http://localhost:3000` → ves **`Cannot GET /`**. ¡Es correcto! El servidor funciona, pero aún no tiene rutas.

**💡 ¿Qué pasó?** `app.listen` enciende el servidor. Como no le enseñamos ninguna ruta, responde "no sé qué hacer con `/`".

---

### Paso 7 — Tu primera ruta: `GET /`

**Qué vamos a hacer:** responder un JSON cuando alguien visite `http://localhost:3000`.

**Dónde:** archivo `server-json.js`, justo **encima** de `app.listen(PORT, () => {`.

**📍 Ubicación:**

```js
const app = express();

// 👇 NUEVO
// 👆 FIN NUEVO
app.listen(PORT, () => {
```

**Copia este código:**

```js
app.get("/", (req, res) => {
  res.json({ mensaje: "Hola mundo desde Express" });
});

```

Guarda. En la terminal detén el servidor con **`Ctrl + C`** y vuelve a ejecutar `node server-json.js`.

**✅ Comprueba:** recarga `http://localhost:3000` → ves `{"mensaje":"Hola mundo desde Express"}`.

**💡 ¿Qué pasó?** `app.get("/", ...)` significa: "cuando llegue un GET a `/`, ejecuta esta función". `req` es el pedido que llega; `res` es la respuesta que enviamos. Tuvimos que reiniciar a mano para que tomara el cambio.

---

### Paso 8 — Scripts y reinicio automático (`--watch`)

**Qué vamos a hacer:** crear comandos cortos y que el servidor se reinicie solo al guardar.

**Dónde:** primero detén el servidor (**`Ctrl + C`** en la terminal). Luego abre el archivo `package.json`.

**📍 Ubicación:** **reemplaza** estas 3 líneas de `package.json`:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

**Copia este código** (en su lugar):

```json
  "scripts": {
    "json": "node --watch server-json.js",
    "dev": "node --env-file=.env --watch server.js",
    "start": "node --env-file=.env server.js"
  },
```

Revisa que en `package.json` exista la línea `"type": "commonjs",` (si no está, agrégala debajo de `"license": "ISC",`). Guarda y ejecuta:

```powershell
npm run json
```

**✅ Comprueba:**
1. La terminal muestra `> node --watch server-json.js` y luego `Servidor en http://localhost:3000`.
2. En `server-json.js` cambia el texto `"Hola mundo desde Express"` por `"Hola, soy la API del banco"` y guarda (`Ctrl + S`).
3. La terminal muestra `Restarting 'server-json.js'` y otra vez `Servidor en http://localhost:3000`.
4. Recarga el navegador → `{"mensaje":"Hola, soy la API del banco"}`, **sin** haber reiniciado a mano.

**💡 ¿Qué pasó?** `npm run json` ejecuta el comando guardado en `"json"`. `--watch` vigila el archivo y reinicia el servidor cada vez que guardas. Los scripts `dev` y `start` los usaremos más tarde. **Deja esta terminal encendida.**

---

🏁 **Punto de control 2**

<details><summary>Ver archivo completo: <code>server-json.js</code></summary>

```js
// =====================================================================
// PASO 1: API con datos en memoria (un arreglo JSON)
// Ejecutar:  npm run json      ->  http://localhost:3000/docs
// OJO: si reinicias el servidor, los cambios se pierden.
//      Por eso en el PASO 2 (server.js) usamos una base de datos.
// =====================================================================
const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  res.json({ mensaje: "Hola, soy la API del banco" });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
```

</details>

<details><summary>Ver archivo completo: <code>package.json</code></summary>

```json
{
  "name": "banco-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "json": "node --watch server-json.js",
    "dev": "node --env-file=.env --watch server.js",
    "start": "node --env-file=.env server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "swagger-jsdoc": "^6.3.0",
    "swagger-ui-express": "^5.0.1"
  }
}
```

</details>

---

## Etapa 3 — Datos en memoria: leer

### Paso 9 — Nuestra "base de datos" en un arreglo

**Qué vamos a hacer:** guardar 4 movimientos de ejemplo en una lista de JavaScript.

**Dónde:** archivo `server-json.js`, **debajo** de `const app = express();`.

**📍 Ubicación:**

```js
const app = express();
// 👇 NUEVO
// 👆 FIN NUEVO

app.get("/", (req, res) => {
```

**Copia este código:**

```js

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
```

**✅ Comprueba:** al guardar, la terminal muestra `Restarting 'server-json.js'` y `Servidor en http://localhost:3000`, **sin** errores en rojo. (Si ves `SyntaxError`, revisa que no falte una coma o un corchete `]`).

**💡 ¿Qué pasó?** `movimientos` es una lista con 4 objetos (cada uno es un movimiento). `siguienteId` recuerda qué número de id le toca al próximo movimiento que creemos.

---

### Paso 10 — `GET /api/movimientos`: listar todo

**Qué vamos a hacer:** cambiar el saludo por nuestra primera ruta real de la API.

**Dónde:** archivo `server-json.js`. Son **2 reemplazos**.

**a) Reemplaza** la ruta del saludo (las 3 líneas completas):

```js
app.get("/", (req, res) => {
  res.json({ mensaje: "Hola, soy la API del banco" });
});
```

**Copia este código** (en su lugar):

```js
app.get("/api/movimientos", (req, res) => {
  res.json(movimientos);
});
```

**b) Reemplaza** la línea del mensaje dentro de `app.listen`:

```js
  console.log(`Servidor en http://localhost:${PORT}`);
```

**Copia este código** (en su lugar):

```js
  console.log(`API (JSON): http://localhost:${PORT}/api/movimientos`);
```

**✅ Comprueba:**
- La terminal muestra `API (JSON): http://localhost:3000/api/movimientos`.
- Abre `http://localhost:3000/api/movimientos` → ves una lista `[ ... ]` con **4** movimientos (el primero es de Ana, `"cantidad":500`).
- `http://localhost:3000` ahora muestra `Cannot GET /` (ya no existe el saludo; es normal).

**💡 ¿Qué pasó?** `res.json(movimientos)` convierte la lista a texto JSON y la envía. Las rutas de nuestra API empiezan con `/api/`.

---

### Paso 11 — `GET /api/movimientos/:id`: buscar uno

**Qué vamos a hacer:** devolver un solo movimiento según el número que venga en la URL.

**Dónde:** archivo `server-json.js`, justo **encima** de `app.listen(PORT, () => {`.

**📍 Ubicación:**

```js
});

// 👇 NUEVO
// 👆 FIN NUEVO
app.listen(PORT, () => {
```

**Copia este código:**

```js
app.get("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const movimiento = movimientos.find((m) => m.id === id);
  res.json(movimiento);
});

```

**✅ Comprueba:**
- `http://localhost:3000/api/movimientos/3` → un solo objeto: `"id":3`, `"tipo":"TRANSFERENCIA"`, `"cantidad":120`.
- `http://localhost:3000/api/movimientos/99` → la página sale **en blanco** (y con estado 200, como si todo estuviera bien). Eso está mal: lo arreglamos en el siguiente paso.

**💡 ¿Qué pasó?** `:id` es un "comodín": lo que escribas ahí llega en `req.params.id` como **texto**. `Number(...)` lo convierte en número y `find` busca el primer movimiento con ese id.

---

### Paso 12 — Responder 404 si no existe

**Qué vamos a hacer:** avisar con un error claro cuando el movimiento no existe.

**Dónde:** archivo `server-json.js`, dentro de la ruta del paso 11, **debajo** de `const movimiento = movimientos.find((m) => m.id === id);`.

**📍 Ubicación:**

```js
  const movimiento = movimientos.find((m) => m.id === id);
  // 👇 NUEVO
  // 👆 FIN NUEVO
  res.json(movimiento);
```

**Copia este código:**

```js
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
```

**✅ Comprueba:**
- `http://localhost:3000/api/movimientos/99` → `{"error":"Movimiento no encontrado"}`.
- Pulsa `F12` → pestaña **Red / Network** → recarga: la petición muestra estado **404**.
- `http://localhost:3000/api/movimientos/3` sigue funcionando.

**💡 ¿Qué pasó?** Si `find` no encuentra nada, `movimiento` queda vacío (`undefined`). Entonces respondemos con código **404** ("no existe"). El `return` corta la función para no responder dos veces.

---

🏁 **Punto de control 3**

<details><summary>Ver archivo completo: <code>server-json.js</code></summary>

```js
// =====================================================================
// PASO 1: API con datos en memoria (un arreglo JSON)
// Ejecutar:  npm run json      ->  http://localhost:3000/docs
// OJO: si reinicias el servidor, los cambios se pierden.
//      Por eso en el PASO 2 (server.js) usamos una base de datos.
// =====================================================================
const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();

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

app.get("/api/movimientos", (req, res) => {
  res.json(movimientos);
});

app.get("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const movimiento = movimientos.find((m) => m.id === id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

app.listen(PORT, () => {
  console.log(`API (JSON): http://localhost:${PORT}/api/movimientos`);
});
```

</details>

---

## Etapa 4 — Crear, modificar y borrar

### Paso 13 — Instala REST Client y crea `pruebas.http`

**Qué vamos a hacer:** preparar una forma de enviar peticiones (el navegador solo sabe hacer GET).

**Dónde:** VS Code.

1. Abre Extensiones (`Ctrl + Shift + X`), busca **REST Client** (autor: Huachao Mao) e instálala.
2. Crea el archivo **`pruebas.http`** en la carpeta `banco-api` (junto a `server-json.js`).

**Copia este código** en `pruebas.http`:

```http
@api = http://localhost:3000/api

### Listar todos los movimientos
GET {{api}}/movimientos

### Obtener un movimiento por id
GET {{api}}/movimientos/3

### Obtener un movimiento que no existe (404)
GET {{api}}/movimientos/99
```

**✅ Comprueba:** encima de cada `GET` aparece el enlace **Send Request**. Haz clic en el primero → se abre un panel a la derecha con `HTTP/1.1 200 OK` y los 4 movimientos. El tercero responde `HTTP/1.1 404 Not Found`.

**💡 ¿Qué pasó?** `@api` es una variable: `{{api}}` se reemplaza por `http://localhost:3000/api`. `###` separa una petición de otra.

---

### Paso 14 — `POST /api/movimientos` (¡fallará a propósito!)

**Qué vamos a hacer:** crear movimientos nuevos. Primero veremos un error típico.

**Dónde:** **a)** archivo `server-json.js`, justo **encima** de `app.listen(PORT, () => {`. **b)** al final de `pruebas.http`.

**📍 Ubicación (a):**

```js
});

// 👇 NUEVO
// 👆 FIN NUEVO
app.listen(PORT, () => {
```

**a) Copia este código** en `server-json.js`:

```js
app.post("/api/movimientos", (req, res) => {
  const nuevo = {
    id: siguienteId++,
    ...req.body,
    fecha: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  movimientos.push(nuevo);
  res.status(201).json(nuevo);
});

```

**b) Copia este código** al final de `pruebas.http` (respeta la **línea en blanco** entre `Content-Type` y la llave `{`):

```http

### Crear un movimiento
POST {{api}}/movimientos
Content-Type: application/json

{
  "nombre": "Ana",
  "apellido": "Torres",
  "tipo": "DEPOSITO",
  "numero_cuenta": "1001",
  "cantidad": 100,
  "descripcion": "Prueba desde REST Client"
}
```

Guarda ambos archivos y haz clic en **Send Request** de la petición `POST`.

**✅ Comprueba (⚠️ error a propósito):** responde `HTTP/1.1 201 Created`, pero el movimiento **solo** tiene `id` y `fecha`: `{"id":5,"fecha":"2026-..."}`. ¡Faltan nombre, cantidad, etc.!

**💡 ¿Qué pasó?** Los datos que enviamos viajan en el **body** como texto JSON. Express no lo lee solo: por eso `req.body` llegó vacío. `...req.body` copia las propiedades del body dentro del objeto nuevo.

---

### Paso 15 — Arreglarlo con `express.json()`

**Qué vamos a hacer:** enseñarle a Express a leer el body en JSON.

**Dónde:** archivo `server-json.js`, **debajo** de `const app = express();`.

**📍 Ubicación:**

```js
const app = express();
// 👇 NUEVO
// 👆 FIN NUEVO

// ---------------------------------------------------------------------
```

**Copia este código:**

```js
app.use(express.json()); // permite leer el body en formato JSON
```

Guarda y vuelve a hacer clic en **Send Request** del `POST`.

**✅ Comprueba:** responde `201 Created` con **todos** los datos: `"id":5`, `"nombre":"Ana"`, `"cantidad":100`, `"descripcion":"Prueba desde REST Client"` y `"fecha"`. Luego envía el primer `GET` → ahora hay **5** movimientos.

**💡 ¿Qué pasó?** `app.use(...)` agrega un **middleware**: un "guardia" que revisa cada pedido antes de llegar a las rutas. `express.json()` abre el paquete (body) y lo convierte en objeto. (El id vuelve a ser 5 porque al guardar se reinició el servidor).

---

### Paso 16 — `PUT /api/movimientos/:id`: modificar

**Qué vamos a hacer:** cambiar datos de un movimiento existente.

**Dónde:** **a)** `server-json.js`, justo **encima** de `app.listen(PORT, () => {`. **b)** al final de `pruebas.http`.

**a) Copia este código** en `server-json.js`:

```js
app.put("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = movimientos.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Movimiento no encontrado" });
  movimientos[index] = { ...movimientos[index], ...req.body, id };
  res.json(movimientos[index]);
});

```

**b) Copia este código** al final de `pruebas.http`:

```http

### Actualizar un movimiento
PUT {{api}}/movimientos/1
Content-Type: application/json

{
  "cantidad": 150,
  "descripcion": "Monto corregido"
}
```

Guarda y envía el `PUT`.

**✅ Comprueba:** `200 OK` con el movimiento 1: `"nombre":"Ana"`, `"cantidad":150`, `"descripcion":"Monto corregido"` y la misma `"fecha":"2026-09-01 09:00:00"`.

**💡 ¿Qué pasó?** `findIndex` da la **posición** del movimiento en la lista (o `-1` si no está). `{ ...viejo, ...body, id }` mezcla: lo que envías reemplaza, lo demás se conserva y el `id` no se puede cambiar.

---

### Paso 17 — `DELETE /api/movimientos/:id`: eliminar

**Qué vamos a hacer:** borrar un movimiento.

**Dónde:** **a)** `server-json.js`, justo **encima** de `app.listen(PORT, () => {`. **b)** al final de `pruebas.http`.

**a) Copia este código** en `server-json.js`:

```js
app.delete("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const existe = movimientos.some((m) => m.id === id);
  if (!existe) return res.status(404).json({ error: "Movimiento no encontrado" });
  movimientos = movimientos.filter((m) => m.id !== id);
  res.json({ mensaje: "Movimiento eliminado" });
});

```

**b) Copia este código** al final de `pruebas.http`:

```http

### Eliminar un movimiento
DELETE {{api}}/movimientos/4
```

Guarda y envía el `DELETE`.

**✅ Comprueba:**
- Primera vez: `200 OK` con `{"mensaje":"Movimiento eliminado"}`.
- Envíalo **otra vez**: `404 Not Found` con `{"error":"Movimiento no encontrado"}`.
- El primer `GET` ahora muestra **3** movimientos (ya no está el id 4).

**💡 ¿Qué pasó?** `some` responde "¿existe alguno?" (sí/no). `filter` crea una lista nueva **sin** el movimiento borrado.

---

🏁 **Punto de control 4**

<details><summary>Ver archivo completo: <code>server-json.js</code></summary>

```js
// =====================================================================
// PASO 1: API con datos en memoria (un arreglo JSON)
// Ejecutar:  npm run json      ->  http://localhost:3000/docs
// OJO: si reinicias el servidor, los cambios se pierden.
//      Por eso en el PASO 2 (server.js) usamos una base de datos.
// =====================================================================
const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json()); // permite leer el body en formato JSON

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

app.get("/api/movimientos", (req, res) => {
  res.json(movimientos);
});

app.get("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const movimiento = movimientos.find((m) => m.id === id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

app.post("/api/movimientos", (req, res) => {
  const nuevo = {
    id: siguienteId++,
    ...req.body,
    fecha: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  movimientos.push(nuevo);
  res.status(201).json(nuevo);
});

app.put("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = movimientos.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Movimiento no encontrado" });
  movimientos[index] = { ...movimientos[index], ...req.body, id };
  res.json(movimientos[index]);
});

app.delete("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const existe = movimientos.some((m) => m.id === id);
  if (!existe) return res.status(404).json({ error: "Movimiento no encontrado" });
  movimientos = movimientos.filter((m) => m.id !== id);
  res.json({ mensaje: "Movimiento eliminado" });
});

app.listen(PORT, () => {
  console.log(`API (JSON): http://localhost:${PORT}/api/movimientos`);
});
```

</details>

<details><summary>Ver archivo completo: <code>pruebas.http</code></summary>

```http
@api = http://localhost:3000/api

### Listar todos los movimientos
GET {{api}}/movimientos

### Obtener un movimiento por id
GET {{api}}/movimientos/3

### Obtener un movimiento que no existe (404)
GET {{api}}/movimientos/99

### Crear un movimiento
POST {{api}}/movimientos
Content-Type: application/json

{
  "nombre": "Ana",
  "apellido": "Torres",
  "tipo": "DEPOSITO",
  "numero_cuenta": "1001",
  "cantidad": 100,
  "descripcion": "Prueba desde REST Client"
}

### Actualizar un movimiento
PUT {{api}}/movimientos/1
Content-Type: application/json

{
  "cantidad": 150,
  "descripcion": "Monto corregido"
}

### Eliminar un movimiento
DELETE {{api}}/movimientos/4
```

</details>

---

## Etapa 5 — CORS y Swagger

### Paso 18 — Permitir llamadas desde React (`cors`)

**Qué vamos a hacer:** dejar que una página de otro puerto (React, mañana) use nuestra API.

**Dónde:** archivo `server-json.js`. Son **2 lugares**.

**a)** **Debajo** de `const express = require("express");`

**📍 Ubicación:**

```js
const express = require("express");
// 👇 NUEVO
// 👆 FIN NUEVO

const PORT = process.env.PORT || 3000;
```

**Copia este código:**

```js
const cors = require("cors");
```

**b)** Justo **encima** de `app.use(express.json());`

**📍 Ubicación:**

```js
const app = express();
// 👇 NUEVO
// 👆 FIN NUEVO
app.use(express.json()); // permite leer el body en formato JSON
```

**Copia este código:**

```js
app.use(cors()); // permite que React (otro puerto) llame a esta API
```

Guarda y envía el primer `GET` de `pruebas.http`.

**✅ Comprueba:** en la respuesta (panel derecho), entre las cabeceras de arriba aparece `Access-Control-Allow-Origin: *`.

**💡 ¿Qué pasó?** Por seguridad, el navegador bloquea que una página llame a un servidor de otro puerto, salvo que el servidor lo permita. Esa cabecera es el "permiso". Lo veremos en acción el martes.

---

### Paso 19 — Configurar Swagger

**Qué vamos a hacer:** cargar las librerías de Swagger y describir nuestra API.

**Dónde:** archivo `server-json.js`. Son **2 lugares**.

**a)** **Debajo** de `const cors = require("cors");`

**📍 Ubicación:**

```js
const cors = require("cors");
// 👇 NUEVO
// 👆 FIN NUEVO
```

**Copia este código:**

```js
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
```

**b)** **Debajo** de `let siguienteId = 5;`

**📍 Ubicación:**

```js
let siguienteId = 5;
// 👇 NUEVO
// 👆 FIN NUEVO

app.get("/api/movimientos", (req, res) => {
```

**Copia este código:**

```js

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Banco API (versión JSON)", version: "1.0.0", description: "Paso 1: datos en memoria" },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [__filename],
});
```

**✅ Comprueba:** al guardar, la terminal se reinicia y muestra `API (JSON): http://localhost:3000/api/movimientos` **sin** errores.

**💡 ¿Qué pasó?** `swaggerJsdoc` arma el "menú" de la API: título, versión y dirección. `apis: [__filename]` le dice: "busca las descripciones en **este mismo archivo**".

---

### Paso 20 — Publicar la página `/docs`

**Qué vamos a hacer:** mostrar la documentación en el navegador.

**Dónde:** archivo `server-json.js`. Son **2 lugares**.

**a)** Justo **encima** de `app.listen(PORT, () => {`

**📍 Ubicación:**

```js
});

// 👇 NUEVO
// 👆 FIN NUEVO

app.listen(PORT, () => {
```

**Copia este código:**

```js
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**b)** Dentro de `app.listen`, **debajo** de la línea `console.log(`API (JSON): ...`);`

**📍 Ubicación:**

```js
  console.log(`API (JSON): http://localhost:${PORT}/api/movimientos`);
  // 👇 NUEVO
  // 👆 FIN NUEVO
});
```

**Copia este código:**

```js
  console.log(`Docs:       http://localhost:${PORT}/docs`);
```

**✅ Comprueba:**
- La terminal muestra 2 líneas: `API (JSON): ...` y `Docs:       http://localhost:3000/docs`.
- Abre `http://localhost:3000/docs` → página de Swagger con el título **Banco API (versión JSON)** `1.0.0` y el aviso **"No operations defined in spec!"** (todavía no describimos las rutas).

**💡 ¿Qué pasó?** `swagger-ui-express` dibuja la página a partir del "menú" (`swaggerSpec`).

---

### Paso 21 — Describir la forma de un movimiento

**Qué vamos a hacer:** decirle a Swagger qué campos tiene un movimiento.

**Dónde:** archivo `server-json.js`, **debajo** del bloque `const swaggerSpec = swaggerJsdoc({ ... });` y **encima** de `app.get("/api/movimientos", (req, res) => {`.

**📍 Ubicación:**

```js
  apis: [__filename],
});

// 👇 NUEVO
// 👆 FIN NUEVO
app.get("/api/movimientos", (req, res) => {
```

**Copia este código:**

```js
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

```

**✅ Comprueba:** recarga `http://localhost:3000/docs` → abajo aparece la sección **Schemas** con **Movimiento**. Haz clic y verás sus 7 campos.

**💡 ¿Qué pasó?** Swagger lee los comentarios que empiezan con `@swagger`. Están escritos en YAML: **los espacios al inicio importan**, cópialos tal cual.

---

### Paso 22 — Documentar `GET /api/movimientos`

**Qué vamos a hacer:** agregar la primera ruta al menú de Swagger.

**Dónde:** archivo `server-json.js`, justo **encima** de `app.get("/api/movimientos", (req, res) => {`.

**📍 Ubicación:**

```js
 */

// 👇 NUEVO
// 👆 FIN NUEVO
app.get("/api/movimientos", (req, res) => {
```

**Copia este código:**

```js
/**
 * @swagger
 * /api/movimientos:
 *   get:
 *     summary: Listar todos los movimientos
 *     tags: [Movimientos]
 *     responses:
 *       200: { description: Lista de movimientos }
 */
```

**✅ Comprueba:** recarga `/docs` → aparece el grupo **Movimientos** con `GET /api/movimientos`. Ábrelo → **Try it out** → **Execute** → abajo ves `Code 200` y la lista de movimientos.

**💡 ¿Qué pasó?** Cada comentario `@swagger` describe una ruta: su dirección, el método, un resumen, el grupo (`tags`) y las respuestas posibles.

---

### Paso 23 — Documentar las otras 4 rutas

**Qué vamos a hacer:** repetir lo mismo para GET por id, POST, PUT y DELETE.

**Dónde:** archivo `server-json.js`. Cada comentario va **justo encima** de su ruta.

**a)** **Encima** de `app.get("/api/movimientos/:id", (req, res) => {`

```js
/**
 * @swagger
 * /api/movimientos/{id}:
 *   get:
 *     summary: Obtener un movimiento por id
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: El movimiento }
 *       404: { description: No existe }
 */
```

**b)** **Encima** de `app.post("/api/movimientos", (req, res) => {`

```js
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
```

**c)** **Encima** de `app.put("/api/movimientos/:id", (req, res) => {`

```js
/**
 * @swagger
 * /api/movimientos/{id}:
 *   put:
 *     summary: Actualizar un movimiento
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Movimiento' }
 *     responses:
 *       200: { description: Movimiento actualizado }
 *       404: { description: No existe }
 */
```

**d)** **Encima** de `app.delete("/api/movimientos/:id", (req, res) => {`

```js
/**
 * @swagger
 * /api/movimientos/{id}:
 *   delete:
 *     summary: Eliminar un movimiento
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No existe }
 */
```

**✅ Comprueba:** recarga `/docs` → el grupo **Movimientos** tiene **5** rutas: `GET /api/movimientos`, `POST /api/movimientos`, `GET /api/movimientos/{id}`, `PUT /api/movimientos/{id}` y `DELETE /api/movimientos/{id}`. Prueba `GET /api/movimientos/{id}` con **Try it out**, `id` = `2` → `Code 200` con Luis Mendoza.

> Si sale **"Failed to load API definition"**, algún comentario quedó con espacios distintos. Compáralo con el Punto de control 5.

**💡 ¿Qué pasó?** `{id}` en Swagger es lo mismo que `:id` en Express. `$ref` reutiliza la forma "Movimiento" del paso 21, así no la repetimos.

---

🏁 **Punto de control 5** — ¡`server-json.js` está terminado!

<details><summary>Ver archivo completo: <code>server-json.js</code></summary>

```js
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
app.use(cors()); // permite que React (otro puerto) llame a esta API
app.use(express.json()); // permite leer el body en formato JSON

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
 */
app.get("/api/movimientos", (req, res) => {
  res.json(movimientos);
});

/**
 * @swagger
 * /api/movimientos/{id}:
 *   get:
 *     summary: Obtener un movimiento por id
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: El movimiento }
 *       404: { description: No existe }
 */
app.get("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const movimiento = movimientos.find((m) => m.id === id);
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
 * /api/movimientos/{id}:
 *   put:
 *     summary: Actualizar un movimiento
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Movimiento' }
 *     responses:
 *       200: { description: Movimiento actualizado }
 *       404: { description: No existe }
 */
app.put("/api/movimientos/:id", (req, res) => {
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
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No existe }
 */
app.delete("/api/movimientos/:id", (req, res) => {
  const id = Number(req.params.id);
  const existe = movimientos.some((m) => m.id === id);
  if (!existe) return res.status(404).json({ error: "Movimiento no encontrado" });
  movimientos = movimientos.filter((m) => m.id !== id);
  res.json({ mensaje: "Movimiento eliminado" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`API (JSON): http://localhost:${PORT}/api/movimientos`);
  console.log(`Docs:       http://localhost:${PORT}/docs`);
});
```

</details>

---

## Etapa 6 — El problema de la memoria

### Paso 24 — Comprueba que los datos se pierden

**Qué vamos a hacer:** un experimento para entender por qué necesitamos una base de datos.

**Dónde:** navegador (`http://localhost:3000/docs`) y terminal.

1. En Swagger abre `POST /api/movimientos` → **Try it out** → deja el ejemplo → **Execute**. Debe responder `Code 201` con `"id": 5`.
2. Ejecuta `GET /api/movimientos` → hay **5** movimientos.
3. En la terminal detén el servidor con **`Ctrl + C`** y vuelve a encenderlo con `npm run json`.
4. Ejecuta otra vez `GET /api/movimientos`.

**✅ Comprueba:** ahora hay solo **4** movimientos. ¡El movimiento 5 desapareció!

Al terminar, detén el servidor con **`Ctrl + C`** (ya no usaremos `server-json.js`).

**💡 ¿Qué pasó?** La lista vive en la memoria del programa: al apagarlo, se borra. Además, cada compañero tiene su propia lista. Una **base de datos** guarda los datos de forma permanente y compartida.

---

## Etapa 7 — Preparar la base de datos

> 🔒 La tabla **`dbo.cap_movimientos`** ya fue creada por el instructor en SQL Server (`172.26.60.12,4433`, base `BG_APP`) y es **compartida por todo el grupo**. Tú **no** creas ni reinicias la tabla.

### Paso 25 — (Opcional) Mira la tabla en SSMS

**Qué vamos a hacer:** ver con tus ojos la tabla que usará la API.

**Dónde:** SQL Server Management Studio (SSMS). Si no lo tienes, mira el proyector y pasa al Paso 26.

1. En **Conectar al servidor** escribe:

   | Campo | Valor |
   |---|---|
   | Nombre del servidor | `172.26.60.12,4433` ← con **coma** |
   | Autenticación | Autenticación de SQL Server |
   | Inicio de sesión | `apl_reportesctrl` |
   | Contraseña | la que te dio el instructor **en privado** |
   | Cifrar | Obligatorio |
   | Certificado de servidor de confianza | ✅ marcado |

2. Clic en **Conectar** → **Nueva consulta** → arriba elige la base **BG_APP**.

**Copia este código** y ejecútalo con `F5`:

```sql
SELECT COUNT(*) AS total FROM dbo.cap_movimientos;
```

**✅ Comprueba:** aparece una columna `total` con **40** (o un número mayor si tus compañeros ya hicieron pruebas).

**💡 ¿Qué pasó?** Una tabla es como una hoja de Excel: cada fila es un movimiento. En SSMS ejecuta **solo** consultas `SELECT` (leer): la tabla es de todos.

---

### Paso 26 — Crea la carpeta `db` con los scripts (solo para leer)

**Qué vamos a hacer:** guardar los scripts con los que el instructor creó la tabla, para entenderla.

**Dónde:** en VS Code crea la carpeta **`db`** dentro de `banco-api` (clic derecho → **Nueva carpeta**) y dentro dos archivos: **`db/schema.sql`** y **`db/seed.sql`**.

> ⚠️ **NO ejecutes estos scripts.** Son solo para leer: la tabla ya existe.

**Copia este código** en `db/schema.sql`:

```sql
-- =====================================================================
-- Script de creación de tablas - Banco (Capacitación)  |  SQL Server
-- Base de datos: BG_APP
-- Una sola tabla con todos los movimientos de dinero.
--
-- Usamos el prefijo "cap_" (capacitación) para no chocar con tablas
-- que ya existan en BG_APP.
-- Se puede ejecutar en SSMS / Azure Data Studio o con: npm run db:init
-- =====================================================================

IF OBJECT_ID('dbo.cap_movimientos', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cap_movimientos (
    id                     INT IDENTITY(1,1) PRIMARY KEY,         -- identificador (se genera solo: 1, 2, 3...)
    nombre                 NVARCHAR(50)  NOT NULL,                -- nombre del cliente
    apellido               NVARCHAR(50)  NOT NULL,                -- apellido del cliente
    tipo                   VARCHAR(20)   NOT NULL,                -- DEPOSITO | RETIRO | TRANSFERENCIA
    numero_cuenta          VARCHAR(20)   NOT NULL,                -- cuenta que hace el movimiento
    numero_cuenta_destino  VARCHAR(20)   NULL,                    -- solo para TRANSFERENCIA (si no, NULL)
    cantidad               DECIMAL(12,2) NOT NULL,                -- monto en dólares
    descripcion            NVARCHAR(200) NULL,                    -- detalle opcional
    fecha                  DATETIME2(0)  NOT NULL DEFAULT SYSDATETIME() -- fecha y hora del movimiento
  );
END;
```

**Copia este código** en `db/seed.sql`:

```sql
-- =====================================================================
-- Datos de ejemplo (5 clientes, 5 cuentas, 40 movimientos) | SQL Server
-- 1001 Ana Torres | 1002 Luis Mendoza | 1003 María Castillo
-- 1004 Carlos Vera | 1005 Sofía Rivas
-- Solo inserta si la tabla está vacía.
-- N'texto' = texto Unicode (para tildes y ñ)
-- =====================================================================

IF NOT EXISTS (SELECT 1 FROM dbo.cap_movimientos)
BEGIN
  INSERT INTO dbo.cap_movimientos (nombre, apellido, tipo, numero_cuenta, numero_cuenta_destino, cantidad, descripcion, fecha) VALUES
  (N'Ana',    N'Torres',   'DEPOSITO',      '1001', NULL,   1500, N'Sueldo',               '2026-08-15 09:10:00'),
  (N'Luis',   N'Mendoza',  'DEPOSITO',      '1002', NULL,   1200, N'Sueldo',               '2026-08-15 10:25:00'),
  (N'María',  N'Castillo', 'DEPOSITO',      '1003', NULL,   2000, N'Sueldo',               '2026-08-15 11:40:00'),
  (N'Carlos', N'Vera',     'DEPOSITO',      '1004', NULL,    900, N'Sueldo',               '2026-08-15 15:05:00'),
  (N'Sofía',  N'Rivas',    'DEPOSITO',      '1005', NULL,   1800, N'Sueldo',               '2026-08-16 08:30:00'),
  (N'Ana',    N'Torres',   'RETIRO',        '1001', NULL,    100, N'Cajero automático',    '2026-08-17 12:00:00'),
  (N'Luis',   N'Mendoza',  'TRANSFERENCIA', '1002', '1001',   75, N'Pago de almuerzo',     '2026-08-18 14:20:00'),
  (N'María',  N'Castillo', 'TRANSFERENCIA', '1003', '1005',  250, N'Alquiler compartido',  '2026-08-19 09:45:00'),
  (N'Carlos', N'Vera',     'RETIRO',        '1004', NULL,     60, N'Supermercado',         '2026-08-20 17:30:00'),
  (N'Sofía',  N'Rivas',    'TRANSFERENCIA', '1005', '1004',  120, N'Préstamo',             '2026-08-21 10:10:00'),
  (N'Ana',    N'Torres',   'TRANSFERENCIA', '1001', '1003',  200, N'Regalo de cumpleaños', '2026-08-22 19:00:00'),
  (N'Luis',   N'Mendoza',  'RETIRO',        '1002', NULL,    150, N'Cajero automático',    '2026-08-23 11:15:00'),
  (N'Carlos', N'Vera',     'DEPOSITO',      '1004', NULL,    350, N'Venta de bicicleta',   '2026-08-25 08:50:00'),
  (N'María',  N'Castillo', 'RETIRO',        '1003', NULL,     80, N'Farmacia',             '2026-08-26 13:30:00'),
  (N'Sofía',  N'Rivas',    'RETIRO',        '1005', NULL,    200, N'Cajero automático',    '2026-08-27 16:45:00'),
  (N'Ana',    N'Torres',   'DEPOSITO',      '1001', NULL,    300, N'Freelance',            '2026-08-28 10:00:00'),
  (N'Luis',   N'Mendoza',  'TRANSFERENCIA', '1002', '1004',   90, N'Entradas al cine',     '2026-08-29 18:20:00'),
  (N'Carlos', N'Vera',     'TRANSFERENCIA', '1004', '1002',   45, N'Pago de deuda',        '2026-08-30 12:40:00'),
  (N'María',  N'Castillo', 'TRANSFERENCIA', '1003', '1001',  150, N'Pago de curso',        '2026-08-31 09:30:00'),
  (N'Ana',    N'Torres',   'DEPOSITO',      '1001', NULL,   1500, N'Sueldo',               '2026-09-01 09:00:00'),
  (N'Luis',   N'Mendoza',  'DEPOSITO',      '1002', NULL,   1200, N'Sueldo',               '2026-09-01 09:20:00'),
  (N'María',  N'Castillo', 'DEPOSITO',      '1003', NULL,   2000, N'Sueldo',               '2026-09-01 09:40:00'),
  (N'Carlos', N'Vera',     'DEPOSITO',      '1004', NULL,    900, N'Sueldo',               '2026-09-01 10:00:00'),
  (N'Sofía',  N'Rivas',    'DEPOSITO',      '1005', NULL,   1800, N'Sueldo',               '2026-09-01 10:20:00'),
  (N'Sofía',  N'Rivas',    'TRANSFERENCIA', '1005', '1003',  250, N'Alquiler compartido',  '2026-09-02 14:10:00'),
  (N'Ana',    N'Torres',   'RETIRO',        '1001', NULL,    250, N'Pago de tarjeta',      '2026-09-03 11:00:00'),
  (N'Carlos', N'Vera',     'RETIRO',        '1004', NULL,    120, N'Gasolina',             '2026-09-04 15:35:00'),
  (N'Luis',   N'Mendoza',  'TRANSFERENCIA', '1002', '1005',   60, N'Cena',                 '2026-09-05 20:15:00'),
  (N'María',  N'Castillo', 'RETIRO',        '1003', NULL,    300, N'Cajero automático',    '2026-09-06 10:45:00'),
  (N'Ana',    N'Torres',   'TRANSFERENCIA', '1001', '1004',  180, N'Arreglo del carro',    '2026-09-07 12:30:00'),
  (N'Sofía',  N'Rivas',    'DEPOSITO',      '1005', NULL,    400, N'Reembolso',            '2026-09-08 09:05:00'),
  (N'Carlos', N'Vera',     'TRANSFERENCIA', '1004', '1003',  100, N'Clases de inglés',     '2026-09-09 17:50:00'),
  (N'Luis',   N'Mendoza',  'RETIRO',        '1002', NULL,    200, N'Cajero automático',    '2026-09-10 13:25:00'),
  (N'María',  N'Castillo', 'TRANSFERENCIA', '1003', '1002',   75, N'Pago de almuerzo',     '2026-09-10 16:00:00'),
  (N'Ana',    N'Torres',   'RETIRO',        '1001', NULL,     90, N'Supermercado',         '2026-09-11 11:30:00'),
  (N'Sofía',  N'Rivas',    'TRANSFERENCIA', '1005', '1001',  130, N'Concierto',            '2026-09-11 18:10:00'),
  (N'Carlos', N'Vera',     'DEPOSITO',      '1004', NULL,    220, N'Venta en línea',       '2026-09-12 10:15:00'),
  (N'Luis',   N'Mendoza',  'DEPOSITO',      '1002', NULL,    150, N'Freelance',            '2026-09-12 12:45:00'),
  (N'María',  N'Castillo', 'TRANSFERENCIA', '1003', '1004',   60, N'Regalo',               '2026-09-12 17:05:00'),
  (N'Sofía',  N'Rivas',    'RETIRO',        '1005', NULL,    100, N'Cajero automático',    '2026-09-12 19:30:00');
END;
```

**✅ Comprueba:** en el Explorador ves `db` con `schema.sql` y `seed.sql`. En `schema.sql` encuentra las **9 columnas** de la tabla: `id`, `nombre`, `apellido`, `tipo`, `numero_cuenta`, `numero_cuenta_destino`, `cantidad`, `descripcion` y `fecha`.

**💡 ¿Qué pasó?** `schema.sql` describe la tabla (sus columnas y tipos). `seed.sql` trae los 40 movimientos de ejemplo. Fíjate: **no hay columna "saldo"**; lo calcularemos sumando y restando movimientos.

---

### Paso 27 — Instala `mssql`

**Qué vamos a hacer:** descargar la librería que habla con SQL Server.

**Dónde:** terminal de VS Code (dentro de `banco-api`, con el servidor detenido).

**Copia este código:**

```powershell
npm install mssql
```

**✅ Comprueba:** termina con `added ... packages` y en `package.json`, dentro de `"dependencies"`, aparece `"mssql"`.

**💡 ¿Qué pasó?** `mssql` es el "teléfono" que usará nuestra API para enviar consultas SQL al servidor.

---

### Paso 28 — Crea el archivo `.env` (y `.gitignore`)

**Qué vamos a hacer:** guardar los datos de conexión **fuera** del código.

**Dónde:** crea el archivo **`.env`** en la carpeta `banco-api` (junto a `package.json`). El nombre es exactamente `.env`: empieza con punto y no tiene nada más.

**Copia este código** en `.env` y cambia `escribe_aqui_la_contraseña` por la contraseña que te dio el instructor (deja las comillas):

```text
# Datos de conexión. Este archivo NO se comparte ni se sube a git.
DB_SERVER=172.26.60.12
DB_PORT=4433
DB_USER=apl_reportesctrl
DB_PASSWORD="escribe_aqui_la_contraseña"
DB_DATABASE=BG_APP
PORT=3000
```

> ⚠️ Las **comillas** en `DB_PASSWORD` son obligatorias si la contraseña tiene **`#`** (sin comillas, todo lo que va después del `#` se ignora). Déjalas siempre y no dejes espacios antes ni después del `=`.

Crea también el archivo **`.gitignore`** (en la misma carpeta) con este contenido:

```text
node_modules
.env
```

**✅ Comprueba:** en la terminal ejecuta:

```powershell
Test-Path .env
```

Debe responder **`True`**. (Si responde `False`, quizá se guardó como `.env.txt`: renómbralo).

**💡 ¿Qué pasó?** La contraseña es como la llave de la cocina: no se pega en la puerta. El código se puede compartir; el `.env` no. `.gitignore` evita que `.env` y `node_modules` se suban a git.

---

🏁 **Punto de control 6** — tu `.env` debe tener **tu** contraseña en lugar del texto de ejemplo.

<details><summary>Ver archivo completo: <code>.env</code></summary>

```text
# Datos de conexión. Este archivo NO se comparte ni se sube a git.
DB_SERVER=172.26.60.12
DB_PORT=4433
DB_USER=apl_reportesctrl
DB_PASSWORD="escribe_aqui_la_contraseña"
DB_DATABASE=BG_APP
PORT=3000
```

</details>

<details><summary>Ver archivo completo: <code>.gitignore</code></summary>

```text
node_modules
.env
```

</details>

<details><summary>Ver archivo completo: <code>package.json</code></summary>

```json
{
  "name": "banco-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "json": "node --watch server-json.js",
    "dev": "node --env-file=.env --watch server.js",
    "start": "node --env-file=.env server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "mssql": "^12.7.2",
    "swagger-jsdoc": "^6.3.0",
    "swagger-ui-express": "^5.0.1"
  }
}
```

</details>

---

## Etapa 8 — La conexión: `db.js`

### Paso 29 — `db.js`: los datos de conexión

**Qué vamos a hacer:** crear el módulo que se conecta a SQL Server, empezando por su configuración.

**Dónde:** crea el archivo **`db.js`** en `banco-api` (junto a `server-json.js`).

**Copia este código:**

```js
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
    encrypt: true, // "Cifrar: Obligatorio"
    trustServerCertificate: true, // "Certificado de servidor de confianza"
  },
};
```

Guarda y ejecuta:

```powershell
node db.js
```

**✅ Comprueba:** termina enseguida **sin mostrar nada** (sin errores). Si sale `Cannot find module 'mssql'`, repite el Paso 27.

**💡 ¿Qué pasó?** `config` tiene los mismos datos que la ventana de conexión de SSMS. `process.env.DB_SERVER` lee el valor del archivo `.env`. (La plantilla `.env.example` la tiene el instructor).

---

### Paso 30 — `db.js`: conectarse una sola vez

**Qué vamos a hacer:** abrir la conexión la primera vez y reutilizarla.

**Dónde:** archivo `db.js`, **al final**, debajo del `};` que cierra `config`.

**📍 Ubicación:**

```js
    trustServerCertificate: true, // "Certificado de servidor de confianza"
  },
};
// 👇 NUEVO
// 👆 FIN NUEVO
```

**Copia este código:**

```js

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
```

**✅ Comprueba:** `node db.js` sigue terminando **sin errores** y sin mostrar nada.

**💡 ¿Qué pasó?** Conectarse tarda. Por eso guardamos la conexión en `conexion` y la reutilizamos. `.then` se ejecuta si la conexión funciona; `.catch`, si falla.

---

### Paso 31 — `db.js`: la función `consultar`

**Qué vamos a hacer:** crear la única función que usará la API para ejecutar SQL, y exportarla.

**Dónde:** archivo `db.js`, **al final**, debajo del `}` que cierra `function conectar()`.

**📍 Ubicación:**

```js
  return conexion;
}
// 👇 NUEVO
// 👆 FIN NUEVO
```

**Copia este código:**

```js

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
```

**✅ Comprueba:** `node db.js` termina **sin errores**.

**💡 ¿Qué pasó?** `consultar("... WHERE id = @id", { id: 5 })` envía el SQL y los valores **por separado** (así nadie puede "colar" SQL malicioso). `await` significa "espera la respuesta del servidor". `module.exports` permite usar estas funciones desde otros archivos.

---

### Paso 32 — Prueba la conexión (archivo temporal)

**Qué vamos a hacer:** comprobar que llegamos a la tabla antes de construir la API.

**Dónde:** crea el archivo **`probar-db.js`** en `banco-api`. Lo borraremos al final de este paso.

**Copia este código:**

```js
const { sql, consultar } = require("./db");

consultar("SELECT COUNT(*) AS total FROM cap_movimientos")
  .then((filas) => console.log(filas))
  .catch((error) => console.error("✘", error.message))
  .finally(() => sql.close());
```

Guarda y ejecuta (fíjate en `--env-file=.env`):

```powershell
node --env-file=.env probar-db.js
```

**✅ Comprueba:** la terminal muestra:

```text
✔ Conectado a SQL Server 172.26.60.12:4433 / BG_APP
[ { total: 40 } ]
```

(el número puede ser mayor). Luego **borra el archivo**:

```powershell
Remove-Item probar-db.js
```

> Si después de unos 15 segundos sale `✘ No se pudo conectar a SQL Server: Failed to connect to 172.26.60.12:4433 in 15000ms` → no hay red/VPN hacia el servidor: avisa al instructor.
> Si sale `✘ No se pudo conectar a SQL Server: Login failed for user 'apl_reportesctrl'` → revisa la contraseña en `.env` (y las comillas).
> Si sale `node: .env: not found` → el archivo `.env` no existe o tiene otro nombre (Paso 28).

**💡 ¿Qué pasó?** `--env-file=.env` carga el `.env` antes de ejecutar. Nuestra función `consultar` envió un `SELECT` y recibió una lista de filas. `sql.close()` cierra la conexión para que el programa termine.

---

🏁 **Punto de control 7** — ¡`db.js` está terminado! (`probar-db.js` ya no debe existir).

<details><summary>Ver archivo completo: <code>db.js</code></summary>

```js
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
    encrypt: true, // "Cifrar: Obligatorio"
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
```

</details>

---

## Etapa 9 — Nuevo `server.js`

> Desde aquí escribimos la **API final** en un archivo nuevo, `server.js`. `server-json.js` se queda como recuerdo de la Parte A.

### Paso 33 — Esqueleto de `server.js`

**Qué vamos a hacer:** crear la API final con Express, CORS, JSON y `listen` (lo mismo que ya conoces).

**Dónde:** crea el archivo **`server.js`** en `banco-api`.

**Copia este código:**

```js
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

app.listen(PORT, () => {
  console.log(`API:  http://localhost:${PORT}/api/movimientos`);
});
```

> El punto 2) del comentario (`npm run db:init`) **solo lo hace el instructor**. Tú **no** lo ejecutas.

Guarda y ejecuta (asegúrate de que `npm run json` esté detenido):

```powershell
npm run dev
```

**✅ Comprueba:** la terminal muestra `> node --env-file=.env --watch server.js` y, tras unos segundos (la primera vez `mssql` tarda en cargar), `API:  http://localhost:3000/api/movimientos`. En el navegador, `http://localhost:3000` muestra `Cannot GET /` (todavía no hay rutas).

**💡 ¿Qué pasó?** `npm run dev` carga el `.env` y vigila `server.js`. `require("./db")` trae nuestra función `consultar` desde `db.js` (el `./` significa "en esta misma carpeta"). **Deja esta terminal encendida** el resto del día.

---

### Paso 34 — Ruta de bienvenida `GET /`

**Qué vamos a hacer:** una respuesta rápida para saber si la API está viva.

**Dónde:** archivo `server.js`, justo **encima** de `app.listen(PORT, () => {`.

**📍 Ubicación:**

```js
app.use(express.json());

// 👇 NUEVO
// 👆 FIN NUEVO
app.listen(PORT, () => {
```

**Copia este código:**

```js
app.get("/", (req, res) => {
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});

```

**✅ Comprueba:** `http://localhost:3000` → `{"mensaje":"Banco API funcionando","docs":"http://localhost:3000/docs"}`.

**💡 ¿Qué pasó?** Esta ruta no usa la base de datos, así que siempre responde. Nos sirve para saber que el servidor está encendido.

---

### Paso 35 — Manejador de errores

**Qué vamos a hacer:** si algo falla (por ejemplo, no hay conexión a la base), responder el error en JSON.

**Dónde:** archivo `server.js`, **debajo** de la ruta `GET /` y justo **encima** de `app.listen(PORT, () => {`.

**📍 Ubicación:**

```js
});

// 👇 NUEVO
// 👆 FIN NUEVO
app.listen(PORT, () => {
```

**Copia este código:**

```js
// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
app.use((error, req, res, next) => {
  console.error("✘", error.message);
  res.status(500).json({ error: error.message });
});

```

**✅ Comprueba:** al guardar, la terminal muestra `Restarting 'server.js'` y `API:  http://localhost:3000/api/movimientos` sin errores. `http://localhost:3000` sigue respondiendo el mensaje de bienvenida. (Lo veremos trabajar en el siguiente paso si hay algún problema de conexión).

**💡 ¿Qué pasó?** Un middleware con **4** parámetros (`error, req, res, next`) es especial: Express lo usa solo cuando una ruta falla. Responde con código **500** ("error del servidor"). Debe ir **después** de todas las rutas.

---

## Etapa 10 — Leer desde SQL Server

> ⚠️ Desde ahora trabajamos sobre la **tabla compartida**. Los `PUT` y `DELETE` de `pruebas.http` todavía apuntan a los ids 1 y 4: **no los envíes** hasta que los cambiemos en los pasos 45 y 46.

### Paso 36 — `GET /api/movimientos` con SQL (versión simple)

**Qué vamos a hacer:** leer todos los movimientos de la tabla.

**Dónde:** archivo `server.js`, justo **encima** de `app.get("/", (req, res) => {`.

**📍 Ubicación:**

```js
app.use(express.json());

// 👇 NUEVO
// 👆 FIN NUEVO
app.get("/", (req, res) => {
```

**Copia este código:**

```js
// =====================================================================
// CRUD de movimientos
// =====================================================================

app.get("/api/movimientos", async (req, res) => {
  res.json(await consultar("SELECT * FROM cap_movimientos"));
});

```

**✅ Comprueba:**
- Abre `http://localhost:3000/api/movimientos` → una lista con **40** movimientos o más. El primero es de Ana con `"cantidad":1500`.
- La terminal muestra `✔ Conectado a SQL Server 172.26.60.12:4433 / BG_APP`.
- Fíjate en la fecha: sale como `"fecha":"2026-08-15T09:10:00.000Z"` (poco amigable; lo arreglamos en el siguiente paso).

> Si tras ~15 segundos ves `{"error":"No se pudo conectar a SQL Server: ..."}`, ¡es el manejador de errores del Paso 35 trabajando! Revisa red/VPN y `.env`.

**💡 ¿Qué pasó?** La ruta ahora es `async` porque tiene que **esperar** (`await`) a que SQL Server responda. `SELECT *` significa "todas las columnas".

---

### Paso 37 — Elegir columnas y formatear la fecha (`COLUMNAS`)

**Qué vamos a hacer:** pedir columnas concretas y la fecha como texto `AAAA-MM-DD HH:MM:SS`, igual que en la Parte A.

**Dónde:** archivo `server.js`. Son **2 lugares**.

**a)** **Debajo** de `app.use(express.json());`

**📍 Ubicación:**

```js
app.use(express.json());
// 👇 NUEVO
// 👆 FIN NUEVO

// =====================================================================
```

**Copia este código:**

```js

// Columnas que devolvemos. La fecha se convierte a texto 'AAAA-MM-DD HH:MM:SS'
const COLUMNAS = `id, nombre, apellido, tipo, numero_cuenta, numero_cuenta_destino, cantidad, descripcion,
                  CONVERT(varchar(19), fecha, 120) AS fecha`;
```

**b)** Dentro de `GET /api/movimientos`, **reemplaza** esta línea:

```js
  res.json(await consultar("SELECT * FROM cap_movimientos"));
```

**Copia este código** (en su lugar; ojo, usa comillas invertidas `` ` ``):

```js
  res.json(await consultar(`SELECT ${COLUMNAS} FROM cap_movimientos`));
```

**✅ Comprueba:** recarga `http://localhost:3000/api/movimientos` → la fecha ahora sale `"fecha":"2026-08-15 09:10:00"`.

**💡 ¿Qué pasó?** `COLUMNAS` es un texto que reutilizaremos en varias consultas. `${COLUMNAS}` lo "pega" dentro del SQL. `CONVERT(..., 120)` es la forma de SQL Server de convertir una fecha a texto.

---

🏁 **Punto de control 8**

<details><summary>Ver archivo completo: <code>server.js</code></summary>

```js
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

// =====================================================================
// CRUD de movimientos
// =====================================================================

app.get("/api/movimientos", async (req, res) => {
  res.json(await consultar(`SELECT ${COLUMNAS} FROM cap_movimientos`));
});

app.get("/", (req, res) => {
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});

// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
app.use((error, req, res, next) => {
  console.error("✘", error.message);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`API:  http://localhost:${PORT}/api/movimientos`);
});
```

</details>

---

### Paso 38 — Preparar los filtros + filtro por `tipo`

**Qué vamos a hacer:** armar el SQL "por partes" para poder filtrar con la URL, empezando por `?tipo=`.

**Dónde:** archivo `server.js`. **Reemplaza** la ruta completa `GET /api/movimientos` (sus 3 líneas):

```js
app.get("/api/movimientos", async (req, res) => {
  res.json(await consultar(`SELECT ${COLUMNAS} FROM cap_movimientos`));
});
```

**Copia este código** (en su lugar):

```js
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
```

**✅ Comprueba:**
- `http://localhost:3000/api/movimientos` → ahora el **primero es el más reciente** (con los datos iniciales: id 40, Sofía, `"fecha":"2026-09-12 19:30:00"`; si alguien ya creó movimientos hoy, verás esos primero).
- `http://localhost:3000/api/movimientos?tipo=RETIRO` → **solo** retiros (11 con los datos iniciales).

**💡 ¿Qué pasó?** `req.query` trae lo que va después del `?` en la URL. `WHERE 1 = 1` siempre es verdadero: es un truco para poder ir agregando `AND ...` solo si llega cada filtro. `params` guarda los valores de los `@parámetros`.

---

### Paso 39 — Filtro por `cuenta`

**Qué vamos a hacer:** ver los movimientos de una cuenta (enviados **o** recibidos).

**Dónde:** archivo `server.js`, dentro de `GET /api/movimientos`, justo **encima** de `sql += " ORDER BY fecha DESC, id DESC";`.

**📍 Ubicación:**

```js
    params.tipo = tipo;
  }
  // 👇 NUEVO
  // 👆 FIN NUEVO
  sql += " ORDER BY fecha DESC, id DESC";
```

**Copia este código:**

```js
  if (cuenta) {
    sql += " AND (numero_cuenta = @cuenta OR numero_cuenta_destino = @cuenta)";
    params.cuenta = cuenta;
  }
```

**✅ Comprueba:** `http://localhost:3000/api/movimientos?cuenta=1001` → movimientos donde `numero_cuenta` **o** `numero_cuenta_destino` es `"1001"` (11 con los datos iniciales). Prueba combinar: `?tipo=RETIRO&cuenta=1001` → 3.

**💡 ¿Qué pasó?** `OR` incluye también las transferencias que la cuenta **recibió**. Los filtros se combinan porque cada uno agrega su propio `AND`.

---

### Paso 40 — Filtro por `nombre`

**Qué vamos a hacer:** buscar por parte del nombre o del apellido.

**Dónde:** archivo `server.js`, justo **encima** de `sql += " ORDER BY fecha DESC, id DESC";` (debajo del filtro de cuenta).

**📍 Ubicación:**

```js
    params.cuenta = cuenta;
  }
  // 👇 NUEVO
  // 👆 FIN NUEVO
  sql += " ORDER BY fecha DESC, id DESC";
```

**Copia este código:**

```js
  if (nombre) {
    sql += " AND (nombre LIKE @nombre OR apellido LIKE @nombre)";
    params.nombre = `%${nombre}%`;
  }
```

**✅ Comprueba:** `http://localhost:3000/api/movimientos?nombre=torres` → solo movimientos de **Ana Torres** (8 con los datos iniciales). Funciona aunque escribas en minúsculas.

**💡 ¿Qué pasó?** `LIKE` busca texto parecido. Los `%` significan "cualquier cosa antes o después", así `%torres%` encuentra "Torres".

---

### Paso 41 — Filtro por fechas (`desde` y `hasta`)

**Qué vamos a hacer:** filtrar por un rango de días.

**Dónde:** archivo `server.js`, justo **encima** de `sql += " ORDER BY fecha DESC, id DESC";` (debajo del filtro de nombre).

**📍 Ubicación:**

```js
    params.nombre = `%${nombre}%`;
  }
  // 👇 NUEVO
  // 👆 FIN NUEVO
  sql += " ORDER BY fecha DESC, id DESC";
```

**Copia este código:**

```js
  if (desde) {
    sql += " AND fecha >= @desde";
    params.desde = `${desde} 00:00:00`;
  }
  if (hasta) {
    sql += " AND fecha <= @hasta";
    params.hasta = `${hasta} 23:59:59`;
  }
```

**✅ Comprueba:** `http://localhost:3000/api/movimientos?desde=2026-09-01&hasta=2026-09-10` → solo movimientos entre el 1 y el 10 de septiembre de 2026 (15 con los datos iniciales). El primero tiene `"fecha":"2026-09-10 16:00:00"`.

**💡 ¿Qué pasó?** Agregamos la hora para incluir los días completos: `desde` empieza a las 00:00:00 y `hasta` termina a las 23:59:59.

---

### Paso 42 — `GET /api/movimientos/ultimos`

**Qué vamos a hacer:** devolver los últimos N movimientos (todos o de una cuenta).

**Dónde:** archivo `server.js`, justo **encima** de `app.get("/", (req, res) => {`.

**📍 Ubicación:**

```js
  res.json(await consultar(sql, params));
});

// 👇 NUEVO
// 👆 FIN NUEVO
app.get("/", (req, res) => {
```

**Copia este código:**

```js
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

```

**✅ Comprueba:**
- `http://localhost:3000/api/movimientos/ultimos` → exactamente **5** movimientos, del más nuevo al más viejo.
- `http://localhost:3000/api/movimientos/ultimos?limite=3&cuenta=1002` → **3** movimientos de la cuenta 1002.

**💡 ¿Qué pasó?** `TOP (@limite)` es la forma de SQL Server de decir "solo los primeros N". Si no envías `limite`, se usa 5.

---

🏁 **Punto de control 9**

<details><summary>Ver archivo completo: <code>server.js</code></summary>

```js
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

// =====================================================================
// CRUD de movimientos
// =====================================================================

app.get("/api/movimientos", async (req, res) => {
  const { tipo, cuenta, nombre, desde, hasta } = req.query;
  let sql = `SELECT ${COLUMNAS} FROM cap_movimientos WHERE 1 = 1`;
  const params = {};

  if (tipo) {
    sql += " AND tipo = @tipo";
    params.tipo = tipo;
  }
  if (cuenta) {
    sql += " AND (numero_cuenta = @cuenta OR numero_cuenta_destino = @cuenta)";
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

app.get("/", (req, res) => {
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});

// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
app.use((error, req, res, next) => {
  console.error("✘", error.message);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`API:  http://localhost:${PORT}/api/movimientos`);
});
```

</details>

---

### Paso 43 — `GET /api/movimientos/:id` con `obtenerMovimiento`

**Qué vamos a hacer:** buscar un movimiento por id con una función reutilizable.

**Dónde:** archivo `server.js`. Son **2 lugares**.

**a)** **Debajo** de la constante `COLUMNAS` (después de la línea que termina en `AS fecha`;`).

**📍 Ubicación:**

```js
                  CONVERT(varchar(19), fecha, 120) AS fecha`;
// 👇 NUEVO
// 👆 FIN NUEVO

// =====================================================================
// CRUD de movimientos
```

**Copia este código:**

```js

async function obtenerMovimiento(id) {
  const [fila] = await consultar(`SELECT ${COLUMNAS} FROM cap_movimientos WHERE id = @id`, { id: Number(id) || 0 });
  return fila;
}
```

**b)** Justo **encima** de `app.get("/", (req, res) => {` (debajo de la ruta `ultimos`).

**📍 Ubicación:**

```js
  res.json(await consultar(`SELECT TOP (@limite) ${COLUMNAS} FROM cap_movimientos ORDER BY fecha DESC, id DESC`, { limite }));
});

// 👇 NUEVO
// 👆 FIN NUEVO
app.get("/", (req, res) => {
```

**Copia este código:**

```js
app.get("/api/movimientos/:id", async (req, res) => {
  const movimiento = await obtenerMovimiento(req.params.id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

```

**✅ Comprueba:**
- `http://localhost:3000/api/movimientos/1` → Ana Torres, `"tipo":"DEPOSITO"`, `"cantidad":1500`, `"descripcion":"Sueldo"`.
- `http://localhost:3000/api/movimientos/999999` → `{"error":"Movimiento no encontrado"}` (404).
- `http://localhost:3000/api/movimientos/ultimos` **sigue** devolviendo 5 movimientos.

**💡 ¿Qué pasó?** `consultar` siempre devuelve una **lista**; `const [fila] = ...` toma el primer elemento. `ultimos` debe ir **antes** de `/:id`: si no, Express pensaría que "ultimos" es un id.

---

## Etapa 11 — Escribir en SQL Server

### Paso 44 — `POST /api/movimientos` con `insertarMovimiento`

**Qué vamos a hacer:** guardar un movimiento nuevo en la tabla.

**Dónde:** son **3 lugares** (2 en `server.js` y 1 en `pruebas.http`).

**a)** `server.js`: **debajo** de la función `obtenerMovimiento` y **encima** del título `CRUD de movimientos`.

**📍 Ubicación:**

```js
  return fila;
}
// 👇 NUEVO
// 👆 FIN NUEVO

// =====================================================================
// CRUD de movimientos
```

**Copia este código:**

```js

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
```

**b)** `server.js`: justo **encima** de `app.get("/", (req, res) => {` (debajo de la ruta `/:id`).

**Copia este código:**

```js
app.post("/api/movimientos", async (req, res) => {
  const { nombre, apellido, tipo, numero_cuenta, cantidad } = req.body;
  if (!nombre || !apellido || !tipo || !numero_cuenta || !cantidad) {
    return res.status(400).json({ error: "Faltan datos: nombre, apellido, tipo, numero_cuenta y cantidad son obligatorios" });
  }
  res.status(201).json(await insertarMovimiento(req.body));
});

```

**c)** `pruebas.http`: agrega la línea `# @name crear` **encima** de `POST {{api}}/movimientos`, y una petición nueva **debajo** del cuerpo `{ ... }` de ese POST (encima de `### Actualizar un movimiento`).

**📍 Ubicación:**

```http
### Crear un movimiento
# 👇 NUEVO (línea 1)
# 👆 FIN NUEVO
POST {{api}}/movimientos
...
  "descripcion": "Prueba desde REST Client"
}
# 👇 NUEVO (petición de error)
# 👆 FIN NUEVO

### Actualizar un movimiento
```

**Copia esta línea** (encima de `POST {{api}}/movimientos`):

```http
# @name crear
```

**Copia este código** (debajo de la llave `}` del POST):

```http

### Crear un movimiento con datos incompletos (400)
POST {{api}}/movimientos
Content-Type: application/json

{
  "nombre": "Ana"
}
```

Envía las dos peticiones `POST`.

**✅ Comprueba:**
- "Crear un movimiento" → `201 Created` con un **id nuevo** (41 o mayor), `"fecha"` de hoy y `"cantidad":100`.
- "Crear un movimiento con datos incompletos" → `400 Bad Request` con `{"error":"Faltan datos: ..."}`.

**💡 ¿Qué pasó?** `OUTPUT INSERTED.id` le pide a SQL Server el id que acaba de generar. `?? null` significa "si no viene, usa `null`". `# @name crear` le pone nombre a la respuesta para usar su id en los siguientes pasos.

---

### Paso 45 — `PUT /api/movimientos/:id` con SQL

**Qué vamos a hacer:** modificar un movimiento de la tabla (solo el que **tú** creaste).

**Dónde:** **a)** `server.js`, justo **encima** de `app.get("/", (req, res) => {`. **b)** `pruebas.http`.

**a) Copia este código:**

```js
app.put("/api/movimientos/:id", async (req, res) => {
  const actual = await obtenerMovimiento(req.params.id);
  if (!actual) return res.status(404).json({ error: "Movimiento no encontrado" });

  const m = { ...actual, ...req.body }; // lo que no se envía se mantiene igual
  await consultar(
    `UPDATE cap_movimientos
     SET nombre = @nombre, apellido = @apellido, tipo = @tipo, numero_cuenta = @numero_cuenta,
         numero_cuenta_destino = @numero_cuenta_destino, cantidad = @cantidad, descripcion = @descripcion
     WHERE id = @id`,
    {
      id: actual.id,
      nombre: m.nombre,
      apellido: m.apellido,
      tipo: m.tipo,
      numero_cuenta: m.numero_cuenta,
      numero_cuenta_destino: m.numero_cuenta_destino ?? null,
      cantidad: Number(m.cantidad),
      descripcion: m.descripcion ?? null,
    }
  );

  res.json(await obtenerMovimiento(actual.id));
});

```

**b)** En `pruebas.http` **reemplaza** la línea:

```http
PUT {{api}}/movimientos/1
```

**Copia este código** (en su lugar):

```http
PUT {{api}}/movimientos/{{crear.response.body.$.id}}
```

Envía el `PUT` (usará el id del movimiento que creaste en el paso 44).

> Si REST Client dice que no encuentra la variable `crear` (por ejemplo, porque cerraste VS Code), envía antes "Crear un movimiento" y luego el `PUT`.

**✅ Comprueba:** `200 OK` con el **mismo id** que devolvió "crear", `"cantidad":150` y `"descripcion":"Monto corregido"`; `"nombre":"Ana"` se mantiene.

**💡 ¿Qué pasó?** Primero buscamos el movimiento actual, lo mezclamos con lo que enviaste (`...`) y guardamos todo con `UPDATE ... WHERE id = @id`. **Nunca** olvides el `WHERE`: sin él se modificaría toda la tabla.

---

### Paso 46 — `DELETE /api/movimientos/:id` con SQL

**Qué vamos a hacer:** eliminar un movimiento de la tabla (solo el que **tú** creaste).

**Dónde:** **a)** `server.js`, justo **encima** de `app.get("/", (req, res) => {`. **b)** `pruebas.http`.

**a) Copia este código:**

```js
app.delete("/api/movimientos/:id", async (req, res) => {
  const [{ cambios }] = await consultar(
    "DELETE FROM cap_movimientos WHERE id = @id; SELECT @@ROWCOUNT AS cambios;",
    { id: Number(req.params.id) || 0 }
  );
  if (cambios === 0) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json({ mensaje: "Movimiento eliminado" });
});

```

**b)** En `pruebas.http` **reemplaza** la línea:

```http
DELETE {{api}}/movimientos/4
```

**Copia este código** (en su lugar):

```http
DELETE {{api}}/movimientos/{{crear.response.body.$.id}}
```

Envía el `DELETE` **dos veces**.

**✅ Comprueba:** la primera vez `200 OK` con `{"mensaje":"Movimiento eliminado"}`; la segunda, `404` con `{"error":"Movimiento no encontrado"}`.

**💡 ¿Qué pasó?** `@@ROWCOUNT` dice cuántas filas borró el `DELETE`. Si fue 0, el id no existía y respondemos 404.

---

🏁 **Punto de control 10** — CRUD completo con SQL Server.

<details><summary>Ver archivo completo: <code>server.js</code></summary>

```js
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

app.get("/api/movimientos", async (req, res) => {
  const { tipo, cuenta, nombre, desde, hasta } = req.query;
  let sql = `SELECT ${COLUMNAS} FROM cap_movimientos WHERE 1 = 1`;
  const params = {};

  if (tipo) {
    sql += " AND tipo = @tipo";
    params.tipo = tipo;
  }
  if (cuenta) {
    sql += " AND (numero_cuenta = @cuenta OR numero_cuenta_destino = @cuenta)";
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

app.get("/api/movimientos/:id", async (req, res) => {
  const movimiento = await obtenerMovimiento(req.params.id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

app.post("/api/movimientos", async (req, res) => {
  const { nombre, apellido, tipo, numero_cuenta, cantidad } = req.body;
  if (!nombre || !apellido || !tipo || !numero_cuenta || !cantidad) {
    return res.status(400).json({ error: "Faltan datos: nombre, apellido, tipo, numero_cuenta y cantidad son obligatorios" });
  }
  res.status(201).json(await insertarMovimiento(req.body));
});

app.put("/api/movimientos/:id", async (req, res) => {
  const actual = await obtenerMovimiento(req.params.id);
  if (!actual) return res.status(404).json({ error: "Movimiento no encontrado" });

  const m = { ...actual, ...req.body }; // lo que no se envía se mantiene igual
  await consultar(
    `UPDATE cap_movimientos
     SET nombre = @nombre, apellido = @apellido, tipo = @tipo, numero_cuenta = @numero_cuenta,
         numero_cuenta_destino = @numero_cuenta_destino, cantidad = @cantidad, descripcion = @descripcion
     WHERE id = @id`,
    {
      id: actual.id,
      nombre: m.nombre,
      apellido: m.apellido,
      tipo: m.tipo,
      numero_cuenta: m.numero_cuenta,
      numero_cuenta_destino: m.numero_cuenta_destino ?? null,
      cantidad: Number(m.cantidad),
      descripcion: m.descripcion ?? null,
    }
  );

  res.json(await obtenerMovimiento(actual.id));
});

app.delete("/api/movimientos/:id", async (req, res) => {
  const [{ cambios }] = await consultar(
    "DELETE FROM cap_movimientos WHERE id = @id; SELECT @@ROWCOUNT AS cambios;",
    { id: Number(req.params.id) || 0 }
  );
  if (cambios === 0) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json({ mensaje: "Movimiento eliminado" });
});

app.get("/", (req, res) => {
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});

// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
app.use((error, req, res, next) => {
  console.error("✘", error.message);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`API:  http://localhost:${PORT}/api/movimientos`);
});
```

</details>

<details><summary>Ver archivo completo: <code>pruebas.http</code></summary>

```http
@api = http://localhost:3000/api

### Listar todos los movimientos
GET {{api}}/movimientos

### Obtener un movimiento por id
GET {{api}}/movimientos/3

### Obtener un movimiento que no existe (404)
GET {{api}}/movimientos/99

### Crear un movimiento
# @name crear
POST {{api}}/movimientos
Content-Type: application/json

{
  "nombre": "Ana",
  "apellido": "Torres",
  "tipo": "DEPOSITO",
  "numero_cuenta": "1001",
  "cantidad": 100,
  "descripcion": "Prueba desde REST Client"
}

### Crear un movimiento con datos incompletos (400)
POST {{api}}/movimientos
Content-Type: application/json

{
  "nombre": "Ana"
}

### Actualizar un movimiento
PUT {{api}}/movimientos/{{crear.response.body.$.id}}
Content-Type: application/json

{
  "cantidad": 150,
  "descripcion": "Monto corregido"
}

### Eliminar un movimiento
DELETE {{api}}/movimientos/{{crear.response.body.$.id}}
```

</details>

---

## Etapa 12 — Saldo y titular

### Paso 47 — Funciones `obtenerSaldo` y `obtenerTitular`

**Qué vamos a hacer:** calcular el saldo de una cuenta y averiguar de quién es.

**Dónde:** archivo `server.js`, **debajo** de `COLUMNAS` y justo **encima** de `async function obtenerMovimiento(id) {`.

**📍 Ubicación:**

```js
                  CONVERT(varchar(19), fecha, 120) AS fecha`;

// 👇 NUEVO
// 👆 FIN NUEVO
async function obtenerMovimiento(id) {
```

**Copia este código:**

```js
// Calcula el saldo de una cuenta sumando y restando sus movimientos
async function obtenerSaldo(cuenta) {
  const [fila] = await consultar(
    `SELECT COALESCE(SUM(
       CASE
         WHEN tipo = 'DEPOSITO'      AND numero_cuenta = @cuenta         THEN  cantidad
         WHEN tipo = 'RETIRO'        AND numero_cuenta = @cuenta         THEN -cantidad
         WHEN tipo = 'TRANSFERENCIA' AND numero_cuenta = @cuenta         THEN -cantidad
         WHEN tipo = 'TRANSFERENCIA' AND numero_cuenta_destino = @cuenta THEN  cantidad
         ELSE 0
       END), 0) AS saldo
     FROM cap_movimientos`,
    { cuenta }
  );
  return fila.saldo;
}

// Busca el titular (nombre y apellido) de una cuenta
async function obtenerTitular(cuenta) {
  const [fila] = await consultar(
    "SELECT TOP 1 nombre, apellido FROM cap_movimientos WHERE numero_cuenta = @cuenta ORDER BY id",
    { cuenta }
  );
  return fila;
}

```

**✅ Comprueba:** al guardar, la terminal muestra `Restarting 'server.js'` y `API:  http://localhost:3000/api/movimientos` sin errores, y `http://localhost:3000/api/movimientos/1` sigue funcionando. (Las usaremos en la Etapa 13).

**💡 ¿Qué pasó?** No existe una columna "saldo": `CASE` suma los depósitos y transferencias recibidas y resta los retiros y transferencias enviadas. `COALESCE(..., 0)` devuelve 0 si la cuenta no tiene movimientos.

---

### Paso 48 — Función `completarTitular`

**Qué vamos a hacer:** que baste con enviar el número de cuenta; el nombre y apellido se completan solos.

**Dónde:** archivo `server.js`, **debajo** de la función `insertarMovimiento` y **encima** del título `CRUD de movimientos`.

**📍 Ubicación:**

```js
  return obtenerMovimiento(id);
}
// 👇 NUEVO
// 👆 FIN NUEVO

// =====================================================================
// CRUD de movimientos
```

**Copia este código:**

```js

// Completa nombre/apellido desde la cuenta si no vienen en el body
async function completarTitular(body) {
  if (body.nombre && body.apellido) return body;
  const titular = await obtenerTitular(body.numero_cuenta);
  return titular ? { ...body, ...titular } : body;
}
```

**✅ Comprueba:** la terminal se reinicia sin errores y `http://localhost:3000` sigue respondiendo `Banco API funcionando`.

**💡 ¿Qué pasó?** Si el body ya trae nombre y apellido, lo devolvemos igual. Si no, buscamos el titular de la cuenta y lo agregamos.

---

## Etapa 13 — Operaciones bancarias

### Paso 49 — `POST /api/depositos`

**Qué vamos a hacer:** depositar dinero y devolver el saldo nuevo.

**Dónde:** **a)** `server.js`, justo **encima** de `app.get("/", (req, res) => {` (debajo de la ruta `DELETE`). **b)** al final de `pruebas.http`.

**📍 Ubicación (a):**

```js
  res.json({ mensaje: "Movimiento eliminado" });
});

// 👇 NUEVO
// 👆 FIN NUEVO
app.get("/", (req, res) => {
```

**a) Copia este código:**

```js
// =====================================================================
// Operaciones bancarias
// =====================================================================

app.post("/api/depositos", async (req, res) => {
  const body = await completarTitular(req.body);
  if (!body.numero_cuenta || !(Number(body.cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta y una cantidad mayor a 0" });
  }
  if (!body.nombre || !body.apellido) {
    return res.status(400).json({ error: "La cuenta no existe: envía nombre y apellido para crearla" });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "DEPOSITO", numero_cuenta_destino: null });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(body.numero_cuenta) });
});

```

**b) Copia este código** al final de `pruebas.http`:

```http

### Depositar en una cuenta existente (nombre y apellido se completan solos)
POST {{api}}/depositos
Content-Type: application/json

{
  "numero_cuenta": "1001",
  "cantidad": 200,
  "descripcion": "Ahorro"
}

### Depositar con cantidad inválida (400)
POST {{api}}/depositos
Content-Type: application/json

{
  "numero_cuenta": "1001",
  "cantidad": 0
}
```

**✅ Comprueba:**
- Depósito → `201 Created` con `{"movimiento": {... "nombre":"Ana", "tipo":"DEPOSITO", "cantidad":200 ...}, "saldo": ...}`. Con los datos iniciales el saldo es **3035** (2835 + 200).
- Cantidad inválida → `400` con `{"error":"Envía numero_cuenta y una cantidad mayor a 0"}`.

**💡 ¿Qué pasó?** Validamos antes de guardar: errores del usuario → **400**. Forzamos `tipo: "DEPOSITO"` para que nadie pueda cambiarlo desde el body.

---

### Paso 50 — `POST /api/retiros`

**Qué vamos a hacer:** retirar dinero, sin permitir quedar en negativo.

**Dónde:** **a)** `server.js`, justo **encima** de `app.get("/", (req, res) => {` (debajo de depósitos). **b)** al final de `pruebas.http`.

**a) Copia este código:**

```js
app.post("/api/retiros", async (req, res) => {
  const body = await completarTitular(req.body);
  if (!body.numero_cuenta || !(Number(body.cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta y una cantidad mayor a 0" });
  }
  if (!body.nombre) return res.status(400).json({ error: "La cuenta no existe" });

  const saldo = await obtenerSaldo(body.numero_cuenta);
  if (saldo < Number(body.cantidad)) {
    return res.status(400).json({ error: `Saldo insuficiente. Saldo actual: ${saldo}` });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "RETIRO", numero_cuenta_destino: null });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(body.numero_cuenta) });
});

```

**b) Copia este código** al final de `pruebas.http`:

```http

### Retirar dinero
POST {{api}}/retiros
Content-Type: application/json

{
  "numero_cuenta": "1002",
  "cantidad": 50,
  "descripcion": "Cajero automático"
}

### Retirar más de lo que hay (400 - saldo insuficiente)
POST {{api}}/retiros
Content-Type: application/json

{
  "numero_cuenta": "1002",
  "cantidad": 999999
}
```

**✅ Comprueba:**
- Retiro de 50 → `201` con `"tipo":"RETIRO"`, `"nombre":"Luis"` y el `saldo` de la 1002 (con los datos iniciales: **2045**).
- Retiro de 999999 → `400` con `{"error":"Saldo insuficiente. Saldo actual: ..."}`.

**💡 ¿Qué pasó?** Antes de insertar calculamos el saldo con `obtenerSaldo`. Si no alcanza, respondemos 400 y **no** se guarda nada.

---

### Paso 51 — `POST /api/transferencias`

**Qué vamos a hacer:** mover dinero de una cuenta a otra con todas las validaciones.

**Dónde:** **a)** `server.js`, justo **encima** de `app.get("/", (req, res) => {` (debajo de retiros). **b)** al final de `pruebas.http`.

**a) Copia este código:**

```js
app.post("/api/transferencias", async (req, res) => {
  const body = await completarTitular(req.body);
  const { numero_cuenta, numero_cuenta_destino, cantidad } = body;
  if (!numero_cuenta || !numero_cuenta_destino || !(Number(cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta, numero_cuenta_destino y una cantidad mayor a 0" });
  }
  if (numero_cuenta === numero_cuenta_destino) {
    return res.status(400).json({ error: "La cuenta destino debe ser diferente a la de origen" });
  }
  if (!body.nombre) return res.status(400).json({ error: "La cuenta de origen no existe" });
  if (!(await obtenerTitular(numero_cuenta_destino))) return res.status(400).json({ error: "La cuenta destino no existe" });

  const saldo = await obtenerSaldo(numero_cuenta);
  if (saldo < Number(cantidad)) {
    return res.status(400).json({ error: `Saldo insuficiente. Saldo actual: ${saldo}` });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "TRANSFERENCIA" });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(numero_cuenta) });
});

```

**b) Copia este código** al final de `pruebas.http`:

```http

### Transferir entre cuentas
POST {{api}}/transferencias
Content-Type: application/json

{
  "numero_cuenta": "1001",
  "numero_cuenta_destino": "1002",
  "cantidad": 50,
  "descripcion": "Pago de almuerzo"
}

### Transferir a una cuenta que no existe (400)
POST {{api}}/transferencias
Content-Type: application/json

{
  "numero_cuenta": "1001",
  "numero_cuenta_destino": "9999",
  "cantidad": 10
}
```

**✅ Comprueba:**
- Transferencia → `201` con `"tipo":"TRANSFERENCIA"`, `"numero_cuenta_destino":"1002"` y el `saldo` de la cuenta **de origen** 1001 (con los datos iniciales y el depósito del paso 49: **2985**).
- Cuenta destino 9999 → `400` con `{"error":"La cuenta destino no existe"}`.

**💡 ¿Qué pasó?** Una transferencia es **una sola fila**: resta a `numero_cuenta` y suma a `numero_cuenta_destino` (lo hace el `CASE` de `obtenerSaldo`). Antes de guardar revisamos 4 cosas: datos completos, cuentas distintas, que ambas existan y saldo suficiente.

---

🏁 **Punto de control 11**

<details><summary>Ver archivo completo: <code>server.js</code></summary>

```js
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

// Calcula el saldo de una cuenta sumando y restando sus movimientos
async function obtenerSaldo(cuenta) {
  const [fila] = await consultar(
    `SELECT COALESCE(SUM(
       CASE
         WHEN tipo = 'DEPOSITO'      AND numero_cuenta = @cuenta         THEN  cantidad
         WHEN tipo = 'RETIRO'        AND numero_cuenta = @cuenta         THEN -cantidad
         WHEN tipo = 'TRANSFERENCIA' AND numero_cuenta = @cuenta         THEN -cantidad
         WHEN tipo = 'TRANSFERENCIA' AND numero_cuenta_destino = @cuenta THEN  cantidad
         ELSE 0
       END), 0) AS saldo
     FROM cap_movimientos`,
    { cuenta }
  );
  return fila.saldo;
}

// Busca el titular (nombre y apellido) de una cuenta
async function obtenerTitular(cuenta) {
  const [fila] = await consultar(
    "SELECT TOP 1 nombre, apellido FROM cap_movimientos WHERE numero_cuenta = @cuenta ORDER BY id",
    { cuenta }
  );
  return fila;
}

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

// Completa nombre/apellido desde la cuenta si no vienen en el body
async function completarTitular(body) {
  if (body.nombre && body.apellido) return body;
  const titular = await obtenerTitular(body.numero_cuenta);
  return titular ? { ...body, ...titular } : body;
}

// =====================================================================
// CRUD de movimientos
// =====================================================================

app.get("/api/movimientos", async (req, res) => {
  const { tipo, cuenta, nombre, desde, hasta } = req.query;
  let sql = `SELECT ${COLUMNAS} FROM cap_movimientos WHERE 1 = 1`;
  const params = {};

  if (tipo) {
    sql += " AND tipo = @tipo";
    params.tipo = tipo;
  }
  if (cuenta) {
    sql += " AND (numero_cuenta = @cuenta OR numero_cuenta_destino = @cuenta)";
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

app.get("/api/movimientos/:id", async (req, res) => {
  const movimiento = await obtenerMovimiento(req.params.id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

app.post("/api/movimientos", async (req, res) => {
  const { nombre, apellido, tipo, numero_cuenta, cantidad } = req.body;
  if (!nombre || !apellido || !tipo || !numero_cuenta || !cantidad) {
    return res.status(400).json({ error: "Faltan datos: nombre, apellido, tipo, numero_cuenta y cantidad son obligatorios" });
  }
  res.status(201).json(await insertarMovimiento(req.body));
});

app.put("/api/movimientos/:id", async (req, res) => {
  const actual = await obtenerMovimiento(req.params.id);
  if (!actual) return res.status(404).json({ error: "Movimiento no encontrado" });

  const m = { ...actual, ...req.body }; // lo que no se envía se mantiene igual
  await consultar(
    `UPDATE cap_movimientos
     SET nombre = @nombre, apellido = @apellido, tipo = @tipo, numero_cuenta = @numero_cuenta,
         numero_cuenta_destino = @numero_cuenta_destino, cantidad = @cantidad, descripcion = @descripcion
     WHERE id = @id`,
    {
      id: actual.id,
      nombre: m.nombre,
      apellido: m.apellido,
      tipo: m.tipo,
      numero_cuenta: m.numero_cuenta,
      numero_cuenta_destino: m.numero_cuenta_destino ?? null,
      cantidad: Number(m.cantidad),
      descripcion: m.descripcion ?? null,
    }
  );

  res.json(await obtenerMovimiento(actual.id));
});

app.delete("/api/movimientos/:id", async (req, res) => {
  const [{ cambios }] = await consultar(
    "DELETE FROM cap_movimientos WHERE id = @id; SELECT @@ROWCOUNT AS cambios;",
    { id: Number(req.params.id) || 0 }
  );
  if (cambios === 0) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json({ mensaje: "Movimiento eliminado" });
});

// =====================================================================
// Operaciones bancarias
// =====================================================================

app.post("/api/depositos", async (req, res) => {
  const body = await completarTitular(req.body);
  if (!body.numero_cuenta || !(Number(body.cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta y una cantidad mayor a 0" });
  }
  if (!body.nombre || !body.apellido) {
    return res.status(400).json({ error: "La cuenta no existe: envía nombre y apellido para crearla" });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "DEPOSITO", numero_cuenta_destino: null });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(body.numero_cuenta) });
});

app.post("/api/retiros", async (req, res) => {
  const body = await completarTitular(req.body);
  if (!body.numero_cuenta || !(Number(body.cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta y una cantidad mayor a 0" });
  }
  if (!body.nombre) return res.status(400).json({ error: "La cuenta no existe" });

  const saldo = await obtenerSaldo(body.numero_cuenta);
  if (saldo < Number(body.cantidad)) {
    return res.status(400).json({ error: `Saldo insuficiente. Saldo actual: ${saldo}` });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "RETIRO", numero_cuenta_destino: null });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(body.numero_cuenta) });
});

app.post("/api/transferencias", async (req, res) => {
  const body = await completarTitular(req.body);
  const { numero_cuenta, numero_cuenta_destino, cantidad } = body;
  if (!numero_cuenta || !numero_cuenta_destino || !(Number(cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta, numero_cuenta_destino y una cantidad mayor a 0" });
  }
  if (numero_cuenta === numero_cuenta_destino) {
    return res.status(400).json({ error: "La cuenta destino debe ser diferente a la de origen" });
  }
  if (!body.nombre) return res.status(400).json({ error: "La cuenta de origen no existe" });
  if (!(await obtenerTitular(numero_cuenta_destino))) return res.status(400).json({ error: "La cuenta destino no existe" });

  const saldo = await obtenerSaldo(numero_cuenta);
  if (saldo < Number(cantidad)) {
    return res.status(400).json({ error: `Saldo insuficiente. Saldo actual: ${saldo}` });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "TRANSFERENCIA" });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(numero_cuenta) });
});

app.get("/", (req, res) => {
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});

// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
app.use((error, req, res, next) => {
  console.error("✘", error.message);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`API:  http://localhost:${PORT}/api/movimientos`);
});
```

</details>

<details><summary>Ver archivo completo: <code>pruebas.http</code></summary>

```http
@api = http://localhost:3000/api

### Listar todos los movimientos
GET {{api}}/movimientos

### Obtener un movimiento por id
GET {{api}}/movimientos/3

### Obtener un movimiento que no existe (404)
GET {{api}}/movimientos/99

### Crear un movimiento
# @name crear
POST {{api}}/movimientos
Content-Type: application/json

{
  "nombre": "Ana",
  "apellido": "Torres",
  "tipo": "DEPOSITO",
  "numero_cuenta": "1001",
  "cantidad": 100,
  "descripcion": "Prueba desde REST Client"
}

### Crear un movimiento con datos incompletos (400)
POST {{api}}/movimientos
Content-Type: application/json

{
  "nombre": "Ana"
}

### Actualizar un movimiento
PUT {{api}}/movimientos/{{crear.response.body.$.id}}
Content-Type: application/json

{
  "cantidad": 150,
  "descripcion": "Monto corregido"
}

### Eliminar un movimiento
DELETE {{api}}/movimientos/{{crear.response.body.$.id}}

### Depositar en una cuenta existente (nombre y apellido se completan solos)
POST {{api}}/depositos
Content-Type: application/json

{
  "numero_cuenta": "1001",
  "cantidad": 200,
  "descripcion": "Ahorro"
}

### Depositar con cantidad inválida (400)
POST {{api}}/depositos
Content-Type: application/json

{
  "numero_cuenta": "1001",
  "cantidad": 0
}

### Retirar dinero
POST {{api}}/retiros
Content-Type: application/json

{
  "numero_cuenta": "1002",
  "cantidad": 50,
  "descripcion": "Cajero automático"
}

### Retirar más de lo que hay (400 - saldo insuficiente)
POST {{api}}/retiros
Content-Type: application/json

{
  "numero_cuenta": "1002",
  "cantidad": 999999
}

### Transferir entre cuentas
POST {{api}}/transferencias
Content-Type: application/json

{
  "numero_cuenta": "1001",
  "numero_cuenta_destino": "1002",
  "cantidad": 50,
  "descripcion": "Pago de almuerzo"
}

### Transferir a una cuenta que no existe (400)
POST {{api}}/transferencias
Content-Type: application/json

{
  "numero_cuenta": "1001",
  "numero_cuenta_destino": "9999",
  "cantidad": 10
}
```

</details>

---

## Etapa 14 — Cuentas y resumen

### Paso 52 — `GET /api/cuentas` y `GET /api/cuentas/:numero`

**Qué vamos a hacer:** listar las cuentas con su titular y saldo, y ver una sola cuenta.

**Dónde:** `server.js`, justo **encima** de `app.get("/", (req, res) => {` (debajo de transferencias).

**📍 Ubicación:**

```js
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(numero_cuenta) });
});

// 👇 NUEVO
// 👆 FIN NUEVO
app.get("/", (req, res) => {
```

**Copia este código:**

```js
// =====================================================================
// Cuentas y resumen (para el dashboard)
// =====================================================================

app.get("/api/cuentas", async (req, res) => {
  // El titular de cada cuenta es el del primer movimiento (id más pequeño) de esa cuenta
  const cuentas = await consultar(
    `SELECT numero_cuenta, nombre, apellido
     FROM cap_movimientos
     WHERE id IN (SELECT MIN(id) FROM cap_movimientos GROUP BY numero_cuenta)
     ORDER BY numero_cuenta`
  );
  for (const cuenta of cuentas) {
    cuenta.saldo = await obtenerSaldo(cuenta.numero_cuenta);
  }
  res.json(cuentas);
});

app.get("/api/cuentas/:numero", async (req, res) => {
  const titular = await obtenerTitular(req.params.numero);
  if (!titular) return res.status(404).json({ error: "Cuenta no encontrada" });
  res.json({ numero_cuenta: req.params.numero, ...titular, saldo: await obtenerSaldo(req.params.numero) });
});

```

**✅ Comprueba:**
- `http://localhost:3000/api/cuentas` → al menos **5** cuentas (`1001` a `1005`), cada una con `numero_cuenta`, `nombre`, `apellido` y `saldo`.
- `http://localhost:3000/api/cuentas/1001` → `{"numero_cuenta":"1001","nombre":"Ana","apellido":"Torres","saldo":...}`.
- `http://localhost:3000/api/cuentas/9999` → `{"error":"Cuenta no encontrada"}` (404).

**💡 ¿Qué pasó?** La subconsulta `SELECT MIN(id) ... GROUP BY numero_cuenta` busca el primer movimiento de cada cuenta (ahí está su titular). Luego, con `for`, calculamos el saldo de cada una.

---

### Paso 53 — `GET /api/resumen` y `GET /api/resumen/por-dia`

**Qué vamos a hacer:** totales para las tarjetas y el gráfico del dashboard del miércoles.

**Dónde:** `server.js`, justo **encima** de `app.get("/", (req, res) => {` (debajo de `/api/cuentas/:numero`).

**📍 Ubicación:**

```js
  res.json({ numero_cuenta: req.params.numero, ...titular, saldo: await obtenerSaldo(req.params.numero) });
});

// 👇 NUEVO
// 👆 FIN NUEVO
app.get("/", (req, res) => {
```

**Copia este código:**

```js
app.get("/api/resumen", async (req, res) => {
  const porTipo = await consultar(
    "SELECT tipo, COUNT(*) AS cantidad_movimientos, SUM(cantidad) AS total FROM cap_movimientos GROUP BY tipo"
  );
  const buscar = (tipo) => porTipo.find((t) => t.tipo === tipo) || { cantidad_movimientos: 0, total: 0 };
  const [cuentas] = await consultar("SELECT COUNT(DISTINCT numero_cuenta) AS total FROM cap_movimientos");

  res.json({
    total_movimientos: porTipo.reduce((suma, t) => suma + t.cantidad_movimientos, 0),
    total_cuentas: cuentas.total,
    total_depositos: buscar("DEPOSITO").total,
    total_retiros: buscar("RETIRO").total,
    total_transferencias: buscar("TRANSFERENCIA").total,
    por_tipo: porTipo,
  });
});

app.get("/api/resumen/por-dia", async (req, res) => {
  const filas = await consultar(
    `SELECT CONVERT(varchar(10), fecha, 23) AS dia,
            SUM(CASE WHEN tipo = 'DEPOSITO'      THEN cantidad ELSE 0 END) AS depositos,
            SUM(CASE WHEN tipo = 'RETIRO'        THEN cantidad ELSE 0 END) AS retiros,
            SUM(CASE WHEN tipo = 'TRANSFERENCIA' THEN cantidad ELSE 0 END) AS transferencias
     FROM cap_movimientos
     GROUP BY CONVERT(varchar(10), fecha, 23)
     ORDER BY dia`
  );
  res.json(filas);
});

```

**✅ Comprueba:**
- `http://localhost:3000/api/resumen` → un objeto con `total_movimientos`, `total_cuentas`, `total_depositos`, `total_retiros`, `total_transferencias` y `por_tipo`. (Con los 40 datos iniciales: 40, 5, 16220, 1650 y 1785).
- `http://localhost:3000/api/resumen/por-dia` → una lista ordenada por día: el primero es `{"dia":"2026-08-15","depositos":5600,"retiros":0,"transferencias":0}`.

**💡 ¿Qué pasó?** `GROUP BY` junta filas iguales y `SUM`/`COUNT` calculan por grupo. `reduce` suma en JavaScript los conteos de cada tipo.

---

## Etapa 15 — Swagger en `server.js`

### Paso 54 — Configurar Swagger en `server.js`

**Qué vamos a hacer:** cargar Swagger y describir la API final.

**Dónde:** archivo `server.js`. Son **2 lugares**.

**a)** **Debajo** de `const cors = require("cors");`

**📍 Ubicación:**

```js
const cors = require("cors");
// 👇 NUEVO
// 👆 FIN NUEVO
const { consultar } = require("./db");
```

**Copia este código:**

```js
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
```

**b)** **Debajo** de la función `completarTitular` y **encima** del título `CRUD de movimientos`.

**📍 Ubicación:**

```js
  return titular ? { ...body, ...titular } : body;
}
// 👇 NUEVO
// 👆 FIN NUEVO

// =====================================================================
// CRUD de movimientos
```

**Copia este código:**

```js

// ---------------------------------------------------------------------
// Swagger
// ---------------------------------------------------------------------
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Banco API", version: "2.0.0", description: "API de movimientos de dinero (SQL Server)" },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [__filename],
});
```

**✅ Comprueba:** la terminal se reinicia sin errores y `http://localhost:3000/api/cuentas` sigue respondiendo.

**💡 ¿Qué pasó?** Es la misma configuración de la Parte A, con otro título y versión **2.0.0**.

---

### Paso 55 — Publicar `/docs` en `server.js`

**Qué vamos a hacer:** mostrar la página de documentación de la API final.

**Dónde:** archivo `server.js`. Son **2 lugares**.

**a)** **Debajo** de la ruta `GET /` y **encima** de `// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON`.

**📍 Ubicación:**

```js
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});

// 👇 NUEVO
// 👆 FIN NUEVO

// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
```

**Copia este código:**

```js
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**b)** Dentro de `app.listen`, **debajo** de `console.log(`API:  http://localhost:${PORT}/api/movimientos`);`

**📍 Ubicación:**

```js
  console.log(`API:  http://localhost:${PORT}/api/movimientos`);
  // 👇 NUEVO
  // 👆 FIN NUEVO
});
```

**Copia este código:**

```js
  console.log(`Docs: http://localhost:${PORT}/docs`);
```

**✅ Comprueba:**
- La terminal muestra `API:  http://localhost:3000/api/movimientos` y `Docs: http://localhost:3000/docs`.
- `http://localhost:3000/docs` → página **Banco API** `2.0.0` con **"No operations defined in spec!"** (aún sin descripciones).

**💡 ¿Qué pasó?** `/docs` va antes del manejador de errores, igual que todas las rutas.

---

🏁 **Punto de control 12**

<details><summary>Ver archivo completo: <code>server.js</code></summary>

```js
// =====================================================================
// PASO 2: API conectada a SQL Server
// 1) Copiar .env.example a .env y poner la contraseña
// 2) npm run db:init   (crea la tabla cap_movimientos con datos de ejemplo)
// 3) npm run dev       ->  http://localhost:3000/docs
// =====================================================================
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { consultar } = require("./db");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Columnas que devolvemos. La fecha se convierte a texto 'AAAA-MM-DD HH:MM:SS'
const COLUMNAS = `id, nombre, apellido, tipo, numero_cuenta, numero_cuenta_destino, cantidad, descripcion,
                  CONVERT(varchar(19), fecha, 120) AS fecha`;

// Calcula el saldo de una cuenta sumando y restando sus movimientos
async function obtenerSaldo(cuenta) {
  const [fila] = await consultar(
    `SELECT COALESCE(SUM(
       CASE
         WHEN tipo = 'DEPOSITO'      AND numero_cuenta = @cuenta         THEN  cantidad
         WHEN tipo = 'RETIRO'        AND numero_cuenta = @cuenta         THEN -cantidad
         WHEN tipo = 'TRANSFERENCIA' AND numero_cuenta = @cuenta         THEN -cantidad
         WHEN tipo = 'TRANSFERENCIA' AND numero_cuenta_destino = @cuenta THEN  cantidad
         ELSE 0
       END), 0) AS saldo
     FROM cap_movimientos`,
    { cuenta }
  );
  return fila.saldo;
}

// Busca el titular (nombre y apellido) de una cuenta
async function obtenerTitular(cuenta) {
  const [fila] = await consultar(
    "SELECT TOP 1 nombre, apellido FROM cap_movimientos WHERE numero_cuenta = @cuenta ORDER BY id",
    { cuenta }
  );
  return fila;
}

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

// Completa nombre/apellido desde la cuenta si no vienen en el body
async function completarTitular(body) {
  if (body.nombre && body.apellido) return body;
  const titular = await obtenerTitular(body.numero_cuenta);
  return titular ? { ...body, ...titular } : body;
}

// ---------------------------------------------------------------------
// Swagger
// ---------------------------------------------------------------------
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Banco API", version: "2.0.0", description: "API de movimientos de dinero (SQL Server)" },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [__filename],
});

// =====================================================================
// CRUD de movimientos
// =====================================================================

app.get("/api/movimientos", async (req, res) => {
  const { tipo, cuenta, nombre, desde, hasta } = req.query;
  let sql = `SELECT ${COLUMNAS} FROM cap_movimientos WHERE 1 = 1`;
  const params = {};

  if (tipo) {
    sql += " AND tipo = @tipo";
    params.tipo = tipo;
  }
  if (cuenta) {
    sql += " AND (numero_cuenta = @cuenta OR numero_cuenta_destino = @cuenta)";
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

app.get("/api/movimientos/:id", async (req, res) => {
  const movimiento = await obtenerMovimiento(req.params.id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

app.post("/api/movimientos", async (req, res) => {
  const { nombre, apellido, tipo, numero_cuenta, cantidad } = req.body;
  if (!nombre || !apellido || !tipo || !numero_cuenta || !cantidad) {
    return res.status(400).json({ error: "Faltan datos: nombre, apellido, tipo, numero_cuenta y cantidad son obligatorios" });
  }
  res.status(201).json(await insertarMovimiento(req.body));
});

app.put("/api/movimientos/:id", async (req, res) => {
  const actual = await obtenerMovimiento(req.params.id);
  if (!actual) return res.status(404).json({ error: "Movimiento no encontrado" });

  const m = { ...actual, ...req.body }; // lo que no se envía se mantiene igual
  await consultar(
    `UPDATE cap_movimientos
     SET nombre = @nombre, apellido = @apellido, tipo = @tipo, numero_cuenta = @numero_cuenta,
         numero_cuenta_destino = @numero_cuenta_destino, cantidad = @cantidad, descripcion = @descripcion
     WHERE id = @id`,
    {
      id: actual.id,
      nombre: m.nombre,
      apellido: m.apellido,
      tipo: m.tipo,
      numero_cuenta: m.numero_cuenta,
      numero_cuenta_destino: m.numero_cuenta_destino ?? null,
      cantidad: Number(m.cantidad),
      descripcion: m.descripcion ?? null,
    }
  );

  res.json(await obtenerMovimiento(actual.id));
});

app.delete("/api/movimientos/:id", async (req, res) => {
  const [{ cambios }] = await consultar(
    "DELETE FROM cap_movimientos WHERE id = @id; SELECT @@ROWCOUNT AS cambios;",
    { id: Number(req.params.id) || 0 }
  );
  if (cambios === 0) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json({ mensaje: "Movimiento eliminado" });
});

// =====================================================================
// Operaciones bancarias
// =====================================================================

app.post("/api/depositos", async (req, res) => {
  const body = await completarTitular(req.body);
  if (!body.numero_cuenta || !(Number(body.cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta y una cantidad mayor a 0" });
  }
  if (!body.nombre || !body.apellido) {
    return res.status(400).json({ error: "La cuenta no existe: envía nombre y apellido para crearla" });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "DEPOSITO", numero_cuenta_destino: null });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(body.numero_cuenta) });
});

app.post("/api/retiros", async (req, res) => {
  const body = await completarTitular(req.body);
  if (!body.numero_cuenta || !(Number(body.cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta y una cantidad mayor a 0" });
  }
  if (!body.nombre) return res.status(400).json({ error: "La cuenta no existe" });

  const saldo = await obtenerSaldo(body.numero_cuenta);
  if (saldo < Number(body.cantidad)) {
    return res.status(400).json({ error: `Saldo insuficiente. Saldo actual: ${saldo}` });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "RETIRO", numero_cuenta_destino: null });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(body.numero_cuenta) });
});

app.post("/api/transferencias", async (req, res) => {
  const body = await completarTitular(req.body);
  const { numero_cuenta, numero_cuenta_destino, cantidad } = body;
  if (!numero_cuenta || !numero_cuenta_destino || !(Number(cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta, numero_cuenta_destino y una cantidad mayor a 0" });
  }
  if (numero_cuenta === numero_cuenta_destino) {
    return res.status(400).json({ error: "La cuenta destino debe ser diferente a la de origen" });
  }
  if (!body.nombre) return res.status(400).json({ error: "La cuenta de origen no existe" });
  if (!(await obtenerTitular(numero_cuenta_destino))) return res.status(400).json({ error: "La cuenta destino no existe" });

  const saldo = await obtenerSaldo(numero_cuenta);
  if (saldo < Number(cantidad)) {
    return res.status(400).json({ error: `Saldo insuficiente. Saldo actual: ${saldo}` });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "TRANSFERENCIA" });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(numero_cuenta) });
});

// =====================================================================
// Cuentas y resumen (para el dashboard)
// =====================================================================

app.get("/api/cuentas", async (req, res) => {
  // El titular de cada cuenta es el del primer movimiento (id más pequeño) de esa cuenta
  const cuentas = await consultar(
    `SELECT numero_cuenta, nombre, apellido
     FROM cap_movimientos
     WHERE id IN (SELECT MIN(id) FROM cap_movimientos GROUP BY numero_cuenta)
     ORDER BY numero_cuenta`
  );
  for (const cuenta of cuentas) {
    cuenta.saldo = await obtenerSaldo(cuenta.numero_cuenta);
  }
  res.json(cuentas);
});

app.get("/api/cuentas/:numero", async (req, res) => {
  const titular = await obtenerTitular(req.params.numero);
  if (!titular) return res.status(404).json({ error: "Cuenta no encontrada" });
  res.json({ numero_cuenta: req.params.numero, ...titular, saldo: await obtenerSaldo(req.params.numero) });
});

app.get("/api/resumen", async (req, res) => {
  const porTipo = await consultar(
    "SELECT tipo, COUNT(*) AS cantidad_movimientos, SUM(cantidad) AS total FROM cap_movimientos GROUP BY tipo"
  );
  const buscar = (tipo) => porTipo.find((t) => t.tipo === tipo) || { cantidad_movimientos: 0, total: 0 };
  const [cuentas] = await consultar("SELECT COUNT(DISTINCT numero_cuenta) AS total FROM cap_movimientos");

  res.json({
    total_movimientos: porTipo.reduce((suma, t) => suma + t.cantidad_movimientos, 0),
    total_cuentas: cuentas.total,
    total_depositos: buscar("DEPOSITO").total,
    total_retiros: buscar("RETIRO").total,
    total_transferencias: buscar("TRANSFERENCIA").total,
    por_tipo: porTipo,
  });
});

app.get("/api/resumen/por-dia", async (req, res) => {
  const filas = await consultar(
    `SELECT CONVERT(varchar(10), fecha, 23) AS dia,
            SUM(CASE WHEN tipo = 'DEPOSITO'      THEN cantidad ELSE 0 END) AS depositos,
            SUM(CASE WHEN tipo = 'RETIRO'        THEN cantidad ELSE 0 END) AS retiros,
            SUM(CASE WHEN tipo = 'TRANSFERENCIA' THEN cantidad ELSE 0 END) AS transferencias
     FROM cap_movimientos
     GROUP BY CONVERT(varchar(10), fecha, 23)
     ORDER BY dia`
  );
  res.json(filas);
});

app.get("/", (req, res) => {
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
app.use((error, req, res, next) => {
  console.error("✘", error.message);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`API:  http://localhost:${PORT}/api/movimientos`);
  console.log(`Docs: http://localhost:${PORT}/docs`);
});
```

</details>

---

### Paso 56 — Esquemas: Movimiento, Deposito y Transferencia

**Qué vamos a hacer:** describir las 3 formas de datos que recibe la API.

**Dónde:** archivo `server.js`, **debajo** del bloque `const swaggerSpec = swaggerJsdoc({ ... });` y **encima** del título `CRUD de movimientos`.

**📍 Ubicación:**

```js
  apis: [__filename],
});
// 👇 NUEVO
// 👆 FIN NUEVO

// =====================================================================
// CRUD de movimientos
```

**Copia este código:**

```js

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
 *     Deposito:
 *       type: object
 *       required: [numero_cuenta, cantidad]
 *       properties:
 *         nombre: { type: string, example: "Ana", description: "Opcional si la cuenta ya existe" }
 *         apellido: { type: string, example: "Torres", description: "Opcional si la cuenta ya existe" }
 *         numero_cuenta: { type: string, example: "1001" }
 *         cantidad: { type: number, example: 100 }
 *         descripcion: { type: string, example: "Ahorro" }
 *     Transferencia:
 *       type: object
 *       required: [numero_cuenta, numero_cuenta_destino, cantidad]
 *       properties:
 *         numero_cuenta: { type: string, example: "1001" }
 *         numero_cuenta_destino: { type: string, example: "1002" }
 *         cantidad: { type: number, example: 50 }
 *         descripcion: { type: string, example: "Pago de almuerzo" }
 */
```

**✅ Comprueba:** recarga `/docs` → sección **Schemas** con **Deposito**, **Movimiento** y **Transferencia**.

**💡 ¿Qué pasó?** `Deposito` sirve también para retiros (mismos campos). `required` marca los campos obligatorios.

---

### Paso 57 — Documentar `GET /api/movimientos` (con filtros)

**Qué vamos a hacer:** describir la ruta de listado y sus 5 filtros.

**Dónde:** archivo `server.js`, justo **encima** de `app.get("/api/movimientos", async (req, res) => {`.

**📍 Ubicación:**

```js
// CRUD de movimientos
// =====================================================================

// 👇 NUEVO
// 👆 FIN NUEVO
app.get("/api/movimientos", async (req, res) => {
```

**Copia este código:**

```js
/**
 * @swagger
 * /api/movimientos:
 *   get:
 *     summary: Listar movimientos (con filtros opcionales)
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: query, name: tipo, schema: { type: string, enum: [DEPOSITO, RETIRO, TRANSFERENCIA] } }
 *       - { in: query, name: cuenta, description: "Cuenta origen o destino", schema: { type: string } }
 *       - { in: query, name: nombre, description: "Busca en nombre o apellido", schema: { type: string } }
 *       - { in: query, name: desde, description: "AAAA-MM-DD", schema: { type: string } }
 *       - { in: query, name: hasta, description: "AAAA-MM-DD", schema: { type: string } }
 *     responses:
 *       200: { description: Lista de movimientos (más recientes primero) }
 */
```

**✅ Comprueba:** en `/docs` aparece el grupo **Movimientos** con `GET /api/movimientos`. **Try it out** → elige `tipo` = `RETIRO` → **Execute** → `Code 200` y solo retiros.

**💡 ¿Qué pasó?** `in: query` indica que el parámetro va después del `?` en la URL. Swagger arma la URL por ti: mírala en el cuadro **Request URL**.

---

### Paso 58 — Documentar el resto del CRUD

**Qué vamos a hacer:** describir `ultimos`, GET por id, POST, PUT y DELETE.

**Dónde:** archivo `server.js`. Cada comentario va **justo encima** de su ruta.

**a)** **Encima** de `app.get("/api/movimientos/ultimos", async (req, res) => {`

```js
/**
 * @swagger
 * /api/movimientos/ultimos:
 *   get:
 *     summary: Últimos movimientos
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: query, name: limite, schema: { type: integer, default: 5 } }
 *       - { in: query, name: cuenta, schema: { type: string } }
 *     responses:
 *       200: { description: Últimos movimientos }
 */
```

**b)** **Encima** de `app.get("/api/movimientos/:id", async (req, res) => {`

```js
/**
 * @swagger
 * /api/movimientos/{id}:
 *   get:
 *     summary: Obtener un movimiento por id
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: El movimiento }
 *       404: { description: No existe }
 */
```

**c)** **Encima** de `app.post("/api/movimientos", async (req, res) => {`

```js
/**
 * @swagger
 * /api/movimientos:
 *   post:
 *     summary: Crear un movimiento (genérico, sin validar saldo)
 *     tags: [Movimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Movimiento' }
 *     responses:
 *       201: { description: Movimiento creado }
 *       400: { description: Faltan datos }
 */
```

**d)** **Encima** de `app.put("/api/movimientos/:id", async (req, res) => {`

```js
/**
 * @swagger
 * /api/movimientos/{id}:
 *   put:
 *     summary: Actualizar un movimiento
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Movimiento' }
 *     responses:
 *       200: { description: Movimiento actualizado }
 *       404: { description: No existe }
 */
```

**e)** **Encima** de `app.delete("/api/movimientos/:id", async (req, res) => {`

```js
/**
 * @swagger
 * /api/movimientos/{id}:
 *   delete:
 *     summary: Eliminar un movimiento
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No existe }
 */
```

**✅ Comprueba:** el grupo **Movimientos** de `/docs` tiene **6** rutas: `GET /api/movimientos`, `POST /api/movimientos`, `GET /api/movimientos/ultimos`, `GET /api/movimientos/{id}`, `PUT /api/movimientos/{id}` y `DELETE /api/movimientos/{id}`.

**💡 ¿Qué pasó?** Son los mismos comentarios de la Parte A, más `ultimos` y la respuesta `400` del POST.

---

### Paso 59 — Documentar operaciones, cuentas y resumen

**Qué vamos a hacer:** describir las 7 rutas restantes.

**Dónde:** archivo `server.js`. Cada comentario va **justo encima** de su ruta.

**a)** **Encima** de `app.post("/api/depositos", async (req, res) => {`

```js
/**
 * @swagger
 * /api/depositos:
 *   post:
 *     summary: Depositar dinero en una cuenta (si la cuenta no existe, envía nombre y apellido)
 *     tags: [Operaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Deposito' }
 *     responses:
 *       201: { description: Depósito realizado }
 *       400: { description: Datos inválidos }
 */
```

**b)** **Encima** de `app.post("/api/retiros", async (req, res) => {`

```js
/**
 * @swagger
 * /api/retiros:
 *   post:
 *     summary: Retirar dinero de una cuenta
 *     tags: [Operaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Deposito' }
 *     responses:
 *       201: { description: Retiro realizado }
 *       400: { description: Datos inválidos o saldo insuficiente }
 */
```

**c)** **Encima** de `app.post("/api/transferencias", async (req, res) => {`

```js
/**
 * @swagger
 * /api/transferencias:
 *   post:
 *     summary: Transferir dinero entre cuentas
 *     tags: [Operaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Transferencia' }
 *     responses:
 *       201: { description: Transferencia realizada }
 *       400: { description: Datos inválidos o saldo insuficiente }
 */
```

**d)** **Encima** de `app.get("/api/cuentas", async (req, res) => {`

```js
/**
 * @swagger
 * /api/cuentas:
 *   get:
 *     summary: Listar cuentas con su titular y saldo
 *     tags: [Cuentas]
 *     responses:
 *       200: { description: Lista de cuentas }
 */
```

**e)** **Encima** de `app.get("/api/cuentas/:numero", async (req, res) => {`

```js
/**
 * @swagger
 * /api/cuentas/{numero}:
 *   get:
 *     summary: Ver una cuenta y su saldo
 *     tags: [Cuentas]
 *     parameters:
 *       - { in: path, name: numero, required: true, schema: { type: string }, example: "1001" }
 *     responses:
 *       200: { description: Cuenta con saldo }
 *       404: { description: No existe }
 */
```

**f)** **Encima** de `app.get("/api/resumen", async (req, res) => {`

```js
/**
 * @swagger
 * /api/resumen:
 *   get:
 *     summary: Totales generales (para tarjetas del dashboard)
 *     tags: [Resumen]
 *     responses:
 *       200: { description: Totales por tipo }
 */
```

**g)** **Encima** de `app.get("/api/resumen/por-dia", async (req, res) => {`

```js
/**
 * @swagger
 * /api/resumen/por-dia:
 *   get:
 *     summary: Totales por día y tipo (para gráficos)
 *     tags: [Resumen]
 *     responses:
 *       200: { description: "Lista [{ dia, depositos, retiros, transferencias }]" }
 */
```

**✅ Comprueba:** `/docs` muestra **4 grupos**: **Movimientos** (6 rutas), **Operaciones** (3), **Cuentas** (2) y **Resumen** (2). En **Cuentas** → `GET /api/cuentas/{numero}` → **Try it out** (ya trae `1001`) → **Execute** → `Code 200` con el saldo de Ana.

**💡 ¿Qué pasó?** `tags` agrupa las rutas en la página. En la ruta `por-dia` la descripción va entre comillas porque tiene corchetes `[ ]`, que en YAML tienen un significado especial.

---

🏁 **Punto de control 13** — ¡`server.js` está terminado!

<details><summary>Ver archivo completo: <code>server.js</code></summary>

```js
// =====================================================================
// PASO 2: API conectada a SQL Server
// 1) Copiar .env.example a .env y poner la contraseña
// 2) npm run db:init   (crea la tabla cap_movimientos con datos de ejemplo)
// 3) npm run dev       ->  http://localhost:3000/docs
// =====================================================================
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { consultar } = require("./db");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Columnas que devolvemos. La fecha se convierte a texto 'AAAA-MM-DD HH:MM:SS'
const COLUMNAS = `id, nombre, apellido, tipo, numero_cuenta, numero_cuenta_destino, cantidad, descripcion,
                  CONVERT(varchar(19), fecha, 120) AS fecha`;

// Calcula el saldo de una cuenta sumando y restando sus movimientos
async function obtenerSaldo(cuenta) {
  const [fila] = await consultar(
    `SELECT COALESCE(SUM(
       CASE
         WHEN tipo = 'DEPOSITO'      AND numero_cuenta = @cuenta         THEN  cantidad
         WHEN tipo = 'RETIRO'        AND numero_cuenta = @cuenta         THEN -cantidad
         WHEN tipo = 'TRANSFERENCIA' AND numero_cuenta = @cuenta         THEN -cantidad
         WHEN tipo = 'TRANSFERENCIA' AND numero_cuenta_destino = @cuenta THEN  cantidad
         ELSE 0
       END), 0) AS saldo
     FROM cap_movimientos`,
    { cuenta }
  );
  return fila.saldo;
}

// Busca el titular (nombre y apellido) de una cuenta
async function obtenerTitular(cuenta) {
  const [fila] = await consultar(
    "SELECT TOP 1 nombre, apellido FROM cap_movimientos WHERE numero_cuenta = @cuenta ORDER BY id",
    { cuenta }
  );
  return fila;
}

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

// Completa nombre/apellido desde la cuenta si no vienen en el body
async function completarTitular(body) {
  if (body.nombre && body.apellido) return body;
  const titular = await obtenerTitular(body.numero_cuenta);
  return titular ? { ...body, ...titular } : body;
}

// ---------------------------------------------------------------------
// Swagger
// ---------------------------------------------------------------------
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Banco API", version: "2.0.0", description: "API de movimientos de dinero (SQL Server)" },
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
 *     Deposito:
 *       type: object
 *       required: [numero_cuenta, cantidad]
 *       properties:
 *         nombre: { type: string, example: "Ana", description: "Opcional si la cuenta ya existe" }
 *         apellido: { type: string, example: "Torres", description: "Opcional si la cuenta ya existe" }
 *         numero_cuenta: { type: string, example: "1001" }
 *         cantidad: { type: number, example: 100 }
 *         descripcion: { type: string, example: "Ahorro" }
 *     Transferencia:
 *       type: object
 *       required: [numero_cuenta, numero_cuenta_destino, cantidad]
 *       properties:
 *         numero_cuenta: { type: string, example: "1001" }
 *         numero_cuenta_destino: { type: string, example: "1002" }
 *         cantidad: { type: number, example: 50 }
 *         descripcion: { type: string, example: "Pago de almuerzo" }
 */

// =====================================================================
// CRUD de movimientos
// =====================================================================

/**
 * @swagger
 * /api/movimientos:
 *   get:
 *     summary: Listar movimientos (con filtros opcionales)
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: query, name: tipo, schema: { type: string, enum: [DEPOSITO, RETIRO, TRANSFERENCIA] } }
 *       - { in: query, name: cuenta, description: "Cuenta origen o destino", schema: { type: string } }
 *       - { in: query, name: nombre, description: "Busca en nombre o apellido", schema: { type: string } }
 *       - { in: query, name: desde, description: "AAAA-MM-DD", schema: { type: string } }
 *       - { in: query, name: hasta, description: "AAAA-MM-DD", schema: { type: string } }
 *     responses:
 *       200: { description: Lista de movimientos (más recientes primero) }
 */
app.get("/api/movimientos", async (req, res) => {
  const { tipo, cuenta, nombre, desde, hasta } = req.query;
  let sql = `SELECT ${COLUMNAS} FROM cap_movimientos WHERE 1 = 1`;
  const params = {};

  if (tipo) {
    sql += " AND tipo = @tipo";
    params.tipo = tipo;
  }
  if (cuenta) {
    sql += " AND (numero_cuenta = @cuenta OR numero_cuenta_destino = @cuenta)";
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

/**
 * @swagger
 * /api/movimientos/ultimos:
 *   get:
 *     summary: Últimos movimientos
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: query, name: limite, schema: { type: integer, default: 5 } }
 *       - { in: query, name: cuenta, schema: { type: string } }
 *     responses:
 *       200: { description: Últimos movimientos }
 */
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

/**
 * @swagger
 * /api/movimientos/{id}:
 *   get:
 *     summary: Obtener un movimiento por id
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: El movimiento }
 *       404: { description: No existe }
 */
app.get("/api/movimientos/:id", async (req, res) => {
  const movimiento = await obtenerMovimiento(req.params.id);
  if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json(movimiento);
});

/**
 * @swagger
 * /api/movimientos:
 *   post:
 *     summary: Crear un movimiento (genérico, sin validar saldo)
 *     tags: [Movimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Movimiento' }
 *     responses:
 *       201: { description: Movimiento creado }
 *       400: { description: Faltan datos }
 */
app.post("/api/movimientos", async (req, res) => {
  const { nombre, apellido, tipo, numero_cuenta, cantidad } = req.body;
  if (!nombre || !apellido || !tipo || !numero_cuenta || !cantidad) {
    return res.status(400).json({ error: "Faltan datos: nombre, apellido, tipo, numero_cuenta y cantidad son obligatorios" });
  }
  res.status(201).json(await insertarMovimiento(req.body));
});

/**
 * @swagger
 * /api/movimientos/{id}:
 *   put:
 *     summary: Actualizar un movimiento
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Movimiento' }
 *     responses:
 *       200: { description: Movimiento actualizado }
 *       404: { description: No existe }
 */
app.put("/api/movimientos/:id", async (req, res) => {
  const actual = await obtenerMovimiento(req.params.id);
  if (!actual) return res.status(404).json({ error: "Movimiento no encontrado" });

  const m = { ...actual, ...req.body }; // lo que no se envía se mantiene igual
  await consultar(
    `UPDATE cap_movimientos
     SET nombre = @nombre, apellido = @apellido, tipo = @tipo, numero_cuenta = @numero_cuenta,
         numero_cuenta_destino = @numero_cuenta_destino, cantidad = @cantidad, descripcion = @descripcion
     WHERE id = @id`,
    {
      id: actual.id,
      nombre: m.nombre,
      apellido: m.apellido,
      tipo: m.tipo,
      numero_cuenta: m.numero_cuenta,
      numero_cuenta_destino: m.numero_cuenta_destino ?? null,
      cantidad: Number(m.cantidad),
      descripcion: m.descripcion ?? null,
    }
  );

  res.json(await obtenerMovimiento(actual.id));
});

/**
 * @swagger
 * /api/movimientos/{id}:
 *   delete:
 *     summary: Eliminar un movimiento
 *     tags: [Movimientos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No existe }
 */
app.delete("/api/movimientos/:id", async (req, res) => {
  const [{ cambios }] = await consultar(
    "DELETE FROM cap_movimientos WHERE id = @id; SELECT @@ROWCOUNT AS cambios;",
    { id: Number(req.params.id) || 0 }
  );
  if (cambios === 0) return res.status(404).json({ error: "Movimiento no encontrado" });
  res.json({ mensaje: "Movimiento eliminado" });
});

// =====================================================================
// Operaciones bancarias
// =====================================================================

/**
 * @swagger
 * /api/depositos:
 *   post:
 *     summary: Depositar dinero en una cuenta (si la cuenta no existe, envía nombre y apellido)
 *     tags: [Operaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Deposito' }
 *     responses:
 *       201: { description: Depósito realizado }
 *       400: { description: Datos inválidos }
 */
app.post("/api/depositos", async (req, res) => {
  const body = await completarTitular(req.body);
  if (!body.numero_cuenta || !(Number(body.cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta y una cantidad mayor a 0" });
  }
  if (!body.nombre || !body.apellido) {
    return res.status(400).json({ error: "La cuenta no existe: envía nombre y apellido para crearla" });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "DEPOSITO", numero_cuenta_destino: null });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(body.numero_cuenta) });
});

/**
 * @swagger
 * /api/retiros:
 *   post:
 *     summary: Retirar dinero de una cuenta
 *     tags: [Operaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Deposito' }
 *     responses:
 *       201: { description: Retiro realizado }
 *       400: { description: Datos inválidos o saldo insuficiente }
 */
app.post("/api/retiros", async (req, res) => {
  const body = await completarTitular(req.body);
  if (!body.numero_cuenta || !(Number(body.cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta y una cantidad mayor a 0" });
  }
  if (!body.nombre) return res.status(400).json({ error: "La cuenta no existe" });

  const saldo = await obtenerSaldo(body.numero_cuenta);
  if (saldo < Number(body.cantidad)) {
    return res.status(400).json({ error: `Saldo insuficiente. Saldo actual: ${saldo}` });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "RETIRO", numero_cuenta_destino: null });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(body.numero_cuenta) });
});

/**
 * @swagger
 * /api/transferencias:
 *   post:
 *     summary: Transferir dinero entre cuentas
 *     tags: [Operaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Transferencia' }
 *     responses:
 *       201: { description: Transferencia realizada }
 *       400: { description: Datos inválidos o saldo insuficiente }
 */
app.post("/api/transferencias", async (req, res) => {
  const body = await completarTitular(req.body);
  const { numero_cuenta, numero_cuenta_destino, cantidad } = body;
  if (!numero_cuenta || !numero_cuenta_destino || !(Number(cantidad) > 0)) {
    return res.status(400).json({ error: "Envía numero_cuenta, numero_cuenta_destino y una cantidad mayor a 0" });
  }
  if (numero_cuenta === numero_cuenta_destino) {
    return res.status(400).json({ error: "La cuenta destino debe ser diferente a la de origen" });
  }
  if (!body.nombre) return res.status(400).json({ error: "La cuenta de origen no existe" });
  if (!(await obtenerTitular(numero_cuenta_destino))) return res.status(400).json({ error: "La cuenta destino no existe" });

  const saldo = await obtenerSaldo(numero_cuenta);
  if (saldo < Number(cantidad)) {
    return res.status(400).json({ error: `Saldo insuficiente. Saldo actual: ${saldo}` });
  }
  const movimiento = await insertarMovimiento({ ...body, tipo: "TRANSFERENCIA" });
  res.status(201).json({ movimiento, saldo: await obtenerSaldo(numero_cuenta) });
});

// =====================================================================
// Cuentas y resumen (para el dashboard)
// =====================================================================

/**
 * @swagger
 * /api/cuentas:
 *   get:
 *     summary: Listar cuentas con su titular y saldo
 *     tags: [Cuentas]
 *     responses:
 *       200: { description: Lista de cuentas }
 */
app.get("/api/cuentas", async (req, res) => {
  // El titular de cada cuenta es el del primer movimiento (id más pequeño) de esa cuenta
  const cuentas = await consultar(
    `SELECT numero_cuenta, nombre, apellido
     FROM cap_movimientos
     WHERE id IN (SELECT MIN(id) FROM cap_movimientos GROUP BY numero_cuenta)
     ORDER BY numero_cuenta`
  );
  for (const cuenta of cuentas) {
    cuenta.saldo = await obtenerSaldo(cuenta.numero_cuenta);
  }
  res.json(cuentas);
});

/**
 * @swagger
 * /api/cuentas/{numero}:
 *   get:
 *     summary: Ver una cuenta y su saldo
 *     tags: [Cuentas]
 *     parameters:
 *       - { in: path, name: numero, required: true, schema: { type: string }, example: "1001" }
 *     responses:
 *       200: { description: Cuenta con saldo }
 *       404: { description: No existe }
 */
app.get("/api/cuentas/:numero", async (req, res) => {
  const titular = await obtenerTitular(req.params.numero);
  if (!titular) return res.status(404).json({ error: "Cuenta no encontrada" });
  res.json({ numero_cuenta: req.params.numero, ...titular, saldo: await obtenerSaldo(req.params.numero) });
});

/**
 * @swagger
 * /api/resumen:
 *   get:
 *     summary: Totales generales (para tarjetas del dashboard)
 *     tags: [Resumen]
 *     responses:
 *       200: { description: Totales por tipo }
 */
app.get("/api/resumen", async (req, res) => {
  const porTipo = await consultar(
    "SELECT tipo, COUNT(*) AS cantidad_movimientos, SUM(cantidad) AS total FROM cap_movimientos GROUP BY tipo"
  );
  const buscar = (tipo) => porTipo.find((t) => t.tipo === tipo) || { cantidad_movimientos: 0, total: 0 };
  const [cuentas] = await consultar("SELECT COUNT(DISTINCT numero_cuenta) AS total FROM cap_movimientos");

  res.json({
    total_movimientos: porTipo.reduce((suma, t) => suma + t.cantidad_movimientos, 0),
    total_cuentas: cuentas.total,
    total_depositos: buscar("DEPOSITO").total,
    total_retiros: buscar("RETIRO").total,
    total_transferencias: buscar("TRANSFERENCIA").total,
    por_tipo: porTipo,
  });
});

/**
 * @swagger
 * /api/resumen/por-dia:
 *   get:
 *     summary: Totales por día y tipo (para gráficos)
 *     tags: [Resumen]
 *     responses:
 *       200: { description: "Lista [{ dia, depositos, retiros, transferencias }]" }
 */
app.get("/api/resumen/por-dia", async (req, res) => {
  const filas = await consultar(
    `SELECT CONVERT(varchar(10), fecha, 23) AS dia,
            SUM(CASE WHEN tipo = 'DEPOSITO'      THEN cantidad ELSE 0 END) AS depositos,
            SUM(CASE WHEN tipo = 'RETIRO'        THEN cantidad ELSE 0 END) AS retiros,
            SUM(CASE WHEN tipo = 'TRANSFERENCIA' THEN cantidad ELSE 0 END) AS transferencias
     FROM cap_movimientos
     GROUP BY CONVERT(varchar(10), fecha, 23)
     ORDER BY dia`
  );
  res.json(filas);
});

app.get("/", (req, res) => {
  res.json({ mensaje: "Banco API funcionando", docs: `http://localhost:${PORT}/docs` });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Si algo falla (ej. no hay conexión a la base), respondemos el error en JSON
app.use((error, req, res, next) => {
  console.error("✘", error.message);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`API:  http://localhost:${PORT}/api/movimientos`);
  console.log(`Docs: http://localhost:${PORT}/docs`);
});
```

</details>

---

## Etapa 16 — Cierre

### Paso 60 — Prueba toda la API

**Qué vamos a hacer:** revisar que todo funciona y repasar lo que construimos.

**Dónde:** terminal, navegador y `pruebas.http`.

1. Si la API no está encendida: `npm run dev`.
2. Abre `http://localhost:3000/docs` y prueba al menos una ruta de cada grupo con **Try it out**.
3. En `pruebas.http`, envía de arriba abajo: listar, crear, actualizar (usa el id creado), eliminar, depósito, retiro y transferencia.

**Estos son todos los endpoints de nuestra API:**

| Método | Ruta | Para qué |
|---|---|---|
| GET | `/` | Saber si la API está viva |
| GET | `/api/movimientos` | Listar (filtros: `tipo`, `cuenta`, `nombre`, `desde`, `hasta`) |
| GET | `/api/movimientos/ultimos` | Últimos N movimientos (`limite`, `cuenta`) |
| GET | `/api/movimientos/:id` | Un movimiento |
| POST | `/api/movimientos` | Crear un movimiento genérico |
| PUT | `/api/movimientos/:id` | Modificar un movimiento |
| DELETE | `/api/movimientos/:id` | Eliminar un movimiento |
| POST | `/api/depositos` | Depositar |
| POST | `/api/retiros` | Retirar (valida saldo) |
| POST | `/api/transferencias` | Transferir (valida cuentas y saldo) |
| GET | `/api/cuentas` | Cuentas con titular y saldo |
| GET | `/api/cuentas/:numero` | Una cuenta con su saldo |
| GET | `/api/resumen` | Totales generales |
| GET | `/api/resumen/por-dia` | Totales por día |
| GET | `/docs` | Documentación Swagger |

**✅ Comprueba (checklist de salida):**
- [ ] `npm run dev` muestra `API:  http://localhost:3000/api/movimientos` y `Docs: http://localhost:3000/docs`.
- [ ] `http://localhost:3000/api/cuentas` devuelve cuentas con saldo (sin error 500).
- [ ] `/docs` muestra los grupos **Movimientos, Operaciones, Cuentas y Resumen**.
- [ ] Tu carpeta `banco-api` tiene: `db/`, `node_modules/`, `.env`, `.gitignore`, `db.js`, `package.json`, `package-lock.json`, `pruebas.http`, `server-json.js` y `server.js`.
- [ ] Tu `.env` **no** lo compartiste con nadie.

**💡 ¿Qué pasó?** Construiste una API completa: primero con datos en memoria y luego conectada a una base de datos real y compartida. Mañana, React usará estos mismos endpoints con `fetch` para mostrar los datos en pantalla. **Para el martes: llega con la API funcionando (`npm run dev`).**
