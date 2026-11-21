# Historias de usuario — EduNova

Historias alineadas con las necesidades RF-01 a RF-10 de `caso.md` (HU-01 a HU-10) y historias adicionales HU-11 a HU-20 alineadas con los roles RBAC y las entidades de la sección 3.

## HU-01: Interfaz pública (Landing/Home)

- **Descripción:** Como Estudiante, quiero ver la landing pública con la propuesta de valor de EduNova, beneficios principales y accesos directos a registro, planes e inicio de sesión, para conocer la plataforma antes de adquirir mi membresía.
- **Criterios de aceptación:**
  1. Se visualiza la propuesta de valor y beneficios principales en la pantalla de inicio.
  2. Existen enlaces visibles a la página de registro, a la página de planes y al inicio de sesión.
- **Prioridad MoSCoW:** Must

## HU-02: Inicio de sesión por rol

- **Descripción:** Como Estudiante, quiero ingresar con mi correo y contraseña y ser redirigido al Dashboard correspondiente a mi rol, para acceder a mi contenido personalizado.
- **Criterios de aceptación:**
  1. La pantalla de inicio de sesión permite ingresar correo y contraseña con validación de credenciales.
  2. Tras ingreso exitoso, se redirige al dashboard del rol autenticado.
- **Prioridad MoSCoW:** Must

## HU-03: Dashboard personalizado por rol

- **Descripción:** Como Estudiante, quiero ver un dashboard con tarjetas de mis cursos activos con barra de porcentaje de avance, calendario mensual, próximas sesiones en vivo y compromisos pendientes/entregados, para monitorear mi progreso.
- **Criterios de aceptación:**
  1. El dashboard de Estudiante muestra al menos una tarjeta por curso activo con barra de porcentaje de avance.
  2. El dashboard incluye calendario mensual y sección de próximas sesiones en vivo.
- **Prioridad MoSCoW:** Must

## HU-04: Exploración, búsqueda y filtrado de catálogo

- **Descripción:** Como Estudiante, quiero buscar y filtrar el catálogo de cursos y carreras técnicas por categorías y rutas personalizadas, para encontrar la formación más relevante.
- **Criterios de aceptación:**
  1. Existe un buscador en tiempo real que filtra el catálogo visiblemente.
  2. Los filtros por categorías y rutas restringen la lista de resultados mostrada.
- **Prioridad MoSCoW:** Must

## HU-05: Creación y gestión de cursos (autoría)

- **Descripción:** Como Instructor, quiero publicar cursos y definir módulos secuenciales, para ofrecer contenido estructurado a los aprendices.
- **Criterios de aceptación:**
  1. Se puede crear un curso nuevo y editar su título, descripción y categoría en el módulo de autoría.
  2. Los módulos del curso se muestran en orden secuencial en el detalle del curso.
- **Prioridad MoSCoW:** Must

## HU-06: Clases sincrónicas, agendamiento y grabaciones

- **Descripción:** Como Estudiante, quiero agenda interactiva para agendar mentorías "tú a tú", enlaces de sesiones en vivo y reproducción de grabaciones en diferido, para acompañamiento cercano.
- **Criterios de aceptación:**
  1. Existe agenda interactiva de mentorías con fecha y franja horaria.
  2. Los enlaces de sesiones en vivo y la sección de grabaciones en diferido son visibles y utilizables.
- **Prioridad MoSCoW:** Should

## HU-07: Envío de evidencias y registro de calificaciones

- **Descripción:** Como Estudiante, quiero subir mis entregables prácticos (archivos, enlaces y notas) y consultar mi historial de calificaciones, para evaluar mi rendimiento.
- **Criterios de aceptación:**
  1. Se puede cargar una evidencia con archivos y/o notas desde la página de la inscripción.
  2. Historial de calificaciones muestra mis entregas y calificaciones recibidas.
- **Prioridad MoSCoW:** Must

## HU-08: Emisión de certificados verificables

- **Descripción:** Como Estudiante, quiero recibir un certificado digital con código QR validado al culminar un curso o ruta al 100%, para credenciar mi formación.
- **Criterios de aceptación:**
  1. Al alcanzar 100% de avance, se muestra el certificado emitido.
  2. El certificado incluye código QR visible y respaldable.
- **Prioridad MoSCoW:** Should

## HU-09: Gestión de suscripciones y pagos

- **Descripción:** Como Estudiante, quiero comparar los planes (Explorador, Pro, Premium) en cobro Mensual o Anual y actualizar mi membresía, para elegir la opción que mejor se adapte.
- **Criterios de aceptación:**
  1. Se muestra un comparativo visible de planes con sus precios y modalidades.
  2. Se permite seleccionar y confirmar una actualización de estado de membresía.
- **Prioridad MoSCoW:** Must

