const requestsService = require('../services/requests.service');
const asyncHandler = require('../utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const newReq = await requestsService.createRequest(req.user.id, req.body);
  res.status(201).json({
    message: 'Borrador de solicitud creado',
    solicitud: newReq,
  });
});

const listMine = asyncHandler(async (req, res) => {
  const list = await requestsService.getUserRequests(req.user.id, req.query);
  res.json(list);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user.role === 'ADMIN';
  const requestDetail = await requestsService.getRequestDetail(id, req.user.id, isAdmin);
  res.json(requestDetail);
});

const updateStep = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paso_actual } = req.body;
  const result = await requestsService.updateStep(id, req.user.id, paso_actual);
  res.json({
    message: 'Paso actualizado',
    ...result,
  });
});

const uploadVoucher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha adjuntado ningún archivo de comprobante' });
  }

  const result = await requestsService.uploadVoucher(id, req.user.id, {
    file: req.file,
    nro_recibo: req.body.nro_recibo,
    monto_total: req.body.monto_total,
  });

  res.json({
    message: 'Comprobante de pago subido correctamente',
    ...result,
  });
});

const uploadDocument = asyncHandler(async (req, res) => {
  const { id, id_requisito } = req.params;
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha adjuntado ningún archivo' });
  }

  const result = await requestsService.uploadDocument(id, req.user.id, id_requisito, req.file);
  res.json({
    message: 'Documento subido correctamente',
    documento: result,
  });
});

const submit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await requestsService.submitRequest(id, req.user.id);
  res.json({
    message: 'Solicitud enviada exitosamente',
    solicitud: result,
  });
});

const track = asyncHandler(async (req, res) => {
  const { numero_expediente } = req.params;
  const trackingData = await requestsService.trackByExpediente(numero_expediente);
  res.json(trackingData);
});

module.exports = {
  create,
  listMine,
  getById,
  updateStep,
  uploadVoucher,
  uploadDocument,
  submit,
  track,
};
