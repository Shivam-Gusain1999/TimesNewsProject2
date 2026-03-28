import { z } from "zod";

// ========== USER SCHEMAS ==========
export const registerUserSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters").regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
});

export const loginUserSchema = z
  .object({
    email: z.string().email("Invalid email format").optional(),
    username: z.string().optional(),
    password: z.string({ required_error: "Password is required" }),
  })
  .refine((data) => data.email || data.username, {
    message: "Either email or username is required",
  });

export const changePasswordSchema = z.object({
  oldPassword: z.string({ required_error: "Old password is required" }),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(6, "New password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
});

// ========== ARTICLE SCHEMAS ==========
export const createArticleSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  content: z
    .string({ required_error: "Content is required" })
    .min(20, "Content must be at least 20 characters"),
  category: z
    .string({ required_error: "Category is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const updateArticleSchema = z.object({
  title: z.string().trim().min(5).max(200).optional(),
  content: z.string().min(20).optional(),
  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
    .optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

// ========== CATEGORY SCHEMAS ==========
export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .trim()
    .min(2, "Category name must be at least 2 characters"),
  description: z.string().trim().optional(),
});

// ========== COMMENT SCHEMAS ==========
export const addCommentSchema = z.object({
  content: z
    .string({ required_error: "Comment content is required" })
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be at most 1000 characters"),
});
