import axios, { InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api',
});

// interceptor để tự động gắn token (chỉ chạy trên client)
if (typeof window !== 'undefined') {
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // axios 1.4+ dùng kiểu AxiosHeaders
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
