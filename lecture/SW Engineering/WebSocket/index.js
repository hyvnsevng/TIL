const express = require("express");
const { WebSocketServer } = require("ws");

const app = express();

app.use(express.static("front"));

app.listen(8000, () => {
  console.log(`Server listening on port 8000`);
});

const wss = new WebSocketServer({ port: 8001 });

let clients = new Set();

function broadcastMessage(message) {
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }

wss.on("connection", (ws) => {
  clients.add(ws);
  broadcastMessage(`새로운 유저 접속 [현재: ${clients.size} 명]`);

  ws.on("message", (data) => {
    const message = JSON.parse(data);
    if (message.type === "chat") {
      broadcastMessage(`${message.username}: ${message.text}`);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    broadcastMessage(`유저 연결 해제 [현재: ${clients.size} 명]`);
  });
});

