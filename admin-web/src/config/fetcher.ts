// src/config/fetcher.ts
"use client";

import axios, { AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth";
import { removeToken } from "@/config/token";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token from store/localStorage
instance.interceptors.request.use((config) => {
  try {
    const store = useAuthStore.getState();
    const token = store.token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).set
        ? (config.headers as any).set("Authorization", `Bearer ${token}`)
        : (config.headers["Authorization"] = `Bearer ${token}`);
    }

    return config;
  } catch (err) {
    return config;
  }
});

// Response interceptor: handle 401/403
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        removeToken();
        useAuthStore.getState().logout();
      } catch (e) {
        console.warn("Error handling auth failure:", e);
      }
    }
    return Promise.reject(error);
  }
);

// Generic fetcher wrapper
export async function fetcher<T = any>(path: string, options: AxiosRequestConfig = {}): Promise<T> {
  const response = await instance.request({
    url: path,
    ...options,
  });
  return response.data;
}
