import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { sensitiveLimiter } from "../middleware/rateLimit.js";
import { createInquiry, adminListInquiries, updateInquiryStatus } from "../controllers/inquiryController.js";

const router = Router();

router.post("/", sensitiveLimiter, createInquiry);
router.get("/admin", requireAuth, requireAdmin, adminListInquiries);
router.put("/admin/:id", requireAuth, requireAdmin, updateInquiryStatus);

export default router;
