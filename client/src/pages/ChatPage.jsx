import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';

export default function ChatPage() {
  return (
    <div className="flex w-full h-full min-h-0">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
