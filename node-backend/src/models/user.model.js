import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// AllowedTabs Schema (for Role-Based Access Control on Tabs)
const allowedTabs = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    crudRoles: {
        type: [String],
        enum: ["Read", "Create", "Edit", "Delete"],
        default: ["Read"],
    }
}, { _id: false });

// ShopDetails Schema
const shopDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    gst: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
            },
            message: props => `${props.value} is not a valid GST number!`
        }
    },
    shopType: {
        type: String,
        enum: ['Retail', 'Wholesale', 'Online', 'Franchise'],
        required: true
    },
}, { _id: false });

// User Schema
const userSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        mobile: { type: String, trim: true },
        password: { type: String },
        googleId: { type: String, unique: true, sparse: true },
        isActive: { type: Boolean, default: true },
        profileImage: { type: String, default: "" },
        isEmailVerified: { type: Boolean, default: false },
        isMobileVerified: { type: Boolean, default: false },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
        },
        gender: {
            type: String,
            trim: true,
            enum: ["male", "female", "non-binary", "other"],
        },
        dateOfBirth: {
            type: Date,
            validate: {
                validator: (value) => value < new Date(),
                message: "Date of birth must be in the past.",
            },
        },
        role: {
            type: String,
            enum: ["admin", "sub-admin", "vendor", "user"],
            default: "user",
        },
        refreshToken: {
            type: String,
        },
        shopdetails: {
            type: shopDetailsSchema,
            validate: {
                validator: function (v) {
                    return this.role !== "vendor" || (v && Object.keys(v).length > 0);
                },
                message: "Shop details are required if the role is vendor."
            }
        },
        allowedTabs: [allowedTabs]
    },
    { timestamps: true }
);

// Hashing the Password Before Saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    if (!this.password) {
        const existingUser = await User.findById(this._id).select('password');
        if (existingUser) {
            this.password = existingUser.password;
        }
    } else {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Custom Instance Methods
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: this.role,
            email: this.email,
            lastName: this.lastName,
            firstName: this.firstName,
        },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: this.role,
        },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model("User", userSchema);
