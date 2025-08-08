// Simple WebRTC signaling server for up to 4 peers per room.
const http = require("http");
const express = require("express");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const rooms = new Map(); // roomName -> Map(clientId -> ws)

app.use(express.static(path.join(__dirname, "public")));

function inRoom(room) {
  if (!rooms.has(room)) rooms.set(room, new Map());
  return rooms.get(room);
}

function send(ws, obj) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
}

function relay(room, targetId, obj) {
  const ws = inRoom(room).get(targetId);
  if (ws) send(ws, obj);
}

wss.on("connection", (ws) => {
  let room = null;
  let id = Math.random().toString(36).slice(2, 10);

  ws.on("message", (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch { return; }

    if (data.type === "join") {
      room = (data.room || "family").slice(0, 48);
      const clients = inRoom(room);
      if (clients.size >= 4) {
        return send(ws, { type: "error", message: "Room full (max 4)." });
      }
      clients.set(id, ws);
      send(ws, { type: "init", id, peers: [...clients.keys()].filter(pid => pid !== id) });
      for (const [pid, pws] of clients.entries()) {
        if (pid !== id) send(pws, { type: "peer-joined", id });
      }
    }

    if (data.type === "signal" && data.target) {
      relay(room, data.target, { type: "signal", from: id, data: data.data });
    }
  });

  ws.on("close", () => {
    if (!room) return;
    const clients = inRoom(room);
    clients.delete(id);
    for (const [pid, pws] of clients.entries()) {
      send(pws, { type: "peer-left", id });
    }
    if (clients.size === 0) rooms.delete(room);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Signaling server on http://0.0.0.0:" + PORT);
});
