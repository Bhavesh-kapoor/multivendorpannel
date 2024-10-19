import { connectToDatabase, connection } from "../../../db/connection.js";
import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
const login = (req, res) => {
  const token = req.cookies?.useraccesstoken || req.header('Authorization')?.replace('Bearer ', '');

  if (token) {

    return res.redirect('/admin/dashboard');
  }
  res.render("login", { layout: "login" });
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );


    if (results.length > 0) {
      const user = results[0]; // Assuming the user object is returned from DB

      // now check password  verification
      if (await verifyPassword(password, user.password) == false) {
        return res.status(401).json(new ApiError(401, "Invalid password", ['Invalid Password']));

      } else {

        const options = {
          httpOnly: true,
          secure: true
        }


        // Create a JWT token
        const token = jwt.sign(
          {
            id: user.id, // Include user ID or other identifying info in token
            email: user.email,
            name : user.name,
            is_admin: user.type,
            // You can include email or any other user details
          },
          process.env.JWT_SECRET, // The secret key used for signing the token
          { expiresIn: "1h" } // Token expiration time (e.g., 1 hour)
        );


        return res
          .status(200)
          .cookie("useraccesstoken", token, options)
          .json(
            new ApiResponse(
              200,
              { name: user.name, email: user.email, token },
              "Login Successful"
            )
          );
      }



    } else {
      return res.status(401).json(new ApiError(401, "Invalid Credentials", ['Invalid Credentials']));
    }
  } catch (err) {
    console.error("Error executing query:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Webserver Error", [], ""));
  }
};



async function verifyPassword(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch; // true if passwords match, false otherwise
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
export { login, loginHandler };
