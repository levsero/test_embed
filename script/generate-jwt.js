const jwt = require('jsonwebtoken');

function generateJWT(sharedSecret) {
  const message = {
    name: 'zenguy',
    email: 'zenguy@zendesk.com',
    iat: Date.now(),
    // returns a random int between 0 and 0xFFFFFF, and then converts it to a string in hex format (base 16).
    jti: ((Math.random() * 0xFFFFFF) | 0).toString(16)
  };

  return jwt.sign(message, sharedSecret);
}

if (process.argv.length !== 3) {
  console.log('Usage: node script/generate-jwt.js <shared_secret>');
  process.exit(1);
}

const sharedSecret = process.argv[2];
const jwtToken = generateJWT(sharedSecret);

console.log(jwtToken);
