import mongoose from "mongoose";
import { User } from "../models/user.model.js";

/*------------------------------------------to check objectId valid--------------------------------------*/
const validObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) ? true : false;

}
/*------------------------------------------to generate tokens-------------------------------------------*/

const createAccessOrRefreshToken = async (user_id) => {
    const user = await User.findById(user_id);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

export { validObjectId, createAccessOrRefreshToken };