import { Rating } from "../../../models/rating.model.js";
import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";

const index = (req, res) => {
  return res.render("users/list");
};


const create = (req, res) => {

  return res.render("users/add");

}

const logout = (req, res) => {
  const options = {
    httpOnly: true,
    secure: true
  }
  // Clear the 'useraccesstoken' cookie and return a success message
  res.status(200)
    .clearCookie('useraccesstoken', options);
  res.redirect('/auth/login');

}

const rating = async (req, res) => {
  try {
    const userId = req.user._id
      const { productId, rating, comment } = req.body;

      // Validate required fields
      if (!productId || !rating || !userId) {
          return res.status(400).json({ message: "Product ID, rating, and user ID are required." });
      }
      // Create a new rating document
      const newRating = new Rating({ productId, rating, userId, comment });
      await newRating.save();
      return res.status(200).json(new ApiResponse(200,newRating,'Rating created successfully'))

  } catch (error) {
    return res.status(500).json(new ApiError(500,'Failed to create rating',[error.message],''))  
   
  }
}

const   getAllRating = async (req,res) =>{
 
    try {
        // Populate the user and product details if needed
        const ratings = await Rating.find()
            .populate("userId", "firstName lastName email") // Optional fields
            .populate("productId", "name brandName"); // Optional fields
      return res.status(200).json(new ApiResponse(200,ratings,'Ratings retrieved successfully'))

    } catch (error) {
      return res.status(500).json(new ApiError(500,'Failed to retrieve ratings',[]))

    }

}

export { index, create, logout,rating,getAllRating };
