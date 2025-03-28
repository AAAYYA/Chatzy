import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) {
      alert('Username required');
      return;
    }

    try {
      const { token } = await loginUser(username);
      localStorage.setItem('chatzy_token', token);
      navigate('/chat');
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + (err?.response?.data?.error || err.message));
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
