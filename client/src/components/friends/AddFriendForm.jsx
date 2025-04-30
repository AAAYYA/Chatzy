import React, { useState } from 'react';
import api from '../../lib/api';

export default function AddFriendForm({ token, onSuccess }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      const res = await api.post(
        '/friends',
        { recipientUsername: username.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedback('Demande envoyée à ' + username.trim());
      setUsername('');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Erreur';
      setFeedback(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-2 bg-white rounded shadow mb-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <label htmlFor="friendUsername" className="text-sm font-medium">
          Ajouter un ami par username
        </label>
        <input
          id="friendUsername"
          type="text"
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          placeholder="Entrez un username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary disabled:opacity-60"
        >
          {loading ? 'Envoi...' : 'Ajouter'}
        </button>
      </form>

      {feedback && (
        <p className="mt-1 text-xs text-gray-700">
          {feedback}
        </p>
      )}
    </div>
  );
}
