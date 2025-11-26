import { create } from "zustand";

interface User {
  _id: string;
  userId: string;
  username: string;
  name: string;
  avatar: string;
  role: string;
   clientId?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  login: (token, user) => {
    set({ token, user });
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  logout: () => {
    set({ token: null, user: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
}));
