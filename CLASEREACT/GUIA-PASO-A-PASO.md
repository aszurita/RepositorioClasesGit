# Día 2 — Guía práctica paso a paso: React desde cero

> **Cómo usar esta guía:** haz UN paso a la vez. Copia el código, guarda (`Ctrl+S`) y comprueba el ✅ antes de seguir.
> Si te pierdes, usa el 🏁 **Punto de control** más cercano: ahí está el archivo completo.

**Convenciones**

- `// 👇 NUEVO` (en JavaScript) o `{/* 👇 NUEVO */}` (dentro del JSX) marca **la línea que acabas de agregar**. El comentario es solo una guía visual: **no hace falta copiarlo** (si lo copias, bórralo después).
- Las líneas que aparecen **sin** marca alrededor de lo nuevo son **contexto**: ya existen en tu archivo, sirven para que sepas dónde pegar.
- Tendrás **dos terminales** de PowerShell abiertas todo el día: **Terminal 1** = backend (puerto 3000) y **Terminal 2** = React (puerto 5173).
- Para ver la **consola del navegador**: `F12` → pestaña **Console**.

**Resultado final del día:**

```
+---------------------------------------------------------------+
|  Banco App                                                    |
|  Movimientos de dinero de nuestros clientes                   |
|                                                               |
|  [ Depósitos ]      [ Retiros ]       [ Transferencias ]      |
|  $16,220.00         $1,650.00         $1,785.00               |
|                                                               |
|  Tipo de movimiento: [ Todos      v ]                         |
|  +---------------------------------------------------------+  |
|  | Fecha | Cliente | Tipo | Cuenta | Destino | Desc | $     |  |
|  +---------------------------------------------------------+  |
+---------------------------------------------------------------+
```

---

## Mapa del día

| Etapa | Pasos | Qué lograremos |
|---|---|---|
| **1 — Preparar el proyecto** | 1 – 8 | API encendida, proyecto Vite creado y limpio, "Banco App" en pantalla |
| **2 — JSX: HTML dentro de JavaScript** | 9 – 10 | Usar llaves `{ }` y entender "un solo padre" |
| **3 — Estado con `useState`** | 11 – 17 | Un contador que cambia al hacer clic (y entender por qué) |
| **4 — Componentes con props** | 18 – 25 | `Encabezado` y tres `TarjetaResumen` con formato de dinero y color |
| **5 — Traer datos de la API** | 26 – 33 | `api.js`, `useEffect`, `fetch`, mensajes "Cargando..." y de error |
| **6 — Tabla de movimientos** | 34 – 41 | `TablaMovimientos` con `.map`, `key` y formato |
| **7 — Filtro por tipo** | 42 – 46 | `select` controlado, estado en `App` y filtrado |
| **8 — Resumen real, estilos y cierre** | 47 – 51 | Tarjetas con totales reales, CSS, `lint` y `build` |

---

## Etapa 1 — Preparar el proyecto

### Paso 1 — Enciende la API del lunes

**Qué vamos a hacer:** dejar el backend corriendo; nuestra app React le pedirá los datos.

**Dónde:** Terminal 1 (PowerShell), en la carpeta del curso (la que contiene `backend`).

**Copia este código:**

```powershell
cd backend
npm run dev
```

**✅ Comprueba:**
- La terminal muestra `API:  http://localhost:3000/api/movimientos`.
- Abre <http://localhost:3000/api/movimientos> en el navegador: ves un arreglo JSON `[ { "id": ..., "nombre": ..., "tipo": "DEPOSITO", ... } ]`.
- Abre <http://localhost:3000/api/resumen>: ves `{ "total_movimientos": ..., "total_depositos": ..., ... }`.

**💡 ¿Qué pasó?** La API está lista en el puerto 3000. **No cierres esta terminal** en todo el día. (Si falla, revisa tu archivo `backend/.env`.)

---

### Paso 2 — Crea el proyecto con Vite

**Qué vamos a hacer:** generar un proyecto de React vacío llamado `banco-app`.

**Dónde:** abre una **Terminal 2** nueva y ubícate en la carpeta del curso (la misma que contiene `backend`, **no** dentro de `backend`).

**Copia este código:**

```powershell
npm create vite@latest banco-app -- --template react --no-interactive
```

Si npm pregunta `Need to install the following packages: create-vite@... Ok to proceed? (y)`, escribe `y` y presiona `Enter`.

**✅ Comprueba:** la terminal termina con:

```
Done. Now run:

  cd banco-app
  npm install
  npm run dev
```

**💡 ¿Qué pasó?** Vite creó la carpeta `banco-app` con una plantilla de React en **JavaScript**. `--no-interactive` evita que haga preguntas.

---

### Paso 3 — Instala y arranca la app

**Qué vamos a hacer:** descargar las librerías y levantar el servidor de desarrollo.

**Dónde:** Terminal 2.

**Copia este código:**

```powershell
cd banco-app
npm install
npm run dev
```

**✅ Comprueba:**
- La terminal muestra `Local:   http://localhost:5173/`.
- Abre <http://localhost:5173>: ves la página de ejemplo con el título **Get started** y un botón **Count is 0**. Haz clic: el número sube.

**💡 ¿Qué pasó?** `npm install` descargó React y Vite en `node_modules`. `npm run dev` sirve la app y **la recarga sola** cada vez que guardas un archivo. Deja esta terminal abierta.

---

### Paso 4 — Conoce las carpetas

**Qué vamos a hacer:** abrir el proyecto en VS Code y ubicar los archivos importantes.

**Dónde:** VS Code → `Archivo` → `Abrir carpeta...` → elige `banco-app`.

**Mira estos archivos (no cambies nada todavía):**

| Archivo | ¿Para qué sirve? |
|---|---|
| `index.html` | La **única** página HTML. Tiene `<div id="root"></div>`: ahí vivirá toda la app |
| `src/main.jsx` | Punto de entrada: busca `#root` y dibuja `<App />` dentro |
| `src/App.jsx` | El componente principal (lo que ves en pantalla) |
| `src/index.css` | Estilos de toda la página |
| `package.json` | Dependencias (`react`, `vite`) y scripts (`dev`, `build`, `lint`) |
| `node_modules/` | Librerías descargadas. **Nunca** se edita a mano |

**✅ Comprueba:** abre `index.html` y encuentra la línea `<div id="root"></div>`. Abre `src/main.jsx` y encuentra `document.getElementById('root')`.

**💡 ¿Qué pasó?** Entendiste el recorrido: `index.html` → `main.jsx` → `App.jsx`.

---

### Paso 5 — Borra los archivos de ejemplo

**Qué vamos a hacer:** quitar lo que trae la plantilla y no usaremos.

**Dónde:** explorador de archivos de VS Code (clic derecho → **Eliminar**).

1. Borra la carpeta `src/assets` (completa).
2. Borra el archivo `src/App.css`.
3. Borra el archivo `public/icons.svg` (deja `public/favicon.svg`).
4. Abre `src/index.css`, selecciona todo (`Ctrl+A`), bórralo (`Supr`) y guarda (`Ctrl+S`). El archivo queda **vacío**.

> Alternativa por terminal: abre una **tercera** terminal dentro de `banco-app` y ejecuta
> `Remove-Item -Recurse -Force src\assets, src\App.css, public\icons.svg`
> (el vaciado de `index.css` hazlo igual en VS Code).

**✅ Comprueba:** el navegador muestra una **pantalla de error** (fondo oscuro) que dice algo como `Failed to resolve import "./assets/hero.png" from "src/App.jsx"`. **Es lo esperado.**

**💡 ¿Qué pasó?** `App.jsx` todavía importa las imágenes y el CSS que borraste. Lo arreglamos en el siguiente paso.

---

### Paso 6 — Escribe tu primer `App.jsx`

**Qué vamos a hacer:** reemplazar el componente de ejemplo por uno nuestro.

**Dónde:** archivo `src/App.jsx`. **Borra todo** su contenido y pega:

**Copia este código:**

```jsx
function App() {
  return <h1>Banco App</h1>;
}

export default App;
```

**✅ Comprueba:** desaparece el error y se ve solo el título **Banco App** (letra negra, fondo blanco).

**💡 ¿Qué pasó?** Un **componente** es una función con nombre en **Mayúscula** que **devuelve JSX** (HTML dentro de JavaScript). `export default` permite usarlo desde otro archivo.

---

### Paso 7 — Ordena `main.jsx`

**Qué vamos a hacer:** dejar el punto de entrada con el mismo estilo que usaremos todo el curso (comillas dobles y punto y coma).

**Dónde:** archivo `src/main.jsx`. **Borra todo** su contenido y pega:

**Copia este código:**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**✅ Comprueba:** la pantalla sigue igual: **Banco App**.

**💡 ¿Qué pasó?** `createRoot(...)` toma el `<div id="root">` y dibuja `<App />` dentro. `<StrictMode>` es un modo de ayuda en desarrollo (por él algunos `console.log` salen dos veces; es normal).

---

### Paso 8 — Cambia idioma y título en `index.html`

**Qué vamos a hacer:** que la pestaña del navegador diga "Banco App".

**Dónde:** archivo `index.html` (en la raíz de `banco-app`, **no** en `src`).

**Copia este código:** cambia estas dos líneas:

```html
<html lang="es">
```

```html
    <title>Banco App</title>
```

(Antes decían `lang="en"` y `<title>banco-app</title>`.)

**✅ Comprueba:** la **pestaña** del navegador dice **Banco App**.

**💡 ¿Qué pasó?** `index.html` es HTML normal; React solo se encarga de lo que va dentro de `#root`.

---

🏁 **Punto de control 1** — proyecto limpio

Estructura: `src/` contiene solo `App.jsx`, `index.css` (vacío) y `main.jsx`; `public/` contiene solo `favicon.svg`.

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
function App() {
  return <h1>Banco App</h1>;
}

