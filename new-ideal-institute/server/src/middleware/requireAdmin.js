// Must run AFTER requireAuth. Checks the role on the trusted, DB-loaded req.user —
// never a role claimed by the frontend.
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  next();
}
