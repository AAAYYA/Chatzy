import React from 'react';

export default function MessageBubble({ message }) {
  const isSent = message.userId === 1;
  return (
    <div className={`p-2 rounded max-w-xs ${isSent ? 'bg-primary text-white self-end' : 'bg-gray-200 text-black self-start'}`}>
      {message.content}
    </div>
  );
}
