/**
 * Límite de intentos por IP, en memoria.
 *
 * El proyecto de referencia no tenía ninguno: se podía pedir códigos de
 * recuperación o probar contraseñas sin freno. Esto es suficiente para un
 * despliegue de un solo proceso como el de este proyecto; con varias
 * instancias haría falta Redis.
 */
const contadores = new Map();

// Barrido periódico para que el Map no crezca sin control.
const LIMPIEZA_MS = 10 * 60 * 1000;
const temporizador = setInterval(() => {
  const ahora = Date.now();
  for (const [clave, dato] of contadores) {
    if (dato.reiniciaEn <= ahora) contadores.delete(clave);
  }
}, LIMPIEZA_MS);
// No mantener vivo el proceso sólo por este intervalo.
temporizador.unref?.();

function limitarIntentos({ max = 10, ventanaMin = 15 } = {}) {
  const ventanaMs = ventanaMin * 60 * 1000;

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'desconocida';
    const clave = `${ip}:${req.method}:${req.baseUrl}${req.path}`;
    const ahora = Date.now();

    let dato = contadores.get(clave);
    if (!dato || dato.reiniciaEn <= ahora) {
      dato = { intentos: 0, reiniciaEn: ahora + ventanaMs };
    }

    dato.intentos += 1;
    contadores.set(clave, dato);

    if (dato.intentos > max) {
      const faltanSeg = Math.ceil((dato.reiniciaEn - ahora) / 1000);
      res.set('Retry-After', String(faltanSeg));
      return res.status(429).json({
        error: `Demasiados intentos. Vuelve a intentarlo en ${Math.ceil(faltanSeg / 60)} minuto(s).`,
        statusCode: 429,
      });
    }

    next();
  };
}

module.exports = { limitarIntentos };
