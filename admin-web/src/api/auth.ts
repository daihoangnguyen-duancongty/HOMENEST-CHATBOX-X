// ADMIN AUTH API Client
"use client";

import { fetcher } from "@/config/fetcher";
import { setToken } from "@/config/token";

const ADMIN_PREFIX_STATS = "/admin-api";

export async function loginAdmin({ username, password }: { username: string; password: string }) {
  const res = await fetcher<any>(`${ADMIN_PREFIX_STATS}/auth/login`, {
    method: "POST",
    data: { username, password },
  });

  console.log("login response:", res);

  if (!res.ok || !res.token || !res.admin) {
    throw new Error(res.error || "Login failed");
  }

  // Lưu token vào localStorage
  setToken(res.token);

  // Map admin thành user để Zustand store đọc
  const user = res.admin;

  return { token: res.token, user };
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
