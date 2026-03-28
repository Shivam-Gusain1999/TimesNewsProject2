import { Router } from "express";
import {
  createAd,
  getAds,
  getAdById,
  updateAd,
  deleteAd,
} from "../controllers/ad.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getAds);
router.route("/:id").get(getAdById);

// Secured routes
router.use(verifyJWT);
router.use(authorizeRoles("ADMIN", "EDITOR"));

router
  .route("/")
  .post(
    upload.single("image"),
    createAd
  );

router
  .route("/:id")
  .patch(
    upload.single("image"),
    updateAd
  )
  .delete(deleteAd);

export default router;
