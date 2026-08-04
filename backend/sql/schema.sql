-- ============================================================
--  TUPA UNSAAC  –  v5.1  (PostgreSQL + Auth Tables)
-- ============================================================

DROP TABLE IF EXISTS password_reset_token CASCADE;
DROP TABLE IF EXISTS activation_token CASCADE;
DROP TABLE IF EXISTS refresh_token CASCADE;
DROP TABLE IF EXISTS notificacion CASCADE;
DROP TABLE IF EXISTS seguimiento CASCADE;
DROP TABLE IF EXISTS observacion CASCADE;
DROP TABLE IF EXISTS documento CASCADE;
DROP TABLE IF EXISTS solicitud CASCADE;
DROP TABLE IF EXISTS requisito CASCADE;
DROP TABLE IF EXISTS tramite CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;
DROP TABLE IF EXISTS usuario_admin CASCADE;
DROP TABLE IF EXISTS usuario_general CASCADE;
DROP TABLE IF EXISTS especialidad CASCADE;

-- ============================================================
--  1. ESPECIALIDAD
-- ============================================================
CREATE TABLE especialidad (
    cod_especialidad     VARCHAR(3)   PRIMARY KEY,
    nombre_especialidad  VARCHAR(100) NOT NULL,
    facultad             VARCHAR(150)
);

