

import { body, validationResult } from "express-validator";
import asyncHandler from "../../../utils/aysncHandler.js";
import ApiError from "../../../utils/apiErrors.js";
import { Blog } from "../../../models/cms/blogs.model.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { isValidObjectId } from "mongoose";
import { validObjectId } from "../../../utils/helpers.js";
const blogValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 255 }).withMessage('Title must be between 5 and 255 characters'),

    body('slug')
        .trim()
        .notEmpty().withMessage('Slug is required')
        .isSlug().withMessage('Slug must be a valid URL-friendly string'),

    body('content')
        .notEmpty().withMessage('Content is required'),


    body('author')
        .notEmpty().withMessage('Author ID is required')
        .isMongoId().withMessage('Author ID must be a valid MongoDB ObjectId'),


    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags.some(tag => typeof tag !== 'string')) {
                throw new Error('Tags must be an array of strings');
            }
            return true;
        }),

    body('featured_image')
        .optional()
        .isURL().withMessage('Featured image must be a valid URL'),

    body('status')
        .optional()
        .isIn(['draft', 'published']).withMessage('Status must be either draft or published'),

    // SEO validation
    body('seo.meta_title')
        .optional()
        .isLength({ max: 255 }).withMessage('Meta title cannot exceed 255 characters'),

    body('seo.meta_description')
        .optional()
        .isLength({ max: 500 }).withMessage('Meta description cannot exceed 500 characters'),

    body('seo.meta_keywords')
        .optional()
        .isArray().withMessage('Meta keywords must be an array'),

    body('seo.canonical_url')
        .optional()
        .isURL().withMessage('Canonical URL must be a valid URL'),

    body('seo.robots')
        .optional()
        .isIn(['index', 'noindex']).withMessage('Robots field must be either index or noindex'),
];



const creatBlog = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));

    } else {
        const { title, content, slug, author, tags, featured_image, status, seo } = req.body;

        const newBlog = await Blog.create({
            title,
            slug,
            content,
            author,
            tags,
            featured_image,
            status,
            seo,
        });
        return res.status(201).json(new ApiResponse(201, newBlog, 'Blog Created Successfully!'));
    }


});


const getAllBlogs = asyncHandler(async (req, res) => {
    const getall = await Blog.find().sort({ _id: -1 });
    return res.status(200).json(new ApiResponse(200, getall, 'Blogs Fetched Successfully!'));

});


const deleteBlogs = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!validObjectId(id)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid Blog ID!'));

    } else {
        const blogDeletion = await Blog.findByIdAndDelete(id);
        return res.status(200).json(new ApiResponse(200, blogDeletion, 'Blog Deleted Successfully!'));
    }
});


const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!validObjectId(id)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid Blog ID!'));

    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));

    } else {
        const { title, content, slug, author, tags, featured_image, status, seo } = req.body;

        const newBlog = await Blog.findByIdAndUpdate(id, {
            title,
            slug,
            content,
            author,
            tags,
            featured_image,
            status,
            seo,
        }, { new: true });
        return res.status(200).json(new ApiResponse(200, newBlog, 'Blog Updated  Successfully!'));
    }


});


export { creatBlog, blogValidator, getAllBlogs, deleteBlogs, updateBlog };
