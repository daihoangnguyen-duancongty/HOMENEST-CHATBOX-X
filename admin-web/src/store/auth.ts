import { create } from "zustand";

interface AuthState {
  token: string | null;
  role: "admin" | "client" | "employee" | null;
  login: (token: string, role: AuthState["role"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  login: (token, role) => set({ token, role }),
  logout: () => set({ token: null, role: null }),
}));
