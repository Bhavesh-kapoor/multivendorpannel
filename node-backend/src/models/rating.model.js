import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "User",  // Reference the Product model here
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,  // You might want to set min/max limits for the rating
        max: 5
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    },
    isPublish: {
        type: Number,
        enum: [0, 1], // 0 means not publish and 1 is published 
        default: 0,

    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

export const Rating = mongoose.model("Rating", ratingSchema);
