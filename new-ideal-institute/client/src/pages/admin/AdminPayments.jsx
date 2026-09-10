import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminPayments() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/payments").then(({ data }) => setData(data.data)).catch(() => setData({ payments: [] }));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-fabric-100">Payments</h1>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-800 text-xs uppercase text-fabric-500">
            <tr>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.payments?.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-6 text-fabric-500">No payments yet.</td></tr>
            )}
            {data?.payments?.map((p) => (
              <tr key={p._id} className="border-t border-white/8">
                <td className="px-5 py-4 text-fabric-100">{p.user?.name}</td>
                <td className="px-5 py-4 text-fabric-300">{p.course?.name}</td>
                <td className="px-5 py-4 text-thread-gold">₹{(p.amount / 100).toLocaleString("en-IN")}</td>
                <td className="px-5 py-4 text-fabric-300">{p.status}</td>
                <td className="px-5 py-4 text-xs text-fabric-500">{p.orderId}</td>
                <td className="px-5 py-4 text-xs text-fabric-500">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
