import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  listCourses, getCourseBySlug,
  adminListCourses, createCourse, updateCourse, deleteCourse,
} from "../controllers/courseController.js";

const router = Router();

router.get("/", listCourses);
router.get("/:slug", getCourseBySlug);

router.get("/admin/all", requireAuth, requireAdmin, adminListCourses);
router.post("/admin", requireAuth, requireAdmin, createCourse);
router.put("/admin/:id", requireAuth, requireAdmin, updateCourse);
router.delete("/admin/:id", requireAuth, requireAdmin, deleteCourse);

export default router;
