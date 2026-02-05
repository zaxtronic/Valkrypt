const crypto = require('crypto');
require('dotenv').config(); // Carga las variables del .env

// Usamos la clave del .env, y ponemos una por defecto solo por seguridad extrema
const SECRET_KEY = process.env.OFFLINE_SECRET || 'clave_temporal_emergencia';

const generateSignature = (data) => {
  const dataString = JSON.stringify(data);
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(dataString)
    .digest('hex');
};

const verifyIntegrity = (data, signature) => {
  const expectedSignature = generateSignature(data);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

module.exports = { generateSignature, verifyIntegrity };