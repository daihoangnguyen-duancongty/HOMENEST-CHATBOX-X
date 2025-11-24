"use client";

import { useAuthStore } from "@/store/authSlice";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Settings, User, LogOut } from "lucide-react";

export default function Account() {
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // đảm bảo render trên client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown khi click ra ngoài
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!mounted || !user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar + Name */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition w-full"
      >
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.name || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-left">
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-sm text-gray-300">{user.role}</p>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 bottom-full mb-2 mt-2 w-48 bg-gray-900/80 backdrop-blur-xl text-white rounded-xl shadow-lg border border-white/10 overflow-hidden z-50">
          <button
            onClick={() => router.push("/admin/profile")}
            className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-white/10 transition"
          >
            <User size={18} /> Hồ sơ
          </button>

          <button
            onClick={() => router.push("/admin/settings")}
            className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-white/10 transition"
          >
            <Settings size={18} /> Cài đặt
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/20 transition"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
