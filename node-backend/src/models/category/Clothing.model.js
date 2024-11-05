import mongoose from "mongoose";

// Enum for clothing types
const ClothingType = {
  Top: "Top",
  Bottom: "Bottom",
  Outerwear: "Outerwear",
  Footwear: "Footwear",
  Accessories: "Accessories",
  Underwear: "Underwear",
};

// Enum for sizes
const Size = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
  FreeSize: "Free Size",
};

// Enum for gender
const Gender = {
  Male: "Male",
  Female: "Female",
  Unisex: "Unisex",
};

// Color schema
const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: {
    type: String,
    required: true,
    match: /^#([0-9A-F]{3}){1,2}$/i, // Validates hex color format
  },
});

// Material schema
const MaterialSchema = new mongoose.Schema({
  type: { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
});

// Care instructions schema
const CareInstructionsSchema = new mongoose.Schema({
  wash: { type: String, required: true },
  dry: { type: String, required: true },
  iron: { type: String, required: true },
});

// Clothing item schema
const ClothingSchema = new mongoose.Schema(
  {
    // name: { type: String, required: true },
    // description: { type: String, required: true },
    // brand: { type: String, required: true },
    type: { type: String, enum: Object.values(ClothingType), required: true },
    sizes: { type: [String], enum: Object.values(Size), required: true },
    colors: [ColorSchema],
    materials: [MaterialSchema],
    careInstructions: CareInstructionsSchema,
    // price: { type: Number, required: true, min: 0 },
    // stock: { type: Number, required: true, min: 0 },
    // discount: { type: Number, min: 0, max: 100, default: 0 },
    gender: { type: String, enum: Object.values(Gender), required: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to check material percentages
ClothingSchema.pre("save", function (next) {
  const materials = this.materials;
  const totalPercentage = materials.reduce(
    (sum, material) => sum + material.percentage,
    0
  );

  if (totalPercentage > 100) {
    next(new Error("Total material percentage cannot exceed 100%"));
  } else {
    next();
  }
});

// Create Clothing model
const Clothing = mongoose.model("Clothing", ClothingSchema);

// Exporting using ES6 syntax
export { ClothingType, Size, Gender, ClothingSchema };