export default App;
```

</details>

<details><summary>Ver archivo completo: src/main.jsx</summary>

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</details>

<details><summary>Ver archivo completo: index.html</summary>

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Banco App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

</details>

---

## Etapa 2 — JSX: HTML dentro de JavaScript

### Paso 9 — Usa llaves `{ }` para mostrar datos

**Qué vamos a hacer:** mostrar variables de JavaScript dentro del HTML.

**Dónde:** archivo `src/App.jsx`. Reemplaza la función `App` completa (deja el `export default App;` del final) por:

**Copia este código:**

```jsx
function App() {
  const nombre = "Ana"; // 👇 NUEVO
  const saldo = 1500; // 👇 NUEVO

  return (
    <div>
      <h1>Banco App</h1>
      {/* 👇 NUEVO */}
      <p>Hola, {nombre}. Tu saldo es {saldo} dólares; el doble sería {saldo * 2}.</p>
    </div>
  );
}
```

**✅ Comprueba:** debajo del título se lee: **Hola, Ana. Tu saldo es 1500 dólares; el doble sería 3000.**
Cambia `"Ana"` por tu nombre y guarda: el texto cambia solo.

**💡 ¿Qué pasó?** Las llaves `{ }` son una "ventana a JavaScript": dentro puedes poner variables y operaciones. Como ahora hay varias líneas, el `return` va entre paréntesis `( )`.

---

### Paso 10 — Rompe a propósito: "un solo padre"

**Qué vamos a hacer:** ver qué pasa si el `return` devuelve dos elementos sueltos, y arreglarlo.

**Dónde:** archivo `src/App.jsx`.

1. **Borra** la línea `<div>` y la línea `</div>` y guarda. El `return` queda así:

```jsx
  return (
      <h1>Banco App</h1>
      <p>Hola, {nombre}. Tu saldo es {saldo} dólares; el doble sería {saldo * 2}.</p>
  );
```

2. **✅ Comprueba el error:** el navegador muestra la pantalla de error de Vite, con el mensaje *[PARSE_ERROR] Adjacent JSX elements must be wrapped in an enclosing tag.*, señalando la línea del `<p>`, y la pista *Help: Did you want a JSX fragment `<>...</>`?*

3. **Arréglalo** con un **fragmento** `<>` ... `</>` (un padre "invisible"):

**Copia este código:**

```jsx
  return (
    <>
      <h1>Banco App</h1>
      <p>Hola, {nombre}. Tu saldo es {saldo} dólares; el doble sería {saldo * 2}.</p>
    </>
  );
```

**✅ Comprueba:** el error desaparece y vuelve a verse el título y el saludo.

**💡 ¿Qué pasó?** Una función devuelve **un solo valor**, así que el JSX necesita **un solo padre**. El fragmento `<> </>` agrupa sin agregar un `<div>` extra al HTML.

---

## Etapa 3 — Estado con `useState`

### Paso 11 — Crea el componente `Contador` (sin lógica)

**Qué vamos a hacer:** crear nuestro primer componente en su propio archivo.

**Dónde:** crea la carpeta `src/components` y dentro el archivo `src/components/Contador.jsx`.

**Copia este código:**

```jsx
function Contador() {
  return (
    <div className="contador">
      <p>Has hecho clic 0 veces</p>
    </div>
  );
}

