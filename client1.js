const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Client 1 connected to WebSocket server');
  ws.send(JSON.stringify({ type: 'message', content: 'Hello from Client 1!' }));
});

ws.on('message', (data) => {
  console.log('Client 1 received:', JSON.parse(data));
});

ws.on('close', () => {
  console.log('Client 1 disconnected');
});
