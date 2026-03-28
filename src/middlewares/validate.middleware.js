import { ApiError } from "../utils/ApiError.js";

/**
 * Zod Validation Middleware
 * Takes a Zod schema and validates req.body against it.
 * If validation fails, passes ApiError to Express error handler via next().
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorList = result.error.errors || result.error.issues || [];
    const errorMessages = errorList.map(
      (err) => `${err.path.join(".")}: ${err.message}`,
    );
    // Use next() instead of throw to properly pass errors through Express error chain
    return next(new ApiError(400, "Validation Error", errorMessages));
  }

  // Replace req.body with parsed (cleaned) data
  req.body = result.data;
  next();
};

export { validate };
