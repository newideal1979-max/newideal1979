import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getDashboardStats, listUsers, promoteToAdmin, listEnrollments, listPayments } from "../controllers/adminDashboardController.js";

const router = Router();

router.use(requireAuth, requireAdmin);
router.get("/dashboard", getDashboardStats);
router.get("/users", listUsers);
router.put("/users/:id/promote", promoteToAdmin);
router.get("/enrollments", listEnrollments);
router.get("/payments", listPayments);

export default router;
