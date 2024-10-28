import mongoose, { Schema } from "mongoose";

const aboutUsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    mission: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    vision: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    values: [
      {
        type: String,
        trim: true,
        maxlength: 100,
      },
    ],
    team: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          maxlength: 50,
        },
        position: {
          type: String,
          required: true,
          trim: true,
          maxlength: 50,
        },
        bio: {
          type: String,
          trim: true,
          maxlength: 300,
        },
        photoUrl: {
          type: String,
          trim: true,
        },
      },
    ],
    milestones: [
      {
        year: {
          type: Number,
          required: true,
        },
        achievement: {
          type: String,
          required: true,
          trim: true,
          maxlength: 300,
        },
      },
    ],
    contactInfo: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
        maxlength: 200,
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const AboutUs = mongoose.model("AboutUs", aboutUsSchema);