import { useEffect, useRef } from 'react';
import { Socket } from 'phoenix';

function parseJwt(token: string): { userId?: number } {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export default function useChatSocket(onWsMessage?: (data: any) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('chatzy_token');
    if (!token) {
      console.warn('No JWT token');
      return;
    }

    const { userId } = parseJwt(token);
    if (!userId) {
      console.warn('Invalid JWT payload');
      return;
    }

    const socket = new Socket(import.meta.env.VITE_WS_URL!, {
      params: { token }
    });

    socket.connect();

    const channel = socket.channel(`user:${userId}`, {});

    channel
      .join()
      .receive('ok', () => console.log('[WS] joined channel ✅'))
      .receive('error', (e) => console.error('[WS] join error', e));

    channel.on('push', (data) => {
      console.log('[WS] received', data);
      onWsMessage?.(data);
    });

    socketRef.current = socket;

    return () => {
      channel.leave();
      socket.disconnect();
    };
  }, [onWsMessage]);

  return socketRef;
}
