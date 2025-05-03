import { Hono } from "hono";

export const wsApp = new Hono();

wsApp.get("/ws", (c) => {
  return c.json({
    error: "WebSocket endpoint moved to ws://<host>:4000/socket via Phoenix"
  }, 410);
});
