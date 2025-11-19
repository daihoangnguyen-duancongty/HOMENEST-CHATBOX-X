'use client';

import { useAuthStore } from '@/store/authSlice';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Chỉ render sau khi mount trên client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.name || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </div>
    </header>
  );
}
