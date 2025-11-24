// src/config/token.ts
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/jwt";

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  try {
   
localStorage.setItem("token", token);

  } catch (e) {
    console.error("setToken error:", e);
  }
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export const removeToken = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("token");
  } catch (e) {
    console.error("removeToken error:", e);
  }
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (e) {
    console.warn("decodeToken failed:", e);
    return null;
  }
};