export default Contador;
```

**✅ Comprueba:** en el navegador **no cambia nada** todavía (nadie está usando el componente).

**💡 ¿Qué pasó?** Solo creamos la pieza de LEGO. En JSX se usa `className` en lugar de `class`.

---

### Paso 12 — Usa `Contador` dentro de `App`

**Qué vamos a hacer:** importar el componente y ponerlo en pantalla como si fuera una etiqueta HTML.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) En la **primera línea** del archivo (arriba de `function App() {`):

```jsx
import Contador from "./components/Contador.jsx"; // 👇 NUEVO

function App() {
```

b) Debajo de la línea del `<p>Hola, ...</p>`:

```jsx
      <p>Hola, {nombre}. Tu saldo es {saldo} dólares; el doble sería {saldo * 2}.</p>
      {/* 👇 NUEVO */}
      <Contador />
    </>
```

**✅ Comprueba:** debajo del saludo aparece **Has hecho clic 0 veces**.

**💡 ¿Qué pasó?** `import` trae el componente desde su archivo y `<Contador />` lo dibuja. Los componentes siempre empiezan con **Mayúscula**.

---

### Paso 13 — Intenta contar con una variable normal (no funciona)

**Qué vamos a hacer:** agregar un botón que suma 1 usando `let`, para descubrir por qué hace falta el **estado**.

**Dónde:** archivo `src/components/Contador.jsx`. Reemplaza la función `Contador` completa (deja el `export default` del final) por:

**Copia este código:**

```jsx
function Contador() {
  let contador = 0; // 👇 NUEVO

  return (
    <div className="contador">
      <p>Has hecho clic {contador} veces</p>
      {/* 👇 NUEVO */}
      <button
        onClick={() => {
          contador = contador + 1;
          console.log("contador vale", contador);
        }}
      >
        +1
      </button>
    </div>
  );
}
```

**✅ Comprueba:** abre la consola (`F12` → **Console**) y haz clic 3 veces en **+1**:
- La consola muestra `contador vale 1`, `contador vale 2`, `contador vale 3`.
- Pero la pantalla **sigue diciendo** "Has hecho clic **0** veces". 🤔

**💡 ¿Qué pasó?** La variable sí cambia, pero **React no se entera** de que tiene que volver a dibujar. Para eso existe el estado.

---

### Paso 14 — Cambia la variable por `useState`

**Qué vamos a hacer:** guardar el número en el **estado** de React.

**Dónde:** archivo `src/components/Contador.jsx`.

**Copia este código:**

a) En la **primera línea** del archivo agrega el import y un comentario encima de la función:

```jsx
import { useState } from "react"; // 👇 NUEVO

// 👇 NUEVO (la línea de abajo sí se copia: es un comentario del proyecto)
// Demo de useState: cada clic cambia el estado y React vuelve a dibujar el componente.
function Contador() {
```

b) **Reemplaza** la línea `let contador = 0;` por:

```jsx
  const [contador, setContador] = useState(0);
```

c) **Reemplaza** el `<button ...> +1 </button>` completo (las 8 líneas) por:

```jsx
      <button onClick={() => setContador(contador + 1)}>+1</button>
```

**✅ Comprueba:** haz clic en **+1**: ahora la pantalla dice "Has hecho clic **1** veces", "**2** veces"...

**💡 ¿Qué pasó?** `useState(0)` devuelve el valor actual (`contador`) y una función para cambiarlo (`setContador`). Al llamar a `setContador`, React **vuelve a ejecutar** `Contador` con el nuevo valor y actualiza la pantalla (eso es un **re-render**).

---

🏁 **Punto de control 2** — primer estado

<details><summary>Ver archivo completo: src/components/Contador.jsx</summary>

```jsx
import { useState } from "react";

// Demo de useState: cada clic cambia el estado y React vuelve a dibujar el componente.
function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div className="contador">
      <p>Has hecho clic {contador} veces</p>
      <button onClick={() => setContador(contador + 1)}>+1</button>
    </div>
  );
}

export default Contador;
```

</details>

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
import Contador from "./components/Contador.jsx";

function App() {
  const nombre = "Ana";
  const saldo = 1500;

  return (
    <>
      <h1>Banco App</h1>
      <p>Hola, {nombre}. Tu saldo es {saldo} dólares; el doble sería {saldo * 2}.</p>
      <Contador />
    </>
  );
}

export default App;
```

</details>

---

### Paso 15 — Agrega los botones "-1" y "Reiniciar"

**Qué vamos a hacer:** usar el mismo estado desde varios botones.

**Dónde:** archivo `src/components/Contador.jsx`, debajo del botón `+1`.

**Copia este código:**

```jsx
      <button onClick={() => setContador(contador + 1)}>+1</button>
      {/* 👇 NUEVO */}
      <button onClick={() => setContador(contador - 1)}>-1</button>
      {/* 👇 NUEVO */}
      <button onClick={() => setContador(0)}>Reiniciar</button>
    </div>
```

**✅ Comprueba:** **+1** sube, **-1** baja (puede llegar a negativos) y **Reiniciar** vuelve a 0.

**💡 ¿Qué pasó?** `onClick` recibe **una función flecha** `() => ...`; React la ejecuta solo cuando haces clic.

---

### Paso 16 — Mira cada re-render en la consola

**Qué vamos a hacer:** comprobar que React vuelve a ejecutar la función del componente en cada cambio.

**Dónde:** archivo `src/components/Contador.jsx`, debajo de `const [contador, setContador] = useState(0);`.

**Copia este código:**

```jsx
  const [contador, setContador] = useState(0);

  console.log("Render de Contador. contador =", contador); // 👇 NUEVO

  return (
```

**✅ Comprueba:**
- Recarga la página (`F5`) con la consola abierta: aparece `Render de Contador. contador = 0` (puede salir **dos veces**, la segunda en gris, por `<StrictMode>`: es normal).
- Cada clic agrega un mensaje nuevo (también puede salir doble) con el valor actual: `contador = 1`, `contador = 2`...
- 🧪 **Experimento:** en `src/App.jsx` pon **otro** `<Contador />` debajo del primero y guarda. Haz clic en uno: el otro **no cambia**. Cada componente tiene **su propio estado**. Luego **borra** el segundo `<Contador />`.

**💡 ¿Qué pasó?** Cada `setContador` = un re-render = la función `Contador` se ejecuta de nuevo de arriba a abajo.

---

### Paso 17 — Rompe a propósito: `onClick` sin flecha

**Qué vamos a hacer:** ver el error más común con eventos.

**Dónde:** archivo `src/components/Contador.jsx`, botón **Reiniciar**.

1. Cambia `onClick={() => setContador(0)}` por `onClick={setContador(0)}` (sin `() =>`) y guarda.
2. **✅ Comprueba el error:** la página queda **en blanco**; la consola se llena de `Render de Contador. contador = 0` y termina en rojo con *Too many re-renders. React limits the number of renders to prevent an infinite loop.*
3. **Arréglalo** volviendo a poner la flecha:

**Copia este código:**

```jsx
      <button onClick={() => setContador(0)}>Reiniciar</button>
```

**✅ Comprueba:** guarda y recarga (`F5`): el contador vuelve a funcionar.

**💡 ¿Qué pasó?** Sin la flecha, `setContador(0)` se **ejecuta al dibujar**; eso cambia el estado → otro dibujo → otra vez `setContador(0)`... bucle infinito. Con la flecha, solo **pasas** la función para que React la llame al hacer clic.

---

🏁 **Punto de control 3** — `Contador` terminado

<details><summary>Ver archivo completo: src/components/Contador.jsx</summary>

```jsx
import { useState } from "react";

// Demo de useState: cada clic cambia el estado y React vuelve a dibujar el componente.
function Contador() {
  const [contador, setContador] = useState(0);

  console.log("Render de Contador. contador =", contador);

  return (
    <div className="contador">
      <p>Has hecho clic {contador} veces</p>
      <button onClick={() => setContador(contador + 1)}>+1</button>
      <button onClick={() => setContador(contador - 1)}>-1</button>
      <button onClick={() => setContador(0)}>Reiniciar</button>
    </div>
  );
}

export default Contador;
```

</details>

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
import Contador from "./components/Contador.jsx";

function App() {
  const nombre = "Ana";
  const saldo = 1500;

  return (
    <>
      <h1>Banco App</h1>
      <p>Hola, {nombre}. Tu saldo es {saldo} dólares; el doble sería {saldo * 2}.</p>
      <Contador />
    </>
  );
}

export default App;
```

</details>

> Este archivo `Contador.jsx` **ya está terminado**: no lo vuelvas a tocar ni lo borres.

---

## Etapa 4 — Componentes con props

### Paso 18 — Crea `Encabezado` (sin props)

**Qué vamos a hacer:** sacar el título de la página a su propio componente.

**Dónde:** crea el archivo `src/components/Encabezado.jsx`.

**Copia este código:**

```jsx
function Encabezado() {
  return (
    <header className="encabezado">
      <h1>Banco App</h1>
      <p>Movimientos de dinero de nuestros clientes</p>
    </header>
  );
}

export default Encabezado;
```

**✅ Comprueba:** en el navegador no cambia nada todavía.

**💡 ¿Qué pasó?** Otro componente listo para usarse. Todavía tiene los textos **fijos** adentro.

---

### Paso 19 — Usa `Encabezado` en `App` y ordena `App`

**Qué vamos a hacer:** reemplazar el `<h1>` y el saludo de prueba por el nuevo componente.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) Arriba de `import Contador ...` agrega:

```jsx
import Encabezado from "./components/Encabezado.jsx"; // 👇 NUEVO
import Contador from "./components/Contador.jsx";
```

b) **Borra** las líneas `const nombre = "Ana";`, `const saldo = 1500;` y la línea en blanco que les sigue.

c) **Reemplaza** el `return` completo por:

```jsx
  return (
    <div className="contenedor">
      {/* 👇 NUEVO */}
      <Encabezado />
      <Contador />
    </div>
  );
```

**✅ Comprueba:** se ve **Banco App**, debajo **Movimientos de dinero de nuestros clientes** y luego el contador.

**💡 ¿Qué pasó?** `App` ahora **arma la pantalla con piezas**. El `<div className="contenedor">` servirá para centrar la página cuando pongamos estilos.

---

### Paso 20 — Pasa los textos como props

**Qué vamos a hacer:** que `Encabezado` reciba el título y el subtítulo desde afuera.

**Dónde:** dos archivos.

**Copia este código:**

a) En `src/components/Encabezado.jsx`, reemplaza la función completa (deja el `export default`) por:

```jsx
function Encabezado(props) {
  return (
    <header className="encabezado">
      <h1>{props.titulo}</h1>
      <p>{props.subtitulo}</p>
    </header>
  );
}
```

b) En `src/App.jsx`, reemplaza `<Encabezado />` por:

```jsx
      <Encabezado titulo="Banco App" subtitulo="Movimientos de dinero de nuestros clientes" />
```

**✅ Comprueba:** la pantalla se ve **igual** que antes. Ahora cambia en `App.jsx` `titulo="Banco App"` por `titulo="Mi Banco"` y guarda: el título cambia **sin tocar** `Encabezado.jsx`. Luego vuelve a dejar `titulo="Banco App"`.

**💡 ¿Qué pasó?** Las **props** son los parámetros del componente: el padre (`App`) las escribe como atributos y el hijo las recibe en el objeto `props`.

---

### Paso 21 — Desestructura las props

**Qué vamos a hacer:** escribir lo mismo de forma más corta (así se ve en casi todo el código React).

**Dónde:** archivo `src/components/Encabezado.jsx`. Reemplaza la función completa (deja el `export default`) por:

**Copia este código:**

```jsx
// Recibe dos props: titulo y subtitulo
function Encabezado({ titulo, subtitulo }) {
  return (
    <header className="encabezado">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </header>
  );
}
```

**✅ Comprueba:** la pantalla sigue **igual**.
🧪 **Experimento:** en `App.jsx` borra temporalmente `subtitulo="..."`: el subtítulo desaparece (la prop llega como `undefined`) pero nada se rompe. Vuelve a ponerlo.

**💡 ¿Qué pasó?** `{ titulo, subtitulo }` saca esas dos propiedades del objeto `props`. Es exactamente lo mismo que `props.titulo`.

---

🏁 **Punto de control 4** — primer componente con props

<details><summary>Ver archivo completo: src/components/Encabezado.jsx</summary>

```jsx
// Recibe dos props: titulo y subtitulo
function Encabezado({ titulo, subtitulo }) {
  return (
    <header className="encabezado">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </header>
  );
}

export default Encabezado;
```

</details>

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
import Encabezado from "./components/Encabezado.jsx";
import Contador from "./components/Contador.jsx";

function App() {
  return (
    <div className="contenedor">
      <Encabezado titulo="Banco App" subtitulo="Movimientos de dinero de nuestros clientes" />
      <Contador />
    </div>
  );
}

export default App;
```

</details>

---

### Paso 22 — Crea `TarjetaResumen` (título y valor)

**Qué vamos a hacer:** un componente para mostrar un total de dinero.

**Dónde:** crea el archivo `src/components/TarjetaResumen.jsx`.

**Copia este código:**

```jsx
// Tarjeta con un título y un monto en dólares
function TarjetaResumen({ titulo, valor }) {
  return (
    <div className="tarjeta">
      <span className="tarjeta-titulo">{titulo}</span>
      <strong className="tarjeta-valor">{valor}</strong>
    </div>
  );
}

export default TarjetaResumen;
```

**✅ Comprueba:** en el navegador no cambia nada todavía.

**💡 ¿Qué pasó?** Mismo patrón que `Encabezado`: recibe props y las muestra.

---

### Paso 23 — Pon tres tarjetas en `App` (y quita el contador de la pantalla)

**Qué vamos a hacer:** reutilizar **el mismo componente** tres veces con distintas props.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) **Reemplaza** la línea `import Contador from "./components/Contador.jsx";` por:

```jsx
import TarjetaResumen from "./components/TarjetaResumen.jsx";
```

b) **Borra** la línea `<Contador />` y, en su lugar (debajo del `<Encabezado ... />`), pega una línea en blanco y la sección de tarjetas:

```jsx
      <Encabezado titulo="Banco App" subtitulo="Movimientos de dinero de nuestros clientes" />

      {/* 👇 NUEVO */}
      {/* Por ahora con valores fijos; luego vendrán de la API */}
      <section className="tarjetas">
        <TarjetaResumen titulo="Depósitos" valor={1000} />
        <TarjetaResumen titulo="Retiros" valor={250.5} />
        <TarjetaResumen titulo="Transferencias" valor={300} />
      </section>
    </div>
```

(El archivo `Contador.jsx` **no se borra**: solo deja de mostrarse.)

**✅ Comprueba:** debajo del encabezado se ven tres líneas: **Depósitos1000**, **Retiros250.5** y **Transferencias300** (pegadas; los estilos llegan al final).

**💡 ¿Qué pasó?** Un mismo "molde" con distintos "rellenos". Ojo: el texto va con comillas (`titulo="Retiros"`) y los números con llaves (`valor={250.5}`).

---

### Paso 24 — Da formato de dinero al valor

**Qué vamos a hacer:** mostrar `$1,000.00` en lugar de `1000`.

**Dónde:** archivo `src/components/TarjetaResumen.jsx`.

**Copia este código:**

a) Debajo de `function TarjetaResumen({ titulo, valor }) {` agrega:

```jsx
function TarjetaResumen({ titulo, valor }) {
  // 👇 NUEVO
  const montoFormateado = Number(valor).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
```

b) **Reemplaza** la línea del `<strong>` por:

```jsx
      <strong className="tarjeta-valor">{montoFormateado}</strong>
```

**✅ Comprueba:** se lee **Depósitos$1,000.00**, **Retiros$250.50** y **Transferencias$300.00**.

**💡 ¿Qué pasó?** Antes del `return` puedes escribir JavaScript normal. `toLocaleString` convierte un número en texto con formato de moneda; `Number(valor)` asegura que sea número.

---

### Paso 25 — Agrega la prop `color`

**Qué vamos a hacer:** que cada tarjeta tenga su color, usando estilos en línea.

**Dónde:** dos archivos.

**Copia este código:**

a) En `src/components/TarjetaResumen.jsx`, agrega `color` a las props:

