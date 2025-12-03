const net = require('net');

const PORT = 8080;

const server = net.createServer((socket) => {
  console.log('[server] client connected');

  socket.on('data', (data) => {
    console.log('[server] received:', data.toString());
  });

  socket.on('end', () => {
    console.log('[server] client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT}`);
});
