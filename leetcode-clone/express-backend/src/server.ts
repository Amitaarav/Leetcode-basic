import { createServer } from "http";
import app from "./app.js";
import { initWebSocket } from "./config/websocket.js";
import { connectRedis } from "./config/redis.js";

async function startServer() {
  try {
    await connectRedis();

    const server = createServer(app);
    initWebSocket(server);

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server start error:", err);
  }
}

startServer();
