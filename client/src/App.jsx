import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './components/layout/TopBar';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      <TopBar />
      <main className="flex h-[calc(100vh-72px)]">
        <Outlet />
      </main>
    </div>
  );
}
