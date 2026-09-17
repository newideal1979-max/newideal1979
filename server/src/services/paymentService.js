import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * PaymentService is an abstraction so the enrollment system never talks to Razorpay's SDK
 * directly. If the institute switches providers later, only this file changes —
 * paymentController and the enrollment flow stay untouched.
 */
class RazorpayPaymentService {
  #client;

  constructor() {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error(
        "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing in server/.env (from Razorpay Dashboard > Settings > API Keys)."
      );
    }
    this.#client = new Razorpay({ key_id, key_secret });
  }

  /** amountInRupees: a plain number like 10000. Razorpay needs paise (integer). */
  async createOrder({ amountInRupees, receipt, notes }) {
    const order = await this.#client.orders.create({
      amount: Math.round(amountInRupees * 100),
      currency: "INR",
      receipt,
      notes,
    });
    return order; // { id, amount, currency, ... }
  }

  /**
   * The only correct way to confirm a payment succeeded. Recomputes the HMAC signature
   * server-side using our secret key and compares it to what the client sent back.
   * If this fails, the payment is NOT trusted — no enrollment is created, no matter
   * what the frontend claims happened in the Razorpay checkout popup.
   */
  verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature || ""));
  }

  /** Verifies an incoming webhook came from Razorpay, not a spoofed request. */
  verifyWebhookSignature(rawBody, signatureHeader) {
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");
    return expected === signatureHeader;
  }
}

let instance;
export function getPaymentService() {
  if (!instance) instance = new RazorpayPaymentService();
  return instance;
}
