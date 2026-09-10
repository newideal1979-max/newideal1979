import admin from "firebase-admin";

// The frontend NEVER sends us a role or a "logged in as admin" flag we can trust.
// We only trust a Firebase ID token, verified here, server-side, on every request.

let initialized = false;

export function getFirebaseAdmin() {
  if (!initialized) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Vercel/most .env systems escape newlines in private keys — this restores them.
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase Admin credentials missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, " +
          "FIREBASE_PRIVATE_KEY in server/.env (Firebase Console > Project Settings > Service Accounts > Generate new private key)."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
    initialized = true;
  }
  return admin;
}
