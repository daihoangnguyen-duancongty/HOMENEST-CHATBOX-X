import { JwtPayload } from "jwt-decode";

export interface DecodedToken extends JwtPayload  {
  userId: string;
  username?: string;
  name?: string;
  avatar?: string;
  clientId?: string;
  role: "admin" | "client" | "employee";
  iat?: number;
  exp?: number;
};
