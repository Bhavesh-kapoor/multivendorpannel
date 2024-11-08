import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { mailOptions, transporter } from "../config/nodeMailerConfig.js";
import cloudinary from "../config/cloudinaryConfig.js";
import ApiError from "./apiErrors.js";

/*------------------------------------------to check objectId valid--------------------------------------*/
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
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
};

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
  if (!publicId) {
    console.error("Invalid URL or public_id not found.");
    return { success: false, message: "Invalid URL or public_id not found." };
  }
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Image with public_id '${publicId}' deleted successfully.`);
    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("no image on clodinary to deleting image:", error);
  }
}

export {
  isValidObjectId,
  createAccessOrRefreshToken,
  sendMail,
  deleteImageByUrl,
};
