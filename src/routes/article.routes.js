import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getArticleBySlug,
  getArticles,
  updateArticle,
} from "../controllers/article.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../utils/validators.js";

const router = Router();

// Public routes
router.route("/").get(getArticles);
router.route("/:slug").get(getArticleBySlug);

// Secured routes (Only EDITOR, REPORTER, ADMIN can create/update/delete)
router.use(verifyJWT);
router.use(authorizeRoles("ADMIN", "EDITOR", "REPORTER"));

router
  .route("/")
  .post(
    upload.single("thumbnail"),
    validate(createArticleSchema),
    createArticle,
  );

router
  .route("/:articleId")
  .patch(
    upload.single("thumbnail"),
    validate(updateArticleSchema),
    updateArticle,
  )
  .delete(deleteArticle);

export default router;
