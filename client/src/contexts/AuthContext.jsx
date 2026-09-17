import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null); // the MongoDB-backed user (has `role`)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const { data } = await api.get("/auth/me");
          setProfile(data.data);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    firebaseUser,
    profile,
    isAdmin: profile?.role === "admin",
    loading,
    async signup({ name, email, password, phone }) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // First authenticated call creates the mirrored MongoDB profile server-side.
      const { data } = await api.get("/auth/me");
      const profileData = phone ? (await api.put("/auth/me", { name, phone })).data : data;
      setProfile(profileData.data);
      return cred.user;
    },
    login(email, password) {
      return signInWithEmailAndPassword(auth, email, password);
    },
    loginWithGoogle() {
      return signInWithPopup(auth, googleProvider);
    },
    logout() {
      return signOut(auth);
    },
    resetPassword(email) {
      return sendPasswordResetEmail(auth, email);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
