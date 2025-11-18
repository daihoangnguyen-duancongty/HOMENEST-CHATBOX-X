// useAuthStore.ts
import { create } from "zustand";

export interface AuthUser {
  userId: string;
  clientId?: string;
  name: string;
  avatar?: string;
  role: "admin" | "client" | "employee";
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void; // thêm logout
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("token"); // xóa token
    set({ user: null });               // xóa user khỏi store
  },
}));
