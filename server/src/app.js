import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { notFound, errorHandler } from "./middleware/errorHandler.js";
import courseRoutes from "./routes/courseRoutes.js";
import curriculumRoutes from "./routes/curriculumRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(helmet());

// Build the allowlist from FRONTEND_URL (comma-separated if you need more than one —
// e.g. both the temporary *.vercel.app URL and your final custom domain during migration).
// Trailing slashes are stripped because "https://x.com/" and "https://x.com" are DIFFERENT
// strings to a browser's Origin header, and a mismatch here is the #1 cause of CORS failures.
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No origin header = server-to-server call, curl, or Postman — allow it.
      if (!origin) return callback(null, true);

      const normalized = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }

      console.warn(
        `[cors] Blocked request from origin "${origin}". Allowed origins: ${allowedOrigins.join(", ")}. ` +
          `If this should be allowed, add it to the FRONTEND_URL env var on the backend (comma-separated for multiple) and redeploy.`
      );
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// NOTE: /api/payments/webhook applies express.raw() itself (see paymentRoutes.js) so it
// gets the raw body for signature verification. The route is mounted below, but express
// matches route-level body parsers before this global json() body-parses non-matching routes.
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") return next();
  express.json({ limit: "1mb" })(req, res, next);
});

app.get("/api/health", (req, res) => res.json({ success: true, message: "API is healthy." }));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
