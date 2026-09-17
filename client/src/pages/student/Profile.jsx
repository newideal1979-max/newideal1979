import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../lib/api";
import StudentSidebar from "../../components/layout/StudentSidebar";

export default function Profile() {
  const { profile, firebaseUser } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    try {
      await api.put("/auth/me", { name, phone });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="container-institute grid gap-10 py-12 lg:grid-cols-[220px_1fr] lg:py-16">
      <StudentSidebar />
      <div className="max-w-md">
        <h1 className="font-display text-3xl text-fabric-100">Profile</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs text-fabric-500">Email</label>
            <input disabled value={firebaseUser?.email || ""} className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-fabric-500" />
          </div>
          <div>
            <label className="text-xs text-fabric-500">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50" />
          </div>
          <div>
            <label className="text-xs text-fabric-500">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50" />
          </div>
          {status === "saved" && <p className="text-sm text-thread-gold">Saved.</p>}
          {status === "error" && <p className="text-sm text-red-400">Couldn't save. Try again.</p>}
          <button disabled={status === "saving"} className="rounded-full bg-thread-gold px-6 py-3 text-sm font-semibold text-ink-900 disabled:opacity-60">
            {status === "saving" ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
