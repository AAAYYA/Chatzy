import { useEffect, useState } from 'react';

export default function useChatSocket() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws');
    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (msg) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
    }
  };

  return { messages, sendMessage };
}
