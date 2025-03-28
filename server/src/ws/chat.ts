import type { WebSocket } from 'ws';

type WebSocketHandler = {
  onOpen: (ws: WebSocket) => void;
  onMessage: (ws: WebSocket, message: string) => void;
  onClose: (ws: WebSocket, code: number, reason: string) => void;
};

type ChatMessage = {
  type: 'message';
  user: string;
  text: string;
};

const chatHandler: WebSocketHandler = {
  onOpen(ws) {
    console.log('Client connecté');
    ws.send(JSON.stringify({ type: 'system', message: 'Bienvenue sur Chatzy !' }));
  },
  onMessage(ws, message) {
    try {
      const data: ChatMessage = JSON.parse(message as string);
      console.log(`[${data.user}]: ${data.text}`);
      ws.send(JSON.stringify({ type: 'echo', text: data.text }));
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: 'Message invalide' }));
    }
  },
  onClose(ws, code, reason) {
    console.log(`Client déconnecté : ${code} ${reason}`);
  },
};

export default chatHandler;
