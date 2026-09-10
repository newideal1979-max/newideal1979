import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import StudentSidebar from "../../components/layout/StudentSidebar";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState(null);

  useEffect(() => {
    api.get("/enrollments/me").then(({ data }) => setEnrollments(data.data)).catch(() => setEnrollments([]));
  }, []);

  return (
    <div className="container-institute grid gap-10 py-12 lg:grid-cols-[220px_1fr] lg:py-16">
      <StudentSidebar />
      <div>
        <h1 className="font-display text-3xl text-fabric-100">My Courses</h1>

        {enrollments?.length === 0 && (
          <div className="mt-10 rounded-2xl border border-white/8 bg-ink-800 p-10 text-center">
            <p className="text-fabric-300">No enrollments yet.</p>
            <Link to="/courses" className="mt-5 inline-block rounded-full bg-thread-gold px-6 py-3 text-sm font-semibold text-ink-900">
              Explore Courses
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {enrollments?.map((e) => (
            <div key={e._id} className="rounded-2xl border border-white/8 bg-ink-800 p-6">
              <h3 className="font-display text-lg text-fabric-100">{e.course?.name}</h3>
              <p className="mt-2 text-xs text-fabric-500">Status: {e.enrollmentStatus} · {e.courseProgress}% complete</p>
              <Link to={`/learn/${e.course?.slug}`} className="mt-5 inline-block rounded-full border border-white/15 px-5 py-2.5 text-sm text-fabric-100 hover:border-thread-gold/50">
                Open Course
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
