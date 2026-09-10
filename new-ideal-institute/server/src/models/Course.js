import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    subtitle: { type: String, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["mens", "womens"], required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    duration: { type: String, default: "4 Months" },
    mode: { type: String, default: "Online + Offline" },
    badge: { type: String, trim: true }, // e.g. "Most Popular", "Bestseller"
    features: [{ type: String }],
    thumbnail: { type: String },
    learningOutcomes: [{ type: String }],
    whoItsFor: [{ type: String }],
    prerequisites: [{ type: String }],
    instructor: {
      name: String,
      bio: String,
      photo: String,
    },
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
