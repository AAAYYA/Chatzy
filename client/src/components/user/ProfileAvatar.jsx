import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProfileAvatar() {
    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    if (!user) return null;

    const avatarUrl = user.avatarUrl || '/assets/default-avatar.png';

    return (
        <div className="relative inline-block">
            <div
                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-white"
                onClick={() => setOpen((prev) => !prev)}
            >
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                />
            </div>

            {open && (
                <div
                    ref={panelRef}
                    className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-lg py-3 px-4 z-50"
                    style={{ minWidth: '200px' }}
                >
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <img
                                src={avatarUrl}
                                alt="User avatar"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div>
                            <p className="text-gray-800 font-semibold">{user.username}</p>
                            <p className="text-sm text-gray-500">
                                {user.firstName} {user.lastName}
                            </p>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600">
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone}</p>
                    </div>

                    <hr className="my-2" />

                    <Link
                        to="/profile"
                        className="block text-primary text-sm font-medium hover:underline"
                    >
                        Voir mon profil
                    </Link>

                    <button
                        onClick={() => {
                            logout();
                            setOpen(false);
                        }}
                        className="block text-primary text-sm font-medium hover:underline mt-2"
                    >
                        Déconnexion
                    </button>

                </div>
            )}
        </div>
    );
}
