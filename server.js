const net = require('net');
const crypto = require('crypto');

const PORT = 8080;
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
});
const serverRandom = crypto.randomBytes(16).toString('hex');

const server = net.createServer((socket) => {
  console.log('[server] client connected');

  socket.on('data', (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.type === 'hello') {
      socket.write(JSON.stringify({
        type: 'serverHello',
        random: serverRandom,
        publicKey,
      }));
    }
    if (msg.type === 'premaster') {
      const premaster = crypto.privateDecrypt(privateKey, Buffer.from(msg.data, 'base64')).toString('hex');
      sessionKey = crypto.createHash('sha256').update(clientRandom + serverRandom + premaster).digest();
      console.log('[server] premaster decrypted; sessionKey ready');
    }
  });
});
server.listen(PORT, () => console.log(`[server] listening on ${PORT}`));
