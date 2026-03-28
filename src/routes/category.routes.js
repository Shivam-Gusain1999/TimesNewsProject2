import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createCategorySchema } from "../utils/validators.js";

const router = Router();

// Public route
router.route("/").get(getAllCategories);

// Secured routes (Only ADMIN can manage categories)
router.use(verifyJWT);
router.use(authorizeRoles("ADMIN"));

router.route("/").post(validate(createCategorySchema), createCategory);
router
  .route("/:categoryId")
  .patch(validate(createCategorySchema), updateCategory)
  .delete(deleteCategory);

export default router;
