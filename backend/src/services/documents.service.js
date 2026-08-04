const pool = require('../db/pool');
const { parseId } = require('../utils/validate');

/**
 * Trae los bytes de un documento para servirlo, verificando que quien lo
 * pide sea el dueño de la solicitud o un administrador. El contenido vive en
 * la columna `contenido` (BYTEA): el backend corre serverless (Vercel) y su
 * disco es efímero, así que no se puede depender de un archivo en /uploads.
 */
async function getDocumentForViewing(rawDocumentId, userId, role) {
  const documentId = parseId(rawDocumentId, 'id_documento');

  const query = `
    SELECT d.id_documento, d.nombre_archivo, d.mime_type, d.contenido, s.id_usuario
    FROM documento d
    JOIN solicitud s ON d.id_solicitud = s.id_solicitud
    WHERE d.id_documento = $1
  `;
  const { rows } = await pool.query(query, [documentId]);

  if (rows.length === 0) {
    const error = new Error(`No existe un documento con id ${documentId}`);
    error.statusCode = 404;
    throw error;
  }

  const doc = rows[0];

  if (role !== 'ADMIN' && doc.id_usuario !== userId) {
    const error = new Error('No tiene permiso para ver este documento');
    error.statusCode = 403;
    throw error;
  }

  if (!doc.contenido) {
    const error = new Error('El archivo ya no está disponible en el servidor');
    error.statusCode = 404;
    throw error;
  }

  return { contenido: doc.contenido, nombre_archivo: doc.nombre_archivo, mime_type: doc.mime_type };
}

async function deleteDocument(rawDocumentId, userId) {
  const documentId = parseId(rawDocumentId, 'id_documento');

  const query = `
    SELECT d.id_documento, s.id_usuario, s.estado
    FROM documento d
    JOIN solicitud s ON d.id_solicitud = s.id_solicitud
    WHERE d.id_documento = $1
  `;
  const { rows } = await pool.query(query, [documentId]);

  if (rows.length === 0) {
    const error = new Error(`No existe un documento con id ${documentId}`);
    error.statusCode = 404;
    throw error;
  }

  const doc = rows[0];

  if (doc.id_usuario !== userId) {
    const error = new Error('No tiene permiso para eliminar este documento');
    error.statusCode = 403;
    throw error;
  }

  if (['COMPLETADO', 'ANULADO', 'RECHAZADO'].includes(doc.estado)) {
    const error = new Error('No se pueden eliminar documentos de una solicitud finalizada');
    error.statusCode = 400;
    throw error;
  }

  await pool.query('DELETE FROM documento WHERE id_documento = $1', [documentId]);

  return { message: 'Documento eliminado exitosamente' };
}

module.exports = {
  getDocumentForViewing,
  deleteDocument,
};
