const jwt = require('jsonwebtoken');

function generateJWT(sharedSecret) {
  const message = {
    name: 'zendick',
    email: 'zendick@zendesk.com',
    iat: Date.now(),
    jti: ((Math.random() * 0xFFFFFF) | 0).toString(16) // don't ask.. just shh
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
