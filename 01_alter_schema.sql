-- Script de Migración Incremental (Fase 0)
-- Este script actualiza el esquema actual para soportar todos los requerimientos del frontend

-- 1. Actualización de tabla ESPECIALIDAD
ALTER TABLE especialidad 
ADD COLUMN facultad VARCHAR(150);

-- 2. Actualización de tabla USUARIO_GENERAL
ALTER TABLE usuario_general
ADD COLUMN codigo_universitario VARCHAR(20) UNIQUE,
ADD COLUMN email_personal VARCHAR(100),
ADD COLUMN semestre_actual VARCHAR(30),
ADD COLUMN avatar_url VARCHAR(300);

-- Renombrar email a email_institucional para ser explícitos
ALTER TABLE usuario_general RENAME COLUMN email TO email_institucional;

-- 3. Actualización de tabla USUARIO_ADMIN
ALTER TABLE usuario_admin
ADD COLUMN codigo_trabajador VARCHAR(20) UNIQUE,
ADD COLUMN rol_admin VARCHAR(20) NOT NULL DEFAULT 'ADMIN' CHECK (rol_admin IN ('ADMIN', 'SUPER_ADMIN')),
ADD COLUMN avatar_url VARCHAR(300);

-- Renombrar email también aquí por consistencia
ALTER TABLE usuario_admin RENAME COLUMN email TO email_institucional;

-- 4. Actualización de tabla SOLICITUD
ALTER TABLE solicitud
ADD COLUMN numero_expediente VARCHAR(50) UNIQUE,
ADD COLUMN prioridad VARCHAR(20) NOT NULL DEFAULT 'NORMAL' CHECK (prioridad IN ('BAJA', 'NORMAL', 'URGENTE'));

-- Modificar el constraint de estados
ALTER TABLE solicitud DROP CONSTRAINT IF EXISTS solicitud_estado_check;
ALTER TABLE solicitud ADD CONSTRAINT solicitud_estado_check CHECK (estado IN (
    'BORRADOR',
    'SOLICITADO',
    'VERIFICANDO_PAGO',
    'PAGADO',
    'EN PROCESO',
    'SUBSANACION',
    'OBSERVADO',
    'COMPLETADO',
    'ANULADO',
    'RECHAZADO'
));

-- 5. Actualización de tabla OBSERVACION
ALTER TABLE observacion
ADD COLUMN fecha_limite_subsanacion TIMESTAMP;
