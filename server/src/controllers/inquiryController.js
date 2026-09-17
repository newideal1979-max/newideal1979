import Inquiry from "../models/Inquiry.js";
import { ApiError } from "../middleware/errorHandler.js";

export async function createInquiry(req, res, next) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) throw new ApiError(400, "Name, email and message are required.");
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, message: "Inquiry submitted. We'll reach out within 24 hours.", data: inquiry });
  } catch (err) {
    next(err);
  }
}

export async function adminListInquiries(req, res, next) {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, message: "Inquiries fetched.", data: inquiries });
  } catch (err) {
    next(err);
  }
}

export async function updateInquiryStatus(req, res, next) {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!inquiry) throw new ApiError(404, "Inquiry not found.");
    res.json({ success: true, message: "Status updated.", data: inquiry });
  } catch (err) {
    next(err);
  }
}
