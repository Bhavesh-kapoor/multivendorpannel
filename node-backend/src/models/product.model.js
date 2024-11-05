import mongoose from "mongoose";
import {
  ClothingSchema,
  ClothingType,
  Size,
  Gender,
} from "./category/Clothing.model.js";
import {
  CosmeticProductSchema,
  CosmeticCategory,
  SkinType,
} from "./category/Cosmetic.model.js";
import {
  ElectronicItem,
  ElectronicCategory,
  WarrantyType,
  ElectronicItemSchema,
} from "./category/Electronic.model.js";
import {
  FoodItem,
  FoodCategory,
  DietaryRestriction,
  FoodItemSchema,
} from "./category/Food.model.js";

// Enum for general product categories
const ProductCategory = {
  Clothing: "Clothing",
  Cosmetic: "Cosmetic",
  Electronic: "Electronic",
  Food: "Food",
};

// Base Product schema with common fields
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
    },
    images: {
      type: [String],
      required: false, // Optional: set to true if you want to make it mandatory
    },
    // Reference to the specific product type schema based on category
    details: mongoose.Schema.Types.Mixed,
    additionalFeatures: {
      type: Object,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "category",
  }
);

// Base Product model
const Product = mongoose.model("Product", ProductSchema);

// Create discriminators for each product category

const ClothingProduct = Product.discriminator(Product.Clothing, ClothingSchema);

const CosmeticProduct = Product.discriminator(
  ProductCategory.Cosmetic,
  new mongoose.Schema({
    details: CosmeticProductSchema,
  })
);

const ElectronicProduct = Product.discriminator(
  ProductCategory.Electronic,
  new mongoose.Schema({
    details: ElectronicItemSchema,
  })
);

const FoodProduct = Product.discriminator(
  ProductCategory.Food,
  new mongoose.Schema({
    details: FoodItemSchema,
  })
);

// Exporting the main Product model and category-specific models
export {
  Product,
  ProductCategory,
  ClothingProduct,
  CosmeticProduct,
  ElectronicProduct,
  FoodProduct,
};
