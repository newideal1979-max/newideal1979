import mongoose from "mongoose";

// A curriculum "module" is one of the four levels (Beginner/Intermediate/Advanced/Professional).
// Lessons are stored separately (see Lesson.js) and referenced by moduleId, so we never
// duplicate lesson content inside the module or the course.
const curriculumModuleSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    level: { type: Number, required: true, min: 1, max: 4 }, // 1 Beginner ... 4 Professional
    title: { type: String, required: true }, // e.g. "Foundation Skills"
    description: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

curriculumModuleSchema.index({ course: 1, level: 1 }, { unique: true });

export default mongoose.model("CurriculumModule", curriculumModuleSchema);
