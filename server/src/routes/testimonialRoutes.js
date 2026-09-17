import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  getPublished, adminListTestimonials, createTestimonial, updateTestimonialStatus,
} from "../controllers/testimonialController.js";

const router = Router();

router.get("/", getPublished);
router.get("/admin", requireAuth, requireAdmin, adminListTestimonials);
router.post("/admin", requireAuth, requireAdmin, createTestimonial);
router.put("/admin/:id/status", requireAuth, requireAdmin, updateTestimonialStatus);

export default router;
