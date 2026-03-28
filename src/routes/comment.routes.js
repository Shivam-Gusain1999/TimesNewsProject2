import { Router } from "express";
import {
  addComment,
  deleteComment,
  getArticleComments,
  getAllCommentsForAdmin,
  updateCommentStatus
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addCommentSchema } from "../utils/validators.js";

const router = Router();

// Public route
router.route("/article/:articleId").get(getArticleComments); // Made this a bit clearer

// Secured routes
router.use(verifyJWT);

// ADMIN ROUTES (These routes must always come before dynamic params /:id)
router.route("/admin/all").get(getAllCommentsForAdmin);
router.route("/admin/:commentId/status").patch(updateCommentStatus);

// USER ROUTES
router.route("/:articleId").post(validate(addCommentSchema), addComment);
router.route("/c/:commentId").delete(deleteComment);

export default router;