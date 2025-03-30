import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">Profil</h2>
        <p className="text-red-500">Aucun utilisateur n’est connecté.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img
            src={user.avatarUrl || '/assets/default-avatar.png'}
            alt="avatar"
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-500">
            {user.firstName} {user.lastName}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Téléphone:</strong> {user.phone}</p>
        <p><strong>Bio:</strong> {user.bio || 'Aucune bio'}</p>
      </div>
    </div>
  );
}
