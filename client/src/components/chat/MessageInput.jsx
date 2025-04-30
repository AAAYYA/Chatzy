import React, { useState } from 'react';
import api from '../../lib/api';

export default function MessageInput({ conversationId, onSendMessage }) {
  const [text, setText] = useState('');

  async function handleSend() {
    const token = localStorage.getItem('chatzy_token');
    if (!text.trim() || !conversationId) return;

    try {
      const res = await api.post(
        `/conversations/${conversationId}/messages`,
        { content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setText('');
      onSendMessage?.(res.data.data);

    } catch (err) {
      console.error(err);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Tapez votre message..."
        className="flex-1 border rounded-l px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="bg-primary text-white px-4 py-2 rounded-r text-sm hover:bg-secondary transition-colors"
      >
        Send
      </button>
    </div>
  );
}
