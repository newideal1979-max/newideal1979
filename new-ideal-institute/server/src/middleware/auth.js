import { getFirebaseAdmin } from "../config/firebaseAdmin.js";
import User from "../models/User.js";

// Verifies the Firebase ID token sent in Authorization: Bearer <token>.
// This is the ONLY source of truth for "who is this request from" — we never read a userId
// or role from the request body.
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "No authentication token provided." });
    }

    const decoded = await getFirebaseAdmin().auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      // First authenticated request after signup — create the mirrored MongoDB profile.
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || decoded.email?.split("@")[0] || "Student",
        email: decoded.email,
        role: "student",
      });
    }

    req.user = user; // trusted, DB-backed user — role comes from here, never from the client
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired session." });
  }
}

// Optional auth: attaches req.user if a valid token is present, but doesn't block the request
// if not. Used on routes like course details that are public but behave differently when logged in.
export async function attachUserIfPresent(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    const decoded = await getFirebaseAdmin().auth().verifyIdToken(token);
    req.user = await User.findOne({ firebaseUid: decoded.uid });
  } catch {
    // Invalid token on an optional route — just proceed as anonymous.
  }
  next();
}
