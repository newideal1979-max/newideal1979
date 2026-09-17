import { MapPin, Clock, Award } from "lucide-react";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

export default function About() {
  const settings = useSiteSettings();

  return (
    <div className="container-institute py-16 lg:py-24">
      <span className="inline-flex items-center gap-2 rounded-full border border-thread-gold/30 px-4 py-1.5 text-xs tracking-wide text-thread-gold">
        Since {settings.foundedYear}
      </span>
      <h1 className="mt-6 font-display text-4xl text-fabric-100 sm:text-5xl">Our Story</h1>

      <div className="mt-8 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
        <div className="max-w-2xl space-y-5 leading-relaxed text-fabric-300">
          <p>
            New Ideal Cutting and Stitching Institute began in {settings.foundedYear} in Ahmedabad,
            started by {settings.founder}. From the very first batch, the teaching approach was the
            same one it still uses today: tailoring is learned by doing it, not by watching it.
          </p>
          <p>
            Over the decades, students have walked through the institute's doors on Relief Road —
            learning to measure, cut, stitch, and finish garments to a standard good enough to build
            a livelihood on. That's always been the point: not a hobby class, but a real, practical skill.
          </p>
          <p>
            Today, the institute continues under {settings.currentDirector}, {settings.founder}'s son,
            who grew up around the same sewing machines and fabric tables and has carried the teaching
            forward with the same standards.
          </p>
          <p>
            After decades of teaching exclusively in person, the institute is now opening its doors
            to students everywhere through online learning. The curriculum, the standards, and the
            structured 4-month path haven't changed — only the reach has. A student in Ahmedabad and
            a student anywhere else in India now learn from the same course.
          </p>
          <p>
            The institute continues to run offline batches at the same Relief Road location for
            students who prefer to learn in person, alongside the online course.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/8 bg-ink-800 p-6">
            <MapPin className="text-thread-gold" size={18} />
            <h3 className="mt-3 text-sm font-semibold text-fabric-100">Where we teach</h3>
            <p className="mt-2 text-sm text-fabric-500">
              {settings.address?.line1}, {settings.address?.line2}, {settings.address?.city} — {settings.address?.pincode}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-ink-800 p-6">
            <Clock className="text-thread-gold" size={18} />
            <h3 className="mt-3 text-sm font-semibold text-fabric-100">Class timings</h3>
            <p className="mt-2 text-sm text-fabric-500">Morning: {settings.classTimings?.morning}</p>
            <p className="text-sm text-fabric-500">Evening: {settings.classTimings?.evening}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-ink-800 p-6">
            <Award className="text-thread-gold" size={18} />
            <h3 className="mt-3 text-sm font-semibold text-fabric-100">What hasn't changed</h3>
            <p className="mt-2 text-sm text-fabric-500">
              Practical, hands-on teaching — the same approach since {settings.foundedYear}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
