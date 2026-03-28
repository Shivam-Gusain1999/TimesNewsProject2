import { Settings } from "../models/settings.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    // If no settings exist yet, create default settings
    settings = await Settings.create({});
  }
  return res
    .status(200)
    .json(new ApiResponse(200, settings, "Settings fetched successfully"));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const {
    siteName,
    contactEmail,
    seoDescription,
    facebookUrl,
    twitterUrl,
    maintenanceMode,
  } = req.body;

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      siteName,
      contactEmail,
      seoDescription,
      facebookUrl,
      twitterUrl,
      maintenanceMode,
    });
  } else {
    settings.siteName = siteName !== undefined ? siteName : settings.siteName;
    settings.contactEmail = contactEmail !== undefined ? contactEmail : settings.contactEmail;
    settings.seoDescription = seoDescription !== undefined ? seoDescription : settings.seoDescription;
    settings.facebookUrl = facebookUrl !== undefined ? facebookUrl : settings.facebookUrl;
    settings.twitterUrl = twitterUrl !== undefined ? twitterUrl : settings.twitterUrl;
    settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode;

    await settings.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, settings, "Settings updated successfully"));
});