-- ============================================================
--  2. USUARIO GENERAL
-- ============================================================
CREATE TABLE usuario_general (
    id_usuario           SERIAL        PRIMARY KEY,
    dni                  VARCHAR(10)   NOT NULL UNIQUE,
    codigo_universitario VARCHAR(20)   UNIQUE,
    nombres              VARCHAR(50)   NOT NULL,
    ap_paterno           VARCHAR(50)   NOT NULL,
    ap_materno           VARCHAR(50),
    email_institucional  VARCHAR(100)  NOT NULL UNIQUE,
    email_personal       VARCHAR(100),
    telefono             VARCHAR(15),
    semestre_actual      VARCHAR(30),
    avatar_url           VARCHAR(300),
    avatar_contenido     BYTEA,
    avatar_mime_type     VARCHAR(100),
    password_hash        VARCHAR(200)  NOT NULL,
    cod_especialidad     VARCHAR(3)    REFERENCES especialidad(cod_especialidad),
    activo               BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
--  3. USUARIO ADMIN
-- ============================================================
CREATE TABLE usuario_admin (
    id_admin             SERIAL        PRIMARY KEY,
    dni                  VARCHAR(10)   NOT NULL UNIQUE,
    codigo_trabajador    VARCHAR(20)   UNIQUE,
    nombres              VARCHAR(50)   NOT NULL,
    ap_paterno           VARCHAR(50)   NOT NULL,
    ap_materno           VARCHAR(50),
    email_institucional  VARCHAR(100)  NOT NULL UNIQUE,
    telefono             VARCHAR(15),
    rol_admin            VARCHAR(20)   NOT NULL DEFAULT 'ADMIN' CHECK (rol_admin IN ('ADMIN', 'SUPER_ADMIN')),
    avatar_url           VARCHAR(300),
    avatar_contenido     BYTEA,
    avatar_mime_type     VARCHAR(100),
    password_hash        VARCHAR(200)  NOT NULL,
    activo               BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
--  4. TABLAS DE AUTENTICACIÓN (TOKENS)
-- ============================================================
CREATE TABLE refresh_token (
    id_refresh      SERIAL        PRIMARY KEY,
    id_usuario      INT           NOT NULL,
    rol             VARCHAR(10)   NOT NULL CHECK (rol IN ('USER', 'ADMIN')),
    token           TEXT          NOT NULL UNIQUE,
    expires_at      TIMESTAMP     NOT NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    revoked         BOOLEAN       NOT NULL DEFAULT FALSE
);

CREATE TABLE activation_token (
    id_activacion   SERIAL        PRIMARY KEY,
    id_usuario      INT           NOT NULL REFERENCES usuario_general(id_usuario) ON DELETE CASCADE,
    token           UUID          NOT NULL UNIQUE,
    expires_at      TIMESTAMP     NOT NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    used            BOOLEAN       NOT NULL DEFAULT FALSE,
    used_at         TIMESTAMP
);

CREATE TABLE password_reset_token (
    id_reset        SERIAL        PRIMARY KEY,
    id_usuario      INT           NOT NULL,
    rol             VARCHAR(10)   NOT NULL CHECK (rol IN ('USER', 'ADMIN')),
    codigo          VARCHAR(6)    NOT NULL,
    reset_token     UUID,
    intentos        SMALLINT      NOT NULL DEFAULT 0,
    expires_at      TIMESTAMP     NOT NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    used            BOOLEAN       NOT NULL DEFAULT FALSE,
    used_at         TIMESTAMP
);

-- ============================================================
--  5. CATEGORIA
-- ============================================================
CREATE TABLE categoria (
    id_categoria         SERIAL        PRIMARY KEY,
    nombre_categoria     VARCHAR(80)   NOT NULL,
    icono                VARCHAR(45),
    activo               BOOLEAN       NOT NULL DEFAULT TRUE
);

-- ============================================================
--  6. TRAMITE
-- ============================================================
CREATE TABLE tramite (
    cod_tramite          VARCHAR(20)   PRIMARY KEY,
    id_categoria         INT           REFERENCES categoria(id_categoria),
    nombre_tramite       VARCHAR(200)  NOT NULL,
    descripcion          TEXT,
    base_legal           TEXT,
    precio               NUMERIC(10,2) NOT NULL DEFAULT 0,
    dias_habiles         INT           NOT NULL DEFAULT 1,
    unidad_responsable   VARCHAR(100),
    vigente              BOOLEAN       NOT NULL DEFAULT TRUE
);

-- ============================================================
--  7. REQUISITO
-- ============================================================
CREATE TABLE requisito (
    id_requisito         SERIAL        PRIMARY KEY,
    cod_tramite          VARCHAR(20)   NOT NULL REFERENCES tramite(cod_tramite),
    descripcion_requisito VARCHAR(400) NOT NULL,
    es_obligatorio       BOOLEAN       NOT NULL DEFAULT TRUE,
    orden                INT           NOT NULL DEFAULT 1
);

-- ============================================================
--  8. SOLICITUD
-- ============================================================
CREATE TABLE solicitud (
    id_solicitud        SERIAL         PRIMARY KEY,
    numero_expediente   VARCHAR(50)    UNIQUE,
    id_usuario          INT            NOT NULL REFERENCES usuario_general(id_usuario),
    cod_tramite         VARCHAR(20)    NOT NULL REFERENCES tramite(cod_tramite),
    paso_actual         SMALLINT       NOT NULL DEFAULT 1 CHECK (paso_actual BETWEEN 1 AND 6),
    fecha_solicitud     TIMESTAMP      NOT NULL DEFAULT NOW(),
    estado              VARCHAR(20)    NOT NULL DEFAULT 'BORRADOR'
                        CHECK (estado IN (
                            'BORRADOR',
                            'SOLICITADO',
                            'VERIFICANDO_PAGO',
                            'PAGADO',
                            'EN PROCESO',
                            'SUBSANACION',
                            'OBSERVADO',
                            'COMPLETADO',
                            'ANULADO',
                            'RECHAZADO'
                        )),
    prioridad           VARCHAR(20)    NOT NULL DEFAULT 'NORMAL' CHECK (prioridad IN ('BAJA', 'NORMAL', 'URGENTE')),
    etapa_visible       VARCHAR(40)    DEFAULT 'Recibido',
    monto_total         NUMERIC(10,2),
    nro_recibo          VARCHAR(20),
    fecha_pago          TIMESTAMP,
    fecha_limite        TIMESTAMP,
    observacion_interna TEXT
);

-- ============================================================
--  9. DOCUMENTO
-- ============================================================
CREATE TABLE documento (
    id_documento        SERIAL         PRIMARY KEY,
    id_solicitud        INT            NOT NULL REFERENCES solicitud(id_solicitud),
    id_requisito        INT            REFERENCES requisito(id_requisito),
    nombre_archivo      VARCHAR(200)   NOT NULL,
    ruta_archivo        VARCHAR(300),
    tamano_bytes        BIGINT,
    mime_type           VARCHAR(100),
    contenido           BYTEA,
    estado_validacion   VARCHAR(20)    NOT NULL DEFAULT 'PENDIENTE'
                        CHECK (estado_validacion IN (
                            'PENDIENTE',
                            'APROBADO',
                            'RECHAZADO'
                        )),
    fecha_subida        TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
--  10. OBSERVACION
-- ============================================================
CREATE TABLE observacion (
    id_observacion      SERIAL         PRIMARY KEY,
    id_solicitud        INT            NOT NULL REFERENCES solicitud(id_solicitud),
    id_admin            INT            NOT NULL REFERENCES usuario_admin(id_admin),
    id_documento        INT            REFERENCES documento(id_documento),
    descripcion         TEXT           NOT NULL,
    estado              VARCHAR(20)    NOT NULL DEFAULT 'PENDIENTE'
                        CHECK (estado IN (
                            'PENDIENTE',
                            'SUBSANADO',
                            'CERRADO'
                        )),
    fecha_creacion      TIMESTAMP      NOT NULL DEFAULT NOW(),
    fecha_respuesta     TIMESTAMP,
    fecha_limite_subsanacion TIMESTAMP
);

-- ============================================================
--  11. SEGUIMIENTO
-- ============================================================
CREATE TABLE seguimiento (
    id_seguimiento      SERIAL         PRIMARY KEY,
    id_solicitud        INT            NOT NULL REFERENCES solicitud(id_solicitud),
    id_usuario_admin    INT            NOT NULL REFERENCES usuario_admin(id_admin),
    estado_anterior     VARCHAR(20),
    estado_nuevo        VARCHAR(20)    NOT NULL,
    etapa_visible       VARCHAR(40),
    comentario          TEXT,
    fecha_cambio        TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
--  12. NOTIFICACION
-- ============================================================
CREATE TABLE notificacion (
    id_notificacion     SERIAL         PRIMARY KEY,
    id_usuario          INT            NOT NULL REFERENCES usuario_general(id_usuario),
    id_solicitud        INT            REFERENCES solicitud(id_solicitud),
    tipo                VARCHAR(20)    NOT NULL DEFAULT 'ESTADO'
                        CHECK (tipo IN (
                            'ESTADO',
                            'OBSERVACION',
                            'PAGO',
                            'VENCIMIENTO'
                        )),
    asunto              VARCHAR(100)   NOT NULL,
    mensaje             TEXT           NOT NULL,
    leida               BOOLEAN        NOT NULL DEFAULT FALSE,
    fecha_envio         TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
--  ÍNDICES
-- ============================================================
CREATE INDEX idx_usuario_general_dni ON usuario_general(dni);
CREATE INDEX idx_usuario_general_email ON usuario_general(email_institucional);
CREATE INDEX idx_usuario_general_codigo ON usuario_general(codigo_universitario);

CREATE INDEX idx_usuario_admin_dni ON usuario_admin(dni);
CREATE INDEX idx_usuario_admin_email ON usuario_admin(email_institucional);
CREATE INDEX idx_usuario_admin_codigo ON usuario_admin(codigo_trabajador);

CREATE INDEX idx_refresh_token_token ON refresh_token(token);
CREATE INDEX idx_refresh_token_usuario ON refresh_token(id_usuario, rol);

CREATE INDEX idx_activation_token_token ON activation_token(token);
CREATE INDEX idx_activation_token_usuario ON activation_token(id_usuario);

CREATE INDEX idx_password_reset_usuario ON password_reset_token(id_usuario, rol);
CREATE INDEX idx_password_reset_token ON password_reset_token(reset_token);

CREATE INDEX idx_tramite_categoria ON tramite(id_categoria);
CREATE INDEX idx_tramite_vigente ON tramite(vigente);

CREATE INDEX idx_requisito_tramite ON requisito(cod_tramite);

CREATE INDEX idx_solicitud_usuario ON solicitud(id_usuario);
CREATE INDEX idx_solicitud_tramite ON solicitud(cod_tramite);
CREATE INDEX idx_solicitud_estado ON solicitud(estado);
CREATE INDEX idx_solicitud_fecha ON solicitud(fecha_solicitud);
CREATE INDEX idx_solicitud_expediente ON solicitud(numero_expediente);

CREATE INDEX idx_documento_solicitud ON documento(id_solicitud);
CREATE INDEX idx_documento_requisito ON documento(id_requisito);

CREATE INDEX idx_observacion_solicitud ON observacion(id_solicitud);
CREATE INDEX idx_observacion_estado ON observacion(id_solicitud, estado);

CREATE INDEX idx_seguimiento_solicitud ON seguimiento(id_solicitud);

CREATE INDEX idx_notif_usuario ON notificacion(id_usuario);
CREATE INDEX idx_notif_no_leida ON notificacion(id_usuario, leida) WHERE leida = FALSE;
