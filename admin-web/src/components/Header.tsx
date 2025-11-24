"use client";

import { Bell, MessageSquare, Settings, Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-[8vh] h-[70vh] flex items-center justify-between px-6 bg-amber-50">

      {/* LEFT — SEARCH BAR */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="bg-white/20 backdrop-blur-lg border border-white/30 text-white placeholder-white/70 rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80"
        />
      </div>

      {/* RIGHT — ICON BUTTONS */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button className="p-2 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg text-white hover:bg-white/30 transition">
          <Bell size={20} />
        </button>

        {/* Messages */}
        <button className="p-2 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg text-white hover:bg-white/30 transition">
          <MessageSquare size={20} />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-xl bg-white/20 border border-white/30 backdrop-blur-lg text-white hover:bg-white/30 transition">
          <Settings size={20} />
        </button>

        {/* Avatar */}
        <div className="p-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-lg text-white hover:bg-white/30 transition cursor-pointer">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
