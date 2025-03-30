import React from 'react';

export default function MessageBubble({ message }) {
  const isMine = message.userId === 1;

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-2 rounded-lg text-sm max-w-[70%] ${
          isMine
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
