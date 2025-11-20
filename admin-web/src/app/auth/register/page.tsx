"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/config/fetcher";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetcher("/auth/register", {
        method: "POST",
        data: { username, password, name },
      });
      router.push("/auth/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Register failed");
    }
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/30">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Đăng ký tài khoản
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            className="px-4 py-3 rounded-xl bg-white/80 focus:bg-white border border-white/50 outline-none focus:ring-2 focus:ring-pink-400 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />

          <input
            className="px-4 py-3 rounded-xl bg-white/80 focus:bg-white border border-white/50 outline-none focus:ring-2 focus:ring-pink-400 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            className="px-4 py-3 rounded-xl bg-white/80 focus:bg-white border border-white/50 outline-none focus:ring-2 focus:ring-pink-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Đăng ký
          </button>

          {error && (
            <p className="text-red-200 text-center text-sm mt-2">{error}</p>
          )}
        </form>

        {/* Đã có tài khoản? → Quay về Login */}
        <div className="flex items-center justify-center gap-2 mt-4 text-white">
          <span>Đã có tài khoản?</span>
          <button
            onClick={handleLogin}
            className="px-4 py-1 rounded-lg bg-white/30 border border-white/40 font-medium hover:bg-white/40 transition"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
