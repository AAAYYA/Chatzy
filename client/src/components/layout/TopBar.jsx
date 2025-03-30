import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TopBar() {
  const location = useLocation();
  return (
    <header className="bg-primary text-white px-6 py-4 shadow">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/chatzy-logo-white.png"
            alt="Chatzy Logo"
            className="w-10 h-10"
          />
          <h1 className="text-xl font-semibold">Chatzy</h1>
        </div>
        <nav className="space-x-4 text-sm font-medium">
          {location.pathname !== '/login' && (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
          {location.pathname !== '/register' && (
            <Link to="/register" className="hover:underline">Register</Link>
          )}
          <Link to="/chat" className="hover:underline">Chat</Link>
        </nav>
      </div>
    </header>
  );
}
