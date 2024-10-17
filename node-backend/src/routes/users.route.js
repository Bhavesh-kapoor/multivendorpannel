import { Router } from "express";
import { index, create } from "../controllers/admin/Users/user.controller.js";
const usersRoute = Router();

usersRoute.get("/all", index);
usersRoute.get("/add", create);
export default usersRoute;
