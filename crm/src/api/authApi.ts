import axios from 'axios';
import { BACKEND_URL } from './../config/fetchConfig';

// Base URL cho auth
const API_URL = `${BACKEND_URL}/api/users`;

// ========================
// 🔷 Kiểu dữ liệu
// ========================

export interface RegisterUserResponse {
  message: string;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'client';
  };
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    role: 'admin' | 'client';
    avatar?: {
      path?: string;
      filename?: string;
      originalname?: string;
    };
  };
}

export interface Client {
  _id: string;
  id: string;
  username?: string;
  name?: string;
  avatar?: string;
}
export interface Employee {
  _id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: 'admin' | 'client';
  avatar?: string;
}

// ========================
// 🔶 Hàm API
// ========================

// ✅ Đăng ký (FormData, có avatar)
export const registerUser = async (formData: FormData): Promise<RegisterUserResponse> => {
  const res = await axios.post<RegisterUserResponse>(`${API_URL}/register`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// ✅ Đăng nhập
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  return res.data;
};

// ✅ Lấy danh sách telesales
export const getClient = async (): Promise<Client[]> => {
  const res = await axios.get<Client[]>(`${BACKEND_URL}/api/zalo/telesales`);
  return res.data;
};
// ========================
// 🔶 Employee API (CRUD)
// ========================

/** ✅ Lấy danh sách nhân viên (yêu cầu token) */
export const getEmployees = async (token: string) => {
  const res = await axios.get(`${API_URL}/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

/** ✅ Tạo nhân viên mới */
export const createEmployee = async (formData: FormData, token: string) => {
  const res = await axios.post(`${API_URL}/employees`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

/** ✅ Cập nhật nhân viên */
export const updateEmployee = async (id: string, formData: FormData, token: string) => {
  const res = await axios.put(`${API_URL}/employees/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

/** ✅ Xóa nhân viên */
export const deleteEmployee = async (id: string, token: string) => {
  const res = await axios.delete(`${API_URL}/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
