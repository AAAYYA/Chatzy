import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TopBar() {
  const location = useLocation();

  return (
    <header className="bg-primary text-white h-16 shadow relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-center">
        
        <div className="flex items-center" style={{ gap: '0px' }}>
          <img
            src="/assets/nubbly-logo-white.png"
            alt="Nubbly Logo"
            className="object-contain"
            style={{
              height: '90px'
            }}
          />

          <img
            src="/assets/nubbly-text-white.png"
            alt="Nubbly Text"
            className="object-contain"
            style={{
              height: '90px',
              marginLeft: '-18px'
            }}
          />
        </div>
      </div>

      <nav className="text-lg font-medium absolute top-0 right-6 h-full flex items-center space-x-6">
        {location.pathname !== '/login' && (
          <Link to="/login" className="hover:underline">Login</Link>
        )}
        {location.pathname !== '/register' && (
          <Link to="/register" className="hover:underline">Register</Link>
        )}
        <Link to="/chat" className="hover:underline">Chat</Link>
      </nav>
    </header>
  );
}
