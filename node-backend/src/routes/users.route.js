import { Router } from "express";
import { index, create ,logout,rating, getAllRating} from "../controllers/admin/Users/user.controller.js";
import verifyJwtToken from "../middleware/auth.middleware.js";
const usersRoute = Router();

usersRoute.get("/all", index);
usersRoute.get("/add", create);
usersRoute.get("/logout", logout);
usersRoute.post("/rating",verifyJwtToken, rating)
usersRoute.get("/rating",verifyJwtToken,getAllRating)
export default usersRoute;
