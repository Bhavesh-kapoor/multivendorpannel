import mongoose from "mongoose";

const validObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) ? true : false;
}

export { validObjectId };