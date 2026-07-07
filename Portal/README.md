# Portal TUPA UNSAAC

Plataforma web para la gestión del **Texto Único de Procedimientos Administrativos** de la Universidad Nacional de San Antonio Abad del Cusco.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Tailwind CSS + Vite |
| Backend | Node.js + Express.js |
| Base de datos | Mock en memoria (JSON) |
| Autenticación | JWT (JSON Web Tokens) |
| Notificaciones | WebSockets (Socket.io) + Nodemailer |
| Iconos | Material Symbols + Lucide React |

## Características

- Catálogo público de procedimientos (vista grid y lista)
- Wizard de 6 pasos para solicitar trámites
- Dashboard estudiantil con seguimiento de solicitudes
- Panel administrativo con gestión y aprobación de trámites
- Notificaciones en tiempo real vía WebSockets
- Sistema de autenticación con roles (admin/estudiante)
- Diseño responsive con paleta institucional UNSAAC

## Estructura del Proyecto

```
Portal/
├── backend/
│   ├── src/
│   │   ├── server.js              # Servidor Express + Socket.io
│   │   ├── config/mockDb.js       # Datos mock en memoria
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT authentication
│   │   │   └── errorHandler.js    # Manejo de errores
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── procedure.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── notification.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── procedure.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── notification.routes.js
│   │   └── services/
│   │       └── email.service.js   # Nodemailer
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useSocket.js
│   │   ├── services/api.js        # Axios
│   │   ├── components/
│   │   │   ├── ui/                # Button, Card, Badge, Modal, Input
│   │   │   ├── layout/            # Sidebar, Topbar, PublicHeader
│   │   │   ├── procedures/        # ProcedureCard
│   │   │   └── wizard/            # WizardStepper
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Catalog.jsx
│   │       ├── ProcedureDetail.jsx
│   │       ├── StudentDashboard.jsx
│   │       ├── MyProcedures.jsx
│   │       ├── Notifications.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProcedures.jsx
│   │       └── AdminUsers.jsx
│   └── vite.config.js
│
└── README.md
```

## Instalación y Ejecución

### Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x

### Backend

```bash
cd Portal/backend
npm install
npm run dev
```

El servidor se inicia en `http://localhost:5000`.

### Frontend

```bash
cd Portal/frontend
npm install
npm run dev
```

La aplicación se inicia en `http://localhost:3000`.

### Build de Producción

```bash
cd Portal/frontend
npm run build
```

## API Endpoints

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/profile` | Obtener perfil (auth) |

### Procedimientos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/procedures` | Listar procedimientos |
| GET | `/api/procedures/:id` | Detalle de procedimiento |
| POST | `/api/procedures` | Crear procedimiento (admin) |
| PUT | `/api/procedures/:id` | Actualizar procedimiento (admin) |
| POST | `/api/procedures/request` | Crear solicitud (auth) |
| GET | `/api/procedures/my-requests` | Mis solicitudes (auth) |
| GET | `/api/procedures/requests` | Todas las solicitudes (admin) |
| PUT | `/api/procedures/request/:id/status` | Actualizar estado (admin) |
| GET | `/api/procedures/stats` | Estadísticas (admin) |

### Usuarios (Admin)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Detalle de usuario |

### Notificaciones

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/notifications` | Mis notificaciones (auth) |
| PUT | `/api/notifications/:id/read` | Marcar como leída |
| PUT | `/api/notifications/read-all` | Marcar todas como leídas |

## Credenciales de Prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@tupa-unsaac.edu.pe | admin123 |
| Estudiante | elena@unsaac.edu.pe | student123 |
| Estudiante | carlos@unsaac.edu.pe | student123 |

## Funcionalidades por Rol

### Estudiante
- Ver catálogo público de procedimientos
- Iniciar solicitudes de trámites (wizard de 6 pasos)
- Seguimiento del estado de sus solicitudes
- Recibir notificaciones en tiempo real

### Administrador
- Dashboard con estadísticas del sistema
- Aprobar/rechazar solicitudes de trámites
- Gestionar procedimientos del catálogo
- Consultar usuarios registrados

## Configuración

Las variables de entorno se configuran en `backend/.env`:

```env
PORT=5000
JWT_SECRET=tupa_unsaac_secret_key_2024
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
```

## Notas

- Los datos se almacenan en memoria (se reinician al reiniciar el servidor)
- Para configurar el envío de emails, se requiere una cuenta SMTP válida
- El proxy de Vite redirige `/api` al backend en el puerto 5000
