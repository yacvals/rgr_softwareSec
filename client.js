const net = require('net');

const PORT = 8080;
const HOST = '127.0.0.1';

const client = net.createConnection({ port: PORT, host: HOST }, () => {
  console.log('[client] connected to server');
  client.write('hello from client');
});

client.on('data', (data) => {
  console.log('[client] received:', data.toString());
});

client.on('end', () => {
  console.log('[client] disconnected from server');
});
