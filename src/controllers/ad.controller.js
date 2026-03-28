import { Ad } from "../models/ad.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createAd = asyncHandler(async (req, res) => {
  const { title, link, isActive, type, scriptCode, placement } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const adType = type || 'banner';
  let finalImageUrl = null;

  if (adType === 'banner') {
    if (!link) throw new ApiError(400, "Link is required for banner ads");
    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
      throw new ApiError(400, "Ad image is required for banner ads");
    }
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedImage) throw new ApiError(400, "Image upload failed");
    finalImageUrl = uploadedImage.url;
  }

  const ad = await Ad.create({
    title,
    type: adType,
    placement: placement || 'both',
    scriptCode: adType === 'script' ? scriptCode : undefined,
    link: adType === 'banner' ? link : undefined,
    imageUrl: finalImageUrl,
    isActive: isActive !== undefined ? isActive : true,
  });

  return res.status(201).json(new ApiResponse(201, ad, "Ad created successfully"));
});

// ==================== GET ALL ADS ====================
const getAds = asyncHandler(async (req, res) => {
  const { activeOnly, placement } = req.query;
  const matchCondition = {};
  
  if (activeOnly === "true") {
    matchCondition.isActive = true;
  }
  
  if (placement) {
    matchCondition.$or = [{ placement }, { placement: 'both' }];
  }

  const ads = await Ad.find(matchCondition).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, { ads }, "Ads fetched successfully")
  );
});

// ==================== GET AD BY ID ====================
const getAdById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ad ID");
  }

  const ad = await Ad.findById(id);
  if (!ad) throw new ApiError(404, "Ad not found");

  return res.status(200).json(new ApiResponse(200, ad, "Ad fetched successfully"));
});

const updateAd = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, link, isActive, type, scriptCode, placement } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ad ID");
  }

  const ad = await Ad.findById(id);
  if (!ad) throw new ApiError(404, "Ad not found");

  if (title) ad.title = title;
  if (isActive !== undefined) ad.isActive = isActive;
  if (type) ad.type = type;
  if (placement) ad.placement = placement;

  if (ad.type === 'script') {
    if (scriptCode !== undefined) ad.scriptCode = scriptCode;
    // Clear out banner fields if switching to script
    ad.link = undefined;
    ad.imageUrl = undefined;
  } else {
    if (link) ad.link = link;
    ad.scriptCode = undefined;
    
    const imageLocalPath = req.file?.path;
    if (imageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(imageLocalPath);
      if (uploadedImage) ad.imageUrl = uploadedImage.url;
    }
  }

  await ad.save();

  return res.status(200).json(new ApiResponse(200, ad, "Ad updated successfully"));
});

// ==================== DELETE AD ====================
const deleteAd = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ad ID");
  }

  const ad = await Ad.findById(id);
  if (!ad) throw new ApiError(404, "Ad not found");

  await Ad.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, {}, "Ad deleted successfully"));
});

export { createAd, getAds, getAdById, updateAd, deleteAd };
