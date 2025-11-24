// ADMIN AUTH API Client
"use client";

import { fetcher } from "@/config/fetcher";
import { setToken } from "@/config/token";

const CLIENT_PREFIX = "/api";


export async function loginAll({ username, password }: { username: string; password: string }) {
  const res = await fetcher<any>(`${CLIENT_PREFIX}/login`, {
    method: "POST",
    data: { username, password },
  });

  console.log("login response:", res);

  if (!res.ok || !res.token || !res.user) {
    throw new Error(res.error || "Login failed");
  }

  // Lưu token vào localStorage
  setToken(res.token);

  // Lưu user vào Zustand store
  const user = res.user;

  return { token: res.token, user };
}


// export async function registerAll(payload: {
//   username: string;
//   password: string;
//   name?: string;
//   avatar?: string;
// }) {
//   const res = await fetcher<{ ok: boolean; token?: string }>(`${CLIENT_PREFIX}/client/create-employee`, {
//     method: "POST",
//     data: payload,
//   });

//   if (res.ok && res.token) {
//     setToken(res.token);
//   }

//   return res;
// }
