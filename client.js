const net = require('net');
const crypto = require('crypto');

const HOST = '127.0.0.1', PORT = 8080;
const clientRandom = crypto.randomBytes(16).toString('hex');
let serverRandom, serverPublicKey, sessionKey;

const client = net.createConnection({ host: HOST, port: PORT }, () => {
  client.write(JSON.stringify({ type: 'hello', random: clientRandom }));
});

let serverHello;
client.on('data', (raw) => {
  const msg = JSON.parse(raw.toString());
  if (msg.type === 'serverHello') {
    serverRandom = msg.random;
    serverPublicKey = msg.publicKey;
    console.log('[client] got serverHello');

    const premaster = crypto.randomBytes(16).toString('hex');
    const enc = crypto.publicEncrypt(serverPublicKey, Buffer.from(premaster, 'hex')).toString('base64');
    sessionKey = crypto.createHash('sha256').update(clientRandom + serverRandom + premaster).digest(); // 32B
    client.write(JSON.stringify({ type: 'premaster', data: enc }));
    console.log('[client] premaster sent; sessionKey ready');
  }
});