```jsx
function TarjetaResumen({ titulo, valor, color }) {
```

b) En el mismo archivo, **reemplaza** el `return` completo por:

```jsx
  return (
    <div className="tarjeta" style={{ borderTopColor: color }}>
      <span className="tarjeta-titulo">{titulo}</span>
      <strong className="tarjeta-valor" style={{ color: color }}>
        {montoFormateado}
      </strong>
    </div>
  );
```

c) En `src/App.jsx`, **reemplaza** las tres tarjetas por:

```jsx
        <TarjetaResumen titulo="Depósitos" valor={1000} color="#16a34a" />
        <TarjetaResumen titulo="Retiros" valor={250.5} color="#dc2626" />
        <TarjetaResumen titulo="Transferencias" valor={300} color="#2563eb" />
```

**✅ Comprueba:** los montos salen en **verde** ($1,000.00), **rojo** ($250.50) y **azul** ($300.00).

**💡 ¿Qué pasó?** `style` recibe un **objeto** de JavaScript: por eso lleva **doble llave** `{{ }}` y las propiedades CSS van en camelCase (`borderTopColor`). El borde se notará cuando agreguemos el CSS.

---

🏁 **Punto de control 5** — props terminadas

<details><summary>Ver archivo completo: src/components/TarjetaResumen.jsx</summary>

```jsx
// Tarjeta con un título y un monto en dólares
function TarjetaResumen({ titulo, valor, color }) {
  const montoFormateado = Number(valor).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="tarjeta" style={{ borderTopColor: color }}>
      <span className="tarjeta-titulo">{titulo}</span>
      <strong className="tarjeta-valor" style={{ color: color }}>
        {montoFormateado}
      </strong>
    </div>
  );
}

export default TarjetaResumen;
```

</details>

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
import Encabezado from "./components/Encabezado.jsx";
import TarjetaResumen from "./components/TarjetaResumen.jsx";

function App() {
  return (
    <div className="contenedor">
      <Encabezado titulo="Banco App" subtitulo="Movimientos de dinero de nuestros clientes" />

      {/* Por ahora con valores fijos; luego vendrán de la API */}
      <section className="tarjetas">
        <TarjetaResumen titulo="Depósitos" valor={1000} color="#16a34a" />
        <TarjetaResumen titulo="Retiros" valor={250.5} color="#dc2626" />
        <TarjetaResumen titulo="Transferencias" valor={300} color="#2563eb" />
      </section>
    </div>
  );
}

export default App;
```

</details>

---

## Etapa 5 — Traer datos de la API

### Paso 26 — Prueba `fetch` en la consola del navegador

**Qué vamos a hacer:** pedir datos a la API "a mano" antes de escribirlo en React.

**Dónde:** navegador, en la pestaña de tu app (<http://localhost:5173>) → `F12` → **Console**.

**Copia este código:** (pega línea por línea y presiona `Enter` después de cada una)

```js
const respuesta = await fetch("http://localhost:3000/api/movimientos");
const datos = await respuesta.json();
datos.length
datos[0]
```

> Si Chrome no te deja pegar, escribe `allow pasting` y presiona `Enter`; luego vuelve a pegar.

**✅ Comprueba:** `datos.length` muestra un número (por ejemplo `40`) y `datos[0]` muestra un objeto con `nombre`, `tipo`, `cantidad`, `fecha`...

**💡 ¿Qué pasó?** `fetch` pide datos y **tarda**, por eso usamos `await` ("espera aquí hasta que llegue"). `respuesta.json()` convierte el texto recibido en un arreglo de JavaScript.

---

### Paso 27 — Crea `api.js`

**Qué vamos a hacer:** guardar en **un solo archivo** la dirección de la API y la función que pide los movimientos.

**Dónde:** crea el archivo `src/api.js` (dentro de `src`, **no** en `components`).

**Copia este código:**

```js
// Dirección base de la API del lunes.
// Si existe la variable VITE_API_URL (archivo .env) se usa esa; si no, localhost:3000.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// GET /api/movimientos -> [{ id, nombre, apellido, tipo, numero_cuenta, ... }]
export async function obtenerMovimientos() {
  const respuesta = await fetch(`${API_URL}/movimientos`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los movimientos`);
  }
  return respuesta.json();
}
```

**✅ Comprueba:** en el navegador no cambia nada (solo creamos una función). La terminal de Vite no muestra errores.

**💡 ¿Qué pasó?** Si mañana cambia el servidor, se cambia **aquí** y ningún componente se entera. `respuesta.ok` es `false` si la API responde 404 o 500; en ese caso lanzamos un error a propósito.

---

### Paso 28 — Conoce `useEffect` con `console.log`

**Qué vamos a hacer:** ver **cuándo** se ejecuta un efecto, antes de usarlo para pedir datos.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) En la **primera línea** del archivo:

```jsx
import { useEffect } from "react"; // 👇 NUEVO
import Encabezado from "./components/Encabezado.jsx";
```

b) Justo debajo de `function App() {` (antes del `return`):

```jsx
function App() {
  // 👇 NUEVO
  console.log("1) Render de App");

  // 👇 NUEVO
  useEffect(() => {
    console.log("2) useEffect: App ya está en pantalla");
  }, []);

  return (
```

**✅ Comprueba:** recarga (`F5`) con la consola abierta. El orden es: primero `1) Render de App` y **después** `2) useEffect: App ya está en pantalla`. (Pueden salir repetidos por `<StrictMode>`; es normal en desarrollo.)

**💡 ¿Qué pasó?** `useEffect` significa "**después de dibujar**, ejecuta esto". El `[]` del final indica "**solo una vez**, cuando el componente aparece". Es el lugar correcto para pedir datos a la API.

---

### Paso 29 — Crea el estado `movimientos`

**Qué vamos a hacer:** preparar dónde guardar los datos que lleguen de la API.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) **Reemplaza** la primera línea `import { useEffect } from "react";` por:

```jsx
import { useEffect, useState } from "react";
```

b) Justo debajo de `function App() {`:

```jsx
function App() {
  const [movimientos, setMovimientos] = useState([]); // 👇 NUEVO

  console.log("1) Render de App");
```

c) Debajo del cierre `</section>` de las tarjetas (antes del `</div>` final):

```jsx
      </section>

      {/* 👇 NUEVO */}
      <p>Se cargaron {movimientos.length} movimientos.</p>
    </div>
```

**✅ Comprueba:** debajo de las tarjetas se lee **Se cargaron 0 movimientos.**

**💡 ¿Qué pasó?** El estado empieza como **arreglo vacío** `[]`, así `.length` funciona aunque todavía no haya datos.

---

### Paso 30 — Pide los movimientos dentro del `useEffect`

**Qué vamos a hacer:** llamar a la API al abrir la página y guardar la respuesta en el estado.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) Debajo de la línea `import { useEffect, useState } from "react";`:

```jsx
import { useEffect, useState } from "react";
import { obtenerMovimientos } from "./api.js"; // 👇 NUEVO
```

b) **Reemplaza** el `useEffect` completo (las 3 líneas) por:

```jsx
  useEffect(() => {
    async function cargarDatos() {
      const datosMovimientos = await obtenerMovimientos();
      console.log("Movimientos recibidos:", datosMovimientos);
      setMovimientos(datosMovimientos);
    }

    cargarDatos();
  }, []);
```

**✅ Comprueba:**
- La pantalla dice **Se cargaron 40 movimientos.** (el número depende de tu base de datos).
- En la consola aparece `Movimientos recibidos:` con el arreglo (despliégalo con el triángulo) y **otro** `1) Render de App` **después**: es el re-render provocado por `setMovimientos`. (Por `<StrictMode>` puede verse todo dos veces: en desarrollo el efecto se ejecuta dos veces; en producción, una.)

**💡 ¿Qué pasó?** Ciclo completo: render con `[]` → efecto → `fetch` → `setMovimientos(datos)` → re-render con 40. La función `async` va **dentro** del efecto porque la función que recibe `useEffect` no puede ser `async`.

---

🏁 **Punto de control 6** — primeros datos reales

<details><summary>Ver archivo completo: src/api.js</summary>

```js
// Dirección base de la API del lunes.
// Si existe la variable VITE_API_URL (archivo .env) se usa esa; si no, localhost:3000.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// GET /api/movimientos -> [{ id, nombre, apellido, tipo, numero_cuenta, ... }]
export async function obtenerMovimientos() {
  const respuesta = await fetch(`${API_URL}/movimientos`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los movimientos`);
  }
  return respuesta.json();
}
```

</details>

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
import { useEffect, useState } from "react";
import { obtenerMovimientos } from "./api.js";
import Encabezado from "./components/Encabezado.jsx";
import TarjetaResumen from "./components/TarjetaResumen.jsx";

function App() {
  const [movimientos, setMovimientos] = useState([]);

  console.log("1) Render de App");

  useEffect(() => {
    async function cargarDatos() {
      const datosMovimientos = await obtenerMovimientos();
      console.log("Movimientos recibidos:", datosMovimientos);
      setMovimientos(datosMovimientos);
    }

    cargarDatos();
  }, []);

  return (
    <div className="contenedor">
      <Encabezado titulo="Banco App" subtitulo="Movimientos de dinero de nuestros clientes" />

      {/* Por ahora con valores fijos; luego vendrán de la API */}
      <section className="tarjetas">
        <TarjetaResumen titulo="Depósitos" valor={1000} color="#16a34a" />
        <TarjetaResumen titulo="Retiros" valor={250.5} color="#dc2626" />
        <TarjetaResumen titulo="Transferencias" valor={300} color="#2563eb" />
      </section>

      <p>Se cargaron {movimientos.length} movimientos.</p>
    </div>
  );
}

export default App;
```

</details>

---

### Paso 31 — Maneja el error si la API está apagada

**Qué vamos a hacer:** mostrar un mensaje claro en vez de fallar en silencio.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) **Reemplaza** la línea `import { obtenerMovimientos } from "./api.js";` por:

