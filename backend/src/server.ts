// MUST BE FIRST
import "./instrument";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import Sentry from "./instrument"; // import từ instrument.ts

import schema from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { connectDB } from "./database/db";

import chatRoutes from "./routes/ChatRoutes";
import adminRoutes from "./routes/AdminRoutes";
import userRoutes from "./routes/UserRoutes";
import adminAuthRoutes from "./routes/AdminAuthRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- Sentry request middleware -----------------
app.use((req: Request, res: Response, next: NextFunction) => {
  Sentry.addBreadcrumb({
    category: "request",
    message: `${req.method} ${req.url}`,
    level: "info",
  });
  next();
});

// ----------------- Middleware -----------------
app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins = [
  "https://h7.homenest.tech",
  "https://www.homenest.tech",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((o) => origin.startsWith(o))) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

// Debug Sentry
app.get("/debug-sentry", () => {
  throw new Error("Test Sentry error!");
});

// ----------------- Routes -----------------
app.use("/api", chatRoutes);
app.use("/api", userRoutes);
app.use("/admin-api", adminRoutes);
app.use("/admin-api/auth", adminAuthRoutes);

// ----------------- Apollo Server -----------------
const startApolloServer = async () => {
  const server = new ApolloServer({ typeDefs: schema, resolvers });
  await server.start();

 app.use("/graphql", async (req, res, next) => {
  try {
    const result = await server.executeHTTPGraphQLRequest({
      httpGraphQLRequest: {
        body: req.body,
        headers: req.headers as any, // <-- ép kiểu any để TS không complain
        method: req.method,
        search: req.url?.split("?")[1] ?? "",
      },
      context: async () => ({ req, res }),
    });
    res.status(result.status || 200).json(result.body);
  } catch (err) {
    next(err);
  }
});

};

// ----------------- Sentry error middleware -----------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  Sentry.captureException(err);
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// ----------------- Start Server -----------------
const startServer = async () => {
  try {
    await connectDB();
    await startApolloServer();
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    Sentry.captureException(err);
    console.error("❌ Server failed:", err);
  }
};

startServer();
