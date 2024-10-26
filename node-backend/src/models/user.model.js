import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        mobile: { type: String },
        password: { type: String },
        googleId: { type: String },
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
        shopName: {
            type: String,
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    if (!this.password || this.password === "") {
        const existingUser = await User.findById(this._id).select('password');
        if (existingUser) {
            this.password = existingUser.password;
        }
    } else {
        // Hash the password if it's not empty
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

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

