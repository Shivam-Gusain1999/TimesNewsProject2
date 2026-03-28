import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Article } from "../models/article.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getArticleComments = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    throw new ApiError(400, "Invalid Article ID");
  }

  const article = await Article.findById(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const commentsAggregate = Comment.aggregate([
    {
      $match: {
        article: new mongoose.Types.ObjectId(articleId),
        status: "Approved",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: { $first: "$authorDetails" },
      },
    },
    {
      $project: {
        authorDetails: 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  const comments = await commentsAggregate;

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    throw new ApiError(400, "Invalid Article ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  const article = await Article.findById(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const comment = await Comment.create({
    content: content.trim(),
    article: articleId,
    author: req.user._id,
    status: "Approved",
  });

  if (!comment) {
    throw new ApiError(500, "Error while adding comment");
  }

  // Populate author details so frontend can display name immediately
  const populatedComment = await Comment.findById(comment._id).populate(
    "author",
    "fullName username avatar"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedComment, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid Comment ID");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Only allow deletion if the user is the author of the comment or an Admin
  if (
    comment.author.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN"
  ) {
    throw new ApiError(
      403,
      "You do not have permission to delete this comment",
    );
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

// Controller for admin to fetch all comments
const getAllCommentsForAdmin = asyncHandler(async (req, res) => {
  // We are populating author details here so the name shows on frontend
  const comments = await Comment.find()
    .populate("author", "fullName username")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "All comments fetched successfully"));
});

// Controller for admin to update comment status
const updateCommentStatus = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { status } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { status },
    { new: true }
  );

  if (!comment) throw new ApiError(404, "Comment not found");

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment status updated"));
});

// Don't forget to export them!
export { getArticleComments, addComment, deleteComment, getAllCommentsForAdmin, updateCommentStatus };


