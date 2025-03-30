import React from 'react';

export default function Sidebar() {
    const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
    ];

    return (
        <aside className="w-64 h-full bg-accent p-4 border-r border-gray-300 shadow-md">
            <h2 className="text-lg font-bold mb-4">Users</h2>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="cursor-pointer hover:bg-primary hover:text-white px-3 py-2 rounded"
                    >
                        {user.name}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
