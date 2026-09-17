import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    text: { type: String, required: true },
    photo: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    // Only "published" testimonials are ever returned by the public API — admin approval
    // is required before anything goes live. See testimonialController.getPublished.
    status: { type: String, enum: ["pending", "published", "hidden"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
