# Bitácora técnica — Fragmentos representativos de EduNova

**Proyecto:** EduNova (plataforma SaaS tipo LMS)
**Stack:** HTML5 semántico · CSS3 puro · JavaScript Vanilla
**Objetivo del documento:** registrar y explicar, paso a paso, fragmentos breves y representativos de las pantallas finales, del sistema de diseño y de la lógica de interfaz, para dejar trazabilidad técnica de las decisiones tomadas.

> Todos los fragmentos provienen de archivos reales del proyecto en la raíz (`styles.css`, `app.js`) y de las pantallas finales (`*.html`). Los estilos se centralizan en `styles.css`; **no se usa CSS en línea ni frameworks externos**.

---

## 1) HTML5 semántico — `gestion-usuarios.html`

Fragmento de la tabla de usuarios (se omite parte de las filas con `…`):

```html
<main id="contenido-principal" class="contenido">
  <div class="disposicion-lateral">

    <aside class="panel-lateral" aria-label="Información del administrador">
      …
    </aside>

    <div class="formulario">

      <section aria-labelledby="titulo-lista-usuarios">
        <h2 id="titulo-lista-usuarios">Usuarios registrados</h2>

        <div id="mensaje-usuarios" role="status" aria-live="polite" tabindex="-1"></div>

        <div class="tabla-contenedor">
          <table class="tabla-datos" id="lista-usuarios">
            <caption>Listado de cuentas registradas con su rol, plan y estado de acceso</caption>
            <thead>
              <tr>
                <th scope="col">Nombre completo</th>
                <th scope="col">Correo electrónico</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr data-usuario data-nombre="Ana Torres"
                  data-correo="ana.torres@ejemplo.com"
                  data-rol="estudiante" data-estado="activo">
                <th scope="row">Ana Torres</th>
                <td>ana.torres@ejemplo.com</td>
                <td><span class="etiqueta etiqueta--info">Estudiante</span></td>
                <td><span class="etiqueta etiqueta--exito" data-estado-usuario>Activo</span></td>
                <td>
                  <div class="tabla-datos__acciones">
                    <button class="boton boton--peligro boton--sm" type="button"
                            data-accion="cambiar-estado-usuario">Desactivar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </div>
</main>
```

### Cómo funciona, paso a paso

1. **`<main id="contenido-principal">`**: define la región principal única de la página. El `id` coincide con el enlace «Saltar al contenido principal» (`<a class="saltar-contenido" href="#contenido-principal">`), lo que permite a usuarios de teclado y lectores de pantalla saltar la navegación.
2. **`<aside aria-label="…">`**: el panel lateral se marca como contenido complementario; `aria-label` le da un nombre accesible («Información del administrador»).
3. **`<section aria-labelledby="titulo-lista-usuarios">`**: agrupa contenido con un título propio. `aria-labelledby` enlaza la sección con el `<h2 id="titulo-lista-usuarios">`, de modo que el lector de pantalla anuncia «Usuarios registrados, sección».
4. **`<div id="mensaje-usuarios" role="status" aria-live="polite" tabindex="-1">`**: es la «zona viva» donde JavaScript escribe mensajes de éxito o error. `role="status"` + `aria-live="polite"` hacen que se anuncie sin interrumpir; `tabindex="-1"` permite enfocarla por código (`contenedor.focus()`) para llevar allí el foco.
5. **`<div class="tabla-contenedor">`**: envoltorio que permite desplazamiento horizontal en pantallas pequeñas (`overflow-x:auto`) sin romper el layout.
6. **`<table>` + `<caption>`**: el `caption` describe el contenido de la tabla (obligatorio en el proyecto). Los datos semánticos van en `<thead>`/`<tbody>`.
7. **`<th scope="col">` / `<th scope="row">`**: `scope="col"` indica que el encabezado aplica a su columna; `scope="row"` que «Ana Torres» encabeza su fila. Así las tecnologías de asistencia relacionan cada celda con sus encabezados.
8. **Atributos `data-*`**: `data-usuario`, `data-nombre`, `data-correo`, `data-rol`, `data-estado` son ganchos para JavaScript (se leen vía `fila.dataset`). No son estilos ni contenido visible.
9. **`<button type="button" data-accion="cambiar-estado-usuario">`**: `type="button"` evita envíos accidentales de formulario; `data-accion` identifica la acción que un único manejador global de clics resolverá.

---

## 2) `styles.css` — variables `:root` y Grid/Flexbox

### a) Tokens de diseño en `:root` (extracto)

```css
:root {
  /* 1. Capa de marca (valores fijos del manual) */
  --marca-navy: #1A237E;
  --marca-azul: #44A5FF;
  --marca-blanco: #FFFFFF;
  --marca-pizarra: #475569;

  /* 2. Capa semántica (regla 60/30/10) */
  --color-fondo: var(--marca-blanco);
  --color-titulo: var(--marca-navy);
  --color-texto: var(--marca-pizarra);
  --color-accion: var(--marca-azul);
  --color-accion-texto: var(--marca-navy);

  /* 3. Espaciado, radios y estructura */
  --espacio-6: 1.5rem;
  --radio-md: 8px;
  --ancho-contenido: 1200px;
  --ancho-sidebar: 260px;
}
```

