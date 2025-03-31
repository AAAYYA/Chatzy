import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { AuthContext } from '../../context/AuthContext';

export default function ChatWindow({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const myId = user?.id;

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const token = localStorage.getItem('chatzy_token');

    axios
      .get(`http://localhost:3000/api/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data.data))
      .catch(console.error);
  }, [conversationId]);

  function handleNewMessage(msg) {
    setMessages((prev) => [...prev, msg]);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {!conversationId ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Sélectionnez un ami pour chatter
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} currentUserId={myId} />
            ))}
          </div>

          <div className="border-t p-4">
            <MessageInput conversationId={conversationId} onSendMessage={handleNewMessage} />
          </div>
        </>
      )}
    </div>
  );
}
