import { useEffect, useState } from "react";
import api from "../../lib/api";

const emptyCourse = {
  name: "", slug: "", subtitle: "", description: "", category: "mens",
  price: 10000, duration: "4 Months", mode: "Online + Offline", badge: "",
  features: "", status: "draft",
};

export default function AdminCourses() {
  const [courses, setCourses] = useState(null);
  const [editing, setEditing] = useState(null); // course being edited, or emptyCourse for new
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  function load() {
    api.get("/courses/admin/all").then(({ data }) => setCourses(data.data)).catch(() => setCourses([]));
  }

  function openEdit(course) {
    setEditing({
      ...emptyCourse,
      ...course,
      features: Array.isArray(course.features) ? course.features.join("\n") : "",
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...editing, features: editing.features.split("\n").map((f) => f.trim()).filter(Boolean) };
    try {
      if (editing._id) {
        await api.put(`/courses/admin/${editing._id}`, payload);
      } else {
        await api.post("/courses/admin", payload);
      }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(course) {
    await api.put(`/courses/admin/${course._id}`, { status: course.status === "published" ? "draft" : "published" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-fabric-100">Courses</h1>
        <button onClick={() => openEdit(emptyCourse)} className="rounded-full bg-thread-gold px-5 py-2.5 text-sm font-semibold text-ink-900">
          + New Course
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {courses?.map((c) => (
          <div key={c._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-ink-800 p-5">
            <div>
              <p className="font-semibold text-fabric-100">{c.name} <span className="ml-2 text-xs text-fabric-500">/{c.slug}</span></p>
              <p className="mt-1 text-xs text-thread-gold">₹{c.price?.toLocaleString("en-IN")} · {c.status}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => toggleStatus(c)} className="rounded-full border border-white/15 px-4 py-2 text-xs text-fabric-100">
                {c.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => openEdit(c)} className="rounded-full border border-white/15 px-4 py-2 text-xs text-fabric-100">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10">
          <form onSubmit={handleSave} className="w-full max-w-lg rounded-2xl border border-white/8 bg-ink-800 p-7">
            <h2 className="font-display text-xl text-fabric-100">{editing._id ? "Edit Course" : "New Course"}</h2>

            <div className="mt-6 space-y-3">
              <input required placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100" />
              <input required placeholder="Slug (url-friendly)" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100" />
              <input placeholder="Subtitle" value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100" />
              <textarea required rows={3} placeholder="Description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100" />

              <div className="grid grid-cols-2 gap-3">
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100">
                  <option value="mens">Men's</option>
                  <option value="womens">Women's</option>
                </select>
                <input required type="number" placeholder="Price (₹)" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  className="rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Duration" value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                  className="rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100" />
                <input placeholder="Mode" value={editing.mode} onChange={(e) => setEditing({ ...editing, mode: e.target.value })}
                  className="rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100" />
              </div>

              <input placeholder="Badge (e.g. Most Popular)" value={editing.badge} onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100" />
              <textarea rows={5} placeholder="Features — one per line" value={editing.features} onChange={(e) => setEditing({ ...editing, features: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-fabric-100" />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-fabric-100">
                Cancel
              </button>
              <button disabled={saving} className="rounded-full bg-thread-gold px-5 py-2.5 text-sm font-semibold text-ink-900 disabled:opacity-60">
                {saving ? "Saving…" : "Save Course"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
