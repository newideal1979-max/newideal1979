import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminEnrollments() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/enrollments").then(({ data }) => setData(data.data)).catch(() => setData({ enrollments: [] }));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-fabric-100">Enrollments</h1>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-800 text-xs uppercase text-fabric-500">
            <tr>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Progress</th>
              <th className="px-5 py-3">Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {data?.enrollments?.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-6 text-fabric-500">No enrollments yet.</td></tr>
            )}
            {data?.enrollments?.map((e) => (
              <tr key={e._id} className="border-t border-white/8">
                <td className="px-5 py-4 text-fabric-100">{e.user?.name}<br /><span className="text-xs text-fabric-500">{e.user?.email}</span></td>
                <td className="px-5 py-4 text-fabric-300">{e.course?.name}</td>
                <td className="px-5 py-4 text-thread-gold">{e.paymentStatus}</td>
                <td className="px-5 py-4 text-fabric-300">{e.enrollmentStatus}</td>
                <td className="px-5 py-4 text-fabric-300">{e.courseProgress}%</td>
                <td className="px-5 py-4 text-xs text-fabric-500">{e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
