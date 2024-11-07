import ApiError from "./apiErrors.js";

const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).json(new ApiError(500, null, error.message))
    }
};

export default asyncHandler;
