declare namespace Express {
  interface User {
    userId: string;
    clientId: string;
    name?: string;
    avatar?: string;
    role: string;
  }

  interface Request {
    user?: User;
  }
}
