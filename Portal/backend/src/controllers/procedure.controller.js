const { dbOperations } = require('../config/mockDb');

const getProcedures = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const procedures = dbOperations.getAllProcedures({ categoryId: category, status, search });
    res.json({ procedures });
  } catch (error) {
    next(error);
  }
};

const getProcedureById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const procedure = dbOperations.getProcedureById(id);
    if (!procedure) {
      return res.status(404).json({ error: 'Procedimiento no encontrado' });
    }
    res.json({ procedure });
  } catch (error) {
    next(error);
  }
};

const createProcedure = async (req, res, next) => {
  try {
    const { title, description, categoryId, cost, estimatedDays } = req.body;

    if (!title || !categoryId) {
      return res.status(400).json({ error: 'Titulo y categoria son requeridos' });
    }

    const procedure = dbOperations.createProcedure({
      title,
      description,
      categoryId,
      cost: cost || 0,
      estimatedDays: estimatedDays || null,
      createdBy: req.user.id,
    });

    res.status(201).json({ procedure });
  } catch (error) {
    next(error);
  }
};

const updateProcedure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, cost, estimatedDays, status } = req.body;

    const { db } = require('../config/mockDb');
    const idx = db.procedures.findIndex(p => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Procedimiento no encontrado' });
    }

    db.procedures[idx] = {
      ...db.procedures[idx],
      title: title || db.procedures[idx].title,
      description: description || db.procedures[idx].description,
      categoryId: categoryId || db.procedures[idx].categoryId,
      cost: cost !== undefined ? cost : db.procedures[idx].cost,
      estimatedDays: estimatedDays !== undefined ? estimatedDays : db.procedures[idx].estimatedDays,
      status: status || db.procedures[idx].status,
    };

    res.json({ procedure: db.procedures[idx] });
  } catch (error) {
    next(error);
  }
};

const createRequest = async (req, res, next) => {
  try {
    const { procedureId, notes } = req.body;

    if (!procedureId) {
      return res.status(400).json({ error: 'ID del procedimiento requerido' });
    }

    const procedure = dbOperations.getProcedureById(procedureId);
    if (!procedure) {
      return res.status(404).json({ error: 'Procedimiento no encontrado' });
    }

    const request = dbOperations.createRequest({
      userId: req.user.id,
      procedureId,
      notes: notes || '',
    });

    // Create notification for admin
    const { db } = require('../config/mockDb');
    dbOperations.createNotification({
      userId: db.users.find(u => u.role === 'admin')?.id,
      title: 'Nueva Solicitud',
      message: `Nueva solicitud de ${req.user.email} para: ${procedure.title}`,
      type: 'info',
      link: '/admin/procedures',
    });

    res.status(201).json({ request });
  } catch (error) {
    next(error);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = dbOperations.getRequestsByUser(req.user.id);
    res.json({ requests });
  } catch (error) {
    next(error);
  }
};

const getAllRequests = async (req, res, next) => {
  try {
    const requests = dbOperations.getAllRequests();
    res.json({ requests });
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const request = dbOperations.updateRequestStatus(id, status, adminNotes);
    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Notify user
    const { db } = require('../config/mockDb');
    const procedure = db.procedures.find(p => p.id === request.procedureId);
    dbOperations.createNotification({
      userId: request.userId,
      title: `Solicitud ${status === 'approved' ? 'Aprobada' : status === 'rejected' ? 'Rechazada' : 'Actualizada'}`,
      message: `Su solicitud para "${procedure?.title}" ha sido ${status === 'approved' ? 'aprobada' : status === 'rejected' ? 'rechazada' : 'actualizada'}`,
      type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
      link: '/student/procedures',
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${request.userId}`).emit('notification', {
        title: `Solicitud ${status}`,
        message: `Su solicitud ha sido ${status}`,
      });
    }

    res.json({ request });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = dbOperations.getStats();
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProcedures,
  getProcedureById,
  createProcedure,
  updateProcedure,
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  getStats,
};
