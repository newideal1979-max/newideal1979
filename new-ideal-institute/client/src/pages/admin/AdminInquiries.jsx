import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState(null);

  useEffect(() => { load(); }, []);
  function load() {
    api.get("/inquiries/admin").then(({ data }) => setInquiries(data.data)).catch(() => setInquiries([]));
  }

  async function updateStatus(id, status) {
    await api.put(`/inquiries/admin/${id}`, { status });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-fabric-100">Inquiries</h1>
      <div className="mt-8 space-y-4">
        {inquiries?.length === 0 && <p className="text-fabric-500">No inquiries yet.</p>}
        {inquiries?.map((i) => (
          <div key={i._id} className="rounded-2xl border border-white/8 bg-ink-800 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-fabric-100">{i.name} <span className="ml-2 text-xs text-fabric-500">{i.email} · {i.phone}</span></p>
                <p className="mt-1 text-xs text-thread-gold">{i.courseInterest}</p>
                <p className="mt-2 text-sm text-fabric-300">{i.message}</p>
              </div>
              <select
                value={i.status}
                onChange={(e) => updateStatus(i._id, e.target.value)}
                className="rounded-lg border border-white/10 bg-ink-900 px-3 py-1.5 text-xs text-fabric-100"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
