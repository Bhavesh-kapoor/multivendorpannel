import mongoose, { Schema } from "mongoose";

const pageBannerSchema = new Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ["home", "about", "contact", "products", "services"],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: {
          type: String,
          trim: true,
          maxlength: 100,
        },
      },
    ],
    callToAction: {
      label: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      link: {
        type: String,
        trim: true,
      },
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

export const PageBanner = mongoose.model("PageBanner", pageBannerSchema);


