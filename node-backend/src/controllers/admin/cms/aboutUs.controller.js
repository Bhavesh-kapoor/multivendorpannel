import { AboutUs } from "../../../models/cms/aboutUs.model.js";
import asyncHandler from "../../../utils/aysncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import ApiError from "../../../utils/apiErrors.js";
import { check, validationResult } from "express-validator";
import { isValidObjectId } from "../../../utils/helpers.js";

const aboutUsValidationRules = [
    check('title').notEmpty().withMessage('Title is required'),
    check('description').notEmpty().withMessage('description is required'),
    check('mission').notEmpty().withMessage('mission is required'),
];

/*------------------------------------------------ Create About Us Entry ------------------------------------------*/

const createAboutUs = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
    }
    const existingAboutUs = await AboutUs.findOne({ title: req.body.title });
    if (existingAboutUs) {
        return res.status(400).json(new ApiError(400, null, "About Us entry with this title already exists"));
    }
    const aboutUsEntry = new AboutUs(req.body);
    await aboutUsEntry.save();
    return res.status(201).json(new ApiResponse(201, aboutUsEntry, "About Us entry created successfully!"));
});

/*------------------------------------------------ Get About Us by ID ------------------------------------------*/

const getAboutUsById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json(new ApiError(400, null, "Invalid About Us ID"));
    }
    const aboutUsEntry = await AboutUs.findById(id);
    if (!aboutUsEntry) {
        return res.status(404).json(new ApiError(404, null, "About Us entry not found"));
    }
    return res.status(200).json(new ApiResponse(200, aboutUsEntry, "About Us entry fetched successfully!"));
});

/*------------------------------------------------ Get All About Us Entries ------------------------------------------*/

const getAllAboutUsEntries = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, isActive, search } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {};
    if (isActive !== undefined) {
        query.isActive = isActive === "true";
    }
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    try {
        const aboutUsEntries = await AboutUs.find(query).skip(skip).limit(limitNumber);
        const totalCount = await AboutUs.countDocuments(query);

        return res.status(200).json(new ApiResponse(200, {
            result: aboutUsEntries,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCount / limitNumber),
                totalItems: totalCount,
                itemsPerPage: limitNumber,
            },
        }, "About Us entries fetched successfully!"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Something went wrong", [error.message]));
    }
});

/*------------------------------------------------ Update About Us by ID ------------------------------------------*/

const updateAboutUsById = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
    }
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json(new ApiError(400, null, "Invalid About Us ID"));
    }
    const updatedAboutUs = await AboutUs.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAboutUs) {
        return res.status(404).json(new ApiError(404, "About Us entry not found"));
    }
    return res.status(200).json(new ApiResponse(200, updatedAboutUs, "About Us entry updated successfully!"));
});

/*------------------------------------------------ Delete About Us by ID ------------------------------------------*/

const deleteAboutUsById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json(new ApiError(400, null, "Invalid About Us ID"));
    }
    const deletedAboutUs = await AboutUs.findByIdAndDelete(id);
    if (!deletedAboutUs) {
        return res.status(404).json(new ApiError(404, "About Us entry not found"));
    }
    return res.status(200).json(new ApiResponse(200, null, "About Us entry deleted successfully!"));
});

export {
    aboutUsValidationRules,
    createAboutUs,
    getAboutUsById,
    getAllAboutUsEntries,
    updateAboutUsById,
    deleteAboutUsById
};