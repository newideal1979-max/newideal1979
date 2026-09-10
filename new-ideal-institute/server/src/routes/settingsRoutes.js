import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getPublicSettings, updateSettings } from "../controllers/siteSettingsController.js";

const router = Router();

router.get("/", getPublicSettings);
router.put("/admin", requireAuth, requireAdmin, updateSettings);

export default router;
