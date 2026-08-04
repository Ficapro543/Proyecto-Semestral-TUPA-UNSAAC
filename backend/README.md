# API REST Backend — Portal Digital TUPA UNSAAC

Backend robusto para el Portal Digital TUPA UNSAAC desarrollado en **Node.js + Express** con **PostgreSQL (`pg`)**, autenticación **JWT + bcrypt**, y subida de archivos con **multer**.

---

## 🛠️ Stack Tecnológico

- **Entorno**: Node.js
- **Framework Web**: Express 5
- **Base de Datos**: PostgreSQL (`pg` driver directo, sin ORM)
- **Autenticación**: JWT (`jsonwebtoken`) + Hashing de contraseñas con `bcrypt`
- **Gestión de Archivos**: `multer`
- **CORS**: `cors`
- **Variables de Entorno**: `dotenv`
- **Desarrollo**: `nodemon`

---

## 🚀 Inicio Rápido

### 1. Configuración de Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura tus credenciales de PostgreSQL:

```bash
cp .env.example .env
```

Ejemplo de `.env`:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tupa_db
PGHOST=localhost
PGPORT=5432
PGDATABASE=tupa_db
PGUSER=postgres
PGPASSWORD=postgres
JWT_SECRET=tupa_unsaac_secret_jwt_key_2026_super_secure
```

### 2. Instalación de Dependencias

```bash
cd backend
npm install
```

### 3. Inicializar y Poblar la Base de Datos

Asegúrate de que PostgreSQL esté en ejecución y que la base de datos `tupa_db` exista.

```bash
# Solo crear tablas e índices (schema v5)
npm run db:init

# Crear tablas e insertar datos de prueba (seed)
npm run db:seed
```

### 4. Ejecutar el Servidor en Desarrollo

```bash
npm run dev
```

El servidor estará escuchando en `http://localhost:3000/api`.

---

## 👤 Credenciales de Prueba (Seed)

| Rol | Usuario / DNI / Código | Contraseña |
|---|---|---|
| **Estudiante** | `182930` / `71234567` / `182930@unsaac.edu.pe` | `password123` |
| **Administrador** | `ADM-101` / `41234567` / `admin@unsaac.edu.pe` | `password123` |

---

## 📡 Estructura de Endpoints API REST

### Autenticación (`/api/auth`)
- `POST /api/auth/login`: Inicio de sesión (estudiantes y admins).
- `POST /api/auth/google`: Stub (501 Not Implemented).

### Perfil de Usuario (`/api/users`)
- `GET /api/users/profile`: Obtener perfil del usuario autenticado.
- `PUT /api/users/profile`: Actualizar datos del perfil.
- `PUT /api/users/profile/password`: Cambiar contraseña.

### Catálogo de Trámites (`/api/procedures`) — Público
- `GET /api/procedures`: Listar trámites (con búsqueda y filtros).
- `GET /api/procedures/categories`: Listar categorías activas.
- `GET /api/procedures/:cod_tramite`: Detalle de trámite y sus requisitos.

### Solicitudes y Wizard (`/api/requests`)
- `POST /api/requests`: Crear borrador de solicitud (`estado = BORRADOR`).
- `GET /api/requests`: Listar mis solicitudes.
- `GET /api/requests/:id`: Detalle completo de solicitud con documentos, observaciones e historial.
- `PATCH /api/requests/:id/step`: Actualizar paso actual del wizard (1 al 6).
- `POST /api/requests/:id/voucher`: Subir comprobante de pago (`multipart/form-data`).
- `POST /api/requests/:id/document/:id_requisito`: Subir documento de requisito (`multipart/form-data`).
- `POST /api/requests/:id/submit`: Confirmar y enviar solicitud (Genera `EXP-YYYY-XXXXXX`).
- `GET /api/requests/track/:numero_expediente`: Consultar estado público por expediente.

### Documentos (`/api/documents`)
- `DELETE /api/documents/:id_documento`: Eliminar documento subido.

### Notificaciones (`/api/notifications`)
- `GET /api/notifications`: Listar notificaciones del usuario.
- `POST /api/notifications/read-all`: Marcar todas las notificaciones como leídas.
- `PATCH /api/notifications/:id/read`: Marcar una notificación como leída.

### Administración (`/api/admin`) — Requiere rol `ADMIN`
- `GET /api/admin/stats`: Estadísticas del sistema.
- `GET /api/admin/requests`: Lista de solicitudes recibidas.
- `GET /api/admin/requests/:id`: Detalle para validación documentaria.
- `POST /api/admin/requests/:id/decision`: Procesar decisión (Aprobar/Observar/Rechazar).
- `POST /api/admin/procedures`: Crear nuevo trámite.
- `PATCH /api/admin/procedures/:cod_tramite/toggle`: Activar/Desactivar trámite.
- `GET /api/admin/users`: Listar usuarios registrados.
- `PATCH /api/admin/users/:id/toggle`: Activar/Desactivar usuario.
