import { Video } from "../models/video.model.js";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// Utility: Extract YouTube Video ID
const getYoutubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ==================== CREATE VIDEO ====================
const createVideo = asyncHandler(async (req, res) => {
  const { title, description, category, videoUrl, status } = req.body;

  if (!title || !videoUrl || !category) {
    throw new ApiError(400, "Title, video URL, and category are required");
  }

  let thumbnailUrl = null;
  const thumbnailLocalPath = req.file?.path;

  if (thumbnailLocalPath) {
    const uploaded = await uploadOnCloudinary(thumbnailLocalPath);
    if (!uploaded) throw new ApiError(400, "Thumbnail upload failed");
    thumbnailUrl = uploaded.url;
  } else {
    // Try expanding from youtube
    const ytId = getYoutubeVideoId(videoUrl);
    if (ytId) {
      thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }

  const video = await Video.create({
    title,
    description,
    videoUrl,
    category,
    status: status || "DRAFT",
    thumbnail: thumbnailUrl,
  });

  const populatedVideo = await Video.findById(video._id).populate("category", "name");

  return res
    .status(201)
    .json(new ApiResponse(201, populatedVideo, "Video created successfully"));
});


// ==================== GET VIDEOS (WITH CATEGORY FILTER) ====================
const getVideos = asyncHandler(async (req, res) => {
  const { status, limit = 8, page = 1, category } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const matchCondition = {};
  if (status) matchCondition.status = status;

  // Category filter — match by name like articles do
  if (category) {
    const decodedCategory = decodeURIComponent(category).trim();
    const categoryDoc = await Category.findOne({
      name: { $regex: new RegExp(`^${decodedCategory}$`, 'i') }
    });
    if (categoryDoc) {
      matchCondition.category = categoryDoc._id;
    } else {
      return res.status(200).json(
        new ApiResponse(200, { videos: [], pagination: { currentPage: pageNum, totalPages: 0, totalDocuments: 0, hasNextPage: false } }, "No videos for this category")
      );
    }
  }

  const totalDocuments = await Video.countDocuments(matchCondition);
  const totalPages = Math.ceil(totalDocuments / limitNum);

  const videos = await Video.find(matchCondition)
    .populate("category", "name")
    .sort({ isTopVideo: -1, createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  return res.status(200).json(
    new ApiResponse(200, {
      videos,
      pagination: { currentPage: pageNum, totalPages, totalDocuments, hasNextPage: pageNum < totalPages },
    }, "Videos fetched successfully")
  );
});

// ==================== GET VIDEO BY ID ====================
const getVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("category", "name");

  if (!video) throw new ApiError(404, "Video not found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

// ==================== UPDATE VIDEO ====================
const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category, videoUrl, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");

  // Only Admin or Editors should be able to update, covered by role middleware
  if (title) video.title = title;
  if (description !== undefined) video.description = description;
  if (category) video.category = category;
  if (status) video.status = status;

  if (videoUrl) {
    video.videoUrl = videoUrl;
    const ytId = getYoutubeVideoId(videoUrl);
    if (ytId && !req.file && (!video.thumbnail || video.thumbnail.includes('img.youtube.com'))) {
      video.thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }

  const thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const uploaded = await uploadOnCloudinary(thumbnailLocalPath);
    if (uploaded) video.thumbnail = uploaded.url;
  }

  await video.save();
  const populatedVideo = await Video.findById(video._id).populate("category", "name");

  return res
    .status(200)
    .json(new ApiResponse(200, populatedVideo, "Video updated successfully"));
});

// ==================== DELETE VIDEO ====================
const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");

  await Video.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// ==================== SET TOP VIDEO ====================
const setTopVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // First, unset all top videos
  await Video.updateMany({}, { isTopVideo: false });

  // Set the target video as top
  const video = await Video.findByIdAndUpdate(
    id,
    { isTopVideo: true },
    { new: true }
  ).populate("category", "name");

  if (!video) throw new ApiError(404, "Video not found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video pinned to top successfully"));
});

export { createVideo, getVideos, getVideoById, updateVideo, deleteVideo, setTopVideo };
