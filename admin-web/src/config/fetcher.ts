"use client";

import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";
const ADMIN_SYNC_TOKEN = process.env.NEXT_PUBLIC_ADMIN_SYNC_TOKEN; // nhớ thêm NEXT_PUBLIC_ ở .env

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_SYNC_TOKEN}`, // attach admin token mặc định
  },
});

// Response interceptor: handle 401/403 (tuỳ chỉnh nếu cần)
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      console.warn("Admin token invalid or forbidden", error);
    }
    return Promise.reject(error);
  }
);

// Generic fetcher wrapper dùng admin token cho tất cả
export async function fetcher<T = any>(path: string, options: AxiosRequestConfig = {}): Promise<T> {
  const response = await instance.request({
    url: path,
    ...options,
    data: options.data, // ⬅ không stringify nữa
  });

  return response.data;
}

