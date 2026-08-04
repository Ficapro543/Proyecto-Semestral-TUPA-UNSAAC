/**
 * Envío de correo con nodemailer.
 *
 * Si no hay SMTP configurado, los correos se imprimen en consola en vez de
 * fallar: así el registro y la recuperación de contraseña funcionan de
 * principio a fin en desarrollo sin credenciales (patrón de la referencia).
 * El enlace o código sale destacado en el log para poder copiarlo.
 */
const nodemailer = require('nodemailer');

let transporter;
let transporterListo = false;

const FROM = process.env.MAIL_FROM || 'TUPA UNSAAC <no-reply@unsaac.edu.pe>';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

async function getTransporter() {
  if (transporterListo) return transporter;
  transporterListo = true;

  const host = (process.env.MAIL_HOST || '').trim();
  const user = (process.env.MAIL_USER || '').trim();
  // Las contraseñas de aplicación de Google se muestran en grupos de 4
  // separados por espacios; si se pegan tal cual, el login SMTP falla.
  const pass = (process.env.MAIL_PASS || '').replace(/\s/g, '');
  const port = Number(process.env.MAIL_PORT || 587);
  const secure = String(process.env.MAIL_SECURE || 'false') === 'true';

  if (!host || !user || !pass) {
    console.log('ℹ️  SMTP no configurado (falta MAIL_HOST/MAIL_USER/MAIL_PASS).');
    console.log('    Los correos se imprimirán en consola.');
    transporter = null;
    return null;
  }

  transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  try {
    await transporter.verify();
    console.log(`✅ SMTP listo (${host}:${port}) — los correos se enviarán de verdad.`);
  } catch (err) {
    console.warn('⚠️  No se pudo conectar al SMTP:', err.message);
    console.warn('    Revisa MAIL_* en backend/.env. Se usará la consola como respaldo.');
    transporter = null;
  }

  return transporter;
}

/** Imprime el correo en consola cuando no hay SMTP. */
function imprimirEnConsola({ to, subject, destacado }) {
  console.log('\n┌──────────────────────────────────────────────────────────');
  console.log('│  CORREO SIMULADO (no hay SMTP configurado)');
  console.log(`│  Para:    ${to}`);
  console.log(`│  Asunto:  ${subject}`);
  if (destacado) {
    console.log('│');
    console.log(`│  👉  ${destacado}`);
  }
  console.log('└──────────────────────────────────────────────────────────\n');
  return { messageId: `consola-${Date.now()}`, simulado: true };
}

async function enviar({ to, subject, html, text, destacado }) {
  const tr = await getTransporter();
  if (!tr) return imprimirEnConsola({ to, subject, destacado });

  try {
    const info = await tr.sendMail({ from: FROM, to, subject, html, text });
    console.log(`📧 Correo enviado a ${to} (${info.messageId})`);
    return info;
  } catch (err) {
    // Un fallo de SMTP no debe tumbar el registro: se degrada a consola.
    console.error(`❌ Fallo al enviar correo a ${to}:`, err.message);
    return imprimirEnConsola({ to, subject, destacado });
  }
}

// ── Plantilla base, con la identidad visual de TUPA UNSAAC ────────────
const AZUL = '#002045';
const TURQUESA = '#89f5e7';
const FONDO = '#f4f6fa';

function plantilla({ titulo, saludo, cuerpo, bloqueDestacado = '', pie = '' }) {
  return `
  <div style="margin:0;padding:24px;background:${FONDO};font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,32,69,0.08);">
      <div style="background:${AZUL};padding:28px 32px;">
        <div style="color:${TURQUESA};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">
          Portal TUPA · UNSAAC
        </div>
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">${titulo}</h1>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#1a2b45;">${saludo}</p>
        <p style="margin:0 0 20px;font-size:14px;color:#4a5a72;line-height:1.65;">${cuerpo}</p>
        ${bloqueDestacado}
        ${pie ? `<p style="margin:24px 0 0;font-size:13px;color:#6b7a90;line-height:1.6;">${pie}</p>` : ''}
      </div>
      <div style="padding:20px 32px;background:${FONDO};text-align:center;">
        <p style="margin:0;font-size:12px;color:#8695a8;">
          © ${new Date().getFullYear()} Universidad Nacional de San Antonio Abad del Cusco
        </p>
        <p style="margin:4px 0 0;font-size:12px;color:#8695a8;">
          Correo automático, por favor no responder.
        </p>
      </div>
    </div>
  </div>`;
}

