const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'TUPA UNSAAC <noreply@tupa-unsaac.edu.pe>',
      to,
      subject,
      html,
    });
    console.log('Email enviado a', to);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error.message);
    return false;
  }
};

const sendProcedureStatusEmail = async (email, procedureTitle, status) => {
  const statusMessages = {
    approved: 'ha sido aprobado',
    rejected: 'ha sido rechazado',
    observed: 'tiene observaciones',
    in_review: 'esta en revision',
    completed: 'ha sido completado',
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #002045; color: white; padding: 20px; text-align: center;">
        <h1>TUPA UNSAAC</h1>
      </div>
      <div style="padding: 20px; background: #f9fafb;">
        <h2>Actualizacion de Tramite</h2>
        <p>Su tramite <strong>${procedureTitle}</strong> ${statusMessages[status] || 'ha cambiado de estado'}.</p>
        <p>Ingrese al portal para mas detalles.</p>
        <br>
        <p>Atentamente,<br>Equipo TUPA UNSAAC</p>
      </div>
      <div style="background: #e5e7eb; padding: 10px; text-align: center; font-size: 12px;">
        <p>© 2024 Universidad Nacional de San Antonio Abad del Cusco</p>
      </div>
    </div>
  `;

  return await sendEmail(email, `TUPA UNSAAC - Actualizacion de Tramite`, html);
};

module.exports = { sendEmail, sendProcedureStatusEmail };
