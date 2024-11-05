import mongoose from "mongoose";

// Enum for electronic categories
const ElectronicCategory = {
  Mobile: "Mobile",
  Laptop: "Laptop",
  Tablet: "Tablet",
  Television: "Television",
  Accessory: "Accessory",
};

// Enum for warranty types
const WarrantyType = {
  Manufacturer: "Manufacturer",
  Extended: "Extended",
};

// Specification schema
const SpecificationSchema = new mongoose.Schema({
  feature: { type: String, required: true },
  value: { type: String, required: true },
});

// Warranty information schema
const WarrantySchema = new mongoose.Schema({
  type: { type: String, enum: Object.values(WarrantyType), required: true },
  duration: { type: Number, required: true }, // duration in months
});

// Electronic item schema
const ElectronicItemSchema = new mongoose.Schema(
  {
    // name: { type: String, required: true },
    // description: { type: String, required: true },
    // brand: { type: String, required: true },
    // model: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(ElectronicCategory),
      required: true,
    },
    // specifications: [SpecificationSchema],
    specifications: [
      {
        feature: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    // price: { type: Number, required: true, min: 0 },
    // stock: { type: Number, required: true, min: 0 },
    warranty: {
      type: { type: String, enum: Object.values(WarrantyType), required: true },
      duration: { type: Number, required: true }, // duration in months
    },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create ElectronicItem model
const ElectronicItem = mongoose.model("ElectronicItem", ElectronicItemSchema);

// Exporting using ES6 syntax
export {
  ElectronicItem,
  ElectronicCategory,
  WarrantyType,
  ElectronicItemSchema,
};
