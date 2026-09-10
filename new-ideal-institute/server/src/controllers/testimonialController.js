import Testimonial from "../models/Testimonial.js";
import { ApiError } from "../middleware/errorHandler.js";

export async function getPublished(req, res, next) {
  try {
    const testimonials = await Testimonial.find({ status: "published" })
      .populate("course", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, message: "Testimonials fetched.", data: testimonials });
  } catch (err) {
    next(err);
  }
}

export async function adminListTestimonials(req, res, next) {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, message: "Testimonials fetched.", data: testimonials });
  } catch (err) {
    next(err);
  }
}

export async function createTestimonial(req, res, next) {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, message: "Testimonial created.", data: testimonial });
  } catch (err) {
    next(err);
  }
}

export async function updateTestimonialStatus(req, res, next) {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!testimonial) throw new ApiError(404, "Testimonial not found.");
    res.json({ success: true, message: "Status updated.", data: testimonial });
  } catch (err) {
    next(err);
  }
}
