import { create } from "zustand";
import { getToken, setToken, removeToken, decodeToken } from "@/config/token";

export interface AuthUser {
  userId: string;
  clientId?: string;
  name: string;
  avatar?: string;
  role: "admin" | "client" | "employee";
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  login: (token) => {
    setToken(token);
    const decoded: any = decodeToken(token);
    if (!decoded) return;

    set({
      token,
      user: {
        userId: decoded.userId,
        clientId: decoded.clientId,
        name: decoded.name,
        avatar: decoded.avatar,
        role: decoded.role,
      },
    });
  },

  logout: () => {
    removeToken();
    set({ token: null, user: null });
  },

  loadFromStorage: () => {
    const token = getToken();
    if (!token) return;

    const decoded: any = decodeToken(token);
    if (!decoded) {
      removeToken();
      return;
    }

    set({
      token,
      user: {
        userId: decoded.userId,
        clientId: decoded.clientId,
        name: decoded.name,
        avatar: decoded.avatar,
        role: decoded.role,
      },
    });
  },
}));
