// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const messageString = message.toString();
    console.log('Received:', messageString);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket 서버가 ws://localhost:4000에서 실행 중입니다.');
