import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => setStats(data.data)).catch(() => setStats(null));
  }, []);

  if (!stats) return <p className="text-fabric-500">Loading dashboard…</p>;

  const cards = [
    ["Total Students", stats.totalStudents],
    ["Active Enrollments", stats.activeEnrollments],
    ["Total Courses", stats.totalCourses],
    ["Total Revenue", `₹${stats.totalRevenue.toLocaleString("en-IN")}`],
    ["Pending Inquiries", stats.pendingInquiries],
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-fabric-100">Dashboard</h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/8 bg-ink-800 p-5">
            <p className="text-xs text-fabric-500">{label}</p>
            <p className="mt-2 font-display text-2xl text-thread-gold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fabric-500">Course-wise Enrollment</h2>
          <div className="mt-4 space-y-3">
            {stats.courseWiseEnrollment.length === 0 && <p className="text-sm text-fabric-500">No enrollments yet.</p>}
            {stats.courseWiseEnrollment.map((c) => (
              <div key={c.courseName} className="flex items-center justify-between rounded-xl border border-white/8 bg-ink-800 px-4 py-3 text-sm">
                <span className="text-fabric-300">{c.courseName}</span>
                <span className="text-thread-gold">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fabric-500">Recent Enrollments</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/8">
            <table className="w-full text-left text-sm">
              <tbody>
                {stats.recentEnrollments.length === 0 && (
                  <tr><td className="px-4 py-4 text-fabric-500">No enrollments yet.</td></tr>
                )}
                {stats.recentEnrollments.map((e) => (
                  <tr key={e._id} className="border-t border-white/8 first:border-t-0">
                    <td className="px-4 py-3 text-fabric-100">{e.user?.name}</td>
                    <td className="px-4 py-3 text-fabric-500">{e.course?.name}</td>
                    <td className="px-4 py-3 text-xs text-fabric-500">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
