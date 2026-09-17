// Centralized error handler — every route's errors funnel here so the API always
// responds in the same { success, message } shape and never leaks a stack trace in prod.
export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, _next) {
  console.error(err);

  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && status === 500
      ? "Something went wrong. Please try again."
      : err.message || "Internal server error.";

  res.status(status).json({ success: false, message });
}

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
