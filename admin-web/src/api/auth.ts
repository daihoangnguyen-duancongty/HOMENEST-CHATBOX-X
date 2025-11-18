import { fetcher } from "@/config/fetcher";
import { setToken } from "@/config/token";
import { useAuthStore } from "@/store/auth";
import type { AdminAuthData } from "@/types/admin";

export async function loginAdmin({ username, password }: AdminAuthData) {
  const res = await fetcher("/admin-api/auth/login", {
    method: "POST",
    data: { username, password },
  });

  if (res.ok && res.token) {
    useAuthStore.getState().login(res.token);
  }

  return res;
}

export async function registerAdmin({ username, password, name, avatar }: AdminAuthData) {
  const res = await fetcher("/admin-api/auth/register", {
    method: "POST",
    data: { username, password, name, avatar },
  });

  if (res.ok && res.token) {
    setToken(res.token);
  }

  return res;
}
