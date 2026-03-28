import { ApiError } from "../utils/ApiError.js";

/**
 * Role-based Authorization Middleware
 * Usage: authorizeRoles("ADMIN", "EDITOR")
 * Only allows users with specified roles to proceed.
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(
        403,
        `Role: ${req.user?.role} is not allowed to access this resource`,
      );
    }
    next();
  };
};

export { authorizeRoles };
