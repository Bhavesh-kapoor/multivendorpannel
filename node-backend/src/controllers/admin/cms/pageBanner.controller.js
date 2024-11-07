import { PageBanner } from "../../../models/cms/banner.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/apiResponse.js";
import ApiError from "../../../utils/apiErrors.js";
import { check, validationResult } from "express-validator";
import { isValidObjectId } from "../../../utils/helpers.js";
import { json } from "express";

const bannerValidationRules = [
    check('page').notEmpty().withMessage('Product name is required'),
    check('title').notEmpty().withMessage('Brand name is required'),
    check('description').notEmpty().withMessage('Description is required'),
];

/*------------------------------------------------create Banner------------------------------------------*/

const createPageBanner = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
    }
    const existingPageBanner = await PageBanner.findOne({ page: req.body.page })
    if (existingPageBanner) {
        return res.status(400).json(new ApiError(400, null, "Page banner already exists"));
    }
    const pageBanner = new PageBanner(req.body);
    await pageBanner.save();
    return res.status(201).json(new ApiResponse(201, pageBanner, "Page banner created successfully!"));

})

/*------------------------------------------------get Banner by Id------------------------------------------*/

const getPageBannerById = asyncHandler(async (req, res) => {
    const { bannerId } = req.params;
    if (!isValidObjectId(bannerId)) {
        return res.status(400).json(new ApiError(400, null, "Invalid Banner ID"));
    }
    const pageBanner = await PageBanner.findById(bannerId);
    if (!pageBanner) {
        return res.status(404).json(new ApiError(404, null, "Page banner not found"));
    }
    return res.status(200).json(new ApiResponse(200, pageBanner, "Page banner fetched successfully!"));
})

/*------------------------------------------------get all Banners ------------------------------------------*/
const getAllPageBanners = asyncHandler(async (req, res) => {
    const { isActive, page = 1, limit = 10, search } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {};
    if (isActive !== undefined) {
        query.isActive = isActive === 'true';
    }
    if (search) {
        query.page = { $regex: search, $options: 'i' };
    }
    try {
        const pageBanners = await PageBanner.find(query)
            .skip(skip)
            .limit(limitNumber);

        const totalCount = await PageBanner.countDocuments(query);

        return res.status(200).json(new ApiResponse(200, {
            result: pageBanners,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCount / limitNumber),
                totalItems: totalCount,
                itemsPerPage: limitNumber,
            },
        }, "Page banners fetched successfully!"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Something went wrong", [error.message]));
    }
});


/*------------------------------------------------update Banner by Id------------------------------------------*/
const updatePageBanner = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
    }
    const { bannerId } = req.params;
    if (!isValidObjectId(bannerId)) {
        return res.status(400).json(new ApiError(400, null, "Invalid Banner ID"));
    }
    const pageBanner = await PageBanner.findByIdAndUpdate(bannerId, req.body, { new: true });
    if (!pageBanner) {
        return res.status(404).json(new ApiError(404, "Page banner not found"));
    }
    return res.status(200).json(new ApiResponse(200, pageBanner, "Page banner updated successfully!"));
})

/*------------------------------------------------delete Banner by Id------------------------------------------*/

const deletePageBanner = asyncHandler(async (req, res) => {
    const { bannerId } = req.params;
    if (!isValidObjectId(bannerId)) {
        return res.status(400).json(new ApiError(400, null, "Invalid Banner ID"));
    }
    const pageBanner = await PageBanner.findByIdAndDelete(bannerId);
    if (!pageBanner) {
        return res.status(404).json(new ApiError(404, "Page banner not found"));
    }
    return res.status(200).json(new ApiResponse(200, null, "Page banner deleted successfully!"));
})

export { bannerValidationRules, createPageBanner, getPageBannerById, getAllPageBanners, updatePageBanner, deletePageBanner }
