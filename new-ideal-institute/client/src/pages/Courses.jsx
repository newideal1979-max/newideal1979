import { useEffect, useState } from "react";
import CourseCard from "../components/course/CourseCard";
import api from "../lib/api";

export default function Courses() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/courses")
      .then(({ data }) => setCourses(data.data))
      .catch(() => setError("Couldn't load courses right now. Please try again shortly."));
  }, []);

  return (
    <div className="container-institute py-16 lg:py-24">
      <h1 className="font-display text-4xl text-fabric-100">Our Courses</h1>
      <p className="mt-4 max-w-xl text-fabric-500">
        Two structured, 4-month programs — one for men's tailoring, one for women's — built from
        decades of practical teaching experience.
      </p>

      {error && <p className="mt-10 text-sm text-red-400">{error}</p>}

      {!courses && !error && (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 animate-pulse rounded-2xl border border-white/8 bg-ink-800" />
          ))}
        </div>
      )}

      {courses?.length === 0 && (
        <p className="mt-12 text-fabric-500">No courses available right now. Please check back soon.</p>
      )}

      {courses?.length > 0 && (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {courses.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
