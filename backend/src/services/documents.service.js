const pool = require('../db/pool');
const fs = require('fs');
const path = require('path');
const { parseId } = require('../utils/validate');

/**
 * Resuelve la ruta física de un documento para servirlo, verificando que
 * quien lo pide sea el dueño de la solicitud o un administrador. Antes los
 * documentos se veían vía /uploads estático: cualquiera con la URL (que es
 * predecible, `fieldname-timestamp-random.ext`) podía acceder sin sesión.
 */
async function getDocumentForViewing(rawDocumentId, userId, role) {
  const documentId = parseId(rawDocumentId, 'id_documento');

  const query = `
    SELECT d.id_documento, d.nombre_archivo, d.ruta_archivo, d.mime_type, s.id_usuario
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

  const fullPath = path.join(__dirname, '../../', doc.ruta_archivo);
  if (!fs.existsSync(fullPath)) {
    const error = new Error('El archivo ya no existe en el servidor');
    error.statusCode = 404;
    throw error;
  }

  return { fullPath, nombre_archivo: doc.nombre_archivo, mime_type: doc.mime_type };
}

async function deleteDocument(rawDocumentId, userId) {
  const documentId = parseId(rawDocumentId, 'id_documento');

  const query = `
    SELECT d.id_documento, d.ruta_archivo, s.id_usuario, s.estado
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

  // Eliminar de base de datos
  await pool.query('DELETE FROM documento WHERE id_documento = $1', [documentId]);

  // Intentar eliminar archivo físico
  if (doc.ruta_archivo) {
    const fullPath = path.join(__dirname, '../../', doc.ruta_archivo);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.error('Error al eliminar archivo físico:', err);
      }
    }
  }

  return { message: 'Documento eliminado exitosamente' };
}

module.exports = {
  getDocumentForViewing,
  deleteDocument,
};
