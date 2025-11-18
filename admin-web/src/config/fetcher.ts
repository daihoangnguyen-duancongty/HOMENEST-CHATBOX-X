import axios, { AxiosRequestConfig } from "axios";
import { getToken, removeToken } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function fetcher<T = any>(
  path: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const token = getToken();

  // Không ép kiểu AxiosRequestHeaders, để Axios tự xử lý
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await axios({
      baseURL: BASE_URL,
      url: path,
      headers,
      ...options,
    });

    return response.data;
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      removeToken();
    }
    console.error("API Error:", err.response?.data || err.message || err);
    throw err;
  }
}
