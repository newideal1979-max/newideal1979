import { Link } from "react-router-dom";
import { Check, Clock, MonitorSmartphone } from "lucide-react";

const accents = {
  mens: { ring: "border-thread-blue/30", text: "text-thread-blue", dot: "bg-thread-blue" },
  womens: { ring: "border-thread-plum/30", text: "text-thread-plum", dot: "bg-thread-plum" },
};

export default function CourseCard({ course }) {
  const accent = accents[course.category] || accents.mens;

  return (
    <div className={`rounded-2xl border ${accent.ring} bg-ink-800 p-7`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl text-fabric-100">{course.name}</h3>
          <p className="mt-2 text-sm text-fabric-500">{course.subtitle}</p>
        </div>
        {course.badge && (
          <span className={`shrink-0 rounded-full border ${accent.ring} px-3 py-1 text-[11px] ${accent.text}`}>
            {course.badge}
          </span>
        )}
      </div>

      <div className="mt-5 flex gap-5 text-xs text-fabric-500">
        <span className="flex items-center gap-1.5"><Clock size={13} /> {course.duration}</span>
        <span className="flex items-center gap-1.5"><MonitorSmartphone size={13} /> {course.mode}</span>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {course.features?.slice(0, 6).map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-fabric-300">
            <Check size={14} className="mt-0.5 shrink-0 text-thread-gold" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex items-center justify-between border-t border-white/8 pt-6">
        <span className="font-display text-2xl text-thread-gold">₹{course.price?.toLocaleString("en-IN")}</span>
        <div className="flex gap-3">
          <Link to={`/courses/${course.slug}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-fabric-100 hover:border-thread-gold/50">
            View Course
          </Link>
          <Link to={`/courses/${course.slug}?enroll=1`} className="rounded-full bg-thread-gold px-4 py-2 text-sm font-semibold text-ink-900">
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
}
