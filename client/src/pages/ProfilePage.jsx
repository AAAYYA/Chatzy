import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';

export default function ProfilePage() {
  const { user, token, refresh } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">Profil</h2>
        <p className="text-red-500">Aucun utilisateur n’est connecté.</p>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    username: user.username || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    bio: user.bio || '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      await api.put(
        `/users/${user.id}`,
        {
          username: formData.username.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          bio: formData.bio.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await refresh();
      setFeedback('Profil mis à jour avec succès !');
    } catch (err) {
      console.error(err);
      setFeedback('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <div className="flex items-center space-x-4">
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

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Téléphone:</strong> {user.phone}</p>
        <p><strong>Bio:</strong> {user.bio || 'Aucune bio'}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Modifier mon profil</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="border rounded w-full p-2"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="firstName">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="border rounded w-full p-2"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="lastName">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="border rounded w-full p-2"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Téléphone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="border rounded w-full p-2"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="bio">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={3}
              className="border rounded w-full p-2"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors disabled:opacity-70"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>

        {feedback && (
          <p className="mt-2 text-sm text-green-600">{feedback}</p>
        )}
      </div>
    </div>
  );
}