### b) Grid y Flexbox (extracto real del archivo)

```css
.disposicion-lateral {
  display: grid;
  grid-template-columns: var(--ancho-sidebar) minmax(0, 1fr);
  gap: var(--espacio-8);
  align-items: start;
}

.encabezado__contenedor {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--espacio-3);
}

.rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: var(--espacio-6);
}
```

### Cómo funciona, paso a paso

1. **Tres capas de tokens**: primero los colores de **marca** (valores fijos), luego los **semánticos** que apuntan a la marca (`--color-titulo: var(--marca-navy)`) y por último las utilidades (espaciado, radios, anchos). Esta indirección permite cambiar un color de marca en un solo lugar y, además, habilita el modo oscuro reasignando solo la capa semántica (`[data-tema="oscuro"]`).
2. **Regla 60/30/10**: la capa semántica está comentada por proporción de uso (base/superficies, estructura/lectura, interacción/acento) para que el color no se aplique al azar.
3. **`.disposicion-lateral` con Grid**: `grid-template-columns: var(--ancho-sidebar) minmax(0, 1fr)` fija la barra lateral (260 px) y deja que el contenido ocupe el resto. `minmax(0, 1fr)` es clave: evita que el contenido desborde la columna (el `0` permite encogerse por debajo del tamaño intrínseco). `align-items: start` alinea arriba.
4. **`.encabezado__contenedor` con Flexbox**: `display:flex` + `flex-wrap:wrap` permite que la marca, el menú y los botones se reacomoden en varias líneas; `justify-content: space-between` separa los grupos; `align-items:center` y `gap` mantienen alineación y separación uniformes.
5. **`.rejilla` responsive «sin media queries»**: `repeat(auto-fit, minmax(min(100%, 260px), 1fr))` crea tantas columnas como caben con mínimo 260 px, y `min(100%, 260px)` evita desbordamiento en móviles (nunca exige más ancho que el contenedor). Con una sola regla se pasa de 1 a N columnas.
6. **Todo con variables**: ni un color o medida «suelta» en estas reglas; se consumen tokens, lo que mantiene consistencia y facilita temas.

---

## 3) `app.js` — validación de formularios y manipulación del DOM

### a) Validación por reglas declarativas (extracto de `validarCampo`)

```js
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validarCampo = function (campo) {
  // El HTML declara reglas en data-validacion="requerido correo"
  const reglas = (campo.dataset.validacion || '').split(/\s+/).filter(Boolean);
  const esCasilla = campo.type === 'checkbox';
  const valor = esCasilla ? campo.checked : campo.value.trim();
  let mensaje = '';

  for (let i = 0; i < reglas.length; i += 1) {
    const regla = reglas[i];
    if (regla === 'requerido' && !esCasilla && valor === '') {
      mensaje = 'Este campo es obligatorio.';
    } else if (regla === 'nombre' && valor !== '' && valor.length < 3) {
      mensaje = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
    } else if (regla === 'correo' && valor !== '' && !REGEX_CORREO.test(valor)) {
      mensaje = 'Ingresa un correo válido (ejemplo@dominio.com).';
    } else if (regla === 'nota' && valor !== '') {
      const n = Number(valor);
      if (!Number.isFinite(n) || n < 0 || n > 100) {
        mensaje = 'Ingresa una nota entre 0 y 100.';
      }
    }
    if (mensaje) break;
  }

  if (mensaje) {
    mostrarErrorCampo(campo, mensaje); // pinta error + aria-invalid
    return false;
  }
  limpiarErrorCampo(campo);
  return true;
};
```

### b) Conexión de eventos y envío (extracto de `inicializarValidacion`)

```js
const inicializarValidacion = function () {
  qsa('form[data-formulario]').forEach(function (formulario) {
    const contenedor = qs('[data-mensaje-formulario]', formulario);
    const campos = qsa('input, select, textarea', formulario)
      .filter(function (campo) { return campo.dataset.validacion; });

    campos.forEach(function (campo) {
      campo.addEventListener('blur', function () { validarCampo(campo); });
      campo.addEventListener('input', function () {
        if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
      });
    });

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      limpiarMensaje(contenedor);

      // Se reconsultan los campos para incluir los añadidos por JS
      const camposActuales = qsa('input, select, textarea', formulario)
        .filter(function (campo) { return campo.dataset.validacion; });
      const valido = camposActuales.map(validarCampo).indexOf(false) === -1;

      if (!valido) {
        mostrarMensaje(contenedor, 'error', 'Revisa la información',
          'Hay campos que necesitan corrección antes de continuar.');
        formulario.querySelector('[aria-invalid="true"]').focus();
        return;
      }
      // …despacho según formulario.dataset.formulario (login, curso, usuario…)
    });
  });
};
```

