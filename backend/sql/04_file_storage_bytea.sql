-- ============================================================
--  TUPA UNSAAC — Contenido de archivos en la base de datos
--
--  Migración ADITIVA: sólo agrega columnas nuevas y relaja un
--  NOT NULL heredado. Se puede ejecutar varias veces sin efectos
--  secundarios.
--
--  Contexto:
--   El backend corre como función serverless (Vercel, ver
--   vercel.json). Su disco es efímero y NO se comparte entre
--   invocaciones ni entre instancias: un archivo escrito con
--   multer.diskStorage() en /uploads podía ya no estar ahí para
--   la siguiente petición, incluso en la misma máquina, dando
--   "El archivo ya no existe en el servidor" al intentar verlo.
--
--   Postgres (Render) sí es persistente y compartido, así que el
--   contenido del archivo pasa a vivir ahí, en columnas BYTEA,
--   igual que ya vivían sus metadatos (nombre, tamaño, mime_type).
--
--   `ruta_archivo` deja de llenarse para filas nuevas (multer ya
--   no genera un nombre de archivo en disco al usar memoryStorage)
--   pero se conserva para no romper filas antiguas ya inservibles.
-- ============================================================

-- ------------------------------------------------------------
--  Documentos de solicitudes (voucher + requisitos)
-- ---------------------------------------- --------------------
ALTER TABLE documento
ADD COLUMN IF NOT EXISTS contenido BYTEA;

ALTER TABLE documento ALTER COLUMN ruta_archivo DROP NOT NULL;

COMMENT ON COLUMN documento.contenido IS
  'Bytes del archivo (file.buffer de multer). Reemplaza a ruta_archivo como fuente de verdad: se sirve desde GET /api/documents/:id_documento/view.';
COMMENT ON COLUMN documento.ruta_archivo IS
  'Heredado de cuando se guardaba en disco (/uploads/...). Ya no se llena; las filas antiguas con esta ruta no tienen archivo recuperable.';

-- ------------------------------------------------------------
--  Avatar de usuarios (mismo problema, mismo remedio)
-- ------------------------------------------------------------
ALTER TABLE usuario_general
ADD COLUMN IF NOT EXISTS avatar_contenido BYTEA,
ADD COLUMN IF NOT EXISTS avatar_mime_type VARCHAR(100);

ALTER TABLE usuario_admin
ADD COLUMN IF NOT EXISTS avatar_contenido BYTEA,
ADD COLUMN IF NOT EXISTS avatar_mime_type VARCHAR(100);

COMMENT ON COLUMN usuario_general.avatar_url IS
  'Ahora apunta a GET /api/users/avatar/general/:id (imagen servida desde avatar_contenido), no a un archivo en disco.';
COMMENT ON COLUMN usuario_admin.avatar_url IS
  'Ahora apunta a GET /api/users/avatar/admin/:id (imagen servida desde avatar_contenido), no a un archivo en disco.';
