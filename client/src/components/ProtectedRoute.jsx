import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);
  if (!auth.token) {
    return <Navigate to="/login" />;
  }
  return children;
}
