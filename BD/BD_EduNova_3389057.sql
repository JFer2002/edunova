-- PROYECTO: EduNova - Plataforma LMS SaaS
-- APRENDIZ: Juan Fernando Guio Alzate
-- MOTOR: PostgreSQL (Supabase)
-- FICHA: 3389057
-- FECHA: 2026-11-14
-- EVIDENCIAS: GA6-220501096-AA1-EV03, AA2-EV02, AA2-EV03

-- 1. LIMPIEZA (orden inverso a la creación)
DROP TABLE IF EXISTS certificado CASCADE;
DROP TABLE IF EXISTS transaccion CASCADE;
DROP TABLE IF EXISTS evidencia CASCADE;
DROP TABLE IF EXISTS inscripcion CASCADE;
DROP TABLE IF EXISTS curso CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS suscripcion CASCADE;

-- 2. TABLAS INDEPENDIENTES (no tienen llaves foráneas)
CREATE TABLE suscripcion (
    id_suscripcion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_plan VARCHAR(50) NOT NULL,
    precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    fecha_vencimiento DATE NOT NULL
);

-- 3. TABLAS DEPENDIENTES (tienen llaves foráneas)
CREATE TABLE usuario (
    id_usuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('Estudiante', 'Instructor', 'Administrador')),
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    id_suscripcion INT NULL REFERENCES suscripcion (id_suscripcion) ON DELETE SET NULL
);

CREATE TABLE curso (
    id_curso INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    categoria VARCHAR(100) NOT NULL,
    duracion_horas INT NOT NULL CHECK (duracion_horas > 0),
    id_instructor INT NOT NULL REFERENCES usuario (id_usuario) ON DELETE RESTRICT
);

CREATE TABLE evidencia (
    id_evidencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_inscripcion INT NOT NULL,
    url_archivo VARCHAR(255) NOT NULL,
    calificacion NUMERIC(4,2) NULL CHECK (calificacion >= 0 AND calificacion <= 5),
    fecha_envio DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE transaccion (
    id_transaccion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario (id_usuario) ON DELETE RESTRICT,
    id_suscripcion INT NOT NULL REFERENCES suscripcion (id_suscripcion) ON DELETE RESTRICT,
    monto NUMERIC(10,2) NOT NULL CHECK (monto >= 0),
    metodo_pago VARCHAR(50) NOT NULL,
    fecha_pago TIMESTAMPTZ NOT NULL DEFAULT now(),
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('Aprobado', 'Rechazado', 'Pendiente'))
);

CREATE TABLE certificado (
    id_certificado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_inscripcion INT NOT NULL UNIQUE,
    codigo_qr VARCHAR(255) NOT NULL UNIQUE,
    url_pdf VARCHAR(255) NOT NULL,
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 4. TABLAS INTERMEDIAS (relaciones N:M)
CREATE TABLE inscripcion (
    id_inscripcion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    id_curso INT NOT NULL REFERENCES curso (id_curso) ON DELETE CASCADE,
    fecha_matricula DATE NOT NULL DEFAULT CURRENT_DATE,
    estado VARCHAR(50) NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Completado', 'Suspendido')),
    calificacion_final NUMERIC(4,2) NULL CHECK (calificacion_final >= 0 AND calificacion_final <= 5)
);

-- 5. MODIFICACIONES E ÍNDICES
ALTER TABLE evidencia
    ADD CONSTRAINT fk_evidencia_inscripcion
    FOREIGN KEY (id_inscripcion) REFERENCES inscripcion (id_inscripcion) ON DELETE CASCADE;

ALTER TABLE certificado
    ADD CONSTRAINT fk_certificado_inscripcion
    FOREIGN KEY (id_inscripcion) REFERENCES inscripcion (id_inscripcion) ON DELETE CASCADE;

ALTER TABLE usuario
    ADD CONSTRAINT chk_usuario_correo CHECK (correo_electronico LIKE '%@%.%');

CREATE INDEX idx_usuario_suscripcion ON usuario (id_suscripcion);
CREATE INDEX idx_curso_instructor ON curso (id_instructor);
CREATE INDEX idx_inscripcion_usuario_curso ON inscripcion (id_usuario, id_curso);