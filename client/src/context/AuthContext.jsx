import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('chatzy_token'),
    user: null,
  });
  const navigate = useNavigate();

  const login = (token, user) => {
    localStorage.setItem('chatzy_token', token);
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('chatzy_token');
    setAuth({ token: null, user: null });
    navigate('/login');
  };

  useEffect(() => {
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
