import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getMe, updateMyProfile } from "../controllers/authController.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMyProfile);

export default router;
