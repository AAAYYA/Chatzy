import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

export default function ChatWindow() {
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      const token = localStorage.getItem('chatzy_token');
      axios
        .get('http://localhost:3000/api/messages', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMessages(res.data.data))
        .catch(console.error);
    }, []);
  
    return (
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
  
        <div className="border-t p-4">
          <MessageInput />
        </div>
      </div>
    );
  }
  