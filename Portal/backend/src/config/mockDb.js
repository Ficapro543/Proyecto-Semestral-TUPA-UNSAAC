const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

let db = {
  users: [],
  categories: [],
  procedures: [],
  requirements: [],
  requests: [],
  documents: [],
  notifications: [],
};

function initMockData() {
  const salt = bcrypt.genSaltSync(10);

  // Users
  db.users = [
    {
      id: uuidv4(),
      email: 'admin@tupa-unsaac.edu.pe',
      password: bcrypt.hashSync('admin123', salt),
      firstName: 'Admin',
      lastName: 'UNSAAC',
      role: 'admin',
      avatar: null,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: uuidv4(),
      email: 'elena@unsaac.edu.pe',
      password: bcrypt.hashSync('student123', salt),
      firstName: 'Elena',
      lastName: 'Rodriguez',
      role: 'student',
      avatar: null,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: uuidv4(),
      email: 'carlos@unsaac.edu.pe',
      password: bcrypt.hashSync('student123', salt),
      firstName: 'Carlos',
      lastName: 'Mamani',
      role: 'student',
      avatar: null,
      createdAt: new Date('2024-02-01'),
    },
  ];

  // Categories
  db.categories = [
    { id: uuidv4(), name: 'Academico', description: 'Trmites acadmicos y de formacin', icon: 'school' },
    { id: uuidv4(), name: 'Administrativo', description: 'Trmites administrativos generales', icon: 'business' },
    { id: uuidv4(), name: 'Financiero', description: 'Trmites de pagos y finanzas', icon: 'payments' },
    { id: uuidv4(), name: 'Bienestar', description: 'Servicios de bienestar universitario', icon: 'favorite' },
    { id: uuidv4(), name: 'Investigacion', description: 'Trmites de investigacin y publicaciones', icon: 'science' },
  ];

  const catIds = {};
  db.categories.forEach(c => { catIds[c.name] = c.id; });

  // Procedures
  db.procedures = [
    {
      id: uuidv4(),
      title: 'Certificado de Estudios',
      description: 'Emisin del certificado oficial de estudios universitarios que acredita la formacin acadmica del estudiante.',
      categoryId: catIds['Academico'],
      cost: 15.0,
      estimatedDays: 5,
      status: 'active',
      createdBy: db.users[0].id,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: uuidv4(),
      title: 'Constancia de Alumno Regular',
      description: 'Constancia que acredita la condicin de alumno regular vigente de la universidad.',
      categoryId: catIds['Academico'],
      cost: 5.0,
      estimatedDays: 2,
      status: 'active',
      createdBy: db.users[0].id,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: uuidv4(),
      title: 'Historial Academico',
      description: 'Documento que contiene el registro completo de notas y cursos aprobados durante la carrera.',
      categoryId: catIds['Academico'],
      cost: 10.0,
      estimatedDays: 3,
      status: 'active',
      createdBy: db.users[0].id,
      createdAt: new Date('2024-01-12'),
    },
    {
      id: uuidv4(),
      title: 'Tramite de Pago de Pensiones',
      description: 'Registro, consulta y comprobacin de pagos de pensiones universitarias.',
      categoryId: catIds['Financiero'],
      cost: 0,
      estimatedDays: 1,
      status: 'active',
      createdBy: db.users[0].id,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: uuidv4(),
      title: 'Solicitud de Beca',
      description: 'Postulacin a programas de becas universitarias por excelencia acadmica o situacin socioeconmica.',
      categoryId: catIds['Bienestar'],
      cost: 0,
      estimatedDays: 30,
      status: 'active',
      createdBy: db.users[0].id,
      createdAt: new Date('2024-02-01'),
    },
    {
      id: uuidv4(),
      title: 'Constancia de No Adeudo',
      description: 'Documento que certifica que el estudiante no tiene deudas pendientes con la universidad.',
      categoryId: catIds['Financiero'],
      cost: 5.0,
      estimatedDays: 2,
      status: 'active',
      createdBy: db.users[0].id,
      createdAt: new Date('2024-02-10'),
    },
    {
      id: uuidv4(),
      title: 'Solicitud de Convalidacion',
      description: 'Trmite para convalidar estudios realizados en otras instituciones educativas.',
      categoryId: catIds['Administrativo'],
      cost: 50.0,
      estimatedDays: 45,
      status: 'active',
      createdBy: db.users[0].id,
      createdAt: new Date('2024-02-15'),
    },
    {
      id: uuidv4(),
      title: 'Inscripcion a Cursos Libres',
      description: 'Registro para cursos libres de formacin complementaria offered por la universidad.',
      categoryId: catIds['Academico'],
      cost: 25.0,
      estimatedDays: 3,
      status: 'active',
      createdBy: db.users[0].id,
      createdAt: new Date('2024-03-01'),
    },
  ];

  // Requirements
  db.requirements = [
    { id: uuidv4(), procedureId: db.procedures[0].id, name: 'DNI en formato PDF', description: 'Copia legible del documento nacional de identidad', isRequired: true, order: 1 },
    { id: uuidv4(), procedureId: db.procedures[0].id, name: 'Certificado de Matricula', description: 'Certificado que acredite estar matriculado en el ciclo actual', isRequired: true, order: 2 },
    { id: uuidv4(), procedureId: db.procedures[0].id, name: 'Comprobante de Pago', description: 'Recibo de pago por derecho de emitir certificado (S/. 15.00)', isRequired: true, order: 3 },

    { id: uuidv4(), procedureId: db.procedures[1].id, name: 'DNI en formato PDF', description: 'Copia del documento de identidad', isRequired: true, order: 1 },
    { id: uuidv4(), procedureId: db.procedures[1].id, name: 'Comprobante de Pago', description: 'Recibo de pago por derecho (S/. 5.00)', isRequired: true, order: 2 },

    { id: uuidv4(), procedureId: db.procedures[2].id, name: 'DNI en formato PDF', description: 'Copia del documento de identidad', isRequired: true, order: 1 },
    { id: uuidv4(), procedureId: db.procedures[2].id, name: 'Solicitud Formal', description: 'Carta de solicitud dirigida aDireccion de Registros', isRequired: true, order: 2 },
    { id: uuidv4(), procedureId: db.procedures[2].id, name: 'Comprobante de Pago', description: 'Recibo de pago (S/. 10.00)', isRequired: true, order: 3 },

    { id: uuidv4(), procedureId: db.procedures[4].id, name: 'DNI en formato PDF', description: 'Copia del documento de identidad', isRequired: true, order: 1 },
    { id: uuidv4(), procedureId: db.procedures[4].id, name: 'Certificado de Notas', description: 'Historial de notas certificado', isRequired: true, order: 2 },
    { id: uuidv4(), procedureId: db.procedures[4].id, name: 'Declaracion Jurada', description: 'Declaracion jurada de situacion socioeconomica', isRequired: false, order: 3 },
    { id: uuidv4(), procedureId: db.procedures[4].id, name: 'Carta de Presentacion', description: 'Carta de presentacion del decano', isRequired: false, order: 4 },

    { id: uuidv4(), procedureId: db.procedures[5].id, name: 'DNI en formato PDF', description: 'Copia del documento de identidad', isRequired: true, order: 1 },
    { id: uuidv4(), procedureId: db.procedures[5].id, name: 'Comprobante de Pago', description: 'Recibo de pago (S/. 5.00)', isRequired: true, order: 2 },

    { id: uuidv4(), procedureId: db.procedures[6].id, name: 'DNI en formato PDF', description: 'Copia del documento de identidad', isRequired: true, order: 1 },
    { id: uuidv4(), procedureId: db.procedures[6].id, name: 'Certificados de Estudios', description: 'Certificados de la institucion de origen', isRequired: true, order: 2 },
    { id: uuidv4(), procedureId: db.procedures[6].id, name: 'Plan de Estudios', description: 'Malla curricular de la carrera', isRequired: true, order: 3 },
    { id: uuidv4(), procedureId: db.procedures[6].id, name: 'Comprobante de Pago', description: 'Recibo de pago (S/. 50.00)', isRequired: true, order: 4 },
  ];

  // Procedure Requests (for demo)
  const studentId = db.users[1].id;
  db.requests = [
    {
      id: uuidv4(),
      userId: studentId,
      procedureId: db.procedures[0].id,
      status: 'completed',
      notes: 'Solicitud de certificado de estudios para postulacion laboral',
      adminNotes: 'Tramite procesado exitosamente',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-15'),
    },
    {
      id: uuidv4(),
      userId: studentId,
      procedureId: db.procedures[1].id,
      status: 'in_review',
      notes: 'Constancia para tramite de beca',
      adminNotes: null,
      createdAt: new Date('2024-03-20'),
      updatedAt: new Date('2024-03-20'),
    },
    {
      id: uuidv4(),
      userId: studentId,
      procedureId: db.procedures[4].id,
      status: 'pending',
      notes: 'Solicitud de beca por excelencia academica',
      adminNotes: null,
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-01'),
    },
  ];

  // Notifications
  db.notifications = [
    {
      id: uuidv4(),
      userId: studentId,
      title: 'Tramite Completado',
      message: 'Su Certificado de Estudios esta listo para recoger',
      type: 'success',
      isRead: false,
      link: '/student/procedures',
      createdAt: new Date('2024-03-15'),
    },
    {
      id: uuidv4(),
      userId: studentId,
      title: 'Tramite en Revision',
      message: 'Su Constancia de Alumno Regular esta siendo revisada',
      type: 'info',
      isRead: true,
      link: '/student/procedures',
      createdAt: new Date('2024-03-20'),
    },
  ];
}

