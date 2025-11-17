declare namespace Express {
  interface User {
    role: string;
    // thêm các field khác nếu bạn có, ví dụ:
    // id: string;
    // email: string;
  }

  interface Request {
    user?: User;
  }
}
