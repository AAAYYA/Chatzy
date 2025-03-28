import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/chat">Chat</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default App;
