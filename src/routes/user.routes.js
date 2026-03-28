import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  getTotalUsersCount,
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "../utils/validators.js";

const router = Router();

// Public routes
router
  .route("/register")
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    validate(registerUserSchema),
    registerUser,
  );
router.route("/login").post(validate(loginUserSchema), loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured routes (requires login)
router.use(verifyJWT);
router.route("/logout").post(logoutUser);
router.route("/current-user").get(getCurrentUser);
router
  .route("/change-password")
  .post(validate(changePasswordSchema), changeCurrentPassword);
router
  .route("/update-account")
  .patch(validate(updateProfileSchema), updateAccountDetails);

router.route("/admin/total-users").get(
  authorizeRoles("ADMIN"),
  getTotalUsersCount
);

router.route("/admin/all-users").get(
  authorizeRoles("ADMIN"),
  getAllUsers
);

router.route("/:id")
  .delete(authorizeRoles("ADMIN"), deleteUser)
  .put(authorizeRoles("ADMIN"), updateUserRole);

export default router;
