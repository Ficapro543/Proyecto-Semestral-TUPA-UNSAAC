const documentsService = require('../services/documents.service');
const asyncHandler = require('../utils/asyncHandler');

const viewDocument = asyncHandler(async (req, res) => {
  const { id_documento } = req.params;
  const doc = await documentsService.getDocumentForViewing(id_documento, req.user.id, req.user.role);
  if (doc.mime_type) res.type(doc.mime_type);
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.nombre_archivo)}"`);
  res.send(doc.contenido);
});

const deleteDocument = asyncHandler(async (req, res) => {
  const { id_documento } = req.params;
  const result = await documentsService.deleteDocument(id_documento, req.user.id);
  res.json(result);
});

module.exports = {
  viewDocument,
  deleteDocument,
};
