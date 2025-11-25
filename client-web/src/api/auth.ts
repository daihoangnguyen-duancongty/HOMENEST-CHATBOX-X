  // ADMIN AUTH API Client
  "use client";

  import { fetcher } from "@/config/fetcher";
  import { setToken } from "@/config/token";

  const CLIENT_PREFIX = "/api";


export async function loginAll({ username, password, clientId }: 
  { username: string; password: string; clientId: string }) 
{
  const res = await fetcher<any>("/api/login", {
    method: "POST",
    data: { username, password, clientId },
    headers: { Authorization: "" },   // <-- xoá token khỏi request login
  });

  if (!res.ok || !res.token || !res.user) {
    throw new Error(res.error || "Login failed");
  }

  setToken(res.token);

  return { token: res.token, user: res.user };
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
