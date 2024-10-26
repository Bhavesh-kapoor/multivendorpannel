import { Router } from "express";
import { index, create ,logout,rating} from "../controllers/admin/Users/user.controller.js";
const usersRoute = Router();

usersRoute.get("/all", index);
usersRoute.get("/add", create);
usersRoute.get("/logout", logout);
usersRoute.get("/rating",rating)
export default usersRoute;
