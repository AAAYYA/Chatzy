import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  return (
    <div className="flex w-full h-full min-h-0">
      <Sidebar onSelectConversation={setSelectedConversationId} />
      
      <ChatWindow conversationId={selectedConversationId} />
    </div>
  );
}
