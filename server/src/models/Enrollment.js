import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    enrollmentStatus: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    enrolledAt: { type: Date },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    lastAccessedLesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    courseProgress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

// One active/paid enrollment per user per course — this is what blocks duplicate purchases
// at the database level, not just in the UI.
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
