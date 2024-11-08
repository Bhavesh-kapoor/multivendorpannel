import mongoose, { Schema } from "mongoose"

const inventorySchema = new Schema({
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    color: {
        type: String,
        trim: true,
        lowercase: true,
    },
    hexCode: {
        type: String,
        trim: true,
        lowercase: true,
    },
    size: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ["s", "m", "l", "xl", "xxl"],
    },
    sizeValue: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ["unit", "pair", "dozen", "g", "kg", "mg", "ml", "l", "cc", "meter", "inch", "ft"],
    },
    dimensions: {
        length: { type: Number, min: 0 },
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 },
    },
    weight: {
        type: Number,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    sku: {
        type: String,
        unique: true,
        trim: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    available: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    specialOfferTag: {
        type: String,
        trim: true,
    },
    offerExpiry: {
        type: Date,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
})

export const Inventory = mongoose.model("Inventory", inventorySchema)