```jsx
import { API_URL, obtenerMovimientos } from "./api.js";
```

b) Debajo de `const [movimientos, setMovimientos] = useState([]);`:

```jsx
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState(null); // 👇 NUEVO
```

c) **Reemplaza** la función `cargarDatos` completa (dentro del `useEffect`) por:

```jsx
    async function cargarDatos() {
      try {
        const datosMovimientos = await obtenerMovimientos();
        console.log("Movimientos recibidos:", datosMovimientos);
        setMovimientos(datosMovimientos);
      } catch (err) {
        setError(err.message);
      }
    }
```

d) Debajo del `</section>` de las tarjetas, **arriba** de `<p>Se cargaron ...`:

```jsx
      </section>

      {/* 👇 NUEVO */}
      {error && (
        <div className="mensaje error">
          <p>No se pudo conectar con la API: {error}</p>
          <p>¿Está encendido el backend en {API_URL}? Enciéndelo y recarga la página (F5).</p>
        </div>
      )}

      <p>Se cargaron {movimientos.length} movimientos.</p>
```

**✅ Comprueba:**
- Con el backend encendido todo se ve igual que antes (no hay mensaje de error).
- 🧪 **Experimento:** en la **Terminal 1** detén el backend con `Ctrl+C` y recarga la página (`F5`). Tras 1-2 segundos aparece **No se pudo conectar con la API: Failed to fetch** y la pregunta con `http://localhost:3000/api` (en la consola: `net::ERR_CONNECTION_REFUSED`). Debajo todavía dice "Se cargaron 0 movimientos." — lo arreglamos en el siguiente paso. Vuelve a encender el backend (`npm run dev`) y recarga: el mensaje desaparece.

**💡 ¿Qué pasó?** `try / catch` atrapa el error de `fetch`. `{error && (...)}` es **renderizado condicional**: si `error` es `null` no se dibuja nada; si tiene texto, se dibuja el mensaje.

---

### Paso 32 — Muestra "Cargando..." mientras llegan los datos

**Qué vamos a hacer:** avisar al usuario que estamos esperando a la API.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) **Entre** la línea de `movimientos` y la de `error`:

```jsx
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true); // 👇 NUEVO
  const [error, setError] = useState(null);
```

b) En `cargarDatos`, debajo del bloque `catch`, agrega `finally`:

```jsx
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false); // 👇 NUEVO
      }
```

c) Debajo del `</section>` de las tarjetas, **arriba** de `{error && (`:

```jsx
      </section>

      {/* 👇 NUEVO */}
      {cargando && <p className="mensaje">Cargando...</p>}

      {error && (
```

d) **Reemplaza** la línea `<p>Se cargaron {movimientos.length} movimientos.</p>` por:

```jsx
      {!cargando && !error && <p>Se cargaron {movimientos.length} movimientos.</p>}
```

**✅ Comprueba:**
- Al recargar se ve **Cargando...** un instante y luego **Se cargaron 40 movimientos.**
- 🧪 Para verlo más tiempo: `F12` → pestaña **Network** → cambia *No throttling* por **Slow 4G** (o *3G*) y recarga. Después vuelve a *No throttling*.
- Con el backend apagado se ve **Cargando...** 1-2 segundos y luego **solo** el error (ya no sale "Se cargaron 0 movimientos"). Vuelve a encenderlo y recarga.

**💡 ¿Qué pasó?** `cargando` empieza en `true` porque apenas abre la página ya estamos cargando. `finally` se ejecuta **siempre** (haya error o no) y apaga el "Cargando...".

---

### Paso 33 — Limpia los `console.log` y ordena con comentarios

**Qué vamos a hacer:** dejar `App.jsx` limpio y fácil de leer.

**Dónde:** archivo `src/App.jsx`.

1. **Borra** la línea `console.log("1) Render de App");` (y la línea en blanco que la sigue).
2. **Borra** la línea `console.log("Movimientos recibidos:", datosMovimientos);`.
3. Agrega los comentarios de sección:

**Copia este código:**

a) Encima de la línea de `movimientos`:

```jsx
function App() {
  // ---------- Estado ----------
  const [movimientos, setMovimientos] = useState([]);
```

b) Encima de `useEffect(() => {`:

```jsx
  // ---------- Cargar datos de la API ----------
  // El arreglo vacío [] significa: ejecutar SOLO UNA VEZ, cuando App aparece en pantalla
  useEffect(() => {
```

c) Encima de `return (`:

```jsx
  // ---------- Vista ----------
  return (
```

**✅ Comprueba:** la pantalla se ve igual y la consola ya no muestra nuestros mensajes. Compara tu archivo con el punto de control.

**💡 ¿Qué pasó?** Nada nuevo para el navegador; solo orden. Los comentarios `//` son para JavaScript; dentro del JSX se usan `{/* */}`.

---

🏁 **Punto de control 7** — carga con estados de "cargando" y error

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
import { useEffect, useState } from "react";
import { API_URL, obtenerMovimientos } from "./api.js";
import Encabezado from "./components/Encabezado.jsx";
import TarjetaResumen from "./components/TarjetaResumen.jsx";

function App() {
  // ---------- Estado ----------
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ---------- Cargar datos de la API ----------
  // El arreglo vacío [] significa: ejecutar SOLO UNA VEZ, cuando App aparece en pantalla
  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosMovimientos = await obtenerMovimientos();
        setMovimientos(datosMovimientos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  // ---------- Vista ----------
  return (
    <div className="contenedor">
      <Encabezado titulo="Banco App" subtitulo="Movimientos de dinero de nuestros clientes" />

      {/* Por ahora con valores fijos; luego vendrán de la API */}
      <section className="tarjetas">
        <TarjetaResumen titulo="Depósitos" valor={1000} color="#16a34a" />
        <TarjetaResumen titulo="Retiros" valor={250.5} color="#dc2626" />
        <TarjetaResumen titulo="Transferencias" valor={300} color="#2563eb" />
      </section>

      {cargando && <p className="mensaje">Cargando...</p>}

      {error && (
        <div className="mensaje error">
          <p>No se pudo conectar con la API: {error}</p>
          <p>¿Está encendido el backend en {API_URL}? Enciéndelo y recarga la página (F5).</p>
        </div>
      )}

      {!cargando && !error && <p>Se cargaron {movimientos.length} movimientos.</p>}
    </div>
  );
}

export default App;
```

</details>

---

## Etapa 6 — Tabla de movimientos

### Paso 34 — Crea la tabla con encabezados fijos

**Qué vamos a hacer:** dibujar la estructura de la tabla (todavía sin datos).

**Dónde:** dos archivos.

**Copia este código:**

a) Crea `src/components/TablaMovimientos.jsx`:

```jsx
// Recibe la lista de movimientos y dibuja una fila por cada uno
function TablaMovimientos() {
  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Tipo</th>
          <th>Cuenta</th>
          <th>Destino</th>
          <th>Descripción</th>
          <th className="derecha">Cantidad</th>
        </tr>
      </thead>
    </table>
  );
}

export default TablaMovimientos;
```

b) En `src/App.jsx`, debajo de `import TarjetaResumen ...`:

```jsx
import TarjetaResumen from "./components/TarjetaResumen.jsx";
import TablaMovimientos from "./components/TablaMovimientos.jsx"; // 👇 NUEVO
```

c) En `src/App.jsx`, **reemplaza** la línea `{!cargando && !error && <p>Se cargaron {movimientos.length} movimientos.</p>}` por:

```jsx
      {!cargando && !error && <TablaMovimientos />}
