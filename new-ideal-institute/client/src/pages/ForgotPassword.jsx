import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError("Couldn't send reset email. Check the address and try again.");
    }
  }

  return (
    <div className="container-institute flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-fabric-100">Reset your password</h1>
        {sent ? (
          <p className="mt-6 text-sm text-thread-gold">Check your inbox for a reset link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button className="w-full rounded-full bg-thread-gold py-3 text-sm font-semibold text-ink-900">
              Send reset link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
