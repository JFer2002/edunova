# Componentes de interfaz reutilizables — EduNova

Inventario de los componentes que se repiten en las 15 pantallas del prototipo en escala de grises (`prototipo/`).

**Método:** extracción automática de atributos `class` en los 15 archivos HTML, complementada con revisión manual de la estructura semántica. En las listas de pantallas se omite la extensión `.html`.

**Convención de clases propuesta:** nomenclatura en español y modificadores con `--` (ej. `.boton--primario`). Entre paréntesis se indica la clase que existe hoy en `prototipo/prototipo.css`, para poder trazarla sin romper nada.

## 1. Componentes repetidos

| Nombre del componente | Elemento HTML5 semántico principal | Clase CSS propuesta | Pantallas de `prototipo/` donde aparece |
|---|---|---|---|
| Encabezado global | `<header>` | `.encabezado` (actual `.header-principal`) | Todas (15) |
| Marca con etiqueta de rol | `<a>` + `<span>` | `.marca`, `.marca__etiqueta` (actuales `.logo-edunova`, `.logo-badge`) | Todas (15) |
| Navegación superior por rol | `<nav>` + `<ul>` | `.nav-superior`, `.nav-superior__enlace` (actual `.nav-principal`) | 14: index, login, registro, catalogo, detalle-curso, panel-estudiante, mis-cursos, entrega-evidencia, certificados, panel-instructor, crear-curso, calificar-evidencias, panel-admin, gestion-usuarios |
| Enlace de navegación activo | `<a aria-current="page">` | `.nav-superior__enlace--activo` (actual `.activo`) | 14: las mismas anteriores, más aula-modulo (lo usa en el menú lateral); falta en detalle-curso |
| Pie de página | `<footer>` | `.pie` (actual `.footer-principal`) | Todas (15) |
| Contenedor de contenido | `<main>` | `.contenido` (actual `.contenedor-principal`) | Todas (15) |
| Disposición con barra lateral | `<main>` + `<aside>` | `.disposicion-lateral` (actual `.layout-sidebar`) | 11: detalle-curso, panel-estudiante, mis-cursos, aula-modulo, entrega-evidencia, certificados, panel-instructor, crear-curso, calificar-evidencias, panel-admin, gestion-usuarios |
| Panel lateral | `<aside>` | `.panel-lateral` (actual `.sidebar-panel`) | 11: las mismas anteriores |
| Menú lateral por rol | `<nav>` + `<ul>` + `<li>` | `.menu-lateral`, `.menu-lateral__enlace` (actual `.menu-sidebar`) | 10: panel-estudiante, mis-cursos, aula-modulo, entrega-evidencia, certificados, panel-instructor, crear-curso, calificar-evidencias, panel-admin, gestion-usuarios |
| Tarjeta base | `<article>` | `.tarjeta` | 13: todas excepto login y registro |
| Cuerpo de tarjeta | `<div>` | `.tarjeta__cuerpo` (actual `.tarjeta-cuerpo`) | 7: index, catalogo, detalle-curso, panel-estudiante, aula-modulo, panel-instructor, panel-admin |
| Título de tarjeta | `<h3>` | `.tarjeta__titulo` (actual `.tarjeta-titulo`) | 5: index, catalogo, detalle-curso, panel-estudiante, panel-admin |
| Texto descriptivo de tarjeta | `<p>` | `.tarjeta__texto` (actual `.tarjeta-texto`) | 6: index, catalogo, detalle-curso, panel-estudiante, aula-modulo, panel-admin |
| Pie de tarjeta con acciones | `<div>` | `.tarjeta__pie` (actual `.tarjeta-pie`) | 3: index, catalogo, panel-estudiante |
| Cuadrícula de tarjetas | `<div>` o `<section>` | `.rejilla` (actual `.grid-tarjetas`) | 5: index, catalogo, panel-estudiante, panel-instructor, panel-admin |
| Miniatura / placeholder de imagen | `<div>` (ideal `<figure>`) | `.miniatura` (actual `.tarjeta-imagen-placeholder`) | 5: index, catalogo, detalle-curso, aula-modulo, certificados |
| Tarjeta de curso | `<article>` | `.tarjeta-curso` (nueva, compone `.tarjeta` + `.tarjeta__cuerpo` + `.tarjeta__pie`) | 4: index, catalogo, panel-estudiante, mis-cursos (variante horizontal) |
| Tarjeta de métrica | `<article>` | `.tarjeta-metrica`, `.tarjeta-metrica__valor` (hoy resuelta con estilos en línea) | 2: panel-instructor, panel-admin |
| Tarjeta de formulario | `<section>` | `.tarjeta-formulario` | 2: login, registro |
| Etiqueta de estado | `<span>` | `.etiqueta` (actual `.insignia`) | 12: index, catalogo, detalle-curso, panel-estudiante, mis-cursos, aula-modulo, entrega-evidencia, certificados, panel-instructor, calificar-evidencias, panel-admin, gestion-usuarios |
| Etiqueta de estado sólida | `<span>` | `.etiqueta--solida` (actual `.insignia-oscura`) | 9: detalle-curso, panel-estudiante, mis-cursos, aula-modulo, entrega-evidencia, certificados, panel-instructor, calificar-evidencias, gestion-usuarios |
| Tabla de datos | `<table>` + `<thead>` + `<tbody>` | `.tabla-datos` (actual `.tabla-general`) | 8: panel-estudiante, mis-cursos, entrega-evidencia, certificados, panel-instructor, calificar-evidencias, panel-admin, gestion-usuarios |
| Barra de progreso | `<div role="progressbar" aria-valuenow="...">` | `.progreso`, `.progreso__barra`, `.progreso__relleno` (actuales `.contenedor-progreso`, `.barra-progreso-fondo`, `.barra-progreso-relleno`) | 4: panel-estudiante, mis-cursos, certificados, panel-admin |
| Barra de búsqueda y filtros | `<form>` + `<label>` + `<select>` + `<input>` | `.barra-filtros` (hoy maquetada con estilos en línea) | 3: catalogo, calificar-evidencias, gestion-usuarios |
| Grupo de campo | `<div>` | `.campo` (actual `.grupo-campo`) | 8: login, registro, catalogo, aula-modulo, entrega-evidencia, crear-curso, calificar-evidencias, gestion-usuarios |
| Etiqueta de campo | `<label for="...">` | `.campo__etiqueta` | 8: las mismas anteriores |
| Campo de texto, correo y contraseña | `<input type="text" \| "email" \| "password">` | `.campo__control` | 8: las mismas anteriores |
| Selector desplegable | `<select>` | `.campo__control` | 7: login, registro, catalogo, entrega-evidencia, crear-curso, calificar-evidencias, gestion-usuarios |
| Área de texto | `<textarea>` | `.campo__control` | 4: aula-modulo, entrega-evidencia, crear-curso, calificar-evidencias |
| Campo de carga de archivo | `<input type="file">` | `.campo__archivo` | 2: aula-modulo (evidencia desde el aula), entrega-evidencia |
| Casilla de verificación con etiqueta | `<input type="checkbox">` + `<label>` | `.campo-casilla` (actual `.campo-checkbox`) | 2: login (recordar sesión), registro (términos) |
| Botón base | `<button>` o `<a>` | `.boton` (actual `.btn`) | Todas (15) |
| Botón primario | `<button>` o `<a>` | `.boton--primario` (actual `.btn-principal`) | Todas (15) |
| Botón secundario | `<button>` o `<a>` | `.boton--secundario` (actual `.btn-secundario`) | 12: index, detalle-curso, panel-estudiante, mis-cursos, aula-modulo, entrega-evidencia, certificados, panel-instructor, crear-curso, calificar-evidencias, panel-admin, gestion-usuarios |
| Botón de contorno | `<button>` o `<a>` | `.boton--contorno` (actual `.btn-outline`) | 10: index, detalle-curso, mis-cursos, aula-modulo, entrega-evidencia, certificados, crear-curso, calificar-evidencias, panel-admin, gestion-usuarios |
| Modificador de tamaño pequeño | `<button>` o `<a>` | `.boton--sm` (actual `.btn-sm`) | Todas (15) |
| Botón de bloque | `<button>` o `<a>` | `.boton--bloque` (actual `.btn-bloque`) | 4: login, registro, detalle-curso, aula-modulo |
| Grupo de acciones | `<div>` | `.acciones` (hoy resuelto con estilos en línea) | 10: index, detalle-curso, panel-estudiante, mis-cursos, aula-modulo, entrega-evidencia, certificados, panel-instructor, crear-curso, calificar-evidencias, panel-admin, gestion-usuarios (bloques de 2 o más botones) |
| Lista de agenda / sesiones | `<ul>` + `<li>` | `.lista-agenda`, `.lista-agenda__item` | 2: panel-estudiante (próximas sesiones), panel-instructor (agenda de mentorías y evidencias) |
| Párrafo introductorio de sección | `<p>` | `.texto-intro` | 11: catalogo, detalle-curso, panel-estudiante, mis-cursos, aula-modulo (descripción), entrega-evidencia, certificados, panel-instructor, crear-curso, calificar-evidencias, panel-admin, gestion-usuarios |

