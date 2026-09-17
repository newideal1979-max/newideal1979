import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Lock, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../lib/api";

export default function CourseLearning() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/courses/${slug}`).then(({ data }) => setCourse(data.data)).catch(() => setError("Course not found."));
  }, [slug]);

  useEffect(() => {
    if (!course) return;
    api.get(`/enrollments/me/${course._id}`).then(({ data }) => {
      if (!data.data) {
        // Backend gates lesson content already, but redirect cleanly rather than
        // showing an empty/locked LMS shell to someone who never paid.
        navigate(`/courses/${slug}`);
        return;
      }
      setEnrollment(data.data);
    });
    api.get(`/curriculum/${course._id}`).then(({ data }) => {
      setModules(data.data);
      const firstUnlocked = data.data.flatMap((m) => m.lessons).find((l) => !l.locked);
      if (firstUnlocked) setActiveLesson(firstUnlocked);
    });
  }, [course, navigate, slug]);

  const allLessons = modules.flatMap((m) => m.lessons || []);
  const currentIndex = allLessons.findIndex((l) => l._id === activeLesson?._id);
  const isCompleted = (lessonId) => enrollment?.completedLessons?.some((id) => id === lessonId || id?._id === lessonId);

  async function markComplete() {
    if (!activeLesson || !course) return;
    const { data } = await api.post("/enrollments/progress", { courseId: course._id, lessonId: activeLesson._id });
    setEnrollment(data.data);
  }

  function goTo(offset) {
    const next = allLessons[currentIndex + offset];
    if (next && !next.locked) setActiveLesson(next);
  }

  if (error) return <div className="container-institute py-24 text-fabric-500">{error}</div>;
  if (!course || !enrollment) return <div className="container-institute py-24 text-fabric-500">Loading your course…</div>;

  const sidebarContent = (
    <div className="space-y-5">
      {modules.map((mod) => (
        <div key={mod._id}>
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-fabric-500">{mod.title}</p>
          <div className="mt-2 space-y-1">
            {mod.lessons?.map((lesson) => (
              <button
                key={lesson._id}
                disabled={lesson.locked}
                onClick={() => { setActiveLesson(lesson); setDrawerOpen(false); }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  activeLesson?._id === lesson._id ? "bg-thread-gold/10 text-thread-gold" : "text-fabric-300 hover:text-fabric-100"
                } ${lesson.locked ? "opacity-40" : ""}`}
              >
                {lesson.locked ? (
                  <Lock size={14} />
                ) : isCompleted(lesson._id) ? (
                  <CheckCircle2 size={14} className="text-thread-gold" />
                ) : (
                  <Circle size={14} />
                )}
                <span className="flex-1 truncate">{lesson.title}</span>
                <span className="text-[11px] text-fabric-500">{lesson.durationMinutes}m</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ink-900">
      {/* desktop sidebar */}
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-white/8 p-6 lg:block">
        <h2 className="font-display text-base text-fabric-100">{course.name}</h2>
        <div className="mt-2 h-1.5 rounded-full bg-white/8">
          <div className="h-full rounded-full bg-thread-gold" style={{ width: `${enrollment.courseProgress}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-fabric-500">{enrollment.courseProgress}% complete</p>
        <div className="mt-6">{sidebarContent}</div>
      </aside>

      {/* mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-ink-900 p-6 lg:hidden overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base text-fabric-100">{course.name}</h2>
            <button onClick={() => setDrawerOpen(false)} className="text-fabric-100"><X size={22} /></button>
          </div>
          <div className="mt-6">{sidebarContent}</div>
        </div>
      )}

      {/* main lesson area */}
      <div className="flex-1 p-6 lg:p-10">
        <button onClick={() => setDrawerOpen(true)} className="mb-6 flex items-center gap-2 text-sm text-fabric-100 lg:hidden">
          <Menu size={18} /> Curriculum
        </button>

        {activeLesson ? (
          <>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/8 bg-ink-800">
              {activeLesson.videoUrl ? (
                <video src={activeLesson.videoUrl} controls className="h-full w-full" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-fabric-500">
                  Video not yet uploaded for this lesson.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl text-fabric-100">{activeLesson.title}</h1>
                {activeLesson.description && <p className="mt-2 max-w-xl text-sm text-fabric-500">{activeLesson.description}</p>}
              </div>
              <button
                onClick={markComplete}
                disabled={isCompleted(activeLesson._id)}
                className="rounded-full bg-thread-gold px-5 py-2.5 text-sm font-semibold text-ink-900 disabled:opacity-50"
              >
                {isCompleted(activeLesson._id) ? "Completed" : "Mark as Complete"}
              </button>
            </div>

            <div className="mt-8 flex justify-between border-t border-white/8 pt-6">
              <button onClick={() => goTo(-1)} disabled={currentIndex <= 0} className="flex items-center gap-1.5 text-sm text-fabric-300 disabled:opacity-30">
                <ChevronLeft size={16} /> Previous
              </button>
              <button onClick={() => goTo(1)} disabled={currentIndex >= allLessons.length - 1 || allLessons[currentIndex + 1]?.locked} className="flex items-center gap-1.5 text-sm text-fabric-300 disabled:opacity-30">
                Next <ChevronRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <p className="text-fabric-500">No lessons are published for this course yet. Check back soon.</p>
        )}
      </div>
    </div>
  );
}
