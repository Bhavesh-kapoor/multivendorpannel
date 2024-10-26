
import { validationResult, check } from "express-validator";
import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";
import Category from "../../../models/category.model.js";
import mongoose from "mongoose";
import { isValidObjectId } from "../../../utils/helpers.js";


// Validation rules
const validateCategory = [
    check('name')
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters long'),
    check('isActive').notEmpty().withMessage('Category  activate or deactivation is required')

    // You can add more validation rules as needed
];

const index = async (req, res) => {
    const getAllCategory = await Category.find().sort({ _id: 1 });
    return res.status(200).json(new ApiResponse(200, getAllCategory, 'Category Fetched Successfully!'));


};



const store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors));
    }
    let { name, isActive } = req.body;
    // now check  if the category already exist or not
    try {
        name = name.toLowerCase().trim();
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).json(new ApiError(409, '', "Category already exist!"));
        } else {
            const categoryCreate = await Category.create({ name, isActive });
            res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        categoryCreate,
                        " Category has been created successfully!"
                    )
                );
        }


    }
    catch (err) {
        res.status(500).json(new ApiError(500, "", "Server error while creating category"));
    }


}
const update = async (req, res) => {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid Category ID!'));
    }
    try {
        const category = await Category.findByIdAndUpdate(
            _id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res
                .status(404)
                .json(new ApiError(404, "", "Error while updating the category"));
        }
        res
            .status(200)
            .json(new ApiResponse(200, category, "Category updated successfully!"));
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json(new ApiError(500, error.message, "Server error while updating category"));
    }
};

const categoryById = async (req, res) => {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid Category ID!'));

    }
    let findCategory = await Category.findById(_id);
    if (!findCategory) res.status(404).json(new ApiError(404, '', 'Category Not Found!'));
    return res.status(200).json(new ApiResponse(200, findCategory, 'Category Fetched Successfully!'));

};

const deleteCategoryById = async (req, res) => {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid Category ID!'));
    }
    let findCategory = await Category.findByIdAndDelete(_id);
    if (!findCategory) res.status(404).json(new ApiError(404, '', 'Category Not Found!'));
    return res.status(200).json(new ApiResponse(200, findCategory, 'Category Deleted Successfully!'));

}
export { index, store, validateCategory, update, categoryById, deleteCategoryById };