```

**✅ Comprueba:** debajo de las tarjetas se ve una fila de títulos: **Fecha Cliente Tipo Cuenta Destino Descripción Cantidad**.

**💡 ¿Qué pasó?** Es HTML normal de tabla: `<thead>` para los títulos. Cada `<th>` es una columna.

---

### Paso 35 — Pasa los movimientos a la tabla y muestra cuántos llegan

**Qué vamos a hacer:** comprobar que la prop `movimientos` llega bien antes de dibujar filas.

**Dónde:** dos archivos.

**Copia este código:**

a) En `src/components/TablaMovimientos.jsx`, recibe la prop:

```jsx
function TablaMovimientos({ movimientos }) {
```

b) En el mismo archivo, debajo de `</thead>`:

```jsx
      </thead>
      {/* 👇 NUEVO */}
      <tbody>
        <tr>
          <td>Llegaron {movimientos.length} movimientos</td>
        </tr>
      </tbody>
    </table>
```

c) En `src/App.jsx`, **reemplaza** `<TablaMovimientos />` por:

```jsx
      {!cargando && !error && <TablaMovimientos movimientos={movimientos} />}
```

**✅ Comprueba:** debajo de "Fecha" se lee **Llegaron 40 movimientos**.

**💡 ¿Qué pasó?** Los datos viajan **de arriba hacia abajo**: `App` es el dueño del estado y se lo pasa a la tabla como prop. Una prop puede ser un texto, un número... o un arreglo completo.

---

### Paso 36 — Dibuja una fila por movimiento con `.map` (sin `key`)

**Qué vamos a hacer:** convertir cada movimiento en un `<tr>` (por ahora, solo con la fecha).

**Dónde:** archivo `src/components/TablaMovimientos.jsx`. **Reemplaza** el `<tbody>` completo (las 5 líneas) por:

**Copia este código:**

```jsx
      <tbody>
        {movimientos.map((movimiento) => (
          <tr>
            <td>{movimiento.fecha}</td>
          </tr>
        ))}
      </tbody>
```

**✅ Comprueba:**
- En la columna **Fecha** aparece una fecha por fila, por ejemplo `2026-09-12 19:30:00`, 40 filas.
- En la consola aparece una **advertencia** en rojo: *Each child in a list should have a unique "key" prop.* ⚠️ La arreglamos en el siguiente paso.

**💡 ¿Qué pasó?** `.map` es una fábrica: entra un arreglo de **datos**, sale un arreglo de **filas JSX**. Ojo con los paréntesis `(movimiento) => ( ... )`: devuelven el `<tr>` directamente.

---

### Paso 37 — Agrega la `key` a cada fila

**Qué vamos a hacer:** darle a cada fila una "cédula" única.

**Dónde:** archivo `src/components/TablaMovimientos.jsx`. **Reemplaza** la línea `<tr>` que está **dentro** del `.map` por:

**Copia este código:**

```jsx
          <tr key={movimiento.id}>
```

**✅ Comprueba:** recarga (`F5`): la advertencia de `key` **ya no aparece** en la consola.

**💡 ¿Qué pasó?** React usa `key` para saber qué fila cambió, se agregó o se borró. Debe ser **única y estable**: el `id` de la base de datos es perfecto.

---

🏁 **Punto de control 8** — la lista funciona

<details><summary>Ver archivo completo: src/components/TablaMovimientos.jsx</summary>

```jsx
// Recibe la lista de movimientos y dibuja una fila por cada uno
function TablaMovimientos({ movimientos }) {
  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Tipo</th>
          <th>Cuenta</th>
          <th>Destino</th>
          <th>Descripción</th>
          <th className="derecha">Cantidad</th>
        </tr>
      </thead>
      <tbody>
        {movimientos.map((movimiento) => (
          <tr key={movimiento.id}>
            <td>{movimiento.fecha}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TablaMovimientos;
```

</details>

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
import { useEffect, useState } from "react";
import { API_URL, obtenerMovimientos } from "./api.js";
import Encabezado from "./components/Encabezado.jsx";
import TarjetaResumen from "./components/TarjetaResumen.jsx";
import TablaMovimientos from "./components/TablaMovimientos.jsx";

function App() {
  // ---------- Estado ----------
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ---------- Cargar datos de la API ----------
  // El arreglo vacío [] significa: ejecutar SOLO UNA VEZ, cuando App aparece en pantalla
  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosMovimientos = await obtenerMovimientos();
        setMovimientos(datosMovimientos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  // ---------- Vista ----------
  return (
    <div className="contenedor">
      <Encabezado titulo="Banco App" subtitulo="Movimientos de dinero de nuestros clientes" />

      {/* Por ahora con valores fijos; luego vendrán de la API */}
      <section className="tarjetas">
        <TarjetaResumen titulo="Depósitos" valor={1000} color="#16a34a" />
        <TarjetaResumen titulo="Retiros" valor={250.5} color="#dc2626" />
        <TarjetaResumen titulo="Transferencias" valor={300} color="#2563eb" />
      </section>

      {cargando && <p className="mensaje">Cargando...</p>}

      {error && (
        <div className="mensaje error">
          <p>No se pudo conectar con la API: {error}</p>
          <p>¿Está encendido el backend en {API_URL}? Enciéndelo y recarga la página (F5).</p>
        </div>
      )}

      {!cargando && !error && <TablaMovimientos movimientos={movimientos} />}
    </div>
  );
}

export default App;
```

</details>

---

### Paso 38 — Agrega el resto de columnas

**Qué vamos a hacer:** llenar todas las celdas de la fila.

**Dónde:** archivo `src/components/TablaMovimientos.jsx`, debajo de `<td>{movimiento.fecha}</td>`.

**Copia este código:**

```jsx
            <td>{movimiento.fecha}</td>
            {/* 👇 NUEVO */}
            <td>
              {movimiento.nombre} {movimiento.apellido}
            </td>
            <td>{movimiento.tipo}</td>
            <td>{movimiento.numero_cuenta}</td>
            <td>{movimiento.numero_cuenta_destino ?? "-"}</td>
            <td>{movimiento.descripcion}</td>
            <td className="derecha">{movimiento.cantidad}</td>
          </tr>
```

**✅ Comprueba:** cada fila muestra fecha, nombre y apellido, tipo (`DEPOSITO`, `RETIRO`, `TRANSFERENCIA`), cuenta, destino (un `-` si no es transferencia), descripción y cantidad (por ejemplo `100`).

**💡 ¿Qué pasó?** `??` significa "si lo de la izquierda es `null`, usa lo de la derecha". Solo las transferencias tienen cuenta destino.

---

### Paso 39 — Pinta el tipo como etiqueta

**Qué vamos a hacer:** preparar una clase CSS distinta según el tipo (`deposito`, `retiro`, `transferencia`).

**Dónde:** archivo `src/components/TablaMovimientos.jsx`. **Reemplaza** la línea `<td>{movimiento.tipo}</td>` por:

**Copia este código:**

```jsx
            <td>
              <span className={`etiqueta ${movimiento.tipo.toLowerCase()}`}>{movimiento.tipo}</span>
            </td>
```

**✅ Comprueba:** a simple vista no cambia (el color llega con el CSS). Clic derecho sobre un "DEPOSITO" → **Inspeccionar**: el `<span>` tiene `class="etiqueta deposito"`.

**💡 ¿Qué pasó?** Con comillas invertidas `` `...${}...` `` (template string) armamos el texto de la clase mezclando texto fijo y JavaScript.

---

### Paso 40 — Formato de dinero en la cantidad

**Qué vamos a hacer:** mostrar `$100.00` en lugar de `100`.

**Dónde:** archivo `src/components/TablaMovimientos.jsx`. **Reemplaza** la línea `<td className="derecha">{movimiento.cantidad}</td>` por:

**Copia este código:**

```jsx
            <td className="derecha">
              {Number(movimiento.cantidad).toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </td>
```

**✅ Comprueba:** la columna **Cantidad** muestra montos como `$100.00` o `$1,800.00`.

**💡 ¿Qué pasó?** Es el mismo `toLocaleString` de `TarjetaResumen`, escrito directamente dentro de las llaves del JSX.

---

### Paso 41 — Mensaje cuando la lista está vacía

**Qué vamos a hacer:** no mostrar una tabla vacía si no hay movimientos.

**Dónde:** archivo `src/components/TablaMovimientos.jsx`, debajo de `function TablaMovimientos({ movimientos }) {`.

**Copia este código:**

```jsx
function TablaMovimientos({ movimientos }) {
  // 👇 NUEVO
  if (movimientos.length === 0) {
    return <p className="mensaje">No hay movimientos para mostrar.</p>;
  }

  return (
```

**✅ Comprueba:**
- 🧪 **Experimento:** en `src/App.jsx` cambia temporalmente `movimientos={movimientos}` por `movimientos={[]}` y guarda: se lee **No hay movimientos para mostrar.**
- Vuelve a dejar `movimientos={movimientos}`: regresa la tabla completa.

**💡 ¿Qué pasó?** Un `if` con `return` **antes** del `return` principal es otra forma de renderizado condicional ("retorno temprano").

---

🏁 **Punto de control 9** — `TablaMovimientos` terminada

<details><summary>Ver archivo completo: src/components/TablaMovimientos.jsx</summary>

```jsx
// Recibe la lista de movimientos y dibuja una fila por cada uno
function TablaMovimientos({ movimientos }) {
  if (movimientos.length === 0) {
    return <p className="mensaje">No hay movimientos para mostrar.</p>;
  }

  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Tipo</th>
          <th>Cuenta</th>
          <th>Destino</th>
          <th>Descripción</th>
          <th className="derecha">Cantidad</th>
        </tr>
      </thead>
      <tbody>
        {movimientos.map((movimiento) => (
          <tr key={movimiento.id}>
            <td>{movimiento.fecha}</td>
            <td>
              {movimiento.nombre} {movimiento.apellido}
            </td>
            <td>
              <span className={`etiqueta ${movimiento.tipo.toLowerCase()}`}>{movimiento.tipo}</span>
            </td>
            <td>{movimiento.numero_cuenta}</td>
            <td>{movimiento.numero_cuenta_destino ?? "-"}</td>
            <td>{movimiento.descripcion}</td>
            <td className="derecha">
              {Number(movimiento.cantidad).toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TablaMovimientos;
```

</details>

> `src/App.jsx` no cambió desde el Punto de control 8.

---

## Etapa 7 — Filtro por tipo

### Paso 42 — Crea `FiltroTipo` y ponlo sobre la tabla

**Qué vamos a hacer:** dibujar un `<select>` con los tipos de movimiento (todavía no filtra).

**Dónde:** dos archivos.

**Copia este código:**

a) Crea `src/components/FiltroTipo.jsx`:

```jsx
function FiltroTipo() {
  return (
    <label className="filtro">
      Tipo de movimiento:{" "}
      <select>
        <option value="TODOS">Todos</option>
        <option value="DEPOSITO">Depósitos</option>
        <option value="RETIRO">Retiros</option>
        <option value="TRANSFERENCIA">Transferencias</option>
      </select>
    </label>
  );
}

export default FiltroTipo;
```

b) En `src/App.jsx`, debajo de `import TarjetaResumen ...` (arriba de `import TablaMovimientos ...`):

```jsx
import TarjetaResumen from "./components/TarjetaResumen.jsx";
import FiltroTipo from "./components/FiltroTipo.jsx"; // 👇 NUEVO
import TablaMovimientos from "./components/TablaMovimientos.jsx";
```

c) En `src/App.jsx`, **reemplaza** la línea `{!cargando && !error && <TablaMovimientos movimientos={movimientos} />}` por:

```jsx
      {!cargando && !error && (
        <>
          <section className="barra">
            <FiltroTipo />
          </section>

          <TablaMovimientos movimientos={movimientos} />
        </>
      )}
```

**✅ Comprueba:** encima de la tabla aparece **Tipo de movimiento: [Todos ▾]**. Puedes elegir opciones, pero la tabla no cambia (aún).

**💡 ¿Qué pasó?** Como `&&` necesita **un solo** elemento a la derecha, envolvimos filtro y tabla en un fragmento `<> </>`. `{" "}` agrega un espacio entre el texto y el `select`.

---

### Paso 43 — Rompe a propósito: `value` sin `onChange`

**Qué vamos a hacer:** que el `select` muestre lo que diga un estado (componente **controlado**) y ver qué pasa si falta el `onChange`.

**Dónde:** archivo `src/components/FiltroTipo.jsx`.

**Copia este código:**

a) En la **primera línea** del archivo:

```jsx
import { useState } from "react"; // 👇 NUEVO

function FiltroTipo() {
```

b) Debajo de `function FiltroTipo() {`:

```jsx
function FiltroTipo() {
  const [valor, setValor] = useState("TODOS"); // 👇 NUEVO
  console.log("Filtro elegido:", valor); // 👇 NUEVO

  return (
```

c) **Reemplaza** la línea `<select>` por:

```jsx
      <select value={valor}>
```

**✅ Comprueba:**
- Intenta elegir **Retiros**: el `select` **vuelve solo a "Todos"**. 🔒
- En la consola aparece la advertencia: *You provided a `value` prop to a form field without an `onChange` handler...*

**💡 ¿Qué pasó?** Con `value={valor}` React **manda**: el `select` siempre muestra el estado, y el estado nunca cambia porque nadie llama a `setValor`.

---

### Paso 44 — Agrega `onChange` al `select`

**Qué vamos a hacer:** actualizar el estado cuando el usuario elige una opción.

**Dónde:** archivo `src/components/FiltroTipo.jsx`. **Reemplaza** la línea `<select value={valor}>` por:

**Copia este código:**

```jsx
      <select value={valor} onChange={(evento) => setValor(evento.target.value)}>
```

**✅ Comprueba:** ahora sí puedes elegir **Retiros**, y la consola muestra `Filtro elegido: RETIRO` (luego `DEPOSITO`, etc.). La advertencia desaparece al recargar.

**💡 ¿Qué pasó?** `onChange` recibe el **evento**; el valor elegido está en `evento.target.value`. Pero hay un problema: el estado vive **dentro** de `FiltroTipo`, y la tabla (que está en `App`) no puede verlo.

---

### Paso 45 — Sube el estado a `App` (levantar el estado)

**Qué vamos a hacer:** que `App` guarde el filtro y se lo pase a `FiltroTipo` por props.

**Dónde:** dos archivos.

**Copia este código:**

a) En `src/components/FiltroTipo.jsx`, **borra todo** y pega la versión que recibe props:

```jsx
// Componente "controlado": el valor viene del padre (App)
// y cuando el usuario cambia la opción avisamos al padre con onCambiar.
function FiltroTipo({ valor, onCambiar }) {
  return (
    <label className="filtro">
      Tipo de movimiento:{" "}
      <select value={valor} onChange={(evento) => onCambiar(evento.target.value)}>
        <option value="TODOS">Todos</option>
        <option value="DEPOSITO">Depósitos</option>
        <option value="RETIRO">Retiros</option>
        <option value="TRANSFERENCIA">Transferencias</option>
      </select>
    </label>
  );
}

export default FiltroTipo;
```

(Ya no hay `import { useState }`, ni `useState`, ni `console.log`.)

b) En `src/App.jsx`, debajo de `const [error, setError] = useState(null);`:

```jsx
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("TODOS"); // 👇 NUEVO
```

c) En `src/App.jsx`, **reemplaza** `<FiltroTipo />` por:

```jsx
            <FiltroTipo valor={filtroTipo} onCambiar={setFiltroTipo} />
```

**✅ Comprueba:** el `select` funciona igual que antes (puedes elegir cualquier opción). La tabla todavía no filtra.
(Opcional: con **React Developer Tools** → pestaña *Components* → selecciona `App` y mira cómo cambia `filtroTipo` al usar el `select`.)

**💡 ¿Qué pasó?** Una prop también puede ser **una función**: `onCambiar={setFiltroTipo}` es como darle al hijo un **control remoto**. El hijo aprieta el botón; el televisor (el estado) está en el padre.

---

### Paso 46 — Filtra los movimientos

**Qué vamos a hacer:** calcular la lista filtrada y pasársela a la tabla.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) Debajo del `useEffect` (después de `}, []);`) y **arriba** de `// ---------- Vista ----------`:

```jsx
  }, []);

  // 👇 NUEVO
  // ---------- Filtro en el cliente ----------
  const movimientosFiltrados =
    filtroTipo === "TODOS"
      ? movimientos
      : movimientos.filter((movimiento) => movimiento.tipo === filtroTipo);

  // ---------- Vista ----------
```

(La línea `// 👇 NUEVO` no la copies.)

b) **Reemplaza** `<TablaMovimientos movimientos={movimientos} />` por:

```jsx
          <TablaMovimientos movimientos={movimientosFiltrados} />
```

**✅ Comprueba:**
- Elige **Depósitos**: en la columna Tipo solo hay `DEPOSITO`.
- Elige **Retiros**: solo `RETIRO`. **Transferencias**: solo `TRANSFERENCIA` (y todas tienen Destino).
- Elige **Todos**: vuelven todas las filas.

**💡 ¿Qué pasó?** `movimientosFiltrados` **no es un estado**: se calcula en cada render a partir de `movimientos` y `filtroTipo`. Al cambiar el filtro → re-render de `App` → se recalcula la lista → la tabla se dibuja de nuevo. No hace falta volver a llamar a la API.

---

🏁 **Punto de control 10** — el filtro funciona

<details><summary>Ver archivo completo: src/components/FiltroTipo.jsx</summary>

```jsx
// Componente "controlado": el valor viene del padre (App)
// y cuando el usuario cambia la opción avisamos al padre con onCambiar.
function FiltroTipo({ valor, onCambiar }) {
  return (
    <label className="filtro">
      Tipo de movimiento:{" "}
      <select value={valor} onChange={(evento) => onCambiar(evento.target.value)}>
        <option value="TODOS">Todos</option>
        <option value="DEPOSITO">Depósitos</option>
        <option value="RETIRO">Retiros</option>
        <option value="TRANSFERENCIA">Transferencias</option>
      </select>
    </label>
  );
}

export default FiltroTipo;
```

</details>

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
import { useEffect, useState } from "react";
import { API_URL, obtenerMovimientos } from "./api.js";
import Encabezado from "./components/Encabezado.jsx";
import TarjetaResumen from "./components/TarjetaResumen.jsx";
import FiltroTipo from "./components/FiltroTipo.jsx";
import TablaMovimientos from "./components/TablaMovimientos.jsx";

function App() {
  // ---------- Estado ----------
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("TODOS");

  // ---------- Cargar datos de la API ----------
  // El arreglo vacío [] significa: ejecutar SOLO UNA VEZ, cuando App aparece en pantalla
  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosMovimientos = await obtenerMovimientos();
        setMovimientos(datosMovimientos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  // ---------- Filtro en el cliente ----------
  const movimientosFiltrados =
    filtroTipo === "TODOS"
      ? movimientos
      : movimientos.filter((movimiento) => movimiento.tipo === filtroTipo);

  // ---------- Vista ----------
  return (
    <div className="contenedor">
      <Encabezado titulo="Banco App" subtitulo="Movimientos de dinero de nuestros clientes" />

      {/* Por ahora con valores fijos; luego vendrán de la API */}
      <section className="tarjetas">
        <TarjetaResumen titulo="Depósitos" valor={1000} color="#16a34a" />
        <TarjetaResumen titulo="Retiros" valor={250.5} color="#dc2626" />
        <TarjetaResumen titulo="Transferencias" valor={300} color="#2563eb" />
      </section>

      {cargando && <p className="mensaje">Cargando...</p>}

      {error && (
        <div className="mensaje error">
          <p>No se pudo conectar con la API: {error}</p>
          <p>¿Está encendido el backend en {API_URL}? Enciéndelo y recarga la página (F5).</p>
        </div>
      )}

      {!cargando && !error && (
        <>
          <section className="barra">
            <FiltroTipo valor={filtroTipo} onCambiar={setFiltroTipo} />
          </section>

          <TablaMovimientos movimientos={movimientosFiltrados} />
        </>
      )}
    </div>
  );
}

export default App;
```

</details>

---

## Etapa 8 — Resumen real, estilos y cierre

### Paso 47 — Agrega `obtenerResumen` a `api.js`

**Qué vamos a hacer:** una segunda función para pedir los totales.

**Dónde:** archivo `src/api.js`, **al final** del archivo (debajo del `}` de `obtenerMovimientos`).

**Copia este código:**

```js
  return respuesta.json();
}

// 👇 NUEVO
// GET /api/resumen -> { total_movimientos, total_depositos, total_retiros, ... }
export async function obtenerResumen() {
  const respuesta = await fetch(`${API_URL}/resumen`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener el resumen`);
  }
  return respuesta.json();
}
```

(La línea `// 👇 NUEVO` no la copies.)

**✅ Comprueba:** en el navegador no cambia nada. Abre <http://localhost:3000/api/resumen> y ubica los campos `total_depositos`, `total_retiros` y `total_transferencias`.

**💡 ¿Qué pasó?** Mismo patrón que `obtenerMovimientos`, con otro endpoint.

---

### Paso 48 — Guarda el resumen en el estado

**Qué vamos a hacer:** pedir el resumen al cargar la página, junto con los movimientos.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) **Reemplaza** la línea `import { API_URL, obtenerMovimientos } from "./api.js";` por:

```jsx
import { API_URL, obtenerMovimientos, obtenerResumen } from "./api.js";
```

b) Debajo de `const [movimientos, setMovimientos] = useState([]);`:

```jsx
  const [movimientos, setMovimientos] = useState([]);
  const [resumen, setResumen] = useState(null); // 👇 NUEVO
```

c) Dentro del `try`, **reemplaza** las dos líneas que hay por estas cuatro:

