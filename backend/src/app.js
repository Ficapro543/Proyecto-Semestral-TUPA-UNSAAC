const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const proceduresRoutes = require('./routes/procedures.routes');
const requestsRoutes = require('./routes/requests.routes');
const documentsRoutes = require('./routes/documents.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos subidos (comprobantes, documentos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'TUPA UNSAAC Backend API', timestamp: new Date() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/procedures', proceduresRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Centralized Error Middleware
app.use(errorHandler);

module.exports = app;
