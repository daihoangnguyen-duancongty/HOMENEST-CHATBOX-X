import { fetcher } from "@/config/fetcher";
import { setToken } from "@/config/token";
import { useAuthStore } from "@/store/auth";
import type { AdminAuthData } from "@/types/admin";

export async function loginAdmin({ username, password }: { username: string; password: string }) {
  const res = await fetcher<{ ok: boolean; token?: string }>("/auth/login", {
    method: "POST",
    data: { username, password },
  });

  if (!res.ok || !res.token) {
    throw new Error("Login failed: " + JSON.stringify(res));
  }

  // Lưu token trực tiếp vào localStorage
  setToken(res.token);

  return res.token;
}
export async function registerAdmin({ username, password, name, avatar }: AdminAuthData) {
  const res = await fetcher("/auth/register", {
    method: "POST",
    data: { username, password, name, avatar },
  });

  if (res.ok && res.token) {
    setToken(res.token);
  }

  return res;
}
