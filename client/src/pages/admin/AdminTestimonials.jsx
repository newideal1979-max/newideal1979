import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminTestimonials() {
  const [items, setItems] = useState(null);

  useEffect(() => { load(); }, []);
  function load() {
    api.get("/testimonials/admin").then(({ data }) => setItems(data.data)).catch(() => setItems([]));
  }

  async function setStatus(id, status) {
    await api.put(`/testimonials/admin/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-fabric-100">Testimonials</h1>
      <p className="mt-2 text-sm text-fabric-500">Only "published" testimonials appear on the public site.</p>
      <div className="mt-8 space-y-4">
        {items?.length === 0 && <p className="text-fabric-500">No testimonials submitted yet.</p>}
        {items?.map((t) => (
          <div key={t._id} className="rounded-2xl border border-white/8 bg-ink-800 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-fabric-100">{t.studentName} <span className="ml-2 text-xs text-fabric-500">{t.rating}★</span></p>
                <p className="mt-2 max-w-lg text-sm text-fabric-300">"{t.text}"</p>
              </div>
              <select
                value={t.status}
                onChange={(e) => setStatus(t._id, e.target.value)}
                className="rounded-lg border border-white/10 bg-ink-900 px-3 py-1.5 text-xs text-fabric-100"
              >
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
