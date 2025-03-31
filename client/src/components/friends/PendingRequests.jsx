import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

export default function PendingRequests() {
  const { token, requests, refresh } = useContext(AuthContext);

  async function handleRespond(requestId, action) {
    try {
      await axios.post(
        'http://localhost:3000/api/friends/respond',
        { requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refresh();
    } catch (err) {
      console.error(err);
      alert('Erreur lors du traitement de la demande');
    }
  }

  if (!requests || requests.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 bg-white p-2 rounded shadow">
      <h3 className="text-sm font-bold mb-2">Demandes d'amis</h3>
      <ul className="space-y-2">
        {requests.map((req) => (
          <li key={req.id} className="flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold">{req.username}</span>
              <span className="ml-2 text-gray-500">
                {req.firstName} {req.lastName}
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleRespond(req.id, 'accept')}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Accepter
              </button>
              <button
                onClick={() => handleRespond(req.id, 'reject')}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Refuser
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
