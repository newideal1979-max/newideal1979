import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    courseInterest: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "resolved"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
