-- ============================================================
--  TUPA UNSAAC  –  SEED DE DATOS DE PRUEBA
--  Ejecutar DESPUÉS de schema.sql
-- ============================================================

BEGIN;

-- ============================================================
--  1. ESPECIALIDAD
-- ============================================================
INSERT INTO especialidad (cod_especialidad, nombre_especialidad, facultad) VALUES
('001', 'Ingeniería Informática y de Sistemas', 'Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica'),
('002', 'Ingeniería Civil', 'Facultad de Ingeniería Civil'),
('003', 'Medicina Humana', 'Facultad de Medicina Humana'),
('004', 'Derecho', 'Facultad de Derecho y Ciencias Sociales'),
('005', 'Contabilidad', 'Facultad de Ciencias Contables y Administrativas');

-- ============================================================
--  2. USUARIO GENERAL
--  password_hash es un valor de ejemplo (no un hash real)
-- ============================================================
INSERT INTO usuario_general
(dni, nombres, ap_paterno, ap_materno, email_institucional, email_personal, telefono, password_hash, cod_especialidad, codigo_universitario, semestre_actual, avatar_url, activo) VALUES
('70123456', 'Amilcar', 'Estrada', 'Quispe', 'amilcar.estrada@unsaac.edu.pe', 'amilcar.eq@gmail.com', '984123456', '$2b$10$oHJLT9pp/kCo0IPcmOS8Yeh9za3sDaJmT//9BkGGPMkeshyQUSRw6', '001', '20201234', '8', NULL, TRUE),
('71234567', 'Maria', 'Huamani', 'Condori', 'maria.huamani@unsaac.edu.pe', 'maria.hc@gmail.com', '984234567', '$2b$10$oHJLT9pp/kCo0IPcmOS8Yeh9za3sDaJmT//9BkGGPMkeshyQUSRw6', '002', '20191122', '10', NULL, TRUE),
('72345678', 'Jose', 'Mamani', 'Ttito', 'jose.mamani@unsaac.edu.pe', NULL, '984345678', '$2b$10$oHJLT9pp/kCo0IPcmOS8Yeh9za3sDaJmT//9BkGGPMkeshyQUSRw6', '003', '20221001', '4', NULL, TRUE),
('73456789', 'Lucia', 'Quispe', 'Flores', 'lucia.quispe@unsaac.edu.pe', 'lucia.qf@gmail.com', '984456789', '$2b$10$oHJLT9pp/kCo0IPcmOS8Yeh9za3sDaJmT//9BkGGPMkeshyQUSRw6', '004', '20180567', '12', NULL, FALSE),
('74567890', 'Carlos', 'Ccahuana', 'Puma', 'carlos.ccahuana@unsaac.edu.pe', NULL, '984567890', '$2b$10$oHJLT9pp/kCo0IPcmOS8Yeh9za3sDaJmT//9BkGGPMkeshyQUSRw6', '001', '20211890', '6', NULL, TRUE);

-- ============================================================
--  3. USUARIO ADMIN
-- ============================================================
INSERT INTO usuario_admin
(dni, nombres, ap_paterno, ap_materno, email_institucional, telefono, password_hash, codigo_trabajador, rol_admin, avatar_url, activo) VALUES
('40111222', 'Rosa', 'Palomino', 'Vargas', 'rosa.palomino@unsaac.edu.pe', '984111222', '$2b$10$oHJLT9pp/kCo0IPcmOS8Yeh9za3sDaJmT//9BkGGPMkeshyQUSRw6', 'TRB-0001', 'SUPER_ADMIN', NULL, TRUE),
('40222333', 'Edwin', 'Choque', 'Sullca', 'edwin.choque@unsaac.edu.pe', '984222333', '$2b$10$oHJLT9pp/kCo0IPcmOS8Yeh9za3sDaJmT//9BkGGPMkeshyQUSRw6', 'TRB-0002', 'ADMIN', NULL, TRUE),
('40333444', 'Silvia', 'Aragon', 'Delgado', 'silvia.aragon@unsaac.edu.pe', '984333444', '$2b$10$oHJLT9pp/kCo0IPcmOS8Yeh9za3sDaJmT//9BkGGPMkeshyQUSRw6', 'TRB-0003', 'ADMIN', NULL, TRUE);

