const pool = require('../db/pool');
const fs = require('fs');
const path = require('path');

async function deleteDocument(documentId, userId) {
  const query = `
    SELECT d.id_documento, d.ruta_archivo, s.id_usuario, s.estado
    FROM documento d
    JOIN solicitud s ON d.id_solicitud = s.id_solicitud
    WHERE d.id_documento = $1
  `;
  const { rows } = await pool.query(query, [documentId]);

  if (rows.length === 0) {
    const error = new Error('Documento no encontrado');
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
  deleteDocument,
};
