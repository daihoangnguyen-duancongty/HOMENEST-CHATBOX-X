import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers["authorization"];
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    req.body._user = decoded; // 👈 giúp controller truy cập user
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
