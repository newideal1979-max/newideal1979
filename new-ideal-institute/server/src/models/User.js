import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    // Role is set here by an admin action or a controlled seed/promotion script — NEVER from
    // a value the frontend sends on signup. See adminController.promoteToAdmin.
    role: { type: String, enum: ["student", "admin"], default: "student" },
    photoURL: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
