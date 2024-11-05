import mongoose from "mongoose";

// Enum for cosmetic categories
const CosmeticCategory = {
  Skincare: "Skincare",
  Makeup: "Makeup",
  Haircare: "Haircare",
  Fragrance: "Fragrance",
  BodyCare: "Body Care",
};

// Enum for skin types
const SkinType = {
  Oily: "Oily",
  Dry: "Dry",
  Combination: "Combination",
  Sensitive: "Sensitive",
};

// Ingredient schema
const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String, required: true },
});

// Usage instructions schema
const UsageInstructionsSchema = new mongoose.Schema({
  steps: { type: [String], required: true }, // Array of steps
});

// Packaging information schema
const PackagingInfoSchema = new mongoose.Schema({
  weight: { type: Number, required: true }, // weight in grams
  material: { type: String, required: true }, // e.g., glass, plastic, metal
});

// Cosmetic product schema
const CosmeticProductSchema = new mongoose.Schema(
  {
    // name: { type: String, required: true },
    // description: { type: String, required: true },
    // brand: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(CosmeticCategory),
      required: true,
    },
    skinTypes: { type: [String], enum: Object.values(SkinType) },
    ingredients: [IngredientSchema],
    usageInstructions: UsageInstructionsSchema,
    // price: { type: Number, required: true, min: 0 },
    // stock: { type: Number, required: true, min: 0 },
    // expirationDate: { type: Date, required: true },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create CosmeticProduct model
const CosmeticProduct = mongoose.model(
  "CosmeticProduct",
  CosmeticProductSchema
);

// Exporting using ES6 syntax
export {
  CosmeticProduct,
  CosmeticCategory,
  SkinType,
  PackagingInfoSchema,
  CosmeticProductSchema,
};
