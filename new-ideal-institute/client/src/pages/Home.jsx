import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Ruler, Globe2, Users, Wallet, ArrowUpRight } from "lucide-react";
import HeroMotif from "../components/home/HeroMotif";
import Button from "../components/ui/Button";
import CourseCard from "../components/course/CourseCard";
import { useSiteSettings } from "../contexts/SiteSettingsContext";
import api from "../lib/api";

const features = [
  { icon: Ruler, title: "45+ Years of Legacy", body: "Built on decades of practical tailoring knowledge." },
  { icon: Globe2, title: "Learn From Anywhere", body: "Join online classes from wherever you are." },
  { icon: Users, title: "Men's & Women's Courses", body: "Professional tailoring education for both." },
  { icon: Wallet, title: "Affordable Fees", body: "Professional learning at a price designed to stay accessible." },
];

const timeline = [
  { year: "1979", text: "Ilyas Mansuri starts New Ideal Cutting and Stitching Institute in Ahmedabad." },
  { year: "Decades since", text: "Years of offline tailoring education and hands-on practical training." },
  { year: "Present", text: "Tosifahmed Mansuri continues the institute's teaching, on Relief Road." },
  { year: "Today", text: "The institute expands into online learning, open to students anywhere." },
];

export default function Home() {
  const settings = useSiteSettings();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses").then(({ data }) => setCourses(data.data)).catch(() => setCourses([]));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-institute grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-thread-gold/30 px-4 py-1.5 text-xs tracking-wide text-thread-gold">
              Established in {settings.foundedYear}
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] text-fabric-100 sm:text-5xl lg:text-6xl">
              Master the Art of Cutting &amp; Stitching
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-fabric-300">
              {settings.heroDescription}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button to="/courses">Explore Courses</Button>
              <Button to="/about" variant="outline">Learn Our Story</Button>
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                ["1979", "Established"],
                ["4 Months", "Course Duration"],
                ["Online + Offline", "Learning Mode"],
                [settings.studentsTrained ?? "—", "Students Trained"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-xl text-thread-gold">{value}</dt>
                  <dd className="mt-1 text-xs text-fabric-500">{label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <HeroMotif />
          </motion.div>
        </div>
      </section>

      {/* LEGACY TIMELINE */}
      <section className="border-y border-white/5 bg-ink-950">
        <div className="container-institute py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-fabric-100 sm:text-4xl">
              From one classroom in Relief Road to students learning from anywhere
            </h2>
          </div>
          <div className="mt-14 grid gap-8 border-l border-white/10 pl-8 sm:grid-cols-2 sm:gap-x-12 sm:border-l-0 sm:pl-0">
            {timeline.map((t, i) => (
              <div key={i} className="relative sm:border-t sm:border-white/10 sm:pt-6">
                <span className="font-display text-lg text-thread-gold">{t.year}</span>
                <p className="mt-2 text-sm leading-relaxed text-fabric-500">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container-institute py-20">
        <h2 className="font-display text-3xl text-fabric-100 sm:text-4xl">Why choose New Ideal</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-white/8 bg-ink-800 p-6">
              <Icon className="text-thread-gold" size={22} />
              <h3 className="mt-4 text-base font-semibold text-fabric-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fabric-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section className="border-t border-white/5 bg-ink-950">
        <div className="container-institute py-20">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-fabric-100 sm:text-4xl">Choose your course</h2>
            <Link to="/courses" className="hidden items-center gap-1 text-sm text-thread-gold sm:flex">
              View all <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {courses.length > 0
              ? courses.map((c) => <CourseCard key={c._id} course={c} />)
              : [1, 2].map((i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl border border-white/8 bg-ink-800" />
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
