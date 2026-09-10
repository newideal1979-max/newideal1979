import rateLimit from "express-rate-limit";

// Applied to sensitive endpoints: payment creation, inquiry submission, auth-adjacent routes.
export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});
