import mongoose from "mongoose";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import { getPaymentService } from "../services/paymentService.js";
import { ApiError } from "../middleware/errorHandler.js";

// Step 3-4 of the enrollment flow: authenticated user selects a course, backend creates
// the Razorpay order. Amount is read from the DATABASE, never from the request body —
// otherwise a user could submit their own price.
export async function createOrder(req, res, next) {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course || course.status !== "published") throw new ApiError(404, "Course not found.");

    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
      paymentStatus: "paid",
    });
    if (existing) throw new ApiError(409, "You're already enrolled in this course.");

    const order = await getPaymentService().createOrder({
      amountInRupees: course.price,
      receipt: `receipt_${course._id}_${req.user._id}`.slice(0, 40),
      notes: { courseId: String(course._id), userId: String(req.user._id) },
    });

    await Payment.create({
      user: req.user._id,
      course: course._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
    });

    res.json({
      success: true,
      message: "Order created.",
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID, // public key only — secret never leaves the server
        courseName: course.name,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Step 8-11: frontend sends back what Razorpay's checkout returned. We do NOT trust it —
// we recompute the signature ourselves. Only on a verified match do we mark payment paid
// and create the enrollment, inside a transaction so the two never go out of sync.
export async function verifyPayment(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = getPaymentService().verifySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!payment) throw new ApiError(404, "Payment record not found.");
    if (String(payment.user) !== String(req.user._id)) {
      throw new ApiError(403, "Not authorized to verify this payment.");
    }

    if (!isValid) {
      payment.status = "failed";
      payment.failureReason = "Signature verification failed.";
      await payment.save();
      throw new ApiError(400, "Payment verification failed.");
    }

    let enrollment;
    await session.withTransaction(async () => {
      payment.status = "paid";
      payment.paymentId = razorpay_payment_id;
      payment.signature = razorpay_signature;
      await payment.save({ session });

      enrollment = await Enrollment.findOneAndUpdate(
        { user: req.user._id, course: payment.course },
        {
          user: req.user._id,
          firebaseUid: req.user.firebaseUid,
          course: payment.course,
          payment: payment._id,
          paymentStatus: "paid",
          enrollmentStatus: "active",
          enrolledAt: new Date(),
        },
        { upsert: true, new: true, session }
      );
    });

    res.json({ success: true, message: "Payment verified. Enrollment active.", data: { enrollment } });
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
}

export async function getPaymentById(req, res, next) {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) throw new ApiError(404, "Payment not found.");
    if (String(payment.user) !== String(req.user._id) && req.user.role !== "admin") {
      throw new ApiError(403, "Not authorized to view this payment.");
    }
    res.json({ success: true, message: "Payment fetched.", data: payment });
  } catch (err) {
    next(err);
  }
}

// Razorpay webhook — the safety net if the frontend never calls /verify (tab closed,
// network drop after payment, etc). Confirms payment success independent of the client.
export async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const isValid = getPaymentService().verifyWebhookSignature(req.rawBody, signature);
    if (!isValid) throw new ApiError(400, "Invalid webhook signature.");

    const event = req.body;
    if (event.event === "payment.captured") {
      const orderId = event.payload.payment.entity.order_id;
      const payment = await Payment.findOne({ orderId }).populate("user", "firebaseUid");
      if (payment && payment.status !== "paid") {
        payment.status = "paid";
        payment.paymentId = event.payload.payment.entity.id;
        payment.rawWebhookPayload = event;
        await payment.save();

        await Enrollment.findOneAndUpdate(
          { user: payment.user._id, course: payment.course },
          {
            user: payment.user._id,
            firebaseUid: payment.user.firebaseUid,
            course: payment.course,
            payment: payment._id,
            paymentStatus: "paid",
            enrollmentStatus: "active",
            enrolledAt: new Date(),
          },
          { upsert: true }
        );
      }
    }
    res.json({ success: true, message: "Webhook processed." });
  } catch (err) {
    next(err);
  }
}
