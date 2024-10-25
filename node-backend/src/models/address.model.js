import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    line1: {
        type: String,
        required: true,
        trim: true,
    },
    street: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    pinCode: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => /^\d{5}(-\d{4})?$/.test(value),
            message: "Please enter a valid ZIP code.",
        },
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    landmark: { type: String },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    }
});

export const Address = mongoose.model('Address', addressSchema)


