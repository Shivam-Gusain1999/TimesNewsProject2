import mongoose, { Schema } from "mongoose";

const ePaperSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    pages: [
      {
        pageNumber: {
          type: Number,
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Sort pages by pageNumber automatically when retrieving
ePaperSchema.pre("save", function () {
  if (this.pages) {
    this.pages.sort((a, b) => a.pageNumber - b.pageNumber);
  }
});

export const EPaper = mongoose.model("EPaper", ePaperSchema);
