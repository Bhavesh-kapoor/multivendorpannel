import { Router } from "express";
import { all, deleteRating, publish, publishValidations, store, validateRatings } from "../controllers/admin/Users/Ratings/ratings.controller.js";
import verifyJwtToken from "../middleware/auth.middleware.js";

const ratingRoutes = Router();

ratingRoutes.post('/store', validateRatings, store);
ratingRoutes.get('/all', verifyJwtToken, all);
ratingRoutes.put('/publish',verifyJwtToken, publishValidations, publish);
ratingRoutes.delete('/', deleteRating);


export default ratingRoutes;
