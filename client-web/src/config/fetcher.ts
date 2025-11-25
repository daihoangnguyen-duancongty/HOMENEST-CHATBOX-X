"use client";

import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_CLIENT_TOKEN; 

// 👉 Instance mặc định vẫn dùng admin token
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CLIENT_TOKEN}`,
  },
});

// 👉 Allow override an toàn
export async function fetcher<T = any>(
  path: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  
  const response = await instance.request({
    url: path,

    // ⬅ OPTIONS sẽ override header mặc định 
    // Ví dụ login: { headers: { Authorization: "" } }
    ...options,
  });

  return response.data;
}

// 👉 Dùng riêng cho FormData
export async function postFormData<T = any>(
  path: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST"
): Promise<T> {
  const res = await axios({
    url: `${BASE_URL}${path}`,
    method,
    data: formData,
    headers: {
      Authorization: `Bearer ${CLIENT_TOKEN}`,
      // KHÔNG set Content-Type
    },
  });

  return res.data as T;
}
