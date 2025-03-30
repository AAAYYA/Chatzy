import React, { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import axios from 'axios';

export default function ChatWindow() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('chatzy_token');
        axios.get('http://localhost:3000/api/messages', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setMessages(response.data.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="flex-1 flex flex-col h-full p-6">
            <div className="flex-1 overflow-y-auto space-y-4">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
            </div>
            <MessageInput />
        </div>
    );
}
