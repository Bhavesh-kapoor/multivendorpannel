import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { createAccessOrRefreshToken } from "../../../utils/helpers.js";

import { User } from "../../../models/user.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";

/*-------------------------------------------Login for all users ------------------------------------*/
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res
      .status(409)
      .json(new ApiError(400, "", "Please pass username or email"));
  }

  let existUser = await User.findOne({ email: email });
  if (!existUser)
    return res.status(404).json(new ApiError(404, "", "Email Not Found!"));

  const isPasswordCorrect = await existUser.isPasswordCorrect(password);
  if (!isPasswordCorrect)
    return res.status(401).json(new ApiError(401, "", "Invalid Credentials!"));

  let { accessToken, refreshToken } = await createAccessOrRefreshToken(
    existUser._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  const LoggedInUser = await User.findById(existUser._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: LoggedInUser,
      })
    );
});

const loginHandler = async (req, res) => {
  // const { email, password } = req.body;

  // try {
  //   const [results] = await connection.execute(
  //     "SELECT * FROM users WHERE email = ?",
  //     [email]
  //   );


  //   if (results.length > 0) {
  //     const user = results[0]; // Assuming the user object is returned from DB

  //     // now check password  verification
  //     if (await verifyPassword(password, user.password) == false) {
  //       return res.status(401).json(new ApiError(401, "Invalid password", ['Invalid Password']));

  //     } else {

  //       const options = {
  //         httpOnly: true,
  //         secure: true
  //       }


  //       // Create a JWT token
  //       const token = jwt.sign(
  //         {
  //           id: user.id, // Include user ID or other identifying info in token
  //           email: user.email,
  //           name : user.name,
  //           is_admin: user.type,
  //           // You can include email or any other user details
  //         },
  //         process.env.JWT_SECRET, // The secret key used for signing the token
  //         { expiresIn: "1h" } // Token expiration time (e.g., 1 hour)
  //       );


  //       return res
  //         .status(200)
  //         .cookie("useraccesstoken", token, options)
  //         .json(
  //           new ApiResponse(
  //             200,
  //             { name: user.name, email: user.email, token },
  //             "Login Successful"
  //           )
  //         );
  //     }



  //   } else {
  //     return res.status(401).json(new ApiError(401, "Invalid Credentials", ['Invalid Credentials']));
  //   }
  // } catch (err) {
  //   console.error("Error executing query:", err);
  //   return res
  //     .status(500)
  //     .json(new ApiError(500, "Internal Webserver Error", [], ""));
  // }
};

const getuserinfo = (async (req, res) => {

  return res.status(200).json(new ApiResponse(200, req.user, 'User info'));

});

export { login, loginHandler, getuserinfo };
