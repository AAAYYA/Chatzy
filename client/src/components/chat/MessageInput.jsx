import React, { useState } from 'react';
import axios from 'axios';

export default function MessageInput() {
  const [text, setText] = useState('');

  const handleSend = async () => {
    const token = localStorage.getItem('chatzy_token');
    if (!text.trim()) return;

    try {
      await axios.post(
        'http://localhost:3000/api/messages',
        { content: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 border rounded-l px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={text}
        onChange={(e) => setText(e.target.value)}
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
