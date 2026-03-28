import { ApiError } from "../utils/ApiError.js";

const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

// Log errors in development for backend visibility
  if (process.env.NODE_ENV !== "production") {
    console.error(`\n❌ [${error.statusCode}] ${error.message}`);
    const errs = error.errors || [];
    if (Array.isArray(errs) && errs.length > 0) {
      console.error("   Validation errors:", errs);
    }
  }

  // Explicitly build response to ensure errors array is always included safely
  const response = {
    statusCode: error.statusCode,
    message: error.message,
    success: false,
    errors: Array.isArray(error.errors) ? error.errors : [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { globalErrorHandler };
