import { Router } from "express";
import { index, create ,logout} from "../controllers/admin/Users/user.controller.js";
const usersRoute = Router();

usersRoute.get("/all", index);
usersRoute.get("/add", create);
usersRoute.get("/logout", logout);
export default usersRoute;
