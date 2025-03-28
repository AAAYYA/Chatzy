import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('chatzy_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchMessages(token);
  }, []);

  async function fetchMessages(token) {
    try {
      const res = await axios.get('http://localhost:3000/api/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load messages');
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Chat Page</h1>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            <strong>#{m.id}</strong> {m.content} (User: {m.userId})
          </li>
        ))}
      </ul>
      <p>— Fin de la démo —</p>
    </div>
  );
}
