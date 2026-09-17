import { useEffect, useState } from "react";
import { ChevronDown, Lock, PlayCircle } from "lucide-react";
import api from "../lib/api";

const levelLabels = ["Beginner", "Intermediate", "Advanced", "Professional"];

export default function Curriculum() {
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [openLevel, setOpenLevel] = useState(1);

  useEffect(() => {
    api.get("/courses").then(({ data }) => {
      setCourses(data.data);
      if (data.data[0]) setActiveCourse(data.data[0]);
    });
  }, []);

  useEffect(() => {
    if (activeCourse) {
      api.get(`/curriculum/${activeCourse._id}`).then(({ data }) => setModules(data.data));
    }
  }, [activeCourse]);

  return (
    <div className="container-institute py-16 lg:py-24">
      <h1 className="font-display text-4xl text-fabric-100">Structured Learning Path</h1>
      <p className="mt-4 max-w-xl text-fabric-500">
        From zero to professional in four progressive levels. Every skill builds on the last.
      </p>

      <div className="mt-10 inline-flex rounded-full border border-white/10 p-1">
        {courses.map((c) => (
          <button
            key={c._id}
            onClick={() => { setActiveCourse(c); setOpenLevel(1); }}
            className={`rounded-full px-5 py-2 text-sm transition-colors ${
              activeCourse?._id === c._id ? "bg-thread-gold text-ink-900 font-semibold" : "text-fabric-300"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-3">
        {modules.map((mod) => {
          const open = openLevel === mod.level;
          return (
            <div key={mod._id} className="rounded-2xl border border-white/8 bg-ink-800">
              <button
                onClick={() => setOpenLevel(open ? null : mod.level)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <div>
                  <span className="text-xs text-thread-gold">{levelLabels[mod.level - 1]}</span>
                  <h3 className="mt-1 font-display text-lg text-fabric-100">{mod.title}</h3>
                </div>
                <ChevronDown className={`text-fabric-500 transition-transform ${open ? "rotate-180" : ""}`} size={20} />
              </button>
              {open && (
                <div className="border-t border-white/8 px-6 py-5">
                  {mod.description && <p className="mb-4 text-sm text-fabric-500">{mod.description}</p>}
                  {mod.lessons?.length > 0 ? (
                    <ul className="space-y-3">
                      {mod.lessons.map((l) => (
                        <li key={l._id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-fabric-300">
                            {l.locked ? <Lock size={14} className="text-fabric-500" /> : <PlayCircle size={14} className="text-thread-gold" />}
                            {l.title}
                          </span>
                          <span className="text-xs text-fabric-500">{l.durationMinutes} min</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-fabric-500">Lessons for this level are being added.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
