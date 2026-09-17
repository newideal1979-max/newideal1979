import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getMyEnrollments, getEnrollmentForCourse, markLessonComplete,
} from "../controllers/enrollmentController.js";

const router = Router();

router.get("/me", requireAuth, getMyEnrollments);
router.get("/me/:courseId", requireAuth, getEnrollmentForCourse);
router.post("/progress", requireAuth, markLessonComplete);

export default router;
