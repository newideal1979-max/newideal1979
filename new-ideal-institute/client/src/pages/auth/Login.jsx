import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      await loginWithGoogle();
      navigate(redirect);
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  }

  return (
    <div className="container-institute flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-fabric-100">Welcome back</h1>
        <p className="mt-2 text-sm text-fabric-500">Log in to continue your learning.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs text-fabric-500">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-fabric-500">Password</label>
              <Link to="/forgot-password" className="text-xs text-thread-gold">Forgot?</Link>
            </div>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full rounded-full bg-thread-gold py-3 text-sm font-semibold text-ink-900 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <button onClick={handleGoogle} className="mt-3 w-full rounded-full border border-white/15 py-3 text-sm text-fabric-100">
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-fabric-500">
          New here? <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`} className="text-thread-gold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

function mapFirebaseError(code) {
  const map = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  };
  return map[code] || "Couldn't log you in. Please try again.";
}
