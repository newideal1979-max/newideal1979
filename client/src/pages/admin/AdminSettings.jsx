import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    api.get("/settings").then(({ data }) => setForm(data.data));
  }, []);

  function update(path, value) {
    setForm((f) => {
      const next = { ...f };
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus("saving");
    try {
      await api.put("/settings/admin", form);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  if (!form) return <p className="text-fabric-500">Loading settings…</p>;

  const field = (label, path, value, type = "text") => (
    <div>
      <label className="text-xs text-fabric-500">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => update(path, type === "number" ? Number(e.target.value) : e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-fabric-100 outline-none focus:border-thread-gold/50"
      />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-fabric-100">Site Settings</h1>
      <p className="mt-2 text-sm text-fabric-500">
        Changes here go live across the whole site immediately — phone, WhatsApp, address, and
        homepage text all read from this single source.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Institute name", "instituteName", form.instituteName)}
          {field("Founded year", "foundedYear", form.foundedYear, "number")}
          {field("Founder", "founder", form.founder)}
          {field("Current director", "currentDirector", form.currentDirector)}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {field("Phone (10-digit)", "phone", form.phone, "tel")}
          {field("WhatsApp number (10-digit)", "whatsappNumber", form.whatsappNumber, "tel")}
        </div>
        {field("Email", "email", form.email, "email")}

        <div className="grid gap-4 sm:grid-cols-2">
          {field("Address line 1", "address.line1", form.address?.line1)}
          {field("Address line 2", "address.line2", form.address?.line2)}
          {field("City", "address.city", form.address?.city)}
          {field("Pincode", "address.pincode", form.address?.pincode)}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {field("Morning timing", "classTimings.morning", form.classTimings?.morning)}
          {field("Evening timing", "classTimings.evening", form.classTimings?.evening)}
        </div>

        {field("Google Maps embed URL", "googleMapsUrl", form.googleMapsUrl)}
        {field(
          "Students trained (leave blank to auto-count from real paid enrollments)",
          "studentsTrainedOverride",
          form.studentsTrainedOverride,
          "number"
        )}

        <div>
          <label className="text-xs text-fabric-500">Hero heading</label>
          <input value={form.heroHeading || ""} onChange={(e) => update("heroHeading", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-fabric-100" />
        </div>
        <div>
          <label className="text-xs text-fabric-500">Hero description</label>
          <textarea rows={3} value={form.heroDescription || ""} onChange={(e) => update("heroDescription", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-fabric-100" />
        </div>

        {status === "saved" && <p className="text-sm text-thread-gold">Saved — live on the site now.</p>}
        {status === "error" && <p className="text-sm text-red-400">Couldn't save. Try again.</p>}

        <button disabled={status === "saving"} className="rounded-full bg-thread-gold px-6 py-3 text-sm font-semibold text-ink-900 disabled:opacity-60">
          {status === "saving" ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
