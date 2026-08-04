-- ============================================================
--  TUPA UNSAAC — Almacenamiento de archivos (multer)
--
--  Migración ADITIVA: sólo agrega columnas nuevas, no modifica
--  ni borra nada existente. Se puede ejecutar varias veces sin
--  efectos secundarios.
--
--  Contexto:
--   - `documento.ruta_archivo` y `documento.tamano_bytes` ya
--     existían (ver schema.sql) y los llena multer al subir el
--     voucher de pago o un documento de requisito.
--   - `documento.mime_type` es nueva: guarda el `file.mimetype`
--     que entrega multer para poder servir el archivo con el
--     Content-Type correcto desde el visor controlado
--     (GET /api/documents/:id_documento/view) en vez de adivinarlo
--     por la extensión.
--   - `avatar_url` ya existía en usuario_general y usuario_admin;
--     no se toca acá, solo pasa a llenarse también desde
--     POST /api/users/profile/avatar (antes solo se aceptaba
--     como texto libre en el body del PUT /profile).
-- ============================================================

ALTER TABLE documento
ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100);

COMMENT ON COLUMN documento.mime_type IS
  'Content-Type reportado por multer (file.mimetype) al subir el archivo. Usado por GET /api/documents/:id_documento/view para el header Content-Type.';