-- ============================================================
--  4. CATEGORIA
-- ============================================================
INSERT INTO categoria (nombre_categoria, icono, activo) VALUES
('Certificados y Constancias', 'file-certificate', TRUE),
('Matrícula', 'book-open', TRUE),
('Grados y Títulos', 'award', TRUE),
('Movilidad Estudiantil', 'globe', TRUE),
('Bienestar Universitario', 'heart', TRUE);

-- ============================================================
--  5. TRAMITE
-- ============================================================
INSERT INTO tramite (cod_tramite, id_categoria, nombre_tramite, descripcion, base_legal, precio, dias_habiles, unidad_responsable, vigente) VALUES
('TR-001', 1, 'Constancia de Matrícula', 'Documento que certifica la matrícula vigente del estudiante.', 'Reglamento General UNSAAC Art. 45', 25.00, 3, 'Oficina de Registros Académicos', TRUE),
('TR-002', 1, 'Constancia de Egresado', 'Documento que certifica la culminación de estudios.', 'Reglamento General UNSAAC Art. 50', 35.00, 5, 'Oficina de Registros Académicos', TRUE),
('TR-003', 3, 'Diploma de Título Profesional', 'Emisión del diploma de título profesional.', 'Ley Universitaria 30220', 250.00, 30, 'Oficina de Grados y Títulos', TRUE),
('TR-004', 4, 'Convalidación de Cursos', 'Trámite para convalidar cursos de movilidad estudiantil.', 'Reglamento de Movilidad Estudiantil', 60.00, 10, 'Oficina de Cooperación Académica', TRUE),
('TR-005', 5, 'Solicitud de Beca de Comedor', 'Solicitud de acceso a beca de comedor universitario.', 'Reglamento de Bienestar Universitario', 0.00, 7, 'Oficina de Bienestar Universitario', TRUE);

-- ============================================================
--  6. REQUISITO
-- ============================================================
INSERT INTO requisito (cod_tramite, descripcion_requisito, es_obligatorio, orden) VALUES
('TR-001', 'Copia simple de DNI', TRUE, 1),
('TR-001', 'Recibo de pago por derecho de trámite', TRUE, 2),
('TR-002', 'Copia simple de DNI', TRUE, 1),
('TR-002', 'Récord académico actualizado', TRUE, 2),
('TR-003', 'Copia simple de DNI', TRUE, 1),
('TR-003', 'Constancia de egresado', TRUE, 2),
('TR-003', 'Certificado de idiomas', FALSE, 3),
('TR-004', 'Sílabo del curso de origen', TRUE, 1),
('TR-004', 'Certificado de notas de la universidad de origen', TRUE, 2),
('TR-005', 'Ficha socioeconómica', TRUE, 1),
('TR-005', 'Constancia de matrícula vigente', TRUE, 2);

-- ============================================================
--  7. SOLICITUD
-- ============================================================
INSERT INTO solicitud
(id_usuario, cod_tramite, numero_expediente, paso_actual, prioridad, estado, etapa_visible, monto_total, nro_recibo, fecha_pago, fecha_limite, observacion_interna) VALUES
(1, 'TR-001', 'EXP-2026-000001', 6, 'NORMAL', 'COMPLETADO', 'Entregado', 25.00, 'REC-0001', '2026-06-01 10:00:00', '2026-06-05 23:59:59', NULL),
(2, 'TR-004', 'EXP-2026-000002', 3, 'URGENTE', 'EN PROCESO', 'En revisión', 60.00, 'REC-0002', '2026-07-10 09:15:00', '2026-07-25 23:59:59', 'Falta validar sílabo original'),
(3, 'TR-005', 'EXP-2026-000003', 2, 'NORMAL', 'SOLICITADO', 'Recibido', 0.00, NULL, NULL, '2026-08-10 23:59:59', NULL),
(1, 'TR-002', 'EXP-2026-000004', 4, 'BAJA', 'SUBSANACION', 'Observado', 35.00, 'REC-0004', '2026-07-20 14:30:00', '2026-08-15 23:59:59', 'Récord académico incompleto'),
(5, 'TR-003', 'EXP-2026-000005', 1, 'NORMAL', 'BORRADOR', 'Recibido', NULL, NULL, NULL, NULL, NULL);

