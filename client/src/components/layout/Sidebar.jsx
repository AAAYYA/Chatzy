import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AddFriendForm from '../friends/AddFriendForm';
import PendingRequests from '../friends/PendingRequests';
import api from '../../lib/api';

export default function Sidebar({ onSelectConversation }) {
    const { token, friends, refresh, user } = useContext(AuthContext);

    async function handleFriendClick(friendId) {
        try {
            const res = await api.post(
                '/conversations',
                { recipientId: friendId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const conversation = res.data.data;
            onSelectConversation(conversation.id);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la création/récupération de conversation');
        }
    }

    const filteredFriends = friends.filter((friend) => friend.id !== user.id);

    return (
        <aside className="w-64 h-full bg-accent border-r border-gray-300 p-4 shadow-md flex flex-col">
            <h2 className="text-lg font-bold mb-2">Friends</h2>

            <AddFriendForm
                token={token}
                onSuccess={() => {
                    refresh();
                }}
            />

            <PendingRequests />

            <ul className="space-y-2 flex-1 overflow-auto">
                {filteredFriends && filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                        <li
                            key={friend.id}
                            className="cursor-pointer hover:bg-primary hover:text-white px-3 py-2 rounded transition-colors"
                            onClick={() => handleFriendClick(friend.id)}
                        >
                            {friend.username}
                        </li>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Aucun ami pour le moment</p>
                )}
            </ul>
        </aside>
    );
}
