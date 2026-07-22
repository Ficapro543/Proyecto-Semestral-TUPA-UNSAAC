-- ============================================================
--  TUPA UNSAAC  –  v4  (PostgreSQL)
--  Modelo simplificado con:
--  - usuario_general
--  - usuario_admin
-- ============================================================

-- ============================================================
--  1. ESPECIALIDAD
-- ============================================================
CREATE TABLE especialidad (
    cod_especialidad     VARCHAR(3)   PRIMARY KEY,
    nombre_especialidad  VARCHAR(100) NOT NULL
);

-- ============================================================
--  2. USUARIO GENERAL
--  Usuarios que realizan trámites
-- ============================================================
CREATE TABLE usuario_general (
    id_usuario        SERIAL        PRIMARY KEY,
    dni               VARCHAR(10)   NOT NULL UNIQUE,
    nombres           VARCHAR(50)   NOT NULL,
    ap_paterno        VARCHAR(50)   NOT NULL,
    ap_materno        VARCHAR(50),

    email             VARCHAR(100)  NOT NULL UNIQUE,
    telefono          VARCHAR(15),

    password_hash     VARCHAR(200)  NOT NULL,

    cod_especialidad  VARCHAR(3)
                      REFERENCES especialidad(cod_especialidad),

    activo            BOOLEAN       NOT NULL DEFAULT TRUE,

    created_at        TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
--  3. USUARIO ADMIN
--  Personal administrativo del sistema
-- ============================================================
CREATE TABLE usuario_admin (
    id_admin          SERIAL        PRIMARY KEY,

    dni               VARCHAR(10)   NOT NULL UNIQUE,

    nombres           VARCHAR(50)   NOT NULL,
    ap_paterno        VARCHAR(50)   NOT NULL,
    ap_materno        VARCHAR(50),

    email             VARCHAR(100)  NOT NULL UNIQUE,
    telefono          VARCHAR(15),

    password_hash     VARCHAR(200)  NOT NULL,

    activo            BOOLEAN       NOT NULL DEFAULT TRUE,

    created_at        TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
--  4. CATEGORIA
-- ============================================================
CREATE TABLE categoria (
    id_categoria      SERIAL        PRIMARY KEY,
    nombre_categoria  VARCHAR(80)   NOT NULL,
    icono             VARCHAR(45),
    activo            BOOLEAN       NOT NULL DEFAULT TRUE
);

-- ============================================================
--  5. TRAMITE
-- ============================================================
CREATE TABLE tramite (
    cod_tramite         VARCHAR(20)   PRIMARY KEY,

    id_categoria        INT
                         REFERENCES categoria(id_categoria),

    nombre_tramite      VARCHAR(200)  NOT NULL,

    descripcion         TEXT,

    base_legal          TEXT,

    precio              NUMERIC(10,2) NOT NULL DEFAULT 0,

    dias_habiles        INT           NOT NULL DEFAULT 1,

    unidad_responsable  VARCHAR(100),

    vigente             BOOLEAN       NOT NULL DEFAULT TRUE
);

-- ============================================================
--  6. REQUISITO
-- ============================================================
CREATE TABLE requisito (
    id_requisito          SERIAL        PRIMARY KEY,

    cod_tramite           VARCHAR(20)   NOT NULL
                          REFERENCES tramite(cod_tramite),

    descripcion_requisito VARCHAR(400)  NOT NULL,

    es_obligatorio        BOOLEAN       NOT NULL DEFAULT TRUE,

    orden                 INT           NOT NULL DEFAULT 1
);

-- ============================================================
--  7. SOLICITUD
-- ============================================================
CREATE TABLE solicitud (
    id_solicitud        SERIAL         PRIMARY KEY,

    id_usuario          INT            NOT NULL
                        REFERENCES usuario_general(id_usuario),

    cod_tramite         VARCHAR(20)    NOT NULL
                        REFERENCES tramite(cod_tramite),

    paso_actual         SMALLINT       NOT NULL DEFAULT 1
                        CHECK (paso_actual BETWEEN 1 AND 6),

    fecha_solicitud     TIMESTAMP      NOT NULL DEFAULT NOW(),

    estado              VARCHAR(20)    NOT NULL DEFAULT 'BORRADOR'
                        CHECK (estado IN (
                            'BORRADOR',
                            'SOLICITADO',
                            'EN PROCESO',
                            'PAGADO',
                            'SUBSANACION',
                            'COMPLETADO',
                            'ANULADO'
                        )),

    etapa_visible       VARCHAR(40)    DEFAULT 'Recibido',

    monto_total         NUMERIC(10,2),

    nro_recibo          VARCHAR(20),

    fecha_pago          TIMESTAMP,

    fecha_limite        TIMESTAMP,

    observacion_interna TEXT
);

-- ============================================================
--  8. DOCUMENTO
-- ============================================================
CREATE TABLE documento (
    id_documento        SERIAL         PRIMARY KEY,

    id_solicitud        INT            NOT NULL
                        REFERENCES solicitud(id_solicitud),

    id_requisito        INT
                        REFERENCES requisito(id_requisito),

    nombre_archivo      VARCHAR(200)   NOT NULL,

    ruta_archivo        VARCHAR(300)   NOT NULL,

    tamano_bytes        BIGINT,

    estado_validacion   VARCHAR(20)    NOT NULL DEFAULT 'PENDIENTE'
                        CHECK (estado_validacion IN (
                            'PENDIENTE',
                            'APROBADO',
                            'RECHAZADO'
                        )),

    fecha_subida        TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
--  9. OBSERVACION
-- ============================================================
CREATE TABLE observacion (
    id_observacion     SERIAL         PRIMARY KEY,

    id_solicitud       INT            NOT NULL
                       REFERENCES solicitud(id_solicitud),

    id_admin           INT            NOT NULL
                       REFERENCES usuario_admin(id_admin),

    id_documento       INT
                       REFERENCES documento(id_documento),

    descripcion        TEXT           NOT NULL,

    estado             VARCHAR(20)    NOT NULL DEFAULT 'PENDIENTE'
                       CHECK (estado IN (
                           'PENDIENTE',
                           'SUBSANADO',
                           'CERRADO'
                       )),

    fecha_creacion     TIMESTAMP      NOT NULL DEFAULT NOW(),

    fecha_respuesta    TIMESTAMP
);

-- ============================================================
--  10. SEGUIMIENTO
-- ============================================================
CREATE TABLE seguimiento (
    id_seguimiento     SERIAL         PRIMARY KEY,

    id_solicitud       INT            NOT NULL
                       REFERENCES solicitud(id_solicitud),

    id_usuario_admin   INT            NOT NULL
                       REFERENCES usuario_admin(id_admin),

    estado_anterior    VARCHAR(20),

    estado_nuevo       VARCHAR(20)    NOT NULL,

    etapa_visible      VARCHAR(40),

    comentario         TEXT,

    fecha_cambio       TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
--  11. NOTIFICACION
-- ============================================================
CREATE TABLE notificacion (
    id_notificacion    SERIAL         PRIMARY KEY,

    id_usuario         INT            NOT NULL
                       REFERENCES usuario_general(id_usuario),

    id_solicitud       INT
                       REFERENCES solicitud(id_solicitud),

    tipo               VARCHAR(20)    NOT NULL DEFAULT 'ESTADO'
                       CHECK (tipo IN (
                           'ESTADO',
                           'OBSERVACION',
                           'PAGO',
                           'VENCIMIENTO'
                       )),

    asunto             VARCHAR(100)   NOT NULL,

    mensaje            TEXT           NOT NULL,

    leida              BOOLEAN        NOT NULL DEFAULT FALSE,

    fecha_envio        TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
--  ÍNDICES
-- ============================================================

-- usuario_general
CREATE INDEX idx_usuario_general_dni
ON usuario_general(dni);

CREATE INDEX idx_usuario_general_email
ON usuario_general(email);

-- usuario_admin
CREATE INDEX idx_usuario_admin_dni
ON usuario_admin(dni);

CREATE INDEX idx_usuario_admin_email
ON usuario_admin(email);

-- tramite
CREATE INDEX idx_tramite_categoria
ON tramite(id_categoria);

CREATE INDEX idx_tramite_vigente
ON tramite(vigente);

-- requisito
CREATE INDEX idx_requisito_tramite
ON requisito(cod_tramite);

-- solicitud
CREATE INDEX idx_solicitud_usuario
ON solicitud(id_usuario);

CREATE INDEX idx_solicitud_tramite
ON solicitud(cod_tramite);

CREATE INDEX idx_solicitud_estado
ON solicitud(estado);

CREATE INDEX idx_solicitud_fecha
ON solicitud(fecha_solicitud);

-- documento
CREATE INDEX idx_documento_solicitud
ON documento(id_solicitud);

CREATE INDEX idx_documento_requisito
ON documento(id_requisito);

-- observacion
CREATE INDEX idx_observacion_solicitud
ON observacion(id_solicitud);

CREATE INDEX idx_observacion_estado
ON observacion(id_solicitud, estado);

-- seguimiento
CREATE INDEX idx_seguimiento_solicitud
ON seguimiento(id_solicitud);

-- notificacion
CREATE INDEX idx_notif_usuario
ON notificacion(id_usuario);

CREATE INDEX idx_notif_no_leida
ON notificacion(id_usuario, leida)
WHERE leida = FALSE;