import { useEffect, useState } from "react";
import api from "../../lib/api";
import StudentSidebar from "../../components/layout/StudentSidebar";

export default function Orders() {
  const [enrollments, setEnrollments] = useState(null);

  useEffect(() => {
    api.get("/enrollments/me").then(({ data }) => setEnrollments(data.data)).catch(() => setEnrollments([]));
  }, []);

  return (
    <div className="container-institute grid gap-10 py-12 lg:grid-cols-[220px_1fr] lg:py-16">
      <StudentSidebar />
      <div>
        <h1 className="font-display text-3xl text-fabric-100">Payment History</h1>

        {enrollments?.length === 0 && <p className="mt-8 text-fabric-500">No payments yet.</p>}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-800 text-xs uppercase text-fabric-500">
              <tr>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {enrollments?.map((e) => (
                <tr key={e._id} className="border-t border-white/8">
                  <td className="px-5 py-4 text-fabric-100">{e.course?.name}</td>
                  <td className="px-5 py-4 text-thread-gold">{e.paymentStatus}</td>
                  <td className="px-5 py-4 text-fabric-500">{e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
