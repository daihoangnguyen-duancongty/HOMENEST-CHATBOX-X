import { JwtPayload } from "jwt-decode";

export interface DecodedToken extends JwtPayload {
  userId: string;
  role: "admin";
  name: string;
  avatar?: string;
  clientId?: string;
}
