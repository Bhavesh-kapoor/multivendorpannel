import { Router } from "express";
import {
  Index,
  create,
  logout,
  permissions,
  // createAdmin,
  // rating,
  // getAllRating,
} from "../controllers/admin/Users/user.controller.js";

const usersRoute = Router();

usersRoute.get("/add", create);

// usersRoute.post("/create-admin", createAdmin);

usersRoute.get("/all", Index);

usersRoute.get("/logout", logout);

// usersRoute.post("/rating",verifyJwtToken, rating)

// usersRoute.get("/rating",verifyJwtToken,getAllRating);

usersRoute.put("/permission/:_id", permissions);

export default usersRoute;
