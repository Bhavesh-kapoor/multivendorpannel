import { check, validationResult } from "express-validator";
import asyncHandler from "../../../../utils/aysncHandler.js";
import ApiResponse from "../../../../utils/apiResponse.js";
import { Rating } from "../../../../models/rating.model.js";
import { isValidObjectId } from "../../../../utils/helpers.js";
import ApiError from "../../../../utils/apiErrors.js";



const validateRatings = [
    check('productId').notEmpty().withMessage('Product is required!'),
    check('userId').notEmpty().withMessage('User  is required!'),
    check('rating').notEmpty().withMessage('Rating is required!'),
    check('comment').notEmpty().withMessage('Your comment  is required!'),

];

const publishValidations = [
    check('isPublish').notEmpty().isIn([0, 1])
        .withMessage('isPublish must be either 0 or 1'),
    check('rating_id').notEmpty().withMessage('Rating id is required!')
]

const store = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(401).json(new ApiError(401, "Validation Error", errors));
    } else {
        const { userId, productId, rating, comment } = req.body;

        // check for  valid user and product id 
        if (!isValidObjectId(userId)) {
            return res.status(400).json(new ApiError(400, '', 'Invalid User ID!'));
        }
        if (!isValidObjectId(productId)) {
            return res.status(400).json(new ApiError(400, '', 'Invalid Product ID!'));
        }
        const saveRating = await Rating.create({ userId, productId, rating, comment });
        return res.status(201).json(new ApiResponse(201, 'Rating added successfully!', saveRating));

    }

});



const all = asyncHandler(async (req, res) => {


    let { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    if (limit <= 0) {
        limit = 10;
    }
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;







    const getRatings = await Rating.aggregate([
        {
            $lookup: {
                'from': "users",
                'localField': 'userId',
                'foreignField': '_id',
                'as': "user"

            },
        },
        {
            $unwind: '$user',
        },
        {
            $project: {
                '_id': 1,
                'rating': 1,
                'comment': 1,
                'isPublish': 1,
                'fullName': { $concat: ['$user.firstName', ' ', '$user.lastName'] },


            }
        },
        {
            $addFields: {
                productName: {
                    $literal: ''
                }
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limitNumber
        },
        {
            $sort: {
                _id: 1
            }
        }

    ]);
    const totalRatings = await Rating.countDocuments();

    return res.status(200).json(new ApiResponse(200, {
        result: getRatings,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(totalRatings / limitNumber),
            totalItems: totalRatings,
            itemsPerPage: limitNumber
        }
    }, 'Rating Fetched successfully!'));


});


const publish = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(401).json(new ApiError(401, "Validation Error", errors));
    } else {
        const { rating_id, isPublish } = req.body;

        if (!isValidObjectId(rating_id)) {
            return res.status(400).json(new ApiError(400, '', 'Invalid Rating ID!'));
        }

        const getRatings = await Rating.findByIdAndUpdate(rating_id, { $set: { isPublish: isPublish } }, { new: true, runValidators: true });
        return res.status(200).json(new ApiResponse(200, 'Rating Updated successfully!', getRatings));

    }

});



const deleteRating = asyncHandler(async (req, res) => {

    console.log(req.params);

    const { _id } = req.params;
    console.log(_id);

    if (!isValidObjectId(_id)) {
        return res.status(400).json(new ApiError(400, '', 'Invalid Rating ID!'));
    }

    const getRatings = await Rating.findByIdAndDelete(_id);
    return res.status(200).json(new ApiResponse(200, 'Rating Deleted successfully!', getRatings));



});

export { store, validateRatings, all, publishValidations, publish, deleteRating }


