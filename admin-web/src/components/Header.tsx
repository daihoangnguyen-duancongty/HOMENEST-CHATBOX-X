// src/components/Header.tsx
"use client";

import { useAuthStore } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  if (!user) return null;
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <div className="flex items-center gap-4">
        <img src={user.avatar || "/default-avatar.png"} alt={user.name || "User"} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-gray-800">{user.name || user.userId || "No name"}</div>
          <div className="text-sm text-gray-500 capitalize">{user.role}</div>
        </div>
      </div>

      <div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
}
