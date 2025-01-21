
const crypto = require('crypto');

const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secret = generateSecret();
console.log(`La cadena secreta generada es: ${secret}`);
