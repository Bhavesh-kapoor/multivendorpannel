import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { mailOptions, transporter} from "../config/nodeMailerConfig.js";

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


export const sendMail = (receiverEmail, subject, htmlContent) => {
    const options = mailOptions(receiverEmail, subject, htmlContent);
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.log("Error while sending email:", error);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
}

export { validObjectId, createAccessOrRefreshToken };import { response } from "express";
