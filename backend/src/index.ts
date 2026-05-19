import dotenv from "dotenv";
dotenv.config();

import { validateEnv } from "./config";
// Validate required environment variables before importing modules that
// may instantiate the Supabase client at import time.
validateEnv();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import interviewsRoutes from "./routes/interviews";
import executeRoutes from "./routes/execute";
import vapiRoutes from "./routes/vapi";
import analysisRoutes from "./routes/analysis";
import authRoutes from "./routes/auth";
import tokenRoutes from "./routes/tokens";
import { authMiddleware } from "./middleware/auth";
import { globalLimiter, authLimiter, aiLimiter, executeLimiter } from "./middleware/rateLimiter";

const app = express();
const PORT = process.env.PORT ?? 3001;

// Security headers
app.use(helmet());

// CORS — restrict to known frontend origin
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (server-to-server, curl, mobile apps)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Body size limits
app.use(express.json({ limit: "1mb" }));

// Global rate limiter
app.use(globalLimiter);

app.get("/", (_req, res) => {
  res.send("Hello, AI Interviewer!");
});

// Public routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/vapi", vapiRoutes);

// Protected routes
app.use("/api/execute", authMiddleware, executeLimiter, executeRoutes);
app.use("/api/analysis", authMiddleware, aiLimiter, analysisRoutes);
app.use("/api/interviews", authMiddleware, interviewsRoutes);
app.use("/api/tokens", authMiddleware, tokenRoutes);

// Centralized error handler — never leak internals
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    // CORS errors
    if (err.message === "Not allowed by CORS") {
      res.status(403).json({ error: "Origin not allowed" });
      return;
    }
    // Body parser errors (payload too large, malformed JSON)
    if ("type" in err && (err as Record<string, unknown>).type === "entity.too.large") {
      res.status(413).json({ error: "Request body too large" });
      return;
    }
    console.error("[Server] Unhandled error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  },
);

async function start() {
  try {
    validateEnv();
    app.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[Server] Startup failed:", err);
    process.exit(1);
  }
}

export { app };
start();
