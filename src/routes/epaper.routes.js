import { Router } from "express";
import {
  uploadEPaper,
  getAllEPapers,
  getEPaperByDate,
  deleteEPaper,
} from "../controllers/epaper.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getAllEPapers);
router.route("/:date").get(getEPaperByDate);

// Secured routes (Only ADMIN can manage)
router.use(verifyJWT);
router.use(authorizeRoles("ADMIN"));

router.route("/").post(upload.array("pages", 20), uploadEPaper);
router.route("/:id").delete(deleteEPaper);

export default router;
