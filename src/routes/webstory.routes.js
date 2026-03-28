import { Router } from "express";
import {
  createWebStory,
  deleteWebStory,
  getWebStoryById,
  getWebStories,
  updateWebStory,
} from "../controllers/webstory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getWebStories);
router.route("/:id").get(getWebStoryById);

// Secured routes
router.use(verifyJWT);
router.use(authorizeRoles("ADMIN", "EDITOR"));

router
  .route("/")
  .post(
    upload.single("image"),
    createWebStory,
  );

router
  .route("/:id")
  .patch(
    upload.single("image"),
    updateWebStory,
  )
  .delete(deleteWebStory);

export default router;
