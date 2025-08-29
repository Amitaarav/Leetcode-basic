import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer;

export function initWebSocket(server: any) {
  wss = new WebSocketServer({ server });
  console.log("WebSocket server started");

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client has connected");

    ws.on("message", (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
        }
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}

export function sendToClient(socket: WebSocket, type: string, payload: any) {
  socket.send(JSON.stringify({ type, ...payload }));
}

export { wss };