```jsx
      try {
        const datosMovimientos = await obtenerMovimientos();
        const datosResumen = await obtenerResumen();
        setMovimientos(datosMovimientos);
        setResumen(datosResumen);
      } catch (err) {
```

**✅ Comprueba:** la pantalla se ve igual. `F12` → pestaña **Network** → recarga: aparecen las peticiones `movimientos` y `resumen` con estado `200`.

**💡 ¿Qué pasó?** `resumen` empieza en `null` porque al inicio todavía no hay datos. Si cualquiera de las dos peticiones falla, el `catch` muestra el error.

---

### Paso 49 — Muestra los totales reales en las tarjetas

**Qué vamos a hacer:** reemplazar los valores fijos por los de la API.

**Dónde:** archivo `src/App.jsx`.

**Copia este código:**

a) **Borra** el comentario `{/* Por ahora con valores fijos; luego vendrán de la API */}`, toda la `<section className="tarjetas">...</section>` y la línea en blanco que la sigue. Debajo del `<Encabezado ... />` debe quedar directamente `{cargando && ...}`.

b) Dentro del fragmento, **arriba** de `<section className="barra">`, pega:

```jsx
        <>
          {/* 👇 NUEVO */}
          {resumen && (
            <section className="tarjetas">
              <TarjetaResumen titulo="Depósitos" valor={resumen.total_depositos} color="#16a34a" />
              <TarjetaResumen titulo="Retiros" valor={resumen.total_retiros} color="#dc2626" />
              <TarjetaResumen
                titulo="Transferencias"
                valor={resumen.total_transferencias}
                color="#2563eb"
              />
            </section>
          )}

          <section className="barra">
```

**✅ Comprueba:**
- Las tarjetas muestran los totales reales, por ejemplo **Depósitos $16,220.00**, **Retiros $1,650.00**, **Transferencias $1,785.00** (dependen de tu base de datos).
- Al cambiar el filtro, las tarjetas **no cambian**: son totales generales.
- Con el backend apagado ya **no** se ven tarjetas falsas: solo el mensaje de error.

**💡 ¿Qué pasó?** Las tarjetas se movieron **dentro** del bloque `!cargando && !error`. `{resumen && (...)}` protege contra `resumen` en `null` (evita *Cannot read properties of null*).

---

### Paso 50 — Agrega los estilos

**Qué vamos a hacer:** darle aspecto de aplicación bancaria. (El CSS no es el foco de hoy: se pega completo.)

**Dónde:** archivo `src/index.css` (está vacío). Pega todo esto:

**Copia este código:**

```css
/* ---------- Base ---------- */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: #f3f4f6;
  color: #1f2937;
}

.contenedor {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
}

button {
  padding: 8px 14px;
  margin-right: 6px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

/* ---------- Encabezado ---------- */
.encabezado h1 {
  margin: 0;
  color: #1e3a8a;
}

.encabezado p {
  margin: 4px 0 24px;
  color: #6b7280;
}

/* ---------- Tarjetas ---------- */
.tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.tarjeta {
  background: white;
  border-radius: 8px;
  border-top: 4px solid #9ca3af;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tarjeta-titulo {
  display: block;
  color: #6b7280;
  font-size: 14px;
}

.tarjeta-valor {
  font-size: 26px;
}

/* ---------- Barra de filtro ---------- */
.barra {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.filtro select {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

/* ---------- Tabla ---------- */
.tabla {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.tabla th,
.tabla td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.tabla th {
  background: #1e3a8a;
  color: white;
}

.tabla tbody tr:hover {
  background: #f9fafb;
}

.derecha {
  text-align: right !important;
}

.etiqueta {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
}

.deposito {
  background: #dcfce7;
  color: #166534;
}

.retiro {
  background: #fee2e2;
  color: #991b1b;
}

.transferencia {
  background: #dbeafe;
  color: #1e40af;
}

/* ---------- Mensajes ---------- */
.mensaje {
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.error {
  background: #fee2e2;
  color: #991b1b;
}

/* ---------- Contador (demo) ---------- */
.contador {
  padding: 16px;
  margin-bottom: 24px;
  background: white;
  border-radius: 8px;
}
```

**✅ Comprueba:** fondo gris claro, título azul oscuro, tres **tarjetas blancas** con borde superior de color, el filtro, y una tabla blanca con encabezado **azul oscuro**, cantidades alineadas a la derecha y etiquetas de tipo **verde** (depósito), **roja** (retiro) y **azul** (transferencia).

**💡 ¿Qué pasó?** Las clases que fuimos poniendo con `className` (`tarjeta`, `tabla`, `etiqueta deposito`...) por fin tienen estilo. El `borderTopColor` en línea de cada tarjeta **gana** al gris del CSS.

---

### Paso 51 — Verifica con `lint` y `build`

**Qué vamos a hacer:** comprobar que el código no tiene errores y que compila para producción.

**Dónde:** Terminal 2 (detén Vite con `Ctrl+C`).

**Copia este código:**

```powershell
npm run lint
npm run build
npm run dev
```

**✅ Comprueba:**
- `npm run lint` termina **sin errores ni advertencias** (no aparece ninguna línea con `×` o `⚠`).
- `npm run build` termina con `✓ built in ...` (crea la carpeta `dist`).
- `npm run dev` vuelve a levantar la app en <http://localhost:5173>.

**Checklist final:**

- [ ] Encabezado con título y subtítulo.
- [ ] 3 tarjetas con los totales reales en formato `$0,000.00`.
- [ ] La tabla muestra todos los movimientos, con etiquetas de color.
- [ ] El filtro muestra solo el tipo elegido y "Todos" regresa la lista completa.
- [ ] Con el backend apagado aparece el mensaje de error (y al encenderlo + `F5`, vuelven los datos).
- [ ] La consola del navegador no tiene advertencias rojas.

**💡 ¿Qué pasó?** `lint` revisa errores comunes (por ejemplo, reglas de los hooks) y `build` genera la versión optimizada. ¡Tu `banco-app` está lista para convertirse en dashboard el miércoles!

---

🏁 **Punto de control 11** — app terminada

Estructura final:

```
banco-app/
├── index.html
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api.js
    └── components/
        ├── Contador.jsx
        ├── Encabezado.jsx
        ├── FiltroTipo.jsx
        ├── TablaMovimientos.jsx
        └── TarjetaResumen.jsx
```

<details><summary>Ver archivo completo: src/App.jsx</summary>

```jsx
import { useEffect, useState } from "react";
import { API_URL, obtenerMovimientos, obtenerResumen } from "./api.js";
import Encabezado from "./components/Encabezado.jsx";
import TarjetaResumen from "./components/TarjetaResumen.jsx";
import FiltroTipo from "./components/FiltroTipo.jsx";
import TablaMovimientos from "./components/TablaMovimientos.jsx";

function App() {
  // ---------- Estado ----------
  const [movimientos, setMovimientos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("TODOS");

  // ---------- Cargar datos de la API ----------
  // El arreglo vacío [] significa: ejecutar SOLO UNA VEZ, cuando App aparece en pantalla
  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosMovimientos = await obtenerMovimientos();
        const datosResumen = await obtenerResumen();
        setMovimientos(datosMovimientos);
        setResumen(datosResumen);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  // ---------- Filtro en el cliente ----------
  const movimientosFiltrados =
    filtroTipo === "TODOS"
      ? movimientos
      : movimientos.filter((movimiento) => movimiento.tipo === filtroTipo);

  // ---------- Vista ----------
  return (
    <div className="contenedor">
      <Encabezado titulo="Banco App" subtitulo="Movimientos de dinero de nuestros clientes" />

      {cargando && <p className="mensaje">Cargando...</p>}

      {error && (
        <div className="mensaje error">
          <p>No se pudo conectar con la API: {error}</p>
          <p>¿Está encendido el backend en {API_URL}? Enciéndelo y recarga la página (F5).</p>
        </div>
      )}

      {!cargando && !error && (
        <>
          {resumen && (
            <section className="tarjetas">
              <TarjetaResumen titulo="Depósitos" valor={resumen.total_depositos} color="#16a34a" />
              <TarjetaResumen titulo="Retiros" valor={resumen.total_retiros} color="#dc2626" />
              <TarjetaResumen
                titulo="Transferencias"
                valor={resumen.total_transferencias}
                color="#2563eb"
              />
            </section>
          )}

          <section className="barra">
            <FiltroTipo valor={filtroTipo} onCambiar={setFiltroTipo} />
          </section>

          <TablaMovimientos movimientos={movimientosFiltrados} />
        </>
      )}
    </div>
  );
}

export default App;
```

</details>

<details><summary>Ver archivo completo: src/api.js</summary>

```js
// Dirección base de la API del lunes.
// Si existe la variable VITE_API_URL (archivo .env) se usa esa; si no, localhost:3000.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// GET /api/movimientos -> [{ id, nombre, apellido, tipo, numero_cuenta, ... }]
export async function obtenerMovimientos() {
  const respuesta = await fetch(`${API_URL}/movimientos`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los movimientos`);
  }
  return respuesta.json();
}

// GET /api/resumen -> { total_movimientos, total_depositos, total_retiros, ... }
export async function obtenerResumen() {
  const respuesta = await fetch(`${API_URL}/resumen`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener el resumen`);
  }
  return respuesta.json();
}
```

</details>

Los demás archivos finales están en sus puntos de control: `main.jsx` e `index.html` (🏁 1), `Contador.jsx` (🏁 3), `Encabezado.jsx` (🏁 4), `TarjetaResumen.jsx` (🏁 5), `TablaMovimientos.jsx` (🏁 9), `FiltroTipo.jsx` (🏁 10) e `index.css` (paso 50).

> ¿Algo no funciona? Revisa la sección **Problemas comunes** de `ESTUDIANTE.md` o compara con `soluciones/dia2-banco-app`.
