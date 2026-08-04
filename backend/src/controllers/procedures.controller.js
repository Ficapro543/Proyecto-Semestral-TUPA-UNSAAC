const proceduresService = require('../services/procedures.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const result = await proceduresService.listProcedures(req.query);
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const { cod_tramite } = req.params;
  const procedure = await proceduresService.getProcedureById(cod_tramite);
  res.json(procedure);
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await proceduresService.getCategories();
  res.json(categories);
});

module.exports = {
  list,
  getById,
  getCategories,
};
