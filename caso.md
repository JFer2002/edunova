# Especificación de Contexto del Proyecto: Plataforma LMS EduNova

## 1. Descripción General y Objetivo del Sistema

* **Definición del Producto:** EduNova es una plataforma web educativa integral bajo el modelo SaaS (*Software as a Service*), orientada a la democratización de la formación técnica y cursos cortos autodidactas.
* **Propósito y Objetivo General:** Centralizar, automatizar y optimizar el ecosistema de enseñanza-aprendizaje digital conectando instructores expertos e instituciones educativas (universidades aliadas) con estudiantes. El sistema combina aprendizaje asincrónico a ritmo propio mediante rutas guiadas con acompañamiento cercano en tiempo real (clases sincrónicas y mentorías "tú a tú"), evaluación práctica por proyectos y certificación verificable, garantizando una experiencia intuitiva y libre de fricciones.



## 2. Roles de Usuario y Responsabilidades (RBAC)

El sistema gestiona permisos y vistas personalizadas mediante Control de Acceso Basado en Roles:

* **Estudiante (Aprendiz):** Usuario final que explora el catálogo, adquiere o gestiona su plan de suscripción, consume contenido multimedia asincrónico, agenda y asiste a sesiones en vivo o mentorías individuales, carga evidencias de proyectos prácticos, monitorea su progreso y calificaciones, y descarga certificados digitales.
* **Instructor:** Profesional o docente encargado de crear y estructurar cursos y rutas de aprendizaje, subir material multimedia y documental, programar e impartir clases sincrónicas, calificar las evidencias enviadas por los aprendices y consultar métricas de visualización de sus contenidos.
* **Administrador:** Perfil con privilegios globales encargado de gestionar los usuarios de la plataforma, moderar y aprobar cursos, configurar planes de suscripción y precios, administrar integraciones de pago, personalizar la identidad visual institucional (*White Label*) y auditar el rendimiento operativo y financiero.
* **Gestor Institucional (Universidad Aliada):** Representante de instituciones en convenio que audita el volumen de estudiantes matriculados bajo su alianza y consulta reportes de distribución de ingresos (*Revenue Share*). *(Nota: En la fase actual de prototipo frontend se priorizan las interfaces de Estudiante, Instructor y Administrador, manteniendo este perfil contemplado en la estructura de datos)*.


## 3. Entidades e Información Principal del Sistema

El modelo conceptual del dominio administra las siguientes entidades núcleo y sus relaciones:

* **Usuario (Entidad Base):** Centraliza atributos comunes (`id`, `nombre`, `email`, `contraseña`, `fecha_registro`, `rol`) especializados según el perfil en `Estudiante` (`nivel_educativo`, `intereses`), `Instructor` (`especialidad`, `cuenta_bancaria`) y `Administrador` (`nivel_permisos`).
* **Curso y Módulo / Lección:** Unidades formativas con `id_curso`, `titulo`, `descripcion`, `categoria`, `duracion` y secuencia estructurada de lecciones (videos, documentos PDF y enlaces de apoyo).
* **Ruta de Aprendizaje:** Secuencia guiada y personalizada de cursos organizados progresivamente según el objetivo formativo del estudiante.
* **Inscripción y Progreso:** Entidad intermedia que vincula al estudiante con cada curso (`fecha_inscripcion`, `estado`, porcentaje de avance completado y registro de tiempo de visualización).
* **Sesión Sincrónica y Mentoría:** Clases grupales en vivo (capacidad hasta 50 estudiantes simultáneos) y asesorías individuales "tú a tú" con fecha, franja horaria, enlace automático de videollamada (Zoom/Meet) y grabación disponible en diferido.
* **Evidencia y Calificación:** Entregables prácticos (archivos PDF, Word, Excel, enlaces externos y notas) cargados por el estudiante y evaluados con nota y retroalimentación por el instructor.
* **Certificado:** Diploma digital emitido automáticamente al aprobar un curso o ruta al 100%, equipado con un código QR único para validar su autenticidad.
* **Suscripción y Pago:** Membresías recurrentes (`id_suscripcion`, `tipo`: Explorador, Pro, Premium; `precio`, `modalidad`: Mensual/Anual, `fecha_de_vencimiento`, `estado`) gestionadas mediante pasarelas locales (PSE, Nequi).



## 4. Necesidades Funcionales Clave del Negocio (RF-01 a RF-10)

