const jwt = require('jsonwebtoken');

/**
 * Dos secretos distintos para access y refresh: si se filtra el de acceso no
 * sirve para forjar refresh tokens (patrón tomado del proyecto de referencia).
 * Se cae al JWT_SECRET anterior para no romper entornos ya configurados.
 */
const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'tupa_unsaac_access_secret_dev';
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || `${ACCESS_SECRET}_refresh`;

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';

/** Días de vigencia del refresh token, para calcular expires_at en la BD. */
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);

function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

// Alias conservados: el resto del backend ya importaba estos nombres.
const generateToken = signAccessToken;
const verifyToken = verifyAccessToken;

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateToken,
  verifyToken,
  REFRESH_DAYS,
};
