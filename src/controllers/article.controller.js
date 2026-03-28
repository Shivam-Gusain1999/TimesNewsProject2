import { Article } from "../models/article.model.js";
// 🚀 THE FIX: Imported Category model which was missing!
import { Category } from "../models/category.model.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// Utility: Generate SEO-friendly slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "-");
};

// ==================== CREATE ARTICLE ====================
const createArticle = asyncHandler(async (req, res) => {
  const { title, content, category, status } = req.body;

  let thumbnailUrl = "";

  const thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (thumbnail) {
      thumbnailUrl = thumbnail.url;
    } else {
      console.warn("Cloudinary upload failed, saving article without thumbnail");
    }
  }

  let slug = generateSlug(title);
  const existingArticle = await Article.findOne({ slug });
  if (existingArticle) {
    slug = `${slug}-${Date.now()}`;
  }

  const article = await Article.create({
    title,
    slug,
    content,
    category,
    author: req.user._id,
    thumbnail: thumbnailUrl,
    status: status || "DRAFT",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, article, "Article created successfully"));
});

// ==================== GET ARTICLES (PUBLIC + SMART FILTER) ====================
const getArticles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, search } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const matchCondition = { status: "PUBLISHED" };

  // SMART CATEGORY FILTERING — case-insensitive regex for Hindi/English
  if (category) {
    try {
      const decodedCategory = decodeURIComponent(category).trim();
      const categoryDoc = await Category.findOne({ 
        name: { $regex: new RegExp(`^${decodedCategory}$`, 'i') }
      });

      if (categoryDoc) {
        matchCondition.category = categoryDoc._id;
      } else {
        return res.status(200).json(
          new ApiResponse(200, {
            articles: [],
            pagination: {
              currentPage: pageNum,
              totalPages: 0,
              totalDocuments: 0,
              hasNextPage: false,
            },
          }, "No articles found for this category")
        );
      }
    } catch (error) {
      console.error("Category matching error: ", error);
      throw new ApiError(500, "Error while filtering category");
    }
  }

  // 🔍 Search Logic
  if (search) {
    matchCondition.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  // Get total count for pagination metadata
  const totalDocuments = await Article.countDocuments(matchCondition);
  const totalPages = Math.ceil(totalDocuments / limitNum);

  const pipeline = [
    { $match: matchCondition },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
        pipeline: [{ $project: { fullName: 1, avatar: 1, username: 1 } }],
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $addFields: {
        author: { $arrayElemAt: ["$authorDetails", 0] },
        category: { $arrayElemAt: ["$categoryDetails", 0] },
      },
    },
    { $project: { authorDetails: 0, categoryDetails: 0 } },
    { $sort: { createdAt: -1 } },
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum },
  ];

  const articles = await Article.aggregate(pipeline);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        articles,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalDocuments,
          hasNextPage: pageNum < totalPages,
        },
      },
      "Articles fetched successfully",
    ),
  );
});

// ==================== GET ARTICLE BY SLUG (PUBLIC) ====================
const getArticleBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const article = await Article.findOneAndUpdate(
    { slug, status: "PUBLISHED" },
    { $inc: { views: 1 } },
    { new: true },
  )
    .populate("author", "fullName avatar username")
    .populate("category", "name");

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, article, "Article fetched successfully"));
});

// ==================== UPDATE ARTICLE ====================
const updateArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { title, content, category, status } = req.body;

  const article = await Article.findById(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Only author or admin can update
  if (
    article.author.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    throw new ApiError(403, "You don't have permission to update this article");
  }

  if (title) {
    article.title = title;
    article.slug = generateSlug(title);
    // Check slug uniqueness
    const existing = await Article.findOne({
      slug: article.slug,
      _id: { $ne: articleId },
    });
    if (existing) article.slug = `${article.slug}-${Date.now()}`;
  }
  if (content) article.content = content;
  if (category) article.category = category;
  if (status) article.status = status;

  // Handle new thumbnail if uploaded
  const thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (thumbnail) article.thumbnail = thumbnail.url;
  }

  await article.save();

  return res
    .status(200)
    .json(new ApiResponse(200, article, "Article updated successfully"));
});

// ==================== DELETE ARTICLE ====================
const deleteArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const article = await Article.findById(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Only author or admin can delete
  if (
    article.author.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    throw new ApiError(403, "You don't have permission to delete this article");
  }

  await Article.findByIdAndDelete(articleId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Article deleted successfully"));
});

export {
  createArticle,
  getArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
};