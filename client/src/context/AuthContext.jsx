import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    token: localStorage.getItem('chatzy_token'),
    user: null,
    friends: [],
    requests: [],
    loading: true,
  });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('chatzy_token');
      if (!token) return logout();

      const headers = { Authorization: `Bearer ${token}` };

      const [me, friends, requests] = await Promise.all([
        axios.get('http://localhost:3000/api/auth/me', { headers }),
        axios.get('http://localhost:3000/api/friends', { headers }),
        axios.get('http://localhost:3000/api/friends/requests', { headers }),
      ]);

      setAuth({
        token,
        user: me.data.data,
        friends: friends.data.data,
        requests: requests.data.data,
        loading: false,
      });
    } catch (err) {
      console.error('Auth fetch error:', err);
      logout();
    }
  };

  const login = (token) => {
    localStorage.setItem('chatzy_token', token);
    setAuth((prev) => ({ ...prev, token }));
    fetchUserData();
  };

  const logout = () => {
    localStorage.removeItem('chatzy_token');
    setAuth({ token: null, user: null, friends: [], requests: [], loading: false });
    navigate('/login');
  };

  useEffect(() => {
    if (auth.token && !auth.user) {
      fetchUserData();
    } else {
      setAuth((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, refresh: fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
