const adminService = require('../services/admin.service');
const requestsService = require('../services/requests.service');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getAdminStats();
  res.json(stats);
});

const listRequests = asyncHandler(async (req, res) => {
  const list = await adminService.listAdminRequests(req.query);
  res.json(list);
});

const getRequestDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const detail = await requestsService.getRequestDetail(id, null, true);
  res.json(detail);
});

const processDecision = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.processDecision(id, req.user.id, req.body);
  res.json({
    message: 'Decisión registrada correctamente',
    solicitud: result,
  });
});

const createProcedure = asyncHandler(async (req, res) => {
  const procedure = await adminService.createProcedure(req.body);
  res.status(201).json({
    message: 'Trámite creado exitosamente',
    tramite: procedure,
  });
});

const toggleProcedure = asyncHandler(async (req, res) => {
  const { cod_tramite } = req.params;
  const result = await adminService.toggleProcedure(cod_tramite);
  res.json({
    message: `Trámite ${result.vigente ? 'activado' : 'desactivado'} correctamente`,
    tramite: result,
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await adminService.listUsers(req.query);
  res.json(users);
});

const toggleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.toggleUserActive(id);
  res.json({
    message: `Estado de usuario actualizado a ${result.activo ? 'activo' : 'inactivo'}`,
    user: result,
  });
});

module.exports = {
  getStats,
  listRequests,
  getRequestDetail,
  processDecision,
  createProcedure,
  toggleProcedure,
  listUsers,
  toggleUser,
};
