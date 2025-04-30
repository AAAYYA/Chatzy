import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { AuthContext } from '../../context/AuthContext';
import useChatSocket from '../../hooks/useChatSocket';
import api from '../../lib/api';

export default function ChatWindow({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const myId = user?.id;
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const token = localStorage.getItem('chatzy_token');
    api
      .get(`conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data.data))
      .catch(console.error);
  }, [conversationId]);

  const handleWsMessage = useCallback((msg) => {
    if (msg.type !== 'message') return;
    if (msg.data.conversationId !== conversationId) return;

    setMessages((prev) => {
      if (prev.find((m) => m.id === msg.data.id)) return prev;
      return [...prev, msg.data];
    });
  }, [conversationId]);

  useChatSocket(handleWsMessage);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;

    if (isAtBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  function handleNewMessage() {
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {!conversationId ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Sélectionnez un ami pour chatter
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} currentUserId={myId} />
            ))}
          </div>

          <div className="border-t p-4">
            <MessageInput
              conversationId={conversationId}
              onSendMessage={handleNewMessage} 
            />
          </div>
        </>
      )}
    </div>
  );
}
