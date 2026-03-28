import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// GET settings is public so the frontend can retrieve Site Name, Maintenance mode, etc.
router.route("/").get(getSettings);

// POST settings is secured, requires Admin
router.route("/").post(verifyJWT, authorizeRoles("ADMIN"), updateSettings);

export default router;
