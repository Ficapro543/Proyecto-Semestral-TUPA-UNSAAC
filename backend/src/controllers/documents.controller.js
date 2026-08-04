const documentsService = require('../services/documents.service');
const asyncHandler = require('../utils/asyncHandler');

const deleteDocument = asyncHandler(async (req, res) => {
  const { id_documento } = req.params;
  const result = await documentsService.deleteDocument(id_documento, req.user.id);
  res.json(result);
});

module.exports = {
  deleteDocument,
};
