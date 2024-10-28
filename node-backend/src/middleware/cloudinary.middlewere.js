import fs from "fs";
import ApiError from "../utils/apiErrors.js";
import cloudinary from "../config/cloudinaryConfig.js";

/*---------------------------------------------Function to upload a single file--------------------------------*/
const uploadSingleFile = async (file) => {
    try {
        const response = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        fs.unlinkSync(file.path);
        return response.url;
    } catch (error) {
        fs.unlinkSync(file.path);
        throw new ApiError(500, "Single file upload to Cloudinary failed", [error.message]);
    }
};
/*---------------------------------------------Function to upload multiple files (array)--------------------------------*/
const uploadMultipleFiles = async (files) => {
    const uploadPromises = files.map(async (file) => {
        try {
            const response = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
            fs.unlinkSync(file.path);
            return response.url;
        } catch (error) {
            fs.unlinkSync(file.path);
            throw new ApiError(500, "Multiple file upload to Cloudinary failed", [error.message]);
        }
    });
    return Promise.all(uploadPromises);
};
export const uploadToCloudinary = () => async (req, res, next) => {
    if (!req.file && !req.files) return next();

    req.body.cloudinaryUrls = {};
    try {
        if (req.file) {
            req.body.cloudinaryUrls[req.file.fieldname] = await uploadSingleFile(req.file);
            return next(); 
        }

        if (Array.isArray(req.files)) {
            req.body.cloudinaryUrls['files'] = await uploadMultipleFiles(req.files);
            return next();
        }

        // Handle multiple fields with files (req.files is an object)
        if (req.files && typeof req.files === 'object') {
            for (const field in req.files) {
                req.body.cloudinaryUrls[field] = await uploadMultipleFiles(req.files[field]);
            }
            return next(); 
        }
        next();
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        } else if (Array.isArray(req.files)) {
            req.files.forEach((file) => fs.unlinkSync(file.path));
        } else if (req.files && typeof req.files === 'object') {
            for (const field in req.files) {
                req.files[field].forEach((file) => fs.unlinkSync(file.path));
            }
        }
        next(error);
    }
};
