import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const PORT = process.env.PORT || 3000;

const redisSubscriber = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

try {
  await redisSubscriber.connect();
  console.log(`Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);
} catch (error) {
  console.error("Error connecting to Redis:", error);
}

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

redisSubscriber.subscribe("arbitrage_events", (message) => {
  const data = JSON.parse(message);
  io.emit("arbitrage_event", data);
});

httpServer.listen(3000, () => {
  console.log(`Dashboard ready at http://localhost:${PORT}`);
});