## HU-10: Comunicación directa y alertas

- **Descripción:** Como Estudiante, quiero mensajes internos con el instructor y un panel de notificaciones, para mantener el contacto y recibir recordatorios de clases o entregas.
- **Criterios de aceptación:**
  1. Existe mensajería interna entre Estudiante e Instructor.
  2. Existe panel de notificaciones/alertas con recordatorios de clases o entregas.
- **Prioridad MoSCoW:** Could

## HU-11: Visualización del calendario de sesiones sincrónicas

- **Descripción:** Como Estudiante, quiero ver mi calendario de sesiones grupales en vivo programadas, para planificar mi asistencia a las clases.
- **Criterios de aceptación:**
  1. Se visualiza calendario con las sesiones/clases en vivo programadas.
  2. Las sesiones muestran su estado (por ejemplo, próxima, en vivo) y capacidad disponible.
- **Prioridad MoSCoW:** Should

## HU-12: Programación y agendamiento de mentorías

- **Descripción:** Como Instructor, quiero programar mentorías individuales con fecha, franja horaria y enlace de videollamada, para otorgar asesoría tú a tú.
- **Criterios de aceptación:**
  1. Se puede crear mentoría con fecha, franja horaria y enlace de videollamada generado automáticamente.
  2. Las mentorías creadas se muestran listadas en la agenda del instructor.
- **Prioridad MoSCoW:** Should

## HU-13: Cálculo automático de avance en inscripción

- **Descripción:** Como Estudiante, quiero que mi porcentaje de avance se calcule automáticamente según módulos completados, para visualizar mi progreso real.
- **Criterios de aceptación:**
  1. El porcentaje de avance se muestra y se calcula con base en módulos del curso.
  2. La barra de progreso refleja el avance calculado.
- **Prioridad MoSCoW:** Must

## HU-14: Gestión de usuarios del sistema

- **Descripción:** Como Administrador, quiero gestionar los usuarios de la plataforma (listar, crear, actualizar y desactivar), para administrar la membresía de la comunidad.
- **Criterios de aceptación:**
  1. Se muestra listado de usuarios con rol y estado visiblemente.
  2. Se pueden crear y desactivar usuarios.
- **Prioridad MoSCoW:** Must

## HU-15: Moderación y aprobación de cursos

- **Descripción:** Como Administrador, quiero moderar y aprobar cursos enviados por instructores, para garantizar la calidad del catálogo público.
- **Criterios de aceptación:**
  1. Se muestra listado de cursos pendientes de revisión.
  2. Se puede aprobar o rechazar cada curso.
- **Prioridad MoSCoW:** Should

## HU-16: Configuración de planes y precios

- **Descripción:** Como Administrador, quiero configurar tipos de planes, precios y modalidades de cobro, para mantener la oferta de membresías actualizada.
- **Criterios de aceptación:**
  1. Se permite definir tipo de plan, precio y modalidad (Mensual/Anual).
  2. Los planes configurados se listan en la pantalla de gestión de planes.
- **Prioridad MoSCoW:** Should

## HU-17: Programación de clases sincrónicas por Instructor

- **Descripción:** Como Instructor, quiero programar clases sincrónicas con enlace de videollamada y capacidad limitada, para impartir formación en vivo.
- **Criterios de aceptación:**
  1. Existe calendario de clases programadas con enlace visible y capacidad definida.
  2. Las clases programadas aparecen listadas con su estado.
- **Prioridad MoSCoW:** Could

## HU-18: Reportes de desempeño de Instructores

- **Descripción:** Como Instructor, quiero consultar métricas de visualización de mis contenidos y desempeño de mis aprendices, para evaluar mi enseñanza.
- **Criterios de aceptación:**
  1. Se visualizan métricas de visualización de mis contenidos.
  2. Se visualiza desempeño (progreso/calificaciones) por aprendiz o curso.
- **Prioridad MoSCoW:** Should

## HU-19: Alertas y notificaciones de entrega

- **Descripción:** Como Estudiante, quiero recibir notificaciones de entrega, calificación y clases próximas, para organizar mi ritmo de aprendizaje.
- **Criterios de aceptación:**
  1. El panel de notificaciones muestra alertas de entrega aceptada/rechazada y calificación recibida.
  2. Hay alertas visibles de clases o sesiones próximas.
- **Prioridad MoSCoW:** Could

## HU-20: Reportes de distribución de ingresos por Gestor Institucional

- **Descripción:** Como Gestor Institucional, quiero consultar el volumen de estudiantes matriculados y distribución de ingresos, para monitorear el rendimiento de los convenios.
- **Criterios de aceptación:**
  1. Se muestra total de estudiantes matriculados bajo el convenio.
  2. Se visualizan datos de distribución de ingresos (Revenue Share).
- **Prioridad MoSCoW:** Could
