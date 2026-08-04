const multer = require('multer');

/**
 * El backend corre como función serverless en Vercel: el disco es efímero y
 * no se comparte entre invocaciones, así que un archivo guardado con
 * diskStorage podía desaparecer antes de que otra petición (u otra máquina)
 * lo pidiera. memoryStorage entrega el archivo como Buffer en
 * `file.buffer`, que los servicios guardan directo en Postgres (columna
 * `contenido`/`avatar_contenido`), la única capa que persiste de verdad.
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Sin statusCode explícito este error terminaba como un 500 genérico.
    const error = new Error('Formato de archivo no permitido. Solo se aceptan PDF, JPG, JPEG y PNG.');
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

module.exports = upload;
