const WebSocket = require('ws');

// Use the PORT environment variable provided by Render, or fallback to 4000
const PORT = process.env.PORT || 4000;

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const messageString = message.toString();
    console.log('Received:', messageString);

    // Broadcast the message to all connected clients
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

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
