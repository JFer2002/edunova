# Mapa de navegación — EduNova

Mapa de navegación del prototipo de **EduNova**. Todos los nodos sólidos corresponden a pantallas ya construidas en `prototipo/`. Los nodos con borde discontinuo son pantallas previstas que todavía no tienen archivo.

```mermaid
flowchart TD
    %% ===================== ZONA PÚBLICA =====================
    subgraph ZonaPublica ["Zona Pública (Visitantes)"]
        A["index.html<br/>Landing Page"]
        B["login.html<br/>Inicio de Sesión"]
        C["registro.html<br/>Registro de Usuario"]
        D["catalogo.html<br/>Catálogo de Cursos"]
        E["detalle-curso.html<br/>Ficha de Curso"]
    end

    %% ===================== ZONA ESTUDIANTE =====================
    subgraph ZonaEstudiante ["Zona Privada — Estudiante"]
        F["panel-estudiante.html<br/>Dashboard Estudiante"]
        G["mis-cursos.html<br/>Mis Cursos Inscritos"]
        H["aula-modulo.html<br/>Aula Virtual / Módulo"]
        EE["entrega-evidencia.html<br/>Envío de Evidencias"]
        CE["certificados.html<br/>Certificado Digital QR"]
    end

    %% ===================== ZONA INSTRUCTOR =====================
    subgraph ZonaInstructor ["Zona Privada — Instructor"]
        PI["panel-instructor.html<br/>Dashboard Instructor"]
        CC["crear-curso.html<br/>Autoría de Cursos"]
        CLE["calificar-evidencias.html<br/>Calificar Evidencias"]
    end

    %% ===================== ZONA ADMINISTRACIÓN =====================
    subgraph ZonaAdmin ["Zona Privada — Administración"]
        PA["panel-admin.html<br/>Dashboard Administrativo"]
        GU["gestion-usuarios.html<br/>Gestión de Usuarios"]
    end

    %% ===================== PANTALLAS PREVISTAS =====================
    subgraph ZonaPrevista ["Pantallas previstas (sin prototipo aún)"]
        PL["planes.html<br/>Planes y Membresía"]
        MSJ["mensajes.html<br/>Mensajería Interna"]
        NT["notificaciones.html<br/>Panel de Notificaciones"]
        GP["gestion-planes.html<br/>Gestión de Planes"]
    end

    %% ===================== FLUJOS PÚBLICOS =====================
    A -->|Ver catálogo| D
    A -->|Iniciar sesión| B
    A -->|Crear cuenta| C

    B -->|Credenciales válidas · Estudiante| F
    B -->|Credenciales válidas · Instructor| PI
    B -->|Credenciales válidas · Administrador| PA
    B -->|No tiene cuenta| C

    C -->|Registro exitoso| F
    C -->|Ya tiene cuenta| B

    D -->|Buscar y filtrar| D
    D -->|Seleccionar curso| E

    E -->|Inscribirme (sin sesión)| B
    E -->|Inscribirme (con sesión)| G
    E -->|Volver al catálogo| D

    %% ===================== FLUJOS ESTUDIANTE =====================
    F -->|Mis cursos| G
    F -->|Reanudar aprendizaje| H
    F -->|Enviar evidencia| EE
    F -->|Ver certificados| CE
    F -->|Explorar catálogo| D
    F -->|Cerrar sesión| A

    G -->|Entrar a lección| H
    G -->|Enviar evidencia| EE
    G -->|Descargar certificado| CE
    G -->|Buscar más cursos| D

    H -->|Navegar módulos| H
    H -->|Enviar evidencia práctica| EE
    H -->|Volver a mis cursos| G

    EE -->|Ver historial de calificaciones| EE
    EE -->|Volver al aula| H
    EE -->|Ver certificados| CE

    CE -->|Descargar PDF / verificar QR| CE
    CE -->|Volver a mis cursos| G

    %% ===================== FLUJOS INSTRUCTOR =====================
    PI -->|Crear o editar curso| CC
    PI -->|Revisar entregas| CLE
    PI -->|Cerrar sesión| A

    CC -->|Guardar borrador| PI
    CC -->|Enviar a moderación| PI

    CLE -->|Registrar calificación| CLE
    CLE -->|Volver al panel| PI

    %% ===================== FLUJOS ADMINISTRACIÓN =====================
    PA -->|Gestionar usuarios y roles| GU
    PA -->|Moderar cursos| PA
    PA -->|Cerrar sesión| A

    GU -->|Crear / activar / desactivar usuario| GU
    GU -->|Volver al panel| PA

    %% ===================== ENLACES A PANTALLAS PREVISTAS =====================
    F -.->|Ver planes| PL
    F -.->|Ver mensajes| MSJ
    F -.->|Ver notificaciones| NT
    PA -.->|Configurar planes| GP

    %% ===================== ESTILOS =====================
    classDef prevista fill:#f4f4f6,stroke:#999999,stroke-width:1px,stroke-dasharray: 5 5,color:#666666;
    class PL,MSJ,NT,GP prevista;
```

## Leyenda

| Elemento | Significado |
|---|---|
| Nodo sólido | Pantalla HTML construida en `prototipo/` |
| Nodo discontinuo | Pantalla prevista en el alcance, aún sin archivo |
| Flecha continua | Navegación disponible en los enlaces del prototipo |
| Flecha discontinua | Acceso previsto, pendiente de implementar |

## Flujos descritos

### 1. Flujo de visitante
El visitante llega a la landing (`index.html`), desde donde puede explorar el catálogo (`catalogo.html`), abrir la ficha de un curso (`detalle-curso.html`), registrarse (`registro.html`) o iniciar sesión (`login.html`).

### 2. Flujo de autenticación
Desde `login.html` el sistema valida las credenciales y redirige al panel correspondiente al rol:
- **Estudiante** → `panel-estudiante.html`
- **Instructor** → `panel-instructor.html`
- **Administrador** → `panel-admin.html`

### 3. Flujo de aprendizaje (Estudiante)
`panel-estudiante.html` → `mis-cursos.html` → `aula-modulo.html`. En el aula se consumen los módulos secuenciales y se deriva a `entrega-evidencia.html` para subir archivos, enlaces y notas. Al alcanzar el 100% de avance se habilita `certificados.html` con el certificado y su código QR de verificación.

### 4. Flujo de autoría y evaluación (Instructor)
`panel-instructor.html` centraliza los cursos creados y la agenda de mentorías "tú a tú". Desde allí se accede a `crear-curso.html` (datos del curso y módulos ordenados) y a `calificar-evidencias.html` (revisión de entregables, nota y retroalimentación).

### 5. Flujo de administración (Admin)
`panel-admin.html` muestra métricas de la plataforma, distribución de planes y cursos pendientes de moderación. La gestión de cuentas se realiza en `gestion-usuarios.html`, con alta de usuarios por rol y acciones de activar o desactivar.
