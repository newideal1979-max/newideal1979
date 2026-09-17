import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "../lib/api";

export default function Testimonials() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get("/testimonials").then(({ data }) => setItems(data.data)).catch(() => setItems([]));
  }, []);

  return (
    <div className="container-institute py-16 lg:py-24">
      <h1 className="font-display text-4xl text-fabric-100">Student Testimonials</h1>

      {items === null && <p className="mt-10 text-fabric-500">Loading…</p>}
      {items?.length === 0 && (
        <p className="mt-10 text-fabric-500">Testimonials will appear here as students share their experience.</p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((t) => (
          <div key={t._id} className="rounded-2xl border border-white/8 bg-ink-800 p-6">
            <div className="flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="fill-thread-gold text-thread-gold" />)}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fabric-300">"{t.text}"</p>
            <p className="mt-4 text-sm font-semibold text-fabric-100">{t.studentName}</p>
            {t.course?.name && <p className="text-xs text-fabric-500">{t.course.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
