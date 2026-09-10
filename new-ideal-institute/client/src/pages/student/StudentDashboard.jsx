import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../lib/api";
import StudentSidebar from "../../components/layout/StudentSidebar";

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState(null);

  useEffect(() => {
    api.get("/enrollments/me").then(({ data }) => setEnrollments(data.data)).catch(() => setEnrollments([]));
  }, []);

  return (
    <div className="container-institute grid gap-10 py-12 lg:grid-cols-[220px_1fr] lg:py-16">
      <StudentSidebar />

      <div>
        <h1 className="font-display text-3xl text-fabric-100">Welcome back, {profile?.name?.split(" ")[0] || "there"}</h1>
        <p className="mt-2 text-fabric-500">Here's where you left off.</p>

        {enrollments === null && <p className="mt-10 text-fabric-500">Loading your courses…</p>}

        {enrollments?.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/8 bg-ink-800 p-10 text-center">
            <p className="text-fabric-300">You haven't enrolled in a course yet.</p>
            <Link to="/courses" className="mt-5 inline-block rounded-full bg-thread-gold px-6 py-3 text-sm font-semibold text-ink-900">
              Explore Courses
            </Link>
          </div>
        )}

        {enrollments?.length > 0 && (
          <div className="mt-10 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-fabric-500">Continue Learning</h2>
            {enrollments.map((e) => (
              <div key={e._id} className="rounded-2xl border border-white/8 bg-ink-800 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg text-fabric-100">{e.course?.name}</h3>
                    <p className="mt-1 text-xs text-fabric-500">
                      Payment: <span className="text-thread-gold">{e.paymentStatus}</span>
                    </p>
                  </div>
                  <Link
                    to={`/learn/${e.course?.slug}`}
                    className="rounded-full bg-thread-gold px-5 py-2.5 text-sm font-semibold text-ink-900"
                  >
                    Continue Course
                  </Link>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-fabric-500">
                    <span>Progress</span>
                    <span>{e.courseProgress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-thread-gold" style={{ width: `${e.courseProgress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
