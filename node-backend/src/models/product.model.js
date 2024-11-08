import mongoose, { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  brandName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategoryId: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
    default: null,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  isPublished: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  specifications: {
    type: Map,
    of: String,
  },
  returnable: {
    type: Boolean,
    default: true,
  },
  returnDays: {
    type: Number,
    default: 10,
    min: 0,
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

export const Product = mongoose.model("Product", productSchema);
