import mongoose from "mongoose";

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

export { isValidObjectId }
