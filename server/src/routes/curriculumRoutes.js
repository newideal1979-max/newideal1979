import { Router } from "express";
import { attachUserIfPresent, requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  getCourseCurriculum,
  createModule, updateModule, deleteModule,
  createLesson, updateLesson, deleteLesson,
} from "../controllers/lessonController.js";

const router = Router();

router.get("/:courseId", attachUserIfPresent, getCourseCurriculum);

router.post("/admin/module", requireAuth, requireAdmin, createModule);
router.put("/admin/module/:id", requireAuth, requireAdmin, updateModule);
router.delete("/admin/module/:id", requireAuth, requireAdmin, deleteModule);

router.post("/admin/lesson", requireAuth, requireAdmin, createLesson);
router.put("/admin/lesson/:id", requireAuth, requireAdmin, updateLesson);
router.delete("/admin/lesson/:id", requireAuth, requireAdmin, deleteLesson);

export default router;
