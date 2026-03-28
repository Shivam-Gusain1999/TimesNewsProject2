import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Times News",
      required: true,
    },
    contactEmail: {
      type: String,
      default: "admin@timesnews.com",
      required: true,
    },
    seoDescription: {
      type: String,
      default: "The latest news and updates.",
    },
    facebookUrl: {
      type: String,
      default: "https://facebook.com",
    },
    twitterUrl: {
      type: String,
      default: "https://twitter.com",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
