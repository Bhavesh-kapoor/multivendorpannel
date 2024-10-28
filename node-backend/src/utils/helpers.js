import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { mailOptions, transporter } from "../config/nodeMailerConfig.js";
import cloudinary from "../config/cloudinaryConfig.js";
import ApiError from "./apiErrors.js";

/*------------------------------------------to check objectId valid--------------------------------------*/
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
}
/*------------------------------------------to generate tokens-------------------------------------------*/

const createAccessOrRefreshToken = async (user_id) => {
    const user = await User.findById(user_id);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};
/*------------------------------------------to send mail-------------------------------------------*/

const sendMail = (receiverEmail, subject, htmlContent) => {
    const options = mailOptions(receiverEmail, subject, htmlContent);
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.log("Error while sending email:", error);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
}

/*------------------------------------------to delete image from cloudinary -------------------------------------------*/

// Function to extract public_id from the Cloudinary URL
function extractPublicIdFromUrl(url) {
    const regex = /\/upload\/v\d+\/([^\.]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Function to delete an image by URL
async function deleteImageByUrl(imageUrl) {
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
            // console.log(`Image with public_id '${publicId}' deleted successfully.`);
        } catch (error) {
            console.error("Error deleting image:", error);
            return res.status(500).json(new ApiError(500, null, error.message));
        }
    } else {
        console.error("Invalid URL or public_id not found.");
        return res.status(500).json(new ApiError(500, null, "Invalid URL"));
    }
}

export { isValidObjectId, createAccessOrRefreshToken, sendMail, deleteImageByUrl };