// CRUD operations on mock DB
const dbOperations = {
  // Users
  findUserByEmail: (email) => db.users.find(u => u.email === email),
  findUserById: (id) => db.users.find(u => u.id === id),
  getAllUsers: () => db.users.map(({ password, ...u }) => u),
  createUser: (userData) => {
    const user = { id: uuidv4(), ...userData, createdAt: new Date() };
    db.users.push(user);
    const { password, ...result } = user;
    return result;
  },

  // Categories
  getAllCategories: () => db.categories,
  getCategoryById: (id) => db.categories.find(c => c.id === id),

  // Procedures
  getAllProcedures: (filters = {}) => {
    let result = db.procedures.map(p => {
      const category = db.categories.find(c => c.id === p.categoryId);
      return { ...p, category: category ? category.name : null };
    });
    if (filters.categoryId) result = result.filter(p => p.categoryId === filters.categoryId);
    if (filters.status) result = result.filter(p => p.status === filters.status);
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }
    return result;
  },
  getProcedureById: (id) => {
    const procedure = db.procedures.find(p => p.id === id);
    if (!procedure) return null;
    const category = db.categories.find(c => c.id === procedure.categoryId);
    const requirements = db.requirements.filter(r => r.procedureId === id).sort((a, b) => a.order - b.order);
    return { ...procedure, category: category ? category.name : null, requirements };
  },
  createProcedure: (data) => {
    const procedure = { id: uuidv4(), ...data, status: 'active', createdAt: new Date() };
    db.procedures.push(procedure);
    return procedure;
  },

  // Requirements
  getRequirementsByProcedure: (procedureId) => {
    return db.requirements.filter(r => r.procedureId === procedureId).sort((a, b) => a.order - b.order);
  },

  // Requests
  getRequestsByUser: (userId) => {
    return db.requests
      .filter(r => r.userId === userId)
      .map(r => {
        const procedure = db.procedures.find(p => p.id === r.procedureId);
        return { ...r, procedure: procedure ? procedure.title : null };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getAllRequests: () => {
    return db.requests
      .map(r => {
        const procedure = db.procedures.find(p => p.id === r.procedureId);
        const user = db.users.find(u => u.id === r.userId);
        return {
          ...r,
          procedure: procedure ? procedure.title : null,
          userName: user ? `${user.firstName} ${user.lastName}` : null,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  createRequest: (data) => {
    const request = { id: uuidv4(), ...data, status: 'pending', adminNotes: null, createdAt: new Date(), updatedAt: new Date() };
    db.requests.push(request);
    return request;
  },
  updateRequestStatus: (id, status, adminNotes) => {
    const idx = db.requests.findIndex(r => r.id === id);
    if (idx === -1) return null;
    db.requests[idx] = { ...db.requests[idx], status, adminNotes, updatedAt: new Date() };
    return db.requests[idx];
  },

  // Notifications
  getNotificationsByUser: (userId) => {
    return db.notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  createNotification: (data) => {
    const notification = { id: uuidv4(), ...data, isRead: false, createdAt: new Date() };
    db.notifications.push(notification);
    return notification;
  },
  markNotificationRead: (id) => {
    const idx = db.notifications.findIndex(n => n.id === id);
    if (idx !== -1) db.notifications[idx].isRead = true;
  },
  markAllNotificationsRead: (userId) => {
    db.notifications.forEach(n => { if (n.userId === userId) n.isRead = true; });
  },

  // Stats
  getStats: () => {
    const totalProcedures = db.procedures.length;
    const totalUsers = db.users.length;
    const totalRequests = db.requests.length;
    const pendingRequests = db.requests.filter(r => r.status === 'pending').length;
    const completedRequests = db.requests.filter(r => r.status === 'completed').length;
    const inReviewRequests = db.requests.filter(r => r.status === 'in_review').length;
    return { totalProcedures, totalUsers, totalRequests, pendingRequests, completedRequests, inReviewRequests };
  },
};

module.exports = { initMockData, db, dbOperations };
