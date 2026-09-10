import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    provider: { type: String, default: "razorpay" },
    orderId: { type: String, required: true, unique: true }, // razorpay_order_id
    paymentId: { type: String }, // razorpay_payment_id, set only after verification
    signature: { type: String }, // razorpay_signature, stored for audit only

    amount: { type: Number, required: true }, // in paise
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },

    failureReason: { type: String },
    rawWebhookPayload: { type: mongoose.Schema.Types.Mixed }, // last webhook event, for debugging
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
