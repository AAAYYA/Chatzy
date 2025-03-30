import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileAvatar from '../user/ProfileAvatar';

export default function TopBar() {
  const location = useLocation();

  return (
    <header className="bg-primary text-white h-16 shadow relative">
      <div className="absolute left-6 flex items-center top-1/2 transform -translate-y-1/2">
        <img
          src="/assets/nubbly-logo-white.png"
          alt="Nubbly Logo"
          className="object-contain"
          style={{ height: '90px' }}
        />
        <img
          src="/assets/nubbly-text-white.png"
          alt="Nubbly Text"
          className="object-contain"
          style={{ height: '90px', marginLeft: '-18px' }}
        />
      </div>

      <div className="flex justify-center items-center h-full">
        <ProfileAvatar />
      </div>

      <nav className="absolute right-6 flex items-center space-x-6 text-lg font-medium top-1/2 transform -translate-y-1/2">
        {location.pathname !== '/login' && (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
        {location.pathname !== '/register' && (
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        )}
        <Link to="/chat" className="hover:underline">
          Chat
        </Link>
      </nav>
    </header>
  );
}
