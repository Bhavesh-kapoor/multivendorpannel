import { Router } from "express";
import { index, create ,logout,rating} from "../controllers/admin/Users/user.controller.js";
import verifyJwtToken from "../middleware/auth.middleware.js";
const usersRoute = Router();

usersRoute.get("/all", index);
usersRoute.get("/add", create);
usersRoute.get("/logout", logout);
usersRoute.get("/rating",verifyJwtToken, rating)
export default usersRoute;