function botón(url, etiqueta) {
  return `
    <div style="text-align:center;margin:8px 0 20px;">
      <a href="${url}" target="_blank"
         style="display:inline-block;background:${AZUL};color:#fff;padding:14px 32px;
                text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">
        ${etiqueta}
      </a>
    </div>
    <p style="margin:0;font-size:12px;color:#8695a8;text-align:center;word-break:break-all;">
      Si el botón no funciona, copia este enlace:<br>${url}
    </p>`;
}

function bloqueCodigo(codigo) {
  return `
    <div style="text-align:center;margin:8px 0 20px;padding:24px;background:${FONDO};border-radius:12px;">
      <div style="font-size:13px;color:#4a5a72;margin-bottom:12px;">Tu código de verificación</div>
      <div style="display:inline-block;background:#fff;border:2px solid ${AZUL};border-radius:10px;
                  padding:14px 26px;font-family:'Courier New',monospace;font-size:34px;
                  font-weight:800;letter-spacing:.28em;color:${AZUL};">
        ${codigo}
      </div>
    </div>`;
}

// ── Correos concretos ─────────────────────────────────────────────────

async function enviarCorreoActivacion(email, token, nombre = 'estudiante') {
  const url = `${FRONTEND_URL}/activar/${token}`;
  return enviar({
    to: email,
    subject: 'Activa tu cuenta · Portal TUPA UNSAAC',
    destacado: `Enlace de activación: ${url}`,
    html: plantilla({
      titulo: 'Confirma tu cuenta',
      saludo: `Hola ${nombre},`,
      cuerpo:
        'Tu cuenta en el Portal TUPA fue creada. Sólo falta que confirmes tu correo institucional para poder iniciar sesión y presentar trámites.',
      bloqueDestacado: botón(url, 'Activar mi cuenta'),
      pie: 'Este enlace vence en 24 horas y sólo puede usarse una vez. Si no creaste esta cuenta, ignora este mensaje.',
    }),
    text: `Hola ${nombre},\n\nActiva tu cuenta del Portal TUPA UNSAAC abriendo este enlace:\n${url}\n\nVence en 24 horas.`,
  });
}

async function enviarCodigoRecuperacion(email, codigo, nombre = 'usuario', esReenvio = false) {
  return enviar({
    to: email,
    subject: `${esReenvio ? 'Nuevo código' : 'Código'} de recuperación · Portal TUPA UNSAAC`,
    destacado: `Código de recuperación: ${codigo}`,
    html: plantilla({
      titulo: esReenvio ? 'Tu nuevo código' : 'Recuperar contraseña',
      saludo: `Hola ${nombre},`,
      cuerpo:
        'Solicitaste restablecer tu contraseña. Ingresa este código en el portal para verificar tu identidad.',
      bloqueDestacado: bloqueCodigo(codigo),
      pie: 'El código vence en 30 minutos y sólo puede usarse una vez. No lo compartas con nadie. Si no lo solicitaste, ignora este mensaje: tu contraseña no cambiará.',
    }),
    text: `Hola ${nombre},\n\nTu código de recuperación es: ${codigo}\n\nVence en 30 minutos. Si no lo solicitaste, ignora este mensaje.`,
  });
}

async function enviarConfirmacionCambioPassword(email, nombre = 'usuario') {
  return enviar({
    to: email,
    subject: 'Tu contraseña fue actualizada · Portal TUPA UNSAAC',
    html: plantilla({
      titulo: 'Contraseña actualizada',
      saludo: `Hola ${nombre},`,
      cuerpo:
        'Te confirmamos que la contraseña de tu cuenta del Portal TUPA se cambió correctamente. Ya puedes iniciar sesión con ella.',
      pie: 'Si no fuiste tú, comunícate de inmediato con la Oficina de Registros Académicos.',
    }),
    text: `Hola ${nombre},\n\nTu contraseña del Portal TUPA fue actualizada correctamente.\n\nSi no fuiste tú, avisa a Registros Académicos.`,
  });
}

module.exports = {
  enviarCorreoActivacion,
  enviarCodigoRecuperacion,
  enviarConfirmacionCambioPassword,
  getTransporter,
  FRONTEND_URL,
};
