import { Router } from "express";
import { index } from "../controllers/admin/Users/user.controller.js";
const usersRoute = Router();

usersRoute.get("/all", index);
export default usersRoute;
