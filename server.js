const net = require('net');
const crypto = require('crypto');

const PORT = 8080;

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
});

console.log('[server] RSA keys generated');

const server = net.createServer((socket) => {
  console.log('[server] client connected');
  
  socket.on('data', (data) => {
    console.log('[server] received:', data.toString());
    // Відправляємо публічний ключ
    socket.write(publicKey);
  });
  
  socket.on('end', () => console.log('[server] client disconnected'));
});

server.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT}`);
});