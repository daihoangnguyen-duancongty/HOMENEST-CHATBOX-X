import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeToken, setToken, removeToken } from "@/config/token";

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
  rehydrated: boolean;
  loginWithToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      rehydrated: false,

      loginWithToken: (token) => {
        const decoded = decodeToken(token);
        if (!decoded) return;

        set({
          token,
          user: {
  userId: decoded.userId,
  name: decoded.username || "",   // FIX LỖI string | undefined
    avatar: decoded.avatar || "",
  role: decoded.role,
},
        });
      },

      logout: () => {
        removeToken();
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage",

     
  onRehydrateStorage: () => (state, error) => {
  useAuthStore.setState({ rehydrated: true });
},

    }
  )
);

