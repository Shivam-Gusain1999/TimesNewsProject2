import { Router } from "express";
import {
  createVideo,
  deleteVideo,
  getVideoById,
  getVideos,
  updateVideo,
  setTopVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getVideos);
router.route("/:id").get(getVideoById);

// Secured routes
router.use(verifyJWT);
router.use(authorizeRoles("ADMIN", "EDITOR"));

router
  .route("/")
  .post(
    upload.single("thumbnail"),
    createVideo,
  );

router
  .route("/:id")
  .patch(
    upload.single("thumbnail"),
    updateVideo,
  )
  .delete(deleteVideo);

router.route("/:id/top").patch(setTopVideo);

export default router;
