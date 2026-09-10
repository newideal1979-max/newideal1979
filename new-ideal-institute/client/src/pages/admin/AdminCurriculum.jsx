import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import api from "../../lib/api";

export default function AdminCurriculum() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [modules, setModules] = useState([]);
  const [newLesson, setNewLesson] = useState({}); // { [moduleId]: { title, videoUrl, durationMinutes } }

  useEffect(() => {
    api.get("/courses/admin/all").then(({ data }) => {
      setCourses(data.data);
      if (data.data[0]) setCourseId(data.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (courseId) loadModules();
  }, [courseId]);

  function loadModules() {
    api.get(`/curriculum/${courseId}`).then(({ data }) => setModules(data.data));
  }

  async function addLesson(moduleId) {
    const draft = newLesson[moduleId];
    if (!draft?.title) return;
    await api.post("/curriculum/admin/lesson", {
      module: moduleId,
      course: courseId,
      title: draft.title,
      videoUrl: draft.videoUrl || "",
      durationMinutes: Number(draft.durationMinutes) || 0,
      isPreview: !!draft.isPreview,
      isPublished: true,
    });
    setNewLesson({ ...newLesson, [moduleId]: {} });
    loadModules();
  }

  async function deleteLesson(lessonId) {
    await api.delete(`/curriculum/admin/lesson/${lessonId}`);
    loadModules();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-fabric-100">Curriculum</h1>

      <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="mt-6 rounded-lg border border-white/10 bg-ink-800 px-4 py-2.5 text-sm text-fabric-100">
        {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      <div className="mt-8 space-y-6">
        {modules.map((mod) => (
          <div key={mod._id} className="rounded-2xl border border-white/8 bg-ink-800 p-6">
            <p className="text-xs text-thread-gold">Level {mod.level}</p>
            <h3 className="font-display text-lg text-fabric-100">{mod.title}</h3>

            <div className="mt-4 space-y-2">
              {mod.lessons?.map((l) => (
                <div key={l._id} className="flex items-center justify-between rounded-lg border border-white/8 px-4 py-2.5 text-sm">
                  <span className="text-fabric-300">{l.title} {l.isPreview && <span className="ml-2 text-xs text-thread-gold">Preview</span>}</span>
                  <button onClick={() => deleteLesson(l._id)} className="text-fabric-500 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_100px_auto]">
              <input
                placeholder="Lesson title"
                value={newLesson[mod._id]?.title || ""}
                onChange={(e) => setNewLesson({ ...newLesson, [mod._id]: { ...newLesson[mod._id], title: e.target.value } })}
                className="rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-xs text-fabric-100"
              />
              <input
                placeholder="Video URL"
                value={newLesson[mod._id]?.videoUrl || ""}
                onChange={(e) => setNewLesson({ ...newLesson, [mod._id]: { ...newLesson[mod._id], videoUrl: e.target.value } })}
                className="rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-xs text-fabric-100"
              />
              <input
                type="number" placeholder="Mins"
                value={newLesson[mod._id]?.durationMinutes || ""}
                onChange={(e) => setNewLesson({ ...newLesson, [mod._id]: { ...newLesson[mod._id], durationMinutes: e.target.value } })}
                className="rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-xs text-fabric-100"
              />
              <button onClick={() => addLesson(mod._id)} className="flex items-center justify-center gap-1 rounded-lg bg-thread-gold px-3 py-2 text-xs font-semibold text-ink-900">
                <Plus size={13} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
