import mongoose, { Schema } from "mongoose";

const adSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['banner', 'script'],
      default: 'banner',
    },
    placement: {
      type: String,
      enum: ['sidebar', 'feed', 'both'],
      default: 'both',
    },
    imageUrl: {
      type: String, // Optional for scripts
    },
    link: {
      type: String, // Optional for scripts
    },
    scriptCode: {
      type: String, // Only used when type is 'script'
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Ad = mongoose.model("Ad", adSchema);
