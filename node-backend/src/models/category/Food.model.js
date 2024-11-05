import mongoose from "mongoose";

// Enum for food categories
const FoodCategory = {
  Snack: "Snack",
  Beverage: "Beverage",
  Condiment: "Condiment",
  Frozen: "Frozen",
  DryGoods: "Dry Goods",
  Canned: "Canned",
  Fresh: "Fresh",
};

// Enum for dietary restrictions
const DietaryRestriction = {
  GlutenFree: "Gluten Free",
  Vegan: "Vegan",
  Vegetarian: "Vegetarian",
  NutFree: "Nut Free",
};

// Nutritional information schema
const NutritionalInfoSchema = new mongoose.Schema({
  servingSize: { type: String, required: true },
  calories: { type: Number, required: true },
  totalFat: { type: Number, required: true },
  saturatedFat: { type: Number, required: true },
  cholesterol: { type: Number, required: true },
  sodium: { type: Number, required: true },
  totalCarbohydrates: { type: Number, required: true },
  dietaryFiber: { type: Number, required: true },
  sugars: { type: Number, required: true },
  protein: { type: Number, required: true },
});

// Packaging information schema
const PackagingInfoSchema = new mongoose.Schema({
  weight: { type: Number, required: true }, // weight in grams
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  material: { type: String, required: true }, // e.g., plastic, glass, cardboard
});

// Food item schema
const FoodItemSchema = new mongoose.Schema(
  {
    // name: { type: String, required: true },
    // description: { type: String, required: true },
    // brand: { type: String, required: true },
    category: {
      type: String,
     enum: Object.values(FoodCategory),
      required: true,
    },
    dietaryRestrictions: {
      type: [String],
      enum: Object.values(DietaryRestriction),
    },
    nutritionalInfo: NutritionalInfoSchema,
    packagingInfo: PackagingInfoSchema,
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

// Create FoodItem model
const FoodItem = mongoose.model("FoodItem", FoodItemSchema);

// Exporting using ES6 syntax
export { FoodItem, FoodCategory, DietaryRestriction, FoodItemSchema };
