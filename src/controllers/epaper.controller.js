import { EPaper } from "../models/epaper.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// ==================== UPLOAD E-PAPER ====================
const uploadEPaper = asyncHandler(async (req, res) => {
  const { title, date } = req.body;
  const files = req.files;

  if (!title || !date) {
    if (files) files.forEach(file => fs.unlinkSync(file.path));
    throw new ApiError(400, "Title and Date are required");
  }

  // Normalize date to UTC Midnight format for consistent unique check
  const dateObj = new Date(date);
  const normalizedDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));

  // Check unique date
  const existingEdition = await EPaper.findOne({ date: normalizedDate });
  if (existingEdition) {
    if (files) files.forEach(file => fs.unlinkSync(file.path));
    throw new ApiError(400, `An E-Paper edition already exists for ${date}`);
  }

  if (!files || files.length === 0) {
    throw new ApiError(400, "At least one page image is required");
  }

  const uploadedPages = [];

  try {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`[EPAPER] Uploading ${i+1}/${files.length}: ${file.originalname}`);
        const result = await uploadOnCloudinary(file.path);
        if (result) {
          uploadedPages.push({
            pageNumber: i + 1,
            imageUrl: result.url,
          });
        }
    }

    if (uploadedPages.length === 0) {
      throw new ApiError(500, "Failed to upload any pages to Cloudinary");
    }

    const epaper = await EPaper.create({
      title,
      date: normalizedDate,
      pages: uploadedPages,
    });

    console.log(`[EPAPER] SUCCESS! Created ID: ${epaper._id}`);

    return res
      .status(201)
      .json(new ApiResponse(201, epaper, "E-Paper uploaded successfully"));

  } catch (error) {
    console.error("[EPAPER] CRITICAL SAVE ERROR:", error);
    // Cleanup remaining local files
    if (files) {
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                try { fs.unlinkSync(file.path); } catch(e) {}
            }
        });
    }
    // Re-throw to let asyncHandler/Global Handler catch it with appropriate status
    // OR return custom error JSON if preferred
    throw error;
  }
});

// ==================== GET ALL E-PAPERS (Metadata Only) ====================
const getAllEPapers = asyncHandler(async (req, res) => {
  const epapers = await EPaper.find({})
    .select("-pages") // Initially fetch only metadata
    .sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, epapers, "E-Paper editions fetched successfully"));
});

// ==================== GET E-PAPER BY DATE ====================
const getEPaperByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const dateObj = new Date(date);
  const targetDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  
  const epaper = await EPaper.findOne({ date: targetDate });

  if (!epaper) {
    throw new ApiError(404, "E-Paper edition not found for this date");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, epaper, "E-Paper edition fetched successfully"));
});

// ==================== DELETE E-PAPER ====================
const deleteEPaper = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const epaper = await EPaper.findByIdAndDelete(id);

  if (!epaper) {
    throw new ApiError(404, "E-Paper edition not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "E-Paper deleted successfully"));
});

export {
  uploadEPaper,
  getAllEPapers,
  getEPaperByDate,
  deleteEPaper,
};
