const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const Redis = require("ioredis");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;
const INSTANCE = process.env.INSTANCE_NAME || "chat";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const publisher = new Redis(REDIS_URL);
const subscriber = new Redis(REDIS_URL);

app.get("/health", (_req, res) => {
  res.json({ ok: true, instance: INSTANCE });
});

subscriber.subscribe("chat");

subscriber.on("message", (_channel, raw) => {
  const message = JSON.parse(raw);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
});

wss.on("connection", (socket) => {
  console.log(`Client connected to ${INSTANCE}`);

  socket.send(JSON.stringify({
    type: "system",
    text: `Connected to ${INSTANCE}`
  }));

  socket.on("message", async (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (!data.text || !data.text.trim()) return;

    const message = {
      type: "chat",
      user: data.user || "Anonymous",
      text: data.text.trim(),
      server: INSTANCE,
      time: new Date().toISOString()
    };

    await publisher.publish("chat", JSON.stringify(message));
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`${INSTANCE} listening on port ${PORT}`);
});
