import { useEffect, useRef } from 'react';

export default function useChatSocket(onWsMessage?: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('chatzy_token');
    if (!token) {
      console.warn('No JWT token – WS disabled');
      return;
    }

    const WS_BASE = import.meta.env.VITE_WS_URL;
    const ws = new WebSocket(`${WS_BASE}?token=${token}`);    wsRef.current = ws;

    ws.onopen = () => console.log('[WS] connected ✅');
    ws.onmessage = (e) => {
        console.log('[WS] raw', e.data);
      try {
        const data = JSON.parse(e.data);
        onWsMessage?.(data);
      } catch {}
    };
    ws.onclose = () => console.log('[WS] closed');
    ws.onerror = (e) => console.error('[WS] error', e);

    return () => ws.close();
  }, [onWsMessage]);

  return wsRef;
}
