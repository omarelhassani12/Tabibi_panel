const crypto = require('crypto');

function generateSecretKey() {
  // Generate a random buffer of 32 bytes
  const buffer = crypto.randomBytes(32);

  // Convert the buffer to a hexadecimal string
  const secretKey = buffer.toString('hex');

  return secretKey;
}

// Generate and display the secret key
const secretKey = generateSecretKey();
console.log('Generated Secret Key:', secretKey);
