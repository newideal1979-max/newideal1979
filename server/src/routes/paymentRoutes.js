import { Router } from "express";
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { sensitiveLimiter } from "../middleware/rateLimit.js";
import { createOrder, verifyPayment, getPaymentById, handleWebhook } from "../controllers/paymentController.js";

const router = Router();

router.post("/create-order", requireAuth, sensitiveLimiter, createOrder);
router.post("/verify", requireAuth, sensitiveLimiter, verifyPayment);
router.get("/:id", requireAuth, getPaymentById);

// Razorpay webhooks send raw JSON that must be verified against the raw body — express.raw
// keeps it unparsed here so the signature check in the controller is byte-for-byte accurate.
router.post("/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  req.rawBody = req.body;
  req.body = JSON.parse(req.body.toString());
  next();
}, handleWebhook);

export default router;
