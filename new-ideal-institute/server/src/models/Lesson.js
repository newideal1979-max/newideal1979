import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: "CurriculumModule", required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String }, // never returned to unenrolled users — see lessonController
    durationMinutes: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false }, // free/preview lessons are public
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
