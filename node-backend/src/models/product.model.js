import mongoose, { Schema } from "mongoose";

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
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
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
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
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
        type: Object,
        of: String,
        default: {},
    },
}, {
    timestamps: true,
});

export const Product = mongoose.model("Product", productSchema);

