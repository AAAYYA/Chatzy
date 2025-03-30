import React, { useState } from 'react';
import axios from 'axios';

export default function MessageInput() {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    const token = localStorage.getItem('chatzy_token');
    try {
      await axios.post('http://localhost:3000/api/messages', { content: text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4 flex">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        className="flex-1 p-2 border rounded-l"
        placeholder="Type your message..."
      />
      <button onClick={handleSend} className="p-2 bg-primary text-white rounded-r">
        Send
      </button>
    </div>
  );
}