1. **RF-01 | Interfaz Pública (Home / Landing):** Presentar la propuesta de valor de EduNova, beneficios principales, vista previa de oferta académica y accesos directos a registro, planes e inicio de sesión.
2. **RF-02 | Control de Acceso y Autenticación:** Validar credenciales de usuario (correo y contraseña), gestionar flujos de error o recuperación de clave y redirigir dinámicamente al Dashboard correspondiente al rol autenticado.
3. **RF-03 | Dashboard Personalizado por Rol:** Desplegar un panel de control adaptado al usuario (en Estudiante: tarjetas de cursos activos con barra de porcentaje de avance, calendario mensual, próximas sesiones en vivo y tabla de compromisos pendientes/entregados; en Instructor/Admin: métricas y gestión).
4. **RF-04 | Exploración, Búsqueda y Filtrado de Catálogo:** Permitir localizar cursos y carreras técnicas mediante un buscador en tiempo real, filtros por categorías y rutas de aprendizaje personalizadas.
5. **RF-05 | Creación y Gestión de Cursos (Autoría):** Proveer un módulo para que instructores y administradores publiquen cursos, definan módulos secuenciales y carguen material multimedia o documentos.
6. **RF-06 | Clases Sincrónicas, Agendamiento y Grabaciones:** Ofrecer un calendario interactivo para agendar asesorías "tú a tú", acceder a enlaces de sesiones en vivo y reproducir grabaciones en diferido.
7. **RF-07 | Envío de Evidencias y Registro de Calificaciones:** Habilitar un espacio para que el estudiante suba trabajos prácticos (archivos, enlaces y notas) y consulte su historial de calificaciones.
8. **RF-08 | Emisión de Certificados Verificables:** Generar y visualizar diplomas digitales automáticos al culminar un curso o ruta, incluyendo validación mediante código QR.
9. **RF-09 | Gestión de Suscripciones y Pasarela de Pagos:** Permitir comparar planes (*Explorador*, *Pro*, *Premium* en cobro Mensual o Anual), simular el flujo de pago (PSE, Nequi) y actualizar el estado de membresía del usuario.
10. **RF-10 | Comunicación Directa y Alertas:** Incorporar mensajería interna entre estudiante e instructor junto con un panel de notificaciones y recordatorios de clases o entregas.


## 5. Alcance y Restricciones Técnicas

* **Naturaleza del Entregable (Frontend Standalone):** El desarrollo se limita estrictamente a la capa **Frontend** operando con **datos ficticios (*mock data*)** estructurados en JavaScript (objetos/arreglos JSON y persistencia temporal en `localStorage` / `sessionStorage`), sin conexión a servidores backend ni bases de datos externas.
* **Stack Tecnológico Obligatorio:**
* **HTML5 Semántico:** Uso riguroso de etiquetas estructurales (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) para garantizar accesibilidad, orden documental y limpieza de código.
* **CSS3 Moderno:** Arquitectura de estilos basada en variables CSS (`:root`), Flexbox y CSS Grid, manteniendo una estética moderna, limpia y minimalista.
* **JavaScript Vanilla (ES6+):** Toda la lógica de negocio simulada (autenticación por roles, renderizado dinámico de tarjetas, filtros de búsqueda, cambio de estado de suscripciones, envío de evidencias y calendario) debe implementarse en JS puro sin depender de frameworks frontend pesados.


* **Compatibilidad y Responsividad:** Diseño optimizado prioritariamente para entornos de escritorio (*Desktop-First* en Chrome, Edge, Firefox y Safari) con adaptación responsiva fluida a tablets y dispositivos móviles.
* **Usabilidad, Marca Blanca y Normatividad:** Debe incluir un interruptor funcional de **Modo Oscuro (*Dark Mode*)**, arquitectura de variables preparada para personalización institucional (*White Label*) y enlaces visibles de cumplimiento legal (Política de Privacidad bajo la Ley 1581 de 2012 de Protección de Datos Personales en Colombia).


## 6. Sistema de Diseño UI/UX (Manual de Marca EduNova)

### Sistema Tipográfico (Contraste Jerárquico)

* **Tipografía Primaria — `Poppins`:** Fuente de identidad y escaparate. Se utiliza exclusivamente para el logotipo (`EDUNOVA`), encabezados principales (`H1`, `H2`, `H3`), banners promocionales y títulos de cursos en tarjetas (`Bold` y `Semi-Bold`). No debe emplearse en bloques de texto largos.
* **Tipografía Secundaria — `Inter`:** Fuente funcional diseñada para lectura en pantalla. Se utiliza obligatoriamente en descripciones de cursos, párrafos de más de dos líneas, menús de navegación, etiquetas, formularios e interior de botones (`Regular` 14px–16px y `Medium`).

### Ecosistema de Color (Regla 60% - 30% - 10% y Semánticos)

| Proporción / Rol | Nombre del Color | Código Hex | Regla de Uso y Aplicación en Interfaz |
| --- | --- | --- | --- |
| **Base (60%)** | Blanco Puro | `#FFFFFF` | Fondo general de la web, área principal del Dashboard y espacios de respiración entre componentes. |
| **Base (60%)** | Gris Nube | `#F1F5F9` | Fondo de tarjetas individuales (*cards*), barra lateral (*sidebar*) y agrupación de secciones sin líneas duras. |
| **Estructura (30%)** | Deep Navy | `#1A237E` | Barra de navegación superior (*Navbar*), pie de página (*Footer*), titulares principales (`Poppins`) y tarjeta destacada del plan *Pro*. |
| **Estructura (30%)** | Gris Pizarra | `#475569` | Exclusivo para lectura cómoda en párrafos largos (`Inter`), temarios detallados y textos legales. |
| **Interacción (10%)** | Azul Principal | `#44A5FF` | Color de acción primaria: botones principales (*"Suscribite ahora"*, *"Comprar"*), enlaces de texto y bordes activos (`:focus`) en inputs. |
| **Acentos (10%)** | Coral Vibrante | `#FF6B6B` | Color de urgencia o novedad: etiquetas (*badges*) *"NUEVO"*, indicador de notificaciones sin leer en campana y botones *"ENTRAR AL EN VIVO"*. |
| **Feedback** | Verde Éxito | `#10B981` | Refuerzo positivo: ícono de lección completada (`✓`), barras de progreso al 100%, estado *"Entregado"* y alertas de operación exitosa. |
| **Feedback** | Rojo Alerta | `#EF4444` | Peligro o error: mensajes de validación fallida, credenciales incorrectas, estado *"Pendiente"* crítico y botón *"Cancelar Suscripción"*. |