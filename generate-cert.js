const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Create ssl directory if it doesn't exist
if (!fs.existsSync('./ssl')) {
    fs.mkdirSync('./ssl');
}

// Generate a private key
const privateKey = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// Create a simple self-signed certificate
const cert = crypto.createCertificate();
cert.setPublicKey(privateKey.publicKey);
cert.sign(privateKey.privateKey, 'sha256');

// Write the certificate and private key to files
fs.writeFileSync('./ssl/cert.pem', cert.getPEM());
fs.writeFileSync('./ssl/key.pem', privateKey.privateKey);

console.log('SSL certificate and private key generated successfully!');
console.log('Certificate: ./ssl/cert.pem');
console.log('Private key: ./ssl/key.pem'); 