import React from 'react';
import TopBar from './components/layout/TopBar';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-bg text-text font-sans">
      <TopBar />
      <main className="flex-1 flex min-h-0">
        <Outlet />
      </main>
    </div>
  );
}
