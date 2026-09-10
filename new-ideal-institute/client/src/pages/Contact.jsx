import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useSiteSettings } from "../contexts/SiteSettingsContext";
import { buildTelLink, buildWhatsAppLink } from "../lib/siteConfig";
import api from "../lib/api";

const courseOptions = ["General Inquiry", "Men's Professional Tailoring", "Women's Designer Tailoring"];

export default function Contact() {
  const settings = useSiteSettings();
  const [form, setForm] = useState({ name: "", phone: "", email: "", courseInterest: "General Inquiry", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/inquiries", form);
      setStatus("sent");
      setForm({ name: "", phone: "", email: "", courseInterest: "General Inquiry", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const cards = [
    { icon: MapPin, title: "Visit Us", lines: [settings.address?.line1, settings.address?.line2, `${settings.address?.city} — ${settings.address?.pincode}`, "Mon–Sat, 9 AM – 7 PM"] },
    { icon: Phone, title: "Call Us", lines: [settings.phone || "Contact number pending confirmation", "Available 9 AM – 8 PM"] },
    { icon: Mail, title: "Email Us", lines: [settings.email, "Reply within 24 hours"] },
    { icon: Clock, title: "Class Timings", lines: [`Morning: ${settings.classTimings?.morning}`, `Evening: ${settings.classTimings?.evening}`] },
  ];

  const whatsappLink = buildWhatsAppLink(settings.whatsappNumber, "Hi, I'd like to know more about your tailoring courses.");

  return (
    <div className="container-institute py-16 lg:py-24">
      <h1 className="font-display text-4xl text-fabric-100">Get in touch</h1>
      <p className="mt-4 max-w-xl text-fabric-500">
        Questions about a course, timings, or enrollment? Reach out — or send an inquiry below.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, title, lines }) => (
          <div key={title} className="rounded-2xl border border-white/8 bg-ink-800 p-6">
            <Icon className="text-thread-gold" size={20} />
            <h3 className="mt-3 text-sm font-semibold text-fabric-100">{title}</h3>
            {lines.map((l, i) => l && <p key={i} className="mt-1 text-xs leading-relaxed text-fabric-500">{l}</p>)}
          </div>
        ))}
      </div>

      {whatsappLink && (
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-fabric-100 hover:border-thread-gold/50">
          <MessageCircle size={16} className="text-thread-gold" /> Chat on WhatsApp
        </a>
      )}

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-fabric-100">Send an inquiry</h2>
          <p className="mt-2 text-sm text-fabric-500">Fill out the form and we'll get back to you within 24 hours.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input required placeholder="Full Name" value={form.name} onChange={update("name")}
              className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50" />
            <input placeholder="Phone Number" value={form.phone} onChange={update("phone")}
              className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50" />
            <input required type="email" placeholder="Email Address" value={form.email} onChange={update("email")}
              className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50" />
            <select value={form.courseInterest} onChange={update("courseInterest")}
              className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50">
              {courseOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
            <textarea required rows={4} placeholder="Message" value={form.message} onChange={update("message")}
              className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-fabric-100 outline-none focus:border-thread-gold/50" />

            {status === "error" && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}
            {status === "sent" && <p className="text-sm text-thread-gold">Inquiry sent — we'll be in touch soon.</p>}

            <button disabled={status === "sending"} className="rounded-full bg-thread-gold px-6 py-3 text-sm font-semibold text-ink-900 disabled:opacity-60">
              {status === "sending" ? "Sending…" : "Send Inquiry"}
            </button>
          </form>
        </div>

        <div className="h-80 overflow-hidden rounded-2xl border border-white/8 lg:h-full">
          {settings.googleMapsUrl ? (
            <iframe title="Institute location" src={settings.googleMapsUrl} className="h-full w-full" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center bg-ink-800 text-sm text-fabric-500">
              Map will appear here once configured in admin settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
