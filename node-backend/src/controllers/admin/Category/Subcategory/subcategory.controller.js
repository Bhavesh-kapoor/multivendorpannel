
import { validationResult, check } from "express-validator";
import ApiError from "../../../../utils/apiErrors.js";
import ApiResponse from "../../../../utils/apiResponse.js";
import Subcategory from "../../../../models/subcategories.model.js";
import asyncHandler from "../../../../models/asyncHandler.js";
import { isValidObjectId } from "../../../../utils/helpers.js";


// Validation rules
const validateSubCategory = [
    check('categoryId').notEmpty().withMessage('Please select Category First'),
    check('name')
        .notEmpty().withMessage('Sub Category name is required')
        .isLength({ min: 2 }).withMessage(' Sub Category name must be at least 2 characters long'),
    check('isActive').notEmpty().withMessage('Sub Category  activate or deactivation is required')
];

const index = async (req, res) => {
    // const getAllSubCategories = await Subcategory.find().sort({ _id: 1 });
    const getAllSubCategories = await Subcategory.aggregate(
        [
            {
                $lookup: {
                    'from': "categories",
                    'localField': 'categoryId',
                    'foreignField': '_id',
                    'as': "category"

                },
            },
            {
                $unwind: '$category',
            },
            {
                $project: {
                    '_id': 1,
                    'name': 1,
                    'isActive': 1,
                    'createdAt': 1,
                    'category._id': 1,
                    'category.name': 1
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }

        ]
    )

    return res.status(200).json(new ApiResponse(200, getAllSubCategories, 'Sub Category Fetched Successfully!'));

};

const getSubCategoryByCategory = async (req, res) => {
    // const getAllSubCategories = await Subcategory.find().sort({ _id: 1 });
    const { categoryId } = req.params;
    if (!isValidObjectId(categoryId)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid Category ID!'));
    }
    const getAllSubCategories = await Subcategory.find({ categoryId }).sort({ _id: 1 });
    return res.status(200).json(new ApiResponse(200, getAllSubCategories, 'Sub Category Fetched Successfully!'));


};



const store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors));
    }

    else {
        let { name, isActive, categoryId } = req.body;
        try {
            name = name.toLowerCase().trim();
            const existingCategory = await Subcategory.findOne({ name });
            if (existingCategory) {
                return res.status(409).json(new ApiError(409, '', "Sub Category already exist!"));
            } else {
                const subcategoryInfo = await Subcategory.create({ name, categoryId, isActive });
                res
                    .status(201)
                    .json(
                        new ApiResponse(
                            201,
                            subcategoryInfo,
                            " Sub Category has been created successfully!"
                        )
                    );
            }


        }
        catch (err) {
            res.status(500).json(new ApiError(500, "", "Server error while creating category"));
        }
    }



}
const update = async (req, res) => {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid Subcategory ID!'));
    }
    try {
        const Subcateg = await Subcategory.findByIdAndUpdate(
            _id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!Subcateg) {
            return res
                .status(404)
                .json(new ApiError(404, "", "Error while updating the Sub category"));
        }
        res
            .status(200)
            .json(new ApiResponse(200, Subcateg, "Sub Category updated successfully!"));
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json(new ApiError(500, error.message, "Server error while updating  Sub category"));
    }
};



const SubcategoryById = async (req, res) => {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid  Sub Category ID!'));

    }
    let subCategoryFind = await Subcategory.findById(_id);
    if (!subCategoryFind) res.status(404).json(new ApiError(404, '', 'Sub Category Not Found!'));
    return res.status(200).json(new ApiResponse(200, subCategoryFind, 'Sub Category Fetched Successfully!'));

};

const deleteSubCategoryById = async (req, res) => {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid  Sub Category ID!'));
    }
    let subCategoryFind = await Subcategory.findByIdAndDelete(_id);
    if (!subCategoryFind) res.status(404).json(new ApiError(404, '', 'Sub Category Not Found!'));
    return res.status(200).json(new ApiResponse(200, subCategoryFind, ' Sub Category Deleted Successfully!'));

}

export { index, store, update, validateSubCategory, SubcategoryById, deleteSubCategoryById, getSubCategoryByCategory };
