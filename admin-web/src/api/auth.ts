"use client";

import { fetcher } from "@/config/fetcher";
import { setToken } from "@/config/token";

export async function loginAdmin({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  // Gửi request login tới server
  const res = await fetcher<{
    ok: boolean;
    token?: string;
    error?: string;
  }>("/auth/login", {
    method: "POST",
    data: { username, password },
  });

  if (!res.ok || !res.token) {
    throw new Error(res.error || "Login failed");
  }

  // Lưu token vào localStorage trực tiếp (Zustand sẽ đọc từ đây)
  // setToken(res.token);

  return res.token;
}

export async function registerAdmin(payload: {
  username: string;
  password: string;
  name?: string;
  avatar?: string;
}) {
  const res = await fetcher<{ ok: boolean; token?: string }>("/auth/register", {
    method: "POST",
    data: payload,
  });

  if (res.ok && res.token) {
    setToken(res.token);
  }

  return res;
}
