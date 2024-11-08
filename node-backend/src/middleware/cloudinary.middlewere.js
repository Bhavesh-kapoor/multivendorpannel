import fs from "fs";
import ApiError from "../utils/apiErrors.js";
import cloudinary from "../config/cloudinaryConfig.js";

/*---------------------------------------------Helper Function to Upload a Single File--------------------------------*/
const uploadSingleFile = async (file) => {
  try {
    const response = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });
    fs.unlinkSync(file.path); // Delete local file after upload
    return response.url;
  } catch (error) {
    fs.unlinkSync(file.path); // Delete local file if upload fails
    throw new ApiError(500, null, "Single file upload to Cloudinary failed", [
      error.message,
    ]);
  }
};

/*---------------------------------------------Helper Function to Upload Multiple Files--------------------------------*/
const uploadMultipleFiles = async (files) => {
  return Promise.all(
    files.map(async (file) => {
      try {
        const response = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });
        fs.unlinkSync(file.path); // Delete local file after upload
        return response.url;
      } catch (error) {
        fs.unlinkSync(file.path); // Delete local file if upload fails
        throw new ApiError(
          500,
          null,
          "Multiple file upload to Cloudinary failed",
          [error.message]
        );
      }
    })
  );
};

/*---------------------------------------------Middleware for Uploading Files--------------------------------*/
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file && !req.files) return next();

  req.body.cloudinaryUrls = {}; // Initialize the cloudinaryUrls object in req.body

  try {
    if (req.file) {
      req.body.cloudinaryUrls[req.file.fieldname] = await uploadSingleFile(
        req.file
      );
    } else if (Array.isArray(req.files)) {
      req.body.cloudinaryUrls["files"] = await uploadMultipleFiles(req.files);
    } else if (req.files && typeof req.files === "object") {
      for (const field in req.files) {
        req.body.cloudinaryUrls[field] = await uploadMultipleFiles(
          req.files[field]
        );
      }
    }
    next();
  } catch (error) {
    // Handle error and cleanup files if an error occurs
    cleanUpFiles(req);
    next(error);
  }
};

/*---------------------------------------------Helper Function for Cleaning Up Files--------------------------------*/
const cleanUpFiles = (req) => {
  if (req.file) {
    fs.unlinkSync(req.file.path);
  } else if (Array.isArray(req.files)) {
    req.files.forEach((file) => fs.unlinkSync(file.path));
  } else if (req.files && typeof req.files === "object") {
    for (const field in req.files) {
      req.files[field].forEach((file) => fs.unlinkSync(file.path));
    }
  }
};

export default uploadToCloudinary;