## 2. Componentes aún no repetidos (candidatos a librería)

| Nombre del componente | Elemento HTML5 semántico principal | Clase CSS propuesta | Pantallas de `prototipo/` donde aparece |
|---|---|---|---|
| Portada / hero con llamada a la acción | `<section>` | `.portada` (actual `.seccion-hero`) | 1: index |
| Bloque de certificado con QR | `<article>` | `.certificado`, `.certificado__qr` | 1: certificados |
| Paginación de resultados | `<nav>` | `.paginacion` | 1: gestion-usuarios |
| Calendario mensual | `<table>` dentro de `<article>` | `.calendario` | 1: panel-estudiante |
| Bloque destacado con fondo gris | `<div>` o `<aside>` | `.bloque-destacado` | 2: aula-modulo (grabaciones), calificar-evidencias (datos de la entrega) |
| Lista de enlaces del pie | `<ul>` | `.pie__enlaces` (actual `.links-footer`) | 1: index |

## 3. Hallazgos de consistencia

| Hallazgo | Detalle | Impacto |
|---|---|---|
| Estilos en línea | 316 atributos `style=""` repartidos en los 15 archivos (panel-instructor 48, panel-admin 31, certificados y crear-curso 30) | Contradice `AGENTS.md`: los estilos deben centralizarse en `styles.css` / `prototipo.css` |
| Encabezado no semántico | `aula-modulo.html` agrupa los enlaces del encabezado en un `<div>` en lugar de `<nav>` | Rompe la consistencia del componente de navegación |
| Estado activo ausente | `detalle-curso.html` no marca ninguna opción de navegación como activa | Menor consistencia visual |
| Tarjetas con estructura variable | Solo 7 de 13 tarjetas usan `.tarjeta-cuerpo`; el resto aplica padding en línea | Dificulta reutilizar un único componente de tarjeta |
| Tablas sin título accesible | Las 8 tablas usan `<th>` correctamente, pero ninguna incluye `<caption>` | Accesibilidad mejorable |
| Progreso sin semántica | Las 4 barras de progreso no declaran `role="progressbar"` ni `aria-valuenow` | Accesibilidad mejorable |
| Componentes inexistentes en CSS | `.tarjeta-metrica`, `.barra-filtros`, `.acciones`, `.lista-agenda`, `.texto-intro`, `.rejilla` se repiten pero se resuelven con estilos en línea | Deben pasar a `prototipo.css` cuando se apruebe la refactorización |

## 4. Orden sugerido de consolidación en `prototipo.css`

1. Estructura: `.encabezado`, `.nav-superior`, `.pie`, `.contenido`, `.disposicion-lateral`.
2. Contenedores: `.tarjeta`, `.tarjeta__cuerpo`, `.tarjeta__pie`, `.rejilla`, `.tarjeta-curso`, `.tarjeta-metrica`.
3. Datos: `.tabla-datos`, `.etiqueta`, `.etiqueta--solida`, `.progreso`.
4. Formularios: `.campo`, `.campo__etiqueta`, `.campo__control`, `.campo__archivo`, `.campo-casilla`, `.barra-filtros`.
5. Acciones: `.boton` y sus modificadores `--primario`, `--secundario`, `--contorno`, `--sm`, `--bloque`.
6. Complementos: `.lista-agenda`, `.texto-intro`, `.portada`, `.certificado`, `.paginacion`, `.calendario`.
