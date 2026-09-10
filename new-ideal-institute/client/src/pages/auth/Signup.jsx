import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", phone: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) return setError("Passwords don't match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      await signup(form);
      navigate(redirect);
    } catch (err) {
      const map = {
        "auth/email-already-in-use": "An account already exists with this email.",
        "auth/weak-password": "Choose a stronger password.",
      };
      setError(map[err.code] || "Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-institute flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-fabric-100">Create your account</h1>
        <p className="mt-2 text-sm text-fabric-500">Start learning professional tailoring.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {[
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone number", "tel"],
            ["password", "Password", "password"],
            ["confirm", "Confirm password", "password"],
          ].map(([field, label, type]) => (
            <div key={field}>
              <label className="text-xs text-fabric-500">{label}</label>
              <input
                type={type} required={field !== "phone"} value={form[field]} onChange={update(field)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50"
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full rounded-full bg-thread-gold py-3 text-sm font-semibold text-ink-900 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-fabric-500">
          Already have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-thread-gold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