### c) Mensaje accesible en el DOM (función que usan validación y acciones)

```js
const mostrarMensaje = function (contenedor, tipo, titulo, texto) {
  if (!contenedor) return;
  contenedor.replaceChildren();
  const mensaje = document.createElement('div');
  mensaje.className = 'mensaje mensaje--' + tipo; // reutiliza clases CSS
  const t = document.createElement('p');
  t.className = 'mensaje__titulo';
  t.textContent = titulo;
  mensaje.append(t);
  if (texto) {
    const p = document.createElement('p');
    p.textContent = texto;
    mensaje.append(p);
  }
  contenedor.append(mensaje);
};
```

### Cómo funciona, paso a paso

1. **Validación declarativa desde el HTML**: cada campo lleva `data-validacion="requerido correo"`. JavaScript lee `campo.dataset.validacion`, lo parte por espacios y ejecuta cada regla en orden, deteniéndose en la primera que falle (`break`). Así se agregan reglas sin tocar la lógica central.
2. **Tipo de valor según el control**: para `checkbox` se evalúa `campo.checked`; para el resto `campo.value.trim()` (se eliminan espacios accidentales). Esto evita falsos positivos.
3. **Coincidencia de contraseñas y adjuntos**: reglas especiales usan `data-*` para localizar otros elementos (`data-coincide-con`, `data-evidencia-grupo`, `data-evidencia-enlace`), cubriendo casos cruzados sin duplicar funciones.
4. **Feedback visual + accesible**: `mostrarErrorCampo()` escribe el texto en el contenedor `#<id>-error`, lo muestra (`hidden = false`) y marca `aria-invalid="true"` (el CSS `.campo__control[aria-invalid="true"]` pinta el borde rojo). `limpiarErrorCampo()` hace lo inverso.
5. **Validación en vivo**: `blur` valida al salir del campo; `input` revalida solo si ya estaba inválido (no molesta mientras se escribe por primera vez). Así el usuario corrige de inmediato.
6. **Envío controlado**: en `submit` se hace `preventDefault()` (sin recargar), se limpia el mensaje previo, se **reconsultan** los campos (importante: módulos añadidos dinámicamente no existían al cargar) y se validan todos. Si alguno falla, se muestra un mensaje resumen y se enfoca el primer `[aria-invalid="true"]`.
7. **Mensajes accesibles sin innerHTML**: `mostrarMensaje()` crea nodos con `createElement`/`textContent` (evita inyección de HTML), reutiliza las clases `.mensaje--exito/error/alerta/info` y escribe dentro del contenedor `role="status" aria-live="polite"`, por lo que el resultado se anuncia a lectores de pantalla.
8. **Despacho por tipo de formulario**: el `data-formulario` (`login`, `curso`, `usuario`, `calificacion`…) decide qué simulación ejecutar, manteniendo un único punto de validación para todas las pantallas.

---

## 4) Flujo que conecta los tres bloques

1. **HTML** aporta estructura semántica y «contratos» de datos (`data-validacion`, `data-accion`, `data-usuario`, `id` de mensajes).
2. **CSS** da forma con tokens (`:root`) y layout con Grid/Flex sin estilos en línea.
3. **JavaScript** lee esos contratos, valida, cambia el DOM y escribe mensajes en las zonas vivas; las clases que añade (`etiqueta--error`, `mensaje--exito`) ya existen en el CSS.

**Ejemplo encadenado:** un `<input data-validacion="requerido correo">` → al salir se valida → si falla, JS pone `aria-invalid="true"` → la regla CSS colorea el borde → el error aparece en su `#…-error`; al enviar el formulario, el mensaje se escribe en el contenedor `role="status"`.

---

## 5) Evidencia de verificación

- `node --check app.js` → sintaxis correcta.
- Pantallas finales: **0** atributos `style="`; todas las tablas con `<caption>` y `<th scope>`; todos los `<label for>` con destino válido.
- Sin modificaciones en `plantilla.html`, `prototipo/`, `BD/` ni `referencia/`.

---

## 6) Convenciones resumidas del proyecto

- **Idioma:** todo el código, comentarios, etiquetas y textos visibles en español.
- **Estilos:** un único `styles.css` en la raíz, con variables CSS en `:root` y clases reutilizables; sin CSS en línea.
- **Formularios:** cada `<input>`, `<select>` y `<textarea>` tiene su `<label for="...">` asociado y mensajes de error en contenedores con `aria-live`.
- **Tablas:** siempre con `<caption>` y encabezados `<th scope="col|row">`.
- **Accesibilidad:** enlace «Saltar al contenido», `aria-labelledby` en secciones, `role="status"`/`aria-live` en zonas de mensajes y foco gestionado por JavaScript.