-- ============================================================
--  8. DOCUMENTO
-- ============================================================
INSERT INTO documento (id_solicitud, id_requisito, nombre_archivo, ruta_archivo, tamano_bytes, estado_validacion) VALUES
(1, 1, 'dni_amilcar.pdf', '/uploads/solicitudes/1/dni_amilcar.pdf', 204800, 'APROBADO'),
(1, 2, 'recibo_pago_001.pdf', '/uploads/solicitudes/1/recibo_pago_001.pdf', 102400, 'APROBADO'),
(2, 8, 'silabo_curso_origen.pdf', '/uploads/solicitudes/2/silabo_curso_origen.pdf', 512000, 'PENDIENTE'),
(2, 9, 'certificado_notas.pdf', '/uploads/solicitudes/2/certificado_notas.pdf', 307200, 'APROBADO'),
(4, 4, 'record_academico.pdf', '/uploads/solicitudes/4/record_academico.pdf', 256000, 'RECHAZADO');

-- ============================================================
--  9. OBSERVACION
-- ============================================================
INSERT INTO observacion (id_solicitud, id_admin, id_documento, descripcion, estado, fecha_respuesta, fecha_limite_subsanacion) VALUES
(4, 2, 5, 'El récord académico presentado no corresponde al periodo solicitado, favor subir el documento correcto.', 'PENDIENTE', NULL, '2026-08-15 23:59:59'),
(2, 1, 3, 'El sílabo debe estar sellado por la universidad de origen.', 'PENDIENTE', NULL, '2026-08-01 23:59:59');

-- ============================================================
--  10. SEGUIMIENTO
-- ============================================================
INSERT INTO seguimiento (id_solicitud, id_usuario_admin, estado_anterior, estado_nuevo, etapa_visible, comentario) VALUES
(1, 1, 'SOLICITADO', 'PAGADO', 'En proceso', 'Pago verificado correctamente'),
(1, 1, 'PAGADO', 'COMPLETADO', 'Entregado', 'Constancia generada y entregada al estudiante'),
(2, 2, 'SOLICITADO', 'PAGADO', 'En proceso', 'Pago verificado'),
(2, 2, 'PAGADO', 'EN PROCESO', 'En revisión', 'En evaluación por la Oficina de Cooperación Académica'),
(4, 2, 'SOLICITADO', 'SUBSANACION', 'Observado', 'Se solicitó corrección del récord académico');

-- ============================================================
--  11. NOTIFICACION
-- ============================================================
INSERT INTO notificacion (id_usuario, id_solicitud, tipo, asunto, mensaje, leida) VALUES
(1, 1, 'ESTADO', 'Trámite completado', 'Tu constancia de matrícula (EXP-2026-000001) ha sido completada y está lista para descarga.', TRUE),
(2, 2, 'PAGO', 'Pago confirmado', 'Se ha verificado tu pago para el trámite EXP-2026-000002.', TRUE),
(1, 4, 'OBSERVACION', 'Documento observado', 'Tu récord académico presenta observaciones. Revisa los detalles y vuelve a subir el documento.', FALSE),
(3, 3, 'ESTADO', 'Solicitud recibida', 'Tu solicitud de beca de comedor (EXP-2026-000003) ha sido recibida.', FALSE),
(5, 5, 'VENCIMIENTO', 'Recordatorio', 'Tienes una solicitud en borrador pendiente de completar.', FALSE);

COMMIT;