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

  return (
    <form onSubmit={handleRegister}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
