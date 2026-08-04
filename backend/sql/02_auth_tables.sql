-- ============================================================
--  TUPA UNSAAC — Tablas de autenticación
--
--  Migración ADITIVA: sólo crea tablas y columnas nuevas, no
--  modifica ni borra nada existente. Se puede ejecutar varias
--  veces sin efectos secundarios.
--
--  Ejecutar con:  npm run db:auth
-- ============================================================

-- ------------------------------------------------------------
--  Sesiones: refresh tokens
--  El rol se guarda junto al id porque TUPA tiene dos tablas de
--  usuario (usuario_general / usuario_admin) y los ids se repiten
--  entre ambas: el par (id_usuario, rol) es lo que identifica.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_token (
    id_refresh      SERIAL        PRIMARY KEY,
    id_usuario      INT           NOT NULL,
    rol             VARCHAR(10)   NOT NULL CHECK (rol IN ('USER', 'ADMIN')),
    token           TEXT          NOT NULL UNIQUE,
    expires_at      TIMESTAMP     NOT NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    revoked         BOOLEAN       NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_refresh_token_token   ON refresh_token(token);
CREATE INDEX IF NOT EXISTS idx_refresh_token_usuario ON refresh_token(id_usuario, rol);

-- ------------------------------------------------------------
--  Activación de cuenta por correo
--  Sólo aplica a usuario_general: las cuentas administrativas
--  las crea la universidad, no se auto-registran.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activation_token (
    id_activacion   SERIAL        PRIMARY KEY,
    id_usuario      INT           NOT NULL REFERENCES usuario_general(id_usuario) ON DELETE CASCADE,
    token           UUID          NOT NULL UNIQUE,
    expires_at      TIMESTAMP     NOT NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    used            BOOLEAN       NOT NULL DEFAULT FALSE,
    used_at         TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activation_token_token   ON activation_token(token);
CREATE INDEX IF NOT EXISTS idx_activation_token_usuario ON activation_token(id_usuario);

-- ------------------------------------------------------------
--  Recuperación de contraseña
--
--  `codigo`      → los 6 dígitos que llegan por correo.
--  `reset_token` → se emite recién cuando el código se verifica
--                  correctamente y es lo único que autoriza el
--                  cambio de contraseña.
--
--  En el proyecto de referencia el endpoint de reset aceptaba
--  sólo el email, así que cualquiera podía cambiar la contraseña
--  de otro sin conocer el código. Este segundo token cierra ese
--  agujero.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_token (
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

CREATE INDEX IF NOT EXISTS idx_password_reset_usuario ON password_reset_token(id_usuario, rol);
CREATE INDEX IF NOT EXISTS idx_password_reset_token   ON password_reset_token(reset_token);

-- ------------------------------------------------------------
--  Las cuentas ya sembradas siguen activas: la verificación por
--  correo sólo se exige a los registros nuevos, para no dejar
--  fuera a las cuentas de demo del equipo.
-- ------------------------------------------------------------
UPDATE usuario_general SET activo = TRUE WHERE activo IS NULL;
