import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { username, email, firstName, lastName, phone, password } = formData;

    if (!username || !email || !firstName || !lastName || !phone || !password) {
      alert('Tous les champs sont requis');
      return;
    }

    try {
      const { token } = await registerUser(formData);
      localStorage.setItem('chatzy_token', token);
      navigate('/chat');
    } catch (err) {
      console.error(err);
      alert('Register failed: ' + (err?.response?.data?.error || err.message));
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: '10px' }}>
        Déjà un compte ?{' '}
        <span
          onClick={() => navigate('/login')}
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          Connecte-toi
        </span>
      </p>
    </div>
  );
}
